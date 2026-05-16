import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Title } from "react-head";
import { broadcastNewsletter } from "../../../APIs/adminDashboardApis";
import { toast } from "sonner";
import { Send, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "../../../components/shadcn/button";

export default function NewsletterBroadcastPanel() {
  const { t } = useTranslation();
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !content.trim()) {
      toast.error(t("admin.newsletter.validation"));
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      await broadcastNewsletter({ subject, content });
      setResult({ success: true });
      setSubject("");
      setContent("");
      toast.success(t("admin.newsletter.success"));
    } catch (err) {
      console.error("[NewsletterBroadcast]", err);
      setResult({ 
        success: false, 
        message: err?.response?.data?.message || t("admin.newsletter.error") 
      });
      toast.error(t("admin.newsletter.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <Title>{t("admin.newsletter.title")}</Title>
      
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-slate-900">{t("admin.newsletter.title")}</h2>
        <p className="text-slate-500 text-sm">
          {t("admin.newsletter.desc")}
        </p>
      </div>

      <form onSubmit={handleBroadcast} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-700">{t("admin.newsletter.subjectLabel")}</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder={t("admin.newsletter.subjectPlaceholder")}
            className="px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            disabled={loading}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-700">{t("admin.newsletter.contentLabel")}</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t("admin.newsletter.contentPlaceholder")}
            className="min-h-[300px] px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-y font-mono text-sm"
            disabled={loading}
          />
        </div>

        {result && (
          <div className={`p-4 rounded-lg flex items-center gap-3 ${result.success ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {result.success ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span className="text-sm font-medium">
              {result.success ? t("admin.newsletter.success") : result.message}
            </span>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => { setSubject(""); setContent(""); setResult(null); }}
            disabled={loading}
          >
            {t("buttons.clear")}
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
            className="flex items-center gap-2 px-8"
          >
            {loading ? t("buttons.sending") : <><Send size={18} /> {t("buttons.sendBroadcast")}</>}
          </Button>
        </div>
      </form>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
        <AlertCircle className="text-amber-600 shrink-0" size={20} />
        <div className="text-xs text-amber-800 leading-relaxed">
          <p className="font-bold mb-1">{t("admin.newsletter.noteTitle")}</p>
          <p>{t("admin.newsletter.noteDesc")}</p>
        </div>
      </div>
    </div>
  );
}
