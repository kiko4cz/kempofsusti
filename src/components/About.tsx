'use client';

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

export default function About() {
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
                    <span className="text-primary font-bold uppercase tracking-widest text-sm mb-2 block">O nás</span>
                    <h2 className="text-4xl md:text-5xl font-black text-secondary mb-8">
                        VÍCE NEŽ JEN <span className="text-primary">FOTBAL</span>
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed md:text-xl font-light">
                        Tým trenérů, pro které je prioritou <strong>dětská spokojenost</strong>.
                        Naše kempy Vám neudělají během 5 dní z Vašich ratolestí profesionální fotbalisty,
                        ale zaručí <strong>nová přátelství, zážitky a radost ze sportování</strong>.
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

                {/* History Section */}
                {/* History Section */}
                <div className="mt-32 border-t border-gray-100 pt-16 max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="text-secondary font-bold uppercase tracking-widest text-sm mb-2 block">Tradice</span>
                        <h3 className="text-3xl md:text-4xl font-black text-secondary">
                            HISTORIE <span className="text-primary">KEMPU</span>
                        </h3>
                    </div>

                    {/* Mobile Timeline (Hidden on MD+) */}
                    <div className="md:hidden relative border-l-2 border-primary/20 ml-4 space-y-4 pl-6 py-2">
                        {[
                            { year: '2026', loc: 'Vaňov, Vaňov' },
                            { year: '2025', loc: 'Přestanov, Vaňov' },
                            { year: '2024', loc: 'Povrly' },
                            { year: '2023', loc: 'Povrly' },
                            { year: '2022', loc: 'Povrly' },
                            { year: '2021', loc: 'Povrly' },
                            { year: '2020', loc: 'Střekov' },
                            { year: '2019', loc: 'Povrly' },
                            { year: '2018', loc: 'Ústí nad Labem' },
                            { year: '2017', loc: 'Svádov, Povrly' },
                            { year: '2016', loc: 'Chlumec' },
                            { year: '2015', loc: 'Povrly' },
                            { year: '2014', loc: 'Chabařovice' },
                            { year: '2013', loc: 'Ústí nad Labem' },
                            { year: '2012', loc: 'Ústí nad Labem' },
                        ].map((item, index) => (
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
                        {[
                            { year: '2026', loc: 'Vaňov, Vaňov' },
                            { year: '2025', loc: 'Přestanov, Vaňov' },
                            { year: '2024', loc: 'Povrly' },
                            { year: '2023', loc: 'Povrly' },
                            { year: '2022', loc: 'Povrly' },
                            { year: '2021', loc: 'Povrly' },
                            { year: '2020', loc: 'Střekov' },
                            { year: '2019', loc: 'Povrly' },
                            { year: '2018', loc: 'Ústí nad Labem' },
                            { year: '2017', loc: 'Svádov, Povrly' },
                            { year: '2016', loc: 'Chlumec' },
                            { year: '2015', loc: 'Povrly' },
                            { year: '2014', loc: 'Chabařovice' },
                            { year: '2013', loc: 'Ústí nad Labem' },
                            { year: '2012', loc: 'Ústí nad Labem' },
                        ].map((item, index) => (
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
