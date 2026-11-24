/* Kurmancî A1 · gemeinsame Funktionen für alle Seiten
   ---------------------------------------------------
   NEUE AUFGABE EINTRAGEN: unten in KURS eine Zeile ergänzen
   (oder bei einer "bald"-Zeile die datei eintragen).
   Startseite und Weiter-Buttons passen sich dann automatisch an. */

const KURS = [
  {
    kapitel: 'Kapitel 1 · Die wichtigsten Buchstaben',
    aufgaben: [
      { id: 'k1-a1', kurz: 'A1', titel: 'Buchstaben entdecken', datei: 'k1-a1.html' },
      { id: 'k1-a2', kurz: 'A2', titel: 'folgt bald', datei: '' }
    ]
  }
];

{
  const alle = KURS.flatMap(k => k.aufgaben);
  const fertig = alle.filter(a => a.datei);
  const seiteId = document.body.dataset.aufgabe || '';

  const esc = s => String(s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* Startseite: Liste aller Aufgaben */
  const uebersicht = document.getElementById('uebersicht');
  if (uebersicht) {
    uebersicht.innerHTML = KURS.map(k => `
      <div class="kasten">
        <h3>${esc(k.kapitel)}</h3>
        <ul class="kapitel-liste">
          ${k.aufgaben.map(a => a.datei
            ? `<li><a href="${esc(a.datei)}"><span class="kurz">${esc(a.kurz)}</span><span>${esc(a.titel)}</span></a></li>`
            : `<li><div class="bald"><span class="kurz">${esc(a.kurz)}</span><span>${esc(a.titel)}</span></div></li>`
          ).join('')}
        </ul>
      </div>`).join('');
  }

  /* Aufgabenseite: Navigation oben und unten */
  const pos = fertig.findIndex(a => a.id === seiteId);
  if (pos > -1) {
    const vor = fertig[pos - 1];
    const idx = alle.findIndex(a => a.id === seiteId);
    const naechste = alle[idx + 1];
    let weiter = '';
    if (naechste && naechste.datei) {
      weiter = `<a href="${esc(naechste.datei)}">Weiter zu ${esc(naechste.kurz)} →</a>`;
    } else if (naechste) {
      weiter = `<span>${esc(naechste.kurz)} folgt bald</span>`;
    }
    const links = vor
      ? `<a href="${esc(vor.datei)}">← ${esc(vor.kurz)}</a>`
      : `<a href="index.html">← Übersicht</a>`;
    const html = `${links}${vor ? '<a href="index.html">Übersicht</a>' : ''}${weiter}`;
    document.querySelectorAll('.nav').forEach(n => { n.innerHTML = html; });
  }

  /* Eingaben im Browser speichern */
  const felder = [...document.querySelectorAll('input[type="text"]')];
  const schluessel = i => `kurmanci:${seiteId}:${i}`;
  felder.forEach((f, i) => {
    try { f.value = localStorage.getItem(schluessel(i)) || ''; } catch (e) {}
    f.addEventListener('input', () => {
      try { localStorage.setItem(schluessel(i), f.value); } catch (e) {}
    });
  });

  const leeren = document.querySelector('.leeren');
  if (leeren) {
    leeren.addEventListener('click', () => {
      felder.forEach((f, i) => {
        f.value = '';
        try { localStorage.removeItem(schluessel(i)); } catch (e) {}
      });
    });
  }

  /* Sonderzeichen-Buttons: fügen den Buchstaben ins zuletzt benutzte Feld ein */
  let letztesFeld = felder[0] || null;
  felder.forEach(f => f.addEventListener('focus', () => { letztesFeld = f; }));
  document.querySelectorAll('.zeichen button').forEach(b => {
    b.addEventListener('mousedown', e => e.preventDefault());
    b.addEventListener('click', () => {
      if (!letztesFeld) return;
      const z = b.textContent.trim();
      const s = letztesFeld.selectionStart ?? letztesFeld.value.length;
      const e = letztesFeld.selectionEnd ?? letztesFeld.value.length;
      letztesFeld.value = letztesFeld.value.slice(0, s) + z + letztesFeld.value.slice(e);
      letztesFeld.focus();
      letztesFeld.setSelectionRange(s + z.length, s + z.length);
      letztesFeld.dispatchEvent(new Event('input'));
    });
  });

  /* Lösungen ein- und ausblenden */
  document.querySelectorAll('.loesung-btn').forEach(b => {
    const box = b.nextElementSibling;
    if (!box) return;
    b.setAttribute('aria-expanded', 'false');
    b.addEventListener('click', () => {
      const zu = box.hidden;
      box.hidden = !zu;
      b.textContent = zu ? 'Lösung ausblenden' : 'Lösung anzeigen';
      b.setAttribute('aria-expanded', String(zu));
    });
  });
}
