import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { handleError } from "../../../utils/errorHandler";
import { getOrganizerStatus } from "../../../APIs/userAPIs";
import { updateSettingsOrgainzerDashboard } from "../../../APIs/organizerDashboardAPIs";
import Loading from "../../../components/Layout/LoadingLayout";
import { toast } from "sonner";
import { Settings, Save, Globe, Instagram, Facebook, Twitter, Linkedin, Youtube, MapPin, CreditCard } from "lucide-react";

export default function OrganizerSettings() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    websiteUrl: "",
    instagramUrl: "",
    facebookUrl: "",
    twitterUrl: "",
    linkedinUrl: "",
    youtubeUrl: "",
    address: "",
    stripeAccountId: "",
  });

  const fetchOrganizerData = async () => {
    try {
      setLoading(true);
      const response = await getOrganizerStatus();
      const organizer = response.data.data.organizer;
      if (organizer) {
        setFormData({
          name: organizer.name || "",
          description: organizer.description || "",
          websiteUrl: organizer.websiteUrl || "",
          instagramUrl: organizer.instagramUrl || "",
          facebookUrl: organizer.facebookUrl || "",
          twitterUrl: organizer.twitterUrl || "",
          linkedinUrl: organizer.linkedinUrl || "",
          youtubeUrl: organizer.youtubeUrl || "",
          address: organizer.address || "",
          stripeAccountId: organizer.stripeAccountId || "",
        });
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizerData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          submitData.append(key, formData[key]);
        }
      });

      await updateSettingsOrgainzerDashboard(submitData);
      toast.success(t("organizer.settings.success") || "Settings updated successfully!");
    } catch (error) {
      handleError(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-primary/10 rounded-xl text-primary">
          <Settings size={28} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-800">{t("organizer.dashboard.settings") || "Settings"}</h2>
          <p className="text-gray-500">{t("organizer.settings.description") || "Manage your organizer profile and payout information."}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info Section */}
        <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-xl font-bold border-b pb-4 flex items-center gap-2">
            <Settings size={20} className="text-primary" /> {t("organizer.settings.basicInfo") || "Basic Information"}
          </h3>
          
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">{t("organizer.settings.name") || "Organizer Name"}</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="Ex: Fa3liat Events"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">{t("organizer.settings.bio") || "Description / Bio"}</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                placeholder="Tell us about your organization..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <MapPin size={16} /> {t("organizer.settings.address") || "Address"}
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="123 Street Name, City"
              />
            </div>
          </div>
        </section>

        {/* Payout Section */}
        <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-xl font-bold border-b pb-4 flex items-center gap-2">
            <CreditCard size={20} className="text-emerald-500" /> {t("organizer.settings.payoutInfo") || "Payout Information"}
          </h3>
          <p className="text-sm text-gray-500 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
            {t("organizer.settings.payoutNote") || "Enter your Stripe Account ID to receive revenue from your events. Ensure this is correct to avoid payment delays."}
          </p>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Stripe Account ID</label>
            <input
              type="text"
              name="stripeAccountId"
              value={formData.stripeAccountId}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-mono"
              placeholder="acct_xxxxxxxxxxxxxx"
            />
          </div>
        </section>

        {/* Social Links Section */}
        <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-xl font-bold border-b pb-4 flex items-center gap-2">
            <Globe size={20} className="text-blue-500" /> {t("organizer.settings.socialLinks") || "Social Media & Web"}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Globe size={18} />
              </div>
              <input
                type="text"
                name="websiteUrl"
                value={formData.websiteUrl}
                onChange={handleChange}
                className="w-full p-3 pl-10 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="Website URL"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-pink-500">
                <Instagram size={18} />
              </div>
              <input
                type="text"
                name="instagramUrl"
                value={formData.instagramUrl}
                onChange={handleChange}
                className="w-full p-3 pl-10 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="Instagram URL"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-600">
                <Facebook size={18} />
              </div>
              <input
                type="text"
                name="facebookUrl"
                value={formData.facebookUrl}
                onChange={handleChange}
                className="w-full p-3 pl-10 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="Facebook URL"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-sky-400">
                <Twitter size={18} />
              </div>
              <input
                type="text"
                name="twitterUrl"
                value={formData.twitterUrl}
                onChange={handleChange}
                className="w-full p-3 pl-10 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="Twitter URL"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-700">
                <Linkedin size={18} />
              </div>
              <input
                type="text"
                name="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={handleChange}
                className="w-full p-3 pl-10 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="LinkedIn URL"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-red-600">
                <Youtube size={18} />
              </div>
              <input
                type="text"
                name="youtubeUrl"
                value={formData.youtubeUrl}
                onChange={handleChange}
                className="w-full p-3 pl-10 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="YouTube URL"
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {saving ? <Loading inline /> : <Save size={20} />}
            {saving ? t("common.actions.saving") || "Saving..." : t("common.actions.saveChanges") || "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
