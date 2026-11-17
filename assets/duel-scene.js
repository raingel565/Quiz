/* Гранд Лайн — сцена дуэли (stickman). Общий модуль для grandline-game.html и grandline-coop.html.
   Сцена ничего не решает: она только показывает готовый результат runDuel по раундам. */
(function(){
'use strict';
if(window.DuelScene)return;
const NS='http://www.w3.org/2000/svg';
const CSS=`
#ds_scene{position:relative;width:100%;aspect-ratio:16/9;border-radius:14px;overflow:hidden;flex:0 0 auto;background:linear-gradient(#1b2433 0%,#3a2e46 46%,#d98a55 66%,#f0b26b 67%,#6b4a2c 67.3%,#2a1d12 100%);box-shadow:0 12px 34px rgba(0,0,0,.45);isolation:isolate;container-type:size;color:#eef3f8;font-family:inherit;user-select:none}
#ds_scene.ds-shake #ds_stage,#ds_scene.ds-shake .ds-sun,#ds_scene.ds-shake .ds-deck{animation:ds_shake .3s}
@keyframes ds_shake{0%,100%{transform:translate(0)}20%{transform:translate(-2px,1px)}45%{transform:translate(2px,-1px)}70%{transform:translate(-1px,1px)}}
#ds_scene .ds-sun{position:absolute;left:50%;top:40%;width:16%;aspect-ratio:1;transform:translateX(-50%);border-radius:50%;background:radial-gradient(#ffd89a,#ff9a55 60%,transparent 70%);opacity:.9}
#ds_scene .ds-deck{position:absolute;left:0;right:0;bottom:0;height:33%;background:repeating-linear-gradient(90deg,transparent 0 11.5%,rgba(0,0,0,.28) 11.5% 12%),linear-gradient(#7a5532,#3a2815)}
#ds_scene .ds-vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 55%,transparent 45%,rgba(0,0,0,.55));pointer-events:none;z-index:8}
#ds_stage{position:absolute;inset:0;width:100%;height:100%;z-index:4;overflow:visible}
#ds_scene .ds-rim{filter:drop-shadow(0 0 5px var(--g))}
#ds_scene .ds-hud{position:absolute;left:0;right:0;top:0;display:flex;justify-content:space-between;padding:2.2cqh 2.4cqw;z-index:9;gap:12px;pointer-events:none}
#ds_scene .ds-pl{display:flex;flex-direction:column;gap:.8cqh;min-width:0;max-width:46%}#ds_scene .ds-pl.ds-r{align-items:flex-end}
#ds_scene .ds-nm{font-weight:800;font-size:2.6cqw;line-height:1.15;text-shadow:0 2px 6px #000;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
#ds_scene .ds-pips{display:flex;gap:.7cqw}
#ds_scene .ds-pip{width:3.6cqw;height:1.4cqw;border-radius:99px;background:var(--c);box-shadow:0 0 12px var(--g);transition:all .35s}
#ds_scene .ds-pip.ds-off{background:#2a3038;box-shadow:none;transform:scale(.9)}
#ds_scene .ds-abw{position:absolute;top:17%;z-index:9;transform:translateX(-50%);pointer-events:none}
#ds_scene .ds-abw.ds-l{left:27%}#ds_scene .ds-abw.ds-r{left:73%}
#ds_scene .ds-abn{font-weight:800;font-size:2.7cqw;color:#ffd45a;background:rgba(0,0,0,.62);padding:.6cqw 1.8cqw;border-radius:99px;text-shadow:0 2px 6px #000;opacity:0;white-space:nowrap;border:1px solid rgba(255,212,90,.5)}
#ds_scene .ds-flash{position:absolute;inset:0;background:#fff;opacity:0;z-index:7;pointer-events:none}
#ds_banner{position:absolute;left:0;right:0;top:38%;text-align:center;z-index:10;font-weight:900;font-size:6.4cqw;letter-spacing:.04em;text-shadow:0 4px 0 rgba(0,0,0,.5),0 0 30px rgba(0,0,0,.7);opacity:0;pointer-events:none;padding:0 3%}
#ds_sub{position:absolute;left:0;right:0;top:55%;text-align:center;z-index:10;opacity:0;font-size:2.4cqw;font-weight:700;text-shadow:0 2px 6px #000;pointer-events:none;padding:0 4%}
#ds_scene .ds-fastb{position:absolute;right:1.6cqw;bottom:2.2cqh;z-index:11;font-size:2.2cqw;font-weight:800;color:#fff;background:rgba(0,0,0,.45);border-radius:99px;padding:.4cqw 1.4cqw;opacity:0;transition:opacity .2s;pointer-events:none}
#ds_scene.ds-fast .ds-fastb{opacity:.9}
#ds_scene[data-bg=admiral]{background:linear-gradient(#1d2a44 0%,#9a3f4a 46%,#f0a070 66%,#8a96a8 67%,#1f2a3a 100%)}
#ds_scene[data-bg=admiral] .ds-deck{background:repeating-linear-gradient(90deg,transparent 0 9%,rgba(0,0,0,.35) 9% 9.4%),linear-gradient(#56657a,#1f2a3a)}
#ds_scene[data-bg=admiral] .ds-sun{background:radial-gradient(#ffc0a0,#e0553a 60%,transparent 70%)}
#ds_scene[data-bg=boss]{background:linear-gradient(#070a14 0%,#1f2550 48%,#3f3566 66%,#222c44 67%,#0c111c 100%)}
#ds_scene[data-bg=boss] .ds-deck{background:repeating-linear-gradient(90deg,transparent 0 11%,rgba(120,150,255,.12) 11% 11.4%),linear-gradient(#27324a,#0c111c)}
#ds_scene[data-bg=boss] .ds-sun{background:radial-gradient(#cfd8ff,#6674c8 55%,transparent 70%);opacity:.55;width:11%}
#ds_scene[data-bg=guardian]{background:linear-gradient(#0b1519 0%,#16413f 48%,#6fd0b8 66%,#3d4a4c 67%,#141c1e 100%)}
#ds_scene[data-bg=guardian] .ds-deck{background:repeating-linear-gradient(90deg,transparent 0 13%,rgba(110,255,225,.45) 13% 13.5%),linear-gradient(#46585a,#141c1e)}
#ds_scene[data-bg=guardian] .ds-sun{background:radial-gradient(#d8fff4,#4fd1c5 55%,transparent 70%);opacity:.6}
#ds_scene[data-bg=sea]{background:linear-gradient(#031a33 0%,#0b4f7a 50%,#2fa6d8 66%,#14506e 67%,#04182a 100%)}
#ds_scene[data-bg=sea] .ds-deck{background:repeating-linear-gradient(90deg,transparent 0 12%,rgba(160,230,255,.18) 12% 12.4%),linear-gradient(#1d6d8f,#04182a)}
#ds_scene[data-bg=sea] .ds-sun{background:radial-gradient(#eafcff,#4fb6ff 55%,transparent 70%);opacity:.5}
#ds_scene[data-bg=imu]{background:linear-gradient(#060104 0%,#2a0510 50%,#6a0c20 66%,#14060a 67%,#050102 100%)}
#ds_scene[data-bg=imu] .ds-deck{background:repeating-linear-gradient(90deg,transparent 0 16%,rgba(255,40,70,.25) 16% 16.4%),linear-gradient(#2a0a12,#050102)}
#ds_scene[data-bg=imu] .ds-sun{background:radial-gradient(#ff5a6a,#8a0f26 55%,transparent 70%);opacity:.75;width:22%}
`;
const ROOT=document.createElement('div');ROOT.id='ds_scene';
ROOT.innerHTML='<div class="ds-sun"></div><div class="ds-deck"></div>'
 +'<svg id="ds_stage" viewBox="0 0 960 540" preserveAspectRatio="none"><defs><radialGradient id="flameF" cx="40%" cy="40%" r="75%"><stop offset="0" stop-color="#fff2a8"/><stop offset=".45" stop-color="#ffa72a"/><stop offset="1" stop-color="#e8421a"/></radialGradient><linearGradient id="flameT" x1="1" x2="0"><stop offset="0" stop-color="#ffb43a"/><stop offset="1" stop-color="#e8421a" stop-opacity="0"/></linearGradient></defs><g id="ds_fxBack"></g><g id="ds_figs"></g><g id="ds_fxFront"></g></svg>'
 +'<div class="ds-hud"><div class="ds-pl" id="ds_h1"><div class="ds-nm" id="ds_n1"></div><div class="ds-pips" id="ds_p1"></div></div><div class="ds-pl ds-r" id="ds_h2"><div class="ds-nm" id="ds_n2"></div><div class="ds-pips" id="ds_p2"></div></div></div>'
 +'<div class="ds-abw ds-l"><div class="ds-abn" id="ds_ab1"></div></div><div class="ds-abw ds-r"><div class="ds-abn" id="ds_ab2"></div></div>'
 +'<div class="ds-flash" id="ds_flash"></div><div id="ds_banner"></div><div id="ds_sub"></div><div class="ds-vig"></div><div class="ds-fastb">⏩ ускорено</div>';
const $=id=>id==='scene'?ROOT:ROOT.querySelector('#ds_'+id);
const GROUND=438;
let speed=1,CLOCK=0,last=performance.now(),RAF=0;
const subs=new Set();
function frame(n){RAF=0;const dt=Math.min(60,n-last)*speed;last=n;CLOCK+=dt;for(const f of [...subs])f(CLOCK,dt);if(LIVE)RAF=requestAnimationFrame(frame)}
let LIVE=false;
function startClock(){LIVE=true;if(!RAF){last=performance.now();RAF=requestAnimationFrame(frame)}}
function stopClock(){LIVE=false;if(RAF){cancelAnimationFrame(RAF);RAF=0}subs.clear()}
const sleep=ms=>new Promise(res=>{const t0=CLOCK;const f=()=>{if(CLOCK-t0>=ms){subs.delete(f);res()}};subs.add(f)});
const after=(fn,ms)=>{sleep(ms||0).then(fn)};
function run(ms,cb){return new Promise(res=>{const t0=CLOCK;const f=()=>{const t=Math.min(1,(CLOCK-t0)/ms);cb(t);if(t>=1){subs.delete(f);res()}};subs.add(f)})}
const E={lin:t=>t,out:t=>1-Math.pow(1-t,3),in:t=>t*t*t,io:t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,back:t=>{const c=1.7;return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2)},bounce:t=>{const n=7.56,d=2.75;if(t<1/d)return n*t*t;if(t<2/d)return n*(t-=1.5/d)*t+.75;if(t<2.5/d)return n*(t-=2.25/d)*t+.9375;return n*(t-=2.625/d)*t+.984375}};
const rad=a=>a*Math.PI/180;

/* ---------- скелет ---------- */
// углы в градусах: 0 = вниз вдоль тела, + = вперёд. torso/head: 0 = вертикально вверх, + = вперёд.
const L={torso:66,head:17,ua:33,fa:31,th:46,sh:46};
const POSE={
 guard:  {t:10,h:-4, fu:42,fb:100, bu:22,bb:122, ft:30,fs:-8, bt:-22,bs:6,  dx:0,dy:0,rot:0},
 guard2: {t:15,h:-6, fu:46,fb:96,  bu:26,bb:118, ft:33,fs:-6, bt:-25,bs:8,  dx:0,dy:0,rot:0},
 windup: {t:-8,h:6,  fu:25,fb:125, bu:75,bb:40,  ft:22,fs:-6, bt:-30,bs:-10,dx:-14,dy:0,rot:0},
 punch:  {t:30,h:2,  fu:90,fb:0,   bu:15,bb:125, ft:48,fs:2,   bt:-38,bs:-22,dx:0,dy:0,rot:0},
 kickW:  {t:-14,h:6, fu:-10,fb:50, bu:55,bb:30,  ft:55,fs:-30, bt:-6,bs:2,   dx:-8,dy:0,rot:0},
 kick:   {t:-24,h:8, fu:-30,fb:35, bu:70,bb:25,  ft:92,fs:84,  bt:-4,bs:4,   dx:0,dy:0,rot:0},
 charge: {t:-4,h:4,  fu:20,fb:140, bu:35,bb:150, ft:20,fs:-14, bt:-28,bs:-6, dx:-6,dy:0,rot:0},
 cast:   {t:14,h:-2, fu:95,fb:-5,  bu:60,bb:20,  ft:36,fs:-4,  bt:-30,bs:-8, dx:0,dy:0,rot:0},
 hit:    {t:-30,h:-16,fu:-35,fb:25,bu:-55,bb:12, ft:8,fs:-18,  bt:-38,bs:-46,dx:0,dy:0,rot:0},
 stagger:{t:-14,h:-8,fu:-10,fb:50, bu:-25,bb:40, ft:14,fs:-12, bt:-30,bs:-30,dx:0,dy:0,rot:0},
 lie:    {t:0,h:8,   fu:110,fb:15, bu:-95,bb:10, ft:15,fs:20,  bt:-20,bs:-5, dx:0,dy:0,rot:0},
 win:    {t:4,h:-8,  fu:172,fb:0,  bu:30,bb:100, ft:22,fs:-4,  bt:-18,bs:6,  dx:0,dy:0,rot:0}
};
function mix(a,b,k){const o={};for(const p in a)o[p]=a[p]+(b[p]-a[p])*k;return o}
function solve(P){ // → точки в локальных координатах (y вниз), поворот вокруг таза, землю подгоняем
  const S=(a)=>Math.sin(rad(a)),C=(a)=>Math.cos(rad(a));
  const pel={x:0,y:0};
  const up=(a,l,o)=>({x:o.x+l*S(a),y:o.y-l*C(a)});
  const dn=(a,l,o)=>({x:o.x+l*S(a),y:o.y+l*C(a)});
  const neck=up(P.t,L.torso,pel),head=up(P.t+P.h,L.head+8,neck),sh={x:pel.x+.9*(neck.x-pel.x),y:pel.y+.9*(neck.y-pel.y)};
  const fe=dn(P.fu,L.ua,sh),fh=dn(P.fu+P.fb,L.fa,fe);
  const be=dn(P.bu,L.ua,sh),bh=dn(P.bu+P.bb,L.fa,be);
  const fk=dn(P.ft,L.th,pel),ff=dn(P.fs,L.sh,fk);
  const bk=dn(P.bt,L.th,pel),bf=dn(P.bs,L.sh,bk);
  const pts={pel,neck,head,sh,fe,fh,be,bh,fk,ff,bk,bf};
  const r=rad(P.rot||0),cs=Math.cos(r),sn=Math.sin(r);
  for(const k in pts){const p=pts[k];pts[k]={x:p.x*cs-p.y*sn,y:p.x*sn+p.y*cs}}
  let low=-1e9;for(const k of ['ff','bf','fh','bh','head','fk','bk','fe','be'])low=Math.max(low,pts[k].y+(k==='head'?17:k[1]==='h'?6:4));
  const oy=-low+(P.dy||0),ox=P.dx||0;
  for(const k in pts){pts[k]={x:pts[k].x+ox,y:pts[k].y+oy}}
  return pts}
function bone(g,a,b,w,c){const o=document.createElementNS(NS,'line'),i=document.createElementNS(NS,'line');
  for(const [e,col,ww] of [[o,c,w+5],[i,'#0d1118',w]]){e.setAttribute('stroke',col);e.setAttribute('stroke-width',ww);e.setAttribute('stroke-linecap','round');g.appendChild(e)}return (A,B)=>{for(const e of [o,i]){e.setAttribute('x1',A.x);e.setAttribute('y1',A.y);e.setAttribute('x2',B.x);e.setAttribute('y2',B.y)}}}
function circ(g,r,c){const o=document.createElementNS(NS,'circle'),i=document.createElementNS(NS,'circle');o.setAttribute('r',r+3);o.setAttribute('fill',c);i.setAttribute('r',r);i.setAttribute('fill','#0d1118');g.appendChild(o);g.appendChild(i);return (p)=>{for(const e of [o,i]){e.setAttribute('cx',p.x);e.setAttribute('cy',p.y)}}}
class Fighter{
  constructor(gEl,x,dir,col){this.g=gEl;this.x=x;this.dir=dir;this.col=col;this.pose=Object.assign({},POSE.guard);this.idle=true;this.ph=Math.random()*6;
    const g=this.inner=document.createElementNS(NS,'g');this.g.appendChild(g);
    this.sBA=bone(g,0,0,12,col);this.sBL=bone(g,0,0,15,col);this.sT=bone(g,0,0,26,col);this.sFL=bone(g,0,0,15,col);this.sFA=bone(g,0,0,12,col);
    this.sBU=bone(g,0,0,12,col);this.sFU=bone(g,0,0,12,col);this.sBT=bone(g,0,0,15,col);this.sFT=bone(g,0,0,15,col);
    this.cH=circ(g,17,col);this.cBH=circ(g,8,col);this.cFH=circ(g,8,col);
    this.band=document.createElementNS(NS,'line');this.band.setAttribute('stroke',col);this.band.setAttribute('stroke-width',6);this.band.setAttribute('stroke-linecap','round');g.appendChild(this.band);
    this.home=x;this.sc=1;this._f=(t)=>this.draw(t);subs.add(this._f)}
  destroy(){subs.delete(this._f);if(this.g.parentNode)this.g.parentNode.removeChild(this.g)}
  draw(t){let P=this.pose;
    if(this.idle){const b=(Math.sin(t/260+this.ph)+1)/2;P=mix(P,POSE.guard2,b*.7);P=Object.assign({},P,{dx:P.dx+Math.sin(t/520+this.ph)*5})}
    const p=solve(P),pts=p;this.pts=p;const sc=this.sc;if(sc!==1){const cx=(P.dx||0)*(1/sc-1),cy=(P.dy||0)*(1/sc-1);for(const k in pts){pts[k]={x:pts[k].x+cx,y:pts[k].y+cy}}}
    this.g.setAttribute('transform','translate('+this.x+','+GROUND+') scale('+(this.dir*sc)+','+sc+')');
    this.sBU(pts.sh,pts.be);this.sBA(pts.be,pts.bh);this.sBT(pts.pel,pts.bk);this.sBL(pts.bk,pts.bf);
    this.sT(pts.pel,pts.neck);
    this.cH(pts.head);
    const hx=pts.head.x,hy=pts.head.y;const a=rad(P.t+P.h+(P.rot||0));this.band.setAttribute('x1',hx-14*Math.cos(a)-0);this.band.setAttribute('y1',hy-3+14*Math.sin(a));this.band.setAttribute('x2',hx+14*Math.cos(a));this.band.setAttribute('y2',hy-3-14*Math.sin(a));
    this.sFT(pts.pel,pts.fk);this.sFL(pts.fk,pts.ff);
    this.sFU(pts.sh,pts.fe);this.sFA(pts.fe,pts.fh);
    this.cBH(pts.bh);this.cFH(pts.fh)}
  /* мировые координаты точки */
  W(k){if(!this.pts)this.draw(CLOCK);const p=this.pts[k];return {x:this.x+p.x*this.dir*this.sc,y:GROUND+p.y*this.sc}}
  async to(name,ms=200,ease=E.out,over={}){this.idle=false;const from=Object.assign({},this.pose),to=Object.assign({},typeof name==='string'?POSE[name]:name,over);
    await run(ms,t=>{this.pose=mix(from,to,ease(t))});this.pose=to}
  async seq(steps){for(const s of steps)await this.to(...s)}
  rest(){this.idle=true;this.pose=Object.assign({},POSE.guard)}
}
function attachSword(F,len=80){const g=F.inner;const mk=(c,w)=>{const l=document.createElementNS(NS,'line');l.setAttribute('stroke',c);l.setAttribute('stroke-width',w);l.setAttribute('stroke-linecap','round');g.appendChild(l);return l};
 const bo=mk('#0d1118',8),bi=mk('#f4f8ff',3.6),hd=mk('#7a4a2a',6.5),gd=mk('#d8b24a',3);
 const set=(l,a,b)=>{l.setAttribute('x1',a.x);l.setAttribute('y1',a.y);l.setAttribute('x2',b.x);l.setAttribute('y2',b.y)};
 const old=F.draw.bind(F);F.draw=function(t){old(t);const p=this.pts;let dx=p.fh.x-p.fe.x,dy=p.fh.y-p.fe.y;const n=Math.hypot(dx,dy)||1;dx/=n;dy/=n;
  const P=(k)=>({x:p.fh.x+dx*k,y:p.fh.y+dy*k});set(hd,P(-14),P(2));set(bo,P(3),P(len));set(bi,P(4),P(len-1));
  const q=P(3),px=-dy*8,py=dx*8;gd.setAttribute('x1',q.x-px);gd.setAttribute('y1',q.y-py);gd.setAttribute('x2',q.x+px);gd.setAttribute('y2',q.y+py)}}

/* ---------- эффекты ---------- */
const fxB=$('fxBack'),fxF=$('fxFront');
function el(tag,att,parent=fxF){const e=document.createElementNS(NS,tag);for(const k in att)e.setAttribute(k,att[k]);parent.appendChild(e);return e}
function burst(x,y,n=12,col='#ffe9a8',pow=1){const ps=[];for(let k=0;k<n;k++){const a=Math.random()*Math.PI*2,sp=(70+Math.random()*150)*pow;ps.push({e:el('circle',{r:2+Math.random()*3,fill:col}),vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-40})}
  return run(520,t=>{for(const p of ps){p.e.setAttribute('cx',x+p.vx*t*.45);p.e.setAttribute('cy',y+p.vy*t*.45+120*t*t);p.e.setAttribute('opacity',1-t)}if(t>=1)ps.forEach(p=>p.e.remove())})}
function ring(x,y,col='#fff',R=90){const c=el('circle',{cx:x,cy:y,r:4,fill:'none',stroke:col,'stroke-width':6});return run(380,t=>{c.setAttribute('r',4+R*E.out(t));c.setAttribute('opacity',1-t);c.setAttribute('stroke-width',6*(1-t)+1);if(t>=1)c.remove()})}
function flash(a=.5){const f=$('flash');run(220,t=>f.style.opacity=a*(1-Math.abs(t*2-1)))}
function shake(){const s=$('scene');s.classList.remove('ds-shake');void s.offsetWidth;s.classList.add('ds-shake')}
function hitFx(F,col,big){const p=F.W('head'),c=F.W('sh');const x=(p.x+c.x)/2,y=(p.y+c.y)/2;flash(big?.6:.35);ring(x,y,col,big?130:80);burst(x,y,big?22:12,col,big?1.4:1);if(big)shake()}

const ABIL={
 none:{n:'Обычный удар',col:'#ffe9a8'},
 fire:{n:'Огненный кулак',col:'#ff7a1a',
  async pre(F,T){F.to('windup',320,E.out);const ps=[];const h0=()=>F.W('fh');
   await run(520,t=>{const h=h0();if(Math.random()<.8){const a=Math.random()*6.28,r=60+Math.random()*30;ps.push({e:el('circle',{r:3+Math.random()*3,fill:Math.random()<.5?'#ffd25a':'#ff6a1a'}),a,r,l:0})}
     for(const q of ps){q.l+=.05;q.r*=.93;q.e.setAttribute('cx',h.x+Math.cos(q.a+q.l*3)*q.r);q.e.setAttribute('cy',h.y+Math.sin(q.a+q.l*3)*q.r);q.e.setAttribute('opacity',Math.min(1,q.l*4)*(q.r>6?1:0))}});
   ps.forEach(q=>q.e.remove())},
  async fx(F,T){
   await F.to('cast',150,E.out);
   const g=el('g',{});const glow=el('ellipse',{cx:-5,cy:0,rx:70,ry:60,fill:'#ff7a1a',opacity:.55,filter:'blur(10px)'},g);
   const tail=el('path',{d:'M-40 -30 Q-130 -12 -190 0 Q-130 12 -40 30Z',fill:'url(#flameT)',opacity:.85},g);
   const body=el('g',{},g);
   const fill='url(#flameF)',stk='#b8340a';
   el('rect',{x:-42,y:-34,width:74,height:68,rx:22,fill,stroke:stk,'stroke-width':3},body);
   for(const y of [-25,-8.5,8.5,25])el('circle',{cx:30,cy:y,r:13,fill,stroke:stk,'stroke-width':3},body);
   el('ellipse',{cx:6,cy:-38,rx:22,ry:11,fill,stroke:stk,'stroke-width':3,transform:'rotate(-14 6 -38)'},body);
   for(const y of [-17,0,17])el('line',{x1:26,y1:y,x2:44,y2:y,stroke:stk,'stroke-width':2.4,'stroke-linecap':'round'},body);
   el('ellipse',{cx:-4,cy:-6,rx:26,ry:18,fill:'#fff3b0',opacity:.7,filter:'blur(5px)'},body);
   const place=(x,y,s,rot)=>g.setAttribute('transform','translate('+x+','+y+') scale('+(F.dir*s)+','+s+') rotate('+(rot||0)+')');
   const flick=(t)=>{const k=1+Math.sin(t/55)*.07;glow.setAttribute('ry',60*k);tail.setAttribute('opacity',.7+Math.sin(t/40)*.2)};
   const emb=[];const spark=(x,y,s)=>{if(Math.random()<.9)emb.push({e:el('circle',{r:3+Math.random()*5*s,fill:Math.random()<.5?'#ffcf5a':'#ff6a1a'}),x:x-F.dir*20*s,y:y+(Math.random()-.5)*50*s,vy:-30-Math.random()*60,l:0})};
   const tick=()=>{for(const q of emb){q.l+=.045;q.y+=q.vy*.03;q.e.setAttribute('cx',q.x);q.e.setAttribute('cy',q.y);q.e.setAttribute('opacity',Math.max(0,1-q.l*1.5))}};
   // растёт прямо из руки
   await run(300,t=>{const h=F.W('fh');const s=.15+.85*E.back(t);place(h.x+F.dir*40*s,h.y,s);flick(CLOCK);spark(h.x,h.y,s);tick()});
   const h=F.W('fh'),tg=T.W('sh');const sx=h.x+F.dir*40,sy=h.y,ex=tg.x-F.dir*40,ey=tg.y-10;
   await run(240,t=>{const k=E.in(t);const s=1+.55*k;place(sx+(ex-sx)*k,sy+(ey-sy)*k,s,F.dir*-4*k);flick(CLOCK);spark(sx+(ex-sx)*k,sy+(ey-sy)*k,s);spark(sx+(ex-sx)*k,sy+(ey-sy)*k,s);tick()});
   g.remove();
   const ix=ex+F.dir*20,iy=ey;
   burst(ix,iy,34,'#ffb43a',1.8);burst(ix,iy,18,'#ff5a1a',1.2);ring(ix,iy,'#ffd25a',170);after(()=>ring(ix,iy,'#ff6a1a',110),90);
   const ex2=el('circle',{cx:ix,cy:iy,r:10,fill:'#ffb43a',opacity:.8,filter:'blur(6px)'});
   run(400,t=>{ex2.setAttribute('r',10+90*E.out(t));ex2.setAttribute('opacity',.8*(1-t));tick();if(t>=1){ex2.remove();emb.forEach(q=>q.e.remove())}})}},
 shots:{n:'Огненные выстрелы',col:'#ff9a2a',
  async pre(F,T){await F.to('cast',200,E.out,{fu:75,fb:15,bu:55,bb:25})},
  async fx(F,T){const tg=T.W('sh');let lastP;const emb=[];
   const tick=()=>{for(const q of emb){q.l+=.07;q.e.setAttribute('opacity',Math.max(0,.8-q.l));q.e.setAttribute('r',Math.max(.5,q.r*(1-q.l)))}};
   for(let i=0;i<6;i++){const h=F.W(i%2?'bh':'fh');const sx=h.x,sy=h.y,ex=tg.x-F.dir*18,ey=tg.y+(Math.random()-.5)*40;
    const ball=el('circle',{r:13,fill:'url(#flameF)',stroke:'#b8340a','stroke-width':2,filter:'drop-shadow(0 0 8px #ff7a1a)'});
    F.to('cast',45,E.out,{dx:-9,fu:75+(i%2?0:10),bu:55+(i%2?10:0)});
    lastP=run(210,t=>{const k=E.in(t),x=sx+(ex-sx)*k,y=sy+(ey-sy)*k;ball.setAttribute('cx',x);ball.setAttribute('cy',y);
      if(Math.random()<.9){const c=el('circle',{cx:x-F.dir*8,cy:y+(Math.random()-.5)*8,r:6,fill:Math.random()<.5?'#ffcf5a':'#ff6a1a',opacity:.8});emb.push({e:c,l:0,r:6})}tick();
      if(t>=1){ball.remove();burst(ex,ey,9,'#ffb43a',.9);ring(ex,ey,'#ffb43a',50);flash(.2);T.to('hit',50,E.out,{dx:-8-(i%3)*3}).then(()=>T.to('guard',90,E.out))}});
    await sleep(120)}
   await lastP;emb.forEach(q=>q.e.remove())}},
 wave:{n:'Взмах клинка',col:'#bfe6ff',
  async pre(F,T){await F.to('windup',260,E.out,{bu:60,bb:60})},
  async fx(F,T){await F.to('punch',110,E.in,{dx:-10});const h=F.W('fh'),tg=T.W('sh');const g=el('g',{});
   el('path',{d:'M0 -48 Q40 0 0 48 Q16 0 0 -48Z',fill:'#e9fbff',filter:'drop-shadow(0 0 8px #7fd0ff)'},g);
   const place=(x,y,s)=>g.setAttribute('transform','translate('+x+','+y+') scale('+(F.dir*s)+','+s+')');
   const sx=h.x+F.dir*50,sy=h.y,ex=tg.x-F.dir*10,ey=tg.y;
   await run(210,t=>{const k=E.in(t);place(sx+(ex-sx)*k,sy+(ey-sy)*k,1+.8*k)});g.remove();
   const cut=(a)=>{const l=el('line',{x1:ex-60*Math.cos(a),y1:ey-60*Math.sin(a),x2:ex+60*Math.cos(a),y2:ey+60*Math.sin(a),stroke:'#f4fbff','stroke-width':8,'stroke-linecap':'round',filter:'drop-shadow(0 0 8px #7fd0ff)'});run(260,t=>{l.setAttribute('opacity',1-t);if(t>=1)l.remove()})};
   cut(-.8);after(()=>cut(.6),70);ring(ex,ey,'#bfe6ff',100);burst(ex,ey,14,'#e9fbff',1.2)}},
 vortex:{n:'Вихрь клинков',col:'#9fe8ff',
  async pre(F,T){F.to('windup',300,E.out,{bu:60,bb:60});const h0=()=>F.W('fh');const ls=[];
   for(let i=0;i<5;i++)ls.push(el('path',{fill:'none',stroke:'#e9fbff','stroke-width':3,'stroke-linecap':'round',opacity:0}));
   await run(520,t=>{const h=h0();ls.forEach((l,i)=>{const a=t*14+i*1.26,r=18+34*t;const x=h.x,y=h.y;l.setAttribute('d','M'+(x+Math.cos(a)*r)+' '+(y+Math.sin(a)*r*.55)+' A '+r+' '+r*.55+' 0 0 1 '+(x+Math.cos(a+1.1)*r)+' '+(y+Math.sin(a+1.1)*r*.55));l.setAttribute('opacity',.35+.65*t)})});
   ls.forEach(l=>l.remove())},
  async fx(F,T){await F.to('punch',120,E.in,{dx:-12});const h=F.W('fh'),tg=T.W('sh');const sx=h.x+F.dir*50,sy=h.y,ex=tg.x-F.dir*10,ey=tg.y;
   const N=6,gs=[],wl=[];
   for(let i=0;i<N;i++){const g=el('g',{opacity:0});el('path',{d:'M0 -34 Q28 0 0 34 Q11 0 0 -34Z',fill:'#e9fbff',filter:'drop-shadow(0 0 7px #7fd0ff)'},g);gs.push(g)}
   for(let i=0;i<10;i++)wl.push(el('path',{fill:'none',stroke:'#cfefff','stroke-width':2.5,'stroke-linecap':'round',opacity:0}));
   const D=480;
   await run(D,t=>{
     gs.forEach((g,i)=>{const lt=Math.max(0,Math.min(1,(t*D-i*55)/(D-N*55)));if(lt<=0){g.setAttribute('opacity',0);return}
       const k=E.in(lt),x=sx+(ex-sx)*k,y=sy+(ey-sy)*k+Math.sin(lt*9+i*1.05)*(50*(1-lt)+14),rot=lt*720+i*60;
       g.setAttribute('opacity',1);g.setAttribute('transform','translate('+x+','+y+') scale('+(F.dir*(.8+.7*lt))+','+(.8+.7*lt)+') rotate('+rot+')')});
     wl.forEach((w,i)=>{const lt=Math.max(0,Math.min(1,t*1.1-i*.04));const x0=sx+(ex-sx)*E.in(Math.max(0,lt-.18)),x1=sx+(ex-sx)*E.in(lt);const yy=sy+(ey-sy)*E.in(lt)+Math.sin(lt*9+i*.7)*(55*(1-lt)+18);
       w.setAttribute('d','M'+x0+' '+(yy+8)+' Q'+((x0+x1)/2)+' '+(yy-14)+' '+x1+' '+yy);w.setAttribute('opacity',lt>0&&lt<1?.7:0)})});
   gs.forEach(g=>g.remove());wl.forEach(w=>w.remove());
   const cut=(a,len=120)=>{const l=el('line',{x1:ex-len*Math.cos(a),y1:ey-len*Math.sin(a),x2:ex+len*Math.cos(a),y2:ey+len*Math.sin(a),stroke:'#f4fbff','stroke-width':9,'stroke-linecap':'round',filter:'drop-shadow(0 0 10px #7fd0ff)'});run(300,t=>{l.setAttribute('opacity',1-t);if(t>=1)l.remove()})};
   cut(-.9);after(()=>cut(.5),60);after(()=>cut(-.2),120);ring(ex,ey,'#9fe8ff',170);burst(ex,ey,26,'#e9fbff',1.6);flash(.6);shake()}},
 dash:{n:'Рывок-пронзание',col:'#d8f0ff',
  async pre(F,T){await F.to('windup',240,E.out,{dx:-30,bu:60,bb:60})},
  async fx(F,T){const s0=F.W('fh');const ln=el('line',{x1:s0.x,y1:s0.y,x2:s0.x,y2:s0.y,stroke:'#f4fbff','stroke-width':11,'stroke-linecap':'round',opacity:.85,filter:'drop-shadow(0 0 9px #7fd0ff)'});
   const pr=F.to('punch',100,E.in,{dx:GAP(F)-110});await run(100,t=>{const h=F.W('fh');ln.setAttribute('x1',s0.x);ln.setAttribute('y1',h.y);ln.setAttribute('x2',h.x);ln.setAttribute('y2',h.y)});await pr;
   const tg=T.W('sh');ring(tg.x,tg.y,'#d8f0ff',110);burst(tg.x,tg.y,16,'#f4fbff',1.3);flash(.4);run(320,t=>{ln.setAttribute('opacity',.85*(1-t));ln.setAttribute('stroke-width',11*(1-t)+1);if(t>=1)ln.remove()})}},
 cross:{n:'Крестовый разрез',col:'#9fe8ff',
  async pre(F,T){await F.to('windup',300,E.out,{dx:-26,bu:60,bb:60})},
  async fx(F,T){await F.to('punch',110,E.in,{dx:GAP(F)-110});const tg=T.W('sh');const ex=tg.x,ey=tg.y;
   const cut=async(a,len)=>{const x1=ex-len*Math.cos(a),y1=ey-len*Math.sin(a),x2=ex+len*Math.cos(a),y2=ey+len*Math.sin(a);
     const l=el('line',{x1,y1,x2:x1,y2:y1,stroke:'#f4fbff','stroke-width':13,'stroke-linecap':'round',filter:'drop-shadow(0 0 12px #7fd0ff)'});
     await run(110,t=>{l.setAttribute('x2',x1+(x2-x1)*E.out(t));l.setAttribute('y2',y1+(y2-y1)*E.out(t))});return l};
   const a=await cut(-.75,150);flash(.35);const b=await cut(.75,150);flash(.6);shake();ring(ex,ey,'#9fe8ff',200);burst(ex,ey,30,'#e9fbff',1.7);
   await sleep(80);run(360,t=>{a.setAttribute('opacity',1-t);b.setAttribute('opacity',1-t);if(t>=1){a.remove();b.remove()}})}},
 whip:{n:'Огненный хлыст',col:'#ff9a2a',
  async pre(F,T){await F.to('windup',280,E.out,{bu:60,bb:60})},
  async fx(F,T){await F.to('cast',130,E.out);const h=F.W('fh'),tg=T.W('sh');const d='M '+h.x+' '+h.y+' Q '+((h.x+tg.x)/2)+' '+(h.y-230)+' '+tg.x+' '+(tg.y+10);
   const o=el('path',{d,fill:'none',stroke:'#e8421a','stroke-width':16,'stroke-linecap':'round',filter:'drop-shadow(0 0 10px #ff7a1a)'}),i=el('path',{d,fill:'none',stroke:'#ffe9a8','stroke-width':6,'stroke-linecap':'round'});
   const len=o.getTotalLength();for(const p of [o,i]){p.setAttribute('stroke-dasharray',len);p.setAttribute('stroke-dashoffset',len)}
   await run(220,t=>{const k=E.in(t);o.setAttribute('stroke-dashoffset',len*(1-k));i.setAttribute('stroke-dashoffset',len*(1-k))});
   ring(tg.x,tg.y,'#ffb43a',130);burst(tg.x,tg.y,22,'#ffb43a',1.5);flash(.4);run(380,t=>{o.setAttribute('opacity',1-t);i.setAttribute('opacity',1-t);if(t>=1){o.remove();i.remove()}})}},
 pillar:{n:'Огненный столб',col:'#ff7a1a',
  async pre(F,T){await F.to('cast',240,E.out,{fu:110,fb:30,bu:80,bb:40})},
  async fx(F,T){const tg=T.W('pel'),gx=tg.x,gy=GROUND;
   const mk=el('ellipse',{cx:gx,cy:gy,rx:5,ry:2,fill:'rgba(255,120,30,.35)',stroke:'#ff7a1a','stroke-width':5});
   await run(380,t=>{mk.setAttribute('rx',5+75*E.out(t));mk.setAttribute('ry',2+18*E.out(t))});
   const top=30,w=100;const col=el('rect',{x:gx-w/2,y:gy,width:w,height:0,rx:30,fill:'url(#flameF)',filter:'drop-shadow(0 0 16px #ff7a1a)'}),core=el('rect',{x:gx-22,y:gy,width:44,height:0,rx:20,fill:'#fff2a8',opacity:.85,filter:'blur(4px)'});
   const emb=[];flash(.5);shake();
   await run(200,t=>{const k=E.out(t),h=(gy-top)*k;col.setAttribute('y',gy-h);col.setAttribute('height',h);core.setAttribute('y',gy-h);core.setAttribute('height',h)});
   burst(gx,gy-10,30,'#ffb43a',1.8);ring(gx,gy-10,'#ffd25a',160);
   await run(520,t=>{const k=1+Math.sin(t*50)*.1;col.setAttribute('x',gx-w*k/2);col.setAttribute('width',w*k);if(Math.random()<.8){const c=el('circle',{cx:gx+(Math.random()-.5)*w,cy:gy-Math.random()*(gy-top),r:3+Math.random()*4,fill:Math.random()<.5?'#ffcf5a':'#ff6a1a'});emb.push(c);run(300,u=>{c.setAttribute('cy',+c.getAttribute('cy')-2);c.setAttribute('opacity',1-u);if(u>=1)c.remove()})}});
   await run(260,t=>{col.setAttribute('opacity',1-t);core.setAttribute('opacity',.85*(1-t));mk.setAttribute('opacity',1-t);if(t>=1){col.remove();core.remove();mk.remove()}})}},
 flurry:{n:'Серия ударов',col:'#d8f0ff',
  async pre(F,T){await F.to('windup',230,E.out,{dx:-24,bu:60,bb:60})},
  async fx(F,T){await F.to('punch',100,E.in,{dx:GAP(F)-110});const tg=T.W('sh');const ex=tg.x,ey=tg.y;
   for(const [a,len] of [[-.9,90],[.5,100],[-.15,110]]){
     F.to(a<0?'windup':'punch',60,E.out,{dx:GAP(F)-110,bu:60,bb:60});
     const l=el('line',{x1:ex-len*Math.cos(a),y1:ey-len*Math.sin(a),x2:ex+len*Math.cos(a),y2:ey+len*Math.sin(a),stroke:'#f4fbff','stroke-width':9,'stroke-linecap':'round',filter:'drop-shadow(0 0 9px #7fd0ff)'});
     ring(ex,ey,'#d8f0ff',70);burst(ex,ey,10,'#f4fbff',1);flash(.3);run(220,t=>{l.setAttribute('opacity',1-t);if(t>=1)l.remove()});await sleep(110)}
   shake()}},
 plunge:{n:'Удар с небес',col:'#9fe8ff',
  async pre(F,T){await F.to('windup',220,E.out,{dx:GAP(F)*.55-70,dy:-210,fu:150,fb:0,bu:170,bb:0,t:-6});await sleep(100)},
  async fx(F,T){await F.to('punch',110,E.in,{dx:GAP(F)-110,dy:0,fu:140,fb:-5,bu:150,bb:-5,t:35});const gx=T.W('pel').x;
   const beam=el('rect',{x:gx-16,y:0,width:32,height:GROUND,fill:'#e9fbff',opacity:.9,filter:'drop-shadow(0 0 14px #7fd0ff)'});
   for(const [d,c] of [[0,'#e9fbff'],[90,'#9fe8ff']])after(()=>{const e=el('ellipse',{cx:gx,cy:GROUND,rx:10,ry:3,fill:'none',stroke:c,'stroke-width':7});run(480,t=>{e.setAttribute('rx',10+260*E.out(t));e.setAttribute('ry',3+34*E.out(t));e.setAttribute('opacity',1-t);if(t>=1)e.remove()})},d);
   flash(.7);shake();burst(gx,GROUND-6,34,'#d9c39a',1.6);burst(gx,GROUND-80,18,'#e9fbff',1.3);ring(gx,GROUND-70,'#9fe8ff',190);
   run(420,t=>{beam.setAttribute('opacity',.9*(1-t));beam.setAttribute('width',32*(1-t)+2);beam.setAttribute('x',gx-(32*(1-t)+2)/2);if(t>=1)beam.remove()});await sleep(200)}},
 firewave:{n:'Огненная волна',col:'#ff8a2a',
  async pre(F,T){await F.to('charge',260,E.out)},
  async fx(F,T){await F.to('cast',110,E.out,{fu:70,fb:60});const sx=F.W('pel').x+F.dir*60,ex=T.W('pel').x,n=12,tg=T.W('sh');
   const tongue=(x,s)=>{const g=el('g',{transform:'translate('+x+','+GROUND+')'});el('path',{d:'M-16 0 Q-22 -40 -4 -70 Q0 -44 8 -56 Q20 -30 16 0Z',fill:'url(#flameF)',filter:'drop-shadow(0 0 8px #ff7a1a)'},g);
     run(360,t=>{const k=t<.3?E.out(t/.3):1-(t-.3)/.7;g.setAttribute('transform','translate('+x+','+GROUND+') scale('+(s*(.8+Math.sin(t*30)*.1))+','+(s*1.1*k)+')');if(t>=1)g.remove()})};
   for(let i=0;i<n;i++){tongue(sx+(ex-sx)*i/(n-1),1+i*.06);if(i%3===0)burst(sx+(ex-sx)*i/(n-1),GROUND-10,5,'#ffb43a',.6);await sleep(32)}
   ring(tg.x,tg.y,'#ffb43a',130);burst(tg.x,tg.y,24,'#ffb43a',1.5);flash(.4);await sleep(150)}},
 meteor:{n:'Огненный метеор',col:'#ff6a1a',
  async pre(F,T){await F.to('cast',280,E.out,{fu:172,fb:0,bu:60,bb:20});await sleep(100)},
  async fx(F,T){const tg=T.W('sh');const ex=tg.x,ey=tg.y,sx=ex-F.dir*320,sy=-120;
   const g=el('g',{});const tail=el('path',{d:'M0 0 L-260 -170 L-250 -60Z',fill:'url(#flameT)',opacity:.9,transform:'scale(1,1)'},g);
   el('circle',{r:62,fill:'url(#flameF)',stroke:'#b8340a','stroke-width':4,filter:'drop-shadow(0 0 22px #ff7a1a)'},g);el('circle',{cx:-10,cy:-12,r:26,fill:'#fff3b0',opacity:.7,filter:'blur(6px)'},g);
   const ang=Math.atan2(ey-sy,ex-sx);const tl=Math.hypot(ex-sx,ey-sy);
   await run(430,t=>{const k=E.in(t),x=sx+(ex-sx)*k,y=sy+(ey-sy)*k;g.setAttribute('transform','translate('+x+','+y+') rotate('+(ang*180/Math.PI)+')');
     tail.setAttribute('d','M-30 0 L-300 -40 L-300 40Z');
     if(Math.random()<.9){const c=el('circle',{cx:x-Math.cos(ang)*60,cy:y-Math.sin(ang)*60+(Math.random()-.5)*50,r:4+Math.random()*6,fill:Math.random()<.5?'#ffcf5a':'#ff6a1a',opacity:.9});run(320,u=>{c.setAttribute('opacity',.9*(1-u));if(u>=1)c.remove()})}});
   g.remove();flash(.85);shake();
   const b=el('circle',{cx:ex,cy:ey,r:20,fill:'#ffb43a',opacity:.85,filter:'blur(10px)'});run(520,t=>{b.setAttribute('r',20+150*E.out(t));b.setAttribute('opacity',.85*(1-t));if(t>=1)b.remove()});
   burst(ex,ey,44,'#ffb43a',2);burst(ex,ey,24,'#ff5a1a',1.5);ring(ex,ey,'#ffd25a',230);after(()=>ring(ex,ey,'#ff6a1a',150),100);await sleep(220)}},
 smash:{n:'Сокрушающий удар',col:'#ffe3a0',
  async pre(F,T){await F.to('windup',300,E.out,{dx:-24})},
  async fx(F,T){await F.to('punch',110,E.in,{dx:GAP(F)-110*F.sc});const tg=T.W('pel'),gx=tg.x;
   for(const [d,c] of [[0,'#ffe3a0'],[80,'#fff']])after(()=>{const e=el('ellipse',{cx:gx,cy:GROUND,rx:10,ry:3,fill:'none',stroke:c,'stroke-width':7});run(420,t=>{e.setAttribute('rx',10+190*E.out(t));e.setAttribute('ry',3+26*E.out(t));e.setAttribute('opacity',1-t);if(t>=1)e.remove()})},d);
   const h=T.W('sh');ring(h.x,h.y,'#ffe3a0',140);burst(h.x,h.y,20,'#ffe3a0',1.4);flash(.5);shake()}},
 quake:{n:'Удар о землю',col:'#ffd45a',
  async pre(F,T){await F.to('cast',320,E.out,{fu:172,fb:0,bu:170,bb:0,t:-10});await sleep(120)},
  async fx(F,T){await F.to('punch',120,E.in,{fu:70,fb:25,bu:60,bb:25,t:40,dx:20*F.sc});const sx=F.W('fh').x,ex=T.W('pel').x,dir=Math.sign(ex-sx);
   let d='M '+sx+' '+(GROUND+4);const n=9;for(let i=1;i<=n;i++)d+=' L '+(sx+(ex-sx)*i/n)+' '+(GROUND+4+(i%2?-14:12));
   const o=el('path',{d,fill:'none',stroke:'#120a05','stroke-width':14,'stroke-linecap':'round','stroke-linejoin':'round'}),i2=el('path',{d,fill:'none',stroke:'#ffd45a','stroke-width':4,'stroke-linecap':'round','stroke-linejoin':'round',filter:'drop-shadow(0 0 8px #ffb43a)'});
   const len=o.getTotalLength();for(const p of [o,i2]){p.setAttribute('stroke-dasharray',len);p.setAttribute('stroke-dashoffset',len)}
   shake();const rocks=[];for(let k=0;k<12;k++){const x=sx+(ex-sx)*Math.random();rocks.push({e:el('polygon',{points:'0,-8 8,0 0,8 -7,2',fill:'#6b5440',stroke:'#241a10','stroke-width':2}),x,y:GROUND,vy:-(180+Math.random()*220),vx:(Math.random()-.5)*60,r:Math.random()*360})}
   await run(300,t=>{o.setAttribute('stroke-dashoffset',len*(1-E.in(t)));i2.setAttribute('stroke-dashoffset',len*(1-E.in(t)))});
   const h=T.W('sh');ring(ex,h.y,'#ffd45a',200);burst(ex,GROUND-10,36,'#d9c39a',1.8);flash(.6);shake();
   await run(700,t=>{for(const r of rocks){const tt=t*.9;r.e.setAttribute('transform','translate('+(r.x+r.vx*tt)+','+(r.y+r.vy*tt+520*tt*tt)+') rotate('+(r.r+t*400)+')');r.e.setAttribute('opacity',t>.8?(1-t)*5:1)}o.setAttribute('opacity',1-Math.max(0,t-.5)*2);i2.setAttribute('opacity',1-Math.max(0,t-.5)*2)});
   o.remove();i2.remove();rocks.forEach(r=>r.e.remove())}},
 slash:{n:'Рассекающий клинок',col:'#9fe8ff',
  async pre(F,T){await F.to('windup',300,E.out)},
  async fx(F,T){const a=F.W('fh'),b=T.W('sh');const px=[a.x,a.y],tx=[b.x,b.y];
   const d=`M ${a.x-60*F.dir} ${a.y-90} Q ${(a.x+b.x)/2} ${a.y-190} ${b.x+40*F.dir} ${b.y+40}`;
   const p1=el('path',{d,fill:'none',stroke:'#e9fbff','stroke-width':12,'stroke-linecap':'round',filter:'drop-shadow(0 0 10px #67d8ff)'});
   const len=p1.getTotalLength();p1.setAttribute('stroke-dasharray',len);
   await run(190,t=>{p1.setAttribute('stroke-dashoffset',len*(1-E.out(t)))});ring(b.x,b.y,'#9fe8ff',110);run(260,t=>{p1.setAttribute('opacity',1-t);if(t>=1)p1.remove()})}},
 beam:{n:'Дальний удар (растяжение)',col:'#ffd45a',
  async pre(F,T){await F.to('windup',260,E.out)},
  async fx(F,T){const a=F.W('sh'),b=T.W('head');const ln=el('line',{x1:a.x,y1:a.y,x2:a.x,y2:a.y,stroke:'#ffb43a','stroke-width':16,'stroke-linecap':'round',filter:'drop-shadow(0 0 8px #ff8a1a)'});const fist=el('circle',{r:16,fill:'#ffb43a',cx:a.x,cy:a.y});
   F.to('cast',120,E.out);await run(160,t=>{const k=E.out(t);const x=a.x+(b.x-a.x)*k,y=a.y+(b.y-a.y)*k;ln.setAttribute('x2',x);ln.setAttribute('y2',y);fist.setAttribute('cx',x);fist.setAttribute('cy',y)});
   run(260,t=>{ln.setAttribute('opacity',1-t);fist.setAttribute('opacity',1-t);if(t>=1){ln.remove();fist.remove()}})}},
 thunder:{n:'Громовой разряд',col:'#fff06a',
  async pre(F,T){await F.to('cast',280,E.out,{fu:170,fb:0})},
  async fx(F,T){const b=T.W('head');let d=`M ${b.x+30*(Math.random()-.5)} 0`;let y=0;while(y<b.y){y+=40+Math.random()*30;d+=` L ${b.x+(Math.random()-.5)*70} ${Math.min(y,b.y+50)}`}
   const p=el('path',{d,fill:'none',stroke:'#fffbd0','stroke-width':7,filter:'drop-shadow(0 0 12px #ffe45a)'});flash(.75);shake();await sleep(200);run(240,t=>{p.setAttribute('opacity',1-t);if(t>=1)p.remove()})}}
};
/* ---------- набор деталей для приёмов ---------- */
const L_=(a,b,k)=>a+(b-a)*k,R_=(a,b)=>a+Math.random()*(b-a);
const MV=(n,col,pre,fx)=>({n,col,pre,fx});
const PS=(pose,ms=260,over={})=>async(F)=>{await F.to(pose,ms,E.out,over)};
function tdot(x,y,c,r=4){const e=el('circle',{cx:x,cy:y,r,fill:c,opacity:.8});run(280,t=>{e.setAttribute('opacity',.8*(1-t));e.setAttribute('r',r*(1-.6*t));if(t>=1)e.remove()})}
function flyer(F,A0,B0,o={}){const g=el('g',{});if(o.shape)o.shape(g,o);
 return run(o.dur||240,t=>{const k=(o.ease||E.in)(t);const x=L_(A0.x,B0.x,k),y=L_(A0.y,B0.y,k)-(o.arc||0)*Math.sin(Math.PI*k);const s=L_(o.s0??1,o.s1??1,k);
  const rot=o.aim?Math.atan2(B0.y-A0.y,B0.x-A0.x)*180/Math.PI:(o.spin||0)*k;
  g.setAttribute('transform',`translate(${x},${y}) rotate(${rot}) scale(${s*(o.mirror&&!o.aim?F.dir:1)},${s})`);
  if(o.trail&&Math.random()<.85)tdot(x,y,o.col||'#fff',o.trailR||4);
  if(t>=1)g.remove()})}
function boom(T,col,sz=1,k='sh'){const h=T.W(k);ring(h.x,h.y,col,80*sz);burst(h.x,h.y,Math.round(12*sz),col,Math.min(2,sz));flash(Math.min(.6,.18+.16*sz));if(sz>=1.6)shake()}
function cutAt(x,y,a,len,col='#f4fbff',w=9){const l=el('line',{x1:x-len*Math.cos(a),y1:y-len*Math.sin(a),x2:x+len*Math.cos(a),y2:y+len*Math.sin(a),stroke:col,'stroke-width':w,'stroke-linecap':'round',filter:`drop-shadow(0 0 9px ${col})`});run(260,t=>{l.setAttribute('opacity',1-t);if(t>=1)l.remove()})}
function bolt(x0,y0,x1,y1,col='#fff6a8',w=6){const n=8;let d=`M ${x0} ${y0}`;for(let i=1;i<=n;i++){const k=i/n;d+=` L ${L_(x0,x1,k)+(i<n?R_(-22,22):0)} ${L_(y0,y1,k)+(i<n?R_(-12,12):0)}`}
 const p=el('path',{d,fill:'none',stroke:col,'stroke-width':w,'stroke-linejoin':'round',filter:`drop-shadow(0 0 10px ${col})`});run(260,t=>{p.setAttribute('opacity',1-t);if(t>=1)p.remove()})}
const SH={
 donut:(g,o)=>{const r=o.r||16;el('circle',{r,fill:'none',stroke:'#fff','stroke-width':r*.6,filter:'drop-shadow(0 0 6px #d9c4ff)'},g);el('circle',{r:r*1.3,fill:'none',stroke:'#cdb8ff','stroke-width':2,opacity:.8},g)},
 heart:(g,o)=>{const c=o.col||'#ff7ab8';el('path',{d:'M0 14 C-26 -6 -16 -28 0 -14 C16 -28 26 -6 0 14Z',fill:c,stroke:'#fff','stroke-width':2.5,filter:`drop-shadow(0 0 8px ${c})`},g)},
 arrow:(g,o)=>{const c=o.col||'#56c8ff';el('line',{x1:-40,y1:0,x2:10,y2:0,stroke:'#fff','stroke-width':4,'stroke-linecap':'round'},g);el('path',{d:'M14 0 L0 -10 L0 10Z',fill:c},g);el('path',{d:'M-40 0 L-52 -9 M-40 0 L-52 9',stroke:c,'stroke-width':3,'stroke-linecap':'round'},g);const h=el('g',{transform:'translate(-6,0) scale(.35)'},g);SH.heart(h,{col:'#ff7ab8'})},
 fist:(g,o)=>{const c=o.col||'#ff7aa8',r=o.r||16;el('circle',{r,fill:c,stroke:o.st||'#fff','stroke-width':2.5,filter:`drop-shadow(0 0 6px ${c})`},g);for(const y of [-.55,-.18,.18,.55])el('circle',{cx:r*.8,cy:y*r,r:r*.28,fill:c,stroke:o.st||'#fff','stroke-width':2},g)},
 metal:(g,o)=>{const s=o.r||14;el('polygon',{points:`${-s},${-s*.5} ${-s*.2},${-s} ${s},${-s*.4} ${s*.8},${s*.7} ${-s*.3},${s}`,fill:'#9aa3ad',stroke:'#2a2f36','stroke-width':2.5},g);el('polygon',{points:`${-s*.5},${-s*.3} 0,${-s*.7} ${s*.4},${-s*.2}`,fill:'#d7dde5',opacity:.8},g)},
 sword:(g,o)=>{el('line',{x1:-34,y1:0,x2:30,y2:0,stroke:'#2a2f36','stroke-width':8,'stroke-linecap':'round'},g);el('line',{x1:-32,y1:0,x2:30,y2:0,stroke:'#dfe6ee','stroke-width':4,'stroke-linecap':'round'},g);el('line',{x1:-36,y1:-9,x2:-36,y2:9,stroke:'#b28a3a','stroke-width':4},g)},
 water:(g,o)=>{const r=o.r||16;el('circle',{r,fill:'#6fc8ff',opacity:.9,stroke:'#e6f7ff','stroke-width':2.5,filter:'drop-shadow(0 0 8px #38a8ff)'},g);el('ellipse',{cx:-r*.3,cy:-r*.3,rx:r*.35,ry:r*.2,fill:'#fff',opacity:.7},g)},
 trident:(g,o)=>{const c='#a06bff';el('line',{x1:-60,y1:0,x2:34,y2:0,stroke:'#fff','stroke-width':6,'stroke-linecap':'round',filter:`drop-shadow(0 0 8px ${c})`},g);el('path',{d:'M34 -16 L34 16 M34 -16 L60 -16 M34 0 L66 0 M34 16 L60 16',stroke:c,'stroke-width':6,'stroke-linecap':'round',fill:'none',filter:`drop-shadow(0 0 8px ${c})`},g)},
 hand:(g,o)=>{const c=o.col||'#c9a0ff',st='#4a2d7a';const rr=(x,y,w,h,r)=>el('rect',{x,y,width:w,height:h,rx:r,fill:c,stroke:st,'stroke-width':2.5},g);[-21,-7,7,21].forEach((x,i)=>rr(x-6,(i===1||i===2)?-70:-56,12,(i===1||i===2)?68:54,6));rr(-26,-6,52,40,14);el('ellipse',{cx:-30,cy:8,rx:7,ry:16,fill:c,stroke:st,'stroke-width':2.5,transform:'rotate(-28 -30 8)'},g)},
 foot:(g,o)=>{const c=o.col||'#c9a0ff';el('line',{x1:-40,y1:0,x2:-100,y2:0,stroke:c,'stroke-width':20,'stroke-linecap':'round'},g);el('path',{d:'M-40 -14 L22 -14 Q52 -12 52 4 Q52 20 22 20 L-40 20Z',fill:c,stroke:'#4a2d7a','stroke-width':3},g)},
 crescent:(g,o)=>{el('path',{d:'M0 -50 Q36 0 0 50 Q14 0 0 -50Z',fill:o.col||'#fff2a8',filter:'drop-shadow(0 0 8px #ffd23a)'},g)},
 flameBlade:(g,o)=>{el('path',{d:'M0 -60 Q50 0 0 60 Q18 0 0 -60Z',fill:'url(#flameF)',filter:'drop-shadow(0 0 12px #ff7a1a)'},g)}
};
function hearts(x,y,n=8,cols=['#8fdcff','#ff8fc8','#fff'],R=90){for(let i=0;i<n;i++){const g=el('g',{});SH.heart(g,{col:cols[i%cols.length]});const a=Math.PI*2*i/n+R_(-.2,.2),d=R*R_(.6,1.1),s=R_(.35,.7);run(520,t=>{const k=E.out(t);g.setAttribute('transform',`translate(${x+Math.cos(a)*d*k},${y+Math.sin(a)*d*k-30*t}) scale(${s*(1-.3*t)})`);g.setAttribute('opacity',1-t*t);if(t>=1)g.remove()})}}
function cloud(cx,cy,s){const g=el('g',{});for(const [x,y,r] of [[-60,10,34],[-20,-8,44],[28,-4,46],[66,12,32],[0,18,40]])el('circle',{cx:x,cy:y,r,fill:'#3b4256',stroke:'#1e2433','stroke-width':3},g);el('ellipse',{cx:-10,cy:-24,rx:30,ry:10,fill:'#6a7694',opacity:.6},g);
 const set=(k,op=1)=>{g.setAttribute('transform',`translate(${cx},${cy}) scale(${Math.max(.01,k)*s})`);g.setAttribute('opacity',op)};set(0);return {g,set}}
function sphere(cx,cy,r,col){const g=el('g',{});el('circle',{cx,cy,r,fill:col,opacity:.12},g);el('circle',{cx,cy,r,fill:'none',stroke:col,'stroke-width':4,filter:`drop-shadow(0 0 10px ${col})`},g);el('ellipse',{cx,cy,rx:r,ry:r*.28,fill:'none',stroke:col,'stroke-width':1.5,opacity:.6},g);el('ellipse',{cx,cy,rx:r*.28,ry:r,fill:'none',stroke:col,'stroke-width':1.5,opacity:.6},g);
 const set=(k,op=1)=>{g.setAttribute('transform',`translate(${cx},${cy}) scale(${Math.max(.01,k)}) translate(${-cx},${-cy})`);g.setAttribute('opacity',op)};set(0);return {g,set}}
function legFlame(F,dur){const g=el('g',{});const glow=el('line',{stroke:'#ffb43a','stroke-width':20,'stroke-linecap':'round',opacity:.7,filter:'blur(5px)'},g),core=el('line',{stroke:'#fff2a8','stroke-width':7,'stroke-linecap':'round'},g);
 return run(dur,t=>{const k=F.W('fk'),f=F.W('ff');for(const l of [glow,core]){l.setAttribute('x1',k.x);l.setAttribute('y1',k.y);l.setAttribute('x2',f.x);l.setAttribute('y2',f.y)}
  if(Math.random()<.9){const q=el('circle',{cx:f.x+R_(-14,14),cy:f.y+R_(-14,14),r:R_(3,7),fill:Math.random()<.5?'#ffd25a':'#ff7a1a',opacity:.9});run(300,u=>{q.setAttribute('cy',+q.getAttribute('cy')-1.6);q.setAttribute('opacity',.9*(1-u));if(u>=1)q.remove()})}
  if(t>=1)g.remove()})}
function stretchArm(F,T,o){const c=o.col,w=o.w||18;const ln=el('line',{stroke:'#0d1118','stroke-width':w+5,'stroke-linecap':'round'}),li=el('line',{stroke:c,'stroke-width':w,'stroke-linecap':'round',filter:`drop-shadow(0 0 8px ${c})`});
 const tip=el('g',{});o.tip(tip);const A0=F.W('sh'),H=F.W('fh'),B=T.W('sh');const ex=B.x-F.dir*(o.reach||20),ey=B.y;
 const upd=(x,y)=>{for(const l of [ln,li]){l.setAttribute('x1',A0.x);l.setAttribute('y1',A0.y);l.setAttribute('x2',x);l.setAttribute('y2',y)}tip.setAttribute('transform',`translate(${x},${y}) scale(${F.dir*(o.s||1)},${o.s||1})`)};
 return {run:async()=>{await run(o.dur||200,t=>{const k=E.out(t);upd(L_(H.x,ex,k),L_(H.y,ey,k))})},back:async()=>{await run(o.back||200,t=>{const k=E.in(t);upd(L_(ex,A0.x+F.dir*20,k),L_(ey,A0.y,k))});ln.remove();li.remove();tip.remove()}}}
Object.assign(ABIL,{
/* ---- фиолетовый: трезубец и пончики ---- */
 donuts:MV('Пончиковый залп','#e3d4ff',PS('windup',240),async(F,T)=>{await F.to('cast',90,E.out);const B=T.W('sh');let last;
  for(let i=0;i<5;i++){const H=F.W(i%2?'bh':'fh');last=flyer(F,H,{x:B.x-F.dir*10,y:B.y+R_(-30,30)},{dur:300,arc:70,spin:540,shape:SH.donut,r:16,ease:E.lin,col:'#e3d4ff',trail:1});last.then(()=>boom(T,'#e3d4ff',.6));await sleep(95)}await last;boom(T,'#e3d4ff',1)}),
 mochikick:MV('Раздутая нога','#fff',PS('kickW',240),async(F,T)=>{const c=el('circle',{r:8,fill:'#fff',opacity:.92,stroke:'#a06bff','stroke-width':5,filter:'drop-shadow(0 0 10px #a06bff)'});
  await run(260,t=>{const f=F.W('ff');c.setAttribute('cx',f.x);c.setAttribute('cy',f.y);c.setAttribute('r',8+38*E.out(t))});
  const pr=F.to('kick',120,E.in,{dx:GAP(F)-175});await run(120,t=>{const f=F.W('ff');c.setAttribute('cx',f.x);c.setAttribute('cy',f.y)});await pr;boom(T,'#e3d4ff',1.5,'pel');await sleep(60);c.remove()}),
 ringroll:MV('Катящееся кольцо','#fff',PS('charge',260),async(F,T)=>{const A0={x:F.W('pel').x+F.dir*60,y:GROUND-42},B0={x:T.W('pel').x,y:GROUND-42};
  await flyer(F,A0,B0,{dur:420,ease:E.lin,spin:900*F.dir,shape:SH.donut,r:40,col:'#e3d4ff',trail:1});boom(T,'#e3d4ff',1.5,'pel');shake()}),
 trident:MV('Трезубец','#a06bff',PS('windup',300,{dx:-18}),async(F,T)=>{await F.to('punch',90,E.in,{dx:GAP(F)-120*F.sc});const B=T.W('sh');
  for(let i=0;i<3;i++){const H=F.W('fh');await flyer(F,H,{x:B.x-F.dir*6,y:B.y+(i-1)*34},{dur:110,ease:E.in,aim:1,shape:SH.trident,s0:1,s1:i===2?1.7:1.1,col:'#a06bff'});boom(T,'#a06bff',i===2?1.8:.7)}await sleep(60)}),
 bigfists:MV('Раздутые кулаки','#fff',PS('cast',260,{fu:80,fb:10,bu:80,bb:10}),async(F,T)=>{const B=T.W('pel');
  const f1=flyer(F,{x:B.x-230,y:B.y-80},{x:B.x-30,y:B.y},{dur:240,aim:1,shape:SH.fist,r:52,col:'#fff',st:'#a06bff'});const f2=flyer(F,{x:B.x+230,y:B.y-80},{x:B.x+30,y:B.y},{dur:240,aim:1,shape:SH.fist,r:52,col:'#fff',st:'#a06bff'});
  await Promise.all([f1,f2]);boom(T,'#e3d4ff',2,'pel');shake()}),
 donutstorm:MV('Пончиковый шторм','#e3d4ff',PS('cast',260,{fu:150,fb:0,bu:150,bb:0}),async(F,T)=>{const B=T.W('pel');let last;
  for(let i=0;i<12;i++){const a=i*.9;last=flyer(F,{x:B.x+Math.cos(a)*190,y:-40-(i%4)*30},{x:B.x+Math.cos(a)*30,y:B.y+Math.sin(a)*40},{dur:340,ease:E.in,spin:720,shape:SH.donut,r:18,col:'#e3d4ff',trail:1});last.then(()=>boom(T,'#e3d4ff',.5,'pel'));await sleep(70)}await last;boom(T,'#fff',2,'pel');shake()}),
/* ---- розовый: резиновое тело ---- */
 gatling:MV('Град ударов','#ff9ac0',PS('windup',200),async(F,T)=>{await F.to('cast',70,E.out);const B=T.W('sh');let last;
  for(let i=0;i<14;i++){const H=F.W(i%2?'bh':'fh');last=flyer(F,H,{x:B.x-F.dir*8,y:B.y+R_(-45,45)},{dur:130,ease:E.lin,shape:SH.fist,r:11,col:'#ff7aa8',mirror:1});last.then(()=>burst(B.x+R_(-14,14),B.y+R_(-40,40),4,'#ffb0cc',.6));if(i%4===3){flash(.12);shake()}await sleep(42)}await last;boom(T,'#ff7aa8',1.2)}),
 longkick:MV('Растянутая нога','#ff9ac0',PS('kickW',220),async(F,T)=>{const pr=F.to('kick',110,E.in);const A0=F.W('pel'),B=T.W('sh');const ex=B.x-F.dir*14,ey=B.y+40;
  const ln=el('line',{x1:A0.x,y1:A0.y,x2:A0.x,y2:A0.y,stroke:'#ff7aa8','stroke-width':20,'stroke-linecap':'round',filter:'drop-shadow(0 0 8px #ff7aa8)'});const ft=el('g',{});SH.fist(ft,{r:18,col:'#ff7aa8'});
  await run(170,t=>{const k=E.out(t),x=L_(A0.x,ex,k),y=L_(A0.y,ey,k);ln.setAttribute('x2',x);ln.setAttribute('y2',y);ft.setAttribute('transform',`translate(${x},${y})`)});await pr;boom(T,'#ff7aa8',1.4,'pel');
  await run(170,t=>{const k=E.in(t),x=L_(ex,A0.x,k),y=L_(ey,A0.y,k);ln.setAttribute('x2',x);ln.setAttribute('y2',y);ft.setAttribute('transform',`translate(${x},${y})`)});ln.remove();ft.remove()}),
 sling:MV('Рогатка','#ff9ac0',async(F,T)=>{await F.to('windup',200,E.out,{dx:-30});const H=F.W('fh'),anc={x:F.x-F.dir*180,y:H.y};const l1=el('line',{x1:H.x,y1:H.y,x2:anc.x,y2:anc.y,stroke:'#ff7aa8','stroke-width':14,'stroke-linecap':'round'});F._sl=l1;
  await run(300,t=>{const h=F.W('fh');l1.setAttribute('x1',h.x);l1.setAttribute('y1',h.y);l1.setAttribute('x2',L_(h.x,anc.x,E.out(t)));l1.setAttribute('y2',L_(h.y,anc.y,E.out(t)))})},
  async(F,T)=>{const l1=F._sl;const H=F.W('fh'),B=T.W('sh');F.to('punch',90,E.in,{dx:60});const ex=B.x-F.dir*10;const tip=el('g',{});SH.fist(tip,{r:26,col:'#ff7aa8'});
   await run(150,t=>{const k=E.in(t),x=L_(H.x,ex,k),y=L_(H.y,B.y,k);tip.setAttribute('transform',`translate(${x},${y}) scale(${F.dir},1)`);const s=F.W('sh');l1.setAttribute('x1',s.x);l1.setAttribute('y1',s.y);l1.setAttribute('x2',x);l1.setAttribute('y2',y)});boom(T,'#ff7aa8',1.5);tip.remove();l1.remove()}),
 stretcharm:MV('Растяжение руки','#ff7aa8',PS('windup',240,{bu:60,bb:60}),async(F,T)=>{await F.to('cast',90,E.out);const S=stretchArm(F,T,{col:'#ff7aa8',w:20,s:1.6,dur:210,tip:g=>SH.fist(g,{r:30,col:'#ff7aa8'})});await S.run();boom(T,'#ff7aa8',2,'pel');shake();await S.back()}),
 balloon:MV('Надутое тело','#ff9ac0',PS('charge',260),async(F,T)=>{const A0=F.W('pel'),B=T.W('pel');const g=el('g',{});el('circle',{r:30,fill:'#ff7aa8',opacity:.92,stroke:'#fff','stroke-width':4,filter:'drop-shadow(0 0 10px #ff7aa8)'},g);el('ellipse',{cx:-10,cy:-12,rx:12,ry:7,fill:'#fff',opacity:.7},g);
  await run(300,t=>{g.setAttribute('transform',`translate(${A0.x},${A0.y}) scale(${1+2*E.out(t)})`)});
  await run(260,t=>{const k=E.in(t);g.setAttribute('transform',`translate(${L_(A0.x,B.x,k)},${L_(A0.y,B.y,k)}) scale(${3-.3*k}) rotate(${k*360*F.dir})`)});g.remove();boom(T,'#ff7aa8',2,'pel');shake()}),
 gatlingH:MV('Пулемётный шквал','#ff7aa8',PS('windup',260,{dx:-20}),async(F,T)=>{await F.to('cast',70,E.out);const B=T.W('sh');let last;
  for(let i=0;i<26;i++){const H=F.W(i%2?'bh':'fh');last=flyer(F,H,{x:B.x-F.dir*8,y:B.y+R_(-70,70)},{dur:120,ease:E.lin,shape:SH.fist,r:14,col:'#ff7aa8',mirror:1});last.then(()=>burst(B.x+R_(-20,20),B.y+R_(-60,60),4,'#ffb0cc',.7));if(i%5===4){flash(.15);shake()}await sleep(34)}await last;
  await flyer(F,F.W('fh'),{x:B.x-F.dir*10,y:B.y},{dur:170,ease:E.in,shape:SH.fist,r:40,col:'#ff7aa8',mirror:1,s0:.5,s1:1.4});boom(T,'#ff7aa8',2.2,'pel');shake()}),
/* ---- голубой: сердца и стрелы ---- */
 cupid:MV('Стрела купидона','#8fdcff',PS('cast',220),async(F,T)=>{const B=T.W('sh');await flyer(F,F.W('fh'),{x:B.x-F.dir*10,y:B.y},{dur:190,ease:E.in,aim:1,shape:SH.arrow,col:'#56c8ff',trail:1});boom(T,'#8fdcff',.8);hearts(B.x,B.y,6)}),
 kiss:MV('Воздушный поцелуй','#ff9ad0',PS('cast',220),async(F,T)=>{const B=T.W('head');let last;
  for(let i=0;i<4;i++){last=flyer(F,F.W('fh'),{x:B.x-F.dir*10,y:B.y+R_(-20,20)},{dur:420,arc:60+i*14,ease:E.lin,shape:SH.heart,col:i%2?'#ff9ad0':'#8fdcff',s0:.5,s1:.9});last.then(()=>hearts(B.x,B.y,4,undefined,50));await sleep(110)}await last;boom(T,'#ff9ad0',1.2,'head')}),
 heartburst:MV('Сердечная вспышка','#ff9ad0',PS('cast',220,{fu:100,fb:10,bu:100,bb:10}),async(F,T)=>{const B=T.W('pel');flash(.35);ring(B.x,B.y,'#ff9ad0',140);hearts(B.x,B.y,14,undefined,130);await sleep(300);boom(T,'#8fdcff',1.2,'pel')}),
 heartshot:MV('Сердечный выстрел','#ff7ab8',async(F,T)=>{await F.to('charge',220,E.out,{fu:70,fb:80,bu:70,bb:80});const g=el('g',{});SH.heart(g,{col:'#ff7ab8'});F._h=g;await run(420,t=>{const m=F.W('fh');g.setAttribute('transform',`translate(${m.x+F.dir*20},${m.y}) scale(${.3+1.1*E.out(t)})`)})},
  async(F,T)=>{const g=F._h;const B=T.W('sh');const A0=F.W('fh');await F.to('cast',100,E.out,{fu:95,fb:5,bu:95,bb:5});g.remove();await flyer(F,{x:A0.x+F.dir*20,y:A0.y},{x:B.x-F.dir*10,y:B.y},{dur:260,ease:E.in,shape:SH.heart,col:'#ff7ab8',s0:1.4,s1:2.4,spin:20,trail:1});boom(T,'#ff7ab8',2.2,'pel');hearts(B.x,B.y,16,undefined,170);shake()}),
 arrowrain:MV('Дождь стрел','#8fdcff',PS('cast',260,{fu:160,fb:0,bu:160,bb:0}),async(F,T)=>{const B=T.W('pel');let last;
  for(let i=0;i<12;i++){const x=B.x+R_(-130,130);last=flyer(F,{x:x-F.dir*70,y:-40},{x:B.x+R_(-35,35),y:B.y+R_(-60,50)},{dur:260,ease:E.in,aim:1,shape:SH.arrow,col:i%2?'#56c8ff':'#ff7ab8'});last.then(()=>burst(B.x+R_(-40,40),B.y+R_(-40,40),4,'#8fdcff',.6));await sleep(70)}await last;boom(T,'#8fdcff',2,'pel');hearts(B.x,B.y,10);shake()}),
 lovebeam:MV('Любовный луч','#ff9ad0',PS('charge',260,{fu:80,fb:90,bu:80,bb:90}),async(F,T)=>{await F.to('cast',100,E.out,{fu:95,fb:5,bu:95,bb:5});const A0=F.W('fh'),B=T.W('sh');
  const o=el('line',{x1:A0.x,y1:A0.y,x2:A0.x,y2:A0.y,stroke:'#ff9ad0','stroke-width':46,'stroke-linecap':'round',opacity:.75,filter:'drop-shadow(0 0 16px #ff7ab8)'}),i2=el('line',{x1:A0.x,y1:A0.y,x2:A0.x,y2:A0.y,stroke:'#fff','stroke-width':16,'stroke-linecap':'round'});
  await run(160,t=>{const k=E.out(t);for(const l of [o,i2]){l.setAttribute('x2',L_(A0.x,B.x,k));l.setAttribute('y2',L_(A0.y,B.y,k))}});boom(T,'#ff9ad0',2,'pel');shake();
  await run(520,t=>{if(Math.random()<.6){const k=Math.random();const g=el('g',{});SH.heart(g,{col:Math.random()<.5?'#8fdcff':'#fff'});const x=L_(A0.x,B.x,k),y=L_(A0.y,B.y,k);run(300,u=>{g.setAttribute('transform',`translate(${x},${y-40*u}) scale(${.5-.2*u})`);g.setAttribute('opacity',1-u);if(u>=1)g.remove()})}});
  await run(240,t=>{o.setAttribute('opacity',.75*(1-t));i2.setAttribute('opacity',1-t);if(t>=1){o.remove();i2.remove()}})}),
/* ---- синий: сфера пространства ---- */
 phase:MV('Быстрый разрез','#9fb8ff',PS('windup',240,{dx:-20,bu:60,bb:60}),async(F,T)=>{await F.to('punch',100,E.in,{dx:GAP(F)-110*F.sc});const B=T.W('sh');cutAt(B.x,B.y,-.7,110,'#cfe0ff');await sleep(70);cutAt(B.x,B.y,.5,110,'#cfe0ff');boom(T,'#7fa8ff',1.1)}),
 blink:MV('Перемещение','#9fb8ff',async(F,T)=>{await F.to('windup',160,E.out,{bu:60,bb:60});ring(F.W('pel').x,F.W('pel').y,'#7fa8ff',80);await run(120,t=>{F.g.style.opacity=1-t});F.x=T.x-F.dir*(110*T.sc+20)},
  async(F,T)=>{ring(F.W('pel').x,F.W('pel').y,'#7fa8ff',80);await run(110,t=>{F.g.style.opacity=t});F.to('punch',70,E.in);const B=T.W('sh');cutAt(B.x,B.y,-.8,120,'#cfe0ff');await sleep(60);cutAt(B.x,B.y,.8,120,'#cfe0ff');boom(T,'#7fa8ff',1.3);await sleep(120);
   await run(110,t=>{F.g.style.opacity=1-t});F.x=F.home;ring(F.W('pel').x,F.W('pel').y,'#7fa8ff',60);await run(110,t=>{F.g.style.opacity=t})}),
 miniroom:MV('Сфера-клинок','#9fb8ff',PS('cast',220),async(F,T)=>{const B=T.W('head');const sp=sphere(B.x,B.y,70,'#7fa8ff');await run(220,t=>{sp.set(E.out(t),1)});for(const a of [-.9,.6]){cutAt(B.x,B.y,a,80,'#e6efff',7);await sleep(110)}boom(T,'#7fa8ff',1.2,'head');await run(240,t=>{sp.set(1+.3*t,1-t)});sp.g.remove()}),
 room:MV('Сфера пространства','#7fa8ff',PS('cast',260,{fu:100,fb:10,bu:100,bb:10}),async(F,T)=>{const B=T.W('pel');const sp=sphere(B.x,B.y,190,'#7fa8ff');flash(.25);await run(340,t=>{sp.set(E.out(t),1)});
  for(let i=0;i<7;i++){cutAt(B.x+R_(-30,30),B.y+R_(-60,40),R_(-1.4,1.4),120,'#e6efff',8);burst(B.x,B.y,5,'#bcd2ff',.7);if(i%3===2){flash(.15);shake()}await sleep(95)}
  boom(T,'#7fa8ff',2,'pel');await run(260,t=>{sp.set(1+.25*t,1-t)});sp.g.remove()}),
 multiroom:MV('Серия телепортаций','#7fa8ff',PS('cast',240,{fu:100,fb:10,bu:100,bb:10}),async(F,T)=>{const B=T.W('pel');const sp=sphere(B.x,B.y,190,'#7fa8ff');await run(320,t=>{sp.set(E.out(t),1)});
  for(let i=0;i<4;i++){ring(F.W('pel').x,F.W('pel').y,'#7fa8ff',60);F.g.style.opacity=.15;F.x=B.x-F.dir*(110*T.sc+(i%2)*40);await sleep(70);F.g.style.opacity=1;F.to(i%2?'punch':'windup',60,E.in,{bu:60,bb:60});cutAt(B.x,B.y+R_(-30,30),i%2?.7:-.7,130,'#e6efff',8);burst(B.x,B.y,6,'#bcd2ff',.8);await sleep(120)}
  F.g.style.opacity=.15;ring(F.W('pel').x,F.W('pel').y,'#7fa8ff',60);F.x=F.home;await sleep(70);F.g.style.opacity=1;boom(T,'#7fa8ff',2,'pel');shake();await run(240,t=>{sp.set(1+.25*t,1-t)});sp.g.remove()}),
 collapse:MV('Разрез сферы','#7fa8ff',PS('windup',260,{bu:60,bb:60}),async(F,T)=>{await F.to('punch',90,E.in,{dx:60});const B=T.W('pel');const sp=sphere(B.x,B.y,200,'#7fa8ff');await run(260,t=>{sp.set(E.out(t),1)});
  for(const a of [-.9,0,.9]){cutAt(B.x,B.y,a,210,'#e6efff',10);flash(.2);await sleep(110)}
  await run(300,t=>{sp.set(1-.8*E.in(t),1)});boom(T,'#7fa8ff',2.2,'pel');shake();for(let i=0;i<8;i++)cutAt(B.x+R_(-40,40),B.y+R_(-60,40),R_(-1.5,1.5),R_(50,90),'#cfe0ff',5);sp.g.remove()}),
/* ---- оранжевый: погода ---- */
 gust:MV('Порыв ветра','#e6f4ff',PS('cast',220),async(F,T)=>{const A0=F.W('fh'),B=T.W('sh');for(let i=0;i<10;i++){const y=B.y+R_(-60,50);const p=el('path',{d:'M0 0 q 20 -10 40 0 t 40 0',fill:'none',stroke:'#e6f4ff','stroke-width':3,'stroke-linecap':'round',opacity:.9});const x0=A0.x,x1=B.x-F.dir*20,y0=A0.y;
  run(280,t=>{const k=E.in(t);p.setAttribute('transform',`translate(${L_(x0,x1,k)},${L_(y0,y,k)}) scale(${F.dir},1)`);p.setAttribute('opacity',.9*(t<.8?1:(1-t)*5));if(t>=1)p.remove()});await sleep(30)}await sleep(260);boom(T,'#e6f4ff',1.3)}),
 rain:MV('Ливень','#7fc8ff',PS('cast',220,{fu:150,fb:0,bu:150,bb:0}),async(F,T)=>{const B=T.W('pel');const cl=cloud(B.x,90,.8);await run(260,t=>{cl.set(E.out(t))});
  await run(650,t=>{for(let i=0;i<4;i++){const x=B.x+R_(-80,80);const l=el('line',{x1:x,y1:100,x2:x-8,y2:126,stroke:'#9fd8ff','stroke-width':2.5,opacity:.9});const yb=B.y+R_(-20,60);run(220,u=>{const y=L_(100,yb,u);l.setAttribute('y1',y);l.setAttribute('y2',y+26);l.setAttribute('x1',x-8*u);l.setAttribute('x2',x-8*u-8);if(u>=1){l.remove();burst(x,GROUND,2,'#9fd8ff',.4)}})}});
  boom(T,'#7fc8ff',1.2,'pel');await run(240,t=>{cl.set(1,1-t)});cl.g.remove()}),
 spark:MV('Искра','#fff06a',PS('cast',200),async(F,T)=>{const A0=F.W('fh'),B=T.W('sh');bolt(A0.x,A0.y,B.x,B.y,'#fff6a8',5);await sleep(90);bolt(A0.x,A0.y,B.x,B.y+20,'#fff6a8',4);flash(.25);boom(T,'#fff06a',1)}),
 stormcloud:MV('Грозовая туча','#ffd45a',PS('cast',260,{fu:172,fb:0,bu:60,bb:20}),async(F,T)=>{const B=T.W('head');const cl=cloud(B.x,95,1.3);await run(360,t=>{cl.set(E.out(t))});
  for(let i=0;i<3;i++){bolt(B.x+R_(-30,30),130,B.x+R_(-20,20),B.y+60,'#fff6a8',8);flash(.55);shake();burst(B.x,B.y+40,10,'#fff6a8',1.1);await sleep(170)}boom(T,'#ffd45a',2,'pel');await run(300,t=>{cl.set(1,1-t)});cl.g.remove()}),
 tornado:MV('Смерч','#cfe6ff',PS('cast',260),async(F,T)=>{const B=T.W('pel');const g=el('g',{});const rings=[];for(let i=0;i<9;i++)rings.push(el('ellipse',{cx:0,cy:0,rx:18+i*11,ry:7+i*2.2,fill:'none',stroke:i%2?'#e6f4ff':'#9fc4e8','stroke-width':4,opacity:.85},g));
  await run(820,t=>{const w=Math.min(1,t*4);rings.forEach((e,i)=>{const ph=t*14+i*.9;e.setAttribute('cx',B.x+Math.sin(ph)*8);e.setAttribute('cy',GROUND-i*26*w);e.setAttribute('opacity',(t>.85?(1-t)*6:1)*.85)});if(Math.random()<.5)burst(B.x,GROUND-6,2,'#d9c39a',.7)});
  g.remove();boom(T,'#cfe6ff',2,'pel');shake()}),
 hail:MV('Градовая буря','#cfeaff',PS('cast',260,{fu:172,fb:0,bu:172,bb:0}),async(F,T)=>{const B=T.W('pel');const cl=cloud(B.x,95,1.5);await run(280,t=>{cl.set(E.out(t))});let last;
  for(let i=0;i<22;i++){const x=B.x+R_(-90,90);last=flyer(F,{x:x+30,y:120},{x:x,y:B.y+R_(-50,60)},{dur:230,ease:E.in,shape:(g)=>{el('circle',{r:9,fill:'#e6f7ff',stroke:'#7fc8ff','stroke-width':2.5,filter:'drop-shadow(0 0 5px #9fd8ff)'},g)}});last.then(()=>burst(x,B.y+R_(-40,50),3,'#e6f7ff',.5));if(i%7===6)flash(.15);await sleep(30)}
  await last;boom(T,'#cfeaff',2,'pel');shake();await run(260,t=>{cl.set(1,1-t)});cl.g.remove()}),
/* ---- сиреневый: конечности из поверхностей ---- */
 grabhand:MV('Рука из пола','#c9a0ff',PS('cast',220),async(F,T)=>{const B=T.W('pel');const g=el('g',{});SH.hand(g,{});const s=1.5;
  await run(200,t=>{const k=E.out(t);g.setAttribute('transform',`translate(${B.x},${GROUND+30*s-70*s*k}) scale(${s})`)});flash(.25);boom(T,'#c9a0ff',1.2,'pel');
  await run(220,t=>{g.setAttribute('transform',`translate(${B.x},${GROUND-40*s*(1+.4*t)}) scale(${s*(1+.2*t)})`);g.setAttribute('opacity',1-t)});g.remove()}),
 footkick:MV('Нога из воздуха','#c9a0ff',PS('cast',220),async(F,T)=>{const B=T.W('pel');const sx=B.x+F.dir*130;ring(sx,B.y,'#c9a0ff',50);burst(sx,B.y,8,'#e3d0ff',.8);await sleep(90);
  await flyer(F,{x:sx,y:B.y},{x:B.x+F.dir*20,y:B.y},{dur:150,ease:E.in,aim:1,shape:SH.foot,s0:1.2,s1:1.4});boom(T,'#c9a0ff',1.5,'pel')}),
 bodyhands:MV('Руки из тела','#c9a0ff',PS('cast',220,{fu:110,fb:10,bu:110,bb:10}),async(F,T)=>{let last;
  for(const k of ['head','sh','pel','sh']){const p=T.W(k);const g=el('g',{});SH.hand(g,{});ring(p.x,p.y,'#c9a0ff',45);const ang=R_(-60,60);
   last=run(260,u=>{const s=.7*E.out(u);g.setAttribute('transform',`translate(${p.x},${p.y}) rotate(${ang}) scale(${s})`);if(u>=1)run(160,v=>{g.setAttribute('opacity',1-v);if(v>=1)g.remove()})});await sleep(110)}await last;boom(T,'#c9a0ff',1.4,'pel')}),
 gianthand:MV('Гигантская рука','#c9a0ff',PS('cast',260,{fu:60,fb:30,bu:60,bb:30}),async(F,T)=>{const B=T.W('pel'),bx=B.x-F.dir*190;const g=el('g',{});SH.hand(g,{});const s=3;flash(.15);burst(bx,GROUND,16,'#d9c39a',1.2);
  await run(240,t=>{g.setAttribute('transform',`translate(${bx},${GROUND+260*(1-E.out(t))}) scale(${s}) translate(0,-34)`)});await sleep(80);
  await run(170,t=>{const k=E.in(t);g.setAttribute('transform',`translate(${bx},${GROUND}) rotate(${62*F.dir*k}) scale(${s}) translate(0,-34)`)});
  boom(T,'#c9a0ff',2.2,'pel');shake();await run(300,t=>{g.setAttribute('opacity',1-t);if(t>=1)g.remove()})}),
 giantfoot:MV('Гигантская нога','#c9a0ff',PS('cast',260,{fu:172,fb:0,bu:60,bb:20}),async(F,T)=>{const B=T.W('pel');const g=el('g',{});SH.foot(g,{});const s=3.2;
  await run(260,t=>{const k=E.in(t);g.setAttribute('transform',`translate(${B.x},${L_(-200,GROUND-52*s,k)}) rotate(90) scale(${s})`)});
  for(const [d,c] of [[0,'#c9a0ff'],[90,'#fff']])after(()=>{const e=el('ellipse',{cx:B.x,cy:GROUND,rx:10,ry:3,fill:'none',stroke:c,'stroke-width':7});run(480,t=>{e.setAttribute('rx',10+250*E.out(t));e.setAttribute('ry',3+32*E.out(t));e.setAttribute('opacity',1-t);if(t>=1)e.remove()})},d);
  boom(T,'#c9a0ff',2.4,'pel');shake();await sleep(160);await run(260,t=>{g.setAttribute('opacity',1-t);if(t>=1)g.remove()})}),
 handforest:MV('Лес рук','#c9a0ff',PS('cast',260,{fu:110,fb:10,bu:110,bb:10}),async(F,T)=>{const B=T.W('pel');let last;
  for(let i=0;i<9;i++){const x=B.x+R_(-100,100),s=R_(1,1.7);const g=el('g',{});SH.hand(g,{});const ang=R_(-14,14);
   last=run(260,t=>{const k=E.out(t);g.setAttribute('transform',`translate(${x},${GROUND+34*s-110*s*k}) rotate(${ang}) scale(${s})`);if(t>=1)run(300,v=>{g.setAttribute('opacity',1-v);if(v>=1)g.remove()})});burst(x,GROUND,3,'#e3d0ff',.5);await sleep(60)}await last;flash(.4);boom(T,'#c9a0ff',2.2,'pel');shake()}),
/* ---- красный: магнит и металл ---- */
 junk:MV('Железный град','#d7dde5',PS('windup',220),async(F,T)=>{await F.to('cast',90,E.out);const B=T.W('sh');let last;
  for(let i=0;i<7;i++){last=flyer(F,{x:F.W('pel').x-F.dir*R_(10,70),y:R_(120,380)},{x:B.x-F.dir*8,y:B.y+R_(-50,50)},{dur:260,ease:E.in,spin:R_(200,500),shape:SH.metal,r:R_(10,16),trail:1,col:'#d7dde5'});last.then(()=>burst(B.x,B.y+R_(-40,40),5,'#d7dde5',.7));await sleep(70)}await last;boom(T,'#ffb0b0',1.2)}),
 blades:MV('Клинки','#dfe6ee',PS('cast',220,{fu:160,fb:0}),async(F,T)=>{const B=T.W('sh');let last;
  for(let i=0;i<5;i++){last=flyer(F,{x:F.W('pel').x-F.dir*R_(20,90),y:R_(80,380)},{x:B.x-F.dir*8,y:B.y+R_(-50,50)},{dur:240,ease:E.in,aim:1,shape:SH.sword,trail:1,col:'#dfe6ee'});last.then(()=>burst(B.x,B.y+R_(-40,40),5,'#dfe6ee',.8));await sleep(90)}await last;boom(T,'#ffb0b0',1.3)}),
 magthrow:MV('Магнитный бросок','#d7dde5',async(F,T)=>{await F.to('cast',180,E.out,{fu:150,fb:0});const H=F.W('fh');const gp=el('g',{});SH.metal(gp,{r:24});
  for(let i=0;i<6;i++)flyer(F,{x:H.x+R_(-200,200),y:R_(60,380)},{x:H.x,y:H.y-30},{dur:300,ease:E.in,spin:300,shape:SH.metal,r:R_(8,12)});F._gp=gp;await run(320,t=>{gp.setAttribute('transform',`translate(${H.x},${H.y-30}) scale(${.3+E.out(t)})`)})},
  async(F,T)=>{const gp=F._gp;const H=F.W('fh'),B=T.W('sh');F.to('punch',90,E.in,{dx:40});await run(200,t=>{const k=E.in(t);gp.setAttribute('transform',`translate(${L_(H.x,B.x-F.dir*10,k)},${L_(H.y-30,B.y,k)}) scale(1.3) rotate(${k*360})`)});gp.remove();boom(T,'#d7dde5',1.6)}),
 bigmetal:MV('Огромный кусок металла','#c9d0d9',async(F,T)=>{await F.to('cast',240,E.out,{fu:172,fb:0,bu:60,bb:20});const cx=F.W('pel').x,cy=110;
  for(let i=0;i<14;i++){const a=R_(0,6.28);flyer(F,{x:cx+Math.cos(a)*300,y:cy+Math.sin(a)*160},{x:cx,y:cy},{dur:420,ease:E.in,spin:400,shape:SH.metal,r:R_(10,18),col:'#c9d0d9'});await sleep(24)}
  const g=el('g',{});SH.metal(g,{r:80});F._bm=g;await run(300,t=>{g.setAttribute('transform',`translate(${cx},${cy}) scale(${Math.max(.01,E.out(t))})`)})},
  async(F,T)=>{const g=F._bm;const B=T.W('pel');const cx=F.W('pel').x,cy=110;await run(280,t=>{const k=E.in(t);g.setAttribute('transform',`translate(${L_(cx,B.x,k)},${L_(cy,B.y,k)}) scale(${1+.15*k}) rotate(${k*200*F.dir})`)});g.remove();boom(T,'#ffb0b0',2.4,'pel');shake();
   for(let i=0;i<10;i++)flyer(F,{x:B.x,y:B.y},{x:B.x+R_(-140,140),y:B.y+R_(-110,60)},{dur:380,ease:E.out,spin:500,shape:SH.metal,r:R_(6,12)})}),
 metalfist:MV('Железный кулак','#d7dde5',PS('windup',260,{bu:60,bb:60}),async(F,T)=>{await F.to('cast',90,E.out);const S=stretchArm(F,T,{col:'#8a929c',w:22,s:1.7,dur:220,tip:g=>{SH.metal(g,{r:36});SH.fist(g,{r:28,col:'#9aa3ad',st:'#2a2f36'})}});await S.run();boom(T,'#ffb0b0',2,'pel');shake();await S.back()}),
 ironstorm:MV('Железный шквал','#d7dde5',PS('cast',260,{fu:160,fb:0,bu:160,bb:0}),async(F,T)=>{const B=T.W('pel');let last;
  for(let i=0;i<20;i++){const sw=i%3===0;last=flyer(F,{x:F.x-F.dir*R_(0,120),y:R_(60,400)},{x:B.x+R_(-30,30),y:B.y+R_(-70,60)},{dur:250,ease:E.in,aim:sw,spin:sw?0:400,shape:sw?SH.sword:SH.metal,r:R_(10,16),trail:1,col:'#d7dde5'});last.then(()=>burst(B.x+R_(-30,30),B.y+R_(-50,50),4,'#d7dde5',.7));if(i%6===5){flash(.12);shake()}await sleep(48)}
  await last;boom(T,'#ffb0b0',2.2,'pel');shake()}),
/* ---- жёлтый: только ноги ---- */
 rapid:MV('Серия пинков','#ffe27a',PS('kickW',200),async(F,T)=>{await F.to('kick',100,E.in,{dx:GAP(F)-175});const B=T.W('sh');
  for(let i=0;i<4;i++){F.to(i%2?'kickW':'kick',55,E.out,{dx:GAP(F)-175});cutAt(B.x,B.y+R_(-40,40),R_(-.6,.6),R_(60,90),'#fff2a8',7);burst(B.x,B.y,5,'#ffe27a',.7);flash(.12);await sleep(80)}boom(T,'#ffe27a',1.6)}),
 spinkick:MV('Вращающийся пинок','#ffe27a',PS('kickW',220),async(F,T)=>{const pr=F.to('kick',110,E.in,{dx:60});const f=F.W('ff'),B=T.W('sh');
  await flyer(F,{x:f.x,y:f.y-20},{x:B.x-F.dir*10,y:B.y},{dur:200,ease:E.in,aim:1,shape:SH.crescent,s0:1,s1:1.4,col:'#fff2a8'});await pr;boom(T,'#ffe27a',1.5)}),
 skykick:MV('Пинок сверху','#ffe27a',async(F,T)=>{await F.to('kickW',260,E.out,{dy:-170,dx:GAP(F)*.55-60,t:-6})},async(F,T)=>{await F.to('kick',110,E.in,{dx:GAP(F)-175,dy:0,t:-30});const B=T.W('head');cutAt(B.x,B.y,1.2,120,'#fff2a8',9);boom(T,'#ffe27a',1.8);shake()}),
 firekick:MV('Воспламенённая нога','#ff9a2a',async(F,T)=>{await F.to('kickW',260,E.out);legFlame(F,1100);await sleep(260)},async(F,T)=>{await F.to('kick',110,E.in,{dx:GAP(F)-175});const B=T.W('sh'),ff=F.W('ff');
  await flyer(F,{x:ff.x,y:ff.y-30},{x:B.x,y:B.y},{dur:140,ease:E.in,aim:1,shape:SH.flameBlade,s0:1,s1:1.6});boom(T,'#ff9a2a',2,'pel');burst(B.x,B.y,24,'#ffcf5a',1.6);shake()}),
 firewheel:MV('Огненный вихрь','#ff9a2a',async(F,T)=>{await F.to('kickW',240,E.out);legFlame(F,1000);await sleep(200)},async(F,T)=>{const pr=F.to('kick',120,E.in,{dx:GAP(F)-175});const f=F.W('pel'),B=T.W('pel');
  await flyer(F,{x:f.x+F.dir*70,y:GROUND-60},{x:B.x,y:B.y},{dur:300,ease:E.lin,spin:1080*F.dir,shape:(g)=>{el('circle',{r:46,fill:'none',stroke:'#ff9a2a','stroke-width':14,'stroke-dasharray':'60 40',filter:'drop-shadow(0 0 10px #ff7a1a)'},g);el('circle',{r:46,fill:'none',stroke:'#fff2a8','stroke-width':5,'stroke-dasharray':'30 70'},g)},s0:1,s1:1.5,trail:1,col:'#ffcf5a'});await pr;boom(T,'#ff9a2a',2.2,'pel');shake()}),
 starkick:MV('Падающая звезда','#ffd23a',async(F,T)=>{await F.to('kickW',300,E.out,{dy:-300,dx:GAP(F)*.5-60,t:-10});legFlame(F,1000);await sleep(80)},async(F,T)=>{await F.to('kick',150,E.in,{dx:GAP(F)-175,dy:0,t:-30});const B=T.W('pel');
  for(const [d,c] of [[0,'#ffd23a'],[90,'#fff2a8']])after(()=>{const e=el('ellipse',{cx:B.x,cy:GROUND,rx:10,ry:3,fill:'none',stroke:c,'stroke-width':7});run(480,t=>{e.setAttribute('rx',10+260*E.out(t));e.setAttribute('ry',3+34*E.out(t));e.setAttribute('opacity',1-t);if(t>=1)e.remove()})},d);
  boom(T,'#ffd23a',2.4,'pel');burst(B.x,GROUND-6,30,'#ffcf5a',1.6);shake()}),
/* ---- бордовый: вода ---- */
 jet:MV('Водяная струя','#6fc8ff',PS('cast',220),async(F,T)=>{const A0=F.W('fh'),B=T.W('sh');
  const o=el('line',{x1:A0.x,y1:A0.y,x2:A0.x,y2:A0.y,stroke:'#6fc8ff','stroke-width':22,'stroke-linecap':'round',opacity:.85,filter:'drop-shadow(0 0 8px #38a8ff)'}),i2=el('line',{x1:A0.x,y1:A0.y,x2:A0.x,y2:A0.y,stroke:'#e6f7ff','stroke-width':8,'stroke-linecap':'round'});
  await run(150,t=>{const k=E.out(t);for(const l of [o,i2]){l.setAttribute('x2',L_(A0.x,B.x,k));l.setAttribute('y2',L_(A0.y,B.y,k))}});boom(T,'#6fc8ff',1.3);burst(B.x,B.y,14,'#9fe0ff',1.3);await sleep(220);
  await run(200,t=>{o.setAttribute('opacity',.85*(1-t));i2.setAttribute('opacity',1-t);if(t>=1){o.remove();i2.remove()}})}),
 orb:MV('Водяной шар','#6fc8ff',PS('cast',220),async(F,T)=>{const B=T.W('sh');await flyer(F,F.W('fh'),{x:B.x-F.dir*10,y:B.y},{dur:320,arc:60,ease:E.lin,shape:SH.water,r:26,trail:1,col:'#9fe0ff'});boom(T,'#6fc8ff',1.5);burst(B.x,B.y,22,'#9fe0ff',1.6)}),
 swell:MV('Волна','#6fc8ff',PS('charge',260),async(F,T)=>{await F.to('cast',110,E.out,{fu:70,fb:60});const sx=F.W('pel').x+F.dir*60,ex=T.W('pel').x,n=12;
  for(let i=0;i<n;i++){const x=sx+(ex-sx)*i/(n-1);const g=el('g',{});el('path',{d:'M-22 0 Q-24 -36 0 -46 Q28 -36 22 0Z',fill:'#6fc8ff',opacity:.9,stroke:'#e6f7ff','stroke-width':3,filter:'drop-shadow(0 0 8px #38a8ff)'},g);el('ellipse',{cx:0,cy:-44,rx:14,ry:6,fill:'#fff'},g);
   run(380,t=>{const k=t<.3?E.out(t/.3):1-(t-.3)/.7;g.setAttribute('transform',`translate(${x},${GROUND}) scale(${1+i*.05},${Math.max(.01,(1.1+i*.04)*k)})`);if(t>=1)g.remove()});await sleep(32)}
  boom(T,'#6fc8ff',1.6,'pel');burst(T.W('pel').x,GROUND-20,16,'#9fe0ff',1.4)}),
 whirl:MV('Водяной вихрь','#6fc8ff',async(F,T)=>{F.to('windup',300,E.out,{bu:60,bb:60});const ls=[];for(let i=0;i<5;i++)ls.push(el('path',{fill:'none',stroke:'#9fe0ff','stroke-width':4,'stroke-linecap':'round',opacity:0}));
  await run(520,t=>{const h=F.W('fh');ls.forEach((l,i)=>{const a=t*14+i*1.26,r=18+36*t;l.setAttribute('d',`M${h.x+Math.cos(a)*r} ${h.y+Math.sin(a)*r*.55} A ${r} ${r*.55} 0 0 1 ${h.x+Math.cos(a+1.1)*r} ${h.y+Math.sin(a+1.1)*r*.55}`);l.setAttribute('opacity',.35+.65*t)})});ls.forEach(l=>l.remove())},
  async(F,T)=>{await F.to('punch',120,E.in,{dx:-12});const H=F.W('fh'),B=T.W('sh');const g=el('g',{});const es=[0,1,2,3].map(i=>el('ellipse',{rx:20+i*14,ry:8+i*4,fill:'none',stroke:i%2?'#e6f7ff':'#6fc8ff','stroke-width':5,opacity:.9,cy:-i*18,filter:'drop-shadow(0 0 6px #38a8ff)'},g));
   await run(300,t=>{const k=E.in(t),x=L_(H.x+F.dir*40,B.x-F.dir*10,k),y=L_(H.y,B.y,k);g.setAttribute('transform',`translate(${x},${y+36}) scale(${1+.8*k})`);es.forEach((e,i)=>e.setAttribute('rx',(20+i*14)*(1+.2*Math.sin(t*30+i))))});g.remove();boom(T,'#6fc8ff',2.2,'pel');burst(B.x,B.y,30,'#9fe0ff',1.8);shake()}),
 geyser:MV('Гейзер','#6fc8ff',PS('cast',240,{fu:60,fb:40,bu:60,bb:40}),async(F,T)=>{const gx=T.W('pel').x;const mk=el('ellipse',{cx:gx,cy:GROUND,rx:5,ry:2,fill:'rgba(80,170,255,.35)',stroke:'#6fc8ff','stroke-width':5});await run(340,t=>{mk.setAttribute('rx',5+70*E.out(t));mk.setAttribute('ry',2+16*E.out(t))});
  const top=40,w=96;const col=el('rect',{x:gx-w/2,y:GROUND,width:w,height:0,rx:30,fill:'#6fc8ff',opacity:.9,filter:'drop-shadow(0 0 14px #38a8ff)'}),core=el('rect',{x:gx-20,y:GROUND,width:40,height:0,rx:20,fill:'#e6f7ff',opacity:.85});flash(.4);shake();
  await run(190,t=>{const h=(GROUND-top)*E.out(t);for(const r of [col,core]){r.setAttribute('y',GROUND-h);r.setAttribute('height',h)}});burst(gx,GROUND-10,30,'#9fe0ff',1.8);ring(gx,GROUND-10,'#e6f7ff',150);
  await run(480,t=>{if(Math.random()<.9){const c=el('circle',{cx:gx+R_(-w/2,w/2),cy:GROUND-R_(0,GROUND-top),r:R_(3,6),fill:'#e6f7ff'});run(300,u=>{c.setAttribute('cy',+c.getAttribute('cy')-2);c.setAttribute('opacity',1-u);if(u>=1)c.remove()})}});
  await run(260,t=>{col.setAttribute('opacity',.9*(1-t));core.setAttribute('opacity',.85*(1-t));mk.setAttribute('opacity',1-t);if(t>=1){col.remove();core.remove();mk.remove()}})}),
 tsunami:MV('Цунами','#6fc8ff',PS('cast',280,{fu:172,fb:0,bu:172,bb:0}),async(F,T)=>{const g=el('g',{});el('path',{d:'M0 0 L0 -40 Q10 -190 130 -230 Q90 -170 150 -140 Q110 -120 150 -60 L180 0Z',fill:'#6fc8ff',stroke:'#e6f7ff','stroke-width':4,opacity:.92,filter:'drop-shadow(0 0 12px #38a8ff)'},g);el('path',{d:'M12 -50 Q24 -170 120 -215',fill:'none',stroke:'#fff','stroke-width':6,'stroke-linecap':'round'},g);
  const sx=F.x-F.dir*200,ex=T.W('pel').x-F.dir*60;const s=1.6;await run(520,t=>{const k=E.in(t);g.setAttribute('transform',`translate(${L_(sx,ex,k)},${GROUND}) scale(${F.dir*s},${s})`)});
  boom(T,'#6fc8ff',2.6,'pel');shake();burst(ex,GROUND-60,40,'#9fe0ff',2);await run(380,t=>{g.setAttribute('transform',`translate(${ex+F.dir*120*t},${GROUND}) scale(${F.dir*s},${s})`);g.setAttribute('opacity',.92*(1-t));if(t>=1)g.remove()})})
});

/* ---------- набор 2: адмиралы и хранители ---------- */
$('stage').querySelector('defs').insertAdjacentHTML('beforeend','<radialGradient id="lavaG" cx="40%" cy="40%" r="75%"><stop offset="0" stop-color="#ffd25a"/><stop offset=".35" stop-color="#ff6a1a"/><stop offset=".75" stop-color="#a01808"/><stop offset="1" stop-color="#3a0f08"/></radialGradient>');
const DX=(F)=>GAP(F)-110*F.sc;
Object.assign(SH,{
 lava:(g,o)=>{const r=o.r||20;el('circle',{r,fill:'url(#lavaG)',stroke:'#ffb43a','stroke-width':3,filter:'drop-shadow(0 0 10px #ff5a1a)'},g);el('path',{d:`M${-r*.5} ${-r*.2} L${r*.1} ${r*.1} L${r*.5} ${-r*.4} M${-r*.2} ${r*.6} L${r*.1} ${r*.1}`,stroke:'#ffd25a','stroke-width':2.5,fill:'none'},g)},
 lfist:(g,o)=>{const r=o.r||30;el('circle',{r,fill:'url(#lavaG)',stroke:'#ffb43a','stroke-width':4,filter:'drop-shadow(0 0 14px #ff5a1a)'},g);for(const y of [-.55,-.18,.18,.55])el('circle',{cx:r*.8,cy:y*r,r:r*.28,fill:'url(#lavaG)',stroke:'#ffb43a','stroke-width':3},g)},
 spike:(g,o)=>{el('polygon',{points:'-34,-10 44,0 -34,10',fill:'url(#lavaG)',stroke:'#ffb43a','stroke-width':2.5,filter:'drop-shadow(0 0 8px #ff5a1a)'},g)},
 icicle:(g,o)=>{el('polygon',{points:'-46,-8 46,0 -46,8',fill:'#e6f7ff',stroke:'#8fdcff','stroke-width':2,filter:'drop-shadow(0 0 8px #8fdcff)'},g)},
 gball:(g,o)=>{const r=o.r||22;el('circle',{r,fill:'#150a26',stroke:'#a98bff','stroke-width':4,filter:'drop-shadow(0 0 12px #a98bff)'},g);el('ellipse',{rx:r*1.6,ry:r*.4,fill:'none',stroke:'#c9b0ff','stroke-width':3},g)},
 rock:(g,o)=>{const s=o.r||14;el('polygon',{points:`${-s},${-s*.4} ${-s*.3},${-s} ${s},${-s*.5} ${s*.9},${s*.7} ${-s*.4},${s}`,fill:'#6b5440',stroke:'#241a10','stroke-width':2.5},g)},
 mace:(g,o)=>{el('line',{x1:-76,y1:0,x2:14,y2:0,stroke:'#3a2412','stroke-width':12,'stroke-linecap':'round'},g);el('line',{x1:-74,y1:0,x2:14,y2:0,stroke:'#7a4a2a','stroke-width':7,'stroke-linecap':'round'},g);
  for(let k=0;k<8;k++){const a=k*Math.PI/4;el('polygon',{points:`${34+Math.cos(a-.25)*26},${Math.sin(a-.25)*26} ${34+Math.cos(a)*42},${Math.sin(a)*42} ${34+Math.cos(a+.25)*26},${Math.sin(a+.25)*26}`,fill:'#b8bdc6',stroke:'#2a2f36','stroke-width':2},g)}
  el('circle',{cx:34,cy:0,r:28,fill:'#8a8f98',stroke:'#2a2f36','stroke-width':3},g)},
 bigsword:(g,o)=>{const c=o.col||'#ff8ec4';el('line',{x1:-34,y1:0,x2:170,y2:0,stroke:'#2a2f36','stroke-width':22,'stroke-linecap':'round'},g);el('line',{x1:-30,y1:0,x2:170,y2:0,stroke:'#f4f1ff','stroke-width':14,'stroke-linecap':'round',filter:`drop-shadow(0 0 12px ${c})`},g);el('line',{x1:-40,y1:-22,x2:-40,y2:22,stroke:'#d8b24a','stroke-width':8,'stroke-linecap':'round'},g)},
 forcewave:(g,o)=>{const c=o.col||'#ffffff';el('path',{d:'M0 -70 Q44 0 0 70',fill:'none',stroke:c,'stroke-width':12,'stroke-linecap':'round',filter:`drop-shadow(0 0 10px ${c})`},g);el('path',{d:'M-12 -52 Q22 0 -12 52',fill:'none',stroke:c,'stroke-width':5,'stroke-linecap':'round',opacity:.7},g)}
});
function zap(A0,B0,col='#ffe14a',w=6,d=200){const l=el('line',{x1:A0.x,y1:A0.y,x2:B0.x,y2:B0.y,stroke:col,'stroke-width':w,'stroke-linecap':'round',filter:`drop-shadow(0 0 10px ${col})`}),c=el('line',{x1:A0.x,y1:A0.y,x2:B0.x,y2:B0.y,stroke:'#fff','stroke-width':w*.4,'stroke-linecap':'round'});
 return run(d,t=>{const o=1-t;l.setAttribute('opacity',o);c.setAttribute('opacity',o);l.setAttribute('stroke-width',w*(1-.5*t));if(t>=1){l.remove();c.remove()}})}
function cloud2(cx,cy,s,fill,stroke,hi){const g=el('g',{});for(const [x,y,r] of [[-60,10,34],[-20,-8,44],[28,-4,46],[66,12,32],[0,18,40]])el('circle',{cx:x,cy:y,r,fill,stroke,'stroke-width':3},g);el('ellipse',{cx:-10,cy:-24,rx:30,ry:10,fill:hi,opacity:.6},g);
 const set=(k,op=1)=>{g.setAttribute('transform',`translate(${cx},${cy}) scale(${Math.max(.01,k)*s})`);g.setAttribute('opacity',op)};set(0);return {g,set}}
function bladeFollow(F,dur,col,len,w){const g=el('g',{});const bo=el('line',{stroke:'#10243a','stroke-width':w+6,'stroke-linecap':'round'},g),bi=el('line',{stroke:col,'stroke-width':w,'stroke-linecap':'round',filter:`drop-shadow(0 0 9px ${col})`},g);
 return run(dur,t=>{const fe=F.W('fe'),fh=F.W('fh');let dx=fh.x-fe.x,dy=fh.y-fe.y;const n=Math.hypot(dx,dy)||1;dx/=n;dy/=n;for(const l of [bo,bi]){l.setAttribute('x1',fh.x+dx*3);l.setAttribute('y1',fh.y+dy*3);l.setAttribute('x2',fh.x+dx*len*F.sc);l.setAttribute('y2',fh.y+dy*len*F.sc)}if(t>=1)g.remove()})}
function crackTo(sx,ex,col,w){let d=`M ${sx} ${GROUND+4}`;const n=10;for(let i=1;i<=n;i++)d+=` L ${L_(sx,ex,i/n)} ${GROUND+4+(i%2?R_(-18,-4):R_(4,16))}`;
 const o=el('path',{d,fill:'none',stroke:'#120a05','stroke-width':w+8,'stroke-linecap':'round','stroke-linejoin':'round'}),i2=el('path',{d,fill:'none',stroke:col,'stroke-width':w,'stroke-linecap':'round','stroke-linejoin':'round',filter:`drop-shadow(0 0 8px ${col})`});
 const len=o.getTotalLength();for(const p of [o,i2]){p.setAttribute('stroke-dasharray',len);p.setAttribute('stroke-dashoffset',len)}
 return {draw:async(ms)=>{await run(ms,t=>{for(const p of [o,i2])p.setAttribute('stroke-dashoffset',len*(1-E.in(t)))})},fade:(ms)=>run(ms,t=>{for(const p of [o,i2])p.setAttribute('opacity',1-t);if(t>=1){o.remove();i2.remove()}})}}
function groundRings(x,c1,c2,R=250){for(const [d,c] of [[0,c1],[90,c2]])after(()=>{const e=el('ellipse',{cx:x,cy:GROUND,rx:10,ry:3,fill:'none',stroke:c,'stroke-width':7});run(480,t=>{e.setAttribute('rx',10+R*E.out(t));e.setAttribute('ry',3+32*E.out(t));e.setAttribute('opacity',1-t);if(t>=1)e.remove()})},d)}
Object.assign(ABIL,{
/* ---- адмирал красный: лава ---- */
 lavaballs:MV('Лавовые шары','#ff7a1a',PS('windup',240),async(F,T)=>{await F.to('cast',90,E.out);const B=T.W('sh');let last;
  for(let i=0;i<5;i++){last=flyer(F,F.W('fh'),{x:B.x-F.dir*10,y:B.y+R_(-50,50)},{dur:340,arc:80,ease:E.lin,shape:SH.lava,r:22,trail:1,col:'#ff7a1a',trailR:6});last.then(()=>boom(T,'#ff7a1a',.8));await sleep(110)}await last;boom(T,'#ff7a1a',1.3)}),
 lavawave:MV('Лавовая волна','#ff5a1f',PS('charge',260),async(F,T)=>{await F.to('cast',110,E.out,{fu:70,fb:60});const sx=F.W('pel').x+F.dir*90,ex=T.W('pel').x,n=12;
  for(let i=0;i<n;i++){const x=sx+(ex-sx)*i/(n-1);const g=el('g',{});el('path',{d:'M-20 0 Q-26 -34 -4 -52 Q2 -30 10 -40 Q24 -20 20 0Z',fill:'url(#lavaG)',stroke:'#ffb43a','stroke-width':2,filter:'drop-shadow(0 0 8px #ff5a1a)'},g);
   run(380,t=>{const k=t<.3?E.out(t/.3):1-(t-.3)/.7;g.setAttribute('transform',`translate(${x},${GROUND}) scale(${1+i*.05},${Math.max(.01,(1.1+i*.04)*k)})`);if(t>=1)g.remove()});await sleep(34)}
  boom(T,'#ff5a1f',1.6,'pel');burst(T.W('pel').x,GROUND-20,16,'#ff8a2a',1.4)}),
 lavaspear:MV('Лавовое копьё','#ff7a1a',PS('cast',220),async(F,T)=>{const B=T.W('sh');await flyer(F,F.W('fh'),{x:B.x-F.dir*10,y:B.y},{dur:210,ease:E.in,aim:1,shape:SH.spike,s0:1,s1:1.5,trail:1,col:'#ff7a1a',trailR:6});boom(T,'#ff7a1a',1.5);burst(B.x,B.y,18,'#a01808',1.4)}),
 lavameteor:MV('Лавовый метеорит','#ff5a1f',PS('cast',280,{fu:172,fb:0,bu:60,bb:20}),async(F,T)=>{const tg=T.W('sh');const ex=tg.x,ey=tg.y,sx=ex-F.dir*320,sy=-120;
  const g=el('g',{});el('path',{d:'M-30 0 L-300 -40 L-300 40Z',fill:'url(#flameT)',opacity:.9},g);SH.lava(g,{r:70});const ang=Math.atan2(ey-sy,ex-sx)*180/Math.PI;
  await run(430,t=>{const k=E.in(t),x=L_(sx,ex,k),y=L_(sy,ey,k);g.setAttribute('transform',`translate(${x},${y}) rotate(${ang})`);if(Math.random()<.9)tdot(x,y,'#ff7a1a',7)});g.remove();flash(.85);shake();
  const pool=el('ellipse',{cx:ex,cy:GROUND,rx:10,ry:3,fill:'url(#lavaG)',opacity:.9,filter:'drop-shadow(0 0 12px #ff5a1a)'},fxB);run(900,t=>{pool.setAttribute('rx',10+150*E.out(t));pool.setAttribute('ry',3+18*E.out(t));pool.setAttribute('opacity',.9*(1-Math.max(0,t-.5)*2));if(t>=1)pool.remove()});
  boom(T,'#ff5a1f',2.6,'pel');burst(ex,ey,40,'#ff8a2a',2);for(let i=0;i<10;i++)flyer(F,{x:ex,y:ey},{x:ex+R_(-170,170),y:ey+R_(-130,50)},{dur:420,ease:E.out,spin:500,shape:SH.lava,r:R_(7,13)})}),
 lavafist:MV('Лавовый кулак','#ff5a1f',PS('windup',260,{bu:60,bb:60}),async(F,T)=>{await F.to('cast',90,E.out);const S=stretchArm(F,T,{col:'#c0390f',w:30,s:2.2,dur:230,tip:g=>SH.lfist(g,{r:44})});await S.run();boom(T,'#ff5a1f',2.6,'pel');shake();burst(T.W('pel').x,T.W('pel').y,28,'#ff8a2a',1.8);await S.back()}),
 lavaerupt:MV('Лавовое извержение','#ff5a1f',PS('cast',240,{fu:60,fb:40,bu:60,bb:40}),async(F,T)=>{const gx=T.W('pel').x;const mk=el('ellipse',{cx:gx,cy:GROUND,rx:5,ry:2,fill:'rgba(255,90,31,.35)',stroke:'#ff5a1f','stroke-width':5});await run(340,t=>{mk.setAttribute('rx',5+80*E.out(t));mk.setAttribute('ry',2+18*E.out(t))});
  const top=50,w=110;const col=el('rect',{x:gx-w/2,y:GROUND,width:w,height:0,rx:30,fill:'url(#lavaG)',filter:'drop-shadow(0 0 16px #ff5a1a)'});flash(.45);shake();
  await run(200,t=>{const h=(GROUND-top)*E.out(t);col.setAttribute('y',GROUND-h);col.setAttribute('height',h)});burst(gx,GROUND-10,34,'#ff8a2a',2);ring(gx,GROUND-10,'#ffb43a',170);
  await run(500,t=>{if(Math.random()<.9){const c=el('circle',{cx:gx+R_(-w/2,w/2),cy:GROUND-R_(0,GROUND-top),r:R_(3,7),fill:Math.random()<.5?'#ffcf5a':'#a01808'});run(320,u=>{c.setAttribute('cy',+c.getAttribute('cy')-2);c.setAttribute('opacity',1-u);if(u>=1)c.remove()})}});
  await run(260,t=>{col.setAttribute('opacity',1-t);mk.setAttribute('opacity',1-t);if(t>=1){col.remove();mk.remove()}})}),
/* ---- адмирал жёлтый: свет и лазеры ---- */
 lasershots:MV('Лазерные выстрелы','#ffe14a',PS('cast',200,{fu:90,fb:10,bu:90,bb:10}),async(F,T)=>{const B=T.W('sh');let last;for(let i=0;i<8;i++){const H=F.W(i%2?'bh':'fh');last=zap(H,{x:B.x,y:B.y+R_(-60,60)},'#ffe14a',6,170);burst(B.x,B.y+R_(-50,50),3,'#fff6b0',.6);if(i%3===2)flash(.15);await sleep(60)}await last;boom(T,'#ffe14a',1.4)}),
 flashstep:MV('Вспышка-рывок','#ffe14a',async(F,T)=>{await F.to('windup',160,E.out);const p=F.W('pel');ring(p.x,p.y,'#ffe14a',90);await run(100,t=>{F.g.style.opacity=1-t});F.x=T.x-F.dir*(110*T.sc+30*F.sc)},
  async(F,T)=>{const p=F.W('pel');zap({x:F.home,y:p.y},p,'#ffe14a',16,200);ring(p.x,p.y,'#ffe14a',90);await run(90,t=>{F.g.style.opacity=t});F.to('punch',70,E.in);const B=T.W('sh');cutAt(B.x,B.y,-.6,100,'#fff6b0',8);boom(T,'#ffe14a',1.6);await sleep(120);
   await run(100,t=>{F.g.style.opacity=1-t});F.x=F.home;ring(F.W('pel').x,F.W('pel').y,'#ffe14a',70);await run(100,t=>{F.g.style.opacity=t})}),
 lightmirrors:MV('Отражённый луч','#ffe14a',PS('cast',220),async(F,T)=>{const H=F.W('fh'),B=T.W('sh');const mx=(H.x+B.x)/2;const pts=[H,{x:mx+F.dir*60,y:30},{x:mx-F.dir*60,y:GROUND-10},B];
  for(let i=0;i<3;i++){await zap(pts[i],pts[i+1],'#ffe14a',9,150);burst(pts[i+1].x,pts[i+1].y,5,'#fff6b0',.7)}boom(T,'#ffe14a',1.6)}),
 lightkick:MV('Пинок лучом света','#ffe14a',async(F,T)=>{await F.to('kickW',240,E.out);const f=F.W('ff');const c=el('circle',{cx:f.x,cy:f.y,r:4,fill:'#fff6b0',filter:'drop-shadow(0 0 14px #ffe14a)'});await run(280,t=>{const p=F.W('ff');c.setAttribute('cx',p.x);c.setAttribute('cy',p.y);c.setAttribute('r',4+22*E.out(t))});c.remove()},
  async(F,T)=>{const f=F.W('ff'),B=T.W('pel');const pr=F.to('kick',100,E.in,{dx:DX(F)});zap(f,B,'#ffe14a',34,300);flash(.8);await pr;boom(T,'#ffe14a',2.6,'pel');shake();burst(B.x,B.y,26,'#fff6b0',1.8)}),
 lasergrid:MV('Лазерная сетка','#ffe14a',PS('cast',260,{fu:150,fb:0,bu:150,bb:0}),async(F,T)=>{const B=T.W('pel');let last;
  for(let i=0;i<14;i++){const a=R_(0,6.28),R=R_(170,260);last=zap({x:B.x+Math.cos(a)*R,y:Math.max(10,B.y+Math.sin(a)*R)},{x:B.x-Math.cos(a)*R*.5,y:B.y-Math.sin(a)*R*.5},'#ffe14a',5,220);burst(B.x+R_(-30,30),B.y+R_(-50,50),3,'#fff6b0',.6);if(i%4===3){flash(.2);shake()}await sleep(50)}await last;boom(T,'#ffe14a',2.4,'pel');shake()}),
 sunbeam:MV('Солнечный луч','#ffe14a',PS('charge',280,{fu:80,fb:90,bu:80,bb:90}),async(F,T)=>{await F.to('cast',100,E.out,{fu:95,fb:5,bu:95,bb:5});const A0=F.W('fh'),B=T.W('sh');
  const o=el('line',{x1:A0.x,y1:A0.y,x2:A0.x,y2:A0.y,stroke:'#ffe14a','stroke-width':70,'stroke-linecap':'round',opacity:.8,filter:'drop-shadow(0 0 20px #ffe14a)'}),i2=el('line',{x1:A0.x,y1:A0.y,x2:A0.x,y2:A0.y,stroke:'#fff','stroke-width':26,'stroke-linecap':'round'});
  await run(140,t=>{const k=E.out(t);for(const l of [o,i2]){l.setAttribute('x2',L_(A0.x,B.x,k));l.setAttribute('y2',L_(A0.y,B.y,k))}});boom(T,'#ffe14a',2.6,'pel');shake();
  await run(560,t=>{const k=1+Math.sin(t*60)*.15;o.setAttribute('stroke-width',70*k);if(Math.random()<.5)burst(B.x,B.y+R_(-50,50),2,'#fff6b0',.8)});
  await run(240,t=>{o.setAttribute('opacity',.8*(1-t));i2.setAttribute('opacity',1-t);if(t>=1){o.remove();i2.remove()}})}),
/* ---- адмирал сиреневый: гравитация ---- */
 gravball:MV('Гравитационный шар','#a98bff',PS('cast',220),async(F,T)=>{const B=T.W('sh');await flyer(F,F.W('fh'),{x:B.x-F.dir*10,y:B.y},{dur:300,ease:E.in,shape:SH.gball,r:24,trail:1,col:'#a98bff',trailR:6});boom(T,'#a98bff',1.5);ring(B.x,B.y,'#c9b0ff',100)}),
 floatrocks:MV('Летающие камни','#a98bff',PS('cast',240,{fu:140,fb:0,bu:140,bb:0}),async(F,T)=>{const B=T.W('sh');const rs=[];
  for(let i=0;i<6;i++){const x=F.x-F.dir*R_(10,140);const g=el('g',{});SH.rock(g,{r:R_(12,20)});rs.push({g,x,y:GROUND,ty:R_(120,300)})}
  await run(360,t=>{for(const r of rs)r.g.setAttribute('transform',`translate(${r.x},${L_(r.y,r.ty,E.out(t))}) rotate(${t*200})`)});await sleep(120);
  await run(240,t=>{const k=E.in(t);rs.forEach((r,i)=>r.g.setAttribute('transform',`translate(${L_(r.x,B.x+R_(-8,8),k)},${L_(r.ty,B.y+(i-3)*14,k)}) rotate(${t*500})`));if(t>=1)rs.forEach(r=>r.g.remove())});boom(T,'#a98bff',1.6)}),
 gravpull:MV('Притяжение','#a98bff',PS('cast',240,{fu:100,fb:10,bu:100,bb:10}),async(F,T)=>{const B=T.W('pel');
  for(let i=0;i<10;i++){const a=i*.63;const l=el('line',{stroke:'#c9b0ff','stroke-width':3,'stroke-linecap':'round',opacity:.9});run(380,t=>{const k=E.in(t),r1=200*(1-k),r2=Math.max(0,200*(1-k)-50);l.setAttribute('x1',B.x+Math.cos(a)*r1);l.setAttribute('y1',B.y+Math.sin(a)*r1*.7);l.setAttribute('x2',B.x+Math.cos(a)*r2);l.setAttribute('y2',B.y+Math.sin(a)*r2*.7);if(t>=1)l.remove()});await sleep(24)}
  await sleep(240);const c=el('circle',{cx:B.x,cy:B.y,r:130,fill:'none',stroke:'#a98bff','stroke-width':6});await run(260,t=>{c.setAttribute('r',130*(1-E.in(t))+8);c.setAttribute('opacity',1-t*.5)});c.remove();boom(T,'#a98bff',1.6,'pel')}),
 meteorcall:MV('Метеорит из космоса','#a98bff',PS('cast',280,{fu:172,fb:0,bu:172,bb:0}),async(F,T)=>{const B=T.W('pel');const dk=el('rect',{x:0,y:0,width:960,height:540,fill:'#10061c',opacity:0},fxB);
  const mk=el('ellipse',{cx:B.x,cy:GROUND,rx:5,ry:2,fill:'rgba(169,139,255,.3)',stroke:'#a98bff','stroke-width':5});
  await run(380,t=>{dk.setAttribute('opacity',.6*t);mk.setAttribute('rx',5+90*E.out(t));mk.setAttribute('ry',2+20*E.out(t))});
  const g=el('g',{});el('path',{d:'M-20 0 L-20 -420 L20 -420 Z',fill:'url(#flameT)',opacity:.0},g);const tail=el('rect',{x:-26,y:-460,width:52,height:440,fill:'#a98bff',opacity:.5,filter:'blur(10px)'},g);el('polygon',{points:'-70,-20 -30,-70 40,-60 76,-10 40,56 -40,60',fill:'#3a3550',stroke:'#a98bff','stroke-width':5,filter:'drop-shadow(0 0 16px #a98bff)'},g);
  await run(420,t=>{const k=E.in(t);g.setAttribute('transform',`translate(${B.x},${L_(-140,GROUND-50,k)})`);if(Math.random()<.8)tdot(B.x+R_(-30,30),L_(-140,GROUND-50,k)-60,'#c9b0ff',7)});g.remove();flash(.9);shake();groundRings(B.x,'#a98bff','#fff',300);
  boom(T,'#a98bff',2.8,'pel');burst(B.x,GROUND-20,40,'#c9b0ff',2);for(let i=0;i<10;i++)flyer(F,{x:B.x,y:GROUND-20},{x:B.x+R_(-200,200),y:GROUND-R_(60,220)},{dur:480,ease:E.out,spin:500,shape:SH.rock,r:R_(8,14)});
  await run(360,t=>{dk.setAttribute('opacity',.6*(1-t));mk.setAttribute('opacity',1-t);if(t>=1){dk.remove();mk.remove()}})}),
 gravpress:MV('Гравитационный пресс','#a98bff',PS('cast',260,{fu:172,fb:0,bu:60,bb:20}),async(F,T)=>{const B=T.W('pel');const g=el('g',{});el('ellipse',{rx:130,ry:30,fill:'rgba(30,10,60,.7)',stroke:'#a98bff','stroke-width':5,filter:'drop-shadow(0 0 14px #a98bff)'},g);
  for(let i=-3;i<=3;i++)el('path',{d:`M${i*34} -10 L${i*34} 30 M${i*34-9} 20 L${i*34} 32 L${i*34+9} 20`,stroke:'#c9b0ff','stroke-width':4,fill:'none',opacity:.9},g);
  await run(420,t=>{g.setAttribute('transform',`translate(${B.x},${L_(40,GROUND-20,E.in(t))})`)});groundRings(B.x,'#a98bff','#fff',230);boom(T,'#a98bff',2.4,'pel');shake();
  const cr=crackTo(B.x-150,B.x+150,'#c9b0ff',5);await cr.draw(180);await sleep(160);await run(260,t=>{g.setAttribute('opacity',1-t);if(t>=1)g.remove()});cr.fade(260)}),
 blackhole:MV('Чёрная дыра','#a98bff',PS('cast',260,{fu:100,fb:10,bu:100,bb:10}),async(F,T)=>{const B=T.W('pel');const cx=B.x,cy=GROUND-130;const g=el('g',{});const core=el('circle',{r:4,fill:'#05010a',stroke:'#a98bff','stroke-width':4,filter:'drop-shadow(0 0 16px #a98bff)'},g);const rings=[0,1,2].map(i=>el('ellipse',{rx:30,ry:10,fill:'none',stroke:i%2?'#c9b0ff':'#6a4ad8','stroke-width':3,opacity:.9},g));
  const dbr=[];await run(520,t=>{g.setAttribute('transform',`translate(${cx},${cy})`);core.setAttribute('r',4+36*E.out(t));rings.forEach((e,i)=>{e.setAttribute('rx',(40+i*22)*E.out(t));e.setAttribute('ry',(12+i*7)*E.out(t));e.setAttribute('transform',`rotate(${t*360*(i+1)})`)});
   if(Math.random()<.7){const a=R_(0,6.28),r0=R_(120,220);const c=el('circle',{r:3,fill:'#c9b0ff'});run(360,u=>{const rr=r0*(1-E.in(u));c.setAttribute('cx',cx+Math.cos(a+u*3)*rr);c.setAttribute('cy',cy+Math.sin(a+u*3)*rr*.7);if(u>=1)c.remove()})}});
  await run(240,t=>{g.setAttribute('transform',`translate(${L_(cx,B.x,E.in(t))},${L_(cy,B.y,E.in(t))}) scale(${1+.6*t})`)});g.remove();flash(.9);shake();boom(T,'#a98bff',2.8,'pel');ring(B.x,B.y,'#fff',200)}),
/* ---- адмирал голубой: лёд ---- */
 icicles:MV('Сосульки','#8fdcff',PS('cast',220,{fu:150,fb:0}),async(F,T)=>{const B=T.W('sh');let last;for(let i=0;i<6;i++){last=flyer(F,{x:F.W('pel').x-F.dir*R_(0,80),y:R_(60,360)},{x:B.x-F.dir*8,y:B.y+R_(-50,50)},{dur:230,ease:E.in,aim:1,shape:SH.icicle,trail:1,col:'#cfeeff'});last.then(()=>burst(B.x,B.y+R_(-40,40),5,'#e6f7ff',.8));await sleep(80)}await last;boom(T,'#8fdcff',1.4)}),
 frostwave:MV('Морозная волна','#8fdcff',PS('charge',260),async(F,T)=>{await F.to('cast',110,E.out,{fu:70,fb:60});const sx=F.W('pel').x+F.dir*90,ex=T.W('pel').x,n=12;
  for(let i=0;i<n;i++){const x=sx+(ex-sx)*i/(n-1);const g=el('g',{});el('polygon',{points:'-16,0 -4,-52 4,-30 12,-62 18,0',fill:'#e6f7ff',stroke:'#8fdcff','stroke-width':2,filter:'drop-shadow(0 0 8px #8fdcff)'},g);
   run(420,t=>{const k=t<.25?E.out(t/.25):1-(t-.25)/.75;g.setAttribute('transform',`translate(${x},${GROUND}) scale(${1+i*.05},${Math.max(.01,(1.1+i*.05)*k)})`);if(t>=1)g.remove()});await sleep(34)}
  boom(T,'#8fdcff',1.6,'pel');burst(T.W('pel').x,GROUND-20,16,'#e6f7ff',1.4)}),
 iceslash:MV('Ледяной серп','#8fdcff',PS('windup',240,{bu:60,bb:60}),async(F,T)=>{await F.to('punch',100,E.in,{dx:60});const h=F.W('fh'),B=T.W('sh');await flyer(F,{x:h.x,y:h.y},{x:B.x-F.dir*10,y:B.y},{dur:210,ease:E.in,aim:1,shape:SH.crescent,col:'#cfeeff',s0:1,s1:1.5,trail:1});boom(T,'#8fdcff',1.6);burst(B.x,B.y,14,'#e6f7ff',1.4)}),
 iceball:MV('Ледяной шар','#8fdcff',PS('cast',260,{fu:100,fb:10,bu:100,bb:10}),async(F,T)=>{const B=T.W('pel');const g=el('g',{});el('circle',{r:120,fill:'rgba(170,230,255,.28)',stroke:'#e6f7ff','stroke-width':6,filter:'drop-shadow(0 0 16px #8fdcff)'},g);
  for(const d of ['M-80 -40 L0 0 L70 -60','M-60 70 L0 0 L90 50','M0 -118 L0 0','M-115 10 L0 0 L115 20'])el('path',{d,fill:'none',stroke:'#e6f7ff','stroke-width':2.5,opacity:.8},g);el('ellipse',{cx:-40,cy:-50,rx:30,ry:14,fill:'#fff',opacity:.5},g);
  flash(.3);await run(320,t=>{g.setAttribute('transform',`translate(${B.x},${B.y}) scale(${Math.max(.01,E.out(t))})`)});
  await run(420,t=>{if(Math.random()<.5){const q=el('circle',{cx:B.x+R_(-100,100),cy:B.y+R_(-100,100),r:3,fill:'#fff'});run(260,u=>{q.setAttribute('opacity',1-u);q.setAttribute('r',3+5*u);if(u>=1)q.remove()})}});
  g.remove();flash(.7);shake();boom(T,'#8fdcff',2.6,'pel');for(let i=0;i<22;i++)flyer(F,{x:B.x,y:B.y},{x:B.x+R_(-180,180),y:B.y+R_(-150,110)},{dur:480,ease:E.out,spin:R_(200,600),shape:SH.icicle,s0:.5,s1:.5,col:'#e6f7ff'})}),
 icesword:MV('Ледяной меч','#8fdcff',async(F,T)=>{await F.to('windup',280,E.out,{dx:-24,bu:60,bb:60});F._bl=bladeFollow(F,1200,'#e6f7ff',150,10)},async(F,T)=>{await F.to('punch',100,E.in,{dx:DX(F)});const B=T.W('sh');
  for(const a of [-.8,.8]){cutAt(B.x,B.y,a,160,'#e6f7ff',12);burst(B.x,B.y,10,'#e6f7ff',1.2);flash(.3);await sleep(110)}boom(T,'#8fdcff',2.2,'pel');shake()}),
 icespikes:MV('Ледяные шипы','#8fdcff',PS('cast',260,{fu:60,fb:40,bu:60,bb:40}),async(F,T)=>{const sx=F.W('pel').x+F.dir*90,ex=T.W('pel').x,n=9;
  for(let i=0;i<n;i++){const x=sx+(ex-sx)*i/(n-1);const g=el('g',{});const h=70+i*14;el('polygon',{points:`-18,0 0,${-h} 18,0`,fill:'#e6f7ff',stroke:'#8fdcff','stroke-width':3,filter:'drop-shadow(0 0 10px #8fdcff)'},g);
   run(520,t=>{const k=t<.2?E.out(t/.2):1;g.setAttribute('transform',`translate(${x},${GROUND}) scale(1,${Math.max(.01,k)})`);g.setAttribute('opacity',t<.7?1:1-(t-.7)/.3);if(t>=1)g.remove()});burst(x,GROUND,3,'#e6f7ff',.6);await sleep(46)}
  boom(T,'#8fdcff',2.4,'pel');shake()}),
/* ---- хранитель: меч и красные молнии ---- */
 swordbolt:MV('Клинок-разряд','#ff4d4d',PS('windup',240,{bu:60,bb:60}),async(F,T)=>{await F.to('punch',100,E.in,{dx:60});const h=F.W('fh'),B=T.W('sh');await flyer(F,{x:h.x,y:h.y},{x:B.x-F.dir*10,y:B.y},{dur:200,ease:E.in,aim:1,shape:SH.crescent,col:'#ff6a6a',s0:1,s1:1.5,trail:1});bolt(B.x,B.y-90,B.x,B.y+20,'#ff4d4d',6);boom(T,'#ff4d4d',1.5)}),
 sparkdash:MV('Рывок с молнией','#ff4d4d',PS('windup',240,{dx:-20,bu:60,bb:60}),async(F,T)=>{const h0=F.W('fh');const pr=F.to('punch',100,E.in,{dx:DX(F)});for(let i=0;i<3;i++){const h=F.W('fh');bolt(h0.x,h0.y+R_(-30,30),h.x,h.y+R_(-30,30),'#ff4d4d',5);await sleep(30)}await pr;const B=T.W('sh');cutAt(B.x,B.y,-.7,120,'#ffd0d0',9);boom(T,'#ff4d4d',1.5)}),
 redcut:MV('Быстрый разрез','#ff4d4d',PS('windup',240,{dx:-20,bu:60,bb:60}),async(F,T)=>{await F.to('punch',100,E.in,{dx:DX(F)});const B=T.W('sh');cutAt(B.x,B.y,-.7,130,'#ff6a6a');await sleep(70);cutAt(B.x,B.y,.5,130,'#ff6a6a');bolt(B.x+R_(-30,30),B.y-100,B.x,B.y+20,'#ff4d4d',5);boom(T,'#ff4d4d',1.3)}),
 stormslash:MV('Грозовой разрез','#ff4d4d',PS('windup',300,{dx:-26,bu:60,bb:60}),async(F,T)=>{await F.to('punch',100,E.in,{dx:DX(F)});const B=T.W('sh');cutAt(B.x,B.y,-.75,230,'#ffd0d0',16);flash(.5);
  for(let i=0;i<5;i++){bolt(B.x+R_(-70,70),0,B.x+R_(-30,30),B.y+30,'#ff4d4d',8);burst(B.x,B.y,6,'#ff6a6a',1);if(i%2)shake();await sleep(90)}boom(T,'#ff4d4d',2.6,'pel');shake()}),
 redstorm:MV('Красная буря','#ff4d4d',PS('cast',260,{fu:172,fb:0,bu:172,bb:0}),async(F,T)=>{const B=T.W('head');const cl=cloud2(B.x,95,1.6,'#3a1216','#1a0608','#8a2a30');await run(360,t=>{cl.set(E.out(t))});
  for(let i=0;i<6;i++){bolt(B.x+R_(-110,110),130,B.x+R_(-60,60),GROUND-30+R_(-60,0),'#ff4d4d',7);flash(.4);if(i%2)shake();burst(B.x+R_(-60,60),B.y+60,8,'#ff6a6a',1);await sleep(130)}boom(T,'#ff4d4d',2.4,'pel');await run(300,t=>{cl.set(1,1-t)});cl.g.remove()}),
 thunderblade:MV('Клинок-молния','#ff4d4d',PS('cast',280,{fu:172,fb:0,bu:60,bb:20}),async(F,T)=>{const h=F.W('fh');bolt(h.x,0,h.x,h.y-80*F.sc,'#ff4d4d',12);flash(.7);shake();await sleep(160);const g=el('g',{});el('circle',{r:50,fill:'#ff4d4d',opacity:.5,filter:'blur(10px)'},g);run(300,t=>{g.setAttribute('transform',`translate(${h.x},${h.y-60})`);g.setAttribute('opacity',1-t);if(t>=1)g.remove()});
  await F.to('punch',110,E.in,{dx:DX(F)});const p=F.W('fh'),B=T.W('sh');await flyer(F,{x:p.x,y:p.y},{x:B.x-F.dir*10,y:B.y},{dur:200,ease:E.in,aim:1,shape:SH.crescent,col:'#ff6a6a',s0:1.4,s1:2.4,trail:1});
  for(let i=0;i<3;i++){bolt(B.x+R_(-50,50),0,B.x,B.y+20,'#ff4d4d',9);await sleep(70)}boom(T,'#ff4d4d',2.6,'pel');shake()}),
/* ---- хранитель: землетрясения ---- */
 tremorpunch:MV('Дрожащий удар','#e8e0d0',PS('windup',240,{dx:-20}),async(F,T)=>{await F.to('punch',100,E.in,{dx:DX(F)});const B=T.W('sh');for(let i=0;i<5;i++){const e=el('circle',{cx:B.x+R_(-8,8),cy:B.y+R_(-8,8),r:6,fill:'none',stroke:'#e8e0d0','stroke-width':4});run(300,t=>{e.setAttribute('r',6+70*E.out(t));e.setAttribute('opacity',1-t);if(t>=1)e.remove()});await sleep(50)}boom(T,'#e8e0d0',1.5);shake()}),
 shockstomp:MV('Топот','#e8e0d0',async(F,T)=>{await F.to('kickW',240,E.out)},async(F,T)=>{await F.to('stagger',80,E.in,{t:20});const p=F.W('ff'),B=T.W('pel');groundRings(p.x,'#e8e0d0','#fff',200);shake();const cr=crackTo(p.x,B.x,'#e8e0d0',4);await cr.draw(200);boom(T,'#e8e0d0',1.4,'pel');cr.fade(240);await sleep(100)}),
 airshock:MV('Воздушная волна','#e8e0d0',PS('windup',240,{dx:-16}),async(F,T)=>{await F.to('punch',100,E.in,{dx:60});const h=F.W('fh'),B=T.W('sh');let last;for(let i=0;i<3;i++){last=flyer(F,{x:h.x,y:h.y},{x:B.x-F.dir*10,y:B.y},{dur:220,ease:E.in,aim:0,shape:SH.forcewave,col:'#e8e0d0',mirror:1,s0:.7,s1:1.3});await sleep(90)}await last;boom(T,'#e8e0d0',1.6)}),
 quakebig:MV('Землетрясение','#e8e0d0',PS('cast',300,{fu:172,fb:0,bu:172,bb:0}),async(F,T)=>{await F.to('punch',120,E.in,{fu:70,fb:25,bu:60,bb:25,t:40,dx:20});const sx=F.W('fh').x,B=T.W('pel'),ex=B.x+(B.x-sx)*.6;
  shake();const cs=[0,1,2].map(i=>crackTo(sx,ex+i*20,'#e8e0d0',5));const rocks=[];for(let k=0;k<18;k++){const x=L_(sx,ex,Math.random());const g=el('g',{});SH.rock(g,{r:R_(7,14)});rocks.push({g,x,vy:-(150+Math.random()*260),vx:(Math.random()-.5)*60})}
  await Promise.all(cs.map((c,i)=>c.draw(280+i*60)));shake();groundRings(B.x,'#e8e0d0','#fff',320);boom(T,'#e8e0d0',2.8,'pel');
  await run(800,t=>{if(t>.2&&t<.25)shake();if(t>.5&&t<.55)shake();for(const r of rocks){r.g.setAttribute('transform',`translate(${r.x+r.vx*t},${GROUND+r.vy*t+520*t*t}) rotate(${t*400})`);r.g.setAttribute('opacity',t>.85?(1-t)*6:1)}});rocks.forEach(r=>r.g.remove());cs.forEach(c=>c.fade(200))}),
 airquake:MV('Раскол воздуха','#e8e0d0',PS('windup',280,{dx:-26}),async(F,T)=>{await F.to('punch',110,E.in,{dx:60});const B=T.W('sh'),cx=B.x-F.dir*30,cy=B.y;const paths=[];
  for(let i=0;i<9;i++){const a=i*.7+R_(-.2,.2);let d=`M ${cx} ${cy}`,x=cx,y=cy;for(let j=0;j<4;j++){x+=Math.cos(a+R_(-.3,.3))*R_(30,60);y+=Math.sin(a+R_(-.3,.3))*R_(30,60);d+=` L ${x} ${y}`}paths.push(el('path',{d,fill:'none',stroke:'#fff','stroke-width':4,'stroke-linecap':'round',filter:'drop-shadow(0 0 8px #e8e0d0)',opacity:0}))}
  flash(.3);await run(200,t=>{paths.forEach(p=>p.setAttribute('opacity',t))});await sleep(120);flash(.8);shake();paths.forEach(p=>p.remove());ring(cx,cy,'#fff',220);
  for(let i=0;i<16;i++)flyer(F,{x:cx,y:cy},{x:cx+R_(-200,200),y:cy+R_(-160,140)},{dur:420,ease:E.out,spin:R_(200,700),shape:(g)=>el('polygon',{points:'0,-14 8,10 -8,10',fill:'#f4f1ea',opacity:.9},g)});boom(T,'#e8e0d0',2.6,'pel')}),
 tremorwave:MV('Волна вибрации','#e8e0d0',PS('charge',260),async(F,T)=>{await F.to('punch',110,E.in,{dx:40});const sx=F.W('fh').x,B=T.W('pel');let last;
  for(let i=0;i<5;i++){const e=el('ellipse',{cx:sx,cy:GROUND-60,rx:10,ry:30,fill:'none',stroke:i%2?'#fff':'#e8e0d0','stroke-width':6,filter:'drop-shadow(0 0 8px #e8e0d0)'});last=run(380,t=>{const k=E.in(t);e.setAttribute('cx',L_(sx,B.x,k));e.setAttribute('ry',30+90*k);e.setAttribute('rx',10+14*k);e.setAttribute('opacity',1-.5*k);if(t>=1)e.remove()});burst(sx+F.dir*50,GROUND-4,3,'#d9c39a',.6);await sleep(100)}
  await last;groundRings(B.x,'#e8e0d0','#fff',280);boom(T,'#e8e0d0',2.6,'pel');shake()}),
/* ---- хранитель: булава и огонь ---- */
 clubswing:MV('Взмах булавы','#d9b48a',PS('windup',260,{dx:-20}),async(F,T)=>{await F.to('punch',100,E.in,{dx:60});const h=F.W('fh'),B=T.W('sh');await flyer(F,{x:h.x,y:h.y},{x:B.x-F.dir*10,y:B.y},{dur:210,ease:E.in,aim:1,shape:SH.crescent,col:'#e8cfa8',s0:1.2,s1:2,trail:1});boom(T,'#d9b48a',1.8);shake()}),
 fireball:MV('Огненный шар','#ff6a1a',PS('charge',240),async(F,T)=>{const B=T.W('sh');const hd=F.W('head');await flyer(F,hd,{x:B.x-F.dir*10,y:B.y},{dur:300,ease:E.in,shape:(g)=>{el('circle',{r:26,fill:'url(#flameF)',stroke:'#7a1a08','stroke-width':4,filter:'drop-shadow(0 0 14px #ff5a1a)'},g)},s0:.5,s1:1.2,trail:1,col:'#ff7a1a',trailR:7});boom(T,'#ff6a1a',1.8);burst(B.x,B.y,22,'#ff8a2a',1.6)}),
 bullcharge:MV('Таран','#d9b48a',PS('windup',280,{dx:-30}),async(F,T)=>{const x0=F.W('pel').x;const pr=F.to('punch',150,E.in,{dx:DX(F),t:40});for(let i=0;i<4;i++){burst(F.W('ff').x,GROUND-4,3,'#d9c39a',.8);await sleep(35)}await pr;groundRings(T.W('pel').x,'#d9b48a','#fff',180);boom(T,'#d9b48a',2,'pel');shake()}),
 clubsmash:MV('Удар булавой','#d9b48a',async(F,T)=>{await F.to('cast',300,E.out,{fu:172,fb:0,bu:60,bb:20});await sleep(100)},async(F,T)=>{const B=T.W('pel');const g=el('g',{});SH.mace(g,{});
  await run(260,t=>{const k=E.in(t);g.setAttribute('transform',`translate(${B.x-F.dir*10},${L_(-200,B.y-10,k)}) rotate(${90+F.dir*20*(1-k)}) scale(${F.sc*1.4})`)});g.remove();
  groundRings(B.x,'#d9b48a','#fff',260);boom(T,'#d9b48a',2.8,'pel');shake();flash(.6);const cr=crackTo(B.x-120,B.x+120,'#e8cfa8',5);await cr.draw(160);cr.fade(300)}),
 firebreath:MV('Огненное дыхание','#ff6a1a',PS('charge',280),async(F,T)=>{const hd=F.W('head'),B=T.W('sh');const g=el('g',{});const cone=el('polygon',{fill:'url(#flameF)',opacity:.9,filter:'drop-shadow(0 0 14px #ff5a1a)'},g);const core=el('polygon',{fill:'#fff2a8',opacity:.8},g);
  await run(160,t=>{});await run(640,t=>{const k=E.out(Math.min(1,t*3));const L=Math.hypot(B.x-hd.x,B.y-hd.y)*k,a=Math.atan2(B.y-hd.y,B.x-hd.x),w=26+Math.sin(t*50)*5;const ex=hd.x+Math.cos(a)*L,ey=hd.y+Math.sin(a)*L,nx=-Math.sin(a),ny=Math.cos(a);
   cone.setAttribute('points',`${hd.x},${hd.y} ${ex+nx*w*2.2},${ey+ny*w*2.2} ${ex-nx*w*2.2},${ey-ny*w*2.2}`);core.setAttribute('points',`${hd.x},${hd.y} ${ex+nx*w},${ey+ny*w} ${ex-nx*w},${ey-ny*w}`);
   if(Math.random()<.9)tdot(L_(hd.x,B.x,Math.random()),L_(hd.y,B.y,Math.random())+R_(-20,20),Math.random()<.5?'#ffcf5a':'#a01808',6);if(t>.25&&t<.3){boom(T,'#ff6a1a',1.6)}});
  g.remove();boom(T,'#ff6a1a',2.4,'pel');shake()}),
 clubspin:MV('Вращение булавы','#d9b48a',PS('charge',280),async(F,T)=>{const B=T.W('pel');const g=el('g',{});SH.mace(g,{});const c0=F.W('pel');
  await run(700,t=>{const k=E.out(Math.min(1,t*1.3));const x=L_(c0.x,B.x,Math.max(0,t-.45)*2),y=L_(GROUND-120,B.y,Math.max(0,t-.45)*2);g.setAttribute('transform',`translate(${x},${y}) rotate(${t*1800}) scale(${F.sc*(.6+.5*k)})`);if(Math.random()<.6)tdot(x+R_(-40,40),y+R_(-40,40),'#e8cfa8',5);if(t>.6&&Math.random()<.15){boom(T,'#d9b48a',.6,'sh')}});g.remove();
  groundRings(B.x,'#d9b48a','#fff',240);boom(T,'#d9b48a',2.6,'pel');shake()}),
/* ---- хранитель: огромный меч, розовые молнии, огонь ---- */
 swordchop:MV('Рубящий удар','#ff8ec4',PS('windup',260,{dx:-20,bu:60,bb:60}),async(F,T)=>{await F.to('punch',100,E.in,{dx:DX(F)});const B=T.W('sh');cutAt(B.x,B.y,-.9,210,'#ffd0ea',16);flash(.35);ring(B.x,B.y,'#ff8ec4',130);boom(T,'#ff8ec4',1.8);shake()}),
 pinkbolt:MV('Розовая молния','#ff8ec4',PS('cast',200),async(F,T)=>{const A0=F.W('fh'),B=T.W('sh');bolt(A0.x,A0.y,B.x,B.y,'#ff8ec4',8);await sleep(80);bolt(A0.x,A0.y,B.x,B.y+20,'#ffd0ea',6);flash(.3);boom(T,'#ff8ec4',1.5)}),
 flameburst:MV('Вспышка пламени','#ff8a5a',PS('cast',240,{fu:100,fb:10,bu:100,bb:10}),async(F,T)=>{const B=T.W('pel');flash(.35);ring(B.x,B.y,'#ff8a5a',150);for(let i=0;i<7;i++){const a=i*.9;const g=el('g',{});el('path',{d:'M-14 0 Q-18 -30 0 -50 Q18 -30 14 0Z',fill:'url(#flameF)',filter:'drop-shadow(0 0 8px #ff5a1a)'},g);run(520,t=>{const k=t<.3?E.out(t/.3):1-(t-.3)/.7;g.setAttribute('transform',`translate(${B.x+Math.cos(a)*70*E.out(t)},${B.y+Math.sin(a)*50*E.out(t)+30}) rotate(${a*57-90+90}) scale(${1.1*Math.max(.01,k)})`);if(t>=1)g.remove()})}await sleep(300);boom(T,'#ff8a5a',1.8)}),
 giantblade:MV('Огромный меч','#ff8ec4',async(F,T)=>{await F.to('cast',300,E.out,{fu:172,fb:0,bu:60,bb:20});await sleep(100)},async(F,T)=>{const B=T.W('pel');const g=el('g',{});SH.bigsword(g,{col:'#ff8ec4'});const s=2.2;
  const gl=el('ellipse',{cx:B.x,cy:GROUND,rx:5,ry:2,fill:'rgba(255,142,196,.3)',stroke:'#ff8ec4','stroke-width':5});await run(260,t=>{gl.setAttribute('rx',5+80*E.out(t));gl.setAttribute('ry',2+16*E.out(t))});
  await run(300,t=>{const k=E.in(t);g.setAttribute('transform',`translate(${B.x},${L_(-260,GROUND-30,k)}) rotate(90) scale(${s})`)});flash(.9);shake();groundRings(B.x,'#ff8ec4','#fff',300);boom(T,'#ff8ec4',2.8,'pel');
  const cr=crackTo(B.x-160,B.x+160,'#ff8ec4',5);await cr.draw(140);await sleep(140);await run(260,t=>{g.setAttribute('opacity',1-t);gl.setAttribute('opacity',1-t);if(t>=1){g.remove();gl.remove()}});cr.fade(260)}),
 pinkstorm:MV('Розовая гроза','#ff8ec4',PS('cast',260,{fu:172,fb:0,bu:172,bb:0}),async(F,T)=>{const B=T.W('head');const cl=cloud2(B.x,95,1.6,'#5a2a48','#2a1022','#b86a9a');await run(360,t=>{cl.set(E.out(t))});
  for(let i=0;i<6;i++){bolt(B.x+R_(-110,110),130,B.x+R_(-60,60),GROUND-30+R_(-60,0),i%2?'#ffd0ea':'#ff8ec4',8);flash(.4);if(i%2)shake();burst(B.x+R_(-60,60),B.y+60,8,'#ff8ec4',1);await sleep(130)}boom(T,'#ff8ec4',2.4,'pel');await run(300,t=>{cl.set(1,1-t)});cl.g.remove()}),
 fireorbs:MV('Огненные шары','#ff8a5a',PS('cast',260,{fu:172,fb:0,bu:172,bb:0}),async(F,T)=>{const B=T.W('pel');let last;for(let i=0;i<6;i++){const x=B.x+R_(-100,100);last=flyer(F,{x:x-F.dir*120,y:-60},{x:x,y:B.y+R_(-30,60)},{dur:380,ease:E.in,shape:(g)=>{el('circle',{r:34,fill:'url(#flameF)',stroke:'#7a1a08','stroke-width':4,filter:'drop-shadow(0 0 16px #ff5a1a)'},g)},trail:1,col:'#ff8a5a',trailR:8});last.then(()=>{boom(T,'#ff8a5a',1);burst(x,B.y,8,'#ffcf5a',1)});await sleep(150)}await last;boom(T,'#ff8a5a',2.2,'pel');shake()}),
/* ---- хранитель: кулаки и волны силы ---- */
 jab:MV('Быстрый удар кулаком','#ffffff',PS('windup',220,{dx:-16}),async(F,T)=>{await F.to('punch',90,E.in,{dx:DX(F)});const B=T.W('sh');ring(B.x,B.y,'#fff',90);boom(T,'#ffffff',1.2)}),
 combo:MV('Серия кулаков','#ffffff',PS('windup',220,{dx:-16}),async(F,T)=>{await F.to('punch',90,E.in,{dx:DX(F)});const B=T.W('sh');for(let i=0;i<4;i++){F.to(i%2?'windup':'punch',50,E.out,{dx:DX(F)});ring(B.x+R_(-20,20),B.y+R_(-30,30),'#fff',70);burst(B.x,B.y,5,'#fff',.8);flash(.12);await sleep(85)}boom(T,'#ffffff',1.6)}),
 forcepulse:MV('Импульс силы','#ffffff',PS('windup',240,{dx:-16}),async(F,T)=>{await F.to('punch',100,E.in,{dx:60});const h=F.W('fh'),B=T.W('sh');await flyer(F,{x:h.x,y:h.y},{x:B.x-F.dir*10,y:B.y},{dur:240,ease:E.in,shape:SH.forcewave,col:'#ffffff',mirror:1,s0:.8,s1:1.6});boom(T,'#ffffff',1.7);shake()}),
 giantfist:MV('Огромный кулак','#ffffff',PS('windup',260,{bu:60,bb:60}),async(F,T)=>{await F.to('cast',90,E.out);const S=stretchArm(F,T,{col:'#f4f4f4',w:34,s:2.6,dur:240,tip:g=>SH.fist(g,{r:46,col:'#ffffff',st:'#8a9aa8'})});await S.run();boom(T,'#ffffff',2.8,'pel');shake();ring(T.W('pel').x,T.W('pel').y,'#cfe6ff',220);await S.back()}),
 wavebarrage:MV('Шквал волн','#ffffff',PS('windup',260,{dx:-20}),async(F,T)=>{const B=T.W('sh');let last;for(let i=0;i<7;i++){F.to(i%2?'windup':'punch',60,E.out,{dx:40});const h=F.W('fh');last=flyer(F,{x:h.x,y:h.y},{x:B.x-F.dir*10,y:B.y+R_(-40,40)},{dur:200,ease:E.in,shape:SH.forcewave,col:'#ffffff',mirror:1,s0:.8,s1:1.5});last.then(()=>boom(T,'#ffffff',.7));await sleep(110)}await last;boom(T,'#ffffff',2.4,'pel');shake()}),
 shockpunch:MV('Удар волной силы','#ffffff',async(F,T)=>{await F.to('windup',300,E.out,{dx:-30,bu:60,bb:60});const h=F.W('fh');for(let i=0;i<4;i++){const c=el('circle',{cx:h.x,cy:h.y,r:90,fill:'none',stroke:'#cfe6ff','stroke-width':4});run(300,t=>{c.setAttribute('r',90*(1-E.in(t))+6);c.setAttribute('opacity',.4+.6*t);if(t>=1)c.remove()});await sleep(100)}await sleep(120)},
  async(F,T)=>{await F.to('punch',100,E.in,{dx:DX(F)});const B=T.W('pel');for(const [d,R] of [[0,160],[100,240],[200,320]])after(()=>{const e=el('ellipse',{cx:B.x,cy:B.y,rx:10,ry:30,fill:'none',stroke:'#fff','stroke-width':8,filter:'drop-shadow(0 0 10px #cfe6ff)'});run(480,t=>{e.setAttribute('rx',10+R*E.out(t));e.setAttribute('ry',30+R*.7*E.out(t));e.setAttribute('opacity',1-t);if(t>=1)e.remove()})},d);
   flash(.8);shake();boom(T,'#ffffff',2.8,'pel');const cr=crackTo(B.x-160,B.x+160,'#cfe6ff',5);await cr.draw(160);cr.fade(300)})
});

/* ---------- Има ---------- */
Object.assign(SH,{
 limb:(g,o)=>{const len=o.len||300,w=o.w||64;const st='#f4f4f8';const f='drop-shadow(0 0 10px #d0314a)';
  el('path',{d:`M0 ${-w*.45} Q${len*.5} ${-w*.7} ${len} ${-w*.55} L${len} ${w*.55} Q${len*.5} ${w*.7} 0 ${w*.45}Z`,fill:'#0d1118',stroke:st,'stroke-width':4,'stroke-linejoin':'round',filter:f},g);
  for(const i of [-1.5,-.5,.5,1.5])el('polygon',{points:`${len-4},${i*w*.3-9} ${len+w*.95},${i*w*.36} ${len-4},${i*w*.3+9}`,fill:'#0d1118',stroke:st,'stroke-width':3,'stroke-linejoin':'round',filter:f},g)},
 demon:(g,o)=>{el('ellipse',{rx:26,ry:31,fill:'#0d1118',stroke:'#f4f4f8','stroke-width':3,filter:'drop-shadow(0 0 10px #d0314a)'},g);
  for(const s of [-1,1])el('polygon',{points:`${s*6},-4 ${s*20},-12 ${s*16},2`,fill:'#ff3a56'},g);
  el('path',{d:'M-14 12 Q0 26 14 12 Q0 18 -14 12Z',fill:'#ff3a56'},g);for(const s of [-1,1])el('polygon',{points:`${s*14},-26 ${s*24},-44 ${s*6},-30`,fill:'#0d1118',stroke:'#f4f4f8','stroke-width':2},g)}
});
function attachCrown(F){const g=F.inner;const c=el('g',{},g);el('polygon',{points:'-17,-12 -19,-38 -9,-26 0,-44 9,-26 19,-38 17,-12',fill:'#0d1118',stroke:'#f4f4f8','stroke-width':3,'stroke-linejoin':'round',filter:'drop-shadow(0 0 6px #d0314a)'},c);
 for(const x of [-19,0,19])el('circle',{cx:x,cy:x?-38:-44,r:3,fill:'#ff3a56'},c);F.band.setAttribute('opacity',0);const d0=F.draw.bind(F);F.draw=function(t){d0(t);const h=this.pts.head;c.setAttribute('transform',`translate(${h.x},${h.y})`)}}
Object.assign(ABIL,{
 demonclaws:MV('Когти тьмы','#d0314a',PS('windup',240,{dx:-16}),async(F,T)=>{await F.to('punch',100,E.in,{dx:DX(F)});const B=T.W('sh');for(let i=0;i<3;i++){cutAt(B.x,B.y+(i-1)*30,-.7,170,i%2?'#f4f4f8':'#ff3a56',9);burst(B.x,B.y+(i-1)*30,5,'#d0314a',1);await sleep(70)}boom(T,'#d0314a',1.8);shake()}),
 shadowbolt:MV('Сгусток тьмы','#d0314a',PS('cast',220),async(F,T)=>{const B=T.W('sh');await flyer(F,F.W('fh'),{x:B.x-F.dir*10,y:B.y},{dur:300,ease:E.in,shape:g=>{el('circle',{r:26,fill:'#0d1118',stroke:'#f4f4f8','stroke-width':3,filter:'drop-shadow(0 0 14px #d0314a)'},g);el('circle',{r:9,fill:'#ff3a56'},g)},trail:1,col:'#d0314a',trailR:7});boom(T,'#d0314a',1.8);ring(B.x,B.y,'#ff3a56',110)}),
 soulgrab:MV('Хватка из бездны','#d0314a',PS('cast',240,{fu:60,fb:40,bu:60,bb:40}),async(F,T)=>{const gx=T.W('pel').x;
  for(let i=0;i<6;i++){const x=gx+(i-2.5)*20;const g=el('g',{});el('path',{d:'M-9 0 L-9 -40 L-6 -58 L-2 -42 L2 -64 L6 -42 L10 -56 L9 0Z',fill:'#0d1118',stroke:'#f4f4f8','stroke-width':2.5,filter:'drop-shadow(0 0 6px #d0314a)'},g);
   run(620,t=>{const k=t<.3?E.out(t/.3):1;g.setAttribute('transform',`translate(${x+Math.sin(t*30+i)*3},${GROUND}) scale(1.4,${Math.max(.01,k*(1.1+(i%2)*.4))})`);g.setAttribute('opacity',t<.8?1:1-(t-.8)/.2);if(t>=1)g.remove()});burst(x,GROUND,3,'#d0314a',.6);await sleep(50)}
  await sleep(300);boom(T,'#d0314a',2,'pel');shake()}),
 giantclaws:MV('Огромные когти','#d0314a',PS('cast',300,{fu:172,fb:0,bu:172,bb:0}),async(F,T)=>{const B=T.W('pel');const dk=el('rect',{x:0,y:0,width:960,height:540,fill:'#10061c',opacity:0},fxB);
  await run(300,t=>{dk.setAttribute('opacity',.55*t)});
  const g=el('g',{});SH.limb(g,{len:330,w:80});const tipY=GROUND-14;
  await run(300,t=>{const k=E.in(t);g.setAttribute('transform',`translate(${B.x},${L_(-420,tipY-380,k)}) rotate(90)`)});flash(.9);shake();groundRings(B.x,'#d0314a','#f4f4f8',280);boom(T,'#d0314a',2.4,'pel');
  const cr=crackTo(B.x-150,B.x+150,'#ff3a56',5);await cr.draw(140);await sleep(140);await run(200,t=>{g.setAttribute('opacity',1-t);if(t>=1)g.remove()});cr.fade(240);
  const s=F.dir,g2=el('g',{});SH.limb(g2,{len:360,w:90});const end=B.x-s*(360+60),st=end-s*260,y=B.y;
  await run(420,t=>{const k=E.in(t);g2.setAttribute('transform',`translate(${L_(st,end,k)},${y}) rotate(${s>0?0:180})`)});flash(.9);shake();boom(T,'#d0314a',3,'pel');
  for(let i=0;i<3;i++)cutAt(B.x,B.y+(i-1)*34,-.2,200,'#ff3a56',9);burst(B.x,B.y,30,'#d0314a',2);
  await run(260,t=>{g2.setAttribute('opacity',1-t);dk.setAttribute('opacity',.55*(1-t));if(t>=1){g2.remove();dk.remove()}})}),
 hellportal:MV('Врата ада','#d0314a',PS('cast',280,{fu:172,fb:0,bu:172,bb:0}),async(F,T)=>{const B=T.W('pel');const cx=B.x,cy=70;const g=el('g',{});
  const rs=[0,1,2].map(i=>el('ellipse',{rx:10,ry:4,fill:i?'none':'#0d1118',stroke:i%2?'#f4f4f8':'#d0314a','stroke-width':i?4:6,filter:'drop-shadow(0 0 12px #d0314a)'},g));
  await run(420,t=>{g.setAttribute('transform',`translate(${cx},${cy})`);rs.forEach((e,i)=>{e.setAttribute('rx',(150-i*28)*E.out(t));e.setAttribute('ry',(32-i*6)*E.out(t));e.setAttribute('transform',`rotate(${t*(i%2?-1:1)*40})`)})});
  for(let i=0;i<5;i++){const x=cx+(i-2)*46+R_(-8,8);const a=el('g',{});SH.limb(a,{len:200,w:30});const ty=B.y+R_(-30,50);
   run(300,t=>{const k=E.in(t);a.setAttribute('transform',`translate(${x},${L_(cy,ty-250,k)}) rotate(90)`)}).then(()=>{boom(T,'#d0314a',1);burst(x,ty,8,'#d0314a',1);shake();run(200,u=>{a.setAttribute('opacity',1-u);if(u>=1)a.remove()})});await sleep(150)}
  await sleep(420);flash(.5);boom(T,'#d0314a',2.8,'pel');await run(300,t=>{g.setAttribute('opacity',1-t);if(t>=1)g.remove()})}),
 soulstorm:MV('Рой демонов','#d0314a',PS('cast',280,{fu:172,fb:0,bu:172,bb:0}),async(F,T)=>{const hd=F.W('head'),B=T.W('pel');ring(hd.x,hd.y,'#ff3a56',120);flash(.4);let last;
  for(let i=0;i<9;i++){const to={x:B.x+R_(-30,30),y:B.y+R_(-80,60)};last=flyer(F,{x:hd.x,y:hd.y+R_(-30,30)},to,{dur:380,ease:E.in,shape:SH.demon,s0:.5,s1:1.3,trail:1,col:'#d0314a',trailR:6});last.then(()=>{boom(T,'#d0314a',.9);burst(to.x,to.y,6,'#ff3a56',1)});if(i%3===2)shake();await sleep(110)}
  await last;flash(.8);boom(T,'#d0314a',2.8,'pel');shake()})
});

/* ---------- бои за карты: Мория (тени) и Марко (синее пламя) ---------- */
$('stage').querySelector('defs').insertAdjacentHTML('beforeend','<radialGradient id="blueF" cx="40%" cy="40%" r="75%"><stop offset="0" stop-color="#eafcff"/><stop offset=".45" stop-color="#5fd0ff"/><stop offset="1" stop-color="#1a5cff"/></radialGradient><radialGradient id="shadeG" cx="50%" cy="45%" r="65%"><stop offset="0" stop-color="#3a2a52"/><stop offset="1" stop-color="#07040c"/></radialGradient>');
Object.assign(SH,{
 bat:(g,o)=>{el('path',{d:'M0 -4 Q-10 -16 -24 -8 Q-16 -4 -18 4 Q-10 0 -6 8 Q0 2 6 8 Q10 0 18 4 Q16 -4 24 -8 Q10 -16 0 -4Z',fill:'#120a1c',stroke:'#a98bff','stroke-width':2,filter:'drop-shadow(0 0 6px #6a4ad8)'},g);for(const s of [-1,1])el('circle',{cx:s*3,cy:-3,r:1.6,fill:'#ff3a56'},g)},
 scissors:(g,o)=>{for(const a of [-18,18])el('path',{d:'M-30 0 L22 -5 L26 0 L22 5Z',fill:'#cfd6e0',stroke:'#2a2f36','stroke-width':2,transform:`rotate(${a})`},g);for(const s of [-1,1])el('circle',{cx:-34,cy:s*12,r:8,fill:'none',stroke:'#a98bff','stroke-width':4},g)},
 bflame:(g,o)=>{el('path',{d:'M0 -60 Q50 0 0 60 Q18 0 0 -60Z',fill:'url(#blueF)',filter:'drop-shadow(0 0 12px #2f8cff)'},g)},
 bwing:(g,o)=>{el('path',{d:'M0 0 Q-40 -70 -110 -60 Q-70 -40 -90 -20 Q-50 -20 -60 0 Q-30 -6 0 0Z',fill:'url(#blueF)',opacity:.85,filter:'drop-shadow(0 0 10px #2f8cff)'},g)}
});
function legFlameC(F,dur,c1,c2,c3){const g=el('g',{});const glow=el('line',{stroke:c1,'stroke-width':20,'stroke-linecap':'round',opacity:.7,filter:'blur(5px)'},g),core=el('line',{stroke:c3,'stroke-width':7,'stroke-linecap':'round'},g);
 return run(dur,t=>{const k=F.W('fk'),f=F.W('ff');for(const l of [glow,core]){l.setAttribute('x1',k.x);l.setAttribute('y1',k.y);l.setAttribute('x2',f.x);l.setAttribute('y2',f.y)}
  if(Math.random()<.9){const q=el('circle',{cx:f.x+R_(-14,14),cy:f.y+R_(-14,14),r:R_(3,7),fill:Math.random()<.5?c2:c1,opacity:.9});run(300,u=>{q.setAttribute('cy',+q.getAttribute('cy')-1.6);q.setAttribute('opacity',.9*(1-u));if(u>=1)q.remove()})}
  if(t>=1)g.remove()})}
const blueLeg=(F,d)=>legFlameC(F,d,'#2f8cff','#5fd0ff','#eafcff');
function bodyFlame(F,dur){return run(dur,t=>{if(Math.random()<.95){const ks=['head','sh','pel','fh','bh','ff','bf','fk','bk'];const p=F.W(ks[Math.floor(Math.random()*ks.length)]);const q=el('circle',{cx:p.x+R_(-12,12),cy:p.y+R_(-12,12),r:R_(4,9)*F.sc,fill:Math.random()<.5?'#5fd0ff':'#2f8cff',opacity:.85,filter:'blur(1px)'});run(380,u=>{q.setAttribute('cy',+q.getAttribute('cy')-2);q.setAttribute('opacity',.85*(1-u));if(u>=1)q.remove()})}})}
/* клон-тень: тёмная копия бойца на сцене */
function shade(F,x,sc){const g=document.createElementNS(NS,'g');g.setAttribute('class','ds-rim');g.style.setProperty('--g','rgba(150,110,230,.7)');g.style.opacity=0;$('figs').insertBefore(g,$('figs').firstChild);
 const C=new Fighter(g,x,F.dir,'#7a68a8');C.sc=sc||F.sc;C.home=x;C.tgt=F.tgt;return C}
async function shadeIn(C,ms){await run(ms||200,t=>{C.g.style.opacity=.85*t})}
async function shadeOut(C,ms){await run(ms||200,t=>{C.g.style.opacity=.85*(1-t)});C.destroy()}
Object.assign(ABIL,{
 shadowsteal:MV('Кража тени','#a98bff',PS('cast',240),async(F,T)=>{const B=T.W('pel');const ft={x:B.x,y:GROUND-6};
  await flyer(F,F.W('fh'),ft,{dur:260,ease:E.in,spin:720,shape:SH.scissors,s0:.8,s1:1.1});cutAt(ft.x,ft.y,0,70,'#cfd6e0',6);
  const sh=el('ellipse',{cx:ft.x,cy:GROUND,rx:46*T.sc,ry:9,fill:'#07040c',opacity:.9},fxB);const hm=F.W('pel');
  await run(360,t=>{const k=E.io(t);sh.setAttribute('cx',L_(ft.x,hm.x,k));sh.setAttribute('cy',GROUND-Math.sin(Math.PI*k)*80);sh.setAttribute('rx',46*T.sc*(1-.6*k));sh.setAttribute('opacity',.9*(1-.7*k))});sh.remove();
  ring(hm.x,hm.y,'#a98bff',70);boom(T,'#a98bff',1.5)}),
 shadowbats:MV('Теневые мыши','#a98bff',PS('cast',220,{fu:120,fb:0}),async(F,T)=>{const B=T.W('sh');let last;
  for(let i=0;i<7;i++){last=flyer(F,F.W('fh'),{x:B.x+R_(-20,20),y:B.y+R_(-50,50)},{dur:340,arc:R_(-70,90),ease:E.lin,shape:SH.bat,s0:.7,s1:1.2,mirror:1});last.then(()=>burst(B.x,B.y+R_(-40,40),4,'#a98bff',.6));await sleep(70)}
  await last;boom(T,'#a98bff',1.5)}),
 shadowblade:MV('Теневой клинок','#a98bff',PS('windup',240,{bu:60,bb:60}),async(F,T)=>{await F.to('punch',100,E.in,{dx:60});const h=F.W('fh'),B=T.W('sh');
  await flyer(F,h,{x:B.x-F.dir*10,y:B.y},{dur:220,ease:E.in,aim:1,shape:(g)=>{el('path',{d:'M0 -56 Q40 0 0 56 Q16 0 0 -56Z',fill:'#120a1c',stroke:'#a98bff','stroke-width':3,filter:'drop-shadow(0 0 10px #6a4ad8)'},g)},s0:1,s1:1.6,trail:1,col:'#6a4ad8'});boom(T,'#a98bff',1.6)}),
 shadowclones:MV('Клоны-тени','#a98bff',async(F,T)=>{await F.to('cast',240,E.out,{fu:110,fb:0,bu:110,bb:0});
  F._cl=[0,1,2].map(i=>shade(F,F.home-F.dir*(60+i*55),F.sc*.85));for(const C of F._cl){C.tgt=T;ring(C.x,GROUND-90,'#6a4ad8',60)}await Promise.all(F._cl.map(C=>shadeIn(C,260)))},
  async(F,T)=>{const B=T.W('sh');
   for(const C of F._cl){C.to('windup',120,E.out);await sleep(90)}
   for(const C of F._cl){const pr=C.to('punch',130,E.in,{dx:Math.abs(T.home-C.home)-110*C.sc});await sleep(110);cutAt(B.x,B.y+R_(-30,30),R_(-.8,.8),110,'#a98bff',8);boom(T,'#a98bff',1.2);flash(.2);pr.then(()=>shadeOut(C,240))}
   await sleep(220);boom(T,'#a98bff',2.4,'pel');shake();F._cl=null}),
 shadowarmy:MV('Армия теней','#a98bff',PS('cast',260,{fu:172,fb:0,bu:172,bb:0}),async(F,T)=>{const xs=[0,1,2,3,4].map(i=>L_(F.home,T.home,.3+i*.09));
  const S=xs.map(x=>{const C=shade(F,x,.85);C.tgt=T;C.idle=false;C.pose=Object.assign({},POSE.guard,{dy:120});return C});
  for(const C of S){C.g.style.opacity=.85;burst(C.x,GROUND,5,'#6a4ad8',.6)}await Promise.all(S.map((C,i)=>sleep(i*60).then(()=>C.to('guard',300,E.out,{dy:0}))));
  await Promise.all(S.map((C,i)=>sleep(i*70).then(()=>C.to('punch',160,E.in,{dx:Math.abs(T.home-C.home)-80}))));
  const B=T.W('pel');for(let i=0;i<5;i++)cutAt(B.x,B.y+R_(-50,30),R_(-1,1),90,'#a98bff',7);boom(T,'#a98bff',2.4,'pel');shake();
  await Promise.all(S.map(C=>shadeOut(C,260)))}),
 shadowgiant:MV('Гигантская тень','#a98bff',PS('cast',280,{fu:150,fb:0,bu:150,bb:0}),async(F,T)=>{const dk=el('rect',{x:0,y:0,width:960,height:540,fill:'#07040c',opacity:0},fxB);
  const C=shade(F,F.home-F.dir*40,2.05);C.tgt=T;await Promise.all([shadeIn(C,420),run(420,t=>dk.setAttribute('opacity',.45*t))]);
  await C.to('windup',260,E.out);await C.to('punch',140,E.in,{dx:Math.abs(T.home-C.home)-100*C.sc});flash(.8);shake();groundRings(T.W('pel').x,'#6a4ad8','#a98bff',260);boom(T,'#a98bff',2.8,'pel');
  await sleep(200);await Promise.all([shadeOut(C,320),run(320,t=>dk.setAttribute('opacity',.45*(1-t)))]);dk.remove()}),
 bluekick:MV('Синий пинок','#5fd0ff',async(F,T)=>{await F.to('kickW',240,E.out);blueLeg(F,900);await sleep(200)},async(F,T)=>{await F.to('kick',110,E.in,{dx:GAP(F)-175*F.sc});const B=T.W('sh');boom(T,'#5fd0ff',1.6);burst(B.x,B.y,18,'#eafcff',1.3)}),
 phoenixdash:MV('Рывок феникса','#5fd0ff',async(F,T)=>{await F.to('kickW',220,E.out,{dx:-20});blueLeg(F,900)},async(F,T)=>{const x0=F.W('pel');const pr=F.to('kick',160,E.in,{dx:GAP(F)-175*F.sc});
  await run(160,t=>{const p=F.W('pel');tdot(p.x+R_(-10,10),p.y+R_(-30,30),Math.random()<.5?'#5fd0ff':'#2f8cff',8)});await pr;boom(T,'#5fd0ff',1.6);cutAt(T.W('sh').x,T.W('sh').y,-.5,100,'#eafcff',8)}),
 flamekicks:MV('Серия синих пинков','#5fd0ff',async(F,T)=>{await F.to('kickW',200,E.out);blueLeg(F,1000)},async(F,T)=>{await F.to('kick',100,E.in,{dx:GAP(F)-175*F.sc});const B=T.W('sh');
  for(let i=0;i<4;i++){F.to(i%2?'kickW':'kick',55,E.out,{dx:GAP(F)-175*F.sc});burst(B.x,B.y+R_(-40,40),6,i%2?'#2f8cff':'#5fd0ff',.8);flash(.12);await sleep(85)}boom(T,'#5fd0ff',1.7)}),
 phoenixkick:MV('Синее пламя феникса','#5fd0ff',async(F,T)=>{F.to('charge',300,E.out);const p=F.W('pel');ring(p.x,p.y-40,'#5fd0ff',120);await bodyFlame(F,620);await F.to('kickW',200,E.out);blueLeg(F,1100)},
  async(F,T)=>{bodyFlame(F,600);await F.to('kick',120,E.in,{dx:GAP(F)-175*F.sc});const B=T.W('sh'),ff=F.W('ff');
  await flyer(F,{x:ff.x,y:ff.y-30},{x:B.x,y:B.y},{dur:150,ease:E.in,aim:1,shape:SH.bflame,s0:1.2,s1:2});flash(.7);shake();boom(T,'#5fd0ff',2.6,'pel');burst(B.x,B.y,30,'#eafcff',1.8);ring(B.x,B.y,'#2f8cff',190)}),
 phoenixdive:MV('Пике феникса','#5fd0ff',async(F,T)=>{const wg=[0,1].map(()=>el('g',{}));wg.forEach((g,i)=>{SH.bwing(g,{})});F._w=wg;
  const upd=()=>{const s=F.W('sh');wg[0].setAttribute('transform',`translate(${s.x},${s.y}) scale(${F.dir*F.sc},${F.sc})`);wg[1].setAttribute('transform',`translate(${s.x},${s.y}) scale(${-F.dir*F.sc*.8},${F.sc*.8})`)};
  F._wr=run(1300,t=>{upd();if(t>=1)wg.forEach(g=>g.remove())});await F.to('kickW',320,E.out,{dy:-190,dx:GAP(F)*.5-60,t:-10});blueLeg(F,900);await sleep(100)},
  async(F,T)=>{await F.to('kick',150,E.in,{dx:GAP(F)-175*F.sc,dy:0,t:-30});const B=T.W('pel');groundRings(B.x,'#5fd0ff','#eafcff',260);boom(T,'#5fd0ff',2.6,'pel');burst(B.x,GROUND-6,30,'#5fd0ff',1.6);shake();await F._wr;F._w.forEach(g=>g.remove())}),
 bluewheel:MV('Синее колесо','#5fd0ff',async(F,T)=>{await F.to('kickW',240,E.out);blueLeg(F,1000);await sleep(200)},async(F,T)=>{const pr=F.to('kick',120,E.in,{dx:GAP(F)-175*F.sc});const f=F.W('pel'),B=T.W('pel');
  await flyer(F,{x:f.x+F.dir*70,y:GROUND-60},{x:B.x,y:B.y},{dur:300,ease:E.lin,spin:1080*F.dir,shape:(g)=>{el('circle',{r:50,fill:'none',stroke:'#2f8cff','stroke-width':14,'stroke-dasharray':'60 40',filter:'drop-shadow(0 0 10px #2f8cff)'},g);el('circle',{r:50,fill:'none',stroke:'#eafcff','stroke-width':5,'stroke-dasharray':'30 70'},g)},s0:1,s1:1.6,trail:1,col:'#5fd0ff'});await pr;boom(T,'#5fd0ff',2.4,'pel');shake()})
});

/* ---------- бои за карты: Магеллан (яд, гидра), Нептун (трезубец, вода), Дофламинго (нити) ---------- */
$('stage').querySelector('defs').insertAdjacentHTML('beforeend','<radialGradient id="poisonG" cx="40%" cy="40%" r="75%"><stop offset="0" stop-color="#f0d8ff"/><stop offset=".45" stop-color="#b48cff"/><stop offset="1" stop-color="#5a1f8a"/></radialGradient><radialGradient id="seaG" cx="40%" cy="40%" r="75%"><stop offset="0" stop-color="#eafcff"/><stop offset=".5" stop-color="#4fb6ff"/><stop offset="1" stop-color="#0d4f9a"/></radialGradient>');
Object.assign(SH,{
 hhead:(g,o)=>{el('path',{d:'M-14 -16 Q18 -22 40 -6 L48 0 L40 6 Q18 22 -14 16Z',fill:'#b48cff',stroke:'#e0303a','stroke-width':4,'stroke-linejoin':'round',filter:'drop-shadow(0 0 8px #b48cff)'},g);
  el('circle',{cx:18,cy:-9,r:3.6,fill:'#ffe14a'},g);for(const x of [30,38])el('polygon',{points:`${x},3 ${x+3},14 ${x+6},3`,fill:'#fff'},g)},
 pblob:(g,o)=>{const r=o.r||16;el('circle',{r,fill:'url(#poisonG)',stroke:'#e0303a','stroke-width':2.5,filter:'drop-shadow(0 0 8px #b48cff)'},g);el('circle',{cx:-r*.3,cy:-r*.35,r:r*.25,fill:'#fff',opacity:.6},g)},
 bubble:(g,o)=>{const r=o.r||20;el('circle',{r,fill:'rgba(120,210,255,.18)',stroke:'#bfeaff','stroke-width':3,filter:'drop-shadow(0 0 6px #4fb6ff)'},g);el('ellipse',{cx:-r*.35,cy:-r*.4,rx:r*.3,ry:r*.18,fill:'#fff',opacity:.75},g)},
 trid:(g,o)=>{el('line',{x1:-120,y1:0,x2:40,y2:0,stroke:'#0d1118','stroke-width':12,'stroke-linecap':'round'},g);el('line',{x1:-118,y1:0,x2:40,y2:0,stroke:'#ffd25a','stroke-width':6,'stroke-linecap':'round',filter:'drop-shadow(0 0 10px #4fb6ff)'},g);
  el('path',{d:'M40 -22 L40 22 M40 -22 L70 -22 M40 0 L80 0 M40 22 L70 22',stroke:'#ffd25a','stroke-width':6,fill:'none','stroke-linecap':'round',filter:'drop-shadow(0 0 10px #4fb6ff)'},g)},
 needle:(g,o)=>{el('line',{x1:-26,y1:0,x2:20,y2:0,stroke:'#ffe6f2','stroke-width':3,'stroke-linecap':'round',filter:'drop-shadow(0 0 6px #ff6fae)'},g)}
});
function bodyAura(F,dur,c1,c2){return run(dur,t=>{if(Math.random()<.95){const ks=['head','sh','pel','fh','bh','ff','bf','fk','bk','fe','be'];const p=F.W(ks[Math.floor(Math.random()*ks.length)]);const q=el('circle',{cx:p.x+R_(-10,10),cy:p.y+R_(-10,10),r:R_(4,8)*F.sc,fill:Math.random()<.5?c1:c2,opacity:.85});run(420,u=>{q.setAttribute('cy',+q.getAttribute('cy')+2.2);q.setAttribute('opacity',.85*(1-u));if(u>=1)q.remove()})}})}
/* голова гидры на шее: выходит из-за спины, бьёт и уходит */
function hydra(F,i){const ow=el('path',{fill:'none',stroke:'#e0303a','stroke-width':26*F.sc,'stroke-linecap':'round'},fxB),iw=el('path',{fill:'none',stroke:'#b48cff','stroke-width':18*F.sc,'stroke-linecap':'round'},fxB);
 const h=el('g',{});SH.hhead(h,{});const b=F.W('pel');const base={x:b.x-F.dir*(20+i*6),y:b.y-10};
 const set=(x,y)=>{const cx=base.x,cy=y;const d=`M ${base.x} ${base.y} Q ${cx} ${cy} ${x} ${y}`;ow.setAttribute('d',d);iw.setAttribute('d',d);const a=Math.atan2(y-cy,x-cx)*180/Math.PI;h.setAttribute('transform',`translate(${x},${y}) rotate(${Math.abs(x-cx)<1?(F.dir>0?0:180):a}) scale(${F.sc*.9})`)};
 const rest={x:F.home-F.dir*(10-(i-1)*55)*F.sc,y:GROUND-(250+(i===1?50:0))*F.sc*.8};let cur={x:base.x,y:base.y};set(cur.x,cur.y+1);
 return{rise:()=>run(300,t=>{const k=E.out(t);cur={x:L_(base.x,rest.x,k),y:L_(base.y,rest.y,k)};set(cur.x,cur.y)}),
  strike:(B)=>run(170,t=>{const k=E.in(t);set(L_(rest.x,B.x-F.dir*30,k),L_(rest.y,B.y,k))}),
  gone:()=>run(240,t=>{for(const e of [ow,iw,h])e.setAttribute('opacity',1-t);if(t>=1){ow.remove();iw.remove();h.remove()}})}}
function attachTrident(F){const g=F.inner;const mk=(c,w)=>{const l=document.createElementNS(NS,'line');l.setAttribute('stroke',c);l.setAttribute('stroke-width',w);l.setAttribute('stroke-linecap','round');g.appendChild(l);return l};
 const so=mk('#0d1118',9),si=mk('#ffd25a',4.5);const pr=document.createElementNS(NS,'path');pr.setAttribute('stroke','#ffd25a');pr.setAttribute('stroke-width',4.5);pr.setAttribute('fill','none');pr.setAttribute('stroke-linecap','round');g.appendChild(pr);
 const old=F.draw.bind(F);F.draw=function(t){old(t);const p=this.pts;let dx=p.fh.x-p.fe.x,dy=p.fh.y-p.fe.y;const n=Math.hypot(dx,dy)||1;dx/=n;dy/=n;const P=k=>({x:p.fh.x+dx*k,y:p.fh.y+dy*k});const a=P(-46),b=P(96);
  for(const l of [so,si]){l.setAttribute('x1',a.x);l.setAttribute('y1',a.y);l.setAttribute('x2',b.x);l.setAttribute('y2',b.y)}
  const px=-dy,py=dx,q=(k,s)=>{const c=P(k);return (c.x+px*s)+' '+(c.y+py*s)};
  pr.setAttribute('d','M '+q(96,-14)+' L '+q(96,14)+' M '+q(96,-14)+' L '+q(116,-14)+' M '+q(96,0)+' L '+q(124,0)+' M '+q(96,14)+' L '+q(116,14))}}
function attachTail(F,col){const g=F.inner;const ls=g.querySelectorAll('line');[2,3,6,7,14,15,16,17].forEach(i=>{if(ls[i])ls[i].style.display='none'});
 const to=document.createElementNS(NS,'path'),ti=document.createElementNS(NS,'path'),fin=document.createElementNS(NS,'path');
 to.setAttribute('stroke',col);to.setAttribute('stroke-width',44);ti.setAttribute('stroke','#0d1118');ti.setAttribute('stroke-width',35);for(const e of [to,ti]){e.setAttribute('fill','none');e.setAttribute('stroke-linecap','round')}
 fin.setAttribute('fill','#0d1118');fin.setAttribute('stroke',col);fin.setAttribute('stroke-width',4);fin.setAttribute('stroke-linejoin','round');
 g.insertBefore(fin,g.firstChild);g.insertBefore(ti,g.firstChild);g.insertBefore(to,g.firstChild);
 const old=F.draw.bind(F);F.draw=function(t){old(t);const p=this.pts;const m={x:(p.ff.x+p.bf.x)/2,y:(p.ff.y+p.bf.y)/2};const c1={x:p.pel.x+14,y:p.pel.y+(m.y-p.pel.y)*.35},c2={x:m.x+22,y:m.y-(m.y-p.pel.y)*.3};
  const d=`M ${p.pel.x} ${p.pel.y} C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${m.x} ${m.y}`;to.setAttribute('d',d);ti.setAttribute('d',d);
  let ux=m.x-c2.x,uy=m.y-c2.y;const n=Math.hypot(ux,uy)||1;ux/=n;uy/=n;const vx=-uy,vy=ux;const e=(a,b)=>(m.x+ux*a+vx*b)+' '+(m.y+uy*a+vy*b);
  fin.setAttribute('d','M '+e(0,0)+' Q '+e(16,-10)+' '+e(30,-40)+' Q '+e(18,-8)+' '+e(8,0)+' Q '+e(18,8)+' '+e(30,40)+' Q '+e(16,10)+' '+e(0,0)+' Z')}}
function threads(pairs){const ls=pairs.map(()=>el('line',{stroke:'#ffe6f2','stroke-width':1.6,opacity:.95,filter:'drop-shadow(0 0 4px #ff6fae)'}));let on=true;
 const up=()=>{if(!on)return;pairs.forEach(([a,b],i)=>{const A=a(),B=b();ls[i].setAttribute('x1',A.x);ls[i].setAttribute('y1',A.y);ls[i].setAttribute('x2',B.x);ls[i].setAttribute('y2',B.y)})};up();subs.add(up);
 return{cut:()=>{on=false;subs.delete(up);return run(220,t=>{ls.forEach(l=>l.setAttribute('opacity',.95*(1-t)));if(t>=1)ls.forEach(l=>l.remove())})}}}
Object.assign(ABIL,{
/* ---- Магеллан ---- */
 poisonspit:MV('Ядовитый плевок','#b48cff',PS('charge',220),async(F,T)=>{const hd=F.W('head'),B=T.W('sh');let last;
  for(let i=0;i<3;i++){last=flyer(F,hd,{x:B.x-F.dir*8,y:B.y+R_(-30,30)},{dur:320,arc:70,ease:E.lin,shape:SH.pblob,r:15,trail:1,col:'#b48cff',trailR:5});last.then(()=>{burst(B.x,B.y,6,'#b48cff',.8)});await sleep(110)}
  await last;bodyAura(T,500,'#b48cff','#7a3fc0');boom(T,'#b48cff',1.5)}),
 poisoncoat:MV('Ядовитый кулак','#b48cff',async(F,T)=>{F.to('charge',300,E.out);await bodyAura(F,560,'#b48cff','#e0303a');await F.to('windup',160,E.out)},async(F,T)=>{bodyAura(F,300,'#b48cff','#e0303a');await F.to('punch',110,E.in,{dx:DX(F)});const B=T.W('sh');boom(T,'#b48cff',1.8);bodyAura(T,500,'#b48cff','#7a3fc0')}),
 hydrabite:MV('Укус гидры','#b48cff',PS('cast',220,{fu:120,fb:0}),async(F,T)=>{const H=hydra(F,1);await H.rise();await sleep(80);const B=T.W('sh');await H.strike(B);boom(T,'#b48cff',1.7);burst(B.x,B.y,14,'#e0303a',1);await sleep(140);await H.gone()}),
 hydra3:MV('Трёхголовая гидра','#b48cff',PS('cast',280,{fu:172,fb:0,bu:172,bb:0}),async(F,T)=>{const dk=el('rect',{x:0,y:0,width:960,height:540,fill:'#14061f',opacity:0},fxB);run(300,t=>dk.setAttribute('opacity',.45*t));
  const Hs=[0,1,2].map(i=>hydra(F,i));await Promise.all(Hs.map((H,i)=>sleep(i*90).then(()=>H.rise())));await sleep(260);
  for(let i=0;i<3;i++){const B=T.W(['head','sh','pel'][i]);await Hs[i].strike(B);boom(T,'#b48cff',1.3);bodyAura(T,300,'#b48cff','#7a3fc0');flash(.25);shake()}
  boom(T,'#b48cff',2.6,'pel');await sleep(220);await Promise.all([...Hs.map(H=>H.gone()),run(260,t=>dk.setAttribute('opacity',.45*(1-t)))]);dk.remove()}),
 poisonrain:MV('Ядовитый дождь','#b48cff',PS('cast',260,{fu:172,fb:0,bu:172,bb:0}),async(F,T)=>{const B=T.W('head');const cl=cloud2(B.x,90,1.5,'#4a1f6a','#200a30','#b48cff');await run(340,t=>cl.set(E.out(t)));
  let last;for(let i=0;i<16;i++){const x=B.x+R_(-90,90);last=flyer(F,{x,y:120},{x:x+R_(-10,10),y:R_(B.y,GROUND-10)},{dur:300,ease:E.in,shape:SH.pblob,r:7});await sleep(45)}
  await last;bodyAura(T,500,'#b48cff','#7a3fc0');boom(T,'#b48cff',2.4,'pel');await run(300,t=>cl.set(1,1-t));cl.g.remove()}),
 poisonflood:MV('Ядовитая волна','#b48cff',PS('charge',260),async(F,T)=>{await F.to('cast',110,E.out,{fu:70,fb:60});const sx=F.W('pel').x+F.dir*90,ex=T.W('pel').x,n=12;
  for(let i=0;i<n;i++){const x=sx+(ex-sx)*i/(n-1);const g=el('g',{});el('path',{d:'M-22 0 Q-28 -40 -6 -60 Q4 -36 12 -48 Q26 -22 22 0Z',fill:'url(#poisonG)',stroke:'#e0303a','stroke-width':2,filter:'drop-shadow(0 0 8px #b48cff)'},g);
   run(400,t=>{const k=t<.3?E.out(t/.3):1-(t-.3)/.7;g.setAttribute('transform',`translate(${x},${GROUND}) scale(${1+i*.06},${Math.max(.01,(1.1+i*.05)*k)})`);if(t>=1)g.remove()});await sleep(34)}
  bodyAura(T,500,'#b48cff','#7a3fc0');boom(T,'#b48cff',2.6,'pel');shake()}),
/* ---- Нептун ---- */
 tridentthrust:MV('Удар трезубцем','#4fb6ff',PS('windup',260,{dx:-20}),async(F,T)=>{await F.to('punch',110,E.in,{dx:DX(F)});const B=T.W('sh');for(const o of [-22,0,22])cutAt(B.x,B.y+o,0,70,'#eafcff',6);boom(T,'#4fb6ff',1.6)}),
 tridentwave:MV('Волна с трезубца','#4fb6ff',PS('windup',240,{bu:60,bb:60}),async(F,T)=>{await F.to('punch',100,E.in,{dx:60});const h=F.W('fh'),B=T.W('sh');
  await flyer(F,h,{x:B.x-F.dir*10,y:B.y},{dur:230,ease:E.in,aim:1,shape:(g)=>{el('path',{d:'M0 -56 Q42 0 0 56 Q16 0 0 -56Z',fill:'url(#seaG)',filter:'drop-shadow(0 0 10px #4fb6ff)'},g)},s0:1,s1:1.6,trail:1,col:'#bfeaff'});boom(T,'#4fb6ff',1.6);burst(B.x,B.y,16,'#bfeaff',1.2)}),
 bubbles:MV('Пузыри','#4fb6ff',PS('cast',220),async(F,T)=>{const B=T.W('sh');let last;for(let i=0;i<5;i++){last=flyer(F,F.W('fh'),{x:B.x+R_(-20,20),y:B.y+R_(-50,40)},{dur:420,arc:R_(-50,50),ease:E.out,shape:SH.bubble,r:R_(14,24),s0:.5,s1:1.2});last.then(()=>ring(B.x,B.y,'#bfeaff',50));await sleep(80)}await last;boom(T,'#4fb6ff',1.5);burst(B.x,B.y,14,'#bfeaff',1.2)}),
 tridentthrow:MV('Бросок трезубца','#4fb6ff',PS('windup',300,{bu:172,bb:0,fu:150,fb:0}),async(F,T)=>{await F.to('punch',110,E.in,{dx:40});const h=F.W('fh'),B=T.W('sh');
  await flyer(F,{x:h.x,y:h.y-30},{x:B.x-F.dir*20,y:B.y},{dur:240,ease:E.in,aim:1,shape:SH.trid,s0:1.2,s1:1.6,trail:1,col:'#bfeaff',trailR:6});flash(.6);shake();boom(T,'#4fb6ff',2.6,'pel');
  for(let i=0;i<10;i++)flyer(F,{x:B.x,y:B.y},{x:B.x+R_(-140,140),y:B.y+R_(-120,60)},{dur:420,ease:E.out,shape:SH.bubble,r:R_(5,10)});ring(B.x,B.y,'#4fb6ff',180)}),
 tidal:MV('Удар прилива','#4fb6ff',PS('cast',280,{fu:172,fb:0,bu:172,bb:0}),async(F,T)=>{const B=T.W('pel');const w=el('path',{fill:'url(#seaG)',opacity:.9,filter:'drop-shadow(0 0 12px #4fb6ff)'});const sx=F.home-F.dir*40;
  await run(620,t=>{const k=E.in(t),x=L_(sx,B.x+F.dir*40,k),h=60+200*Math.sin(Math.PI*Math.min(1,t*1.2));const s=F.dir;
   w.setAttribute('d',`M ${x-s*260} ${GROUND} Q ${x-s*120} ${GROUND-h*.6} ${x-s*30} ${GROUND-h} Q ${x+s*30} ${GROUND-h-30} ${x+s*20} ${GROUND-h+40} Q ${x+s*10} ${GROUND-h*.4} ${x+s*40} ${GROUND} Z`);if(Math.random()<.6)tdot(x+R_(-20,20),GROUND-h+R_(0,30),'#eafcff',5)});
  w.remove();flash(.6);shake();boom(T,'#4fb6ff',2.8,'pel');burst(B.x,B.y,34,'#bfeaff',2)}),
 tridentstorm:MV('Водоворот трезубца','#4fb6ff',PS('cast',280,{fu:172,fb:0,bu:60,bb:20}),async(F,T)=>{const B=T.W('pel');const v=el('g',{});const rs=[0,1,2,3].map(i=>el('ellipse',{rx:40,ry:14,fill:'none',stroke:i%2?'#bfeaff':'#4fb6ff','stroke-width':6},v));
  await run(600,t=>{v.setAttribute('transform',`translate(${B.x},${GROUND})`);rs.forEach((e,i)=>{e.setAttribute('cy',-i*55*E.out(t));e.setAttribute('rx',(40+i*22)*E.out(t));e.setAttribute('ry',(12+i*4));e.setAttribute('transform',`rotate(${Math.sin(t*20+i)*8})`)})});
  const g=el('g',{});SH.trid(g,{});await run(240,t=>{g.setAttribute('transform',`translate(${B.x},${L_(-160,B.y-60,E.in(t))}) rotate(90) scale(1.4)`)});g.remove();flash(.8);shake();groundRings(B.x,'#4fb6ff','#eafcff',260);boom(T,'#4fb6ff',2.8,'pel');
  await run(260,t=>{v.setAttribute('opacity',1-t)});v.remove()}),
/* ---- Дофламинго ---- */
 stringcut:MV('Режущие нити','#ff6fae',PS('cast',220,{fu:120,fb:-10}),async(F,T)=>{const B=T.W('sh');for(let i=0;i<5;i++){const a=R_(-1.2,1.2);const l=el('line',{x1:B.x-160*Math.cos(a),y1:B.y-160*Math.sin(a),x2:B.x+160*Math.cos(a),y2:B.y+160*Math.sin(a),stroke:'#ffe6f2','stroke-width':2,filter:'drop-shadow(0 0 5px #ff6fae)'});run(240,t=>{l.setAttribute('opacity',1-t);if(t>=1)l.remove()});burst(B.x,B.y+R_(-30,30),4,'#ff6fae',.6);await sleep(60)}boom(T,'#ff6fae',1.6)}),
 flamingokick:MV('Пинок фламинго','#ff6fae',async(F,T)=>{await F.to('kickW',240,E.out)},async(F,T)=>{await F.to('kick',110,E.in,{dx:GAP(F)-175*F.sc});const B=T.W('sh');boom(T,'#ff6fae',1.7);for(let i=0;i<8;i++)flyer(F,B,{x:B.x+R_(-90,90),y:B.y+R_(-70,50)},{dur:420,ease:E.out,spin:R_(-300,300),shape:(g)=>el('ellipse',{rx:9,ry:4,fill:'#ff9ac8'},g)})}),
 stringbullet:MV('Нити-пули','#ff6fae',PS('cast',200),async(F,T)=>{const B=T.W('sh');let last;for(let i=0;i<6;i++){last=flyer(F,F.W('fh'),{x:B.x,y:B.y+R_(-40,40)},{dur:150,ease:E.lin,aim:1,shape:SH.needle});last.then(()=>burst(B.x,B.y,3,'#ff6fae',.5));await sleep(55)}await last;boom(T,'#ff6fae',1.5)}),
 puppet:MV('Марионетка','#ff6fae',PS('cast',280,{fu:172,fb:0,bu:150,bb:0}),async(F,T)=>{const ks=['head','fh','bh','ff','bf'];
  const th=threads(ks.map((k,i)=>[()=>({x:T.home+(i-2)*34,y:0}),()=>T.W(k)]));T.idle=false;await sleep(180);
  for(let i=0;i<3;i++){await T.to(i%2?'windup':'kickW',150,E.io,{dx:-10});await T.to('stagger',130,E.io,{dx:5})}
  await T.to('hit',160,E.out,{dy:-60,rot:-12});flash(.4);await F.to('kickW',160,E.out);await F.to('kick',110,E.in,{dx:GAP(F)-175*F.sc});th.cut();shake();boom(T,'#ff6fae',2.6,'pel');
  const B=T.W('sh');for(let i=0;i<4;i++)cutAt(B.x,B.y+R_(-40,40),R_(-1,1),110,'#ffe6f2',4)}),
 birdcage:MV('Птичья клетка','#ff6fae',PS('cast',280,{fu:172,fb:0,bu:172,bb:0}),async(F,T)=>{const B=T.W('pel');const xs=Array.from({length:12},(_,i)=>B.x-170+i*31);const ls=xs.map(x=>el('line',{x1:x,y1:0,x2:x,y2:0,stroke:'#ffe6f2','stroke-width':2,filter:'drop-shadow(0 0 5px #ff6fae)'}));
  await run(380,t=>{ls.forEach(l=>l.setAttribute('y2',GROUND*E.out(t)))});await sleep(160);
  await run(420,t=>{const k=E.in(t);ls.forEach((l,i)=>{const x=L_(xs[i],B.x+(i-5.5)*4,k);l.setAttribute('x2',x);l.setAttribute('x1',L_(xs[i],B.x,k*.6))})});
  flash(.7);shake();boom(T,'#ff6fae',2.8,'pel');for(let i=0;i<6;i++)cutAt(B.x,B.y+R_(-80,40),R_(-1.3,1.3),130,'#ffe6f2',4);await run(240,t=>ls.forEach(l=>l.setAttribute('opacity',1-t)));ls.forEach(l=>l.remove())}),
 overheat:MV('Раскалённая нить','#ff6fae',PS('windup',280,{bu:60,bb:60}),async(F,T)=>{await F.to('punch',110,E.in,{dx:40});const h=F.W('fh'),B=T.W('sh');const o=el('path',{fill:'none',stroke:'#ff3a7a','stroke-width':16,'stroke-linecap':'round',filter:'drop-shadow(0 0 12px #ff3a7a)'}),c=el('path',{fill:'none',stroke:'#ffe6f2','stroke-width':5,'stroke-linecap':'round'});
  await run(320,t=>{const k=E.out(t);const ex=L_(h.x,B.x,k),ey=L_(h.y,B.y,k);let d=`M ${h.x} ${h.y}`;for(let i=1;i<=8;i++){const u=i/8;d+=` L ${L_(h.x,ex,u)} ${L_(h.y,ey,u)+Math.sin(u*9+t*20)*22*(1-u*.5)}`}o.setAttribute('d',d);c.setAttribute('d',d)});
  flash(.6);shake();boom(T,'#ff6fae',2.6,'pel');burst(B.x,B.y,26,'#ff3a7a',1.6);await run(220,t=>{o.setAttribute('opacity',1-t);c.setAttribute('opacity',1-t)});o.remove();c.remove()})
});

const CHARS={
 sword:{name:'Мечник',col:'#e8eef5',glow:'190,220,255',band:'#3f9bff',sword:1,l:['wave','dash','flurry'],h:['vortex','cross','plunge']},
 fire:{name:'Огненный боец',col:'#e6573f',glow:'255,90,60',l:['shots','whip','firewave'],h:['fire','pillar','meteor']},
 viol:{name:'Фиолетовый (трезубец)',col:'#a06bff',glow:'160,107,255',l:['donuts','mochikick','ringroll'],h:['trident','bigfists','donutstorm']},
 pink:{name:'Розовый (резина)',col:'#ff7aa8',glow:'255,122,168',l:['gatling','longkick','sling'],h:['stretcharm','balloon','gatlingH']},
 blue:{name:'Голубой (сердца)',col:'#56c8ff',glow:'86,200,255',l:['cupid','kiss','heartburst'],h:['heartshot','arrowrain','lovebeam']},
 navy:{name:'Синий (сфера)',col:'#3f6bff',glow:'80,120,255',band:'#9fb8ff',sword:1,l:['phase','blink','miniroom'],h:['room','multiroom','collapse']},
 orange:{name:'Оранжевый (погода)',col:'#ff9a2a',glow:'255,154,42',l:['gust','rain','spark'],h:['stormcloud','tornado','hail']},
 lilac:{name:'Сиреневый (конечности)',col:'#c9a0ff',glow:'201,160,255',l:['grabhand','footkick','bodyhands'],h:['gianthand','giantfoot','handforest']},
 red:{name:'Красный (магнит)',col:'#ff4d4d',glow:'255,77,77',l:['junk','blades','magthrow'],h:['bigmetal','metalfist','ironstorm']},
 yellow:{name:'Жёлтый (ноги)',col:'#ffd23a',glow:'255,210,58',l:['rapid','spinkick','skykick'],h:['firekick','firewheel','starkick']},
 maroon:{name:'Бордовый (вода)',col:'#b02a4a',glow:'176,42,74',l:['jet','orb','swell'],h:['whirl','geyser','tsunami']}
};
const BIGCH={
 akainu:{name:'Адмирал: красный (лава)',col:'#ff5a1f',glow:'255,90,31',ent:'admiral',bg:'admiral',sc:1.5,x:660,l:['lavaballs','lavawave','lavaspear'],h:['lavameteor','lavafist','lavaerupt']},
 kizaru:{name:'Адмирал: жёлтый (свет)',col:'#ffe14a',glow:'255,225,74',ent:'admiral',bg:'admiral',sc:1.5,x:660,l:['lasershots','flashstep','lightmirrors'],h:['lightkick','lasergrid','sunbeam']},
 fujitora:{name:'Адмирал: сиреневый (гравитация)',col:'#a98bff',glow:'169,139,255',ent:'admiral',bg:'admiral',sc:1.5,x:660,l:['gravball','floatrocks','gravpull'],h:['meteorcall','gravpress','blackhole']},
 aokiji:{name:'Адмирал: голубой (лёд)',col:'#8fdcff',glow:'143,220,255',ent:'admiral',bg:'admiral',sc:1.5,x:660,l:['icicles','frostwave','iceslash'],h:['iceball','icesword','icespikes']},
 shanks:{name:'Хранитель: меч и красные молнии',col:'#c43a3a',glow:'196,58,58',ent:'guardian',bg:'guardian',sc:1.25,x:645,sword:1,l:['swordbolt','sparkdash','redcut'],h:['stormslash','redstorm','thunderblade']},
 wb:{name:'Хранитель: землетрясения',col:'#e8e0d0',glow:'232,224,208',ent:'guardian',bg:'guardian',sc:1.25,x:645,l:['tremorpunch','shockstomp','airshock'],h:['quakebig','airquake','tremorwave']},
 kaido:{name:'Хранитель: булава и огонь изо рта',col:'#8a5a34',glow:'138,90,52',ent:'guardian',bg:'guardian',sc:1.25,x:645,l:['clubswing','fireball','bullcharge'],h:['clubsmash','firebreath','clubspin']},
 bm:{name:'Хранитель: огромный меч и розовые молнии',col:'#ff8ec4',glow:'255,142,196',ent:'guardian',bg:'guardian',sc:1.25,x:645,sword:1,swordLen:170,l:['swordchop','pinkbolt','flameburst'],h:['giantblade','pinkstorm','fireorbs']},
 hero:{name:'Босс 5 уровня: белый (кулаки)',col:'#ffffff',glow:'255,255,255',ent:'boss',bg:'boss',sc:1.4,x:655,l:['jab','combo','forcepulse'],h:['giantfist','wavebarrage','shockpunch']}
};
BIGCH.moria={name:'Гекко Мория: тени',col:'#6e5c94',glow:'170,130,255',ent:'boss',bg:'boss',sc:1.5,x:660,l:['shadowsteal','shadowbats','shadowblade'],h:['shadowclones','shadowarmy','shadowgiant']};
BIGCH.marco={name:'Марко: синее пламя',col:'#ffd23a',glow:'79,182,255',band:'#4fb6ff',ent:'phoenix',bg:'boss',sc:1.3,x:650,l:['bluekick','phoenixdash','flamekicks'],h:['phoenixkick','phoenixdive','bluewheel']};
BIGCH.magellan={name:'Магеллан: яд и гидра',col:'#e0303a',fill:'#b48cff',glow:'224,48,58',ent:'boss',fog:'#9a6ac8',bg:'boss',sc:1.5,x:660,l:['poisonspit','poisoncoat','hydrabite'],h:['hydra3','poisonrain','poisonflood']};
BIGCH.neptune={name:'Король Нептун: трезубец и вода',col:'#4fb6ff',glow:'79,182,255',ent:'sea',bg:'sea',sc:1.5,x:660,tail:1,trident:1,l:['tridentthrust','tridentwave','bubbles'],h:['tridentthrow','tidal','tridentstorm']};
BIGCH.dofla={name:'Дофламинго: нити',col:'#ff6fae',glow:'255,111,174',band:'#ffe14a',ent:'strings',bg:'boss',sc:1.5,x:660,l:['stringcut','flamingokick','stringbullet'],h:['puppet','birdcage','overheat']};
BIGCH.imu={name:'Има: чёрная сущность в короне',col:'#f4f4f8',glow:'208,49,74',ent:'imu',bg:'imu',sc:1.6,x:670,crown:1,l:['demonclaws','shadowbolt','soulgrab'],h:['giantclaws','hellportal','soulstorm']};
const HEAVY=new Set();for(const id in CHARS)CHARS[id].h.forEach(k=>HEAVY.add(k));for(const id in BIGCH)BIGCH[id].h.forEach(k=>HEAVY.add(k));

/* ---------- звук: синтез Web Audio, без файлов ---------- */
const AU={ctx:null,m:null,nb:null};
function actx(){if(AU.ctx)return AU.ctx;try{const A=window.AudioContext||window.webkitAudioContext;if(!A)return null;AU.ctx=new A();AU.m=AU.ctx.createGain();AU.m.gain.value=.5;AU.m.connect(AU.ctx.destination)}catch(e){AU.ctx=null}return AU.ctx}
document.addEventListener('pointerdown',()=>{if(!API.soundOn())return;const c=actx();if(c&&c.state==='suspended')c.resume().catch(()=>{})},true);
function tone(t0,f,d,type,v,f2){const c=AU.ctx,o=c.createOscillator(),g=c.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f,t0);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t0+d);g.gain.setValueAtTime(.0001,t0);g.gain.exponentialRampToValueAtTime(v||.15,t0+.012);g.gain.exponentialRampToValueAtTime(.0001,t0+d);o.connect(g);g.connect(AU.m);o.start(t0);o.stop(t0+d+.05)}
function nbuf(){if(AU.nb)return AU.nb;const c=AU.ctx;AU.nb=c.createBuffer(1,c.sampleRate*2,c.sampleRate);const a=AU.nb.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1;return AU.nb}
function noise(t0,d,v,ft,f0,f1,q){const c=AU.ctx,s=c.createBufferSource();s.buffer=nbuf();const fl=c.createBiquadFilter();fl.type=ft||'bandpass';fl.frequency.setValueAtTime(f0,t0);if(f1)fl.frequency.exponentialRampToValueAtTime(f1,t0+d);fl.Q.value=q||1;const g=c.createGain();g.gain.setValueAtTime(.0001,t0);g.gain.exponentialRampToValueAtTime(v,t0+Math.min(.04,d/3));g.gain.exponentialRampToValueAtTime(.0001,t0+d);s.connect(fl);fl.connect(g);g.connect(AU.m);s.start(t0,Math.random()*1.5);s.stop(t0+d+.05)}
const SND={
 slash:t=>{noise(t,.2,.45,'highpass',2400,6500,1);tone(t+.02,1900,.16,'triangle',.05,900);noise(t+.12,.14,.25,'highpass',3500,7000,1)},
 fire:t=>{noise(t,.9,.4,'lowpass',260,1300,1);tone(t,90,.7,'sawtooth',.05,60);for(let i=0;i<7;i++)noise(t+.08+i*.1+Math.random()*.05,.03,.18,'highpass',3500,null,1)},
 lava:t=>{tone(t,58,1,'sawtooth',.12,32);noise(t,1,.4,'lowpass',180,700,1);for(let i=0;i<6;i++)tone(t+.15+i*.12,120+Math.random()*80,.12,'sine',.08,60)},
 punch:t=>noise(t,.2,.4,'bandpass',400,1500,1),
 kick:t=>{noise(t,.22,.4,'bandpass',600,2200,1.2);tone(t+.1,300,.15,'triangle',.05,600)},
 rubber:t=>{tone(t,170,.3,'sine',.25,640);tone(t+.3,640,.28,'sine',.18,190)},
 heart:t=>{[880,1175,1568,1760].forEach((f,i)=>tone(t+i*.07,f,.35,'sine',.1));noise(t,.4,.08,'highpass',6000,null,1)},
 space:t=>{tone(t,220,.9,'sine',.12,330);tone(t,330,.9,'sine',.08,495);noise(t,.8,.18,'bandpass',300,3000,3)},
 elec:t=>{tone(t,62,.6,'sawtooth',.1,58);for(let i=0;i<7;i++)noise(t+i*.07+Math.random()*.03,.05,.4,'highpass',2800,null,1);tone(t+.05,1800,.2,'square',.03,400)},
 wind:t=>{noise(t,1,.4,'bandpass',500,2200,2.5);noise(t+.3,.6,.2,'bandpass',1500,600,3)},
 water:t=>{noise(t,.9,.35,'lowpass',1000,300,1);for(let i=0;i<6;i++)tone(t+i*.11,400+Math.random()*700,.1,'sine',.08,1300)},
 ice:t=>{[2093,2637,3136].forEach((f,i)=>tone(t+i*.06,f,.4,'sine',.07));noise(t+.18,.09,.35,'highpass',4000,null,1);noise(t,.5,.12,'highpass',5000,9000,1)},
 light:t=>{tone(t,2600,.35,'sine',.12,500);tone(t+.04,5200,.25,'sine',.05,1200);noise(t,.3,.15,'highpass',6000,null,1)},
 grav:t=>{tone(t,130,1,'sine',.25,38);tone(t+.1,65,.9,'triangle',.12,40);noise(t,.9,.18,'lowpass',400,90,1)},
 quake:t=>{tone(t,46,1.2,'sine',.5,28);noise(t,1.2,.45,'lowpass',220,80,1);for(let i=0;i<5;i++)noise(t+.2+i*.15,.06,.2,'bandpass',900,null,2)},
 metal:t=>{for(let i=0;i<3;i++){tone(t+i*.11,820+i*90,.14,'square',.05);tone(t+i*.11,1230+i*120,.3,'triangle',.06)}},
 hand:t=>{for(let i=0;i<6;i++){noise(t+i*.07,.03,.3,'bandpass',1300,null,3);tone(t+i*.07,560+i*60,.07,'sine',.07,900)}},
 mochi:t=>{for(let i=0;i<3;i++){tone(t+i*.12,170,.24,'sine',.22,85);noise(t+i*.12,.12,.15,'lowpass',500,null,1)}},
 dark:t=>{tone(t,55,1.3,'sawtooth',.12,40);tone(t,58.5,1.3,'sawtooth',.1,42);noise(t,1.2,.3,'lowpass',90,900,1);tone(t+.3,1661,.9,'sine',.03,1600)},
 poison:t=>{noise(t,.9,.3,'lowpass',500,150,1);for(let i=0;i<7;i++)tone(t+i*.1,160+Math.random()*120,.12,'sine',.12,70)},
 string:t=>{for(let i=0;i<5;i++)tone(t+i*.06,900+i*130,.25,'triangle',.07,700+i*100);noise(t,.2,.15,'highpass',5000,null,1)},
 hit:t=>{tone(t,150,.25,'sine',.45,55);noise(t,.09,.35,'bandpass',1100,null,1)},
 hitH:t=>{tone(t,95,.5,'sine',.7,32);noise(t,.4,.45,'lowpass',700,120,1);noise(t,.1,.35,'bandpass',2200,null,1)},
 fall:t=>{tone(t,110,.32,'sine',.45,48);noise(t,.3,.35,'lowpass',420,120,1)},
 clash:t=>{noise(t,.28,.45,'highpass',3000,null,1);tone(t,1400,.5,'triangle',.08);tone(t,2110,.45,'triangle',.05)},
 win:t=>{[523,659,784,1047].forEach((f,i)=>tone(t+i*.12,f,.42,'triangle',.13))},
 draw:t=>{tone(t,392,.4,'triangle',.1);tone(t+.18,392,.5,'triangle',.08)},
 horn:t=>{tone(t,220,.6,'sawtooth',.07,230);tone(t,330,.6,'sawtooth',.05,335);noise(t,.15,.2,'bandpass',800,3000,1)},
 ent_admiral:t=>{tone(t+.3,52,1.3,'sine',.6,28);noise(t+.3,.9,.5,'lowpass',500,80,1);noise(t,.35,.2,'bandpass',400,2400,2)},
 ent_boss:t=>{noise(t,1.1,.3,'lowpass',180,900,1);tone(t,110,1.1,'sawtooth',.05,82);tone(t+.6,165,.6,'sine',.08)},
 ent_guardian:t=>{tone(t,48,1,'sine',.4,32);noise(t,1,.35,'lowpass',250,90,1);for(let i=0;i<6;i++)noise(t+.1+i*.13,.04,.25,'bandpass',1500,null,3)},
 ent_imu:t=>{tone(t,49,1.6,'sawtooth',.12,36);tone(t,51.5,1.6,'sawtooth',.1,38);tone(t+.4,1661,1.1,'sine',.04,1568);tone(t+.6,2217,.9,'sine',.03,2093);noise(t,1.5,.25,'lowpass',80,700,1)}
};
function snd(n){if(!API.soundOn()||!SND[n])return;const c=actx();if(!c)return;try{if(c.state==='suspended')c.resume().catch(()=>{});SND[n](c.currentTime+.02)}catch(e){}}
const ELEM={sword:'slash',fire:'fire',viol:'mochi',pink:'rubber',blue:'heart',navy:'space',orange:'wind',lilac:'hand',red:'metal',yellow:'kick',maroon:'water',
 akainu:'lava',kizaru:'light',fujitora:'grav',aokiji:'ice',shanks:'elec',wb:'quake',kaido:'quake',bm:'slash',hero:'punch',imu:'dark',moria:'dark',marco:'fire',magellan:'poison',neptune:'water',dofla:'string'};
const MELEM={trident:'slash',phase:'slash',rain:'water',spark:'elec',stormcloud:'elec',hail:'ice',firekick:'fire',firewheel:'fire',starkick:'fire',
 redcut:'slash',fireball:'fire',firebreath:'fire',pinkbolt:'elec',pinkstorm:'elec',flameburst:'fire',fireorbs:'fire',jab:'punch',combo:'punch',giantfist:'punch',
 tremorpunch:'punch',clubswing:'punch',bullcharge:'punch',flamingokick:'kick',tridentthrust:'slash'};

/* ---------- кто есть кто в игре ---------- */
const CHMAP={zoro:'sword',ace:'fire',kata:'viol',luffy:'pink',hancock:'blue',law:'navy',nami:'orange',robin:'lilac',kid:'red',sanji:'yellow',olesya:'maroon'};
const NPCMAP={akainu:'akainu',kizaru:'kizaru',fujitora:'fujitora',aokiji:'aokiji',shanks:'shanks',whitebeard:'wb',kaido:'kaido',bigmom:'bm',imu:'imu'};
const PIRL=['shanks','wb','kaido','bm'].flatMap(i=>BIGCH[i].l),PIRH=['shanks','wb','kaido','bm'].flatMap(i=>BIGCH[i].h);
const ADML=['akainu','kizaru','fujitora','aokiji'].flatMap(i=>BIGCH[i].l),ADMH=['akainu','kizaru','fujitora','aokiji'].flatMap(i=>BIGCH[i].h);
const DOZN=['Солдат дозора','Капитан дозора','Вице-адмирал дозора','Адмирал дозора','Герой дозора'],PIRN=['Простой пират','Капитан пиратов','Шичибукай','Великий пират','Правитель морей'];
function kit(id,extra){const b=CHARS[id]||BIGCH[id];return Object.assign({id,elem:ELEM[id]||'punch'},b,extra||{})}
function npcKit(ch,name){
 if(NPCMAP[ch])return kit(NPCMAP[ch]);
 if(CHMAP[ch])return kit(CHMAP[ch]);
 const nm=String(name||'');
 if(/^Эйс/.test(nm))return kit('fire',{sc:1.1,x:620});
 if(/Мория/.test(nm))return kit('moria');
 if(/^Марко/.test(nm))return kit('marco');
 if(/Магеллан/.test(nm))return kit('magellan');
 if(/Нептун/.test(nm))return kit('neptune');
 if(/Дофламинго/.test(nm))return kit('dofla');
 let lv=DOZN.indexOf(nm);
 if(lv===4)return kit('hero');
 if(lv===3)return {id:'admpool',elem:'light',name:nm,col:'#dfe8f2',glow:'200,220,255',sc:1.3,x:650,bg:'admiral',ent:'admiral',l:ADML,h:ADMH};
 if(lv>=0)return kit('hero',{name:nm,col:'#9fc4ff',glow:'159,196,255',sc:1+.07*lv,x:610+12*lv,bg:'',ent:''});
 lv=PIRN.indexOf(nm);
 if(lv===4)return {id:'pirate5',elem:'slash',col:'#b06bff',glow:'176,107,255',sc:1.4,x:655,bg:'boss',ent:'boss',l:PIRL,h:PIRH};
 if(lv>=0)return {id:'pirate',elem:'slash',col:'#c98bff',glow:'201,139,255',sc:1+.07*lv,x:610+12*lv,bg:'',ent:'',l:PIRL,h:PIRH};
 return {id:'unique',elem:'slash',col:'#e0a24a',glow:'224,162,74',sc:1.3,x:650,bg:'boss',ent:'boss',l:PIRL,h:PIRH};
}

/* ---------- бойцы на сцене ---------- */
let FELL=[false,false],LF=[],RF=null,LIVES=[2,2],WN=2,RNG=Math.random,CFG=null;
const GAP=F=>Math.abs(((F&&F.tgt)||F||{home:0}).home-((F&&F.home)||0));
function mkF(k,x,dir,sc){const g=document.createElementNS(NS,'g');g.setAttribute('class','ds-rim');g.style.setProperty('--g','rgba('+k.glow+',.6)');$('figs').appendChild(g);
 const F=new Fighter(g,x,dir,k.col);F.sc=sc;F.kit=k;F.last=null;if(k.sword)attachSword(F,k.swordLen||80);if(k.crown)attachCrown(F);if(k.fill){F.inner.querySelectorAll('[stroke="#0d1118"]').forEach(e=>e.setAttribute('stroke',k.fill));F.inner.querySelectorAll('[fill="#0d1118"]').forEach(e=>e.setAttribute('fill',k.fill))}if(k.tail)attachTail(F,k.col);if(k.trident)attachTrident(F);if(k.band){F.band.setAttribute('stroke',k.band);F.band.setAttribute('stroke-width',7)}return F}
function lay(n){return n<=1?{xs:[350],sc:1}:n===2?{xs:[365,255],sc:.92}:n===3?{xs:[372,282,192],sc:.86}:{xs:[378,300,222,144],sc:.8}}
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function pick(F,heavy){const all=F.kit[heavy?'h':'l'];let grp=all.filter(k=>k!==F.last);if(!grp.length)grp=all;const m=grp[Math.floor(RNG()*grp.length)];F.last=m;return m}
function pips(i){const n=i===1?LIVES[0]:LIVES[1];$('p'+i).innerHTML=Array.from({length:WN},(_,k)=>'<i class="ds-pip'+(k>=n?' ds-off':'')+'"></i>').join('')}
function setSide(i,name,col,glow){$('n'+i).textContent=name;$('h'+i).style.setProperty('--c',col);$('h'+i).style.setProperty('--g','rgba('+glow+',.55)')}
async function banner(t,sub,col){const b=$('banner'),s=$('sub');b.textContent=t;b.style.color=col||'#fff';s.textContent=sub||'';
  run(380,k=>{const e=E.back(k);b.style.opacity=Math.min(1,k*3);b.style.transform='scale('+(.6+.4*e)+')'});if(sub)run(400,k=>s.style.opacity=k)}
async function hideBanner(){await run(250,k=>{$('banner').style.opacity=1-k;$('sub').style.opacity=1-k})}
function label(i,txt){const a=$('ab'+i);a.textContent=txt;a.style.opacity=txt?1:0}

async function attack(F,T,abil){
  F.tgt=T;const A=ABIL[abil]||ABIL.none;
  if(A.pre){
    await A.pre(F,T);
    if(A.fx){await A.fx(F,T)}else{await F.to('windup',160,E.in,{dx:-24});F.to('punch',150,E.in,{dx:GAP(F)-135});const tr=setInterval(()=>A.trail&&A.trail(F),30/speed);await sleep(150);clearInterval(tr)}
  }else{await F.to('windup',230,E.out);await F.to('punch',120,E.in,{dx:GAP(F)-120*F.sc})}
  return {big:true,col:A.col||'#ffe9a8'}
}
async function react(T,info,fall){
  hitFx(T,info.col,true);
  if(fall){
    await T.to('hit',120,E.out,{dx:-50,rot:-10});
    await T.to('hit',420,E.out,{dx:-120,dy:-70,rot:-52,t:-40});
    await T.to('lie',430,E.in,{dx:-150,dy:0,rot:-92});
    shake();snd('fall');burst(T.W('pel').x,GROUND-6,10,'#c9a574',.7);
    await T.to('lie',260,E.bounce,{dx:-154,rot:-90});
  }else{await T.to('hit',90,E.out,{dx:-55});await sleep(120);await T.to('stagger',260,E.out,{dx:-30})}
}
async function entrance(F,k){const g=F.g,X=F.home;
 if(k==='admiral'){snd('ent_admiral');F.idle=false;F.pose=Object.assign({},POSE.guard,{dy:-460});await sleep(150);await F.to('guard',380,E.in,{dy:0});shake();flash(.4);
   groundRings(X,'#fff','#fff',280);burst(X,GROUND-6,40,'#d9c39a',1.8);await F.to('guard',300,E.out);F.rest()}
 else if(k==='phoenix'){snd('fire');F.idle=false;F.pose=Object.assign({},POSE.guard,{dy:-420});const wg=[0,1].map(()=>{const g=el('g',{});SH.bwing(g,{});return g});
   await run(700,t=>{const k2=E.out(t);F.pose=Object.assign({},POSE.guard,{dy:-420*(1-k2)});const s=F.W('sh');wg[0].setAttribute('transform',`translate(${s.x},${s.y}) scale(${F.dir*F.sc},${F.sc})`);wg[1].setAttribute('transform',`translate(${s.x},${s.y}) scale(${-F.dir*F.sc*.8},${F.sc*.8})`);if(Math.random()<.8)tdot(s.x+R_(-30,30),s.y+R_(-30,30),'#5fd0ff',7)});
   flash(.3);ring(X,GROUND-60,'#5fd0ff',160);await run(300,t=>wg.forEach(g=>g.setAttribute('opacity',1-t)));wg.forEach(g=>g.remove());F.rest()}
 else if(k==='sea'){snd('water');F.idle=false;F.pose=Object.assign({},POSE.guard,{dy:320});let cl=$('stage').querySelector('#ds_clipE');if(!cl){const d=$('stage').querySelector('defs');cl=document.createElementNS(NS,'clipPath');cl.id='ds_clipE';const r=document.createElementNS(NS,'rect');r.setAttribute('x',0);r.setAttribute('y',0);r.setAttribute('width',960);r.setAttribute('height',GROUND+4);cl.appendChild(r);d.appendChild(cl)}
   g.setAttribute('clip-path','url(#ds_clipE)');const col=el('rect',{x:X-60,y:GROUND,width:120,height:0,rx:40,fill:'url(#seaG)',opacity:.9,filter:'drop-shadow(0 0 12px #4fb6ff)'},fxB);
   run(500,t=>{const h=360*E.out(t);col.setAttribute('y',GROUND-h);col.setAttribute('height',h)});for(let i=0;i<10;i++)burst(X-60+i*13,GROUND,5,'#bfeaff',.9);
   await F.to('guard',800,E.out,{dy:0});g.removeAttribute('clip-path');await run(400,t=>{col.setAttribute('opacity',.9*(1-t))});col.remove();flash(.25);F.rest()}
 else if(k==='strings'){snd('string');F.idle=false;F.pose=Object.assign({},POSE.guard,{dy:-470,fu:172,fb:0,bu:172,bb:0});const th=threads([[()=>({x:X-40,y:0}),()=>F.W('fh')],[()=>({x:X+40,y:0}),()=>F.W('bh')],[()=>({x:X,y:0}),()=>F.W('head')]]);
   await F.to('guard',1100,E.out,{dy:-40,fu:172,fb:0,bu:172,bb:0});await F.to('guard',220,E.in,{dy:0});th.cut();shake();burst(X,GROUND-6,20,'#ff9ac8',1.2);F.rest()}
 else if(k==='boss'){snd('ent_boss');g.style.opacity=0;F.x=X+170;const fog=[];for(let i=0;i<14;i++)fog.push(el('circle',{cx:X+60+Math.random()*150,cy:GROUND-30-Math.random()*110,r:30+Math.random()*34,fill:(F.kit.fog||'#8a93b8'),opacity:0,filter:'blur(14px)'},fxB));
   await run(1100,t=>{g.style.opacity=Math.min(1,t*1.6);F.x=X+170*(1-E.out(t));fog.forEach(f=>f.setAttribute('opacity',(t<.5?t*1.2:(1-t)*1.2)*.8))});fog.forEach(f=>f.remove());g.style.opacity=1;F.x=X;F.rest()}
 else if(k==='guardian'){snd('ent_guardian');F.idle=false;F.pose=Object.assign({},POSE.guard,{dy:320});let cl=$('stage').querySelector('#ds_clipE');if(!cl){const d=$('stage').querySelector('defs');cl=document.createElementNS(NS,'clipPath');cl.id='ds_clipE';const r=document.createElementNS(NS,'rect');r.setAttribute('x',0);r.setAttribute('y',0);r.setAttribute('width',960);r.setAttribute('height',GROUND+4);cl.appendChild(r);d.appendChild(cl)}
   g.setAttribute('clip-path','url(#ds_clipE)');flash(.25);shake();for(let i=0;i<8;i++)burst(X-60+i*17,GROUND,6,'#9aa8a8',.8);
   const cr=el('path',{d:'M '+(X-110)+' '+(GROUND+4)+' l 40 -8 l 30 10 l 40 -12 l 30 8 l 40 -6',fill:'none',stroke:'#7ff2dc','stroke-width':4,filter:'drop-shadow(0 0 8px #4fd1c5)'});
   await F.to('guard',800,E.out,{dy:0});g.removeAttribute('clip-path');run(400,t=>{cr.setAttribute('opacity',1-t);if(t>=1)cr.remove()});F.rest()}
 else if(k==='imu'){snd('ent_imu');g.style.opacity=0;const rg=[0,1,2].map(()=>el('ellipse',{cx:X,cy:GROUND,rx:10,ry:3,fill:'none',stroke:'#ff3a56','stroke-width':5,opacity:0},fxB));
   await run(1500,t=>{g.style.opacity=t<.3?0:Math.min(1,(Math.sin(t*60)>0?1:.35)*Math.min(1,(t-.3)*2));rg.forEach((e,i)=>{const u=Math.max(0,Math.min(1,t*1.6-i*.3));e.setAttribute('rx',10+220*E.out(u));e.setAttribute('ry',3+32*E.out(u));e.setAttribute('opacity',u>0&&u<1?.8*(1-u):0)})});
   rg.forEach(e=>e.remove());g.style.opacity=1;flash(.35);shake();F.rest()}
}
function clear(){for(const F of [...LF,RF])if(F)F.destroy();LF=[];RF=null;fxB.innerHTML='';fxF.innerHTML='';$('figs').innerHTML='';label(1,'');label(2,'');$('banner').style.opacity=0;$('sub').style.opacity=0;ROOT.classList.remove('ds-fast','ds-shake')}
function elemOf(F,m){return MELEM[m]||F.kit.elem||'punch'}

/* ---------- публичное API ---------- */
const API={
 el:ROOT,
 soundOn:()=>true,
 kits:{CHARS,BIGCH},
 open(cfg){
  if(!document.getElementById('ds_css')){const s=document.createElement('style');s.id='ds_css';s.textContent=CSS;document.head.appendChild(s)}
  stopClock();clear();startClock();speed=cfg.fast?8:1;ROOT.classList.toggle('ds-fast',!!cfg.fast);
  CFG=cfg;FELL=[false,false];WN=cfg.W||2;LIVES=[WN,WN];RNG=mulberry((cfg.seed|0)||1);
  const R=cfg.R,L=cfg.L;ROOT.dataset.bg=R.bg||'';
  const ly=lay(L.length);
  for(let i=L.length-1;i>=0;i--){const F=mkF(L[i],ly.xs[i],1,ly.sc);LF[i]=F}
  RF=mkF(R,R.x||610,-1,R.sc||1);
  for(const F of LF)F.tgt=RF;RF.tgt=LF[0];
  setSide(1,cfg.nameL||'',L[0].col,L[0].glow);setSide(2,cfg.nameR||'',R.col,R.glow);pips(1);pips(2);
  return API},
 async intro(){const R=RF.kit;await entrance(RF,R.ent||'');snd('horn');
  await banner(R.ent?String(CFG.nameR||'').toUpperCase():'ДУЭЛЬ!',(CFG.nameL||'')+'  vs  '+(CFG.nameR||''),'#ffd45a');await sleep(1000);await hideBanner()},
 /* o: {out:0|1|-1, margin, fall:bool} */
 async round(o){
  if(!RF)return;
  if(o.out===-1){
   const A=LF[0],B=RF;
   await Promise.all([A.to('windup',200),B.to('windup',200),...LF.slice(1).map(F=>F.to('charge',200))]);
   await Promise.all([A.to('punch',120,E.in,{dx:GAP(A)/2-100*A.sc}),B.to('punch',120,E.in,{dx:GAP(B)/2-100*B.sc})]);
   const m={x:(A.home+B.home)/2,y:GROUND-150};snd('clash');flash(.5);ring(m.x,m.y,'#fff',120);burst(m.x,m.y,22,'#fff3c4',1.4);shake();
   await banner('НИЧЬЯ','удары столкнулись — раунд никому','#cfd8e3');await sleep(650);
   await Promise.all([...LF,RF].map(F=>F.to('stagger',320,E.out,{dx:-30})));await hideBanner();
   await Promise.all([...LF,RF].map(F=>F.to('guard',360,E.io,{dx:0})));[...LF,RF].forEach(F=>F.rest());
   return}
  const leftWins=o.out===0,W=leftWins?LF:[RF],T=leftWins?RF:LF[0],losers=leftWins?[RF]:LF;
  const heavy=(o.margin||0)>=4,moves=W.map(F=>pick(F,heavy));
  const nm=moves.map(m=>(ABIL[m]||ABIL.none).n);label(leftWins?1:2,nm.length>2?nm.slice(0,2).join(' + ')+' …':nm.join(' + '));
  if(speed<=1)snd(elemOf(W[0],moves[0]));
  const infos=await Promise.all(W.map((F,i)=>sleep(i*160).then(()=>attack(F,T,moves[i]))));
  snd(heavy||o.fall?'hitH':'hit');
  if(o.fall)FELL[leftWins?1:0]=true;
  if(leftWins)LIVES[1]=Math.max(0,LIVES[1]-1);else LIVES[0]=Math.max(0,LIVES[0]-1);pips(1);pips(2);
  await Promise.all([...losers.map((F,i)=>sleep(i*60).then(()=>react(F,infos[0],o.fall))),...W.map(F=>sleep(220).then(()=>F.to('guard',420,E.io,{dx:0})))]);
  label(1,'');label(2,'');W.forEach(F=>{F.x=F.home;F.rest()});
  if(!o.fall)await Promise.all(losers.map(F=>F.to('guard',420,E.io,{dx:0}).then(()=>F.rest())));
 },
 async finish(winner,title){
  if(!RF)return;
  if((winner===0||winner===1)&&!FELL[1-winner]){FELL[1-winner]=true;const Lo=winner===0?[RF]:LF;await Promise.all(Lo.map((F,i)=>sleep(i*60).then(()=>react(F,{col:'#ffffff'},true))))}
  if(winner===0||winner===1){const W=winner===0?LF:[RF];snd('win');W.forEach(F=>F.idle=false);
   await Promise.all(W.map(F=>F.to('win',420,E.back,{dy:-34})));await Promise.all(W.map(F=>F.to('win',260,E.bounce,{dy:0})))}
  else snd('draw');
  await banner(title||'','','#ffd45a');await sleep(900)},
 fast(on){speed=on?8:1;ROOT.classList.toggle('ds-fast',!!on)},
 get isFast(){return speed>1},
 close(){stopClock();clear();if(ROOT.parentNode)ROOT.parentNode.removeChild(ROOT);CFG=null},
 /* сборка конфигурации из результата runDuel игры */
 fromRes(res,names,o){o=o||{};
  const s0=res.st[0].s,s1=res.st[1].s;
  const team=s0.ps&&s0.ps.length>1?s0.ps:null;
  const L=team?team.map(p=>kit(CHMAP[p.ch]||'sword')):[kit(CHMAP[s0.ch]||'sword')];
  const R=s1.p?kit(CHMAP[s1.ch]||'fire',{sc:1,x:610,bg:'',ent:''}):npcKit(s1.ch,s1.name||names[1]);
  let seed=7;for(const r of res.rounds)for(const c of r.cur)seed=(seed*31+(c.roll|0)*7+(c.att|0))|0;
  return {L,R,nameL:team?team.map(p=>p.name).join(' + '):names[0],nameR:names[1],W:res.W||2,seed,fast:!!o.fast}},
 /* сценарий раундов: кто кого и кто падает */
 plan(res){const n=res.rounds.length;return res.rounds.map((R,i)=>{const out=R.out;const margin=out>=0?Math.abs((R.sc[out]|0)-(R.sc[1-out]|0)):0;
  return {out,margin,fall:i===n-1&&out>=0&&res.winner===out}})},
 _t:{ABIL,LF:()=>LF,RF:()=>RF,attack,snd,SND,run,sleep}
};
window.DuelScene=API;
})();
