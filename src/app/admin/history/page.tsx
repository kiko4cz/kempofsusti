'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, History as HistoryIcon, Calendar, MapPin, Activity, AlertCircle, ChevronDown, Edit2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { toast } from 'sonner';
import AddressAutocomplete from '../../../components/AddressAutocomplete';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { cs } from 'date-fns/locale/cs';

registerLocale('cs', cs);

interface Camper {
    id: string;
    name: string;
    category: string;
    imageId: string;
}

interface HistoryTerm {
    id: string;
    name?: string; // e.g. Turnus #1
    locationName: string; // e.g. Areál TJ Vaňov
    description?: string;
    campers?: string; // legacy
    campersList?: Camper[]; // new
    tripInfo?: string;
    kidsCount?: string;
    materialsNotAvailable?: boolean;
    isActive?: boolean;
    dates?: string; // legacy string
    dateFrom?: string; // YYYY-MM-DD
    dateTo?: string; // YYYY-MM-DD
    price?: string;
    status?: string;
    features?: string;
    mapLink?: string; // Google Maps link;
}

interface HistoryItem {
    id: string;
    year: string;
    terms: HistoryTerm[];
}

export default function AdminHistory() {
    const rawContent = useQuery(api.content.getContent);
    const updateContent = useMutation(api.content.updateContent);
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const getUrlMutation = useMutation(api.files.getUrlMutation);
    
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [originalFields, setOriginalFields] = useState<any[]>([]);
    const [selectedYearId, setSelectedYearId] = useState<string | null>(null);
    const [selectedTermId, setSelectedTermId] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState<string | null>(null);
    const [deleteYearModalId, setDeleteYearModalId] = useState<string | null>(null);

    useEffect(() => {
        if (rawContent) {
            const section = rawContent.find(s => s.sectionId === 'history');
            if (section) {
                setOriginalFields(section.fields);
                const timelineField = section.fields.find(f => f.key === 'json_timeline');
                if (timelineField && timelineField.value) {
                    try {
                        const parsed = JSON.parse(String(timelineField.value));
                        setHistory(parsed.map((p: any, idx: number) => {
                            let terms: HistoryTerm[] = [];
                            if (p.terms && Array.isArray(p.terms)) {
                                terms = p.terms;
                            } else {
                                // Migrate old format
                                terms = [{
                                    id: Date.now().toString() + idx + '-1',
                                    locationName: p.loc || p.location || '',
                                    description: p.description || '',
                                    campers: p.campers || '',
                                    tripInfo: p.tripInfo || '',
                                    kidsCount: p.kidsCount || '',
                                    materialsNotAvailable: p.materialsNotAvailable || false
                                }];
                            }
                            return {
                                id: p.id || Date.now().toString() + idx,
                                year: p.year,
                                terms: terms
                            };
                        }));
                    } catch (e) {
                        setHistory([]);
                    }
                }
            }
        }
    }, [rawContent]);

    const handleAddYear = () => {
        const newItem: HistoryItem = {
            id: Date.now().toString(),
            year: (new Date().getFullYear()).toString(),
            terms: [{
                id: Date.now().toString() + '-t1',
                locationName: 'Vaňov (1. turnus)',
                materialsNotAvailable: false
            }]
        };
        setHistory([newItem, ...history]);
        setSelectedYearId(newItem.id);
        setSelectedTermId(newItem.terms[0].id);
    };

    const handleAddTerm = (yearId: string) => {
        setHistory(history.map(h => {
            if (h.id === yearId) {
                return {
                    ...h,
                    terms: [...h.terms, {
                        id: Date.now().toString(),
                        locationName: `Nový turnus`,
                        materialsNotAvailable: false
                    }]
                };
            }
            return h;
        }));
    };

    const handleDeleteYear = (id: string) => {
        setHistory(history.filter(h => h.id !== id));
        if (selectedYearId === id) {
            setSelectedYearId(null);
            setSelectedTermId(null);
        }
        setDeleteYearModalId(null);
    };

    const handleDeleteTerm = (yearId: string, termId: string) => {
        if (confirm('Opravdu smazat tento turnus?')) {
            setHistory(history.map(h => {
                if (h.id === yearId) {
                    const newTerms = h.terms.filter(t => t.id !== termId);
                    if (selectedTermId === termId) {
                        setSelectedTermId(newTerms.length > 0 ? newTerms[0].id : null);
                    }
                    return { ...h, terms: newTerms };
                }
                return h;
            }));
        }
    };

    const handleChangeYear = (id: string, value: string) => {
        setHistory(history.map(h => h.id === id ? { ...h, year: value } : h));
    };

    const handleChangeTerm = (yearId: string, termId: string, field: keyof HistoryTerm, value: any) => {
        setHistory(history.map(h => {
            if (h.id === yearId) {
                return {
                    ...h,
                    terms: h.terms.map(t => t.id === termId ? { ...t, [field]: value } : t)
                };
            }
            return h;
        }));
    };

    const handleAddCamper = (yearId: string, termId: string) => {
        setHistory(history.map(h => {
            if (h.id === yearId) {
                return {
                    ...h,
                    terms: h.terms.map(t => {
                        if (t.id === termId) {
                            return {
                                ...t,
                                campersList: [...(t.campersList || []), { id: Date.now().toString(), name: '', category: '', imageId: '' }]
                            };
                        }
                        return t;
                    })
                };
            }
            return h;
        }));
    };

    const handleChangeCamper = (yearId: string, termId: string, camperId: string, field: keyof Camper, value: string) => {
        setHistory(history.map(h => {
            if (h.id === yearId) {
                return {
                    ...h,
                    terms: h.terms.map(t => {
                        if (t.id === termId && t.campersList) {
                            return {
                                ...t,
                                campersList: t.campersList.map(c => c.id === camperId ? { ...c, [field]: value } : c)
                            };
                        }
                        return t;
                    })
                };
            }
            return h;
        }));
    };

    const handleDeleteCamper = (yearId: string, termId: string, camperId: string) => {
        if (confirm('Opravdu smazat tohoto kempaře?')) {
            setHistory(history.map(h => {
                if (h.id === yearId) {
                    return {
                        ...h,
                        terms: h.terms.map(t => {
                            if (t.id === termId && t.campersList) {
                                return {
                                    ...t,
                                    campersList: t.campersList.filter(c => c.id !== camperId)
                                };
                            }
                            return t;
                        })
                    };
                }
                return h;
            }));
        }
    };

    const handleUploadCamperImage = async (yearId: string, termId: string, camperId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const uploadId = `${yearId}-${termId}-${camperId}`;
        setIsUploading(uploadId);
        try {
            const uploadUrl = await generateUploadUrl();
            const result = await fetch(uploadUrl, {
                method: "POST",
                headers: { "Content-Type": file.type },
                body: file,
            });
            const { storageId } = await result.json();
            const url = await getUrlMutation({ storageId });
            if (url) {
                handleChangeCamper(yearId, termId, camperId, 'imageId', url);
                toast.success('Fotka kempaře nahrána!');
            }
        } catch (error) {
            toast.error('Chyba při nahrávání fotky');
        } finally {
            setIsUploading(null);
            e.target.value = '';
        }
    };

    const handleSave = async () => {
        const jsonTimeline = JSON.stringify(history.map(h => ({
            id: h.id,
            year: h.year,
            loc: h.terms.map(t => t.locationName).join(', '),
            terms: h.terms
        })));

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
            await updateContent({ sectionId: 'history', fields: newFields });
            toast.success('Historie uložena!');
        } catch (error) {
            toast.error('Chyba při ukládání');
        }
    };

    return (
        <div className="space-y-8 md:space-y-12 pb-24 max-w-5xl mx-auto px-4 md:px-0 relative">
            <div className="sticky top-6 z-50 flex justify-end pointer-events-none">
                <button
                    onClick={handleSave}
                    className="pointer-events-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all shadow-2xl shadow-slate-900/20 transform hover:-translate-y-1 active:scale-95 uppercase tracking-widest text-xs group"
                >
                    <Save size={18} className="text-primary group-hover:scale-110 transition-transform" />
                    Uložit všechny změny
                </button>
            </div>

            {!selectedYearId ? (
                // MASTER VIEW
                <>
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-2">
                                <HistoryIcon size={12} /> Systém turnusů
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none">
                                Správa turnusů
                            </h1>
                            <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
                                Vyberte ročník pro úpravu jeho turnusů, nebo přidejte nový.
                            </p>
                        </div>
                        <button
                            onClick={handleAddYear}
                            className="px-8 py-5 bg-primary hover:bg-orange-500 text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all shadow-2xl shadow-primary/30 transform hover:-translate-y-1 active:scale-95 uppercase tracking-widest text-xs self-start md:self-center"
                        >
                            <Plus size={22} />
                            Přidat rok
                        </button>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        {history.map(item => (
                            <div key={item.id} className="premium-card rounded-3xl p-6 bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col justify-between min-h-[160px]" onClick={() => { setSelectedYearId(item.id); setSelectedTermId(item.terms[0]?.id || null); }}>
                                <div className="flex justify-between items-start">
                                    <div className="text-4xl font-black text-slate-900 group-hover:text-primary transition-colors">{item.year}</div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setDeleteYearModalId(item.id); }}
                                        className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                                        title="Smazat celý rok"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <div className="flex items-center gap-3 text-sm font-bold text-slate-500 mt-4 bg-slate-50 p-3 rounded-xl w-fit">
                                    <Calendar size={16} className="text-primary" />
                                    {item.terms.length} turnus{item.terms.length > 1 ? (item.terms.length < 5 ? 'y' : 'ů') : ''}
                                </div>
                            </div>
                        ))}
                        {history.length === 0 && (
                            <div className="col-span-full p-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
                                <HistoryIcon size={48} className="mx-auto text-slate-300 mb-6" />
                                <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Zatím nejsou vytvořeny žádné turnusy</p>
                            </div>
                        )}
                    </motion.div>
                </>
            ) : (
                // DETAIL VIEW
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                    <button onClick={() => { setSelectedYearId(null); setSelectedTermId(null); }} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors">
                        <ArrowLeft size={16} /> Zpět na ročníky
                    </button>

                    {(() => {
                        const activeYear = history.find(h => h.id === selectedYearId);
                        if (!activeYear) return null;
                        const activeTerm = activeYear.terms.find(t => t.id === selectedTermId);

                        return (
                            <div className="premium-card rounded-[2.5rem] overflow-hidden bg-white shadow-xl shadow-slate-200/50">
                                {/* Header */}
                                <div className="p-8 bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="space-y-2">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                                            <Calendar size={12} className="text-primary" /> Upravit ročník
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="text"
                                                value={activeYear.year}
                                                onChange={(e) => handleChangeYear(activeYear.id, e.target.value)}
                                                className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white font-black text-3xl focus:border-primary focus:outline-none w-32"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setDeleteYearModalId(activeYear.id)}
                                        className="px-6 py-3 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl text-sm font-bold transition-colors flex items-center gap-2 border border-red-500/20"
                                    >
                                        <Trash2 size={16} /> Smazat tento ročník
                                    </button>
                                </div>

                                {/* Tabs */}
                                <div className="bg-slate-50 border-b border-slate-100 p-4 flex gap-2 overflow-x-auto no-scrollbar items-center">
                                    {activeYear.terms.map((term, tIdx) => (
                                        <button
                                            key={term.id}
                                            onClick={() => setSelectedTermId(term.id)}
                                            className={`flex-none px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                                                selectedTermId === term.id
                                                    ? 'bg-white text-primary shadow-sm border border-slate-200'
                                                    : 'bg-transparent text-slate-500 hover:bg-slate-200/50 hover:text-slate-700'
                                            }`}
                                        >
                                            Turnus #{tIdx + 1}
                                            {selectedTermId === term.id && (
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary ml-1" />
                                            )}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => handleAddTerm(activeYear.id)}
                                        className="flex-none px-4 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-primary hover:bg-primary/5 transition-colors flex items-center gap-2 border border-dashed border-slate-300 hover:border-primary/50 ml-2"
                                    >
                                        <Plus size={16} /> Přidat
                                    </button>
                                </div>

                                {/* Tab Content */}
                                <div className="p-4 md:p-8">
                                    {!activeTerm ? (
                                        <div className="text-center py-20 text-slate-400 font-medium text-sm border-2 border-dashed border-slate-100 rounded-3xl">
                                            Zatím žádné turnusy. Přidejte první kliknutím na "+ Přidat".
                                        </div>
                                    ) : (
                                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="font-black text-xl text-slate-900">Detaily turnusu</h4>
                                                <button
                                                    onClick={() => handleDeleteTerm(activeYear.id, activeTerm.id)}
                                                    className="p-2 text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100"
                                                    title="Smazat turnus"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="col-span-1 space-y-4">
                                                    <div>
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Název turnusu (pro web)</label>
                                                        <input
                                                            type="text"
                                                            value={activeTerm.name || ''}
                                                            onChange={(e) => handleChangeTerm(activeYear.id, activeTerm.id, 'name', e.target.value)}
                                                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-slate-900 font-bold focus:border-primary focus:ring-2 focus:outline-none transition-all"
                                                            placeholder="např. Turnus #1 nebo Vaňov"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Lokalita / Adresa konání</label>
                                                        <AddressAutocomplete
                                                            value={activeTerm.locationName || ''}
                                                            onChange={(location, mapLink) => {
                                                                handleChangeTerm(activeYear.id, activeTerm.id, 'locationName', location);
                                                                if (mapLink) handleChangeTerm(activeYear.id, activeTerm.id, 'mapLink', mapLink);
                                                            }}
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Od (Začátek)</label>
                                                            <DatePicker
                                                                selected={activeTerm.dateFrom ? new Date(activeTerm.dateFrom) : null}
                                                                onChange={(date: Date | null) => handleChangeTerm(activeYear.id, activeTerm.id, 'dateFrom', date ? date.toISOString().split('T')[0] : '')}
                                                                locale="cs"
                                                                dateFormat="dd.MM.yyyy"
                                                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-slate-900 font-bold focus:border-primary focus:ring-2 focus:outline-none transition-all"
                                                                placeholderText="Začátek"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Do (Konec)</label>
                                                            <DatePicker
                                                                selected={activeTerm.dateTo ? new Date(activeTerm.dateTo) : null}
                                                                onChange={(date: Date | null) => handleChangeTerm(activeYear.id, activeTerm.id, 'dateTo', date ? date.toISOString().split('T')[0] : '')}
                                                                locale="cs"
                                                                dateFormat="dd.MM.yyyy"
                                                                minDate={activeTerm.dateFrom ? new Date(activeTerm.dateFrom) : undefined}
                                                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-slate-900 font-bold focus:border-primary focus:ring-2 focus:outline-none transition-all"
                                                                placeholderText="Konec"
                                                            />
                                                        </div>
                                                    </div>

                                                    <label className="flex items-center gap-3 p-3 bg-red-50 border border-red-100 rounded-xl cursor-pointer hover:bg-red-100/50 transition-colors">
                                                        <input
                                                            type="checkbox"
                                                            checked={activeTerm.materialsNotAvailable || false}
                                                            onChange={(e) => handleChangeTerm(activeYear.id, activeTerm.id, 'materialsNotAvailable', e.target.checked)}
                                                            className="w-5 h-5 rounded text-primary focus:ring-primary/20 bg-white border-red-200"
                                                        />
                                                        <div>
                                                            <div className="text-xs font-bold text-red-900 uppercase tracking-wider">Materiály se nedochovaly</div>
                                                            <div className="text-[10px] text-red-600">Po zaškrtnutí se na webu místo detailů ukáže speciální hláška.</div>
                                                        </div>
                                                    </label>
                                                    
                                                        <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 space-y-4">
                                                            <h5 className="font-bold text-primary mb-4 uppercase tracking-widest text-xs flex items-center gap-2">
                                                                Nastavení pro hlavní stranu
                                                            </h5>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Cena</label>
                                                                    <input
                                                                        type="text"
                                                                        value={activeTerm.price || ''}
                                                                        onChange={(e) => handleChangeTerm(activeYear.id, activeTerm.id, 'price', e.target.value)}
                                                                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 font-bold focus:border-primary focus:ring-1 focus:outline-none"
                                                                        placeholder="3 000 Kč"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Stav obsazenosti</label>
                                                                    <select
                                                                        value={activeTerm.status || 'Ještě otevřeno'}
                                                                        onChange={(e) => handleChangeTerm(activeYear.id, activeTerm.id, 'status', e.target.value)}
                                                                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 font-bold focus:border-primary focus:ring-1 focus:outline-none"
                                                                    >
                                                                        <option value="Ještě otevřeno">Ještě otevřeno</option>
                                                                        <option value="Poslední místa">Poslední místa</option>
                                                                        <option value="Obsazeno">Obsazeno</option>
                                                                    </select>
                                                                </div>
                                                                <div className="col-span-2">
                                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Co cena obsahuje (odděleno čárkou)</label>
                                                                    <input
                                                                        type="text"
                                                                        value={activeTerm.features || ''}
                                                                        onChange={(e) => handleChangeTerm(activeYear.id, activeTerm.id, 'features', e.target.value)}
                                                                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 font-medium focus:border-primary focus:ring-1 focus:outline-none"
                                                                        placeholder="Celodenní strava, Kempový set, Pitný režim"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                    {!activeTerm.materialsNotAvailable && (
                                                        <div>
                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                                Krásný popis turnusu
                                                            </label>
                                                            <textarea
                                                                value={activeTerm.description || ''}
                                                                onChange={(e) => handleChangeTerm(activeYear.id, activeTerm.id, 'description', e.target.value)}
                                                                className="w-full h-32 bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-slate-700 font-medium focus:border-primary focus:ring-2 focus:outline-none transition-all resize-none"
                                                                placeholder="Napiš úžasný příběh o tom, jaký tento turnus byl..."
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {!activeTerm.materialsNotAvailable && (
                                                    <div className="col-span-1 space-y-4">
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                                    Počet dětí
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={activeTerm.kidsCount || ''}
                                                                    onChange={(e) => handleChangeTerm(activeYear.id, activeTerm.id, 'kidsCount', e.target.value)}
                                                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-slate-900 font-bold focus:border-primary focus:ring-2 focus:outline-none transition-all"
                                                                    placeholder="např. 45"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="mt-6 pt-6 border-t border-slate-100">
                                                            <div className="flex justify-between items-center mb-4">
                                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                                    Kempaři (Výherci)
                                                                </label>
                                                                <button
                                                                    onClick={() => handleAddCamper(activeYear.id, activeTerm.id)}
                                                                    className="px-3 py-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-lg flex items-center gap-1.5 text-[10px] font-black uppercase transition-all"
                                                                >
                                                                    <Plus size={12} /> Přidat kempaře
                                                                </button>
                                                            </div>
                                                            
                                                            {(!activeTerm.campersList || activeTerm.campersList.length === 0) && activeTerm.campers && (
                                                                <div className="mb-4">
                                                                    <label className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1 block">Starý formát kempařů (pouze text)</label>
                                                                    <input
                                                                        type="text"
                                                                        value={activeTerm.campers || ''}
                                                                        onChange={(e) => handleChangeTerm(activeYear.id, activeTerm.id, 'campers', e.target.value)}
                                                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-slate-900 font-medium focus:border-primary focus:ring-2 focus:outline-none transition-all opacity-50"
                                                                        placeholder="Jména oceněných kempařů..."
                                                                    />
                                                                </div>
                                                            )}

                                                            <div className="space-y-4">
                                                                {activeTerm.campersList?.map((camper, cIdx) => (
                                                                    <div key={camper.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex gap-4 relative group">
                                                                        <div className="w-20 h-20 shrink-0 bg-slate-200 rounded-lg overflow-hidden border-2 border-white shadow-sm relative">
                                                                            {camper.imageId ? (
                                                                                <img src={camper.imageId.startsWith('http') ? camper.imageId : `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${camper.imageId}`} alt="Kempař" className="w-full h-full object-cover" />
                                                                            ) : (
                                                                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                                                                                    {isUploading === `${activeYear.id}-${activeTerm.id}-${camper.id}` ? (
                                                                                        <Activity size={20} className="animate-pulse" />
                                                                                    ) : (
                                                                                        <div className="text-[10px] font-bold">BEZ FOTKY</div>
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                            <label className="absolute inset-0 bg-black/50 text-white opacity-0 hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                                                                                <span className="text-[10px] font-bold">Změnit</span>
                                                                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUploadCamperImage(activeYear.id, activeTerm.id, camper.id, e)} disabled={isUploading === `${activeYear.id}-${activeTerm.id}-${camper.id}`} />
                                                                            </label>
                                                                        </div>
                                                                        <div className="flex-1 space-y-3">
                                                                            <input
                                                                                type="text"
                                                                                value={camper.name}
                                                                                onChange={(e) => handleChangeCamper(activeYear.id, activeTerm.id, camper.id, 'name', e.target.value)}
                                                                                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold focus:border-primary focus:outline-none"
                                                                                placeholder="Jméno kempaře"
                                                                            />
                                                                            <input
                                                                                type="text"
                                                                                value={camper.category}
                                                                                onChange={(e) => handleChangeCamper(activeYear.id, activeTerm.id, camper.id, 'category', e.target.value)}
                                                                                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:border-primary focus:outline-none"
                                                                                placeholder="Kategorie (např. Absolutní vítěz)"
                                                                            />
                                                                        </div>
                                                                        <button
                                                                            onClick={() => handleDeleteCamper(activeYear.id, activeTerm.id, camper.id)}
                                                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                                                                        >
                                                                            <Trash2 size={12} />
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                                Informace ke středečnímu výletu
                                                            </label>
                                                            <textarea
                                                                value={activeTerm.tripInfo || ''}
                                                                onChange={(e) => handleChangeTerm(activeYear.id, activeTerm.id, 'tripInfo', e.target.value)}
                                                                className="w-full h-24 bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-slate-900 font-medium focus:border-primary focus:ring-2 focus:outline-none transition-all resize-none"
                                                                placeholder="Kam se jelo a co se tam dělo..."
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })()}
                </motion.div>
            )}

            {/* Custom Modal for deleting a year */}
            <AnimatePresence>
                {deleteYearModalId && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                            onClick={() => setDeleteYearModalId(null)}
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                            animate={{ opacity: 1, scale: 1, y: 0 }} 
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative z-10 text-center"
                        >
                            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Trash2 size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-2">Smazat celý ročník?</h3>
                            <p className="text-slate-500 font-medium mb-8">
                                Opravdu chcete smazat tento ročník? Spolu s ním budou nenávratně odstraněny <strong>úplně všechny turnusy</strong> a informace v něm obsažené. 
                            </p>
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setDeleteYearModalId(null)}
                                    className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors"
                                >
                                    Zrušit
                                </button>
                                <button 
                                    onClick={() => handleDeleteYear(deleteYearModalId)}
                                    className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-red-500/30"
                                >
                                    Ano, smazat vše
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
}
