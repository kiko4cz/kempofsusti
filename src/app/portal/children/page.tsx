'use client';

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Plus, User, Calendar, Shirt, Heart, X, Loader2, Star, Award, Shield, ChevronDown, CheckCircle2, Clock, XCircle, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChildrenPage() {
    const children = useQuery(api.children.getMyChildren);
    const registrations = useQuery(api.registrations.getMyRegistrations);
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

    if (children === undefined || registrations === undefined) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-primary w-10 h-10" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
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

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {children.length === 0 && !isAdding && (
                    <div className="col-span-full py-16 text-center border-2 border-dashed border-white/10 rounded-[3rem] text-slate-500 bg-white/[0.01]">
                        <User size={64} className="mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">Zatím jste nepřidali žádný profil dítěte.</p>
                        <p className="text-sm mt-2 opacity-70">Přidejte profil pro možnost podání přihlášky na kemp.</p>
                    </div>
                )}
                
                {children.map(child => (
                    <ChildCard 
                        key={child._id} 
                        child={child} 
                        registrations={registrations.filter(r => r.childId === child._id)} 
                    />
                ))}
            </div>
        </div>
    );
}

function ChildCard({ child, registrations }: { child: any, registrations: any[] }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState<'info' | 'camps' | 'evals'>('camps');
    
    const evaluations = useQuery(api.evaluations.getByChild, { childId: child._id });
    
    // Calculate overall score (max 30 pts per camp)
    let scorePercentage = 0;
    if (evaluations && evaluations.length > 0) {
        const totalPoints = evaluations.reduce((acc, ev) => acc + ev.pointsBehavior + ev.pointsFriends + ev.pointsCompetitions, 0);
        const maxPoints = evaluations.length * 30;
        scorePercentage = Math.round((totalPoints / maxPoints) * 100);
    }

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Schválená': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'Zamítnutá': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Schválená': return <CheckCircle2 size={14} />;
            case 'Zamítnutá': return <XCircle size={14} />;
            default: return <Clock size={14} />;
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`bg-[#111827] border rounded-[2rem] overflow-hidden transition-all duration-300 flex flex-col ${
                isExpanded ? 'border-primary/50 shadow-[0_0_40px_rgba(239,68,68,0.15)] col-span-1 md:col-span-2 xl:col-span-3' : 'border-white/10 hover:border-white/30'
            }`}
        >
            {/* Clickable Header Area */}
            <div 
                className="p-6 md:p-8 cursor-pointer relative group flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-5 relative z-10">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-white font-black text-2xl shadow-inner border border-white/5">
                            {child.name.charAt(0)}
                        </div>
                        {scorePercentage > 0 && (
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-tr from-primary to-orange-500 rounded-full border-[3px] border-[#111827] flex items-center justify-center shadow-lg">
                                <Star size={12} className="text-white fill-white" />
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className="font-black text-white text-2xl group-hover:text-primary transition-colors">{child.name}</h3>
                        <p className="text-sm text-slate-400 font-medium mt-1 flex items-center gap-2">
                            <Calendar size={14} className="text-slate-500" /> {new Date(child.birthDate).toLocaleDateString('cs-CZ')}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-6 relative z-10">
                    {/* Score Summary */}
                    {evaluations && evaluations.length > 0 ? (
                        <div className="flex flex-col items-end hidden sm:flex">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Celkové skóre</span>
                            <div className="flex items-baseline gap-1 text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">
                                <span className="text-3xl font-black leading-none">{scorePercentage}</span>
                                <span className="text-lg font-bold">%</span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-end hidden sm:flex opacity-50">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Celkové skóre</span>
                            <span className="text-lg font-bold text-slate-600">--</span>
                        </div>
                    )}

                    <div className={`w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-primary/10 text-primary border-primary/20' : 'group-hover:bg-white/10 group-hover:text-white'}`}>
                        <ChevronDown size={20} />
                    </div>
                </div>
                
                {/* Background glow when expanded */}
                <div className={`absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`} />
            </div>

            {/* Expanded Content Area */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-white/5 bg-slate-900/50"
                    >
                        <div className="flex border-b border-white/5 px-6 md:px-8">
                            <button 
                                onClick={(e) => { e.stopPropagation(); setActiveTab('camps'); }}
                                className={`px-4 py-4 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'camps' ? 'text-white border-primary' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
                            >
                                <span className="flex items-center gap-2"><Calendar size={16}/> Historie kempů</span>
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); setActiveTab('evals'); }}
                                className={`px-4 py-4 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'evals' ? 'text-white border-primary' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
                            >
                                <span className="flex items-center gap-2"><Award size={16}/> Hodnocení</span>
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); setActiveTab('info'); }}
                                className={`px-4 py-4 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'info' ? 'text-white border-primary' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
                            >
                                <span className="flex items-center gap-2"><User size={16}/> Údaje</span>
                            </button>
                        </div>

                        <div className="p-6 md:p-8 min-h-[300px]">
                            {/* TAB: CAMPS */}
                            {activeTab === 'camps' && (
                                <div className="space-y-4">
                                    {registrations.length === 0 ? (
                                        <div className="text-center py-12 text-slate-500">
                                            <Calendar size={32} className="mx-auto mb-3 opacity-30" />
                                            <p>Zatím žádné přihlášky na kempy.</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                            {registrations.map(reg => (
                                                <div key={reg._id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/[0.07] transition-colors">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${getStatusStyle(reg.status)}`}>
                                                            {getStatusIcon(reg.status)}
                                                            {reg.status}
                                                        </div>
                                                        <span className="text-xs font-medium text-slate-500">
                                                            Přihlášeno {new Date(reg.createdAt).toLocaleDateString('cs-CZ')}
                                                        </span>
                                                    </div>
                                                    <h4 className="font-black text-white text-lg leading-tight mb-1">{reg.campName}</h4>
                                                    <p className="text-sm text-slate-400 flex items-center gap-2">
                                                        <Calendar size={14} /> {reg.campDates}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TAB: EVALUATIONS */}
                            {activeTab === 'evals' && (
                                <div className="space-y-4">
                                    {evaluations === undefined ? (
                                        <div className="text-center py-12"><Loader2 className="animate-spin text-primary mx-auto" /></div>
                                    ) : evaluations.length === 0 ? (
                                        <div className="text-center py-12 text-slate-500">
                                            <Award size={32} className="mx-auto mb-3 opacity-30" />
                                            <p>Zatím žádné hodnocení z kempů.</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {evaluations.map(ev => {
                                                const total = ev.pointsBehavior + ev.pointsFriends + ev.pointsCompetitions;
                                                const evScore = Math.round((total / 30) * 100);
                                                return (
                                                    <div key={ev._id} className="bg-gradient-to-b from-white/5 to-transparent border border-white/10 p-5 rounded-2xl relative overflow-hidden">
                                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                                        
                                                        <div className="flex justify-between items-center mb-6 relative z-10">
                                                            <div className="font-black text-white text-lg">Kemp {ev.campId}</div>
                                                            <div className="bg-black/40 px-3 py-1 rounded-lg border border-white/5 text-primary font-black text-sm">
                                                                Skóre {evScore}%
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="grid grid-cols-3 gap-3 mb-5 relative z-10">
                                                            <div className="text-center bg-black/20 rounded-xl p-3 border border-white/5">
                                                                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Chování</div>
                                                                <div className="font-black text-white text-xl">{ev.pointsBehavior}<span className="text-xs text-slate-600">/10</span></div>
                                                            </div>
                                                            <div className="text-center bg-black/20 rounded-xl p-3 border border-white/5">
                                                                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Kamarádi</div>
                                                                <div className="font-black text-white text-xl">{ev.pointsFriends}<span className="text-xs text-slate-600">/10</span></div>
                                                            </div>
                                                            <div className="text-center bg-black/20 rounded-xl p-3 border border-white/5">
                                                                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Soutěže</div>
                                                                <div className="font-black text-white text-xl">{ev.pointsCompetitions}<span className="text-xs text-slate-600">/10</span></div>
                                                            </div>
                                                        </div>

                                                        {ev.notes && (
                                                            <div className="relative z-10 text-sm text-slate-300 leading-relaxed p-4 bg-black/20 rounded-xl border border-white/5 italic">
                                                                <FileText size={16} className="inline-block mr-2 text-slate-500 opacity-50" />
                                                                "{ev.notes}"
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TAB: INFO */}
                            {activeTab === 'info' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                                            <Shirt size={20} />
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Velikost trička</div>
                                            <div className="text-white font-medium">{child.tshirtSize || 'Neuvedeno'}</div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                                            <Shield size={20} />
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Klub</div>
                                            <div className="text-white font-medium">{child.club || 'Bez klubu'}</div>
                                        </div>
                                    </div>

                                    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-start gap-4 sm:col-span-2">
                                        <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                                            <Heart size={20} />
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Zdravotní omezení a alergie</div>
                                            <div className="text-white font-medium">{child.healthInfo || 'Bez omezení'}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
