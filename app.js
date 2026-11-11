import * as db from './db.js';
import { buildDay, planInfo, dayNumber, weekOf, weekStart, addDays, todayISO, diffDays, SKILLS } from './plan.js';
import { renderTask, bindTask } from './tasks.js';
import { DIAGNOSTIC } from './content-production.js';
import { $, $$, esc, toast, icons, fmtDate, fmtBand, halfRound, wordCount } from './ui.js';

const S = { user:null, settings:null, subs:[], fb:[], reviews:[], cleanup:null };
const app = $('#app');
const BANDS = ['','4.0','4.5','5.0','5.5','6.0','6.5','7.0','7.5','8.0','8.5','9.0'];
const SKILL_KEYS = ['reading','listening','writing','speaking'];

// ---------- data ----------
async function loadAll(){
  S.settings = await db.getSettings();
  S.subs = await db.listSubmissions(S.user.role === 'teacher' && S.settings.student_id ? { studentId:S.settings.student_id } : {});
  S.fb = await db.listItemFeedback(S.subs.map(s => s.id));
  S.reviews = await db.listWeeklyReviews();
}
const subFor = (iso, taskId) => S.subs.find(s => s.day_date === iso && s.task_id === taskId);
function dayStatus(iso){ const d = buildDay(S.settings, iso); if (!d) return null; const done = d.tasks.filter(t => subFor(iso, t.id)).length; return { day:d, done, total:d.tasks.length }; }
function streak(){ const t = todayISO(); let n = 0; let cur = t; const st = dayStatus(t); if (!st || st.done < st.total) cur = addDays(t, -1);
  while (true){ const s = dayStatus(cur); if (!s || s.done < s.total) break; n++; cur = addDays(cur, -1); } return n; }
const pctToBand = p => Math.max(3.5, Math.min(8.5, halfRound(3 + p*5)));
function estimates(){
  const start = Number(S.settings.start_band) || 5;
  const est = {};
  for (const sk of ['reading','listening']){
    const xs = S.subs.filter(s => s.skill === sk && s.auto_max).slice(-10).map(s => pctToBand(s.auto_score/s.auto_max));
    est[sk] = xs.length ? halfRound((start*2 + xs.reduce((a,b)=>a+b,0)) / (2 + xs.length)) : start;
  }
  const rev = [...S.reviews].sort((a,b)=>a.week_start < b.week_start ? -1 : 1);
  for (const sk of SKILL_KEYS){ const r = rev.filter(x => x[`band_${sk}`] != null).pop(); if (r) est[sk] = Number(r[`band_${sk}`]); }
  for (const sk of ['writing','speaking']){ if (est[sk] == null){ const ids = new Set(S.subs.filter(s=>s.skill===sk).map(s=>s.id)); const f = S.fb.filter(f => ids.has(f.submission_id) && f.band != null).pop(); est[sk] = f ? Number(f.band) : start; } }
  est.overall = halfRound(SKILL_KEYS.reduce((a,k)=>a+est[k],0)/4);
  return est;
}

// ---------- shell ----------
function shell(inner, tab){
  const teacher = S.user.role === 'teacher'; document.body.classList.toggle('teacher', teacher);
  const top = `<header class="topbar"><div class="wrap ${teacher?'wide':''}"><a class="brand" href="#/"><span class="mark"></span><b>Objective <i>IELTS</i></b></a><span class="spacer"></span>${teacher ? `<span class="chip">Profesor</span><a class="iconbtn" href="#/t/settings" title="Ajustes">${icons.gear}</a>` : ''}<button class="iconbtn" id="logout" title="Salir">${icons.out}</button></div></header>`;
  const tabs = teacher ? '' : `<nav class="tabbar"><div class="wrap">${[['/', 'Hoy', icons.home, 'home'],['/plan','Plan',icons.plan,'plan'],['/progress','Progreso',icons.prog,'prog'],['/feedback','Feedback',icons.fb,'fb']].map(([h,l,i,k])=>`<a href="#${h}" class="${tab===k?'on':''}">${i}<span>${l}</span></a>`).join('')}</div></nav>`;
  app.innerHTML = top + `<main class="fade">${inner}</main>` + tabs;
  $('#logout').onclick = async () => { await db.signOut(); S.user = null; location.hash = '#/'; route(); };
}
window.addEventListener('scroll', () => $('.topbar')?.classList.toggle('scrolled', scrollY > 4), { passive:true });

// ---------- login ----------
function loginView(){
  document.body.classList.remove('teacher');
  app.innerHTML = `<div class="login fade"><div class="box"><span class="mark big"></span><h1>Objective <i>IELTS</i></h1><p class="sub">Tu entrenamiento diario para el IELTS, con revisión semanal de tu profesor.</p>
  <form id="lf" class="mt2"><label class="field"><span>Usuario</span><input class="input" name="u" autocomplete="username" autocapitalize="off" required placeholder="sofi"></label>
  <label class="field"><span>Contraseña</span><input class="input" type="password" name="p" autocomplete="current-password" required></label>
  <div class="err" id="lerr"></div><button class="btn block coral mt" type="submit">Entrar</button></form>
  ${db.getMode()==='local' ? '<p class="small muted mt">Modo demo local: los datos se guardan solo en este dispositivo.</p>' : ''}
  <p class="small muted center mt2">Eduardo García · English Coach</p></div></div>`;
  $('#lf').onsubmit = async (e) => { e.preventDefault(); const f = new FormData(e.target); $('#lerr').textContent = '';
    try { S.user = await db.signIn(f.get('u'), f.get('p')); if (!S.user) throw new Error('no profile'); await loadAll(); location.hash = S.user.role === 'teacher' ? '#/t' : '#/'; route(); }
    catch(err){ console.error(err); $('#lerr').textContent = 'Usuario o contraseña incorrectos.'; } };
}

// ---------- student ----------
function taskRow(iso, t){ const s = subFor(iso, t.id); const col = SKILLS[t.skill].color; const abbr = {reading:'R',listening:'L',writing:'W',speaking:'S',language:'G'}[t.skill];
  const st = s ? (s.auto_max ? `${s.auto_score}/${s.auto_max}` : 'Enviado') : `${t.mins} min`;
  return `<li><a class="task" href="#/task/${iso}/${t.id}"><span class="dot" style="background:${col}">${abbr}</span><span class="meta"><div class="t">${esc(t.title)}</div><div class="s">${esc(t.sub)}</div></span><span class="st ${s?'done':''}">${s ? '✓ ' : ''}${st}</span></a></li>`; }
function homeView(){
  const t = todayISO(); const st = S.settings; const { total } = planInfo(st); const n = dayNumber(st, t); const daysLeft = diffDays(t, st.exam_date);
  const est = estimates(); const name = S.user.display_name;
  const h = new Date().getHours(); const greet = h < 12 ? 'Good morning' : h < 19 ? 'Good afternoon' : 'Good evening';
  let main = '';
  if (n < 1){
    main = `<div class="card"><span class="eyebrow">Tu plan empieza el ${fmtDate(st.start_date)}</span><h2 class="mt">Mientras tanto…</h2><p class="sub">Haz el diagnóstico opcional (10 min) para que tu profesor vea desde dónde arrancas.</p><a class="btn coral mt" href="#/diagnostic">Hacer diagnóstico</a></div>`;
  } else if (n > total){
    main = `<div class="card center"><h2>Exam day! 🎯</h2><p class="sub">You've trained for this. Good luck, ${esc(name)}!</p></div>`;
  } else {
    const ds = dayStatus(t); const d = ds.day;
    main = `<div class="card daycard"><div class="head"><span class="eyebrow">Day ${d.n} of ${total} · Week ${d.week} · ${d.level}</span><h2>${esc(d.theme)}</h2><div class="small" style="opacity:.75;margin-top:4px">${d.tasks.reduce((a,x)=>a+x.mins,0)} min aprox · ${ds.done}/${ds.total} completado</div><div class="progressbar"><span style="width:${ds.done/ds.total*100}%"></span></div></div><ul class="tasklist">${d.tasks.map(x=>taskRow(t,x)).join('')}</ul></div>`;
    if (ds.done === ds.total) main += `<div class="card flat center" style="background:var(--teal-2);border-color:transparent"><b>Day complete! 🎉</b><div class="small">Come back tomorrow to keep your streak.</div></div>`;
    // catch-up
    const missed = []; for (let i = 1; i <= 6; i++){ const iso = addDays(t, -i); const s = dayStatus(iso); if (s && s.done < s.total) missed.push(s); }
    if (missed.length) main += `<div class="card flat"><h3>Pendientes de días anteriores</h3><p class="sub small">Puedes ponerte al corriente cuando quieras.</p>${missed.map(s=>`<a class="task" href="#/day/${s.day.iso}"><span class="dot" style="background:var(--paper-2);color:var(--ink)">${s.day.n}</span><span class="meta"><div class="t">${fmtDate(s.day.iso)} · ${esc(s.day.theme)}</div><div class="s">${s.done}/${s.total} hechos</div></span><span class="st">Abrir</span></a>`).join('')}</div>`;
  }
  const hasDiag = S.subs.some(s => s.task_id === 'diagnostic');
  shell(`<div class="wrap"><section class="hero"><span class="eyebrow">${fmtDate(t)}</span><div class="hello">${greet}, <em>${esc(name)}</em>.</div><p class="sub">Objetivo: band ${fmtBand(st.target_band)} · ${st.exam_type === 'general' ? 'General Training' : 'Academic'}</p></section>
  <div class="stats"><div class="stat flame"><div class="k">Racha</div><div class="v">${streak()}<small> días</small></div></div><div class="stat"><div class="k">Band est.</div><div class="v">${fmtBand(est.overall)}</div></div><div class="stat"><div class="k">Examen</div><div class="v">${daysLeft > 0 ? daysLeft : 0}<small> días</small></div></div></div>
  ${main}
  ${!hasDiag && n >= 1 ? `<a class="card flat task" href="#/diagnostic" style="display:flex"><span class="dot" style="background:var(--gold)">?</span><span class="meta"><div class="t">Diagnóstico opcional</div><div class="s">10 minutos · ayuda a calibrar tu nivel inicial</div></span><span class="st">Hacer</span></a>` : ''}
  </div>`, 'home');
}
function dayView(iso){
  const ds = dayStatus(iso); if (!ds) return homeView();
  const d = ds.day;
  shell(`<div class="wrap"><div class="taskhead"><a class="back" href="#/plan">${icons.left} Plan</a><h1>Day ${d.n} · ${fmtDate(iso)}</h1><p class="sub">${esc(d.theme)} · Week ${d.week}</p></div><div class="card daycard"><ul class="tasklist">${d.tasks.map(x=>taskRow(iso,x)).join('')}</ul></div></div>`, 'plan');
}
async function taskView(iso, taskId){
  let task, day;
  if (taskId === 'diagnostic'){ task = { id:'diagnostic', kind:'diagnostic', skill:'language', title:'Diagnóstico inicial', sub:'Optional placement check', data:DIAGNOSTIC, mins:10 }; }
  else { day = buildDay(S.settings, iso); task = day?.tasks.find(t => t.id === taskId); }
  if (!task) return homeView();
  const teacher = S.user.role === 'teacher';
  if (!teacher && iso > todayISO()){ toast('Este día aún no está disponible'); location.hash = '#/plan'; return; }
  const sub = subFor(iso, taskId); const fb = sub && S.fb.find(f => f.submission_id === sub.id);
  const backHref = teacher ? `#/t/week/${weekOf(S.settings, iso)}` : iso === todayISO() ? '#/' : `#/day/${iso}`;
  const wide = ['reading-a','reading-b'].includes(task.kind);
  shell(`<div class="wrap ${wide?'task-wrap':''}"><div class="taskhead"><a class="back" href="${backHref}">${icons.left} ${teacher ? 'Semana' : iso === todayISO() ? 'Hoy' : 'Día'}</a><div class="row mt"><span class="chip skill" style="background:${SKILLS[task.skill].color}">${SKILLS[task.skill].label}</span><span class="chip">${task.mins} min</span>${day ? `<span class="chip">${day.level}</span>` : ''}</div><h1>${esc(task.title)}</h1><p class="sub">${esc(task.sub)}</p></div>
  ${fb ? `<div class="feedback"><div class="who">Feedback de Eduardo${fb.band ? ` · Band ${fmtBand(fb.band)}` : ''}</div><div style="white-space:pre-wrap">${esc(fb.comment||'')}</div></div>` : ''}
  <div id="task">${renderTask(task, sub, { preview: teacher })}</div></div>`, teacher ? '' : 'home');
  const root = $('#task');
  $$('audio[data-audio]', root).forEach(async a => { a.src = await db.audioUrl(a.dataset.audio); });
  S.cleanup = bindTask(root, task, { onSubmit: async (payload, blob) => {
    let audio_path = null;
    if (blob){ const ext = blob.type.includes('mp4') ? 'm4a' : blob.type.includes('ogg') ? 'ogg' : 'webm'; audio_path = await db.uploadAudio(blob, `${iso}-${task.id}-${Date.now()}.${ext}`); }
    const row = { day_date: iso, task_id: task.id, skill: task.skill, title: task.title, kind: task.kind, answers: payload.answers ?? null, auto_score: payload.auto_score ?? null, auto_max: payload.auto_max ?? null, text_answer: payload.text_answer ?? null, audio_path, meta: payload.meta ?? null };
    const saved = await db.upsertSubmission(row);
    const i = S.subs.findIndex(s => s.day_date === iso && s.task_id === task.id); if (i >= 0) S.subs[i] = saved; else S.subs.push(saved);
    toast(payload.auto_max ? `Saved · ${payload.auto_score}/${payload.auto_max}` : 'Enviado a tu profesor ✓');
    window.scrollTo({ top:0, behavior:'smooth' }); taskView(iso, taskId);
  }});
}
function planView(){
  const st = S.settings; const { total, weeks } = planInfo(st); const t = todayISO();
  let rows = '';
  for (let w = 1; w <= weeks; w++){ let cells = '';
    for (let d = 0; d < 7; d++){ const iso = addDays(st.start_date, (w-1)*7 + d); const n = (w-1)*7 + d + 1;
      if (n > total){ cells += iso === st.exam_date ? `<span class="dcell exam" title="Examen">🎯</span>` : '<span></span>'; continue; }
      const s = dayStatus(iso); const cls = [s.done === s.total ? 'full' : s.done ? 'part' : '', iso === t ? 'today' : '', iso > t ? 'future' : ''].join(' ');
      cells += iso > t ? `<span class="dcell ${cls}">${n}</span>` : `<a class="dcell ${cls}" href="#/day/${iso}">${n}</a>`; }
    rows += `<div class="weekrow"><span class="wl">Sem ${w}<br><span style="font-weight:500">${fmtDate(weekStart(st,w), false)}</span></span>${cells}</div>`; }
  shell(`<div class="wrap"><section class="hero"><span class="eyebrow">${fmtDate(st.start_date,false)} → ${fmtDate(st.exam_date,false)}</span><h1 class="mt">Tu plan</h1><p class="sub">${total} días · B1 → B2. Cada semana: 3× reading, 2× listening, 5× writing, 3× speaking.</p></section>
  <div class="card">${rows}<div class="legend mt"><span><i style="background:var(--teal)"></i>Completo</span><span><i style="background:var(--gold-2)"></i>En progreso</span><span><i style="background:var(--coral)"></i>Examen</span></div></div></div>`, 'plan');
}
function progressView(){
  const est = estimates(); const st = S.settings; const tgt = Number(st.target_band) || 6.5;
  const pct = b => Math.max(0, Math.min(100, (b - 3) / 6 * 100));
  const R = 56, C = 2*Math.PI*R, frac = (est.overall - 3) / 6;
  const doneDays = new Set(S.subs.map(s => s.day_date)).size; const mins = Math.round(S.subs.reduce((a,s)=>a+(s.meta?.secs||0),0)/60);
  const acc = sk => { const xs = S.subs.filter(s => s.skill === sk && s.auto_max); const a = xs.reduce((x,s)=>x+s.auto_score,0), b = xs.reduce((x,s)=>x+s.auto_max,0); return b ? Math.round(a/b*100) : null; };
  const words = S.subs.filter(s => s.skill === 'writing').reduce((a,s)=>a+wordCount(s.text_answer),0);
  shell(`<div class="wrap"><section class="hero"><span class="eyebrow">Progreso</span><h1 class="mt">Band estimate</h1><p class="sub">Reading y Listening se calculan con tus respuestas; Writing y Speaking con las notas de tu profesor.</p></section>
  <div class="card overall"><svg class="ring" viewBox="0 0 132 132"><circle cx="66" cy="66" r="${R}" fill="none" stroke="var(--paper-2)" stroke-width="12"/><circle cx="66" cy="66" r="${R}" fill="none" stroke="var(--coral)" stroke-width="12" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-frac)}" transform="rotate(-90 66 66)"/><text x="66" y="64" text-anchor="middle" font-family="Fraunces" font-weight="700" font-size="34" fill="var(--ink)">${fmtBand(est.overall)}</text><text x="66" y="86" text-anchor="middle" font-size="11" fill="var(--muted)">overall</text></svg>
  <div><div class="small muted">Inicio</div><b>${fmtBand(st.start_band)}</b><div class="small muted mt">Objetivo</div><b>${fmtBand(tgt)}</b></div></div>
  <div class="card"><div class="bands">${SKILL_KEYS.map(k => `<div class="band"><div class="top"><span class="name" style="color:${SKILLS[k].color}">${SKILLS[k].label}</span><span class="val">${fmtBand(est[k])}</span></div><div class="track"><div class="fill" style="width:${pct(est[k])}%;background:${SKILLS[k].color}"></div><div class="tgt" style="left:${pct(tgt)}%"></div></div>${acc(k) != null ? `<div class="small muted">${acc(k)}% de aciertos</div>` : ''}</div>`).join('')}</div><p class="small muted mt">La línea negra marca tu objetivo (${fmtBand(tgt)}).</p></div>
  <div class="stats"><div class="stat"><div class="k">Días</div><div class="v">${doneDays}</div></div><div class="stat"><div class="k">Minutos</div><div class="v">${mins}</div></div><div class="stat"><div class="k">Palabras</div><div class="v">${words}</div></div></div></div>`, 'prog');
}
function feedbackView(){
  const revs = [...S.reviews].sort((a,b)=>a.week_start < b.week_start ? 1 : -1);
  const items = S.fb.filter(f => f.comment || f.band).map(f => ({ f, s: S.subs.find(s => s.id === f.submission_id) })).filter(x => x.s).sort((a,b)=>a.s.day_date < b.s.day_date ? 1 : -1);
  const revHTML = revs.map(r => `<div class="card"><span class="eyebrow">Semana ${weekOf(S.settings, r.week_start)} · ${fmtDate(r.week_start,false)}</span><div class="bandsel mt">${SKILL_KEYS.map(k=>`<div class="stat"><div class="k" style="color:${SKILLS[k].color}">${SKILLS[k].label}</div><div class="v">${fmtBand(r['band_'+k])}</div>${r['comment_'+k] ? `<div class="small">${esc(r['comment_'+k])}</div>` : ''}</div>`).join('')}</div>${r.summary ? `<div class="feedback"><div class="who">Comentario general</div><div style="white-space:pre-wrap">${esc(r.summary)}</div></div>` : ''}</div>`).join('');
  shell(`<div class="wrap"><section class="hero"><span class="eyebrow">Feedback</span><h1 class="mt">Notas de tu profesor</h1><p class="sub">Eduardo revisa tu semana y deja comentarios y una band por habilidad.</p></section>
  ${revHTML || '<div class="card empty">Aún no hay revisión semanal. Llega al final de cada semana. ✍️</div>'}
  ${items.length ? `<h2 class="mt2">Comentarios por ejercicio</h2>${items.map(({f,s})=>`<a class="card task" style="display:flex" href="#/task/${s.day_date}/${s.task_id}"><span class="dot" style="background:${SKILLS[s.skill]?.color}">${fmtBand(f.band) === '—' ? '✎' : fmtBand(f.band)}</span><span class="meta"><div class="t">${esc(s.title)}</div><div class="s">${fmtDate(s.day_date)} · ${esc(f.comment||'')}</div></span></a>`).join('')}` : ''}</div>`, 'fb');
}

// ---------- teacher ----------
function teacherWeeks(){ const { weeks } = planInfo(S.settings); return Array.from({ length:weeks }, (_,i)=>i+1); }
function weekStats(w){ const st = S.settings; const { total } = planInfo(st); let planned = 0, done = 0;
  for (let d = 0; d < 7; d++){ const n = (w-1)*7+d+1; if (n > total) break; const iso = addDays(st.start_date, n-1); const s = dayStatus(iso); planned += s.total; done += s.done; }
  return { planned, done }; }
async function teacherWeekView(w){
  const st = S.settings; const { weeks } = planInfo(st); w = Math.max(1, Math.min(weeks, w || Math.max(1, Math.min(weeks, weekOf(st, todayISO())))));
  const ws = weekStart(st, w), we = addDays(ws, 6); const rev = S.reviews.find(r => r.week_start === ws) || {};
  const subs = S.subs.filter(s => s.day_date >= ws && s.day_date <= we && s.task_id !== 'diagnostic');
  const autoBy = {}; for (const s of subs) if (s.auto_max){ const a = autoBy[s.skill] ||= [0,0]; a[0]+=s.auto_score; a[1]+=s.auto_max; }
  const diag = S.subs.find(s => s.task_id === 'diagnostic');
  let days = '';
  for (let d = 0; d < 7; d++){ const iso = addDays(ws, d); const day = buildDay(st, iso); if (!day) continue;
    days += `<section class="daysec"><h3>Día ${day.n} · ${fmtDate(iso)} <span class="chip">${esc(day.theme)}</span></h3>`;
    for (const t of day.tasks){ const s = subFor(iso, t.id);
      if (!s){ days += `<div class="sub-card" style="opacity:.7"><div class="row between"><span><span class="chip skill" style="background:${SKILLS[t.skill].color}">${SKILLS[t.skill].label}</span> <b>${esc(t.title)}</b></span><a class="btn small ghost" href="#/task/${iso}/${t.id}">Ver ejercicio</a></div><div class="missing mt">${iso <= todayISO() ? 'No entregado' : 'Pendiente'}</div></div>`; continue; }
      const f = S.fb.find(x => x.submission_id === s.id) || {};
      const items = s.answers?.items ? `<table class="items">${s.answers.items.map(it => `<tr><td>${it.ok ? '✓' : '✗'}</td><td>${esc(it.q)}</td><td class="${it.ok?'okc':'noc'}">${esc(it.given || '—')}</td><td class="muted">${it.ok ? '' : esc(it.correct)}</td></tr>`).join('')}</table>` : '';
      const text = s.text_answer ? `<div class="answer">${esc(s.text_answer)}</div><div class="wc"><span>${wordCount(s.text_answer)} palabras</span><span>${s.meta?.secs ? Math.round(s.meta.secs/60)+' min' : ''}</span></div>` : '';
      const audio = s.audio_path ? `<audio controls preload="none" data-audio="${esc(s.audio_path)}" style="width:100%;margin-top:8px"></audio>` : '';
      const open = !s.auto_max;
      days += `<div class="sub-card" data-sub="${s.id}"><div class="row between"><span><span class="chip skill" style="background:${SKILLS[s.skill]?.color}">${SKILLS[s.skill]?.label}</span> <b>${esc(s.title)}</b></span>${s.auto_max ? `<span class="chip" style="background:${s.auto_score/s.auto_max>=.6?'var(--teal-2)':'var(--coral-2)'}">${s.auto_score}/${s.auto_max}</span>` : ''}</div>
      <div class="small muted">Entregado ${new Date(s.updated_at || s.created_at).toLocaleString('es-MX',{dateStyle:'short',timeStyle:'short'})}${s.meta?.plays ? ` · audio reproducido ${s.meta.plays}×` : ''} · <a href="#/task/${iso}/${t.id}">ver ejercicio</a></div>
      ${items}${text}${audio}
      <div class="row mt" style="align-items:flex-start"><textarea class="input fbc" style="min-height:${open?90:56}px;flex:1" placeholder="Comentario para Sofi…">${esc(f.comment||'')}</textarea>${open ? `<select class="input fbb" style="width:96px">${BANDS.map(b=>`<option ${Number(f.band)===Number(b)&&b?'selected':''} value="${b}">${b||'Band'}</option>`).join('')}</select>` : ''}</div>
      <div class="row mt"><button class="btn small savefb">Guardar comentario</button><span class="small muted saved">${f.updated_at ? 'Guardado' : ''}</span></div></div>`; }
    days += '</section>'; }
  const stt = weekStats(w);
  const side = `<div class="card side"><h2>Revisión semana ${w}</h2><p class="sub small">${fmtDate(ws,false)} – ${fmtDate(we,false)} · ${stt.done}/${stt.planned} ejercicios entregados</p>
    <div class="small mt">${Object.entries(autoBy).map(([k,[a,b]])=>`<span class="chip" style="margin:2px">${SKILLS[k].label}: ${Math.round(a/b*100)}% (≈${fmtBand(pctToBand(a/b))})</span>`).join('') || '<span class="muted">Sin respuestas automáticas aún</span>'}</div>
    <form id="rf" class="mt">${SKILL_KEYS.map(k=>`<div class="row" style="margin:10px 0;align-items:flex-start"><label style="width:96px;font-weight:700;color:${SKILLS[k].color};padding-top:12px">${SKILLS[k].label}</label><select class="input" name="band_${k}" style="width:92px">${BANDS.map(b=>`<option value="${b}" ${rev['band_'+k]!=null && Number(rev['band_'+k])===Number(b) && b ? 'selected':''}>${b||'—'}</option>`).join('')}</select><input class="input" name="comment_${k}" style="flex:1;min-width:140px" placeholder="Comentario breve" value="${esc(rev['comment_'+k]||'')}"></div>`).join('')}
    <label class="field"><span>Comentario general para Sofi</span><textarea class="input" name="summary" style="min-height:120px">${esc(rev.summary||'')}</textarea></label>
    <label class="row small"><input type="checkbox" name="published" ${rev.published === false ? '' : 'checked'}> Visible para Sofi</label>
    <button class="btn coral block mt" type="submit">Guardar revisión semanal</button><div class="small muted center mt">${rev.updated_at ? 'Última vez: '+new Date(rev.updated_at).toLocaleString('es-MX',{dateStyle:'short',timeStyle:'short'}) : ''}</div></form></div>`;
  shell(`<div class="wrap wide"><section class="hero"><span class="eyebrow">Panel del profesor</span><h1 class="mt">Semana ${w} de ${weeks}</h1><p class="sub">Alumna: Sofi · ${st.exam_type==='general'?'General Training':'Academic'} · examen ${fmtDate(st.exam_date,false)} · band inicial ${fmtBand(st.start_band)}${diag ? ` · diagnóstico ${diag.auto_score}/${diag.auto_max}` : ''}</p></section>
    <nav class="weekpick">${teacherWeeks().map(i=>{ const s = weekStats(i); const r = S.reviews.find(x=>x.week_start===weekStart(st,i)); return `<a href="#/t/week/${i}" class="${i===w?'on':''}">S${i} <span style="opacity:.6;font-weight:500">${s.done}/${s.planned}</span>${r?'<span class="rv"></span>':''}</a>`; }).join('')}</nav>
    <div class="tgrid two"><div>${days}</div>${side}</div></div>`, '');
  $$('audio[data-audio]').forEach(async a => { a.src = await db.audioUrl(a.dataset.audio); });
  $$('.savefb').forEach(b => b.onclick = async () => { const card = b.closest('.sub-card'); const id = Number(card.dataset.sub) || card.dataset.sub;
    b.disabled = true; try { const saved = await db.saveItemFeedback(id, { comment: $('.fbc', card).value.trim(), band: $('.fbb', card)?.value ?? null });
      const i = S.fb.findIndex(f => f.submission_id == id); if (i>=0) S.fb[i] = saved; else S.fb.push(saved); $('.saved', card).textContent = 'Guardado ✓'; toast('Comentario guardado'); }
    catch(e){ console.error(e); toast('No se pudo guardar'); } b.disabled = false; });
  $('#rf').onsubmit = async (e) => { e.preventDefault(); const f = new FormData(e.target); const row = { student_id: st.student_id, week_start: ws, published: !!f.get('published'), summary: f.get('summary') };
    SKILL_KEYS.forEach(k => { row['band_'+k] = f.get('band_'+k); row['comment_'+k] = f.get('comment_'+k); });
    try { const saved = await db.saveWeeklyReview(row); const i = S.reviews.findIndex(r => r.week_start === ws); if (i>=0) S.reviews[i] = saved; else S.reviews.push(saved); toast('Revisión semanal guardada ✓'); teacherWeekView(w); }
    catch(err){ console.error(err); toast('No se pudo guardar la revisión'); } };
}
function teacherSettingsView(){
  const st = S.settings; const diag = S.subs.find(s => s.task_id === 'diagnostic');
  shell(`<div class="wrap"><div class="taskhead"><a class="back" href="#/t">${icons.left} Panel</a><h1>Ajustes del plan</h1><p class="sub">El plan diario se genera entre la fecha de inicio y la del examen. Si cambias fechas, los ejercicios se reacomodan.</p></div>
  <form class="card" id="sf"><label class="field"><span>Fecha de inicio</span><input class="input" type="date" name="start_date" value="${st.start_date}" required></label>
  <label class="field"><span>Fecha del examen</span><input class="input" type="date" name="exam_date" value="${st.exam_date}" required></label>
  <label class="field"><span>Tipo de examen</span><select class="input" name="exam_type"><option value="academic" ${st.exam_type!=='general'?'selected':''}>Academic</option><option value="general" ${st.exam_type==='general'?'selected':''}>General Training</option></select></label>
  <div class="bandsel"><label class="field"><span>Band inicial</span><select class="input" name="start_band">${BANDS.slice(1).map(b=>`<option ${Number(st.start_band)===Number(b)?'selected':''}>${b}</option>`).join('')}</select></label>
  <label class="field"><span>Band objetivo</span><select class="input" name="target_band">${BANDS.slice(1).map(b=>`<option ${Number(st.target_band)===Number(b)?'selected':''}>${b}</option>`).join('')}</select></label></div>
  <p class="small muted">Nivel de partida: Pearson Level Test (27/08/2026) — CEFR B1, GSE 43–50 ≈ IELTS 4.5–5.0. ${diag ? `Diagnóstico en la app: ${diag.auto_score}/${diag.auto_max} (${fmtDate(diag.day_date)}).` : 'Sofi aún no hace el diagnóstico opcional.'}</p>
  <button class="btn coral block mt" type="submit">Guardar ajustes</button></form></div>`, '');
  $('#sf').onsubmit = async (e) => { e.preventDefault(); const f = Object.fromEntries(new FormData(e.target));
    if (f.exam_date <= f.start_date){ toast('El examen debe ser después del inicio'); return; }
    try { S.settings = await db.saveSettings({ start_date:f.start_date, exam_date:f.exam_date, exam_type:f.exam_type, start_band:Number(f.start_band), target_band:Number(f.target_band) }); toast('Ajustes guardados ✓'); }
    catch(err){ console.error(err); toast('No se pudieron guardar'); } };
}

// ---------- router ----------
async function route(){
  S.cleanup?.(); S.cleanup = null; window.speechSynthesis?.cancel();
  if (!S.user) return loginView();
  const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  window.scrollTo(0,0);
  if (S.user.role === 'teacher'){
    if (parts[0] === 'task') return taskView(parts[1], parts[2]);
    if (parts[0] === 't' && parts[1] === 'settings') return teacherSettingsView();
    if (parts[0] === 't' && parts[1] === 'week') return teacherWeekView(Number(parts[2]));
    return teacherWeekView();
  }
  switch(parts[0]){
    case 'task': return taskView(parts[1], parts[2]);
    case 'day': return dayView(parts[1]);
    case 'plan': return planView();
    case 'progress': return progressView();
    case 'feedback': return feedbackView();
    case 'diagnostic': return taskView(todayISO(), 'diagnostic');
    default: return homeView();
  }
}
window.addEventListener('hashchange', route);
document.addEventListener('visibilitychange', async () => { if (document.visibilityState === 'visible' && S.user){ try { await loadAll(); } catch{} } });
(async () => {
  await db.init();
  try { S.user = await db.currentUser(); if (S.user) await loadAll(); } catch(e){ console.error(e); S.user = null; }
  route();
})();
