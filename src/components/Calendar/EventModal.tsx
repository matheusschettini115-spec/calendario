import { CalendarEvent } from '@/lib/googleSheets';
import { X, Calendar, User, FileText, Tag } from 'lucide-react';
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
            case 'Finalizada': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Em Andamento': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'Cancelada': return 'bg-rose-100 text-rose-700 border-rose-200';
            case 'Não Iniciada': return 'bg-slate-100 text-slate-700 border-slate-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div
                className="relative w-full max-w-2xl overflow-hidden bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with Gradient */}
                <div className="relative px-8 py-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-b border-indigo-100">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-white rounded-xl shadow-sm">
                                <FileText className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">Detalhes da Atividade</h2>
                                <p className="text-sm text-slate-500 mt-0.5">Informações completas do evento</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 transition-all rounded-xl hover:bg-white/80 hover:text-slate-600 active:scale-95"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6 bg-white">
                    {/* Date and Status Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="group">
                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-500 mb-2">
                                <Calendar className="w-4 h-4 text-blue-500" />
                                Data Final
                            </label>
                            <div className="text-slate-900 font-semibold text-lg bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-3 rounded-xl border border-slate-200/50 shadow-sm">
                                {event.formattedDate}
                            </div>
                        </div>
                        <div className="group">
                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-500 mb-2">
                                <Tag className="w-4 h-4 text-purple-500" />
                                Status
                            </label>
                            <div className={`px-4 py-3 rounded-xl font-semibold text-lg border shadow-sm ${getStatusColor(event.status)}`}>
                                {event.status}
                            </div>
                        </div>
                    </div>

                    {/* Sector */}
                    <div className="group">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-500 mb-2">
                            <FileText className="w-4 h-4 text-indigo-500" />
                            Setor / Área
                        </label>
                        <div className="text-slate-900 font-bold text-xl px-4 py-3 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-100 shadow-sm">
                            {event.sector}
                        </div>
                    </div>

                    {/* Responsible */}
                    <div className="group">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-500 mb-2">
                            <User className="w-4 h-4 text-green-500" />
                            Responsável
                        </label>
                        <div className="flex items-center gap-3 bg-gradient-to-br from-green-50 to-emerald-50 px-4 py-3 rounded-xl border border-green-100 shadow-sm">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-green-500/20">
                                {event.responsible?.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-slate-900 font-semibold text-lg">{event.responsible || 'Não informado'}</span>
                        </div>
                    </div>

                    {/* Activity */}
                    <div className="group">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-500 mb-2">
                            <FileText className="w-4 h-4 text-orange-500" />
                            Atividade
                        </label>
                        <div className="p-5 rounded-xl bg-gradient-to-br from-slate-50 to-gray-50 border border-slate-200 text-slate-700 whitespace-pre-wrap leading-relaxed shadow-sm min-h-[100px]">
                            {event.activity || 'Sem descrição'}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 bg-gradient-to-br from-gray-50 to-slate-50 border-t border-slate-200 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:scale-105 active:scale-95"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
}
