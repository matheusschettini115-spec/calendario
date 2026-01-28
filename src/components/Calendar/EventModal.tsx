import { CalendarEvent } from '@/lib/googleSheets';
import { X } from 'lucide-react';
import { useEffect } from 'react';

interface EventModalProps {
    event: CalendarEvent | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function EventModal({ event, isOpen, onClose }: EventModalProps) {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen || !event) return null;

    const getStatusColor = (status: string) => {
        switch (status?.trim()) {
            case 'Finalizada': return 'bg-green-100 text-green-800';
            case 'Em Andamento': return 'bg-yellow-100 text-yellow-800';
            case 'Cancelada': return 'bg-red-100 text-red-800';
            case 'Não Iniciada': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div
                className="relative w-full max-w-lg overflow-hidden bg-white rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50/50">
                    <h2 className="text-xl font-semibold text-gray-900">Detalhes da Atividade</h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-400 transition-colors rounded-full hover:bg-gray-100 hover:text-gray-600"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Data Final</label>
                            <div className="text-gray-900 font-medium bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                                {event.formattedDate}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                            <div className={`px-3 py-2 rounded-lg font-medium inline-block ${getStatusColor(event.status)}`}>
                                {event.status}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Setor / Área</label>
                        <div className="text-gray-900 font-medium text-lg leading-relaxed">
                            {event.sector}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Responsável</label>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                {event.responsible?.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-gray-900 font-medium">{event.responsible || 'Não informado'}</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Atividade</label>
                        <div className="p-4 rounded-lg bg-gray-50 border border-gray-100 text-gray-700 whitespace-pre-wrap leading-relaxed">
                            {event.activity}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
}
