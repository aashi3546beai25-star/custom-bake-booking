import { createFileRoute } from "@tanstack/react-router";

export const ADDRESS = "123 Baker Street, Springfield";

const hours = [
  ["Monday", "Closed"],
  ["Tuesday – Friday", "7:00am – 6:00pm"],
  ["Saturday", "7:00am – 6:00pm"],
  ["Sunday", "8:00am – 2:00pm"],
];

export const Route = createFileRoute("/visit")({
  head: () => ({
    meta: [
      { title: "Visit Us — Sweet Crumb Hours & Location" },
      { name: "description", content: "Sweet Crumb opening hours, address and map." },
      { property: "og:title", content: "Visit Sweet Crumb" },
      { property: "og:description", content: "Opening hours, address and directions to the bakery." },
    ],
  }),
  component: Visit,
});

function Visit() {
  return (
    <div className="mx-auto max-w-6xl px-5 pt-16">
      <p className="eyebrow">Come say hi</p>
      <h1 className="mt-2 text-5xl">Visit the bakery</h1>
      <div className="mt-10 grid gap-8 md:grid-cols-[1fr_1.4fr]">
        <div className="space-y-6">
          <div className="rounded-2xl bg-card p-7 shadow-sm">
            <h2 className="text-2xl">Address</h2>
            <p className="mt-2">{ADDRESS}</p>
            <a className="mt-3 inline-block font-semibold text-primary" target="_blank" rel="noreferrer"
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ADDRESS)}`}>
              Get directions →
            </a>
          </div>
          <div className="rounded-2xl bg-card p-7 shadow-sm">
            <h2 className="text-2xl">Opening hours</h2>
            <ul className="mt-3 divide-y">
              {hours.map(([d, h]) => (
                <li key={d} className="flex justify-between py-2"><span>{d}</span><span className="font-semibold">{h}</span></li>
              ))}
            </ul>
          </div>
        </div>
        <iframe
          title="Map to Sweet Crumb"
          src={`https://www.google.com/maps?q=${encodeURIComponent(ADDRESS)}&output=embed`}
          className="h-[460px] w-full rounded-2xl border shadow-sm"
          loading="lazy"
        />
      </div>
    </div>
  );
}
