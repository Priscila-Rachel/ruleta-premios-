const OPTS = [
  // 1. Nada: Violeta oscuro
  { k: 'x', l: 'Nada', icon: 'ico-x', c1: '#362354', c2: '#160e24', t: '¡Casi!', m: 'Esta vez no hubo premio. ¡Probá otra vez!' },
  
  // 2. Llavero: Celeste / Cian eléctrico
  { k: 'llavero', l: 'Llavero', icon: 'ico-llavero', c1: '#00f2ff', c2: '#0066ff', t: '¡Ganaste un llavero!', m: '¡Felicitaciones, ya es tuyo!' },
  
  // 3. Figura chica: Verde láser
  { k: 'figura', l: 'Figura chica', icon: 'ico-figura', c1: '#00ff9d', c2: '#008a4b', t: '¡Ganaste una figura!', m: '¡Genial! Pasá a retirar tu premio.' },
  
  // 4. Nada: Azul noche profundo
  { k: 'x', l: 'Nada', icon: 'ico-x', c1: '#222947', c2: '#0f1322', t: '¡Casi!', m: 'Esta vez no hubo suerte. ¡Volvé a girar!' },
  
  // 5. Llavero: Naranja eléctrico
  { k: 'llavero', l: 'Llavero', icon: 'ico-llavero', c1: '#ff7700', c2: '#b83200', t: '¡Ganaste un llavero!', m: '¡Premio desbloqueado con éxito!' },
  
  // 6. Tirada gratis: Magenta / Púrpura eléctrico
  { k: 'free', l: 'Tiro extra', icon: 'ico-tiro-gratis', c1: '#d900ff', c2: '#770099', t: '¡Tirada gratis!', m: '¡Tenés otra oportunidad sin cargo! Volvé a probar tu suerte.' },
  
  // 7. Sorpresa: Amarillo neón / oro
  { k: 'sorpresa', l: 'Sorpresa', icon: 'ico-sorpresa', c1: '#ffee00', c2: '#d48800', t: '¡Premio sorpresa!', m: '¡Misterio develado! Preguntá por tu regalo especial.' }
];

const N = OPTS.length;
const A = 360 / N;
const CX = 200;
const CY = 200;
const R = 188;

let currentRot = 0;
let busy = false;

const wheel = document.getElementById('wheel');
const pointer = document.getElementById('pointer');
const spinBtn = document.getElementById('spin');
const closeBtn = document.getElementById('close');
const modal = document.getElementById('modal');

/* ==================== MOTOR DE AUDIO ==================== */
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function soundClick() {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(650 + Math.random() * 200, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.04);
}

function soundWin() {
  if (!audioCtx) return;
  const notes = [440, 554.37, 659.25, 880];
  notes.forEach((f, idx) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.frequency.value = f;
    gain.gain.setValueAtTime(0.18, audioCtx.currentTime + idx * 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.1 + 0.35);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(audioCtx.currentTime + idx * 0.1);
    osc.stop(audioCtx.currentTime + idx * 0.1 + 0.35);
  });
}

function soundMiss() {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(260, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(140, audioCtx.currentTime + 0.35);
  gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.35);
}

/* ==================== GEOMETRÍA POLAR ==================== */
function pt(r, deg) {
  const d = (deg * Math.PI) / 180;
  return `${(CX + r * Math.sin(d)).toFixed(2)} ${(CY - r * Math.cos(d)).toFixed(2)}`;
}

/* ==================== CONSTRUCCIÓN DE LA RULETA ==================== */
function buildWheel() {
  const halfA = A / 2;
  const p0 = pt(R, -halfA);
  const p1 = pt(R, halfA);
  const wedgeD = `M${CX} ${CY} L${p0} A${R} ${R} 0 0 1 ${p1} Z`;

  let s = '<defs>';

  // Degradados de cada porción (neón radiante de afuera hacia adentro)
  OPTS.forEach((o, i) => {
    s += `<linearGradient id="grad${i}" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stop-color="${o.c1}" />
            <stop offset="100%" stop-color="${o.c2}" />
          </linearGradient>`;
  });

  // Centro estilo gema cian neón para conectar con el título
  s += `<radialGradient id="centerHub" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#e0faff"/>
          <stop offset="45%" stop-color="#00f2ff"/>
          <stop offset="100%" stop-color="#005599"/>
        </radialGradient>`;

  s += `
    <symbol id="ico-x" viewBox="0 0 50 50">
      <circle cx="25" cy="25" r="22" fill="rgba(0,0,0,0.3)"/>
      <path d="M16 16 L34 34 M34 16 L16 34" stroke="#ff0055" stroke-width="5" stroke-linecap="round"/>
    </symbol>

    <symbol id="ico-llavero" viewBox="0 0 50 50">
      <circle cx="25" cy="15" r="8" fill="none" stroke="#ffee00" stroke-width="3.5"/>
      <path d="M25 23 L25 41 M25 31 L32 31 M25 37 L30 37" stroke="#ffffff" stroke-width="3.2" stroke-linecap="round"/>
    </symbol>

    <symbol id="ico-figura" viewBox="0 0 50 50">
      <ellipse cx="25" cy="38" rx="13" ry="8" fill="rgba(0,0,0,0.25)"/>
      <circle cx="25" cy="19" r="9" fill="#ffffff"/>
      <circle cx="22" cy="18" r="1.8" fill="#0f0c29"/>
      <circle cx="28" cy="18" r="1.8" fill="#0f0c29"/>
      <path d="M23 22 Q25 24 27 22" fill="none" stroke="#0f0c29" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M17 28 C17 25 33 25 33 28 L35 41 C35 43 15 43 15 41 Z" fill="#00f2ff"/>
    </symbol>

    <symbol id="ico-sorpresa" viewBox="0 0 50 50">
      <rect x="11" y="19" width="28" height="23" rx="3" fill="#ffee00" stroke="#fff" stroke-width="1.5"/>
      <rect x="8" y="13" width="34" height="7" rx="2" fill="#ff7700" stroke="#fff" stroke-width="1.5"/>
      <rect x="22" y="13" width="6" height="29" fill="#ff007f"/>
      <path d="M25 13 C21 6 15 9 19 13 C15 13 15 5 25 13 C35 5 35 13 31 13 C35 9 29 6 25 13" fill="#ff007f"/>
    </symbol>

    <symbol id="ico-tiro-gratis" viewBox="0 0 50 50">
      <circle cx="25" cy="25" r="22" fill="rgba(0,0,0,0.25)"/>
      <!-- Flecha circular neón -->
      <path d="M25 10 A15 15 0 1 1 11 28" fill="none" stroke="#00f2ff" stroke-width="4" stroke-linecap="round"/>
      <path d="M25 5 L31 10 L25 15 Z" fill="#00f2ff"/>
      <circle cx="25" cy="25" r="4" fill="#ffee00"/>
    </symbol>
  </defs>`;

  s += `<g id="wheelPlate">`;

  // Aro exterior con filo neón cian/azul
  s += '<circle cx="200" cy="200" r="198" fill="#120b29" stroke="#00f2ff" stroke-width="3.5" style="filter: drop-shadow(0 0 6px rgba(0, 242, 255, 0.6));"/>';
  s += '<circle cx="200" cy="200" r="192" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1.5"/>';

  // Porciones con bordes luminosos
  OPTS.forEach((o, i) => {
    s += `<g transform="rotate(${i * A} ${CX} ${CY})">
            <path d="${wedgeD}" fill="url(#grad${i})" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
            <use href="#${o.icon}" x="183" y="38" width="34" height="34" />
            <text x="200" y="92" text-anchor="middle" font-size="14" font-weight="700" fill="#ffffff" style="letter-spacing:0.5px; filter: drop-shadow(0 2px 5px rgba(0,0,0,0.9)); pointer-events: none;">${o.l}</text>
          </g>`;
  });

  // Remaches con brillo neón cian
  for (let p = 0; p < N * 2; p++) {
    const ang = p * (360 / (N * 2));
    const [px, py] = pt(193, ang).split(' ');
    s += `<circle cx="${px}" cy="${py}" r="3" fill="#00f2ff" stroke="#ffffff" stroke-width="1"/>`;
  }

  // Centro neón
  s += '<circle cx="200" cy="200" r="28" fill="url(#centerHub)" stroke="#ffffff" stroke-width="3" style="filter: drop-shadow(0 0 8px rgba(0, 242, 255, 0.7));"/>';
  s += '<circle cx="200" cy="200" r="8" fill="#120b29"/>';

  s += `</g>`;

  wheel.innerHTML = s;
}

/* ==================== GIRO Y RESULTADOS ==================== */
function spin() {
  if (busy) return;
  initAudio();
  busy = true;
  spinBtn.disabled = true;

  const chosenIndex = Math.floor(Math.random() * N);
  const jitter = (Math.random() - 0.5) * (A - 12);
  const targetAngle = (((-chosenIndex * A + jitter) % 360) + 360) % 360;
  const delta = ((targetAngle - (currentRot % 360)) + 360) % 360;

  const totalDegrees = 360 * 6 + delta;
  const startRot = currentRot;
  const finalRot = currentRot + totalDegrees;
  const duration = 5200;
  let startTime = null;
  let lastSector = Math.floor((currentRot % 360) / (360 / (N * 2)));

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3.5);
  }

  function frame(time) {
    if (!startTime) startTime = time;
    const progress = Math.min((time - startTime) / duration, 1);
    const eased = easeOutCubic(progress);
    const deg = startRot + totalDegrees * eased;

    const plate = document.getElementById('wheelPlate');
    if (plate) {
      plate.setAttribute('transform', `rotate(${deg} 200 200)`);
    }

    const currentSector = Math.floor((deg % 360) / (360 / (N * 2)));
    if (currentSector !== lastSector) {
      lastSector = currentSector;
      soundClick();
      pointer.classList.add('flick');
      setTimeout(() => pointer.classList.remove('flick'), 60);
    }

    if (progress < 1) {
      requestAnimationFrame(frame);
    } else {
      currentRot = finalRot;
      finishSpin(OPTS[chosenIndex]);
    }
  }

  requestAnimationFrame(frame);
}

function finishSpin(result) {
  const card = document.querySelector('.card');
  const isWin = result.k !== 'x';

  // Activa el modo neón ganador para premios y tiro gratis
  card.className = isWin ? 'card is-win' : 'card is-miss';

  document.getElementById('rIcon').innerHTML = `<svg viewBox="0 0 50 50" width="85" height="85"><use href="#${result.icon}" width="50" height="50"/></svg>`;
  document.getElementById('rTitle').textContent = result.t;
  document.getElementById('rText').textContent = result.m;
  
  // Cambia el texto del botón si es tirada gratis
  if (result.k === 'free') {
    closeBtn.textContent = '¡Girar de nuevo!';
  } else {
    closeBtn.textContent = 'Seguir jugando';
  }

  modal.classList.add('show');

  if (isWin) {
    soundWin();
    launchConfetti();
  } else {
    soundMiss();
  }
  closeBtn.focus();
}


/* ==================== CONFETI NEÓN ==================== */
/* ==================== CONFETI NEÓN ==================== */
const canvas = document.getElementById('confettiCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animId = null;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function launchConfetti() {
  // Asegura medidas reales de pantalla al disparar
  resizeCanvas();

  // Si había una animación previa corriendo, la frena para no duplicar frames
  if (animId) cancelAnimationFrame(animId);

  particles = [];
  const colors = ['#00f2ff', '#ff007f', '#00ff9d', '#ffee00', '#ff7700', '#ffffff'];

  const originX = canvas.width > 0 ? canvas.width / 2 : window.innerWidth / 2;
  const originY = canvas.height > 0 ? canvas.height / 2 : window.innerHeight / 2;

  for (let i = 0; i < 90; i++) {
    particles.push({
      x: originX,
      y: originY,
      vx: (Math.random() - 0.5) * 18,
      vy: (Math.random() - 0.8) * 20,
      size: Math.random() * 8 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 12,
      alpha: 1
    });
  }

  renderConfetti();
}

function renderConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let stillAlive = false;

  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.35; // Gravedad
    p.rotation += p.rotSpeed;
    p.alpha -= 0.009; // Desvanecimiento progresivo

    if (p.alpha > 0) {
      stillAlive = true;
      ctx.save();
      ctx.globalAlpha = Math.max(p.alpha, 0);
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    }
  });

  if (stillAlive) {
    animId = requestAnimationFrame(renderConfetti);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    animId = null;
  }
}

/* ==================== EVENTOS ==================== */
spinBtn.addEventListener('click', spin);

closeBtn.addEventListener('click', () => {
  modal.classList.remove('show');
  busy = false;
  spinBtn.disabled = false;
});

buildWheel();