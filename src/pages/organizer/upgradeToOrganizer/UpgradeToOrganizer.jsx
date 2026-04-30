// import { ArrowLeft } from "lucide-react";
// import { useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";

// const SOCIAL_PLATFORMS = [
//   { id: "websiteUrl", label: "Website", placeholder: "https://yourwebsite.com", icon: (
//     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
//   )},
//   { id: "instagramUrl", label: "Instagram", placeholder: "https://instagram.com/yourhandle", icon: (
//     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
//   )},
//   { id: "facebookUrl", label: "Facebook", placeholder: "https://facebook.com/yourpage", icon: (
//     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
//   )},
//   { id: "twitterUrl", label: "X / Twitter", placeholder: "https://x.com/yourhandle", icon: (
//     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l16 16M4 20L20 4"/></svg>
//   )},
//   { id: "linkedinUrl", label: "LinkedIn", placeholder: "https://linkedin.com/in/yourprofile", icon: (
//     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
//   )},
//   { id: "youtubeUrl", label: "YouTube", placeholder: "https://youtube.com/@yourchannel", icon: (
//     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
//   )},
// ];

// const URL_REGEX = /^https?:\/\/.+\..+/;

// function validateUrl(val) {
//   if (!val || !val.trim()) return null;
//   return !URL_REGEX.test(val.trim()) ? "Enter a valid URL (https://...)" : null;
// }

// function SocialLinksField({ value = {}, onChange, errors = {}, onErrorChange }) {
//   // activeRows: array of { platformId, url }
//   const [rows, setRows] = useState([]);
//   const [selectedPlatform, setSelectedPlatform] = useState("");
//   const [inputUrl, setInputUrl] = useState("");
//   const [addError, setAddError] = useState("");

//   const usedPlatformIds = rows.map((r) => r.platformId);
//   const availablePlatforms = SOCIAL_PLATFORMS.filter((p) => !usedPlatformIds.includes(p.id));

//   const handleAdd = () => {
//     if (!selectedPlatform) { setAddError("Please select a platform"); return; }
//     if (!inputUrl.trim()) { setAddError("Please enter a URL"); return; }
//     const urlErr = validateUrl(inputUrl);
//     if (urlErr) { setAddError(urlErr); return; }
//     const newRows = [...rows, { platformId: selectedPlatform, url: inputUrl.trim() }];
//     setRows(newRows);
//     onChange({ ...value, [selectedPlatform]: inputUrl.trim() });
//     setSelectedPlatform("");
//     setInputUrl("");
//     setAddError("");
//   };

//   const handleRemove = (platformId) => {
//     const newRows = rows.filter((r) => r.platformId !== platformId);
//     setRows(newRows);
//     const newVal = { ...value };
//     delete newVal[platformId];
//     onChange(newVal);
//   };

//   const handleRowChange = (platformId, url) => {
//     const newRows = rows.map((r) => r.platformId === platformId ? { ...r, url } : r);
//     setRows(newRows);
//     onChange({ ...value, [platformId]: url });
//     if (errors[platformId] && !validateUrl(url)) {
//       onErrorChange(platformId, null);
//     }
//   };

//   const handleRowBlur = (platformId, url) => {
//     const err = validateUrl(url);
//     onErrorChange(platformId, err);
//   };

//   return (
//     <div className="col-span-2 flex flex-col gap-3">
//       <div>
//         <label className="text-sm font-medium text-gray-700">Social & Web Links</label>
//         <p className="text-xs text-gray-400 mt-0.5">All optional — add whichever apply</p>
//       </div>

//       {/* Existing rows */}
//       {rows.length > 0 && (
//         <div className="flex flex-col gap-2">
//           {rows.map(({ platformId, url }) => {
//             const platform = SOCIAL_PLATFORMS.find((p) => p.id === platformId);
//             const rowError = errors[platformId];
//             return (
//               <div key={platformId} className="flex flex-col gap-1">
//                 <div className="flex items-center gap-2">
//                   {/* Platform badge */}
//                   <div className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium rounded-lg border border-gray-200 bg-gray-50 text-gray-600 whitespace-nowrap min-w-[120px]">
//                     <span className="text-primary">{platform?.icon}</span>
//                     {platform?.label}
//                   </div>
//                   {/* URL input */}
//                   <input
//                     type="url"
//                     value={url}
//                     placeholder={platform?.placeholder}
//                     onChange={(e) => handleRowChange(platformId, e.target.value)}
//                     onBlur={(e) => handleRowBlur(platformId, e.target.value)}
//                     className={`flex-1 px-3 py-2.5 text-sm border rounded-lg bg-white text-gray-800 placeholder-gray-400 outline-none transition-all ${
//                       rowError
//                         ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-200"
//                         : "border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
//                     }`}
//                   />
//                   {/* Remove button */}
//                   <button
//                     onClick={() => handleRemove(platformId)}
//                     className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400 hover:bg-red-50 transition-all"
//                   >
//                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                       <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
//                     </svg>
//                   </button>
//                 </div>
//                 {rowError && (
//                   <p className="text-xs text-red-500 flex items-center gap-1 pl-1">
//                     <span>⚠</span>{rowError}
//                   </p>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* Add new row */}
//       {availablePlatforms.length > 0 && (
//         <div className="flex flex-col gap-1.5">
//           <div className="flex items-center gap-2">
//             {/* Platform dropdown */}
//             <div className="relative min-w-[140px]">
//               <select
//                 value={selectedPlatform}
//                 onChange={(e) => { setSelectedPlatform(e.target.value); setAddError(""); }}
//                 className={`w-full appearance-none px-3 py-2.5 pr-8 text-sm border rounded-lg bg-white text-gray-800 outline-none cursor-pointer transition-all ${
//                   addError && !selectedPlatform
//                     ? "border-red-400 focus:ring-2 focus:ring-red-200"
//                     : "border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
//                 }`}
//               >
//                 <option value="">Select platform</option>
//                 {availablePlatforms.map((p) => (
//                   <option key={p.id} value={p.id}>{p.label}</option>
//                 ))}
//               </select>
//               <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
//                 <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
//               </div>
//             </div>
//             {/* URL input */}
//             <input
//               type="url"
//               value={inputUrl}
//               placeholder={selectedPlatform ? SOCIAL_PLATFORMS.find((p) => p.id === selectedPlatform)?.placeholder : "Paste your URL here"}
//               onChange={(e) => { setInputUrl(e.target.value); setAddError(""); }}
//               onKeyDown={(e) => e.key === "Enter" && handleAdd()}
//               className={`flex-1 px-3 py-2.5 text-sm border rounded-lg bg-white text-gray-800 placeholder-gray-400 outline-none transition-all ${
//                 addError && selectedPlatform
//                   ? "border-red-400 focus:ring-2 focus:ring-red-200"
//                   : "border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
//               }`}
//             />
//             {/* Plus button */}
//             <button
//               onClick={handleAdd}
//               className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg border border-primary/40 text-primary bg-primary/5 hover:bg-primary hover:text-white hover:border-primary transition-all"
//             >
//               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
//                 <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
//               </svg>
//             </button>
//           </div>
//           {addError && (
//             <p className="text-xs text-red-500 flex items-center gap-1 pl-1">
//               <span>⚠</span>{addError}
//             </p>
//           )}
//         </div>
//       )}

//       {/* All added */}
//       {availablePlatforms.length === 0 && rows.length > 0 && (
//         <p className="text-xs text-gray-400 flex items-center gap-1.5">
//           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#BB52E0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
//           All platforms added
//         </p>
//       )}
//     </div>
//   );
// }

// // ─── Icons ────────────────────────────────────────────────────────────────────

// const categories = [
//   {
//     id: "hobbies", label: "Hobbies", description: "Individual curators & casual meetups",
//     icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="3"/><line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="3"/></svg>),
//   },
//   {
//     id: "business", label: "Business", description: "Solo entrepreneurs & small agencies",
//     icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="12.01" strokeWidth="3"/></svg>),
//   },
//   {
//     id: "company", label: "Company", description: "Registered firms & large organizations",
//     icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M9 8h1"/><path d="M9 12h1"/><path d="M9 16h1"/><path d="M14 8h1"/><path d="M14 12h1"/><path d="M14 16h1"/><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/></svg>),
//   },
// ];

// // ─── Field definitions (no website/social — handled by SocialLinksField) ──────

// const fields = {
//   hobbies: [
//     { id: "fullName",   label: "Full Name",              placeholder: "e.g. Julian Sterling",   type: "text",  half: true,  required: true,  validate: (v) => v.trim().length < 2 ? "Full name is required" : null },
//     { id: "email",      label: "Email Address",          placeholder: "j.sterling@example.com", type: "email", half: true,  required: true,  validate: (v) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Enter a valid email" : null },
//     { id: "phone",      label: "Phone Number",           placeholder: "+1 (555) 000-0000",       type: "tel",   half: true,  required: true,  validate: (v) => !/^\+?[\d\s\-(]{7,20}$/.test(v) ? "Enter a valid phone number" : null },
//     { id: "nationalId", label: "National ID / Passport No.", placeholder: "Identification Number", type: "text", half: true, required: true, validate: (v) => v.trim().length < 4 ? "ID number is required" : null },
//     { id: "_social",    type: "social", half: false },
//     { id: "photo",      label: "Profile Photo",          type: "photo", half: false, required: true },
//   ],
//   business: [
//     { id: "businessName",   label: "Business Name",           placeholder: "Your business name",      type: "text", half: true,  required: true, validate: (v) => v.trim().length < 2 ? "Business name is required" : null },
//     { id: "ownerName",      label: "Owner Name",              placeholder: "Full legal name",          type: "text", half: true,  required: true, validate: (v) => v.trim().length < 2 ? "Owner name is required" : null },
//     { id: "phone",          label: "Phone Number",            placeholder: "+1 (555) 000-0000",        type: "tel",  half: true,  required: true, validate: (v) => !/^\+?[\d\s\-(]{7,20}$/.test(v) ? "Enter a valid phone number" : null },
//     { id: "address",        label: "Business Address",        placeholder: "Street, City, Country",    type: "text", half: true,  required: true, validate: (v) => v.trim().length < 5 ? "Address is required" : null },
//     { id: "commercialReg",  label: "Commercial Registration", placeholder: "Registration number",      type: "text", half: true,  required: true, validate: (v) => v.trim().length < 3 ? "Registration number is required" : null },
//     { id: "taxId",          label: "Tax ID",                  placeholder: "Tax identification number",type: "text", half: true,  required: true, validate: (v) => v.trim().length < 3 ? "Tax ID is required" : null },
//     { id: "_social",        type: "social", half: false },
//     { id: "photo",          label: "Profile Photo",           type: "photo", half: false, required: true },
//   ],
//   company: [
//     { id: "legalName",    label: "Company Legal Name",    placeholder: "Full registered name",        type: "text",  half: true,  required: true, validate: (v) => v.trim().length < 2 ? "Company name is required" : null },
//     { id: "regNumber",    label: "Registration Number",   placeholder: "Company registration no.",    type: "text",  half: true,  required: true, validate: (v) => v.trim().length < 3 ? "Registration number is required" : null },
//     { id: "taxId",        label: "Tax ID",                placeholder: "Tax identification number",   type: "text",  half: true,  required: true, validate: (v) => v.trim().length < 3 ? "Tax ID is required" : null },
//     { id: "emailDomain",  label: "Official Email Domain", placeholder: "@yourcompany.com",            type: "text",  half: true,  required: true, validate: (v) => !/^@[\w.-]+\.[a-z]{2,}$/.test(v) ? "Enter a valid domain (e.g. @company.com)" : null },
//     { id: "contactPhone", label: "Phone (Contact Person)",placeholder: "+1 (555) 000-0000",           type: "tel",   half: true,  required: true, validate: (v) => !/^\+?[\d\s\-(]{7,20}$/.test(v) ? "Enter a valid phone number" : null },
//     { id: "address",      label: "Company Address",       placeholder: "Street, City, Country",       type: "text",  half: false, required: true, validate: (v) => v.trim().length < 5 ? "Address is required" : null },
//     { id: "documents",    label: "Official Documents",    type: "pdf",   half: false, required: true },
//     { id: "_social",      type: "social", half: false },
//     { id: "photo",        label: "Profile Photo",         type: "photo", half: false, required: true },
//   ],
// };

// const subtitles = {
//   hobbies:  "Details required for Hobbies-level curators.",
//   business: "Details required for Business-level verification.",
//   company:  "Details required for Company-level registration.",
// };

// // ─── Upload helpers ───────────────────────────────────────────────────────────

// function PhotoUpload({ label, required, error, onFileChange }) {
//   const inputRef = useRef(null);
//   const [preview, setPreview] = useState(null);
//   const [dragging, setDragging] = useState(false);
//   const handleFile = (file) => {
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = (e) => setPreview(e.target.result);
//     reader.readAsDataURL(file);
//     onFileChange(file);
//   };
//   return (
//     <div className="flex flex-col gap-1.5">
//       <label className="text-sm font-medium text-gray-700">{label}{required && <span className="text-secandry ml-0.5">*</span>}</label>
//       <div onClick={() => inputRef.current?.click()} onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
//         className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl cursor-pointer transition-colors py-8 ${error ? "border-red-400 bg-red-50" : dragging ? "border-primary bg-primary/5" : "border-gray-200 bg-gray-50 hover:border-primary/50 hover:bg-primary/5"}`}>
//         {preview
//           ? <img src={preview} alt="preview" className="h-20 w-20 rounded-full object-cover border-2 border-primary/30" />
//           : <>
//               <div className={`w-10 h-10 rounded-full flex items-center justify-center ${error ? "bg-red-100" : "bg-primary/10"}`}>
//                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={error ? "#f87171" : "#BB52E0"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
//               </div>
//               <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
//               <p className="text-xs text-gray-400">PNG, JPG up to 10MB</p>
//             </>
//         }
//         <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
//       </div>
//       {error && <p className="text-xs text-red-500 flex items-center gap-1"><span>⚠</span>{error}</p>}
//     </div>
//   );
// }

// function PdfUpload({ label, required, error, onFileChange }) {
//   const inputRef = useRef(null);
//   const [fileName, setFileName] = useState(null);
//   const [dragging, setDragging] = useState(false);
//   const handleFile = (file) => { if (!file) return; setFileName(file.name); onFileChange(file); };
//   return (
//     <div className="flex flex-col gap-1.5">
//       <label className="text-sm font-medium text-gray-700">{label}{required && <span className="text-secandry ml-0.5">*</span>}</label>
//       <div onClick={() => inputRef.current?.click()} onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
//         className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl cursor-pointer transition-colors py-8 ${error ? "border-red-400 bg-red-50" : dragging ? "border-primary bg-primary/5" : "border-gray-200 bg-gray-50 hover:border-primary/50 hover:bg-primary/5"}`}>
//         <div className={`w-10 h-10 rounded-full flex items-center justify-center ${error ? "bg-red-100" : "bg-primary/10"}`}>
//           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={error ? "#f87171" : "#BB52E0"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg>
//         </div>
//         {fileName
//           ? <p className="text-sm text-primary font-medium">{fileName}</p>
//           : <><p className="text-sm text-gray-500">Click to upload or drag and drop</p><p className="text-xs text-gray-400">PDF only, up to 20MB</p></>
//         }
//         <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
//       </div>
//       {error && <p className="text-xs text-red-500 flex items-center gap-1"><span>⚠</span>{error}</p>}
//     </div>
//   );
// }

// // ─── Main page ────────────────────────────────────────────────────────────────

// export default function UpgradePage() {
//   const [selected, setSelected]   = useState("hobbies");
//   const [formData, setFormData]   = useState({});
//   const [fileData, setFileData]   = useState({});
//   const [socialData, setSocialData] = useState({});
//   const [errors, setErrors]       = useState({});
//   const [socialErrors, setSocialErrors] = useState({});
//   const [submitted, setSubmitted] = useState(false);
//   const navigate = useAppNavigate();

//   const handleChange = (id, value) => {
//     setFormData((prev) => ({ ...prev, [selected]: { ...prev[selected], [id]: value } }));
//     if (errors[id]) setErrors((prev) => { const n = { ...prev }; delete n[id]; return n; });
//   };

//   const handleFileChange = (id, file) => {
//     setFileData((prev) => ({ ...prev, [selected]: { ...prev[selected], [id]: file } }));
//     if (errors[id]) setErrors((prev) => { const n = { ...prev }; delete n[id]; return n; });
//   };

//   const handleSocialChange = (val) => {
//     setSocialData((prev) => ({ ...prev, [selected]: val }));
//   };

//   const handleSocialErrorChange = (platformId, err) => {
//     setSocialErrors((prev) => {
//       if (!err) { const n = { ...prev }; delete n[platformId]; return n; }
//       return { ...prev, [platformId]: err };
//     });
//   };

//   const validate = () => {
//     const newErrors = {};
//     const currentFields = fields[selected];
//     const data  = formData[selected] || {};
//     const files = fileData[selected] || {};

//     currentFields.forEach((field) => {
//       if (field.type === "social") return;
//       if (field.type === "photo" || field.type === "pdf") {
//         if (field.required && !files[field.id]) newErrors[field.id] = field.type === "photo" ? "Profile photo is required" : "Document upload is required";
//         return;
//       }
//       const value = data[field.id] || "";
//       if (field.required && !value.trim()) {
//         newErrors[field.id] = field.validate?.(value) || `${field.label} is required`;
//         return;
//       }
//       if (value && field.validate) {
//         const err = field.validate(value);
//         if (err) newErrors[field.id] = err;
//       }
//     });

//     // Validate existing social rows
//     const socials = socialData[selected] || {};
//     Object.entries(socials).forEach(([platformId, url]) => {
//       const err = validateUrl(url);
//       if (err) newErrors[`social_${platformId}`] = err;
//     });

//     return newErrors;
//   };

//   const handleSubmit = () => {
//     const newErrors = validate();
//     setErrors(newErrors);
//     if (Object.keys(newErrors).length === 0 && Object.keys(socialErrors).length === 0) {
//       setSubmitted(true);
//     }
//   };

//   const currentFields = fields[selected];

//   if (submitted) {
//     return (
//       <div className="max-w-2xl mx-auto px-4 py-16 flex flex-col items-center gap-4 text-center">
//         <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
//           <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#BB52E0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
//         </div>
//         <h2 className="text-2xl font-medium text-gray-900">Upgrade submitted!</h2>
//         <p className="text-sm text-gray-400">Your {selected} upgrade request has been received. We'll review and get back to you shortly.</p>
//         <button onClick={() => navigate('/')}
//           className="mt-4 px-6 py-2.5 text-sm font-medium text-white rounded-xl bg-primary hover:bg-secandry transition-colors">
//           Submit another
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-8">
//         <button
//         onClick={()=> navigate('/')}
//         className=" w-12 h-12 rounded-full flex items-center justify-center bg-slate-200 hover:bg-slate-300">
//           <ArrowLeft size={20}  className="text-slate-900"/>
//         </button>
//       {/* Category selector */}
//       <div className="flex flex-col gap-3">
//         <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Selection category</p>
//         <div className="flex flex-wrap gap-6 justify-center">
//           {categories.map((cat) => (
//             <button key={cat.id} onClick={() => { setSelected(cat.id); setErrors({}); setSocialErrors({}); }}
//               className={`flex flex-col gap-1.5 p-4 rounded-xl border text-left w-60 transition-all ${selected === cat.id ? "border-primary bg-primary/5" : "border-gray-200 bg-white hover:border-primary/40 hover:bg-primary/5"}`}>
//               <span className={selected === cat.id ? "text-primary" : "text-gray-400"}>{cat.icon}</span>
//               <span className={`text-sm font-medium ${selected === cat.id ? "text-primary" : "text-gray-800"}`}>{cat.label}</span>
//               <span className="text-xs text-gray-400 leading-snug">{cat.description}</span>
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Form */}
//       <div className="flex flex-col gap-6">
//         <div>
//           <h1 className="text-2xl font-medium text-gray-900">Personal Information</h1>
//           <p className="text-sm text-gray-400 mt-1">{subtitles[selected]}</p>
//         </div>

//         <div className="grid grid-cols-2 gap-x-4 gap-y-5">
//           {currentFields.map((field) => {
//             const error = errors[field.id];
//             const value = formData[selected]?.[field.id] || "";

//             if (field.type === "social") {
//               return (
//                 <SocialLinksField
//                   key="_social"
//                   value={socialData[selected] || {}}
//                   onChange={handleSocialChange}
//                   errors={socialErrors}
//                   onErrorChange={handleSocialErrorChange}
//                 />
//               );
//             }

//             if (field.type === "photo") {
//               return (
//                 <div key={field.id} className="col-span-2">
//                   <PhotoUpload label={field.label} required={field.required} error={error} onFileChange={(file) => handleFileChange(field.id, file)} />
//                 </div>
//               );
//             }

//             if (field.type === "pdf") {
//               return (
//                 <div key={field.id} className="col-span-2">
//                   <PdfUpload label={field.label} required={field.required} error={error} onFileChange={(file) => handleFileChange(field.id, file)} />
//                 </div>
//               );
//             }

//             return (
//               <div key={field.id} className={`flex flex-col gap-1.5 ${field.half ? "" : "col-span-2"}`}>
//                 <label htmlFor={field.id} className="text-sm font-medium text-gray-700">
//                   {field.label}{field.required && <span className="text-secandry ml-0.5">*</span>}
//                 </label>
//                 <input
//                   id={field.id} type={field.type} placeholder={field.placeholder} value={value}
//                   onChange={(e) => handleChange(field.id, e.target.value)}
//                   onBlur={() => {
//                     if (!field.validate) return;
//                     const err = field.required && !value.trim() ? `${field.label} is required` : field.validate(value);
//                     setErrors((prev) => { if (!err) { const n = { ...prev }; delete n[field.id]; return n; } return { ...prev, [field.id]: err }; });
//                   }}
//                   className={`px-3 py-2.5 text-sm border rounded-lg bg-white text-gray-800 placeholder-gray-400 outline-none transition-all ${error ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-200" : "border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"}`}
//                 />
//                 {error && <p className="text-xs text-red-500 flex items-center gap-1"><span>⚠</span>{error}</p>}
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="flex items-center justify-end pt-2">
//         <button onClick={handleSubmit} className="px-6 py-2.5 text-sm font-medium text-white rounded-xl bg-primary hover:bg-secandry transition-colors">Submit Upgrade</button>
//       </div>

//     </div>
//   );
// }
