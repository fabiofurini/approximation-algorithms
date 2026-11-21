// Autovalutazione — domande generate del modulo «Algoritmi di approssimazione» (approximation-algorithms).
// Dai generatori di Ottimizzazione combinatoria (21/11/2026): quelli dei capitoli di questo modulo, con id aa-g-….
// Formato: QUIZ_SPEC.md. Ogni generatore riceve rng() in [0,1) e la lingua ("it" | "en") e restituisce
// { testo, opzioni[4], corretta, spiegazione, _v }. Il campo _v (dati dell'istanza e valori delle opzioni)
// serve solo al gemello di verifica in Python (quiz/verifica/): il motore lo ignora.
// Nessuna dipendenza esterna, niente Math.random: solo rng.
window.QUIZ_GEN = window.QUIZ_GEN || {};
(function () {
  "use strict";
  var MOD = "approximation-algorithms";
  var EN = "https://fabiofurini.github.io/approximation-algorithms/";
  var IT = "https://fabiofurini.github.io/algoritmi-di-approssimazione/";
  function L(en, it) { return { en: EN + en, it: IT + it }; }

  // ---------------------------------------------------------------- aiuti
  function ri(rng, a, b) { return a + Math.floor(rng() * (b - a + 1)); }
  function pickOne(rng, arr) { return arr[Math.floor(rng() * arr.length)]; }
  function shuffle(rng, a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rng() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
  function fr(n, d) { if (d < 0) { n = -n; d = -d; } var g = gcd(n, d) || 1; return { n: n / g, d: d / g }; }
  function frTex(f) { return f.d === 1 ? String(f.n) : (f.n < 0 ? "-" : "") + "\\frac{" + Math.abs(f.n) + "}{" + f.d + "}"; }
  function frKey(f) { return f.n + "/" + f.d; }
  function sum(a) { var s = 0; for (var i = 0; i < a.length; i++) s += a[i]; return s; }
  function T(lingua, it, en) { return lingua === "it" ? it : en; }
  function vec(a) { return "(" + a.join(",") + ")"; }
  function set(a) { return a.length ? "\\{" + a.slice().sort(function (x, y) { return x - y; }).join(",") + "\\}" : "\\emptyset"; }
  function range1(n) { var r = []; for (var i = 1; i <= n; i++) r.push(i); return r; }
  // tabella orizzontale: righe = [[etichetta, valori...], ...]
  function tab(head, rows) {
    var cols = head.length - 1, s = "$\\begin{array}{c|" + new Array(cols + 1).join("c") + "}" + head.join(" & ") + "\\\\ \\hline ";
    s += rows.map(function (r) { return r.join(" & "); }).join("\\\\ ") + "\\end{array}$";
    return s;
  }
  // matrice delle distanze (simmetrica, d[i][j] con indici 1..n)
  function distTab(d, n) {
    var s = "$\\begin{array}{c|" + new Array(n + 1).join("c") + "} d_{ij} & " + range1(n).join(" & ") + "\\\\ \\hline ";
    var rows = [];
    for (var i = 1; i <= n; i++) {
      var r = [String(i)];
      for (var j = 1; j <= n; j++) r.push(i === j ? "-" : String(d[i][j]));
      rows.push(r.join(" & "));
    }
    return s + rows.join("\\\\ ") + "\\end{array}$";
  }
  // costruisce le 4 opzioni: corretta + 3 distrattori distinti (chiavi), nell'ordine dato da rng
  // cand: lista di {k: chiave, t: testo}; restituisce null se non bastano
  function build(rng, giusta, cand) {
    var used = {}, usedT = {}; used[giusta.k] = 1; usedT[giusta.t] = 1; var ds = [];
    for (var i = 0; i < cand.length && ds.length < 3; i++) {
      var c = cand[i];
      if (c && c.k !== undefined && c.t !== undefined && !used[c.k] && !usedT[c.t]) { used[c.k] = 1; usedT[c.t] = 1; ds.push(c); }
    }
    if (ds.length < 3) return null;
    var all = shuffle(rng, [giusta].concat(ds));
    var idx = 0; for (var j = 0; j < 4; j++) if (all[j] === giusta) idx = j;
    var testi = all.map(function (o) { return o.t; });
    var seen = {}; for (j = 0; j < 4; j++) { if (seen[testi[j]]) return null; seen[testi[j]] = 1; }
    return { opzioni: testi, corretta: idx, valori: all.map(function (o) { return o.k; }) };
  }
  function num(v) { return { k: String(v), t: "$" + v + "$" }; }
  function numF(f) { return { k: frKey(f), t: "$" + frTex(f) + "$" }; }
  function retry(f) {
    return function (rng, lingua) {
      for (var it = 0; it < 500; it++) { var r = f(rng, lingua); if (r) return r; }
      throw new Error("generatore senza istanza valida");
    };
  }
  function add(g) { g.genera = retry(g.genera); (QUIZ_GEN[MOD] = QUIZ_GEN[MOD] || []).push(g); }

  // ---------------------------------------------------------------- algoritmi
  function effOrder(p, w) { // indici 0..n-1 per efficienza non crescente, pari merito: indice minore
    return range1(p.length).map(function (i) { return i - 1; }).sort(function (a, b) {
      var x = p[a] * w[b], y = p[b] * w[a]; return x !== y ? y - x : a - b;
    });
  }
  function kpOpt(p, w, c) { // DP v(j,k); restituisce tabella
    var n = p.length, v = [];
    for (var j = 0; j <= n; j++) { v.push([]); for (var k = 0; k <= c; k++) v[j].push(0); }
    for (j = 1; j <= n; j++) for (k = 1; k <= c; k++) {
      v[j][k] = v[j - 1][k];
      if (w[j - 1] <= k && p[j - 1] + v[j - 1][k - w[j - 1]] > v[j][k]) v[j][k] = p[j - 1] + v[j - 1][k - w[j - 1]];
    }
    return v;
  }
  function kpOptSets(p, w, c) { // tutti gli insiemi ottimi (n piccolo)
    var n = p.length, best = -1, sets = [];
    for (var m = 0; m < (1 << n); m++) {
      var pp = 0, ww = 0, s = [];
      for (var j = 0; j < n; j++) if (m & (1 << j)) { pp += p[j]; ww += w[j]; s.push(j + 1); }
      if (ww > c) continue;
      if (pp > best) { best = pp; sets = [s]; } else if (pp === best) sets.push(s);
    }
    return { z: best, sets: sets };
  }
  function greedyOrder(order, p, w, c) {
    var rc = c, z = 0, s = [];
    order.forEach(function (j) { if (w[j] <= rc) { rc -= w[j]; z += p[j]; s.push(j + 1); } });
    return { z: z, set: s };
  }
  // bin packing: restituisce vettore bin (1-based) seguendo l'ordine dato
  function packing(w, c, rule, order) {
    order = order || range1(w.length).map(function (i) { return i - 1; });
    var loads = [], bin = new Array(w.length);
    order.forEach(function (i) {
      var b = -1;
      if (rule === "NF") { if (loads.length && loads[loads.length - 1] + w[i] <= c) b = loads.length - 1; }
      else {
        for (var k = 0; k < loads.length; k++) {
          if (loads[k] + w[i] > c) continue;
          if (b < 0) { b = k; if (rule === "FF") break; continue; }
          if (rule === "BF" && c - loads[k] < c - loads[b]) b = k;
          if (rule === "WF" && c - loads[k] > c - loads[b]) b = k;
        }
      }
      if (b < 0) { loads.push(0); b = loads.length - 1; }
      loads[b] += w[i]; bin[i] = b + 1;
    });
    return { bin: bin, nb: loads.length, loads: loads };
  }
  function decOrder(w) { return range1(w.length).map(function (i) { return i - 1; }).sort(function (a, b) { return w[b] - w[a] || a - b; }); }
  function listSched(t, m, order) {
    var Lm = []; for (var i = 0; i < m; i++) Lm.push(0);
    var mach = new Array(t.length);
    order.forEach(function (j) { var b = 0; for (var h = 1; h < m; h++) if (Lm[h] < Lm[b]) b = h; Lm[b] += t[j]; mach[j] = b + 1; });
    return { mach: mach, loads: Lm, cmax: Math.max.apply(null, Lm) };
  }
  function nn(d, n, s) { // restituisce {tour, len, open}
    var vis = {}, tour = [s], cur = s; vis[s] = 1; var len = 0;
    for (var k = 1; k < n; k++) {
      var b = -1; for (var j = 1; j <= n; j++) if (!vis[j] && (b < 0 || d[cur][j] < d[cur][b])) b = j;
      len += d[cur][b]; vis[b] = 1; tour.push(b); cur = b;
    }
    return { tour: tour, open: len, len: len + d[cur][s] };
  }
  function tourLen(d, t) { var s = 0; for (var i = 0; i < t.length; i++) s += d[t[i]][t[(i + 1) % t.length]]; return s; }
  function itemTab(lingua, p, w, lab) {
    var n = p.length, head = [lab || "j"].concat(range1(n).map(String));
    return tab(head, [["p_j"].concat(p), ["w_j"].concat(w)]);
  }


  function L2(en, it, a) { var s = a ? "#" + a : ""; return L(en + "/" + s, it + "/" + s); }
  function pairKey(a, b, ta, tb) { return { k: a + "|" + b, t: "$" + (ta || a) + "$, $" + (tb || b) + "$" }; }
  function pcmaxOpt(t, m) { var n = t.length, best = Infinity; for (var a = 0; a < Math.pow(m, n); a++) { var L0 = new Array(m).fill(0), x = a; for (var j = 0; j < n; j++) { L0[x % m] += t[j]; x = Math.floor(x / m); } best = Math.min(best, Math.max.apply(null, L0)); } return best; }
  function binsOf(P) { return P.nb; }
  function metricDist(rng, n) { // punti su una griglia, distanze di Manhattan (metriche), tutte diverse
    var P = []; for (var i = 0; i < n; i++) P.push([ri(rng, 0, 9), ri(rng, 0, 9)]);
    var d = [[]], seen = {};
    for (i = 1; i <= n; i++) { d.push([]); for (var j = 0; j <= n; j++) d[i].push(0); }
    for (i = 1; i <= n; i++) for (j = i + 1; j <= n; j++) {
      var x = Math.abs(P[i - 1][0] - P[j - 1][0]) + Math.abs(P[i - 1][1] - P[j - 1][1]);
      if (x === 0 || seen[x]) return null; seen[x] = 1; d[i][j] = d[j][i] = x;
    }
    return d;
  }
  function primMST(d, n) { // archi dell'albero (padre, figlio), radice 1
    var inT = new Array(n + 1).fill(false), best = new Array(n + 1).fill(Infinity), par = new Array(n + 1).fill(0), w = 0, edges = [];
    best[1] = 0;
    for (var it = 0; it < n; it++) {
      var u = -1; for (var v = 1; v <= n; v++) if (!inT[v] && (u < 0 || best[v] < best[u])) u = v;
      inT[u] = true; if (par[u]) { w += d[par[u]][u]; edges.push([par[u], u]); }
      for (v = 1; v <= n; v++) if (!inT[v] && d[u][v] < best[v]) { best[v] = d[u][v]; par[v] = u; }
    }
    return { w: w, edges: edges };
  }
  function preorder(n, edges) { var ch = {}; edges.forEach(function (e) { (ch[e[0]] = ch[e[0]] || []).push(e[1]); }); var out = []; (function vis(u) { out.push(u); (ch[u] || []).sort(function (a, b) { return a - b; }).forEach(vis); })(1); return out; }
  function stirling(n, k) { if (n === 0 && k === 0) return 1; if (n === 0 || k === 0) return 0; return k * stirling(n - 1, k) + stirling(n - 1, k - 1); }
  function fact(n) { return n <= 1 ? 1 : n * fact(n - 1); }

  function metricTxt(lingua, d, n) { return T(lingua, "TSP metrico con $" + n + "$ città e distanze (di Manhattan fra punti del piano, tutte diverse) " + distTab(d, n) + ".", "Metric TSP with $" + n + "$ cities and distances (Manhattan distances between points of the plane, all different) " + distTab(d, n) + "."); }

  // ---- 10. NF / FF / BF / WF (cap. 3)
  add({
    id: "aa-g-bpp-anyfit", livello: "facile", capitolo: "bin-packing-approximation",
    link: L("bin-packing-approximation/#sez-sec-AF", "bin-packing-approximation/#sez-sec-AF"),
    genera: function (rng, lingua) {
      var n = 7, c = 10, w = [];
      for (var j = 0; j < n; j++) w.push(ri(rng, 2, 8));
      var algs = ["NF", "FF", "BF", "WF"], R = {};
      algs.forEach(function (a) { R[a] = packing(w, c, a); });
      var a = pickOne(rng, algs);
      var key = function (x) { return { k: x, t: "$bin=" + vec(R[x].bin) + "$" }; };
      var b = build(rng, key(a), algs.filter(function (x) { return x !== a; }).map(key));
      if (!b) return null;
      var nome = { NF: "Next Fit", FF: "First Fit", BF: "Best Fit", WF: "Worst Fit" };
      b.valori = b.valori.map(function (x) { return x + ":" + R[x].bin.join(","); });
      return {
        testo: T(lingua, "Bin packing (BPP: oggetti in contenitori di capacità $c$, minimizzando i contenitori) con $c=" + c + "$ e pesi, nell'ordine di esame, $w=" + vec(w) + "$. I contenitori sono numerati nell'ordine di apertura; a parità di capacità residua si sceglie quello di indice minore. Quale vettore $bin$ (contenitore di ogni oggetto) produce " + nome[a] + " (" + a + ")?",
          "Bin packing (BPP: items into bins of capacity $c$, minimizing the bins) with $c=" + c + "$ and weights, in the order of examination, $w=" + vec(w) + "$. Bins are numbered in order of opening; ties on the residual capacity go to the smaller index. Which vector $bin$ (bin of each item) does " + nome[a] + " (" + a + ") produce?"),
        opzioni: b.opzioni, corretta: b.corretta,
        spiegazione: T(lingua, a + " dà $bin=" + vec(R[a].bin) + "$ con $" + R[a].nb + "$ contenitori. NF tiene aperto un solo contenitore; FF sceglie il primo in cui l'oggetto entra, BF quello con capacità residua minima, WF quello con capacità residua massima.",
          a + " gives $bin=" + vec(R[a].bin) + "$ with $" + R[a].nb + "$ bins. NF keeps a single open bin; FF chooses the first bin where the item fits, BF the one with the smallest residual capacity, WF the one with the largest residual capacity."),
        _v: { dati: { w: w, c: c, alg: a }, valori: b.valori }
      };
    }
  });

  // ---- 22. intervallo garantito da un algoritmo di approssimazione (cap. 1)
  add({
    id: "aa-g-approx-interval", livello: "facile", capitolo: "approximation",
    link: L("approximation/#box-3-def-alpha-approx", "approximation/#box-3-def-alpha-approx"),
    genera: function (rng, lingua) {
      var al = pickOne(rng, [fr(3, 2), fr(2, 1), fr(4, 3), fr(5, 4)]), mn = rng() < 0.5;
      var A = al.n * al.d * ri(rng, 2, 9);
      var lo = fr(A * al.d, al.n), hi = fr(A * al.n, al.d);
      var I = function (a, b) { return { k: frKey(a) + "|" + frKey(b), t: "$" + frTex(a) + "\\le z(I)\\le " + frTex(b) + "$" }; };
      var Af = fr(A, 1), alT = frTex(al);
      var giusta = mn ? I(lo, Af) : I(Af, hi);
      var eq = function (v) { return { k: "eq|" + frKey(v), t: "$z(I)=" + frTex(v) + "$" }; };
      var b = build(rng, giusta, [mn ? I(Af, hi) : I(lo, Af), I(lo, hi), mn ? eq(lo) : eq(hi)]);
      if (!b) return null;
      return {
        testo: T(lingua, "Un algoritmo $\\mathscr{A}$ è una $\\alpha$-approssimazione, con $\\alpha=" + alT + "$, per un problema di " + (mn ? "minimo: $\\mathscr{A}(I)\\le\\alpha\\,z(I)$" : "massimo: $z(I)\\le\\alpha\\,\\mathscr{A}(I)$") + " per ogni istanza $I$, dove $z(I)$ è il valore ottimo. Su un'istanza $I$ restituisce $\\mathscr{A}(I)=" + A + "$. Che cosa si può concludere sul valore ottimo $z(I)$?",
          "An algorithm $\\mathscr{A}$ is an $\\alpha$-approximation, with $\\alpha=" + alT + "$, for a " + (mn ? "minimization problem: $\\mathscr{A}(I)\\le\\alpha\\,z(I)$" : "maximization problem: $z(I)\\le\\alpha\\,\\mathscr{A}(I)$") + " for every instance $I$, where $z(I)$ is the optimal value. On an instance $I$ it returns $\\mathscr{A}(I)=" + A + "$. What can be concluded on the optimal value $z(I)$?"),
        opzioni: b.opzioni, corretta: b.corretta,
        spiegazione: T(lingua, mn ? "Per un problema di minimo $\\mathscr{A}(I)/z(I)\\le\\alpha$ e $z(I)\\le\\mathscr{A}(I)$, quindi $\\mathscr{A}(I)/\\alpha\\le z(I)\\le\\mathscr{A}(I)$." : "Per un problema di massimo $z(I)/\\mathscr{A}(I)\\le\\alpha$ e $\\mathscr{A}(I)\\le z(I)$, quindi $\\mathscr{A}(I)\\le z(I)\\le\\alpha\\,\\mathscr{A}(I)$.",
          mn ? "For a minimization problem $\\mathscr{A}(I)/z(I)\\le\\alpha$ and $z(I)\\le\\mathscr{A}(I)$, hence $\\mathscr{A}(I)/\\alpha\\le z(I)\\le\\mathscr{A}(I)$." : "For a maximization problem $z(I)/\\mathscr{A}(I)\\le\\alpha$ and $\\mathscr{A}(I)\\le z(I)$, hence $\\mathscr{A}(I)\\le z(I)\\le\\alpha\\,\\mathscr{A}(I)$."),
        _v: { dati: { alpha: [al.n, al.d], min: mn, A: A }, valori: b.valori }
      };
    }
  });

  // ---- 23. Ext-Greedy (cap. 2)
  add({
    id: "aa-g-kp-extgreedy", livello: "facile", capitolo: "knapsack-approximation",
    link: L("knapsack-approximation/#24-the-ext-greedy-algorithm", "knapsack-approximation/#24-lalgoritmo-ext-greedy"),
    genera: function (rng, lingua) {
      var n = 5, p = [], w = [];
      for (var j = 0; j < n; j++) { w.push(ri(rng, 1, 9)); p.push(ri(rng, 2, 20)); }
      var c = ri(rng, 9, 15); if (sum(w) <= c) return null;
      var gr = greedyOrder(effOrder(p, w), p, w, c).z;
      var pmax = 0; for (j = 0; j < n; j++) if (w[j] <= c) pmax = Math.max(pmax, p[j]);
      var gre = Math.max(gr, pmax);
      var grp = greedyOrder(decOrder(p), p, w, c).z, z = kpOpt(p, w, c)[n][c];
      var g1 = greedyOrder(range1(n).map(function (i) { return i - 1; }), p, w, c).z;
      var b = build(rng, num(gre), [num(gr), num(z), num(grp), num(g1), num(pmax)]);
      if (!b) return null;
      return {
        testo: T(lingua, "Problema dello zaino 0-1 (KP: si sceglie un sottoinsieme di oggetti di profitto massimo con peso totale al più $c$) con capacità $c=" + c + "$: " + itemTab(lingua, p, w) + ". L'algoritmo Ext-Greedy restituisce il migliore fra la soluzione del greedy per efficienza $p_j/w_j$ non crescente (pari merito: indice minore) e il miglior oggetto singolo. Quanto vale $GR^e(I)$?",
          "0-1 knapsack problem (KP: choose a subset of items of maximum profit with total weight at most $c$) with capacity $c=" + c + "$: " + itemTab(lingua, p, w) + ". The Ext-Greedy algorithm returns the better of the greedy solution by non-increasing efficiency $p_j/w_j$ (ties: smaller index) and the best single item. What is $GR^e(I)$?"),
        opzioni: b.opzioni, corretta: b.corretta,
        spiegazione: T(lingua, "$GR$ (per efficienza non crescente) vale $" + gr + "$; il miglior oggetto singolo ha profitto $" + pmax + "$; $GR^e(I)=\\max\\{" + gr + "," + pmax + "\\}=" + gre + "$. Il valore ottimo è $z(I)=" + z + "$.",
          "$GR$ (by non-increasing efficiency) has value $" + gr + "$; the best single item has profit $" + pmax + "$; $GR^e(I)=\\max\\{" + gr + "," + pmax + "\\}=" + gre + "$. The optimal value is $z(I)=" + z + "$."),
        _v: { dati: { p: p, w: w, c: c }, valori: b.valori }
      };
    }
  });

  // ---- 24. Basic-FPTAS: profitti scalati (cap. 2) — media
  add({
    id: "aa-g-kp-fptas", livello: "media", capitolo: "knapsack-approximation",
    link: L("knapsack-approximation/#box-14-ex-fptas", "knapsack-approximation/#box-14-ex-fptas"),
    genera: function (rng, lingua) {
      var n = 4, p = [], w = [];
      for (var j = 0; j < n; j++) { w.push(ri(rng, 2, 6)); p.push(ri(rng, 6, 40)); }
      var o = effOrder(p, w); p = o.map(function (i) { return p[i]; }); w = o.map(function (i) { return w[i]; });
      var c = ri(rng, 7, 12); if (sum(w) <= c) return null;
      var eps = pickOne(rng, [fr(1, 2), fr(1, 4)]);
      var gr = greedyOrder([0, 1, 2, 3], p, w, c).z, pmax = 0; for (j = 0; j < n; j++) if (w[j] <= c) pmax = Math.max(pmax, p[j]);
      var gre = Math.max(gr, pmax);
      // K = eps*gre/n ; p' = floor(p/K) = floor(p*n*eps.d/(eps.n*gre))
      var sc = function (den) { return p.map(function (x) { return Math.floor(x * den.d / den.n); }); };
      var K = fr(eps.n * gre, eps.d * n);
      var pk = sc(K);
      var Kp = fr(eps.n * Math.max.apply(null, p), eps.d * n), pkp = sc(Kp);
      var Kn = fr(eps.n * gre, eps.d), pkn = sc(Kn);
      var pc = p.map(function (x) { return Math.ceil(x * K.d / K.n); });
      var Kg = fr(eps.n * Math.max(gr, 1), eps.d * n), pkg = sc(Kg); // GR al posto di GR^e
      var key = function (a) { return sum(a) === 0 ? null : { k: a.join(","), t: "$p'=" + vec(a) + "$" }; };
      var distinti = pk.filter(function (x, i) { return pk.indexOf(x) === i; }).length;
      if (distinti < 2) return null;
      var b = build(rng, key(pk), [key(pc), key(pkp), key(pkg), key(pkn)]);
      if (!b || pk.join() === pc.join()) return null;
      return {
        testo: T(lingua, "Problema dello zaino 0-1 (KP: si sceglie un sottoinsieme di oggetti di profitto massimo con peso totale al più $c$) con capacità $c=" + c + "$ e $n=4$ oggetti ordinati per efficienza non crescente: " + itemTab(lingua, p, w) + ". Il Basic-FPTAS $FP^{\\varepsilon}$, con $\\varepsilon=" + frTex(eps) + "$, scala i profitti con il fattore $K=\\varepsilon\\,GR^e(I)/n$, dove $GR^e(I)$ è il valore di Ext-Greedy (migliore fra greedy per efficienza e miglior oggetto singolo). Quali sono i profitti scalati $p'_j=\\lfloor p_j/K\\rfloor$?",
          "0-1 knapsack problem (KP: choose a subset of items of maximum profit with total weight at most $c$) with capacity $c=" + c + "$ and $n=4$ items sorted by non-increasing efficiency: " + itemTab(lingua, p, w) + ". The Basic-FPTAS $FP^{\\varepsilon}$, with $\\varepsilon=" + frTex(eps) + "$, scales the profits by the factor $K=\\varepsilon\\,GR^e(I)/n$, where $GR^e(I)$ is the Ext-Greedy value (better of the greedy by efficiency and the best single item). What are the scaled profits $p'_j=\\lfloor p_j/K\\rfloor$?"),
        opzioni: b.opzioni, corretta: b.corretta,
        spiegazione: T(lingua, "$GR^e(I)=" + gre + "$, $K=\\varepsilon\\,GR^e(I)/n=" + frTex(K) + "$ e $p'_j=\\lfloor p_j/K\\rfloor$: $p'=" + vec(pk) + "$. Si arrotonda per difetto e il fattore usa $GR^e(I)$ e $n$.",
          "$GR^e(I)=" + gre + "$, $K=\\varepsilon\\,GR^e(I)/n=" + frTex(K) + "$ and $p'_j=\\lfloor p_j/K\\rfloor$: $p'=" + vec(pk) + "$. The profits are rounded down and the factor uses $GR^e(I)$ and $n$."),
        _v: { dati: { p: p, w: w, c: c, eps: [eps.n, eps.d] }, valori: b.valori }
      };
    }
  });

  // ---- B4.41-42 LIST e LPT (cap. 7)
  add({
    id: "aa-g-pcmax-list", livello: "facile", capitolo: "pcmax-approximation",
    link: L2("pcmax-approximation", "pcmax-approximation", "sez-sec-LIST"),
    genera: function (rng, lingua) {
      var m = 3, t = []; for (var j = 0; j < 7; j++) t.push(ri(rng, 1, 9));
      var idx = range1(7).map(function (i) { return i - 1; }), a = listSched(t, m, idx).cmax, b = listSched(t, m, decOrder(t)).cmax;
      if (a === b) return null;
      var bb = build(rng, pairKey(a, b), [pairKey(b, a), pairKey(a, a), pairKey(Math.ceil(sum(t) / m), b), pairKey(a + 1, b)]);
      if (!bb) return null;
      return {
        testo: T(lingua, "Scheduling $P\\,||\\,C_{\\max}$ con $m=3$ macchine identiche e durate, nell'ordine della lista, $t=" + vec(t) + "$. $LIST$ assegna ogni lavoro alla macchina meno carica (a parità quella di indice minore) nell'ordine della lista; $LPT$ fa lo stesso dopo aver ordinato i lavori per durata non crescente. Quanto valgono i makespan di $LIST$ e di $LPT$, nell'ordine?",
          "Scheduling $P\\,||\\,C_{\\max}$ with $m=3$ identical machines and times, in list order, $t=" + vec(t) + "$. $LIST$ assigns every job to the least loaded machine (ties: smallest index) in list order; $LPT$ does the same after sorting the jobs by non-increasing time. What are the makespans of $LIST$ and $LPT$, in this order?"),
        opzioni: bb.opzioni, corretta: bb.corretta,
        spiegazione: T(lingua, "$LIST$ dà $" + a + "$ e $LPT$ dà $" + b + "$; il lower bound $\\lceil\\sum_jt_j/m\\rceil$ vale $" + Math.ceil(sum(t) / m) + "$.",
          "$LIST$ gives $" + a + "$ and $LPT$ gives $" + b + "$; the lower bound $\\lceil\\sum_jt_j/m\\rceil$ is $" + Math.ceil(sum(t) / m) + "$."),
        _v: { dati: { t: t, m: m }, valori: bb.valori }
      };
    }
  });

  add({
    id: "aa-g-pcmax-ratio", livello: "media", capitolo: "pcmax-approximation",
    link: L2("pcmax-approximation", "pcmax-approximation", "box-6-prop-LPT"),
    genera: function (rng, lingua) {
      var m = ri(rng, 2, 3), t = []; for (var j = 0; j < 6; j++) t.push(ri(rng, 2, 9));
      var z = pcmaxOpt(t, m), b = listSched(t, m, decOrder(t)).cmax;
      if (b === z) return null;
      var a = listSched(t, m, range1(6).map(function (i) { return i - 1; })).cmax;
      var r = fr(b, z), g = fr(4 * m - 1, 3 * m);
      var bb = build(rng, numF(r), [numF(g), numF(fr(a, z)), numF(fr(z, b)), numF(fr(b, Math.max(Math.max.apply(null, t), Math.ceil(sum(t) / m)) + 1))]);
      if (!bb) return null;
      return {
        testo: T(lingua, "Scheduling $P\\,||\\,C_{\\max}$ con $m=" + m + "$ macchine identiche e durate $t=" + vec(t) + "$. $LPT$ ordina i lavori per durata non crescente e assegna ciascuno alla macchina meno carica (a parità, indice minore). Quanto vale il rapporto $LPT(I)/z(I)$, con $z(I)$ makespan ottimo?",
          "Scheduling $P\\,||\\,C_{\\max}$ with $m=" + m + "$ identical machines and times $t=" + vec(t) + "$. $LPT$ sorts the jobs by non-increasing time and assigns each to the least loaded machine (ties: smallest index). What is the ratio $LPT(I)/z(I)$, with $z(I)$ the optimal makespan?"),
        opzioni: bb.opzioni, corretta: bb.corretta,
        spiegazione: T(lingua, "$LPT(I)=" + b + "$ e $z(I)=" + z + "$: rapporto $" + frTex(r) + "$, al più la garanzia $\\frac43-\\frac1{3m}=" + frTex(g) + "$.",
          "$LPT(I)=" + b + "$ and $z(I)=" + z + "$: ratio $" + frTex(r) + "$, at most the guarantee $\\frac43-\\frac1{3m}=" + frTex(g) + "$."),
        _v: { dati: { t: t, m: m }, valori: bb.valori }
      };
    }
  });

  add({
    id: "aa-g-tsp-mst", livello: "facile", capitolo: "tsp-approximation",
    link: L2("tsp-approximation", "tsp-approximation", "box-6-obs-mst"),
    genera: function (rng, lingua) {
      var n = 5, d = metricDist(rng, n); if (!d) return null;
      var T0 = primMST(d, n), N = nn(d, n, 1).len, mn = 0;
      for (var i = 1; i <= n; i++) { var r = Infinity; for (var j = 1; j <= n; j++) if (j !== i) r = Math.min(r, d[i][j]); mn += r; }
      var bb = build(rng, num(T0.w), [num(2 * T0.w), num(N), num(mn), num(T0.w + 1)]);
      if (!bb) return null;
      return {
        testo: metricTxt(lingua, d, n) + T(lingua, " Quanto è lungo un albero ricoprente minimo $T$, il cui valore $d(T)$ è un lower bound sul giro ottimo?", " How long is a minimum spanning tree $T$, whose length $d(T)$ is a lower bound on the optimal tour?"),
        opzioni: bb.opzioni, corretta: bb.corretta,
        spiegazione: T(lingua, "L'algoritmo di Prim (o di Kruskal) dà $d(T)=" + T0.w + "$. Togliendo un lato dal giro ottimo si ottiene un albero ricoprente, quindi $d(T)\\le z(I)$; l'albero doppio dà un giro lungo al più $2d(T)=" + (2 * T0.w) + "$.",
          "Prim's (or Kruskal's) algorithm gives $d(T)=" + T0.w + "$. Removing an edge from the optimal tour gives a spanning tree, so $d(T)\\le z(I)$; the double tree gives a tour of length at most $2d(T)=" + (2 * T0.w) + "$."),
        _v: { dati: { d: d, n: n }, valori: bb.valori }
      };
    }
  });

  add({
    id: "aa-g-tsp-dt", livello: "media", capitolo: "tsp-approximation",
    link: L2("tsp-approximation", "tsp-approximation", "sez-sec-DT"),
    genera: function (rng, lingua) {
      var n = 5, d = metricDist(rng, n); if (!d) return null;
      var T0 = primMST(d, n), pre = preorder(n, T0.edges), L0 = tourLen(d, pre), N = nn(d, n, 1).len;
      var bb = build(rng, num(L0), [num(2 * T0.w), num(T0.w), num(N), num(L0 + 1)]);
      if (!bb) return null;
      return {
        testo: metricTxt(lingua, d, n) + T(lingua, " L'algoritmo dell'albero doppio prende l'albero ricoprente minimo (unico), ne raddoppia i lati, lo percorre in profondità dalla città $1$ visitando i figli per indice crescente e salta le città già visitate: il giro è l'ordine di prima visita. Quanto è lungo?",
          " The double tree algorithm takes the (unique) minimum spanning tree, doubles its edges, walks it depth first from city $1$ visiting children by increasing index and skips the cities already visited: the tour is the order of first visit. How long is it?"),
        opzioni: bb.opzioni, corretta: bb.corretta,
        spiegazione: T(lingua, "L'albero ha $d(T)=" + T0.w + "$; l'ordine di prima visita è $" + vec(pre) + "$, lungo $" + L0 + "\\le 2d(T)=" + (2 * T0.w) + "$: le scorciatoie non allungano il cammino perché le distanze sono metriche.",
          "The tree has $d(T)=" + T0.w + "$; the order of first visit is $" + vec(pre) + "$, of length $" + L0 + "\\le 2d(T)=" + (2 * T0.w) + "$: shortcuts do not lengthen the walk because the distances are metric."),
        _v: { dati: { d: d, n: n }, valori: bb.valori }
      };
    }
  });

  // ---- B4.45 Next Fit e bound sul peso (cap. 3)
  add({
    id: "aa-g-bpp-nf", livello: "facile", capitolo: "bin-packing-approximation",
    link: L2("bin-packing-approximation", "bin-packing-approximation", "sez-sec-NF"),
    genera: function (rng, lingua) {
      var n = 8, c = 10, w = []; for (var j = 0; j < n; j++) w.push(ri(rng, 1, 8));
      var nf = binsOf(packing(w, c, "NF")), ff = binsOf(packing(w, c, "FF")), lb = Math.ceil(sum(w) / c);
      if (nf === ff) return null;
      var bb = build(rng, pairKey(nf, lb), [pairKey(ff, lb), pairKey(nf, lb + 1), pairKey(lb, nf), pairKey(nf + 1, lb)]);
      if (!bb) return null;
      return {
        testo: T(lingua, "Bin packing con capacità $c=" + c + "$ e oggetti di peso $" + vec(w) + "$ in quest'ordine. Next Fit (NF) tiene aperto un solo contenitore e ne apre uno nuovo quando l'oggetto non entra. Quanti contenitori usa NF, e quanto vale il bound sul peso $\\lceil\\sum_jw_j/c\\rceil$, nell'ordine?",
          "Bin packing with capacity $c=" + c + "$ and items of weight $" + vec(w) + "$ in this order. Next Fit (NF) keeps a single bin open and opens a new one when the item does not fit. How many bins does NF use, and what is the weight bound $\\lceil\\sum_jw_j/c\\rceil$, in this order?"),
        opzioni: bb.opzioni, corretta: bb.corretta,
        spiegazione: T(lingua, "NF usa $" + nf + "$ contenitori e il bound vale $\\lceil " + sum(w) + "/" + c + "\\rceil=" + lb + "$; First Fit, che riprende i contenitori già aperti, ne usa $" + ff + "$. Vale sempre $NF(I)\\le 2z(I)$.",
          "NF uses $" + nf + "$ bins and the bound is $\\lceil " + sum(w) + "/" + c + "\\rceil=" + lb + "$; First Fit, which reuses the open bins, uses $" + ff + "$. Always $NF(I)\\le 2z(I)$."),
        _v: { dati: { w: w, c: c }, valori: bb.valori }
      };
    }
  });

  // ---- B4.46 errore relativo (cap. 1)
  add({
    id: "aa-g-approx-error", livello: "facile", capitolo: "approximation",
    link: L2("approximation", "approximation", "box-2-def-pratio"),
    genera: function (rng, lingua) {
      var mn = rng() < 0.5, z = ri(rng, 10, 40), A = mn ? z + ri(rng, 1, 15) : z - ri(rng, 1, Math.min(15, z - 1));
      var e = fr(Math.abs(A - z), z), r = mn ? fr(A, z) : fr(z, A);
      var key = function (a, b) { return { k: frKey(a) + "|" + frKey(b), t: "$" + frTex(a) + "$ " + T(lingua, "e", "and") + " $" + frTex(b) + "$" }; };
      var bb = build(rng, key(r, e), [key(fr(r.d, r.n), e), key(r, fr(Math.abs(A - z), A)), key(e, r), key(r, fr(Math.abs(A - z), 1))]);
      if (!bb) return null;
      return {
        testo: T(lingua, "Per un problema di " + (mn ? "minimo" : "massimo") + " un algoritmo trova una soluzione di valore $\\mathscr{A}(I)=" + A + "$ e il valore ottimo è $z(I)=" + z + "$. Il rapporto di prestazione è $" + (mn ? "\\mathscr{A}(I)/z(I)" : "z(I)/\\mathscr{A}(I)") + "$ e l'errore relativo $|\\mathscr{A}(I)-z(I)|/z(I)$. Quanto valgono, nell'ordine?",
          "For a " + (mn ? "minimization" : "maximization") + " problem an algorithm finds a solution of value $\\mathscr{A}(I)=" + A + "$ and the optimal value is $z(I)=" + z + "$. The performance ratio is $" + (mn ? "\\mathscr{A}(I)/z(I)" : "z(I)/\\mathscr{A}(I)") + "$ and the relative error $|\\mathscr{A}(I)-z(I)|/z(I)$. What are they, in this order?"),
        opzioni: bb.opzioni, corretta: bb.corretta,
        spiegazione: T(lingua, "Rapporto $" + frTex(r) + "\\ge 1$ ed errore $" + frTex(e) + "$; l'errore si divide per il valore ottimo, non per quello trovato.",
          "Ratio $" + frTex(r) + "\\ge 1$ and error $" + frTex(e) + "$; the error is divided by the optimal value, not by the value found."),
        _v: { dati: { A: A, z: z, min: mn }, valori: bb.valori }
      };
    }
  });

  // ---- C5. bin packing: NF, FF, BF e WF sulla stessa istanza (cap. 3) — complessa
  add({
    id: "aa-g-bpp-anyfit-full", livello: "complessa", capitolo: "bin-packing-approximation",
    link: L2("bin-packing-approximation", "bin-packing-approximation", "box-3-def-AF"),
    genera: function (rng, lingua) {
      var n = 8, c = 10, w = []; for (var j = 0; j < n; j++) w.push(ri(rng, 2, 8));
      var R = ["NF", "FF", "BF", "WF"].map(function (r) { return packing(w, c, r).nb; });
      var dist = {}; R.forEach(function (x) { dist[x] = 1; }); if (Object.keys(dist).length < 2) return null;
      var key = function (v) { return { k: v.join("|"), t: "$NF=" + v[0] + "$, $FF=" + v[1] + "$, $BF=" + v[2] + "$, $WF=" + v[3] + "$" }; };
      var ffd = packing(w, c, "FF", decOrder(w)).nb;
      var cand = [key([R[1], R[0], R[2], R[3]]), key([R[0], R[1], R[3], R[2]]), key([R[0], ffd, ffd, R[3]]), key([R[0], R[1], R[2], R[3] + 1]),
                  key([R[0] - 1, R[1], R[2], R[3]]), key([R[0], R[2], R[1], R[3]]), key([R[0], R[1] + 1, R[2], R[3]])];
      var b = build(rng, key(R), cand);
      if (!b) return null;
      return {
        testo: T(lingua, "Bin packing con contenitori di capacità $c=10$ e oggetti, nell'ordine di input, di peso $w=" + vec(w) + "$. Next Fit (NF) tiene aperto solo l'ultimo contenitore; First Fit (FF), Best Fit (BF) e Worst Fit (WF) mettono ogni oggetto, rispettivamente, nel primo contenitore in cui entra, in quello con capacità residua minima e in quello con capacità residua massima fra quelli in cui entra (pari merito: indice minore), e aprono un contenitore nuovo solo se non entra in nessuno. Quanti contenitori usa ciascun algoritmo?",
          "Bin packing with bins of capacity $c=10$ and items, in input order, of weight $w=" + vec(w) + "$. Next Fit (NF) keeps only the last bin open; First Fit (FF), Best Fit (BF) and Worst Fit (WF) put every item, respectively, into the first bin where it fits, into the one with minimum residual capacity and into the one with maximum residual capacity among those where it fits (ties: smallest index), and open a new bin only if it fits in none. How many bins does each algorithm use?"),
        opzioni: b.opzioni, corretta: b.corretta,
        spiegazione: T(lingua, "Simulando le quattro regole: $NF=" + R[0] + "$, $FF=" + R[1] + "$, $BF=" + R[2] + "$, $WF=" + R[3] + "$; il bound sul peso è $\\lceil" + sum(w) + "/10\\rceil=" + Math.ceil(sum(w) / 10) + "$. NF non è Any Fit: chiude un contenitore anche se un oggetto successivo vi entrerebbe.",
          "Simulating the four rules: $NF=" + R[0] + "$, $FF=" + R[1] + "$, $BF=" + R[2] + "$, $WF=" + R[3] + "$; the weight bound is $\\lceil" + sum(w) + "/10\\rceil=" + Math.ceil(sum(w) / 10) + "$. NF is not Any Fit: it closes a bin even if a later item would fit into it."),
        _v: { dati: { w: w, c: c }, valori: b.valori }
      };
    }
  });

  // ---- C6. zaino: Basic-FPTAS completo (cap. 2) — complessa
  add({
    id: "aa-g-kp-fptas-full", livello: "complessa", capitolo: "knapsack-approximation",
    link: L2("knapsack-approximation", "knapsack-approximation", "box-23-prop-fptas"),
    genera: function (rng, lingua) {
      var n = 5, p = [], w = [];
      for (var j = 0; j < n; j++) { w.push(ri(rng, 2, 7)); p.push(ri(rng, 8, 40)); }
      var o = effOrder(p, w); p = o.map(function (i) { return p[i]; }); w = o.map(function (i) { return w[i]; });
      var c = ri(rng, 9, 15); if (sum(w) <= c || Math.max.apply(null, w) > c) return null;
      var gr = greedyOrder([0, 1, 2, 3, 4], p, w, c).z, gre = Math.max(gr, Math.max.apply(null, p));
      // eps = 1/2: K = gre/(2n), p' = floor(p/K) = floor(2 n p / gre)
      var pk = p.map(function (x) { return Math.floor(2 * n * x / gre); });
      var best = -1, sets = [];
      for (var mk = 0; mk < (1 << n); mk++) {
        var ww = 0, q = 0, S = [];
        for (j = 0; j < n; j++) if (mk & (1 << j)) { ww += w[j]; q += pk[j]; S.push(j); }
        if (ww > c) continue;
        if (q > best) { best = q; sets = [S]; } else if (q === best) sets.push(S);
      }
      if (sets.length !== 1) return null;
      var FP = 0; sets[0].forEach(function (k) { FP += p[k]; });
      var z = kpOptSets(p, w, c).z;
      if (FP === z && rng() < 0.5) return null;
      var key = function (a, b2) { return { k: a + "|" + b2, t: "$FP^{\\varepsilon}(I)=" + a + "$, $z(I)=" + b2 + "$" }; };
      var b = build(rng, key(FP, z), [key(best, z), key(gre, z), key(FP, Math.floor(FP / (1 - 0.5))), key(FP, z + 1), key(FP - 1, z), key(gr, z)]);
      if (!b) return null;
      return {
        testo: T(lingua, "Zaino 0/1 con capacità $c=" + c + "$ e oggetti ordinati per efficienza non crescente: " + itemTab(lingua, p, w) + ". L'algoritmo Basic-FPTAS con $\\varepsilon=\\frac12$ calcola $GR^e(I)=\\max\\{GR(I),\\max_jp_j\\}$ ($GR$: greedy per efficienza, che salta gli oggetti che non entrano), pone $K=\\varepsilon\\,GR^e(I)/n$ e $p'_j=\\lfloor p_j/K\\rfloor$, risolve all'ottimo l'istanza con profitti $p'_j$ e restituisce il profitto originale $FP^{\\varepsilon}(I)$ della soluzione trovata. Quanto valgono $FP^{\\varepsilon}(I)$ e il valore ottimo $z(I)$?",
          "0/1 knapsack with capacity $c=" + c + "$ and items sorted by non-increasing efficiency: " + itemTab(lingua, p, w) + ". The Basic-FPTAS algorithm with $\\varepsilon=\\frac12$ computes $GR^e(I)=\\max\\{GR(I),\\max_jp_j\\}$ ($GR$: greedy by efficiency, skipping the items that do not fit), sets $K=\\varepsilon\\,GR^e(I)/n$ and $p'_j=\\lfloor p_j/K\\rfloor$, solves the instance with profits $p'_j$ to optimality and returns the original profit $FP^{\\varepsilon}(I)$ of the solution found. What are $FP^{\\varepsilon}(I)$ and the optimal value $z(I)$?"),
        opzioni: b.opzioni, corretta: b.corretta,
        spiegazione: T(lingua, "$GR^e(I)=" + gre + "$, $K=" + frTex(fr(gre, 2 * n)) + "$, $p'=" + vec(pk) + "$. L'istanza scalata ha ottimo $" + best + "$ con gli oggetti $" + set(sets[0].map(function (k) { return k + 1; })) + "$, di profitto originale $" + FP + "$; l'ottimo vero è $" + z + "$, e infatti $" + FP + "\\ge\\frac12\\cdot" + z + "$.",
          "$GR^e(I)=" + gre + "$, $K=" + frTex(fr(gre, 2 * n)) + "$, $p'=" + vec(pk) + "$. The scaled instance has optimum $" + best + "$ with items $" + set(sets[0].map(function (k) { return k + 1; })) + "$, of original profit $" + FP + "$; the true optimum is $" + z + "$, and indeed $" + FP + "\\ge\\frac12\\cdot" + z + "$."),
        _v: { dati: { p: p, w: w, c: c }, valori: b.valori }
      };
    }
  });

  // ================================================================ 21/11/2026: generatori dei capitoli 4 e 5 (prima
  // non ne avevano: le loro domande fisse uscivano quasi in ogni facsimile)
  function grafoCasuale(rng, n, p) { var E = []; for (var i = 1; i <= n; i++) for (var j = i + 1; j <= n; j++) if (rng() < p) E.push([i, j]); return E; }
  function testoArchi(E) { return "$E=\\{" + E.map(function (e) { return "\\{" + e[0] + "," + e[1] + "\\}"; }).join(",") + "\\}$"; }
  function adiacenze(n, E) { var A = []; for (var i = 0; i <= n; i++) A.push({}); E.forEach(function (e) { A[e[0]][e[1]] = 1; A[e[1]][e[0]] = 1; }); return A; }
  function omega(n, E) { // clique massima per enumerazione (n piccolo)
    var A = adiacenze(n, E), best = 0;
    for (var m = 1; m < (1 << n); m++) {
      var S = []; for (var i = 0; i < n; i++) if (m & (1 << i)) S.push(i + 1);
      if (S.length <= best) continue;
      var ok = true; for (var a = 0; a < S.length && ok; a++) for (var b = a + 1; b < S.length; b++) if (!A[S[a]][S[b]]) { ok = false; break; }
      if (ok) best = S.length;
    }
    return best;
  }

  // ---- intervalli: greedy per estremo sinistro (cap. 4, proposizione 4.11)
  add({
    id: "aa-g-vci-interval", livello: "facile", capitolo: "coloring-inapproximability",
    link: L2("coloring-inapproximability", "coloring-inapproximability", "box-11-vci-propInt"),
    genera: function (rng, lingua) {
      var n = 6, I = [];
      for (var v = 0; v < n; v++) { var a = ri(rng, 0, 9); I.push([a, a + ri(rng, 1, 4)]); }
      I.sort(function (x, y) { return x[0] - y[0] || x[1] - y[1]; });
      var w = 0; // massimo numero di intervalli con un punto in comune (basta guardare gli estremi sinistri)
      I.forEach(function (x) { var c = 0; I.forEach(function (y) { if (y[0] <= x[0] && x[0] <= y[1]) c++; }); if (c > w) w = c; });
      var d = 0; I.forEach(function (x, i) { var c = 0; I.forEach(function (y, j) { if (i !== j && x[0] <= y[1] && y[0] <= x[1]) c++; }); if (c > d) d = c; });
      var b = build(rng, num(w), [num(w + 1), num(w - 1), num(d + 1), num(n), num(Math.ceil(n / 2))]);
      if (!b || w < 2) return null;
      var tI = I.map(function (x, i) { return "$I_{" + (i + 1) + "}=[" + x[0] + "," + x[1] + "]$"; }).join(", ");
      return {
        testo: T(lingua, "Grafo di intervalli con i vertici $1,\\dots,6$ e gli intervalli chiusi " + tI + " (due vertici sono adiacenti se i loro intervalli si intersecano). Quanti colori usa la colorazione greedy con i vertici in ordine di estremo sinistro non decrescente?",
          "Interval graph with vertices $1,\\dots,6$ and closed intervals " + tI + " (two vertices are adjacent if their intervals intersect). How many colors does the greedy coloring use with the vertices in order of non-decreasing left endpoint?"),
        opzioni: b.opzioni, corretta: b.corretta,
        spiegazione: T(lingua, "Su un grafo di intervalli quell'ordine dà $\\omega(G)$ colori, il massimo numero di intervalli con un punto in comune: qui $" + w + "$, ed è ottimo perché $\\chi(G)\\ge\\omega(G)$. Il bound $\\Delta(G)+1=" + (d + 1) + "$ vale per ogni ordine ma è più debole.",
          "On an interval graph that order gives $\\omega(G)$ colors, the largest number of intervals with a common point: here $" + w + "$, and it is optimal since $\\chi(G)\\ge\\omega(G)$. The bound $\\Delta(G)+1=" + (d + 1) + "$ holds for every order but is weaker."),
        _v: { dati: { I: I }, valori: b.valori }
      };
    }
  });

  // ---- prodotto forte: omega(G ⊠ H) = omega(G) omega(H) (cap. 5, proposizione 5.2)
  add({
    id: "aa-g-cli-product", livello: "facile", capitolo: "clique-inapproximability",
    link: L2("clique-inapproximability", "clique-inapproximability", "box-2-cli-propprod"),
    genera: function (rng, lingua) {
      var E1 = grafoCasuale(rng, 4, 0.55), E2 = grafoCasuale(rng, 4, 0.55);
      if (!E1.length || !E2.length) return null;
      var a = omega(4, E1), c = omega(4, E2);
      var key = function (nv, w) { return { k: nv + "|" + w, t: "$" + nv + "$ " + T(lingua, "vertici e", "vertices and") + " $\\omega=" + w + "$" }; };
      var b = build(rng, key(16, a * c), [key(16, a + c), key(8, a * c), key(16, Math.max(a, c)), key(8, a + c), key(16, a * c + 1)]);
      if (!b) return null;
      return {
        testo: T(lingua, "Due grafi sui vertici $\\{1,2,3,4\\}$: $G$ con " + testoArchi(E1) + " e $H$ con " + testoArchi(E2).replace("E=", "F=") + ". Quanti vertici ha il prodotto forte $G\\boxtimes H$ e quanto vale il suo numero di clique?",
          "Two graphs on the vertices $\\{1,2,3,4\\}$: $G$ with " + testoArchi(E1) + " and $H$ with " + testoArchi(E2).replace("E=", "F=") + ". How many vertices does the strong product $G\\boxtimes H$ have, and what is its clique number?"),
        opzioni: b.opzioni, corretta: b.corretta,
        spiegazione: T(lingua, "$G\\boxtimes H$ ha $4\\cdot4=16$ vertici e $\\omega(G\\boxtimes H)=\\omega(G)\\,\\omega(H)=" + a + "\\cdot" + c + "=" + (a * c) + "$: il prodotto di due clique è una clique, e ogni clique del prodotto sta in un tale prodotto.",
          "$G\\boxtimes H$ has $4\\cdot4=16$ vertices and $\\omega(G\\boxtimes H)=\\omega(G)\\,\\omega(H)=" + a + "\\cdot" + c + "=" + (a * c) + "$: the product of two cliques is a clique, and every clique of the product lies in such a product."),
        _v: { dati: { E1: E1, E2: E2 }, valori: b.valori }
      };
    }
  });

  // ---- insieme stabile massimale greedy e il bound n/(Delta+1) (cap. 5, proposizione 5.8)
  add({
    id: "aa-g-cli-maximal", livello: "facile", capitolo: "clique-inapproximability",
    link: L2("clique-inapproximability", "clique-inapproximability", "box-8-cli-propmssp"),
    genera: function (rng, lingua) {
      var n = 8, E = grafoCasuale(rng, n, 0.35), A = adiacenze(n, E), S = [];
      for (var v = 1; v <= n; v++) { var ok = true; S.forEach(function (u) { if (A[u][v]) ok = false; }); if (ok) S.push(v); }
      var d = 0; for (v = 1; v <= n; v++) d = Math.max(d, Object.keys(A[v]).length);
      if (d < 2) return null;
      var lb = Math.ceil(n / (d + 1));
      var key = function (s, l) { return { k: s + "|" + l, t: "$|S|=" + s + "$, " + T(lingua, "bound", "bound") + " $" + l + "$" }; };
      var b = build(rng, key(S.length, lb), [key(S.length, Math.ceil(n / d)), key(S.length + 1, lb), key(S.length - 1, lb), key(S.length, Math.floor(n / (d + 1)) + 1 === lb ? lb + 1 : Math.floor(n / (d + 1)) + 1), key(lb, S.length)]);
      if (!b) return null;
      return {
        testo: T(lingua, "Grafo con i vertici $1,\\dots,8$ e " + testoArchi(E) + ". L'algoritmo greedy esamina i vertici in ordine $1,2,\\dots,8$ e aggiunge un vertice a $S$ se non è adiacente a nessun vertice già in $S$. Quanto vale $|S|$, e qual è il lower bound $\\lceil n/(\\Delta(G)+1)\\rceil$ che vale per ogni insieme stabile massimale?",
          "Graph with vertices $1,\\dots,8$ and " + testoArchi(E) + ". The greedy algorithm examines the vertices in the order $1,2,\\dots,8$ and adds a vertex to $S$ if it is adjacent to no vertex already in $S$. What is $|S|$, and what is the lower bound $\\lceil n/(\\Delta(G)+1)\\rceil$ valid for every maximal stable set?"),
        opzioni: b.opzioni, corretta: b.corretta,
        spiegazione: T(lingua, "Il greedy trova $S=\\{" + S.join(",") + "\\}$, massimale. Con $\\Delta(G)=" + d + "$ ogni vertice di $S$ esclude al più $\\Delta(G)$ vicini, quindi $|S|\\ge\\lceil 8/" + (d + 1) + "\\rceil=" + lb + "$ e $\\alpha(G)/|S|\\le\\Delta(G)+1$.",
          "The greedy finds $S=\\{" + S.join(",") + "\\}$, maximal. With $\\Delta(G)=" + d + "$ every vertex of $S$ excludes at most $\\Delta(G)$ neighbours, hence $|S|\\ge\\lceil 8/" + (d + 1) + "\\rceil=" + lb + "$ and $\\alpha(G)/|S|\\le\\Delta(G)+1$."),
        _v: { dati: { E: E, n: n }, valori: b.valori }
      };
    }
  });

  // ---- grafi planari: il bound m <= 3n - 6 (cap. 4, lemma 4.7)
  add({
    id: "aa-g-vci-planar", livello: "facile", capitolo: "coloring-inapproximability",
    link: L2("coloring-inapproximability", "coloring-inapproximability", "box-7-vci-lemDeg5"),
    genera: function (rng, lingua) {
      var n = ri(rng, 5, 30), m = ri(rng, 2 * n, 4 * n), mx = 3 * n - 6, pl = m <= mx;
      var key = function (b2, x) { return { k: b2 + "|" + x, t: "$3n-6=" + x + "$: " + (b2 ? T(lingua, "può essere planare", "it can be planar") : T(lingua, "non è planare", "it is not planar")) }; };
      var b = build(rng, key(pl, mx), [key(!pl, mx), key(pl, 3 * n - 3), key(!pl, 3 * n - 3), key(pl, 2 * n - 4), key(!pl, 2 * n - 4)]);
      if (!b) return null;
      return {
        testo: T(lingua, "Un grafo semplice ha $n=" + n + "$ vertici e $m=" + m + "$ spigoli. Usando il lemma sul numero di spigoli dei grafi planari, che cosa si può dire?",
          "A simple graph has $n=" + n + "$ vertices and $m=" + m + "$ edges. Using the lemma on the number of edges of planar graphs, what can be said?"),
        opzioni: b.opzioni, corretta: b.corretta,
        spiegazione: T(lingua, "Ogni grafo planare con $n\\ge3$ vertici ha $m\\le3n-6=" + mx + "$. " + (pl ? "Qui $m\\le" + mx + "$: il lemma non esclude la planarità (non la dimostra)." : "Qui $m>" + mx + "$: il grafo non è planare."),
          "Every planar graph with $n\\ge3$ vertices has $m\\le3n-6=" + mx + "$. " + (pl ? "Here $m\\le" + mx + "$: the lemma does not rule out planarity (it does not prove it)." : "Here $m>" + mx + "$: the graph is not planar.")),
        _v: { dati: { n: n, m: m }, valori: b.valori }
      };
    }
  });
})();
