import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, Info, ArrowRight, Sparkles, Heart } from "lucide-react";
import hero from "@/assets/hero.jpg";
import cake from "@/assets/cake.jpg";
import bread from "@/assets/bread.jpg";
import pastries from "@/assets/pastries.jpg";
import kitchen from "@/assets/kitchen.jpg";
import yuleLogImg from "@/assets/holiday-yule-log.jpg";
import gingerbreadImg from "@/assets/holiday-gingerbread.jpg";
import cupcakesImg from "@/assets/holiday-cupcakes.jpg";
import { HOLIDAY_ENABLED, ALLERGEN_NOTICE, holidayItems } from "@/lib/holiday-config";
import { Particle3DBackground } from "@/components/3d/Particle3DBackground";
import { Cake3DConfigurator } from "@/components/3d/Cake3DConfigurator";
import { Card3DTilt } from "@/components/3d/Card3DTilt";

const holidayImages: Record<string, string> = {
  "yule-log": yuleLogImg,
  "gingerbread-box": gingerbreadImg,
  "holiday-cupcakes": cupcakesImg,
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sweet Crumb Bakery — Baked fresh, made with love" },
      { name: "description", content: "Custom cakes, rustic breads and little celebrations baked in small batches at 24 Maple Street, Brookfield." },
      { property: "og:title", content: "Sweet Crumb Bakery — Baked fresh, made with love" },
      { property: "og:description", content: "Custom cakes, rustic breads and little celebrations." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Particle3DBackground />

      {/* Hero Section */}
      <section className="relative px-5 pt-12 pb-20 max-w-6xl mx-auto">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-3">
              <span className="h-[1px] w-8 bg-[#e5b967]"></span>
              <span className="eyebrow text-xs tracking-[0.2em] font-bold">
                BROOKFIELD'S NEIGHBOURHOOD BAKERY
              </span>
            </div>

            <h1 className="font-display text-5xl font-semibold leading-[1.15] text-[#f3e8d9] sm:text-6xl lg:text-7xl">
              Baked fresh, <br />
              <span className="italic font-serif text-[#e5b967]">made with love.</span>
            </h1>

            <p className="max-w-lg text-base leading-relaxed text-[#b8a695]">
              Custom cakes, rustic breads and little celebrations — baked in small batches at 24 Maple Street, Brookfield.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/order"
                className="inline-flex items-center gap-2 rounded-full bg-[#e5b967] px-7 py-3.5 text-sm font-bold text-[#140f0c] shadow-xl shadow-[#e5b967]/20 hover:bg-[#edd093] transition-all"
              >
                <span>Order a custom cake</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              {HOLIDAY_ENABLED && (
                <Link
                  to="/holiday-order"
                  className="inline-flex items-center gap-2 rounded-full border border-[#e5b967]/40 bg-[#1e1714] px-6 py-3.5 text-sm font-semibold text-[#f3e8d9] hover:bg-[#e5b967]/10 transition-all"
                >
                  <span className="h-2 w-2 rounded-full bg-[#e5b967]"></span>
                  <span>Christmas pre-order</span>
                </Link>
              )}
            </div>

            {/* Micro Badges */}
            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-[#b8a695]/90 border-t border-[#e5b967]/15">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#e5b967]" />
                <span>Tue–Sat 8–6 · Sun 9–2</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-[#e5b967]" />
                <span>3 big cakes a day, booked to order</span>
              </div>
            </div>
          </div>

          {/* Right Hero Visuals — Arched Framing & 3D Interactive Hero */}
          <div className="lg:col-span-6 relative">
            <Card3DTilt className="relative z-10">
              <div className="relative overflow-hidden rounded-t-[140px] rounded-b-3xl border border-[#e5b967]/30 bg-[#1c1511] p-3 shadow-2xl">
                <img
                  src={hero}
                  alt="Rich chocolate celebration cake on a pedestal stand"
                  className="h-[460px] w-full object-cover rounded-t-[130px] rounded-b-2xl filter brightness-95"
                />

                {/* Floating 3D WebGL Badge Overlay */}
                <div className="absolute top-6 right-6 backdrop-blur-md bg-[#140f0c]/80 border border-[#e5b967]/30 rounded-full px-4 py-2 flex items-center gap-2 shadow-xl">
                  <Sparkles className="h-4 w-4 text-[#e5b967]" />
                  <span className="text-xs font-bold text-[#f3e8d9]">Christmas pre-orders open</span>
                </div>
              </div>
            </Card3DTilt>
          </div>
        </div>
      </section>

      {/* Marquee Ticker Bar */}
      <div className="w-full border-y border-[#e5b967]/20 bg-[#18120e] py-3.5 overflow-hidden text-xs uppercase tracking-[0.25em] text-[#e5b967] font-semibold select-none">
        <div className="animate-marquee gap-8 items-center">
          <div className="flex shrink-0 items-center gap-8">
            <span>24 Maple Street, Brookfield</span>
            <span>◆</span>
            <span>Baked fresh daily</span>
            <span>◆</span>
            <span>Custom celebration cakes</span>
            <span>◆</span>
            <span>Order ahead</span>
            <span>◆</span>
            <span>Made with love</span>
            <span>◆</span>
          </div>
          <div className="flex shrink-0 items-center gap-8" aria-hidden="true">
            <span>24 Maple Street, Brookfield</span>
            <span>◆</span>
            <span>Baked fresh daily</span>
            <span>◆</span>
            <span>Custom celebration cakes</span>
            <span>◆</span>
            <span>Order ahead</span>
            <span>◆</span>
            <span>Made with love</span>
            <span>◆</span>
          </div>
        </div>
      </div>

      {/* Christmas Specials Section */}
      {HOLIDAY_ENABLED && (
        <section className="mx-auto max-w-6xl px-5 pt-24 pb-12">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow flex items-center gap-2">
                <span>✳</span> PRE-ORDER · DECEMBER
              </p>
              <h2 className="mt-2 font-display text-4xl font-semibold text-[#f3e8d9] sm:text-5xl">
                Christmas <span className="italic font-serif text-[#e5b967]">Specials</span>
              </h2>
              <p className="mt-2 text-sm text-[#b8a695]">
                Pre-order your holiday treats. Baked fresh and made with love.
              </p>
            </div>

            {/* Date / Limits Summary Card */}
            <div className="rounded-2xl border border-[#e5b967]/30 bg-[#1c1511] p-5 text-xs text-[#b8a695] space-y-1 shadow-lg max-w-md">
              <p>
                <span className="font-semibold text-[#f3e8d9]">Order</span> December 1 – December 22 ·{" "}
                <span className="font-semibold text-[#e5b967]">Pickup / delivery</span> Dec 18 – Dec 24
              </p>
              <p>15 orders a day · 3 days' notice · delivery $8 within 5 miles</p>
            </div>
          </div>

          {/* Product Cards */}
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {holidayItems.map((item) => {
              const img = holidayImages[item.id];
              const priceDisplay =
                item.options.length > 1
                  ? `from $${Math.min(...item.options.map((o) => o.price))}`
                  : `from $${item.options[0]?.price}`;

              return (
                <Card3DTilt key={item.id} className="h-full">
                  <div className="flex flex-col h-full overflow-hidden rounded-3xl bg-[#1c1511] border border-[#e5b967]/25 shadow-xl hover:border-[#e5b967]/50 transition-all duration-300">
                    <div className="relative">
                      <img
                        src={img}
                        alt={item.imageAlt}
                        loading="lazy"
                        className="aspect-[4/3] w-full object-cover"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        {item.options.map((opt) => (
                          <span
                            key={opt.value}
                            className="rounded-full bg-[#140f0c]/80 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-[#e5b967] border border-[#e5b967]/30"
                          >
                            {opt.label}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-6">
                      <div>
                        <h3 className="font-display text-2xl font-semibold text-[#f3e8d9]">{item.name}</h3>
                        <p className="mt-3 text-xs leading-relaxed text-[#b8a695]">{item.description}</p>
                      </div>

                      <div className="mt-6 flex items-center justify-between pt-4 border-t border-[#e5b967]/15">
                        <span className="font-semibold text-[#e5b967] text-sm">{priceDisplay}</span>
                        <Link
                          to="/holiday-order"
                          className="inline-flex items-center gap-1.5 rounded-full bg-[#e5b967] px-5 py-2 text-xs font-bold text-[#140f0c] hover:bg-[#edd093] transition-all"
                        >
                          <span>Pre-order</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card3DTilt>
              );
            })}
          </div>

          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-[#e5b967]/20 bg-[#18120e] p-4 text-xs text-[#b8a695]">
            <Info className="h-4 w-4 text-[#e5b967] shrink-0" />
            <p>{ALLERGEN_NOTICE}</p>
          </div>
        </section>
      )}

      {/* "Little things, done slowly" Bento Grid Section */}
      <section className="mx-auto max-w-6xl px-5 pt-20 pb-16">
        <p className="eyebrow">FROM THE OVEN</p>
        <h2 className="mt-2 font-display text-4xl font-semibold text-[#f3e8d9] sm:text-5xl">
          Little things, <span className="italic font-serif text-[#e5b967]">done slowly</span>
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-12">
          {/* Featured Large Celebration Cakes Bento Card */}
          <div className="md:col-span-5">
            <Card3DTilt className="h-full">
              <Link
                to="/order"
                className="group relative flex h-full flex-col justify-end overflow-hidden rounded-3xl border border-[#e5b967]/30 bg-[#1c1511] p-6 shadow-xl min-h-[380px]"
              >
                <img
                  src={cake}
                  alt="Celebration cakes"
                  className="absolute inset-0 h-full w-full object-cover filter brightness-75 transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#140f0c] via-[#140f0c]/30 to-transparent" />
                <div className="relative z-10">
                  <h3 className="font-display text-2xl font-semibold text-[#f3e8d9]">Celebration cakes</h3>
                  <p className="mt-1 text-xs text-[#b8a695]">Custom designed for your special day</p>
                </div>
              </Link>
            </Card3DTilt>
          </div>

          {/* Right Grid of 4 Items */}
          <div className="md:col-span-7 grid gap-6 grid-cols-2">
            {[
              { title: "Rustic breads", img: bread, to: "/menu" as const },
              { title: "Morning pastries", img: pastries, to: "/menu" as const },
              { title: "Cupcakes", img: cupcakesImg, to: "/menu" as const },
              { title: "Decorated cookies", img: gingerbreadImg, to: "/menu" as const },
            ].map((item) => (
              <Card3DTilt key={item.title}>
                <Link
                  to={item.to}
                  className="group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-3xl border border-[#e5b967]/25 bg-[#1c1511] p-5 shadow-lg"
                >
                  <img
                    src={item.img}
                    alt={item.title}
                    className="absolute inset-0 h-full w-full object-cover filter brightness-75 transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#140f0c] via-transparent to-transparent" />
                  <div className="relative z-10">
                    <h3 className="font-display text-lg font-semibold text-[#f3e8d9]">{item.title}</h3>
                  </div>
                </Link>
              </Card3DTilt>
            ))}
          </div>
        </div>
      </section>

      {/* 3D Interactive Cake Studio Widget */}
      <Cake3DConfigurator />

      {/* About Me Section */}
      <section className="mx-auto max-w-6xl px-5 pt-24 pb-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Arched Kitchen Image */}
          <div className="lg:col-span-5">
            <Card3DTilt>
              <div className="relative overflow-hidden rounded-t-[140px] rounded-b-3xl border border-[#e5b967]/30 bg-[#1c1511] p-3 shadow-2xl">
                <img
                  src={kitchen}
                  alt="Baker piping chocolate cake frosting in cozy kitchen"
                  className="h-[460px] w-full object-cover rounded-t-[130px] rounded-b-2xl filter brightness-95"
                />
              </div>
            </Card3DTilt>
          </div>

          {/* Right About Text */}
          <div className="lg:col-span-7 space-y-6">
            <p className="eyebrow">ABOUT ME</p>
            <h2 className="font-display text-4xl font-semibold text-[#f3e8d9] sm:text-5xl leading-tight">
              It started with one stubborn sourdough.
            </h2>

            <div className="space-y-4 text-sm leading-relaxed text-[#b8a695]">
              <p>
                Sweet Crumb began in my tiny apartment kitchen, with one dented loaf tin and a sourdough starter that refused to give up on me. I baked for the neighbours, then for friends of friends, until Saturday mornings simply couldn't keep up.
              </p>
              <p>
                Then came the little shop on Maple Street — right next to the flower shop, which turned out to be perfect: fresh bread and fresh flowers make people equally happy.
              </p>
              <p>
                Everything is still baked here in small batches, the slow way. Three big cakes a day, never more, so that every single cake gets the care it deserves. If you have an idea for yours, I'd love to hear it.
              </p>
            </div>

            <p className="font-display text-lg italic text-[#e5b967] pt-2">
              — with flour on my hands, Sweet Crumb
            </p>

            <div className="flex flex-wrap gap-3 pt-3">
              {["3 days' notice for cakes", "7 days for wedding & tiered", "Next to the flower shop"].map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-[#e5b967]/30 bg-[#1e1714] px-4 py-1.5 text-xs font-semibold text-[#f3e8d9]"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
