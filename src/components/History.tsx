'use client';

import { motion } from 'framer-motion';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useState, useEffect, useMemo } from 'react';

export default function History() {
    const rawContent = useQuery(api.content.getContent);
    const [content, setContent] = useState({
        section_title_small: 'Tradice',
        section_title_main: 'HISTORIE KEMPU',
        json_timeline: '[{"year":"2026","loc":"Vaňov, Vaňov"},{"year":"2025","loc":"Přestanov, Vaňov"},{"year":"2024","loc":"Povrly"},{"year":"2023","loc":"Povrly"},{"year":"2022","loc":"Povrly"},{"year":"2021","loc":"Povrly"},{"year":"2020","loc":"Střekov"},{"year":"2019","loc":"Povrly"},{"year":"2018","loc":"Ústí nad Labem"},{"year":"2017","loc":"Svádov, Povrly"},{"year":"2016","loc":"Chlumec"},{"year":"2015","loc":"Povrly"},{"year":"2014","loc":"Chabařovice"},{"year":"2013","loc":"Ústí nad Labem"},{"year":"2012","loc":"Ústí nad Labem"}]'
    });

    useEffect(() => {
        if (rawContent) {
            const section = rawContent.find(s => s.sectionId === 'history');
            if (section) {
                const newContent: any = { ...content };
                section.fields.forEach(field => {
                    newContent[field.key] = field.value;
                });
                setContent(newContent);
            }
        }
    }, [rawContent]);

    const timeline = useMemo(() => {
        try {
            return JSON.parse(content.json_timeline);
        } catch (e) {
            return [];
        }
    }, [content.json_timeline]);

    return (
        <section id="history" className="py-24 bg-white relative">
            <div className="w-full max-w-7xl mx-auto px-4 md:px-6 text-center">
                <div className="mb-12">
                    <span className="text-secondary font-bold uppercase tracking-widest text-sm mb-2 block">{content.section_title_small}</span>
                    <h3 className="text-3xl md:text-4xl font-black text-secondary uppercase">
                        {content.section_title_main}
                    </h3>
                </div>

                <div className="max-w-5xl mx-auto text-left">
                    {/* Mobile Timeline (Hidden on MD+) */}
                    <div className="md:hidden relative border-l-2 border-primary/20 ml-4 space-y-4 pl-6 py-2">
                        {timeline.map((item: any, index: number) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.03 }}
                                className="relative flex items-center gap-4"
                            >
                                <span className={`absolute -left-[31px] top-1.5 w-3 h-3 rounded-full border border-white shadow-sm transition-colors duration-300 ${index === 0 ? 'bg-primary scale-125 ring-2 ring-primary/20' : 'bg-gray-300'}`} />
                                <div className="flex items-baseline gap-3 min-w-0">
                                    <span className={`text-lg font-black font-mono leading-none ${index === 0 ? 'text-primary' : 'text-gray-400'}`}>{item.year}</span>
                                    <span className={`text-sm font-medium truncate ${index === 0 ? 'text-secondary' : 'text-gray-500'}`}>{item.loc}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Desktop Grid (Hidden on Mobile) */}
                    <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-4">
                        {timeline.map((item: any, index: number) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className={`flex items-baseline justify-between py-3 border-b border-gray-100 hover:border-primary/30 transition-colors group
                                    ${index === 0 ? 'border-primary/20' : ''}`}
                            >
                                <span className={`text-xl font-black font-mono ${index === 0 ? 'text-primary scale-110 origin-left' : 'text-gray-300 group-hover:text-primary'} transition-all duration-300`}>
                                    {item.year}
                                </span>
                                <span className={`text-sm font-bold uppercase tracking-wide text-right ${index === 0 ? 'text-secondary' : 'text-gray-500 group-hover:text-gray-800'} transition-colors`}>
                                    {item.loc}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
