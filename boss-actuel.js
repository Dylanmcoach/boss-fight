// ============================================================
//  boss-actuel.js — MARS 2026 (version corrigée XP)
// ============================================================

var BOSS = {
  id:        "doute-mars-2026",
  pilier:    "mindset",
  nom:       "Doute",
  tagline:   "Celui qui r\u00e8gne sur tes peurs",
  sousTitre: "Le Tyran du Tr\u00f4ne Int\u00e9rieur",
  dateDebut: "2026-03-16T00:00:00",
  dateFin:   "2026-05-03T23:59:59",
  periode:   "Jusqu\u2019au 3 Mai 2026",
  gif:       "boss.gif",
  lore:      "Il n\u2019a pas besoin de crier. Il murmure. Depuis son tr\u00f4ne il t\u2019observe et attend que tu baisses la garde pour glisser ses poisons dans ta t\u00eate \u2014 \u201cT\u2019es pas capable\u201d, \u201cC\u2019est trop tard pour toi\u201d, \u201cLes autres y arrivent, pas toi\u201d. Le Doute ne se bat pas \u00e0 l\u2019ext\u00e9rieur. Il r\u00e8gne de l\u2019int\u00e9rieur. Cette semaine tu entres dans son royaume et tu reprends le tr\u00f4ne.",

  // ── NORMAL — 400 XP total ──────────────────────
  quetesNormal: [
    { id:"n1", label:"100 squats",                desc:"R\u00e9partis sur la semaine \u2014 20/jour c\u2019est parfait. Poids du corps, z\u00e9ro mat\u00e9riel.", xp:55 },
    { id:"n2", label:"50 pompes",                 desc:"En s\u00e9ries ou \u00e9tal\u00e9es. Le compte doit y \u00eatre avant dimanche.",                       xp:55 },
    { id:"n3", label:"3km de running",            desc:"D\u2019une traite ou en plusieurs sorties. Dehors ou tapis, \u00e7a compte.",                       xp:70 },
    { id:"n4", label:"50 000 pas sur la semaine", desc:"Active le compteur de ton t\u00e9l\u00e9phone. \u224870 00 pas/jour.",                               xp:70 },
    { id:"n5", label:"0 fast food pendant 7 jours", desc:"McDo, KFC, Burger King, Uber Eats junk \u2014 rien. Le Doute veut que tu craques.",               xp:55 },
    { id:"n6", label:"\u00c9crire 3 victoires pass\u00e9es dont tu es fier",
               desc:"10 minutes, papier ou t\u00e9l\u00e9phone. 3 moments o\u00f9 tu as prouv\u00e9 que tu pouvais.",                                         xp:95, bonus:true }
  ],

  // ── EXPERT — 300 XP suppl\u00e9mentaires ─────────────
  quetesExpert: [
    { id:"e1", label:"200 squats",                       desc:"Double la mise. 40/jour ou par s\u00e9ries \u2014 tes jambes vont parler.",          xp:45 },
    { id:"e2", label:"100 pompes",                       desc:"Le double. En pause, en s\u00e9ries, \u00e7a ne change rien \u2014 100 avant dimanche.", xp:45 },
    { id:"e3", label:"5km de running",                   desc:"D\u2019une traite cette fois. Pas de coupure. Pace libre.",                          xp:55 },
    { id:"e4", label:"75 000 pas sur la semaine",        desc:"\u224810 700 pas/jour. Tu bouges s\u00e9rieusement.",                               xp:55 },
    { id:"e5", label:"0 fast food + 0 sucre ajout\u00e9", desc:"Pas de junk ET pas de sucre ajout\u00e9. Soda, bonbons, desserts \u2014 tout dehors.", xp:45 },
    { id:"e6", label:"10 min de m\u00e9ditation par jour pendant 5 jours",
               desc:"Le Doute d\u00e9teste le silence. 10 minutes, yeux ferm\u00e9s, tu respires.",                                                   xp:55, bonus:true }
  ],

  // ── HEAVEN — 400 XP suppl\u00e9mentaires ─────────────
  quetesHeaven: [
    { id:"h1", label:"300 squats",                              desc:"300. Pas de n\u00e9gociation. R\u00e9partis comme tu veux.",                          xp:60 },
    { id:"h2", label:"150 pompes",                              desc:"150 pompes sur la semaine. \u00c0 ce stade tu ne doutes plus de rien.",               xp:60 },
    { id:"h3", label:"10km de running",                         desc:"10km d\u2019une traite. Si t\u2019as jamais fait \u00e7a, c\u2019est ta premi\u00e8re fois.", xp:80 },
    { id:"h4", label:"100 000 pas sur la semaine",              desc:"\u224814 000 pas/jour. Tu vis debout cette semaine.",                                xp:80 },
    { id:"h5", label:"Alimentation 100% propre pendant 7 jours", desc:"Z\u00e9ro junk, z\u00e9ro sucre, z\u00e9ro alcool. Que du vrai. 7 jours complets.",  xp:60 },
    { id:"h6", label:"Journaling + m\u00e9ditation + visualisation chaque matin",
               desc:"Chaque matin : 3 intentions, 10min m\u00e9ditation, 5min visualisation de tes objectifs.",                                            xp:60, bonus:true }
  ]
};
