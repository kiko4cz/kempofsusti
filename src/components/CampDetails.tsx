'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, CheckCircle, ArrowRight } from 'lucide-react';

const terms = [
    {
        id: 1,
        dates: '13. 7. – 17. 7. 2026',
        location: 'Areál TJ Vaňov, Brzákova 146/1',
        price: '3 000 Kč',
        features: ['Celodenní strava', 'Dres s vlastním jménem', 'Pitný režim'],
        status: 'Volno',
    },
    {
        id: 2,
        dates: '20. 7. – 24. 7. 2026',
        location: 'Areál TJ Vaňov, Brzákova 146/1',
        price: '3 000 Kč',
        features: ['Celodenní strava', 'Dres s vlastním jménem', 'Pitný režim'],
        status: 'Volno',
    },
];

export default function CampDetails() {
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
                        Termíny <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">2026</span>
                    </motion.h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light">
                        Vyberte si ten správný týden. Kapacita je omezená, tak neváhejte!
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {terms.map((term, index) => (
                        <motion.div
                            key={term.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2, duration: 0.5 }}
                            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:border-primary/50 hover:bg-white/10 transition-all duration-300 group relative overflow-hidden flex flex-col will-change-transform"
                        >
                            <div className="absolute top-0 right-0 bg-gradient-to-bl from-primary to-red-600 text-white text-xs font-bold px-4 py-2 rounded-bl-2xl uppercase tracking-wider shadow-lg">
                                {term.status}
                            </div>

                            <div className="flex items-start gap-5 mb-8">
                                <div className="bg-primary/20 p-4 rounded-2xl text-primary group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                    <Calendar size={32} />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-bold text-white mb-2">Turnus #{term.id}</h3>
                                    <p className="text-gray-300 flex items-center gap-2">
                                        <span className="font-mono text-xl text-primary font-bold tracking-tight">{term.dates}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8 flex-grow">
                                <div className="flex items-center gap-3 text-gray-300 bg-white/5 p-3 rounded-xl">
                                    <MapPin className="text-primary" size={20} />
                                    <span>{term.location}</span>
                                </div>
                                <div className="space-y-2 pl-2">
                                    {term.features.map((feature, i) => (
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

                                <a
                                    href="mailto:kempofsusti@seznam.cz"
                                    className="w-full flex items-center justify-center gap-2 bg-white text-secondary hover:bg-primary hover:text-white font-bold py-4 rounded-xl transition-all uppercase tracking-wide group/btn"
                                >
                                    Mám zájem
                                    <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
