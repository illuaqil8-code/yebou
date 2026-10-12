/* THE BRIGHT SPOT — interactions. Config + product data live in products.js (window.BS). */
(function(){
'use strict';
var BS=window.BS||{products:[],wa:'918722313313'};
var $=function(s,c){return (c||document).querySelector(s)}, $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
var byId={}; BS.products.forEach(function(p){byId[p.id]=p});
function wa(text){return 'https://wa.me/'+BS.wa+'?text='+encodeURIComponent(text)}
function toast(msg){var t=$('#toast');if(!t)return;t.textContent=msg;t.classList.add('on');clearTimeout(toast._t);toast._t=setTimeout(function(){t.classList.remove('on')},2200)}
var store={get:function(){try{return JSON.parse(localStorage.getItem('bs_list')||'[]')}catch(e){return window.__bsl||[]}},set:function(v){try{localStorage.setItem('bs_list',JSON.stringify(v))}catch(e){window.__bsl=v}}};

/* header */
var header=$('.site-header');
function onScroll(){var y=window.scrollY;if(header)header.classList.toggle('solid',y>40);var t=$('.totop');if(t)t.classList.toggle('on',y>900)}
window.addEventListener('scroll',onScroll,{passive:true});onScroll();
var burger=$('.burger'),menu=$('.menu');
if(burger){burger.addEventListener('click',function(){var o=menu.classList.toggle('open');burger.setAttribute('aria-expanded',o);document.body.style.overflow=o?'hidden':''})}
$$('.has-drop>button').forEach(function(b){b.addEventListener('click',function(){var li=b.parentNode;var o=li.classList.toggle('open');b.setAttribute('aria-expanded',o)})});
$$('.menu a').forEach(function(a){a.addEventListener('click',function(){if(menu.classList.contains('open')){menu.classList.remove('open');document.body.style.overflow=''}})});
var tt=$('.totop');if(tt)tt.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'})});

/* reveal */
var io='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -6% 0px'}):null;
$$('.rv').forEach(function(el){io?io.observe(el):el.classList.add('in')});

/* hero video */
var hv=$('.hero-video');
if(hv){
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce){hv.removeAttribute('autoplay');hv.pause()}else{var pr=hv.play();if(pr&&pr.catch)pr.catch(function(){})}
  var sb=$('#sound');
  if(sb)sb.addEventListener('click',function(){hv.muted=!hv.muted;if(!hv.muted)hv.play();sb.setAttribute('aria-pressed',!hv.muted);sb.querySelector('.on').style.display=hv.muted?'none':'block';sb.querySelector('.off').style.display=hv.muted?'block':'none'});
  if('IntersectionObserver' in window&&!reduce)new IntersectionObserver(function(es){es[0].isIntersecting?hv.play().catch(function(){}):hv.pause()},{threshold:.1}).observe(hv);
}

/* cards: spotlight */
document.addEventListener('pointermove',function(e){var c=e.target.closest&&e.target.closest('.card');if(!c)return;var r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px')});

/* enquiry list */
var drawer=$('#drawer'),scrim=$('#scrim');
function count(){return store.get().length}
function syncSaves(){var l=store.get();$$('.save').forEach(function(b){var on=l.indexOf(b.dataset.id)>-1;b.setAttribute('aria-pressed',on);b.setAttribute('aria-label',(on?'Remove ':'Save ')+(byId[b.dataset.id]?byId[b.dataset.id].name:'')+(on?' from':' to')+' enquiry list')});
  $$('.badge').forEach(function(b){b.textContent=l.length;b.classList.toggle('on',l.length>0)})}
function renderDrawer(){var l=store.get(),body=$('.dr-body',drawer),foot=$('.dr-foot',drawer);
  if(!l.length){body.innerHTML='<div class="dr-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 21s-7-4.6-9.3-9.2C1.2 8.6 3 5 6.5 5c2 0 3.4 1.1 4.2 2.4h2.6C14.1 6.1 15.5 5 17.5 5 21 5 22.8 8.6 21.3 11.8 19 16.4 12 21 12 21z"/></svg><p>Your enquiry list is empty.<br>Tap the heart on any piece you love, then send the whole list to us in one WhatsApp message.</p></div>';foot.style.display='none';return}
  foot.style.display='grid';
  body.innerHTML=l.map(function(id){var p=byId[id];if(!p)return'';return '<div class="li"><img src="'+p.img+'" alt=""><div><b>'+p.name+'</b><small>'+p.catTitle+'</small></div><button data-rm="'+id+'" aria-label="Remove '+p.name+'">&times;</button></div>'}).join('');
  var msg='Hello The Bright Spot! I\'d like to enquire about these pieces from your website:\n\n'+l.map(function(id,i){var p=byId[id];return (i+1)+'. '+p.name+' ('+p.catTitle+')'}).join('\n')+'\n\nCould you please let me know availability and more details? Thank you.';
  $('#send-list').href=wa(msg)}
function openDrawer(){renderDrawer();drawer.classList.add('on');scrim.classList.add('on');document.body.style.overflow='hidden'}
function closeDrawer(){drawer.classList.remove('on');scrim.classList.remove('on');document.body.style.overflow=''}
function toggleSave(id){var l=store.get(),i=l.indexOf(id);if(i>-1){l.splice(i,1);toast('Removed from your enquiry list')}else{l.push(id);toast('Saved to your enquiry list')}store.set(l);syncSaves();if(drawer.classList.contains('on'))renderDrawer();var lb=$('#lb');if(lb&&lb.classList.contains('on'))lbSaveState()}
document.addEventListener('click',function(e){
  var s=e.target.closest('.save');if(s){toggleSave(s.dataset.id);return}
  var rm=e.target.closest('[data-rm]');if(rm){toggleSave(rm.dataset.rm);return}
  if(e.target.closest('[data-list]')){openDrawer();return}
  if(e.target.closest('[data-close-drawer]')||e.target===scrim){closeDrawer();return}
  if(e.target.closest('#clear-list')){store.set([]);syncSaves();renderDrawer();return}
});
syncSaves();

/* lightbox / quick view */
var lb=$('#lb'),lbSet=[],lbIdx=0;
function lbSaveState(){var b=$('#lb-save');var on=store.get().indexOf(lbSet[lbIdx])>-1;b.setAttribute('aria-pressed',on);b.querySelector('span').textContent=on?'Saved':'Save to list'}
function lbShow(i){lbIdx=(i+lbSet.length)%lbSet.length;var p=byId[lbSet[lbIdx]];if(!p)return;
  var im=$('#lb-img');im.style.opacity=0;setTimeout(function(){im.src=p.img;im.alt=p.name;im.style.opacity=1},120);
  $('#lb-tag').textContent=p.tag;$('#lb-title').textContent=p.name;$('#lb-desc').textContent=p.desc;
  var cl=$('#lb-cat');cl.textContent=p.catTitle;cl.href=p.page;
  $('#lb-wa').href=wa('Hello The Bright Spot! I\'m interested in '+p.name+' ('+p.catTitle+'). Could you tell me about availability and details? Thank you.');
  $('#lb-count').textContent=(lbIdx+1)+' / '+lbSet.length;lbSaveState();
  $('.lb-prev').style.display=$('.lb-next').style.display=lbSet.length>1?'grid':'none'}
function openLb(id,scope){lbSet=$$('[data-open]',scope||document).filter(function(el){var c=el.closest('.card,.shot');return !(c&&c.hidden)}).map(function(el){return el.dataset.id});
  if(!lbSet.length||lbSet.indexOf(id)<0)lbSet=[id];lbShow(lbSet.indexOf(id));lb.classList.add('on');document.body.style.overflow='hidden';$('.lb-close').focus()}
function closeLb(){lb.classList.remove('on');document.body.style.overflow=''}
document.addEventListener('click',function(e){var o=e.target.closest('[data-open]');if(o){openLb(o.dataset.id,o.closest('[data-scope]'));return}
  if(e.target.closest('.lb-close')||e.target===$('.lb-stage'))closeLb();
  if(e.target.closest('.lb-prev'))lbShow(lbIdx-1);if(e.target.closest('.lb-next'))lbShow(lbIdx+1);
  if(e.target.closest('#lb-save'))toggleSave(lbSet[lbIdx])});
document.addEventListener('keydown',function(e){
  if(lb.classList.contains('on')){if(e.key==='Escape')closeLb();if(e.key==='ArrowLeft')lbShow(lbIdx-1);if(e.key==='ArrowRight')lbShow(lbIdx+1)}
  else if(drawer.classList.contains('on')&&e.key==='Escape')closeDrawer();
  else if(e.key==='Escape'&&menu&&menu.classList.contains('open')){menu.classList.remove('open');document.body.style.overflow=''}});
var tx=0;lb.addEventListener('touchstart',function(e){tx=e.touches[0].clientX},{passive:true});
lb.addEventListener('touchend',function(e){var d=e.changedTouches[0].clientX-tx;if(Math.abs(d)>60)lbShow(lbIdx+(d<0?1:-1))},{passive:true});

/* filter + search (category, collection, inspiration pages) */
var grid=$('[data-filterable]');
if(grid){
  var cards=$$('[data-sub],[data-cat]',grid).filter(function(c){return c.dataset.id}),chips=$$('.chip'),q=$('#q'),cnt=$('#count'),none=$('.no-results',grid);
  var st={f:'all',q:''};
  var attr=grid.dataset.filterable;
  function apply(){var n=0,term=st.q.trim().toLowerCase();
    cards.forEach(function(c){var p=byId[c.dataset.id]||{};var okF=st.f==='all'||c.dataset[attr]===st.f;var hay=((p.name||'')+' '+(p.tag||'')+' '+(p.desc||'')+' '+(p.catTitle||'')).toLowerCase();var okQ=!term||term.split(/\s+/).every(function(w){return hay.indexOf(w)>-1});
      c.hidden=!(okF&&okQ);if(!c.hidden)n++});
    if(cnt)cnt.textContent=n+(n===1?' piece':' pieces');if(none)none.classList.toggle('on',n===0)}
  chips.forEach(function(ch){ch.addEventListener('click',function(){chips.forEach(function(x){x.setAttribute('aria-pressed','false')});ch.setAttribute('aria-pressed','true');st.f=ch.dataset.f;apply();try{history.replaceState(null,'','#'+st.f)}catch(e){}})});
  if(q)q.addEventListener('input',function(){st.q=q.value;apply()});
  var h=(location.hash||'').slice(1);if(h){var m=chips.filter(function(c){return c.dataset.f===h})[0];if(m)m.click()}
  var sp=new URLSearchParams(location.search);if(sp.get('q')&&q){q.value=sp.get('q');st.q=q.value}
  apply();
}

/* scroller arrows */
$$('[data-scroll]').forEach(function(b){b.addEventListener('click',function(){var s=$(b.dataset.scroll);s.scrollBy({left:(b.dataset.dir==='1'?1:-1)*Math.min(700,s.clientWidth*.8),behavior:'smooth'})})});

/* mood switcher */
var tint=$('.mood-tint');
if(tint){var moods={warm:['Warm white · 2700K','Candle-soft and intimate. Made for bedrooms, lounges and dining rooms.'],neutral:['Neutral white · 4000K','Clean and natural. A balanced everyday light for kitchens, studies and corridors.'],cool:['Cool white · 6500K','Crisp and energising. Ideal for task areas, workspaces and bright, modern spaces.']};
  $$('[data-mood]').forEach(function(b){b.addEventListener('click',function(){var k=b.dataset.mood;$$('[data-mood]').forEach(function(x){x.setAttribute('aria-pressed',x===b)});tint.className='mood-tint '+k;$('#mood-tag').textContent=moods[k][0];$('#mood-desc').textContent=moods[k][1]})})}

/* tabs (planner) */
$$('.tabs [role=tab]').forEach(function(t){t.addEventListener('click',function(){$$('.tabs [role=tab]').forEach(function(x){x.setAttribute('aria-selected',x===t)});$$('.panel').forEach(function(p){p.classList.toggle('on',p.id===t.getAttribute('aria-controls'))});try{history.replaceState(null,'','#'+t.dataset.tab)}catch(e){}})});
var th=(location.hash||'').slice(1);if(th){var tb=$('.tabs [data-tab="'+th+'"]');if(tb)tb.click()}

/* light calculator */
var calc=$('#calc');
if(calc){
  var rooms={living:['Living room',150,'warm'],bedroom:['Bedroom',100,'warm'],dining:['Dining room',150,'warm'],kitchen:['Kitchen',300,'neutral'],bath:['Bathroom',200,'neutral'],study:['Study / office',400,'neutral'],corridor:['Corridor / lobby',100,'warm'],shop:['Shop / showroom',500,'neutral']};
  var cs={unit:'ft'};
  function area(){var l=+$('#cl').value||0,w=+$('#cw').value||0;var a=l*w;return cs.unit==='ft'?a*0.092903:a}
  function runCalc(){var r=rooms[$('#cr').value],a=area();var lm=Math.round(a*r[1]/0.6/50)*50;
    $('#o-area').innerHTML=(cs.unit==='ft'?(+$('#cl').value*+$('#cw').value||0).toFixed(0)+' <small>sq ft · '+a.toFixed(1)+' m²</small>':a.toFixed(1)+' <small>m² · '+(a/0.092903).toFixed(0)+' sq ft</small>');
    $('#o-lm').innerHTML=lm.toLocaleString('en-IN')+' <small>lumens, about '+r[1]+' lux target</small>';
    var n12=Math.max(1,Math.ceil(lm/1000)),n18=Math.max(1,Math.ceil(lm/1500));
    $('#o-n').innerHTML=(a?n12:0)+' <small>× 12 W panels · or '+(a?n18:0)+' × 18 W</small>';
    var col={warm:'Warm white (2700K)',neutral:'Neutral white (4000K)'}[r[2]];$('#o-col').innerHTML=col.split(' (')[0]+' <small>'+col.match(/\((.*)\)/)[1]+' · or choose a 3-in-1 fitting</small>';
    $('#calc-wa').href=wa('Hello The Bright Spot! I used the Light Calculator on your website.\nRoom: '+r[0]+'\nSize: '+$('#cl').value+' × '+$('#cw').value+' '+cs.unit+'\nGuide: about '+lm.toLocaleString('en-IN')+' lumens ('+n12+' × 12W panels).\nCould you suggest suitable fixtures for this space?')}
  $$('#calc input,#calc select').forEach(function(i){i.addEventListener('input',runCalc)});
  $$('[data-unit]').forEach(function(b){b.addEventListener('click',function(){cs.unit=b.dataset.unit;$$('[data-unit]').forEach(function(x){x.setAttribute('aria-pressed',x===b)});$('#ul1').textContent=$('#ul2').textContent=cs.unit;runCalc()})});
  runCalc();
}
/* fan size */
var fan=$('#fan');
if(fan){function runFan(){var l=+$('#fl').value||0,w=+$('#fw').value||0,a=l*w;var s=a<=100?['900 mm (36")','Compact rooms and small bedrooms']:a<=150?['1050 mm (42")','Bedrooms and home offices']:a<=225?['1200 mm (48")','Living rooms and master bedrooms']:a<=400?['1400 mm (56")','Large halls — consider two fans for even airflow']:['2 × 1400 mm','Very large spaces need multiple fans'];
  $('#f-area').innerHTML=a+' <small>sq ft</small>';$('#f-size').innerHTML=s[0]+' <small>'+s[1]+'</small>';
  $('#fan-wa').href=wa('Hello The Bright Spot! My room is about '+l+' × '+w+' ft. I used your Fan Size guide (suggested '+s[0]+'). Could you show me suitable fans?')}
  $$('#fan input').forEach(function(i){i.addEventListener('input',runFan)});runFan()}

/* style finder quiz */
var quiz=$('#quiz');
if(quiz){
  var PICKS={living:{modern:['02','09','06'],classic:['16','24','25'],warm:['52','01','03'],bright:['29','12','28']},bedroom:{modern:['10','20','72'],classic:['54','25','22'],warm:['74','73','54'],bright:['29','31','35']},entrance:{modern:['23','26','55'],classic:['14','13','19'],warm:['21','55','53'],bright:['15','56','37']},kitchen:{modern:['36','37','75'],classic:['24','22','53'],warm:['75','27','52'],bright:['29','30','37']},outdoor:{modern:['43','44','83'],classic:['47','48','49'],warm:['49','51','46'],bright:['45','46','83']}};
  var NAMES={living:'Living / Dining',bedroom:'Bedroom',entrance:'Entrance / Staircase',kitchen:'Kitchen / Work area',outdoor:'Gate / Outdoor'},SN={modern:'Modern',classic:'Classic luxury',warm:'Warm & cosy',bright:'Bright & practical'};
  var qs={space:null,style:null};
  $$('.opt',quiz).forEach(function(o){o.addEventListener('click',function(){var g=o.dataset.g;qs[g]=o.dataset.v;$$('.opt[data-g="'+g+'"]',quiz).forEach(function(x){x.setAttribute('aria-pressed',x===o)});showQuiz()})});
  function showQuiz(){var out=$('#quiz-out');if(!qs.space||!qs.style){out.innerHTML='';return}
    var ids=PICKS[qs.space][qs.style];
    var msg='Hello The Bright Spot! I used Find Your Light on your website.\nSpace: '+NAMES[qs.space]+'\nStyle: '+SN[qs.style]+'\nPieces I liked:\n'+ids.map(function(i){return '• '+byId[i].name}).join('\n')+'\nCould you help me choose?';
    out.innerHTML='<div class="s-head"><div><span class="eyebrow">Your light</span><h2 style="margin:0">'+SN[qs.style]+' for your <span class="gold">'+NAMES[qs.space].toLowerCase()+'</span></h2></div><a class="btn btn-wa" target="_blank" rel="noopener" href="'+wa(msg)+'">Discuss on WhatsApp</a></div><div class="grid">'+ids.map(function(i){var p=byId[i];return '<article class="card" data-id="'+i+'"><button class="card-media" data-open data-id="'+i+'" style="background:'+p.bg+'" aria-label="View '+p.name+'"><img src="'+p.img+'" alt="'+p.name+'" loading="lazy"></button><div class="card-body"><span class="tag">'+p.tag+'</span><h3>'+p.name+'</h3><p>'+p.desc+'</p><div class="card-actions"><a class="btn btn-wa btn-sm" target="_blank" rel="noopener" href="'+wa('Hello The Bright Spot! I\'m interested in '+p.name+' ('+p.catTitle+'). Could you tell me about availability and details?')+'">Enquire</a><button class="save" data-id="'+i+'" aria-pressed="false"><svg viewBox="0 0 24 24"><path d="M12 21s-7-4.6-9.3-9.2C1.2 8.6 3 5 6.5 5c2 0 3.4 1.1 4.2 2.4h2.6C14.1 6.1 15.5 5 17.5 5 21 5 22.8 8.6 21.3 11.8 19 16.4 12 21 12 21z"/></svg></button></div></div></article>'}).join('')+'</div>';
    out.setAttribute('data-scope','');syncSaves();out.scrollIntoView({behavior:'smooth',block:'nearest'})}
}

/* WhatsApp message form */
var cf=$('#contact-form');
if(cf)cf.addEventListener('submit',function(e){e.preventDefault();var f=new FormData(cf);
  var m='Hello The Bright Spot!\nName: '+(f.get('name')||'')+(f.get('phone')?'\nPhone: '+f.get('phone'):'')+'\nI\'m looking for: '+f.get('interest')+'\n\n'+(f.get('msg')||'');
  window.open(wa(m),'_blank','noopener');toast('Opening WhatsApp…')});

var y=$('#yr');if(y)y.textContent=new Date().getFullYear();
})();
