// Data layer: Supabase (shared between devices) with a localStorage fallback (demo / offline).
import { CONFIG } from './config.js';

let sb = null, mode = 'local';
const LS = 'oi-local-v1';
const local = () => JSON.parse(localStorage.getItem(LS) || '{"settings":null,"subs":[],"fb":{},"reviews":[],"user":null}');
const saveLocal = (s) => localStorage.setItem(LS, JSON.stringify(s));
const defaultSettings = () => { const t = new Date(); const iso = d => d.toISOString().slice(0,10); const e = new Date(t); e.setDate(e.getDate()+84);
  return { id:1, student_id:'local-student', start_date: iso(t), exam_date: iso(e), exam_type:'academic', start_band:5.0, target_band:6.5 }; };

export async function init(){
  if (CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY){
    const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm');
    sb = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY, { auth:{ persistSession:true, autoRefreshToken:true, storageKey:'oi-auth' } });
    mode = 'supabase';
  }
  return mode;
}
export const getMode = () => mode;
const chk = ({ data, error }) => { if (error) throw error; return data; };

export async function signIn(username, password){
  const u = username.trim().toLowerCase();
  if (mode === 'local'){
    const s = local(); s.user = { id: u === 'eduardo' ? 'local-teacher' : 'local-student', role: u === 'eduardo' ? 'teacher' : 'student', display_name: u === 'eduardo' ? 'Eduardo' : 'Sofi' };
    if (!s.settings) s.settings = defaultSettings(); saveLocal(s); return s.user;
  }
  chk(await sb.auth.signInWithPassword({ email: `${u}@${CONFIG.EMAIL_DOMAIN}`, password }));
  return currentUser();
}
export async function signOut(){ if (mode === 'local'){ const s = local(); s.user = null; saveLocal(s); return; } await sb.auth.signOut(); }
export async function currentUser(){
  if (mode === 'local') return local().user;
  const { data:{ session } } = await sb.auth.getSession();
  if (!session) return null;
  const prof = chk(await sb.from('profiles').select('*').eq('id', session.user.id).maybeSingle());
  return prof ? { id: prof.id, role: prof.role, display_name: prof.display_name } : null;
}
export async function getSettings(){
  if (mode === 'local'){ const s = local(); if (!s.settings){ s.settings = defaultSettings(); saveLocal(s); } return s.settings; }
  return chk(await sb.from('settings').select('*').eq('id',1).single());
}
export async function saveSettings(patch){
  if (mode === 'local'){ const s = local(); s.settings = { ...s.settings, ...patch }; saveLocal(s); return s.settings; }
  return chk(await sb.from('settings').update({ ...patch, updated_at: new Date().toISOString() }).eq('id',1).select().single());
}
export async function listSubmissions({ from, to, studentId } = {}){
  if (mode === 'local'){ return local().subs.filter(x => (!from || x.day_date >= from) && (!to || x.day_date <= to)); }
  let q = sb.from('submissions').select('*').order('day_date').order('created_at');
  if (from) q = q.gte('day_date', from); if (to) q = q.lte('day_date', to); if (studentId) q = q.eq('student_id', studentId);
  return chk(await q);
}
export async function upsertSubmission(sub){
  const row = { ...sub, updated_at: new Date().toISOString() };
  if (mode === 'local'){ const s = local(); const i = s.subs.findIndex(x => x.day_date === sub.day_date && x.task_id === sub.task_id);
    if (i >= 0) s.subs[i] = { ...s.subs[i], ...row }; else s.subs.push({ ...row, id: Date.now(), student_id: s.user?.id, created_at: row.updated_at }); saveLocal(s); return row; }
  const { data:{ session } } = await sb.auth.getSession();
  return chk(await sb.from('submissions').upsert({ ...row, student_id: session.user.id }, { onConflict:'student_id,day_date,task_id' }).select().single());
}
export async function uploadAudio(blob, name){
  if (mode === 'local'){ return await new Promise(r => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(blob); }); }
  const { data:{ session } } = await sb.auth.getSession();
  const path = `${session.user.id}/${name}`;
  const type = (blob.type || 'audio/webm').split(';')[0];
  chk(await sb.storage.from('speaking').upload(path, blob, { contentType:type, upsert:true }));
  return path;
}
export async function audioUrl(path){
  if (!path) return null; if (mode === 'local' || path.startsWith('data:')) return path;
  const d = chk(await sb.storage.from('speaking').createSignedUrl(path, 3600)); return d.signedUrl;
}
export async function listItemFeedback(ids){
  if (!ids.length) return [];
  if (mode === 'local'){ const fb = local().fb; return ids.filter(i => fb[i]).map(i => ({ submission_id:i, ...fb[i] })); }
  return chk(await sb.from('item_feedback').select('*').in('submission_id', ids));
}
export async function saveItemFeedback(submission_id, { comment, band }){
  const row = { submission_id, comment, band: band === '' || band == null ? null : Number(band), updated_at:new Date().toISOString() };
  if (mode === 'local'){ const s = local(); s.fb[submission_id] = row; saveLocal(s); return row; }
  return chk(await sb.from('item_feedback').upsert(row).select().single());
}
export async function listWeeklyReviews(){
  if (mode === 'local') return local().reviews;
  return chk(await sb.from('weekly_reviews').select('*').order('week_start'));
}
export async function saveWeeklyReview(rev){
  const row = { ...rev, updated_at:new Date().toISOString() };
  ['band_reading','band_listening','band_writing','band_speaking'].forEach(k => { if (row[k] === '' || row[k] == null) row[k] = null; else row[k] = Number(row[k]); });
  if (mode === 'local'){ const s = local(); const i = s.reviews.findIndex(r => r.week_start === rev.week_start); if (i>=0) s.reviews[i] = row; else s.reviews.push(row); saveLocal(s); return row; }
  return chk(await sb.from('weekly_reviews').upsert(row, { onConflict:'student_id,week_start' }).select().single());
}
// Export / import for the local fallback (send a backup file by WhatsApp).
export function exportLocal(){ return JSON.stringify(local()); }
export function importLocal(json){ const d = JSON.parse(json); saveLocal({ ...local(), ...d, user: local().user }); }
