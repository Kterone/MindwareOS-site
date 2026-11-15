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

  /* ---------- Embers + sparks canvas ---------- */
  var cv=document.getElementById('fx'),ctx=cv.getContext('2d'),W=0,H=0,dpr=1;
  var embers=[],sparks=[];
  function size(){dpr=Math.min(window.devicePixelRatio||1,2);W=window.innerWidth;H=window.innerHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);}
  size();window.addEventListener('resize',size);
  var COLORS=['255,70,0','255,140,0','252,238,10','255,0,60'];
  function newEmber(initial){
    return {x:Math.random()*W,y:initial?Math.random()*H:H+10,r:Math.random()*2.2+.6,vy:-(Math.random()*.9+.3),
      sw:Math.random()*Math.PI*2,sws:Math.random()*.02+.005,swa:Math.random()*.6+.2,life:Math.random()*.6+.4,c:COLORS[(Math.random()*COLORS.length)|0],tw:Math.random()*6};
  }
  var N=reduce?0:Math.min(110,Math.floor(W/14));
  for(var i=0;i<N;i++)embers.push(newEmber(true));

  function burst(x,y,n){
    if(reduce)return;
    for(var i=0;i<n;i++){
      var a=Math.random()*Math.PI*2,sp=Math.random()*6+1.5;
      sparks.push({x:x,y:y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-1.5,life:1,decay:Math.random()*.02+.012,c:COLORS[(Math.random()*COLORS.length)|0],len:Math.random()*8+4});
    }
    if(sparks.length>700)sparks.splice(0,sparks.length-700);
  }
  var lastMove=0;
  window.addEventListener('mousemove',function(e){var t=performance.now();if(t-lastMove>45){lastMove=t;burst(e.clientX,e.clientY,2);}},{passive:true});
  window.addEventListener('click',function(e){burst(e.clientX,e.clientY,36);},{passive:true});
  window.addEventListener('touchstart',function(e){var t=e.touches[0];if(t)burst(t.clientX,t.clientY,30);},{passive:true});
  // random sparks falling from the top like a welding arc
  setInterval(function(){if(!document.hidden&&!reduce)burst(Math.random()*W,-5,3);},700);

  function frame(){
    ctx.clearRect(0,0,W,H);
    ctx.globalCompositeOperation='lighter';
    for(var i=0;i<embers.length;i++){
      var e=embers[i];e.sw+=e.sws;e.x+=Math.sin(e.sw)*e.swa;e.y+=e.vy;e.tw+=.08;
      var a=e.life*(.55+.45*Math.sin(e.tw))*Math.min(1,e.y/(H*.5)+.15);
      var g=ctx.createRadialGradient(e.x,e.y,0,e.x,e.y,e.r*6);
      g.addColorStop(0,'rgba('+e.c+','+a+')');g.addColorStop(1,'rgba('+e.c+',0)');
      ctx.fillStyle=g;ctx.beginPath();ctx.arc(e.x,e.y,e.r*6,0,6.2832);ctx.fill();
      if(e.y<-20)embers[i]=newEmber(false);
    }
    for(var j=sparks.length-1;j>=0;j--){
      var s=sparks[j];s.vy+=.14;s.vx*=.985;s.x+=s.vx;s.y+=s.vy;s.life-=s.decay;
      if(s.life<=0||s.y>H+20){sparks.splice(j,1);continue;}
      ctx.strokeStyle='rgba('+s.c+','+s.life+')';ctx.lineWidth=1.6;ctx.lineCap='round';
      ctx.beginPath();ctx.moveTo(s.x,s.y);ctx.lineTo(s.x-s.vx*s.len*.35,s.y-s.vy*s.len*.35);ctx.stroke();
    }
    ctx.globalCompositeOperation='source-over';
    requestAnimationFrame(frame);
  }
  if(!reduce)requestAnimationFrame(frame);
})();
