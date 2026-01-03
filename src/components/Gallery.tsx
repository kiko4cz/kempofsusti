'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, ArrowUpRight, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

// Local images from public/galerie
const images = [
    { src: '/galerie/IMG_0415.jpg', alt: 'Momentka z kempu' },
    { src: '/galerie/IMG_0426.jpg', alt: 'Momentka z kempu' },
    { src: '/galerie/IMG_0436.jpg', alt: 'Momentka z kempu' },
    { src: '/galerie/IMG_0438.jpg', alt: 'Momentka z kempu' },
    { src: '/galerie/IMG_5612.jpg', alt: 'Momentka z kempu' },
    { src: '/galerie/f0928466-ca1b-4100-8310-93c50c93b1de.jpg', alt: 'Momentka z kempu' },
    { src: '/galerie/771f082a-d782-47f9-8fdf-bef6287be644.jpg', alt: 'Momentka z kempu' },
    { src: '/galerie/IMG_0046.jpg', alt: 'Momentka z kempu' },
    { src: '/galerie/IMG_0057.jpg', alt: 'Momentka z kempu' },
    { src: '/galerie/IMG_0252.jpg', alt: 'Momentka z kempu' },
    { src: '/galerie/IMG_0279.jpg', alt: 'Momentka z kempu' },
    { src: '/galerie/IMG_0297.jpg', alt: 'Momentka z kempu' },
];

export default function Gallery() {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const handleNext = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        setSelectedIndex((prev) => (prev === null ? null : (prev + 1) % images.length));
    }, []);

    const handlePrev = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        setSelectedIndex((prev) => (prev === null ? null : (prev - 1 + images.length) % images.length));
    }, []);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (selectedIndex === null) return;
        if (e.key === 'Escape') setSelectedIndex(null);
        if (e.key === 'ArrowRight') handleNext();
        if (e.key === 'ArrowLeft') handlePrev();
    }, [selectedIndex, handleNext, handlePrev]);

    useEffect(() => {
        if (selectedIndex !== null) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedIndex, handleKeyDown]);

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
                        href="https://kempofsusti.rajce.idnes.cz/"
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
                            layoutId={`image-${index}`}
                            onClick={() => setSelectedIndex(index)}
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
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <div className="bg-white/10 backdrop-blur-md p-3 rounded-full text-white">
                                    <ArrowUpRight size={24} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
                        onClick={() => setSelectedIndex(null)}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setSelectedIndex(null)}
                            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-2 z-50"
                        >
                            <X size={40} />
                        </button>

                        {/* Navigation Buttons */}
                        <button
                            onClick={handlePrev}
                            className="absolute left-4 md:left-8 text-white/50 hover:text-white transition-colors p-4 z-50 hover:bg-white/10 rounded-full"
                        >
                            <ChevronLeft size={40} />
                        </button>

                        <button
                            onClick={handleNext}
                            className="absolute right-4 md:right-8 text-white/50 hover:text-white transition-colors p-4 z-50 hover:bg-white/10 rounded-full"
                        >
                            <ChevronRight size={40} />
                        </button>

                        {/* Main Image */}
                        <motion.div
                            layoutId={`image-${selectedIndex}`}
                            className="relative w-full max-w-5xl aspect-[16/9] md:aspect-[3/2] rounded-lg overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={images[selectedIndex].src}
                                alt={images[selectedIndex].alt}
                                fill
                                className="object-contain"
                                priority
                                quality={100}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
