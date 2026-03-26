'use client';

import { useState, useEffect } from 'react';
import { Save, Lock, User, Key, Server, Phone, Mail, Loader2, CheckCircle2, ShieldCheck, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { toast } from 'sonner';

export default function AdminSettings() {
    const convexSettings = useQuery(api.settings.getSettings);
    const updateSettings = useMutation(api.settings.updateSettings);
    const changePassword = useMutation(api.user.changePassword);

    const [settings, setSettings] = useState({
        cloudinaryCloudName: '',
        cloudinaryUploadPreset: '',
        contactPhone: '',
        contactEmail: '',
        password: ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    useEffect(() => {
        if (convexSettings) {
            setSettings({
                ...settings,
                cloudinaryCloudName: convexSettings.cloudinaryCloudName || '',
                cloudinaryUploadPreset: convexSettings.cloudinaryUploadPreset || '',
                contactPhone: convexSettings.contactPhone || '',
                contactEmail: convexSettings.contactEmail || '',
            });
        }
    }, [convexSettings]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateSettings({
                cloudinaryCloudName: settings.cloudinaryCloudName,
                cloudinaryUploadPreset: settings.cloudinaryUploadPreset,
                contactPhone: settings.contactPhone,
                contactEmail: settings.contactEmail,
            });
            toast.success('Nastavení uloženo!');
        } catch (error) {
            toast.error('Chyba při ukládání nastavení');
        } finally {
            setIsSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (!settings.password || settings.password.length < 8) {
            toast.error('Heslo musí mít alespoň 8 znaků');
            return;
        }
        setIsChangingPassword(true);
        try {
            await changePassword({ newPassword: settings.password });
            setSettings({ ...settings, password: '' });
            toast.success('Heslo bylo úspěšně změněno!');
        } catch (error) {
            toast.error('Chyba při změně hesla');
        } finally {
            setIsChangingPassword(false);
        }
    };

    return (
        <div className="space-y-12 pb-24 max-w-5xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-3 tracking-tight">System <span className="text-primary">Nastavení</span></h1>
                <p className="text-slate-500 text-lg font-medium tracking-tight">Správa systémových parametrů a zabezpečení vaší administrace.</p>
            </motion.div>

            <div className="grid grid-cols-1 gap-10">
                {/* Cloudinary Config */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="premium-card p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2"></div>
                    
                    <div className="flex items-center gap-6 mb-12 relative z-10">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/10 shadow-sm">
                            <Server size={32} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Cloudinary Integrace</h2>
                            <p className="text-slate-400 text-xs font-black uppercase tracking-widest mt-1">Konfigurace mediálního serveru</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Cloud Name</label>
                            <input
                                type="text"
                                name="cloudinaryCloudName"
                                value={settings.cloudinaryCloudName}
                                onChange={handleChange}
                                className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all shadow-sm placeholder:text-slate-200"
                                placeholder="Zadejte název cloudu..."
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Upload Preset</label>
                            <input
                                type="text"
                                name="cloudinaryUploadPreset"
                                value={settings.cloudinaryUploadPreset}
                                onChange={handleChange}
                                className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all shadow-sm placeholder:text-slate-200"
                                placeholder="Zadejte upload preset..."
                            />
                        </div>
                    </div>
                    
                    <div className="mt-10 p-6 bg-slate-50 border border-slate-100 rounded-3xl flex gap-5 text-slate-500 relative z-10 items-center">
                        <div className="bg-white p-2 rounded-xl border border-slate-200 text-primary shadow-sm">
                            <CheckCircle2 size={24} />
                        </div>
                        <p className="text-xs font-bold leading-relaxed uppercase tracking-wider">
                            Pro nahrávání fotek je potřeba nastavit Cloudinary. Bez něj systém využívá omezené lokální úložiště.
                        </p>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Contact Info */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="premium-card p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] relative overflow-hidden group"
                    >
                        <div className="flex items-center gap-5 mb-10">
                            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 border border-blue-100 transition-transform group-hover:scale-110">
                                <Globe size={28} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-900 tracking-tight">Veřejné údaje</h2>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Kontaktní informace pro web</p>
                            </div>
                        </div>
                        
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 ml-2">
                                    <Phone size={14} className="text-blue-500" /> Telefonní číslo
                                </label>
                                <input
                                    type="text"
                                    name="contactPhone"
                                    value={settings.contactPhone}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 focus:outline-none transition-all shadow-sm"
                                    placeholder="+420 000 000 000"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 ml-2">
                                    <Mail size={14} className="text-blue-500" /> Kontaktní Email
                                </label>
                                <input
                                    type="email"
                                    name="contactEmail"
                                    value={settings.contactEmail}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 focus:outline-none transition-all shadow-sm"
                                    placeholder="info@kempofsusti.cz"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Security */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="premium-card p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] relative overflow-hidden flex flex-col group"
                    >
                        <div className="flex items-center gap-5 mb-10">
                            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 border border-red-100 transition-transform group-hover:scale-110">
                                <ShieldCheck size={28} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-900 tracking-tight">Bezpečnost</h2>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Správa přístupových údajů</p>
                            </div>
                        </div>
                        
                        <div className="space-y-8 flex-1">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 ml-2">
                                    <Key size={14} className="text-red-500" /> Nové heslo administrace
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={settings.password}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:border-red-500 focus:ring-4 focus:ring-red-500/5 focus:outline-none transition-all shadow-sm"
                                    placeholder="Nové silné heslo..."
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleChangePassword}
                            disabled={isChangingPassword || !settings.password}
                            className="w-full mt-10 px-6 py-5 bg-white hover:bg-red-500 text-red-500 hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-red-500 font-black rounded-[2rem] transition-all flex items-center justify-center gap-3 border border-red-100 hover:border-red-500 shadow-sm active:scale-95 uppercase tracking-widest text-xs"
                        >
                            {isChangingPassword ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
                            Změnit heslo
                        </button>
                    </motion.div>
                </div>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row justify-between items-center gap-8 pt-12 border-t border-slate-100"
            >
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                    <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em]">
                        Změny je nutné potvrdit tlačítkem uložit
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full sm:w-auto px-12 py-5 bg-primary hover:bg-orange-500 disabled:opacity-50 text-white font-black rounded-[2.5rem] shadow-2xl shadow-primary/30 flex items-center justify-center gap-4 text-xl transform hover:-translate-y-1 active:scale-95 transition-all uppercase tracking-tighter"
                >
                    {isSaving ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />}
                    Uložit nastavení
                </button>
            </motion.div>
        </div>
    );
}
