import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { z } from "zod";
import { cakeSizes, flavors } from "@/lib/menu";
import { AiPriceChatbot } from "@/components/AiPriceChatbot";
import { Upload, X, Image as ImageIcon, MessageSquare, Sparkles, Check, Database } from "lucide-react";
import { bakeryApi } from "@/lib/api";
import { saveCakeDraft, getCakeDraft, clearCakeDraft, getStoredProfile } from "@/lib/storage";

export const Route = createFileRoute("/order")({
  head: () => ({
    meta: [
      { title: "Order a Custom Cake — Sweet Crumb" },
      { name: "description", content: "Choose your size, flavor and date, upload inspiration photos, add custom writing, and book your cake." },
      { property: "og:title", content: "Order a Custom Cake — Sweet Crumb" },
      { property: "og:description", content: "Book your custom cake online. Limited cakes per day." },
    ],
  }),
  component: Order,
});

const schema = z.object({
  size: z.enum(["6 inch", "8 inch", "10 inch", "2-tier"]),
  flavor: z.enum(flavors),
  pickup_date: z.string().min(1, "Pick a date"),
  design: z.string().trim().min(5, "Tell us a little about the design").max(1000),
  writing_on_cake: z.string().trim().max(200).optional(),
  customer_name: z.string().trim().min(1, "Your name please").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().max(30).optional(),
});

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function Order() {
  const minDate = isoDate(new Date(Date.now() + 2 * 86400000));
  const [fullDates, setFullDates] = useState<string[]>([]);
  const [draftRestored, setDraftRestored] = useState(false);
  const [form, setForm] = useState({
    size: "8 inch" as "6 inch" | "8 inch" | "10 inch" | "2-tier",
    flavor: "Vanilla",
    pickup_date: "",
    design: "",
    writing_on_cake: "",
    customer_name: "",
    email: "",
    phone: "",
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFull = () =>
    bakeryApi.getFullDates().then(({ data }) => setFullDates(data || []));

  useEffect(() => {
    loadFull();

    // 📦 Restore draft or saved profile from localStorage
    const savedDraft = getCakeDraft();
    const savedProfile = getStoredProfile();

    if (savedDraft) {
      setForm((prev) => ({
        ...prev,
        ...savedDraft,
        size: (savedDraft.size as any) || prev.size,
      }));
      setDraftRestored(true);
    } else if (savedProfile) {
      setForm((prev) => ({
        ...prev,
        customer_name: savedProfile.name || prev.customer_name,
        email: savedProfile.email || prev.email,
        phone: savedProfile.phone || prev.phone,
      }));
    }
  }, []);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const nextVal = e.target.value;
    setForm((f) => {
      const updated = { ...f, [k]: nextVal };
      // Auto-save draft to localStorage as customer types
      saveCakeDraft(updated);
      return updated;
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoPreview(null);
    setPhotoName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const dateFull = form.pickup_date !== "" && fullDates.includes(form.pickup_date);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const fullDesignText = photoName
      ? `${form.design}\n[Attached Photo: ${photoName}]`
      : form.design;

    const parsed = schema.safeParse({ ...form, design: fullDesignText, phone: form.phone || undefined });
    if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? "Please check the form");
    if (parsed.data.pickup_date < minDate) return setError("Please choose a date at least 2 days away.");
    if (dateFull) return setError("Sorry, that day is fully booked. Please pick another date.");

    setSending(true);
    // 🌐 Submit order through API layer to Supabase Database + LocalStorage
    const res = await bakeryApi.createCakeOrder({
      size: parsed.data.size,
      flavor: parsed.data.flavor,
      pickup_date: parsed.data.pickup_date,
      design: parsed.data.design,
      writing_on_cake: form.writing_on_cake || undefined,
      customer_name: parsed.data.customer_name,
      email: parsed.data.email,
      phone: parsed.data.phone,
    });
    setSending(false);

    if (res.error) {
      if (res.error.includes("booked") || res.error.includes("DATE_FULL")) {
        loadFull();
        return setError("Sorry, that day just filled up. Please pick another date.");
      }
      return setError(res.error);
    }
    setDone(true);
  }

  if (done) {
    const cleanPhone = form.phone ? form.phone.replace(/[^0-9]/g, "") : "";
    const confirmationText = `🎉 *Sweet Crumb Bakery — Order Confirmation*\n\nHi ${form.customer_name},\nThank you for ordering with Sweet Crumb Bakery!\n\n📋 *Order Summary:*\n• Item: ${form.size} ${form.flavor} Cake\n• Pickup Date: ${form.pickup_date}\n• Design Details: ${form.design}\n${form.writing_on_cake ? `• Writing on cake: "${form.writing_on_cake}"\n` : ""}• Customer: ${form.customer_name} (${form.phone || form.email})\n\n📍 Pickup at: 24 Maple Street, Brookfield\nWe will review your details and confirm deposit within 24h.`;

    const whatsappUrl = `https://api.whatsapp.com/send?${cleanPhone ? `phone=${cleanPhone}&` : ""}text=${encodeURIComponent(confirmationText)}`;
    const smsUrl = `sms:${cleanPhone}?body=${encodeURIComponent(confirmationText)}`;
    const emailSubject = `Order Confirmation: ${form.size} ${form.flavor} Cake for ${form.pickup_date}`;
    const emailBody = `Hi ${form.customer_name},\n\nThank you for ordering with Sweet Crumb Bakery!\n\nOrder Details:\n• Cake: ${form.size} ${form.flavor}\n• Pickup Date: ${form.pickup_date}\n• Design: ${form.design}\n${form.writing_on_cake ? `• Writing: ${form.writing_on_cake}\n` : ""}• Contact: ${form.phone || "N/A"} | ${form.email}\n\nWe will confirm your order and send deposit details shortly!\n\nSweet Crumb Bakery\n24 Maple Street, Brookfield`;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(form.email)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    return (
      <div className="mx-auto max-w-xl px-5 pt-20 pb-24 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e5b967]/20 border border-[#e5b967]/40 text-[#e5b967] shadow-xl">
          <Check className="h-8 w-8" />
        </div>
        
        <h1 className="mt-4 text-4xl font-semibold text-[#f3e8d9]">Order Confirmed!</h1>
        <p className="mt-2 text-sm text-[#b8a695]">
          Thank you, <strong className="text-[#f3e8d9]">{form.customer_name}</strong>. Your custom cake request for <strong className="text-[#e5b967]">{form.pickup_date}</strong> is placed.
        </p>

        {/* 📧 Automated Notification Dispatch Cards */}
        <div className="mt-8 rounded-2xl border border-[#e5b967]/30 bg-[#1c1511] p-6 text-left shadow-xl space-y-4">
          <span className="block text-xs font-bold uppercase tracking-wider text-[#e5b967]">
            Automated Messages Dispatched
          </span>

          <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3.5 text-xs text-emerald-300">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Confirmation sent to: <strong>{form.email}</strong></span>
            </div>
            <a
              href={gmailUrl}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-emerald-200 underline hover:text-white"
            >
              Open Email
            </a>
          </div>

          {form.phone && (
            <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3.5 text-xs text-emerald-300">
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Mobile message ready for: <strong>{form.phone}</strong></span>
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-emerald-200 underline hover:text-white"
              >
                Send WhatsApp
              </a>
            </div>
          )}

          {/* Quick Actions */}
          <div className="pt-2 flex flex-wrap gap-2.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3 px-4 text-xs font-bold text-white transition-all shadow-md"
            >
              <span>📲 Send Receipt via WhatsApp / SMS</span>
            </a>
            <a
              href={gmailUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 py-3 px-4 text-xs font-bold text-white transition-all shadow-md"
            >
              <span>✉️ Send via Gmail</span>
            </a>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <a href="/" className="btn-primary">
            Return to Homepage
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 pt-16 pb-24">
      {/* Local Storage Draft Restored Notice */}
      {draftRestored && (
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-primary/30 bg-primary/10 p-4 text-xs">
          <span className="flex items-center gap-2 font-medium text-foreground">
            <Check className="h-4 w-4 text-primary" />
            Restored your saved order draft from Local Storage!
          </span>
          <button
            onClick={() => {
              clearCakeDraft();
              setDraftRestored(false);
            }}
            className="text-muted-foreground hover:text-foreground underline"
          >
            Clear Draft
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Custom cakes</p>
          <h1 className="mt-2 text-5xl font-semibold">Order your cake</h1>
          <p className="mt-3 text-muted-foreground">
            Tell us your dream design, upload an inspiration photo, and add custom writing!
          </p>
        </div>

        {/* AI Helper Banner Button */}
        <div className="rounded-2xl bg-primary/10 border border-primary/20 p-4 flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-primary animate-spin-slow" />
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-primary">Need a Price Estimate?</span>
            <span className="text-xs text-muted-foreground">Use our AI Price Assistant below!</span>
          </div>
        </div>
      </div>

      <form onSubmit={submit} className="mt-10 space-y-8 rounded-3xl bg-card p-8 shadow-xl border border-border">
        <fieldset>
          <legend className="font-display text-xl font-semibold">1. Choose Size</legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-4">
            {cakeSizes.map((s) => (
              <label key={s.size} className={`cursor-pointer rounded-2xl border-2 p-4 transition-all ${form.size === s.size ? "border-primary bg-secondary/80 shadow-md" : "border-border hover:border-primary/50"}`}>
                <input type="radio" name="size" value={s.size} checked={form.size === s.size} onChange={set("size")} className="sr-only" />
                <span className="block font-semibold">{s.size}</span>
                <span className="block text-sm text-muted-foreground">{s.serves}</span>
                <span className="block text-sm font-bold text-primary">from ${s.price}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block">
            <span className="font-display text-xl font-semibold">Flavor</span>
            <select className="field mt-3" value={form.flavor} onChange={set("flavor")}>
              {flavors.map((f) => <option key={f}>{f}{f === "Carrot" ? " (+$5)" : ""}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="font-display text-xl font-semibold">Pickup date</span>
            <input
              type="date"
              className="field mt-3 cursor-pointer"
              min={minDate}
              value={form.pickup_date}
              onChange={set("pickup_date")}
              onClick={(e) => {
                try {
                  e.currentTarget.showPicker?.();
                } catch {}
              }}
              required
            />
            {dateFull && <span className="mt-2 block text-sm text-destructive">That day is fully booked. Please choose another.</span>}
          </label>
        </div>

        {/* Photo Upload Area */}
        <div>
          <span className="font-display text-xl font-semibold flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" />
            2. Upload Inspiration Photo (Optional)
          </span>
          <p className="mt-1 text-xs text-muted-foreground">Upload a photo of a cake you love or a sketch you made.</p>
          
          <div className="mt-3">
            {!photoPreview ? (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-border hover:border-primary rounded-2xl p-6 cursor-pointer bg-muted/30 hover:bg-muted/60 transition-all text-center">
                <Upload className="h-8 w-8 text-primary/70 mb-2" />
                <span className="text-sm font-semibold text-foreground">Click or Drag &amp; Drop to Upload Photo</span>
                <span className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP up to 10MB</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="sr-only"
                />
              </label>
            ) : (
              <div className="relative inline-block overflow-hidden rounded-2xl border border-border shadow-md bg-card p-2">
                <img src={photoPreview} alt="Uploaded preview" className="h-44 w-auto rounded-xl object-cover" />
                <div className="mt-2 flex items-center justify-between px-2">
                  <span className="text-xs text-muted-foreground truncate max-w-[200px]">{photoName}</span>
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="flex items-center gap-1 text-xs text-destructive hover:underline font-semibold"
                  >
                    <X className="h-4 w-4" /> Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Writing on Cake Field */}
        <label className="block">
          <span className="font-display text-xl font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            3. Writing / Message on Cake (Optional)
          </span>
          <input
            type="text"
            className="field mt-3"
            maxLength={200}
            placeholder="e.g. 'Happy 30th Birthday Sarah!' or 'Congratulations Alex & Sam!'"
            value={form.writing_on_cake}
            onChange={set("writing_on_cake")}
          />
        </label>

        {/* Detailed Design Description */}
        <label className="block">
          <span className="font-display text-xl font-semibold">4. Describe Your Cake Design</span>
          <textarea
            className="field mt-3 min-h-32"
            maxLength={1000}
            placeholder="Tell us about the colors, theme, frosting style (smooth, textured, buttercream, fondant), toppers, dietary requests, or any specific details..."
            value={form.design}
            onChange={set("design")}
            required
          />
        </label>

        {/* Customer Contact Information */}
        <div className="grid gap-6 sm:grid-cols-3 border-t pt-6">
          <label className="block"><span className="font-semibold">Your Name</span><input className="field mt-2" maxLength={100} value={form.customer_name} onChange={set("customer_name")} required /></label>
          <label className="block"><span className="font-semibold">Email</span><input type="email" className="field mt-2" maxLength={255} value={form.email} onChange={set("email")} required /></label>
          <label className="block"><span className="font-semibold">Phone / WhatsApp</span><input className="field mt-2" maxLength={30} value={form.phone} onChange={set("phone")} required /></label>
        </div>

        {error && <p className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-destructive text-sm font-semibold">{error}</p>}
        
        <button type="submit" className="btn-primary w-full text-base py-3.5 shadow-xl" disabled={sending || dateFull}>
          {sending ? "Submitting Order..." : "Request My Custom Cake"}
        </button>
      </form>

      {/* Floating AI Price Estimator Chatbot Widget */}
      <AiPriceChatbot
        onApplyEstimate={(suggestedSize, suggestedFlavor, notes) => {
          setForm((f) => ({
            ...f,
            size: suggestedSize as typeof f.size,
            flavor: suggestedFlavor as typeof f.flavor,
            design: f.design ? `${f.design}\n[AI Query: ${notes}]` : notes,
          }));
        }}
      />
    </div>
  );
}

