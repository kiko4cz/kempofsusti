'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Calendar, Info, Image as ImageIcon, Phone, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const navItems = [
    { name: 'Domů', href: '/', icon: Home },
    { name: 'Kempy 2026', href: '#camps', icon: Calendar },
    { name: 'Pro rodiče', href: '#parents', icon: Info },
    { name: 'Galerie', href: '#gallery', icon: ImageIcon },
    { name: 'Kontakt', href: '#contact', icon: Phone },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 20;
            setScrolled(prev => {
                if (prev !== isScrolled) return isScrolled;
                return prev;
            });
        };

        // Passive listener for better performance
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className={clsx(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300 flex justify-center pt-4 px-4",
                    scrolled ? "py-4" : "py-6"
                )}
            >
                <div className={clsx(
                    "relative w-full max-w-7xl mx-auto flex justify-between items-center px-6 py-3 rounded-full transition-all duration-300",
                    scrolled
                        ? "bg-white/80 backdrop-blur-md shadow-lg border border-white/20"
                        : "bg-transparent border-transparent"
                )}>
                    {/* Logo Section */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-10 h-10 md:w-12 md:h-12 bg-white rounded-full p-1 overflow-hidden shadow-sm group-hover:scale-110 transition-transform duration-300">
                            <Image
                                src="/main-logo.jpeg"
                                alt="OFSU Logo"
                                fill
                                sizes="64px"
                                className="object-cover"
                            />
                        </div>
                        <span className={clsx(
                            "font-heading font-extrabold text-xl md:text-2xl tracking-tighter transition-colors",
                            scrolled ? "text-secondary" : "text-white drop-shadow-md"
                        )}>
                            KEMP<span className="text-primary">OFS</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1 bg-white/10 backdrop-blur-sm p-1 rounded-full border border-white/10">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={clsx(
                                    "relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 overflow-hidden group/link",
                                    scrolled
                                        ? "text-gray-700 hover:text-primary hover:bg-white"
                                        : "text-white hover:text-primary hover:bg-white"
                                )}
                            >
                                <span className="relative z-10">{item.name}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className={clsx(
                            "md:hidden p-2 rounded-full transition-colors",
                            scrolled ? "text-secondary bg-gray-100" : "text-white bg-white/20 backdrop-blur-md"
                        )}
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Navigation Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-x-4 top-24 z-40 md:hidden bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                    >
                        <div className="flex flex-col p-4 gap-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="flex items-center gap-4 text-lg font-semibold text-gray-800 p-4 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <item.icon size={20} />
                                    </div>
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
