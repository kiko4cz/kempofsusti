'use client';

import { useState, useEffect } from 'react';
import { Save, ChevronDown, LayoutTemplate, Type, FileText as FileTextIcon, Info, Image as ImageIcon, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { toast } from 'sonner';

// Define structure for editable content
interface ContentSection {
    id: string; // e.g. 'hero', 'about'
    label: string;
    fields: {
        key: string; 
        label: string;
        type: 'text' | 'textarea' | 'number' | 'image' | 'color';
        value: string | number;
    }[];
}

const defaultContent: ContentSection[] = [
    {
        id: 'navbar',
        label: 'Navigace (Hlavička)',
        fields: [
            { key: 'logo_text', label: 'Text Loga', type: 'text', value: 'KEMP OFSU' },
            { key: 'nav_item_1', label: 'Položka menu 1', type: 'text', value: 'O NÁS' },
            { key: 'nav_item_2', label: 'Položka menu 2', type: 'text', value: 'KEMPY 2026' },
            { key: 'nav_item_3', label: 'Položka menu 3', type: 'text', value: 'PRO RODIČE' },
            { key: 'nav_item_4', label: 'Položka menu 4', type: 'text', value: 'TÝM' },
            { key: 'nav_item_5', label: 'Položka menu 5', type: 'text', value: 'KONTAKT' },
        ]
    },
    {
        id: 'hero',
        label: 'Úvodní sekce (Hero)',
        fields: [
            { key: 'bg_image', label: 'Obrázek na pozadí', type: 'image', value: '/photo_2026.jpg' },
            { key: 'title_line1', label: 'Nadpis - Řádek 1', type: 'text', value: 'FOTBALEM' },
            { key: 'title_line2', label: 'Nadpis - Zvýrazněné', type: 'text', value: 'ZÁBAVA' },
            { key: 'title_line3', label: 'Nadpis - Řádek 3', type: 'text', value: 'JEN ZAČÍNÁ' },
            { key: 'subtitle', label: 'Podnadpis', type: 'textarea', value: 'Rodinné zázemí, přátelští trenéři a nezapomenutelné zážitky.' },
            { key: 'cta_strong', label: 'CTA zvýrazněný text', type: 'text', value: 'Přidej se k naší kempové rodině.' },
            { key: 'btn_primary', label: 'Tlačítko 1 text', type: 'text', value: 'KONTAKT' },
            { key: 'btn_secondary', label: 'Tlačítko 2 text', type: 'text', value: 'ZJISTIT VÍCE' },
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
            { key: 'feat1_title', label: 'Vlastnost 1 - Nadpis', type: 'text', value: 'Dětská spokojenost' },
            { key: 'feat1_desc', label: 'Vlastnost 1 - Popis', type: 'textarea', value: 'Priorita č. 1. Chceme, aby si děti kemp užily a měly na co vzpomínat celý rok.' },
            { key: 'feat2_title', label: 'Vlastnost 2 - Nadpis', type: 'text', value: 'Nová přátelství' },
            { key: 'feat2_desc', label: 'Vlastnost 2 - Popis', type: 'textarea', value: 'Nejen fotbal, ale i budování týmu a poznávání nových kamarádů z okolí.' },
            { key: 'feat3_title', label: 'Vlastnost 3 - Nadpis', type: 'text', value: 'Soutěže a hry' },
            { key: 'feat3_desc', label: 'Vlastnost 3 - Popis', type: 'textarea', value: 'Pestrý program plný soutěží, her a překvapení pro každého účastníka.' },
            { key: 'feat4_title', label: 'Vlastnost 4 - Nadpis', type: 'text', value: 'Celodenní výlet' },
            { key: 'feat4_desc', label: 'Vlastnost 4 - Popis', type: 'textarea', value: 'Výlety za fotbalovými zážitky na velké stadiony či setkání s osobnostmi.' },
        ]
    },
    {
        id: 'camps',
        label: 'Detaily Kempu',
        fields: [
            { key: 'section_title', label: 'Nadpis', type: 'text', value: 'Termíny' },
            { key: 'section_year', label: 'Rok', type: 'text', value: '2026' },
            { key: 'description', label: 'Popis pod nadpisem', type: 'textarea', value: 'Vyberte si ten správný týden. Kapacita je omezená, tak neváhejte!' },
        ]
    },
    {
        id: 'news',
        label: 'Pro rodiče - Novinky',
        fields: [
            { key: 'section_title_small', label: 'Malý nadpis', type: 'text', value: 'Aktuality' },
            { key: 'section_title_main', label: 'Hlavní nadpis', type: 'text', value: 'PRO RODIČE' },
            { key: 'description', label: 'Popis', type: 'textarea', value: 'Sledujte nejnovější informace, změny a důležitá oznámení ohledně probíhajících i budoucích kempů.' },
        ]
    },
    {
        id: 'parents_info',
        label: 'Pro rodiče - Informace',
        fields: [
            { key: 'section_title', label: 'Sekce', type: 'text', value: 'Důležité informace' },
            { key: 'main_heading', label: 'Hlavní nadpis', type: 'text', value: 'VŠECHNO CO POTŘEBUJETE VĚDĚT' },
            { key: 'description', label: 'Popis', type: 'textarea', value: 'Pro bezproblémový průběh kempu prosíme o pečlivé prostudování a vyplnění následujících dokumentů.' },
        ]
    },
    {
        id: 'gallery',
        label: 'Galerie',
        fields: [
            { key: 'section_title_small', label: 'Malý nadpis', type: 'text', value: 'Zážitky' },
            { key: 'section_title_main', label: 'Hlavní nadpis', type: 'text', value: 'FOTOGALERIE' },
        ]
    },
    {
        id: 'team',
        label: 'Tým trenérů',
        fields: [
            { key: 'section_title_small', label: 'Malý nadpis', type: 'text', value: 'Naši trenéři' },
            { key: 'section_title_main', label: 'Hlavní nadpis', type: 'text', value: 'KDO SE O DĚTI STARÁ' },
            { key: 'description', label: 'Popis', type: 'textarea', value: 'Náš tým se skládá ze zkušených trenérů, pedagogů a nadšenců, kteří dělají vše pro to, aby si děti kemp maximálně užily.' },
        ]
    },
    {
        id: 'history',
        label: 'Historie (Tradice)',
        fields: [
            { key: 'section_title_small', label: 'Malý nadpis', type: 'text', value: 'Tradice' },
            { key: 'section_title_main', label: 'Hlavní nadpis', type: 'text', value: 'HISTORIE KEMPU' },
            { key: 'json_timeline', label: 'Časová osa (JSON formát)', type: 'textarea', value: '[{"year":"2026","loc":"Vaňov, Vaňov"},{"year":"2025","loc":"Přestanov, Vaňov"},{"year":"2024","loc":"Povrly"}]' },
        ]
    },
    {
        id: 'contact',
        label: 'Kontakt',
        fields: [
            { key: 'section_title_small', label: 'Malý nadpis', type: 'text', value: 'Jsme tu pro vás' },
            { key: 'section_title_main', label: 'Hlavní nadpis', type: 'text', value: 'KONTAKTUJTE NÁS' },
            { key: 'description', label: 'Popis', type: 'textarea', value: 'Máte dotaz ohledně kempů? Rádi vám odpovíme. Neváhejte nás kontaktovat.' },
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
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const getUrlMutation = useMutation(api.files.getUrlMutation);
    const [sections, setSections] = useState<ContentSection[]>([]);
    const [expandedSection, setExpandedSection] = useState<string | null>('navbar');
    const [isUploading, setIsUploading] = useState<string | null>(null); // store field key currently uploading

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
            toast.success('Obsah byl úspěšně uložen!');
            // Refresh iframe
            const iframe = document.getElementById('preview-iframe') as HTMLIFrameElement;
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.location.reload();
            }
        } catch (err) {
            console.error(err);
            toast.error('Chyba při ukládání: ' + (err instanceof Error ? err.message : 'Neznámá chyba'));
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

    const handleImageUpload = async (sectionId: string, fieldKey: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(`${sectionId}-${fieldKey}`);
        try {
            const uploadUrl = await generateUploadUrl();
            const result = await fetch(uploadUrl, {
                method: "POST",
                headers: { "Content-Type": file.type },
                body: file,
            });
            if (!result.ok) throw new Error('Chyba nahrávání');
            const { storageId } = await result.json();
            const url = await getUrlMutation({ storageId });
            if (url) {
                handleFieldChange(sectionId, fieldKey, url);
                toast.success('Obrázek nahrán!');
            }
        } catch (error) {
            toast.error('Chyba při nahrávání obrázku');
        } finally {
            setIsUploading(null);
            if (event.target) event.target.value = '';
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* LEVÝ PANEL - EDITOR */}
            <div className="w-full lg:w-[400px] xl:w-[450px] flex flex-col bg-white rounded-[2rem] border border-slate-200 shadow-sm shrink-0">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tight">Editor webu</h1>
                        <p className="text-xs text-slate-500 font-medium">Změny se ihned propíšou po uložení.</p>
                    </div>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-primary hover:bg-orange-500 text-white font-black rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-primary/30 transform active:scale-95 text-xs uppercase tracking-widest"
                    >
                        <Save size={16} /> Uložit
                    </button>
                </div>

                <div className="p-4 space-y-4">
                {sections.map((section, idx) => (
                    <motion.div
                        key={section.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`premium-card overflow-hidden group/card ${expandedSection === section.id ? 'ring-2 ring-primary/20 shadow-2xl shadow-primary/5' : ''}`}
                    >
                        <button
                            onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${expandedSection === section.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-100 text-slate-400 group-hover/card:bg-primary/10 group-hover/card:text-primary'}`}>
                                    <LayoutTemplate size={20} />
                                </div>
                                <div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Sekce {idx + 1}</span>
                                    <span className="text-sm font-black text-slate-900 tracking-tight">{section.label}</span>
                                </div>
                            </div>
                            <div className={`p-2 rounded-lg border border-slate-100 transition-all ${expandedSection === section.id ? 'bg-primary/10 text-primary border-primary/20 rotate-180' : 'text-slate-400'}`}>
                                <ChevronDown size={18} />
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
                                    <div className="p-4 space-y-6 bg-slate-50/30">
                                        {section.fields.map((field) => (
                                            <div key={field.key} className="space-y-3">
                                                <label className="flex items-center justify-between text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                                                    <span className="flex items-center gap-2">
                                                        <div className="p-1.5 bg-white rounded-lg border border-slate-200 text-primary">
                                                            {field.type === 'text' && <Type size={12} />}
                                                            {field.type === 'textarea' && <FileTextIcon size={12} />}
                                                            {field.type === 'number' && <Info size={12} />}
                                                            {field.type === 'image' && <ImageIcon size={12} />}
                                                            {field.type === 'color' && <Palette size={12} />}
                                                        </div>
                                                        {field.label}
                                                    </span>
                                                    <span className="text-[10px] text-slate-300 normal-case">{field.key}</span>
                                                </label>

                                                {field.type === 'textarea' ? (
                                                    <textarea
                                                        value={field.value}
                                                        onChange={(e) => handleFieldChange(section.id, field.key, e.target.value)}
                                                        className="w-full bg-white border border-slate-200 rounded-[1.5rem] px-4 py-3 text-sm text-slate-900 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all min-h-[120px] font-medium leading-relaxed shadow-sm"
                                                    />
                                                ) : field.type === 'image' ? (
                                                    <div className="flex flex-col gap-4">
                                                        <div className="flex gap-4 items-center">
                                                            <input
                                                                type="text"
                                                                value={field.value}
                                                                onChange={(e) => handleFieldChange(section.id, field.key, e.target.value)}
                                                                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all font-semibold shadow-sm w-full"
                                                            />
                                                            <div className="flex gap-2">
                                                                <input 
                                                                    type="file"
                                                                    accept="image/*"
                                                                    id={`file-${section.id}-${field.key}`}
                                                                    className="hidden"
                                                                    onChange={(e) => handleImageUpload(section.id, field.key, e)}
                                                                />
                                                                <label
                                                                    htmlFor={`file-${section.id}-${field.key}`}
                                                                    className="bg-primary/10 hover:bg-primary/20 text-primary font-black px-4 py-3 rounded-xl border border-primary/20 flex items-center justify-center gap-2 transition-all cursor-pointer w-full text-xs uppercase tracking-widest"
                                                                >
                                                                    {isUploading === `${section.id}-${field.key}` ? 'Nahrávám...' : <><ImageIcon size={14} /> Nahrát obrázek</>}
                                                                </label>
                                                            </div>
                                                        </div>
                                                        {field.value && field.value.toString().length > 0 && (
                                                            <div className="p-2 bg-slate-50 rounded-xl inline-block border border-slate-100 self-start">
                                                                <img src={field.value.toString()} alt="Preview" className="max-h-24 rounded-lg object-contain" />
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : field.type === 'color' ? (
                                                    <div className="flex items-center gap-4">
                                                        <input
                                                            type="color"
                                                            value={field.value.toString()}
                                                            onChange={(e) => handleFieldChange(section.id, field.key, e.target.value)}
                                                            className="w-12 h-12 rounded-lg border-2 border-slate-200 cursor-pointer overflow-hidden p-0 bg-transparent"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={field.value.toString()}
                                                            onChange={(e) => handleFieldChange(section.id, field.key, e.target.value)}
                                                            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all font-semibold shadow-sm uppercase font-mono"
                                                        />
                                                    </div>
                                                ) : (
                                                    <input
                                                        type={field.type}
                                                        value={field.value}
                                                        onChange={(e) => handleFieldChange(section.id, field.key, field.type === 'number' ? Number(e.target.value) : e.target.value)}
                                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all font-semibold shadow-sm"
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
            
            </div>
            
            {/* PRAVÝ PANEL - ŽIVÝ NÁHLED */}
            <div className="hidden lg:block flex-1 rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden bg-white relative sticky top-4 h-[calc(100vh-8rem)]">
                <div className="absolute top-0 inset-x-0 h-10 bg-slate-100 border-b border-slate-200 flex items-center px-4 gap-2 z-10">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    <div className="mx-auto bg-white px-4 py-1 rounded-md text-[10px] font-medium text-slate-400 shadow-sm">Živý náhled webu</div>
                </div>
                <iframe 
                    id="preview-iframe"
                    src="/" 
                    className="w-full h-full pt-10" 
                    title="Live Preview"
                />
            </div>
        </div>
    );
}
