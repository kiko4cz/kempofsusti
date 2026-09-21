'use client';

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Users, FileText, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PortalDashboard() {
    const me = useQuery(api.user.getMe);
    const myChildren = useQuery(api.children.getMyChildren);
    const myRegistrations = useQuery(api.registrations.getMyRegistrations);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight transition-colors">Přehled</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium transition-colors">Vítejte ve svém klientském portálu, {me?.email || 'rodiči'}.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Děti karta */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/5 rounded-3xl p-6 relative overflow-hidden group hover:border-primary/50 dark:hover:border-primary/50 transition-colors shadow-sm dark:shadow-none"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-colors"></div>
                    
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                            <Users size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white transition-colors">Moje děti</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors">Spravujte profily svých dětí</p>
                        </div>
                    </div>

                    <div className="text-3xl font-black text-slate-900 dark:text-white mb-6 transition-colors">
                        {myChildren === undefined ? '...' : myChildren.length}
                    </div>

                    <Link href="/portal/children" className="inline-flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                        Zobrazit detaily <ArrowRight size={16} />
                    </Link>
                </motion.div>

                {/* Přihlášky karta */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/5 rounded-3xl p-6 relative overflow-hidden group hover:border-blue-500/50 transition-colors shadow-sm dark:shadow-none"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/20 transition-colors"></div>
                    
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-500 flex items-center justify-center">
                            <FileText size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white transition-colors">Moje přihlášky</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors">Sledujte stav svých přihlášek</p>
                        </div>
                    </div>

                    <div className="text-3xl font-black text-slate-900 dark:text-white mb-6 transition-colors">
                        {myRegistrations === undefined ? '...' : myRegistrations.length}
                    </div>

                    <Link href="/portal/registrations" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-500 font-bold text-sm uppercase tracking-wider hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                        Zobrazit historii <ArrowRight size={16} />
                    </Link>
                </motion.div>
            </div>

            {/* Rychlé akce */}
            <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/5 rounded-3xl p-6 md:p-8 transition-colors shadow-sm dark:shadow-none">
                <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-wider transition-colors">Rychlé akce</h2>
                <div className="flex flex-wrap gap-4">
                    <Link href="/#camps" className="px-6 py-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white font-bold rounded-xl transition-colors inline-flex items-center gap-2 border border-slate-200 dark:border-white/10">
                        <Calendar size={18} />
                        Nová přihláška na kemp
                    </Link>
                    <Link href="/portal/children" className="px-6 py-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white font-bold rounded-xl transition-colors inline-flex items-center gap-2 border border-slate-200 dark:border-white/10">
                        <Users size={18} />
                        Přidat profil dítěte
                    </Link>
                </div>
            </div>
        </div>
    );
}
