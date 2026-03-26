import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const backfill = mutation({
  args: {},
  handler: async (ctx) => {
    // 1. Backfill CAMPS
    const existingCamps = await ctx.db.query("camps").collect();
    if (existingCamps.length === 0) {
      const defaultCamps = [
        {
          dates: "13. 7. – 17. 7. 2026",
          location: "Areál TJ Vaňov, Brzákova 146/1",
          price: "3 000",
          features: ["Celodenní strava", "Kempový set", "Pitný režim"],
          status: "Obsazeno",
          createdAt: Date.now(),
        },
        {
          dates: "20. 7. – 24. 7. 2026",
          location: "Areál TJ Vaňov, Brzákova 146/1",
          price: "3 000",
          features: ["Celodenní strava", "Kempový set", "Pitný režim"],
          status: "Volno",
          createdAt: Date.now(),
        },
      ];
      for (const camp of defaultCamps) {
        await ctx.db.insert("camps", camp);
      }
    }

    // 2. Backfill TEAM
    const existingTeam = await ctx.db.query("team").collect();
    if (existingTeam.length === 0) {
      const defaultTeam = [
        {
          name: "Milan Seidl",
          role: "Manažer kempu",
          img: "/treneri/seidl_prukaz.jpg",
          bio: "Hlavní organizátor a duše celého projektu. GTM Ústí nad Labem, šéftrenér přípravek FK VIAGEM Ústí nad Labem.",
          gender: "male",
          order: 1,
          createdAt: Date.now(),
        },
        {
          name: "Miroslav Zeman",
          role: "Trenér",
          bio: "Zkušený kempový trenér a vedoucí, trenér okresních výběrů, šéf klubu TJ Vaňov.",
          img: "/treneri/miroslav_zeman.jpeg",
          gender: "male",
          order: 2,
          createdAt: Date.now(),
        },
        {
          name: "Barbora Fišerová",
          role: "Trenérka",
          bio: "Tradiční dívčí tvář našeho kempu, trenérka a učitelka na sportovní škole.",
          img: "/treneri/fiserova_barbora.jpeg",
          gender: "female",
          order: 3,
          createdAt: Date.now(),
        },
        {
          name: "Jiří Zápotocký",
          role: "Trenér",
          bio: "Reprezentant ČR ve futsale, ligový futsalista, odchovanec kempu.",
          img: "",
          gender: "male",
          order: 4,
          createdAt: Date.now(),
        },
        {
          name: "Jaroslav Zápotocký",
          role: "Trenér",
          bio: "Reprezentant ČR U21 ve futsale, ligový futsalista, odchovanec kempu.",
          img: "",
          gender: "male",
          order: 5,
          createdAt: Date.now(),
        },
        {
          name: "Tobiáš Zvonek",
          role: "Trenér",
          bio: "Reprezentant ČR U15, bývalý hráč SG Dynamo Dresden, odchovanec kempu.",
          img: "",
          gender: "male",
          order: 6,
          createdAt: Date.now(),
        },
        {
          name: "Jakub Prousek",
          role: "Trenér",
          bio: "Bývalý hráč a student americké univerzity, odchovanec kempu.",
          img: "",
          gender: "male",
          order: 7,
          createdAt: Date.now(),
        },
        {
          name: "Tomáš Nyári",
          role: "Trenér",
          bio: "Trenér přípravek v FK VIAGEM Ústí nad Labem, stará se o pitný režim (nejlepší barman na světě).",
          img: "",
          gender: "male",
          order: 8,
          createdAt: Date.now(),
        },
        {
          name: "Jan Novotný",
          role: "Trenér",
          bio: "Každý kempó má svého chytráka a statistika, odchovanec kempu, který se také přesunul do řad trenérů.",
          img: "",
          gender: "male",
          order: 9,
          createdAt: Date.now(),
        },
        {
          name: "Christian Ullmann",
          role: "Trenér",
          bio: "Odchovanec kempu, který se také přesunul do řad trenérů. Tvůrce WEBu OFSÚstí.",
          img: "",
          gender: "male",
          order: 10,
          createdAt: Date.now(),
        },
        {
          name: "Jakub Seidl",
          role: "Trenér",
          bio: "Bývalý profesionální hráč, trenér přípravek v FK VIAGEM Ústí nad Labem.",
          img: "",
          gender: "male",
          order: 11,
          createdAt: Date.now(),
        },
        {
          name: "Samuel Peřina",
          role: "Trenér",
          bio: "Další z odchovanců kempu, který se časem přesunul do trenérské role.",
          img: "",
          gender: "male",
          order: 12,
          createdAt: Date.now(),
        },
      ];
      for (const member of defaultTeam) {
        await ctx.db.insert("team", member);
      }
    } else {
      // Manual fix for existing members if needed
      for (const m of existingTeam) {
        if (m.name.includes("Milan Seidl")) await ctx.db.patch(m._id, { order: 1 });
        if (m.name.includes("Miroslav Zeman")) await ctx.db.patch(m._id, { order: 2 });
        if (m.name.includes("Barbora Fišerová")) await ctx.db.patch(m._id, { order: 3 });
      }
    }

    // 3. Backfill STATS
    const existingStats = await ctx.db.query("stats").collect();
    if (existingStats.length === 0) {
      await ctx.db.insert("stats", {
        year: 2026,
        createdAt: Date.now(),
        turnuses: [
          {
            id: "1",
            turnusId: 1,
            name: "1. Turnus",
            boys: 32,
            girls: 8,
            price: 3000,
            expenses: 15000,
            note: "Plně obsazeno - Vaňov",
          },
          {
            id: "2",
            turnusId: 2,
            name: "2. Turnus",
            boys: 24,
            girls: 6,
            price: 3000,
            expenses: 12000,
            note: "Volná místa - Vaňov",
          },
        ],
      });
    }

    // 4. Backfill CONTENT (Hero, About, Sponsors, Footer)
    const sections = [
      {
        sectionId: "hero",
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
        sectionId: "about",
        fields: [
          { key: 'section_title', label: 'Malý nadpis', type: 'text', value: 'O NÁS' },
          { key: 'main_heading', label: 'Hlavní nadpis', type: 'text', value: 'VÍCE NEŽ JEN FOTBAL' },
          { key: 'description', label: 'Hlavní text', type: 'textarea', value: 'Tým trenérů, pro které je prioritou dětská spokojenost. Naše kempy Vám neudělají během 5 dní z Vašich ratolestí profesionální fotbalisty, ale zaručí nová přátelství, zážitky a radost ze sportování.' },
        ]
      },
      {
        sectionId: "sponsors",
        fields: [
          { key: 'section_title', label: 'Malý nadpis', type: 'text', value: 'SPONZOŘI A PARTNEŘI' },
          { key: 'main_heading', label: 'Hlavní nadpis', type: 'text', value: 'PODPORUJÍ NÁS' },
        ]
      },
      {
        sectionId: "footer",
        fields: [
          { key: 'about_text', label: 'Text o nás v patičce', type: 'textarea', value: 'Rodinné zázemí, přátelští trenéři a nezapomenutelné zážitky. Přidej se k týmu vítězů.' },
          { key: 'copyright', label: 'Copyright text', type: 'text', value: `© ${new Date().getFullYear()} OFS Ústí nad Labem. Všechna práva vyhrazena.` },
        ]
      }
    ];

    for (const section of sections) {
      const existing = await ctx.db.query("content").filter(q => q.eq(q.field("sectionId"), section.sectionId)).first();
      if (!existing) {
        await ctx.db.insert("content", section);
      }
    }

    // 5. Backfill NEWS
    const existingNews = await ctx.db.query("news").collect();
    if (existingNews.length === 0) {
      const defaultNews = [
        {
          title: "Přípravy na ročník 2026 v plném proudu",
          date: new Date().toISOString(),
          content: "Již nyní usilovně pracujeme na zajištění nejlepšího programu pro nadcházející léto. Těšit se můžete na nové tréninkové metody i zajímavé hosty.",
          active: true,
          type: "info",
          createdAt: Date.now(),
        },
        {
          title: "Spuštění registrací",
          date: new Date().toISOString(),
          content: "Omlouváme se za drobné zpoždění, ale registrace na oba turnusy budou spuštěny již během příštího týdne. Sledujte náš web!",
          active: true,
          type: "important",
          createdAt: Date.now(),
        }
      ];
      for (const item of defaultNews) {
        await ctx.db.insert("news", item);
      }
    }

    // 6. Backfill SETTINGS
    const existingSettings = await ctx.db.query("settings").first();
    if (!existingSettings) {
      await ctx.db.insert("settings", {
        contactPhone: "+420 603 985 226",
        contactEmail: "kempofsusti@seznam.cz",
        cloudinaryCloudName: "",
        cloudinaryUploadPreset: "",
      });
    }

    return { message: "Data byla úspěšně nahrána do cloudu!" };
  },
});
