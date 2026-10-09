export const cakeSizes = [
  { size: "6 inch", serves: "6–8 people", price: 35 },
  { size: "8 inch", serves: "10–14 people", price: 50 },
  { size: "10 inch", serves: "16–24 people", price: 70 },
  { size: "2-tier", serves: "30–40 people", price: 140 },
] as const;

export const flavors = ["Vanilla", "Chocolate", "Red Velvet", "Lemon Raspberry", "Carrot"] as const;

export const extras = [
  { name: "Custom design or topper", price: "+$10–25" },
  { name: "Fondant decoration", price: "+$20" },
  { name: "Photo print", price: "+$12" },
  { name: "Carrot flavor", price: "+$5" },
];

export const cupcakes = [
  { name: "Classic (vanilla or chocolate)", price: "$3.50 each" },
  { name: "Specialty (red velvet, lemon, salted caramel)", price: "$4.25 each" },
  { name: "Box of 6", price: "$20" },
  { name: "Box of 12", price: "$38" },
];

export const breads = [
  { name: "Sourdough loaf", price: "$8" },
  { name: "Whole wheat loaf", price: "$7" },
  { name: "Baguette", price: "$4" },
  { name: "Croissant", price: "$3.50 each" },
  { name: "Cinnamon rolls (4 pack)", price: "$12" },
];
