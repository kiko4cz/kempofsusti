'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Heart, Trophy, Bus } from 'lucide-react';

const features = [
    {
        icon: Heart,
        title: 'Dětská spokojenost',
        description: 'Priorita č. 1. Chceme, aby si děti kemp užily a měly na co vzpomínat celý rok.',
    },
    {
        icon: Users,
        title: 'Nová přátelství',
        description: 'Nejen fotbal, ale i budování týmu a poznávání nových kamarádů z okolí.',
    },
    {
        icon: Trophy,
        title: 'Soutěže a hry',
        description: 'Pestrý program plný soutěží, her a překvapení pro každého účastníka.',
    },
    {
        icon: Bus,
        title: 'Celodenní výlet',
        description: 'Výlety za fotbalovými zážitky na velké stadiony či setkání s osobnostmi.',
    },
];

interface ContentSection {
    id: string;
    fields: { key: string; value: string | number }[];
}

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function About() {
    const rawContent = useQuery(api.content.getContent);
    const [content, setContent] = useState({
        section_title: 'O NÁS',
        main_heading: 'VÍCE NEŽ JEN FOTBAL',
        description: 'Tým trenérů, pro které je prioritou dětská spokojenost. Naše kempy Vám neudělají během 5 dní z Vašich ratolestí profesionální fotbalisty, ale zaručí nová přátelství, zážitky a radost ze sportování.'
    });

    useEffect(() => {
        if (rawContent) {
            const section = rawContent.find(s => s.sectionId === 'about');
            if (section) {
                const newContent: any = { ...content };
                section.fields.forEach(field => {
                    newContent[field.key] = field.value;
                });
                setContent(newContent);
            }
        }
    }, [rawContent]);

    // Helper to safely highlight "FOTBAL" in heading if present, otherwise just show full heading
    const splitHeading = () => {
        const parts = content.main_heading.split('FOTBAL');
        if (parts.length === 2) {
            return <>{parts[0]}<span className="text-primary">FOTBAL</span>{parts[1]}</>;
        }
        return content.main_heading;
    };

    return (
        <section id="about" className="py-24 bg-white relative overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gray-50 -skew-x-12 opacity-50 pointer-events-none" />

            <div className="w-full max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto text-center mb-20"
                >
                    <span className="text-primary font-bold uppercase tracking-widest text-sm mb-2 block">{content.section_title}</span>
                    <h2 className="text-4xl md:text-5xl font-black text-secondary mb-8">
                        {content.main_heading.includes('FOTBAL') ? (
                            <>
                                {content.main_heading.substring(0, content.main_heading.indexOf('FOTBAL'))}
                                <span className="text-primary">FOTBAL</span>
                                {content.main_heading.substring(content.main_heading.indexOf('FOTBAL') + 6)}
                            </>
                        ) : (
                            content.main_heading
                        )}
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed md:text-xl font-light">
                        {content.description}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="bg-white p-8 rounded-2xl hover:shadow-2xl transition-all duration-300 border border-gray-100 group hover:-translate-y-2"
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/5 text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                <feature.icon size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                            <p className="text-gray-500 leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
