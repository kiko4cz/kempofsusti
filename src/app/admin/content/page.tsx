'use client';

import { useState, useEffect } from 'react';
import { Save, ChevronDown, ChevronRight, LayoutTemplate, Type, FileText as FileTextIcon, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

// Define structure for editable content
interface ContentSection {
    id: string; // e.g. 'hero', 'about'
    label: string;
    fields: {
        key: string; // e.g. 'title', 'subtitle'
        label: string;
        type: 'text' | 'textarea' | 'number';
        value: string | number;
    }[];
}

const defaultContent: ContentSection[] = [
    {
        id: 'hero',
        label: 'Úvodní sekce (Hero)',
        fields: [
            { key: 'title_line1', label: 'Nadpis - Řádek 1', type: 'text', value: 'FOTBALEM' },
            { key: 'title_line2', label: 'Nadpis - Zvýrazněné', type: 'text', value: 'ZÁBAVA' },
            { key: 'title_line3', label: 'Nadpis - Řádek 3', type: 'text', value: 'JEN ZAČÍNÁ' },
            { key: 'subtitle', label: 'Podnadpis', type: 'textarea', value: 'Rodinné zázemí, přátelští trenéři a nezapomenutelné zážitky.' },
            { key: 'cta_strong', label: 'CTA zvýrazněný text', type: 'text', value: 'Přidej se k naší kempové rodině.' },
            { key: 'stats_years', label: 'Počet let tradice', type: 'number', value: 15 },
            { key: 'stats_satisfaction', label: 'Procento spokojenosti', type: 'number', value: 100 },
        ]
    },
    {
        id: 'about',
        label: 'O nás',
        fields: [
            { key: 'section_title', label: 'Nadpis sekce', type: 'text', value: 'O NÁS' },
            { key: 'main_heading', label: 'Hlavní nadpis', type: 'text', value: 'VÍCE NEŽ JEN FOTBAL' },
            { key: 'description', label: 'Popis', type: 'textarea', value: 'Tým trenérů, pro které je prioritou dětská spokojenost. Naše kempy Vám neudělají během 5 dní z Vašich ratolestí profesionální fotbalisty, ale zaručí nová přátelství, zážitky a radost ze sportování.' },
        ]
    },
    {
        id: 'sponsors',
        label: 'Sponzoři a partneři',
        fields: [
            { key: 'section_title', label: 'Nadpis sekce', type: 'text', value: 'SPONZOŘI A PARTNEŘI' },
            { key: 'main_heading', label: 'Hlavní nadpis', type: 'text', value: 'PODPORUJÍ NÁS' },
        ]
    },
    {
        id: 'footer',
        label: 'Patička',
        fields: [
            { key: 'about_text', label: 'O nás (krátký text)', type: 'textarea', value: 'Letní fotbalové kempy s tradicí. Zaměřujeme se na rozvoj, zábavu a lásku ke sportu.' },
            { key: 'copyright', label: 'Copyright text', type: 'text', value: '© 2026 Kemp OfsuSti. Všechna práva vyhrazena.' },
        ]
    }
];

export default function AdminContent() {
    const rawContent = useQuery(api.content.getContent);
    const updateContent = useMutation(api.content.updateContent);
    const [sections, setSections] = useState<ContentSection[]>([]);
    const [expandedSection, setExpandedSection] = useState<string | null>('hero');

    useEffect(() => {
        if (rawContent && rawContent.length > 0) {
            const mappedSections = defaultContent.map(defaultSec => {
                const dbSec = rawContent.find(s => s.sectionId === defaultSec.id);
                if (dbSec) {
                    return {
                        ...defaultSec,
                        fields: defaultSec.fields.map(f => {
                            const dbField = dbSec.fields.find(df => df.key === f.key);
                            return dbField ? { ...f, value: dbField.value } : f;
                        })
                    };
                }
                return defaultSec;
            });
            setSections(mappedSections);
        } else if (rawContent?.length === 0) {
            setSections(defaultContent);
        }
    }, [rawContent]);

    const handleSave = async () => {
        try {
            for (const section of sections) {
                await updateContent({
                    sectionId: section.id,
                    fields: section.fields.map(f => ({
                        key: f.key,
                        value: f.value,
                        label: f.label,
                        type: f.type
                    }))
                });
            }
            alert('Obsah byl uložen do Convex databáze!');
        } catch (err) {
            console.error(err);
            alert('Chyba při ukládání: ' + (err instanceof Error ? err.message : 'Neznámá chyba'));
        }
    };

    const handleFieldChange = (sectionId: string, fieldKey: string, newValue: string | number) => {
        setSections(sections.map(section => {
            if (section.id === sectionId) {
                return {
                    ...section,
                    fields: section.fields.map(field => {
                        if (field.key === fieldKey) {
                            return { ...field, value: newValue };
                        }
                        return field;
                    })
                };
            }
            return section;
        }));
    };

    return (
        <div className="space-y-12 pb-24 max-w-5xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-3 tracking-tight">Editor <span className="text-primary">Obsahu</span></h1>
                    <p className="text-slate-500 text-lg font-medium">Upravujte texty na hlavní stránce jednoduše a rychle.</p>
                </div>
                <button
                    onClick={handleSave}
                    className="px-10 py-5 bg-primary hover:bg-orange-500 text-white font-black rounded-2xl flex items-center gap-3 transition-all shadow-2xl shadow-primary/30 transform hover:-translate-y-1 active:scale-95 uppercase tracking-widest text-xs"
                >
                    <Save size={20} />
                    Uložit změny
                </button>
            </motion.div>

            <div className="space-y-6">
                {sections.map((section, idx) => (
                    <motion.div
                        key={section.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`premium-card overflow-hidden group/card ${expandedSection === section.id ? 'ring-2 ring-primary/20 shadow-2xl shadow-primary/5' : ''}`}
                    >
                        <button
                            onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                            className="w-full flex items-center justify-between p-6 md:p-8 hover:bg-slate-50 transition-colors text-left"
                        >
                            <div className="flex items-center gap-6">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${expandedSection === section.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-100 text-slate-400 group-hover/card:bg-primary/10 group-hover/card:text-primary'}`}>
                                    <LayoutTemplate size={28} />
                                </div>
                                <div>
                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-0.5">Sekce {idx + 1}</span>
                                    <span className="text-2xl font-black text-slate-900 tracking-tight">{section.label}</span>
                                </div>
                            </div>
                            <div className={`p-3 rounded-xl border border-slate-100 transition-all ${expandedSection === section.id ? 'bg-primary/10 text-primary border-primary/20 rotate-180' : 'text-slate-400'}`}>
                                <ChevronDown size={24} />
                            </div>
                        </button>

                        <AnimatePresence>
                            {expandedSection === section.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="border-t border-slate-100"
                                >
                                    <div className="p-6 md:p-10 space-y-6 md:space-y-10 bg-slate-50/30">
                                        {section.fields.map((field) => (
                                            <div key={field.key} className="space-y-3">
                                                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                                                    <div className="p-1.5 bg-white rounded-lg border border-slate-200 text-primary">
                                                        {field.type === 'text' && <Type size={12} />}
                                                        {field.type === 'textarea' && <FileTextIcon size={12} />}
                                                        {field.type === 'number' && <Info size={12} />}
                                                    </div>
                                                    {field.label}
                                                </label>

                                                {field.type === 'textarea' ? (
                                                    <textarea
                                                        value={field.value}
                                                        onChange={(e) => handleFieldChange(section.id, field.key, e.target.value)}
                                                        className="w-full bg-white border border-slate-200 rounded-[2rem] px-6 py-5 text-slate-900 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all min-h-[160px] font-medium leading-relaxed shadow-sm"
                                                    />
                                                ) : (
                                                    <input
                                                        type={field.type}
                                                        value={field.value}
                                                        onChange={(e) => handleFieldChange(section.id, field.key, field.type === 'number' ? Number(e.target.value) : e.target.value)}
                                                        className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-5 text-slate-900 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all font-semibold shadow-sm"
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>
            
            <div className="mt-12 p-8 rounded-[2.5rem] bg-amber-50 border border-amber-100 flex items-start gap-6">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                    <Info size={24} />
                </div>
                <div className="space-y-2">
                    <h4 className="font-black text-amber-900 uppercase tracking-widest text-xs">Informace o ukládání</h4>
                    <p className="text-amber-800/70 text-sm font-medium leading-relaxed">Změny se neprojeví okamžitě. Pro jejich zveřejnění na webu je nutné kliknout na tlačítko "Uložit změny" v pravém horním rohu.</p>
                </div>
            </div>
        </div>
    );
}
