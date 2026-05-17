import { useState } from "react";
import { fields } from "../constants/upgradeConfig";
import { validateFields } from "../utils/UpgradeValidation";
import { becomeOrganizer } from "../APIs/userAPIs";
import { refreshToken } from "../APIs/authAPIs";
import { getCities, getCountries, getStates } from "../APIs/locationAPIs";
import useAppNavigate from "../Router/useAppNavigate";
import { refreshAccessToken } from "../services/cookieTokenService";
import { handleError } from "../utils/errorHandler";

/**
 * useUpgradeForm
 * Encapsulates all state and handlers for the UpgradePage form.
 *
 * Returns:
 *  - selected, setSelected
 *  - formData, fileData, socialData
 *  - errors, socialErrors
 *  - submitted
 *  - handlers: handleFieldChange, handleFieldBlur, handleFileChange,
 *              handleSocialChange, handleSocialErrorChange, handleSubmit, handleReset
 */
export function useUpgradeForm() {
  const [selected, setSelected]           = useState("hobbyist");
  const [formData, setFormData]           = useState({});
  const [fileData, setFileData]           = useState({});
  const [socialData, setSocialData]       = useState({});
  const [errors, setErrors]               = useState({});
  const [socialErrors, setSocialErrors]   = useState({});
  const [submitted, setSubmitted]         = useState(false);
  const [openDialog, setopenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigator = useAppNavigate();

  const closeDialog = () => {
    setopenDialog(false);
    setDialogMessage("");
  };

  const handleCategorySelect = (id) => {
    setSelected(id);
    setErrors({});
    setSocialErrors({});
  };

  const handleFieldChange = (id, value) => {
    setFormData((prev) => {
      const categoryData = { ...prev[selected], [id]: value };
      
      // Reset dependent fields
      fields[selected].forEach(field => {
        if (field.dependsOn === id) {
          delete categoryData[field.id];
          
          // Also reset things that depend on the field we just deleted
          fields[selected].forEach(f => {
            if (f.dependsOn === field.id) {
              delete categoryData[f.id];
            }
          });
        }
      });

      return { ...prev, [selected]: categoryData };
    });
    
    if (errors[id]) setErrors((prev) => { const n = { ...prev }; delete n[id]; return n; });
  };

  const handleFieldBlur = (id, value) => {
    const fieldDef = fields[selected].find((f) => f.id === id);
    if (!fieldDef?.validate) return;
    const err =
      fieldDef.required && !value.trim()
        ? `${fieldDef.label} is required`
        : fieldDef.validate(value);
    setErrors((prev) => {
      if (!err) { const n = { ...prev }; delete n[id]; return n; }
      return { ...prev, [id]: err };
    });
  };

  const handleFileChange = (id, file) => {
    setFileData((prev) => ({ ...prev, [selected]: { ...prev[selected], [id]: file } }));
    if (errors[id]) setErrors((prev) => { const n = { ...prev }; delete n[id]; return n; });
  };

  const handleSocialChange = (val) => {
    setSocialData((prev) => ({ ...prev, [selected]: val }));
  };

  const handleSocialErrorChange = (platformId, err) => {
    setSocialErrors((prev) => {
      if (!err) { const n = { ...prev }; delete n[platformId]; return n; }
      return { ...prev, [platformId]: err };
    });
  };

  const handleSubmit = async() => {
    const { fieldErrors, socialErrors: newSocialErrors } = validateFields({
      selectedCategory: selected,
      fields,
      formData,
      fileData,
      socialData,
    });
    setErrors(fieldErrors);
    setSocialErrors(newSocialErrors);
    if (Object.keys(fieldErrors).length === 0 && Object.keys(newSocialErrors).length === 0) {
      try {
        setLoading(true);

        const fd = new FormData();
        const currentFormData = formData[selected] || {};
        const currentFileData = fileData[selected] || {};
        const currentSocialData = socialData[selected] || {};

        fd.append("type", selected.toUpperCase());

        for (const key in currentFormData) {
          fd.append(key, currentFormData[key]);
        }

        for (const key in currentFileData) {
          fd.append(key, currentFileData[key]);
        }

        for (const key in currentSocialData) {
          fd.append(key, currentSocialData[key]);
        }

        await becomeOrganizer(fd);
        const token = await refreshToken();
        refreshAccessToken(token.data);
        navigator("/organizer/otp-verification");
      } catch (error) {
        handleError(error, {
          silent: true,
          customMessage: !error?.response && error?.message ? error.message : null,
          onMapped: (msg) => {
            setDialogMessage(msg);
            setopenDialog(true);
          }
        });
      }
      finally {
        setLoading(false);
      }
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setSelected("hobbyist");
    setFormData({});
    setFileData({});
    setSocialData({});
    setErrors({});
    setSocialErrors({});
  };

  return {
    selected,
    formData: formData[selected] || {},
    fileData: fileData[selected] || {},
    socialData: socialData[selected] || {},
    errors,
    socialErrors,
    submitted,
    openDialog,
    dialogMessage,
    loading,
    handleCategorySelect,
    handleFieldChange,
    handleFieldBlur,
    handleFileChange,
    handleSocialChange,
    handleSocialErrorChange,
    handleSubmit,
    handleReset,
    closeDialog,
  };
}
