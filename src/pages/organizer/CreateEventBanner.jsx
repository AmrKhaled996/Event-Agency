import { Link } from "react-router-dom";
import ProgressBar from "../../components/UI/progressBar";
import { useState } from "react";
import CreateEventProgressBar from "../../components/UI/CreateEventProgressBar";
import { useEventForm } from "../../Context/EventPovider";
import { Title } from "react-head";
import useAppNavigate from "../../Router/useAppNavigate";
import LocalLink from "../../Router/LocalLink";
import { useTranslation } from "react-i18next";

function CreateEventBanner() {
  const { t } = useTranslation();
  const { formData, updateForm } = useEventForm();
  const navigate = useAppNavigate();
  const [fileInfo, setFileInfo] = useState(
    formData.banner || { file: null, preview: null },
  );
  const onFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const preview = URL.createObjectURL(f);
    setFileInfo({ file: f, preview });
    updateForm("banner", { file: f, preview });
  };

  const handleNext = () => {
    updateForm("banner", { file: fileInfo.file, preview: fileInfo.preview });
    navigate("/organizer/create-event/ticket");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Title>{t("organizer.createEvent.banner")}</Title>
      <CreateEventProgressBar step={2} />

      <h2 className="text-xl font-semibold mb-4">{t("organizer.createEvent.bannerTitle")}</h2>

      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={onFile}
          className="bg-primary/10 w-1/2 h-20 text-center text-3xl font-bold border border-gray-300 rounded-lg p-5 "
        />
        <p className="text-xs text-gray-500 mt-2">
          {t("organizer.createEvent.bannerHint")}
        </p>
      </div>

      {fileInfo.preview && (
        <div className="mb-4">
          <div className="border rounded overflow-hidden">
            <img
              src={fileInfo.preview}
              alt="preview"
              className="w-full h-60 object-cover"
            />
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <LocalLink to={"/organizer/create-event/basics"} className="text-gray-600">
          {t("organizer.createEvent.editInfo")}
        </LocalLink>
        <button
          disabled={!fileInfo.file}
          onClick={handleNext}
          className="bg-purple-700 text-white px-6 py-2 rounded"
        >
          {t("organizer.createEvent.next")}
        </button>
      </div>
    </div>
  );
}

export default CreateEventBanner;

