'use client';

import { useState } from 'react';
import { Edit2, Save, X, Plus, Trash2, CheckCircle, AlertCircle, Calendar, Loader2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { toast } from 'sonner';

export default function AdminCamps() {
    const camps = useQuery(api.camps.getCamps);
    const addCamp = useMutation(api.camps.addCamp);
    const updateCamp = useMutation(api.camps.updateCamp);
    const deleteCamp = useMutation(api.camps.deleteCamp);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [tempTerm, setTempTerm] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    const handleAddNew = () => {
        setTempTerm({
            dates: '',
            location: 'Areál TJ Vaňov, Brzákova 146/1',
            price: '3 000',
            status: 'Volno',
            features: ['Celodenní strava', 'Kempový set', 'Pitný režim'],
        });
        setIsAdding(true);
    };

    const handleEdit = (term: any) => {
        setEditingId(term._id);
        setTempTerm({ ...term });
    };

    const handleCancel = () => {
        setEditingId(null);
        setTempTerm(null);
        setIsAdding(false);
    };

    const handleSave = async () => {
        if (!tempTerm.dates || !tempTerm.location) {
            toast.error('Datum a lokalita jsou povinné');
            return;
        }

        setIsSaving(true);
        try {
            if (editingId) {
                // Update
                await updateCamp({
                    id: editingId as any,
                    dates: tempTerm.dates,
                    location: tempTerm.location,
                    price: tempTerm.price,
                    status: tempTerm.status,
                    features: tempTerm.features,
                });
                toast.success('Turnus aktualizován!');
            } else {
                // Add
                await addCamp({
                    dates: tempTerm.dates,
                    location: tempTerm.location,
                    price: tempTerm.price,
                    status: tempTerm.status,
                    features: tempTerm.features,
                });
                toast.success('Nový turnus přidán!');
            }
            setEditingId(null);
            setTempTerm(null);
            setIsAdding(false);
        } catch (error) {
            toast.error('Chyba při ukládání turnusu');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: any) => {
        if (confirm('Opravdu chcete smazat tento turnus?')) {
            setIsDeleting(id);
            try {
                await deleteCamp({ id });
                toast.success('Turnus smazán');
            } catch (error) {
                toast.error('Chyba při mazání turnusu');
            } finally {
                setIsDeleting(null);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (tempTerm) {
            setTempTerm({ ...tempTerm, [e.target.name]: e.target.value });
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
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-3 tracking-tight">Správa <span className="text-primary">Turnusů</span></h1>
                    <p className="text-slate-500 text-lg font-medium tracking-tight">Správa termínů, cen a obsazenosti jednotlivých kempů. (Cloudové úložiště)</p>
                </div>
                {!isAdding && !editingId && (
                    <button 
                        onClick={handleAddNew}
                        className="px-8 py-4 bg-primary hover:bg-orange-500 text-white font-black rounded-2xl flex items-center gap-3 transition-all shadow-2xl shadow-primary/30 transform hover:-translate-y-1 active:scale-95 uppercase tracking-widest text-xs"
                    >
                        <Plus size={20} />
                        Přidat turnus
                    </button>
                )}
            </motion.div>

            <div className="grid grid-cols-1 gap-8">
                <AnimatePresence mode="popLayout">
                    {isAdding && tempTerm && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="premium-card p-8 rounded-[2rem] ring-2 ring-primary shadow-2xl shadow-primary/20 bg-primary/[0.03]"
                        >
                             <div className="space-y-8">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                        <Plus size={24} />
                                    </div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Nový turnus</h2>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Datum konání</label>
                                        <input
                                            type="text"
                                            name="dates"
                                            value={tempTerm.dates}
                                            onChange={handleChange}
                                            placeholder="Např. 13. 7. – 17. 7. 2026"
                                            className="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all font-bold placeholder:text-slate-300"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lokalita</label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={tempTerm.location}
                                            onChange={handleChange}
                                            className="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cena kempu</label>
                                        <div className="relative group/price">
                                            <input
                                                type="text"
                                                name="price"
                                                value={tempTerm.price}
                                                onChange={handleChange}
                                                className="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all font-bold pr-12"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 group-focus-within/price:text-primary transition-colors">KČ</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status obsazenosti</label>
                                        <div className="relative">
                                            <select
                                                name="status"
                                                value={tempTerm.status}
                                                onChange={handleChange}
                                                className="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all font-bold appearance-none cursor-pointer"
                                            >
                                                <option value="Volno" className="bg-white text-green-600">Volno</option>
                                                <option value="Poslední místa" className="bg-white text-orange-600">Poslední místa</option>
                                                <option value="Obsazeno" className="bg-white text-red-600">Obsazeno</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                <ChevronDown size={16} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 pt-8 border-t border-slate-100">
                                    <button
                                        onClick={handleCancel}
                                        className="px-6 md:px-8 py-4 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all font-black uppercase tracking-widest text-[10px] md:text-xs"
                                    >
                                        Zrušit
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="px-8 md:px-10 py-4 rounded-xl bg-primary hover:bg-orange-500 text-white font-black shadow-xl shadow-primary/20 transition-all flex items-center gap-2 transform active:scale-95 uppercase tracking-widest text-[10px] md:text-xs disabled:opacity-50"
                                    >
                                        {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} 
                                        Uložit turnus
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {!camps ? (
                        <div className="flex flex-col items-center justify-center py-32 space-y-4">
                            <Loader2 size={48} className="text-primary animate-spin" />
                            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Načítám turnusy...</p>
                        </div>
                    ) : camps.length === 0 && !isAdding ? (
                        <div className="text-center py-32 bg-white/40 rounded-[3rem] border-2 border-slate-200 border-dashed group hover:border-primary/30 transition-colors duration-500">
                            <div className="w-20 h-20 bg-slate-50 rounded-3xl mx-auto flex items-center justify-center text-slate-300 mb-6 group-hover:text-primary transition-colors">
                                <Calendar size={40} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Žádné turnusy</h3>
                            <p className="text-slate-400 mb-8 font-medium">Zatím jste nevytvořili žádné termíny kempů.</p>
                            <button
                                onClick={handleAddNew}
                                className="px-8 py-4 bg-primary/10 hover:bg-primary text-primary hover:text-white font-black rounded-2xl transition-all uppercase tracking-widest text-xs"
                            >
                                Vytvořit první
                            </button>
                        </div>
                    ) : (
                        camps.map((term: any, index: number) => (
                            <motion.div
                                key={term._id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`premium-card p-1 rounded-[2rem] overflow-hidden transition-all duration-500 ${
                                    editingId === term._id ? 'ring-2 ring-primary shadow-2xl shadow-primary/20 scale-[1.02] z-20' : 'hover:scale-[1.01]'
                                }`}
                            >
                                <div className={`p-5 md:p-8 rounded-[1.7rem] md:rounded-[1.9rem] ${editingId === term._id ? 'bg-primary/[0.03]' : 'bg-transparent'}`}>
                                    {editingId === term._id && tempTerm ? (
                                        // Editing Mode
                                        <div className="space-y-8">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                                    <Edit2 size={24} />
                                                </div>
                                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Upravit turnus</h2>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Datum konání</label>
                                                    <input
                                                        type="text"
                                                        name="dates"
                                                        value={tempTerm.dates}
                                                        onChange={handleChange}
                                                        className="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all font-bold"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lokalita</label>
                                                    <input
                                                        type="text"
                                                        name="location"
                                                        value={tempTerm.location}
                                                        onChange={handleChange}
                                                        className="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all font-bold"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cena kempu</label>
                                                    <div className="relative group/price">
                                                        <input
                                                            type="text"
                                                            name="price"
                                                            value={tempTerm.price}
                                                            onChange={handleChange}
                                                            className="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all font-bold pr-12"
                                                        />
                                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 group-focus-within/price:text-primary transition-colors">KČ</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status obsazenosti</label>
                                                    <div className="relative">
                                                        <select
                                                            name="status"
                                                            value={tempTerm.status}
                                                            onChange={handleChange}
                                                            className="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all font-bold appearance-none cursor-pointer"
                                                        >
                                                            <option value="Volno" className="bg-white text-green-600">Volno</option>
                                                            <option value="Poslední místa" className="bg-white text-orange-600">Poslední místa</option>
                                                            <option value="Obsazeno" className="bg-white text-red-600">Obsazeno</option>
                                                        </select>
                                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                            <Plus size={16} className="rotate-45" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-end gap-4 pt-8 border-t border-slate-100">
                                                <button
                                                    onClick={handleCancel}
                                                    className="px-6 md:px-8 py-4 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all font-black uppercase tracking-widest text-[10px] md:text-xs"
                                                >
                                                    Zrušit
                                                </button>
                                                <button
                                                    onClick={handleSave}
                                                    disabled={isSaving}
                                                    className="px-8 md:px-10 py-4 rounded-xl bg-primary hover:bg-orange-500 text-white font-black shadow-xl shadow-primary/20 transition-all flex items-center gap-2 transform active:scale-95 uppercase tracking-widest text-[10px] md:text-xs disabled:opacity-50"
                                                >
                                                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} 
                                                    Uložit změny
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        // View Mode
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
                                            <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                                                <div className="flex flex-col items-center justify-center w-24 h-24 bg-white/50 border border-slate-200 rounded-3xl group-hover:bg-primary/5 group-hover:border-primary/30 transition-all duration-500">
                                                    <Calendar size={32} className="text-primary/30 group-hover:text-primary transition-colors" />
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mt-1 group-hover:text-primary/70">Turnus</span>
                                                </div>
                                                
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-4">
                                                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Turnus</h3>
                                                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-500 ${
                                                            term.status === 'Volno' ? 'bg-green-500/10 border-green-500/20 text-green-700 shadow-sm' :
                                                            term.status === 'Poslední místa' ? 'bg-orange-500/10 border-orange-500/20 text-orange-700 shadow-sm' :
                                                            'bg-red-500/10 border-red-500/20 text-red-700 shadow-sm'
                                                        }`}>
                                                            {term.status}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                                                        <p className="text-slate-500 font-bold flex items-center gap-2">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-primary mb-0.5"></span>
                                                            {term.dates}
                                                        </p>
                                                        <p className="text-slate-400 font-medium flex items-center gap-2">
                                                            <AlertCircle size={14} className="text-slate-300" />
                                                            {term.location}
                                                        </p>
                                                        <p className="text-primary font-black flex items-center gap-2">
                                                            {term.price} <span className="text-[10px] text-primary/50 uppercase tracking-widest">Kč</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 self-end lg:self-auto">
                                                <div className="hidden sm:flex gap-1.5 mr-4">
                                                    {term.features?.map((f: string, i: number) => (
                                                        <span key={i} className="text-[9px] font-black uppercase tracking-widest text-slate-500 bg-white border border-slate-100 px-2 py-1 rounded-md shadow-sm">
                                                            {f}
                                                        </span>
                                                    ))}
                                                </div>
                                                <button
                                                    onClick={() => handleEdit(term)}
                                                    className="p-5 rounded-2xl bg-white hover:bg-primary text-slate-400 hover:text-white transition-all border border-slate-200 hover:border-primary shadow-sm group/btn transform hover:-translate-y-1 active:scale-95"
                                                    title="Upravit"
                                                >
                                                    <Edit2 size={24} className="group-hover/btn:scale-110 transition-transform" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(term._id)}
                                                    disabled={isDeleting === term._id}
                                                    className="p-5 rounded-2xl bg-white hover:bg-red-500 text-slate-400 hover:text-white transition-all border border-slate-200 hover:border-red-500 shadow-sm group/btn transform hover:-translate-y-1 active:scale-95"
                                                    title="Smazat"
                                                >
                                                    {isDeleting === term._id ? <Loader2 size={24} className="animate-spin" /> : <Trash2 size={24} className="group-hover/btn:scale-110 transition-transform" />}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
