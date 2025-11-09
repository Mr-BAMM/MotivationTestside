import { el, setTime } from './dom.js';
import { renderItem } from './render.js';
import { drawIndex } from './shuffleBag.js';
import { tryResumeAudio } from './media.js';

let ITEMS = [];


async function loadItems() {
  const res = await fetch('./data/items.json', { cache: 'no-store' });
  if (!res.ok) throw new Error('items.json konnte nicht geladen werden');
  return res.json();
}

function renderRandom(){
  if (!ITEMS.length) return;
  const i = drawIndex(ITEMS.length);
  renderItem(ITEMS[i]);
}

async function copyCurrent(){
  const ps = Array.from(el('quote').querySelectorAll('p')).map(p => p.textContent.trim()).filter(Boolean);
  const author = el('author').textContent.trim();
  const clip = (ps.join('\n\n') + (author ? '\n' + author : '')).trim();
  try {
    await navigator.clipboard.writeText(clip);
    document.getElementById('status').textContent = 'Kopiert.';
  } catch {
    document.getElementById('status').textContent = 'Konnte nicht kopieren.';
  } finally {
    setTimeout(()=>document.getElementById('status').textContent='', 1800);
  }
}


export async function initApp(){
  setTime(); setInterval(setTime, 30_000);

  el('btn-copy').addEventListener('click', copyCurrent);
  el('btn-next').addEventListener('click', renderRandom);
  window.addEventListener('click', tryResumeAudio);
  window.addEventListener('touchstart', tryResumeAudio);
  window.addEventListener('keydown', tryResumeAudio);

  try {
    const data = await loadItems();
    ITEMS = Array.isArray(data) ? data : (Array.isArray(data.items) ? data.items : []);
  } catch (e) {
    console.error('items.json Laden fehlgeschlagen:', e);
    ITEMS = [];
  }

  if (!ITEMS.length) {
    // minimalistischer Fallback, damit du visuell was siehst
    ITEMS = [{
      text: ["Kein items.json gefunden oder leer.", "Trag Einträge in data/items.json ein."],
      author: "System"
    }];
  }

  renderRandom();
}