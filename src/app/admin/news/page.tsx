'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { toast } from 'sonner';

export default function AdminNews() {
    const news = useQuery(api.news.getNews);
    const addNews = useMutation(api.news.addNews);
    const updateNews = useMutation(api.news.updateNews);
    const deleteNews = useMutation(api.news.deleteNews);

    const [isEditing, setIsEditing] = useState(false);
    const [currentItem, setCurrentItem] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const handleAddNew = () => {
        setCurrentItem({
            title: '',
            date: new Date().toISOString().split('T')[0],
            content: '',
            active: true,
            type: 'info'
        });
        setIsEditing(true);
    };

    const handleEdit = (item: any) => {
        setCurrentItem({
            id: item._id,
            title: item.title,
            date: item.date,
            content: item.content,
            active: item.active,
            type: item.type
        });
        setIsEditing(true);
    };

    const handleDelete = async (id: any) => {
        if (confirm('Opravdu chcete smazat tuto novinku?')) {
            setIsDeleting(id);
            try {
                await deleteNews({ id });
                toast.success('Novinka smazána');
            } catch (error) {
                toast.error('Chyba při mazání novinky');
            } finally {
                setIsDeleting(null);
            }
        }
    };

    const handleSave = async () => {
        if (!currentItem.title || !currentItem.content) {
            toast.error('Nadpis a obsah jsou povinné');
            return;
        }

        setIsSaving(true);
        try {
            if (currentItem.id) {
                // Update
                await updateNews({
                    id: currentItem.id,
                    title: currentItem.title,
                    date: currentItem.date,
                    content: currentItem.content,
                    active: currentItem.active,
                    type: currentItem.type
                });
                toast.success('Novinka aktualizována!');
            } else {
                // Add
                await addNews({
                    title: currentItem.title,
                    date: currentItem.date,
                    content: currentItem.content,
                    active: currentItem.active,
                    type: currentItem.type
                });
                toast.success('Nová novinka přidána!');
            }
            setIsEditing(false);
            setCurrentItem(null);
        } catch (error) {
            toast.error('Chyba při ukládání novinky');
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
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-3 tracking-tight">Správa <span className="text-primary">Novinek</span></h1>
                    <p className="text-slate-500 text-lg font-medium tracking-tight">Informujte rodiče o důležitých změnách a aktualitách. (Ukládá se do cloudu)</p>
                </div>
                {!isEditing && (
                    <button
                        onClick={handleAddNew}
                        className="px-8 py-4 bg-primary hover:bg-orange-500 text-white font-black rounded-2xl flex items-center gap-3 transition-all shadow-2xl shadow-primary/30 transform hover:-translate-y-1 active:scale-95 uppercase tracking-widest text-xs"
                    >
                        <Plus size={20} />
                        Nová zpráva
                    </button>
                )}
            </motion.div>

            <AnimatePresence mode="wait">
                {isEditing && currentItem ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="premium-card rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2"></div>
                        
                        <div className="flex items-center gap-4 mb-10 relative z-10">
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/10">
                                {currentItem.id ? <Edit2 size={28} /> : <Plus size={28} />}
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                                {currentItem.id ? 'Upravit novinku' : 'Nová novinka'}
                            </h2>
                        </div>

                        <div className="space-y-8 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Nadpis aktuality</label>
                                    <input
                                        type="text"
                                        value={currentItem.title}
                                        onChange={(e) => setCurrentItem({ ...currentItem, title: e.target.value })}
                                        className="w-full bg-white/50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all placeholder:text-slate-300 font-bold"
                                        placeholder="Např. Změna času odjezdu"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Datum publikace</label>
                                    <input
                                        type="date"
                                        value={currentItem.date}
                                        onChange={(e) => setCurrentItem({ ...currentItem, date: e.target.value })}
                                        className="w-full bg-white/50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all font-bold"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Priorita zprávy</label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <button
                                        onClick={() => setCurrentItem({ ...currentItem, type: 'info' })}
                                        className={`px-6 py-4 rounded-2xl border flex items-center justify-center gap-3 transition-all font-black uppercase tracking-widest text-[10px] ${currentItem.type === 'info' ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-lg shadow-blue-500/10' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}
                                    >
                                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                        Informační
                                    </button>
                                    <button
                                        onClick={() => setCurrentItem({ ...currentItem, type: 'important' })}
                                        className={`px-6 py-4 rounded-2xl border flex items-center justify-center gap-3 transition-all font-black uppercase tracking-widest text-[10px] ${currentItem.type === 'important' ? 'bg-red-50 border-red-200 text-red-600 shadow-lg shadow-red-500/10' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}
                                    >
                                        <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                                        Důležité
                                    </button>
                                    <button
                                        onClick={() => setCurrentItem({ ...currentItem, type: 'alert' })}
                                        className={`px-6 py-4 rounded-2xl border flex items-center justify-center gap-3 transition-all font-black uppercase tracking-widest text-[10px] ${currentItem.type === 'alert' ? 'bg-orange-50 border-orange-200 text-orange-600 shadow-lg shadow-orange-500/10' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}
                                    >
                                        <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                                        Upozornění
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Detailní popis</label>
                                <textarea
                                    value={currentItem.content}
                                    onChange={(e) => setCurrentItem({ ...currentItem, content: e.target.value })}
                                    className="w-full bg-white/50 border border-slate-200 rounded-[2rem] px-6 py-4 text-slate-900 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all h-48 resize-none placeholder:text-slate-300 font-medium leading-relaxed"
                                    placeholder="Zde napište text vaší aktuality..."
                                />
                            </div>

                            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                                <div className="space-y-1">
                                    <h4 className="font-black text-slate-900 uppercase tracking-widest text-[10px]">Stav zobrazení na webu</h4>
                                    <p className="text-slate-400 text-[10px] font-bold">Určuje, zda bude novinka viditelná pro návštěvníky.</p>
                                </div>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-14 h-7 rounded-full p-1 transition-colors relative ${currentItem.active ? 'bg-primary' : 'bg-slate-300'}`}>
                                        <div className={`w-5 h-5 rounded-full bg-white shadow-lg transform transition-transform duration-300 flex items-center justify-center ${currentItem.active ? 'translate-x-7' : 'translate-x-0'}`}>
                                            {currentItem.active ? <Eye size={10} className="text-primary" /> : <EyeOff size={10} className="text-slate-400" />}
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={currentItem.active}
                                        onChange={(e) => setCurrentItem({ ...currentItem, active: e.target.checked })}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            <div className="flex justify-end gap-6 pt-10 border-t border-slate-100">
                                <button
                                    onClick={() => { setIsEditing(false); setCurrentItem(null); }}
                                    className="px-8 py-4 rounded-2xl text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all font-black uppercase tracking-widest text-xs"
                                >
                                    Zrušit
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="px-12 py-4 rounded-2xl bg-primary hover:bg-orange-500 text-white font-black shadow-2xl shadow-primary/30 transition-all flex items-center gap-3 transform hover:-translate-y-1 active:scale-95 uppercase tracking-widest text-xs disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                                    Uložit novinku
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 gap-8">
                        {!news ? (
                             <div className="flex flex-col items-center justify-center py-32 space-y-4">
                                <Loader2 size={48} className="text-primary animate-spin" />
                                <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Načítám novinky...</p>
                            </div>
                        ) : news.length === 0 ? (
                            <div className="text-center py-32 bg-white/40 rounded-[3rem] border-2 border-slate-200 border-dashed group hover:border-primary/30 transition-colors duration-500">
                                <div className="w-20 h-20 bg-slate-50 rounded-3xl mx-auto flex items-center justify-center text-slate-300 mb-6 group-hover:text-primary transition-colors">
                                    <AlertCircle size={40} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Žádné novinky</h3>
                                <p className="text-slate-400 mb-8 font-medium">Zatím jste nevytvořili žádné aktuality pro váš web.</p>
                                <button
                                    onClick={handleAddNew}
                                    className="px-8 py-4 bg-primary/10 hover:bg-primary text-primary hover:text-white font-black rounded-2xl transition-all uppercase tracking-widest text-xs"
                                >
                                    Vytvořit první
                                </button>
                            </div>
                        ) : (
                            news.map((item, index) => (
                                <motion.div
                                    key={item._id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`premium-card p-6 md:p-10 group relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8 ${!item.active ? 'opacity-60 grayscale-[0.3]' : ''}`}
                                >
                                    <div className="flex-1 space-y-4 relative z-10">
                                        <div className="flex flex-wrap items-center gap-4">
                                            <span className="text-xs text-slate-500 font-black tracking-[0.2em] border border-slate-200 px-3 py-1.5 rounded-xl bg-slate-50 shadow-sm">
                                                {new Date(item.date).toLocaleDateString('cs-CZ')}
                                            </span>
                                            
                                            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-500 flex items-center gap-2 ${
                                                item.type === 'info' ? 'bg-blue-50 border-blue-100 text-blue-600' :
                                                item.type === 'important' ? 'bg-red-50 border-red-100 text-red-600' :
                                                'bg-orange-50 border-orange-100 text-orange-600'
                                            }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${
                                                    item.type === 'info' ? 'bg-blue-500' :
                                                    item.type === 'important' ? 'bg-primary' :
                                                    'bg-orange-500'
                                                }`} />
                                                {item.type === 'info' ? 'Informační' : item.type === 'important' ? 'Důležité' : 'Upozornění'}
                                            </div>

                                            {!item.active && (
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full">
                                                    <EyeOff size={12} /> Skryto
                                                </span>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-primary transition-colors duration-300">{item.title}</h3>
                                            <p className="text-slate-500 font-medium leading-relaxed line-clamp-2 pr-8">{item.content}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 relative z-10 self-end md:self-center">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="p-5 rounded-2xl bg-white hover:bg-primary text-slate-400 hover:text-white transition-all border border-slate-200 hover:border-primary shadow-sm group/btn transform hover:-translate-y-1 active:scale-95"
                                            title="Upravit"
                                        >
                                            <Edit2 size={24} className="group-hover/btn:scale-110 transition-transform" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            disabled={isDeleting === item._id}
                                            className="p-5 rounded-2xl bg-white hover:bg-red-500 text-slate-400 hover:text-white transition-all border border-slate-200 hover:border-red-500 shadow-sm group/btn transform hover:-translate-y-1 active:scale-95"
                                            title="Smazat"
                                        >
                                            {isDeleting === item._id ? <Loader2 size={24} className="animate-spin" /> : <Trash2 size={24} className="group-hover/btn:scale-110 transition-transform" />}
                                        </button>
                                    </div>

                                    <div className="absolute inset-x-0 bottom-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                                </motion.div>
                            ))
                        )}
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
