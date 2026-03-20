// ============================================================
//  boss-actuel.js — CONFIG DU BOSS DU MOIS
//  C'est le SEUL fichier à modifier chaque mois.
//  Remplace aussi boss.gif par le nouveau GIF du boss.
// ============================================================

var BOSS = {
  id:        "sloth-mars-2026",
  pilier:    "fitness",
  nom:       "Sloth",
  tagline:   "La flemme incarn\u00e9e",
  sousTitre: "L\u2019Ombre du Canap\u00e9",
  dateDebut: "2026-03-19T00:00:00",
  dateFin:   "2026-03-25T23:59:59",
  periode:   "Semaine du 19 au 25 Mars 2026",
  gif:       "boss.gif",
  lore:      "Sloth sommeille dans les recoins sombres de ton canap\u00e9. Il murmure que demain c\u2019est mieux, que t\u2019as le temps, qu\u2019une s\u00e9ance de moins \u00e7a change rien. Il se nourrit de tes excuses et grossit chaque jour que tu laisses passer. Cette semaine, le r\u00e9veil sonne. C\u2019est toi ou lui.",
  quetes: [
    { id:"q1", label:"Faire 50 pompes",                       desc:"R\u00e9parties comme tu veux \u2014 10/jour c\u2019est parfait.",              xp:200 },
    { id:"q2", label:"Marcher 30 min sans t\u00e9l\u00e9phone", desc:"Laisse le portable \u00e0 la maison. Juste toi, ta t\u00eate, l\u2019air libre.", xp:150 },
    { id:"q3", label:"R\u00e9aliser 3 s\u00e9ances de sport",  desc:"Salle, home workout, running \u2014 peu importe. L\u2019important c\u2019est de bouger.", xp:300 },
    { id:"q4", label:"Se coucher avant minuit 5j/7",          desc:"Le sommeil est une arme. Sloth veut que tu restes \u00e9veill\u00e9 \u00e0 scroller.", xp:200 },
    { id:"q5", label:"Boire 2L d\u2019eau/jour pendant 7 jours", desc:"Ton corps est \u00e0 60% d\u2019eau. Hydrate le h\u00e9ros.",                 xp:250 }
  ]
};
