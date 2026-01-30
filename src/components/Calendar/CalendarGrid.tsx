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
    const [selectedSector, setSelectedSector] = useState<string>('all');

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

    // Get unique sectors for filter
    const uniqueSectors = Array.from(new Set(events.map(e => e.sector).filter(Boolean)));

    // Filter events by selected sector
    const filteredEvents = selectedSector === 'all'
        ? events
        : events.filter(e => e.sector === selectedSector);

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

                    {/* Sector Filter */}
                    <select
                        value={selectedSector}
                        onChange={(e) => setSelectedSector(e.target.value)}
                        className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 transition-all shadow-sm cursor-pointer w-full md:w-auto"
                    >
                        <option value="all">Todos os Setores</option>
                        {uniqueSectors.sort().map(sector => (
                            <option key={sector} value={sector}>{sector}</option>
                        ))}
                    </select>
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
                    <CalendarWeekRows
                        calendarDays={calendarDays}
                        events={filteredEvents}
                        monthStart={monthStart}
                        onEventClick={(event) => {
                            setSelectedEvent(event);
                            setIsModalOpen(true);
                        }}
                    />
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

// Helper component to render calendar weeks with continuous event bars
function CalendarWeekRows({ calendarDays, events, monthStart, onEventClick }: {
    calendarDays: Date[];
    events: CalendarEvent[];
    monthStart: Date;
    onEventClick: (event: CalendarEvent) => void;
}) {
    // Split calendar days into weeks
    const weeks: Date[][] = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
        weeks.push(calendarDays.slice(i, i + 7));
    }

    return (
        <div className="flex flex-col bg-slate-50/50">
            {weeks.map((week, weekIdx) => (
                <CalendarWeekRow
                    key={weekIdx}
                    week={week}
                    events={events}
                    monthStart={monthStart}
                    onEventClick={onEventClick}
                />
            ))}
        </div>
    );
}

// Component to render a single week row with event bars
function CalendarWeekRow({ week, events, monthStart, onEventClick }: {
    week: Date[];
    events: CalendarEvent[];
    monthStart: Date;
    onEventClick: (event: CalendarEvent) => void;
}) {
    // Find events that appear in this week
    const weekStart = startOfDay(week[0]);
    const weekEnd = endOfDay(week[6]);

    const weekEvents = events.filter(event => {
        const eventStart = startOfDay(event.startDate);
        const eventEnd = endOfDay(event.endDate);

        // Event overlaps with this week if:
        // - Event starts during this week, OR
        // - Event ends during this week, OR
        // - Event spans across this week
        return (
            isWithinInterval(eventStart, { start: weekStart, end: weekEnd }) ||
            isWithinInterval(eventEnd, { start: weekStart, end: weekEnd }) ||
            (eventStart < weekStart && eventEnd > weekEnd)
        );
    });

    // Calculate positioning for each event
    interface EventBar {
        event: CalendarEvent;
        startCol: number; // 1-7
        span: number; // number of days
        row: number; // stacking row (0, 1, 2, etc.)
    }

    const eventBars: EventBar[] = [];

    weekEvents.forEach(event => {
        const eventStart = startOfDay(event.startDate);
        const eventEnd = endOfDay(event.endDate);

        // Calculate which column this event starts in (1-7)
        let startCol = 1;
        for (let i = 0; i < week.length; i++) {
            if (isSameDay(week[i], eventStart) || (eventStart < week[i] && i === 0)) {
                startCol = i + 1;
                break;
            }
        }

        // Calculate span (how many columns)
        let span = 1;
        const clampedStart = eventStart < weekStart ? weekStart : eventStart;
        const clampedEnd = eventEnd > weekEnd ? weekEnd : eventEnd;

        for (let i = 0; i < week.length; i++) {
            const day = startOfDay(week[i]);
            if (isWithinInterval(day, { start: clampedStart, end: clampedEnd })) {
                if (i + 1 < startCol) startCol = i + 1;
                span = Math.max(span, i - startCol + 2);
            }
        }

        // Ensure span doesn't exceed week boundary
        span = Math.min(span, 8 - startCol);

        // Find available row for stacking
        let row = 0;
        let hasOverlap = true;
        while (hasOverlap) {
            hasOverlap = eventBars.some(bar => {
                if (bar.row !== row) return false;
                // Check if columns overlap
                const barEnd = bar.startCol + bar.span - 1;
                const thisEnd = startCol + span - 1;
                return !(thisEnd < bar.startCol || startCol > barEnd);
            });
            if (hasOverlap) row++;
        }

        eventBars.push({ event, startCol, span, row });
    });

    const maxRows = Math.max(0, ...eventBars.map(b => b.row)) + 1;
    const minHeight = 140 + (maxRows * 32); // Base height + event rows

    return (
        <div className="relative" style={{ minHeight: `${minHeight}px` }}>
            {/* Grid for day cells */}
            <div className="grid grid-cols-7 min-w-[600px] md:min-w-0">
                {week.map((day) => {
                    const isCurrentMonth = isSameMonth(day, monthStart);
                    const isTodayDate = isToday(day);

                    return (
                        <div
                            key={day.toString()}
                            className={`
                                min-h-[140px] border-b border-r border-slate-100 p-1 md:p-1.5
                                ${!isCurrentMonth ? 'bg-slate-50/50 text-slate-300' : 'bg-white/40'}
                                ${isTodayDate ? 'bg-blue-50/40 ring-inset ring-2 ring-blue-100' : ''}
                            `}
                        >
                            <span
                                className={`
                                    text-[10px] md:text-xs font-semibold w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-lg
                                    ${isTodayDate
                                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                                        : isCurrentMonth ? 'text-slate-600' : 'text-slate-300'}
                                `}
                            >
                                {format(day, 'd')}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Event bars overlaid on grid */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="grid grid-cols-7 h-full min-w-[600px] md:min-w-0">
                    {eventBars.map((bar, idx) => (
                        <div
                            key={idx}
                            className="pointer-events-auto"
                            style={{
                                gridColumn: `${bar.startCol} / span ${bar.span}`,
                                gridRow: 1,
                                marginTop: `${32 + bar.row * 32}px`,
                                height: '28px',
                                zIndex: 10 + bar.row
                            }}
                        >
                            <EventBar event={bar.event} onClick={() => onEventClick(bar.event)} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Component for a single event bar
function EventBar({ event, onClick }: { event: CalendarEvent; onClick: () => void }) {
    const getStatusColor = (status: string) => {
        const s = status?.trim();
        switch (s) {
            case 'Finalizada':
                return 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600';
            case 'Em Andamento':
                return 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600';
            case 'Cancelada':
                return 'bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600';
            case 'Não Iniciada':
                return 'bg-gradient-to-r from-slate-400 to-gray-400 hover:from-slate-500 hover:to-gray-500';
            default:
                return 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600';
        }
    };

    return (
        <div
            onClick={onClick}
            className={`
                h-full mx-0.5 md:mx-1 px-2 rounded-md cursor-pointer
                flex items-center text-white font-semibold text-[10px] md:text-xs
                shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02]
                ${getStatusColor(event.status)}
            `}
            title={`${event.sector} - ${event.activity || 'Sem descrição'}`}
        >
            <span className="truncate">{event.sector}</span>
        </div>
    );
}
