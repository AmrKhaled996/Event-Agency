import { Title } from "react-head";
import { useCategories } from "../../Context/CategoriesProvider";
import CategoriesSkeleton from "../../components/UI/CategoriesSkeleton";
import { useTranslation } from "react-i18next";
import NavigationBar from "../../components/Layout/NavigationBar";
import Footer from "../../components/Layout/Footer";
import LocalLink from "../../Router/LocalLink";

function CategoriesPage() {
  const { t } = useTranslation();
  const { categories, loading } = useCategories();

  return (
    <>
      <Title>{t("Our Categories")} | Fa3liat</Title>
      <NavigationBar />
      <div className="min-h-screen bg-slate-50 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-12 text-center">
            {t("Our Categories")}
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8 justify-items-center">
            {loading ? (
              [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((_, index) => (
                <CategoriesSkeleton key={index} />
              ))
            ) : categories.length > 0 ? (
              categories.map((cat, index) => (
                <LocalLink
                  to={`/search-events?category=${cat.name}`}
                  key={index}
                  className="flex flex-col items-center text-center cursor-pointer group"
                >
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-md group-hover:shadow-xl transition-all border-4 border-white">
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      crossOrigin="anonymous"
                    />
                  </div>
                  <p className="mt-4 text-lg font-bold text-gray-800 group-hover:text-primary transition-colors">
                    {cat.name}
                  </p>
                </LocalLink>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 text-xl">
                {t("common.feedback.noResults")}
              </p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default CategoriesPage;
