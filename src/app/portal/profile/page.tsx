'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from "../../../../convex/_generated/api";
import { User, Phone, Mail, Lock, Loader2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

export default function ProfilePage() {
    const me = useQuery(api.user.getMe);
    const updateProfile = useMutation(api.user.updateProfile);
    
    // For now we don't have changePassword exposed as a normal mutation (it's in user.ts but requires old password check usually, here it doesn't).
    // Let's implement profile update first.
    
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const changePassword = useMutation(api.user.changePassword);
    const [newPassword, setNewPassword] = useState('');
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordSaved, setPasswordSaved] = useState(false);

    useEffect(() => {
        if (me) {
            setName(me.name || '');
            setPhone(me.phone || '');
        }
    }, [me]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setSaved(false);
        try {
            await updateProfile({ name, phone });
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error("Failed to update profile", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsChangingPassword(true);
        setPasswordSaved(false);
        try {
            await changePassword({ newPassword });
            setPasswordSaved(true);
            setNewPassword('');
            setTimeout(() => setPasswordSaved(false), 3000);
        } catch (error) {
            console.error("Failed to change password", error);
            alert("Nepodařilo se změnit heslo. Pokud jste se přihlásili přes Google, heslo nelze změnit tímto způsobem.");
        } finally {
            setIsChangingPassword(false);
        }
    };

    if (me === undefined) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-primary w-10 h-10" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight transition-colors">Můj profil</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium transition-colors">Spravujte své osobní údaje a nastavení účtu.</p>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm dark:shadow-none transition-colors"
            >
                <div className="h-32 bg-gradient-to-r from-primary/80 to-orange-500/80 relative">
                    <div className="absolute -bottom-12 left-8 w-24 h-24 rounded-2xl bg-white dark:bg-[#0a0f1c] flex items-center justify-center border-4 border-white dark:border-[#0a0f1c] shadow-lg transition-colors">
                        <User size={40} className="text-slate-300 dark:text-slate-600" />
                    </div>
                </div>

                <div className="pt-16 p-8">
                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider transition-colors">E-mail</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input 
                                        type="email" 
                                        value={me?.email || ''}
                                        disabled
                                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-100 dark:bg-white/5 border border-transparent text-slate-500 dark:text-slate-400 cursor-not-allowed transition-colors"
                                    />
                                </div>
                                <p className="text-xs text-slate-500">E-mail slouží pro přihlášení a nelze jej změnit.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider transition-colors">Celé jméno</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input 
                                        type="text" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Např. Jan Novák"
                                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-primary transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider transition-colors">Telefonní číslo</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input 
                                        type="tel" 
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="+420 123 456 789"
                                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-primary transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 pt-4 pb-8 border-b border-slate-200 dark:border-white/5 transition-colors">
                            <button 
                                type="submit"
                                disabled={isSaving}
                                className="px-8 py-4 bg-primary hover:bg-orange-500 text-white font-black rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 size={18} className="animate-spin" /> : 'Uložit osobní údaje'}
                            </button>
                            
                            {saved && (
                                <motion.span 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-green-500 flex items-center gap-2 text-sm font-bold"
                                >
                                    <CheckCircle2 size={18} /> Uloženo
                                </motion.span>
                            )}
                        </div>
                    </form>

                    <div className="pt-8">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider transition-colors">Změna hesla</h3>
                        <form onSubmit={handlePasswordChange} className="space-y-6 max-w-md">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider transition-colors">Nové heslo</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input 
                                        type="password" 
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Zadejte nové heslo"
                                        required
                                        minLength={6}
                                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-primary transition-colors"
                                    />
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <button 
                                    type="submit"
                                    disabled={isChangingPassword || !newPassword}
                                    className="px-6 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-white/10 dark:hover:bg-white/20 text-white font-bold rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isChangingPassword ? <Loader2 size={18} className="animate-spin" /> : 'Změnit heslo'}
                                </button>
                                
                                {passwordSaved && (
                                    <motion.span 
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="text-green-500 flex items-center gap-2 text-sm font-bold"
                                    >
                                        <CheckCircle2 size={18} /> Heslo změněno
                                    </motion.span>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </motion.div>

            {/* Nastavení vzhledu */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm dark:shadow-none p-8 transition-colors"
            >
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider transition-colors">Vzhled a stylování webu</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ThemeOption mode="light" label="Světlý režim" description="Čistý a přehledný vzhled." />
                    <ThemeOption mode="dark" label="Tmavý režim" description="Prémiový sportovní Midnight." />
                    <ThemeOption mode="system" label="Podle systému" description="Automaticky dle vašeho zařízení." />
                </div>
            </motion.div>
        </div>
    );
}

function ThemeOption({ mode, label, description }: { mode: string, label: string, description: string }) {
    const { theme, setTheme } = useTheme();
    const isSelected = theme === mode;

    return (
        <button
            onClick={() => setTheme(mode)}
            className={`flex flex-col items-start p-6 rounded-2xl border text-left transition-all ${
                isSelected 
                ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-md shadow-primary/10' 
                : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-100 dark:hover:bg-white/10'
            }`}
        >
            <div className="flex items-center gap-3 mb-2">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-primary' : 'border-slate-300 dark:border-slate-600'}`}>
                    {isSelected && <div className="w-3 h-3 bg-primary rounded-full" />}
                </div>
                <h3 className={`font-bold ${isSelected ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>{label}</h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 pl-9">{description}</p>
        </button>
    );
}
