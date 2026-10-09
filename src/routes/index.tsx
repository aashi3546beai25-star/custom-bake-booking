import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero.jpg";
import cake from "@/assets/cake.jpg";
import bread from "@/assets/bread.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sweet Crumb — Custom Cakes & Fresh Bread" },
      { name: "description", content: "Handmade celebration cakes, cupcakes and fresh-baked bread. Order your custom cake online." },
      { property: "og:title", content: "Sweet Crumb — Custom Cakes & Fresh Bread" },
      { property: "og:description", content: "Handmade celebration cakes, cupcakes and fresh-baked bread." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <section className="relative">
        <img src={hero} alt="A berry-topped cake, croissants and sourdough on the Sweet Crumb counter" width={1264} height={848} className="h-[78vh] min-h-[480px] w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-cocoa/85 via-cocoa/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-5 pb-14 text-cocoa-foreground">
          <p className="eyebrow !text-cocoa-foreground/80">Family bakery · Since 2021</p>
          <h1 className="mt-3 max-w-2xl text-5xl leading-tight sm:text-6xl">Cakes made with a grandmother's love.</h1>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/order" className="btn-primary">Order a custom cake</Link>
            <Link to="/menu" className="btn-outline">See the menu</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-5 pt-20 md:grid-cols-2">
        {[
          { img: cake, title: "Celebration cakes", text: "Birthdays, weddings and everything in between, designed just for you.", to: "/order" as const, cta: "Design yours" },
          { img: bread, title: "Fresh every morning", text: "Sourdough, baguettes, croissants and cinnamon rolls straight from the oven.", to: "/menu" as const, cta: "See prices" },
        ].map((c) => (
          <Link key={c.title} to={c.to} className="group overflow-hidden rounded-2xl bg-card shadow-sm">
            <img src={c.img} alt={c.title} loading="lazy" width={1024} height={1280} className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="p-6">
              <h2 className="text-2xl">{c.title}</h2>
              <p className="mt-2 text-muted-foreground">{c.text}</p>
              <p className="mt-4 font-semibold text-primary">{c.cta} →</p>
            </div>
          </Link>
        ))}
      </section>
    </>
  );
}
