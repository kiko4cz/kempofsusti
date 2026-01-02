'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, ArrowRight } from 'lucide-react';

export default function Contact() {
    return (
        <section id="contact" className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-black mb-6 text-secondary uppercase tracking-tight">
                        <span className="text-primary">Napište</span> nám
                    </h2>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto font-light">
                        Máte dotaz? Chcete přihlásit dítě? Jsme tu pro vás.
                    </p>
                </div>

                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        {/* Contact Cards */}
                        <div className="space-y-6">
                            <a href="mailto:kempofsusti@seznam.cz" className="flex items-center gap-6 p-6 rounded-3xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100 group">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                    <Mail size={32} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-1">E-mail</p>
                                    <p className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors">kempofsusti@seznam.cz</p>
                                </div>
                                <ArrowRight className="ml-auto text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </a>

                            <a href="tel:+420123456789" className="flex items-center gap-6 p-6 rounded-3xl bg-gray-50 border border-transparent hover:bg-white hover:shadow-xl transition-all duration-300 hover:border-gray-100 group cursor-pointer">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                    <Phone size={32} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-1">Telefon</p>
                                    <p className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors">+420 123 456 789</p>
                                </div>
                                <ArrowRight className="ml-auto text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </a>

                            <a href="https://www.google.com/maps/search/?api=1&query=Areál+TJ+Vaňov,+Brzákova+146/1,+Ústí+nad+Labem" target="_blank" rel="noopener noreferrer" className="flex items-center gap-6 p-6 rounded-3xl bg-gray-50 border border-transparent hover:bg-white hover:shadow-xl transition-all duration-300 hover:border-gray-100 group cursor-pointer">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                    <MapPin size={32} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-1">Místo konání</p>
                                    <p className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">Areál TJ Vaňov, Brzákova 146/1, Ústí nad Labem</p>
                                </div>
                                <ArrowRight className="ml-auto text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </a>
                        </div>

                        {/* Map */}
                        <div className="h-[500px] w-full bg-gray-100 rounded-[2.5rem] overflow-hidden relative shadow-2xl border-4 border-white">
                            <iframe
                                src="https://maps.google.com/maps?q=Brzákova+146/1,+Ústí+nad+Labem&t=&z=15&ie=UTF8&iwloc=&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                className="grayscale hover:grayscale-0 transition-all duration-700"
                            />
                            {/* Overlay Badge */}
                            <div className="absolute bottom-6 left-6 bg-white p-4 rounded-2xl shadow-lg flex items-center gap-3">
                                <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-sm font-bold text-gray-900">Areál otevřen</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
