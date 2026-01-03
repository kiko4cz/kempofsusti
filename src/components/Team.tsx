'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { User, UserRound } from 'lucide-react';

const coaches = [
    {
        name: 'Milan Seidl',
        role: 'Manažer kempu',
        img: '/galerie/seidl_prukaz.jpg',
        bio: 'Hlavní organizátor a duše celého projektu.',
        isPhoto: true,
        gender: 'male'
    },
    {
        name: 'Miroslav Zeman',
        role: 'Hlavní trenér',
        bio: 'Zkušený trenér s licencí a letitou praxí.',
        isPhoto: false,
        gender: 'male'
    },
    {
        name: 'Barbora Fišerová',
        role: 'Trenérka',
        bio: 'Specialistka na práci s nejmenšími talenty.',
        isPhoto: false,
        gender: 'female'
    },
    {
        name: 'Jaroslav Zápotocký',
        role: 'Trenér',
        bio: 'Dlouholetý aktivní hráč a zapálený trenér.',
        isPhoto: false,
        gender: 'male'
    },
    {
        name: 'Jirka Zápotocký',
        role: 'Trenér',
        bio: 'Motivátor a odborník na technické dovednosti.',
        isPhoto: false,
        gender: 'male'
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
                    {coaches.map((coach, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-[2rem] p-6 shadow-sm hover:shadow-2xl transition-all duration-300 text-center group border border-gray-100 flex flex-col items-center"
                        >
                            <div className="relative w-32 h-32 mb-6 rounded-full overflow-hidden border-4 border-gray-50 group-hover:border-primary transition-colors duration-300 shadow-inner flex items-center justify-center bg-gray-100">
                                {coach.isPhoto && coach.img ? (
                                    <Image
                                        src={coach.img}
                                        alt={coach.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="text-gray-300 group-hover:text-primary transition-colors duration-300">
                                        {coach.gender === 'female' ? <UserRound size={64} /> : <User size={64} />}
                                    </div>
                                )}
                            </div>
                            <h3 className="text-xl font-bold text-secondary mb-1 whitespace-nowrap">{coach.name}</h3>
                            <p className="text-primary font-bold text-xs uppercase tracking-wider mb-4 h-4">{coach.role}</p>
                            <div className="w-10 h-1 bg-gray-100 mb-4 rounded-full group-hover:bg-primary/20 transition-colors" />
                            <p className="text-gray-500 text-xs leading-relaxed">{coach.bio}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
