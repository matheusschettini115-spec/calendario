import { CalendarEvent } from '@/lib/googleSheets';

interface EventCardProps {
    event: CalendarEvent;
    onClick: (event: CalendarEvent) => void;
}

export default function EventCard({ event, onClick }: EventCardProps) {
    const getStatusStyles = (status: string) => {
        // Normalize status to lowercase for comparison if needed, but exact match is better if reliable
        const s = status?.trim();

        switch (s) {
            case 'Finalizada':
                return 'bg-green-100 border-green-500 text-green-800 hover:bg-green-200';
            case 'Em Andamento':
                return 'bg-yellow-100 border-yellow-500 text-yellow-800 hover:bg-yellow-200';
            case 'Cancelada':
                return 'bg-red-100 border-red-500 text-red-800 hover:bg-red-200';
            case 'Não Iniciada':
                return 'bg-white border-gray-300 text-gray-800 hover:bg-gray-50';
            default:
                // Default fallback
                return 'bg-gray-100 border-gray-400 text-gray-800 hover:bg-gray-200';
        }
    };

    return (
        <div
            onClick={(e) => {
                e.stopPropagation();
                onClick(event);
            }}
            className={`
        px-2 py-1 mb-1 text-xs font-medium border-l-4 rounded-sm cursor-pointer transition-colors truncate
        ${getStatusStyles(event.status)}
      `}
            title={`${event.sector} - ${event.status}`}
        >
            {event.sector}
        </div>
    );
}
