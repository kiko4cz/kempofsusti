'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, Loader2, ArrowRight, UserPlus, LogIn, ChevronLeft } from 'lucide-react';
import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { toast } from "sonner";
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function PortalLogin() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [gdprConsent, setGdprConsent] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get('redirect') || '/portal';
    
    const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
    const { signIn } = useAuthActions();

    useEffect(() => {
        if (isAuthenticated && !authLoading) {
            router.push(redirectUrl);
        }
    }, [isAuthenticated, authLoading, router, redirectUrl]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!isLogin) {
            if (password !== confirmPassword) {
                toast.error("Chyba registrace", {
                    description: "Zadaná hesla se neshodují.",
                    style: { background: '#ef4444', color: '#fff', border: 'none' }
                });
                return;
            }
            if (!gdprConsent) {
                toast.error("Chyba registrace", {
                    description: "Musíte souhlasit se zpracováním osobních údajů.",
                    style: { background: '#ef4444', color: '#fff', border: 'none' }
                });
                return;
            }
        }
        
        setLoading(true);

        try {
            const payload: any = { 
                email, 
                password, 
                flow: isLogin ? "signIn" : "signUp" 
            };
            if (!isLogin) {
                payload.name = name;
                payload.phone = phone;
            }

            await signIn("password", payload);
            toast.success(isLogin ? "Přihlášení úspěšné" : "Registrace úspěšná", {
                style: { background: '#10b981', color: '#fff', border: 'none' }
            });
            router.push(redirectUrl);
        } catch (err) {
            console.error("Auth failed:", err);
            toast.error(isLogin ? "Přihlášení selhalo" : "Registrace selhala", {
                description: isLogin ? "Zkontrolujte email a heslo." : "Email může být již používán, nebo je heslo příliš slabé.",
                style: { background: '#ef4444', color: '#fff', border: 'none' }
            });
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex font-sans bg-[#0a0f1c]">
            {/* LÁVA STRANA - OBRÁZEK (Viditelné pouze na desktopu) */}
            <div className="hidden lg:flex w-1/2 relative bg-secondary overflow-hidden items-end p-12 lg:p-16">
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-subtle-zoom"
                    style={{ backgroundImage: 'url("/photo_2027.jpg")' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1c] via-[#0a0f1c]/50 to-transparent" />
                <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
                
                <div className="relative z-10 w-full max-w-xl">
                    <div className="mb-8 inline-block bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-2xl transform -rotate-3">
                        <img src="/main-logo.jpeg" alt="Logo" className="w-20 h-20 rounded-xl object-cover" />
                    </div>
                    <h2 className="text-4xl lg:text-6xl font-black text-white leading-[1.1] mb-6 tracking-tight">
                        Fotbalem zábava <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-rose-400">
                            jen začíná.
                        </span>
                    </h2>
                    <p className="text-slate-300 text-lg lg:text-xl font-medium border-l-4 border-primary pl-5 leading-relaxed">
                        Přidejte se k naší kempové rodině. Získejte přístup k osobnímu hodnocení, fotografiím a snadné správě všech vašich přihlášek.
                    </p>
                </div>
            </div>

            {/* PRAVÁ STRANA - FORMULÁŘ */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
                {/* Efekty na pozadí formuláře */}
                <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5 mix-blend-overlay pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", bounce: 0.4 }}
                    className="w-full max-w-[480px] relative z-10 py-6"
                >
                    <div className="mb-6 flex justify-center lg:justify-start">
                        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group text-sm font-bold uppercase tracking-wider bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:bg-white/10">
                            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Zpět na web
                        </Link>
                    </div>

                    <div className="bg-[#050810]/80 backdrop-blur-2xl border border-white/10 p-6 sm:p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-orange-500 to-red-600"></div>
                        
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner shadow-white/5 border border-white/5 transform rotate-3">
                                {isLogin ? (
                                    <LogIn size={28} className="text-primary drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                                ) : (
                                    <UserPlus size={28} className="text-primary drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                                )}
                            </div>
                            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 mb-2 tracking-tight">
                                {isLogin ? 'Vítejte zpět' : 'Vytvořit účet'}
                            </h1>
                            <p className="text-slate-400 font-medium text-sm">
                                {isLogin ? 'Přihlaste se do své klientské zóny' : 'Zaregistrujte se pro správu přihlášek na kempy'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <AnimatePresence mode="wait">
                                {!isLogin && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Jméno rodiče</label>
                                                <div className="relative group">
                                                    <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={16} />
                                                    <input
                                                        type="text"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-9 pr-3 text-white text-sm font-medium placeholder-slate-600 focus:outline-none focus:border-primary focus:bg-white/[0.06] focus:ring-1 focus:ring-primary transition-all shadow-inner"
                                                        placeholder="Jan Novák"
                                                        required={!isLogin}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Telefon</label>
                                                <div className="relative group">
                                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors text-xs font-bold">+420</div>
                                                    <input
                                                        type="tel"
                                                        value={phone}
                                                        onChange={(e) => setPhone(e.target.value)}
                                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-12 pr-3 text-white text-sm font-medium placeholder-slate-600 focus:outline-none focus:border-primary focus:bg-white/[0.06] focus:ring-1 focus:ring-primary transition-all shadow-inner"
                                                        placeholder="123 456 789"
                                                        required={!isLogin}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">E-mail</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white text-sm font-medium placeholder-slate-600 focus:outline-none focus:border-primary focus:bg-white/[0.06] focus:ring-1 focus:ring-primary transition-all shadow-inner"
                                        placeholder="vas@email.cz"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Heslo</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white text-sm font-medium placeholder-slate-600 focus:outline-none focus:border-primary focus:bg-white/[0.06] focus:ring-1 focus:ring-primary transition-all shadow-inner"
                                        placeholder="••••••••"
                                        required
                                        minLength={8}
                                    />
                                </div>
                            </div>

                            <AnimatePresence mode="wait">
                                {!isLogin && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="space-y-1.5 pt-4">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Potvrzení hesla</label>
                                            <div className="relative group">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                                                <input
                                                    type="password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white text-sm font-medium placeholder-slate-600 focus:outline-none focus:border-primary focus:bg-white/[0.06] focus:ring-1 focus:ring-primary transition-all shadow-inner"
                                                    placeholder="••••••••"
                                                    required={!isLogin}
                                                    minLength={8}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-2.5 mt-4 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                                            <div className="flex items-center h-4 mt-0.5">
                                                <input
                                                    id="gdpr"
                                                    type="checkbox"
                                                    checked={gdprConsent}
                                                    onChange={(e) => setGdprConsent(e.target.checked)}
                                                    className="w-4 h-4 bg-white/10 border-white/20 rounded text-primary focus:ring-primary focus:ring-offset-0 focus:ring-2 accent-primary transition-all cursor-pointer"
                                                    required={!isLogin}
                                                />
                                            </div>
                                            <label htmlFor="gdpr" className="text-[11px] text-slate-400 leading-tight cursor-pointer">
                                                Souhlasím se <Link href="/gdpr" target="_blank" className="text-primary hover:underline font-semibold">zpracováním osobních údajů</Link> pro účely registrace na kempy a uchováním profilu uživatele.
                                            </label>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading || (isAuthenticated && !authLoading)}
                                className="group relative w-full bg-primary text-white font-black py-3.5 rounded-xl transition-all shadow-[0_0_25px_rgba(239,68,68,0.3)] hover:shadow-[0_0_40px_rgba(239,68,68,0.5)] overflow-hidden mt-6 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <span className="relative z-10 flex items-center gap-2 text-base">
                                    {loading ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        <>
                                            {isLogin ? 'Přihlásit se' : 'Zaregistrovat se'}
                                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </span>
                            </motion.button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-white/10 text-center">
                            <button 
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-slate-400 hover:text-white text-xs font-medium transition-colors"
                            >
                                {isLogin ? 'Nemáte ještě účet? ' : 'Již máte účet? '}
                                <span className="text-primary font-bold hover:underline">
                                    {isLogin ? 'Vytvořte si ho' : 'Přihlaste se'}
                                </span>
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
