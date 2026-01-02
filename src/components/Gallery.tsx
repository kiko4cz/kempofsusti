'use client';

import { motion } from 'framer-motion';
import { Image as ImageIcon, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

// Placeholder images using Unsplash
const images = [
    { src: 'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?q=80&w=800&auto=format&fit=crop', alt: 'Trénink' },
    { src: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=800&auto=format&fit=crop', alt: 'Zápas' },
    { src: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?q=80&w=800&auto=format&fit=crop', alt: 'Radost' },
    { src: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800&auto=format&fit=crop', alt: 'Trenér a tým' },
    { src: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=800&auto=format&fit=crop', alt: 'Skupina dětí' },
    { src: 'https://images.unsplash.com/photo-1577471488278-16eec37ffcc2?q=80&w=800&auto=format&fit=crop', alt: 'Soutěžení' },
];

export default function Gallery() {
    return (
        <section id="gallery" className="py-24 bg-white relative">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
                    <div className="max-w-xl">
                        <span className="text-secondary font-bold uppercase tracking-widest text-sm mb-2 block">Vzpomínky</span>
                        <h2 className="text-4xl md:text-5xl font-black text-secondary leading-none">
                            GALERIE <span className="text-primary italic">ZÁŽITKŮ</span>
                        </h2>
                        <p className="text-gray-500 mt-4 text-lg font-light">
                            Fotbal nejsou jen góly, ale především emoce. Podívejte se na momentky z minulých ročníků.
                        </p>
                    </div>
                    <a
                        href="https://kempofsusti.estranky.cz/fotoalbum/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 bg-gray-50 hover:bg-black hover:text-white text-secondary font-bold py-3 px-6 rounded-full transition-all duration-300"
                    >
                        <ImageIcon size={20} />
                        <span>Zobrazit archiv fotek</span>
                        <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </a>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[250px]">
                    {images.map((img, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className={`relative rounded-3xl overflow-hidden group cursor-pointer ${index === 0 ? 'md:col-span-2 md:row-span-2' :
                                index === 1 ? 'md:col-span-1 md:row-span-2' : ''
                                }`}
                        >
                            <Image
                                src={img.src}
                                alt={img.alt}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-6">
                                <span className="text-white font-bold text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{img.alt}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
