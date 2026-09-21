'use client';

import { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Users, Loader2, Star, User, ChevronRight, X, Calendar, Shirt, CheckCircle2, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Id } from "../../../../convex/_generated/dataModel";

export default function CoachDashboard() {
    const rawContent = useQuery(api.content.getContent);
    const registrations = useQuery(api.registrations.getRegistrations);
    
    const [selectedCampId, setSelectedCampId] = useState<string | null>(null);

    // Vytěžení všech turnusů z obsahu (historie/timeline)
    const camps = useMemo(() => {
        if (!rawContent) return [];
        const historySection = rawContent.find(s => s.sectionId === 'history');
        if (!historySection) return [];
        
        const timelineField = historySection.fields.find(f => f.key === 'json_timeline');
        if (!timelineField || typeof timelineField.value !== 'string') return [];

        const allCamps = [];
        try {
            const timeline = JSON.parse(timelineField.value);
            for (const year of timeline) {
                if (year.terms) {
                    for (const term of year.terms) {
                        allCamps.push({
                            id: term.id,
                            name: term.name || `Turnus`,
                            dates: term.dates || ''
                        });
                    }
                }
            }
        } catch (e) {
            console.error("Failed to parse timeline JSON:", e);
        }
        return allCamps.reverse(); // Nejnovější první
    }, [rawContent]);

    if (rawContent === undefined || registrations === undefined) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-primary w-10 h-10" />
            </div>
        );
    }

    if (selectedCampId) {
        const camp = camps.find(c => c.id === selectedCampId);
        return (
            <CampEvaluation 
                campId={selectedCampId} 
                campName={camp?.name || 'Kemp'}
                onBack={() => setSelectedCampId(null)} 
            />
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Výběr turnusu</h2>
                <p className="text-slate-400 font-medium">Vyberte kemp pro zobrazení hráčů a zápis hodnocení.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {camps.map(camp => {
                    // Spočítáme děti v kempu
                    const campRegs = registrations.filter(r => r.campId === camp.id && r.status !== 'Zamítnutá');
                    
                    return (
                        <motion.div 
                            key={camp.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedCampId(camp.id)}
                            className="bg-[#111827] border border-white/5 hover:border-primary/50 rounded-3xl p-6 relative overflow-hidden group cursor-pointer transition-colors"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-colors"></div>
                            
                            <h3 className="text-xl font-bold text-white mb-2">{camp.name}</h3>
                            <p className="text-sm text-slate-400 mb-6 flex items-center gap-2">
                                <Calendar size={16} /> {camp.dates}
                            </p>

                            <div className="flex items-center justify-between border-t border-white/5 pt-4">
                                <div className="flex items-center gap-2 text-slate-300">
                                    <Users size={18} className="text-primary" />
                                    <span className="font-bold">{campRegs.length} hráčů</span>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary text-white transition-colors">
                                    <ChevronRight size={18} />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

function CampEvaluation({ campId, campName, onBack }: { campId: string, campName: string, onBack: () => void }) {
    const regs = useQuery(api.registrations.getByCamp, { campId });
    const evaluations = useQuery(api.evaluations.getByCamp, { campId });
    
    const [selectedChildId, setSelectedChildId] = useState<Id<"children"> | null>(null);

    if (regs === undefined || evaluations === undefined) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-primary w-10 h-10" />
            </div>
        );
    }

    const validRegs = regs.filter(r => r.status !== 'Zamítnutá' && r.childId);
    
    // Sort toggle
    const [sortBy, setSortBy] = useState<'name' | 'points'>('points');

    const sortedRegs = useMemo(() => {
        return [...validRegs].sort((a, b) => {
            if (sortBy === 'name') {
                return a.childName.localeCompare(b.childName);
            } else {
                const evalA = evaluations.find(e => e.childId === a.childId);
                const evalB = evaluations.find(e => e.childId === b.childId);
                const totalA = evalA ? (evalA.pointsBehavior + evalA.pointsFriends + evalA.pointsCompetitions) : -1;
                const totalB = evalB ? (evalB.pointsBehavior + evalB.pointsFriends + evalB.pointsCompetitions) : -1;
                return totalB - totalA; // Descending
            }
        });
    }, [validRegs, evaluations, sortBy]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <button onClick={onBack} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition-colors">
                        <ChevronLeft size={16} /> Zpět na výběr kempu
                    </button>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight transition-colors">{campName}</h2>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Seznam hráčů (Leaderboard) */}
                <div className="lg:col-span-1 bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden flex flex-col h-[600px] shadow-sm dark:shadow-none transition-colors">
                    <div className="p-6 border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] flex items-center justify-between transition-colors">
                        <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider transition-colors">Žebříček ({validRegs.length})</h3>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setSortBy('points')} 
                                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${sortBy === 'points' ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-white/20'}`}
                            >
                                Body
                            </button>
                            <button 
                                onClick={() => setSortBy('name')} 
                                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${sortBy === 'name' ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-white/20'}`}
                            >
                                A-Z
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {sortedRegs.map((reg, index) => {
                            const hasEval = evaluations.find(e => e.childId === reg.childId);
                            const totalPoints = hasEval ? (hasEval.pointsBehavior + hasEval.pointsFriends + hasEval.pointsCompetitions) : 0;
                            const isSelected = selectedChildId === reg.childId;
                            
                            return (
                                <button
                                    key={reg._id}
                                    onClick={() => setSelectedChildId(reg.childId as Id<"children">)}
                                    className={`w-full text-left p-4 rounded-2xl flex items-center justify-between transition-all ${
                                        isSelected ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border ${isSelected ? 'bg-white/20 border-white/30' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-white/10'}`}>
                                            {sortBy === 'points' && hasEval ? `#${index + 1}` : reg.childName.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold">{reg.childName}</div>
                                            {hasEval && <div className={`text-xs ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>{totalPoints} bodů</div>}
                                        </div>
                                    </div>
                                    {hasEval && (
                                        <CheckCircle2 size={18} className={isSelected ? 'text-white' : 'text-green-500 dark:text-green-400'} />
                                    )}
                                </button>
                            );
                        })}
                        {validRegs.length === 0 && (
                            <div className="text-center p-6 text-slate-500">
                                Žádní hráči v tomto kempu (nebo chybí profil dítěte u přihlášek).
                            </div>
                        )}
                    </div>
                </div>

                {/* Formulář hodnocení */}
                <div className="lg:col-span-2">
                    {selectedChildId ? (
                        <EvaluationForm 
                            campId={campId} 
                            childId={selectedChildId} 
                            existingEval={evaluations.find(e => e.childId === selectedChildId)}
                            reg={validRegs.find(r => r.childId === selectedChildId)}
                        />
                    ) : (
                        <div className="bg-[#111827] border-2 border-dashed border-white/5 rounded-3xl h-full min-h-[400px] flex flex-col items-center justify-center text-slate-500 p-8 text-center">
                            <Star size={48} className="mb-4 opacity-20" />
                            <p className="font-medium text-lg">Vyberte hráče ze seznamu pro zobrazení a úpravu hodnocení.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function EvaluationForm({ campId, childId, existingEval, reg }: { campId: string, childId: Id<"children">, existingEval: any, reg: any }) {
    const addEval = useMutation(api.evaluations.addEvaluation);
    const [isSaving, setIsSaving] = useState(false);
    
    const [formData, setFormData] = useState({
        pointsBehavior: existingEval?.pointsBehavior || 0,
        pointsFriends: existingEval?.pointsFriends || 0,
        pointsCompetitions: existingEval?.pointsCompetitions || 0,
        notes: existingEval?.notes || ''
    });

    // Update state if child changes
    useMemo(() => {
        setFormData({
            pointsBehavior: existingEval?.pointsBehavior || 0,
            pointsFriends: existingEval?.pointsFriends || 0,
            pointsCompetitions: existingEval?.pointsCompetitions || 0,
            notes: existingEval?.notes || ''
        });
    }, [existingEval, childId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await addEval({
                childId,
                campId,
                ...formData
            });
            // Show success toast here if needed
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/5 rounded-3xl p-6 md:p-10 relative overflow-hidden shadow-sm dark:shadow-none transition-colors">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-orange-500"></div>
            
            <div className="mb-8">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 transition-colors">{reg?.childName}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400 transition-colors">
                    <span className="flex items-center gap-1"><Calendar size={14} /> {reg?.childBirthDate}</span>
                    <span className="flex items-center gap-1"><Shirt size={14} /> {reg?.tshirtSize}</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {/* Chování */}
                    <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/5 text-center transition-colors">
                        <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-4 transition-colors">Chování</label>
                        <input 
                            type="number" 
                            min="0" 
                            max="100"
                            value={formData.pointsBehavior}
                            onChange={e => setFormData({...formData, pointsBehavior: parseInt(e.target.value) || 0})}
                            className="w-full text-center bg-white dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-xl py-4 text-3xl font-black text-primary focus:outline-none focus:border-primary transition-colors"
                        />
                        <div className="text-xs text-slate-500 mt-2">bodů (extra)</div>
                    </div>

                    {/* Kamarádi */}
                    <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/5 text-center transition-colors">
                        <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-4 transition-colors">Kamarádi</label>
                        <input 
                            type="number" 
                            min="0" 
                            max="100"
                            value={formData.pointsFriends}
                            onChange={e => setFormData({...formData, pointsFriends: parseInt(e.target.value) || 0})}
                            className="w-full text-center bg-white dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-xl py-4 text-3xl font-black text-blue-500 dark:text-blue-400 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                        <div className="text-xs text-slate-500 mt-2">bodů (extra)</div>
                    </div>

                    {/* Soutěže */}
                    <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/5 text-center transition-colors">
                        <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-4 transition-colors">Soutěže</label>
                        <input 
                            type="number" 
                            min="0" 
                            max="100"
                            value={formData.pointsCompetitions}
                            onChange={e => setFormData({...formData, pointsCompetitions: parseInt(e.target.value) || 0})}
                            className="w-full text-center bg-white dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-xl py-4 text-3xl font-black text-green-500 dark:text-green-400 focus:outline-none focus:border-green-500 transition-colors"
                        />
                        <div className="text-xs text-slate-500 mt-2">bodů (extra)</div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2 transition-colors">Slovní hodnocení (volitelné)</label>
                    <textarea 
                        value={formData.notes}
                        onChange={e => setFormData({...formData, notes: e.target.value})}
                        className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 focus:bg-slate-50 dark:focus:bg-white/10 focus:border-primary outline-none transition-all text-slate-900 dark:text-white min-h-[120px]"
                        placeholder="Napište krátké slovní zhodnocení hráče..."
                    />
                </div>

                <div className="flex justify-end">
                    <button 
                        type="submit" 
                        disabled={isSaving}
                        className="px-8 py-4 bg-primary hover:bg-orange-500 text-white font-black rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                        Uložit hodnocení
                    </button>
                </div>
            </form>
        </div>
    );
}
