'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Loader2, ArrowRight, ShieldCheck, ShieldAlert } from 'lucide-react';
import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { toast } from "sonner";
import { motion } from 'framer-motion';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
    const { signIn } = useAuthActions();

    useEffect(() => {
        if (isAuthenticated && !authLoading) {
            toast.success("Přihlášení úspěšné", {
                description: "Vítejte zpět v administraci.",
                style: { background: '#10b981', color: '#fff', border: 'none' }
            });
            router.push('/admin/dashboard');
        }
    }, [isAuthenticated, authLoading, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await signIn("password", { email, password, flow: "signIn" });
        } catch (err) {
            console.error("Login failed:", err);
            toast.error("Přístup odepřen", {
                description: "Nesprávné přihlašovací údaje.",
                icon: <ShieldAlert className="text-white" size={18} />,
                style: { background: '#ef4444', color: '#fff', border: 'none' }
            });
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* High-Contrast Professional Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#0a0a0a]"></div>
            
            {/* Subtle Animated Accents */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.15 }}
                transition={{ duration: 2 }}
                className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary rounded-full blur-[150px] pointer-events-none"
            ></motion.div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[150px] pointer-events-none"></div>

            {/* Grid Pattern Overlay for Texture */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.1] pointer-events-none"></div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-[420px] relative z-10"
            >
                <div className="bg-[#161616] border border-white/10 p-10 rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden">
                    {/* Glossy overlay effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] to-transparent pointer-events-none"></div>
                    
                    {/* Header */}
                    <div className="text-center mb-10 relative">
                        <div className="inline-flex items-center justify-center p-5 bg-white/5 rounded-3xl mb-6 border border-white/10 shadow-inner">
                            <ShieldCheck className="text-primary" size={42} />
                        </div>
                        <h1 className="text-4xl font-black text-white mb-3 tracking-tight uppercase">Administrace</h1>
                        <div className="h-1 w-12 bg-primary mx-auto mb-4 rounded-full"></div>
                        <p className="text-gray-400 font-bold text-sm tracking-wide">OFS Ústí nad Labem</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6 relative">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Emailová adresa</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white font-bold placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200"
                                    placeholder="admin@kempofsusti.cz"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Přístupové heslo</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white font-bold placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200"
                                    placeholder="••••••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02, backgroundColor: '#c52222' }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading || (isAuthenticated && !authLoading)}
                            className="w-full bg-primary text-white font-black py-5 rounded-2xl transition-all duration-200 shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 overflow-hidden relative group"
                        >
                            {(loading || (isAuthenticated && !authLoading)) ? (
                                <>
                                    <Loader2 className="animate-spin" size={22} />
                                    <span className="tracking-widest uppercase text-xs">Ověřování...</span>
                                </>
                            ) : (
                                <>
                                    <span className="tracking-widest uppercase text-xs">Vstoupit do správy</span>
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </motion.button>
                    </form>
                </div>

                {/* Footer info */}
                <div className="mt-10 text-center">
                    <p className="text-gray-600 text-xs font-bold uppercase tracking-[0.2em]">
                        &copy; {new Date().getFullYear()} OFS Ústí nad Labem
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
