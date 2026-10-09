import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { cakeSizes, flavors } from "@/lib/menu";

export const Route = createFileRoute("/order")({
  head: () => ({
    meta: [
      { title: "Order a Custom Cake — Sweet Crumb" },
      { name: "description", content: "Choose your size, flavor and date, and tell us your dream design." },
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
  const [form, setForm] = useState({ size: "8 inch", flavor: "Vanilla", pickup_date: "", design: "", customer_name: "", email: "", phone: "" });
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const loadFull = () =>
    supabase.rpc("get_full_dates").then(({ data }) => setFullDates((data as string[] | null) ?? []));
  useEffect(() => { loadFull(); }, []);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const dateFull = form.pickup_date !== "" && fullDates.includes(form.pickup_date);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = schema.safeParse({ ...form, phone: form.phone || undefined });
    if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? "Please check the form");
    if (parsed.data.pickup_date < minDate) return setError("Please choose a date at least 2 days away.");
    if (dateFull) return setError("Sorry, that day is fully booked. Please pick another date.");
    setSending(true);
    const { error: err } = await supabase.from("cake_orders").insert({ ...parsed.data, phone: parsed.data.phone ?? null });
    setSending(false);
    if (err) {
      if (err.message.includes("DATE_FULL")) {
        loadFull();
        return setError("Sorry, that day just filled up. Please pick another date.");
      }
      return setError("Something went wrong. Please try again.");
    }
    setDone(true);
  }

  if (done)
    return (
      <div className="mx-auto max-w-xl px-5 pt-24 text-center">
        <p className="text-5xl">🎂</p>
        <h1 className="mt-4 text-4xl">Thank you, {form.customer_name}!</h1>
        <p className="mt-4 text-muted-foreground">Your cake request for {form.pickup_date} is in. I'll get in touch to confirm the design and final price.</p>
      </div>
    );

  return (
    <div className="mx-auto max-w-3xl px-5 pt-16">
      <p className="eyebrow">Custom cakes</p>
      <h1 className="mt-2 text-5xl">Order your cake</h1>
      <p className="mt-4 text-muted-foreground">I make a few big cakes each day, so dates fill up. Order at least 2 days ahead.</p>

      <form onSubmit={submit} className="mt-10 space-y-8 rounded-2xl bg-card p-8 shadow-sm">
        <fieldset>
          <legend className="font-display text-xl">Size</legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-4">
            {cakeSizes.map((s) => (
              <label key={s.size} className={`cursor-pointer rounded-xl border-2 p-4 transition-colors ${form.size === s.size ? "border-primary bg-secondary" : "border-border"}`}>
                <input type="radio" name="size" value={s.size} checked={form.size === s.size} onChange={set("size")} className="sr-only" />
                <span className="block font-semibold">{s.size}</span>
                <span className="block text-sm text-muted-foreground">{s.serves}</span>
                <span className="block text-sm">from ${s.price}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block">
            <span className="font-display text-xl">Flavor</span>
            <select className="field mt-3" value={form.flavor} onChange={set("flavor")}>
              {flavors.map((f) => <option key={f}>{f}{f === "Carrot" ? " (+$5)" : ""}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="font-display text-xl">Pickup date</span>
            <input type="date" className="field mt-3" min={minDate} value={form.pickup_date} onChange={set("pickup_date")} />
            {dateFull && <span className="mt-2 block text-sm text-destructive">That day is fully booked. Please choose another.</span>}
          </label>
        </div>

        <label className="block">
          <span className="font-display text-xl">Your design</span>
          <textarea className="field mt-3 min-h-32" maxLength={1000} placeholder="Colors, theme, writing on the cake, toppers, inspiration..." value={form.design} onChange={set("design")} />
        </label>

        <div className="grid gap-6 sm:grid-cols-3">
          <label className="block"><span className="font-semibold">Name</span><input className="field mt-2" maxLength={100} value={form.customer_name} onChange={set("customer_name")} /></label>
          <label className="block"><span className="font-semibold">Email</span><input type="email" className="field mt-2" maxLength={255} value={form.email} onChange={set("email")} /></label>
          <label className="block"><span className="font-semibold">Phone (optional)</span><input className="field mt-2" maxLength={30} value={form.phone} onChange={set("phone")} /></label>
        </div>

        {error && <p className="rounded-lg bg-secondary p-3 text-destructive">{error}</p>}
        <button type="submit" className="btn-primary w-full" disabled={sending || dateFull}>
          {sending ? "Sending..." : "Request my cake"}
        </button>
      </form>
    </div>
  );
}
