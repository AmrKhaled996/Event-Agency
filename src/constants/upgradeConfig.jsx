import { User, UserIcon } from "lucide-react";

export const SOCIAL_PLATFORMS = [
  {
    id: "websiteUrl",
    label: "Website",
    placeholder: "https://yourwebsite.com",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
  },
  {
    id: "instagramUrl",
    label: "Instagram",
    placeholder: "https://instagram.com/yourhandle",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
  },
  {
    id: "facebookUrl",
    label: "Facebook",
    placeholder: "https://facebook.com/yourpage",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
  },
  {
    id: "twitterUrl",
    label: "X / Twitter",
    placeholder: "https://x.com/yourhandle",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4l16 16M4 20L20 4"/>
      </svg>
    ),
  },
  {
    id: "linkedinUrl",
    label: "LinkedIn",
    placeholder: "https://linkedin.com/in/yourprofile",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
  {
    id: "youtubeUrl",
    label: "YouTube",
    placeholder: "https://youtube.com/@yourchannel",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
      </svg>
    ),
  },
];
    HOBBYIST: "HOBBYIST";
    BUSINESS: "BUSINESS";
    COMPANY: "COMPANY";
export const categories = [
  {
    id: "hobbyist",
    label: "Hobbyist",
    description: "Individual curators & casual meetups",
    icon: (
      <UserIcon />
    ),
  },
  {
    id: "business",
    label: "Business",
    description: "Solo entrepreneurs & small agencies",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/>
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
        <line x1="12" y1="12" x2="12" y2="12.01" strokeWidth="3"/>
      </svg>
    ),
  },
  {
    id: "company",
    label: "Company",
    description: "Registered firms & large organizations",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18"/>
        <path d="M9 8h1"/><path d="M9 12h1"/><path d="M9 16h1"/>
        <path d="M14 8h1"/><path d="M14 12h1"/><path d="M14 16h1"/>
        <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/>
      </svg>
    ),
  },
];

export const fields = {
  hobbyist: [
    { id: "name",   label: "Full Name",                  placeholder: "e.g. Julian Sterling",    type: "text",  half: true,  required: true,  validate: (v) => v.trim().length < 2 ? "Full name is required" : null },
    { id: "contactEmail",      label: "Email Address",              placeholder: "j.sterling@example.com",  type: "email", half: true,  required: true,  validate: (v) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Enter a valid email" : null },
    { id: "contactPhone",      label: "Phone Number",               placeholder: "+1 (555) 000-0000",        type: "tel",   half: true,  required: true,  validate: (v) => !/^\+?[\d\s\-(]{7,20}$/.test(v) ? "Enter a valid phone number" : null },
    { id: "nationalId", label: "National ID / Passport No.", placeholder: "Identification Number",   type: "text",  half: true,  required: true,  validate: (v) => v.trim().length < 4 ? "ID number is required" : null },
    { id: "_social",    type: "social", half: false },
    { id: "photo",      label: "Profile Photo",              type: "photo", half: false, required: true },
  ],
  business: [
    { id: "name",   label: "Business Name",           placeholder: "Your business name",        type: "text", half: true,  required: true, validate: (v) => v.trim().length < 2 ? "Business name is required" : null },
    { id: "contactEmail",      label: "Email Address",              placeholder: "j.sterling@example.com",  type: "email", half: true,  required: true,  validate: (v) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Enter a valid email" : null },
    { id: "contactPhone",         label: "Phone Number",            placeholder: "+1 (555) 000-0000",         type: "tel",  half: true,  required: true, validate: (v) => !/^\+?[\d\s\-(]{7,20}$/.test(v) ? "Enter a valid phone number" : null },
    { id: "address",       label: "Business Address",        placeholder: "Street, City, Country",     type: "text", half: true,  required: true, validate: (v) => v.trim().length < 5 ? "Address is required" : null },
    { id: "commercialRegistration", label: "Commercial Registration", placeholder: "Registration number",       type: "text", half: true,  required: true, validate: (v) => v.trim().length < 3 ? "Registration number is required" : null },
    { id: "taxId",         label: "Tax ID",                  placeholder: "Tax identification number", type: "text", half: true,  required: true, validate: (v) => v.trim().length < 3 ? "Tax ID is required" : null },
    { id: "_social",       type: "social", half: false },
    { id: "photo",         label: "Profile Photo",           type: "photo", half: false, required: true },
  ],
  company: [
    { id: "name",   label: "Company Legal Name",    placeholder: "Full registered name",         type: "text", half: true,  required: true, validate: (v) => v.trim().length < 2 ? "Company name is required" : null },
    { id: "registrationNumber",   label: "Registration Number",   placeholder: "Company registration no.",     type: "text", half: true,  required: true, validate: (v) => v.trim().length < 3 ? "Registration number is required" : null },
    { id: "taxId",       label: "Tax ID",                placeholder: "Tax identification number",    type: "text", half: true,  required: true, validate: (v) => v.trim().length < 3 ? "Tax ID is required" : null },
    { id: "officialEmailDomain ", label: "Official Email Domain", placeholder: "@yourcompany.com",             type: "text", half: true,  required: true, validate: (v) => !/^@[\w.-]+\.[a-z]{2,}$/.test(v) ? "Enter a valid domain (e.g. @company.com)" : null },
    { id: "contactPhone",label: "Phone (Contact Person)",placeholder: "+1 (555) 000-0000",            type: "tel",  half: true,  required: true, validate: (v) => !/^\+?[\d\s\-(]{7,20}$/.test(v) ? "Enter a valid phone number" : null },
    { id: "contactEmail",      label: "Email Address",              placeholder: "j.sterling@example.com",  type: "email", half: true,  required: true,  validate: (v) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Enter a valid email" : null },
    { id: "address",     label: "Company Address",       placeholder: "Street, City, Country",        type: "text", half: false, required: true, validate: (v) => v.trim().length < 5 ? "Address is required" : null },
    { id: "documents",   label: "Official Documents",    type: "pdf",   half: false, required: true },
    { id: "_social",     type: "social", half: false },
    { id: "photo",       label: "Profile Photo",         type: "photo", half: false, required: true },
  ],
};

export const subtitles = {
  hobbyist:  "Details required for Hobbies-level curators.",
  business: "Details required for Business-level verification.",
  company:  "Details required for Company-level registration.",
};
