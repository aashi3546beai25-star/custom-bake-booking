import { Link } from "@tanstack/react-router";
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

const links = [
  { to: "/menu", label: "Menu" },
  { to: "/order", label: "Order a cake" },
  { to: "/about", label: "About" },
  { to: "/visit", label: "Visit" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4">
        <Link to="/" className="font-display text-2xl font-semibold text-foreground">
          Sweet Crumb <span aria-hidden>🧁</span>
        </Link>
        <nav className="flex flex-wrap gap-5 text-sm font-semibold">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-muted-foreground transition-colors hover:text-primary"
              activeProps={{ className: "text-primary" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 bg-cocoa text-cocoa-foreground">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:grid-cols-3">
        <div>
          <p className="font-display text-2xl">Sweet Crumb</p>
          <p className="mt-2 text-sm opacity-80">{TAGLINE}</p>
        </div>
        <div className="text-sm opacity-90">
          <p className="font-semibold">Find us</p>
          <p className="mt-2">{ADDRESS}</p>
          <p className="opacity-80">{ADDRESS_HINT}</p>
          <p className="mt-3 font-semibold">Hours</p>
          <p className="mt-2">Tue–Sat 8am–6pm · Sun 9am–2pm</p>
          <p>Closed Mondays</p>
        </div>
        <div className="text-sm opacity-90">
          <p className="font-semibold">Say hello</p>
          <p className="mt-2">
            <a className="hover:underline" href={PHONE_HREF}>{PHONE}</a>
            {" · "}
            <a className="hover:underline" target="_blank" rel="noreferrer" href={WHATSAPP_HREF}>WhatsApp</a>
          </p>
          <p>
            <a className="hover:underline" href={EMAIL_HREF}>{EMAIL}</a>
          </p>
          <p>
            <a className="hover:underline" target="_blank" rel="noreferrer" href={INSTAGRAM_HREF}>{INSTAGRAM}</a>
          </p>
          <p className="mt-3 opacity-80">Custom cakes: 3 days' notice · Wedding &amp; tiered: 7 days</p>
        </div>
      </div>
    </footer>
  );
}
