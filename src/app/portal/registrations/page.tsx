'use client';

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { FileText, MapPin, Calendar, Loader2, Clock, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

export default function RegistrationsPage() {
    const registrations = useQuery(api.registrations.getMyRegistrations);
    const rawContent = useQuery(api.content.getContent);

    const availableCamps = useMemo(() => {
        if (!rawContent) return [];
        
        const historySection = rawContent.find(s => s.sectionId === 'history');
        if (!historySection) return [];
        
        const timelineField = historySection.fields.find(f => f.key === 'json_timeline');
        if (!timelineField || typeof timelineField.value !== 'string') return [];

        const camps = [];
        try {
            const timeline = JSON.parse(timelineField.value);
            for (const year of timeline) {
                if (year.terms) {
                    for (const term of year.terms) {
                        if (!term.dateFrom || !term.dateTo) {
                            continue;
                        }

                        const from = new Date(term.dateFrom);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        
                        // Pokud je kemp v minulosti, přeskočíme ho (už není aktivní pro přihlášení)
                        if (from < today) {
                            continue;
                        }

                        const to = new Date(term.dateTo);
                        let formattedDates = `${from.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric' })} – ${to.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric' })}`;
                        
                        camps.push({
                            id: term.id,
                            name: term.name || `Turnus`,
                            dates: formattedDates,
                            location: term.locationName || '',
                            price: term.price || '',
                        });
                    }
                }
            }
        } catch (e) {
            console.error("Failed to parse timeline JSON:", e);
        }
        return camps;
    }, [rawContent]);

    if (registrations === undefined || rawContent === undefined) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-primary w-10 h-10" />
            </div>
        );
    }

    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight transition-colors">Moje přihlášky</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium transition-colors">Historie vašich přihlášek na kempy a jejich aktuální stav.</p>
            </div>

            <div className="space-y-4">
                {registrations.length === 0 ? (
                    <div className="py-12 text-center border-2 border-dashed border-slate-300 dark:border-white/10 rounded-3xl text-slate-400 transition-colors">
                        <FileText size={48} className="mx-auto mb-4 opacity-50" />
                        <p>Nemáte zatím žádné přihlášky na kempy.</p>
                    </div>
                ) : (
                    registrations.map(reg => (
                        <div key={reg._id} className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/5 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden group shadow-sm dark:shadow-none transition-colors">
                            
                            {/* Left side: details */}
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-3 mb-4">
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white transition-colors">{reg.campName}</h3>
                                    {reg.status === 'Nová' && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 dark:text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-500/20">
                                            <Clock size={12} /> Zpracovává se
                                        </span>
                                    )}
                                    {reg.status === 'Schválená' && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-500 dark:text-green-400 text-xs font-bold uppercase tracking-wider border border-green-500/20">
                                            <CheckCircle2 size={12} /> Schválená
                                        </span>
                                    )}
                                    {reg.status === 'Zamítnutá' && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-500 dark:text-red-400 text-xs font-bold uppercase tracking-wider border border-red-500/20">
                                            <XCircle size={12} /> Zamítnutá
                                        </span>
                                    )}
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-500 dark:text-slate-400 transition-colors">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} className="text-slate-400 dark:text-slate-500" />
                                        <span className="font-medium text-slate-700 dark:text-slate-300">{reg.campDates}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-primary" />
                                        <span className="font-bold text-slate-900 dark:text-white">Dítě: {reg.childName}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-500">Založeno:</span>
                                        <span className="text-slate-700 dark:text-slate-300">{new Date(reg.createdAt).toLocaleDateString('cs-CZ')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Možné přihlášky na kemp */}
            <div className="mt-12">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider flex items-center gap-2 transition-colors">
                    <FileText className="text-primary" size={20} /> Dostupné kempy k přihlášení
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {availableCamps.length === 0 ? (
                        <div className="col-span-full py-8 text-center text-slate-500">
                            Aktuálně nejsou vypsány žádné kempy.
                        </div>
                    ) : (
                        availableCamps.map(camp => (
                            <Link 
                                href={`/prihlaska/${camp.id}`} 
                                key={camp.id}
                                className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-primary/50 rounded-2xl p-6 group transition-all"
                            >
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-3 group-hover:text-primary transition-colors">{camp.name}</h3>
                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                        <Calendar size={14} className="text-primary" />
                                        {camp.dates}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                        <MapPin size={14} className="text-primary" />
                                        {camp.location}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-black text-slate-900 dark:text-white">{camp.price}</span>
                                    <span className="font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                                        Přihlásit <ArrowRight size={16} />
                                    </span>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
