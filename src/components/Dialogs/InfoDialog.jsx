import { useTranslation } from "react-i18next";
import Dialog from "../UI/Dialog";

export default function InfoDialog({ open, onClose, data, labels }) {
  if (!data) return null;
  const {t} = useTranslation();
  return (
    <Dialog open={open} onClose={onClose}>
      
      <h3 className="text-xl font-semibold mb-4">Data :</h3>
      <hr  className="text-3xl border-2 border-black bg-black mb-8"/>
      <table className="w-full text-sm border-collapse">
        <tbody>
          {Object.entries(data).map(([key, value]) => (
            <tr
              key={key}
              className="border-b last:border-0 "
            >
              {/* KEY */}
              <td className="px-3 py-4  text-lg w-1/3 font-bold whitespace-nowrap">
                {t(`organizerFields.${key}`, { defaultValue: key })}:
              </td>

              {/* VALUE */}
              <td className="px-3 py-2 font-medium  ">
                {value?.toString() ?? "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mt-4">
        <button
          onClick={onClose}
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded mr-2"
        >
          Close
        </button>
      </div>
    </Dialog>
  );
}
