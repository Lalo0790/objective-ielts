// Small UI helpers, charts, TTS and recorder.
export const $ = (s, el=document) => el.querySelector(s);
export const $$ = (s, el=document) => [...el.querySelectorAll(s)];
export const esc = (s='') => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function toast(msg){ const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('on'), 2600); }
export const norm = s => String(s||'').toLowerCase().replace(/[’']/g,"'").replace(/[^a-z0-9:.\- ']/g,' ').replace(/\s+/g,' ').trim().replace(/\.$/,'');
export const matches = (given, accepted) => { const g = norm(given); return !!g && accepted.some(a => norm(a) === g || norm(a).replace(/[-\s]/g,'') === g.replace(/[-\s]/g,'')); };
export const wordCount = s => (String(s||'').trim().match(/[A-Za-zÀ-ÿ0-9'’-]+/g) || []).length;
export const roman = i => ['i','ii','iii','iv','v','vi','vii','viii','ix','x'][i];
export const letter = i => 'ABCDEFGH'[i];
export const halfRound = x => Math.round(x*2)/2;
export const fmtBand = x => x == null || isNaN(x) ? '—' : Number(x).toFixed(1);
export function seededShuffle(arr, seed){ const a = arr.slice(); let s = 0; for (const c of String(seed)) s = (s*31 + c.charCodeAt(0)) >>> 0;
  for (let i = a.length-1; i > 0; i--){ s = (s*1103515245 + 12345) >>> 0; const j = s % (i+1); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const MES = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
const DIA = ['dom','lun','mar','mié','jue','vie','sáb'];
export function fmtDate(iso, withDay=true){ const [y,m,d] = iso.split('-').map(Number); const dt = new Date(y,m-1,d); return `${withDay ? DIA[dt.getDay()]+' ' : ''}${d} ${MES[m-1]}`; }
export const icons = {
  home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r=".6" fill="currentColor"/></svg>',
  plan:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="17" rx="3"/><path d="M3 9h18M8 2v4M16 2v4"/></svg>',
  prog:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19V10M10 19V5M16 19v-6M22 19H2"/></svg>',
  fb:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1.1-4.6A8 8 0 1 1 21 12z"/></svg>',
  play:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
  stop:'<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>',
  mic:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',
  out:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>',
  gear:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
  left:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>'
};
// ---------- charts (SVG, no libraries) ----------
const PAL = ['#14213D','#E4572E','#F2B134','#1F7A6D','#7A8CB3','#B86E12'];
export function chartHTML(c){
  const legend = `<div class="legend">${c.series.map((s,i)=>`<span><i style="background:${PAL[i]}"></i>${esc(s.name)}</span>`).join('')}</div>`;
  if (c.type === 'table'){
    return `<div class="chartbox"><h4>${esc(c.title)}</h4><table class="data"><tr><th></th>${c.series.map(s=>`<th>${esc(s.name)}</th>`).join('')}</tr>${c.categories.map((cat,ci)=>`<tr><th>${esc(cat)}</th>${c.series.map(s=>`<td>${s.data[ci]}</td>`).join('')}</tr>`).join('')}</table></div>`;
  }
  if (c.type === 'pie'){
    const pies = c.series.map(s => { let a0 = -Math.PI/2; const tot = s.data.reduce((x,y)=>x+y,0);
      const segs = s.data.map((v,i)=>{ const a1 = a0 + v/tot*Math.PI*2; const large = a1-a0 > Math.PI ? 1 : 0; const p = (a)=>[60+52*Math.cos(a), 60+52*Math.sin(a)];
        const [x0,y0]=p(a0),[x1,y1]=p(a1); const mid=(a0+a1)/2; const lx=60+34*Math.cos(mid), ly=60+34*Math.sin(mid); a0=a1;
        return `<path d="M60 60 L${x0.toFixed(1)} ${y0.toFixed(1)} A52 52 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}Z" fill="${PAL[i]}" stroke="#fff" stroke-width="1.5"/><text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" fill="#fff" font-size="10" font-weight="700" text-anchor="middle" dominant-baseline="middle">${v}%</text>`; }).join('');
      return `<figure style="margin:0;text-align:center"><svg viewBox="0 0 120 120" width="150" height="150">${segs}</svg><figcaption style="font-weight:700;font-size:.85rem">${esc(s.name)}</figcaption></figure>`; }).join('');
    const leg = `<div class="legend">${c.categories.map((k,i)=>`<span><i style="background:${PAL[i]}"></i>${esc(k)}</span>`).join('')}</div>`;
    return `<div class="chartbox"><h4>${esc(c.title)}</h4><div class="row" style="justify-content:center;gap:18px">${pies}</div>${leg}</div>`;
  }
  const W = 520, H = 260, L = 46, B = 34, T = 12, R = 10; const all = c.series.flatMap(s=>s.data); const max = Math.max(...all)*1.12; const min = c.type==='line' && Math.min(...all) > max*0.5 ? Math.floor(Math.min(...all)*0.9) : 0;
  const y = v => T + (H-T-B) * (1 - (v-min)/(max-min)); const n = c.categories.length; const bw = (W-L-R)/n;
  let grid = ''; for (let i=0;i<=4;i++){ const v = min + (max-min)*i/4; grid += `<line x1="${L}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}" stroke="#E2D8C6"/><text x="${L-6}" y="${y(v)+4}" font-size="10" text-anchor="end" fill="#6B7287">${+v.toFixed(v<10?1:0)}</text>`; }
  const xl = c.categories.map((k,i)=>`<text x="${L+bw*i+bw/2}" y="${H-B+16}" font-size="10.5" text-anchor="middle" fill="#3A4560">${esc(k)}</text>`).join('');
  let body = '';
  if (c.type === 'bar'){ const gw = bw*0.74, sw = gw/c.series.length;
    c.series.forEach((s,si)=> s.data.forEach((v,i)=>{ const x = L+bw*i+(bw-gw)/2+sw*si; body += `<rect x="${x.toFixed(1)}" y="${y(v).toFixed(1)}" width="${(sw-2).toFixed(1)}" height="${(y(min)-y(v)).toFixed(1)}" rx="2" fill="${PAL[si]}"/>`; })); }
  else { c.series.forEach((s,si)=>{ const pts = s.data.map((v,i)=>`${(L+bw*i+bw/2).toFixed(1)},${y(v).toFixed(1)}`); body += `<polyline points="${pts.join(' ')}" fill="none" stroke="${PAL[si]}" stroke-width="2.5"/>` + pts.map(p=>`<circle cx="${p.split(',')[0]}" cy="${p.split(',')[1]}" r="3.5" fill="#fff" stroke="${PAL[si]}" stroke-width="2"/>`).join(''); }); }
  return `<div class="chartbox"><h4>${esc(c.title)}</h4><svg viewBox="0 0 ${W} ${H}" width="100%" style="min-width:340px">${grid}${body}${xl}<text x="12" y="${T+4}" font-size="10" fill="#6B7287" transform="rotate(-90 12 ${T+4})" text-anchor="end">${esc(c.unit)}</text></svg>${legend}</div>`;
}
// ---------- text to speech ----------
let voices = [];
function loadVoices(){ voices = (window.speechSynthesis?.getVoices() || []).filter(v => /^en(-|_)/i.test(v.lang)); }
if ('speechSynthesis' in window){ loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }
const FEM = /female|samantha|karen|moira|tessa|serena|victoria|fiona|susan|zira|hazel|libby|sonia|aria|jenny|kate|martha|catherine|allison|ava|nicky/i;
const MAL = /male|daniel|alex|fred|oliver|arthur|george|david|mark|ryan|guy|thomas|aaron|rishi|gordon|lee/i;
function pickVoice(g, idx){ if (!voices.length) loadVoices(); const pref = voices.filter(v => /en-GB|en-AU|en-US|en-IE|en-NZ/i.test(v.lang));
  const pool = pref.length ? pref : voices; const want = pool.filter(v => g === 'F' ? FEM.test(v.name) && !/\bmale\b/i.test(v.name.replace(/female/i,'')) : MAL.test(v.name) && !/female/i.test(v.name));
  return (want.length ? want : pool)[idx % Math.max(1,(want.length ? want : pool).length)] || null; }
export const ttsAvailable = () => 'speechSynthesis' in window;
export function speakScript(script, { onend, online } = {}){
  const synth = window.speechSynthesis; synth.cancel();
  const spk = Object.keys(script.speakers); let i = 0, cancelled = false;
  const next = () => { if (cancelled) return; if (i >= script.lines.length){ onend && onend(); return; }
    const [who, text] = script.lines[i]; const u = new SpeechSynthesisUtterance(text); const g = script.speakers[who] || 'F';
    const v = pickVoice(g, spk.indexOf(who)); if (v){ u.voice = v; u.lang = v.lang; } else u.lang = 'en-GB';
    u.rate = 0.93; u.pitch = g === 'F' ? 1.05 : 0.92; u.onend = () => { i++; setTimeout(next, 280); }; u.onerror = () => { i++; next(); };
    online && online(i); synth.speak(u); };
  next();
  return { stop(){ cancelled = true; synth.cancel(); } };
}
// ---------- recorder ----------
export function recorderSupported(){ return !!(navigator.mediaDevices?.getUserMedia && window.MediaRecorder); }
export async function startRecording(){
  const stream = await navigator.mediaDevices.getUserMedia({ audio:true });
  const type = ['audio/mp4','audio/webm;codecs=opus','audio/webm','audio/ogg'].find(t => MediaRecorder.isTypeSupported?.(t)) || '';
  const mr = new MediaRecorder(stream, type ? { mimeType:type } : undefined); const chunks = [];
  mr.ondataavailable = e => e.data.size && chunks.push(e.data); mr.start(1000);
  return { stop: () => new Promise(r => { mr.onstop = () => { stream.getTracks().forEach(t => t.stop()); r(new Blob(chunks, { type: mr.mimeType || type || 'audio/webm' })); }; mr.stop(); }) };
}
