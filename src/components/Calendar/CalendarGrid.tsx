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
    isToday
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
        <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between px-4 md:px-6 py-4 border-b bg-white gap-4">
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <div className="flex items-center gap-2 text-blue-600">
                        <CalendarIcon className="w-6 h-6" />
                        <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                            Calendário
                        </h1>
                    </div>

                    <a
                        href={SPREADSHEET_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors w-full md:w-auto justify-center"
                    >
                        <span>Acesse a planilha</span>
                        <ExternalLink size={14} />
                    </a>
                </div>

                <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto justify-between md:justify-end">
                    <button
                        onClick={loadEvents}
                        disabled={loading}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Atualizar dados"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>

                    <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
                        <button onClick={prevMonth} className="p-1 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-600">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="px-2 md:px-4 font-semibold text-gray-700 min-w-[120px] md:min-w-[140px] text-center capitalize text-sm md:text-base">
                            {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
                        </div>
                        <button onClick={nextMonth} className="p-1 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-600">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    <button
                        onClick={resetToToday}
                        className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors whitespace-nowrap"
                    >
                        Hoje
                    </button>
                </div>
            </div>

            {/* Week days header */}
            <div className="grid grid-cols-7 border-b bg-gray-50/50 min-w-[600px] md:min-w-0">
                {weekDays.map((day) => (
                    <div key={day} className="py-2 text-center text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wider">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            {loading && events.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                        <p className="text-gray-500 font-medium">Carregando eventos...</p>
                    </div>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto overflow-x-auto">
                    <div className="grid grid-cols-7 min-w-[600px] md:min-w-0 min-h-full auto-rows-fr">
                        {calendarDays.map((day, dayIdx) => {
                            const dayEvents = events.filter(e => isSameDay(e.date, day));
                            const isCurrentMonth = isSameMonth(day, monthStart);
                            const isTodayDate = isToday(day);

                            return (
                                <div
                                    key={day.toString()}
                                    className={`
                                        min-h-[100px] md:min-h-[120px] border-b border-r p-1 md:p-2 transition-colors hover:bg-gray-50/30
                                        ${!isCurrentMonth ? 'bg-gray-50/50 text-gray-400' : 'bg-white'}
                                        ${isTodayDate ? 'bg-blue-50/30' : ''}
                                    `}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span
                                            className={`
                                                text-xs md:text-sm font-medium w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-full
                                                ${isTodayDate
                                                    ? 'bg-blue-600 text-white shadow-md'
                                                    : isCurrentMonth ? 'text-gray-700' : 'text-gray-400'}
                                            `}
                                        >
                                            {format(day, 'd')}
                                        </span>
                                        {dayEvents.length > 0 && (
                                            <span className="text-[10px] md:text-xs font-medium text-gray-400 hidden md:inline">
                                                {dayEvents.length}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-1 mt-1">
                                        {dayEvents.map((event, idx) => (
                                            <EventCard
                                                key={`${event.formattedDate}-${idx}`}
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
