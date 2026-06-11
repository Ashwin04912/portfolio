/* ── CURSOR ── */
const dot = document.getElementById('cdot');
const ring = document.getElementById('cring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
function animCursor() {
  dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(animCursor);
}
animCursor();
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => { ring.style.transform = 'translate(-50%,-50%) scale(1.6)'; ring.style.opacity = '0.8'; });
  el.addEventListener('mouseleave', () => { ring.style.transform = 'translate(-50%,-50%) scale(1)'; ring.style.opacity = '0.5'; });
});

/* ── NOISE CANVAS ── */
const nc = document.getElementById('noise-canvas');
const nctx = nc.getContext('2d');
function resizeNoise() { nc.width = window.innerWidth; nc.height = window.innerHeight; }
resizeNoise();
window.addEventListener('resize', resizeNoise);
let nframe = 0;
function drawNoise() {
  const W = nc.width, H = nc.height;
  nctx.clearRect(0, 0, W, H);
  nctx.strokeStyle = 'rgba(15,14,13,0.055)';
  nctx.lineWidth = 1;
  const t = nframe * 0.008;
  for (let i = 0; i < 5; i++) {
    const amp = 18 + i * 10;
    const freq = 0.006 + i * 0.002;
    const yBase = H * (0.3 + i * 0.15);
    nctx.beginPath();
    for (let x = 0; x <= W; x += 3) {
      const y = yBase + Math.sin(x * freq + t + i * 1.3) * amp + Math.sin(x * freq * 2 + t * 1.7) * (amp * 0.4);
      x === 0 ? nctx.moveTo(x, y) : nctx.lineTo(x, y);
    }
    nctx.stroke();
  }
  nframe++;
  requestAnimationFrame(drawNoise);
}
drawNoise();

/* ── MARQUEE ── */
const items = ['Flutter', 'ESP32', 'Laravel', 'Python', 'Raspberry Pi', 'Docker', 'BLoC', 'AWS EC2', 'KiCad', 'Arduino', 'Supabase', 'Amateur Radio', 'Linux', 'Dart', 'MySQL'];
const mt = document.getElementById('mtrack');
const dbl = [...items, ...items];
mt.innerHTML = dbl.map((s, i) => `<span class="marquee-item${i % 5 === 0 ? ' hot' : ''}">${s} /</span>`).join('');

/* ── PROJECT FILTER ── */
document.querySelectorAll('.pswitch').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.pswitch').forEach(b => b.classList.remove('on'));
    btn.classList.add('on');
    const f = btn.dataset.filter;
    document.querySelectorAll('.proj-card').forEach(card => {
      const show = f === 'all' || card.dataset.cat === f;
      card.classList.toggle('hidden', !show);
      if (show) {
        card.style.animation = 'none';
        card.offsetHeight;
        card.style.animation = 'fadeCard 0.4s ease forwards';
      }
    });
  });
});

/* inject fadeCard */
const styleEl = document.createElement('style');
styleEl.textContent = '@keyframes fadeCard { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }';
document.head.appendChild(styleEl);

/* ── SCROLL REVEAL ── */
const observer = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      e.target.style.transitionDelay = (i * 0.06) + 's';
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ── COUNTER ANIMATION ── */
function animCount(el, target, suffix) {
  let start = 0;
  const dur = 1200;
  const step = timestamp => {
    if (!start) start = timestamp;
    const prog = Math.min((timestamp - start) / dur, 1);
    const ease = 1 - Math.pow(1 - prog, 3);
    el.parentElement.querySelector('.stat-big').innerHTML = Math.floor(ease * target) + '<span class="accent">' + suffix + '</span>';
    if (prog < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statsObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const data = [{t:3,s:'+'},{t:6,s:'+'},{t:500,s:'+'},{t:94,s:'%'}];
      document.querySelectorAll('.stat-big').forEach((el, i) => {
        if (data[i]) setTimeout(() => animCount(el, data[i].t, data[i].s), i * 120);
      });
      statsObs.disconnect();
    }
  });
}, { threshold: 0.3 });
const statsEl = document.querySelector('.stats-cluster');
if (statsEl) statsObs.observe(statsEl);

/* ── STAGGER XP ROWS ── */
document.querySelectorAll('.xp-row').forEach((row, i) => {
  row.style.transitionDelay = (i * 0.08) + 's';
});
