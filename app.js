// ===================================================
//  SYSTEME DE NIVEAUX
// ===================================================
// ===================================================
//  200 NIVEAUX — Generes dynamiquement
//  Courbe : ~1100 XP/mois, niveau 200 en ~8-10 ans
// ===================================================
var LEVEL_TITLES=[
  {from:1,  to:9,   titre:"Recrue",          icon:"⚡"},
  {from:10, to:19,  titre:"Apprenti",        icon:"🗡️"},
  {from:20, to:34,  titre:"Guerrier",        icon:"⚔️"},
  {from:35, to:49,  titre:"Vétéran",         icon:"🛡️"},
  {from:50, to:64,  titre:"Combattant",      icon:"🏹"},
  {from:65, to:79,  titre:"Chasseur",        icon:"🔱"},
  {from:80, to:99,  titre:"Champion",        icon:"🏆"},
  {from:100,to:119, titre:"Élite",           icon:"🔥"},
  {from:120,to:139, titre:"Maître",          icon:"💎"},
  {from:140,to:159, titre:"Grand Maître",    icon:"✨"},
  {from:160,to:179, titre:"Héros",           icon:"🌟"},
  {from:180,to:199, titre:"Ascendant",       icon:"💫"},
  {from:200,to:200, titre:"Légende Absolue", icon:"👑"}
];

// Formule XP : total pour atteindre le niveau n
// Niveau 200 ≈ 107,000 XP (~97 mois de jeu régulier)
// Formule : niveau 200 atteint en ~18 mois (≈19 860 XP total)
function xpForLevel(n){
  if(n<=1)return 0;
  return Math.floor(60*(n-1)+0.2*Math.pow(n-1,2));
}

// Construit les 200 niveaux
var LEVELS=(function(){
  var arr=[];
  for(var n=1;n<=200;n++){
    var tObj=LEVEL_TITLES[0];
    for(var t=0;t<LEVEL_TITLES.length;t++){if(n>=LEVEL_TITLES[t].from&&n<=LEVEL_TITLES[t].to){tObj=LEVEL_TITLES[t];break}}
    arr.push({nv:n,titre:tObj.titre,icon:tObj.icon,xp:xpForLevel(n)});
  }
  return arr;
})();

function getLvl(xp){var cur=LEVELS[0];for(var i=0;i<LEVELS.length;i++){if(xp>=LEVELS[i].xp)cur=LEVELS[i];else break}return cur}
function getNextLvl(xp){for(var i=0;i<LEVELS.length;i++){if(LEVELS[i].xp>xp)return LEVELS[i]}return null}

// ===================================================
//  STORAGE (localStorage + fallback memoire)
// ===================================================
var M={};
function sg(k){try{var r=localStorage.getItem(k);return r?JSON.parse(r):null}catch(e){return M[k]||null}}
function ss(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){M[k]=v}}
function gq(){return sg("bq_"+BOSS.id)||{}}
function sq(id,v){var s=gq();s[id]=v;ss("bq_"+BOSS.id,s)}
function gv(){return sg("boss_vaincus")||[]}
function mv(id){var v=gv();if(v.indexOf(id)<0){v.push(id);ss("boss_vaincus",v)}}
function iv(id){return gv().indexOf(id)>=0}

// XP global : banques (boss vaincus) + en cours (boss actuel)
function getBankedXP(){return sg("player_xp")||0}
function bankXP(amount){ss("player_xp",(getBankedXP()+amount))}
function getTotalXP(){return getBankedXP()+xpe()}

function updatePlayerBar(){
  var total=getTotalXP(),lvl=getLvl(total),next=getNextLvl(total);
  var pct=next?Math.round((total-lvl.xp)/(next.xp-lvl.xp)*100):100;
  document.getElementById("plvl-num").textContent="Nv. "+lvl.nv;
  document.getElementById("plvl-title").textContent=lvl.icon+" "+lvl.titre;
  document.getElementById("pxp-fill").style.width=pct+"%";
  document.getElementById("ptot").textContent=total+" XP total";
  if(next){
    document.getElementById("pxp-cur").textContent=(total-lvl.xp)+" / "+(next.xp-lvl.xp)+" XP";
    document.getElementById("pxp-next").textContent=(next.xp-total)+" XP pour "+next.titre;
  } else {
    document.getElementById("pxp-cur").textContent=total+" XP";
    document.getElementById("pxp-next").textContent="Niveau max atteint 👑";
  }
}

// ===================================================
//  NAVIGATION
// ===================================================
function go(name,btn){
  document.querySelectorAll(".pg").forEach(function(p){p.classList.remove("on")});
  document.querySelectorAll(".tab").forEach(function(t){t.classList.remove("on")});
  document.getElementById("pg-"+name).classList.add("on");
  if(btn)btn.classList.add("on");
  if(name==="archives")renderArch();
}

// ===================================================
//  BOSS INIT
// ===================================================
function init(){
  document.title=BOSS.nom+" - Boss Fight | Boss Fight";
  tx("pbadge","\u2694 "+cap(BOSS.pilier));
  tx("bprd",BOSS.periode);
  tx("bnom",BOSS.nom);
  tx("btag",BOSS.tagline);
  tx("bsubt",BOSS.sousTitre||"");
  tx("blore",BOSS.lore);
  tx("xtot",BOSS.quetes.reduce(function(a,q){return a+q.xp},0)+" XP");
  document.getElementById("gi").src=BOSS.gif;
  initTimer();
  renderQ();updateHP();updatePlayerBar();updVBtn();
  if(iv(BOSS.id))showDB();
}

// ── TIMER COUNTDOWN ──
function initTimer(){
  if(!BOSS.dateFin){document.getElementById("timer-display").innerHTML='<span class="timer-expired">Pas de date limite définie</span>';return}
  function tick(){
    var now=new Date().getTime();
    var end=new Date(BOSS.dateFin).getTime();
    var start=BOSS.dateDebut?new Date(BOSS.dateDebut).getTime():null;
    if(start&&now<start){
      document.getElementById("timer-display").innerHTML='<span class="timer-expired">\u23f3 Ce Boss n’est pas encore disponible</span>';
      return;
    }
    var diff=end-now;
    if(diff<=0){
      document.getElementById("timer-display").innerHTML='<span class="timer-expired">\u23f0 Le temps est écoulé !</span>';
      renderQ();updVBtn();
      return;
    }
    var j=Math.floor(diff/(1000*60*60*24));
    var h=Math.floor((diff%(1000*60*60*24))/(1000*60*60));
    var m=Math.floor((diff%(1000*60*60))/(1000*60));
    var s=Math.floor((diff%(1000*60))/1000);
    var urgent=diff<86400000; // < 24h
    function fmt(n){return n<10?"0"+n:""+n}
    var cls=urgent?' class="timer-soon"':'';
    document.getElementById("t-j").innerHTML='<span'+cls+'>'+j+'</span>';
    document.getElementById("t-h").innerHTML='<span'+cls+'>'+fmt(h)+'</span>';
    document.getElementById("t-m").innerHTML='<span'+cls+'>'+fmt(m)+'</span>';
    document.getElementById("t-s").innerHTML='<span'+cls+'>'+fmt(s)+'</span>';
    setTimeout(tick,1000);
  }
  tick();
}

function renderQ(){
  var list=document.getElementById("ql"),state=gq(),def=iv(BOSS.id)||isBossExpired()||!isBossStarted();
  list.innerHTML="";
  BOSS.quetes.forEach(function(q,i){
    var ch=!!state[q.id];
    var d=document.createElement("div");
    d.className="q"+(ch?" ok":"");d.style.animationDelay=i*0.07+"s";
    d.innerHTML='<label><input type="checkbox" id="c'+q.id+'"'+(ch?" checked":"")+(def?" disabled":"")+'>'+
      '<span class="ck"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><polyline points="20 6 9 17 4 12"/></svg></span>'+
      '<span class="qb"><span class="qn">'+q.label+'</span><span class="qd">'+q.desc+'</span></span>'+
      '<span class="qxv">+'+q.xp+' XP</span></label>';
    if(!def)(function(qq,dd){dd.querySelector("input").addEventListener("change",function(){sq(qq.id,this.checked);dd.classList.toggle("ok",this.checked);if(this.checked)hit();updateHP();updVBtn()})})(q,d);
    list.appendChild(d);
  });
}

function isBossExpired(){
  if(!BOSS.dateFin)return false;
  return new Date().getTime()>new Date(BOSS.dateFin).getTime();
}
function isBossStarted(){
  if(!BOSS.dateDebut)return true;
  return new Date().getTime()>=new Date(BOSS.dateDebut).getTime();
}
function prog(){var s=gq(),n=0;BOSS.quetes.forEach(function(q){if(s[q.id])n++});var t=BOSS.quetes.length;return{n:n,t:t,p:t?Math.round(n/t*100):0}}
function xpe(){var s=gq(),x=0;BOSS.quetes.forEach(function(q){if(s[q.id])x+=q.xp});return x}

function updateHP(){
  var r=prog(),hp=100-r.p,f=document.getElementById("hpf");
  f.style.width=hp+"%";
  f.style.background=hp<=20?"linear-gradient(90deg,#7F1D1D,#DC2626)":hp<=50?"linear-gradient(90deg,#92400E,#F59E0B)":"linear-gradient(90deg,#7F1D1D,#DC2626,#FF4444)";
  tx("hpv",hp+"%");tx("hprg",r.p+"% accompli");tx("qct",r.n+"/"+r.t+" qu\u00eates");tx("qxe",xpe()+" XP gagn\u00e9s");updatePlayerBar();
}

function hit(){
  var w=document.getElementById("gw");w.classList.add("hit");
  var p=document.createElement("div");p.className="dmg";
  p.textContent="-"+(Math.floor(Math.random()*60+40));
  p.style.left=(Math.random()*60+20)+"%";p.style.top=(Math.random()*30+5)+"%";
  w.appendChild(p);setTimeout(function(){w.classList.remove("hit");p.remove()},600);
}

function updVBtn(){var r=prog(),b=document.getElementById("bv");r.p===100&&!iv(BOSS.id)&&!isBossExpired()?b.classList.remove("hn"):b.classList.add("hn")}

function showDB(){
  var c=document.getElementById("bmain").querySelector(".wrap");
  var b=document.createElement("div");b.className="db";
  b.innerHTML='<span class="di">\ud83c\udfc6</span><div><div class="dt">Boss Vaincu !</div><div class="ds">Tu as d\u00e9j\u00e0 terras\u00e9 '+BOSS.nom+'. Consulte tes archives.</div></div>';
  c.insertBefore(b,c.firstChild);
  document.querySelectorAll(".q input").forEach(function(cb){cb.disabled=true});
  document.getElementById("bv").classList.add("hn");
}

function doVictory(){
  if(!confirm("Confirmer la victoire contre "+BOSS.nom+" ?"))return;
  var lvlBefore=getLvl(getTotalXP());
  var bossXP=BOSS.quetes.reduce(function(a,q){return a+q.xp},0);
  bankXP(bossXP);
  mv(BOSS.id);
  var lvlAfter=getLvl(getTotalXP());
  explosion();
  if(lvlAfter.nv>lvlBefore.nv){
    setTimeout(function(){showLevelUp(lvlAfter)},2600);
    setTimeout(function(){showDB();renderQ();updatePlayerBar()},5000);
  } else {
    setTimeout(function(){showDB();renderQ();updatePlayerBar()},2500);
  }
}

function showLevelUp(lvl){
  var o=document.createElement("div");o.className="luo";
  o.innerHTML='<div class="luc"><div class="luc-sub">Niveau supérieur débloqué</div><span class="luc-num">'+lvl.icon+' Nv. '+lvl.nv+'</span><div class="luc-tit">'+lvl.titre+'</div><div class="luc-desc">Continue comme ça, Héros. La légende se construit quête par quête.</div></div>';
  for(var i=0;i<20;i++){var p=document.createElement("div");p.className="lup";p.style.cssText="left:"+Math.random()*100+"vw;top:"+Math.random()*100+"vh;animation-delay:"+Math.random()*.5+"s;animation-duration:"+(Math.random()+1.5)+"s";o.appendChild(p)}
  document.body.appendChild(o);
  setTimeout(function(){o.classList.add("out");setTimeout(function(){o.remove()},500)},2200);
}

function explosion(){
  var o=document.createElement("div");o.className="vo";
  o.innerHTML='<div class="vc"><span class="vcr">\ud83d\udc51</span><div class="vt">BOSS VAINCU !</div><div class="vs">Tu as terras\u00e9 le Boss. La l\u00e9gende continue.</div></div>';
  for(var i=0;i<28;i++){var p=document.createElement("div");p.className="vp";p.style.cssText="left:"+Math.random()*100+"vw;top:"+Math.random()*100+"vh;animation-delay:"+Math.random()*.8+"s;animation-duration:"+(Math.random()+1.2)+"s";o.appendChild(p)}
  document.body.appendChild(o);
  setTimeout(function(){o.classList.add("out");setTimeout(function(){o.remove()},500)},2400);
}

// ===================================================
//  ARCHIVES
// ===================================================
function renderArch(){
  var v=gv(),list=document.getElementById("al");list.innerHTML="";
  var nv=ARCHIVES.filter(function(b){return v.indexOf(b.id)>=0}).length;
  tx("sv",nv);tx("st",ARCHIVES.length);tx("sxp",getBankedXP()+" XP");
  if(!ARCHIVES.length){list.innerHTML='<div class="es"><div class="ei">\ud83d\udde1\ufe0f</div><div class="et">Aucun boss encore archiv\u00e9.</div></div>';return}
  ARCHIVES.forEach(function(b,i){
    var vn=v.indexOf(b.id)>=0,cur=b.id===BOSS.id;
    var c=document.createElement("div");
    c.className="arc"+(vn?" vn":"")+(cur?" ec":"")+((!vn&&!cur)?" lkc":"");
    c.style.animationDelay=i*0.09+"s";
    var bdg=cur?'<span class="bd cr">\u2694 En cours</span>':vn?'<span class="bd vn">\u2705 Vaincu</span>':'<span class="bd lk">\ud83d\udd12 Non affronт\u00e9</span>';
    c.innerHTML='<div class="ai">'+
      '<div class="ath'+((!vn&&!cur)?" lk":"")+'">'+(vn||cur?'<img src="'+b.gif+'" alt="'+b.nom+'"/>':'<div class="li">\ud83d\udd12</div>')+'</div>'+
      '<div class="aif"><div class="am"><span class="api">'+pi(b.pilier)+" "+cap(b.pilier)+'</span>'+bdg+'</div>'+
      '<div class="ano">'+b.nom+'</div><div class="atg">'+b.tagline+'</div><div class="apr">'+b.periode+'</div></div>'+
      (cur?'<button class="ago" onclick="backBoss()">Combattre \u2192</button>':'')+'</div>';
    list.appendChild(c);
  });
}

function backBoss(){go("boss",document.getElementById("t-boss"));document.getElementById("t-arch").classList.remove("on")}
function tx(id,v){var e=document.getElementById(id);if(e)e.textContent=v}
function cap(s){return s?s[0].toUpperCase()+s.slice(1):""}
function pi(p){return{fitness:"\ud83d\udcaa",grooming:"\u2728",style:"\ud83d\udc55",mindset:"\ud83e\udde0",social:"\ud83e\udd1d"}[p]||"\u2694"}

document.addEventListener("DOMContentLoaded",init);