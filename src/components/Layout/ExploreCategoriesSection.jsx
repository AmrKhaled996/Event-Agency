import { ArrowLeft, ArrowRight } from "lucide-react";
import {  useRef } from "react";

import { useCategories } from "../../Context/CategoriesProvider";
import CategoriesSkeleton from "../UI/CategoriesSkeleton";
import CardSkeleton from "../UI/CardSkeleton";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import useAppNavigate from "../../Router/useAppNavigate";

function ExploreCategories() {
  const { t } = useTranslation();
  const { categories} = useCategories();
  const {lang}=useParams();
  const navigate = useAppNavigate();
  
  const scrollRef = useRef(null);

  const handleCategoryClick = (categoryId) => {
    navigate(`/search-events?categoryId=${categoryId}`);
  };

  const slideRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };
  const slideleft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };
  return (
    <section className="w-full py-20 bg-white no-scrollbar">
      <div className="max-w-350 mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            {t("categoriesSection.title")}
          </h2>
          <div >
          <div className={`flex  ${lang === "ar" ? "flex-row-reverse": "flex-row"}`}>
          <button
            onClick={slideleft}
            className="p-3 mr-5 rounded-full border border-gray-300 hover:bg-gray-100 transition"
            >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button
            onClick={slideRight}
            className="p-3 rounded-full border border-gray-300 hover:bg-gray-100 transition"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
            </div>
        </div>
        </div>
        <div
          ref={scrollRef}
          className="flex  overflow-x-auto lg:gap-10 md:gap-4 sm:gap-2 gap-0 no-scrollbar scroll-smooth space-x-2"
        >
          {categories.length > 0 ? (categories.map((cat, index) => ( 
            
            <div
              key={index}
              className="min-w-[180px] flex flex-col items-center text-center  cursor-pointer"
              onClick={() => handleCategoryClick(cat.id)}
            >
              <div className="w-32 h-32 rounded-full overflow-hidden shadow-md hover:shadow-xl transition-all">
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform"
                  crossOrigin="anonymous"
                />
              </div>
              <p className="mt-4 text-sm font-semibold text-gray-800 leading-snug hover:text-black">
                {cat.name}
              </p>
            </div>
          ))) : ([1, 2, 3, 4, 5, 6].map((temp,index) => <CategoriesSkeleton key={index} />))}

        </div>
      </div>
      
    </section>
  );
}

export default ExploreCategories;
