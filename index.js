const TARGET   = new Date('2026-05-24T13:55:00Z');
const START_MS = new Date('2026-04-25T13:55:00Z').getTime();
const TOTAL_MS = TARGET.getTime() - START_MS;

function pad(n) { return String(n).padStart(2, '0'); }

function flipDigit(el, newVal) {
  const str = pad(newVal);
  if (el.textContent !== str) {
    el.classList.remove('flip');
    void el.offsetWidth;
    el.textContent = str;
    el.classList.add('flip');
  }
}

let timer = null;


// ── Starfield ──
const canvas = document.getElementById('stars');
const ctx    = canvas.getContext('2d');
let stars = [];

function initStars() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  stars = Array.from({length: 180}, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.2 + .2,
    a: Math.random(),
    speed: Math.random() * .3 + .05
  }));
}

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach(s => {
    s.a += s.speed * .01;
    const alpha = (Math.sin(s.a) + 1) / 2;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,255,136,${alpha * .7})`;
    ctx.fill();
  });
  requestAnimationFrame(drawStars);
}

// ── Floating particles ──
const pContainer = document.getElementById('particles');
for (let i = 0; i < 24; i++) {
  const p = document.createElement('div');
  p.className = 'particle';
  p.style.left = Math.random() * 100 + 'vw';
  p.style.bottom = '-10px';
  p.style.animationDuration = (Math.random() * 14 + 8) + 's';
  p.style.animationDelay    = (Math.random() * 10) + 's';
  p.style.width = p.style.height = (Math.random() * 3 + 1) + 'px';
  p.style.opacity = Math.random() * .5 + .1;
  pContainer.appendChild(p);
}


function tick() {
  const now  = Date.now();
  const diff = TARGET.getTime() - now;

  if (diff <= 0) {
    ['d-days','d-hours','d-mins','d-secs'].forEach(id => {
      document.getElementById(id).textContent = '00';
    });
    document.getElementById('progress-fill').style.width = '100%';
    document.getElementById('pct-label').textContent = '🚀 TGE Live!';
    clearInterval(timer);
    return;
  }

  const days  = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins  = Math.floor((diff % 3600000)  / 60000);
  const secs  = Math.floor((diff % 60000)    / 1000);

  flipDigit(document.getElementById('d-days'),  days);
  flipDigit(document.getElementById('d-hours'), hours);
  flipDigit(document.getElementById('d-mins'),  mins);
  flipDigit(document.getElementById('d-secs'),  secs);

  const elapsed = now - START_MS;
  const pct = Math.min(100, (elapsed / TOTAL_MS) * 100);
  document.getElementById('progress-fill').style.width = pct.toFixed(4) + '%';
  document.getElementById('pct-label').textContent = pct.toFixed(2) + '% Too TGE';
}

tick();
timer = setInterval(tick, 1000);

initStars();
drawStars();
window.addEventListener('resize', initStars);
