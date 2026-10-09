import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { z } from "zod";
import { Check } from "lucide-react";
import { bakeryApi } from "@/lib/api";
import {
  saveHolidayDraft,
  getHolidayDraft,
  clearHolidayDraft,
  getStoredProfile,
} from "@/lib/storage";
import {
  HOLIDAY_ENABLED,
  ORDER_START,
  ORDER_END,
  PICKUP_START,
  PICKUP_END,
  MIN_NOTICE_DAYS,
  manuallyFullDates,
  DELIVERY_FEE,
  DELIVERY_RADIUS,
  FORMSPREE_ID,
  ORDER_EMAIL,
  ALLERGEN_NOTICE,
  holidayItems,
} from "@/lib/holiday-config";

import yuleLogImg from "@/assets/holiday-yule-log.jpg";
import gingerbreadImg from "@/assets/holiday-gingerbread.jpg";
import cupcakesImg from "@/assets/holiday-cupcakes.jpg";

const itemImages: Record<string, string> = {
  "yule-log": yuleLogImg,
  "gingerbread-box": gingerbreadImg,
  "holiday-cupcakes": cupcakesImg,
};

export const Route = createFileRoute("/holiday-order")({
  head: () => ({
    meta: [
      { title: "Christmas Pre-orders — Sweet Crumb" },
      { name: "description", content: "Pre-order your holiday treats for pickup or delivery." },
      { property: "og:title", content: "Christmas Pre-orders — Sweet Crumb" },
      { property: "og:description", content: "Pre-order your holiday treats." },
    ],
  }),
  component: HolidayOrder,
});

const validItemValues = holidayItems.flatMap((item) =>
  item.options.map((opt) => opt.value)
);

const schema = z.object({
  customer_name: z.string().trim().min(1, "Your name please").max(100),
  phone: z.string().trim().min(1, "Your phone number please").max(30),
  email: z.string().trim().email("Enter a valid email"),
  item: z.enum([validItemValues[0], ...validItemValues.slice(1)] as [string, ...string[]], {
    errorMap: () => ({ message: "Please select a valid item" }),
  }),
  quantity: z.coerce.number().min(1).max(10),
  fulfillment: z.enum(["pickup", "delivery"]),
  date: z.string().min(1, "Pick a date"),
  notes: z.string().max(500).optional(),
});

function getMinDate() {
  const today = new Date();
  today.setDate(today.getDate() + MIN_NOTICE_DAYS);
  const minNoticeIso = today.toISOString().slice(0, 10);
  return minNoticeIso > PICKUP_START ? minNoticeIso : PICKUP_START;
}

function getMaxDate() {
  const min = getMinDate();
  if (PICKUP_END < min) {
    const fallback = new Date();
    fallback.setDate(fallback.getDate() + 60);
    return fallback.toISOString().slice(0, 10);
  }
  return PICKUP_END;
}

function HolidayOrder() {
  if (!HOLIDAY_ENABLED) {
    return (
      <div className="mx-auto max-w-xl px-5 pt-24 text-center">
        <h1 className="text-4xl">Holiday ordering is closed.</h1>
        <p className="mt-4 text-muted-foreground">Check back next year!</p>
        <div className="mt-8">
          <Link to="/" className="btn-primary inline-block">Return home</Link>
        </div>
      </div>
    );
  }

  const minDate = getMinDate();
  const maxDate = getMaxDate();
  const [draftRestored, setDraftRestored] = useState(false);
  const [form, setForm] = useState({
    customer_name: "",
    phone: "",
    email: "",
    item: validItemValues[0] || "",
    quantity: 1,
    fulfillment: "pickup" as "pickup" | "delivery",
    date: "",
    notes: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // 📦 Restore holiday draft or saved profile from localStorage
    const savedDraft = getHolidayDraft();
    const savedProfile = getStoredProfile();

    if (savedDraft) {
      setForm((prev) => ({
        ...prev,
        ...savedDraft,
        fulfillment: savedDraft.fulfillment || "pickup",
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
    let val: string | number = e.target.value;
    if (k === "quantity") val = parseInt(val, 10) || 1;
    setForm((f) => {
      const updated = { ...f, [k]: val };
      // Auto-save holiday draft
      saveHolidayDraft(updated);
      return updated;
    });
  };

  const dateFull = form.date !== "" && manuallyFullDates.includes(form.date);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      return setError(parsed.error.issues[0]?.message ?? "Please check the form");
    }

    if (parsed.data.date < minDate || parsed.data.date > maxDate) {
      return setError(`Please choose a date between ${minDate} and ${maxDate}.`);
    }

    if (dateFull) {
      return setError("Sorry, that date is fully booked. Please pick another date.");
    }

    setSending(true);

    const res = await bakeryApi.createHolidayOrder(
      parsed.data,
      FORMSPREE_ID,
      ORDER_EMAIL
    );

    setSending(false);

    if (res.error) {
      return setError(res.error);
    }

    setDone(true);
  }

  if (done) {
    const cleanPhone = form.phone ? form.phone.replace(/[^0-9]/g, "") : "";
    const confirmationText = `🎄 *Sweet Crumb Bakery — Holiday Pre-Order Confirmation*\n\nHi ${form.customer_name},\nThank you for your holiday pre-order!\n\n📋 *Order Summary:*\n• Item: ${form.quantity}x ${form.item}\n• Fulfillment: ${form.fulfillment.toUpperCase()}\n• Date: ${form.date}\n• Notes: ${form.notes || "None"}\n• Customer: ${form.customer_name} (${form.phone || form.email})\n\n📍 Bakery Pickup: 24 Maple Street, Brookfield\nWe will confirm deposit details within 24 hours.`;

    const whatsappUrl = `https://api.whatsapp.com/send?${cleanPhone ? `phone=${cleanPhone}&` : ""}text=${encodeURIComponent(confirmationText)}`;
    const emailSubject = `Holiday Pre-Order Confirmation: ${form.customer_name}`;
    const emailBody = `Hi ${form.customer_name},\n\nThank you for placing your holiday pre-order with Sweet Crumb Bakery!\n\nOrder Details:\n• Item: ${form.quantity}x ${form.item}\n• Fulfillment: ${form.fulfillment}\n• Date: ${form.date}\n• Notes: ${form.notes || "None"}\n• Contact: ${form.phone} | ${form.email}\n\nWe will confirm your order and send deposit details shortly!\n\nSweet Crumb Bakery\n24 Maple Street, Brookfield`;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(form.email)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    return (
      <div className="mx-auto max-w-xl px-5 pt-20 pb-24 text-center">
        <p className="text-5xl">🎄</p>
        <h1 className="mt-4 text-4xl font-semibold text-[#f3e8d9]">Holiday Order Confirmed!</h1>
        <p className="mt-2 text-sm text-[#b8a695]">
          Thank you, <strong className="text-[#f3e8d9]">{form.customer_name}</strong>. Your holiday treats are booked for <strong className="text-[#e5b967]">{form.date}</strong>.
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
                <span>Mobile receipt ready for: <strong>{form.phone}</strong></span>
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
          <Link to="/" className="btn-primary">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 pt-16">
      {/* Local Storage Draft Restored Notice */}
      {draftRestored && (
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-primary/30 bg-primary/10 p-4 text-xs">
          <span className="flex items-center gap-2 font-medium text-foreground">
            <Check className="h-4 w-4 text-primary" />
            Restored your saved holiday pre-order draft from Local Storage!
          </span>
          <button
            onClick={() => {
              clearHolidayDraft();
              setDraftRestored(false);
            }}
            className="text-muted-foreground hover:text-foreground underline"
          >
            Clear Draft
          </button>
        </div>
      )}

      <p className="eyebrow">Christmas pre-orders</p>
      <h1 className="mt-2 text-5xl">Pre-order your holiday treats</h1>
      <p className="mt-4 text-muted-foreground">
        Pickup or delivery available between {PICKUP_START} and {PICKUP_END}. Order at least {MIN_NOTICE_DAYS} days ahead.
      </p>

      <form onSubmit={submit} className="mt-10 space-y-8 rounded-2xl bg-card p-8 shadow-sm">
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block">
            <span className="font-semibold">Name</span>
            <input className="field mt-2" maxLength={100} value={form.customer_name} onChange={set("customer_name")} required />
          </label>
          <label className="block">
            <span className="font-semibold">Phone / WhatsApp</span>
            <input className="field mt-2" maxLength={30} value={form.phone} onChange={set("phone")} required />
          </label>
        </div>
        
        <label className="block">
          <span className="font-semibold">Email</span>
          <input type="email" className="field mt-2" value={form.email} onChange={set("email")} required />
        </label>

        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block">
            <span className="font-semibold">Item</span>
            <select className="field mt-2" value={form.item} onChange={set("item")}>
              {holidayItems.map((item) =>
                item.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {item.name} — {opt.label} (${opt.price})
                  </option>
                ))
              )}
            </select>
          </label>
          <label className="block">
            <span className="font-semibold">Quantity</span>
            <input type="number" min="1" max="10" className="field mt-2" value={form.quantity} onChange={set("quantity")} required />
          </label>
        </div>

        <div className="rounded-lg bg-secondary p-4 text-sm">
          <strong>Allergen Notice:</strong> {ALLERGEN_NOTICE}
        </div>

        <fieldset>
          <legend className="font-semibold">Pickup or Delivery</legend>
          <div className="mt-3 flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="fulfillment" value="pickup" checked={form.fulfillment === "pickup"} onChange={set("fulfillment")} />
              <span>Pickup</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="fulfillment" value="delivery" checked={form.fulfillment === "delivery"} onChange={set("fulfillment")} />
              <span>Delivery</span>
            </label>
          </div>
          {form.fulfillment === "delivery" && (
            <p className="mt-2 text-sm text-muted-foreground">
              Delivery fee: ${DELIVERY_FEE} within {DELIVERY_RADIUS}
            </p>
          )}
        </fieldset>

        <label className="block">
          <span className="font-semibold">Pickup/delivery date</span>
          <input
            type="date"
            className="field mt-2 cursor-pointer"
            min={minDate}
            max={maxDate}
            value={form.date}
            onChange={set("date")}
            onClick={(e) => {
              try {
                e.currentTarget.showPicker?.();
              } catch {}
            }}
            required
          />
          {dateFull && <span className="mt-2 block text-sm text-destructive">That date is fully booked. Please choose another.</span>}
        </label>

        <label className="block">
          <span className="font-semibold">Notes / allergies</span>
          <textarea className="field mt-2 min-h-24" maxLength={500} placeholder="Allergies, special requests, delivery address if applicable..." value={form.notes} onChange={set("notes")} />
        </label>

        {error && <p className="rounded-lg bg-secondary p-3 text-destructive">{error}</p>}
        <button type="submit" className="btn-primary w-full" disabled={sending || dateFull}>
          {sending ? "Processing..." : "Place Pre-order"}
        </button>
      </form>
    </div>
  );
}
