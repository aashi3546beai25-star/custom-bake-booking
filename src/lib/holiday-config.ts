// ============================================================
// 🎄 HOLIDAY SPECIALS — CONFIGURATION
// ============================================================
// Edit the values below to update your Christmas menu.
// After the holiday season, set HOLIDAY_ENABLED to false
// to hide the entire section from the website.
// ============================================================

/** Set to false after the season to hide the Christmas section */
export const HOLIDAY_ENABLED = true;

// ---------- ORDER & PICKUP DATES ----------

const _now = new Date();
const _currentYear = _now.getFullYear();
// If it's already after Christmas this year, default to next year
const _holidayYear = (_now.getMonth() === 11 && _now.getDate() > 25) ? _currentYear + 1 : _currentYear;

/** Customers can place orders from this date */
export const ORDER_START = `${_holidayYear}-11-01`;
/** Last day to place an order */
export const ORDER_END = `${_holidayYear}-12-24`;

/** First available pickup/delivery date */
export const PICKUP_START = `${_holidayYear}-12-01`;
/** Last available pickup/delivery date */
export const PICKUP_END = `${_holidayYear}-12-31`;

/** How many days ahead a customer must order (minimum notice) */
export const MIN_NOTICE_DAYS = 3;

/** How many holiday orders we can handle per day */
export const MAX_ORDERS_PER_DAY = 15;

/** 
 * Manually mark dates as full.
 * Add dates in "YYYY-MM-DD" format when a day fills up.
 * Example: ["2024-12-24", "2024-12-23"]
 */
export const manuallyFullDates: string[] = [];

// ---------- DELIVERY ----------

/** Delivery surcharge in dollars */
export const DELIVERY_FEE = 8;
/** Delivery radius description */
export const DELIVERY_RADIUS = "5 miles";

// ---------- FORM BACKEND ----------

/**
 * Formspree form ID for receiving orders by email.
 * 1. Go to https://formspree.io and create a free account
 * 2. Create a new form, point it to sweetcrumbbakery@gmail.com
 * 3. Copy the form ID (looks like "xpwzjkla") and paste it below
 * If left empty, the form will open the customer's email app instead.
 */
export const FORMSPREE_ID = "";

/** Email address for orders (used in mailto fallback) */
export const ORDER_EMAIL = "sweetcrumbbakery@gmail.com";

// ---------- ALLERGEN NOTICE ----------

export const ALLERGEN_NOTICE =
  "All holiday items contain wheat, eggs, and dairy. " +
  "The gingerbread box has no nuts, but our kitchen handles almonds, " +
  "so we cannot guarantee nut-free. Please mention any allergies in the notes.";

// ---------- HOLIDAY ITEMS ----------

export interface HolidayItemOption {
  /** Display label, e.g. "Serves 8–10" */
  label: string;
  /** Value for the form dropdown */
  value: string;
  /** Price in dollars */
  price: number;
}

export interface HolidayItem {
  /** Unique ID for form values */
  id: string;
  /** Display name */
  name: string;
  /** Short description for the card */
  description: string;
  /** Size/quantity options with prices */
  options: HolidayItemOption[];
  /** Import path is handled at the component level, this is just the alt text */
  imageAlt: string;
}

export const holidayItems: HolidayItem[] = [
  {
    id: "yule-log",
    name: "Yule Log Cake",
    description:
      "Chocolate sponge, vanilla cream, chocolate ganache, with meringue mushrooms.",
    options: [
      { label: "Serves 8–10", value: "yule-log-small", price: 45 },
      { label: "Serves 12–16", value: "yule-log-large", price: 65 },
    ],
    imageAlt: "Chocolate yule log cake with meringue mushrooms",
  },
  {
    id: "gingerbread-box",
    name: "Gingerbread Box",
    description:
      "12 decorated gingerbread cookies in a gift box — stars, trees, snowflakes and gingerbread people.",
    options: [
      { label: "Box of 12", value: "gingerbread-box", price: 28 },
    ],
    imageAlt: "Gift box of decorated gingerbread cookies",
  },
  {
    id: "holiday-cupcakes",
    name: "Holiday Cupcakes",
    description:
      "Peppermint chocolate, eggnog vanilla, and cranberry orange.",
    options: [
      { label: "Box of 6", value: "cupcakes-6", price: 24 },
      { label: "Box of 12", value: "cupcakes-12", price: 44 },
    ],
    imageAlt: "Box of festive holiday cupcakes",
  },
];
