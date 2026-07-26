'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, Filter, Mail, Phone, Calendar, Trash2, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../../../convex/_generated/dataModel";

export default function RegistrationsPage() {
    const registrations = useQuery(api.registrations.getRegistrations);
    const updateStatus = useMutation(api.registrations.updateStatus);
    const deleteRegistration = useMutation(api.registrations.deleteRegistration);
    const triggerEmail = useMutation(api.registrations.triggerEmail);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const handleUpdateStatus = async (id: Id<"registrations">, newStatus: string) => {
        try {
            await updateStatus({ id, status: newStatus });
            toast.success(`Stav změněn na: ${newStatus}`);
        } catch (error) {
            toast.error('Chyba při změně stavu');
        }
    };

    const handleTriggerEmail = async (id: Id<"registrations">) => {
        try {
            await triggerEmail({ id });
            toast.success('E-mail byl úspěšně zařazen do fronty k odeslání');
        } catch (error) {
            toast.error('Chyba při odesílání e-mailu');
        }
    };

    const handleDelete = async (id: Id<"registrations">) => {
        if (confirm('Opravdu chcete smazat tuto přihlášku?')) {
            try {
                await deleteRegistration({ id });
                toast.success('Přihláška smazána');
            } catch (error) {
                toast.error('Chyba při mazání');
            }
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Schválená': return <CheckCircle2 size={16} className="text-green-500" />;
            case 'Zamítnutá': return <XCircle size={16} className="text-red-500" />;
            default: return <Clock size={16} className="text-orange-500" />;
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Schválená': return 'bg-green-100 text-green-700 border-green-200';
            case 'Zamítnutá': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-orange-100 text-orange-700 border-orange-200';
        }
    };

    const filteredRegistrations = registrations?.filter(reg => {
        const matchesSearch = 
            reg.childName.toLowerCase().includes(searchTerm.toLowerCase()) || 
            reg.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.campName.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = filterStatus === 'all' || reg.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-8 md:space-y-12 pb-24 max-w-7xl mx-auto px-4 md:px-8 pt-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-2">
                        <FileText size={12} /> Seznam přihlášek
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none">
                        Přihlášky na kempy
                    </h1>
                    <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
                        Spravujte všechny došlé přihlášky, měňte jejich stavy a kontaktujte rodiče.
                    </p>
                </div>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.1 }}
                className="flex flex-col md:flex-row gap-4 mb-8"
            >
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Hledat podle jména dítěte, rodiče nebo kempu..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium"
                    />
                </div>
                <div className="relative md:w-64">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium appearance-none cursor-pointer"
                    >
                        <option value="all">Všechny stavy</option>
                        <option value="Nová">Nové (Ke zpracování)</option>
                        <option value="Schválená">Schválené</option>
                        <option value="Zamítnutá">Zamítnuté</option>
                    </select>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 gap-6">
                {!registrations ? (
                    <div className="text-center p-12 text-slate-500 font-medium">Načítám přihlášky...</div>
                ) : filteredRegistrations?.length === 0 ? (
                    <div className="text-center p-12 bg-white rounded-3xl border-2 border-slate-100 text-slate-500 font-medium flex flex-col items-center justify-center">
                        <FileText size={48} className="text-slate-300 mb-4" />
                        <p>Zatím zde nejsou žádné přihlášky.</p>
                    </div>
                ) : (
                    filteredRegistrations?.map((reg) => (
                        <motion.div 
                            key={reg._id}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-8 items-start lg:items-center relative overflow-hidden group"
                        >
                            {/* Decorative side bar matching status */}
                            <div className={`absolute left-0 top-0 bottom-0 w-2 ${
                                reg.status === 'Schválená' ? 'bg-green-500' :
                                reg.status === 'Zamítnutá' ? 'bg-red-500' :
                                'bg-orange-500'
                            }`} />

                            <div className="flex-1 space-y-4 w-full">
                                <div className="flex flex-wrap items-center gap-3">
                                    <h3 className="text-2xl font-black text-slate-900">{reg.childName}</h3>
                                    <span className="text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-lg text-sm flex items-center gap-2">
                                        Narození: {new Date(reg.childBirthDate).toLocaleDateString('cs-CZ')}
                                    </span>
                                    {reg.tshirtSize && (
                                        <span className="text-primary font-bold bg-primary/10 px-3 py-1 rounded-lg text-sm">
                                            Tričko: {reg.tshirtSize}
                                        </span>
                                    )}
                                    {reg.childClub && (
                                        <span className="text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-lg text-sm">
                                            Klub: {reg.childClub}
                                        </span>
                                    )}
                                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(reg.status)} ml-auto lg:ml-0`}>
                                        {getStatusIcon(reg.status)}
                                        {reg.status}
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2 text-primary font-bold bg-primary/5 w-fit px-4 py-2 rounded-xl">
                                    <Calendar size={18} />
                                    <span>{reg.campName} ({reg.campDates})</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 bg-slate-50 p-4 rounded-2xl">
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Zákonný zástupce</p>
                                        <p className="font-medium text-slate-900">{reg.parentName}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Mail size={16} className="text-slate-400" />
                                            <a href={`mailto:${reg.parentEmail}`} className="hover:text-primary transition-colors">{reg.parentEmail}</a>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Phone size={16} className="text-slate-400" />
                                            <a href={`tel:${reg.parentPhone}`} className="hover:text-primary transition-colors">{reg.parentPhone}</a>
                                        </div>
                                    </div>
                                </div>

                                {reg.healthInfo && (
                                    <div className="bg-red-50 text-red-900 p-4 rounded-2xl border border-red-100 mt-4 text-sm">
                                        <span className="font-bold block mb-1">Zdravotní stav / Alergie:</span>
                                        {reg.healthInfo}
                                    </div>
                                )}

                                {reg.notes && (
                                    <div className="bg-orange-50 text-orange-900 p-4 rounded-2xl border border-orange-100 mt-4 text-sm">
                                        <span className="font-bold block mb-1">Poznámka od rodiče:</span>
                                        {reg.notes}
                                    </div>
                                )}
                                
                                <div className="text-xs text-slate-400 font-medium mt-2">
                                    Přijato: {new Date(reg.createdAt).toLocaleString('cs-CZ')}
                                </div>
                            </div>

                            <div className="flex flex-row lg:flex-col gap-3 w-full lg:w-48 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-6">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest hidden lg:block mb-2">Akce se žádostí</p>
                                
                                {reg.status !== 'Schválená' && (
                                    <button 
                                        onClick={() => handleUpdateStatus(reg._id, 'Schválená')}
                                        className="flex-1 lg:flex-none flex items-center justify-center gap-2 py-3 px-4 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 font-bold rounded-xl transition-colors"
                                    >
                                        <CheckCircle2 size={18} />
                                        <span>Schválit</span>
                                    </button>
                                )}
                                
                                {reg.status !== 'Zamítnutá' && (
                                    <button 
                                        onClick={() => handleUpdateStatus(reg._id, 'Zamítnutá')}
                                        className="flex-1 lg:flex-none flex items-center justify-center gap-2 py-3 px-4 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 font-bold rounded-xl transition-colors"
                                    >
                                        <XCircle size={18} />
                                        <span>Zamítnout</span>
                                    </button>
                                )}

                                {reg.status === 'Schválená' || reg.status === 'Zamítnutá' ? (
                                    <button 
                                        onClick={() => handleTriggerEmail(reg._id)}
                                        className="flex-none flex items-center justify-center gap-2 py-3 px-4 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 font-bold rounded-xl transition-colors mt-auto"
                                        title="Znovu odeslat informační e-mail"
                                    >
                                        <Mail size={18} />
                                        <span className="lg:hidden">Poslat e-mail</span>
                                    </button>
                                ) : null}

                                <button 
                                    onClick={() => handleDelete(reg._id)}
                                    className="flex-none flex items-center justify-center gap-2 py-3 px-4 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-red-600 font-bold rounded-xl transition-colors"
                                    title="Smazat přihlášku"
                                >
                                    <Trash2 size={18} />
                                    <span className="lg:hidden">Smazat</span>
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
