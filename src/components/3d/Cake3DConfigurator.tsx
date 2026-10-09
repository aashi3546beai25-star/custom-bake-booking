import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Cake3DCanvas } from "./Cake3DCanvas";
import { Card3DTilt } from "./Card3DTilt";

const frostingPresets = [
  { name: "Classic Vanilla", hex: "#fff5ea", flavor: "Vanilla" },
  { name: "Velvet Cocoa", hex: "#4a2c20", flavor: "Chocolate" },
  { name: "Ruby Velvet", hex: "#9e2a2b", flavor: "Red Velvet" },
  { name: "Matcha Mint", hex: "#d8f3dc", flavor: "Lemon Raspberry" },
  { name: "Golden Honey", hex: "#f4a261", flavor: "Carrot" },
];

export function Cake3DConfigurator() {
  const [selectedFrosting, setSelectedFrosting] = useState(frostingPresets[0]!);
  const [tierCount, setTierCount] = useState<1 | 2>(2);
  const [hasBerries, setHasBerries] = useState(true);
  const [hasSprinkles, setHasSprinkles] = useState(true);
  const [hasDrizzle, setHasDrizzle] = useState(true);
  const [hasCandle, setHasCandle] = useState(true);

  const estimatedPrice = (tierCount === 2 ? 140 : 70) + (hasDrizzle ? 10 : 0) + (hasBerries ? 12 : 0);

  return (
    <section className="mx-auto max-w-6xl px-5 pt-20">
      <div className="text-center">
        <p className="eyebrow">Interactive 3D Studio</p>
        <h2 className="mt-2 text-4xl font-semibold sm:text-5xl">Design Your Cake in 3D</h2>
        <p className="mt-3 text-muted-foreground">
          Customize your dream celebration cake in real-time before ordering.
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:items-center">
        {/* 3D Interactive Viewer Canvas */}
        <div className="lg:col-span-7">
          <Card3DTilt className="overflow-hidden rounded-3xl border border-white/20 bg-card/60 p-6 shadow-2xl backdrop-blur-xl">
            <div className="relative">
              <Cake3DCanvas
                frostingColor={selectedFrosting.hex}
                tierCount={tierCount}
                hasBerries={hasBerries}
                hasSprinkles={hasSprinkles}
                hasDrizzle={hasDrizzle}
                hasCandle={hasCandle}
                className="h-[440px] w-full"
              />
              <div className="absolute top-4 left-4 rounded-2xl bg-background/80 px-4 py-2 backdrop-blur-md shadow-md">
                <span className="text-xs uppercase tracking-wider text-muted-foreground block font-bold">Estimated Starting Price</span>
                <span className="text-2xl font-bold text-primary">${estimatedPrice}</span>
              </div>
            </div>
          </Card3DTilt>
        </div>

        {/* 3D Customizer Controls Panel */}
        <div className="lg:col-span-5 space-y-6 rounded-3xl border border-border bg-card/80 p-8 shadow-xl backdrop-blur-lg">
          <div>
            <label className="block font-semibold text-foreground text-sm uppercase tracking-wider">
              1. Select Size & Tiers
            </label>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTierCount(1)}
                className={`rounded-xl p-3 text-sm font-semibold border transition-all ${
                  tierCount === 1
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "border-border hover:bg-accent"
                }`}
              >
                Single Tier (8")
                <span className="block text-xs text-muted-foreground font-normal">Serves 10–14</span>
              </button>
              <button
                type="button"
                onClick={() => setTierCount(2)}
                className={`rounded-xl p-3 text-sm font-semibold border transition-all ${
                  tierCount === 2
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "border-border hover:bg-accent"
                }`}
              >
                2-Tier Celebration
                <span className="block text-xs text-muted-foreground font-normal">Serves 30–40</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-foreground text-sm uppercase tracking-wider">
              2. Frosting Flavor & Color
            </label>
            <div className="mt-3 flex flex-wrap gap-3">
              {frostingPresets.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => setSelectedFrosting(preset)}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-all ${
                    selectedFrosting.name === preset.name
                      ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/30"
                      : "border-border hover:bg-accent"
                  }`}
                >
                  <span
                    className="h-4 w-4 rounded-full border border-black/10 shadow-inner"
                    style={{ backgroundColor: preset.hex }}
                  />
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-foreground text-sm uppercase tracking-wider">
              3. Toppers & Decor
            </label>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {[
                { label: "Fresh Berries", state: hasBerries, setter: setHasBerries },
                { label: "Chocolate Drizzle", state: hasDrizzle, setter: setHasDrizzle },
                { label: "Colorful Sprinkles", state: hasSprinkles, setter: setHasSprinkles },
                { label: "Celebration Candle", state: hasCandle, setter: setHasCandle },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => item.setter(!item.state)}
                  className={`flex items-center justify-between rounded-xl p-3 text-xs font-semibold border transition-all ${
                    item.state
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border opacity-70 hover:opacity-100"
                  }`}
                >
                  <span>{item.label}</span>
                  <span>{item.state ? "✓" : "+"}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/order"
              className="btn-primary w-full text-center text-base py-3 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
            >
              Order This Custom 3D Cake →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
