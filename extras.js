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
var S2T={"东":"東","丧":"喪","为":"為","乌":"烏","习":"習","乡":"鄉","于":"於","亏":"虧","产":"產","亲":"親","仓":"倉","会":"會","佣":"傭","傩":"儺","养":"養","兽":"獸","冻":"凍","凉":"涼","剑":"劍","动":"動","医":"醫","华":"華","厉":"厲","厕":"廁","参":"參","发":"發","启":"啟","坏":"壞","坚":"堅","坟":"墳","墙":"牆","声":"聲","处":"處","头":"頭","娄":"婁","学":"學","宁":"寧","宾":"賓","寝":"寢","寿":"壽","尝":"嘗","帐":"帳","带":"帶","并":"並","庙":"廟","开":"開","张":"張","强":"強","归":"歸","执":"執","扫":"掃","挚":"摯","敌":"敵","斋":"齋","断":"斷","无":"無","时":"時","晓":"曉","机":"機","来":"來","杨":"楊","桥":"橋","梁":"樑","泽":"澤","涂":"塗","润":"潤","涧":"澗","渐":"漸","渔":"漁","温":"溫","满":"滿","灯":"燈","灶":"竈","灾":"災","炉":"爐","猎":"獵","猪":"豬","獭":"獺","电":"電","疮":"瘡","盖":"蓋","祸":"禍","种":"種","竖":"豎","筑":"築","纳":"納","织":"織","经":"經","结":"結","绘":"繪","络":"絡","网":"網","肃":"肅","肠":"腸","胜":"勝","腊":"臘","艺":"藝","节":"節","药":"藥","莲":"蓮","萤":"螢","虫":"蟲","蚁":"蟻","蛰":"蟄","蜡":"蠟","蝈":"蟈","蝉":"蟬","蝼":"螻","补":"補","见":"見","观":"觀","订":"訂","讼":"訟","词":"詞","诸":"諸","谢":"謝","负":"負","财":"財","货":"貨","贶":"貺","车":"車","轸":"軫","还":"還","进":"進","远":"遠","酱":"醬","针":"針","钏":"釧","钗":"釵","钻":"鑽","锋":"鋒","长":"長","门":"門","闭":"閉","问":"問","闰":"閏","阳":"陽","阴":"陰","难":"難","雳":"靂","顺":"順","颠":"顛","风":"風","饰":"飾","马":"馬","驱":"驅","驿":"驛","鱼":"魚","鸟":"鳥","鸠":"鳩","鸡":"雞","鸣":"鳴","鸿":"鴻","鹊":"鵲","鹖":"鶡","鹰":"鷹","麦":"麥","黄":"黃","龙":"龍","惊":"驚","毕":"畢","气":"氣","残":"殘","殓":"殮"};
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
/* 木魚：短促沉實的「叩」 */
function playMuyu(){
  var c=audioCtx();if(!c)return;var t=c.currentTime;
  var o=c.createOscillator(),g=c.createGain();
  o.type='sine';o.frequency.setValueAtTime(215,t);o.frequency.exponentialRampToValueAtTime(118,t+0.13);
  g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.95,t+0.005);g.gain.exponentialRampToValueAtTime(0.0001,t+0.24);
  o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+0.26);
  var n=c.createBufferSource();n.buffer=noiseBuf(c,0.045);
  var bp=c.createBiquadFilter();bp.type='bandpass';bp.frequency.value=1150;bp.Q.value=1.1;
  var ng=c.createGain();ng.gain.setValueAtTime(0.55,t);ng.gain.exponentialRampToValueAtTime(0.0001,t+0.05);
  n.connect(bp);bp.connect(ng);ng.connect(c.destination);n.start(t);n.stop(t+0.05);
  var o2=c.createOscillator(),g2=c.createGain();o2.type='triangle';o2.frequency.setValueAtTime(430,t);
  g2.gain.setValueAtTime(0.32,t);g2.gain.exponentialRampToValueAtTime(0.0001,t+0.08);
  o2.connect(g2);g2.connect(c.destination);o2.start(t);o2.stop(t+0.1);
  vibrate(16);
}
/* 玉磬：清越悠長的金屬泛音 */
function playQing(){
  var c=audioCtx();if(!c)return;var t=c.currentTime,base=852;
  var partials=[[1,1,2.8],[2.01,0.5,2.4],[2.76,0.34,2.0],[3.01,0.26,1.5],[4.17,0.16,1.7],[5.43,0.1,1.3]];
  partials.forEach(function(p){
    var o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.value=base*p[0];
    g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.26*p[1],t+0.012);g.gain.exponentialRampToValueAtTime(0.0001,t+p[2]);
    o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+p[2]+0.1);
  });
  vibrate(26);
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
   '</div>';
  switchInstrument('muyu');renderZuoStats();renderShichen();
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

/* 暴露到全局 */
window.renderDailyWord=renderDailyWord;
window.renderCultivate=renderCultivate;
window.hitInstrument=hitInstrument;
window.switchInstrument=switchInstrument;
window.resetInstrument=resetInstrument;
window.zuoSet=zuoSet;window.zuoToggle=zuoToggle;
window.renderAlmanac=renderAlmanac;window.getTaisui=getTaisui;
})();
