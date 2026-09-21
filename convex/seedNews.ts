import { mutation } from "./_generated/server";

export const addNews = mutation({
  args: {},
  handler: async (ctx) => {
    await ctx.db.insert("news", {
      title: "Spouštíme nový registrační systém přes klientskou zónu!",
      date: new Date().toLocaleDateString("cs-CZ"),
      content: `Vážení rodiče,
připravili jsme pro vás novinku, která výrazně usnadní přihlašování vašich dětí na naše fotbalové kempy. Spouštíme zbrusu nový systém klientské zóny!

**Jak to funguje?**
1. **Registrace rodiče:** Při první návštěvě si jednoduše vytvoříte svůj profil v naší klientské zóně. Zadáte svůj e-mail a zvolíte si heslo.
2. **Přidání dětí:** Uvnitř svého účtu si vytvoříte profily pro své děti. Vyplníte základní údaje (jméno, datum narození, velikost trička, případně zdravotní omezení), které už pak nikdy nebudete muset zadávat znovu.
3. **Přihlášení na kemp:** Jakmile máte dítě přidané, stačí si vybrat konkrétní turnus a jedním kliknutím dítě přihlásit. Všechny údaje se vyplní automaticky.
4. **Přehled na jednom místě:** Ve svém profilu kdykoliv uvidíte, na jaké kempy je dítě přihlášené a v jakém stavu (schváleno/čeká) se přihláška nachází. Můžete zde také sledovat hodnocení od trenérů.

Věříme, že tento systém ušetří váš čas a přinese mnohem větší přehled. Těšíme se na vás na kempech!

Tým kempů OFS Ústí nad Labem`,
      active: true,
      type: "Důležité",
      createdAt: Date.now(),
    });
    return "News added successfully.";
  },
});
