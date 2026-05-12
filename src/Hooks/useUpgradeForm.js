import { useState } from "react";
import { fields } from "../constants/upgradeConfig";
import { validateFields } from "../utils/UpgradeValidation";
import { becomeOrganizer } from "../APIs/userAPIs";
import useAppNavigate from "../Router/useAppNavigate";

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
    setFormData((prev) => ({ ...prev, [selected]: { ...prev[selected], [id]: value } }));
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
    const newErrors = validateFields({
      selectedCategory: selected,
      fields,
      formData,
      fileData,
      socialData,
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0 && Object.keys(socialErrors).length === 0) {
      try {
        const fd= new FormData();
        fd.append('type',selected)
        fd.append('cityId',1)
        fd.append('countryId',1)
        fd.append('stateId',1)
        for (const key in formData[selected]) {
          fd.append(key, formData[selected][key]);

        }
        for (const key in fileData[selected]) {
          fd.append(key, fileData[selected][key].file);
  
        }
        if(fileData?.photo?.file)

          fd.append('photo',fileData?.photo?.file)
        for (const key in socialData[selected]) {
          fd.append(key, socialData[selected][key]);
        }

        // console.log("Submitted form data:", formData);
        // console.log("Submitted file data:", fileData);
        // console.log("Submitted social data:", socialData);
        
        const response = await becomeOrganizer(fd);
        setSubmitted(true);
        navigator("/organizer/otp-verification") 

      } catch (error) {
        setopenDialog(true);
        setDialogMessage(error?.response?.data?.data?.dialogMessage||"Something went wrong");
        console.error("Error submitting form:", error);
      }
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setSelected("hobbies");
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
