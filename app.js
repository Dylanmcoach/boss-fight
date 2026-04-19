// ============================================================
//  app.js — Logique principale Boss Fight
//  Système 3 niveaux : Normal → Expert → Heaven
// ============================================================

// ── NIVEAUX XP ─────────────────────────────────────────────
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

function xpForLevel(n){if(n<=1)return 0;return Math.floor(60*(n-1)+0.2*Math.pow(n-1,2))}

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

// ── STORAGE ────────────────────────────────────────────────
var M={};
function sg(k){try{var r=localStorage.getItem(k);return r?JSON.parse(r):null}catch(e){return M[k]||null}}
function ss(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){M[k]=v}}

function getQuetes(lvl){return sg("bq_"+lvl+"_"+BOSS.id)||{}}
function saveQuete(lvl,id,v){var s=getQuetes(lvl);s[id]=v;ss("bq_"+lvl+"_"+BOSS.id,s)}
function getVaincus(){return sg("boss_vaincus")||[]}
function mv(id){var v=getVaincus();if(v.indexOf(id)<0){v.push(id);ss("boss_vaincus",v)}}
function iv(id){return getVaincus().indexOf(id)>=0}
function getBankedXP(){return sg("player_xp")||0}
function bankXP(amount){ss("player_xp",(getBankedXP()+amount))}

// ── NIVEAU ACTIF ───────────────────────────────────────────
var activeLvl = "normal";

function getQuetesList(lvl){
  if(lvl==="normal") return BOSS.quetesNormal||[];
  if(lvl==="expert") return BOSS.quetesExpert||[];
  if(lvl==="heaven") return BOSS.quetesHeaven||[];
  return [];
}

function isLvlComplete(lvl){
  var qs=getQuetesList(lvl),state=getQuetes(lvl);
  return qs.length>0 && qs.every(function(q){return state[q.id]});
}

function isLvlUnlocked(lvl){
  if(lvl==="normal") return true;
  if(lvl==="expert") return isLvlComplete("normal");
  if(lvl==="heaven") return isLvlComplete("expert");
  return false;
}

function xpeForLvl(lvl){
  var s=getQuetes(lvl),x=0;
  getQuetesList(lvl).forEach(function(q){if(s[q.id])x+=q.xp});
  return x;
}

function getTotalXPThisBoss(){
  return xpeForLvl("normal")+xpeForLvl("expert")+xpeForLvl("heaven");
}

function getTotalXP(){return getBankedXP()+getTotalXPThisBoss()}

// ── NAVIGATION ─────────────────────────────────────────────
function go(name,btn){
  document.querySelectorAll(".pg").forEach(function(p){p.classList.remove("on")});
  document.querySelectorAll(".tab").forEach(function(t){t.classList.remove("on")});
  document.getElementById("pg-"+name).classList.add("on");
  if(btn)btn.classList.add("on");
  if(name==="archives")renderArch();
}

// ── INIT ───────────────────────────────────────────────────
function init(){
  document.title=BOSS.nom+" - Boss Fight";
  tx("pbadge","⚔ "+cap(BOSS.pilier));
  tx("bprd",BOSS.periode);
  tx("bnom",BOSS.nom);
  tx("btag",BOSS.tagline);
  tx("bsubt",BOSS.sousTitre||"");
  tx("blore",BOSS.lore);
  var allQ=(BOSS.quetesNormal||[]).concat(BOSS.quetesExpert||[]).concat(BOSS.quetesHeaven||[]);
  var totalXP=allQ.reduce(function(a,q){return a+q.xp},0);
  var normalXP=(BOSS.quetesNormal||[]).reduce(function(a,q){return a+q.xp},0);
  tx("xtot",normalXP+" → "+totalXP+" XP");
  document.getElementById("gi").src=BOSS.gif;
  initTimer();
  renderLvlTabs();
  renderQuetes();
  updateHP();
  updatePlayerBar();
  updVBtn();
  if(iv(BOSS.id))showDB();
}

// ── LEVEL TABS ─────────────────────────────────────────────
function renderLvlTabs(){
  var container=document.getElementById("lvl-tabs");
  if(!container)return;
  var levels=["normal","expert","heaven"];
  var labels={"normal":"Normal","expert":"Expert","heaven":"Heaven"};
  container.innerHTML="";
  levels.forEach(function(lvl){
    var unlocked=isLvlUnlocked(lvl);
    var done=isLvlComplete(lvl);
    var btn=document.createElement("button");
    btn.className="lvl-tab "+lvl+(activeLvl===lvl?" active":"")+((!unlocked)?" locked":"")+(done&&activeLvl!==lvl?" done":"");
    btn.textContent=labels[lvl];
    if(unlocked){
      btn.onclick=(function(l){return function(){switchLvl(l)}})(lvl);
    }
    container.appendChild(btn);
  });

  // XP chips
  var xpRow=document.getElementById("lvl-xp-row");
  if(xpRow){
    xpRow.innerHTML="";
    levels.forEach(function(lvl){
      if(!isLvlUnlocked(lvl))return;
      var earned=xpeForLvl(lvl);
      var total=getQuetesList(lvl).reduce(function(a,q){return a+q.xp},0);
      var chip=document.createElement("span");
      chip.className="lvl-xp-chip "+lvl;
      chip.textContent=labels[lvl]+" : "+earned+" / "+total+" XP";
      xpRow.appendChild(chip);
    });
  }
}

function switchLvl(lvl){
  if(!isLvlUnlocked(lvl))return;
  activeLvl=lvl;
  var ql=document.getElementById("ql");
  ql.className="";
  if(lvl==="expert")ql.classList.add("expert-mode");
  if(lvl==="heaven")ql.classList.add("heaven-mode");
  renderLvlTabs();
  renderQuetes();
  updateHP();
  updVBtn();
}

// ── QUETES ─────────────────────────────────────────────────
function renderQuetes(){
  var list=document.getElementById("ql"),state=getQuetes(activeLvl);
  var def=iv(BOSS.id)||isBossExpired()||!isBossStarted();
  list.innerHTML="";
  getQuetesList(activeLvl).forEach(function(q,i){
    var ch=!!state[q.id];
    var isBonus=!!q.bonus;
    var d=document.createElement("div");
    d.className="q"+(ch?" ok":"")+(isBonus?" bq":"");
    d.style.animationDelay=i*0.07+"s";
    d.innerHTML='<label><input type="checkbox" id="c'+q.id+'"'+(ch?" checked":"")+(def?" disabled":"")+'>'+
      '<span class="ck'+(isBonus?" ckb":"")+'"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><polyline points="20 6 9 17 4 12"/></svg></span>'+
      '<span class="qb"><span class="qn">'+q.label+'</span><span class="qd">'+q.desc+'</span></span>'+
      '<span class="qxv'+(isBonus?" qxvb":"")+'">+'+q.xp+' XP</span></label>';
    if(!def)(function(qq,dd,lv){dd.querySelector("input").addEventListener("change",function(){
      saveQuete(lv,qq.id,this.checked);
      dd.classList.toggle("ok",this.checked);
      if(this.checked)hit();
      updateHP();updatePlayerBar();updVBtn();
      renderLvlTabs();
      // Auto-unlock next level notification
      if(isLvlComplete(lv)){
        if(lv==="normal"&&!isLvlComplete("expert")) showUnlock("Expert");
        if(lv==="expert"&&!isLvlComplete("heaven")) showUnlock("Heaven");
      }
    })})(q,d,activeLvl);
    list.appendChild(d);
  });
}

function showUnlock(levelName){
  var colors={"Expert":"#F59E0B","Heaven":"#EC4899"};
  var n=document.createElement("div");
  n.style.cssText="position:fixed;bottom:30px;left:50%;transform:translateX(-50%);"+
    "background:var(--bgc);border:1px solid "+colors[levelName]+";border-radius:12px;"+
    "padding:14px 24px;font-family:var(--fh);font-size:.85rem;color:"+colors[levelName]+";"+
    "letter-spacing:.08em;z-index:500;animation:fu .4s ease;text-align:center;"+
    "box-shadow:0 4px 20px rgba(0,0,0,.5)";
  n.innerHTML="🔓 Niveau <b>"+levelName+"</b> débloqué !";
  document.body.appendChild(n);
  setTimeout(function(){n.style.opacity="0";n.style.transition="opacity .5s";setTimeout(function(){n.remove()},500)},3000);
}

// ── HP BAR ─────────────────────────────────────────────────
function prog(){
  var qs=getQuetesList(activeLvl),state=getQuetes(activeLvl),done=0;
  qs.forEach(function(q){if(state[q.id])done++});
  var t=qs.length;
  return{done:done,total:t,p:t?Math.round(done/t*100):0};
}

function updateHP(){
  var r=prog(),hp=100-r.p,f=document.getElementById("hpf");
  if(!f)return;
  f.style.width=hp+"%";
  if(activeLvl==="heaven") f.style.background="linear-gradient(90deg,#831843,#EC4899,#F9A8D4)";
  else if(activeLvl==="expert") f.style.background="linear-gradient(90deg,#92400E,#F59E0B,#FCD34D)";
  else f.style.background=hp<=20?"linear-gradient(90deg,#7F1D1D,#DC2626)":hp<=50?"linear-gradient(90deg,#92400E,#F59E0B)":"linear-gradient(90deg,#7F1D1D,#DC2626,#FF4444)";
  tx("hpv",hp+"%");
  tx("hprg",r.p+"% accompli");
  tx("qct",r.done+"/"+r.total+" quêtes");
  tx("qxe",getTotalXPThisBoss()+" XP gagnés");
  updatePlayerBar();
}

function hit(){
  var w=document.getElementById("gw");w.classList.add("hit");
  var p=document.createElement("div");p.className="dmg";
  p.textContent="-"+(Math.floor(Math.random()*60+40));
  p.style.left=(Math.random()*60+20)+"%";p.style.top=(Math.random()*30+5)+"%";
  w.appendChild(p);setTimeout(function(){w.classList.remove("hit");p.remove()},600);
}

// ── PLAYER BAR ─────────────────────────────────────────────
function updatePlayerBar(){
  var total=getTotalXP(),lvl=getLvl(total),next=getNextLvl(total);
  var pct=next?Math.round((total-lvl.xp)/(next.xp-lvl.xp)*100):100;
  tx("plvl-num","Nv. "+lvl.nv);
  tx("plvl-title",lvl.icon+" "+lvl.titre);
  document.getElementById("pxp-fill").style.width=pct+"%";
  tx("ptot",total+" XP total");
  if(next){tx("pxp-cur",(total-lvl.xp)+" / "+(next.xp-lvl.xp)+" XP");tx("pxp-next",(next.xp-total)+" XP pour "+next.titre);}
  else{tx("pxp-cur",total+" XP");tx("pxp-next","Niveau max atteint 👑");}
}

// ── VICTORY ────────────────────────────────────────────────
function updVBtn(){
  var b=document.getElementById("bv");
  var normalDone=isLvlComplete("normal");
  var expired=isBossExpired();
  if(normalDone&&!iv(BOSS.id)&&!expired) b.classList.remove("hn");
  else b.classList.add("hn");
}

function showDB(){
  var c=document.getElementById("bmain").querySelector(".wrap");
  if(c.querySelector(".db"))return;
  var b=document.createElement("div");b.className="db";
  var lvls=[];
  if(isLvlComplete("normal"))lvls.push("Normal");
  if(isLvlComplete("expert"))lvls.push("Expert");
  if(isLvlComplete("heaven"))lvls.push("Heaven");
  b.innerHTML='<span class="di">🏆</span><div><div class="dt">Boss Vaincu !</div><div class="ds">Niveaux complétés : '+lvls.join(" · ")+' — '+getTotalXPThisBoss()+' XP gagnés.</div></div>';
  c.insertBefore(b,c.firstChild);
  document.querySelectorAll(".q input").forEach(function(cb){cb.disabled=true});
  document.getElementById("bv").classList.add("hn");
}

function doVictory(){
  if(!confirm("Confirmer la victoire contre "+BOSS.nom+" ?"))return;
  var lvlBefore=getLvl(getTotalXP());
  bankXP(getTotalXPThisBoss());
  mv(BOSS.id);
  var lvlAfter=getLvl(getTotalXP());
  explosion();
  if(lvlAfter.nv>lvlBefore.nv){
    setTimeout(function(){showLevelUp(lvlAfter)},2600);
    setTimeout(function(){showDB();renderQuetes();renderLvlTabs();updatePlayerBar()},5000);
  } else {
    setTimeout(function(){showDB();renderQuetes();renderLvlTabs();updatePlayerBar()},2500);
  }
}

function explosion(){
  var o=document.createElement("div");o.className="vo";
  o.innerHTML='<div class="vc"><span class="vcr">👑</span><div class="vt">BOSS VAINCU !</div><div class="vs">Tu as terrassé le Boss. La légende continue.</div></div>';
  for(var i=0;i<28;i++){var p=document.createElement("div");p.className="vp";p.style.cssText="left:"+Math.random()*100+"vw;top:"+Math.random()*100+"vh;animation-delay:"+Math.random()*.8+"s;animation-duration:"+(Math.random()+1.2)+"s";o.appendChild(p)}
  document.body.appendChild(o);
  setTimeout(function(){o.classList.add("out");setTimeout(function(){o.remove()},500)},2400);
}

function showLevelUp(lvl){
  var o=document.createElement("div");o.className="luo";
  o.innerHTML='<div class="luc"><div class="luc-sub">Niveau supérieur débloqué</div><span class="luc-num">'+lvl.icon+' Nv. '+lvl.nv+'</span><div class="luc-tit">'+lvl.titre+'</div><div class="luc-desc">Continue comme ça, Héros.</div></div>';
  for(var i=0;i<20;i++){var p=document.createElement("div");p.className="lup";p.style.cssText="left:"+Math.random()*100+"vw;top:"+Math.random()*100+"vh;animation-delay:"+Math.random()*.5+"s;animation-duration:"+(Math.random()+1.5)+"s";o.appendChild(p)}
  document.body.appendChild(o);
  setTimeout(function(){o.classList.add("out");setTimeout(function(){o.remove()},500)},2200);
}

// ── TIMER ──────────────────────────────────────────────────
function isBossExpired(){if(!BOSS.dateFin)return false;return new Date().getTime()>new Date(BOSS.dateFin).getTime()}
function isBossStarted(){if(!BOSS.dateDebut)return true;return new Date().getTime()>=new Date(BOSS.dateDebut).getTime()}

function initTimer(){
  if(!BOSS.dateFin){document.getElementById("timer-display").innerHTML='<span class="timer-expired">Pas de date limite définie</span>';return}
  function tick(){
    var now=new Date().getTime(),end=new Date(BOSS.dateFin).getTime();
    var start=BOSS.dateDebut?new Date(BOSS.dateDebut).getTime():null;
    if(start&&now<start){document.getElementById("timer-display").innerHTML='<span class="timer-expired">⏳ Ce Boss n\'est pas encore disponible</span>';return}
    var diff=end-now;
    if(diff<=0){document.getElementById("timer-display").innerHTML='<span class="timer-expired">⏰ Le temps est écoulé !</span>';renderQuetes();updVBtn();return}
    var j=Math.floor(diff/(1000*60*60*24)),h=Math.floor((diff%(1000*60*60*24))/(1000*60*60));
    var m=Math.floor((diff%(1000*60*60))/(1000*60)),s=Math.floor((diff%(1000*60))/1000);
    var urgent=diff<86400000;
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

// ── ARCHIVES ───────────────────────────────────────────────
function renderArch(){
  var v=getVaincus(),list=document.getElementById("al");list.innerHTML="";
  var nv=ARCHIVES.filter(function(b){return v.indexOf(b.id)>=0}).length;
  tx("sv",nv);tx("st",ARCHIVES.length);tx("sxp",getBankedXP()+" XP");
  if(!ARCHIVES.length){list.innerHTML='<div class="es"><div class="ei">🗡️</div><div class="et">Aucun boss encore archivé.</div></div>';return}
  ARCHIVES.forEach(function(b,i){
    var vn=v.indexOf(b.id)>=0,cur=b.id===BOSS.id;
    var c=document.createElement("div");
    c.className="arc"+(vn?" vn":"")+(cur?" ec":"")+((!vn&&!cur)?" lkc":"");
    c.style.animationDelay=i*0.09+"s";
    var bdg=cur?'<span class="bd cr">⚔ En cours</span>':vn?'<span class="bd vn">✅ Vaincu</span>':'<span class="bd lk">🔒 Non affronté</span>';
    c.innerHTML='<div class="ai">'+
      '<div class="aif"><div class="am"><span class="api">'+pi(b.pilier)+" "+cap(b.pilier)+'</span>'+bdg+'</div>'+
      '<div class="ano">'+b.nom+'</div><div class="atg">'+b.tagline+'</div><div class="apr">'+b.periode+'</div></div>'+
      (cur?'<button class="ago" onclick="backBoss()">Combattre →</button>':'')+'</div>';
    list.appendChild(c);
  });
}

function backBoss(){go("boss",document.getElementById("t-boss"));document.getElementById("t-arch").classList.remove("on")}
function tx(id,v){var e=document.getElementById(id);if(e)e.textContent=v}
function cap(s){return s?s[0].toUpperCase()+s.slice(1):""}
function pi(p){return{fitness:"💪",grooming:"✨",style:"👕",mindset:"🧠",social:"🤝"}[p]||"⚔"}

document.addEventListener("DOMContentLoaded",init);
