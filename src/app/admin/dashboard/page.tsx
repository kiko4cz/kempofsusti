'use client';

import Link from 'next/link';
import { Users, Calendar, TrendingUp, AlertCircle, ArrowRight, DollarSign, Newspaper, Image as ImageIcon, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { toast } from 'sonner';
import { useState } from 'react';

// Defined types to match localStorage data structures
interface TurnusStats {
    id: string;
    turnusId: number;
    boys: number;
    girls: number;
    price: number;
    expenses: number;
}

interface YearStats {
    year: number;
    turnuses: TurnusStats[];
}

interface CampTerm {
    id: number;
    status: string;
}

export default function AdminDashboard() {
    const statsData = useQuery(api.stats.getStats);
    const campsData = useQuery(api.camps.getCamps);
    const backfill = useMutation(api.migrate.backfill);
    const [isBackfilling, setIsBackfilling] = useState(false);

    const handleBackfill = async () => {
        setIsBackfilling(true);
        try {
            await backfill();
            toast.success('Výchozí data byla úspěšně nahrána!');
        } catch (error) {
            toast.error('Chyba při nahrávání dat');
        } finally {
            setIsBackfilling(false);
        }
    };

    if (statsData === undefined || campsData === undefined) {
        return (
            <div className="flex flex-col items-center justify-center py-40 space-y-4">
                <Loader2 size={48} className="text-primary animate-spin" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Načítám cloudová data...</p>
            </div>
        );
    }

    const currentYear = new Date().getFullYear();
    const currentYearStats = statsData.find((y: any) => y.year === currentYear);

    let totalKids = 0;
    let totalRevenue = 0;
    let totalProfit = 0;

    if (currentYearStats) {
        currentYearStats.turnuses.forEach((t: any) => {
            const kids = Number(t.boys) + Number(t.girls);
            const revenue = kids * Number(t.price);
            const expenses = Number(t.expenses);

            totalKids += kids;
            totalRevenue += revenue;
            totalProfit += (revenue - expenses);
        });
    }

    const alerts = campsData
        .filter((camp: any) => camp.status === 'Poslední místa' || camp.status === 'Obsazeno')
        .map((camp: any) => ({
            id: camp._id,
            message: camp.status === 'Poslední místa' 
                ? `Kemp ${camp.location} (${camp.dates}) má poslední volná místa!` 
                : `Kemp ${camp.location} (${camp.dates}) je plně obsazen.`,
            type: camp.status === 'Poslední místa' ? 'warning' : 'info'
        }));

    const dashboardStats = [
        { name: 'Přihlášených dětí', value: totalKids.toString(), change: 'Celkem', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { name: 'Celkový zisk', value: `${totalProfit.toLocaleString()} Kč`, change: 'Tento rok', icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-500/10' },
        { name: 'Celkové příjmy', value: `${totalRevenue.toLocaleString()} Kč`, change: 'Tento rok', icon: DollarSign, color: 'text-primary', bg: 'bg-primary/10' },
        { name: 'Počet turnusů', value: campsData.length.toString(), change: 'Aktivní', icon: Calendar, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    ];

    return (
        <div className="space-y-12 pb-24">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-3 tracking-tight">
                        Vítejte zpět, <span className="text-primary">Admine!</span>
                    </h1>
                    <p className="text-slate-500 text-lg font-medium">Zde je přehled aktivit vašich kempů pro rok {new Date().getFullYear()}.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-5 py-3 bg-white/50 border border-slate-200 rounded-2xl flex items-center gap-3 backdrop-blur-md">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-sm font-bold text-slate-600">Systém online</span>
                    </div>
                </div>
            </motion.div>

            {/* Backfill Banner - visible if no camps or stats */}
            {(campsData?.length === 0 || statsData?.length === 0) && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 rounded-[2.5rem] bg-amber-50 border-2 border-amber-200 border-dashed flex flex-col md:flex-row items-center justify-between gap-6 mt-8"
                >
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 shrink-0">
                            <AlertCircle size={32} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-black text-amber-900 uppercase tracking-tight">Databáze je prázdná</h3>
                            <p className="text-amber-700/70 font-medium">Našli jsme výchozí data z webu. Chcete je nahrát do cloudu?</p>
                        </div>
                    </div>
                    <button
                        onClick={handleBackfill}
                        disabled={isBackfilling}
                        className="px-10 py-5 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-2xl shadow-xl shadow-amber-500/20 transition-all flex items-center gap-3 transform active:scale-95 uppercase tracking-widest text-xs disabled:opacity-50"
                    >
                        {isBackfilling ? <Loader2 size={20} className="animate-spin" /> : <TrendingUp size={20} />}
                        Nahrát výchozí data
                    </button>
                </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {dashboardStats.map((stat, index) => (
                    <motion.div
                        key={stat.name}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                        className="premium-card group p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] relative overflow-hidden"
                    >
                        {/* Glow effect on hover */}
                        <div className={`absolute -inset-1 bg-gradient-to-r ${stat.color.includes('blue') ? 'from-blue-600/20 to-cyan-400/20' : stat.color.includes('green') ? 'from-green-600/20 to-emerald-400/20' : stat.color.includes('primary') ? 'from-primary/20 to-orange-400/20' : 'from-orange-600/20 to-yellow-400/20'} rounded-[2.6rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                        
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} ring-1 ring-black/5 shadow-sm transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                                    <stat.icon size={28} />
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${stat.change.includes('+') ? 'bg-green-500/10 text-green-600' : 'bg-slate-100 text-slate-500'} border border-slate-200`}>
                                    {stat.change}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter group-hover:text-primary transition-colors duration-300">{stat.value}</h3>
                                <p className="text-slate-500 text-sm font-bold uppercase tracking-wide">{stat.name}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Main Section */}
                <div className="lg:col-span-8 space-y-10">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <AlertCircle className="text-primary" size={18} />
                            </div>
                            Upozornění a Akce
                        </h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent ml-6"></div>
                    </div>

                    <div className="space-y-4">
                        {alerts.length > 0 ? (
                            alerts.map((alert, idx) => (
                                <motion.div 
                                    key={idx} 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + idx * 0.1 }}
                                    className={`p-5 md:p-6 rounded-2xl md:rounded-[2rem] border backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8 group hover:scale-[1.01] transition-transform duration-300 ${alert.type === 'warning'
                                        ? 'bg-orange-500/5 border-orange-500/20 text-orange-100'
                                        : 'bg-blue-500/5 border-blue-500/20 text-blue-100'
                                    }`}
                                >
                                    <div className="flex items-center gap-5">
                                        <div className={`w-3 h-3 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.1)] ${alert.type === 'warning' ? 'bg-orange-500 shadow-orange-500/50' : 'bg-blue-500 shadow-blue-500/50'} animate-pulse`} />
                                        <span className="font-semibold text-slate-800">{alert.message}</span>
                                    </div>
                                    <Link href="/admin/camps" className="px-6 py-2.5 bg-white/50 hover:bg-white rounded-xl text-xs font-black uppercase tracking-widest transition-all border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900">
                                        Spravovat
                                    </Link>
                                </motion.div>
                            ))
                        ) : (
                            <div className="p-12 rounded-[2rem] border border-slate-200 bg-white/40 text-slate-400 text-center font-medium italic backdrop-blur-sm">
                                Všechny systémy jsou v normálu. Žádná nová upozornění.
                            </div>
                        )}
                    </div>

                    <div className="bg-white/40 border border-slate-200 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 backdrop-blur-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                        <h3 className="text-xl font-black text-slate-900 mb-8 relative z-10 flex items-center gap-3">
                            Rychlé ovládací centrum
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
                            <Link href="/admin/camps" className="p-6 bg-white/50 hover:bg-primary/5 border border-slate-200 hover:border-primary/30 rounded-[2rem] text-center transition-all duration-500 group">
                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                    <Calendar className="text-primary" size={28} />
                                </div>
                                <span className="text-sm font-bold text-slate-500 group-hover:text-primary transition-colors">Turnusy</span>
                            </Link>
                            <Link href="/admin/news" className="p-6 bg-white/50 hover:bg-blue-500/5 border border-slate-200 hover:border-blue-500/30 rounded-[2rem] text-center transition-all duration-500 group">
                                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                                    <Newspaper className="text-blue-500" size={28} />
                                </div>
                                <span className="text-sm font-bold text-slate-500 group-hover:text-blue-600 transition-colors">Novinky</span>
                            </Link>
                            <Link href="/admin/gallery" className="p-6 bg-white/50 hover:bg-green-500/5 border border-slate-200 hover:border-green-500/30 rounded-[2rem] text-center transition-all duration-500 group">
                                <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                    <ImageIcon className="text-green-500" size={28} />
                                </div>
                                <span className="text-sm font-bold text-slate-500 group-hover:text-green-600 transition-colors">Galarie</span>
                            </Link>
                            <Link href="/" target="_blank" className="p-6 bg-white/50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-[2rem] text-center transition-all duration-500 group">
                                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500">
                                    <ArrowRight className="text-slate-400 group-hover:text-slate-900" size={28} />
                                </div>
                                <span className="text-sm font-bold text-slate-500 group-hover:text-slate-900 transition-colors">Přejít na web</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Sidebar Section */}
                <div className="lg:col-span-4 space-y-10">
                    <div className="flex items-center gap-3 px-2">
                        <h2 className="text-2xl font-black text-slate-900">Aktivita</h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent ml-4"></div>
                    </div>
                    
                    <div className="bg-white/40 border border-slate-200 rounded-[3rem] p-10 backdrop-blur-xl h-full min-h-[400px]">
                        <div className="flex flex-col items-center justify-center h-full space-y-6 opacity-40">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 animate-pulse-slow">
                                <TrendingUp size={32} className="text-slate-400" />
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-bold text-slate-900 mb-2">Zatím žádná data</p>
                                <p className="text-sm text-slate-500 max-w-[200px] mx-auto">Poslední aktivita se zobrazí zde, jakmile systém zaznamená první interakce.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
