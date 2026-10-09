import { Link } from "@tanstack/react-router";

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
          <p className="mt-2 text-sm opacity-80">Baked fresh every morning since 2021.</p>
        </div>
        <div className="text-sm opacity-90">
          <p className="font-semibold">Find us</p>
          <p className="mt-2">123 Baker Street, Springfield</p>
        </div>
        <div className="text-sm opacity-90">
          <p className="font-semibold">Hours</p>
          <p className="mt-2">Tue–Sat 7am–6pm · Sun 8am–2pm</p>
          <p>Closed Mondays</p>
        </div>
      </div>
    </footer>
  );
}
