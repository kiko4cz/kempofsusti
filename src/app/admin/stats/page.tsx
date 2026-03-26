'use client';

import { useState, useEffect } from 'react';
import { BarChart, PieChart, TrendingUp, DollarSign, Users, ChevronDown, ChevronLeft, ChevronRight, Save, Plus, Trash2, Calendar, Target, Activity, FileText, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { toast } from 'sonner';

export default function AdminStats() {
    const stats: any = useQuery(api.stats.getStats);
    const updateYearStats = useMutation(api.stats.updateYearStats);
    const deleteYear = useMutation(api.stats.deleteYear);

    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Get current year data from the query result
    const currentYearData = stats?.find((y: any) => y.year === selectedYear);
    
    // Derived values
    const totalKids = currentYearData?.turnuses.reduce((acc: number, t: any) => acc + Number(t.boys) + Number(t.girls), 0) || 0;
    const totalBoys = currentYearData?.turnuses.reduce((acc: number, t: any) => acc + Number(t.boys), 0) || 0;
    const totalGirls = currentYearData?.turnuses.reduce((acc: number, t: any) => acc + Number(t.girls), 0) || 0;

    const totalRevenue = currentYearData?.turnuses.reduce((acc: number, t: any) => acc + ((Number(t.boys) + Number(t.girls)) * Number(t.price)), 0) || 0;
    const totalExpenses = currentYearData?.turnuses.reduce((acc: number, t: any) => acc + Number(t.expenses), 0) || 0;
    const totalProfit = totalRevenue - totalExpenses;

    const handleStatChange = async (turnusId: string, field: string, value: string | number) => {
        if (!currentYearData) return;
        
        const updatedTurnuses = currentYearData.turnuses.map((t: any) => {
            if (t.id === turnusId) {
                return { ...t, [field]: value };
            }
            return t;
        });

        // We save immediately on change for better UX in this specific table
        try {
            await updateYearStats({
                year: selectedYear,
                turnuses: updatedTurnuses
            });
        } catch (error) {
            toast.error('Chyba při ukládání');
        }
    };

    const addTurnus = async () => {
        const turnuses = currentYearData?.turnuses || [];
        const nextId = turnuses.length + 1;
        const newTurnus = {
            id: Date.now().toString(),
            turnusId: nextId,
            name: `${nextId}. Turnus`,
            boys: 0,
            girls: 0,
            price: 3500,
            expenses: 0,
            note: ''
        };

        try {
            await updateYearStats({
                year: selectedYear,
                turnuses: [...turnuses, newTurnus]
            });
            toast.success('Turnus přidán');
        } catch (error) {
            toast.error('Chyba při přidávání');
        }
    };

    const handleDeleteTurnus = async (id: string) => {
        if (!confirm('Opravdu smazat tento turnus?')) return;
        if (!currentYearData) return;

        const updatedTurnuses = currentYearData.turnuses.filter((t: any) => t.id !== id);
        try {
            await updateYearStats({
                year: selectedYear,
                turnuses: updatedTurnuses
            });
            toast.success('Turnus smazán');
        } catch (error) {
            toast.error('Chyba při mazání');
        }
    };

    const addNewYear = async () => {
        const years = stats?.map((y: any) => y.year) || [];
        const nextYear = years.length > 0 ? Math.max(...years) + 1 : new Date().getFullYear();
        
        try {
            await updateYearStats({
                year: nextYear,
                turnuses: []
            });
            setSelectedYear(nextYear);
            toast.success(`Ročník ${nextYear} vytvořen`);
        } catch (error) {
            toast.error('Chyba při vytváření ročníku');
        }
    };

    const handleDeleteYear = async (year: number) => {
        if (!confirm(`Opravdu smazat celý ročník ${year}? Tato akce je nevratná!`)) return;
        try {
            await deleteYear({ year });
            const remainingYears = stats?.filter((y: any) => y.year !== year);
            if (remainingYears && remainingYears.length > 0) {
                setSelectedYear(remainingYears[0].year);
            }
            toast.success(`Ročník ${year} smazán`);
        } catch (error) {
            toast.error('Chyba při mazání ročníku');
        }
    };

    if (stats === undefined) return (
        <div className="flex flex-col items-center justify-center py-40 space-y-4">
            <Loader2 size={48} className="text-primary animate-spin" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Načítám statistiky z cloudu...</p>
        </div>
    );

    return (
        <div className="space-y-8 md:space-y-12 pb-24 max-w-7xl mx-auto px-4 md:px-0">
            {/* Header section with Year Selection */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-end justify-between gap-6"
            >
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-2">
                        <Activity size={12} /> Live Dashboard Cloud
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none">
                        Statistiky <span className="text-primary italic">&</span> Finance
                    </h1>
                    <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl leading-relaxed tracking-tight">
                        Kompletní přehled o obsazenosti a hospodaření v reálném čase.
                    </p>
                </div>

                <div className="relative group self-start md:self-auto">
                    <button
                        onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                        className="flex items-center gap-4 bg-white border-2 border-slate-100 hover:border-primary px-8 py-5 rounded-[2rem] text-slate-900 font-black text-2xl justify-between shadow-xl shadow-slate-200/50 transition-all active:scale-95 group-hover:shadow-primary/10 min-w-[200px]"
                    >
                        <Calendar size={24} className="text-primary" />
                        {selectedYear}
                        <ChevronDown size={24} className={`transition-transform duration-500 text-slate-300 ${isYearDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {isYearDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 top-full mt-4 bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl p-4 z-50 min-w-[220px]"
                            >
                                {stats.map((y: any) => (
                                    <div key={y.year} className="flex items-center gap-2 mb-1 last:mb-0">
                                        <button
                                            onClick={() => {
                                                setSelectedYear(y.year);
                                                setIsYearDropdownOpen(false);
                                            }}
                                            className={`flex-1 text-left px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${selectedYear === y.year ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'}`}
                                        >
                                            {y.year}
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteYear(y.year)}
                                            className="p-3 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                                <div className="h-px bg-slate-50 my-4 mx-2"></div>
                                <button
                                    onClick={addNewYear}
                                    className="w-full text-left px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest text-primary hover:bg-primary/5 flex items-center gap-3 transition-colors"
                                >
                                    <Plus size={18} /> Nový ročník
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Global Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                <SummaryCard 
                    title="Celkem Účastníků" 
                    value={totalKids} 
                    icon={<Users size={24} />} 
                    color="blue"
                    subText={`${totalBoys} kluci / ${totalGirls} holky`}
                    delay={0.1}
                />
                <SummaryCard 
                    title="Očekávané Příjmy" 
                    value={`${totalRevenue.toLocaleString()} Kč`} 
                    icon={<DollarSign size={24} />} 
                    color="green"
                    subText="Hrubý obrat turnusů"
                    delay={0.2}
                />
                <SummaryCard 
                    title="Celkové Náklady" 
                    value={`${totalExpenses.toLocaleString()} Kč`} 
                    icon={<TrendingUp size={24} className="rotate-180" />} 
                    color="red"
                    subText="Provozní výdaje kempu"
                    delay={0.3}
                />
                <SummaryCard 
                    title="Čistý Zisk" 
                    value={`${totalProfit.toLocaleString()} Kč`} 
                    icon={<BarChart size={24} />} 
                    color="primary"
                    subText="Finální hospodaření"
                    delay={0.4}
                    isHighlight
                />
            </div>

            {/* Turnus Detail Table / Cards */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.5 }} 
                className="premium-card rounded-[3rem] overflow-hidden"
            >
                <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/30">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-primary border border-slate-100 shadow-sm">
                            <Activity size={28} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Detailní Rozpis</h3>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Jednotlivé turnusy pro rok {selectedYear}</p>
                        </div>
                    </div>
                    <button
                        onClick={addTurnus}
                        className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 font-black rounded-2xl transition-all flex items-center justify-center gap-3 border-2 border-slate-100 shadow-sm active:scale-95 uppercase tracking-widest text-xs"
                    >
                        <Plus size={20} className="text-primary" /> Přidat nový turnus
                    </button>
                </div>

                <div className="overflow-x-auto hidden md:block">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-500">
                                <th className="px-6 py-5 font-black uppercase tracking-widest text-[10px] border-b border-slate-100 w-16">ID</th>
                                <th className="px-6 py-5 font-black uppercase tracking-widest text-[10px] border-b border-slate-100 min-w-[200px]">Název Turnusu</th>
                                <th className="px-3 py-5 font-black uppercase tracking-widest text-[10px] border-b border-slate-100 w-32 text-center bg-blue-50/30">Kluci</th>
                                <th className="px-3 py-5 font-black uppercase tracking-widest text-[10px] border-b border-slate-100 w-32 text-center bg-pink-50/30">Holky</th>
                                <th className="px-6 py-5 font-black uppercase tracking-widest text-[10px] border-b border-slate-100 w-52 text-right">Cena / OS</th>
                                <th className="px-6 py-5 font-black uppercase tracking-widest text-[10px] border-b border-slate-100 w-52 text-right">Výdaje</th>
                                <th className="px-6 py-5 font-black uppercase tracking-widest text-[10px] border-b border-slate-100">Interní Poznámka</th>
                                <th className="px-6 py-5 font-black uppercase tracking-widest text-[10px] border-b border-slate-100 w-20 text-center">Akce</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {currentYearData?.turnuses.map((turnus: any) => (
                                <tr key={turnus.id} className="hover:bg-slate-50/40 transition-all group border-b border-slate-50 last:border-0">
                                    <td className="px-6 py-4 text-slate-300 font-black font-mono text-[10px] italic">#{turnus.turnusId}</td>
                                    <td className="px-6 py-4">
                                        <input
                                            type="text"
                                            value={turnus.name}
                                            onChange={(e) => handleStatChange(turnus.id, 'name', e.target.value)}
                                            className="bg-transparent text-slate-900 font-bold tracking-tight focus:outline-none focus:text-primary w-full transition-all text-lg py-1 border-b border-transparent focus:border-primary/20"
                                            placeholder="Název..."
                                        />
                                    </td>
                                    <td className="px-3 py-4 bg-blue-50/5">
                                        <input
                                            type="number"
                                            value={turnus.boys}
                                            onChange={(e) => handleStatChange(turnus.id, 'boys', parseInt(e.target.value) || 0)}
                                            className="bg-white/50 border border-slate-100 rounded-xl px-1 py-2.5 text-slate-900 font-black w-full text-center focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 focus:outline-none transition-all hover:bg-white"
                                        />
                                    </td>
                                    <td className="px-3 py-4 bg-pink-50/5">
                                        <input
                                            type="number"
                                            value={turnus.girls}
                                            onChange={(e) => handleStatChange(turnus.id, 'girls', parseInt(e.target.value) || 0)}
                                            className="bg-white/50 border border-slate-100 rounded-xl px-1 py-2.5 text-slate-900 font-black w-full text-center focus:border-pink-500 focus:ring-4 focus:ring-pink-500/5 focus:outline-none transition-all hover:bg-white"
                                        />
                                    </td>
                                    <td className="px-6 py-4 text-right w-52">
                                        <div className="flex items-center gap-2 bg-white/50 border border-slate-100 rounded-xl px-4 py-2.5 group-focus-within/price:border-primary group-focus-within/price:ring-4 group-focus-within/price:ring-primary/5 transition-all hover:bg-white group/price h-11">
                                            <input
                                                type="number"
                                                value={turnus.price}
                                                onChange={(e) => handleStatChange(turnus.id, 'price', parseInt(e.target.value) || 0)}
                                                className="flex-1 bg-transparent text-slate-900 font-black text-right focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none min-w-0"
                                            />
                                            <span className="text-[10px] font-black text-slate-300 group-focus-within/price:text-primary transition-colors shrink-0">KČ</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right w-52">
                                        <div className="flex items-center gap-2 bg-white/50 border border-slate-100 rounded-xl px-4 py-2.5 group-focus-within/expenses:border-red-500 group-focus-within/expenses:ring-4 group-focus-within/expenses:ring-red-500/5 transition-all hover:bg-white group/expenses h-11">
                                            <input
                                                type="number"
                                                value={turnus.expenses}
                                                onChange={(e) => handleStatChange(turnus.id, 'expenses', parseInt(e.target.value) || 0)}
                                                className="flex-1 bg-transparent text-slate-900 font-black text-right focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none min-w-0"
                                            />
                                            <span className="text-[10px] font-black text-slate-300 group-focus-within/expenses:text-primary transition-colors shrink-0">KČ</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-400">
                                        <input
                                            type="text"
                                            value={turnus.note}
                                            onChange={(e) => handleStatChange(turnus.id, 'note', e.target.value)}
                                            className="bg-transparent text-slate-400 font-medium italic focus:outline-none focus:text-slate-900 w-full transition-all py-1 placeholder:text-slate-200"
                                            placeholder="Poznámka..."
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center">
                                            <button
                                                onClick={() => handleDeleteTurnus(turnus.id)}
                                                className="p-3 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-95 transform hover:-rotate-12 group-hover:text-slate-300"
                                                title="Smazat záznam"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card List */}
                <div className="md:hidden p-4 space-y-6">
                    {currentYearData?.turnuses.map((turnus: any) => (
                        <div key={turnus.id} className="bg-slate-50/50 border border-slate-100 rounded-[2.5rem] p-6 space-y-6 relative overflow-hidden group">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-primary font-black font-mono">#{turnus.turnusId}</span>
                                    <input
                                        type="text"
                                        value={turnus.name}
                                        onChange={(e) => handleStatChange(turnus.id, 'name', e.target.value)}
                                        className="bg-transparent text-slate-900 font-black tracking-tight focus:outline-none focus:border-b-2 border-primary/30 text-xl py-1 w-full"
                                        placeholder="Název..."
                                    />
                                </div>
                                <button
                                    onClick={() => handleDeleteTurnus(turnus.id)}
                                    className="p-3 text-red-500 bg-white shadow-sm border border-slate-100 rounded-xl active:scale-95"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest ml-1">Kluci</label>
                                    <input
                                        type="number"
                                        value={turnus.boys}
                                        onChange={(e) => handleStatChange(turnus.id, 'boys', parseInt(e.target.value) || 0)}
                                        className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-4 text-slate-900 font-black text-center"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-pink-500 uppercase tracking-widest ml-1">Holky</label>
                                    <input
                                        type="number"
                                        value={turnus.girls}
                                        onChange={(e) => handleStatChange(turnus.id, 'girls', parseInt(e.target.value) || 0)}
                                        className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-4 text-slate-900 font-black text-center"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cena za osobu</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={turnus.price}
                                            onChange={(e) => handleStatChange(turnus.id, 'price', parseInt(e.target.value) || 0)}
                                            className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-black text-right pr-14"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">KČ</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Provozní výdaje</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={turnus.expenses}
                                            onChange={(e) => handleStatChange(turnus.id, 'expenses', parseInt(e.target.value) || 0)}
                                            className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-black text-right pr-14"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">KČ</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 border-t border-slate-100 pt-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <FileText size={10} /> Poznámka
                                </label>
                                <input
                                    type="text"
                                    value={turnus.note}
                                    onChange={(e) => handleStatChange(turnus.id, 'note', e.target.value)}
                                    className="w-full bg-transparent text-slate-500 font-medium italic focus:outline-none"
                                    placeholder="Libovolný text..."
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {(!currentYearData || currentYearData.turnuses.length === 0) && (
                    <div className="p-20 text-center">
                        <Activity size={48} className="mx-auto text-slate-100 mb-4" />
                        <p className="text-slate-400 font-medium">Zatím žádné záznamy pro tento rok.</p>
                    </div>
                )}
                
                <div className="p-6 md:p-8 border-t border-slate-100 bg-slate-50/50 flex items-center justify-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)] animate-pulse" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] text-center">
                        Synchronizace s cloudem aktivní
                    </span>
                </div>
            </motion.div>
        </div>
    );
}

function SummaryCard({ title, value, icon, color, subText, delay, isHighlight = false }: any) {
    const colors: any = {
        blue: {
            bg: 'bg-blue-50/50',
            icon: 'bg-blue-500/10 text-blue-600 border-blue-200/50',
            badge: 'bg-blue-500/10 text-blue-600 border-blue-200/50',
            glow: 'rgba(59, 130, 246, 0.03)'
        },
        green: {
            bg: 'bg-green-50/50',
            icon: 'bg-green-500/10 text-green-600 border-green-200/50',
            badge: 'bg-green-500/10 text-green-600 border-green-200/50',
            glow: 'rgba(34, 197, 94, 0.03)'
        },
        red: {
            bg: 'bg-red-50/50',
            icon: 'bg-red-500/10 text-red-600 border-red-200/50',
            badge: 'bg-red-500/10 text-red-600 border-red-200/50',
            glow: 'rgba(239, 68, 68, 0.03)'
        },
        primary: {
            bg: 'bg-primary/5',
            icon: 'bg-primary/10 text-primary border-primary/20',
            badge: 'bg-primary text-white border-primary shadow-sm shadow-primary/20',
            glow: 'rgba(220, 38, 38, 0.05)'
        }
    };

    const theme = colors[color] || colors.primary;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay, duration: 0.8 }} 
            className={`premium-card p-10 group hover:-translate-y-2 transition-all duration-500 relative overflow-hidden flex flex-col justify-between min-h-[320px] ${isHighlight ? 'ring-2 ring-primary/20' : ''}`}
        >
            {/* Background Accent/Glow */}
            <div 
                className="absolute -right-10 -top-10 w-48 h-48 rounded-full blur-[80px] transition-all duration-700 opacity-50 group-hover:opacity-100 group-hover:scale-125 pointer-events-none"
                style={{ backgroundColor: theme.glow }}
            />
            
            {/* Top Bar: Icon and Badge */}
            <div className="flex items-start justify-between relative z-10 mb-auto">
                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center border-2 shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 bg-white ${theme.icon}`}>
                    {icon}
                </div>
                
                <div className={`px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-500 shadow-sm ${theme.badge}`}>
                    {isHighlight ? 'Čistý' : (title.split(' ')[1] || title.split(' ')[0])}
                </div>
            </div>

            {/* Content Section */}
            <div className="relative z-10 mt-8">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3 group-hover:text-slate-500 transition-colors">
                    {title}
                </p>
                <div className={`text-4xl lg:text-5xl font-black tracking-[-0.04em] mb-4 leading-none transition-all duration-500 group-hover:tracking-normal ${isHighlight ? 'text-primary' : 'text-slate-900'}`}>
                    {value}
                </div>
                <div className="h-px w-12 bg-slate-100 mb-4 group-hover:w-full transition-all duration-700" />
                <p className={`text-[11px] font-bold tracking-wide transition-colors ${isHighlight ? 'text-primary/70' : 'text-slate-500/80'}`}>
                    {subText}
                </p>
            </div>

            {/* Decorative Corner Element */}
            <div className="absolute bottom-0 right-0 p-2 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none">
                <Activity size={80} className="text-slate-900 -mr-8 -mb-8 rotate-12" />
            </div>
        </motion.div>
    );
}
