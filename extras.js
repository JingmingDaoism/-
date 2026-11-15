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
var S2T={"专":"專","临":"臨","仪":"儀","军":"軍","击":"擊","匮":"匱","单":"單","厌":"厭","圣":"聖","宝":"寶","对":"對","岁":"歲","床":"牀","废":"廢","权":"權","枢":"樞","玑":"璣","灭":"滅","离":"離","愿":"願","护":"護","挂":"掛","摄":"攝","穷":"窮","纯":"純","绝":"絕","续":"續","绿":"綠","触":"觸","贞":"貞","败":"敗","贪":"貪","贼":"賊","轩":"軒","辅":"輔","辕":"轅","错":"錯","阵":"陣","陈":"陳","隐":"隱","余":"餘","冲":"沖","复":"復","虚":"虛","禄":"祿","摇":"搖","将":"將","宫":"宮","户":"戶","游":"遊","雇":"僱","东":"東","丧":"喪","为":"為","乌":"烏","习":"習","乡":"鄉","于":"於","亏":"虧","杀":"殺","伤":"傷","产":"產","亲":"親","仓":"倉","会":"會","佣":"傭","傩":"儺","养":"養","兽":"獸","冻":"凍","凉":"涼","剑":"劍","动":"動","医":"醫","华":"華","厉":"厲","厕":"廁","参":"參","发":"發","启":"啟","坏":"壞","坚":"堅","坟":"墳","墙":"牆","声":"聲","处":"處","头":"頭","娄":"婁","学":"學","宁":"寧","宾":"賓","寝":"寢","寿":"壽","尝":"嘗","帐":"帳","带":"帶","并":"並","庙":"廟","开":"開","张":"張","强":"強","归":"歸","执":"執","扫":"掃","挚":"摯","敌":"敵","斋":"齋","断":"斷","无":"無","时":"時","晓":"曉","机":"機","来":"來","杨":"楊","桥":"橋","梁":"樑","泽":"澤","涂":"塗","润":"潤","涧":"澗","渐":"漸","渔":"漁","温":"溫","满":"滿","灯":"燈","灶":"竈","灾":"災","炉":"爐","猎":"獵","猪":"豬","獭":"獺","电":"電","疮":"瘡","盖":"蓋","祸":"禍","种":"種","竖":"豎","筑":"築","纳":"納","织":"織","经":"經","结":"結","绘":"繪","络":"絡","网":"網","肃":"肅","肠":"腸","胜":"勝","腊":"臘","艺":"藝","节":"節","药":"藥","莲":"蓮","萤":"螢","虫":"蟲","蚁":"蟻","蛰":"蟄","蜡":"蠟","蝈":"蟈","蝉":"蟬","蝼":"螻","补":"補","见":"見","观":"觀","订":"訂","讼":"訟","词":"詞","诸":"諸","谢":"謝","负":"負","财":"財","货":"貨","贶":"貺","车":"車","轸":"軫","还":"還","进":"進","远":"遠","酱":"醬","针":"針","钏":"釧","钗":"釵","钻":"鑽","锋":"鋒","长":"長","门":"門","闭":"閉","问":"問","闰":"閏","阳":"陽","阴":"陰","难":"難","雳":"靂","顺":"順","颠":"顛","风":"風","饰":"飾","马":"馬","驱":"驅","驿":"驛","鱼":"魚","鸟":"鳥","鸠":"鳩","鸡":"雞","鸣":"鳴","鸿":"鴻","鹊":"鵲","鹖":"鶡","鹰":"鷹","麦":"麥","黄":"黃","龙":"龍","惊":"驚","毕":"畢","气":"氣","残":"殘","殓":"殮"};
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
    var zhiLuck=s2t(L.getDayTianShenLuck());
    var cells=[
      ['建除',s2t(L.getZhiXing())],
      ['值神',s2t(L.getDayTianShen())+'<small>'+s2t(L.getDayTianShenType())+' · '+zhiLuck+'</small>'],
      ['二十八宿',s2t(L.getXiu()+L.getZheng()+L.getAnimal())],
      ['六曜',s2t(L.getLiuYao())],
      ['空亡',s2t(L.getDayXunKong())],
      ['日祿',s2t(L.getDayLu())],
      ['沖煞','沖'+s2t(L.getDayChongDesc()).replace(/[()（）]/g,'')+'　煞'+s2t(L.getDaySha())],
      ['值年太歲',ts?ts.name:'—']
    ];
    html+='<div class="al-grid">'+cells.map(function(c){return '<div class="al-cell"><span class="alc-k">'+c[0]+'</span><span class="alc-v">'+c[1]+'</span></div>';}).join('')+'</div>';
    var ns=L.getDayNineStar(),men=ns.getBaMenInQiMen();
    html+='<div class="al-ns">'+
      '<div class="ans-k">日九星 · 玄空飛星 <i>Nine Star</i></div>'+
      '<div class="ans-row"><span class="ans-main"><b>'+s2t(ns.getNameInXuanKong())+'</b>'+s2t(ns.getColor())+' · '+s2t(ns.getWuXing())+'</span>'+
      '<span class="ans-luck '+(/吉/.test(ns.getLuckInQiMen())?'good':(/凶/.test(ns.getLuckInQiMen())?'bad':''))+'">'+s2t(ns.getLuckInQiMen())+'</span></div>'+
      '<div class="ans-sub">奇門 '+s2t(ns.getNameInQiMen())+' · '+(men?s2t(men)+'門':'中宮無門')+'　｜　北斗 '+s2t(ns.getNameInBeiDou())+'</div>'+
    '</div>';
    html+=alTag('js','吉神宜趨',(L.getDayJiShen()||[]).map(s2t));
    html+=alTag('xs','凶神宜忌',(L.getDayXiongSha()||[]).map(s2t));
    html+=alTag('yi','宜',(L.getDayYi()||[]).map(s2t));
    html+=alTag('ji','忌',(L.getDayJi()||[]).map(s2t));
    var pos=[];
    if(L.getDayPositionXiDesc)pos.push(['喜神',s2t(L.getDayPositionXiDesc())]);
    if(L.getDayPositionCaiDesc)pos.push(['財神',s2t(L.getDayPositionCaiDesc())]);
    if(L.getDayPositionFuDesc)pos.push(['福神',s2t(L.getDayPositionFuDesc())]);
    if(L.getDayPositionYangGuiDesc)pos.push(['陽貴',s2t(L.getDayPositionYangGuiDesc())]);
    if(L.getDayPositionYinGuiDesc)pos.push(['陰貴',s2t(L.getDayPositionYinGuiDesc())]);
    if(L.getDayPositionTaiSuiDesc)pos.push(['太歲',s2t(L.getDayPositionTaiSuiDesc())]);
    html+='<div class="al-row"><span class="al-k">神方位</span><span class="al-v al-pos">'+pos.map(function(p){return '<i><b>'+p[0]+'</b>'+p[1]+'</i>';}).join('')+'</span></div>';
    var mini=[];
    if(L.getWuHou())mini.push(['物候',s2t(L.getWuHou())]);
    if(L.getYueXiang())mini.push(['月相',s2t(L.getYueXiang())]);
    if(L.getShuJiu())mini.push(['數九',s2t(L.getShuJiu())]);
    if(L.getFu())mini.push(['伏日',s2t(L.getFu())]);
    if(mini.length)html+='<div class="al-mini">'+mini.map(function(p){return '<span><b>'+p[0]+'</b>'+p[1]+'</span>';}).join('')+'</div>';
    html+='<div class="al-pengzu"><span>彭祖百忌</span>'+s2t(L.getPengZuGan())+'；'+s2t(L.getPengZuZhi())+'</div>';
    html+='<div class="al-foot">黃曆供擇吉參考，淨明弟子以修心積德為本，「天道無親，常與善人」。</div>';
    box.innerHTML=html;
  }catch(e){if(window&&window.console)console.error('almanac',e);box.innerHTML='<div class="empty-state"><div class="empty-char">曆</div><div class="empty-txt">是日黃曆暫缺</div></div>';}
}

/* ============================================================
   擇日助手（lunar.js 宜忌 + 黃道/建除/六曜/九星評級）
   ============================================================ */
var ZEJI_TASKS=[
 {k:'marry',zh:'嫁娶',en:'Wedding',m:['嫁娶']},
 {k:'betroth',zh:'納采',en:'Betrothal',m:['纳采','纳婿']},
 {k:'open',zh:'開市',en:'Business Open',m:['开市','立券','交易']},
 {k:'movein',zh:'入宅',en:'Move In',m:['入宅']},
 {k:'move',zh:'移徙',en:'Moving',m:['移徙']},
 {k:'bed',zh:'安床',en:'An Chuang',m:['安床']},
 {k:'break',zh:'動土',en:'Groundbreaking',m:['动土']},
 {k:'build',zh:'修造',en:'Renovation',m:['修造','盖屋','起基']},
 {k:'travel',zh:'出行',en:'Travel',m:['出行']},
 {k:'bury',zh:'安葬',en:'Burial',m:['安葬','入殓']},
 {k:'worship',zh:'祭祀',en:'Worship',m:['祭祀']},
 {k:'pray',zh:'祈福',en:'Blessing',m:['祈福']},
 {k:'consecrate',zh:'開光',en:'Consecration',m:['开光']},
 {k:'engage',zh:'訂盟',en:'Engagement',m:['订盟','纳采']},
 {k:'deal',zh:'交易',en:'Sign Deal',m:['交易','立券']},
 {k:'office',zh:'赴任',en:'Take Office',m:['赴任','就职']},
 {k:'bath',zh:'沐浴',en:'Bath',m:['沐浴']},
 {k:'hair',zh:'剃頭',en:'Haircut',m:['剃头']}
];
var ZEJI_PICKED=null;
function zejiGrade(sc){
 if(sc>=4)return {t:'上吉',en:'AUSPICE',c:'g3'};
 if(sc>=2)return {t:'吉日',en:'FAVORABLE',c:'g2'};
 return {t:'平日',en:'ORDINARY',c:'g1'};
}
function zejiScan(matchWords){
 var out=[],now=new Date();
 for(var i=0;i<75;i++){
  var dt=new Date(now.getFullYear(),now.getMonth(),now.getDate()+i);
  var L=window.Solar.fromYmd(dt.getFullYear(),dt.getMonth()+1,dt.getDate()).getLunar();
  var yi=L.getDayYi()||[];
  var hit=matchWords.some(function(w){return yi.indexOf(w)>=0;});
  if(!hit)continue;
  var sc=0;
  sc+=(L.getDayTianShenLuck()==='吉')?2:-1;
  var zx=L.getZhiXing();
  if(zx==='成'||zx==='开')sc+=2;else if(['除','危','定','执'].indexOf(zx)>=0)sc+=1;else if(zx==='破'||zx==='闭')sc-=2;
  var ly=L.getLiuYao();
  if(ly==='大安'||ly==='友引')sc+=1;else if(ly==='佛灭'||ly==='赤口')sc-=1;
  var xs=L.getDayXiongSha()||[];
  if(xs.some(function(x){return /月破|大耗|四废|五墓|劫煞|灾煞|月厌|大时/.test(x);}))sc-=1;
  var nsl=L.getDayNineStar().getLuckInQiMen();
  if(/大吉/.test(nsl))sc+=1;else if(/大凶/.test(nsl))sc-=1;
  if(sc<0)continue;
  out.push({dt:dt,L:L,sc:sc});
 }
 return out.slice(0,15);
}
function renderZeji(){
 var mount=document.getElementById('zejiMount');if(!mount)return;
 mount.innerHTML='<div class="sec-label"><span class="dot"></span><span class="zh">擇日助手</span><span class="en">Auspicious Date</span><span class="line"></span></div>'+
  '<div class="zj-hint">擇一事宜，為君揀選未來七十五日內「宜行此事」之日，依黃道、建除、六曜、九星評其吉級。</div>'+
  '<div class="zj-chips">'+ZEJI_TASKS.map(function(t){return '<button class="zj-chip" data-k="'+t.k+'" onclick="zejiRun(\''+t.k+'\')">'+t.zh+'<span>'+t.en+'</span></button>';}).join('')+'</div>'+
  '<div id="zejiResult"><div class="zj-empty">請先選擇上方事宜</div></div>';
}
function zejiRun(k){
 ZEJI_PICKED=k;
 document.querySelectorAll('.zj-chip').forEach(function(c){c.classList.toggle('on',c.dataset.k===k);});
 var task=ZEJI_TASKS.filter(function(t){return t.k===k;})[0];
 var rows=zejiScan(task.m);
 var box=document.getElementById('zejiResult');
 if(!rows.length){box.innerHTML='<div class="zj-empty">未來七十五日內罕見專宜「'+task.zh+'」之日，可放寬事宜或再向後查詢。</div>';return;}
 var wk='日一二三四五六';
 box.innerHTML='<div class="zj-list-h">「'+task.zh+'」擇日 · 共 '+rows.length+' 個可行日 <i>'+task.en+'</i></div>'+
  rows.map(function(r){
   var dt=r.dt,L=r.L,g=zejiGrade(r.sc);
   var wd=wk[dt.getDay()];
   var lunarTxt=s2t(L.getMonthInChinese())+'月'+s2t(L.getDayInChinese());
   var gzD=s2t(L.getDayInGanZhi());
   var tags=[s2t(L.getDayTianShen()),s2t(L.getZhiXing()),s2t(L.getLiuYao())].join(' · ');
   return '<button class="zj-day '+g.c+'" onclick="zejiGo('+dt.getFullYear()+','+(dt.getMonth()+1)+','+dt.getDate()+')">'+
     '<span class="zjd-grade"><b>'+g.t+'</b><i>'+g.en+'</i></span>'+
     '<span class="zjd-main"><span class="zjd-solar">'+(dt.getMonth()+1)+'月'+dt.getDate()+'日　星期'+wd+'</span>'+
     '<span class="zjd-lunar">農曆'+lunarTxt+' · '+gzD+'日 · '+tags+'</span></span>'+
     '<span class="zjd-go">詳 →</span></button>';
  }).join('');
}
/* ============================================================
   左手掌訣教學（十二辰掌：三合、六合、六沖、馬星）
   ============================================================ */
var ZJ_ORDER=['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
var ZJ_POS={
 寅:[128,129],卯:[128,104],辰:[128,73],巳:[128,38],
 午:[152,26],丑:[152,130],
 未:[177,36],子:[177,132],
 申:[206,66],酉:[206,99],戌:[206,117],亥:[206,139]};
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
  intro:'辰，震也，暮春土旺、胃經当令。辰在食指上節，掌訣起手常自辰巳；此時宜進早齋，清淡養胃。'},
 巳:{en:'Si',sc:'09:00–11:00',sx:'蛇',wx:'火',fx:'東南偏南',yue:'四月',jl:'脾經 · 足太陰脾',jq:'立夏 · 小滿',gua:'巽卦 · 東南',
  intro:'巳，火氣漸盛、脾經當令。巳在食指尖，掐之通神明、助思慮；此時精神飽滿，宜辦事誦持。'},
 午:{en:'Wu',sc:'11:00–13:00',sx:'馬',wx:'火',fx:'正南',yue:'五月',jl:'心經 · 手少陰心',jq:'芒種 · 夏至',gua:'離卦 · 正南',
  intro:'午，交也，夏至一陰初生、正南離火。午在中指尖，心經當令宜靜；午時小憩、不喧不躁，以養心神。'},
 未:{en:'Wei',sc:'13:00–15:00',sx:'羊',wx:'土',fx:'西南偏南',yue:'六月',jl:'小腸經 · 手太陽小腸',jq:'小暑 · 大暑',gua:'坤卦 · 西南',
  intro:'未，味也，六月土旺、小腸經當令。未在無名指尖，掐之分清泌濁；飯後宜緩行，不宜貪涼。'},
 申:{en:'Shen',sc:'15:00–17:00',sx:'猴',wx:'金',fx:'西南偏西',yue:'七月',jl:'膀胱經 · 足太陽膀胱',jq:'立秋 · 處暑',gua:'坤卦 · 西南',
  intro:'申，身也，七月金旺、膀胱經當令。申在小指尖，為水液通道；此時宜多飲溫水、通利水道。'},
 酉:{en:'You',sc:'17:00–19:00',sx:'雞',wx:'金',fx:'正西',yue:'八月',jl:'腎經 · 足少陰腎',jq:'白露 · 秋分',gua:'兌卦 · 正西',
  intro:'酉，老也，八月金旺、腎經當令，酉為月出之門。酉在小指上節，掐之納西嶽金氣；此時宜收斂、藏精納氣。'},
 戌:{en:'Xu',sc:'19:00–21:00',sx:'狗',wx:'土',fx:'西北偏西',yue:'九月',jl:'心包經 · 手厥陰心包',jq:'寒露 · 霜降',gua:'乾卦 · 西北',
  intro:'戌，滅也，九月土旺、心包當令，戌為閉藏之門。戌在小指下節，掐之護心安神；此時宜靜處、準備就寢。'},
 亥:{en:'Hai',sc:'21:00–23:00',sx:'豬',wx:'水',fx:'西北偏北',yue:'十月',jl:'三焦經 · 少陽三焦',jq:'立冬 · 小雪',gua:'乾卦 · 西北',
  intro:'亥，核也，十月水旺、三焦當令，亥為坤陰之極。亥在小指根，掐之調和百脈；此時宜安眠，百脈歸元。'}};
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
 return '<svg viewBox="0 0 300 300" class="zj-svg" xmlns:xlink="http://www.w3.org/1999/xlink">'+
 '<defs><marker id="zjArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#A8884E"/></marker></defs>'+
 '<image href="assets/img/zj-hand-1.png" xlink:href="assets/img/zj-hand-1.png" x="0" y="0" width="300" height="300" preserveAspectRatio="xMidYMid meet"/>'+
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
 document.getElementById('zjDots').innerHTML=ZJ_ORDER.map(function(z){var p=ZJ_POS[z];
  return '<circle class="zj-ring" id="zjr-'+z+'" cx="'+p[0]+'" cy="'+p[1]+'" r="13.5"/>'+
   '<text class="zj-txt" id="zjt-'+z+'" x="'+p[0]+'" y="'+p[1]+'">'+z+'</text>'+
   '<circle class="zj-hit" cx="'+p[0]+'" cy="'+p[1]+'" r="16" onclick="zjSelect(\''+z+'\')"/>';}).join('');
}
function zjDotOn(z,on){var r=document.getElementById('zjr-'+z),t=document.getElementById('zjt-'+z);if(r)r.classList.toggle('on',on);if(t)t.classList.toggle('on',on);}
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
var BZ_JU={申:'水',子:'水',辰:'水',寅:'火',午:'火',戌:'火',巳:'金',酉:'金',丑:'金',亥:'木',卯:'木',未:'木'};
var BZ_JU_STAR={
 水:{ma:'寅',tao:'酉',hua:'辰',jiang:'子',jie:'巳',wang:'亥',zai:'午'},
 火:{ma:'申',tao:'卯',hua:'戌',jiang:'午',jie:'亥',wang:'巳',zai:'子'},
 金:{ma:'亥',tao:'午',hua:'丑',jiang:'酉',jie:'寅',wang:'申',zai:'卯'},
 木:{ma:'巳',tao:'子',hua:'未',jiang:'卯',jie:'申',wang:'寅',zai:'酉'}
};
var BZ_FANG={亥:'a',子:'a',丑:'a',寅:'b',卯:'b',辰:'b',巳:'c',午:'c',未:'c',申:'d',酉:'d',戌:'d'};
var BZ_GUGUA={a:['寅','戌'],b:['巳','丑'],c:['申','辰'],d:['亥','未']};
var BZ_TAIJI={甲:['子','午'],乙:['子','午'],丙:['卯','酉'],丁:['卯','酉'],戊:['辰','戌','丑','未'],己:['辰','戌','丑','未'],庚:['寅','亥'],辛:['寅','亥'],壬:['巳','申'],癸:['巳','申']};
var BZ_XUETANG={甲:'亥',乙:'午',丙:'寅',丁:'酉',戊:'巳',己:'酉',庚:'巳',辛:'子',壬:'申',癸:'卯'};
var BZ_KUIGANG=['壬辰','庚戌','庚辰','戊戌'];
function bzShenSha(ec){
 var dg=ec.getDayGan(),dz=ec.getDayZhi();
 var GANS=['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'],ZHIS=['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
 var JIAZI=[];for(var i=0;i<60;i++)JIAZI.push(GANS[i%10]+ZHIS[i%12]);
 var di=JIAZI.indexOf(ec.getDay()),xun=Math.floor(di/10)*10;
 var kongs=[ZHIS[(xun+10)%12],ZHIS[(xun+11)%12]];
 var cols=[['年柱',ec.getYear().charAt(1)],['月柱',ec.getMonth().charAt(1)],['日柱',ec.getDay().charAt(1)],['時柱',ec.getTime().charAt(1)]];
 var ju=BZ_JU_STAR[BZ_JU[dz]],gg=BZ_GUGUA[BZ_FANG[dz]];
 var hits=[];
 cols.forEach(function(c){
  var z=c[1],ns=[];
  if(SS_TIANYI[dg]&&SS_TIANYI[dg].indexOf(z)>=0)ns.push('天乙貴人');
  if(SS_WENCHANG[dg]===z)ns.push('文昌貴人');
  if(SS_YANGREN[dg]===z)ns.push('羊刃');
  if(SS_HONGYAN[dg]===z)ns.push('紅艷');
  if(SS_JINYU[dg]===z)ns.push('金輿');
  if(BZ_TAIJI[dg]&&BZ_TAIJI[dg].indexOf(z)>=0)ns.push('太極貴人');
  if(BZ_XUETANG[dg]===z)ns.push('學堂');
  if(ju){
   if(z===ju.ma)ns.push('驛馬');
   if(z===ju.tao)ns.push('桃花');
   if(z===ju.hua)ns.push('華蓋');
   if(z===ju.jiang)ns.push('將星');
   if(z===ju.jie)ns.push('劫煞');
   if(z===ju.wang)ns.push('亡神');
   if(z===ju.zai)ns.push('災煞');
  }
  if(gg){
   if(z===gg[0])ns.push('孤辰');
   if(z===gg[1])ns.push('寡宿');
  }
  if(kongs.indexOf(z)>=0)ns.push('空亡');
  ns.forEach(function(n){hits.push({n:n,p:c[0]});});
 });
 /* 月德貴人：按月支三合局查四柱天干（寅午戌丙、申子辰壬、亥卯未甲、巳酉丑庚） */
 var mJu=BZ_JU[ec.getMonth().charAt(1)],yueDe={火:'丙',水:'壬',木:'甲',金:'庚'}[mJu];
 var ganCols=[['年柱',ec.getYear().charAt(0)],['月柱',ec.getMonth().charAt(0)],['日柱',dg],['時柱',ec.getTime().charAt(0)]];
 if(yueDe)ganCols.forEach(function(c){if(c[1]===yueDe)hits.push({n:'月德貴人',p:c[0]});});
 /* 魁罡：壬辰、庚戌、庚辰、戊戌四日 */
 if(BZ_KUIGANG.indexOf(ec.getDay())>=0)hits.push({n:'魁罡',p:'日柱'});
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
var BZ_YUN=null;
function bzLnHtml(idx){
 var d=BZ_YUN.dys[idx],dayGan=BZ_YUN.dayGan,nowY=BZ_YUN.nowY;
 return d.getLiuNian(10).map(function(l){
  var gz=l.getGanZhi(),on=l.getYear()===nowY;
  return '<div class="bz-ln'+(on?' on':'')+'"><div class="ln-year">'+l.getYear()+'</div><div class="ln-age">'+l.getAge()+'歲</div><div class="ln-gz">'+gz+'</div><div class="ln-ss">'+bzShiShen(dayGan,gz.charAt(0))+'</div></div>';
 }).join('');
}
function bzShowLiuNian(idx){
 if(!BZ_YUN||!BZ_YUN.dys[idx])return;
 BZ_YUN.sel=idx;
 var dys=document.querySelectorAll('.bz-dy');
 dys.forEach(function(el,i){el.classList.toggle('on',(i+1)===idx);});
 var box=document.getElementById('bzLnBox');if(box)box.innerHTML=bzLnHtml(idx);
}
function bzYunHtml(ec,sex){
 var gc=sex==='男'?1:0,yun=ec.getYun(gc,1),dayGan=ec.getDayGan();
 var dys=yun.getDaYun(9),nowY=new Date().getFullYear(),curIdx=1;
 for(var i=1;i<dys.length;i++){if(dys[i].getStartYear()<=nowY&&nowY<=dys[i].getEndYear())curIdx=i;}
 BZ_YUN={dys:dys,dayGan:dayGan,nowY:nowY,sel:curIdx};
 var st=yun.getStartSolar();
 var head='<div class="bz-yun-head">起運 約 '+dys[curIdx].getStartAge()+'歲前後 · '+st.getYear()+'年'+st.getMonth()+'月'+st.getDay()+'日 · '+(yun.isForward()?'順行':'逆行')+'</div>';
 var steps=dys.slice(1).map(function(d){
  var gz=d.getGanZhi(),g=gz.charAt(0),z=gz.charAt(1),on=d.getIndex()===curIdx;
  return '<div class="bz-dy'+(on?' on':'')+'" onclick="bzShowLiuNian('+d.getIndex()+')"><div class="dy-age">'+d.getStartAge()+'–'+d.getEndAge()+'歲</div><div class="dy-gz">'+g+'<span>'+bzShiShen(dayGan,g)+'</span></div><div class="dy-gz">'+z+'<span>'+bzShiShen(dayGan,BEN_GAN[z])+'</span></div><div class="dy-year">'+d.getStartYear()+'</div></div>';
 }).join('');
 return '<div class="bz-yun-h">大運 Da Yun</div>'+head+'<div class="bz-dys">'+steps+'</div><div class="bz-ln-h">流年 Liu Nian · 輕觸大運可切換</div><div class="bz-lns" id="bzLnBox">'+bzLnHtml(curIdx)+'</div>';
}
function bzRange(a,b){var r=[];for(var i=a;i<=b;i++)r.push(i);return r;}
/* ===== 滚轮 Picker ===== */
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
 /* tap-to-select (轻触即选；滑动不误判) */
 var drag=false,px=0,py=0,pTop=0;
 wheel.addEventListener('touchstart',function(e){drag=false;var t=e.touches[0];px=t.clientX;py=t.clientY;pTop=sc.scrollTop;},{passive:true});
 wheel.addEventListener('touchmove',function(e){var t=e.touches[0];if(Math.abs(t.clientX-px)>8||Math.abs(t.clientY-py)>8||Math.abs(sc.scrollTop-pTop)>10)drag=true;},{passive:true});
 wheel.addEventListener('click',function(e){
  if(drag)return;
  var it=e.target&&e.target.closest?e.target.closest('.wheel-item'):null;
  if(!it)return;
  setV(it.dataset.v,false);
 });
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
function bzDefaultForm(){var n=new Date();return {name:'',cal:'solar',y:n.getFullYear(),m:n.getMonth()+1,d:n.getDate(),h:n.getHours(),mi:n.getMinutes(),sex:'男',bp:'',lp:''};}
var BZ_FORM=bzDefaultForm();
var BZ_FIELDS=[
 {k:'name',t:'姓名',en:'NAME',type:'text',ph:'請填寫姓名'},
 {k:'y',t:'出生年',en:'YEAR',type:'wheel',items:function(){return bzYearItems();}},
 {k:'m',t:'月',en:'MONTH',type:'wheel',items:function(f){return f.cal==='solar'?bzMonthItemsSolar():bzMonthItemsLunar(+f.y);}},
 {k:'d',t:'日',en:'DAY',type:'wheel',items:function(f){var n=f.cal==='solar'?bzDaysSolar(+f.y,f.m):bzDaysLunar(f.y,f.m);return bzDayItems(n);}},
 {k:'h',t:'時',en:'HOUR',type:'wheel',items:function(){return bzHourItems();}},
 {k:'mi',t:'分',en:'MINUTE',type:'wheel',items:function(){return bzMinItems();}},
 {k:'sex',t:'性別',en:'SEX',type:'wheel',items:function(){return bzSexItems();}},
 {k:'bp',t:'出生地',en:'BIRTHPLACE',type:'text',ph:'省 · 市（選填）'},
 {k:'lp',t:'居住地',en:'RESIDENCE',type:'text',ph:'省 · 市（選填）'}
];
function bzValText(k){
 var f=BZ_FORM;
 if(k==='name')return f.name?'<span class="bv-txt">'+f.name+'</span>':'<span class="bv-ph">請填寫</span>';
 if(k==='bp')return f.bp?'<span class="bv-txt">'+f.bp+'</span>':'<span class="bv-ph">省 · 市</span>';
 if(k==='lp')return f.lp?'<span class="bv-txt">'+f.lp+'</span>':'<span class="bv-ph">省 · 市</span>';
 if(k==='y')return f.y+' 年';
 if(k==='m')return (f.cal==='lunar'&&String(f.m).charAt(0)==='-'?'閏'+(-f.m):f.m)+' 月';
 if(k==='d')return f.d+' 日';
 if(k==='h')return ('0'+f.h).slice(-2)+' 時';
 if(k==='mi')return ('0'+f.mi).slice(-2)+' 分';
 if(k==='sex')return f.sex+(f.sex==='男'?' Male':' Female');
 return '';
}
function bzClampDay(){
 var n=BZ_FORM.cal==='solar'?bzDaysSolar(+BZ_FORM.y,BZ_FORM.m):bzDaysLunar(BZ_FORM.y,BZ_FORM.m);
 if(+BZ_FORM.d>n)BZ_FORM.d=n;
}
function bzSetCal(mode){
 if(BZ_FORM.cal===mode)return;BZ_FORM.cal=mode;
 document.querySelectorAll('.bz-cal-mode span').forEach(function(s){s.classList.toggle('on',s.dataset.cal===mode);});
 bzClampDay();bzRenderRows();
}
function bzRenderRows(){BZ_FIELDS.forEach(function(f){var el=document.getElementById('bfv-'+f.k);if(el)el.innerHTML=bzValText(f.k);});}
function bzFrowHtml(f){
 return '<div class="bz-frow" onclick="bzOpen(\''+f.k+'\')"><span class="bf-label">'+f.t+'<em>'+f.en+'</em></span><span class="bf-val" id="bfv-'+f.k+'">'+bzValText(f.k)+'</span><span class="bf-chev"></span></div>';
}
function bzSheetHtml(){
 return '<div class="bz-mask" id="bzMask" onclick="bzClose()"></div>'+
 '<div class="bz-sheet" id="bzSheet"><div class="bs-bar"><span class="bs-cancel" onclick="bzClose()">取消</span><span class="bs-title" id="bsTitle"></span><span class="bs-ok" onclick="bzConfirm()">確認</span></div><div class="bs-body" id="bsBody"></div></div>';
}
function bzMountSheet(){if(!document.getElementById('bzSheet'))document.body.insertAdjacentHTML('beforeend',bzSheetHtml());}
function renderBaziForm(){
 var m=document.getElementById('baziMount');if(!m)return;
 m.innerHTML='<div class="bz-card">'+
  '<div class="bz-cal-mode bz-cal-top"><span data-cal="solar" class="on">公曆 Gregorian</span><span data-cal="lunar">農曆 Lunar</span></div>'+
  '<div class="bz-frows">'+BZ_FIELDS.map(bzFrowHtml).join('')+'</div>'+
  '<button class="bz-go" onclick="baziCalc()">排　盤　Chart</button>'+
  '<button class="bz-go bz-invite-go" onclick="bzShare()">邀請他人填寫 Invite</button>'+
  '<div id="bzResult"></div><div id="bzSaves"></div><div id="bzShare"></div></div>';
 document.querySelectorAll('.bz-cal-mode span').forEach(function(s){s.addEventListener('click',function(){bzSetCal(s.dataset.cal);});});
 bzRenderSaves();bzMountSheet();
}
var bzSheetCtl={key:null,get:null};
function bzOpen(key){
 var f=BZ_FIELDS.filter(function(x){return x.k===key;})[0];if(!f)return;
 bzSheetCtl.key=key;
 document.getElementById('bsTitle').innerHTML=f.t+' <em>'+f.en+'</em>';
 var body=document.getElementById('bsBody');
 if(f.type==='text'){
  body.innerHTML='<input class="bs-input" id="bsInput" placeholder="'+(f.ph||'')+'" value="'+(BZ_FORM[key]||'')+'">';
  setTimeout(function(){var i=document.getElementById('bsInput');if(i){i.focus();i.setSelectionRange(i.value.length,i.value.length);}},320);
  bzSheetCtl.get=function(){var i=document.getElementById('bsInput');return i?i.value.trim():'';};
 }else{
  var items=f.items(BZ_FORM);
  body.innerHTML='<div class="wheel" data-wheel-id="sheet"><div class="wheel-scroll"><div class="wheel-pad"></div><div class="wheel-items" data-items="sheet"></div><div class="wheel-pad"></div></div><div class="wheel-band"></div><div class="wheel-fade top"></div><div class="wheel-fade bot"></div></div>';
  bzBuildWheelItems('sheet',items,BZ_FORM[key]);
  bzInitWheel('sheet',BZ_FORM[key],null);
  bzSheetCtl.get=function(){return bzWheelCtl.sheet?bzWheelCtl.sheet.get():null;};
 }
 document.getElementById('bzMask').classList.add('on');
 document.getElementById('bzSheet').classList.add('on');
 document.body.classList.add('sheet-open');
}
function bzClose(){document.getElementById('bzMask').classList.remove('on');document.getElementById('bzSheet').classList.remove('on');document.body.classList.remove('sheet-open');}
function bzConfirm(){
 var key=bzSheetCtl.key,v=bzSheetCtl.get();
 if(v!==null&&v!==undefined&&v!==''){
  var num=(key==='y'||key==='d'||key==='h'||key==='mi');
  BZ_FORM[key]=num?+v:v;
  if(key==='y'&&BZ_FORM.cal==='lunar'){
   var leap=bzLunarYear(+BZ_FORM.y).getLeapMonth();
   if(String(BZ_FORM.m).charAt(0)==='-'&&leap!==(-BZ_FORM.m))BZ_FORM.m=1;
  }
  bzClampDay();bzRenderRows();
 }
 bzClose();
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
  var f=BZ_FORM;
  if(!window.Solar)throw new Error('曆庫未載入');
  var solar;
  if(f.cal==='solar'){
   solar=window.Solar.fromYmdHms(+f.y,+f.m,+f.d,+f.h,+f.mi,0);
  }else{
   var neg=String(f.m).charAt(0)==='-',mm=neg?-parseInt(f.m):parseInt(f.m);
   solar=window.Lunar.fromYmdHms(+f.y,mm,+f.d,+f.h,+f.mi,0).getSolar();
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
  var idBar='<div class="bz-idbar"><span class="nm">'+(f.name||'未命名')+'</span><span class="cal">'+(f.cal==='solar'?'公曆 Gregorian':'農曆 Lunar')+'</span>'+(f.bp?'<span>籍 '+f.bp+'</span>':'')+(f.lp?'<span>居 '+f.lp+'</span>':'')+'</div>';
  r.innerHTML=idBar+'<div class="bz-pillars">'+pillars.map(bzPilHtml).join('')+'</div>'+dm+
   '<div class="bz-sec-h">神煞 Shen Sha</div>'+bzShenShaHtml(ec)+
   '<div class="bz-wx-h">五行分佈 Five Phases</div><div class="bz-wxbar">'+bar+'</div><div class="bz-wxleg">'+leg+'</div>'+
   bzYunHtml(ec,f.sex)+
   '<div class="bz-btn-row"><button class="bz-save-btn" onclick="bzSave()">保存此命盤到本機 Save Chart</button>'+
   '<button class="bz-save-btn ghost" onclick="bzShareChart()">命盤分享卡 Chart Card</button></div>'+
   '<div class="bz-foot">※ 此為客觀排盤，供曆法與命理研習，不主吉凶禍福。「天道無親，常與善人」，命數終不若心地，淨明弟子但當忠敬孝悌、積德修持。</div>';
  BZ_LAST={ec:ec,f:Object.assign({},BZ_FORM),solar:solar,L:solar.getLunar(),cnt:cnt};
  setTimeout(function(){r.scrollIntoView({behavior:'smooth',block:'start'});},80);
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
 var f=BZ_FORM,nm=f.name;
 if(!nm){nm=prompt('為此命盤命名（僅存於本機）：',f.y+'-'+f.m+'-'+f.d);if(nm===null)return;}
 var saves=bzSaves();
 saves.push({name:nm||(f.y+'-'+f.m+'-'+f.d),y:f.y,m:f.m,d:f.d,h:f.h,mi:f.mi,sex:f.sex,bp:f.bp,lp:f.lp,cal:f.cal,ts:Date.now()});
 localStorage.setItem('jm_bazi_saves',JSON.stringify(saves));
 bzRenderSaves();
}
function bzLoad(i){
 var s=bzSaves()[i];if(!s)return;
 BZ_FORM={name:s.name||'',cal:s.cal||'solar',y:s.y,m:s.m,d:s.d,h:s.h,mi:s.mi,sex:s.sex,bp:s.bp||'',lp:s.lp||''};
 document.querySelectorAll('.bz-cal-mode span').forEach(function(sp){sp.classList.toggle('on',sp.dataset.cal===BZ_FORM.cal);});
 bzClampDay();bzRenderRows();
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
var BZ_LAST=null;
function bzShareChart(){
 var box=document.getElementById('bzShare');if(!box||!BZ_LAST)return;
 var ec=BZ_LAST.ec,f=BZ_LAST.f,L=BZ_LAST.L,cnt=BZ_LAST.cnt;
 var W=620,H=1180,cv=document.createElement('canvas'),ctx;cv.width=W;cv.height=H;ctx=cv.getContext('2d');
 var g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#EFE8DA');g.addColorStop(1,'#E2D9C7');
 ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 ctx.strokeStyle='rgba(168,136,78,0.55)';ctx.lineWidth=1.5;ctx.strokeRect(28,28,W-56,H-56);
 ctx.strokeStyle='rgba(168,136,78,0.28)';ctx.strokeRect(37,37,W-74,H-74);
 ctx.textAlign='center';
 ctx.fillStyle='#8a7a5e';ctx.font="300 20px Georgia,serif";ctx.fillText('JINGMING DAO · BUZHISHANFANG',W/2,86);
 ctx.fillStyle='#241E15';ctx.font="48px 'JM Kaiti',serif";ctx.fillText('命　盤',W/2,172);
 ctx.fillStyle='#A63A2E';ctx.font="italic 22px Georgia,serif";ctx.fillText('Bazi Destiny Chart',W/2,216);
 ctx.fillStyle='#241E15';ctx.font="32px 'JM Kaiti',serif";ctx.fillText((f.name||'未命名'),W/2,272);
 ctx.fillStyle='#6b604f';ctx.font="22px 'JM Kaiti',serif";
 ctx.fillText((f.cal==='solar'?'公曆 ':'農曆 ')+f.y+'年'+f.m+'月'+f.d+'日　'+f.h+':'+('0'+f.mi).slice(-2)+'　'+f.sex+'命',W/2,316);
 ctx.fillStyle='#8a7a5e';ctx.font="21px 'JM Kaiti',serif";
 ctx.fillText('農曆 '+L.getYearInChinese()+'年'+L.getMonthInChinese()+'月'+L.getDayInChinese(),W/2,350);
 ctx.strokeStyle='rgba(168,136,78,0.3)';ctx.beginPath();ctx.moveTo(96,392);ctx.lineTo(W-96,392);ctx.stroke();
 var P=[['年柱',ec.getYear(),s2t(ec.getYearNaYin()),s2t(ec.getYearShiShenGan())],['月柱',ec.getMonth(),s2t(ec.getMonthNaYin()),s2t(ec.getMonthShiShenGan())],['日柱',ec.getDay(),s2t(ec.getDayNaYin()),'日主'],['時柱',ec.getTime(),s2t(ec.getTimeNaYin()),s2t(ec.getTimeShiShenGan())]];
 var colW=128,left0=(W-colW*4)/2;
 P.forEach(function(p,i){
  var cx=left0+i*colW+colW/2;
  ctx.fillStyle='#8a7a5e';ctx.font="21px 'JM Kaiti',serif";ctx.fillText(p[0],cx,436);
  ctx.fillStyle='#A63A2E';ctx.font="62px 'JM Kaiti',serif";ctx.fillText(p[1].charAt(0),cx,512);
  ctx.fillStyle='#241E15';ctx.fillText(p[1].charAt(1),cx,592);
  ctx.fillStyle='#8a7a5e';ctx.font="18px 'JM Kaiti',serif";ctx.fillText(p[3],cx,636);
  ctx.fillStyle='#6b604f';ctx.font="17px 'JM Kaiti',serif";ctx.fillText(p[2],cx,668);
 });
 var dgan=ec.getDayGan();
 ctx.fillStyle='#4a4034';ctx.font="24px 'JM Kaiti',serif";
 ctx.fillText('日主 ',W/2-30,736);
 ctx.fillStyle=WX_COLOR[GAN_WX[dgan]];ctx.fillText(dgan,W/2+8,736);
 ctx.fillStyle='#8a7a5e';ctx.font="20px 'JM Kaiti',serif";ctx.fillText('五行分佈 Five Phases',W/2,792);
 var wxs=['木','火','土','金','水'],bw=104,bx=(W-bw*5)/2;
 wxs.forEach(function(w,i){
  var cx=bx+i*bw+bw/2;
  ctx.fillStyle=WX_COLOR[w];ctx.beginPath();ctx.arc(cx,840,15,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#4a4034';ctx.font="22px 'JM Kaiti',serif";ctx.fillText(w+' '+cnt[w],cx,884);
 });
 var gc=f.sex==='男'?1:0,yun=ec.getYun(gc,1),dys=yun.getDaYun(9),nowY=new Date().getFullYear(),ci=1;
 for(var i=1;i<dys.length;i++){if(dys[i].getStartYear()<=nowY&&nowY<=dys[i].getEndYear())ci=i;}
 var dy=dys[ci];
 ctx.fillStyle='rgba(251,247,238,0.75)';bzRoundRect(ctx,96,922,W-192,96,16);ctx.fill();
 ctx.strokeStyle='rgba(168,136,78,0.4)';ctx.lineWidth=1;ctx.stroke();
 ctx.fillStyle='#8a7a5e';ctx.font="19px 'JM Kaiti',serif";ctx.fillText('當前大運 Current Decade',W/2,960);
 ctx.fillStyle='#A63A2E';ctx.font="34px 'JM Kaiti',serif";
 ctx.fillText(dy.getGanZhi()+'　'+dy.getStartAge()+'–'+dy.getEndAge()+'歲（'+dy.getStartYear()+'年起）',W/2,1002);
 ctx.fillStyle='#8a7a5e';ctx.font="17px 'JM Kaiti',serif";
 ctx.fillText('命理研習，不主吉凶；天道無親，常與善人。',W/2,1072);
 ctx.fillStyle='#A63A2E';ctx.font="26px 'JM Kaiti',serif";ctx.fillText('淨明宗 · 不知山房',W/2,1122);
 ctx.fillStyle='#8a7a5e';ctx.font="15px Georgia,serif";ctx.fillText('EST. 2026 · PURE BRIGHTNESS',W/2,1150);
 box.innerHTML='<div class="bz-share-h">命盤分享卡 Destiny Card<span>長按圖片可保存、分享</span></div><div class="bz-share-wrap"></div>';
 box.querySelector('.bz-share-wrap').appendChild(cv);
 box.scrollIntoView({block:'start'});
}
/* ============================================================
   風水羅盤（後天八卦／洛書九宮／二十四山／周天刻度）
   ============================================================ */
var LP_SHAN=['壬','子','癸','丑','艮','寅','甲','卯','乙','辰','巽','巳','丙','午','丁','未','坤','申','庚','酉','辛','戌','乾','亥'];
var LP_BAGUA=[{n:'坎',s:'☵',num:1},{n:'艮',s:'☶',num:8},{n:'震',s:'☳',num:3},{n:'巽',s:'☴',num:4},{n:'離',s:'☲',num:9},{n:'坤',s:'☷',num:2},{n:'兌',s:'☱',num:7},{n:'乾',s:'☰',num:6}];
var LP_ZHENG=['子','卯','午','酉'],LP_WEI=['艮','巽','坤','乾'];
function lpPol(cx,cy,r,deg){var a=deg*Math.PI/180;return [cx+r*Math.sin(a),cy-r*Math.cos(a)];}
function lpBuildSvg(){
 var CX=500,CY=500,S='';
 function ring(r,color,w){S+='<circle cx="'+CX+'" cy="'+CY+'" r="'+r+'" fill="none" stroke="'+color+'" stroke-width="'+w+'"/>';}
 S+='<circle cx="'+CX+'" cy="'+CY+'" r="486" fill="#F6F0E4" stroke="rgba(168,136,78,.65)" stroke-width="2"/>';
 /* 周天刻度 460-484 */
 for(var d=0;d<360;d++){
  var major=d%30===0,mid=d%5===0,r1=major?458:(mid?464:468),p1=lpPol(CX,CY,r1,d),p2=lpPol(CX,CY,484,d);
  S+='<line x1="'+p1[0].toFixed(1)+'" y1="'+p1[1].toFixed(1)+'" x2="'+p2[0].toFixed(1)+'" y2="'+p2[1].toFixed(1)+'" stroke="'+(major?'#8a6d3b':'rgba(36,30,21,.35)')+'" stroke-width="'+(major?2:1)+'"/>';
 }
 for(var dd=0;dd<360;dd+=30){var pt=lpPol(CX,CY,475,dd);S+='<text class="lp-deg" x="'+pt[0].toFixed(1)+'" y="'+(pt[1]+4).toFixed(1)+'" transform="rotate('+dd+' '+pt[0].toFixed(1)+' '+pt[1].toFixed(1)+')">'+dd+'</text>';}
 /* 分金六十等分細格 422-460（僅刻度不注字，避免手機繁密） */
 for(var k=0;k<60;k++){var pa=lpPol(CX,CY,422,k*6),pb=lpPol(CX,CY,460,k*6);S+='<line x1="'+pa[0].toFixed(1)+'" y1="'+pa[1].toFixed(1)+'" x2="'+pb[0].toFixed(1)+'" y2="'+pb[1].toFixed(1)+'" stroke="rgba(36,30,21,'+(k%5===0?'.28':'.12')+')" stroke-width="1"/>';}
 ring(460,'rgba(168,136,78,.5)',1.4);ring(422,'rgba(168,136,78,.5)',1.4);ring(300,'rgba(168,136,78,.45)',1.4);ring(206,'rgba(168,136,78,.55)',1.6);
 /* 二十四山 300-422，山界徑向線 */
 for(var i=0;i<24;i++){var edge=i*15-7.5,ea=lpPol(CX,CY,300,edge),eb=lpPol(CX,CY,422,edge);S+='<line x1="'+ea[0].toFixed(1)+'" y1="'+ea[1].toFixed(1)+'" x2="'+eb[0].toFixed(1)+'" y2="'+eb[1].toFixed(1)+'" stroke="rgba(36,30,21,.18)" stroke-width="1"/>';}
 for(var j=0;j<24;j++){
  var deg=(j*15-15+360)%360,nm=LP_SHAN[j],col=LP_ZHENG.indexOf(nm)>=0?'#A63A2E':(LP_WEI.indexOf(nm)>=0?'#8a6d3b':'#241E15'),pc=lpPol(CX,CY,362,deg);
  S+='<text class="lp-shan" fill="'+col+'" x="'+pc[0].toFixed(1)+'" y="'+(pc[1]+12).toFixed(1)+'" transform="rotate('+deg+' '+pc[0].toFixed(1)+' '+pc[1].toFixed(1)+')">'+nm+'</text>';
 }
 /* 後天八卦＋洛書 206-300 */
 for(var b=0;b<8;b++){
  var bg=b*45,info=LP_BAGUA[b];
  var pNum=lpPol(CX,CY,288,bg),pSym=lpPol(CX,CY,258,bg),pName=lpPol(CX,CY,226,bg);
  S+='<text class="lp-num" x="'+pNum[0].toFixed(1)+'" y="'+(pNum[1]+5).toFixed(1)+'" transform="rotate('+bg+' '+pNum[0].toFixed(1)+' '+pNum[1].toFixed(1)+')">'+info.num+'</text>';
  S+='<text class="lp-sym" x="'+pSym[0].toFixed(1)+'" y="'+(pSym[1]+13).toFixed(1)+'" transform="rotate('+bg+' '+pSym[0].toFixed(1)+' '+pSym[1].toFixed(1)+')">'+info.s+'</text>';
  S+='<text class="lp-gname" x="'+pName[0].toFixed(1)+'" y="'+(pName[1]+7).toFixed(1)+'" transform="rotate('+bg+' '+pName[0].toFixed(1)+' '+pName[1].toFixed(1)+')">'+info.n+'</text>';
 }
 /* 天池太極 r=116 */
 var R=116;
 S+='<circle cx="'+CX+'" cy="'+CY+'" r="'+R+'" fill="#F8F3E9" stroke="#A8884E" stroke-width="2"/>';
 S+='<path d="M '+CX+' '+(CY-R)+' A '+R+' '+R+' 0 0 1 '+CX+' '+(CY+R)+' A '+(R/2)+' '+(R/2)+' 0 0 1 '+CX+' '+CY+' A '+(R/2)+' '+(R/2)+' 0 0 0 '+CX+' '+(CY-R)+' Z" fill="#241E15"/>';
 S+='<circle cx="'+CX+'" cy="'+(CY-R/2)+'" r="'+(R/6.5)+'" fill="#241E15"/>';
 S+='<circle cx="'+CX+'" cy="'+(CY+R/2)+'" r="'+(R/6.5)+'" fill="#F8F3E9"/>';
 S+='<text class="lp-pool" x="'+CX+'" y="'+(CY+R+34)+'">天池</text>';
 return '<svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">'+S+'</svg>';
}
var LP_STATE={mode:'manual',heading:0,manual:0,dragging:false};
function lpAngle(){return LP_STATE.mode==='compass'?LP_STATE.heading:LP_STATE.manual;}
function lpApply(){
 var ang=((lpAngle()%360)+360)%360,dial=document.getElementById('lpDial');
 if(dial)dial.style.transform='rotate('+(-ang)+'deg)';
 var shan=LP_SHAN[Math.round(((ang+15)%360)/15)%24];
 var gua=LP_BAGUA[Math.round(ang/45)%8];
 var ro=document.getElementById('lpReadout');
 if(ro)ro.innerHTML='<b>'+Math.round(ang)+'°</b><span>'+shan+'山 · '+gua.n+'卦（'+gua.num+'宮）</span><i>'+(LP_STATE.mode==='compass'?'指南針 COMPASS':'手動 MANUAL')+'</i>';
}
function lpPointerAngle(e,el){
 var rect=el.getBoundingClientRect(),cx=rect.left+rect.width/2,cy=rect.top+rect.height/2;
 var t=e.touches?e.touches[0]:e,dx=t.clientX-cx,dy=t.clientY-cy;
 return (Math.atan2(dx,-dy)*180/Math.PI+360)%360;
}
function renderLuopan(){
 var dial=document.getElementById('lpDial');if(!dial)return;
 if(dial.dataset.ready){lpApply();return;}
 dial.innerHTML=lpBuildSvg();dial.dataset.ready='1';
 var stage=document.getElementById('lpStage'),btn=document.getElementById('lpCompassBtn');
 function toManual(e){
  LP_STATE.mode='manual';LP_STATE.dragging=true;LP_STATE.dragStart=lpPointerAngle(e,stage);LP_STATE.manualStart=LP_STATE.manual;
  dial.style.transition='none';e.preventDefault();
 }
 function move(e){
  if(!LP_STATE.dragging)return;
  var now=lpPointerAngle(e,stage),delta=now-LP_STATE.dragStart;
  if(delta>180)delta-=360;if(delta<-180)delta+=360;
  LP_STATE.manual=LP_STATE.manualStart+delta;lpApply();e.preventDefault();
 }
 function end(){LP_STATE.dragging=false;dial.style.transition='transform .15s linear';}
 stage.addEventListener('touchstart',toManual,{passive:false});
 stage.addEventListener('touchmove',move,{passive:false});
 stage.addEventListener('touchend',end);
 stage.addEventListener('mousedown',function(e){toManual(e);});
 window.addEventListener('mousemove',move);
 window.addEventListener('mouseup',end);
 function onOrient(e){
  var h=(e.webkitCompassHeading!=null)?e.webkitCompassHeading:(360-(e.alpha||0))%360;
  LP_STATE.heading=h;LP_STATE.mode='compass';dial.style.transition='transform .12s linear';lpApply();
 }
 btn.addEventListener('click',function(){
  function bind(){LP_STATE.mode='compass';window.addEventListener('deviceorientation',onOrient,true);btn.innerHTML='跟隨指南針中<span>Compass On · 拖盤可轉手動</span>';}
  if(typeof DeviceOrientationEvent!=='undefined'&&typeof DeviceOrientationEvent.requestPermission==='function'){
   DeviceOrientationEvent.requestPermission().then(function(st){if(st==='granted')bind();else lpApply();}).catch(function(){});
  }else bind();
 });
 lpApply();
}
/* ============================================================
   梅花易數（先天數起卦／互卦變卦／體用生克）
   ============================================================ */
var MH_TRI={
 1:{n:'乾',s:'☰',l:[1,1,1],wx:'金'},2:{n:'兌',s:'☱',l:[1,1,0],wx:'金'},
 3:{n:'離',s:'☲',l:[1,0,1],wx:'火'},4:{n:'震',s:'☳',l:[1,0,0],wx:'木'},
 5:{n:'巽',s:'☴',l:[0,1,1],wx:'木'},6:{n:'坎',s:'☵',l:[0,1,0],wx:'水'},
 7:{n:'艮',s:'☶',l:[0,0,1],wx:'土'},8:{n:'坤',s:'☷',l:[0,0,0],wx:'土'}
};
var MH_KE={金:'木',木:'土',土:'水',水:'火',火:'金'};
var MH_SHENG={金:'水',水:'木',木:'火',火:'土',土:'金'};
function mhTriByLines(a){for(var num in MH_TRI){var t=MH_TRI[num];if(t.l.join('')===a.join(''))return {num:parseInt(num,10),n:t.n,s:t.s,wx:t.wx,l:t.l};}return null;}
function mhGuaByNames(up,down){for(var i=0;i<window.GUA64.length;i++){var g=window.GUA64[i];if(g.up===up&&g.down===down)return g;}return null;}
function mhMod8(x){var r=x%8;return r===0?8:r;}
function mhMod6(x){var r=x%6;return r===0?6:r;}
var MH_REL={
 he:{t:'體用比和',en:'HARMONY',d:'體用同氣，陰陽相濟，所謀多順；然須以正道持守，不可恃吉而怠。'},
 ys:{t:'用卦生體',en:'BENEFIT',d:'外象生扶於我，易得助力與時機，宜順勢而為，感恩惜福。'},
 sy:{t:'體卦生用',en:'OUTLAY',d:'我往生事，氣機稍洩，多主付出耗神，宜厚積緩圖，不宜躁進。'},
 yk:{t:'用卦克體',en:'PRESSURE',d:'外象來克，阻滯較重，宜守正待時、反躬修德；強爭則損，緩則可圓。'},
 sk:{t:'體卦克用',en:'COMMAND',d:'我能制事，主動可成，然勞心費力，宜謀定後動，留餘地於人。'}
};
function mhRelation(ti,yong){
 if(ti===yong)return MH_REL.he;
 if(MH_SHENG[yong]===ti)return MH_REL.ys;
 if(MH_SHENG[ti]===yong)return MH_REL.sy;
 if(MH_KE[yong]===ti)return MH_REL.yk;
 if(MH_KE[ti]===yong)return MH_REL.sk;
 return MH_REL.he;
}
function mhYaoView(lines,dong){
 var html='';
 for(var i=5;i>=0;i--){
  var yang=lines[i]===1,mv=(i===(dong-1));
  html+='<div class="mh-yao'+(mv?' mv':'')+'">'+(yang?'<span class="yao-yang"></span>':'<span class="yao-yin-l"></span><span class="yao-yin-r"></span>')+(mv?'<i>動</i>':'')+'</div>';
 }
 return html;
}
function mhMiniYao(lines,dong){
 var h='';
 for(var i=5;i>=0;i--){
  var yang=lines[i]===1,mv=(i===(dong-1));
  h+='<div class="mm-yao'+(mv?' mv':'')+'">'+(yang?'<span class="my"></span>':'<span class="ml"></span><span class="mr"></span>')+'</div>';
 }
 return '<div class="mh-mini">'+h+'</div>';
}
function mhGuaCard(title,en,g,dong){
 return '<div class="mh-gua"><div class="mhg-k">'+title+'<i>'+en+'</i></div>'+
  mhMiniYao(g.lines,dong)+'<div class="mhg-name">'+g.name+'<span>'+g.full+'</span></div>'+
  '<div class="mhg-wx">'+g.wxUp+' · '+g.wxDown+'</div></div>';
}
function mhCompute(upNum,lowNum,dong,basis){
 var upT=MH_TRI[upNum],lowT=MH_TRI[lowNum];
 var benLines=lowT.l.concat(upT.l);
 var ben=mhGuaByNames(upT.n,lowT.n);
 var bianLines=benLines.slice();bianLines[dong-1]=bianLines[dong-1]===1?0:1;
 var bLow=mhTriByLines(bianLines.slice(0,3)),bUp=mhTriByLines(bianLines.slice(3,6));
 var bian=mhGuaByNames(bUp.n,bLow.n);
 var huLow=mhTriByLines([benLines[1],benLines[2],benLines[3]]);
 var huUp=mhTriByLines([benLines[2],benLines[3],benLines[4]]);
 var hu=mhGuaByNames(huUp.n,huLow.n);
 var tiT,yongT;
 if(dong<=3){tiT=upT;yongT=lowT;}else{tiT=lowT;yongT=upT;}
 var rel=mhRelation(tiT.wx,yongT.wx);
 return {upT:upT,lowT:lowT,ben:ben,benLines:benLines,bian:bian,hu:hu,huUp:huUp,huLow:huLow,tiT:tiT,yongT:yongT,rel:rel,dong:dong,basis:basis,
   yaoText:ben.yao[dong-1],judge:ben.judge};
}
function mhRenderResult(r){
 var ask=(document.getElementById('mhAsk').value||'').trim();
 var html='<div class="mh-basis">'+r.basis+'</div>'+
  (ask?'<div class="mh-ask">所問：'+ask+'</div>':'')+
  '<div class="mh-three">'+mhGuaCard('本卦','Ben Gua',r.ben,r.dong)+
    '<div class="mh-arrow">互<br><b>⇌</b><br>變</div>'+mhGuaCard('互卦','Hu Gua',r.hu,-1)+
    '<div class="mh-arrow">→</div>'+mhGuaCard('變卦','Bian Gua',r.bian,-1)+'</div>'+
  '<div class="mh-yaopan"><div class="mhy-title">本卦六爻 · 第'+['初','二','三','四','五','上'][r.dong-1]+'爻動</div>'+mhYaoView(r.benLines,r.dong)+'</div>'+
  '<div class="mh-tiyong"><span class="ti">體卦 <b>'+r.tiT.n+'（'+r.tiT.wx+'）</b></span><span class="sep">·</span><span class="yong">用卦 <b>'+r.yongT.n+'（'+r.yongT.wx+'）</b></span></div>'+
  '<div class="mh-rel"><div class="mhr-t">'+r.rel.t+' <i>'+r.rel.en+'</i></div><p>'+r.rel.d+'</p></div>'+
  '<div class="mh-jing"><div class="mjh-k">本卦卦辭 <i>Judgment</i></div><p>'+r.judge+'</p></div>'+
  '<div class="mh-jing yao"><div class="mjh-k">動爻爻辭 <i>Moving Line</i></div><p>'+r.yaoText+'</p></div>'+
  '<div class="mh-sub">互卦 '+r.hu.name+'《'+r.hu.full+'》，見事之過程；變卦 '+r.bian.name+'《'+r.bian.full+'》，示事之趨向。</div>'+
  '<div class="mh-foot">梅花易數重「觸機」與「心易」，卦象僅供自修參省，不主吉凶禍福。卦無絕對，心轉境轉；天道無親，常與善人。</div>';
 document.getElementById('mhResult').innerHTML=html;
}
function mhCastTime(){
 var now=new Date(),L=window.Solar.fromDate(now).getLunar();
 var gz=L.getYearInGanZhi?L.getYearInGanZhi():(L.getYearGan?L.getYearGan()+L.getYearZhi():'');
 var yz='子丑寅卯辰巳午未申酉戌亥'.indexOf(gz.charAt(1))+1;
 var mo=Math.abs(L.getMonth()),da=L.getDay();
 var h=now.getHours(),hz=Math.floor(((h+1)%24)/2)+1;
 var up=mhMod8(yz+mo+da),low=mhMod8(yz+mo+da+hz),dong=mhMod6(yz+mo+da+hz);
 var basis='農曆 '+L.getYearInChinese()+'年'+L.getMonthInChinese()+'月'+L.getDayInChinese()+'　'+['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'][hz-1]+'時（年'+yz+'　月'+mo+'　日'+da+'　時'+hz+'）';
 mhRenderResult(mhCompute(up,low,dong,basis));
}
function mhCastNum(){
 var a=parseInt(document.getElementById('mhN1').value,10),b=parseInt(document.getElementById('mhN2').value,10),c=parseInt(document.getElementById('mhN3').value,10);
 if(!(a>0)||!(b>0)||!(c>0)){document.getElementById('mhResult').innerHTML='<div class="mh-empty">請填三個正整數，再行起卦。</div>';return;}
 var up=mhMod8(a),low=mhMod8(b),dong=mhMod6(c);
 mhRenderResult(mhCompute(up,low,dong,'報數起卦 · 上卦數 '+a+'　下卦數 '+b+'　動爻數 '+c));
}
function renderMeihua(){
 var mount=document.getElementById('mhMount');if(!mount)return;
 if(mount.dataset.ready){return;}
 mount.dataset.ready='1';
 mount.innerHTML='<div class="mh-tip">靜心凝神，默唸所問之事，而後起卦。<span>Still the mind, hold the question, then cast.</span></div>'+
  '<input class="mh-ask" id="mhAsk" type="text" placeholder="所問之事（可不填，僅存於當下）" maxlength="40">'+
  '<div class="mh-modes">'+
    '<button class="mh-cast" onclick="mhCastTime()">時辰起卦<span>Cast by Now · 農曆年月日時</span></button>'+
    '<div class="mh-numline"><span>報數</span><input id="mhN1" type="number" min="1" inputmode="numeric"><input id="mhN2" type="number" min="1" inputmode="numeric"><input id="mhN3" type="number" min="1" inputmode="numeric"><button class="mh-cast sm" onclick="mhCastNum()">起卦</button></div>'+
  '</div><div id="mhResult"><div class="mh-empty">先天為體，後天為用；數至機生，一念通玄。</div></div>';
}
/* 暴露到全局 */
window.renderDailyWord=renderDailyWord;
window.renderCultivate=renderCultivate;
window.renderZhangjue=renderZhangjue;window.zjSelect=zjSelect;window.zjRel=zjRel;window.zjClear=zjClear;
window.renderBaziForm=renderBaziForm;window.baziCalc=baziCalc;
window.bzSave=bzSave;window.bzLoad=bzLoad;window.bzDelete=bzDelete;window.bzRenderSaves=bzRenderSaves;window.bzShare=bzShare;window.bzShareChart=bzShareChart;window.bzShowLiuNian=bzShowLiuNian;
window.bzWheelCtl=bzWheelCtl;window.bzSetCal=bzSetCal;
window.bzOpen=bzOpen;window.bzClose=bzClose;window.bzConfirm=bzConfirm;
window.hitInstrument=hitInstrument;
window.switchInstrument=switchInstrument;
window.resetInstrument=resetInstrument;
window.zuoSet=zuoSet;window.zuoToggle=zuoToggle;
window.renderAlmanac=renderAlmanac;window.getTaisui=getTaisui;
window.renderZeji=renderZeji;window.zejiRun=zejiRun;
window.renderLuopan=renderLuopan;window.lpApply=lpApply;window.LP_STATE=LP_STATE;
window.renderMeihua=renderMeihua;window.mhCastTime=mhCastTime;window.mhCastNum=mhCastNum;
})();
