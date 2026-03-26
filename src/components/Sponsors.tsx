'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface Sponsor {
    id: number;
    name: string;
    logo: string;
    level: 'main' | 'partner';
}

const defaultSponsors: Sponsor[] = [
    { id: 1, name: 'Panini', logo: '/panini_sponzor.jpeg', level: 'main' },
];

export default function Sponsors() {
    const rawContent = useQuery(api.content.getContent);
    const [content, setContent] = useState({
        section_title: 'SPONZOŘI A PARTNEŘI',
        main_heading: 'PODPORUJÍ NÁS',
    });

    useEffect(() => {
        if (rawContent) {
            const section = rawContent.find(s => s.sectionId === 'sponsors');
            if (section) {
                const newContent: any = { ...content };
                section.fields.forEach(field => {
                    newContent[field.key] = field.value;
                });
                setContent(newContent);
            }
        }
    }, [rawContent]);

    const mainSponsors = defaultSponsors.filter(s => s.level === 'main');
    const partners = defaultSponsors.filter(s => s.level === 'partner');

    return (
        <section id="sponsors" className="py-24 bg-gray-50 relative overflow-hidden">
            <div className="w-full max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto text-center mb-16"
                >
                    <span className="text-primary font-bold uppercase tracking-widest text-sm mb-2 block">{content.section_title}</span>
                    <h2 className="text-4xl md:text-5xl font-black text-secondary mb-4 uppercase">
                        {content.main_heading}
                    </h2>
                    <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
                </motion.div>

                {/* Main Sponsors */}
                <div className="mb-16">
                    <div className="flex flex-wrap justify-center gap-12 items-center">
                        {mainSponsors.map((sponsor, index) => (
                            <motion.div
                                key={sponsor.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className="relative group"
                            >
                                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 group-hover:shadow-xl transition-all duration-300 w-48 h-48 flex items-center justify-center">
                                    <div className="relative w-32 h-32 transition-transform duration-300 group-hover:scale-110">
                                        <Image
                                            src={sponsor.logo}
                                            alt={sponsor.name}
                                            fill
                                            className="object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                                        />
                                    </div>
                                </div>
                                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    HLAVNÍ PARTNER
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Other Partners */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {partners.map((sponsor, index) => (
                        <motion.div
                            key={sponsor.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 + index * 0.05, duration: 0.5 }}
                            className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 flex items-center justify-center h-32 hover:bg-white hover:shadow-md transition-all group"
                        >
                            <div className="relative w-full h-full max-w-[120px]">
                                <Image
                                    src={sponsor.logo}
                                    alt={sponsor.name}
                                    fill
                                    className="object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
