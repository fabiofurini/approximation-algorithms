/* Laboratorio di «Algoritmi di approssimazione / Approximation Algorithms»: le tracce di Next Fit (e delle altre
 * regole Any Fit) e di List scheduling / LPT, senza disegno, usate dalle istanze tight (gi-oc-c.js).
 * Le stesse funzioni (con le app che le disegnano) sono nel laboratorio del modulo «Algoritmi euristici».
 *
 * Notazione del corso: capacità c, pesi w_j, durate t_j, m macchine.
 * Le funzioni di calcolo sono in window.GI_OC_B, per gi-oc-c.js e per le prove.
 */
(function () {
  "use strict";
  const O = window.GI_OC;
  const { somma, decrescente } = O;

  /** la sequenza degli stati di NF, FF, BF, WF o FFD: ogni oggetto in ordine, scelta del contenitore, residui */
  function bppTraccia(w, c, regola) {
    const ord = regola === "ffd" ? decrescente(w) : w.map((_, j) => j);
    const bins = [], tr = [{ bins: [], cur: null, ord, fatti: 0 }];
    ord.forEach((j, i) => {
      const res = bins.map((b) => c - somma(b.map((q) => w[q])));
      let b = -1, scartati = [], cand = [];
      if (regola === "nf") {
        const u = bins.length - 1;
        if (u >= 0 && w[j] <= res[u]) b = u; else if (u >= 0) scartati = [u];
      } else if (regola === "bf" || regola === "wf") {
        cand = res.map((r, q) => q).filter((q) => w[j] <= res[q]);
        for (const q of cand) if (b < 0 || (regola === "bf" ? res[q] < res[b] : res[q] > res[b])) b = q;
      } else {
        for (let q = 0; q < bins.length; q++) { if (w[j] <= res[q]) { b = q; break; } scartati.push(q); }
      }
      const nuovo = b < 0;
      if (nuovo) { bins.push([]); b = bins.length - 1; }
      bins[b].push(j);
      tr.push({ bins: bins.map((x) => x.slice()), cur: j, b, nuovo, scartati, cand, res, ord, fatti: i + 1 });
    });
    tr[tr.length - 1].fine = true;
    return tr;
  }
  /** minimo numero di contenitori, per enumerazione con tagli (n <= 12) */

  function cmaxTraccia(t, m, regola) {
    const ord = regola === "lpt" ? decrescente(t) : t.map((_, j) => j);
    const L = new Array(m).fill(0), ass = Array.from({ length: m }, () => []);
    const tr = [{ L: L.slice(), ass: ass.map((a) => a.slice()), cur: null, ord, fatti: 0 }];
    ord.forEach((j, i) => {
      let q = 0;
      for (let r = 1; r < m; r++) if (L[r] < L[q]) q = r;
      const prima = L.slice();
      ass[q].push([j, L[q]]);
      L[q] += t[j];
      tr.push({ L: L.slice(), prima, ass: ass.map((a) => a.slice()), cur: j, m: q, ord, fatti: i + 1 });
    });
    tr[tr.length - 1].fine = true;
    return tr;
  }
  const cmaxLB = (t, m) => Math.max(Math.max(...t), Math.ceil(somma(t) / m));

  window.GI_OC_B = { bppTraccia, cmaxTraccia, cmaxLB };
})();
