/* ============================================================
   淨明宗-不知山房  v13  extras.js
   修持（電子木魚/玉磬、打坐靜功）、每日一言、萬年曆黃曆增強
   純本機運算：WebAudio 合成音聲、localStorage 存檔、lunar.js 農曆
   ============================================================ */
(function(){
'use strict';

/* ---------- 六十甲子值年太歲（白雲觀元辰殿通行本） ---------- */
var GAN=['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
var ZHI=['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
var TAISUI_NAMES=['金辨','陳材','耿章','沈興','趙達','郭燦','王濟','李素','劉旺','康志',
 '施廣','任保','郭嘉','汪文','魯先','龍仲','董德','鄭但','陸明','魏仁',
 '方傑','蔣崇','白敏','封濟','鄒鐺','傅佑','鄔桓','范寧','彭泰','徐單',
 '章詞','楊仙','管仲','唐傑','姜武','謝壽','盧秘','楊信','賀諤','皮時',
 '李誠','吳遂','文哲','繆丙','徐浩','程寶','倪秘','葉堅','丘德','朱得',
 '張朝','萬清','辛亞','楊彥','黎卿','傅黨','毛梓','石政','洪充','虞程'];
function ganzhiIndex(gz){
  var g=gz.charAt(0),z=gz.charAt(1);
  var gi=GAN.indexOf(g),zi=ZHI.indexOf(z);
  if(gi<0||zi<0)return -1;
  for(var i=0;i<60;i++){ if(i%10===gi&&i%12===zi) return i; }
  return -1;
}
function getTaisui(gz){
  var i=ganzhiIndex(gz);
  return i<0?null:{gz:gz,name:TAISUI_NAMES[i]+'大將軍'};
}

/* ---------- 簡轉繁（僅覆蓋 lunar 黃曆術語動態用字） ---------- */
var S2T={"东":"東","丧":"喪","为":"為","乌":"烏","习":"習","乡":"鄉","于":"於","亏":"虧","杀":"殺","伤":"傷","产":"產","亲":"親","仓":"倉","会":"會","佣":"傭","傩":"儺","养":"養","兽":"獸","冻":"凍","凉":"涼","剑":"劍","动":"動","医":"醫","华":"華","厉":"厲","厕":"廁","参":"參","发":"發","启":"啟","坏":"壞","坚":"堅","坟":"墳","墙":"牆","声":"聲","处":"處","头":"頭","娄":"婁","学":"學","宁":"寧","宾":"賓","寝":"寢","寿":"壽","尝":"嘗","帐":"帳","带":"帶","并":"並","庙":"廟","开":"開","张":"張","强":"強","归":"歸","执":"執","扫":"掃","挚":"摯","敌":"敵","斋":"齋","断":"斷","无":"無","时":"時","晓":"曉","机":"機","来":"來","杨":"楊","桥":"橋","梁":"樑","泽":"澤","涂":"塗","润":"潤","涧":"澗","渐":"漸","渔":"漁","温":"溫","满":"滿","灯":"燈","灶":"竈","灾":"災","炉":"爐","猎":"獵","猪":"豬","獭":"獺","电":"電","疮":"瘡","盖":"蓋","祸":"禍","种":"種","竖":"豎","筑":"築","纳":"納","织":"織","经":"經","结":"結","绘":"繪","络":"絡","网":"網","肃":"肅","肠":"腸","胜":"勝","腊":"臘","艺":"藝","节":"節","药":"藥","莲":"蓮","萤":"螢","虫":"蟲","蚁":"蟻","蛰":"蟄","蜡":"蠟","蝈":"蟈","蝉":"蟬","蝼":"螻","补":"補","见":"見","观":"觀","订":"訂","讼":"訟","词":"詞","诸":"諸","谢":"謝","负":"負","财":"財","货":"貨","贶":"貺","车":"車","轸":"軫","还":"還","进":"進","远":"遠","酱":"醬","针":"針","钏":"釧","钗":"釵","钻":"鑽","锋":"鋒","长":"長","门":"門","闭":"閉","问":"問","闰":"閏","阳":"陽","阴":"陰","难":"難","雳":"靂","顺":"順","颠":"顛","风":"風","饰":"飾","马":"馬","驱":"驅","驿":"驛","鱼":"魚","鸟":"鳥","鸠":"鳩","鸡":"雞","鸣":"鳴","鸿":"鴻","鹊":"鵲","鹖":"鶡","鹰":"鷹","麦":"麥","黄":"黃","龙":"龍","惊":"驚","毕":"畢","气":"氣","残":"殘","殓":"殮"};
function s2t(s){if(s===null||s===undefined)return s;return String(s).split('').map(function(c){return S2T[c]||c;}).join('');}

/* ---------- 每日一言（《道德經》為主，兼收淨明、清靜、感應） ---------- */
var DAILY_WORDS=[
 {zh:'道可道，非常道；名可名，非常名。',en:'The Tao that can be told is not the eternal Tao; the name that can be named is not the eternal name.',src:'《道德經》第一章'},
 {zh:'上善若水。水善利萬物而不爭。',en:'The highest good is like water, which benefits all things and does not contend.',src:'《道德經》第八章'},
 {zh:'知人者智，自知者明。勝人者有力，自勝者強。',en:'He who knows others is wise; he who knows himself is enlightened. He who conquers others is strong; he who conquers himself is mighty.',src:'《道德經》第三十三章'},
 {zh:'禍兮福之所倚，福兮禍之所伏。',en:'Misfortune is what fortune depends upon; fortune is where misfortune hides.',src:'《道德經》第五十八章'},
 {zh:'大音希聲，大象無形。',en:'The greatest sound is silent; the greatest form is shapeless.',src:'《道德經》第四十一章'},
 {zh:'道生一，一生二，二生三，三生萬物。',en:'The Tao gives birth to One, One to Two, Two to Three, and Three to the ten thousand things.',src:'《道德經》第四十二章'},
 {zh:'人法地，地法天，天法道，道法自然。',en:'Humanity follows the earth, the earth follows heaven, heaven follows the Tao, and the Tao follows what is so of itself.',src:'《道德經》第二十五章'},
 {zh:'千里之行，始於足下。',en:'A journey of a thousand miles begins beneath one\u2019s feet.',src:'《道德經》第六十四章'},
 {zh:'合抱之木，生於毫末；九層之臺，起於累土。',en:'A tree you can barely embrace grows from a tiny shoot; a tower of nine storeys rises from a heap of earth.',src:'《道德經》第六十四章'},
 {zh:'天下大事，必作於細；天下難事，必作於易。',en:'Great affairs are made of small details; hard things are done through easy steps.',src:'《道德經》第六十三章'},
 {zh:'知足不辱，知止不殆，可以長久。',en:'Contentment brings no disgrace; knowing when to stop brings no danger\u2014thus enduring long.',src:'《道德經》第四十四章'},
 {zh:'為學日益，為道日損。',en:'In learning, every day something is added; in the Way, every day something is dropped.',src:'《道德經》第四十八章'},
 {zh:'清靜為天下正。',en:'Clarity and stillness are the measure of all under heaven.',src:'《道德經》第四十五章'},
 {zh:'飄風不終朝，驟雨不終日。',en:'A gale does not last the morning, a downpour does not last the day.',src:'《道德經》第二十三章'},
 {zh:'上德若谷，大白若辱，廣德若不足。',en:'The highest virtue seems empty as a valley; the purest white seems dim; abundant virtue seems insufficient.',src:'《道德經》第四十一章'},
 {zh:'慎終如始，則無敗事。',en:'Attend the end as carefully as the beginning, and nothing will be ruined.',src:'《道德經》第六十四章'},
 {zh:'夫唯不爭，故天下莫能與之爭。',en:'Because he does not contend, no one under heaven can contend with him.',src:'《道德經》第二十二章'},
 {zh:'靜為躁君，重為輕根。',en:'Stillness rules over motion; gravity is the root of lightness.',src:'《道德經》第二十六章'},
 {zh:'我有三寶，持而保之：一曰慈，二曰儉，三曰不敢為天下先。',en:'I have three treasures, held fast and guarded: the first is compassion, the second frugality, the third not presuming to be first.',src:'《道德經》第六十七章'},
 {zh:'天道無親，常與善人。',en:'The Way of heaven has no favourites; it is always with the good.',src:'《道德經》第七十九章'},
 {zh:'天網恢恢，疏而不失。',en:'Heaven\u2019s net is vast and wide; its meshes are loose, yet nothing slips through.',src:'《道德經》第七十三章'},
 {zh:'柔弱勝剛強。',en:'The soft and weak overcome the hard and strong.',src:'《道德經》第三十六章'},
 {zh:'天下之至柔，馳騁天下之至堅。',en:'The softest thing under heaven rides over the hardest.',src:'《道德經》第四十三章'},
 {zh:'為無為，則無不治矣。',en:'Act by non-action, and nothing will be left ungoverned.',src:'《道德經》第三章'},
 {zh:'見素抱樸，少私寡欲。',en:'Manifest plainness, embrace simplicity; lessen self, diminish desire.',src:'《道德經》第十九章'},
 {zh:'居善地，心善淵，與善仁，言善信。',en:'In dwelling, value the ground; in the heart, value depth; in giving, kindness; in speech, good faith.',src:'《道德經》第八章'},
 {zh:'信言不美，美言不信。',en:'Truthful words are not fine; fine words are not truthful.',src:'《道德經》第八十一章'},
 {zh:'天之道，利而不害；聖人之道，為而不爭。',en:'The Way of heaven benefits and does not harm; the way of the sage acts and does not contend.',src:'《道德經》第八十一章'},
 {zh:'致虛極，守靜篤。',en:'Attain the utmost emptiness; hold fast to steadfast stillness.',src:'《道德經》第十六章'},
 {zh:'夫物芸芸，各復歸其根。歸根曰靜，靜曰復命。',en:'All things rise and flourish, then each returns to its root. Returning to the root is stillness; this is called returning to destiny.',src:'《道德經》第十六章'},
 {zh:'人能常清靜，天地悉皆歸。',en:'When one can remain ever pure and still, heaven and earth both return.',src:'《太上老君說常清靜經》'},
 {zh:'常清靜，漸入真道。',en:'Ever pure and still, one gradually enters the true Way.',src:'《太上老君說常清靜經》'},
 {zh:'欲修仙道，先修人道。',en:'Before cultivating the way of immortality, first cultivate the way of being human.',src:'《淨明忠孝全書》'},
 {zh:'方寸淨明，天君泰然。',en:'When the heart\u2019s square inch is pure and bright, the spirit within is at peace.',src:'《淨明道法》'},
 {zh:'禍福無門，惟人自召；善惡之報，如影隨形。',en:'Fortune and misfortune have no gate but what people themselves open; the return of good and evil follows like a shadow.',src:'《太上感應篇》'},
 {zh:'積善之家，必有餘慶；積不善之家，必有餘殃。',en:'A house that stores up good abounds in blessing; a house that stores up ill abounds in sorrow.',src:'《周易·坤·文言》'}
];
function dayOfYear(d){var s=new Date(d.getFullYear(),0,0);return Math.floor((d-s)/86400000);}
function getDailyWord(){var d=new Date();return DAILY_WORDS[dayOfYear(d)%DAILY_WORDS.length];}
function renderDailyWord(){
  var box=document.getElementById('dailyWord');if(!box)return;
  try{
    var w=getDailyWord();
    box.innerHTML='<div class="dw-quote">'+w.zh+'</div>'+
      '<div class="dw-en">'+w.en+'</div>'+
      '<div class="dw-src"><span class="dw-seal">言</span>'+w.src+'</div>';
  }catch(e){if(window&&window.console)console.error('dailyWord',e);}
}

/* ---------- 日期工具 ---------- */
function ymd(d){function p(n){return (n<10?'0':'')+n;}return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate());}
function vibrate(ms){if(navigator&&navigator.vibrate){try{navigator.vibrate(ms);}catch(e){}}}

/* ============================================================
   電子木魚 / 玉磬（WebAudio 即時合成，零音頻檔，可離線）
   ============================================================ */
var AC=null, INSTR='muyu';
function audioCtx(){
  if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)();}catch(e){AC=null;}}
  if(AC&&AC.state==='suspended'){AC.resume();}
  return AC;
}
function noiseBuf(c,dur){
  var b=c.createBuffer(1,Math.floor(c.sampleRate*dur),c.sampleRate),d=b.getChannelData(0);
  for(var i=0;i<d.length;i++){d[i]=(Math.random()*2-1)*(1-i/d.length);}
  return b;
}
/* 殿堂混響（convolver，磬多送、木魚少送，增莊嚴而不糊） */
var REV=null;
function reverbSend(c){
  if(REV)return REV;
  var rate=c.sampleRate,len=Math.floor(rate*3.2),imp=c.createBuffer(2,len,rate);
  for(var ch=0;ch<2;ch++){var d=imp.getChannelData(ch);
    for(var i=0;i<len;i++){var tt=i/len;d[i]=(Math.random()*2-1)*Math.pow(1-tt,2.7)*(ch?0.7:1);}}
  var conv=c.createConvolver();conv.buffer=imp;
  var trim=c.createGain();trim.gain.value=0.85;conv.connect(trim);trim.connect(c.destination);
  REV={node:conv};return REV;
}
/* 木魚：沉實厚穩的「叩」，木質瞬態＋腔體共振 */
function playMuyu(){
  var c=audioCtx();if(!c)return;var t=c.currentTime;
  var send=c.createGain();send.gain.value=0.13;send.connect(reverbSend(c).node);
  function tone(type,f0,f1,peak,dec,bend){
    var o=c.createOscillator(),g=c.createGain();o.type=type;
    if(f1){o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f1,t+bend);}else{o.frequency.value=f0;}
    g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+0.005);g.gain.exponentialRampToValueAtTime(0.0001,t+dec);
    o.connect(g);g.connect(c.destination);g.connect(send);o.start(t);o.stop(t+dec+0.05);
  }
  tone('sine',248,126,0.92,0.32,0.12);
  tone('sine',118,null,0.42,0.24,0.12);
  tone('triangle',420,360,0.30,0.15,0.08);
  function click(fr,q,peak,dur){
    var n=c.createBufferSource();n.buffer=noiseBuf(c,dur+0.02);
    var bp=c.createBiquadFilter();bp.type='bandpass';bp.frequency.value=fr;bp.Q.value=q;
    var ng=c.createGain();ng.gain.setValueAtTime(peak,t);ng.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    n.connect(bp);bp.connect(ng);ng.connect(c.destination);n.start(t);n.stop(t+dur+0.02);
  }
  click(2100,1.4,0.55,0.05);
  click(900,1.1,0.5,0.06);
  vibrate(14);
}
/* 玉磬（銅磬）：沉穩基音＋低頻嗡鳴＋綿長餘韻 */
function playQing(){
  var c=audioCtx();if(!c)return;var t=c.currentTime,base=468;
  var send=c.createGain();send.gain.value=0.55;send.connect(reverbSend(c).node);
  var n=c.createBufferSource();n.buffer=noiseBuf(c,0.14);
  var bp=c.createBiquadFilter();bp.type='bandpass';bp.frequency.value=base*6;bp.Q.value=9;
  var ng=c.createGain();ng.gain.setValueAtTime(0.16,t);ng.gain.exponentialRampToValueAtTime(0.0001,t+0.4);
  n.connect(bp);bp.connect(ng);ng.connect(c.destination);n.start(t);n.stop(t+0.42);
  var partials=[[0.5,0.45,6.5],[1,1,6.2],[2.0,0.48,5.4],[2.74,0.3,4.4],[3.0,0.2,3.6],[4.16,0.13,3.0],[5.4,0.07,2.4],[6.9,0.04,1.8]];
  partials.forEach(function(p){
    var o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.value=base*p[0];
    g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.24*p[1],t+0.014);g.gain.exponentialRampToValueAtTime(0.0001,t+p[2]);
    o.connect(g);g.connect(c.destination);g.connect(send);o.start(t);o.stop(t+p[2]+0.1);
  });
  vibrate(24);
}
function hitInstrument(){
  if(INSTR==='qing'){playQing();}else{playMuyu();}
  var today=ymd(new Date());
  try{
    var k=INSTR;
    localStorage.setItem('jm_'+k+'_total',(parseInt(localStorage.getItem('jm_'+k+'_total')||'0',10)+1));
    localStorage.setItem('jm_hit_'+today,(parseInt(localStorage.getItem('jm_hit_'+today)||'0',10)+1));
  }catch(e){}
  updateInstCount();animatePad();
}
function switchInstrument(k){
  INSTR=k;
  var btns=document.querySelectorAll('.inst-switch button');
  btns.forEach(function(b){b.classList.toggle('on',b.dataset.inst===k);});
  var pad=document.getElementById('instPad');if(pad){pad.classList.toggle('is-qing',k==='qing');}
  var name=document.getElementById('instName');if(name){name.textContent=k==='qing'?'玉磬':'木魚';}
  var en=document.getElementById('instNameEn');if(en){en.textContent=k==='qing'?'Jade Qing Bowl':'Wooden Fish';}
  updateInstCount();
}
function updateInstCount(){
  var totEl=document.getElementById('instTotal'),dayEl=document.getElementById('instToday');
  var today=ymd(new Date());
  try{
    if(totEl)totEl.textContent=localStorage.getItem('jm_'+INSTR+'_total')||'0';
    if(dayEl)dayEl.textContent=localStorage.getItem('jm_hit_'+today)||'0';
  }catch(e){}
}
function animatePad(){var pad=document.getElementById('instPad');if(!pad)return;pad.classList.remove('hit');void pad.offsetWidth;pad.classList.add('hit');}
function resetInstrument(){
  if(!window.confirm)return;
  if(window.confirm('確定將今日與累計擊數清零？此操作不可復原。')){
    try{
      ['muyu','qing'].forEach(function(k){localStorage.removeItem('jm_'+k+'_total');});
      Object.keys(localStorage).forEach(function(key){if(key.indexOf('jm_hit_')===0)localStorage.removeItem(key);});
    }catch(e){}
    updateInstCount();
  }
}

/* ============================================================
   打坐靜功計時（吸‑止‑呼引導、磬聲收功、子午流注提示）
   ============================================================ */
var ZUO={running:false,secLeft:0,done:0,totalMin:30,timer:null,phase:0,phaseLeft:0,raf:null,startTs:0};
var BREATH=[{n:'吸',en:'Inhale',s:4},{n:'止',en:'Hold',s:2},{n:'呼',en:'Exhale',s:6}];
var SHICHEN={
 '子':{org:'膽經',tip:'子時一陽初生，膽經當令，乃打坐養陽之佳時，宜早睡靜守。'},
 '丑':{org:'肝經',tip:'丑時肝經當令，血歸於肝，宜深眠養血，不主用功。'},
 '寅':{org:'肺經',tip:'寅時平旦，肺經當令，氣血由靜轉動，為晨起打坐之良辰。'},
 '卯':{org:'大腸經',tip:'卯時大腸經當令，天門開，宜晨起、叩齒、咽津、舒展。'},
 '辰':{org:'胃經',tip:'辰時胃經當令，宜進早齋，餐後少憩再坐。'},
 '巳':{org:'脾經',tip:'巳時脾經當令，运化正旺，精神飽滿，可誦經靜坐。'},
 '午':{org:'心經',tip:'午時一陰初生，心經當令，宜子午靜坐、小憩養心，勿過勞。'},
 '未':{org:'小腸經',tip:'未時小腸經當令，宜分清泌濁、從容午休。'},
 '申':{org:'膀胱經',tip:'申時膀胱經當令，水道通調，宜飲水、經行、晚課。'},
 '酉':{org:'腎經',tip:'酉時腎經當令，宜收心藏精、靜坐納氣，勿妄動。'},
 '戌':{org:'心包經',tip:'戌時心包經當令，百脈調暢，宜散步、誦經、早課溫養。'},
 '亥':{org:'三焦經',tip:'亥時三焦通達，百脈歸寧，宜準備就寢、安神入靜。'}
};
function shichenOf(h){var zhi=['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];return zhi[Math.floor(((h+1)%24)/2)];}
function fmtMMSS(s){function p(n){return (n<10?'0':'')+n;}return Math.floor(s/60)+':'+p(s%60);}
function zuoSet(min){
  if(ZUO.running)return;
  ZUO.totalMin=min;
  document.querySelectorAll('.zuo-len button').forEach(function(b){b.classList.toggle('on',parseInt(b.dataset.min,10)===min);});
  var t=document.getElementById('zuoTime');if(t)t.textContent=fmtMMSS(min*60);
}
function breathScale(){
  var ph=BREATH[ZUO.phase],elapsed=ph.s-ZUO.phaseLeft,prog=Math.max(0,Math.min(1,elapsed/ph.s));
  if(ZUO.phase===0)return 1+0.13*prog;          /* 吸 1→1.13 */
  if(ZUO.phase===1)return 1.13;                 /* 止 */
  return 1.13-0.13*prog;                         /* 呼 1.13→1 */
}
function zuoTick(){
  if(!ZUO.running)return;
  ZUO.secLeft--;ZUO.phaseLeft--;ZUO.done++;
  if(ZUO.phaseLeft<=0){ZUO.phase=(ZUO.phase+1)%3;ZUO.phaseLeft=BREATH[ZUO.phase].s;}
  var t=document.getElementById('zuoTime');if(t)t.textContent=fmtMMSS(Math.max(0,ZUO.secLeft));
  var pc=document.getElementById('zuoPhaseCn');var pe=document.getElementById('zuoPhaseEn');
  if(pc)pc.textContent=BREATH[ZUO.phase].n;if(pe)pe.textContent=BREATH[ZUO.phase].en;
  var ring=document.getElementById('zuoRing');if(ring){ring.style.transform='scale('+breathScale().toFixed(3)+')';}
  if(ZUO.secLeft<=0){zuoFinish(true);return;}
}
function zuoToggle(){
  if(ZUO.running){zuoFinish(false);return;}
  audioCtx();
  ZUO.running=true;ZUO.secLeft=ZUO.totalMin*60;ZUO.done=0;ZUO.phase=0;ZUO.phaseLeft=BREATH[0].s;ZUO.startTs=Date.now();
  var btn=document.getElementById('zuoBtn');if(btn){btn.textContent='止靜收功';btn.classList.add('running');}
  document.querySelectorAll('.zuo-len button').forEach(function(b){b.classList.add('lock');});
  var t=document.getElementById('zuoTime');if(t)t.textContent=fmtMMSS(ZUO.secLeft);
  var pc=document.getElementById('zuoPhaseCn');if(pc)pc.textContent='吸';
  ZUO.timer=setInterval(zuoTick,1000);
}
function zuoFinish(complete){
  ZUO.running=false;clearInterval(ZUO.timer);ZUO.timer=null;
  var ring=document.getElementById('zuoRing');if(ring)ring.style.transform='scale(1)';
  var btn=document.getElementById('zuoBtn');if(btn){btn.textContent='開始靜坐';btn.classList.remove('running');}
  document.querySelectorAll('.zuo-len button').forEach(function(b){b.classList.remove('lock');});
  var pc=document.getElementById('zuoPhaseCn');var pe=document.getElementById('zuoPhaseEn');
  if(pc)pc.textContent='靜';if(pe)pe.textContent='Stillness';
  var tReset=document.getElementById('zuoTime');if(tReset)tReset.textContent=fmtMMSS(ZUO.totalMin*60);
  var satMin=Math.floor(ZUO.done/60);
  if(complete){playQing();setTimeout(playQing,900);setTimeout(playQing,1800);zuoLog(ZUO.totalMin,true);zuoToast('功圓果滿，隨宜下坐，搓手浴面、叩齒咽津。');}
  else if(satMin>=1){playQing();zuoLog(satMin,false);zuoToast('已收功，本次靜坐 '+satMin+' 分鐘已記錄。');}
  else{zuoToast('已收功。');}
  renderZuoStats();
}
function zuoLog(min,done){
  try{
    var log=JSON.parse(localStorage.getItem('jm_zuo_log')||'[]');
    log.push({d:ymd(new Date()),m:min,ok:done?1:0,ts:Date.now()});
    localStorage.setItem('jm_zuo_log',JSON.stringify(log.slice(-300)));
  }catch(e){}
}
function zuoStats(){
  var s={times:0,min:0,todayMin:0,today:ymd(new Date())};
  try{
    var log=JSON.parse(localStorage.getItem('jm_zuo_log')||'[]');
    log.forEach(function(r){s.times++;s.min+=(r.m||0);if(r.d===s.today)s.todayMin+=(r.m||0);});
  }catch(e){}
  return s;
}
function renderZuoStats(){
  var el=document.getElementById('zuoStats');if(!el)return;
  var s=zuoStats();
  el.innerHTML='<div class="zs-item"><div class="zs-num">'+s.todayMin+'</div><div class="zs-k">今日（分）</div></div>'+
    '<div class="zs-item"><div class="zs-num">'+s.min+'</div><div class="zs-k">累計（分）</div></div>'+
    '<div class="zs-item"><div class="zs-num">'+s.times+'</div><div class="zs-k">坐次</div></div>';
}
function zuoToast(msg){var el=document.getElementById('zuoToast');if(!el)return;el.textContent=msg;el.classList.add('show');clearTimeout(el._t);el._t=setTimeout(function(){el.classList.remove('show');},4200);}
function renderShichen(){
  var el=document.getElementById('shichenTip');if(!el)return;
  var sc=shichenOf(new Date().getHours()),info=SHICHEN[sc];
  el.innerHTML='<span class="sc-name">'+sc+'時 · '+info.org+'當令</span><span class="sc-tip">'+info.tip+'</span>';
}

/* ---------- 修持頁整體渲染 ---------- */
function renderCultivate(){
  var wrap=document.getElementById('cultivateWrap');if(!wrap)return;
  wrap.innerHTML=
   '<div class="cult-sec">'+
     '<div class="sec-label"><span class="dot"></span><span class="zh">掌訣</span><span class="en">Hand Formula</span><span class="line"></span></div>'+
     '<div id="zhangjueMount"></div>'+
   '</div>'+
   '<div class="cult-sec">'+
     '<div class="sec-label"><span class="dot"></span><span class="zh">法器</span><span class="en">Instrument</span><span class="line"></span></div>'+
     '<div class="inst-card">'+
       '<div class="inst-switch"><button data-inst="muyu" class="on" onclick="switchInstrument(\'muyu\')">木魚<span>Wooden Fish</span></button><button data-inst="qing" onclick="switchInstrument(\'qing\')">玉磬<span>Jade Qing</span></button></div>'+
       '<button class="inst-pad" id="instPad" onclick="hitInstrument()" aria-label="敲擊">'+
         '<svg class="inst-art muyu-art" viewBox="0 0 120 120"><ellipse cx="60" cy="66" rx="46" ry="34" fill="currentColor"/><path d="M22 58 Q60 30 98 58 Q96 50 60 46 Q24 50 22 58Z" fill="currentColor" opacity=".55"/><ellipse cx="60" cy="58" rx="30" ry="9" fill="none" stroke="rgba(255,255,255,.5)" stroke-width="1.4"/><path d="M58 30 q4 -10 12 -12 q-2 8 -6 13" fill="currentColor" opacity=".8"/></svg>'+
         '<svg class="inst-art qing-art" viewBox="0 0 120 120"><path d="M30 40 Q60 26 90 40 L84 86 Q60 98 36 86 Z" fill="currentColor"/><ellipse cx="60" cy="40" rx="30" ry="9" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1.4"/><circle cx="60" cy="62" r="3" fill="rgba(255,255,255,.5)"/></svg>'+
         '<span class="inst-hit" id="instName">木魚</span>'+
         '<span class="inst-hit-en" id="instNameEn">Wooden Fish</span>'+
       '</button>'+
       '<div class="inst-counts"><div class="ic-item"><span id="instToday">0</span><small>今日 Today</small></div><div class="ic-item"><span id="instTotal">0</span><small>累計 Total</small></div></div>'+
       '<button class="inst-reset" onclick="resetInstrument()">清零 Reset</button>'+
       '<div class="inst-note">輕觸圓磬一下，心隨聲靜，一擊一念，念念歸真。</div>'+
     '</div>'+
   '</div>'+
   '<div class="cult-sec">'+
     '<div class="sec-label"><span class="dot"></span><span class="zh">靜功</span><span class="en">Stillness Sitting</span><span class="line"></span></div>'+
     '<div class="zuo-card">'+
       '<div class="zuo-stage"><div class="zuo-ring" id="zuoRing"><div class="zuo-inner"><div class="zuo-phase" id="zuoPhaseCn">靜</div><div class="zuo-phase-en" id="zuoPhaseEn">Stillness</div><div class="zuo-time" id="zuoTime">30:00</div></div></div></div>'+
       '<div class="zuo-len">'+[15,30,45,60].map(function(m,i){return '<button data-min="'+m+'" class="'+(m===30?'on':'')+'" onclick="zuoSet('+m+')">'+m+'<small>min</small></button>';}).join('')+'</div>'+
       '<button class="zuo-btn" id="zuoBtn" onclick="zuoToggle()">開始靜坐</button>'+
       '<div class="zuo-stats" id="zuoStats"></div>'+
       '<div class="shichen-tip" id="shichenTip"></div>'+
       '<div class="zuo-toast" id="zuoToast"></div>'+
     '</div>'+
   '</div>'+
   '<div class="cult-sec">'+
     '<div class="sec-label"><span class="dot"></span><span class="zh">八字</span><span class="en">BaZi Chart</span><span class="line"></span></div>'+
     '<div id="baziMount"></div>'+
   '</div>';
  switchInstrument('muyu');renderZuoStats();renderShichen();
  try{renderZhangjue();renderBaziForm();}catch(e){if(window&&window.console)console.error('zj/bz',e);}
}

/* ============================================================
   萬年曆黃曆增強（lunar.js）
   ============================================================ */
function alTag(cls,label,items){
  if(!items||!items.length)return '';
  return '<div class="al-row"><span class="al-k">'+label+'</span><span class="al-v">'+items.map(function(x){return '<i class="al-tag '+cls+'">'+x+'</i>';}).join('')+'</span></div>';
}
function renderAlmanac(y,m,d,boxId){
  var box=document.getElementById(boxId||'almanacBox');if(!box)return;
  try{
    if(!window.Solar){box.innerHTML='<div class="empty-state"><div class="empty-char">曆</div><div class="empty-txt">黃曆庫未載入</div></div>';return;}
    var L=window.Solar.fromYmd(y,m,d).getLunar();
    var gzY0=L.getYearInGanZhi();
    var gzY=s2t(gzY0),gzM=s2t(L.getMonthInGanZhi()),gzD=s2t(L.getDayInGanZhi());
    var lunarTxt=s2t(L.getMonthInChinese())+'月'+s2t(L.getDayInChinese());
    var jie=L.getJieQi()?s2t(L.getJieQi()):'';
    var ts=getTaisui(gzY0);
    var week='日一二三四五六'.charAt(new Date(y,m-1,d).getDay());
    var sx=s2t(L.getYearShengXiao());
    var html='<div class="al-head">'+
      '<div class="al-lunar">'+lunarTxt+'</div>'+
      '<div class="al-gz">'+gzY+'年 · '+gzM+'月 · '+gzD+'日</div>'+
      '<div class="al-sub">星期'+week+'　生肖屬'+sx+(jie?'　·　<span class="al-jie">'+jie+'</span>':'')+'</div>'+
    '</div>';
    /* 道門節日條（由日曆注入 ALMANAC_FESTIVAL） */
    if(window.ALMANAC_FESTIVAL&&window.ALMANAC_FESTIVAL[y+'-'+('0'+m).slice(-2)+'-'+('0'+d).slice(-2)]){
      var f=window.ALMANAC_FESTIVAL[y+'-'+('0'+m).slice(-2)+'-'+('0'+d).slice(-2)];
      html+='<button class="al-fest" onclick="openEventByDate(\''+f.date+'\')"><span class="al-fest-tag">道門</span><span>'+f.title+'</span><span class="al-fest-go">詳 →</span></button>';
    }
    html+='<div class="al-grid">'+
      '<div class="al-cell"><span class="alc-k">建除</span><span class="alc-v">'+s2t(L.getZhiXing())+'</span></div>'+
      '<div class="al-cell"><span class="alc-k">二十八宿</span><span class="alc-v">'+s2t(L.getXiu()+L.getZheng()+L.getAnimal())+'</span></div>'+
      '<div class="al-cell"><span class="alc-k">沖煞</span><span class="alc-v">沖'+s2t(L.getDayChongDesc()).replace(/[()（）]/g,'')+'　煞'+s2t(L.getDaySha())+'</span></div>'+
      '<div class="al-cell"><span class="alc-k">值年太歲</span><span class="alc-v">'+(ts?ts.name:'—')+'</span></div>'+
    '</div>';
    html+=alTag('yi','宜',(L.getDayYi()||[]).map(s2t));
    html+=alTag('ji','忌',(L.getDayJi()||[]).map(s2t));
    var pos=[];
    if(L.getDayPositionXiDesc)pos.push(['喜神',s2t(L.getDayPositionXiDesc())]);
    if(L.getDayPositionCaiDesc)pos.push(['財神',s2t(L.getDayPositionCaiDesc())]);
    if(L.getDayPositionFuDesc)pos.push(['福神',s2t(L.getDayPositionFuDesc())]);
    if(L.getDayPositionYangGuiDesc)pos.push(['陽貴',s2t(L.getDayPositionYangGuiDesc())]);
    if(L.getDayPositionYinGuiDesc)pos.push(['陰貴',s2t(L.getDayPositionYinGuiDesc())]);
    html+='<div class="al-row"><span class="al-k">神方位</span><span class="al-v al-pos">'+pos.map(function(p){return '<i><b>'+p[0]+'</b>'+p[1]+'</i>';}).join('')+'</span></div>';
    html+='<div class="al-pengzu"><span>彭祖百忌</span>'+s2t(L.getPengZuGan())+'；'+s2t(L.getPengZuZhi())+'</div>';
    html+='<div class="al-foot">黃曆供擇吉參考，淨明弟子以修心積德為本，「天道無親，常與善人」。</div>';
    box.innerHTML=html;
  }catch(e){if(window&&window.console)console.error('almanac',e);box.innerHTML='<div class="empty-state"><div class="empty-char">曆</div><div class="empty-txt">是日黃曆暫缺</div></div>';}
}

/* ============================================================
   左手掌訣教學（十二辰掌：三合、六合、六沖、馬星）
   ============================================================ */
var ZJ_ORDER=['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
var ZJ_POS={
 辰:[121,62],卯:[120,88],寅:[120,152],
 巳:[150,42],亥:[150,80],丑:[150,152],
 午:[180,52],子:[180,152],
 未:[207,83],申:[210,106],酉:[210,128],戌:[210,152]};
var ZJ_INFO={
 子:{en:'Zi',sc:'23:00–01:00',sx:'鼠',wx:'水',fx:'正北',yue:'十一月',jl:'膽經 · 足少陽膽',jq:'大雪 · 冬至',gua:'坎卦 · 正北',
  intro:'子，一陽初生於冬至，萬物滋萌於下。掌訣以無名指根為子，掐之安神定志，納正北坎水之氣；修行人於此時宜靜臥養陽。'},
 丑:{en:'Chou',sc:'01:00–03:00',sx:'牛',wx:'土',fx:'東北偏東',yue:'十二月',jl:'肝經 · 足厥陰肝',jq:'小寒 · 大寒',gua:'艮卦 · 東北',
  intro:'丑，紐也，寒土凝結、陽氣未伸。丑在中指根，掐之鎮守中宮、溫養肝木；此時宜熟睡以藏血。'},
 寅:{en:'Yin',sc:'03:00–05:00',sx:'虎',wx:'木',fx:'東北偏東',yue:'正月',jl:'肺經 · 手太陰肺',jq:'立春 · 雨水',gua:'艮卦 · 東北',
  intro:'寅，津也，正月三陽開泰、肺經當令。寅在食指根，為一日生氣之始，宜早起誦經、佈吸清氣。'},
 卯:{en:'Mao',sc:'05:00–07:00',sx:'兔',wx:'木',fx:'正東',yue:'二月',jl:'大腸經 · 手陽明大腸',jq:'驚蟄 · 春分',gua:'震卦 · 正東',
  intro:'卯，茂也，日出東方、正陽之位。卯在食指中節，掐之迎東方生氣；此時宜起身、飲溫水、舒展筋骨。'},
 辰:{en:'Chen',sc:'07:00–09:00',sx:'龍',wx:'土',fx:'東南偏東',yue:'三月',jl:'胃經 · 足陽明胃',jq:'清明 · 穀雨',gua:'巽卦 · 東南',
  intro:'辰，震也，暮春土旺、胃經当令。辰在食指尖，掌訣起手常自辰巳；此時宜進早齋，清淡養胃。'},
 巳:{en:'Si',sc:'09:00–11:00',sx:'蛇',wx:'火',fx:'東南偏南',yue:'四月',jl:'脾經 · 足太陰脾',jq:'立夏 · 小滿',gua:'巽卦 · 東南',
  intro:'巳，火氣漸盛、脾經當令。巳在中指尖，掐之通神明、助思慮；此時精神飽滿，宜辦事誦持。'},
 午:{en:'Wu',sc:'11:00–13:00',sx:'馬',wx:'火',fx:'正南',yue:'五月',jl:'心經 · 手少陰心',jq:'芒種 · 夏至',gua:'離卦 · 正南',
  intro:'午，交也，夏至一陰初生、正南離火。午在無名指尖，心經當令宜靜；午時小憩、不喧不躁，以養心神。'},
 未:{en:'Wei',sc:'13:00–15:00',sx:'羊',wx:'土',fx:'西南偏南',yue:'六月',jl:'小腸經 · 手太陽小腸',jq:'小暑 · 大暑',gua:'坤卦 · 西南',
  intro:'未，味也，六月土旺、小腸經當令。未在小指尖，掐之分清泌濁；飯後宜緩行，不宜貪涼。'},
 申:{en:'Shen',sc:'15:00–17:00',sx:'猴',wx:'金',fx:'西南偏西',yue:'七月',jl:'膀胱經 · 足太陽膀胱',jq:'立秋 · 處暑',gua:'坤卦 · 西南',
  intro:'申，身也，七月金旺、膀胱經當令。申在小指上節，為水液通道；此時宜多飲溫水、通利水道。'},
 酉:{en:'You',sc:'17:00–19:00',sx:'雞',wx:'金',fx:'正西',yue:'八月',jl:'腎經 · 足少陰腎',jq:'白露 · 秋分',gua:'兌卦 · 正西',
  intro:'酉，老也，八月金旺、腎經當令，酉為月出之門。酉在小指中節，掐之納西嶽金氣；此時宜收斂、藏精納氣。'},
 戌:{en:'Xu',sc:'19:00–21:00',sx:'狗',wx:'土',fx:'西北偏西',yue:'九月',jl:'心包經 · 手厥陰心包',jq:'寒露 · 霜降',gua:'乾卦 · 西北',
  intro:'戌，滅也，九月土旺、心包當令，戌為閉藏之門。戌在小指根，掐之護心安神；此時宜靜處、準備就寢。'},
 亥:{en:'Hai',sc:'21:00–23:00',sx:'豬',wx:'水',fx:'西北偏北',yue:'十月',jl:'三焦經 · 少陽三焦',jq:'立冬 · 小雪',gua:'乾卦 · 西北',
  intro:'亥，核也，十月水旺、三焦當令，亥為坤陰之極。亥在中指中節，掐之調和百脈；此時宜安眠，百脈歸元。'}};
var ZJ_REL={
 sanhe:{label:'三合',en:'San He',groups:[['申','子','辰'],['寅','午','戌'],['巳','酉','丑'],['亥','卯','未']],
  note:['申子辰合水局','寅午戌合火局','巳酉丑合金局','亥卯未合木局'],desc:'三支相合化為五行一局，主聚氣和諧，掌訣中以三角相連。'},
 liuhe:{label:'六合',en:'Liu He',groups:[['子','丑'],['寅','亥'],['卯','戌'],['辰','酉'],['巳','申'],['午','未']],
  note:['子丑合土','寅亥合木','卯戌合火','辰酉合金','巳申合水','午未合日月'],desc:'兩支陰陽相契，主暗合相助，以直線相連。'},
 liuchong:{label:'六沖',en:'Liu Chong',groups:[['子','午'],['丑','未'],['寅','申'],['卯','酉'],['辰','戌'],['巳','亥']],
  note:['子午沖','丑未沖','寅申沖','卯酉沖','辰戌沖','巳亥沖'],desc:'對宮相戰、方位正對，主動盪變遷，以直線相連。'},
 maxing:{label:'馬星',en:'Horse Star',groups:[['寅','午','戌','申'],['申','子','辰','寅'],['巳','酉','丑','亥'],['亥','卯','未','巳']],
  note:['寅午戌馬在申','申子辰馬在寅','巳酉丑馬在亥','亥卯未馬在巳'],desc:'驛馬主奔波遷移。三合局之沖支即馬星，金線自局心指向馬位。'}};
function zjHandSvg(){
 var outline='M 52,110 Q 33,105 33,128 C 42,152 62,170 82,178 Q 68,190 64,208 C 58,246 74,280 108,288 L 196,288 C 230,280 254,246 256,206 Q 258,178 246,160 C 244,142 240,116 236,100 Q 226,82 216,100 C 213,108 210,132 211,154 Q 207,166 203,152 C 204,126 201,90 198,78 Q 190,60 182,78 C 179,90 176,126 177,152 Q 173,166 169,152 C 170,124 167,86 164,72 Q 152,54 140,72 C 137,86 134,124 135,152 Q 131,166 127,152 C 128,138 126,110 123,92 Q 112,74 103,92 C 100,104 98,140 100,172 C 84,166 64,150 52,110 Z';
 var knuckles=[
  'M96,128 Q112,134 128,128','M97,158 Q112,164 127,158',
  'M136,118 Q152,124 168,118','M137,152 Q152,158 167,152',
  'M176,120 Q190,126 204,120','M177,154 Q190,160 203,154',
  'M212,122 Q226,128 240,122','M213,152 Q226,158 239,152',
  'M37,138 Q47,143 56,137','M47,157 Q57,162 66,156'];
 var nails=['M104,94 Q112,88 120,94','M141,82 Q152,76 163,82','M181,86 Q190,80 199,86','M217,102 Q226,96 235,102','M39,114 Q35,111 34,120'];
 var shades=[
  'M244,158 C256,196 246,256 202,284 L204,270 C238,252 246,214 242,180 Z',
  'M124,118 C128,138 128,150 127,158 L121,158 C122,140 122,122 120,114 Z',
  'M164,116 C168,136 168,150 167,158 L161,158 C162,140 162,120 160,112 Z',
  'M200,118 C204,138 204,152 203,160 L197,160 C198,142 198,122 196,114 Z'];
 return '<svg viewBox="0 0 300 300" class="zj-svg">'+
 '<defs><marker id="zjArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#A8884E"/></marker></defs>'+
 '<image href="assets/img/zj-hand-1.png" x="0" y="0" width="300" height="300"/>'+
 '<g id="zjLinks"></g><g id="zjDots"></g></svg>';
}
function zjModeBtn(k,t){return '<button class="zj-mode" id="zjm-'+k+'" onclick="zjRel(\''+k+'\')">'+t+'</button>';}
function renderZhangjue(){
 var m=document.getElementById('zhangjueMount');if(!m)return;
 m.innerHTML='<div class="zj-card">'+zjHandSvg()+
  '<div class="zj-modes">'+zjModeBtn('sanhe','三合 San He')+zjModeBtn('liuhe','六合 Liu He')+
  zjModeBtn('liuchong','六沖 Chong')+zjModeBtn('maxing','馬星 Horse')+
  '<button class="zj-mode" onclick="zjClear()">復位 Reset</button></div>'+
  '<div class="zj-info" id="zjInfo"><div class="zj-rel-note">輕觸掌上地支，可知其<span class="rl-h">時辰、生肖、五行、方位、月建</span>；或擇上方關係，看三合、六合、六沖、馬星如何落於指掌。</div></div></div>';
 document.getElementById('zjDots').innerHTML=ZJ_ORDER.map(function(z){var p=ZJ_POS[z],c=WX_COLOR[ZHI_WX[z]];
  return '<circle class="zj-dot" id="zjd-'+z+'" cx="'+p[0]+'" cy="'+p[1]+'" r="16"/>'+
   '<text class="zj-txt" id="zjt-'+z+'" x="'+p[0]+'" y="'+p[1]+'" style="fill:'+c+'">'+z+'</text>'+
   '<circle class="zj-hit" cx="'+p[0]+'" cy="'+p[1]+'" r="17" onclick="zjSelect(\''+z+'\')"/>';}).join('');
}
function zjDotOn(z,on){var d=document.getElementById('zjd-'+z),t=document.getElementById('zjt-'+z);if(d)d.classList.toggle('on',on);if(t){if(on){if(!t.dataset.c)t.dataset.c=t.style.fill;t.style.fill='#F7F1E6';}else if(t.dataset.c){t.style.fill=t.dataset.c;}}}
function zjClearModeBtns(){['sanhe','liuhe','liuchong','maxing'].forEach(function(k){var b=document.getElementById('zjm-'+k);if(b)b.classList.remove('on');});}
function zjDefault(){return '<div class="zj-rel-note">輕觸掌上地支，可知其<span class="rl-h">時辰、生肖、五行、方位、月建</span>；或擇上方關係，看三合、六合、六沖、馬星如何落於指掌。</div>';}
function zjClear(){
 zjClearModeBtns();ZJ_ORDER.forEach(function(z){zjDotOn(z,false);});
 var L=document.getElementById('zjLinks');if(L)L.innerHTML='';
 var i=document.getElementById('zjInfo');if(i)i.innerHTML=zjDefault();
}
function zjGr(k,v){return '<div class="zj-gr"><b>'+k+'</b><span>'+v+'</span></div>';}
function zjSelect(z){
 zjClearModeBtns();ZJ_ORDER.forEach(function(q){zjDotOn(q,q===z);});
 var L=document.getElementById('zjLinks');if(L)L.innerHTML='';
 var info=ZJ_INFO[z];
 document.getElementById('zjInfo').innerHTML=
  '<div class="zj-zhi-head"><span class="zj-zhi-name">'+z+'時</span><span class="zj-zhi-en">'+info.en+' · Hour of '+info.en+'</span></div>'+
  '<div class="zj-grid">'+zjGr('時辰',info.sc)+zjGr('生肖',info.sx)+zjGr('五行',info.wx)+zjGr('方位',info.fx)+zjGr('月建',info.yue)+zjGr('當令經絡',info.jl)+zjGr('節氣',info.jq)+zjGr('後天卦位',info.gua)+'</div>'+
  '<div class="zj-intro">'+info.intro+'</div>';
}
function zjCenter(zs){var x=0,y=0;zs.forEach(function(z){x+=ZJ_POS[z][0];y+=ZJ_POS[z][1];});return [x/zs.length,y/zs.length];}
function zjRel(type){
 zjClear();var rel=ZJ_REL[type];
 document.getElementById('zjm-'+type).classList.add('on');
 var html='';
 rel.groups.forEach(function(g){
  if(type==='maxing'){
   var ju=g.slice(0,3),ma=g[3];
   html+='<polygon class="zj-link" style="opacity:.2" points="'+ju.map(function(z){return ZJ_POS[z].join(',');}).join(' ')+'"/>';
   var c=zjCenter(ju),p=ZJ_POS[ma];
   html+='<line x1="'+c[0]+'" y1="'+c[1]+'" x2="'+p[0]+'" y2="'+p[1]+'" stroke="var(--gold)" stroke-width="1.3" stroke-dasharray="3 3" marker-end="url(#zjArrow)"/>';
   zjDotOn(ma,true);
  }else{
   var pts=g.map(function(z){return ZJ_POS[z];});
   if(g.length===2)html+='<line class="zj-link" x1="'+pts[0][0]+'" y1="'+pts[0][1]+'" x2="'+pts[1][0]+'" y2="'+pts[1][1]+'"/>';
   else html+='<polygon class="zj-link" points="'+pts.map(function(p){return p.join(',');}).join(' ')+'"/>';
   g.forEach(function(z){zjDotOn(z,true);});
  }
 });
 document.getElementById('zjLinks').innerHTML=html;
 document.getElementById('zjInfo').innerHTML='<div class="zj-rel-note"><span class="rl-h">'+rel.label+' · '+rel.en+'</span>　'+rel.desc+'<br>'+rel.note.map(function(n){return '· '+n;}).join('<br>')+'</div>';
}

/* ============================================================
   八字排盤（客觀排盤＋五行分佈＋十神納音，不主吉凶）
   ============================================================ */
var GAN_WX={甲:'木',乙:'木',丙:'火',丁:'火',戊:'土',己:'土',庚:'金',辛:'金',壬:'水',癸:'水'};
var ZHI_WX={子:'水',丑:'土',寅:'木',卯:'木',辰:'土',巳:'火',午:'火',未:'土',申:'金',酉:'金',戌:'土',亥:'水'};
var WX_COLOR={木:'#5E7D4E',火:'#B04535',土:'#B08A4E',金:'#9C8A55',水:'#3E4A5C'};
var GAN_DESC={甲:'陽木 · 參天之木',乙:'陰木 · 花草之木',丙:'陽火 · 太陽之火',丁:'陰火 · 燈燭之火',戊:'陽土 · 山嶽之土',己:'陰土 · 田園之土',庚:'陽金 · 劍戟之金',辛:'陰金 · 珠玉之金',壬:'陽水 · 江河之水',癸:'陰水 · 雨露之水'};
var ZHI_MONTH_DESC={寅:'寅月，木旺（春初）',卯:'卯月，木旺（春）',辰:'辰月，土旺（春末）',巳:'巳月，火旺（夏初）',午:'午月，火旺（夏）',未:'未月，土旺（夏末）',申:'申月，金旺（秋初）',酉:'酉月，金旺（秋）',戌:'戌月，土旺（秋末）',亥:'亥月，水旺（冬初）',子:'子月，水旺（冬）',丑:'丑月，土旺（冬末）'};
var SS_TIANYI={甲:['丑','未'],戊:['丑','未'],庚:['丑','未'],乙:['子','申'],己:['子','申'],丙:['亥','酉'],丁:['亥','酉'],壬:['卯','巳'],癸:['卯','巳'],辛:['寅','午']};
var SS_WENCHANG={甲:'巳',乙:'午',丙:'申',丁:'酉',戊:'申',己:'酉',庚:'亥',辛:'子',壬:'寅',癸:'卯'};
var SS_YANGREN={甲:'卯',丙:'午',戊:'午',庚:'酉',壬:'子'};
var SS_HONGYAN={甲:'午',乙:'寅',丙:'寅',丁:'未',戊:'辰',己:'辰',庚:'戌',辛:'酉',壬:'子',癸:'申'};
var SS_JINYU={甲:'辰',乙:'巳',丙:'未',丁:'申',戊:'未',己:'申',庚:'戌',辛:'亥',壬:'丑',癸:'寅'};
var SS_MA={申:'寅',子:'寅',辰:'寅',寅:'申',午:'申',戌:'申',巳:'亥',酉:'亥',丑:'亥',亥:'巳',卯:'巳',未:'巳'};
var SS_TAOHUA={申:'酉',子:'酉',辰:'酉',寅:'卯',午:'卯',戌:'卯',巳:'午',酉:'午',丑:'午',亥:'子',卯:'子',未:'子'};
var SS_HUAGAI={申:'辰',子:'辰',辰:'辰',寅:'戌',午:'戌',戌:'戌',巳:'丑',酉:'丑',丑:'丑',亥:'未',卯:'未',未:'未'};
var SS_JIANGXING={申:'子',子:'子',辰:'子',寅:'午',午:'午',戌:'午',巳:'酉',酉:'酉',丑:'酉',亥:'卯',卯:'卯',未:'卯'};
function bzShenSha(ec){
 var dg=ec.getDayGan(),dz=ec.getDayZhi();
 var GANS=['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'],ZHIS=['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
 var JIAZI=[];for(var i=0;i<60;i++)JIAZI.push(GANS[i%10]+ZHIS[i%12]);
 var di=JIAZI.indexOf(ec.getDay()),xun=Math.floor(di/10)*10;
 var kongs=[ZHIS[(xun+10)%12],ZHIS[(xun+11)%12]];
 var cols=[['年柱',ec.getYear().charAt(1)],['月柱',ec.getMonth().charAt(1)],['日柱',ec.getDay().charAt(1)],['時柱',ec.getTime().charAt(1)]];
 var hits=[];
 cols.forEach(function(c){
  var z=c[1],ns=[];
  if(SS_TIANYI[dg]&&SS_TIANYI[dg].indexOf(z)>=0)ns.push('天乙貴人');
  if(SS_WENCHANG[dg]===z)ns.push('文昌貴人');
  if(SS_YANGREN[dg]===z)ns.push('羊刃');
  if(SS_HONGYAN[dg]===z)ns.push('紅艷');
  if(SS_JINYU[dg]===z)ns.push('金輿');
  if(SS_MA[dz]===z)ns.push('驛馬');
  if(SS_TAOHUA[dz]===z)ns.push('桃花');
  if(SS_HUAGAI[dz]===z)ns.push('華蓋');
  if(SS_JIANGXING[dz]===z)ns.push('將星');
  if(kongs.indexOf(z)>=0)ns.push('空亡');
  ns.forEach(function(n){hits.push({n:n,p:c[0]});});
 });
 return hits;
}
function bzShenShaHtml(ec){
 var hits=bzShenSha(ec);
 if(!hits.length)return '<div class="bz-ss-empty">此盤未見常用神煞（神煞僅作參考，不主吉凶）。</div>';
 return '<div class="bz-ss">'+hits.map(function(h){return '<span class="bz-ss-tag"><b>'+h.n+'</b><i>'+h.p.replace('柱','')+'</i></span>';}).join('')+'</div>';
}
var BEN_GAN={子:'癸',丑:'己',寅:'甲',卯:'乙',辰:'戊',巳:'丙',午:'丁',未:'己',申:'庚',酉:'辛',戌:'戊',亥:'壬'};
function bzShiShen(dayGan,t){
 var GI=['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
 var di=GI.indexOf(dayGan),ti=GI.indexOf(t),same=(di%2)===(ti%2);
 var w1=GAN_WX[dayGan],w2=GAN_WX[t];
 var SHENG={木:'火',火:'土',土:'金',金:'水',水:'木'},KE={木:'土',土:'水',水:'火',火:'金',金:'木'};
 if(w1===w2)return same?'比肩':'劫財';
 if(SHENG[w1]===w2)return same?'食神':'傷官';
 if(SHENG[w2]===w1)return same?'偏印':'正印';
 if(KE[w1]===w2)return same?'偏財':'正財';
 if(KE[w2]===w1)return same?'七殺':'正官';
 return '';
}
function bzYunHtml(ec,sex){
 var gc=sex==='男'?1:0,yun=ec.getYun(gc,1),dayGan=ec.getDayGan();
 var dys=yun.getDaYun(9),nowY=new Date().getFullYear(),curIdx=1;
 for(var i=1;i<dys.length;i++){if(dys[i].getStartYear()<=nowY&&nowY<=dys[i].getEndYear())curIdx=i;}
 var st=yun.getStartSolar();
 var head='<div class="bz-yun-head">起運 約 '+dys[curIdx].getStartAge()+'歲前後 · '+st.getYear()+'年'+st.getMonth()+'月'+st.getDay()+'日 · '+(yun.isForward()?'順行':'逆行')+'</div>';
 var steps=dys.slice(1).map(function(d){
  var gz=d.getGanZhi(),g=gz.charAt(0),z=gz.charAt(1),on=d.getIndex()===curIdx;
  return '<div class="bz-dy'+(on?' on':'')+'"><div class="dy-age">'+d.getStartAge()+'–'+d.getEndAge()+'歲</div><div class="dy-gz">'+g+'<span>'+bzShiShen(dayGan,g)+'</span></div><div class="dy-gz">'+z+'<span>'+bzShiShen(dayGan,BEN_GAN[z])+'</span></div><div class="dy-year">'+d.getStartYear()+'</div></div>';
 }).join('');
 var lns=dys[curIdx].getLiuNian(10).map(function(l){
  var gz=l.getGanZhi(),on=l.getYear()===nowY;
  return '<div class="bz-ln'+(on?' on':'')+'"><div class="ln-year">'+l.getYear()+'</div><div class="ln-age">'+l.getAge()+'歲</div><div class="ln-gz">'+gz+'</div><div class="ln-ss">'+bzShiShen(dayGan,gz.charAt(0))+'</div></div>';
 }).join('');
 return '<div class="bz-yun-h">大運 Da Yun</div>'+head+'<div class="bz-dys">'+steps+'</div><div class="bz-ln-h">當前大運流年 Liu Nian</div><div class="bz-lns">'+lns+'</div>';
}
function bzRange(a,b){var r=[];for(var i=a;i<=b;i++)r.push(i);return r;}
/* ===== 滚轮 Picker ===== */
var BZ_STATE={cal:'solar'};
var bzWheelCtl={};
function bzWheelHtml(id,label,en){
 return '<div class="bz-field"><label>'+label+(en?' <span class="en">'+en+'</span>':'')+'</label>'+
  '<div class="wheel" data-wheel-id="'+id+'"><div class="wheel-scroll">'+
  '<div class="wheel-pad"></div><div class="wheel-items" data-items="'+id+'"></div><div class="wheel-pad"></div>'+
  '</div><div class="wheel-band"></div><div class="wheel-fade top"></div><div class="wheel-fade bot"></div></div></div>';
}
function bzTextField(label,id,ph){return '<div class="bz-field"><label>'+label+'</label><input class="bz-text" id="'+id+'" placeholder="'+ph+'"></div>';}
function bzBuildWheelItems(id,items,sel){
 var box=document.querySelector('[data-items="'+id+'"]');if(!box)return;
 box.innerHTML=items.map(function(it){var v=typeof it==='object'?it.v:it,t=typeof it==='object'?it.t:it;
  return '<div class="wheel-item'+(String(v)===String(sel)?' sel':'')+'" data-v="'+v+'">'+t+'</div>';}).join('');
}
function bzResync(id,sel){
 var wheel=document.querySelector('[data-wheel-id="'+id+'"]');if(!wheel)return;
 var sc=wheel.querySelector('.wheel-scroll'),items=wheel.querySelectorAll('.wheel-item'),found=0;
 for(var k=0;k<items.length;k++){if(items[k].dataset.v===String(sel)){found=k;break;}}
 sc.scrollTop=found*25;
 items.forEach(function(el,k){el.classList.toggle('sel',k===found);});
}
function bzInitWheel(id,sel,onChange){
 var wheel=document.querySelector('[data-wheel-id="'+id+'"]');if(!wheel)return;
 var sc=wheel.querySelector('.wheel-scroll'),H=25;
 function items(){return wheel.querySelectorAll('.wheel-item');}
 function idx(){var n=items();return Math.max(0,Math.min(n.length-1,Math.round(sc.scrollTop/H)));}
 function val(){var n=items(),i=idx();return n[i]?n[i].dataset.v:null;}
 function setV(v,smooth){var n=items();for(var k=0;k<n.length;k++){if(n[k].dataset.v===String(v)){try{sc.scrollTo({top:k*H,behavior:smooth?'smooth':'auto'});}catch(e){sc.scrollTop=k*H;}n.forEach(function(el,j){el.classList.toggle('sel',j===k);});return;}}}
 var t;
 sc.addEventListener('scroll',function(){var n=items(),i=idx();n.forEach(function(el,k){el.classList.toggle('sel',k===i);});
  clearTimeout(t);t=setTimeout(function(){if(onChange)onChange(val());},120);});
 var n=items();for(var k=0;k<n.length;k++)if(n[k].dataset.v===String(sel))sc.scrollTop=k*H;
 n.forEach(function(el,k){el.classList.toggle('sel',n[k].dataset.v===String(sel));});
 bzWheelCtl[id]={get:val,set:setV};
}
/* 公农历 items */
var BZ_NOWY=new Date().getFullYear();
function bzYearItems(){return bzRange(1940,BZ_NOWY).reverse();}
function bzMonthItemsSolar(){return bzRange(1,12).map(function(m){return {v:m,t:m+'月'};});}
function bzLunarYear(y){return window.LunarYear.fromYear(y);}
function bzMonthItemsLunar(y){
 var ly=bzLunarYear(y),leap=ly.getLeapMonth(),out=[];
 for(var i=1;i<=12;i++){out.push({v:i,t:i+'月'});if(leap===i)out.push({v:'-'+i,t:'閏'+i+'月'});}
 return out;
}
function bzDaysSolar(y,m){return new Date(y,m,0).getDate();}
function bzDaysLunar(y,m){
 var neg=String(m).charAt(0)==='-',mm=neg?-parseInt(m):parseInt(m);
 var mo=bzLunarYear(y).getMonth(mm);
 return mo?mo.getDayCount():30;
}
function bzDayItems(n){return bzRange(1,n).map(function(d){return {v:d,t:d+'日'};});}
function bzHourItems(){return bzRange(0,23).map(function(h){return {v:h,t:(h<10?'0'+h:h)+'時'};});}
function bzMinItems(){return bzRange(0,59).map(function(x){return {v:x,t:x<10?'0'+x:String(x)};});}
function bzSexItems(){return [{v:'男',t:'男 Male'},{v:'女',t:'女 Female'}];}
function bzRefreshDays(keep){
 var y=bzWheelCtl.y.get(),m=bzWheelCtl.m.get();
 var n=BZ_STATE.cal==='solar'?bzDaysSolar(+y,m):bzDaysLunar(y,m);
 var sel=(keep&&+keep<=n)?keep:1;
 bzBuildWheelItems('d',bzDayItems(n),sel);
 requestAnimationFrame(function(){bzResync('d',sel);});
}
function bzSetCal(mode){
 if(BZ_STATE.cal===mode)return;BZ_STATE.cal=mode;
 document.querySelectorAll('.bz-cal-mode span').forEach(function(s){s.classList.toggle('on',s.dataset.cal===mode);});
 var y=+bzWheelCtl.y.get();
 var months=mode==='solar'?bzMonthItemsSolar():bzMonthItemsLunar(y);
 bzBuildWheelItems('m',months,1);bzRefreshDays(1);
 requestAnimationFrame(function(){requestAnimationFrame(function(){bzResync('m',1);});});
}
function renderBaziForm(){
 var m=document.getElementById('baziMount');if(!m)return;
 m.innerHTML='<div class="bz-card"><div id="bzSaves"></div><div class="bz-form">'+
  bzTextField('姓名 <span class="en">Name</span>','bzNameInput','請填寫姓名')+
  '<div class="bz-field"><label>曆法 <span class="en">Calendar</span></label><div class="bz-cal-mode">'+
  '<span data-cal="solar" class="on">公曆 Gregorian</span><span data-cal="lunar">農曆 Lunar</span></div></div>'+
  bzWheelHtml('y','出生年','Year')+bzWheelHtml('m','月','Month')+bzWheelHtml('d','日','Day')+
  bzWheelHtml('h','小時','Hour')+bzWheelHtml('mi','分','Minute')+bzWheelHtml('sex','性別（大運備用）','Sex')+
  bzTextField('出生地 <span class="en">Birthplace</span>','bzBirthPlace','省 · 市（選填）')+
  bzTextField('居住地 <span class="en">Residence</span>','bzLivePlace','省 · 市（選填）')+
  '<button class="bz-go" onclick="baziCalc()">排盤 Chart</button>'+
  '<button class="bz-go bz-share-go" onclick="bzShare()" style="background:var(--ink);">邀請他人填寫 Invite</button>'+
  '</div><div id="bzShare"></div><div id="bzResult"></div></div>';
 bzFormInit(1990,5,20,10,30,'男');
 bzRenderSaves();
}
function bzFormInit(y,m,d,h,mi,sex){
 BZ_STATE.cal='solar';
 bzBuildWheelItems('y',bzYearItems(),y);
 bzBuildWheelItems('m',bzMonthItemsSolar(),m);
 bzBuildWheelItems('d',bzDayItems(bzDaysSolar(y,m)),d);
 bzBuildWheelItems('h',bzHourItems(),h);
 bzBuildWheelItems('mi',bzMinItems(),mi);
 bzBuildWheelItems('sex',bzSexItems(),sex);
 bzInitWheel('y',y,function(){if(BZ_STATE.cal==='lunar'){bzBuildWheelItems('m',bzMonthItemsLunar(+bzWheelCtl.y.get()));bzResync('m',1);}bzRefreshDays(bzWheelCtl.d.get());});
 bzInitWheel('m',m,function(){bzRefreshDays(bzWheelCtl.d.get());});
 bzInitWheel('d',d,null);bzInitWheel('h',h,null);bzInitWheel('mi',mi,null);bzInitWheel('sex',sex,null);
 document.querySelectorAll('.bz-cal-mode span').forEach(function(s){s.addEventListener('click',function(){bzSetCal(s.dataset.cal);});});
}
function bzVal(id){var el=document.getElementById(id);return el?el.value:'';}
function bzPilHtml(p){
 var g=p.v.charAt(0),z=p.v.charAt(1);
 var gwx=GAN_WX[g],zwx=ZHI_WX[z];
 var szMain=Array.isArray(p.sz)?p.sz[0]:p.sz;
 var hg=Array.isArray(p.hg)?p.hg.join(' '):(p.hg||'');
 return '<div class="bz-pil">'+
  '<div class="pk">'+p.k+'</div><div class="pen">'+p.en+'</div>'+
  '<div class="pg" style="color:'+WX_COLOR[gwx]+'">'+g+'</div><div class="ss">'+s2t(p.sg)+'</div>'+
  '<div class="pz" style="color:'+WX_COLOR[zwx]+'">'+z+'</div><div class="ss">'+s2t(szMain)+'</div>'+
  '<div class="cg">藏干 '+s2t(hg)+'</div>'+
  '<div class="ds"><span>'+(p.k==='日柱'?'自坐':'地势')+'</span>'+s2t(p.ds)+'</div>'+
  '<div class="ny">'+s2t(p.ny)+'</div></div>';
}
function baziCalc(){
 var r=document.getElementById('bzResult');
 try{
  var name=(bzVal('bzNameInput')||'').trim(),bp=(bzVal('bzBirthPlace')||'').trim(),lp=(bzVal('bzLivePlace')||'').trim();
  if(!window.Solar)throw new Error('曆庫未載入');
  var y=+bzWheelCtl.y.get(),mRaw=bzWheelCtl.m.get(),d=+bzWheelCtl.d.get(),h=+bzWheelCtl.h.get(),mi=+bzWheelCtl.mi.get(),sex=bzWheelCtl.sex.get();
  var solar;
  if(BZ_STATE.cal==='solar'){
   solar=window.Solar.fromYmdHms(y,+mRaw,d,h,mi,0);
  }else{
   var neg=String(mRaw).charAt(0)==='-',mm=neg?-parseInt(mRaw):parseInt(mRaw);
   solar=window.Lunar.fromYmdHms(y,mm,d,h,mi,0).getSolar();
  }
  var ec=solar.getLunar().getEightChar();
  var pillars=[
   {k:'年柱',en:'Year',v:ec.getYear(),ny:ec.getYearNaYin(),sg:ec.getYearShiShenGan(),sz:ec.getYearShiShenZhi(),hg:ec.getYearHideGan(),ds:ec.getYearDiShi()},
   {k:'月柱',en:'Month',v:ec.getMonth(),ny:ec.getMonthNaYin(),sg:ec.getMonthShiShenGan(),sz:ec.getMonthShiShenZhi(),hg:ec.getMonthHideGan(),ds:ec.getMonthDiShi()},
   {k:'日柱',en:'Day',v:ec.getDay(),ny:ec.getDayNaYin(),sg:ec.getDayShiShenGan(),sz:ec.getDayShiShenZhi(),hg:ec.getDayHideGan(),ds:ec.getDayDiShi()},
   {k:'時柱',en:'Hour',v:ec.getTime(),ny:ec.getTimeNaYin(),sg:ec.getTimeShiShenGan(),sz:ec.getTimeShiShenZhi(),hg:ec.getTimeHideGan(),ds:ec.getTimeDiShi()}];
  var cnt={木:0,火:0,土:0,金:0,水:0};
  pillars.forEach(function(p){cnt[GAN_WX[p.v.charAt(0)]]++;cnt[ZHI_WX[p.v.charAt(1)]]++;});
  var dayGan=ec.getDayGan(),monthZhi=ec.getMonth().charAt(1);
  var dm='<div class="bz-daymaster">日主 <b style="color:'+WX_COLOR[GAN_WX[dayGan]]+'">'+dayGan+'</b>（'+GAN_DESC[dayGan]+'）；月柱'+ec.getMonth()+'，'+ZHI_MONTH_DESC[monthZhi]+'。<br>五行以四柱天干地支本氣統計，不含地支中餘氣。</div>';
  var bar=Object.keys(cnt).map(function(w){return cnt[w]?('<i style="width:'+(cnt[w]/8*100)+'%;background:'+WX_COLOR[w]+'"></i>'):'';}).join('');
  var leg=Object.keys(cnt).map(function(w){return '<i style="color:'+WX_COLOR[w]+'">'+w+' · '+cnt[w]+'</i>';}).join('');
  var idBar='<div class="bz-idbar"><span class="nm">'+(name||'未命名')+'</span><span class="cal">'+(BZ_STATE.cal==='solar'?'公曆 Gregorian':'農曆 Lunar')+'</span>'+(bp?'<span>籍 '+bp+'</span>':'')+(lp?'<span>居 '+lp+'</span>':'')+'</div>';
  r.innerHTML=idBar+'<div class="bz-pillars">'+pillars.map(bzPilHtml).join('')+'</div>'+dm+
   '<div class="bz-sec-h">神煞 Shen Sha</div>'+bzShenShaHtml(ec)+
   '<div class="bz-wx-h">五行分佈 Five Phases</div><div class="bz-wxbar">'+bar+'</div><div class="bz-wxleg">'+leg+'</div>'+
   bzYunHtml(ec,sex)+
   '<button class="bz-save-btn" onclick="bzSave()">保存此命盤到本機 Save Chart</button>'+
   '<div class="bz-foot">※ 此為客觀排盤，供曆法與命理研習，不主吉凶禍福。「天道無親，常與善人」，命數終不若心地，淨明弟子但當忠敬孝悌、積德修持。</div>';
 }catch(e){if(window&&window.console)console.error('bazi',e);r.innerHTML='<div class="bz-foot" style="color:var(--red);">所填日期無效，請核實年月日（如避免 2 月 30 日、農曆閏月）。</div>';}
}

function bzSaves(){try{return JSON.parse(localStorage.getItem('jm_bazi_saves')||'[]');}catch(e){return [];}}
function bzRenderSaves(){
 var box=document.getElementById('bzSaves');if(!box)return;
 var saves=bzSaves();
 if(!saves.length){box.innerHTML='';return;}
 box.innerHTML='<div class="bz-saves-h">本機命盤 Saved Charts</div><div class="bz-saves">'+saves.map(function(s,i){
  var calTag=s.cal==='lunar'?'農':'公';
  var meta=calTag+' '+s.y+'/'+s.m+'/'+s.d+' '+s.h+':'+('0'+s.mi).slice(-2)+' · '+s.sex+(s.bp?' · 籍 '+s.bp:'')+(s.lp?' · 居 '+s.lp:'');
  return '<div class="bz-save-item"><div class="bs-row1"><span class="bs-name">'+s.name+'</span><span class="bs-del" onclick="bzDelete('+i+')">刪除</span></div><div class="bs-meta">'+meta+'</div><span class="bs-load" onclick="bzLoad('+i+')">載入此盤</span></div>';
 }).join('')+'</div>';
}
function bzSave(){
 var y=bzWheelCtl.y.get(),m=bzWheelCtl.m.get(),d=bzWheelCtl.d.get(),h=bzWheelCtl.h.get(),mi=bzWheelCtl.mi.get(),sex=bzWheelCtl.sex.get();
 var nm=(bzVal('bzNameInput')||'').trim();
 if(!nm){nm=prompt('為此命盤命名（僅存於本機）：',y+'-'+m+'-'+d);if(nm===null)return;}
 var saves=bzSaves();
 saves.push({name:nm||(y+'-'+m+'-'+d),y:y,m:m,d:d,h:h,mi:mi,sex:sex,bp:bzVal('bzBirthPlace'),lp:bzVal('bzLivePlace'),cal:BZ_STATE.cal,ts:Date.now()});
 localStorage.setItem('jm_bazi_saves',JSON.stringify(saves));
 bzRenderSaves();
}
function bzLoad(i){
 var s=bzSaves()[i];if(!s)return;
 document.getElementById('bzNameInput').value=s.name||'';
 document.getElementById('bzBirthPlace').value=s.bp||'';
 document.getElementById('bzLivePlace').value=s.lp||'';
 var mode=s.cal||'solar';
 if(BZ_STATE.cal!==mode)bzSetCal(mode);
 bzWheelCtl.y.set(s.y);
 if(mode==='lunar'){bzBuildWheelItems('m',bzMonthItemsLunar(+s.y),s.m);bzResync('m',s.m);}
 else bzWheelCtl.m.set(s.m);
 bzRefreshDays(s.d);
 bzWheelCtl.h.set(s.h);bzWheelCtl.mi.set(s.mi);bzWheelCtl.sex.set(s.sex);
 baziCalc();
}
function bzDelete(i){
 var saves=bzSaves();saves.splice(i,1);localStorage.setItem('jm_bazi_saves',JSON.stringify(saves));bzRenderSaves();
}
function bzRoundRect(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
function bzShare(){
 var box=document.getElementById('bzShare');if(!box)return;
 var name=(bzVal('bzNameInput')||'').trim();
 var link=location.origin+location.pathname+'?invite='+encodeURIComponent(name)+'#bzform';
 var W=620,H=940,cv=document.createElement('canvas'),ctx;cv.width=W;cv.height=H;ctx=cv.getContext('2d');
 var g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#EFE8DA');g.addColorStop(1,'#E3DAC8');
 ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 ctx.strokeStyle='rgba(168,136,78,0.55)';ctx.lineWidth=1.5;ctx.strokeRect(28,28,W-56,H-56);
 ctx.strokeStyle='rgba(168,136,78,0.28)';ctx.strokeRect(37,37,W-74,H-74);
 ctx.textAlign='center';
 ctx.fillStyle='#8a7a5e';ctx.font="300 20px Georgia,serif";
 ctx.fillText('JINGMING DAO · BUZHISHANFANG',W/2,84);
 ctx.fillStyle='#241E15';ctx.font="42px 'JM Kaiti',serif";
 ctx.fillText('誠 邀 填 寫 八 字',W/2,178);
 ctx.fillStyle='#A63A2E';ctx.font="italic 22px Georgia,serif";
 ctx.fillText('Bazi Chart Invitation',W/2,221);
 ctx.fillStyle='#4a4034';ctx.font="27px 'JM Kaiti',serif";
 ctx.fillText('道友「'+(name||'淨明')+'」誠邀您',W/2,296);
 ctx.fillText('填寫生辰八字，共參曆數、同修淨明。',W/2,336);
 ctx.fillStyle='#8a7a5e';ctx.font="italic 19px Georgia,serif";
 ctx.fillText('Your fellow cultivator invites you',W/2,382);
 ctx.fillText('to complete your Bazi chart.',W/2,412);
 var qrSize=300,qx=(W-qrSize)/2,qy=452;
 ctx.fillStyle='#FBF7EE';bzRoundRect(ctx,qx-18,qy-18,qrSize+36,qrSize+36,18);ctx.fill();
 var qr=qrcode(0,'M');qr.addData(link);qr.make();
 var cnt=qr.getModuleCount(),cell=qrSize/cnt;
 ctx.fillStyle='#241E15';
 for(var r=0;r<cnt;r++)for(var c=0;c<cnt;c++)if(qr.isDark(r,c))ctx.fillRect(qx+c*cell,qy+r*cell,Math.ceil(cell),Math.ceil(cell));
 ctx.fillStyle='#8a7a5e';ctx.font="16px Georgia,serif";
 ctx.fillText(link.replace(/^https?:\/\//,''),W/2,qy+qrSize+50);
 ctx.fillStyle='#A63A2E';ctx.font="24px 'JM Kaiti',serif";
 ctx.fillText('淨明宗 · 不知山房',W/2,874);
 ctx.fillStyle='#8a7a5e';ctx.font="15px Georgia,serif";
 ctx.fillText('EST. 2026 · PURE BRIGHTNESS',W/2,902);
 box.innerHTML='<div class="bz-share-h">邀請卡 Invitation Card<span>長按圖片可保存、分享</span></div><div class="bz-share-wrap"></div>';
 box.querySelector('.bz-share-wrap').appendChild(cv);
 box.scrollIntoView({block:'start'});
}
/* 暴露到全局 */
window.renderDailyWord=renderDailyWord;
window.renderCultivate=renderCultivate;
window.renderZhangjue=renderZhangjue;window.zjSelect=zjSelect;window.zjRel=zjRel;window.zjClear=zjClear;
window.renderBaziForm=renderBaziForm;window.baziCalc=baziCalc;
window.bzSave=bzSave;window.bzLoad=bzLoad;window.bzDelete=bzDelete;window.bzRenderSaves=bzRenderSaves;window.bzShare=bzShare;
window.bzWheelCtl=bzWheelCtl;window.bzSetCal=bzSetCal;
window.hitInstrument=hitInstrument;
window.switchInstrument=switchInstrument;
window.resetInstrument=resetInstrument;
window.zuoSet=zuoSet;window.zuoToggle=zuoToggle;
window.renderAlmanac=renderAlmanac;window.getTaisui=getTaisui;
})();
