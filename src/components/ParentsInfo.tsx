'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Clock, Utensils, Shirt, ChevronDown } from 'lucide-react';
import clsx from 'clsx';

const schedule = [
    { time: '08:00 - 08:30', activity: 'Příchod dětí' },
    { time: '08:30 - 10:00', activity: 'Dopolední tréninková jednotka' },
    { time: '10:00 - 10:30', activity: 'Svačina' },
    { time: '10:30 - 12:00', activity: 'Dopolední program / Soutěže' },
    { time: '12:00 - 13:00', activity: 'Oběd a polední klid' },
    { time: '13:00 - 15:00', activity: 'Odpolední trénink / Hra' },
    { time: '15:00 - 15:30', activity: 'Odchod domů' },
];

const faqs = [
    {
        question: 'Co s sebou?',
        answer: 'Sportovní oblečení (dle počasí), kopačky nebo turfy (případně sálovky pro případ nepřízně), láhev na pití (podepsanou), ručník, menší kapesné na výlet.',
        icon: Shirt
    },
    {
        question: 'Jak je zajištěno stravování?',
        answer: 'Pro děti je zajištěn teplý oběd v místní restauraci a dvě svačiny (dopolední a odpolední). Pitný režim je k dispozici po celý den.',
        icon: Utensils
    },
    {
        question: 'Harmonogram dne',
        answer: schedule,
        icon: Clock
    },
];

export default function ParentsInfo() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section id="parents" className="py-24 bg-white relative">
            <div className="absolute left-0 top-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black mb-6 text-secondary uppercase tracking-tight">
                        Pro <span className="text-primary">rodiče</span>
                    </h2>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto font-light">
                        Vše důležité na jednom místě. Odpovědi na nejčastější otázky a harmonogram dne.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={clsx(
                                "bg-white rounded-2xl border transition-all duration-300 overflow-hidden",
                                openIndex === index ? "border-primary shadow-lg ring-1 ring-primary/20" : "border-gray-100 shadow-sm hover:border-gray-300"
                            )}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-6 sm:p-8 text-left transition-colors bg-white select-none"
                            >
                                <div className="flex items-center gap-6">
                                    <div className={clsx(
                                        "p-3 rounded-xl transition-colors duration-300",
                                        openIndex === index ? 'bg-primary text-white shadow-md' : 'bg-gray-50 text-gray-400 group-hover:text-gray-600'
                                    )}>
                                        <faq.icon size={28} />
                                    </div>
                                    <span className={clsx(
                                        "text-xl font-bold transition-colors duration-300",
                                        openIndex === index ? "text-secondary" : "text-gray-700"
                                    )}>{faq.question}</span>
                                </div>
                                <div className={clsx(
                                    "p-2 rounded-full transition-all duration-300",
                                    openIndex === index ? "bg-primary/10 text-primary rotate-180" : "bg-gray-50 text-gray-400"
                                )}>
                                    <ChevronDown size={20} />
                                </div>
                            </button>

                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                    >
                                        <div className="p-8 pt-0 text-gray-600 leading-relaxed border-t border-transparent">
                                            {Array.isArray(faq.answer) ? (
                                                <div className="grid grid-cols-1 gap-0 mt-2 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                                                    {faq.answer.map((item, i) => (
                                                        <div key={i} className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-100 last:border-0 p-4 hover:bg-white transition-colors">
                                                            <span className="font-bold text-primary font-mono">{item.time}</span>
                                                            <span className="sm:text-right font-medium text-gray-800">{item.activity}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="pl-4 border-l-2 border-primary/20 text-lg">{faq.answer as string}</p>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
