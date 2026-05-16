import { useState, useRef, useEffect } from "react";
import { useTranslation, Trans } from "react-i18next";
import { addCategory, deleteCategory, editCategory, getCategories } from "../../../APIs/adminDashboardApis";
import Loading from "../../../components/Layout/LoadingLayout";


/* ── Shared dialog backdrop ─────────────────────────────────────────────── */
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

/* ── Shared dialog shell ────────────────────────────────────────────────── */
function DialogShell({ title, subtitle, onClose, children }) {
  return (
    <div className="w-full max-w-[480px] overflow-hidden rounded-lg border border-black bg-white shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
      {/* header */}
      <div className="flex items-start justify-between border-b border-secandry bg-white px-5 py-3.5">
        <div>
          <p className="m-0 text-[20px] font-semibold text-primary">{title}</p>

          {subtitle && <p className="mt-[3px] text-sm  ">{subtitle}</p>}
        </div>

        <button
          onClick={onClose}
          className="cursor-pointer border-none bg-white px-1 text-[18px] "
        >
          ✕
        </button>
      </div>

      {/* body */}
      <div className="flex flex-col gap-9 px-5 py-[18px]">{children}</div>
    </div>
  );
}

/* ── Shared input ───────────────────────────────────────────────────────── */
function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-[5px]">
      <label className="text-[11px] font-medium uppercase tracking-[0.06em] ">
        {label}
      </label>

      {children}
    </div>
  );
}

const inputStyle =
  "w-full box-border rounded-[7px] border border-secandry  px-[11px] py-[7px] text-[13px]  outline-none";

/* ── Detail / Edit / Delete dialog ─────────────────────────────────────── */
function CategoryDetailDialog({ category, onClose, onDelete,onUpdate }) {
  const { t } = useTranslation();
  const fileRef = useRef(null);

  const [mode, setMode] = useState("view");
  const [name, setName] = useState(category.name);
  const [preview, setPreview] = useState(category.imageUrl);
  const [file, setFile] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const [result, setResult] = useState(null);

  // loading states
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // error state
  const [error, setError] = useState("");

  const fmtDate = (d) =>
    new Date(d).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  /* ───────────────── UPDATE ───────────────── */
  const handleUpdate = async () => {
    if (!name.trim()) return;

    try {
      setError("");
      setIsUpdating(true);

      // create form data because image upload exists
      const formData = new FormData();

      formData.append("name", name.trim());

      if (file) {
        formData.append("image", file);
      }

      /*
        Replace later with your real endpoint
      */
      const response = await editCategory(category.id, formData);

      /*
        update parent state with REAL backend data
      */
      onUpdate(response.data.data.category);

      /*
        update parent state with REAL backend data
      */

      setMode("view");
      setFile(null);
    } catch (err) {
      console.error(err);
      setError(err.message || t("apiErrors.UNKNOWN_ERROR"));
    } finally {
      setIsUpdating(false);
    }
  };

  /* ───────────────── DELETE ───────────────── */
  const handleDelete = async () => {
    if (!confirm) return;

    try {
      setError("");
      setIsDeleting(true);

      /*
        Replace later with your real endpoint
      */
     console.log(category.id)
       await deleteCategory(category.id);


      /*
        remove from UI only AFTER backend success
      */
      onDelete(category.id);

      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || t("apiErrors.UNKNOWN_ERROR"));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Backdrop onClose={onClose}>
      <DialogShell
        title={
          mode === "edit"
            ? t("admin.categories.editTitle", { name: category.name })
            : mode === "delete"
              ? t("admin.categories.deleteTitle", { name: category.name })
              : category.name
        }
        subtitle={`${t("admin.categories.idLabel", { id: category.id })} · ${t("admin.categories.createdAtLabel", { date: fmtDate(category.createdAt) })}`}
        onClose={onClose}
      >
        {/* ERROR */}
        {error && (
          <div className="rounded-md border border-red-800 bg-red-950 px-3 py-2 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* ── VIEW mode ── */}
        {mode === "view" && (
          <>
            <img
              src={category.imageUrl}
              alt={category.name}
              className="h-[200px] w-full rounded-md bg-slate-800 object-cover"
            />

            {result && (
              <div className="rounded-md border border-green-800 bg-green-950 px-3 py-[7px] font-mono text-[12px] text-green-400">
                ✓ {t("admin.categories.updatedSuccess", { name: result.name })}
              </div>
            )}

            <div className="mt-0.5 flex gap-2">
              <button
                onClick={() => {
                  setMode("edit");
                  setResult(null);
                }}
                className="flex-1 cursor-pointer rounded-[7px] border-none bg-primary py-[7px] text-[13px] font-semibold text-white"
              >
                {t("buttons.update")}
              </button>

              <button
                onClick={() => {
                  setMode("delete");
                  setConfirm(false);
                }}
                className="flex-1 cursor-pointer rounded-[7px] border border-red-900 bg-red-600 py-[7px] text-[13px] font-semibold text-white transition-all duration-300 hover:opacity-80"
              >
                {t("buttons.deleteCategory")}
              </button>
            </div>
          </>
        )}

        {/* ── EDIT mode ── */}
        {mode === "edit" && (
          <>
            <img
              src={preview}
              alt="preview"
              className="h-[180px] w-full rounded-md bg-slate-800 object-cover"
            />

            <Field
              label={t("fields.categoryName")}
            >
              <input
                className={inputStyle}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Music"
              />
            </Field>

            <Field
              label={t("fields.categoryImage")}
            >
              <div
                onClick={() => fileRef.current?.click()}
                className="cursor-pointer rounded-[7px] border border-dashed border-secandry px-3.5 py-2.5 text-center text-[12px] text-secandry"
              >
                {file
                  ? `📎 ${file.name}`
                  : t("fields.chooseFile")}
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </Field>

            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                disabled={!name.trim() || isUpdating}
                className={`flex-1 rounded-[7px] border-none py-[7px] text-[13px] font-semibold text-white ${
                  !name.trim() || isUpdating
                    ? "cursor-not-allowed opacity-45"
                    : "cursor-pointer opacity-100"
                } bg-primary`}
              >
                {isUpdating
                  ? t("buttons.saving")
                  : t("buttons.saveChanges")}
              </button>

              <button
                onClick={() => {
                  setMode("view");
                  setName(category.name);
                  setPreview(category.imageUrl);
                  setFile(null);
                }}
                disabled={isUpdating}
                className="cursor-pointer rounded-[7px] border border-secandry bg-transparent px-4 py-[7px] text-[13px] text-secandry"
              >
                {t("buttons.cancel")}
              </button>
            </div>
          </>
        )}

        {/* ── DELETE mode ── */}
        {mode === "delete" && (
          <>
            <img
              src={category.imageUrl}
              alt={category.name}
              className="h-40 w-full rounded-md bg-slate-800 object-cover opacity-50"
            />

            <p className="m-0 text-[13px] leading-[1.6] text-secandry">
              <Trans
                i18nKey="admin.categories.deleteWarning"
                values={{ name: category.name }}
                components={{ strong: <strong /> }}
              />
            </p>

            <label className="flex cursor-pointer select-none items-center gap-2 text-[12px] text-gray-400">
              <input
                type="checkbox"
                checked={confirm}
                onChange={(e) => setConfirm(e.target.checked)}
                className="h-3.5 w-3.5 accent-primary"
              />

              {t("confirm.deleteCategory")}
            </label>

            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                disabled={!confirm || isDeleting}
                className={`flex-1 rounded-[7px] border border-red-800 py-[7px] text-[13px] font-semibold text-red-300 ${
                  !confirm || isDeleting
                    ? "cursor-not-allowed opacity-45"
                    : "cursor-pointer opacity-100"
                } bg-red-900`}
              >
                {isDeleting
                  ? t("buttons.deleting")
                  : t("buttons.deleteCategory")}
              </button>

              <button
                onClick={() => {
                  setMode("view");
                  setConfirm(false);
                }}
                disabled={isDeleting}
                className="cursor-pointer rounded-[7px] border border-secandry bg-transparent px-4 py-[7px] text-[13px] text-secandry"
              >
                {t("buttons.cancel")}
              </button>
            </div>
          </>
        )}
      </DialogShell>
    </Backdrop>
  );
}

/* ── Add category dialog ────────────────────────────────────────────────── */
function AddCategoryDialog({ onClose, onAdd }) {
  const { t } = useTranslation();

  const fileRef = useRef(null);

  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async() => {
    if (!name.trim() || !file) return;


        try{
      
      const formData = new FormData();

      formData.append("name", name.trim());

      if (file) {
  
        formData.append("image", file);
      }

      /*
        Replace later with your real endpoint
      */
      const response = await addCategory(formData);

    


    onAdd({
      id: response.data.data.category.id||10,
      name: name.trim(),
      imageUrl: preview,
      createdAt: new Date().toISOString(),
    });

    onClose();
  }catch(error){
      console.error(error);
    }
  };

  // const handleAppCategory = () => {


  // };

  return (
    <Backdrop onClose={onClose}>
      <DialogShell
        title={t("actions.addCategory")}
        onClose={onClose}
      >
        {/* image preview */}
        <div
          onClick={() => fileRef.current?.click()}
          className="relative flex h-40 w-full cursor-pointer items-center justify-center overflow-hidden rounded-md border border-dashed border-secandry "
        >
          {preview ? (
            <img
              src={preview}
              alt="preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-[12px] text-gray-600">
              {t("fields.uploadImage")}
            </span>
          )}
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <Field
          label={t("fields.categoryName")}
        >
          <input
            className={inputStyle}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Music"
            autoFocus
          />
        </Field>

        {file && (
          <div className="font-mono text-[11px] text-gray-600">
            📎 {file.name} ({(file.size / 1024).toFixed(1)} KB)
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!name.trim() || !file}
          className={`rounded-[7px] border-none py-2 text-[13px] font-semibold text-white ${
            name.trim() && file
              ? "cursor-pointer opacity-100"
              : "cursor-not-allowed opacity-45"
          } bg-primary`}
        >
          {t("buttons.addCategory")}
        </button>
      </DialogShell>
    </Backdrop>
  );
}

/* ── Category card ──────────────────────────────────────────────────────── */
function CategoryCard({ category, onClick }) {
  return (
    <div
      onClick={() => onClick(category)}
      className="cursor-pointer overflow-hidden rounded-lg border  transition-all duration-150 hover:-translate-y-0.5 hover:border-secandry"
    >
      {/* image */}
      <div className="relative h-[130px] w-full overflow-hidden bg-[#0d1117]">
        <img
          src={category.imageUrl}
          alt={category.name}
          className="h-full w-full object-cover transition-transform duration-200 hover:scale-[1.04]"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      </div>

      {/* info */}
      <div className="px-3 pb-[11px] pt-[9px]">
        <p className="m-0 overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-semibold ">
          {category.name}
        </p>

        <p className="mt-[3px] font-mono text-[10px] text-gray-600">
          ID: {category.id}
        </p>
      </div>
    </div>
  );
}

/* ── Main panel ─────────────────────────────────────────────────────────── */
export default function ListCategoriesPanel() {
  const { t } = useTranslation();

  const [categories, setCategories] = useState();

  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setloading] = useState(false);

  const handleDelete = (id) =>
    setCategories((prev) => prev.filter((c) => c.id !== id));

  const handleUpdate = (updated) =>
    setCategories((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c)),
    );

  const handleAdd = (newCat) => setCategories((prev) => [newCat, ...prev]);

  const handleLoadCategories = async () => {
    try {
      setloading(true);
      // await adminDashboardauth.refreshtoken();
      const response = await getCategories();

      setCategories(response.data.data.categories);
    } catch (error) {
      console.error(error);
    } finally {
      setloading(false);
    }
  };
  useEffect(() => {
    handleLoadCategories();
  }, []);

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* toolbar */}
        <div className="flex items-center justify-between">
          <p className="m-0 text-[12px] text-gray-600">
            {categories?.length}{" "}
            {t("table.categories")}
          </p>

          <button
            onClick={() => setShowAdd(true)}
            className="flex cursor-pointer items-center gap-1.5 rounded-[7px] border-none bg-primary px-4 py-1.5 text-[12px] font-semibold text-white"
          >
            <span className="text-[16px] leading-none">+</span>

            {t("buttons.addCategory")}
          </button>
        </div>

        {/* grid */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3">
          {categories?.map((cat) => (
            <CategoryCard key={cat.id} category={cat} onClick={setSelected} />
          ))}
        </div>

        {categories?.length === 0 && (
          <div className="py-10 text-center text-[13px] text-gray-600">
            {t("admin.categories.noCategories")}
          </div>
        )}
      </div>

      {/* detail dialog */}
      {selected && (
        <CategoryDetailDialog
          category={selected}
          onClose={() => setSelected(null)}
          onDelete={(id) => {
            handleDelete(id);
            setSelected(null);
          }}
          onUpdate={(updated) => {
            handleUpdate(updated);
            setSelected(updated);
          }}
        />
      )}

      {/* add dialog */}
      {showAdd && (
        <AddCategoryDialog
          onClose={() => setShowAdd(false)}
          onAdd={handleAdd}
        />
      )}
      {loading && <Loading />}
    </>
  );
}
