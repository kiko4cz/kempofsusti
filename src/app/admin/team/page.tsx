'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Save, User, Upload, Loader2, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { toast } from 'sonner';

export default function AdminTeam() {
    const team = useQuery(api.team.getTeam);
    const addMember = useMutation(api.team.addMember);
    const updateMember = useMutation(api.team.updateMember);
    const deleteMember = useMutation(api.team.deleteMember);
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const getUrlMutation = useMutation(api.files.getUrlMutation);

    const [isEditing, setIsEditing] = useState(false);
    const [currentCoach, setCurrentCoach] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleAddNew = () => {
        setCurrentCoach({
            name: '',
            role: 'Trenér',
            bio: '',
            img: '',
            gender: 'male'
        });
        setIsEditing(true);
    };

    const handleEdit = (coach: any) => {
        setCurrentCoach({ ...coach });
        setIsEditing(true);
    };

    const handleDelete = async (id: any) => {
        if (confirm('Opravdu chcete smazat tohoto člena týmu?')) {
            setIsDeleting(id);
            try {
                await deleteMember({ id });
                toast.success('Člen týmu smazán');
            } catch (error) {
                toast.error('Chyba při mazání');
            } finally {
                setIsDeleting(null);
            }
        }
    };

    const handleSave = async () => {
        if (!currentCoach.name || !currentCoach.role) {
            toast.error('Jméno a role jsou povinné');
            return;
        }

        setIsSaving(true);
        try {
            if (currentCoach._id) {
                // Update
                await updateMember({
                    id: currentCoach._id,
                    name: currentCoach.name,
                    role: currentCoach.role,
                    bio: currentCoach.bio,
                    img: currentCoach.img,
                    gender: currentCoach.gender,
                });
                toast.success('Člen týmu aktualizován!');
            } else {
                // Add
                await addMember({
                    name: currentCoach.name,
                    role: currentCoach.role,
                    bio: currentCoach.bio,
                    img: currentCoach.img,
                    gender: currentCoach.gender,
                });
                toast.success('Nový člen týmu přidán!');
            }
            setIsEditing(false);
            setCurrentCoach(null);
        } catch (error) {
            toast.error('Chyba při ukládání');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-12 pb-24">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-3 tracking-tight">Správa <span className="text-primary">Týmu</span></h1>
                    <p className="text-slate-500 text-lg font-medium tracking-tight">Přidejte nebo upravte členy vašeho týmu a jejich role. (Cloudové úložiště)</p>
                </div>
                {!isEditing && (
                    <button
                        onClick={handleAddNew}
                        className="px-8 py-4 bg-primary hover:bg-orange-500 text-white font-black rounded-2xl flex items-center gap-3 transition-all shadow-2xl shadow-primary/30 transform hover:-translate-y-1 active:scale-95 uppercase tracking-widest text-xs"
                    >
                        <Plus size={20} />
                        Nový člen
                    </button>
                )}
            </motion.div>

            <AnimatePresence mode="wait">
                {isEditing && currentCoach ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="premium-card p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2"></div>
                        
                        <div className="flex items-center gap-4 mb-10 relative z-10">
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/10">
                                <User size={28} />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                                {currentCoach._id ? 'Upravit člena' : 'Nový člen týmu'}
                            </h2>
                        </div>

                        <div className="space-y-8 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                {/* Photo column */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Fotografie</label>
                                    <div className="relative group">
                                        <div className="w-full aspect-square rounded-[2rem] bg-slate-50 border-2 border-slate-200 overflow-hidden group-hover:border-primary/50 transition-all duration-500 flex items-center justify-center">
                                            {currentCoach.img ? (
                                                <img src={currentCoach.img} alt="Coach" className="w-full h-full object-cover" />
                                            ) : (
                                                <User size={64} className="text-slate-200 group-hover:text-primary/30 transition-colors" />
                                            )}
                                        </div>
                                        
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-[2rem]">
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                className="hidden" 
                                                id="team-upload" 
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
                                                            setCurrentCoach({ ...currentCoach, img: url });
                                                            toast.success('Fotka nahrána!');
                                                        }
                                                    } catch (error) {
                                                        toast.error('Chyba při nahrávání fotky');
                                                    } finally {
                                                        setIsUploading(false);
                                                        if (e.target) e.target.value = '';
                                                    }
                                                }}
                                            />
                                            <label 
                                                htmlFor="team-upload"
                                                className={`px-6 py-3 bg-white text-slate-900 font-bold rounded-xl shadow-xl flex items-center gap-2 transform active:scale-95 transition-all text-xs uppercase tracking-widest cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />} 
                                                {isUploading ? 'Nahrávám...' : 'Změnit fotku'}
                                            </label>
                                        </div>
                                    </div>
                                    <input
                                        type="text"
                                        value={currentCoach.img}
                                        onChange={(e) => setCurrentCoach({ ...currentCoach, img: e.target.value })}
                                        className="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:border-primary/50 focus:outline-none transition-all placeholder:text-slate-300 font-bold text-xs truncate"
                                        placeholder="Nebo vložte URL..."
                                    />
                                </div>

                                <div className="space-y-8 lg:col-span-2">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Jméno a Příjmení</label>
                                            <input
                                                type="text"
                                                value={currentCoach.name}
                                                onChange={(e) => setCurrentCoach({ ...currentCoach, name: e.target.value })}
                                                className="w-full bg-white/50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all placeholder:text-slate-300 font-bold tracking-tight"
                                                placeholder="Jan Novák"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Role / Funkce</label>
                                            <input
                                                type="text"
                                                value={currentCoach.role}
                                                onChange={(e) => setCurrentCoach({ ...currentCoach, role: e.target.value })}
                                                className="w-full bg-white/50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all placeholder:text-slate-300 font-bold tracking-tight"
                                                placeholder="Trenér"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bio / Popis</label>
                                        <textarea
                                            value={currentCoach.bio}
                                            onChange={(e) => setCurrentCoach({ ...currentCoach, bio: e.target.value })}
                                            className="w-full bg-white/50 border border-slate-200 rounded-[2rem] px-6 py-4 text-slate-900 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all h-32 resize-none placeholder:text-slate-300 font-medium leading-relaxed"
                                            placeholder="Krátký popis zkušeností..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pohlaví</label>
                                        <div className="grid grid-cols-2 gap-4 max-w-sm">
                                            <button
                                                onClick={() => setCurrentCoach({ ...currentCoach, gender: 'male' })}
                                                className={`py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all border ${currentCoach.gender === 'male' ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'}`}
                                            >
                                                Muž
                                            </button>
                                            <button
                                                onClick={() => setCurrentCoach({ ...currentCoach, gender: 'female' })}
                                                className={`py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all border ${currentCoach.gender === 'female' ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'}`}
                                            >
                                                Žena
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-6 pt-10 border-t border-slate-100">
                                <button
                                    onClick={() => { setIsEditing(false); setCurrentCoach(null); }}
                                    className="px-8 py-4 rounded-2xl text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all font-black uppercase tracking-widest text-[10px] md:text-xs"
                                >
                                    Zrušit
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="px-12 py-4 rounded-2xl bg-primary hover:bg-orange-500 text-white font-black shadow-2xl shadow-primary/30 transition-all flex items-center gap-3 transform hover:-translate-y-1 active:scale-95 uppercase tracking-widest text-[10px] md:text-xs disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />} 
                                    Uložit člena
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                        {!team ? (
                            <div className="col-span-full flex flex-col items-center justify-center py-32 space-y-4">
                                <Loader2 size={48} className="text-primary animate-spin" />
                                <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Načítám tým...</p>
                            </div>
                        ) : team.length === 0 ? (
                            <div className="col-span-full text-center py-32 bg-white/40 rounded-[3rem] border-2 border-slate-200 border-dashed group hover:border-primary/30 transition-colors duration-500">
                                <User size={48} className="mx-auto text-slate-200 mb-6 group-hover:text-primary transition-colors" />
                                <h3 className="text-2xl font-black text-slate-900 mb-2">Tým je prázdný</h3>
                                <p className="text-slate-400 mb-8 font-medium">Zatím jste nepřidali žádné členy týmu.</p>
                                <button
                                    onClick={handleAddNew}
                                    className="px-8 py-4 bg-primary/10 hover:bg-primary text-primary hover:text-white font-black rounded-2xl transition-all uppercase tracking-widest text-xs"
                                >
                                    Přidat prvního člena
                                </button>
                            </div>
                        ) : (
                            team.map((coach: any, index: number) => (
                                <motion.div
                                    key={coach._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="premium-card p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] group relative overflow-hidden flex flex-col items-center text-center hover:scale-[1.02] transition-all duration-500"
                                >
                                    {/* Hover background glow */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    
                                    <div className="absolute top-6 right-6 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 duration-300 z-20">
                                        <button
                                            onClick={() => handleEdit(coach)}
                                            className="p-3 bg-white hover:bg-primary text-slate-400 hover:text-white rounded-xl shadow-sm transition-all border border-slate-200 hover:border-primary"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(coach._id)}
                                            disabled={isDeleting === coach._id}
                                            className="p-3 bg-white hover:bg-red-500 text-slate-400 hover:text-white rounded-xl shadow-sm transition-all border border-slate-200 hover:border-red-500 disabled:opacity-50"
                                        >
                                            {isDeleting === coach._id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                        </button>
                                    </div>

                                    <div className="relative mb-8">
                                        <div className="w-32 h-32 rounded-[2rem] bg-slate-50 overflow-hidden border-2 border-slate-200 group-hover:border-primary/50 transition-all duration-500 relative z-10 shadow-sm rotate-3 group-hover:rotate-0 transform">
                                            {coach.img ? (
                                                <img src={coach.img} alt={coach.name} className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300 group-hover:text-primary transition-colors">
                                                    <User size={48} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-0"></div>
                                    </div>

                                    <div className="relative z-10 space-y-2">
                                        <h3 className="text-xl font-black text-slate-900 group-hover:text-primary transition-colors duration-300 tracking-tight">{coach.name}</h3>
                                        <div className="inline-block px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-slate-400 group-hover:text-slate-600 transition-colors text-[10px] font-black uppercase tracking-widest mb-4">
                                            {coach.role}
                                        </div>
                                        <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-3 group-hover:text-slate-600 transition-colors px-2">
                                            {coach.bio}
                                        </p>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
