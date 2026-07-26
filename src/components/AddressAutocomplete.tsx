'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

interface AddressAutocompleteProps {
    value: string;
    onChange: (location: string, mapLink: string) => void;
    placeholder?: string;
}

interface NominatimResult {
    place_id: number;
    display_name: string;
    lat: string;
    lon: string;
}

export default function AddressAutocomplete({ value, onChange, placeholder = 'např. Areál TJ Vaňov...' }: AddressAutocompleteProps) {
    const [query, setQuery] = useState(value);
    const [results, setResults] = useState<NominatimResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const selectedRef = useRef(false);

    // Sync external value changes if not focused
    useEffect(() => {
        if (!isOpen) {
            setQuery(value);
        }
    }, [value, isOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!query || query.length < 3) {
            setResults([]);
            return;
        }

        const fetchAddresses = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&countrycodes=cz`);
                const data = await res.json();
                setResults(data.slice(0, 5)); // show top 5 results
                if (data.length > 0) setIsOpen(true);
            } catch (err) {
                console.error("Failed to fetch addresses", err);
            } finally {
                setIsLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchAddresses, 500); // 500ms debounce
        return () => clearTimeout(timeoutId);
    }, [query, value]);

    const handleSelect = (result: NominatimResult) => {
        selectedRef.current = true;
        
        const mapLink = `https://www.google.com/maps/search/?api=1&query=${result.lat},${result.lon}`;
        
        // Záměrně nepřenastavujeme query na plnou adresu z našeptávače, 
        // aby zůstal krátký název kempu (např. "Vaňov"), který uživatel napsal.
        setIsOpen(false);
        onChange(query, mapLink);
        
        // Reset selected flag after a moment
        setTimeout(() => { selectedRef.current = false; }, 300);
    };

    return (
        <div ref={wrapperRef} className="relative">
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onBlur={() => {
                        // Delay the onBlur so click events on dropdown can fire
                        setTimeout(() => {
                            if (!selectedRef.current && query !== value) {
                                onChange(query, '');
                            }
                        }, 200);
                    }}
                    onFocus={() => { if (query.length >= 3) setIsOpen(true) }}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-slate-900 font-bold focus:border-primary focus:ring-2 focus:outline-none transition-all pr-10"
                    placeholder={placeholder}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : <MapPin size={18} />}
                </div>
            </div>

            {isOpen && results.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden max-h-60 overflow-y-auto">
                    {results.map((result) => (
                        <button
                            key={result.place_id}
                            onClick={(e) => {
                                e.preventDefault();
                                handleSelect(result);
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-100 last:border-0 flex items-start gap-3 transition-colors"
                        >
                            <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
                            <span className="text-sm font-medium text-slate-700">{result.display_name}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
