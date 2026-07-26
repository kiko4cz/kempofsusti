'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';


export default function CampDetails() {
    const rawContent = useQuery(api.content.getContent);
    const [content, setContent] = useState({
        section_title: 'Termíny',
        section_year: '2026',
        description: 'Vyberte si ten správný týden. Kapacita je omezená, tak neváhejte!',
        json_timeline: '[]'
    });

    useEffect(() => {
        if (rawContent) {
            const newContent: any = { ...content };
            const section = rawContent.find(s => s.sectionId === 'camps');
            if (section) {
                section.fields.forEach(field => {
                    newContent[field.key] = field.value;
                });
            }
            const historySection = rawContent.find(s => s.sectionId === 'history');
            if (historySection) {
                const timelineField = historySection.fields.find(f => f.key === 'json_timeline');
                if (timelineField) {
                    newContent.json_timeline = timelineField.value;
                }
            }
            setContent(newContent);
        }
    }, [rawContent]);

    const activeTerms = useMemo(() => {
        try {
            const timeline = JSON.parse(content.json_timeline);
            let active: any[] = [];
            const today = new Date();
            today.setHours(0,0,0,0);

            for (const yearItem of timeline) {
                if (yearItem.terms && Array.isArray(yearItem.terms)) {
                    for (const term of yearItem.terms) {
                        {
                            let formattedDates = term.dates || '';
                            let isOngoing = false;
                            let isPassed = false;
                            
                            if (term.dateFrom && term.dateTo) {
                                const from = new Date(term.dateFrom);
                                const to = new Date(term.dateTo);
                                
                                isPassed = today > to;
                                isOngoing = today >= from && today <= to;
                                
                                formattedDates = `${from.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric' })} – ${to.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric' })}`;
                            }

                            if (term.dateFrom && term.dateTo && !isPassed) {
                                active.push({
                                    _id: term.id,
                                    name: term.name || `Turnus #${active.length + 1}`,
                                    year: yearItem.year,
                                    dates: formattedDates,
                                    location: term.locationName || '',
                                    mapLink: term.mapLink || '',
                                    price: term.price || '',
                                    features: term.features ? term.features.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
                                    status: term.status || 'Ještě otevřeno',
                                    isOngoing: isOngoing,
                                });
                            }
                        }
                    }
                }
            }
            return active;
        } catch (e) {
            return [];
        }
    }, [content.json_timeline]);

    const terms = activeTerms;
    const currentYear = activeTerms.length > 0 ? activeTerms[0].year : content.section_year;

    // Camp details section
    return (
        <section id="camps" className="py-24 bg-secondary text-white relative overflow-hidden">
            {/* Background elements - static for better performance */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] right-0 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[80px]"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[80px]"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tight"
                    >
                        {content.section_title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">{currentYear}</span>
                    </motion.h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light">
                        {content.description}
                    </p>
                </div>

                {terms.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {terms.map((term, index) => {
                        const isLastPlaces = term.status === 'Poslední místa' || term.status === 'Obsazeno';
                        const isPulsingStatus = term.status === 'Poslední místa';
                        
                        // New dynamic styling for Ongoing
                        const cardClasses = term.isOngoing
                            ? "bg-primary/10 backdrop-blur-md border border-primary/60 rounded-3xl p-8 hover:bg-primary/20 transition-all duration-300 group relative overflow-hidden flex flex-col shadow-[0_0_40px_rgba(255,100,0,0.3)] will-change-transform scale-[1.02]"
                            : "bg-slate-800/40 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:border-primary/50 hover:bg-slate-800/60 hover:shadow-[0_0_25px_rgba(255,255,255,0.05)] transition-all duration-300 group relative overflow-hidden flex flex-col will-change-transform";

                        return (
                            <motion.div
                                key={term._id || `fallback-${index}`}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2, duration: 0.5 }}
                                className={cardClasses}
                            >
                                {term.isOngoing && (
                                    <div className="absolute inset-0 border-2 border-primary/50 rounded-3xl animate-pulse pointer-events-none z-10"></div>
                                )}
                                
                                <div
                                    className={`absolute top-0 right-0 text-white text-xs font-bold px-4 py-2 rounded-bl-2xl uppercase tracking-wider shadow-lg ${
                                        term.isOngoing
                                            ? 'bg-primary animate-pulse shadow-[0_0_15px_rgba(255,100,0,0.6)] z-20'
                                            : isPulsingStatus
                                                ? 'bg-red-600 animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.5)] z-20'
                                                : term.status === 'Obsazeno' 
                                                    ? 'bg-gray-600' 
                                                    : 'bg-gradient-to-bl from-primary to-orange-600'
                                        }`}
                                >
                                    {term.isOngoing ? 'Právě probíhá' : term.status}
                                </div>

                                <div className="flex items-start gap-5 mb-8">
                                    <div className="bg-primary/20 p-4 rounded-2xl text-primary group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                        <Calendar size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-2 leading-tight">{term.name || `Turnus #${term._id?.toString().slice(-1) || index + 1}`}</h3>
                                        <p className="text-gray-300 flex items-center gap-2">
                                            <span className="font-mono text-xl text-primary font-bold tracking-tight">{term.dates}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8 flex-grow">
                                    <div className="flex items-center gap-3 text-gray-300 bg-white/5 p-3 rounded-xl">
                                        <MapPin className="text-primary" size={20} />
                                        {term.mapLink ? (
                                            <a href={term.mapLink} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors hover:underline">
                                                {term.location}
                                            </a>
                                        ) : (
                                            <span>{term.location}</span>
                                        )}
                                    </div>
                                    <div className="space-y-2 pl-2">
                                        {term.features.map((feature: string, i: number) => (
                                            <div key={i} className="flex items-center gap-3 text-sm text-gray-400">
                                                <CheckCircle className="text-primary/70" size={16} />
                                                <span>{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-auto">
                                    <div className="flex items-end justify-between mb-6 border-t border-white/10 pt-4">
                                        <span className="text-gray-400 text-sm">Cena za hráče</span>
                                        <span className="text-3xl font-bold text-white">{term.price}</span>
                                    </div>

                                    {term.isOngoing ? (
                                        <Link
                                            href={`/historie/${term.year}`}
                                            className="w-full flex items-center justify-center gap-2 font-bold py-4 rounded-xl transition-all uppercase tracking-wide group/btn bg-primary text-white hover:bg-orange-500 shadow-[0_0_20px_rgba(255,100,0,0.4)] hover:shadow-[0_0_30px_rgba(255,100,0,0.6)]"
                                        >
                                            Sledovat kemp
                                            <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </Link>
                                    ) : (
                                        <Link
                                            href={`/prihlaska/${term._id}`}
                                            className="w-full flex items-center justify-center gap-2 font-bold py-4 rounded-xl transition-all uppercase tracking-wide group/btn bg-white text-secondary hover:bg-primary hover:text-white"
                                        >
                                            Mám zájem
                                            <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </Link>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                    </div>
                ) : (
                    <div className="max-w-3xl mx-auto text-center bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-12">
                        <Calendar size={48} className="mx-auto text-primary mb-6 opacity-50" />
                        <h3 className="text-2xl md:text-3xl font-black text-white mb-4">Aktuálně nejsou vypsány žádné termíny</h3>
                        <p className="text-gray-400 text-lg">
                            Všechny termíny pro tento rok již proběhly, nebo zatím nebyly vypsány. Sledujte náš web pro další informace!
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
