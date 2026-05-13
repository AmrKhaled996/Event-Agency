import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  CheckCircleIcon,
} from "lucide-react";
import { useCategories } from "../../Context/CategoriesProvider";
import { useState } from "react";
import { subscribeToNewsletter } from "../../APIs/newsletterAPIs";
import Loading from "./LoadingLayout";
import LocalLink from "../../Router/LocalLink";
import { useUser } from "../../Context/AuthProvider";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { categories } = useCategories();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsLetterLanguage, setNewsletterLanguage] = useState("en");
  const [newsletterError, setNewsletterError] = useState(null);
  const [validEmail, setValidEmail] = useState(false);
  const [validSubscribe, setValidSubscribe] = useState(false);
  const [loading, setloading] = useState(false);
  const { user } = useUser();
  const {t} = useTranslation();

  const validatenewsletterEmail = (email) => {
    setNewsletterEmail(email);

    if (!email) {
      // setNewsletterError("Email is required");
      return setValidEmail(false);
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      // setNewsletterError("Invalid email format email should contain latters And  @ And . ");
      return setValidEmail(false);
    }

    return setValidEmail(emailRegex.test(email));
  };
  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) {
      setNewsletterError(t("layout.footer.validation.emailRequired"));
      return;
    }
    if (!newsLetterLanguage) {
      setNewsletterError(t("layout.footer.validation.languageRequired"));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsletterEmail)) {
      setNewsletterError(
        t("layout.footer.validation.invalidFormat"),
      );
      return;
    }
    try {
      setloading(true);
      const response = await subscribeToNewsletter(
        newsletterEmail,
        newsLetterLanguage,
      );
      
      setNewsletterError(null);
      setValidSubscribe(true);
    } catch (err) {
      console.error("Error:", err);
      const message = err.response?.data?.error || t("common.feedback.error");
      setNewsletterError(message);
    } finally {
      setloading(false);
    }
  };

  return (
    <footer className="bg-[#B84DD6] text-white pt-14 pb-8  px-6 align-bottom">
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10">
    {/* Company Info */}
    <div>
      <h3 className="font-semibold text-lg mb-4 underline underline-offset-8">
        {t("layout.footer.companyInfo")}
      </h3>

      <ul className="space-y-2 text-white/90">
        <li>
          <LocalLink to="/about" className="hover:text-white">
            {t("layout.footer.about")}
          </LocalLink>
        </li>

        <li>
          <LocalLink to="" className="hover:text-white">
            {t("layout.footer.contact")}
          </LocalLink>
        </li>

        <li>
          <LocalLink to="" className="hover:text-white">
            {t("layout.footer.careers")}
          </LocalLink>
        </li>

        <li>
          <LocalLink to="" className="hover:text-white">
            {t("layout.footer.faqs")}
          </LocalLink>
        </li>

        <li>
          <LocalLink to="" className="hover:text-white">
            {t("layout.footer.terms")}
          </LocalLink>
        </li>

        <li>
          <LocalLink to="" className="hover:text-white">
            {t("layout.footer.privacy")}
          </LocalLink>
        </li>
      </ul>
    </div>

    {/* Help */}
    <div>
      <h3 className="font-semibold text-lg mb-4 underline underline-offset-8 ">
        {t("layout.footer.help")}
      </h3>

      <p className="mb-2">{t("layout.footer.chatbotHelp")}</p>

      {user && user.role ? (
        <LocalLink
          to="/help/chatbot"
          className="hover:text-white font-bold text-lg pt-8 underline underline-offset-4"
        >
          {t("layout.footer.chatbot")}
        </LocalLink>
      ) : (
        <p>{t("layout.footer.loginToUseChatbot")}</p>
      )}{" "}
    </div>

    {/* Categories */}
    <div>
      <h3 className="font-semibold text-lg mb-4 underline underline-offset-8">
        {t("layout.footer.categories")}
      </h3>

      <ul className="space-y-2 text-white/90">
        {categories.length < 7 ? (
          categories.map((category) => (
            <li key={category.name}>
              <LocalLink
                to={`/events?category=${category.name}`}
                className="hover:text-white"
              >
                {category.name}
              </LocalLink>
            </li>
          ))
        ) : (
          <li>
            <LocalLink
              to="/categories"
              className="hover:text-white font-semibold text-xl "
            >
              {t("layout.footer.allCategories")}
            </LocalLink>
          </li>
        )}
      </ul>
    </div>

    {/* Follow Us */}
    <div>
      <h3 className="font-semibold text-lg mb-4 underline underline-offset-8">
        {t("layout.footer.followUs")}
      </h3>

      <div className="flex flex-col space-y-3 text-white/90">
        <a
          href="https://facebook.com"
          target="_blank"
          className="flex items-center gap-2 hover:text-white"
        >
          <Facebook size={18} /> {t("layout.footer.facebook")}
        </a>

        <a
          href="https://instagram.com"
          target="_blank"
          className="flex items-center gap-2 hover:text-white"
        >
          <Instagram size={18} /> {t("layout.footer.instagram")}
        </a>

        <a
          href="https://twitter.com"
          target="_blank"
          className="flex items-center gap-2 hover:text-white"
        >
          <Twitter size={18} /> {t("layout.footer.twitter")}
        </a>

        <a
          href="https://youtube.com"
          target="_blank"
          className="flex items-center gap-2 hover:text-white"
        >
          <Youtube size={18} /> {t("layout.footer.youtube")}
        </a>
      </div>
    </div>

    {/* Newsletter */}
    <div>
      <h3 className="font-semibold text-lg mb-4 underline underline-offset-8">
        {t("layout.footer.newsletter")}
      </h3>

      <p className="text-white/90 mb-4">
        {t("layout.footer.newsletterText")}
      </p>

      <div className="flex flex-col items-center gap-2">
        <input
          type="email"
          placeholder={t("layout.footer.newsletterPlaceholder")}
          value={newsletterEmail}
          onChange={(e) => validatenewsletterEmail(e.target.value)}
          className="bg-white rounded-lg mb-6 p-10 w-full h-12 text-black placeholder-gray-400 placeholder:overflow-hidden outline-none px-3 py-2 mr-2"
        />

        {validEmail && (
          <div className=" text-lg mb-4 w-full flex items-center justify-between">
            {t("layout.footer.language")}:
            <br />

            <input
              type="radio"
              id="en"
              name="language"
              value="en"
              className="ml-4 mr-1"
              onChange={(e) => setNewsletterLanguage(e.target.value)}
            />

            <label htmlFor="en" className="mr-4">
              {t("layout.footer.english")}
            </label>

            <input
              type="radio"
              id="ar"
              name="language"
              value="ar"
              className="ml-4 mr-1"
              onChange={(e) => setNewsletterLanguage(e.target.value)}
            />

            <label htmlFor="ar">
              {t("layout.footer.arabic")}
            </label>
          </div>
        )}

        {newsletterError && (
          <p className="text-red-500">{newsletterError}</p>
        )}

        <button
          type="submit"
          className={` h-fit w-40 text-white font-semibold px-4 py-3 rounded-md flex justify-center items-center gap-2 ${
            validSubscribe
              ? "bg-green-600 cursor-not-allowed"
              : "bg-secandry hover:cursor-pointer"
          }`}
          disabled={validSubscribe}
          onClick={handleSubscribe}
        >
          {validSubscribe
            ? t("layout.footer.emailSent")
            : t("layout.footer.subscribe")}{" "}

          {validSubscribe && <CheckCircleIcon />}
        </button>
      </div>
    </div>
  </div>

  {/* Bottom */}
  <div className="mt-12 pt-6 border-t border-white/20 text-center text-white/80">
    © {new Date().getFullYear()} Fa3liat.{" "}
    {t("layout.footer.allRightsReserved")}
  </div>

  {loading && <Loading />}
</footer>  );
}
