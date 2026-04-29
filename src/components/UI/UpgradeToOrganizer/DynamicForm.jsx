import FormField from "./FormField";
import PhotoUpload from "./PhotoUpload";
import PdfUpload from "./PdfUpload";
import SocialLinksField from "./SocialLinksField";

/**
 * DynamicForm
 * Renders the grid of fields for the currently selected category.
 *
 * Props:
 *  - title          {string}
 *  - subtitle       {string}
 *  - fields         {Array}   field definitions for this category
 *  - formData       {Object}  { [fieldId]: value }
 *  - fileData       {Object}  { [fieldId]: File }
 *  - socialData     {Object}  { [platformId]: url }
 *  - errors         {Object}  { [fieldId]: errorMessage }
 *  - socialErrors   {Object}  { [platformId]: errorMessage }
 *  - onFieldChange        {(id, value) => void}
 *  - onFieldBlur          {(id, value) => void}
 *  - onFileChange         {(id, File) => void}
 *  - onSocialChange       {(newSocialValue) => void}
 *  - onSocialErrorChange  {(platformId, error) => void}
 */
export default function DynamicForm({
  title,
  subtitle,
  fields,
  formData,
  fileData,
  socialData,
  errors,
  socialErrors,
  onFieldChange,
  onFieldBlur,
  onFileChange,
  onSocialChange,
  onSocialErrorChange,
}) {

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-medium text-gray-900">{title}</h1>
        <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-5">
        {fields.map((field) => {
          const error = errors[field.id];
          const value = formData[field.id] || "";

          if (field.type === "social") {
            return (
              <SocialLinksField
                key="_social"
                value={socialData}
                onChange={onSocialChange}
                errors={socialErrors}
                onErrorChange={onSocialErrorChange}
              />
            );
          }

          if (field.type === "photo") {
            return (
              <div key={field.id} className="col-span-2">
                <PhotoUpload
                  label={field.label}
                  required={field.required}
                  error={error}
                  onFileChange={(file) => onFileChange(field.id, file)}
                />
              </div>
            );
          }

          if (field.type === "pdf") {
            return (
              <div key={field.id} className="col-span-2">
                <PdfUpload
                  label={field.label}
                  required={field.required}
                  error={error}
                  onFileChange={(file) => onFileChange(field.id, file)}
                />
              </div>
            );
          }

          return (
            <FormField
              key={field.id}
              id={field.id}
              label={field.label}
              type={field.type}
              placeholder={field.placeholder}
              value={value}
              required={field.required}
              error={error}
              half={field.half}
              onChange={onFieldChange}
              onBlur={onFieldBlur}
            />
          );
        })}
      </div>
    </div>
  );
}
