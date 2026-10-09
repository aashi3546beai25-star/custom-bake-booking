import { createFileRoute, Link } from "@tanstack/react-router";
import kitchen from "@/assets/kitchen.jpg";
import {
  ADDRESS,
  ADDRESS_HINT,
  EMAIL,
  EMAIL_HREF,
  HOURS,
  INSTAGRAM,
  INSTAGRAM_HREF,
  NOTICE,
  PHONE,
  PHONE_HREF,
  TAGLINE,
  WHATSAPP_HREF,
} from "@/contact";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Me — Sweet Crumb" },
      {
        name: "description",
        content:
          "How a grandmother's vanilla cake recipe became Sweet Crumb bakery — plus our address, hours and how to reach us.",
      },
      { property: "og:title", content: "About Me — Sweet Crumb" },
      {
        property: "og:description",
        content: "The story behind Sweet Crumb, from grandma's kitchen to our own bakery.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pt-16 md:grid-cols-2">
        <img
          src={kitchen}
          alt="A vanilla sponge cooling in a cosy family kitchen"
          loading="lazy"
          width={1024}
          height={1280}
          className="rounded-2xl shadow-sm"
        />
        <div>
          <p className="eyebrow">About me</p>
          <h1 className="mt-2 text-5xl">It started on a stool in Grandma's kitchen.</h1>
          <p className="mt-4 font-display text-2xl italic text-primary">{TAGLINE}</p>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted-foreground">
            <p>
              I started baking when I was 15, standing on a stool in my grandmother's kitchen,
              learning her vanilla cake recipe.
            </p>
            <p>
              I loved it so much that I spent 8 years working in restaurant kitchens to learn the
              trade properly.
            </p>
            <p>
              In 2021 I finally used my savings to open Sweet Crumb, and I still bake that same
              vanilla cake today.
            </p>
            <p className="font-display text-2xl text-foreground">
              Every cake I make is a little piece of her kitchen. 💕
            </p>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-5 pt-20">
        <p className="eyebrow">Come find me</p>
        <h2 className="mt-2 text-4xl">Where to find us</h2>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl bg-card p-7 shadow-sm">
            <h3 className="text-2xl">Address</h3>
            <p className="mt-2">{ADDRESS}</p>
            <p className="text-sm text-muted-foreground">{ADDRESS_HINT}</p>
            <a
              className="mt-4 inline-block font-semibold text-primary"
              target="_blank"
              rel="noreferrer"
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ADDRESS)}`}
            >
              Get directions →
            </a>
            <ul className="mt-6 space-y-3 border-t pt-5 text-sm">
              <li>
                <span className="font-semibold">Phone / WhatsApp:</span>{" "}
                <a className="text-primary" href={PHONE_HREF}>
                  {PHONE}
                </a>
                {" · "}
                <a className="text-primary" target="_blank" rel="noreferrer" href={WHATSAPP_HREF}>
                  Message on WhatsApp
                </a>
              </li>
              <li>
                <span className="font-semibold">Email:</span>{" "}
                <a className="text-primary" href={EMAIL_HREF}>
                  {EMAIL}
                </a>
              </li>
              <li>
                <span className="font-semibold">Instagram:</span>{" "}
                <a className="text-primary" target="_blank" rel="noreferrer" href={INSTAGRAM_HREF}>
                  {INSTAGRAM}
                </a>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl bg-card p-7 shadow-sm">
            <h3 className="text-2xl">Opening hours</h3>
            <ul className="mt-3 divide-y">
              {HOURS.map(([day, time]) => (
                <li key={day} className="flex justify-between py-2">
                  <span>{day}</span>
                  <span className="font-semibold">{time}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-muted-foreground">
              The bread is out of the oven before we open, so come early for the good loaves.
            </p>
          </div>

          <div className="rounded-2xl bg-card p-7 shadow-sm">
            <h3 className="text-2xl">Cake orders</h3>
            <p className="mt-3 text-muted-foreground">
              Every cake is baked to order, so please allow a little time:
            </p>
            <ul className="mt-4 space-y-3">
              {NOTICE.map(([kind, lead]) => (
                <li key={kind} className="rounded-xl bg-muted px-4 py-3">
                  <span className="font-semibold">{kind}</span>
                  <span className="block text-sm text-muted-foreground">{lead}</span>
                </li>
              ))}
            </ul>
            <Link to="/order" className="btn-primary mt-6">
              Start your order
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
