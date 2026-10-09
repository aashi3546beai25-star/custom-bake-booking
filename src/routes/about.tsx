import { createFileRoute } from "@tanstack/react-router";
import kitchen from "@/assets/kitchen.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Me — Sweet Crumb" },
      { name: "description", content: "How a grandmother's vanilla cake recipe became Sweet Crumb bakery." },
      { property: "og:title", content: "About Me — Sweet Crumb" },
      { property: "og:description", content: "The story behind Sweet Crumb, from grandma's kitchen to our own bakery." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pt-16 md:grid-cols-2">
      <img src={kitchen} alt="A vanilla sponge cooling in a cosy family kitchen" loading="lazy" width={1024} height={1280} className="rounded-2xl shadow-sm" />
      <div>
        <p className="eyebrow">About me</p>
        <h1 className="mt-2 text-5xl">It started on a stool in Grandma's kitchen.</h1>
        <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted-foreground">
          <p>I started baking when I was 15, standing on a stool in my grandmother's kitchen, learning her vanilla cake recipe.</p>
          <p>I loved it so much that I spent 8 years working in restaurant kitchens to learn the trade properly.</p>
          <p>In 2021 I finally used my savings to open Sweet Crumb, and I still bake that same vanilla cake today.</p>
          <p className="font-display text-2xl text-foreground">Every cake I make is a little piece of her kitchen. 💕</p>
        </div>
      </div>
    </div>
  );
}
