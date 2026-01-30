'use client';

import { useState, useEffect } from 'react';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    isToday,
    isWithinInterval,
    startOfDay,
    endOfDay
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Loader2, Calendar as CalendarIcon, RefreshCw, ExternalLink } from 'lucide-react';
import { fetchCalendarEvents, CalendarEvent } from '@/lib/googleSheets';
import EventCard from './EventCard';
import EventModal from './EventModal';

export default function CalendarGrid() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const SPREADSHEET_LINK = 'https://docs.google.com/spreadsheets/d/12CGeY7acJRrVg05eYoNOY7TrO6tg2-FxqKAdnx0s7MU/edit?gid=0#gid=0';

    const loadEvents = async () => {
        setLoading(true);
        const data = await fetchCalendarEvents();
        setEvents(data);
        setLoading(false);
    };

    useEffect(() => {
        loadEvents();
    }, []);

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const resetToToday = () => setCurrentDate(new Date());

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({
        start: startDate,
        end: endDate,
    });

    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    return (
        <div className="flex flex-col h-full bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden ring-1 ring-black/5">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between px-3 md:px-6 py-2 md:py-3 border-b border-indigo-100/50 bg-white/50 backdrop-blur-md gap-2 md:gap-4">
                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 w-full md:w-auto">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 md:p-2 bg-blue-600/10 rounded-xl text-blue-600">
                            <CalendarIcon className="w-4 h-4 md:w-5 md:h-5" />
                        </div>
                        <h1 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight">
                            Calendário
                        </h1>
                    </div>

                    <a
                        href={SPREADSHEET_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-2 px-4 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-full border border-indigo-200/50 transition-all shadow-sm hover:shadow-md w-full md:w-auto justify-center"
                    >
                        <span>Acesse a planilha</span>
                        <ExternalLink size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </a>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                    <button
                        onClick={loadEvents}
                        disabled={loading}
                        className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all disabled:opacity-50"
                        title="Atualizar dados"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>

                    <div className="flex items-center bg-white rounded-xl p-1 shadow-sm border border-slate-200/60">
                        <button onClick={prevMonth} className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors text-slate-500 hover:text-slate-700">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="px-4 font-semibold text-slate-700 min-w-[140px] text-center capitalize text-base">
                            {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
                        </div>
                        <button onClick={nextMonth} className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors text-slate-500 hover:text-slate-700">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    <button
                        onClick={resetToToday}
                        className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 rounded-xl transition-all hover:scale-105 active:scale-95"
                    >
                        Hoje
                    </button>
                </div>
            </div>

            {/* Week days header */}
            <div className="grid grid-cols-7 border-b border-indigo-50/50 bg-indigo-50/30 min-w-[600px] md:min-w-0">
                {weekDays.map((day) => (
                    <div key={day} className="py-1.5 md:py-2 text-center text-[10px] md:text-xs font-bold text-indigo-400 uppercase tracking-widest">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            {loading && events.length === 0 ? (
                <div className="flex-1 flex items-center justify-center bg-white/30 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-4">
                        <div className="p-4 bg-white/50 rounded-full shadow-xl">
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        </div>
                        <p className="text-slate-500 font-medium animate-pulse">Carregando eventos...</p>
                    </div>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto overflow-x-auto custom-scrollbar">
                    <div className="grid grid-cols-7 min-w-[600px] md:min-w-0 min-h-full auto-rows-fr bg-slate-50/50">
                        {calendarDays.map((day, dayIdx) => {
                            // Filter events that fall within this day's date range
                            const dayEvents = events.filter(e => {
                                const dayStart = startOfDay(day);
                                const dayEnd = endOfDay(day);
                                const eventStart = startOfDay(e.startDate);
                                const eventEnd = endOfDay(e.endDate);

                                // Check if day falls within the event's date range
                                return isWithinInterval(dayStart, { start: eventStart, end: eventEnd }) ||
                                    isWithinInterval(dayEnd, { start: eventStart, end: eventEnd }) ||
                                    (dayStart <= eventStart && dayEnd >= eventEnd);
                            });
                            const isCurrentMonth = isSameMonth(day, monthStart);
                            const isTodayDate = isToday(day);

                            return (
                                <div
                                    key={day.toString()}
                                    className={`
                    min-h-[70px] md:min-h-[90px] border-b border-r border-slate-100 p-1 md:p-1.5 transition-all duration-300 hover:bg-white/80
                    ${!isCurrentMonth ? 'bg-slate-50/50 text-slate-300' : 'bg-white/40'}
                    ${isTodayDate ? 'bg-blue-50/40 ring-inset ring-2 ring-blue-100' : ''}
                  `}
                                >
                                    <div className="flex justify-between items-start mb-0.5 md:mb-1">
                                        <span
                                            className={`
                        text-[10px] md:text-xs font-semibold w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-lg transition-transform hover:scale-110
                        ${isTodayDate
                                                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                                                    : isCurrentMonth ? 'text-slate-600' : 'text-slate-300'}
                      `}
                                        >
                                            {format(day, 'd')}
                                        </span>
                                        {dayEvents.length > 0 && (
                                            <span className="text-[8px] md:text-[9px] font-bold text-slate-400 bg-slate-100 px-1 py-0.5 rounded-md hidden md:inline-block">
                                                {dayEvents.length}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-0.5 md:gap-1 mt-0.5">
                                        {dayEvents.map((event, idx) => (
                                            <EventCard
                                                key={`${event.formattedStartDate}-${event.formattedEndDate}-${idx}`}
                                                event={event}
                                                onClick={(e) => {
                                                    setSelectedEvent(e);
                                                    setIsModalOpen(true);
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Modal */}
            <EventModal
                event={selectedEvent}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
