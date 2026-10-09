import { createFileRoute, Link } from "@tanstack/react-router";
import { breads, cakeSizes, cupcakes, extras, flavors } from "@/lib/menu";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu & Prices — Sweet Crumb" },
      { name: "description", content: "Custom cake sizes from $35, cupcakes, sourdough, croissants and more." },
      { property: "og:title", content: "Menu & Prices — Sweet Crumb" },
      { property: "og:description", content: "Custom cakes, cupcakes and fresh bread with prices." },
    ],
  }),
  component: Menu,
});

function PriceList({ items }: { items: readonly { name: string; price: string }[] }) {
  return (
    <ul className="divide-y">
      {items.map((i) => (
        <li key={i.name} className="flex justify-between gap-4 py-3">
          <span>{i.name}</span>
          <span className="font-semibold">{i.price}</span>
        </li>
      ))}
    </ul>
  );
}

function Menu() {
  return (
    <div className="mx-auto max-w-5xl px-5 pt-16">
      <p className="eyebrow">What we bake</p>
      <h1 className="mt-2 text-5xl">Menu & prices</h1>
      <p className="mt-4 max-w-xl text-muted-foreground">
        Cake prices are starting points. The final price depends on size and design, and we'll confirm it with you.
      </p>

      <section className="mt-12 rounded-2xl bg-card p-8 shadow-sm">
        <h2 className="text-3xl">🎂 Custom cakes</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          {cakeSizes.map((s) => (
            <div key={s.size} className="rounded-xl bg-secondary p-5 text-secondary-foreground">
              <p className="font-display text-xl">{s.size}</p>
              <p className="text-sm opacity-80">Serves {s.serves}</p>
              <p className="mt-3 text-2xl font-bold">from ${s.price}</p>
            </div>
          ))}
        </div>
        <p className="mt-6"><span className="font-semibold">Flavors:</span> {flavors.join(", ")}</p>
        <h3 className="mt-6 text-xl">Extras</h3>
        <PriceList items={extras} />
        <Link to="/order" className="btn-primary mt-6">Order a cake</Link>
      </section>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <section className="rounded-2xl bg-card p-8 shadow-sm">
          <h2 className="text-3xl">🧁 Cupcakes</h2>
          <PriceList items={cupcakes} />
        </section>
        <section className="rounded-2xl bg-card p-8 shadow-sm">
          <h2 className="text-3xl">🍞 Fresh bread</h2>
          <PriceList items={breads} />
        </section>
      </div>
    </div>
  );
}
