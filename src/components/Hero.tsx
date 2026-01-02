'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Hero() {
    return (
        <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
            {/* Background Image with Enhanced Gradient Overlay */}
            <div className="absolute inset-0 z-0">
                {/* Darker overlay for better text contrast */}
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 via-secondary/50 to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent z-10" />

                {/* Main background image */}
                <div
                    className="w-full h-full bg-cover bg-center bg-no-repeat animate-subtle-zoom"
                    style={{
                        backgroundImage: 'url("/main-bg.jpg")',
                    }}
                />
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 z-20 pt-20">
                <div className="max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        {/* Heading */}
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-[0.9] text-white tracking-tight">
                            BUDOUCNOST <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-rose-500">
                                FOTBALU
                            </span>
                            <br />ZAČÍNÁ ZDE
                        </h1>

                        <p className="text-lg md:text-2xl text-gray-200 mb-10 max-w-2xl font-light leading-relaxed border-l-4 border-primary pl-6">
                            Rodinné zázemí, přátelští trenéři a nezapomenutelné zážitky.
                            <strong className="text-white block mt-2">Přidej se k týmu vítězů v areálu TJ Vaňov.</strong>
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="#contact"
                                className="group relative px-8 py-4 bg-primary text-white text-lg font-bold rounded-xl overflow-hidden shadow-lg shadow-primary/30 transition-all hover:scale-105"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                <span className="relative flex items-center gap-2">
                                    KONTAKTOVAT NÁS
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </span>
                            </Link>

                            <Link
                                href="#camps"
                                className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/20 text-white text-lg font-bold rounded-xl hover:bg-white/10 transition-all hover:border-white/40"
                            >
                                ZJISTIT VÍCE
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Floating Info Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="absolute bottom-10 right-4 lg:right-10 hidden md:flex gap-4"
                >
                    <div className="glass-panel p-6 rounded-2xl max-w-xs transform hover:-translate-y-2 transition-transform duration-300">
                        <p className="text-primary font-bold text-4xl mb-1">5+</p>
                        <p className="text-gray-200 text-sm font-medium">Let tradice a zkušeností s výchovou talentů</p>
                    </div>
                    <div className="glass-panel p-6 rounded-2xl max-w-xs transform hover:-translate-y-2 transition-transform duration-300 delay-100">
                        <p className="text-primary font-bold text-4xl mb-1">100%</p>
                        <p className="text-gray-200 text-sm font-medium">Spokojenost rodičů a dětí v minulých letech</p>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
            >
                <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
                    <div className="w-1 h-2 bg-white rounded-full" />
                </div>
            </motion.div>
        </section>
    );
}
