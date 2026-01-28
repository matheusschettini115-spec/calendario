import { CalendarEvent } from '@/lib/googleSheets';

interface EventCardProps {
    event: CalendarEvent;
    onClick: (event: CalendarEvent) => void;
}

export default function EventCard({ event, onClick }: EventCardProps) {
    const getStatusStyles = (status: string) => {
        const s = status?.trim();

        switch (s) {
            case 'Finalizada':
                return 'bg-gradient-to-br from-emerald-50 to-green-50 border-l-emerald-500 text-emerald-700 hover:from-emerald-100 hover:to-green-100 shadow-emerald-100';
            case 'Em Andamento':
                return 'bg-gradient-to-br from-amber-50 to-yellow-50 border-l-amber-500 text-amber-700 hover:from-amber-100 hover:to-yellow-100 shadow-amber-100';
            case 'Cancelada':
                return 'bg-gradient-to-br from-rose-50 to-red-50 border-l-rose-500 text-rose-700 hover:from-rose-100 hover:to-red-100 shadow-rose-100';
            case 'Não Iniciada':
                return 'bg-gradient-to-br from-slate-50 to-gray-50 border-l-slate-400 text-slate-700 hover:from-slate-100 hover:to-gray-100 shadow-slate-100';
            default:
                return 'bg-gradient-to-br from-gray-50 to-slate-50 border-l-gray-400 text-gray-700 hover:from-gray-100 hover:to-slate-100 shadow-gray-100';
        }
    };

    return (
        <div
            onClick={(e) => {
                e.stopPropagation();
                onClick(event);
            }}
            className={`
        px-1.5 py-0.5 md:px-2 md:py-1 text-[10px] md:text-xs font-semibold border-l-4 rounded-md cursor-pointer 
        transition-all duration-200 truncate shadow-sm hover:shadow-md
        ${getStatusStyles(event.status)}
      `}
            title={`${event.sector} - ${event.status}`}
        >
            {event.sector}
        </div>
    );
}
