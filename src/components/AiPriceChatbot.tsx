import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Bot, User, ArrowRight, X, Mail, CheckCircle2, MessageSquare, Phone, MapPin, Clock } from "lucide-react";
import { EMAIL, PHONE, ADDRESS } from "@/contact";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  category?: "cake" | "cupcakes" | "bread" | "pastry" | "holiday" | "faq" | "general";
  estimate?: {
    itemTitle: string;
    basePrice: number;
    extrasPrice: number;
    totalMin: number;
    totalMax: number;
    breakdown: string[];
    suggestedSize?: string;
    suggestedFlavor?: string;
    servings?: string;
  };
  emailDraft?: {
    subject: string;
    body: string;
  };
}

const quickPrompts = [
  "🎂 8-inch Chocolate cake with fresh berries & gold leaf",
  "💒 3-Tier Wedding cake for 70 guests",
  "🧁 Box of 12 custom cupcakes with gold toppers",
  "🥖 Sourdough Country loaf & 6 almond croissants",
  "🎄 Yule Log Cake & Gingerbread Gift Box",
  "🕒 What are your hours and address?",
];

export function AiPriceChatbot({
  onApplyEstimate,
}: {
  onApplyEstimate?: (size: string, flavor: string, designNotes: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      text: "👋 Hello! I'm Crumbie 🤖, your Sweet Crumb AI Bakery Assistant. Ask me for instant pricing on custom cakes, wedding tiers, cupcakes, artisan sourdough breads, pastries, or holiday specials — and I can send a ready-to-order inquiry directly to our bakery's Gmail!",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // 🧠 Comprehensive AI Bakery Pricing & Knowledge Engine
  function calculateEstimate(prompt: string): {
    text: string;
    category: Message["category"];
    estimate?: Message["estimate"];
    emailDraft?: Message["emailDraft"];
  } {
    const text = prompt.toLowerCase();

    // 1. FAQs & Store Info
    if (
      text.includes("hour") ||
      text.includes("open") ||
      text.includes("address") ||
      text.includes("location") ||
      text.includes("where") ||
      text.includes("contact") ||
      text.includes("phone")
    ) {
      return {
        category: "faq",
        text: `📍 **Sweet Crumb Bakery Location & Hours**:\n• **Address**: ${ADDRESS}\n• **Hours**: Wednesday – Sunday: 7:00 AM – 3:00 PM (Closed Mon & Tue)\n• **Phone**: ${PHONE}\n• **Email**: ${EMAIL}\n• **Notice**: Custom cakes require 2–3 days notice. Holiday items require 3 days.`,
      };
    }

    // 2. Breads & Sourdough
    if (
      text.includes("bread") ||
      text.includes("sourdough") ||
      text.includes("focaccia") ||
      text.includes("brioche") ||
      text.includes("baguette") ||
      text.includes("loaf")
    ) {
      const breakdown: string[] = [];
      let min = 0;
      let max = 0;

      if (text.includes("focaccia")) {
        min += 8;
        max += 8;
        breakdown.push("Rosemary & Sea Salt Focaccia: $8");
      }
      if (text.includes("brioche")) {
        min += 12;
        max += 12;
        breakdown.push("Artisan Golden Brioche Loaf: $12");
      }
      if (text.includes("seeded") || text.includes("multigrain")) {
        min += 11;
        max += 11;
        breakdown.push("Seeded Multigrain Sourdough: $11");
      }
      if (text.includes("baguette")) {
        min += 7;
        max += 7;
        breakdown.push("Organic Sourdough Baguettes (2-pack): $7");
      }
      if (min === 0 || text.includes("country") || text.includes("classic")) {
        min += 9;
        max += 9;
        breakdown.push("Traditional Sourdough Country Loaf: $9");
      }

      const emailSubject = `Bread & Bakery Order Inquiry`;
      const emailBody = `Hi Sweet Crumb Team,\n\nI would like to inquire about reserving fresh artisan breads:\n\nRequest: "${prompt}"\nEstimated Price: $${min} – $${max}\nBreakdown:\n${breakdown.map((b) => `• ${b}`).join("\n")}\n\nPlease let me know availability for pickup at 24 Maple Street.\n\nThank you!`;

      return {
        category: "bread",
        text: `Here is the price guide for our fresh, stone-ground artisan sourdough & breads:`,
        estimate: {
          itemTitle: "Artisan Breads & Sourdough",
          basePrice: min,
          extrasPrice: 0,
          totalMin: min,
          totalMax: max,
          breakdown,
        },
        emailDraft: { subject: emailSubject, body: emailBody },
      };
    }

    // 3. Pastries & Viennoiserie
    if (
      text.includes("pastry") ||
      text.includes("pastries") ||
      text.includes("croissant") ||
      text.includes("chocolat") ||
      text.includes("cinnamon roll") ||
      text.includes("bun") ||
      text.includes("danish")
    ) {
      const breakdown: string[] = [];
      let min = 0;
      let max = 0;

      if (text.includes("12") || text.includes("dozen") || text.includes("box of 12")) {
        min = 52;
        max = 58;
        breakdown.push("Pastry Box of 12 Assorted French Viennoiserie: $52");
      } else if (text.includes("6") || text.includes("box of 6") || text.includes("half dozen")) {
        min = 28;
        max = 32;
        breakdown.push("Pastry Box of 6 Assorted French Viennoiserie: $28");
      } else if (text.includes("almond")) {
        min = 5.75;
        max = 6;
        breakdown.push("Double-Baked Almond Croissant: $5.75 each");
      } else if (text.includes("chocolate") || text.includes("chocolat")) {
        min = 5.25;
        max = 5.5;
        breakdown.push("Pain au Chocolat (Dark Chocolate): $5.25 each");
      } else if (text.includes("cinnamon") || text.includes("bun")) {
        min = 4.75;
        max = 5;
        breakdown.push("Cardamom / Cinnamon Morning Bun: $4.75 each");
      } else {
        min = 4.5;
        max = 5.75;
        breakdown.push("Artisan Butter Croissant: $4.50 each (or $28 for Box of 6)");
      }

      const emailSubject = `Pastry Box Inquiry`;
      const emailBody = `Hi Sweet Crumb Team,\n\nI would like to order fresh morning pastries:\n\nRequest: "${prompt}"\nEstimated Total: $${min} – $${max}\nBreakdown:\n${breakdown.map((b) => `• ${b}`).join("\n")}\n\nPlease confirm order details.\n\nThank you!`;

      return {
        category: "pastry",
        text: `Here is the pricing for our hand-laminated French butter pastries:`,
        estimate: {
          itemTitle: "Artisan Pastries & Croissants",
          basePrice: min,
          extrasPrice: 0,
          totalMin: min,
          totalMax: max,
          breakdown,
        },
        emailDraft: { subject: emailSubject, body: emailBody },
      };
    }

    // 4. Cupcakes
    if (text.includes("cupcake") || text.includes("cupcakes") || text.includes("muffin")) {
      const breakdown: string[] = [];
      let base = 24;
      let extras = 0;
      let title = "Gourmet Cupcakes";

      if (text.includes("24") || text.includes("2 dozen")) {
        base = 80;
        title = "Box of 24 Custom Cupcakes";
        breakdown.push("Box of 24 Gourmet Cupcakes: $80");
      } else if (text.includes("12") || text.includes("dozen") || text.includes("1 dozen")) {
        base = 44;
        title = "Box of 12 Custom Cupcakes";
        breakdown.push("Box of 12 Gourmet Cupcakes: $44");
      } else if (text.includes("single") || text.includes("1 cupcake") || text.includes("individual")) {
        base = 4.5;
        title = "Individual Cupcake";
        breakdown.push("Individual Gourmet Cupcake: $4.50");
      } else {
        base = 24;
        title = "Box of 6 Custom Cupcakes";
        breakdown.push("Box of 6 Gourmet Cupcakes: $24");
      }

      if (text.includes("gold") || text.includes("topper")) {
        extras += 8;
        breakdown.push("Custom Metallic / Laser Toppers: +$8");
      }
      if (text.includes("fondant") || text.includes("theme") || text.includes("character")) {
        extras += 12;
        breakdown.push("Handcrafted Fondant Decorations: +$12");
      }
      if (text.includes("vegan") || text.includes("gluten")) {
        extras += 6;
        breakdown.push("Gluten-Free / Vegan Preparation: +$6");
      }

      const totalMin = base + extras;
      const totalMax = totalMin + (base > 40 ? 10 : 4);

      const emailSubject = `Cupcake Order Inquiry: ${title}`;
      const emailBody = `Hi Sweet Crumb Team,\n\nI would like to order cupcakes:\n\nItem: ${title}\nCustomer Request: "${prompt}"\nPrice Estimate: $${totalMin} – $${totalMax}\nDetails:\n${breakdown.map((b) => `• ${b}`).join("\n")}\n\nPlease confirm availability and details.\n\nThank you!`;

      return {
        category: "cupcakes",
        text: `Here is the pricing estimate for your custom cupcakes:`,
        estimate: {
          itemTitle: title,
          basePrice: base,
          extrasPrice: extras,
          totalMin,
          totalMax,
          breakdown,
        },
        emailDraft: { subject: emailSubject, body: emailBody },
      };
    }

    // 5. Holiday Specials
    if (
      text.includes("christmas") ||
      text.includes("holiday") ||
      text.includes("yule") ||
      text.includes("log") ||
      text.includes("gingerbread")
    ) {
      const breakdown: string[] = [];
      let min = 0;
      let max = 0;
      let title = "Holiday Special";

      if (text.includes("yule") || text.includes("log")) {
        if (text.includes("large") || text.includes("12") || text.includes("16")) {
          min = 65;
          max = 65;
          title = "Large Yule Log Cake (Serves 12–16)";
          breakdown.push("Large Chocolate Yule Log Cake (Serves 12–16): $65");
        } else {
          min = 45;
          max = 45;
          title = "Yule Log Cake (Serves 8–10)";
          breakdown.push("Chocolate Yule Log Cake with Meringue Mushrooms (Serves 8–10): $45");
        }
      } else if (text.includes("gingerbread") || text.includes("cookie")) {
        min = 28;
        max = 28;
        title = "Gingerbread Cookie Gift Box (12 pcs)";
        breakdown.push("12 Hand-decorated Gingerbread Cookies Gift Box: $28");
      } else {
        min = 24;
        max = 44;
        title = "Holiday Cupcakes (Peppermint / Eggnog / Cranberry)";
        breakdown.push("Holiday Cupcake Box (6-pack: $24 / 12-pack: $44)");
      }

      const emailSubject = `Christmas Pre-Order Inquiry: ${title}`;
      const emailBody = `Hi Sweet Crumb Bakery,\n\nI'd like to reserve a Holiday Special:\n\nItem: ${title}\nInquiry: "${prompt}"\nPrice: $${min} – $${max}\nBreakdown:\n${breakdown.map((b) => `• ${b}`).join("\n")}\n\nPlease let me know pickup dates between Dec 18–24.\n\nThank you!`;

      return {
        category: "holiday",
        text: `Here is the pricing for our official Christmas specials:`,
        estimate: {
          itemTitle: title,
          basePrice: min,
          extrasPrice: 0,
          totalMin: min,
          totalMax: max,
          breakdown,
        },
        emailDraft: { subject: emailSubject, body: emailBody },
      };
    }

    // 6. Custom Cakes (1-tier, multi-tier, wedding, bento, custom decor)
    let basePrice = 50;
    let size = "8 inch";
    let servings = "10–14 servings";
    let flavor = "Vanilla Bean";
    let extrasPrice = 0;
    const breakdown: string[] = [];

    // Tiers & Size Detection
    if (
      text.includes("4-tier") ||
      text.includes("4 tier") ||
      text.includes("100") ||
      text.includes("120") ||
      text.includes("grand wedding")
    ) {
      basePrice = 420;
      size = "4-tier Grand";
      servings = "100–140 guests";
      breakdown.push("4-Tier Grand Wedding Cake (100–140 servings): $420");
    } else if (
      text.includes("3-tier") ||
      text.includes("3 tier") ||
      text.includes("60") ||
      text.includes("70") ||
      text.includes("80")
    ) {
      basePrice = 260;
      size = "3-tier Wedding";
      servings = "60–80 guests";
      breakdown.push("3-Tier Luxury Wedding Cake (60–80 servings): $260");
    } else if (
      text.includes("2-tier") ||
      text.includes("2 tier") ||
      text.includes("wedding") ||
      text.includes("30") ||
      text.includes("35") ||
      text.includes("40")
    ) {
      basePrice = 140;
      size = "2-tier";
      servings = "30–40 guests";
      breakdown.push("2-Tier Celebration Cake (30–40 servings): $140");
    } else if (
      text.includes("10 inch") ||
      text.includes("10-inch") ||
      text.includes("20") ||
      text.includes("25") ||
      text.includes("large")
    ) {
      basePrice = 70;
      size = "10 inch";
      servings = "16–24 servings";
      breakdown.push("10-Inch Round Cake (16–24 servings): $70");
    } else if (
      text.includes("bento") ||
      text.includes("mini") ||
      text.includes("heart") ||
      text.includes("lunchbox") ||
      text.includes("vintage")
    ) {
      basePrice = 38;
      size = "Bento / Mini Vintage";
      servings = "2–4 servings";
      breakdown.push("Custom Vintage Bento Cake (2–4 servings): $38");
    } else if (
      text.includes("6 inch") ||
      text.includes("6-inch") ||
      text.includes("small") ||
      text.includes("6 people") ||
      text.includes("8 people")
    ) {
      basePrice = 35;
      size = "6 inch";
      servings = "6–8 servings";
      breakdown.push("6-Inch Round Cake (6–8 servings): $35");
    } else if (text.includes("smash")) {
      basePrice = 30;
      size = "Smash Cake";
      servings = "Baby 1st Birthday";
      breakdown.push("Mini Smash Cake (Baby 1st Birthday): $30");
    } else {
      basePrice = 50;
      size = "8 inch";
      servings = "10–14 servings";
      breakdown.push("8-Inch Round Cake (10–14 servings): $50");
    }

    // Comprehensive Flavor Detection
    if (text.includes("strawberry") || text.includes("strawberries")) {
      flavor = "Fresh Strawberry Shortcake";
    } else if (text.includes("mango") || text.includes("passion fruit") || text.includes("passionfruit")) {
      flavor = "Tropical Mango Passionfruit";
    } else if (text.includes("blueberry") || text.includes("blueberries")) {
      flavor = "Wild Blueberry Lemon";
    } else if (text.includes("chocolate") || text.includes("cocoa") || text.includes("fudge") || text.includes("truffle")) {
      flavor = "Dutch Dark Chocolate";
    } else if (text.includes("red velvet") || text.includes("velvet")) {
      flavor = "Red Velvet";
    } else if (text.includes("lemon") || text.includes("raspberry")) {
      flavor = "Lemon Raspberry Curd";
    } else if (text.includes("carrot") || text.includes("pecan")) {
      flavor = "Carrot Pecan Spice";
      extrasPrice += 5;
      breakdown.push("Gourmet Carrot & Pecan Recipe: +$5");
    } else if (text.includes("matcha") || text.includes("green tea")) {
      flavor = "Matcha Green Tea";
      extrasPrice += 6;
      breakdown.push("Artisan Ceremonial Matcha: +$6");
    } else if (text.includes("earl grey") || text.includes("lavender")) {
      flavor = "Earl Grey Lavender";
      extrasPrice += 6;
      breakdown.push("Earl Grey & French Lavender Infusion: +$6");
    } else if (text.includes("pistachio")) {
      flavor = "Pistachio Rosewater";
      extrasPrice += 7;
      breakdown.push("Sicilian Pistachio & Rosewater: +$7");
    } else if (text.includes("caramel") || text.includes("dulce")) {
      flavor = "Salted Caramel Crunch";
      extrasPrice += 5;
      breakdown.push("House-Made Salted Caramel: +$5");
    } else if (text.includes("oreo") || text.includes("cookies and cream") || text.includes("cookies & cream")) {
      flavor = "Cookies & Cream";
      extrasPrice += 5;
      breakdown.push("Crushed Oreo Buttercream: +$5");
    } else if (text.includes("coffee") || text.includes("mocha") || text.includes("espresso") || text.includes("tiramisu")) {
      flavor = "Espresso Mocha Tiramisu";
      extrasPrice += 6;
      breakdown.push("Single-Origin Espresso Soak: +$6");
    } else if (text.includes("funfetti") || text.includes("sprinkle") || text.includes("rainbow")) {
      flavor = "Rainbow Funfetti Birthday";
    } else if (text.includes("coconut")) {
      flavor = "Toasted Coconut Cream";
    } else {
      flavor = "Classic Vanilla Bean";
    }

    // Dietary Options
    if (text.includes("gluten free") || text.includes("gluten-free") || text.includes("gf")) {
      extrasPrice += 10;
      breakdown.push("Gluten-Free Flour Blend: +$10");
    }
    if (text.includes("vegan") || text.includes("dairy free") || text.includes("eggless")) {
      extrasPrice += 8;
      breakdown.push("Vegan / Dairy-Free Preparation: +$8");
    }

    // Decorations & Extras (Only add fresh berries extra if specifically requested as decor/topping on non-strawberry or extra berries)
    if (text.includes("gold") || text.includes("foil") || text.includes("leaf")) {
      extrasPrice += 15;
      breakdown.push("24k Edible Gold Leaf Accents: +$15");
    }
    if (
      (text.includes("extra berries") || text.includes("fresh berries") || text.includes("decorated with berries") || text.includes("raspberry")) &&
      !text.includes("just strawberry")
    ) {
      extrasPrice += 12;
      breakdown.push("Fresh Organic Berries Arrangement: +$12");
    }
    if (text.includes("flower") || text.includes("floral") || text.includes("rose")) {
      extrasPrice += 16;
      breakdown.push("Fresh Food-Safe Floral Arrangement: +$16");
    }
    if (text.includes("fondant") || text.includes("sculpted") || text.includes("figure")) {
      extrasPrice += 25;
      breakdown.push("Hand-Sculpted Custom Fondant Art: +$25");
    }
    if (text.includes("topper") || text.includes("acrylic") || text.includes("wood")) {
      extrasPrice += 15;
      breakdown.push("Custom Laser-Cut Acrylic/Wood Topper: +$15");
    }
    if (text.includes("writing") || text.includes("happy birthday") || text.includes("written") || text.includes("text") || text.includes("name")) {
      extrasPrice += 5;
      breakdown.push("Custom Hand-Piped Inscription: +$5");
    }
    if (text.includes("photo") || text.includes("picture") || text.includes("image")) {
      extrasPrice += 12;
      breakdown.push("Edible High-Res Sugar Photo Print: +$12");
    }
    if (text.includes("macaron") || text.includes("macarons")) {
      extrasPrice += 15;
      breakdown.push("French Macarons Garnish (6 pcs): +$15");
    }
    if (text.includes("delivery")) {
      extrasPrice += 8;
      breakdown.push("Local Delivery (within 5 miles): +$8");
    }

    const totalMin = basePrice + extrasPrice;
    const totalMax = totalMin + (basePrice >= 140 ? 25 : 12);

    const emailSubject = `Custom Cake Quote Request: ${size} ${flavor} (${servings})`;
    const emailBody = `Hi Sweet Crumb Bakery,\n\nI would like to inquire about booking a custom cake:\n\n• Cake Size: ${size} (${servings})\n• Flavor: ${flavor}\n• Original Request: "${prompt}"\n• Estimated Price: $${totalMin} – $${totalMax}\n\nPrice Breakdown:\n${breakdown.map((b) => `  - ${b}`).join("\n")}\n\nPlease let me know your availability and how to confirm the deposit.\n\nThank you!`;

    return {
      category: "cake",
      text: `Based on your request, here is your estimated price range for a custom **${flavor}** cake (**${size}**, ${servings}):`,
      estimate: {
        itemTitle: `${size} ${flavor} Cake`,
        basePrice,
        extrasPrice,
        totalMin,
        totalMax,
        breakdown,
        suggestedSize: size,
        suggestedFlavor: flavor,
        servings,
      },
      emailDraft: {
        subject: emailSubject,
        body: emailBody,
      },
    };
  }

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const result = calculateEstimate(query);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: result.text,
        category: result.category,
        estimate: result.estimate,
        emailDraft: result.emailDraft,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  const openGmailCompose = (subject: string, body: string) => {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      EMAIL
    )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, "_blank", "noopener,noreferrer");
  };

  const openMailto = (subject: string, body: string) => {
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <>
      {/* Floating AI Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-[#e5b967] to-[#d4a047] px-5 py-3.5 font-semibold text-[#140f0c] shadow-[0_10px_30px_rgba(229,185,103,0.35)] transition-all duration-300 hover:scale-105 hover:brightness-110 active:scale-95 border border-[#fff5da]/30"
      >
        <Sparkles className="h-5 w-5 animate-pulse text-[#140f0c]" />
        <span>Ask AI Price Bot</span>
      </button>

      {/* Chat Window Modal / Slide-out */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[580px] w-[92vw] max-w-[440px] flex-col overflow-hidden rounded-3xl border border-[#e5b967]/30 bg-[#140f0c]/95 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl transition-all text-[#f3e8d9]">
          {/* Header with Direct Gmail Indicator */}
          <div className="flex items-center justify-between bg-gradient-to-r from-[#221914] to-[#1a120e] border-b border-[#e5b967]/20 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e5b967]/40 bg-[#2a1f18] text-[#e5b967] shadow-inner">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold text-sm text-[#f3e8d9]">Crumbie — AI Estimator</h3>
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </div>
                <p className="text-[11px] text-[#e5b967]">Directly Connected to Bakery Gmail</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1.5 text-[#b8a695] hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm scroll-smooth">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "bot" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#e5b967]/30 bg-[#1e1714] text-[#e5b967] mt-1">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={`max-w-[88%] rounded-2xl p-3.5 ${
                    msg.sender === "user"
                      ? "bg-[#e5b967] text-[#140f0c] font-medium rounded-tr-none shadow-md"
                      : "bg-[#1e1714] text-[#f3e8d9] rounded-tl-none border border-[#e5b967]/20"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* AI Estimate Breakdown Display */}
                  {msg.estimate && (
                    <div className="mt-3 rounded-xl bg-[#140f0c]/90 p-3.5 border border-[#e5b967]/30 text-xs space-y-2 text-[#f3e8d9]">
                      <div className="flex items-center justify-between border-b border-[#e5b967]/20 pb-2">
                        <span className="font-bold text-[#e5b967] uppercase tracking-wider text-[10px]">
                          Estimated Price
                        </span>
                        <span className="text-base font-bold text-[#e5b967]">
                          ${msg.estimate.totalMin} – ${msg.estimate.totalMax}
                        </span>
                      </div>

                      <div className="space-y-1 pt-1">
                        <span className="font-semibold text-[#b8a695]">Price Breakdown:</span>
                        <ul className="space-y-1">
                          {msg.estimate.breakdown.map((item, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-[#d5c5b5]">
                              <span className="text-[#e5b967]">•</span> {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Action Buttons: Apply to Order Form + Connect to Gmail */}
                      <div className="pt-2 space-y-2">
                        {onApplyEstimate && msg.category === "cake" && (
                          <button
                            onClick={() => {
                              onApplyEstimate(
                                msg.estimate?.suggestedSize || "8 inch",
                                msg.estimate?.suggestedFlavor || "Vanilla",
                                msg.text
                              );
                              setIsOpen(false);
                            }}
                            className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#e5b967] py-2 text-xs font-bold text-[#140f0c] hover:brightness-110 transition-colors shadow-sm"
                          >
                            <span>Apply to Order Form</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        )}

                        {/* 📧 Send to Bakery Gmail Button */}
                        {msg.emailDraft && (
                          <div className="flex gap-1.5">
                            <button
                              onClick={() =>
                                openGmailCompose(
                                  msg.emailDraft!.subject,
                                  msg.emailDraft!.body
                                )
                              }
                              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-red-600/90 hover:bg-red-600 py-2 px-3 text-[11px] font-bold text-white transition-all shadow-sm"
                              title="Open compose in Gmail"
                            >
                              <Mail className="h-3.5 w-3.5" />
                              <span>Send via Gmail</span>
                            </button>
                            <button
                              onClick={() =>
                                openMailto(
                                  msg.emailDraft!.subject,
                                  msg.emailDraft!.body
                                )
                              }
                              className="flex items-center justify-center rounded-xl border border-[#e5b967]/30 bg-[#251d18] px-3 py-2 text-[11px] font-semibold text-[#e5b967] hover:bg-[#e5b967]/10 transition-colors"
                              title="Open default email app"
                            >
                              <span>Mail App</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {msg.sender === "user" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e5b967] text-[#140f0c] mt-1 text-xs font-bold">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 items-center text-xs text-[#e5b967] p-2">
                <Bot className="h-4 w-4 animate-bounce" />
                <span>Crumbie is calculating prices & preparing Gmail draft...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          <div className="px-3 py-2 border-t border-[#e5b967]/10 bg-[#18120e] flex gap-2 overflow-x-auto no-scrollbar">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="whitespace-nowrap rounded-full border border-[#e5b967]/20 bg-[#1e1714] px-3 py-1 text-[11px] text-[#b8a695] hover:border-[#e5b967] hover:text-[#e5b967] transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 border-t border-[#e5b967]/20 p-3 bg-[#18120e]"
          >
            <input
              type="text"
              placeholder="Ask about cakes, breads, pastries, or prices..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm outline-none placeholder:text-[#b8a695]/60 text-[#f3e8d9]"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e5b967] text-[#140f0c] disabled:opacity-40 hover:brightness-110 transition-all font-bold"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
