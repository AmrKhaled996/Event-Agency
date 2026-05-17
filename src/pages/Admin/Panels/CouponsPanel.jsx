import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { addCoupon, deleteCoupon, getCoupons } from "../../../APIs/adminDashboardApis";
import Loading from "../../../components/Layout/LoadingLayout";
import { toast } from "sonner";
import { Ticket, Trash2, Plus, Calendar, Hash, Percent } from "lucide-react";

function Backdrop({ onClose, children }) {
  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-[2px] p-6"
    >
      {children}
    </div>
  );
}

function DialogShell({ title, subtitle, onClose, children }) {
  return (
    <div className="w-full max-w-[480px] overflow-hidden rounded-lg border border-black bg-white shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
      {/* header */}
      <div className="flex items-start justify-between border-b border-gray-200 bg-white px-5 py-3.5">
        <div>
          <p className="m-0 text-[20px] font-semibold text-primary">{title}</p>
          {subtitle && <p className="mt-[3px] text-sm text-gray-500">{subtitle}</p>}
        </div>
        <button
          onClick={onClose}
          className="cursor-pointer border-none bg-white px-1 text-[18px] text-gray-400 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      {/* body */}
      <div className="flex flex-col gap-6 px-5 py-[18px]">{children}</div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-[5px]">
      <label className="text-[11px] font-medium uppercase tracking-[0.06em] text-gray-600">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle =
  "w-full box-border rounded-[7px] border border-gray-300 px-[11px] py-[7px] text-[13px] outline-none focus:border-primary transition-all";

function AddCouponDialog({ onClose, onAdd }) {
  const { t } = useTranslation();
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim() || !discount) return;

    try {
      setIsSubmitting(true);
      const response = await addCoupon({ 
        code: code.trim().toUpperCase(), 
        discount: Number(discount) 
      });

      onAdd(response.data.data.coupon);
      toast.success(t("coupons.feedback.success"));
      onClose();
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.error || error.message || t("apiErrors.UNKNOWN_ERROR");
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Backdrop onClose={onClose}>
      <DialogShell title={t("actions.addCoupon")} onClose={onClose}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label={t("table.code")}>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                className={`${inputStyle} pl-8`}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={t("admin.coupons.codePlaceholder")}
                autoFocus
                required
              />
            </div>
          </Field>

          <Field label={t("table.discount")}>
            <div className="relative">
              <Percent className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="number"
                className={`${inputStyle} pl-8`}
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                placeholder={t("admin.coupons.discountPlaceholder")}
                min="1"
                max="100"
                required
              />
            </div>
          </Field>

          <button
            type="submit"
            disabled={!code.trim() || !discount || isSubmitting}
            className={`mt-4 rounded-[7px] border-none py-2 text-[13px] font-semibold text-white ${
              code.trim() && discount && !isSubmitting
                ? "cursor-pointer bg-primary opacity-100"
                : "cursor-not-allowed bg-gray-400 opacity-45"
            }`}
          >
            {isSubmitting ? t("common.actions.loading") : t("buttons.confirm")}
          </button>
        </form>
      </DialogShell>
    </Backdrop>
  );
}

/* ── Delete Confirmation Dialog ────────────────────────────────────────── */
function DeleteConfirmDialog({ coupon, onClose, onConfirm }) {
  const { t } = useTranslation();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteCoupon(coupon.id);
      onConfirm(coupon.id);
      toast.success(t("coupons.feedback.deleted"));
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(t("common.feedback.error"));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Backdrop onClose={onClose}>
      <DialogShell 
        title={t("common.actions.delete")} 
        subtitle={coupon.code}
        onClose={onClose}
      >
        <p className="m-0 text-[14px] text-gray-600">
          {t("admin.coupons.deleteWarning")}
        </p>

        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 cursor-pointer rounded-[7px] border-none bg-red-600 py-2 text-[13px] font-semibold text-white hover:bg-red-700 transition-colors"
          >
            {isDeleting ? t("common.actions.loading") : t("common.actions.delete")}
          </button>
          <button
            onClick={onClose}
            className="flex-1 cursor-pointer rounded-[7px] border border-gray-300 bg-white py-2 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {t("common.actions.cancel")}
          </button>
        </div>
      </DialogShell>
    </Backdrop>
  );
}

export default function CouponsPanel() {
  const { t } = useTranslation();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [deletingCoupon, setDeletingCoupon] = useState(null);

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const response = await getCoupons();
      setCoupons(response.data.data.coupons || []);
    } catch (error) {
      console.error(error);
      toast.error(t("common.feedback.error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleAdd = (newCoupon) => {
    setCoupons((prev) => [newCoupon, ...prev]);
  };

  const handleDelete = (id) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  const fmtDate = (d) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="flex flex-col gap-6">
      {/* toolbar */}
      <div className="flex items-center justify-between">
        <h2 className="m-0 text-xl font-bold text-gray-800">
          {t("layout.nav.coupons")}
        </h2>
        <button
          onClick={() => setShowAdd(true)}
          className="flex cursor-pointer items-center gap-1.5 rounded-[7px] border-none bg-primary px-4 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-primary/90 transition-colors"
        >
          <Plus size={16} />
          {t("actions.addCoupon")}
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
            <tr>
              <th className="px-6 py-3 font-semibold uppercase tracking-wider">{t("table.code")}</th>
              <th className="px-6 py-3 font-semibold uppercase tracking-wider">{t("table.createdAt")}</th>
              <th className="px-6 py-3 font-semibold uppercase tracking-wider text-right">{t("table.actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/5 rounded text-primary">
                      <Ticket size={16} />
                    </div>
                    <span className="font-mono font-bold text-gray-900 tracking-wider">
                      {coupon.code}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400" />
                    {fmtDate(coupon.createdAt)}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => setDeletingCoupon(coupon)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                    title={t("common.actions.delete")}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {coupons.length === 0 && !loading && (
          <div className="py-20 text-center flex flex-col items-center gap-4 text-gray-500">
            <div className="p-4 bg-gray-50 rounded-full">
              <Ticket size={48} className="opacity-20" />
            </div>
            <p className="text-lg font-medium">{t("common.feedback.noResults")}</p>
            <p className="text-sm">{t("admin.coupons.noCoupons")}</p>
          </div>
        )}
      </div>

      {showAdd && (
        <AddCouponDialog
          onClose={() => setShowAdd(false)}
          onAdd={handleAdd}
        />
      )}

      {deletingCoupon && (
        <DeleteConfirmDialog
          coupon={deletingCoupon}
          onClose={() => setDeletingCoupon(null)}
          onConfirm={handleDelete}
        />
      )}

      {loading && <Loading />}
    </div>
  );
}
