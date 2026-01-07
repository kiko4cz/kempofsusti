'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Clock, Utensils, Shirt, ChevronDown } from 'lucide-react';
import clsx from 'clsx';

const schedule = [
    { time: '07:30 - 08:30', activity: 'Příchod dětí' },
    { time: '08:45 - 09:00', activity: 'Ranní zábavná rozcvička' },
    { time: '09:00 - 10:00', activity: 'Dopolední tréninková jednotka' },
    { time: '10:00 - 10:30', activity: 'Svačina' },
    { time: '10:30 - 11:45', activity: 'Dopolední hry a soutěže' },
    { time: '11:45 - 13:00', activity: 'Oběd a polední aktivity' },
    { time: '13:00 - 14:00', activity: 'Odpolední tréninková jednotka' },
    { time: '14:00 - 14:30', activity: 'Svačina' },
    { time: '14:30 - 15:45', activity: 'Celokempová soutěž a doplňkové hry' },
    { time: '15:45 - 16:00', activity: 'Vyhodnocení dne' },
    { time: '16:00 - 16:15', activity: 'Odchod domů' },
];

const faqs = [
    {
        question: 'Co s sebou?',
        answer: [
            { time: 'Při příchodu', activity: 'Formulář bezinfekčnosti, ofocenou kartičku pojištěnce' },
            { time: 'Tréninkový proces', activity: 'Sportovní oblečení (šusťáková bunda pro případ deště), kopačky (sálovky pro případ špatného počasí a přesunu do tělocvičny), ručník, pantofle, láhev na pití, vlastní míč' },
            { time: 'Na výlet', activity: 'Na sebe kempový set, dobrovolné kapesné na případné nákupy ve fanshopu (dle programu)' }
        ],
        icon: Shirt
    },
    {
        question: 'Jak je zajištěno stravování?',
        answer: 'Pro děti je zajištěn teplý oběd a dvě svačiny (dopolední a odpolední). Pitný režim je k dispozici po celý den.',
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

            <div className="w-full max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black mb-6 text-secondary uppercase tracking-tight">
                        Informace <span className="text-primary">ke kempu</span>
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
                                // Special styling for "Co s sebou?"
                                faq.question === 'Co s sebou?'
                                    ? (openIndex === index ? "border-red-500 shadow-lg ring-1 ring-red-500/20" : "border-red-200 shadow-sm hover:border-red-300 bg-red-50/30")
                                    : (openIndex === index ? "border-primary shadow-lg ring-1 ring-primary/20" : "border-gray-100 shadow-sm hover:border-gray-300")
                            )}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className={clsx(
                                    "w-full flex items-center justify-between p-6 sm:p-8 text-left transition-colors select-none",
                                    faq.question === 'Co s sebou?' ? "bg-red-50/10" : "bg-white"
                                )}
                            >
                                <div className="flex items-center gap-6">
                                    <div className={clsx(
                                        "p-3 rounded-xl transition-colors duration-300 flex-shrink-0",
                                        faq.question === 'Co s sebou?'
                                            ? (openIndex === index ? 'bg-red-500 text-white shadow-md' : 'bg-red-100 text-red-500')
                                            : (openIndex === index ? 'bg-primary text-white shadow-md' : 'bg-gray-50 text-gray-400 group-hover:text-gray-600')
                                    )}>
                                        <faq.icon size={28} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={clsx(
                                            "text-xl font-bold transition-colors duration-300 mr-2",
                                            faq.question === 'Co s sebou?'
                                                ? (openIndex === index ? "text-red-600" : "text-red-500")
                                                : (openIndex === index ? "text-secondary" : "text-gray-700")
                                        )}>
                                            {faq.question}
                                        </span>
                                        {faq.question === 'Co s sebou?' && (
                                            <span className="text-xs font-bold text-red-400 uppercase tracking-wider mt-1">Důležité informace</span>
                                        )}
                                    </div>
                                </div>
                                <div className={clsx(
                                    "p-2 rounded-full transition-all duration-300 flex-shrink-0",
                                    faq.question === 'Co s sebou?'
                                        ? (openIndex === index ? "bg-red-100 text-red-500 rotate-180" : "bg-red-50 text-red-300")
                                        : (openIndex === index ? "bg-primary/10 text-primary rotate-180" : "bg-gray-50 text-gray-400")
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
                                                        <div key={i} className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 sm:gap-6 border-b border-gray-100 last:border-0 p-4 hover:bg-white transition-colors items-start">
                                                            <span className="font-bold text-primary font-mono text-sm sm:text-base whitespace-nowrap">{item.time}</span>
                                                            <span className="font-medium text-gray-700 text-sm sm:text-base leading-relaxed text-left">{item.activity}</span>
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
