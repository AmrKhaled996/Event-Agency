import { UserIcon } from "lucide-react";

export const SOCIAL_PLATFORMS = [
  {
    id: "websiteUrl",
    label: "upgradeToOrganizer.social.platforms.websiteUrl",
    placeholder: "upgradeToOrganizer.fields.placeholders.social",
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
    label: "upgradeToOrganizer.social.platforms.instagramUrl",
    placeholder: "upgradeToOrganizer.fields.placeholders.social",
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
    label: "upgradeToOrganizer.social.platforms.facebookUrl",
    placeholder: "upgradeToOrganizer.fields.placeholders.social",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
  },
  {
    id: "twitterUrl",
    label: "upgradeToOrganizer.social.platforms.twitterUrl",
    placeholder: "upgradeToOrganizer.fields.placeholders.social",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4l16 16M4 20L20 4"/>
      </svg>
    ),
  },
  {
    id: "linkedinUrl",
    label: "upgradeToOrganizer.social.platforms.linkedinUrl",
    placeholder: "upgradeToOrganizer.fields.placeholders.social",
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
    label: "upgradeToOrganizer.social.platforms.youtubeUrl",
    placeholder: "upgradeToOrganizer.fields.placeholders.social",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
      </svg>
    ),
  },
];

export const categories = [
  {
    id: "hobbyist",
    label: "upgradeToOrganizer.categories.hobbyist.label",
    description: "upgradeToOrganizer.categories.hobbyist.description",
    icon: (
      <UserIcon />
    ),
  },
  {
    id: "business",
    label: "upgradeToOrganizer.categories.business.label",
    description: "upgradeToOrganizer.categories.business.description",
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
    label: "upgradeToOrganizer.categories.company.label",
    description: "upgradeToOrganizer.categories.company.description",
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
    { id: "name",   label: "upgradeToOrganizer.fields.name",                  placeholder: "upgradeToOrganizer.fields.placeholders.name",    type: "text",  half: true,  required: true,  validate: (v) => v.trim().length < 2 ? "upgradeToOrganizer.validation.nameRequired" : null },
    { id: "contactEmail",      label: "upgradeToOrganizer.fields.email",              placeholder: "upgradeToOrganizer.fields.placeholders.email",  type: "email", half: true,  required: true,  validate: (v) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "upgradeToOrganizer.validation.invalidEmail" : null },
    { id: "contactPhone",      label: "upgradeToOrganizer.fields.phone",               placeholder: "upgradeToOrganizer.fields.placeholders.phone",        type: "tel",   half: true,  required: true,  validate: (v) => !/^\+?[\d\s\-(]{7,20}$/.test(v) ? "upgradeToOrganizer.validation.invalidPhone" : null },
    { id: "nationalId", label: "upgradeToOrganizer.fields.nationalId", placeholder: "upgradeToOrganizer.fields.placeholders.nationalId",   type: "text",  half: true,  required: true,  validate: (v) => v.trim().length < 4 ? "upgradeToOrganizer.validation.idRequired" : null },
    { id: "_social",    type: "social", half: false },
    { id: "photo",      label: "upgradeToOrganizer.fields.profilePhoto",              type: "photo", half: false, required: true },
  ],
  business: [
    { id: "name",   label: "upgradeToOrganizer.fields.businessName",           placeholder: "upgradeToOrganizer.fields.placeholders.businessName",        type: "text", half: true,  required: true, validate: (v) => v.trim().length < 2 ? "upgradeToOrganizer.validation.businessNameRequired" : null },
    { id: "ownerName",   label: "upgradeToOrganizer.fields.businessName",           placeholder: "upgradeToOrganizer.fields.placeholders.businessName",        type: "text", half: true,  required: true, validate: (v) => v.trim().length < 2 ? "upgradeToOrganizer.validation.businessNameRequired" : null },
    { id: "contactEmail",      label: "upgradeToOrganizer.fields.email",              placeholder: "upgradeToOrganizer.fields.placeholders.email",  type: "email", half: true,  required: true,  validate: (v) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "upgradeToOrganizer.validation.invalidEmail" : null },
    { id: "contactPhone",         label: "upgradeToOrganizer.fields.phone",            placeholder: "upgradeToOrganizer.fields.placeholders.phone",         type: "tel",  half: true,  required: true, validate: (v) => !/^\+?[\d\s\-(]{7,20}$/.test(v) ? "upgradeToOrganizer.validation.invalidPhone" : null },
    { id: "address",       label: "upgradeToOrganizer.fields.businessAddress",        placeholder: "upgradeToOrganizer.fields.placeholders.address",     type: "text", half: true,  required: true, validate: (v) => v.trim().length < 5 ? "upgradeToOrganizer.validation.addressRequired" : null },
    { id: "commercialRegistration", label: "upgradeToOrganizer.fields.commercialRegistration", placeholder: "upgradeToOrganizer.fields.placeholders.registrationNumber",       type: "text", half: true,  required: true, validate: (v) => v.trim().length < 3 ? "upgradeToOrganizer.validation.registrationRequired" : null },
    { id: "taxId",         label: "upgradeToOrganizer.fields.taxId",                  placeholder: "upgradeToOrganizer.fields.placeholders.taxId", type: "text", half: true,  required: true, validate: (v) => v.trim().length < 3 ? "upgradeToOrganizer.validation.taxIdRequired" : null },
    { id: "_social",       type: "social", half: false },
    { id: "photo",         label: "upgradeToOrganizer.fields.profilePhoto",           type: "photo", half: false, required: true },
  ],
  company: [
    { id: "name",   label: "upgradeToOrganizer.fields.companyName",    placeholder: "upgradeToOrganizer.fields.placeholders.companyName",         type: "text", half: true,  required: true, validate: (v) => v.trim().length < 2 ? "upgradeToOrganizer.validation.companyNameRequired" : null },
    { id: "registrationNumber",   label: "upgradeToOrganizer.fields.registrationNumber",   placeholder: "upgradeToOrganizer.fields.placeholders.registrationNumber",     type: "text", half: true,  required: true, validate: (v) => v.trim().length < 3 ? "upgradeToOrganizer.validation.registrationRequired" : null },
    { id: "taxId",       label: "upgradeToOrganizer.fields.taxId",                placeholder: "upgradeToOrganizer.fields.placeholders.taxId",    type: "text", half: true,  required: true, validate: (v) => v.trim().length < 3 ? "upgradeToOrganizer.validation.taxIdRequired" : null },
    { id: "officialEmailDomain ", label: "upgradeToOrganizer.fields.officialEmailDomain", placeholder: "upgradeToOrganizer.fields.placeholders.emailDomain",             type: "text", half: true,  required: true, validate: (v) => !/^@[\w.-]+\.[a-z]{2,}$/.test(v) ? "upgradeToOrganizer.validation.invalidDomain" : null },
    { id: "contactPhone",label: "upgradeToOrganizer.fields.contactPhone",placeholder: "upgradeToOrganizer.fields.placeholders.phone",            type: "tel",  half: true,  required: true, validate: (v) => !/^\+?[\d\s\-(]{7,20}$/.test(v) ? "upgradeToOrganizer.validation.invalidPhone" : null },
    { id: "contactEmail",      label: "upgradeToOrganizer.fields.email",              placeholder: "upgradeToOrganizer.fields.placeholders.email",  type: "email", half: true,  required: true,  validate: (v) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "upgradeToOrganizer.validation.invalidEmail" : null },
    { id: "address",     label: "upgradeToOrganizer.fields.companyAddress",       placeholder: "upgradeToOrganizer.fields.placeholders.address",        type: "text", half: false, required: true, validate: (v) => v.trim().length < 5 ? "upgradeToOrganizer.validation.addressRequired" : null },
    { id: "officialDocument",   label: "upgradeToOrganizer.fields.officialDocuments",    type: "pdf",   half: false, required: true },
    { id: "_social",     type: "social", half: false },
    { id: "photo",       label: "upgradeToOrganizer.fields.profilePhoto",         type: "photo", half: false, required: true },
  ],
};

export const subtitles = {
  hobbyist:  "upgradeToOrganizer.subtitles.hobbyist",
  business: "upgradeToOrganizer.subtitles.business",
  company:  "upgradeToOrganizer.subtitles.company",
};
