import { createFileRoute, Link } from "@tanstack/react-router";
import { Info, Sparkles, ArrowRight } from "lucide-react";
import { HOLIDAY_ENABLED } from "@/lib/holiday-config";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "The Menu — Sweet Crumb Bakery" },
      {
        name: "description",
        content: "Rough, honest prices for custom celebration cakes, sourdough bread, cupcakes, and pastries.",
      },
      { property: "og:title", content: "The Menu — Sweet Crumb Bakery" },
      { property: "og:description", content: "Rough, honest prices for custom celebration cakes, sourdough bread, cupcakes, and pastries." },
    ],
  }),
  component: MenuPage,
});

interface MenuItem {
  name: string;
  detail?: string;
  price: string;
}

function MenuSection({ title, subtitle, items }: { title: string; subtitle?: string; items: MenuItem[] }) {
  return (
    <section className="mt-14 space-y-4">
      <div>
        <h2 className="font-display text-3xl font-semibold text-[#f3e8d9]">{title}</h2>
        {subtitle && <p className="mt-1 text-xs text-[#b8a695]">{subtitle}</p>}
      </div>

      <ul className="space-y-4 pt-2">
        {items.map((item) => (
          <li key={item.name} className="flex items-baseline justify-between text-base">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="font-semibold text-[#f3e8d9]">{item.name}</span>
              {item.detail && <span className="text-xs text-[#b8a695]/80 font-normal">{item.detail}</span>}
            </div>
            <div className="dotted-leader" />
            <span className="font-semibold text-[#e5b967] whitespace-nowrap">{item.price}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function MenuPage() {
  const cakes: MenuItem[] = [
    { name: '6" round cake', detail: "serves 6–10", price: "from $45" },
    { name: '8" round cake', detail: "serves 12–16", price: "from $65" },
    { name: '10" round cake', detail: "serves 20–25", price: "from $90" },
    { name: "Wedding & Tiered cakes", detail: "designed with you", price: "from $140" },
  ];

  const cupcakesAndCookies: MenuItem[] = [
    { name: "Cupcakes", detail: "box of 6", price: "$20" },
    { name: "Cupcakes", detail: "box of 12", price: "$38" },
    { name: "Decorated cookies", detail: "each", price: "from $5" },
    { name: "Brownies", detail: "box of 9", price: "$18" },
  ];

  const breads: MenuItem[] = [
    { name: "Sourdough loaf", detail: "white or seeded", price: "$8" },
    { name: "Seeded rye", detail: "dense & dark", price: "$8.50" },
    { name: "Brioche loaf", detail: "rich & buttery", price: "$9" },
    { name: "Baguette", detail: "crispy crust", price: "$5" },
  ];

  const pastries: MenuItem[] = [
    { name: "Butter croissant", detail: "flaky layers", price: "$4" },
    { name: "Pain au chocolat", detail: "dark chocolate", price: "$4.50" },
    { name: "Cinnamon roll", detail: "cream cheese glaze", price: "$5" },
    { name: "Seasonal fruit tart", detail: "vanilla custard", price: "$6" },
  ];

  return (
    <div className="mx-auto max-w-4xl px-5 pt-16 pb-24">
      {/* Header Eyebrow & Title */}
      <p className="eyebrow">WHAT WE BAKE</p>
      <h1 className="mt-2 font-display text-5xl font-semibold text-[#f3e8d9] sm:text-6xl">
        The <span className="italic text-[#e5b967] font-serif">menu.</span>
      </h1>
      <p className="mt-4 text-base text-[#b8a695]">
        Rough, honest prices — so you know what to expect before you ask.
      </p>

      {/* Info Notice Box */}
      <div className="mt-8 flex items-start gap-3.5 rounded-2xl border border-[#e5b967]/30 bg-[#1c1511] p-5 text-xs text-[#b8a695] shadow-lg">
        <Info className="h-5 w-5 text-[#e5b967] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Cake prices depend on size and design, so they vary — every quote is personal. Tell me your idea and I'll reply within a day.
        </p>
      </div>

      {/* Christmas Specials Banner */}
      {HOLIDAY_ENABLED && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#e5b967]/40 bg-[#251c16] p-6 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e5b967]/20 text-[#e5b967]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-[#f3e8d9]">Christmas Specials are here</h3>
              <p className="text-xs text-[#b8a695]">
                Yule log cakes, gingerbread boxes and holiday cupcakes — pre-order by December 22.
              </p>
            </div>
          </div>

          <Link
            to="/holiday-order"
            className="inline-flex items-center gap-2 rounded-full bg-[#e5b967] px-5 py-2.5 text-xs font-bold text-[#140f0c] shadow-lg hover:bg-[#edd093] transition-all"
          >
            <span>Pre-order</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* Menu Categories */}
      <MenuSection
        title="Cakes"
        subtitle="Cakes depend on size and design, so the price varies — tell me your idea and I'll quote within a day."
        items={cakes}
      />

      <MenuSection
        title="Cupcakes & cookies"
        items={cupcakesAndCookies}
      />

      <MenuSection
        title="Breads"
        subtitle="Baked fresh every morning — come early for the sourdough."
        items={breads}
      />

      <MenuSection
        title="Pastries"
        subtitle="Fresh every morning; the fruit tarts follow the seasons."
        items={pastries}
      />

      {/* Bottom Custom Order CTA Card */}
      <div className="mt-16 flex flex-wrap items-center justify-between gap-6 rounded-3xl border border-[#e5b967]/35 bg-[#1c1511] p-8 shadow-2xl">
        <div>
          <h3 className="font-display text-2xl font-semibold text-[#f3e8d9]">Something one-of-a-kind?</h3>
          <p className="mt-2 text-sm text-[#b8a695]">
            Pick a size, a flavour and a date — I'll take care of the rest.
          </p>
        </div>

        <Link
          to="/order"
          className="inline-flex items-center gap-2 rounded-full bg-[#e5b967] px-7 py-3 text-sm font-bold text-[#140f0c] shadow-xl hover:bg-[#edd093] transition-all"
        >
          <span>Order a custom cake</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
