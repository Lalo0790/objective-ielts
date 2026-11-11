// Exercise renderers. Each kind builds items (objective) or open fields (writing/speaking).
import { esc, roman, letter, matches, wordCount, chartHTML, seededShuffle, icons, ttsAvailable, speakScript, recorderSupported, startRecording, $, $$, toast } from './ui.js';

const TFNG = ['TRUE','FALSE','NOT GIVEN']; const TFNGk = {T:0,F:1,NG:2};

// ---------- objective item builders ----------
function itemsFor(task){
  const d = task.data, k = task.kind;
  if (k === 'reading-a') return [
    ...d.paras.map((p,i)=>({ id:`h${i}`, group:'headings', type:'select', q:`Paragraph ${letter(i)}`, options:d.headings.map((h,j)=>`${roman(j)}. ${h}`), answer:d.headingAnswers[i] })),
    ...d.tfng.map((t,i)=>({ id:`t${i}`, group:'tfng', type:'pills', q:t.s, options:TFNG, answer:TFNGk[t.a] })) ];
  if (k === 'reading-b') return [
    ...d.summary.answers.map((a,i)=>({ id:`g${i}`, group:'summary', type:'gap', q:`Gap ${i+1}`, accepted:a })),
    ...d.mcq.map((m,i)=>({ id:`m${i}`, group:'mcq', type:'opts', q:m.q, options:m.o, answer:m.a })) ];
  if (k === 'inference') return d.map((m,i)=>({ id:`i${i}`, group:'inf', type:'opts', q:m.q, ctx:m.t, options:m.o, answer:m.a }));
  if (k === 'listening-a') return d.completion.answers.map((a,i)=>({ id:`c${i}`, group:'form', type:'gap', q:`Q${i+1}`, accepted:a }));
  if (k === 'listening-b') return d.mcq.map((m,i)=>({ id:`m${i}`, group:'mcq', type:'opts', q:m.q, options:m.o, answer:m.a }));
  if (k === 'grammar-mcq') return d.mcq.map((m,i)=>({ id:`m${i}`, group:'mcq', type:'opts', q:m.q, options:m.o, answer:m.a }));
  if (k === 'vocab-match'){ const defs = seededShuffle(d.words.map(w=>w[1]), d.theme);
    return d.words.map((w,i)=>({ id:`v${i}`, group:'match', type:'select', q:w[0], options:defs, answer:defs.indexOf(w[1]) })); }
  if (k === 'vocab-gap') return d.gaps.map((g,i)=>({ id:`g${i}`, group:'gaps', type:'gap', q:g.s, accepted:g.a }));
  if (k === 'check'){ const G = d.G, V = d.V; return [
    ...G.mcq.slice(3,6).map((m,i)=>({ id:`m${i}`, group:'mcq', type:'opts', q:m.q, options:m.o, answer:m.a })),
    ...V.gaps.slice(0,3).map((g,i)=>({ id:`g${i}`, group:'gaps', type:'gap', q:g.s, accepted:g.a })) ]; }
  if (k === 'diagnostic') return d.map((m,i)=>({ id:`d${i}`, group:'mcq', type:'opts', q:m.q, options:m.o, answer:m.a }));
  return null;
}
export const OBJECTIVE = new Set(['reading-a','reading-b','inference','listening-a','listening-b','grammar-mcq','vocab-match','vocab-gap','check','diagnostic']);

function itemHTML(it, n, raw, done){
  const val = raw?.[it.id]; const ok = done ? gradeItem(it, val) : null;
  const mark = done ? `<div class="res ${ok?'ok':'no'}">${ok ? '✓ Correct' : `✗ Answer: ${esc(correctText(it))}`}</div>` : '';
  if (it.type === 'pills') return `<div class="q" data-id="${it.id}"><div class="qt"><span class="qn">${n}</span>${esc(it.q)}</div><div class="pills">${it.options.map((o,j)=>`<button type="button" class="pill ${val==j?'on':''}" data-v="${j}" ${done?'disabled':''}>${o}</button>`).join('')}</div>${mark}</div>`;
  if (it.type === 'opts') return `<div class="q" data-id="${it.id}">${it.ctx ? `<div class="passage" style="font-size:.98rem;padding:12px 14px;margin-bottom:10px">${esc(it.ctx)}</div>` : ''}<div class="qt"><span class="qn">${n}</span>${esc(it.q)}</div><div class="opts">${it.options.map((o,j)=>`<button type="button" class="opt ${val==j?'on':''} ${done && j===it.answer ? 'right' : ''} ${done && val==j && j!==it.answer ? 'wrong':''}" data-v="${j}" ${done?'disabled':''}><span class="l">${letter(j)}</span><span>${esc(o)}</span></button>`).join('')}</div>${done && !ok ? mark : ''}</div>`;
  if (it.type === 'select') return `<div class="q" data-id="${it.id}"><div class="qt"><span class="qn">${n}</span><b>${esc(it.q)}</b></div><select class="input" ${done?'disabled':''}><option value="">Choose…</option>${it.options.map((o,j)=>`<option value="${j}" ${val==j?'selected':''}>${esc(o)}</option>`).join('')}</select>${mark}</div>`;
  if (it.type === 'gap') return `<div class="q" data-id="${it.id}"><div class="qt"><span class="qn">${n}</span>${esc(it.q).replace('___','<span class="muted">_____</span>')}</div><input class="input" autocomplete="off" autocapitalize="off" spellcheck="false" value="${esc(val||'')}" ${done?'disabled':''} placeholder="Type your answer">${mark}</div>`;
}
const correctText = it => it.type === 'gap' ? it.accepted[0] : it.options[it.answer];
function gradeItem(it, v){ if (it.type === 'gap') return matches(v, it.accepted); return v !== undefined && v !== '' && Number(v) === it.answer; }
function readRaw(root, items){ const raw = {}; items.forEach(it => { const el = root.querySelector(`[data-id="${it.id}"]`); if (!el) return;
  if (it.type === 'pills' || it.type === 'opts'){ const on = el.querySelector('.on'); raw[it.id] = on ? Number(on.dataset.v) : undefined; }
  else if (it.type === 'select'){ const v = el.querySelector('select').value; raw[it.id] = v === '' ? undefined : Number(v); }
  else if (it.type === 'gap'){ const inp = el.querySelector('input'); raw[it.id] = inp.value.trim(); } }); return raw; }
function inlineGapsHTML(text, items, raw, done){ return text.replace(/\[\[(\d+)\]\]/g, (_, n) => { const it = items[Number(n)-1]; const v = raw?.[it.id] || ''; const ok = done ? gradeItem(it, v) : null;
  return `<span data-id="${it.id}"><b class="qn">${n}</b><input class="gap ${done ? (ok?'right':'wrong') : ''}" autocomplete="off" autocapitalize="off" spellcheck="false" value="${esc(v)}" ${done?'disabled':''}>${done && !ok ? ` <small class="res no">(${esc(it.accepted[0])})</small>` : ''}</span>`; }); }

// ---------- writing guides ----------
const GUIDES = {
  'w1-overview-chart':['Sentence 1 — paraphrase the title (shows / illustrates / compares…). Don\'t copy it.','Sentence 2–3 — "Overall, …": the 2 biggest trends or differences. No numbers here.','Useful: Overall, it is clear that… · The most striking feature is… · By contrast,…'],
  'w1-full-chart':['¶1 Introduction (paraphrase) · ¶2 Overview (main trends, no numbers) · ¶3 + ¶4 details with numbers, grouped logically.','Compare, don\'t list: whereas, while, compared with, twice as many as, the highest… followed by…','Trends: rose steadily, fell sharply, peaked at, remained stable, fluctuated around.','Aim for 150–180 words. Don\'t give opinions.'],
  'w1-overview-letter':['Choose the tone: formal (Dear Sir or Madam / Dear Mr X) or informal (Dear Ana).','Opening line: say clearly why you are writing.','Plan one paragraph per bullet point.'],
  'w1-full-letter':['Greeting → purpose → one paragraph per bullet → polite closing.','Formal: I am writing to… · I would be grateful if… · Yours faithfully/sincerely.','Informal: Thanks for your letter… · Why don\'t you… · Best wishes.','Aim for 150–180 words.'],
  'w2-plan':['Underline the key words and the question type (opinion, discussion, problem/solution…).','Thesis: one clear sentence with your position.','Two main ideas — each with a reason and an example.','Intro = paraphrase the topic + thesis + (optional) outline. 40–60 words.'],
  'w2-full':['¶1 Intro (paraphrase + thesis) · ¶2 Main idea 1 · ¶3 Main idea 2 · ¶4 Conclusion (restate position).','Each body paragraph: topic sentence → explain → example → link back.','Use 3–4 complex sentences: although…, which…, if…, as a result….','Aim for 260–290 words; leave 3 minutes to check verbs, articles and plurals.'],
  'reflection':['Write 3–5 sentences in English. Be honest — this helps your teacher plan next week.']
};
function guideHTML(key){ const g = GUIDES[key]; return g ? `<details class="guide"><summary>How to structure it</summary><ul>${g.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></details>` : ''; }

// ---------- main renderers ----------
export function renderTask(task, sub, { preview } = {}){
  const done = !!sub; const raw = sub?.answers?.raw || {}; const k = task.kind; const items = itemsFor(task);
  let html = '';
  const score = done && sub.auto_max ? `<div class="scorebanner"><div class="big">${sub.auto_score}<small>/${sub.auto_max}</small></div><div><b>${sub.auto_score/sub.auto_max >= .8 ? 'Excellent!' : sub.auto_score/sub.auto_max >= .6 ? 'Good work!' : 'Keep going — review the corrections below.'}</b><div class="small" style="opacity:.8">Saved · your teacher will see it in the weekly review</div></div></div>` : '';
  const savedOpen = done && !sub.auto_max ? `<div class="scorebanner"><div class="big">✓</div><div><b>Sent to your teacher</b><div class="small" style="opacity:.8">You'll see the feedback in the Feedback tab after the weekly review.</div></div></div>` : '';
  html += score + savedOpen;
  if (k === 'reading-a' || k === 'reading-b'){
    const d = task.data;
    const passage = `<div class="passage"><h2>${esc(d.title)}</h2>${d.paras.map((p,i)=>`<p><b class="pl">${letter(i)}</b>${esc(p)}</p>`).join('')}</div>`;
    let q = '';
    if (k === 'reading-a'){
      const hs = items.filter(i=>i.group==='headings'), ts = items.filter(i=>i.group==='tfng');
      q += `<div class="qblock"><h3>Questions 1–5 · Matching headings</h3><p class="hint">Choose the correct heading for each paragraph. There are more headings than paragraphs.</p><div class="headings"><ol type="i">${d.headings.map(h=>`<li>${esc(h)}</li>`).join('')}</ol></div>${hs.map((it,i)=>itemHTML(it,i+1,raw,done)).join('')}</div>`;
      q += `<div class="qblock"><h3>Questions 6–10 · True / False / Not Given</h3><p class="hint">TRUE = agrees with the text · FALSE = contradicts the text · NOT GIVEN = no information.</p>${ts.map((it,i)=>itemHTML(it,i+6,raw,done)).join('')}</div>`;
    } else {
      const gs = items.filter(i=>i.group==='summary'), ms = items.filter(i=>i.group==='mcq');
      q += `<div class="qblock"><h3>Questions 1–4 · Summary completion</h3><p class="hint">Use NO MORE THAN TWO WORDS from the passage for each answer.</p><p class="gapline">${inlineGapsHTML(esc(d.summary.text).replace(/\[\[(\d)\]\]/g,'[[$1]]'), gs, raw, done)}</p></div>`;
      q += `<div class="qblock"><h3>Questions 5–6 · Inference</h3><p class="hint">Choose the best answer. The answer is suggested, not written directly.</p>${ms.map((it,i)=>itemHTML(it,i+5,raw,done)).join('')}</div>`;
    }
    html += `<div class="seg" role="tablist"><button class="${done?'':'on'}" data-v="text">Texto</button><button class="${done?'on':''}" data-v="q">Preguntas</button></div><div class="split" data-view="${done?'q':'text'}"><div class="pane-t">${passage}</div><div class="pane-q">${q}</div></div>`;
  }
  else if (k === 'listening-a' || k === 'listening-b'){
    const d = task.data;
    html += `<div class="player" id="player"><button class="play" id="playbtn" aria-label="Play">${icons.play}</button><div style="flex:1"><b>${esc(d.title)}</b><div class="small" style="opacity:.75">${esc(d.part)} · <span id="plays">${sub?.meta?.plays ?? 0}</span> plays</div><div class="wave">${Array.from({length:28},(_,i)=>`<i style="animation-delay:${(i%7)*.09}s"></i>`).join('')}</div></div></div>`;
    html += `<div class="instr">${k==='listening-a' ? 'In the real exam you hear it <b>once</b>. Try to answer while listening. Write NO MORE THAN TWO WORDS AND/OR A NUMBER.' : 'Second listen: choose the correct answer A, B or C.'}${ttsAvailable() ? '' : ' <b>Your browser has no text-to-speech; use the transcript.</b>'}</div>`;
    if (k === 'listening-a'){ const fs = d.completion.fields;
      html += `<div class="qblock"><h3>${esc(d.completion.title)}</h3><div class="formsheet">${fs.map(f=>`<div class="fl gapline">${inlineGapsHTML(esc(f), items, raw, done)}</div>`).join('')}</div></div>`;
    } else html += `<div class="qblock">${items.map((it,i)=>itemHTML(it,i+1,raw,done)).join('')}</div>`;
    html += `<details class="guide" ${done||preview?'':'hidden'}><summary>Transcript</summary><div class="transcript">${d.lines.map(([w,t])=>`<p><b>${esc(w)}:</b> ${esc(t)}</p>`).join('')}</div></details>`;
  }
  else if (k === 'inference' || k === 'listening-b' || k === 'grammar-mcq' || k === 'vocab-gap' || k === 'check' || k === 'diagnostic' || k === 'vocab-match'){
    if (k === 'grammar-mcq') html += `<details class="guide" open><summary>${esc(task.data.focus)}</summary><p class="small" style="margin:6px 0 0">${esc(task.data.tip)}</p></details>`;
    if (k === 'vocab-gap') html += `<div class="instr"><b>Word bank:</b> ${task.data.words.map(w=>esc(w[0])).join(' · ')} <br><span class="small">Change the form if needed (e.g. plural, past tense).</span></div>`;
    if (k === 'vocab-match') html += `<div class="instr">Choose the meaning of each word. Then try to use 3 of them in a sentence today!</div>`;
    if (k === 'diagnostic') html += `<div class="instr">16 quick questions · about 10 minutes · no dictionary. It's fine to skip what you don't know.</div>`;
    html += `<div class="qblock">${items.map((it,i)=>itemHTML(it,i+1,raw,done)).join('')}</div>`;
  }
  if (k === 'check' || k === 'reflection'){ /* extra fields below */ }
  // ---- open tasks ----
  if (['w1-overview','w1-full'].includes(k)){
    const d = task.data; const gk = `${k}-${d.kind}`;
    html += `<div class="prompt">${esc(d.prompt)}</div>${d.kind==='chart' ? chartHTML(d.chart) : ''}${guideHTML(gk)}`;
    html += writingBox(task, sub, done);
  }
  if (['w2-plan','w2-full'].includes(k)){
    const d = task.data;
    html += `<div class="prompt"><span class="chip">${esc(d.type)}</span><div style="margin-top:8px">${esc(d.q)}</div></div>${guideHTML(k)}`;
    if (k === 'w2-plan' && !done) html += `<div class="qblock"><h3>Plan</h3><label class="field"><span>My position / thesis</span><input class="input" data-plan="thesis" placeholder="In my opinion…"></label><label class="field"><span>Main idea 1 (reason + example)</span><input class="input" data-plan="idea1"></label><label class="field"><span>Main idea 2 (reason + example)</span><input class="input" data-plan="idea2"></label></div><h3 class="mt">Introduction paragraph</h3>`;
    html += writingBox(task, sub, done);
  }
  if (k === 'grammar-lab'){
    const G = task.data; const ans = sub?.answers?.lab || [];
    html += `<details class="guide" open><summary>${esc(G.focus)}</summary><p class="small" style="margin:6px 0 0">${esc(G.tip)}</p></details>`;
    html += `<div class="qblock">${G.lab.map((l,i)=>`<div class="q"><div class="qt"><span class="qn">${i+1}</span>${esc(l.p)}</div>${done ? `<div class="answer" style="white-space:pre-wrap;background:var(--paper);padding:10px;border-radius:10px">${esc(ans[i]||'—')}</div><div class="model"><b>Model:</b> ${esc(l.m)}</div>` : `<textarea class="input" data-lab="${i}" style="min-height:80px" placeholder="Write one sentence…"></textarea>`}</div>`).join('')}</div>`;
  }
  if (['s1','s2','s3'].includes(k)){
    const d = task.data;
    if (k === 's1') html += `<div class="instr">Answer each question in 2–3 sentences. Give a reason or an example. Record all answers in one take.</div><div class="qblock">${d.qs.map((q,i)=>`<div class="q"><div class="qt"><span class="qn">${i+1}</span>${esc(q)}</div></div>`).join('')}</div>`;
    if (k === 's2') html += `<div class="cue"><h3>${esc(d.card)}</h3><p class="small muted" style="margin:6px 0 0">You should say:</p><ul>${d.bullets.map(b=>`<li>${esc(b)}</li>`).join('')}</ul></div><div class="row mt" ${done?'hidden':''}><button class="btn small ghost" id="prep">Start 1-minute preparation</button><span class="timer" id="ptimer"></span></div>`;
    if (k === 's3') html += `<div class="instr">Part 3 = deeper discussion. Give an opinion, explain why, add an example, consider the other side.</div><div class="qblock">${d.p3.map((q,i)=>`<div class="q"><div class="qt"><span class="qn">${i+1}</span>${esc(q)}</div></div>`).join('')}</div>`;
    html += speakingBox(task, sub, done);
  }
  if (k === 'reflection') html += writingBox(task, sub, done, 'This week I found… was difficult because… Next week I will…');
  if (!preview && !done) html += `<div class="sticky-submit"><button class="btn coral block" id="submit">Submit${items ? ' & check answers' : ' to my teacher'}</button></div>`;
  return html;
}
function writingBox(task, sub, done, ph='Start writing here…'){
  if (done) return `<div class="answer" style="white-space:pre-wrap;background:var(--card);border:1px solid var(--line);border-radius:14px;padding:14px;font-family:var(--serif)">${esc(sub.text_answer||'')}</div><div class="wc"><span>${wordCount(sub.text_answer)} words</span><span>${sub.meta?.secs ? Math.round(sub.meta.secs/60)+' min' : ''}</span></div>`;
  const draft = localStorage.getItem('draft-'+task.id) || '';
  return `<textarea class="input" id="writing" placeholder="${esc(ph)}" spellcheck="false" autocapitalize="sentences">${esc(draft)}</textarea><div class="wc"><span><b id="wcount">${wordCount(draft)}</b> / ${task.minWords || 0}+ words</span><span>Draft saved on this device</span></div>`;
}
function speakingBox(task, sub, done){
  if (done) return `${sub.audio_path ? `<div class="rec"><audio controls preload="none" data-audio="${esc(sub.audio_path)}"></audio></div>` : ''}${sub.text_answer ? `<div class="answer" style="white-space:pre-wrap;background:var(--card);border:1px solid var(--line);border-radius:14px;padding:14px;margin-top:10px">${esc(sub.text_answer)}</div>` : ''}`;
  return `<div class="rec mt">${recorderSupported() ? `<button class="recbtn" id="recbtn" aria-label="Record">${icons.mic}</button><div><div class="timer" id="rtimer">0:00</div><div class="small muted" id="rstate">Tap to record your answer</div></div><audio id="recaudio" controls hidden></audio>` : `<div class="small">Recording is not available in this browser. Write notes of what you said below.</div>`}</div>
  <label class="field"><span>Notes / key words (optional)</span><textarea class="input" id="notes" style="min-height:90px" placeholder="Ideas, vocabulary you used, anything you want your teacher to know"></textarea></label>`;
}

// ---------- binding & collecting ----------
export function bindTask(root, task, { onSubmit }){
  const started = Date.now(); let plays = 0, player = null, rec = null, blob = null, rtimer = null;
  $$('.pill, .opt', root).forEach(b => b.addEventListener('click', () => { const q = b.closest('.q'); $$('.pill, .opt', q).forEach(x => x.classList.remove('on')); b.classList.add('on'); }));
  $$('.seg button', root).forEach(b => b.addEventListener('click', () => { $$('.seg button', root).forEach(x=>x.classList.remove('on')); b.classList.add('on'); $('.split', root).dataset.view = b.dataset.v; window.scrollTo({top: $('.seg',root).offsetTop - 70, behavior:'smooth'}); }));
  const w = $('#writing', root);
  if (w){ const wc = $('#wcount', root); w.addEventListener('input', () => { wc.textContent = wordCount(w.value); wc.classList.toggle('ok', wordCount(w.value) >= (task.minWords||0)); localStorage.setItem('draft-'+task.id, w.value); }); }
  const pb = $('#playbtn', root);
  if (pb){ pb.addEventListener('click', () => {
    if (!ttsAvailable()){ toast('Text-to-speech not available — open the transcript'); $('details.guide[hidden]', root)?.removeAttribute('hidden'); return; }
    if (player){ player.stop(); player = null; $('#player',root).classList.remove('playing'); pb.innerHTML = icons.play; return; }
    plays++; $('#plays', root).textContent = plays; $('#player',root).classList.add('playing'); pb.innerHTML = icons.stop;
    player = speakScript(task.data, { onend: () => { player = null; $('#player',root)?.classList.remove('playing'); if (pb.isConnected) pb.innerHTML = icons.play; } }); }); }
  const prep = $('#prep', root);
  if (prep){ prep.addEventListener('click', () => { let s = 60; const t = $('#ptimer', root); prep.disabled = true; const h = setInterval(() => { s--; t.textContent = `0:${String(s).padStart(2,'0')}`; if (s <= 0){ clearInterval(h); t.textContent = 'Now speak for 2 minutes!'; toast('Time! Tap the mic and speak for 2 minutes'); } }, 1000); t.textContent = '1:00'; }); }
  const rb = $('#recbtn', root);
  if (rb){ rb.addEventListener('click', async () => {
    if (!rec){ try { rec = await startRecording(); } catch(e){ toast('Microphone permission needed'); return; }
      rb.classList.add('on'); rb.innerHTML = icons.stop; $('#rstate',root).textContent = 'Recording… tap to stop'; const t0 = Date.now();
      rtimer = setInterval(() => { const s = Math.floor((Date.now()-t0)/1000); $('#rtimer',root).textContent = `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`; }, 500);
    } else { clearInterval(rtimer); blob = await rec.stop(); rec = null; rb.classList.remove('on'); rb.innerHTML = icons.mic; $('#rstate',root).textContent = 'Recorded ✓ — tap mic to record again';
      const a = $('#recaudio', root); a.src = URL.createObjectURL(blob); a.hidden = false; } }); }
  $('#submit', root)?.addEventListener('click', async (ev) => {
    const btn = ev.currentTarget; if (rec){ toast('Stop the recording first'); return; }
    const payload = collect(root, task); if (payload.error){ toast(payload.error); return; }
    payload.meta = { ...(payload.meta||{}), secs: Math.round((Date.now()-started)/1000), plays: plays || undefined };
    btn.disabled = true; btn.textContent = 'Saving…';
    try { await onSubmit(payload, blob); localStorage.removeItem('draft-'+task.id); }
    catch(e){ console.error(e); toast('Could not save — check your connection and try again'); btn.disabled = false; btn.textContent = 'Submit'; }
  });
  return () => { player?.stop(); clearInterval(rtimer); };
}
function collect(root, task){
  const items = itemsFor(task); const k = task.kind;
  if (items){ const raw = readRaw(root, items); const answered = Object.values(raw).filter(v => v !== undefined && v !== '').length;
    if (answered < Math.ceil(items.length/2)) return { error:'Answer at least half of the questions first' };
    const graded = items.map(it => ({ q: it.q, given: raw[it.id] === undefined || raw[it.id] === '' ? '' : it.type === 'gap' ? raw[it.id] : it.options[raw[it.id]], correct: correctText(it), ok: gradeItem(it, raw[it.id]) }));
    return { answers:{ raw, items: graded }, auto_score: graded.filter(g=>g.ok).length, auto_max: graded.length };
  }
  if (k === 'grammar-lab'){ const lab = $$('[data-lab]', root).map(t => t.value.trim()); if (lab.filter(Boolean).length < 2) return { error:'Write at least 2 sentences' };
    return { answers:{ lab }, text_answer: lab.map((s,i)=>`${i+1}. ${s}`).join('\n') }; }
  if (['s1','s2','s3'].includes(k)){ const notes = $('#notes', root)?.value.trim() || ''; const hasAudio = !!$('#recaudio', root)?.src;
    if (!hasAudio && !notes) return { error: recorderSupported() ? 'Record your answer (or write notes)' : 'Write notes about your answer' };
    return { text_answer: notes, meta:{ needsAudio: hasAudio } }; }
  const w = $('#writing', root)?.value.trim() || ''; const plan = {}; $$('[data-plan]', root).forEach(i => plan[i.dataset.plan] = i.value.trim());
  const min = task.minWords || 0; if (wordCount(w) < Math.min(min, 20)) return { error:`Write at least ${Math.min(min,20)} words` };
  const text = Object.keys(plan).length ? `PLAN\nThesis: ${plan.thesis||'—'}\nIdea 1: ${plan.idea1||'—'}\nIdea 2: ${plan.idea2||'—'}\n\nINTRODUCTION\n${w}` : w;
  return { text_answer: text, answers: Object.keys(plan).length ? { plan } : null, meta:{ words: wordCount(w) } };
}
