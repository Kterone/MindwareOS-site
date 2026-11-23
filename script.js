(function(){
  'use strict';
  var RAW='https://raw.githubusercontent.com/Kterone/MindwareOS/main/install.sh';
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Boot sequence ---------- */
  var boot=document.getElementById('boot'), log=document.getElementById('boot-log');
  var lines=['> MINDWARE_OS // BOOT v1.0.0','> mounting /dev/mind ........ OK','> loading neural interface .... OK','> igniting embers ............. OK','> WAKE UP, SAMURAI.'];
  function runBoot(){
    if(reduce){boot.classList.add('done');return;}
    var i=0;(function next(){
      if(i<lines.length){log.textContent+=lines[i++]+'\n';setTimeout(next,170);}
      else setTimeout(function(){boot.classList.add('done');},350);
    })();
  }
  runBoot();

  /* ---------- Terminal typing demo ---------- */
  var out=document.getElementById('term-out');
  var script=[
    ['<span class="p">root@archiso</span> ~ # <span class="y">bash install.sh</span>',500],
    ['',100],
    ['<span class="p">MINDWARE OS</span>  Arch-based · Built for thinkers · v1.0.0',350],
    ['<span class="ok"> ✓</span> UEFI mode detected',300],
    ['<span class="ok"> ✓</span> Internet connection alive',300],
    ['<span class="ok"> ✓</span> NVIDIA / AMD / Intel GPU detection ... done',320],
    ['<span class="y"> ?</span> Select a Desktop Environment: [1] KDE  [2] GNOME  [3] XFCE ...',420],
    ['<span class="ok"> ✓</span> Partitioning complete. Disk has been transformed.',380],
    ['<span class="ok"> ✓</span> Base system installed. We have a foundation.',380],
    ['<span class="p"> "An OS that respects your intelligence."</span>',600]
  ];
  function renderTerm(n){out.innerHTML=script.slice(0,n).map(function(s){return s[0];}).join('\n')+(n<script.length?'\n<span class="cur"></span>':'\n<span class="cur"></span>');}
  if(reduce){renderTerm(script.length);}
  else{
    var step=0;(function tick(){
      renderTerm(step+1);step++;
      if(step<script.length)setTimeout(tick,script[step-1][1]+250);
      else setTimeout(function(){step=0;out.innerHTML='';setTimeout(tick,600);},4500);
    })();
  }

  /* ---------- Scroll reveal ---------- */
  var targets=document.querySelectorAll('.panel,.card,.step,.stages li,.table-wrap,.warn,.h,.sec-sub');
  targets.forEach(function(el){el.classList.add('rv');});
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12});
    targets.forEach(function(el){io.observe(el);});
  } else targets.forEach(function(el){el.classList.add('in');});

  /* ---------- Copy buttons ---------- */
  document.querySelectorAll('.copy').forEach(function(b){
    b.addEventListener('click',function(){
      var t=b.getAttribute('data-copy');
      function done(){var o=b.textContent;b.textContent='COPIED';setTimeout(function(){b.textContent=o;},1200);}
      if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(done,done);}
      else{var ta=document.createElement('textarea');ta.value=t;document.body.appendChild(ta);ta.select();try{document.execCommand('copy');}catch(e){}ta.remove();done();}
    });
  });

  /* ---------- Download install.sh ---------- */
  var note=document.getElementById('dl-note');
  function download(){
    note.textContent='> fetching install.sh ...';
    fetch(RAW,{cache:'no-store'}).then(function(r){if(!r.ok)throw new Error(r.status);return r.blob();}).then(function(blob){
      var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='install.sh';document.body.appendChild(a);a.click();a.remove();
      setTimeout(function(){URL.revokeObjectURL(a.href);},2000);
      note.textContent='> install.sh downloaded. Read it, then run: bash install.sh';
      burst(window.innerWidth/2,window.innerHeight/2,90);
    }).catch(function(){
      note.textContent='> direct download blocked, opening the raw file instead (use Save As).';
      window.open(RAW,'_blank','noopener');
    });
  }
  ['dl-btn','dl-btn2'].forEach(function(id){var b=document.getElementById(id);if(b)b.addEventListener('click',download);});


  /* ---------- Mobile menu ---------- */
  var burger=document.getElementById('burger'),menu=document.getElementById('menu');
  if(burger&&menu){
    burger.addEventListener('click',function(){var o=menu.classList.toggle('open');burger.setAttribute('aria-expanded',o);});
    menu.addEventListener('click',function(e){if(e.target.tagName==='A'){menu.classList.remove('open');burger.setAttribute('aria-expanded',false);}});
  }

  function burst(){}


  /* ---------- Zig-zag loader percentages ---------- */
  (function(){
    var els=document.querySelectorAll('.zz');if(!els.length)return;
    function run(z){
      var b=z.querySelector('[data-pct]');if(!b||z._done)return;z._done=true;
      if(reduce){b.textContent='100%';return;}
      var p=0;(function t(){p+=Math.ceil(Math.random()*9);if(p>100)p=100;b.textContent=p+'%';if(p<100)setTimeout(t,60);})();
    }
    if('IntersectionObserver' in window){
      var io2=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){run(e.target);io2.unobserve(e.target);}});},{threshold:.6});
      els.forEach(function(z){io2.observe(z);});
    } else els.forEach(run);
  })();

  /* ---------- Partner module (Deepak Sharma) ---------- */
  (function(){
    var box=document.getElementById('partner'),frame=document.getElementById('partner-frame'),close=document.getElementById('partner-close');
    if(!box||!frame)return;
    function open(scroll){
      box.classList.add('open');
      if(!frame.getAttribute('src'))frame.setAttribute('src',frame.getAttribute('data-src'));
      if(scroll)setTimeout(function(){box.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});},60);
    }
    document.querySelectorAll('[data-partner]').forEach(function(a){
      a.addEventListener('click',function(e){e.preventDefault();open(true);});
    });
    if(close)close.addEventListener('click',function(){box.classList.remove('open');window.scrollTo({top:0,behavior:reduce?'auto':'smooth'});});
    window.addEventListener('message',function(e){
      if(e.source!==frame.contentWindow||!e.data||e.data.type!=='partner-height')return;
      var h=Number(e.data.h);if(h>200&&h<20000)frame.style.height=h+'px';
    });
    if(location.hash==='#partner')open(true);
  })();
})();
