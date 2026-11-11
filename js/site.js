(function(){
'use strict';
const on=(parent,selector,callback)=>parent?.querySelectorAll(selector).forEach(callback);
const header=document.querySelector('.site-header');
const nav=document.querySelector('.site-nav');
const menu=document.querySelector('.menu-toggle');
const updateHeader=()=>header?.classList.toggle('scrolled',window.scrollY>25);
window.addEventListener('scroll',updateHeader,{passive:true});updateHeader();
if(menu&&nav){
 menu.addEventListener('click',()=>{
  const isOpen=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(isOpen));
  menu.textContent=isOpen?'✕':'☰';menu.setAttribute('aria-label',isOpen?'Закрыть меню':'Открыть меню');
 });
 on(nav,'a',link=>link.addEventListener('click',()=>{
  nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='☰';
 }));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='☰';menu.focus()}});
}
const slides=[...document.querySelectorAll('.hero-slide')];
if(slides.length){
 let active=0;
 const counter=document.querySelector('[data-slide-current]');
 const hero=document.querySelector('.hero');
 const update=next=>{
  active=(next+slides.length)%slides.length;
  slides.forEach((slide,i)=>{slide.classList.toggle('active',i===active);slide.setAttribute('aria-hidden',String(i!==active))});
  if(counter)counter.textContent=String(active+1).padStart(2,'0');
  hero?.classList.toggle('hero-no-image',active===2);
 };
 document.querySelector('[data-slide-prev]')?.addEventListener('click',()=>update(active-1));
 document.querySelector('[data-slide-next]')?.addEventListener('click',()=>update(active+1));
 update(0);
 let startX=0;
 hero?.addEventListener('touchstart',e=>{startX=e.touches[0].clientX},{passive:true});
 hero?.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-startX;if(Math.abs(dx)>70)update(active+(dx<0?1:-1))},{passive:true});
}
const filterButtons=[...document.querySelectorAll('.filter-btn[data-filter]')];
const cards=[...document.querySelectorAll('.work-card[data-category]')];
filterButtons.forEach(button=>button.addEventListener('click',()=>{
 const category=button.dataset.filter;
 filterButtons.forEach(b=>{const current=b===button;b.classList.toggle('active',current);b.setAttribute('aria-pressed',String(current))});
 cards.forEach(card=>{card.hidden=category!=='all'&&card.dataset.category!==category});
}));
on(document,'.faq-q',button=>button.addEventListener('click',()=>{
 const open=button.getAttribute('aria-expanded')==='true';
 const list=button.closest('.faq-list');
 on(list,'.faq-q',other=>{other.setAttribute('aria-expanded','false');const answer=document.getElementById(other.getAttribute('aria-controls'));answer?.classList.remove('open')});
 if(!open){button.setAttribute('aria-expanded','true');const answer=document.getElementById(button.getAttribute('aria-controls'));answer?.classList.add('open')}
}));
async function copyText(value){
 if(navigator.clipboard?.writeText){try{await navigator.clipboard.writeText(value);return true}catch(_){/* try fallback */}}
 const el=document.createElement('textarea');el.value=value;el.style.position='fixed';el.style.left='-99999px';el.setAttribute('readonly','');document.body.appendChild(el);el.select();let ok=false;
 try{ok=document.execCommand('copy')}catch(_){}el.remove();return ok;
}
on(document,'#brief-form',form=>form.addEventListener('submit',async event=>{
 event.preventDefault();
 if(!form.reportValidity())return;
 const data=new FormData(form);
 const value='Заявка Cats Team\n\nИмя: '+String(data.get('name')||'').trim()+'\nНаправление: '+String(data.get('service')||'')+'\nОписание: '+String(data.get('task')||'').trim()+'\nКонтакт: '+String(data.get('contact')||'').trim();
 const message=form.querySelector('.form-message');
 const copied=await copyText(value);
 if(message)message.textContent=copied?'✓ Бриф скопирован. Отправьте текст вашему менеджеру Cats Team через удобный канал.':'Браузер не разрешил копирование. Выделите текст в поле описания или скопируйте данные вручную.';
 if(copied){const btn=form.querySelector('[type=submit]');if(btn)btn.textContent='✓ Бриф скопирован'}
}));
})();