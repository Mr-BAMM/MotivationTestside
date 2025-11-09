import { clearNode, setStatus } from './dom.js';

let activeAudio = null;

export function stopAudio() {
  if (activeAudio) {
    try { activeAudio.pause(); } catch {}
    activeAudio = null;
  }
}

export function renderMedia(item) {
  const host = document.getElementById('heroMedia');
  clearNode(host);

  // Video hat Vorrang vor Bild
  if (item.video?.src) {
    const v = document.createElement('video');
    v.src = item.video.src;
    v.autoplay = true;
    v.muted = true;          // wichtig: Autoplay-Regeln
    v.loop = item.video.loop ?? true;
    v.playsInline = true;
    v.preload = 'metadata';
    if (item.video.poster) v.poster = item.video.poster;
    host.appendChild(v);
  } else if (item.image?.src) {
    const img = document.createElement('img');
    img.src = item.image.src;
    img.alt = item.image.alt || '';
    img.loading = 'eager';
    img.decoding = 'async';
    host.appendChild(img);
  }

  // Audio parallel
  stopAudio();
  if (item.audio?.src) {
    const a = new Audio(item.audio.src);
    a.loop = item.audio.loop ?? true;
    a.preload = 'auto';
    a.play().then(() => {
      activeAudio = a;
      setStatus('Audio läuft.');
    }).catch(() => {
      activeAudio = a;
      setStatus('Klick zum Aktivieren von Audio.');
    });
  }

  // Bild-Credit
  const cap = document.getElementById('heroCaption');
  if (item.image?.credit) {
    cap.textContent = item.image.credit;
    cap.classList.remove('hidden');
  } else {
    cap.textContent = '';
    cap.classList.add('hidden');
  }
}

export function tryResumeAudio() {
  if (activeAudio && activeAudio.paused) {
    activeAudio.play().then(() => setStatus('Audio aktiviert.')).catch(()=>{});
  }
}
