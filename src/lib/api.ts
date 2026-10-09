/**
 * 🌐 Sweet Crumb Bakery — Unified API Client
 * Bridges Frontend, LocalStorage Cache, and Supabase Database Backend.
 */

import { supabase } from "@/integrations/supabase/client";
import {
  saveOrderReceipt,
  saveCakeDraft,
  clearCakeDraft,
  saveHolidayDraft,
  clearHolidayDraft,
  getOfflineQueue,
  clearOfflineQueue,
  updateStoredOrderStatus,
  type StoredOrderReceipt,
} from "./storage";
import { holidayItems } from "./holiday-config";
import { dispatchAutomatedOrderNotifications } from "./notifications";

export interface CreateCakeOrderPayload {
  size: "6 inch" | "8 inch" | "10 inch" | "2-tier";
  flavor: string;
  pickup_date: string;
  design: string;
  writing_on_cake?: string;
  customer_name: string;
  email: string;
  phone?: string;
}

export interface CreateHolidayOrderPayload {
  customer_name: string;
  phone: string;
  email: string;
  item: string;
  quantity: number;
  fulfillment: "pickup" | "delivery";
  date: string;
  notes?: string;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  fromCache?: boolean;
}

export const bakeryApi = {
  /**
   * 🎂 1. Create a custom cake order.
   * Stores in Supabase database, persists receipt in localStorage,
   * and automatically sends email and SMS confirmation messages.
   */
  async createCakeOrder(payload: CreateCakeOrderPayload): Promise<ApiResponse<{ id: string }>> {
    const tempId = `cake_${Date.now()}`;
    const fullDesign = payload.writing_on_cake
      ? `${payload.design}\n[Writing on cake: ${payload.writing_on_cake}]`
      : payload.design;

    // Create a local receipt immediately
    const receipt: StoredOrderReceipt = {
      id: tempId,
      type: "custom-cake",
      title: `${payload.size} ${payload.flavor} Cake`,
      details: fullDesign,
      pickup_date: payload.pickup_date,
      customer_name: payload.customer_name,
      email: payload.email,
      phone: payload.phone || null,
      status: "pending_sync",
      createdAt: new Date().toISOString(),
    };

    // 🔔 Dispatch automated background email & SMS notification
    dispatchAutomatedOrderNotifications({
      orderId: tempId,
      orderType: "custom-cake",
      customerName: payload.customer_name,
      customerEmail: payload.email,
      customerPhone: payload.phone,
      pickupDate: payload.pickup_date,
      itemDetails: `${payload.size} ${payload.flavor} Cake`,
      notes: fullDesign,
    }).catch((e) => console.warn("Background notification notice:", e));

    try {
      const { error: dbError } = await supabase.from("cake_orders").insert({
        size: payload.size,
        flavor: payload.flavor,
        pickup_date: payload.pickup_date,
        design: fullDesign,
        customer_name: payload.customer_name,
        email: payload.email,
        phone: payload.phone || null,
      });

      if (dbError) {
        if (dbError.message?.includes("DATE_FULL")) {
          return { data: null, error: "Sorry, that pickup date is fully booked. Please select another date." };
        }
        // Save locally as pending sync if network or table error
        receipt.status = "pending_sync";
        saveOrderReceipt(receipt);
        clearCakeDraft();
        return { data: { id: tempId }, error: null, fromCache: true };
      }

      // Mark receipt as synced and clear draft
      receipt.status = "synced";
      saveOrderReceipt(receipt);
      clearCakeDraft();

      return { data: { id: tempId }, error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to place order";
      receipt.status = "pending_sync";
      saveOrderReceipt(receipt);
      clearCakeDraft();
      return { data: { id: tempId }, error: message, fromCache: true };
    }
  },

  /**
   * 📅 2. Fetch fully-booked dates from database RPC with fallback.
   */
  async getFullDates(): Promise<ApiResponse<string[]>> {
    try {
      const { data, error } = await supabase.rpc("get_full_dates");
      if (error) throw error;
      return { data: (data as string[] | null) ?? [], error: null };
    } catch (err: unknown) {
      console.warn("Could not fetch full dates from database, fallback to empty list:", err);
      return { data: [], error: null, fromCache: true };
    }
  },

  /**
   * 🎄 3. Create a holiday pre-order.
   */
  async createHolidayOrder(
    payload: CreateHolidayOrderPayload,
    formspreeId?: string,
    orderEmail: string = "sweetcrumbbakery@gmail.com"
  ): Promise<ApiResponse<{ id: string }>> {
    const tempId = `holiday_${Date.now()}`;
    const selectedItem = holidayItems
      .flatMap((i) => i.options.map((o) => ({ ...o, itemName: i.name })))
      .find((o) => o.value === payload.item);

    const title = `${payload.quantity}x ${selectedItem?.itemName || "Holiday Item"} (${selectedItem?.label || payload.item})`;

    const receipt: StoredOrderReceipt = {
      id: tempId,
      type: "holiday-special",
      title,
      details: `Fulfillment: ${payload.fulfillment.toUpperCase()} | Notes: ${payload.notes || "None"}`,
      pickup_date: payload.date,
      customer_name: payload.customer_name,
      email: payload.email,
      phone: payload.phone,
      status: "synced",
      createdAt: new Date().toISOString(),
    };

    // 🔔 Dispatch automated background email & SMS notification
    dispatchAutomatedOrderNotifications({
      orderId: tempId,
      orderType: "holiday-special",
      customerName: payload.customer_name,
      customerEmail: payload.email,
      customerPhone: payload.phone,
      pickupDate: payload.date,
      itemDetails: title,
      notes: payload.notes,
    }).catch((e) => console.warn("Background notification notice:", e));

    try {
      if (formspreeId) {
        const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Form submission error");
      } else if (typeof window !== "undefined") {
        const subject = encodeURIComponent(`Holiday Order: ${payload.customer_name}`);
        const body = encodeURIComponent(
          `Name: ${payload.customer_name}\n` +
            `Phone: ${payload.phone}\n` +
            `Email: ${payload.email}\n` +
            `Item: ${title}\n` +
            `Date: ${payload.date}\n` +
            `Notes: ${payload.notes || "None"}\n`
        );
        window.location.href = `mailto:${orderEmail}?subject=${subject}&body=${body}`;
      }

      saveOrderReceipt(receipt);
      clearHolidayDraft();
      return { data: { id: tempId }, error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Submission failed";
      saveOrderReceipt(receipt);
      clearHolidayDraft();
      return { data: { id: tempId }, error: message, fromCache: true };
    }
  },

  /**
   * 🔄 4. Sync pending local orders to the database.
   */
  async syncPendingOrders(): Promise<{ syncedCount: number }> {
    const queue = getOfflineQueue();
    let synced = 0;

    for (const item of queue) {
      if (item.type === "custom-cake") {
        const { error } = await supabase.from("cake_orders").insert({
          size: "8 inch",
          flavor: "Vanilla",
          pickup_date: item.pickup_date,
          design: item.details,
          customer_name: item.customer_name,
          email: item.email,
          phone: item.phone || null,
        });
        if (!error) {
          updateStoredOrderStatus(item.id, "synced");
          synced++;
        }
      }
    }

    if (synced > 0) {
      clearOfflineQueue();
    }

    return { syncedCount: synced };
  },
};
