import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import Pagination from "../../../components/UI/AdminDashboard/Pagination";
import { deleteEvent, getEvents, restoreEvent } from "../../../APIs/adminDashboardApis";
import Loading from "../../../components/Layout/LoadingLayout";
import { Title } from "react-head";


function Badge({ label, className }) {
  return (
    <span
      className={`text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-wide ${className}`}
    >
      {label}
    </span>
  );
}

const TYPE_STYLES = {
  ticketed: "bg-blue-200/60 text-blue-400 border-blue-700",
  free: "bg-emerald-200/60 text-emerald-400 border-emerald-700",
};

const MODE_STYLES = {
  single: "bg-purple-200/60 text-purple-400 border-purple-700",
  recurring: "bg-yellow-200/60 text-yellow-400 border-yellow-700",
};

 function EventDialog({ event: initial, onClose }) {
  const { t } = useTranslation();

  const [event, setEvent] = useState(initial);
  const [action, setAction] = useState(null); // delete | restore
  const [confirm, setConfirm] = useState(false);
  const [result, setResult] = useState(null);

  const safe = (val) => {
    if (val === null || val === undefined) return "—";
    if (typeof val === "object") return JSON.stringify(val);
    return String(val);
  };

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  const isDeleted = !!event?.deletedAt;

  const handleConfirm = async() => {
    if (!confirm) return;
    try{
      
      if (action === "delete") {
        await  handleDelete();
        const now = new Date().toISOString();
        setEvent((e) => ({ ...e, deletedAt: now }));
        setResult({
          success: true,
          action: "delete",
          time: now,
        });
      } else {
        await handleRestore();
        setEvent((e) => ({ ...e, deletedAt: null }));
        setResult({
          success: true,
          action: "restore",
          time: new Date().toISOString(),
        });
      }
  
      setAction(null);
      setConfirm(false);
    }catch(error){
      console.error(error)
    }
  };

    const handleDelete=async()=>{
      try {
         await deleteEvent(event.id);
      } catch (error) {
        console.error(error)
        throw error;
      }
    }

      const handleRestore=async()=>{
        try {
           await restoreEvent(event.id);
        } catch (error) {
          console.error(error)
          throw error;
        }
      }
  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6"
    >
      <div className="w-full max-w-5xl bg-white  border border-gray-700 rounded-xl shadow-2xl overflow-hidden">

        {/* header */}
        <div className="flex justify-between items-start px-5 py-4 border-b border-gray-700 bg-primary">
          <div>
            <p className=" font-semibold text-white">
              {safe(event.title)}
            </p>
            <p className="text-sm text-gray-200 font-mono mt-1">
              #{safe(event.id)} · {safe(event.slug)}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-100 hover:text-gray-500 text-lg px-1"
          >
            ✕
          </button>
        </div>

        {/* body */}
        <div className="p-5 flex flex-col gap-4">

          {/* badges */}
          <div className="flex flex-wrap gap-2">
            <Badge
              label={safe(event.type)}
              className={TYPE_STYLES[event.type] ?? TYPE_STYLES.free}
            />

            <Badge
              label={safe(event.mode)}
              className={MODE_STYLES[event.mode] ?? MODE_STYLES.single}
            />

            {event.hasSeatMap && (
              <Badge label={t("eventDialog.status.seatMap")} className="bg-emerald-900/30 text-emerald-400 border-emerald-700" />
            )}

            {isDeleted ? (
              <Badge
                label={t("eventDialog.status.deleted")}
                className="bg-red-600 hover:bg-red-700 text-white border-red-400"
              />
            ) : (
              <Badge
                label={t("eventDialog.status.active")}
                className="bg-emerald-400/30 text-emerald-400 border-emerald-600"
              />
            )}
          </div>



          {/* details grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2  p-4 rounded-lg ">

            {[
              ["id", event.id],
              ["organizerId", event.organizerId],
              ["title", event.title],
              ["slug", event.slug],

              ["categoryId", event.category?.id],
              ["categoryName", event.category?.name],

              ["venueName", event.venue?.name],
              ["address", event.venue?.address],
              ["city", event.venue?.city],
              ["country", event.venue?.country],

              ["tags", event.tags?.length ? event.tags.join(", ") : "—"],

              ["hasSeatMap", event.hasSeatMap ? t("common.yes") : t("common.no")],

              ["createdAt", fmtDate(event.createdAt)],
              ["updatedAt", fmtDate(event.updatedAt)],
              ["deletedAt", fmtDate(event?.deletedAt)],
            ].map(([key, val]) => (
              <div key={key} className="flex gap-2">
                <span className=" font-semibold">
                  {t(`eventDialog.fields.${key}`, { defaultValue: key })}:
                </span>

                <span className="text-slate-700  break-all">
                  {safe(val)}
                </span>
              </div>
            ))}

          </div>

          {/* actions */}
          <div className="flex gap-2">
            {!isDeleted ? (
              <button
                onClick={() => {
                  setAction("delete");
                  setConfirm(false);
                  setResult(null);
                }}
                className={`px-4 py-1.5 text-xs font-semibold rounded border transition
                ${
                  action === "delete"
                    ?
                    "bg-red-600/30 border-red-700 text-red-400 hover:bg-red-800/40"
                    :
                    "bg-red-600 hover:bg-red-700 text-white  outline-red-700"
                }`}
              >
                {t("buttons.deleteEvent")}
              </button>
            ) : (
              <button
                onClick={() => {
                  setAction("restore");
                  setConfirm(false);
                  setResult(null);
                }}
                className={`px-4 py-1.5 text-xs font-semibold rounded border transition
                ${
                  action === "restore"
                    ? "bg-blue-600 hover:bg-blue-700 text-white  outline-blue-700"
                    : "bg-blue-400/30 border-blue-700 text-blue-400 hover:bg-blue-600/40"
                }`}
              >
                {t("buttons.restoreEvent")}
              </button>
            )}
          </div>

          {/* confirm */}
          {action && (
            <div className="flex items-center justify-between gap-4 bg-primary/80 border border-gray-700 rounded-lg px-4 py-2 text-xs">
              <label className="flex items-center gap-2 text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirm}
                  onChange={(e) => setConfirm(e.target.checked)}
                  className="accent-blue-500"
                />
                {t(`confirm.${action}Event`)}
              </label>

              <button
                onClick={handleConfirm}
                disabled={!confirm}
                className={`px-4 py-1 rounded text-white text-xs font-semibold
                ${
                  confirm
                    ? action === "delete"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-600 cursor-not-allowed opacity-50"
                }`}
              >
                {t("buttons.confirm")}
              </button>
            </div>
          )}

          {/* result */}
          {result && (
            <div className="bg-emerald-300/30 border border-emerald-700 text-emerald-400 text-xs px-4 py-2 rounded font-mono">
              ✓ {result.action === "delete"
                ? t("eventDialog.deletedSuccess", { time: fmtDate(result.time) })
                : t("eventDialog.restoredSuccess", { time: fmtDate(result.time) })
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default function ListEventsPanel() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [eventsList, setEventsList] = useState();
  const [pagination, setpagination] = useState();
    const [loading, setloading] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  // const { users, pagination } = MOCK_RESPONSE;
     const handleGetData =async()=>{
        try {
          setloading(true)
          // await adminDashboardauth.refreshtoken();
          const response = await getEvents(page, showDeleted);
          setEventsList(response.data.data.events);
          setpagination(response.data.data.pagination);
        } catch (error) {
          console.error(error);
        }finally{
      setloading(false)
    }
      }
    
      useEffect(() => {
        handleGetData();
      }, [page, showDeleted]);

  // const { events, pagination } = MOCK_RESPONSE;

  const fmtDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";


  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
            <Title>{t("actions.listEvents")}</Title>
            <label className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-lg border border-gray-300 hover:border-primary transition shadow-sm mr-2">
                <input
                    type="checkbox"
                    checked={showDeleted}
                    onChange={(e) => {
                        setShowDeleted(e.target.checked);
                        setPage(1);
                    }}
                    className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-700">
                    {t("table.showDeletedOnly", { defaultValue: "Show Deleted Only" })}
                </span>
            </label>
        </div>
        <div
          className="rounded-xl border border-gray-700 overflow-hidden"
        >
          <table className="w-full text-sm border-collapse">
            <thead className="bg-primary text-white uppercase text-xs tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">{t("table.id")}</th>
                <th className="px-4 py-3 text-left">{t("table.title")}</th>
                <th className="px-4 py-3 text-center">{t("table.type")}</th>
                <th className="px-4 py-3 text-center">{t("table.mode")}</th>
                <th className="px-4 py-3 text-center">{t("table.status")}</th>
                <th className="px-4 py-3 text-left">{t("table.createdAt")}</th>
                <th className="px-4 py-3 text-left">{t("table.deletedAt")}</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {eventsList?.map((ev) => (
                <tr
                  key={ev.id}
                  onClick={() => setSelected(ev)}
                  className="cursor-pointer hover:bg-primary/10 transition"
                >
                  <td className="px-4 py-3 text-sm text-gray-400">{ev.id}</td>

                  <td className="px-4 py-3 ">{ev.title}</td>

                  <td className="px-4 py-3 text-center">
                    <Badge label={ev.type} className={TYPE_STYLES[ev.type]} />
                  </td>

                  <td className="px-4 py-3 text-center">
                    <Badge label={ev.mode} className={MODE_STYLES[ev.mode]} />
                  </td>

                  <td className="px-4 py-3 text-center">
                    {ev.deletedAt ? (
                      <Badge
                        className="bg-red-400/30 text-red-400 border-red-700"
                        label={t("eventDialog.status.deleted")}
                      />
                    ) : (
                      <Badge
                        className="bg-emerald-400/30 text-emerald-400 border-emerald-700"
                        label={t("eventDialog.status.active")}
                      />
                    )}
                  </td>

                  <td className="px-4 py-3 text-xs text-gray-400">
                    {fmtDate(ev.createdAt)}
                  </td>

                  <td className="px-4 py-3 text-xs text-gray-400">
                    {fmtDate(ev.deletedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      <Pagination
        page={page}
        total={pagination?.total}
        limit={pagination?.limit}
        onChange={ setPage}
      />
      </div>
      {loading && <Loading />}
      {/* ── dialog ── */}
      {selected && (
        <EventDialog event={selected} onClose={() => setSelected(null)} t={t} />
      )}
    </>
  );
}
