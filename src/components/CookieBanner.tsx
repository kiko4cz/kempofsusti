'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';
import Link from 'next/link';

export default function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Zkontrolovat, jestli už uživatel vyjádřil souhlas
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        setIsVisible(false);
    };

    const handleReject = () => {
        localStorage.setItem('cookie-consent', 'rejected');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
                    className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6 pointer-events-none"
                >
                    <div className="max-w-5xl mx-auto bg-[#111827]/95 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl pointer-events-auto flex flex-col md:flex-row items-center gap-6 md:gap-8 relative overflow-hidden">
                        {/* Dekorativní gradienty */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                        <div className="w-16 h-16 shrink-0 bg-primary/20 rounded-2xl flex items-center justify-center relative z-10 border border-primary/20">
                            <Cookie size={32} className="text-primary" />
                        </div>

                        <div className="flex-1 text-center md:text-left relative z-10">
                            <h3 className="text-xl font-bold text-white mb-2">Používáme cookies 🍪</h3>
                            <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
                                Tyto webové stránky používají soubory cookies a podobné technologie k zajištění správného fungování webu, 
                                analýze návštěvnosti a personalizaci obsahu. Můžete přijmout všechny cookies nebo si přizpůsobit nastavení.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto relative z-10">
                            <button
                                onClick={handleReject}
                                className="px-6 py-3 rounded-xl bg-white/5 text-white font-semibold hover:bg-white/10 transition-colors border border-white/10 whitespace-nowrap"
                            >
                                Pouze nezbytné
                            </button>
                            <button
                                onClick={handleAccept}
                                className="px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-orange-500 transition-colors shadow-lg shadow-primary/25 whitespace-nowrap"
                            >
                                Souhlasím se vším
                            </button>
                        </div>
                        
                        <button 
                            onClick={handleReject}
                            className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                            aria-label="Zavřít"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
