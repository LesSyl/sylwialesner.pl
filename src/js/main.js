(() => {
    "use strict";

    const header = document.querySelector("[data-header]");
    const menuToggle = document.querySelector("[data-menu-toggle]");
    const navigation = document.querySelector("[data-navigation]");
    const currentYear = document.querySelector("[data-current-year]");

    const setHeaderState = () => {
        header?.classList.toggle("is-scrolled", window.scrollY > 12);
    };

    const closeMenu = () => {
        if (!menuToggle || !navigation) return;

        menuToggle.classList.remove("is-active");
        navigation.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Otwórz menu");
        document.body.classList.remove("is-menu-open");
    };

    const toggleMenu = () => {
        if (!menuToggle || !navigation) return;

        const isOpen = navigation.classList.toggle("is-open");
        menuToggle.classList.toggle("is-active", isOpen);
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute("aria-label", isOpen ? "Zamknij menu" : "Otwórz menu");
        document.body.classList.toggle("is-menu-open", isOpen);
    };

    menuToggle?.addEventListener("click", toggleMenu);

    navigation?.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("scroll", setHeaderState, { passive: true });
    setHeaderState();

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // Progressive enhancement: reveal sections when they enter the viewport.
    if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const observer = new IntersectionObserver(
            (entries, instance) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add("is-visible");
                    instance.unobserve(entry.target);
                });
            },
            { threshold: 0.12 }
        );

        document.querySelectorAll(".service, .project, .process__item, .stat").forEach((element) => {
            element.classList.add("reveal");
            observer.observe(element);
        });
    }
})();


/////////// SVG ////////////

(function () {
  var svg = document.getElementById('ribbon');
  var g = document.getElementById('ribbon-lines');
  var N = 52;                      // liczba linii
  var SPEED = 0.45;                // tempo ruchu (mniej = spokojniej)
  var ns = 'http://www.w3.org/2000/svg';
  var paths = [], colors = [], stops = [];

  var style = getComputedStyle(svg);
  var dark = style.getPropertyValue('--line-dark').trim().split(',').map(Number);
  var green = style.getPropertyValue('--line-green').trim().split(',').map(Number);

  function smooth(a, b, x) { x = Math.max(0, Math.min(1, (x - a) / (b - a))); return x * x * (3 - 2 * x); }

  // v = 0: zewnętrzna (górna, ciemna) linia, v = 1: wewnętrzna (dolna, zielona)
  for (var i = 0; i < N; i++) {
    var v = i / (N - 1);
    var s = smooth(0.3, 0.95, v);
    var c = dark.map(function (d, k) { return Math.round(d + (green[k] - d) * s); });
    var p = document.createElementNS(ns, 'path');
    colors.push(c);
    p.setAttribute('stroke', 'url(#ribbon-grad-' + i + ')');   // gradient przezroczystości = cieniowanie głębi
    g.appendChild(p);
    paths.push(p);
  }

  // OŚ WSTĄGI – krzywa, wzdłuż której płynie cała wstęga
  var CENTER = [[-260,640],[-60,600],[160,545],[400,525],[660,540],[920,580],[1130,632],[1290,662],[1390,628],[1480,540],[1580,390],[1700,170],[1860,-120]];

  // zagęszczenie osi (Catmull-Rom) – potem liczymy długość łuku i normalne
  function densify(A, m) {
    var out = [];
    for (var i = 0; i < A.length - 1; i++) {
      var p0 = A[Math.max(i - 1, 0)], p1 = A[i], p2 = A[i + 1], p3 = A[Math.min(i + 2, A.length - 1)];
      for (var q = 0; q < m; q++) {
        var t = q / m, t2 = t * t, t3 = t2 * t;
        out.push([0, 1].map(function (c) {
          return 0.5 * ((2 * p1[c]) + (-p0[c] + p2[c]) * t + (2 * p0[c] - 5 * p1[c] + 4 * p2[c] - p3[c]) * t2 + (-p0[c] + 3 * p1[c] - 3 * p2[c] + p3[c]) * t3);
        }));
      }
    }
    out.push(A[A.length - 1]);
    return out;
  }
  var C = densify(CENTER, 24);
  var K = C.length;
  var AL = [0], NX = [], NY = [];
  for (var q1 = 1; q1 < K; q1++) AL.push(AL[q1 - 1] + Math.hypot(C[q1][0] - C[q1 - 1][0], C[q1][1] - C[q1 - 1][1]));
  for (var q2 = 0; q2 < K; q2++) AL[q2] /= AL[K - 1];                        // 0..1 wzdłuż wstęgi
  for (var q3 = 0; q3 < K; q3++) {                                           // normalne do osi
    var pa = C[Math.max(q3 - 1, 0)], pb = C[Math.min(q3 + 1, K - 1)];
    var tx = pb[0] - pa[0], ty = pb[1] - pa[1], tl = Math.hypot(tx, ty);
    NX.push(-ty / tl); NY.push(tx / tl);
  }

  // GŁĘBIA: każda linia ma własny gradient przezroczystości wzdłuż osi X (aktualizowany w draw)
  var defs = svg.querySelector('defs'), SAMPLES = 14, GX0 = -300, GX1 = 1900, KS = [];
  for (var sIdx = 0; sIdx < SAMPLES; sIdx++) {
    var target = 0.05 + 0.93 * sIdx / (SAMPLES - 1), kk = 0;
    while (kk < K - 1 && AL[kk] < target) kk++;
    KS.push(kk);
  }
  for (var gi = 0; gi < N; gi++) {
    var lg = document.createElementNS(ns, 'linearGradient');
    lg.setAttribute('id', 'ribbon-grad-' + gi);
    lg.setAttribute('gradientUnits', 'userSpaceOnUse');
    lg.setAttribute('x1', GX0); lg.setAttribute('x2', GX1); lg.setAttribute('y1', 0); lg.setAttribute('y2', 0);
    var rgb = 'rgb(' + colors[gi].join(',') + ')', st = [];
    var offs = [0].concat(KS.map(function (k) { return Math.min(1, Math.max(0, (C[k][0] - GX0) / (GX1 - GX0))); }), [1]);
    for (var oi = 0; oi < offs.length; oi++) {
      var stp = document.createElementNS(ns, 'stop');
      stp.setAttribute('offset', (oi && oi < offs.length - 1) ? Math.max(offs[oi], offs[oi - 1] + 0.0005).toFixed(4) : offs[oi]);
      stp.setAttribute('stop-color', rgb);
      lg.appendChild(stp); st.push(stp);
    }
    defs.appendChild(lg); stops.push(st);
  }

  var WIDTH = 210;         // szerokość wstęgi po obu stronach skrzyżowania (px w układzie 1600×800)
  var PINCH = 0.55;        // miejsce skrzyżowania wzdłuż wstęgi (0 = lewy koniec, 1 = prawy koniec)
  var SOFT = 0.50;         // łagodność przekręcenia (większa = szerzej, spokojniej)
  var LEFT = 1.5;         // o ile rozszerzają się linie ku lewemu końcowi (0 = wcale)
  var RIGHT = 0.6;         // o ile rozszerzają się linie ku lewemu końcowi (0 = wcale)
  var PITCH = 0.4;         // 3D: pochylenie kamery (0 = płasko, jak wcześniej; 0.35 = lekko z góry; 0.6 = mocno)
  var DIST = 220;         // 3D: odległość kamery (mniejsza = silniejsza perspektywa)
  var SHADE = 0.8;         // 3D: cieniowanie głębi (0 = brak; 0.5 = bliższe linie wyraźniejsze, dalsze bledsze)
  var WILD = 2;            // nierówność linii (0 = idealnie równe, 2 = bardzo organiczne)

  function sm(a, b, x) { x = Math.max(0, Math.min(1, (x - a) / (b - a))); return x * x * (3 - 2 * x); }
  function f(x, y) { return x.toFixed(1) + ' ' + y.toFixed(1); }

  function draw(time) {
    var pc = PINCH + 0.03 * Math.sin(time * 0.5);            // skrzyżowanie lekko „płynie” po wstędze
    var wdA = [], tauA = [], sinA = [], waveA = [];
    for (var k = 0; k < K; k++) {
      var a = AL[k];
      var th = Math.PI * sm(pc - SOFT, pc + SOFT, a);        // pół obrotu = jedno skrzyżowanie linii
      tauA.push(Math.cos(th)); sinA.push(Math.sin(th));
      wdA.push(WIDTH * (0.95 + 0.1 * Math.sin(a * 6.5 + time * 0.8)) * (LEFT + (1 - LEFT) * sm(0, pc, a)) * (1 + RIGHT * sm(pc, 1, a)));
      waveA.push(16 * Math.sin(time * 1.0 - a * 8) * Math.sin(Math.PI * Math.min(1, a * 1.1)));   // falowanie osi
    }
    for (var i = 0; i < N; i++) {
      var v = i / (N - 1), u0 = 2 * v - 1;
      var u = u0;                                              // równy rozstaw linii
      var d = '';
      for (var k = 0; k < K; k++) {
        var a = AL[k], tau = tauA[k];
        // gładkie zafalowanie zależne od położenia na wstędze (rozstaw zostaje równy)
        var jit = WILD * 10 * Math.sin(a * 9 + u0 * 1.3 + time * 0.9) * Math.sin(a * 4.3 - u0 * 0.8 + time * 0.6) * Math.abs(tau);
        // 3D: przekrój wstęgi obraca się o kąt th; składowa „w głąb” (z) daje perspektywę i lekkie przesunięcie w pionie
        var z = u * sinA[k] * wdA[k];
        var ps = 1 / (1 - z / DIST);
        var o = (wdA[k] * tau * u + jit + waveA[k]) * ps;
        d += (k ? 'L' : 'M') + f(C[k][0] + NX[k] * o, C[k][1] + NY[k] * o + z * PITCH * ps);
      }
      paths[i].setAttribute('d', d);
      var base = 0.85 - 0.12 * v;
      for (var si = 0; si < KS.length; si++) {               // bliżej kamery = wyraźniej, dalej = bledziej
        var depth = u0 * sinA[KS[si]];
        var op = base * Math.max(0.4, Math.min(1.15, 1 + SHADE * depth));
        stops[i][si + 1].setAttribute('stop-opacity', op.toFixed(3));
      }
      stops[i][0].setAttribute('stop-opacity', stops[i][1].getAttribute('stop-opacity'));
      stops[i][KS.length + 1].setAttribute('stop-opacity', stops[i][KS.length].getAttribute('stop-opacity'));
    }
  }

  draw(0);
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var raf;
  function loop(ms) { draw(ms / 1000 * SPEED); raf = requestAnimationFrame(loop); }
  new IntersectionObserver(function (e) {
    if (e[0].isIntersecting) { raf = requestAnimationFrame(loop); }
    else { cancelAnimationFrame(raf); }
  }).observe(svg);
})();
