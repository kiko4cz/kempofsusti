'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Users, Trophy, Map, Calendar, MapPin, History as HistoryIcon, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function HistoryYearPage() {
    const params = useParams();
    const router = useRouter();
    const year = params.year as string;

    const rawContent = useQuery(api.content.getContent);
    const [activeTermIndex, setActiveTermIndex] = useState(0);

    const historyData = useMemo(() => {
        if (!rawContent) return null;
        const section = rawContent.find(s => s.sectionId === 'history');
        if (!section) return null;
        const timelineField = section.fields.find(f => f.key === 'json_timeline');
        if (!timelineField || !timelineField.value) return null;
        try {
            const timeline = JSON.parse(timelineField.value as string);
            return timeline.find((item: any) => item.year === year);
        } catch (e) {
            return null;
        }
    }, [rawContent, year]);

    if (rawContent === undefined) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!historyData) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
                <HistoryIcon size={64} className="text-slate-200 mb-6" />
                <h1 className="text-3xl font-black text-slate-800 mb-2 uppercase">Ročník nenalezen</h1>
                <p className="text-slate-500 mb-8 font-medium">Omlouváme se, ale tento ročník v historii nemáme.</p>
                <button onClick={() => router.push('/#history')} className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-orange-600 transition-colors flex items-center gap-2">
                    <ArrowLeft size={18} /> Zpět na historii
                </button>
            </div>
        );
    }

    // Normalize terms
    let terms = [];
    if (historyData.terms && Array.isArray(historyData.terms) && historyData.terms.length > 0) {
        terms = historyData.terms;
    } else {
        terms = [{
            id: historyData.year + '-1',
            locationName: historyData.loc,
            description: historyData.description,
            campers: historyData.campers,
            tripInfo: historyData.tripInfo,
            kidsCount: historyData.kidsCount,
            materialsNotAvailable: historyData.materialsNotAvailable
        }];
    }

    const activeTerm = terms[activeTermIndex] || {};

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            {/* Header Section */}
            <div className="bg-secondary text-white pt-32 pb-20 px-4 md:px-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('/pattern.svg')] bg-repeat"></div>
                <div className="max-w-5xl mx-auto relative z-10">
                    <button onClick={() => router.push('/#history')} className="inline-flex items-center gap-2 text-white/60 hover:text-white font-bold text-sm mb-8 transition-colors group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Zpět na časovou osu
                    </button>
                    
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 text-primary border border-primary/30 text-xs font-black uppercase tracking-widest mb-6">
                        <Calendar size={14} /> Ročník {historyData.year}
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight mb-4">
                        Letní kemp <span className="text-primary italic">{historyData.year}</span>
                    </h1>
                    
                    <div className="flex items-center gap-3 text-white/80 font-medium text-xl">
                        <MapPin size={22} className="text-primary" /> {activeTerm.locationName || historyData.loc}
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 md:px-6 -mt-8 relative z-20">
                {/* Tabs */}
                {terms.length > 1 && (
                    <div className="bg-white rounded-2xl shadow-xl p-2 flex overflow-x-auto no-scrollbar mb-8">
                        {terms.map((term: any, idx: number) => (
                            <button
                                key={term.id || idx}
                                onClick={() => setActiveTermIndex(idx)}
                                className={`flex-1 min-w-[140px] py-4 px-6 rounded-xl text-sm font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                                    activeTermIndex === idx 
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                }`}
                            >
                                {term.name || term.locationName || `Turnus ${idx + 1}`}
                            </button>
                        ))}
                    </div>
                )}

                {/* Term Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTermIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-8"
                    >
                        {activeTerm.materialsNotAvailable ? (
                            <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-100">
                                <div className="w-24 h-24 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-slate-100">
                                    <HistoryIcon size={40} />
                                </div>
                                <h2 className="text-3xl font-black text-slate-800 mb-4 uppercase tracking-tight">Materiály se nedochovaly</h2>
                                <p className="text-slate-500 text-lg max-w-lg mx-auto font-medium">
                                    Z tohoto turnusu se nám bohužel nedochovaly žádné podrobnější záznamy ani vzpomínky, které bychom zde mohli sdílet.
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Main Description */}
                                {activeTerm.description && (
                                    <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-100 shadow-sm">
                                        <p className="text-xl md:text-2xl text-slate-700 leading-relaxed font-medium m-0">
                                            {activeTerm.description}
                                        </p>
                                    </div>
                                )}

                                {/* Stats & Info Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {activeTerm.kidsCount && (
                                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-6 group hover:border-primary/20 transition-colors">
                                            <div className="p-4 bg-primary/10 rounded-2xl text-primary group-hover:scale-110 transition-transform">
                                                <Users size={32} />
                                            </div>
                                            <div>
                                                <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Počet dětí</div>
                                                <div className="text-4xl font-black text-slate-800 leading-none">{activeTerm.kidsCount}</div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTerm.tripInfo && (
                                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-6 group hover:border-blue-500/20 transition-colors">
                                            <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-500 shrink-0 group-hover:scale-110 transition-transform">
                                                <Map size={32} />
                                            </div>
                                            <div>
                                                <div className="text-xs font-black text-blue-400 uppercase tracking-widest mb-2">Středeční výlet</div>
                                                <div className="text-slate-700 font-medium text-lg leading-snug">{activeTerm.tripInfo}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Campers / Hall of Fame */}
                                {((activeTerm.campersList && activeTerm.campersList.length > 0) || activeTerm.campers) && (
                                    <div className="mt-16">
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="h-px bg-slate-200 flex-1"></div>
                                            <h3 className="text-2xl md:text-3xl font-black text-secondary uppercase tracking-widest text-center flex items-center gap-3">
                                                <Trophy className="text-primary" size={28} />
                                                Síň slávy
                                            </h3>
                                            <div className="h-px bg-slate-200 flex-1"></div>
                                        </div>
                                        
                                        {/* Legacy text campers */}
                                        {(!activeTerm.campersList || activeTerm.campersList.length === 0) && activeTerm.campers && (
                                            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center">
                                                <div className="text-sm font-black text-amber-500 uppercase tracking-widest mb-3">Ocenění kempaři</div>
                                                <div className="text-xl md:text-2xl font-bold text-slate-800 leading-relaxed">{activeTerm.campers}</div>
                                            </div>
                                        )}

                                        {/* New rich campers grid */}
                                        {activeTerm.campersList && activeTerm.campersList.length > 0 && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {activeTerm.campersList.map((camper: any, cIdx: number) => (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 20 }}
                                                        whileInView={{ opacity: 1, y: 0 }}
                                                        viewport={{ once: true }}
                                                        transition={{ delay: cIdx * 0.1 }}
                                                        key={camper.id}
                                                        className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-lg shadow-slate-200/20 group hover:-translate-y-2 transition-transform duration-300"
                                                    >
                                                        <div className="aspect-square bg-slate-100 relative overflow-hidden">
                                                            {camper.imageId ? (
                                                                <img
                                                                    src={camper.imageId.startsWith('http') ? camper.imageId : `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${camper.imageId}`}
                                                                    alt={camper.name}
                                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-50">
                                                                    <ImageIcon size={48} className="mb-4 opacity-50" />
                                                                </div>
                                                            )}
                                                            {/* Overlay gradient */}
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                                                            
                                                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                                                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-3 shadow-lg shadow-primary/30">
                                                                    <Trophy size={10} />
                                                                    {camper.category}
                                                                </div>
                                                                <h4 className="text-2xl font-black text-white leading-tight">
                                                                    {camper.name}
                                                                </h4>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
