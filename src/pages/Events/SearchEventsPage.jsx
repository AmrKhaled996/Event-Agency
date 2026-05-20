import { useEffect, useState, useCallback } from "react";
import HomeHeader from "../../components/Layout/HomeHeader";
import Card from "../../components/UI/Card";
import { useCategories } from "../../Context/CategoriesProvider";
import { Title } from "react-head";
import { FilterIcon, Search as LucideSearch, X, AlertCircle } from "lucide-react";
import CardSkeleton from "../../components/UI/CardSkeleton";
import {  useSearchParams } from "react-router-dom";

import { getSearchEvents } from "../../APIs/search";
import { useTranslation } from "react-i18next";
import Pagination from "../../components/UI/AdminDashboard/Pagination";
import { handleError } from "../../utils/errorHandler";
import EmptyState from "../../components/UI/EmptyState";
import { Button } from "../../components/shadcn/button";


function SearchEventsPage() {
  const [cards, setCards] = useState(null);
  const [priceMax, setPriceMax] = useState(5000);
  const [priceMin, setPriceMin] = useState(0);
  const [category, setCategory] = useState(null);
  const [date, setDate] = useState("");
  const [activeTags, setActiveTags] = useState({ date: "", category: "" });
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const { categories } = useCategories();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("q") || "";
  const location = searchParams.get("location") || "";
  const [pagination, setPagination] = useState();
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const { t } = useTranslation();

  useEffect(() => {
    if (categories?.length > 0) {
      const catId = searchParams.get("categoryId");
      if (catId) {
        const found = categories.find(c => String(c.id) === String(catId));
        if (found) {
          setCategory(found);
          setActiveTags(prev => ({ ...prev, category: found.name }));
        }
      } else {
        setCategory(null);
        setActiveTags(prev => ({ ...prev, category: "" }));
      }

      const minP = searchParams.get("minPrice");
      setPriceMin(minP ? Number(minP) : 0);

      const maxP = searchParams.get("maxPrice");
      setPriceMax(maxP ? Number(maxP) : 5000);

      const dt = searchParams.get("date");
      if (dt) {
        setDate(dt);
        setActiveTags(prev => ({ ...prev, date: dt }));
      } else {
        setDate("");
        setActiveTags(prev => ({ ...prev, date: "" }));
      }

      const pg = searchParams.get("page");
      setPage(pg ? Number(pg) : 1);
    }
  }, [categories, searchParams]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    let changed = false;
    
    const updateParam = (key, value, defaultValue) => {
      const current = params.get(key);
      if (value !== null && value !== undefined && value !== defaultValue) {
        if (current !== String(value)) {
          params.set(key, value);
          changed = true;
        }
      } else {
        if (params.has(key)) {
          params.delete(key);
          changed = true;
        }
      }
    };

    updateParam("categoryId", category?.id, null);
    updateParam("minPrice", priceMin, 0);
    updateParam("maxPrice", priceMax, 5000);
    updateParam("date", date, "");
    updateParam("page", page, 1);
    
    if (changed) {
      setSearchParams(params, { replace: true });
    }
  }, [category?.id, priceMin, priceMax, date, page, setSearchParams, searchParams]);

  const handleSearch = useCallback(async (currentParams) => {
    const params = currentParams || {
      q: search,
      page: page,
      min: priceMin,
      max: priceMax,
      catId: category?.id,
      loc: location,
      dt: date
    };

    const { q, page: pg, min, max, catId, loc, dt } = params;
    
    if (q && q.length > 0 && q.length < 2) {
      setCards([]);
      return;
    }

    try {
      setIsFetching(true);
      setErrorMessage(null);
      
      const response = await getSearchEvents({
        q: q,
        limit: 12,
        page: pg,
        minPrice: min === 0 ? undefined : min,
        maxPrice: max === 5000 ? undefined : max,
        categoryId: catId,
        location: loc,
        date: dt || undefined,
      });
      
      const newcards = response?.data?.data?.data || [];
      setCards(newcards);
      setPagination(response?.data?.data?.pagination);
    } catch (error) {
      handleError(error, { 
        silent: true,
        onMapped: (msg) => setErrorMessage(msg)
      });
      setCards([]);
    } finally {
      setIsFetching(false);
    }
  }, [search, page, priceMin, priceMax, category?.id, location, date]);

  useEffect(() => {
    const params = {
      q: search,
      page: page,
      min: priceMin,
      max: priceMax,
      catId: category?.id,
      loc: location,
      dt: date
    };

    const timeoutId = setTimeout(() => {
      handleSearch(params);
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [search, page, priceMin, priceMax, category?.id, location, date, handleSearch]);



  const dateOptions = [
    { label: t("events.search.dateOptions.allTime", "All Time"), value: "" },
    { label: t("events.search.dateOptions.today"), value: "Today" },
    { label: t("events.search.dateOptions.tomorrow"), value: "Tomorrow" },
    { label: t("events.search.dateOptions.nextWeek"), value: "Next week" },
    { label: t("events.search.dateOptions.nextMonth"), value: "Next month" },
  ];

  const handleCategoryChange = (val) => {
    const selectedCat = categories?.find((cat) => String(cat.id) === String(val));
    setCategory(selectedCat || null);
    setActiveTags((prev) => ({ ...prev, category: selectedCat?.name || "" }));
  };

  const handleDateChange = (val) => {
    setDate(val);
    setActiveTags((prev) => ({ ...prev, date: val }));
  };

  const removeTag = (type) => {
    setActiveTags((prev) => ({ ...prev, [type]: "" }));
    if (type === "date") setDate("");
    if (type === "category") setCategory(null);
  };

  const applyFilters = () => {
    handleSearch();
  };

  return (
    <div>
      <Title>{t("events.search.title")}</Title>
      <HomeHeader />
      <div className="flex flex-col md:flex-row min-h-screen">
        {isOpenFilter && (
          <aside className="md:w-64 w-full md:border-r border-gray-200 px-5 py-6 flex flex-col  gap-7 border-b md:border-b-0 ">
            <div className="flex  justify-between">
              <h2 className="text-lg font-medium text-gray-900">
                {t("events.search.filter")}
              </h2>
              <button
                onClick={() => setIsOpenFilter(false)}
                className="flex justify-center w-8 h-8 text-center items-center text-sm font-medium text-slate-900 rounded-lg bg-white accent-white border border-gray-200  hover:bg-gray-100 transition-all duration-300"
              >
                <X
                  className="text-slate-900 w-6 h-6"
                  size={16}
                  strokeWidth={1}
                />
              </button>
            </div>
            <div className="flex flex-wrap sm:flex-nowrap md:flex-col gap-7">
              <div className="flex flex-col gap-3 flex-2">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  {t("events.search.priceRange")}
                </p>
                <input
                  type="range"
                  min={0}
                  max={5000}
                  step={100}
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full  accent-secandry cursor-pointer"
                />
                <p className="text-xs text-gray-400">
                  {t("events.search.upTo")} {priceMax.toLocaleString()}{" "}
                  {t("common.actions.currncy")}
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceMin || ""}
                    onChange={(e) => setPriceMin(Number(e.target.value))}
                    step={100}
                    className="w-20 px-2 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                  />
                  <span className="text-sm text-gray-400">—</span>
                  <input
                    type="number"
                    placeholder={t("events.search.maxPrice")}
                    defaultValue={priceMax}
                    value={priceMax || ""}
                    step={100}
                    max={5000}
                    onChange={(e) => setPriceMax(Number(e.target.value))}
                    className="w-20 px-2 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 flex-1">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  {t("events.search.category")}
                </p>
                <select
                  value={category?.id || ""}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-800 outline-none focus:border-ring-primary focus:ring-1 focus:ring-primary/40 cursor-pointer"
                >
                  <option value="">{t("events.search.allCategories")}</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                {t("events.search.date")}
              </p>
              <div className="flex md:flex-col flex-wrap gap-1.5">
                {dateOptions.map((opt) => (
                  <label
                    key={opt.value}
                    onClick={() => handleDateChange(opt.value)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer border transition-all ${
                      date === opt.value
                        ? " ring-primary/80 border-primary"
                        : "border-transparent  hover:ring-1 hover:ring-primary/40"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        date === opt.value ? "ring-primary" : "border-gray-300"
                      }`}
                    >
                      {date === opt.value && (
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <span className="text-sm text-gray-800">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={applyFilters}
                className=" flex justify-center w-64 py-2.5 text-sm font-medium text-white rounded-lg bg-primary accent-primary hover:opacity-90 transition-opacity"
              >
                {t("events.search.apply")}
              </button>
            </div>
          </aside>
        )}
        <main className="flex-1 px-7 py-4 flex flex-col gap-5 ">
          <div className="flex items-center flex-wrap">
            {!isOpenFilter && (
              <div className="flex m-3 ml-0  h-fit  gap-2 justify-center items-center">
                <button
                  onClick={() => setIsOpenFilter(true)}
                  className="flex justify-center w-8 h-8 text-center items-center text-sm font-medium text-slate-900 rounded-lg bg-white accent-white border border-gray-200  hover:bg-gray-100 transition-all duration-300"
                >
                  <FilterIcon
                    className="text-slate-900 w-6 h-6"
                    size={16}
                    strokeWidth={1}
                  />
                </button>
                <span className="text-sm text-gray-400 font-medium self-center ">
                  {t("events.search.filter")}
                </span>
              </div>
            )}
            <p className="text-sm text-gray-500 m-3">
              <span className="font-medium text-gray-900">
                {cards?.length || 0}
              </span>{" "}
              {t("events.search.eventsFound")}
            </p>
          </div>

          {(activeTags.date || activeTags.category) && (
            <div className="flex flex-wrap gap-2">
              {activeTags.date && (
                <span className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border border-slate-600 text-slate-800">
                  {activeTags.date}
                  <button
                    onClick={() => removeTag("date")}
                    className="text-sm leading-none opacity-60 hover:opacity-100"
                  >
                    ×
                  </button>
                </span>
              )}
              {activeTags.category && (
                <span className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border border-slate-600 text-slate-800">
                  {activeTags.category}
                  <button
                    onClick={() => removeTag("category")}
                    className="text-sm leading-none text-slate-800 opacity-60 hover:opacity-100"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}

          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] lg:grid-cols-[repeat(3,minmax(240px,1fr))] gap-4">
            {isFetching ? (
              Array.from({ length: 6 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))
            ) : errorMessage ? (
              <div className="col-span-full">
                <EmptyState 
                  title={t("common.errors.fetchError")}
                  description={errorMessage}
                  icon={AlertCircle}
                  action={
                    <Button onClick={() => handleSearch()} variant="default">
                      {t("common.actions.tryAgain")}
                    </Button>
                  }
                />
              </div>
            ) : cards?.length > 0 ? (
              cards.map((card, index) => {
                const price = [
                  {
                    createdAt: "2026-05-07T09:20:08.511Z",
                    eventId: 12,
                    id: 4,
                    name: "عادي",
                    price: card?.priceStartsFrom,
                    quantity: 100,
                    sold: 2,
                    updatedAt: "2026-05-07T09:23:16.019Z",
                  },
                ];

                return (
                  <Card
                    key={card?.id || index}
                    bannerUrl={`${card?.bannerUrl}`}
                    title={card?.title}
                    description={card?.description}
                    date={card?.date}
                    price={price || []}
                    views={card?.viwes}
                    id={card?.id}
                    slug={card?.slug}
                    sessions={card?.eventSessions || []}
                    isInterested={card?.isInterested}
                    crossOrigin="anonymous"
                    interestedCount={card?.interestedCount}
                  />
                );
              })
            ) : (
              <div className="col-span-full">
                <EmptyState 
                  title={t("common.feedback.noResults")}
                  description={t("events.search.tryDifferent", "Try adjusting your filters or search query to find what you're looking for.")}
                  icon={LucideSearch}
                />
              </div>
            )}
          </div>
        </main>
      </div>
      <div className="w-full flex justify-center mb-8">
        <Pagination
          page={page}
          total={pagination?.total || 10}
          limit={pagination?.limit || 8}
          onChange={setPage}
        />
      </div>
    </div>
  );
}

export default SearchEventsPage;
