import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Pagination from "../../../components/UI/AdminDashboard/Pagination";
import { deleteUser, getUsers, restoreUser } from "../../../APIs/adminDashboardApis";

const MOCK_RESPONSE = {
  users: [
    {
      id: "93f24500-6691-448f-92b7-9e97004475fd",
      name: "Seed Organizer User Three",
      email: "organizer3@seed.fa3liat.test",
      gender: "male",
      phone: "+201000000005",
      role: "organizer",
      location: "Tanta",
      languagePreference: "en",
      isVerified: false,
      isCompleted: true,
      birthDate: null,
      createdAt: "2026-04-25T23:36:06.320Z",
      updatedAt: "2026-04-25T23:36:06.320Z",
    },
    {
      id: "276efbc7-ccf5-4ab4-bfc8-45df43f8fcc0",
      name: "Seed Organizer User One",
      email: "organizer1@seed.fa3liat.test",
      gender: "male",
      phone: "+201000000003",
      role: "organizer",
      location: "Giza",
      languagePreference: "en",
      isVerified: true,
      isCompleted: true,
      birthDate: null,
      createdAt: "2026-04-25T23:36:06.148Z",
      updatedAt: "2026-04-25T23:36:06.148Z",
    },
    {
      id: "276efbc7-ccf5-4ab4-bfc8-45df43f8fcc0",
      name: "Seed Organizer User One",
      email: "organizer1@seed.fa3liat.test",
      gender: "male",
      phone: "+201000000003",
      role: "admin",
      location: "Giza",
      languagePreference: "en",
      isVerified: true,
      isCompleted: true,
      birthDate: null,
      createdAt: "2026-04-25T23:36:06.148Z",
      updatedAt: "2026-04-25T23:36:06.148Z",
    },
  ],
  pagination: {
    total: 3,
    page: 1,
    limit: 2,
    totalPages: 2,
    hasNext: true,
    hasPrev: false,
    nextPage: 2,
    prevPage: null,
  },
};

/* ── Role badge ───────────────────────────── */
const ROLE_STYLES = {
  admin: "bg-red-200/60 text-red-400 border-red-700",
  organizer: "bg-blue-200/60 text-blue-400 border-blue-700",
  user: "bg-emerald-200/60 text-emerald-400 border-emerald-700",
};

function RoleBadge({ role }) {
  return (
    <span
      className={`text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-wide ${
        ROLE_STYLES[role?.toLowerCase()] ??
        "bg-gray-800 text-gray-400 border-gray-600"
      }`}
    >
      {role}
    </span>
  );
}

/* ── Boolean pill ───────────────────────────── */
function BoolPill({ value, t }) {
  return (
    <span
      className={`text-xs font-semibold px-2 py-1 rounded border ${
        value
          ? "bg-emerald-500 text-white border-emerald-400"
          : "bg-red-700/80 text-white border-red-400"
      }`}
    >
      {value ? t("common.yes") : t("common.no")}
    </span>
  );
}

/* ── Row ───────────────────────────── */
function UserRow({ user, t }) {
  const [expanded, setExpanded] = useState(false);

  const shortId = (id) => `${id.slice(0, 8)}…`;

  const fmtDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";
        const [isDeleted, setisDeleted] = useState(!!user?.deletedAt);


    const handleDelete=async()=>{
      try {
        console.log("before action:")
        const response = await deleteUser(user.id);
        setisDeleted(true);
        console.log("action:", response.data)
      } catch (error) {
        console.error(error)
      }
    }
    const handleRestore=async()=>{
      try {
        console.log("before action:")
        const response = await restoreUser(user.id);
        setisDeleted(false);
        console.log("action:", response.data)
      } catch (error) {
        console.error(error)
      }
    }

  return (
    <>
      {/* main row */}
      <tr
        onClick={() => setExpanded((p) => !p)}
        className="cursor-pointer hover:bg-primary/8 transition"
      >
        <td className="px-4 py-3 text-xs text-gray-500">{shortId(user?.id)}</td>

        <td className="px-4 py-3 text-sm select-text">{user?.name}</td>

        <td className="px-4 py-3 text-xs text-blue-400">{user?.email}</td>

        <td className="px-4 py-3 text-center">
          <RoleBadge role={user?.role} />
        </td>

        <td className="px-4 py-3 text-center">
          <BoolPill value={user?.isVerified} t={t} />
        </td>

        <td className="px-4 py-3 text-center">
          <BoolPill value={user?.isCompleted} t={t} />
        </td>

  
        <td className="px-4 py-3 text-center">
          <BoolPill value={isDeleted} t={t} />
        </td>

        <td className="px-4 py-3 text-xs text-gray-400">
          {user?.location ?? "—"}
        </td>

        <td className="px-4 py-3 text-center text-gray-500">
          {expanded ? "▲" : "▼"}
        </td>
      </tr>

      {/* expanded row */}
      {expanded && (
        <tr className="bg-gray-200">
          <td colSpan={9} className="px-6 py-4 border-t border-gray-700">
            {/* details */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm select-text mb-4">
              {[
                ["id", user?.id],
                ["phone", user?.phone ?? "—"],
                ["gender", user?.gender ?? "—"],
                ["birthDate", fmtDate(user?.birthDate)],
                [
                  "languagePreference",
                  user?.languagePreference?.toUpperCase() ?? "—",
                ],
                ["createdAt", fmtDate(user?.createdAt)],
                ["updatedAt", fmtDate(user?.updatedAt)],
                ["deletedAt", fmtDate(user?.deletedAt)],
              ].map(([key, val]) => (
                <div key={key} className="flex gap-2">
                  <span className="font-semibold select-text">
                    {t(`userFields.${key}`, { defaultValue: key })}:
                  </span>

                  <span className="text-slate-500 break-all select-text">
                    {val}
                  </span>
                </div>
              ))}
            </div>

            {/*  ACTION BUTTON */}
            <div className="flex gap-3">
              {!isDeleted ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                      handleDelete();
                    console.log("DELETE USER", user?.id);
                  }}
                  className="px-4 py-2 text-sm font-semibold rounded border 
                  bg-red-600/80 text-white border-red-400 hover:bg-red-700/80 hover:cursor-pointer transition"
                >
                  {t("buttons.delete", { defaultValue: "Delete" })}
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                      handleRestore();
                    console.log("RESTORE USER", user?.id);
                  }}
                  className="px-4 py-2 text-sm font-semibold rounded border 
                  bg-blue-600/80 text-white border-blue-400 hover:bg-blue-700/80 hover:cursor-pointer transition"
                >
                  {t("buttons.restore", { defaultValue: "Restore" })}
                </button>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
/* ── Main panel ───────────────────────────── */
export default function ListUsersPanel({ data }) {
  const { t } = useTranslation();
      const [page, setPage] = useState(1);
      const [usersList, setUsersList] = useState();
  const [pagination, setpagination] = useState();
  // const { users, pagination } = MOCK_RESPONSE;
     const handleGetData =async()=>{
        try {
          // await adminDashboardauth.refreshtoken();
          const response = await getUsers(page);
          console.log("data",response.data.data)
          setUsersList(response.data.data.users);
          setpagination(response.data.data.pagination);
        } catch (error) {
          console.error(error);
        }
      }
    
      useEffect(() => {
        handleGetData();
      }, [page]);
  return (
    <div className="flex flex-col gap-4">
      {/* table */}
      <div className="rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-primary text-white text-sm uppercase tracking-wide select-text">
              <tr>
                <th className="px-4 py-3 text-left">{t("userTable.id")}</th>
                <th className="px-4 py-3 text-left">{t("userTable.name")}</th>
                <th className="px-4 py-3 text-left">{t("userTable.email")}</th>
                <th className="px-4 py-3 text-center">{t("userTable.role")}</th>
                <th className="px-4 py-3 text-center">
                  {t("userTable.verified")}
                </th>
                <th className="px-4 py-3 text-center">
                  {t("userTable.completed")}
                </th>

                <th className="px-4 py-3 text-center">
                  {t("userTable.deleted")}
                </th>

                <th className="px-4 py-3 text-left">
                  {t("userTable.location")}
                </th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-700">
              {usersList?.map((user) => (
                <UserRow key={user?.id} user={user} t={t} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* pagination */}
      <Pagination
        page={page}
        total={pagination?.total}
        limit={pagination?.limit}
        onChange={ setPage}
      />
    </div>
  );
}
