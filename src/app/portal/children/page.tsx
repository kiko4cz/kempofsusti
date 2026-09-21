'use client';

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Plus, User, Calendar, Shirt, Heart, X, Loader2, Star, Award, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChildrenPage() {
    const children = useQuery(api.children.getMyChildren);
    const addChild = useMutation(api.children.addChild);
    
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        birthDate: '',
        club: '',
        tshirtSize: '',
        healthInfo: '',
        notes: ''
    });

    const [selectedChild, setSelectedChild] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addChild(formData);
            setIsAdding(false);
            setFormData({ name: '', birthDate: '', club: '', tshirtSize: '', healthInfo: '', notes: '' });
        } catch (error) {
            console.error("Chyba při přidávání dítěte:", error);
        }
    };

    if (children === undefined) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-primary w-10 h-10" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Moje děti</h1>
                    <p className="text-slate-400 font-medium">Správa profilů a historie hodnocení z kempů.</p>
                </div>
                {!isAdding && (
                    <button 
                        onClick={() => setIsAdding(true)}
                        className="px-6 py-3 bg-primary hover:bg-orange-500 text-white font-bold rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-primary/20"
                    >
                        <Plus size={20} />
                        Přidat profil
                    </button>
                )}
            </div>

            <AnimatePresence>
                {isAdding && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-[#111827] border border-white/10 p-6 md:p-8 rounded-3xl relative">
                            <button 
                                onClick={() => setIsAdding(false)}
                                className="absolute top-6 right-6 text-slate-400 hover:text-white"
                            >
                                <X size={24} />
                            </button>
                            <h2 className="text-xl font-bold text-white mb-6">Nový profil dítěte</h2>
                            
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Jméno a příjmení</label>
                                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-white/10 bg-white/5 focus:bg-white/10 focus:border-primary outline-none transition-all text-white" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Datum narození</label>
                                    <input required type="date" value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-white/10 bg-white/5 focus:bg-white/10 focus:border-primary outline-none transition-all text-white [color-scheme:dark]" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Velikost trička</label>
                                    <select required value={formData.tshirtSize} onChange={e => setFormData({...formData, tshirtSize: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-white/10 bg-white/5 focus:bg-white/10 focus:border-primary outline-none transition-all text-white appearance-none">
                                        <option value="" disabled className="bg-slate-900">Vyberte</option>
                                        <option value="116" className="bg-slate-900">116 (5-6 let)</option>
                                        <option value="128" className="bg-slate-900">128 (7-8 let)</option>
                                        <option value="140" className="bg-slate-900">140 (9-10 let)</option>
                                        <option value="152" className="bg-slate-900">152 (11-12 let)</option>
                                        <option value="164" className="bg-slate-900">164 (13-14 let)</option>
                                        <option value="S" className="bg-slate-900">S</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Klub (volitelné)</label>
                                    <input type="text" value={formData.club} onChange={e => setFormData({...formData, club: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-white/10 bg-white/5 focus:bg-white/10 focus:border-primary outline-none transition-all text-white" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Zdravotní omezení (volitelné)</label>
                                    <input type="text" value={formData.healthInfo} onChange={e => setFormData({...formData, healthInfo: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-white/10 bg-white/5 focus:bg-white/10 focus:border-primary outline-none transition-all text-white" />
                                </div>
                                
                                <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                                    <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors">
                                        Zrušit
                                    </button>
                                    <button type="submit" className="px-8 py-3 bg-primary hover:bg-orange-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-primary/20">
                                        Uložit dítě
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {children.length === 0 && !isAdding && (
                    <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-300 dark:border-white/10 rounded-3xl text-slate-400 transition-colors">
                        <User size={48} className="mx-auto mb-4 opacity-50" />
                        <p>Zatím jste nepřidali žádný profil dítěte.</p>
                    </div>
                )}
                
                {children.map(child => (
                    <motion.div 
                        key={child._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/5 rounded-3xl p-6 relative overflow-hidden group hover:border-primary/30 transition-all cursor-pointer shadow-sm dark:shadow-none"
                        onClick={() => setSelectedChild(selectedChild === child._id ? null : child._id)}
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold text-lg border border-slate-200 dark:border-white/10 transition-colors">
                                {child.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-black text-slate-900 dark:text-white text-lg transition-colors">{child.name}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 transition-colors">
                                    <Calendar size={14} /> {new Date(child.birthDate).toLocaleDateString('cs-CZ')}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-white/5 transition-colors">
                            {child.club && (
                                <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300 transition-colors">
                                    <Shield size={16} className="text-primary" /> {child.club}
                                </div>
                            )}
                            <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300 transition-colors">
                                <Shirt size={16} className="text-blue-500 dark:text-blue-400" /> Velikost {child.tshirtSize || '?'}
                            </div>
                            {child.healthInfo && (
                                <div className="flex items-center gap-3 text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-400/10 p-2 rounded-lg transition-colors">
                                    <Heart size={16} /> {child.healthInfo}
                                </div>
                            )}
                        </div>

                        <AnimatePresence>
                            {selectedChild === child._id && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-6 pt-6 border-t border-slate-200 dark:border-white/10 overflow-hidden"
                                >
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2 transition-colors">
                                        <Award size={16} className="text-primary" />
                                        Hodnocení z kempů
                                    </h4>
                                    
                                    <ChildEvaluations childId={child._id} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

// Komponenta pro načtení a zobrazení hodnocení daného dítěte
function ChildEvaluations({ childId }: { childId: any }) {
    const evaluations = useQuery(api.evaluations.getByChild, { childId });

    if (evaluations === undefined) return <div className="text-xs text-slate-400">Načítám...</div>;
    
    if (evaluations.length === 0) {
        return <div className="text-sm text-slate-500 italic">Zatím žádné hodnocení.</div>;
    }

    return (
        <div className="space-y-4">
            {evaluations.map(ev => (
                <div key={ev._id} className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-200 dark:border-white/5 transition-colors">
                    <div className="flex justify-between mb-3">
                        <div className="font-bold text-slate-900 dark:text-white text-sm transition-colors">Turnus: {ev.campId}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="text-center bg-white dark:bg-black/30 rounded-lg p-2 border border-slate-200 dark:border-transparent transition-colors">
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 transition-colors">Chování</div>
                            <div className="font-black text-primary">{ev.pointsBehavior} <span className="text-xs font-normal">b</span></div>
                        </div>
                        <div className="text-center bg-white dark:bg-black/30 rounded-lg p-2 border border-slate-200 dark:border-transparent transition-colors">
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 transition-colors">Kamarádi</div>
                            <div className="font-black text-blue-500 dark:text-blue-400">{ev.pointsFriends} <span className="text-xs font-normal">b</span></div>
                        </div>
                        <div className="text-center bg-white dark:bg-black/30 rounded-lg p-2 border border-slate-200 dark:border-transparent transition-colors">
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 transition-colors">Soutěže</div>
                            <div className="font-black text-green-500 dark:text-green-400">{ev.pointsCompetitions} <span className="text-xs font-normal">b</span></div>
                        </div>
                    </div>
                    {ev.notes && (
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed p-3 bg-white dark:bg-black/20 rounded-lg border border-slate-200 dark:border-white/5 italic transition-colors">
                            "{ev.notes}"
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
}
