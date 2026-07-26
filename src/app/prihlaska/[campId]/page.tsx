'use client';

import { useState, useMemo, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Calendar, CheckCircle2, Loader2, Send, ChevronLeft, MapPin, CheckCircle, Info } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function RegistrationPage({ params }: { params: Promise<{ campId: string }> }) {
    const resolvedParams = use(params);
    const rawContent = useQuery(api.content.getContent);
    const submitRegistration = useMutation(api.registrations.submitRegistration);
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    
    const [formData, setFormData] = useState({
        parentName: '',
        parentEmail: '',
        parentPhone: '',
        childName: '',
        childBirthDate: '',
        childClub: '',
        tshirtSize: '',
        healthInfo: '',
        notes: ''
    });

    // Find the camp details based on campId
    const camp = useMemo(() => {
        if (!rawContent) return null;
        
        const historySection = rawContent.find(s => s.sectionId === 'history');
        if (!historySection) return null;
        
        const timelineField = historySection.fields.find(f => f.key === 'json_timeline');
        if (!timelineField || typeof timelineField.value !== 'string') return null;

        try {
            const timeline = JSON.parse(timelineField.value);
            for (const year of timeline) {
                if (year.terms) {
                    for (const term of year.terms) {
                        if (term.id === resolvedParams.campId) {
                            let formattedDates = term.dates || '';
                            if (term.dateFrom && term.dateTo) {
                                const from = new Date(term.dateFrom);
                                const to = new Date(term.dateTo);
                                formattedDates = `${from.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric' })} – ${to.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric' })}`;
                            }
                            return {
                                id: term.id,
                                name: term.name || `Turnus`,
                                dates: formattedDates,
                                location: term.locationName || '',
                                price: term.price || '',
                                features: term.features || ''
                            };
                        }
                    }
                }
            }
        } catch (e) {
            console.error("Failed to parse timeline JSON:", e);
        }
        return null;
    }, [rawContent, resolvedParams.campId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!camp) return;

        setIsSubmitting(true);
        try {
            await submitRegistration({
                campId: camp.id,
                campName: camp.name || 'Turnus',
                campDates: camp.dates || '',
                ...formData
            });
            setIsSuccess(true);
        } catch (error) {
            console.error("Error submitting registration:", error);
            alert('Nastala chyba při odesílání přihlášky. Zkuste to prosím znovu.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (rawContent === undefined) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    if (!camp) {
        return (
            <div className="min-h-screen bg-[#0a0f1c] flex flex-col items-center justify-center p-4 text-center">
                <h1 className="text-3xl font-black text-white mb-4">Kemp nebyl nalezen</h1>
                <p className="text-slate-400 mb-8">Omlouváme se, ale tento kemp se nepodařilo načíst. Možná již neexistuje.</p>
                <Link href="/" className="px-6 py-3 bg-primary text-white font-bold rounded-xl">Zpět na úvod</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0f1c] selection:bg-primary/30 text-slate-300 pb-20 md:pb-0 font-sans">
            <AnimatePresence mode="wait">
                {isSuccess ? (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-[#0a0f1c] relative overflow-hidden"
                    >
                        {/* Background glowing orbs */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/10 rounded-full blur-[120px] pointer-events-none"></div>

                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                            className="w-32 h-32 bg-green-500/20 rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(34,197,94,0.3)] relative z-10 border border-green-500/30"
                        >
                            <CheckCircle2 size={64} className="text-green-400" />
                        </motion.div>
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-4xl md:text-5xl font-black text-white mb-4 relative z-10"
                        >
                            Děkujeme za přihlášku!
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="text-slate-400 text-lg md:text-xl max-w-lg mb-12 relative z-10"
                        >
                            Vaše přihláška na kemp <strong className="text-white">{camp.name}</strong> ({camp.dates}) byla úspěšně odeslána. Brzy se vám ozveme na uvedený e-mail.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="relative z-10"
                        >
                            <Link href="/" className="px-8 py-4 bg-primary text-white hover:bg-orange-500 font-black rounded-xl transition-all shadow-lg shadow-primary/30 transform hover:-translate-y-1 inline-block">
                                Zpět na úvodní stránku
                            </Link>
                        </motion.div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full flex flex-col lg:flex-row min-h-screen relative"
                    >
                        {/* Left Column: Premium Dark Red Gradient with Logo */}
                        <div className="w-full lg:w-5/12 bg-gradient-to-br from-red-950 via-[#0a0f1c] to-[#050810] text-white p-8 md:p-12 lg:p-16 relative overflow-hidden flex flex-col border-r border-white/5">
                            <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5 mix-blend-overlay"></div>
                            
                            {/* Glowing ambient lights */}
                            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
                            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-600/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3"></div>
                            
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex items-center justify-between mb-12">
                                    <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors w-fit group">
                                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                                        <span className="font-bold text-sm uppercase tracking-wider">Zpět na web</span>
                                    </Link>
                                    
                                    {/* Logo OFS */}
                                    <div className="relative w-12 h-12 bg-white rounded-full p-1 overflow-hidden shadow-lg shadow-primary/20">
                                        <Image
                                            src="/main-logo.jpeg"
                                            alt="OFS Logo"
                                            fill
                                            sizes="48px"
                                            className="object-cover"
                                        />
                                    </div>
                                </div>

                                <div className="mb-12">
                                    <div className="inline-block px-4 py-1.5 bg-primary/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-widest text-primary mb-6 border border-primary/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                                        Přihláška na kemp
                                    </div>
                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
                                        {camp.name || 'Letní fotbalový kemp'}
                                    </h1>
                                    
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 text-lg text-white/90 font-medium bg-white/5 p-4 rounded-2xl border border-white/5">
                                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-primary">
                                                <Calendar size={20} />
                                            </div>
                                            {camp.dates}
                                        </div>
                                        <div className="flex items-center gap-4 text-lg text-white/90 font-medium bg-white/5 p-4 rounded-2xl border border-white/5">
                                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-primary">
                                                <MapPin size={20} />
                                            </div>
                                            {camp.location}
                                        </div>
                                    </div>
                                </div>

                                {camp.features && typeof camp.features === 'string' && camp.features.trim().length > 0 && (
                                    <div className="mt-auto space-y-4 bg-white/[0.03] backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl shadow-black/50 relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-orange-500"></div>
                                        
                                        <h3 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Co je v ceně kempu?</h3>
                                        <div className="space-y-4">
                                            {camp.features.split(',').map((f: string) => f.trim()).filter(Boolean).map((feature: string, i: number) => (
                                                <div key={i} className="flex items-center gap-3 text-white/70 font-medium">
                                                    <CheckCircle size={18} className="text-primary shrink-0" />
                                                    <span>{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        <div className="pt-6 mt-6 border-t border-white/10 flex justify-between items-end">
                                            <span className="text-white/50 text-sm font-bold uppercase tracking-wider">Celková cena</span>
                                            <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80">{camp.price}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Premium Dark Registration Form */}
                        <div className="w-full lg:w-7/12 bg-[#050810] p-8 md:p-12 lg:p-16 flex flex-col justify-center relative">
                            
                            <form onSubmit={handleSubmit} className="max-w-2xl w-full mx-auto space-y-12 relative z-10">
                                
                                {/* Section 1: Zákonný zástupce */}
                                <div className="space-y-6 bg-white/[0.02] p-6 md:p-8 rounded-3xl border border-white/5">
                                    <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                                        <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-black border border-primary/30">1</div>
                                        <h2 className="text-xl font-black text-white uppercase tracking-wider">Zákonný zástupce</h2>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Jméno a příjmení</label>
                                            <input required type="text" name="parentName" value={formData.parentName} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl border border-white/10 bg-white/5 focus:bg-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium text-white placeholder-slate-600 shadow-inner" placeholder="Např. Jan Novák" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">E-mail</label>
                                            <input required type="email" name="parentEmail" value={formData.parentEmail} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl border border-white/10 bg-white/5 focus:bg-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium text-white placeholder-slate-600 shadow-inner" placeholder="jan.novak@email.cz" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Telefonní číslo</label>
                                            <input required type="tel" name="parentPhone" value={formData.parentPhone} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl border border-white/10 bg-white/5 focus:bg-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium text-white placeholder-slate-600 shadow-inner" placeholder="+420 123 456 789" />
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: Dítě */}
                                <div className="space-y-6 bg-white/[0.02] p-6 md:p-8 rounded-3xl border border-white/5">
                                    <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                                        <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-black border border-primary/30">2</div>
                                        <h2 className="text-xl font-black text-white uppercase tracking-wider">Účastník (Dítě)</h2>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Jméno a příjmení dítěte</label>
                                            <input required type="text" name="childName" value={formData.childName} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl border border-white/10 bg-white/5 focus:bg-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium text-white placeholder-slate-600 shadow-inner" placeholder="Např. Tomáš Novák" />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Datum narození</label>
                                            <input required type="date" name="childBirthDate" value={formData.childBirthDate} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl border border-white/10 bg-white/5 focus:bg-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium text-white placeholder-slate-600 shadow-inner [color-scheme:dark]" />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Velikost trička</label>
                                            <select required name="tshirtSize" value={formData.tshirtSize} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl border border-white/10 bg-white/5 focus:bg-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium text-white appearance-none cursor-pointer shadow-inner">
                                                <option value="" disabled className="bg-slate-900">Vyberte velikost</option>
                                                <option value="116" className="bg-slate-900">116 (5-6 let)</option>
                                                <option value="128" className="bg-slate-900">128 (7-8 let)</option>
                                                <option value="140" className="bg-slate-900">140 (9-10 let)</option>
                                                <option value="152" className="bg-slate-900">152 (11-12 let)</option>
                                                <option value="164" className="bg-slate-900">164 (13-14 let)</option>
                                                <option value="S" className="bg-slate-900">S (Dospělá)</option>
                                                <option value="M" className="bg-slate-900">M (Dospělá)</option>
                                                <option value="L" className="bg-slate-900">L (Dospělá)</option>
                                            </select>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Aktuální klub <span className="text-slate-500 font-normal normal-case">(volitelné)</span></label>
                                            <input type="text" name="childClub" value={formData.childClub} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl border border-white/10 bg-white/5 focus:bg-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium text-white placeholder-slate-600 shadow-inner" placeholder="Hraje za nějaký klub?" />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Zdravotní omezení / Alergie</label>
                                            <input type="text" name="healthInfo" value={formData.healthInfo} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl border border-white/10 bg-white/5 focus:bg-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium text-white placeholder-slate-600 shadow-inner" placeholder="Bez omezení, případně vypište..." />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Další poznámka <span className="text-slate-500 font-normal normal-case">(volitelné)</span></label>
                                            <textarea name="notes" value={formData.notes} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl border border-white/10 bg-white/5 focus:bg-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium text-white placeholder-slate-600 shadow-inner min-h-[120px] resize-y" placeholder="Cokoliv dalšího nám chcete sdělit..." />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 relative z-10">
                                    <div className="flex items-start gap-4 bg-primary/5 text-slate-300 p-6 rounded-3xl border border-primary/20 mb-8 backdrop-blur-sm">
                                        <Info className="shrink-0 mt-0.5 text-primary" size={20} />
                                        <p className="text-sm font-medium leading-relaxed">
                                            Odesláním přihlášky souhlasíte se zpracováním osobních údajů (GDPR) za účelem evidence účastníků kempu. Další informace vám zašleme e-mailem.
                                        </p>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-5 bg-primary hover:bg-orange-500 text-white text-lg font-black rounded-2xl flex items-center justify-center gap-3 transition-all shadow-[0_0_40px_rgba(255,100,0,0.3)] hover:shadow-[0_0_60px_rgba(255,100,0,0.5)] transform hover:-translate-y-1 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 size={24} className="animate-spin" />
                                                Odesílám...
                                            </>
                                        ) : (
                                            <>
                                                Odeslat závaznou přihlášku
                                                <Send size={20} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
