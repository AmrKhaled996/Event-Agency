import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getSearchEvents } from '../../APIs/search';
import NavigationBar from '../../components/Layout/NavigationBar';
import Footer from '../../components/Layout/Footer';
import Loading from '../../components/Layout/LoadingLayout';
import { useTranslation } from 'react-i18next';
import { Title } from 'react-head';

const CalendarPage = () => {
  const { t } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        // Fetch a large number of events to populate the calendar
        const response = await getSearchEvents({ limit: 50, page: 1 });
        setEvents(response?.data?.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch events for calendar", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [currentDate]);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "MMMM yyyy";
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const getEventsForDay = (day) => {
    if (!events) return [];
    return events.filter(event => {
      if (!event.date) return false;
      const eventDate = parseISO(event.date);
      return isSameDay(day, eventDate);
    });
  };

  return (
    <>
      <Title>{t("layout.nav.calendar", { defaultValue: "Calendar" })} | Fa3liat</Title>
      <NavigationBar />
      
      <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{t("layout.nav.calendar", { defaultValue: "Calendar" })}</h1>
            <p className="text-gray-500 mt-2">Discover upcoming events on our interactive calendar.</p>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Calendar Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white">
              <h2 className="text-xl font-bold text-gray-900 capitalize">
                {format(currentDate, dateFormat)}
              </h2>
              <div className="flex gap-2">
                <button onClick={prevMonth} className="p-2.5 hover:bg-primary/10 hover:text-primary rounded-xl transition-colors border border-gray-200">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={nextMonth} className="p-2.5 hover:bg-primary/10 hover:text-primary rounded-xl transition-colors border border-gray-200">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
            
            {/* Days of Week */}
            <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/50">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 auto-rows-fr relative">
              {loading && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
                  <Loading />
                </div>
              )}
              {days.map((day, dayIdx) => {
                const dayEvents = getEventsForDay(day);
                const isCurrentMonth = isSameMonth(day, monthStart);
                const isToday = isSameDay(day, new Date());
                
                return (
                  <div 
                    key={day.toString()} 
                    className={`min-h-[140px] p-2 sm:p-3 border-r border-b border-gray-100 transition-colors ${!isCurrentMonth ? 'bg-gray-50/30 opacity-60' : 'bg-white'} ${dayIdx % 7 === 6 ? 'border-r-0' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-sm font-bold w-8 h-8 flex items-center justify-center rounded-full ${isToday ? 'bg-primary text-white shadow-md shadow-primary/30' : 'text-gray-700'}`}>
                        {format(day, 'd')}
                      </span>
                      {dayEvents.length > 0 && (
                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                          {dayEvents.length}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-1.5 mt-2">
                      {dayEvents.slice(0, 3).map((event, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => navigate(`/events/${event.slug}`)}
                          className="group relative flex flex-col px-2 py-1.5 rounded-lg bg-blue-50/50 border border-blue-100/50 cursor-pointer hover:bg-blue-100 hover:border-blue-200 transition-all"
                        >
                          <span className="text-[10px] font-bold text-blue-700 truncate">
                            {format(parseISO(event.date), 'HH:mm')}
                          </span>
                          <span className="text-[11px] leading-tight text-slate-700 truncate font-medium mt-0.5">
                            {event.title}
                          </span>
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="text-[10px] text-gray-500 font-medium px-1 text-center py-1 bg-gray-50 rounded-lg cursor-pointer">
                          +{dayEvents.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default CalendarPage;
