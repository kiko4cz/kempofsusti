'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { User, UserRound } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

const defaultCoaches = [
    {
        name: 'Milan Seidl',
        role: 'Manažer kempu',
        img: '/treneri/seidl_prukaz.jpg',
        bio: 'Hlavní organizátor a duše celého projektu. GTM Ústí nad Labem, šéftrenér přípravek FK VIAGEM Ústí nad Labem.',
        gender: 'male'
    },
    {
        name: 'Miroslav Zeman',
        role: 'Trenér',
        bio: 'Zkušený kempový trenér a vedoucí, trenér okresních výběrů, šéf klubu TJ Vaňov.',
        img: '/treneri/miroslav_zeman.jpeg',
        gender: 'male'
    },
    {
        name: 'Barbora Fišerová',
        role: 'Trenérka',
        bio: 'Tradiční dívčí tvář našeho kempu, trenérka a učitelka na sportovní škole.',
        img: '/treneri/fiserova_barbora.jpeg',
        gender: 'female'
    },
    {
        name: 'Jiří Zápotocký',
        role: 'Trenér',
        bio: 'Reprezentant ČR ve futsale, ligový futsalista, odchovanec kempu.',
        gender: 'male'
    },
    {
        name: 'Jaroslav Zápotocký',
        role: 'Trenér',
        bio: 'Reprezentant ČR U21 ve futsale, ligový futsalista, odchovanec kempu.',
        gender: 'male'
    },
    {
        name: 'Tobiáš Zvonek',
        role: 'Trenér',
        bio: 'Reprezentant ČR U15, bývalý hráč SG Dynamo Dresden, odchovanec kempu.',
        gender: 'male'
    },
    {
        name: 'Jakub Prousek',
        role: 'Trenér',
        bio: 'Bývalý hráč a student americké univerzity, odchovanec kempu.',
        gender: 'male'
    },
    {
        name: 'Tomáš Nyári',
        role: 'Trenér',
        bio: 'Trenér přípravek v FK VIAGEM Ústí nad Labem, stará se o pitný režim (nejlepší barman na světě).',
        gender: 'male'
    },
    {
        name: 'Jan Novotný',
        role: 'Trenér',
        bio: 'Každý kemp má svého chytráka a statistika, odchovanec kempu, který se také přesunul do řad trenérů.',
        gender: 'male'
    },
    {
        name: 'Christian Ullmann',
        role: 'Trenér',
        bio: 'Odchovanec kempu, který se také přesunul do řad trenérů. Tvůrce WEBu OFSÚstí.',
        gender: 'male'
    },
    {
        name: 'Jakub Seidl',
        role: 'Trenér',
        bio: 'Bývalý profesionální hráč, trenér přípravek v FK VIAGEM Ústí nad Labem.',
        gender: 'male'
    },
    {
        name: 'Samuel Peřina',
        role: 'Trenér',
        bio: 'Další z odchovanců kempu, který se časem přesunul do trenérské role.',
        gender: 'male'
    },
];

export default function Team() {
    const convexCoaches = useQuery(api.team.getTeam);
    const coaches = [...(convexCoaches || defaultCoaches)].sort((a, b) => {
        const orderA = (a as any).order ?? 999;
        const orderB = (b as any).order ?? 999;
        if (orderA !== orderB) return orderA - orderB;
        // Fallback for sorting if order is missing (e.g. initial backfill)
        const nameOrder: Record<string, number> = {
            'Milan Seidl': 1,
            'Miroslav Zeman': 2,
            'Barbora Fišerová': 3,
            'Jiří Zápotocký': 4,
            'Jaroslav Zápotocký': 5,
            'Tomáš Nyári': 6,
            'Jakub Seidl': 7
        };
        const aVal = nameOrder[a.name] || 999;
        const bVal = nameOrder[b.name] || 999;
        return aVal - bVal;
    });

    return (
        <section id="team" className="py-24 bg-gray-50">
            <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
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
                                {coach.img ? (
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
