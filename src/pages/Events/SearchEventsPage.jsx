import { use, useEffect, useState } from "react";
import HomeHeader from "../../components/Layout/HomeHeader";
import Card from "../../components/UI/Card";
import { useCategories } from "../../Context/CategoriesProvider";
import { Title } from "react-head";
import { FilterIcon, X } from "lucide-react";
import CardSkeleton from "../../components/UI/CardSkeleton";
import { useLocation, useSearchParams } from "react-router-dom";
import { latestEvents } from "../../APIs/homeApis";
import { getSearchEvents } from "../../APIs/search";

function SearchEventsPage() {
  const [cards, setCards] = useState();
  const [priceMax, setPriceMax] = useState(3000);
  const [priceMin, setPriceMin] = useState(0);
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("Today");
  const [activeTags, setActiveTags] = useState({ date: "Today", category: "" });
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const { categories, loading } = useCategories();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("q") || "";
  const location = searchParams.get("location") || "";
  // const [searchval, setsearchval] = useState<string>(search);

  const handleSearch = async () => {
    const params = new URLSearchParams(searchParams); // clone current params

    setSearchParams(params);
    console.log("params:", params.toString());
    try {
      // setloading(true);
      const response = await getSearchEvents({
        q: search,
        limit: 10,
        page: 1,
        organizerId: "",
        minPrice: priceMin,
        maxPrice: priceMax,
        categoryId: category?.id,
        location: location,
      });
      const newcards = response.data.data;
      if (newcards.events.length === 0) {
        setCards("No events found");
        return;
      }
      console.log("    ", response.data.data);
      setCards(newcards.events);
      // setloading(false);
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    handleSearch();
  }, [search]);

  useEffect(() => {}, []);

  const dateOptions = ["Today", "Tomorrow", "Next week", "Next month"];

  const handleCategoryChange = (val) => {
    setCategory(val);
    setActiveTags((prev) => ({ ...prev, category: val }));
  };

  const handleDateChange = (val) => {
    setDate(val);
    setActiveTags((prev) => ({ ...prev, date: val }));
  };

  const removeTag = (type) => {
    setActiveTags((prev) => ({ ...prev, [type]: "" }));
    if (type === "date") setDate("");
    if (type === "category") setCategory("");
  };

  const applyFilters = () => {
    // console.log(activeTags);
    console.log("price:", priceMax);
    console.log("category:", category);
    console.log("date:", date);
    console.log("activeTags:", activeTags);
  };

  return (
    <div>
      <Title>Fa3liat | Search Events</Title>
      <HomeHeader />
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Sidebar */}
        {isOpenFilter && (
          <aside className="md:w-64 w-full md:border-r border-gray-200 px-5 py-6 flex flex-col  gap-7 border-b md:border-b-0 ">
            <div className="flex  justify-between">
              <h2 className="text-lg font-medium text-gray-900">Filters</h2>
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
              {/* Price Range */}
              <div className="flex flex-col gap-3 flex-2">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Price Range
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
                  Up to {priceMax.toLocaleString()} EGP
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceMin || ""}
                    onChange={(e) => setPriceMin(Number(e.target.value))}
                    step={100}
                    defaultValue={0}
                    className="w-20 px-2 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                  />
                  <span className="text-sm text-gray-400">—</span>
                  <input
                    type="number"
                    placeholder="Max"
                    defaultValue={priceMax}
                    value={priceMax || ""}
                    step={100}
                    max={5000}
                    onChange={(e) => setPriceMax(Number(e.target.value))}
                    className="w-20 px-2 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Category Dropdown */}
              <div className="flex flex-col gap-3 flex-1">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Category
                </p>
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-800 outline-none focus:border-ring-primary focus:ring-1 focus:ring-primary/40 cursor-pointer"
                >
                  <option value="">All categories</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date Radio Buttons */}

            <div className="flex flex-col gap-3">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Date
              </p>
              <div className="flex md:flex-col flex-wrap gap-1.5">
                {dateOptions.map((opt) => (
                  <label
                    key={opt}
                    onClick={() => handleDateChange(opt)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer border transition-all ${
                      date === opt
                        ? " ring-primary/80 border-primary"
                        : "border-transparent  hover:ring-1 hover:ring-primary/40"
                    }`}
                  >
                    {/* Custom radio dot */}
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        date === opt ? "ring-primary" : "border-gray-300"
                      }`}
                    >
                      {date === opt && (
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <span className="text-sm text-gray-800">{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Apply Button */}
            <div className="flex justify-center">
              <button
                onClick={applyFilters}
                className=" flex justify-center w-64 py-2.5 text-sm font-medium text-white rounded-lg bg-primary accent-primary hover:opacity-90 transition-opacity"
              >
                Apply filters
              </button>
            </div>
          </aside>
        )}
        {/* Main Content */}
        <main className="flex-1 px-7 py-4 flex flex-col gap-5 ">
          {/* Top Bar */}
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
                  filter
                </span>
              </div>
            )}
            <p className="text-sm text-gray-500 m-3">
              <span className="font-medium text-gray-900">24</span> events found
            </p>
            <select className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-800 outline-none  focus:ring-2 focus:ring-primary/20 cursor-pointer sm:ml-auto ">
              <option>Relevance</option>
              <option>Date: soonest</option>
              <option>Price: low to high</option>
              <option>Price: high to low</option>
            </select>
          </div>

          {/* Active Filter Tags */}
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

          {/* Cards Grid */}
          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] lg:grid-cols-[repeat(3,minmax(240px,1fr))] gap-4">
            {/* cards */}
            {cards?.length > 0
              ? cards?.map((card, index) => {
                  return (
                    <Card
                      key={index}
                      bannerUrl={`${card?.bannerUrl}`}
                      title={card?.title}
                      description={card?.description}
                      date={card?.date}
                      price={card?.ticketTypes || []}
                      views={card?.viwes}
                      id={card?.id}
                      slug={card?.slug}
                      sessions={card?.eventSessions || []}
                      isInterested={card?.isInterested}
                      crossOrigin="anonymous"
                    />
                  );
                })
              : Array.from({ length: 6 }).map((card, i) => (
                  <CardSkeleton key={i} />
                ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default SearchEventsPage;
