'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, History as HistoryIcon, Calendar, MapPin, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { toast } from 'sonner';

interface HistoryItem {
    id: string;
    year: string;
    location: string;
}

const defaultHistory: HistoryItem[] = [
    { id: '1', year: '2026', location: 'Vaňov, Vaňov' },
    { id: '2', year: '2025', location: 'Přestanov, Vaňov' },
    { id: '3', year: '2024', location: 'Povrly' },
    { id: '4', year: '2023', location: 'Povrly' },
    { id: '5', year: '2022', location: 'Povrly' },
    { id: '6', year: '2021', location: 'Povrly' },
    { id: '7', year: '2020', location: 'Střekov' },
    { id: '8', year: '2019', location: 'Povrly' },
    { id: '9', year: '2018', location: 'Ústí nad Labem' },
    { id: '10', year: '2017', location: 'Svádov, Povrly' },
    { id: '11', year: '2016', location: 'Chlumec' },
    { id: '12', year: '2015', location: 'Povrly' },
    { id: '13', year: '2014', location: 'Chabařovice' },
    { id: '14', year: '2013', location: 'Ústí nad Labem' },
    { id: '15', year: '2012', location: 'Ústí nad Labem' },
];

export default function AdminHistory() {
    const rawContent = useQuery(api.content.getContent);
    const updateContent = useMutation(api.content.updateContent);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [originalFields, setOriginalFields] = useState<any[]>([]);

    useEffect(() => {
        if (rawContent) {
            const section = rawContent.find(s => s.sectionId === 'history');
            if (section) {
                setOriginalFields(section.fields);
                const timelineField = section.fields.find(f => f.key === 'json_timeline');
                if (timelineField && timelineField.value) {
                    try {
                        const parsed = JSON.parse(String(timelineField.value));
                        // Map "loc" from JSON to "location" for UI
                        setHistory(parsed.map((p: any, idx: number) => ({
                            id: Date.now().toString() + idx,
                            year: p.year,
                            location: p.loc
                        })));
                    } catch (e) {
                        setHistory(defaultHistory);
                    }
                } else {
                    setHistory(defaultHistory);
                }
            } else {
                setHistory(defaultHistory);
            }
        }
    }, [rawContent]);

    const handleAdd = () => {
        const newItem: HistoryItem = {
            id: Date.now().toString(),
            year: (new Date().getFullYear()).toString(),
            location: 'Nová lokalita'
        };
        setHistory([newItem, ...history]);
    };

    const handleDelete = (id: string) => {
        if (confirm('Opravdu smazat tento záznam?')) {
            setHistory(history.filter(h => h.id !== id));
        }
    };

    const handleChange = (id: string, field: 'year' | 'location', value: string) => {
        const newHistory = history.map(h =>
            h.id === id ? { ...h, [field]: value } : h
        );
        setHistory(newHistory);
    };

    const handleSave = async () => {
        // Build JSON timeline with "loc" to match History.tsx
        const jsonTimeline = JSON.stringify(history.map(h => ({
            year: h.year,
            loc: h.location
        })));

        // Update fields array while keeping title etc
        let newFields = [...originalFields];
        const timelineIndex = newFields.findIndex(f => f.key === 'json_timeline');
        
        if (timelineIndex >= 0) {
            newFields[timelineIndex].value = jsonTimeline;
        } else {
            newFields.push({
                key: 'json_timeline',
                label: 'Časová osa (JSON formát)',
                type: 'textarea',
                value: jsonTimeline
            });
        }

        try {
            await updateContent({
                sectionId: 'history',
                fields: newFields
            });
            toast.success('Historie uložena!');
        } catch (error) {
            toast.error('Chyba při ukládání');
        }
    };

    return (
        <div className="space-y-8 md:space-y-12 pb-24 max-w-5xl mx-auto px-4 md:px-0">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-2">
                        <HistoryIcon size={12} /> Archív ročníků
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none">
                        Historie <span className="text-primary italic">Kempů</span>
                    </h1>
                    <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
                        Spravujte seznam proběhlých ročníků a jejich lokalit pro přehled na webu.
                    </p>
                </div>
                <button
                    onClick={handleAdd}
                    className="px-8 py-5 bg-primary hover:bg-orange-500 text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all shadow-2xl shadow-primary/30 transform hover:-translate-y-1 active:scale-95 uppercase tracking-widest text-xs self-start md:self-center"
                >
                    <Plus size={22} />
                    Přidat rok
                </button>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="premium-card rounded-[2.5rem] md:rounded-[3rem] overflow-hidden">
                <div className="hidden md:grid grid-cols-12 gap-6 p-8 bg-slate-50/50 border-b border-slate-100 items-center">
                    <div className="col-span-3 flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                        <Calendar size={14} className="text-primary" />
                        Rok konání
                    </div>
                    <div className="col-span-7 flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                        <MapPin size={14} className="text-primary" />
                        Lokalita a název
                    </div>
                    <div className="col-span-2 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Akce
                    </div>
                </div>

                <div className="divide-y divide-slate-50">
                    <AnimatePresence initial={false}>
                        {history.map((item, idx) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="p-4 md:p-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-center hover:bg-slate-50/50 transition-all group md:rounded-2xl md:p-2">
                                    <div className="md:col-span-3">
                                        <div className="md:hidden text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1 flex items-center gap-2">
                                            <Calendar size={12} className="text-primary" /> Rok konání
                                        </div>
                                        <input
                                            type="text"
                                            value={item.year}
                                            onChange={(e) => handleChange(item.id, 'year', e.target.value)}
                                            className="w-full bg-white border-2 border-slate-100 md:border-slate-200 rounded-2xl px-5 py-4 text-slate-900 font-black tracking-tight focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all shadow-sm text-lg"
                                            placeholder="2026"
                                        />
                                    </div>
                                    <div className="md:col-span-7">
                                        <div className="md:hidden text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1 flex items-center gap-2">
                                            <MapPin size={12} className="text-primary" /> Lokalita
                                        </div>
                                        <input
                                            type="text"
                                            value={item.location}
                                            onChange={(e) => handleChange(item.id, 'location', e.target.value)}
                                            className="w-full bg-white border-2 border-slate-100 md:border-slate-200 rounded-2xl px-5 py-4 text-slate-900 font-bold focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all shadow-sm"
                                            placeholder="Lokalita..."
                                        />
                                    </div>
                                    <div className="md:col-span-2 flex justify-end md:justify-center border-t md:border-t-0 border-slate-100 pt-4 md:pt-0 mt-2 md:mt-0">
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="p-4 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all active:scale-95 border border-transparent hover:border-red-100 group/btn transform hover:-rotate-12"
                                            title="Smazat"
                                        >
                                            <Trash2 size={24} className="group-hover/btn:scale-110 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
                
                {history.length === 0 && (
                    <div className="p-20 text-center bg-slate-50/50">
                        <HistoryIcon size={48} className="mx-auto text-slate-200 mb-6 animate-pulse" />
                        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Historie je momentálně prázdná</p>
                    </div>
                )}

                <div className="p-6 md:p-8 border-t border-slate-100 bg-slate-50/30 flex items-center justify-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6)] animate-pulse" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] text-center">
                        Systém správy ročníků aktivní
                    </span>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-col sm:flex-row justify-end gap-4">
                <button
                    onClick={handleSave}
                    className="px-12 py-5 bg-white border-2 border-slate-100 hover:border-primary text-slate-900 font-black rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-slate-200/50 transform hover:-translate-y-1 active:scale-95 uppercase tracking-widest text-xs group"
                >
                    <Save size={20} className="text-primary group-hover:scale-110 transition-transform" />
                    Uložit všechny změny
                </button>
            </motion.div>
        </div>
    );
}
