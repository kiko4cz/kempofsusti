'use client';

import { useState } from 'react';
import { Upload, Trash2, X, Plus, Heart, Image as ImageIcon, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { toast } from 'sonner';
import Image from 'next/image';

export default function AdminSponsors() {
    const sponsors = useQuery(api.sponsors.getSponsors);
    const addSponsor = useMutation(api.sponsors.addSponsor);
    const updateSponsor = useMutation(api.sponsors.updateSponsor);
    const deleteSponsor = useMutation(api.sponsors.deleteSponsor);
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const getUrlMutation = useMutation(api.files.getUrlMutation);

    const [isAddingUrl, setIsAddingUrl] = useState(false);
    const [isAddingSponsor, setIsAddingSponsor] = useState(false);

    // Form state
    const [newName, setNewName] = useState('');
    const [currentSponsor, setCurrentSponsor] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [newLogoUrl, setNewLogoUrl] = useState('');
    const [newLevel, setNewLevel] = useState<'main' | 'partner'>('partner');

    const resetForm = () => {
        setNewName('');
        setNewLogoUrl('');
        setNewLevel('partner');
        setIsAddingSponsor(false);
        setIsAddingUrl(false);
    };

    const handleAddSponsor = async () => {
        if (!newName || !newLogoUrl) {
            toast.error('Jméno a logo jsou povinné');
            return;
        }

        try {
            await addSponsor({
                name: newName,
                logo: newLogoUrl,
                level: newLevel,
                order: sponsors?.length ? sponsors.length + 1 : 1
            });
            resetForm();
            toast.success('Sponzor úspěšně přidán!');
        } catch (error) {
            toast.error('Chyba při přidávání sponzora');
        }
    };

    const handleDelete = async (id: any) => {
        if (confirm('Opravdu chcete smazat tohoto sponzora?')) {
            setIsDeleting(id);
            try {
                await deleteSponsor({ id });
                toast.success('Sponzor smazán');
            } catch (error) {
                toast.error('Chyba při mazání sponzora');
            } finally {
                setIsDeleting(null);
            }
        }
    };

    const mainSponsors = sponsors?.filter(s => s.level === 'main') || [];
    const partners = sponsors?.filter(s => s.level === 'partner') || [];

    return (
        <div className="space-y-12 pb-24">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-3 tracking-tight">Správa <span className="text-primary">Sponzorů</span></h1>
                    <p className="text-slate-500 text-lg font-medium tracking-tight">Spravujte partnery a sponzory na webu.</p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => setIsAddingSponsor(!isAddingSponsor)}
                        className="bg-primary hover:bg-orange-500 text-white font-black px-8 py-4 rounded-2xl flex items-center gap-3 transition-all shadow-2xl shadow-primary/30 transform hover:-translate-y-1 active:scale-95 uppercase tracking-widest text-xs"
                    >
                        <Heart size={18} />
                        Přidat sponzora
                    </button>
                </div>
            </motion.div>

            <AnimatePresence>
                {isAddingSponsor && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, scale: 0.95 }}
                        animate={{ opacity: 1, height: 'auto', scale: 1 }}
                        exit={{ opacity: 0, height: 0, scale: 0.95 }}
                        className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-8 overflow-hidden"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Přidat nového sponzora</h2>
                            <button
                                onClick={resetForm}
                                className="p-2 text-slate-400 hover:text-slate-900 transition-colors bg-slate-50 rounded-full hover:bg-slate-100"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Jméno sponzora *</label>
                                    <input
                                        type="text"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:border-primary focus:outline-none transition-all placeholder:text-slate-400"
                                        placeholder="Název společnosti / jméno"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Úroveň partnerství *</label>
                                    <div className="flex gap-4">
                                        <label className="flex-1 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="level"
                                                className="sr-only peer"
                                                checked={newLevel === 'main'}
                                                onChange={() => setNewLevel('main')}
                                            />
                                            <div className="w-full p-4 rounded-xl border-2 transition-all text-center font-bold peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary border-slate-200 text-slate-500 hover:border-slate-300">
                                                Hlavní partner
                                            </div>
                                        </label>
                                        <label className="flex-1 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="level"
                                                className="sr-only peer"
                                                checked={newLevel === 'partner'}
                                                onChange={() => setNewLevel('partner')}
                                            />
                                            <div className="w-full p-4 rounded-xl border-2 transition-all text-center font-bold peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary border-slate-200 text-slate-500 hover:border-slate-300">
                                                Běžný partner
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Logo sponzora *</label>

                                    <div className="relative group">
                                        <div className="w-full aspect-[2/1] rounded-[2rem] bg-slate-50 border-2 border-slate-200 overflow-hidden group-hover:border-primary/50 transition-all duration-500 flex items-center justify-center p-8">
                                            {newLogoUrl ? (
                                                <img src={newLogoUrl} alt="Sponsor" className="w-full h-full object-contain" />
                                            ) : (
                                                <ImageIcon size={64} className="text-slate-200 group-hover:text-primary/30 transition-colors" />
                                            )}
                                        </div>

                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-[2rem]">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                id="sponsor-upload"
                                                disabled={isUploading}
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (!file) return;
                                                    setIsUploading(true);
                                                    try {
                                                        const uploadUrl = await generateUploadUrl();
                                                        const result = await fetch(uploadUrl, {
                                                            method: "POST",
                                                            headers: { "Content-Type": file.type },
                                                            body: file,
                                                        });
                                                        if (!result.ok) throw new Error('Chyba při nahrávání');
                                                        const { storageId } = await result.json();
                                                        const url = await getUrlMutation({ storageId });
                                                        if (url) {
                                                            setNewLogoUrl(url);
                                                            toast.success('Logo nahráno!');
                                                        }
                                                    } catch (error) {
                                                        toast.error('Chyba při nahrávání loga');
                                                    } finally {
                                                        setIsUploading(false);
                                                        if (e.target) e.target.value = '';
                                                    }
                                                }}
                                            />
                                            <label
                                                htmlFor="sponsor-upload"
                                                className={`px-6 py-3 bg-white text-slate-900 font-bold rounded-xl shadow-xl flex items-center gap-2 transform active:scale-95 transition-all text-xs uppercase tracking-widest cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                                                {isUploading ? 'Nahrávám...' : (newLogoUrl ? 'Změnit logo' : 'Nahrát logo')}
                                            </label>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 mt-4">
                                        <input
                                            type="text"
                                            value={newLogoUrl}
                                            onChange={(e) => setNewLogoUrl(e.target.value)}
                                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:border-primary focus:outline-none transition-all placeholder:text-slate-400 text-sm"
                                            placeholder="Vložit URL obrázku"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={handleAddSponsor}
                                disabled={!newName || !newLogoUrl}
                                className="px-8 py-4 bg-primary hover:bg-orange-500 text-white rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Uložit sponzora
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {!sponsors ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <Loader2 size={48} className="text-primary animate-spin" />
                    <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Načítám sponzory...</p>
                </div>
            ) : sponsors.length === 0 ? (
                <div className="text-center py-32 bg-white/40 rounded-[3rem] border-2 border-slate-200 border-dashed group hover:border-primary/30 transition-colors duration-500">
                    <div className="w-20 h-20 bg-slate-50 rounded-3xl mx-auto flex items-center justify-center text-slate-300 mb-6 group-hover:text-primary transition-colors">
                        <Heart size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Žádní sponzoři</h3>
                    <p className="text-slate-400 mb-8 font-medium">Přidejte prvního sponzora pro zobrazení na webu.</p>
                </div>
            ) : (
                <div className="space-y-12">
                    {/* Hlavní partneři */}
                    {mainSponsors.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                                <span className="w-2 h-8 bg-primary rounded-full"></span>
                                Hlavní partneři
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                                {mainSponsors.map((sponsor) => (
                                    <div key={sponsor._id} className="bg-white rounded-[2rem] border border-slate-200 p-6 flex flex-col items-center relative group">
                                        <div className="relative w-full aspect-square mb-4 bg-slate-50 rounded-xl overflow-hidden p-4 flex justify-center items-center">
                                            <Image src={sponsor.logo} alt={sponsor.name} fill className="object-contain" />
                                        </div>
                                        <h3 className="font-bold text-center text-slate-900">{sponsor.name}</h3>

                                        <button
                                            onClick={() => handleDelete(sponsor._id)}
                                            disabled={isDeleting === sponsor._id}
                                            className="absolute -top-3 -right-3 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 disabled:opacity-50"
                                            title="Smazat"
                                        >
                                            {isDeleting === sponsor._id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Běžní partneři */}
                    {partners.length > 0 && (
                        <div>
                            <h2 className="text-xl font-bold text-slate-600 mb-6 flex items-center gap-3">
                                <span className="w-2 h-6 bg-slate-300 rounded-full"></span>
                                Běžní partneři
                            </h2>
                            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                                {partners.map((sponsor) => (
                                    <div key={sponsor._id} className="bg-white rounded-[1.5rem] border border-slate-200 p-4 flex flex-col items-center relative group">
                                        <div className="relative w-full aspect-square mb-2 overflow-hidden flex justify-center items-center">
                                            <Image src={sponsor.logo} alt={sponsor.name} fill className="object-contain" />
                                        </div>
                                        <h3 className="font-medium text-xs text-center text-slate-600 truncate w-full">{sponsor.name}</h3>

                                        <button
                                            onClick={() => handleDelete(sponsor._id)}
                                            disabled={isDeleting === sponsor._id}
                                            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 disabled:opacity-50"
                                            title="Smazat"
                                        >
                                            {isDeleting === sponsor._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
