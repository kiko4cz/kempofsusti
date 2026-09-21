'use client';

import { useState, useMemo, useEffect, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Calendar, CheckCircle2, Loader2, Send, ChevronLeft, MapPin, CheckCircle, Info, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useConvexAuth } from "convex/react";
import { Id } from '../../../../convex/_generated/dataModel';

export default function RegistrationPage({ params }: { params: Promise<{ campId: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const rawContent = useQuery(api.content.getContent);
    const submitRegistration = useMutation(api.registrations.submitRegistration);
    const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
    
    // Získání dětí pro přihlášeného rodiče
    const myChildren = useQuery(api.children.getMyChildren, isAuthenticated ? undefined : "skip");
    const me = useQuery(api.user.getMe, isAuthenticated ? undefined : "skip");
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    
    const [selectedChildId, setSelectedChildId] = useState<string>("new");

    const [formData, setFormData] = useState({
        parentName: '',
        parentEmail: '',
        parentPhone: '',
        childName: '',
        childBirthDate: '',
        childClub: '',
        tshirtSize: '',
        healthInfo: '',
        notes: '',
        gdprConsent: false,
    });

    // Předvyplnění údajů rodiče, pokud je přihlášen
    useEffect(() => {
        if (me) {
            setFormData(prev => ({
                ...prev,
                parentName: prev.parentName || me.name || '',
                parentEmail: prev.parentEmail || me.email || '',
                parentPhone: prev.parentPhone || me.phone || '',
            }));
        }
    }, [me]);

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

    // Pokud uživatel vybere existující dítě, předvyplníme formulář
    useEffect(() => {
        if (selectedChildId && selectedChildId !== "new" && myChildren) {
            const child = myChildren.find(c => c._id === selectedChildId);
            if (child) {
                setFormData(prev => ({
                    ...prev,
                    childName: child.name,
                    childBirthDate: child.birthDate,
                    childClub: child.club || '',
                    tshirtSize: child.tshirtSize || '',
                    healthInfo: child.healthInfo || '',
                }));
            }
        } else if (selectedChildId === "new") {
            setFormData(prev => ({
                ...prev,
                childName: '',
                childBirthDate: '',
                childClub: '',
                tshirtSize: '',
                healthInfo: '',
            }));
        }
    }, [selectedChildId, myChildren]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!camp) return;

        setIsSubmitting(true);
        try {
            // Použijeme hook, abychom poslali ID dítěte a ID usera. Convex mutation se postará o zbytek.
            const userIdString = localStorage.getItem("convex-auth-token"); // nebo jiný způsob, jak získat id (řeší convex)
            
            const { gdprConsent, ...restFormData } = formData;
            
            await submitRegistration({
                campId: camp.id,
                campName: camp.name || 'Turnus',
                campDates: camp.dates || '',
                childId: selectedChildId !== "new" ? selectedChildId as Id<"children"> : undefined,
                // userId is handled by getAuthUserId on the server
                ...restFormData
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
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    if (rawContent === undefined || authLoading) {
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
                <button onClick={() => router.back()} className="px-6 py-3 bg-primary text-white font-bold rounded-xl">Zpět na předchozí stranu</button>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#0a0f1c] flex flex-col items-center justify-center p-4 text-center relative overflow-hidden font-sans">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[100px] pointer-events-none"></div>
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: "spring", bounce: 0.4 }}
                    className="bg-[#111827]/80 backdrop-blur-2xl border border-white/10 p-10 md:p-12 rounded-[2.5rem] max-w-lg w-full relative z-10 shadow-2xl overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-orange-500 to-red-600"></div>
                    
                    <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner shadow-white/5 border border-white/5 transform -rotate-3">
                        <Lock size={40} className="text-primary drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                    </div>
                    
                    <h1 className="text-3xl font-black text-white mb-4 tracking-tight">Přihlášení nutné</h1>
                    
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-6 mb-8">
                        <p className="text-slate-300 text-sm leading-relaxed font-medium">
                            Pro odeslání přihlášky na kemp je nutné si vytvořit 
                            <strong className="text-white"> účet rodiče</strong>. 
                        </p>
                        <p className="text-slate-400 text-xs mt-3">
                            Díky tomu budete mít na jednom místě dokonalý přehled o stavu všech přihlášek a hodnocení od trenérů po skončení kempu.
                        </p>
                    </div>

                    <Link 
                        href={`/portal/login?redirect=/prihlaska/${resolvedParams.campId}`}
                        className="group relative flex items-center justify-center w-full py-5 bg-primary text-white font-black text-lg rounded-2xl transition-all shadow-[0_0_30px_rgba(239,68,68,0.3)] hover:shadow-[0_0_50px_rgba(239,68,68,0.5)] hover:-translate-y-1 overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            Přihlásit se / Zaregistrovat
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </Link>
                    
                    <div className="mt-6 pt-6 border-t border-white/10">
                        <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-slate-500 hover:text-white text-sm font-bold uppercase tracking-wider transition-colors group">
                            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Zpět na předchozí stranu
                        </button>
                    </div>
                </motion.div>
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
                            Vaše přihláška na kemp <strong className="text-white">{camp.name}</strong> ({camp.dates}) byla úspěšně odeslána. Můžete ji sledovat ve svém klientském portálu.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="relative z-10 flex gap-4"
                        >
                            <Link href="/portal" className="px-8 py-4 bg-primary text-white hover:bg-orange-500 font-black rounded-xl transition-all shadow-lg shadow-primary/30 transform hover:-translate-y-1 inline-block">
                                Přejít do portálu
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
                        {/* Left Column */}
                        <div className="w-full lg:w-5/12 bg-gradient-to-br from-red-950 via-[#0a0f1c] to-[#050810] text-white p-8 md:p-12 lg:p-16 relative overflow-hidden flex flex-col border-r border-white/5">
                            <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5 mix-blend-overlay"></div>
                            
                            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
                            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-600/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3"></div>
                            
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex items-center justify-between mb-12">
                                    <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors w-fit group">
                                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                                        <span className="font-bold text-sm uppercase tracking-wider">Zpět</span>
                                    </button>
                                    
                                    <div className="relative w-12 h-12 bg-white rounded-full p-1 overflow-hidden shadow-lg shadow-primary/20">
                                        <Image src="/main-logo.jpeg" alt="OFS Logo" fill sizes="48px" className="object-cover" />
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
                        <div className="w-full lg:w-7/12 bg-[#050810] p-8 md:p-12 lg:p-16 flex flex-col justify-center relative overflow-y-auto">
                            
                            <form onSubmit={handleSubmit} className="max-w-2xl w-full mx-auto space-y-12 relative z-10">
                                
                                {/* Section 1: Zákonný zástupce */}
                                <div className="space-y-6 bg-white/[0.02] p-6 md:p-8 rounded-3xl border border-white/5">
                                    <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                                        <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-black border border-primary/30">1</div>
                                        <h2 className="text-xl font-black text-white uppercase tracking-wider">Zákonný zástupce</h2>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Jméno a příjmení rodiče</label>
                                            <input required type="text" name="parentName" value={formData.parentName} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl border border-white/10 bg-white/5 focus:bg-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium text-white placeholder-slate-600 shadow-inner" placeholder="Např. Jan Novák" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">E-mail</label>
                                            <input required type="email" name="parentEmail" value={formData.parentEmail} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl border border-white/10 bg-white/5 focus:bg-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium text-white placeholder-slate-600 shadow-inner" placeholder="jan.novak@email.cz" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Telefonní číslo</label>
                                            <input required type="tel" name="parentPhone" pattern="^[+0-9\s\-()]{9,20}$" title="Zadejte platné telefonní číslo (např. +420 123 456 789)" value={formData.parentPhone} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl border border-white/10 bg-white/5 focus:bg-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium text-white placeholder-slate-600 shadow-inner" placeholder="+420 123 456 789" />
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: Dítě */}
                                <div className="space-y-6 bg-white/[0.02] p-6 md:p-8 rounded-3xl border border-white/5">
                                    <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                                        <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-black border border-primary/30">2</div>
                                        <h2 className="text-xl font-black text-white uppercase tracking-wider">Účastník (Dítě)</h2>
                                    </div>
                                    
                                    {/* Výběr dítěte */}
                                    <div className="mb-6">
                                        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Vyberte dítě (nebo vytvořte nové)</label>
                                        <select 
                                            value={selectedChildId} 
                                            onChange={(e) => setSelectedChildId(e.target.value)}
                                            className="w-full px-5 py-4 rounded-2xl border border-white/10 bg-white/5 focus:bg-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium text-white appearance-none cursor-pointer shadow-inner"
                                        >
                                            <option value="new" className="bg-slate-900">+ Nové dítě</option>
                                            {myChildren && myChildren.map(child => (
                                                <option key={child._id} value={child._id} className="bg-slate-900">
                                                    {child.name}
                                                </option>
                                            ))}
                                        </select>
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
                                    <label className="flex items-start gap-4 bg-primary/5 text-slate-300 p-6 rounded-3xl border border-primary/20 mb-8 backdrop-blur-sm cursor-pointer group hover:bg-primary/10 transition-colors">
                                        <div className="shrink-0 mt-1 relative flex items-center justify-center">
                                            <input 
                                                type="checkbox" 
                                                name="gdprConsent"
                                                required 
                                                checked={formData.gdprConsent}
                                                onChange={handleChange}
                                                className="peer appearance-none w-5 h-5 border-2 border-primary/50 rounded bg-white/5 checked:bg-primary checked:border-primary cursor-pointer transition-all"
                                            />
                                            <CheckCircle2 size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-white mb-1 group-hover:text-primary transition-colors">
                                                Souhlas se zpracováním údajů (GDPR) a podmínkami
                                            </p>
                                            <p className="text-xs text-slate-400 leading-relaxed">
                                                Odesláním přihlášky souhlasíte se zpracováním osobních údajů za účelem evidence účastníků kempu. Přihláška bude navázána na váš klientský účet.
                                            </p>
                                        </div>
                                    </label>

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
