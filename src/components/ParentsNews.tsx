'use client';

import { motion } from 'framer-motion';
import { Calendar, Megaphone, Info, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export default function ParentsNews() {
    const convexNews = useQuery(api.news.getNews);
    const news = convexNews?.filter((n: any) => n.active) || [];

    const hasNews = news.length > 0;

    return (
        <section id="parents-news" className="py-24 bg-white relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-primary font-bold uppercase tracking-widest text-sm mb-2 block">Informace</span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-black text-secondary mb-6 uppercase tracking-tight"
                    >
                        Aktuality <span className="text-primary">pro rodiče</span>
                    </motion.h2>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto font-light">
                        Sledujte nejnovější informace, změny v harmonogramu a důležitá oznámení.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    {hasNews ? (
                        news.map((item, index) => {
                            const type = item.type || 'info';
                            return (
                                <motion.div
                                    key={item._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group"
                                >
                                    <div className={clsx(
                                        "absolute top-0 left-0 w-1 h-full transition-colors duration-300",
                                        type === 'important' ? "bg-primary" :
                                            type === 'alert' ? "bg-orange-500" :
                                                "bg-blue-400" // info default
                                    )} />

                                    <div className="flex flex-col gap-4">
                                        <div className="flex justify-between items-start">
                                            <div className={clsx(
                                                "rounded-xl p-3 text-gray-400 group-hover:text-primary transition-colors",
                                                type === 'important' ? "bg-primary/5 text-primary" :
                                                    type === 'alert' ? "bg-orange-500/5 text-orange-500" :
                                                        "bg-gray-50"
                                            )}>
                                                {type === 'important' ? <Megaphone size={24} /> :
                                                    type === 'alert' ? <AlertCircle size={24} /> :
                                                        <Info size={24} />}
                                            </div>

                                            <div className="flex gap-2">
                                                {type === 'important' && (
                                                    <span className="text-[10px] font-bold text-white bg-primary px-2 py-1 rounded-full uppercase tracking-wide">
                                                        Důležité
                                                    </span>
                                                )}
                                                {type === 'alert' && (
                                                    <span className="text-[10px] font-bold text-white bg-orange-500 px-2 py-1 rounded-full uppercase tracking-wide">
                                                        Upozornění
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
                                            <Calendar size={14} />
                                            {new Date(item.date).toLocaleDateString('cs-CZ')}
                                        </div>

                                        <div>
                                            <h3 className="text-xl font-bold text-secondary mb-3 group-hover:text-primary transition-colors leading-tight">
                                                {item.title}
                                            </h3>
                                            <p className="text-gray-600 leading-relaxed text-sm">
                                                {item.content}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        // Default content if no news
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="col-span-full text-center py-12 bg-gray-50 rounded-2xl border border-gray-100 border-dashed"
                        >
                            <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                            <h3 className="text-xl font-bold text-secondary mb-2">Žádné nové zprávy</h3>
                            <p className="text-gray-500">Momentálně nejsou žádné nové aktuality. Sledujte nás.</p>
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
}
