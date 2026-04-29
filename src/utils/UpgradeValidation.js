export const URL_REGEX = /^https?:\/\/.+\..+/;

/**
 * Validates a URL string.
 * Returns an error message string if invalid, or null if valid/empty.
 */
export function validateUrl(val) {
  if (!val || !val.trim()) return null;
  return !URL_REGEX.test(val.trim()) ? "Enter a valid URL (https://...)" : null;
}

/**
 * Runs validation for all fields in the current category.
 * Returns an errors object { fieldId: errorMessage }.
 */
export function validateFields({ selectedCategory, fields, formData, fileData, socialData }) {
  const newErrors = {};
  const currentFields = fields[selectedCategory];
  const data  = formData[selectedCategory] || {};
  const files = fileData[selectedCategory] || {};

  currentFields.forEach((field) => {
    if (field.type === "social") return;

    if (field.type === "photo" || field.type === "pdf") {
      if (field.required && !files[field.id]) {
        newErrors[field.id] =
          field.type === "photo" ? "Profile photo is required" : "Document upload is required";
      }
      return;
    }

    const value = data[field.id] || "";
    if (field.required && !value.trim()) {
      newErrors[field.id] = field.validate?.(value) || `${field.label} is required`;
      return;
    }
    if (value && field.validate) {
      const err = field.validate(value);
      if (err) newErrors[field.id] = err;
    }
  });

  // Validate existing social rows
  const socials = socialData[selectedCategory] || {};
  Object.entries(socials).forEach(([platformId, url]) => {
    const err = validateUrl(url);
    if (err) newErrors[`social_${platformId}`] = err;
  });

  return newErrors;
}
