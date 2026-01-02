'use client';

import { useState } from 'react';
import { Facebook, Instagram, ShieldCheck, Phone, Mail, MapPin, ArrowUp, Check, Copy } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
    const [copied, setCopied] = useState(false);

    const handleCopyEmail = () => {
        navigator.clipboard.writeText('kempofsusti@seznam.cz');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-secondary text-white pt-24 pb-12 overflow-hidden relative">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <div className="text-4xl font-black font-heading tracking-tighter">
                            KEMP<span className="text-primary">OFS</span>
                        </div>
                        <p className="text-gray-400 leading-relaxed font-light">
                            Rodinné zázemí, přátelští trenéři a nezapomenutelné zážitky. Přidej se k týmu vítězů.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://www.facebook.com/kempofsul?locale=cs_CZ" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 hover:bg-[#1877F2] rounded-xl flex items-center justify-center transition-all duration-300 group">
                                <Facebook size={20} className="group-hover:scale-110 transition-transform" />
                            </a>
                            <a href="https://www.instagram.com/kempofsul/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 hover:bg-[#E4405F] rounded-xl flex items-center justify-center transition-all duration-300 group">
                                <Instagram size={20} className="group-hover:scale-110 transition-transform" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <span className="w-8 h-1 bg-primary rounded-full" />
                            Rychlé odkazy
                        </h4>
                        <ul className="space-y-4">
                            {[
                                { name: 'Úvod', href: '/' },
                                { name: 'Termíny 2026', href: '#camps' },
                                { name: 'Pro rodiče', href: '#parents' },
                                { name: 'Galerie', href: '#gallery' },
                                { name: 'Kontakt', href: '#contact' },
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="text-gray-400 hover:text-white hover:translate-x-1 transition-all inline-block">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="lg:col-span-2">
                        <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <span className="w-8 h-1 bg-primary rounded-full" />
                            Kontakt
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <a href="tel:+420123456789" className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors group">
                                <div className="p-3 bg-primary/20 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Zavolejte nám</p>
                                    <p className="font-semibold text-white group-hover:text-primary transition-colors">+420 123 456 789</p>
                                </div>
                            </a>

                            <button onClick={handleCopyEmail} className="w-full flex items-start gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors group text-left">
                                <div className={`p-3 rounded-xl transition-colors ${copied ? 'bg-green-500/20 text-green-500' : 'bg-primary/20 text-primary group-hover:bg-primary group-hover:text-white'}`}>
                                    {copied ? <Check size={20} /> : <Mail size={20} />}
                                </div>
                                <div>
                                    <p className={`text-xs uppercase font-bold tracking-wider mb-1 ${copied ? 'text-green-500' : 'text-gray-400'}`}>
                                        {copied ? 'Zkopírováno' : 'Napište nám (zkopírovat)'}
                                    </p>
                                    <p className="font-semibold text-white group-hover:text-primary transition-colors break-all">kempofsusti@seznam.cz</p>
                                </div>
                            </button>

                            <div className="sm:col-span-2 flex items-start gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors group">
                                <div className="p-3 bg-primary/20 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Kde nás najdete</p>
                                    <p className="font-semibold text-white">Areál TJ Vaňov, Brzákova 146/1, Ústí nad Labem</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm text-center md:text-left">
                        &copy; {new Date().getFullYear()} OFS Ústí nad Labem. Všechna práva vyhrazena.
                    </p>

                    <button
                        onClick={scrollToTop}
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group"
                    >
                        Zpět nahoru
                        <span className="p-2 bg-white/5 rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
                            <ArrowUp size={16} />
                        </span>
                    </button>
                </div>
            </div>
        </footer>
    );
}
