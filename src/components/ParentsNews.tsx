'use client';

import { motion } from 'framer-motion';
import { Calendar, Megaphone, Info, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

type NewsType = 'info' | 'important' | 'alert';

interface NewsItem {
    id: number;
    date: string;
    title: string;
    content: string;
    type: NewsType;
}

const newsData: NewsItem[] = [
    {
        id: 1,
        date: '5. 1. 2026',
        title: 'Spuštění registrace na letní kemp 2026',
        content: 'Registrace na nový ročník letního kempu je nyní otevřena! Zajistěte si své místo včas. Kapacita je omezena.',
        type: 'important'
    },
    {
        id: 2,
        date: '20. 12. 2025',
        title: 'Vánoční prázdniny',
        content: 'Přejeme všem klidné prožití vánočních svátků a šťastný nový rok. Těšíme se na vás v nové sezóně.',
        type: 'info'
    },
    {
        id: 3,
        date: '10. 12. 2025',
        title: 'Změna času odjezdu',
        content: 'Pozor, posouvá se odjezd do Prahy na 8:00. Děkujeme za pochopení.',
        type: 'alert'
    }
];

const NewsCard = ({ item }: { item: NewsItem }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group"
        >
            <div className={clsx(
                "absolute top-0 left-0 w-1 h-full transition-colors duration-300",
                item.type === 'important' ? "bg-primary" :
                    item.type === 'alert' ? "bg-orange-500" :
                        "bg-gray-300"
            )} />

            <div className="flex flex-col sm:flex-row gap-4 sm:items-start">
                <div className="bg-gray-50 rounded-xl p-3 shrink-0 self-start text-gray-400 group-hover:text-primary transition-colors">
                    {item.type === 'important' ? <Megaphone size={24} /> :
                        item.type === 'alert' ? <AlertCircle size={24} /> :
                            <Info size={24} />}
                </div>

                <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="flex items-center gap-1.5 text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                            <Calendar size={14} />
                            {item.date}
                        </span>
                        {item.type === 'important' && (
                            <span className="text-xs font-bold text-white bg-primary px-2.5 py-1 rounded-full uppercase tracking-wide">
                                Důležité
                            </span>
                        )}
                        {item.type === 'alert' && (
                            <span className="text-xs font-bold text-white bg-orange-500 px-2.5 py-1 rounded-full uppercase tracking-wide">
                                Upozornění
                            </span>
                        )}
                    </div>

                    <h3 className="text-xl font-bold text-secondary mb-2 group-hover:text-primary transition-colors">
                        {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                        {item.content}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default function ParentsNews() {
    return (
        <section id="parents-news" className="py-24 bg-accent relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute right-0 top-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

            <div className="w-full max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black mb-4 text-secondary uppercase tracking-tight">
                            Aktuality <span className="text-primary">pro rodiče</span>
                        </h2>
                        <p className="text-gray-500 text-lg max-w-xl font-light">
                            Sledujte nejnovější informace, změny v harmonogramu a důležitá oznámení.
                        </p>
                    </div>
                    {/* Optional: Add a button to view archive or all news if needed in future */}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {newsData.map((item) => (
                        <NewsCard key={item.id} item={item} />
                    ))}
                </div>
            </div>
        </section>
    );
}
