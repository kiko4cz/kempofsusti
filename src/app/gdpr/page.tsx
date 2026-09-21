import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
    title: "Zpracování osobních údajů (GDPR)",
};

export default function GDPRPage() {
    return (
        <div className="min-h-screen bg-[#050810] text-slate-300 font-sans selection:bg-primary/30 selection:text-white">
            <Navbar />
            
            <main className="pt-32 pb-24 relative overflow-hidden">
                {/* Background effects */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 rounded-full blur-[120px] opacity-50 pointer-events-none"></div>
                
                <div className="max-w-4xl mx-auto px-4 md:px-6 relative z-10">
                    <div className="mb-12">
                        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 mb-4 tracking-tight">
                            Zpracování osobních údajů (GDPR)
                        </h1>
                        <p className="text-lg text-slate-400">
                            Informace o tom, jak nakládáme s vašimi osobními údaji a jaká jsou vaše práva.
                        </p>
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 md:p-12 space-y-8 backdrop-blur-sm">
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">1. Základní ustanovení</h2>
                            <p className="leading-relaxed text-slate-300">
                                Správcem osobních údajů podle čl. 4 bod 7 nařízení Evropského parlamentu a Rady (EU) 2016/679 o ochraně fyzických osob v souvislosti se zpracováním osobních údajů a o volném pohybu těchto údajů (dále jen: „GDPR”) je Kemp OFS Ústí.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">2. Zdroje a kategorie zpracovávaných osobních údajů</h2>
                            <p className="leading-relaxed text-slate-300 mb-3">
                                Správce zpracovává osobní údaje, které jste mu poskytl/a nebo osobní údaje, které správce získal na základě plnění vaší objednávky/přihlášky.
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
                                <li>Jméno a příjmení (rodiče i dítěte)</li>
                                <li>Kontaktní údaje (e-mail, telefon)</li>
                                <li>Zdravotní specifika a pojišťovna (pro účely bezpečnosti na kempu)</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">3. Účel zpracování osobních údajů</h2>
                            <p className="leading-relaxed text-slate-300">
                                Vaše údaje potřebujeme pro evidenci účastníků kempu, organizační komunikaci, zajištění bezpečnosti během akce a vedení uživatelského účtu na našem portálu.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">4. Doba uchovávání údajů</h2>
                            <p className="leading-relaxed text-slate-300">
                                Osobní údaje uchováváme po dobu nezbytnou k výkonu práv a povinností vyplývajících ze smluvního vztahu a dále po dobu vedení vašeho klientského účtu (do jeho zrušení nebo smazání).
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">5. Vaše práva</h2>
                            <p className="leading-relaxed text-slate-300 mb-3">
                                Za podmínek stanovených v GDPR máte:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
                                <li>Právo na přístup ke svým osobním údajům</li>
                                <li>Právo na opravu osobních údajů</li>
                                <li>Právo na výmaz osobních údajů (právo „být zapomenut”)</li>
                                <li>Právo na odvolání souhlasu se zpracováním</li>
                            </ul>
                        </section>
                        
                        <div className="pt-6 border-t border-white/10">
                            <p className="text-slate-400 text-sm">
                                Tyto podmínky nabývají účinnosti dnem zveřejnění. Pro jakékoliv dotazy ohledně zpracování dat nás kontaktujte na našem emailu.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
