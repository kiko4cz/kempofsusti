'use client';

import { useState } from 'react';
import { Upload, Trash2, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { toast } from 'sonner';

export default function AdminGallery() {
    const images = useQuery(api.gallery.getImages);
    const addImage = useMutation(api.gallery.addImage);
    const deleteImage = useMutation(api.gallery.deleteImage);
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const getUrlMutation = useMutation(api.files.getUrlMutation);

    const [isAddingUrl, setIsAddingUrl] = useState(false);
    const [newImageUrl, setNewImageUrl] = useState('');
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleAddImageUrl = async () => {
        if (!newImageUrl) return;

        try {
            await addImage({
                url: newImageUrl,
                publicId: 'manual-url',
                alt: 'Vložený obrázek přes URL'
            });
            setNewImageUrl('');
            setIsAddingUrl(false);
            toast.success('Obrázek přidán!');
        } catch (error) {
            toast.error('Chyba při přidávání obrázku');
        }
    };

    const handleDelete = async (id: any) => {
        if (confirm('Opravdu chcete smazat tuto fotku?')) {
            setIsDeleting(id);
            try {
                await deleteImage({ id });
                toast.success('Fotka smazána');
            } catch (error) {
                toast.error('Chyba při mazání fotky');
            } finally {
                setIsDeleting(null);
            }
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            // 1. Získat upload URL z Convex
            const uploadUrl = await generateUploadUrl();

            // 2. Nahrát soubor
            const result = await fetch(uploadUrl, {
                method: "POST",
                headers: { "Content-Type": file.type },
                body: file,
            });

            if (!result.ok) throw new Error('Chyba při nahrávání souboru');

            const { storageId } = await result.json();

            // 3. Získat veřejné URL
            const url = await getUrlMutation({ storageId });

            if (url) {
                // 4. Uložit do databáze
                await addImage({
                    url: url,
                    publicId: storageId,
                    alt: file.name
                });
                toast.success('Fotka úspěšně nahrána!');
            }
        } catch (error) {
            console.error(error);
            toast.error('Chyba při nahrávání fotky');
        } finally {
            setIsUploading(false);
            // Reset the input value so the same file can be uploaded again if needed
            if (event.target) event.target.value = '';
        }
    };

    return (
        <div className="space-y-12 pb-24">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-3 tracking-tight">Správa <span className="text-primary">Galerie</span></h1>
                    <p className="text-slate-500 text-lg font-medium tracking-tight">Spravujte fotky z kempů. (Synchronizováno přes Cloudinary)</p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="gallery-upload"
                            onChange={handleFileUpload}
                            disabled={isUploading}
                        />
                        <label
                            htmlFor="gallery-upload"
                            className={`bg-white hover:bg-slate-50 text-slate-700 font-black px-6 py-4 rounded-2xl border border-slate-200 cursor-pointer flex items-center gap-3 transition-all shadow-sm active:scale-95 uppercase tracking-widest text-xs ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isUploading ? <Loader2 size={18} className="animate-spin text-primary" /> : <Upload size={18} className="text-primary" />}
                            {isUploading ? 'Nahrávám...' : 'Nahrát fotku'}
                        </label>
                    </div>

                    <button
                        onClick={() => setIsAddingUrl(!isAddingUrl)}
                        className="bg-primary hover:bg-orange-500 text-white font-black px-8 py-4 rounded-2xl flex items-center gap-3 transition-all shadow-2xl shadow-primary/30 transform hover:-translate-y-1 active:scale-95 uppercase tracking-widest text-xs"
                    >
                        <ImageIcon size={18} />
                        Vložit URL
                    </button>
                </div>
            </motion.div>

            <AnimatePresence>
                {isAddingUrl && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, scale: 0.95 }}
                        animate={{ opacity: 1, height: 'auto', scale: 1 }}
                        exit={{ opacity: 0, height: 0, scale: 0.95 }}
                        className="premium-card rounded-[2.5rem] p-8 overflow-hidden"
                    >
                        <div className="flex flex-col md:flex-row gap-4">
                            <input
                                type="text"
                                value={newImageUrl}
                                onChange={(e) => setNewImageUrl(e.target.value)}
                                className="flex-1 bg-white/50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:border-primary focus:outline-none transition-all placeholder:text-slate-300 font-semibold"
                                placeholder="Vložte URL adresu obrázku (např. https://example.com/image.jpg)"
                            />
                            <button
                                onClick={handleAddImageUrl}
                                className="px-8 py-3 bg-primary hover:bg-orange-500 text-white rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-primary/20"
                            >
                                Přidat obrázek
                            </button>
                            <button
                                onClick={() => setIsAddingUrl(false)}
                                className="p-3 text-slate-400 hover:text-slate-900 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {!images ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <Loader2 size={48} className="text-primary animate-spin" />
                    <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Načítám galerii...</p>
                </div>
            ) : images.length === 0 ? (
                <div className="text-center py-32 bg-white/40 rounded-[3rem] border-2 border-slate-200 border-dashed group hover:border-primary/30 transition-colors duration-500">
                    <div className="w-20 h-20 bg-slate-50 rounded-3xl mx-auto flex items-center justify-center text-slate-300 mb-6 group-hover:text-primary transition-colors">
                        <ImageIcon size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Galerie je prázdná</h3>
                    <p className="text-slate-400 mb-8 font-medium">Nahrajte první fotky do databáze.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    <AnimatePresence mode="popLayout">
                        {images.map((img, index) => (
                            <motion.div
                                key={img._id}
                                layout
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                                transition={{ delay: index * 0.05 }}
                                className="group relative aspect-square rounded-[2rem] md:rounded-[2.5rem] overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
                            >
                                <img
                                    src={img.url}
                                    alt={img.alt || 'Gallery image'}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                                    <div className="flex items-center justify-between">
                                        <div className="text-white">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/70 mb-0.5">Obrázek</p>
                                            <p className="font-bold text-sm truncate max-w-[150px]">{img.alt || 'Bez popisu'}</p>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(img._id)}
                                            disabled={isDeleting === img._id}
                                            className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50"
                                            title="Smazat"
                                        >
                                            {isDeleting === img._id ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/5 rounded-[2.5rem]"></div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
