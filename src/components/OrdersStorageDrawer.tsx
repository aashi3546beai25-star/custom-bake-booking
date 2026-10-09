import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { PackageCheck, Database, CheckCircle2, Clock, Trash2, X, RefreshCw, ShoppingBag } from "lucide-react";
import { getStoredOrders, getCakeDraft, getHolidayDraft, clearCakeDraft, clearHolidayDraft, type StoredOrderReceipt } from "@/lib/storage";
import { bakeryApi } from "@/lib/api";
import { Link } from "@tanstack/react-router";

export function OrdersStorageDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState<StoredOrderReceipt[]>([]);
  const [cakeDraft, setCakeDraft] = useState<any>(null);
  const [holidayDraft, setHolidayDraft] = useState<any>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const refresh = () => {
    setOrders(getStoredOrders());
    setCakeDraft(getCakeDraft());
    setHolidayDraft(getHolidayDraft());
  };

  useEffect(() => {
    setMounted(true);
    refresh();
    const handleStorageUpdate = () => refresh();
    window.addEventListener("sweetcrumb_orders_updated", handleStorageUpdate);
    window.addEventListener("storage", handleStorageUpdate);
    return () => {
      window.removeEventListener("sweetcrumb_orders_updated", handleStorageUpdate);
      window.removeEventListener("storage", handleStorageUpdate);
    };
  }, []);

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      await bakeryApi.syncPendingOrders();
      refresh();
    } finally {
      setIsSyncing(false);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear your local order history?")) {
      localStorage.removeItem("sweetcrumb_order_history_v1");
      refresh();
    }
  };

  const totalCount = orders.length + (cakeDraft ? 1 : 0) + (holidayDraft ? 1 : 0);

  return (
    <>
      {/* Header Button Trigger */}
      <button
        onClick={() => {
          refresh();
          setIsOpen(true);
        }}
        className="relative flex items-center gap-1.5 rounded-full border border-[#e5b967]/30 bg-[#1c1511] px-3.5 py-1.5 text-xs font-semibold text-[#f3e8d9] transition-all hover:border-[#e5b967] hover:bg-[#251d18]"
        title="View local storage & database synced orders"
      >
        <ShoppingBag className="h-3.5 w-3.5 text-[#e5b967]" />
        <span className="hidden sm:inline">My Orders</span>
        {totalCount > 0 && (
          <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#e5b967] px-1 text-[10px] font-bold text-[#140f0c]">
            {totalCount}
          </span>
        )}
      </button>

      {/* Slide-out Drawer (Mounted via React Portal into document.body) */}
      {mounted &&
        isOpen &&
        createPortal(
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsOpen(false);
            }}
            className="fixed inset-0 z-[100] flex justify-end bg-black/75 backdrop-blur-sm transition-opacity duration-300"
          >
            <div className="relative flex h-full w-full max-w-md flex-col border-l border-[#e5b967]/20 bg-[#140f0c] p-6 shadow-2xl text-[#f3e8d9] overflow-hidden animate-in slide-in-from-right duration-300">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#e5b967]/20 pb-4">
                <div className="flex items-center gap-2.5">
                  <Database className="h-5 w-5 text-[#e5b967]" />
                  <div>
                    <h2 className="font-display text-lg font-bold text-[#f3e8d9]">Order Storage & DB Sync</h2>
                    <p className="text-xs text-[#b8a695]">Offline Cache & Database Records</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-1.5 hover:bg-white/10 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Sync Bar */}
              <div className="mt-4 flex items-center justify-between rounded-xl border border-[#e5b967]/20 bg-[#1c1511] p-3 text-xs">
                <span className="flex items-center gap-2 text-[#b8a695]">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Connected to Supabase DB
                </span>
                <button
                  onClick={handleManualSync}
                  disabled={isSyncing}
                  className="flex items-center gap-1 font-semibold text-[#e5b967] hover:underline disabled:opacity-50"
                >
                  <RefreshCw className={`h-3 w-3 ${isSyncing ? "animate-spin" : ""}`} />
                  <span>{isSyncing ? "Syncing..." : "Sync Now"}</span>
                </button>
              </div>

              {/* Content List */}
              <div className="flex-1 overflow-y-auto space-y-4 my-4 pr-1">
                {/* Active Drafts Notice */}
                {(cakeDraft || holidayDraft) && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#e5b967]">Saved Drafts</span>
                    {cakeDraft && (
                      <div className="rounded-xl border border-[#e5b967]/30 bg-[#251d18]/80 p-3.5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm">🎂 Custom Cake Draft</span>
                          <button
                            onClick={() => {
                              clearCakeDraft();
                              refresh();
                            }}
                            className="text-xs text-rose-400 hover:underline"
                          >
                            Discard
                          </button>
                        </div>
                        <p className="text-xs text-[#b8a695]">
                          {cakeDraft.size} • {cakeDraft.flavor} • {cakeDraft.pickup_date || "No date picked"}
                        </p>
                        <Link
                          to="/order"
                          onClick={() => setIsOpen(false)}
                          className="inline-block text-xs font-semibold text-[#e5b967] hover:underline"
                        >
                          Resume Order →
                        </Link>
                      </div>
                    )}

                    {holidayDraft && (
                      <div className="rounded-xl border border-[#e5b967]/30 bg-[#251d18]/80 p-3.5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm">🎄 Holiday Special Draft</span>
                          <button
                            onClick={() => {
                              clearHolidayDraft();
                              refresh();
                            }}
                            className="text-xs text-rose-400 hover:underline"
                          >
                            Discard
                          </button>
                        </div>
                        <p className="text-xs text-[#b8a695]">
                          Qty: {holidayDraft.quantity} • {holidayDraft.item} • {holidayDraft.date || "No date"}
                        </p>
                        <Link
                          to="/holiday-order"
                          onClick={() => setIsOpen(false)}
                          className="inline-block text-xs font-semibold text-[#e5b967] hover:underline"
                        >
                          Resume Pre-order →
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {/* Order History */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#e5b967]">
                      Recent Orders ({orders.length})
                    </span>
                    {orders.length > 0 && (
                      <button
                        onClick={handleClearHistory}
                        className="flex items-center gap-1 text-[11px] text-[#b8a695] hover:text-rose-400"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Clear</span>
                      </button>
                    )}
                  </div>

                  {orders.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-[#e5b967]/20 p-8 text-center text-xs text-[#b8a695]">
                      <PackageCheck className="mx-auto h-8 w-8 opacity-40 mb-2" />
                      <p>No orders placed yet.</p>
                      <p className="mt-1">When you place an order, receipts are saved locally and synced with the database.</p>
                    </div>
                  ) : (
                    orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="rounded-xl border border-[#e5b967]/20 bg-[#1c1511] p-3.5 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm text-[#f3e8d9]">{ord.title}</span>
                          {ord.status === "synced" ? (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                              <CheckCircle2 className="h-2.5 w-2.5" />
                              DB Synced
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30">
                              <Clock className="h-2.5 w-2.5" />
                              Local Cache
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-[#b8a695] line-clamp-2">{ord.details}</p>

                        <div className="flex items-center justify-between pt-1 border-t border-[#e5b967]/10 text-[11px] text-[#b8a695]">
                          <span>Pickup: <strong className="text-[#f3e8d9]">{ord.pickup_date}</strong></span>
                          <span>{new Date(ord.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="border-t border-[#e5b967]/20 pt-4 flex gap-2">
                <Link
                  to="/order"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 rounded-full bg-[#e5b967] py-2.5 text-center text-xs font-bold text-[#140f0c] hover:brightness-110 transition-all"
                >
                  Place New Cake Order
                </Link>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
