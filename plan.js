// Builds the daily plan between start_date and exam_date.
import { READING, INFERENCE } from './content-reading.js';
import { LISTENING } from './content-listening.js';
import { TASK1, LETTERS, TASK2, SPEAKING1, CUECARDS, GRAMMAR, VOCAB } from './content-production.js';

export const SKILLS = {
  reading:{label:'Reading',color:'var(--c-read)'},
  listening:{label:'Listening',color:'var(--c-listen)'},
  writing:{label:'Writing',color:'var(--c-write)'},
  speaking:{label:'Speaking',color:'var(--c-speak)'},
  language:{label:'Grammar & Vocab',color:'var(--c-lang)'},
};

export const toISO = d => { const x = new Date(d); return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,'0')}-${String(x.getDate()).padStart(2,'0')}`; };
export const parseISO = s => { const [y,m,d] = s.split('-').map(Number); return new Date(y, m-1, d); };
export const addDays = (s, n) => { const d = parseISO(s); d.setDate(d.getDate()+n); return toISO(d); };
export const diffDays = (a, b) => Math.round((parseISO(b) - parseISO(a)) / 86400000);
export const todayISO = () => toISO(new Date());

export function planInfo(settings){
  const total = Math.max(1, diffDays(settings.start_date, settings.exam_date));
  const weeks = Math.ceil(total / 7);
  return { total, weeks };
}
export function dayNumber(settings, iso){ return diffDays(settings.start_date, iso) + 1; }
export function weekOf(settings, iso){ return Math.floor((dayNumber(settings, iso)-1)/7) + 1; }
export function weekStart(settings, week){ return addDays(settings.start_date, (week-1)*7); }

const DAY_THEMES = ['Reading + Grammar + Task 1','Listening + Vocab + Essay plan','Reading + Speaking + Sentence lab','Listening + Task 1 report','Inference + Cue card + Vocab','Writing Task 2 (full essay)','Speaking Part 3 + Weekly check'];

export function buildDay(settings, iso){
  const n = dayNumber(settings, iso);
  const { total } = planInfo(settings);
  if (n < 1 || n > total) return null;
  const w = Math.floor((n-1)/7), d = (n-1)%7 + 1, k = w % 12;
  const academic = settings.exam_type !== 'general';
  const R = READING[k], L = LISTENING[k], G = GRAMMAR[k], V = VOCAB[k], T1 = TASK1[k], T2 = TASK2[k];
  const level = R.level;
  const t1 = academic
    ? { kind:'chart', chart:T1, prompt:`The ${T1.type === 'table' ? 'table' : T1.type === 'pie' ? 'pie charts' : T1.type === 'line' ? 'graph' : 'chart'} below shows: ${T1.title.toLowerCase()}. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.` }
    : { kind:'letter', prompt: LETTERS[k] };
  const tasks = [];
  const add = (t) => tasks.push({ ...t, id:`d${n}-${t.kind}` });
  switch(d){
    case 1:
      add({kind:'reading-a', skill:'reading', title:`Reading · ${R.title}`, sub:'Matching headings + True / False / Not Given', mins:15, data:R});
      add({kind:'grammar-mcq', skill:'language', title:`Grammar · ${G.focus}`, sub:'6 quick questions', mins:5, data:G});
      add({kind:'w1-overview', skill:'writing', title: academic ? 'Writing Task 1 · Overview paragraph' : 'Writing Task 1 · Letter plan', sub: academic ? 'Write only the introduction + overview (60–80 words)' : 'Plan the 3 bullet points and write the opening (60–80 words)', mins:12, data:t1, minWords:60});
      break;
    case 2:
      add({kind:'listening-a', skill:'listening', title:`Listening · ${L.title}`, sub:`${L.part} · Form / note completion`, mins:10, data:L});
      add({kind:'vocab-match', skill:'language', title:`Vocabulary · ${V.theme}`, sub:'Match 10 words to their meanings', mins:6, data:V});
      add({kind:'w2-plan', skill:'writing', title:'Writing Task 2 · Plan + introduction', sub:`${T2.type} essay — thesis, two main ideas, intro paragraph`, mins:15, data:T2, minWords:50});
      break;
    case 3:
      add({kind:'reading-b', skill:'reading', title:`Reading · ${R.title} (part 2)`, sub:'Summary completion + inference questions', mins:12, data:R});
      add({kind:'s1', skill:'speaking', title:`Speaking Part 1 · ${SPEAKING1[k].topic}`, sub:'Answer 4 questions out loud (record)', mins:6, data:SPEAKING1[k]});
      add({kind:'grammar-lab', skill:'writing', title:`Sentence lab · ${G.focus}`, sub:'Build 3 complex sentences', mins:8, data:G});
      break;
    case 4:
      add({kind:'listening-b', skill:'listening', title:`Listening · ${L.title} (second listen)`, sub:'Multiple choice', mins:8, data:L});
      add({kind:'w1-full', skill:'writing', title: academic ? 'Writing Task 1 · Full report' : 'Writing Task 1 · Full letter', sub:'150+ words · 20 minutes', mins:20, data:t1, minWords:150});
      break;
    case 5:
      add({kind:'inference', skill:'reading', title:'Reading · Read between the lines', sub:'3 short texts · inference', mins:6, data:INFERENCE[k]});
      add({kind:'s2', skill:'speaking', title:'Speaking Part 2 · Cue card', sub:'1 min to prepare, 2 min to speak (record)', mins:6, data:CUECARDS[k]});
      add({kind:'vocab-gap', skill:'language', title:`Vocabulary in use · ${V.theme}`, sub:'Complete 5 sentences', mins:5, data:V});
      break;
    case 6:
      add({kind:'w2-full', skill:'writing', title:'Writing Task 2 · Full essay', sub:`${T2.type} · 250+ words · 40 minutes`, mins:40, data:T2, minWords:250});
      break;
    case 7:
      add({kind:'s3', skill:'speaking', title:'Speaking Part 3 · Discussion', sub:`Follow-up to: ${CUECARDS[k].card}`, mins:8, data:CUECARDS[k]});
      add({kind:'check', skill:'language', title:'Weekly check', sub:'Mixed review of this week', mins:6, data:{G,V}});
      add({kind:'reflection', skill:'writing', title:'Reflection', sub:'What was hard this week? What will you do differently?', mins:3, data:{}, minWords:20});
      break;
  }
  return { iso, n, week:w+1, dayInWeek:d, level, theme:DAY_THEMES[d-1], tasks };
}
