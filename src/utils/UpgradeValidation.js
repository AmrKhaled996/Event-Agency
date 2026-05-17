export const URL_REGEX = /^https?:\/\/.+\..+/;

/**
 * Validates a URL string.
 * Returns an error message string if invalid, or null if valid/empty.
 */
export function validateUrl(val) {
  if (!val || !val.trim()) return null;
  return !URL_REGEX.test(val.trim()) ? "upgradeToOrganizer.validation.invalidUrl" : null;
}

/**
 * Runs validation for all fields in the current category.
 * Returns { fieldErrors, socialErrors }.
 */
export function validateFields({ selectedCategory, fields, formData, fileData, socialData }) {
  const fieldErrors = {};
  const socialErrors = {};
  const currentFields = fields[selectedCategory];
  const data  = formData[selectedCategory] || {};
  const files = fileData[selectedCategory] || {};

  currentFields.forEach((field) => {
    if (field.type === "social") return;

    if (field.type === "photo" || field.type === "pdf") {
      if (field.required && !files[field.id]) {
        fieldErrors[field.id] =
          field.type === "photo" ? "upgradeToOrganizer.validation.photoRequired" : "upgradeToOrganizer.validation.documentRequired";
      }
      return;
    }

    const value = data[field.id] || "";
    if (field.required && (typeof value !== "string" || !value.trim())) {
      fieldErrors[field.id] = field.validate?.(value) || "upgradeToOrganizer.validation.genericRequired";
      return;
    }
    if (value && typeof value === "string" && field.validate) {
      const err = field.validate(value);
      if (err) fieldErrors[field.id] = err;
    }
  });

  // Validate existing social rows
  const socials = socialData[selectedCategory] || {};
  Object.entries(socials).forEach(([platformId, url]) => {
    const err = validateUrl(url);
    if (err) socialErrors[platformId] = err;
  });

  return { fieldErrors, socialErrors };
}
