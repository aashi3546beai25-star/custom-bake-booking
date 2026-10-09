/**
 * 📦 Local Storage & Client Cache Layer for Sweet Crumb Bakery
 * Provides automatic draft saving, past order caching, offline queueing,
 * and profile persistence connected with the Supabase database.
 */

export interface CustomerProfile {
  name: string;
  email: string;
  phone: string;
}

export interface CakeOrderDraft {
  size: string;
  flavor: string;
  pickup_date: string;
  design: string;
  writing_on_cake: string;
  customer_name: string;
  email: string;
  phone: string;
  updatedAt: string;
}

export interface HolidayOrderDraft {
  customer_name: string;
  phone: string;
  email: string;
  item: string;
  quantity: number;
  fulfillment: "pickup" | "delivery";
  date: string;
  notes: string;
  updatedAt: string;
}

export interface StoredOrderReceipt {
  id: string;
  type: "custom-cake" | "holiday-special";
  title: string;
  details: string;
  pickup_date: string;
  customer_name: string;
  email: string;
  phone?: string | null;
  status: "synced" | "pending_sync";
  createdAt: string;
}

const STORAGE_KEYS = {
  CAKE_DRAFT: "sweetcrumb_cake_draft_v1",
  HOLIDAY_DRAFT: "sweetcrumb_holiday_draft_v1",
  PROFILE: "sweetcrumb_customer_profile_v1",
  ORDERS: "sweetcrumb_order_history_v1",
  OFFLINE_QUEUE: "sweetcrumb_offline_queue_v1",
} as const;

// Safe window check for SSR
function isClient(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

// -------------------------------------------------------------
// 1. Customer Profile Storage
// -------------------------------------------------------------
export function saveStoredProfile(profile: Partial<CustomerProfile>): void {
  if (!isClient()) return;
  try {
    const existing = getStoredProfile() || {};
    const updated = { ...existing, ...profile };
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
  } catch (err) {
    console.warn("Could not save profile to localStorage:", err);
  }
}

export function getStoredProfile(): Partial<CustomerProfile> | null {
  if (!isClient()) return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// -------------------------------------------------------------
// 2. Draft Storage (Auto-save & Restore)
// -------------------------------------------------------------
export function saveCakeDraft(draft: Omit<CakeOrderDraft, "updatedAt">): void {
  if (!isClient()) return;
  try {
    const payload: CakeOrderDraft = {
      ...draft,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.CAKE_DRAFT, JSON.stringify(payload));
  } catch (err) {
    console.warn("Could not save cake draft:", err);
  }
}

export function getCakeDraft(): CakeOrderDraft | null {
  if (!isClient()) return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CAKE_DRAFT);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearCakeDraft(): void {
  if (!isClient()) return;
  try {
    localStorage.removeItem(STORAGE_KEYS.CAKE_DRAFT);
  } catch {}
}

export function saveHolidayDraft(draft: Omit<HolidayOrderDraft, "updatedAt">): void {
  if (!isClient()) return;
  try {
    const payload: HolidayOrderDraft = {
      ...draft,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.HOLIDAY_DRAFT, JSON.stringify(payload));
  } catch (err) {
    console.warn("Could not save holiday draft:", err);
  }
}

export function getHolidayDraft(): HolidayOrderDraft | null {
  if (!isClient()) return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HOLIDAY_DRAFT);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearHolidayDraft(): void {
  if (!isClient()) return;
  try {
    localStorage.removeItem(STORAGE_KEYS.HOLIDAY_DRAFT);
  } catch {}
}

// -------------------------------------------------------------
// 3. Stored Confirmed Orders History (Synced with Database)
// -------------------------------------------------------------
export function saveOrderReceipt(receipt: StoredOrderReceipt): void {
  if (!isClient()) return;
  try {
    const existing = getStoredOrders();
    // Filter out duplicates by ID
    const updated = [receipt, ...existing.filter((o) => o.id !== receipt.id)];
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated.slice(0, 30)));
    
    // Auto-update profile
    saveStoredProfile({
      name: receipt.customer_name,
      email: receipt.email,
      phone: receipt.phone || undefined,
    });

    // Dispatch event so UI components can re-render immediately
    window.dispatchEvent(new CustomEvent("sweetcrumb_orders_updated"));
  } catch (err) {
    console.warn("Could not save order receipt:", err);
  }
}

export function getStoredOrders(): StoredOrderReceipt[] {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function updateStoredOrderStatus(orderId: string, status: StoredOrderReceipt["status"]): void {
  if (!isClient()) return;
  try {
    const orders = getStoredOrders().map((o) => (o.id === orderId ? { ...o, status } : o));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    window.dispatchEvent(new CustomEvent("sweetcrumb_orders_updated"));
  } catch {}
}

// -------------------------------------------------------------
// 4. Offline Queue
// -------------------------------------------------------------
export function queueOfflineOrder(order: StoredOrderReceipt): void {
  if (!isClient()) return;
  try {
    const existingRaw = localStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE);
    const existing: StoredOrderReceipt[] = existingRaw ? JSON.parse(existingRaw) : [];
    const updated = [...existing.filter((o) => o.id !== order.id), order];
    localStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(updated));
  } catch {}
}

export function getOfflineQueue(): StoredOrderReceipt[] {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearOfflineQueue(): void {
  if (!isClient()) return;
  try {
    localStorage.removeItem(STORAGE_KEYS.OFFLINE_QUEUE);
  } catch {}
}
