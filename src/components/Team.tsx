'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const coaches = [
    {
        name: 'Jan Novák',
        role: 'Hlavní trenér',
        img: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=400&auto=format&fit=crop',
        bio: 'Licence UEFA A, 10 let praxe s mládeží.',
    },
    {
        name: 'Petr Svoboda',
        role: 'Trenér brankářů',
        img: 'https://images.unsplash.com/photo-1542596594-649edbc13630?q=80&w=400&auto=format&fit=crop',
        bio: 'Bývalý ligový brankář, specialista na gólmanské tréninky.',
    },
    {
        name: 'Martin Dvořák',
        role: 'Kondiční trenér',
        img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&auto=format&fit=crop',
        bio: 'Absolvent FTVS, zaměření na koordinaci a rychlost.',
    },
    {
        name: 'Tomáš Kučera',
        role: 'Asistent trenéra',
        img: 'https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?q=80&w=400&auto=format&fit=crop',
        bio: 'Bývalý účastník kempu, nyní pomáhá předávat zkušenosti.',
    },
];

export default function Team() {
    return (
        <section id="team" className="py-24 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black mb-4 text-secondary uppercase tracking-tight">
                        Náš <span className="text-primary">Tým</span>
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto font-light">
                        Zkušení trenéři, kteří se postarají o bezpečnost, rozvoj a především zábavu vašich dětí.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {coaches.map((coach, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-[2rem] p-6 shadow-sm hover:shadow-2xl transition-all duration-300 text-center group border border-gray-100"
                        >
                            <div className="relative w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden border-4 border-gray-50 group-hover:border-primary transition-colors duration-300 shadow-inner">
                                <Image
                                    src={coach.img}
                                    alt={coach.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <h3 className="text-2xl font-bold text-secondary mb-1">{coach.name}</h3>
                            <p className="text-primary font-bold text-sm uppercase tracking-wider mb-4">{coach.role}</p>
                            <div className="w-10 h-1 bg-gray-100 mx-auto mb-4 rounded-full group-hover:bg-primary/20 transition-colors" />
                            <p className="text-gray-500 text-sm leading-relaxed">{coach.bio}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
