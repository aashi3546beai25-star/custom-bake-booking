import { Link } from "@tanstack/react-router";
import { Phone, Instagram, MessageCircle, Mail } from "lucide-react";
import {
  ADDRESS,
  ADDRESS_HINT,
  EMAIL,
  EMAIL_HREF,
  INSTAGRAM,
  INSTAGRAM_HREF,
  PHONE,
  PHONE_HREF,
  TAGLINE,
  WHATSAPP_HREF,
} from "@/contact";
import { HOLIDAY_ENABLED } from "@/lib/holiday-config";
import { OrdersStorageDrawer } from "./OrdersStorageDrawer";
import { BakeryLogo } from "./BakeryLogo";

const links = [
  { to: "/", label: "Home", exact: true },
  { to: "/menu", label: "Menu" },
  { to: "/order", label: "Order a cake" },
  { to: "/about", label: "About" },
  { to: "/visit", label: "Visit" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-[#e5b967]/20 bg-[#140f0c]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-3.5">
        {/* Brand Unique Logo Emblem */}
        <Link to="/">
          <BakeryLogo size="md" />
        </Link>

        {/* Navigation & Header Actions */}
        <div className="flex flex-wrap items-center gap-4">
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-[#b8a695] transition-colors hover:text-[#e5b967]"
                activeProps={{ className: "text-[#e5b967] font-bold" }}
                activeOptions={{ exact: l.exact ?? false }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Quick Phone Pill */}
          <a
            href={PHONE_HREF}
            className="hidden sm:inline-flex items-center gap-2 rounded-full border border-[#e5b967]/30 bg-[#1e1714] px-4 py-1.5 text-xs font-semibold text-[#e5b967] hover:bg-[#e5b967]/10 transition-colors"
          >
            <Phone className="h-3.5 w-3.5" />
            <span>{PHONE}</span>
          </a>

          {/* Orders Storage & DB Sync Drawer */}
          <OrdersStorageDrawer />

          {/* Christmas Pre-order Pill */}
          {HOLIDAY_ENABLED && (
            <Link
              to="/holiday-order"
              className="rounded-full bg-[#e5b967] px-4 py-1.5 text-xs font-bold text-[#140f0c] shadow-lg shadow-[#e5b967]/20 hover:bg-[#edd093] transition-all"
            >
              Pre-order Christmas
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-28 border-t border-[#e5b967]/20 bg-[#0e0a08] text-[#f3e8d9]">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-12">
        {/* Brand Column */}
        <div className="md:col-span-5 space-y-4">
          <Link to="/">
            <BakeryLogo size="lg" />
          </Link>

          <p className="font-display text-xl italic text-[#e5b967] pt-2">{TAGLINE}</p>

          <div className="flex items-center gap-3 pt-2">
            <a
              href={INSTAGRAM_HREF}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e5b967]/30 bg-[#1c1511] text-[#e5b967] hover:bg-[#e5b967] hover:text-[#140f0c] transition-all"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e5b967]/30 bg-[#1c1511] text-[#e5b967] hover:bg-[#e5b967] hover:text-[#140f0c] transition-all"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
            <a
              href={EMAIL_HREF}
              aria-label="Email"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e5b967]/30 bg-[#1c1511] text-[#e5b967] hover:bg-[#e5b967] hover:text-[#140f0c] transition-all"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Visit & Contact Column */}
        <div className="md:col-span-4 text-sm text-[#b8a695] space-y-3">
          <p className="font-bold text-xs uppercase tracking-widest text-[#e5b967]">VISIT</p>
          <p className="text-[#f3e8d9] font-medium">{ADDRESS}</p>
          <p className="text-xs opacity-75">{ADDRESS_HINT}</p>
          <p className="pt-2 text-[#e5b967] font-semibold">{PHONE}</p>
          <p className="text-xs text-[#e5b967] hover:underline">
            <a href={EMAIL_HREF}>{EMAIL}</a>
          </p>
        </div>

        {/* Opening Hours Column */}
        <div className="md:col-span-3 text-sm text-[#b8a695] space-y-3">
          <p className="font-bold text-xs uppercase tracking-widest text-[#e5b967]">HOURS</p>
          <div className="flex justify-between border-b border-[#e5b967]/15 pb-1">
            <span>Tuesday – Saturday</span>
            <span className="font-semibold text-[#f3e8d9]">8:00 AM – 6:00 PM</span>
          </div>
          <div className="flex justify-between border-b border-[#e5b967]/15 pb-1">
            <span>Sunday</span>
            <span className="font-semibold text-[#f3e8d9]">9:00 AM – 2:00 PM</span>
          </div>
          <div className="flex justify-between">
            <span>Monday</span>
            <span className="font-semibold text-[#e5b967]">Closed</span>
          </div>
          <p className="text-xs pt-3 opacity-75 italic">
            No rest for the wicked online. We'll confirm your order and send deposit details within 24 hours.
          </p>
        </div>
      </div>

      <div className="border-t border-[#e5b967]/15 bg-[#0a0705] py-6 text-center text-xs text-[#b8a695]">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between items-center px-5 gap-3">
          <p>© {new Date().getFullYear()} Sweet Crumb Bakery. All rights reserved.</p>
          <p className="italic text-[#e5b967]/80">Baked fresh, made with love · Custom cake booking</p>
        </div>
      </div>
    </footer>
  );
}
