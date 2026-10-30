/* Joshua Deosaran, the video store.
   Shelf, tapes, project pages, VCR player, page wipes. No dependencies. */
(function () {
  'use strict';
  var D = window.JD;
  var doc = document, root = doc.documentElement;
  root.classList.add('js');

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function $(s, c) { return (c || doc).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function bySlug(slug) { for (var i = 0; i < D.projects.length; i++) if (D.projects[i].slug === slug) return D.projects[i]; return null; }
  function idxOf(slug) { for (var i = 0; i < D.projects.length; i++) if (D.projects[i].slug === slug) return i; return -1; }
  function url(u) { return encodeURI(u); }

  var ICON = {
    play: '<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M5 3l12 7-12 7z"/></svg>',
    back: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M17 10H3M9 4l-6 6 6 6"/></svg>',
    arrow: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 10h14M11 4l6 6-6 6"/></svg>',
    out: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 4h9v9M16 4L4 16"/></svg>',
    rew: '<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 4v12L2 10zM18 4v12l-8-6z"/></svg>',
    ff: '<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 4v12l8-6zM2 4v12l8-6z"/></svg>',
    down: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M10 3v14M4 11l6 6 6-6"/></svg>'
  };

  /* ---------------------------------------------------------
     hand drawn outline (two wobbly loops, drawn on hover)
     --------------------------------------------------------- */
  function seeded(seed) {
    var s = seed * 9301 + 49297;
    return function () { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  }
  function loopPath(seed, inset, jit, n) {
    var r = seeded(seed), cx = 550, cy = 317, a = 535 - inset, b = 300 - inset * .55;
    var t0 = r() * Math.PI * 2, pts = [], k = 6, i, t, c, s, rr;
    var total = Math.PI * 2 * 1.06;
    for (i = 0; i <= n; i++) {
      t = t0 + (i / n) * total;
      c = Math.cos(t); s = Math.sin(t);
      rr = 1 + (r() - .5) * jit * .01 * 2;
      pts.push([
        cx + a * rr * (c < 0 ? -1 : 1) * Math.pow(Math.abs(c), 2 / k) + (r() - .5) * jit,
        cy + b * rr * (s < 0 ? -1 : 1) * Math.pow(Math.abs(s), 2 / k) + (r() - .5) * jit
      ]);
    }
    var d = 'M' + pts[0][0].toFixed(1) + ' ' + pts[0][1].toFixed(1);
    for (i = 0; i < pts.length - 1; i++) {
      var p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
      d += 'C' + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + ' ' + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(1) + ' ' +
        (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + ' ' + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(1) + ' ' +
        p2[0].toFixed(1) + ' ' + p2[1].toFixed(1);
    }
    return d;
  }
  function drawSVG(seed) {
    return '<svg class="tape-draw" viewBox="0 0 1100 634" preserveAspectRatio="none" aria-hidden="true" focusable="false">' +
      '<path pathLength="1" d="' + loopPath(seed * 7 + 3, 8, 16, 26) + '"/>' +
      '<path pathLength="1" d="' + loopPath(seed * 13 + 5, 26, 22, 24) + '"/></svg>';
  }

  /* ---------------------------------------------------------
     the tape component (3D cassette, see style.css)
     --------------------------------------------------------- */
  var SUN = { teal: '#244855', red: '#E64833', mustard: '#EFB11D', blue: '#4056A1', pink: '#FFA2B6', sage: '#90AEAD', brown: '#874F41', cream: '#C5CBE3' };
  var CLIP_COLORS = ['teal', 'red', 'mustard', 'blue', 'pink', 'sage', 'brown', 'cream'];
  function tapeHTML(o) {
    // o: {tag, cls, color, photo, pos, kicker, title, meta, no, seed, attrs, clip}
    var words = o.title.split(' '), lw = 1, i;
    for (i = 0; i < words.length; i++) lw = Math.max(lw, words[i].length);
    var fs = Math.min(6.4, 19 / (lw * .46)); if (o.title.length > 14) fs = Math.min(fs, 5.3);
    var front =
      '<span class="tf front">' +
      '<span class="strip"><span>insert this side into recorder</span><i></i><span>do not touch the tape inside</span><b>VHS</b></span>' +
      '<span class="win l"><i class="pack"></i><i class="hub"></i></span><span class="win r"><i class="pack"></i><i class="hub"></i></span>' +
      '<span class="tlabel"><span class="tl-photo" style="background-image:url(\'' + url(o.photo) + '\');--pos:' + (o.pos || '50% 50%') + '"></span>' +
      '<span class="tl-text"><span><span class="tl-kicker">' + esc(o.kicker || '') + '</span><br>' +
      '<span class="tl-title" style="--fs:' + fs.toFixed(2) + '">' + esc(o.title) + '</span></span>' +
      '<span class="tl-meta">' + esc(o.meta || '').replace(/(Apple|Prime|Smithsonian|Weather|Bell|Discovery) (TV\+|Video|Channel|Media|Canada)/g, '$1\u00A0$2') + '</span>' +
      '<span class="tl-no">' + esc(o.no) + '</span></span></span>' +
      '<i class="tgroove"></i><span class="tmark">HQ &nbsp; T-120 &nbsp; SP</span></span>';
    var tag = o.tag || 'a';
    return '<' + tag + ' class="tape c-' + o.color + (o.clip ? ' is-clip' : '') + (o.cls ? ' ' + o.cls : '') + '" ' + (o.attrs || '') + '>' +
      '<span class="tshadow"></span><span class="tbox">' + front + '<span class="tf back"></span><span class="tf top"></span><span class="tf bot"></span><span class="tf lft"></span><span class="tf rgt"></span></span>' +
      drawSVG(o.seed || 1) + '</' + tag + '>';
  }
  function projectTape(p, extra) {
    extra = extra || {};
    return tapeHTML({
      tag: extra.tag || 'a', cls: extra.cls, color: p.color, photo: p.photo.src, pos: p.photo.pos,
      kicker: p.kicker, title: p.label, meta: p.sub, no: pad(p.no), seed: p.no,
      attrs: extra.tag === 'div' ? 'aria-hidden="true"' : 'href="#/' + p.slug + '" data-slug="' + p.slug + '" data-cursor="OPEN" aria-label="Open ' + esc(p.shortTitle) + '"'
    });
  }
  function clipTape(c, i) {
    return tapeHTML({
      tag: 'button', clip: true, color: CLIP_COLORS[i % CLIP_COLORS.length], photo: c.poster.replace('web/', 'web/sm/'), pos: '50% 50%',
      title: c.title, no: 'PLAY', seed: i + 20,
      attrs: 'type="button" data-clip="' + c.id + '" data-cursor="PLAY" aria-label="Play ' + esc(c.title) + '"'
    });
  }
  function clipItem(c, i, hidden) {
    return '<li class="rv"' + (hidden ? ' hidden' : '') + '>' + clipTape(c, i) + '<p class="cap">' + esc(c.title) + '</p></li>';
  }

  /* ---------------------------------------------------------
     cursor, wipe, nav, reveals
     --------------------------------------------------------- */
  var cursorEl;
  function initCursor() {
    if (!fine || reduce) return;
    cursorEl = doc.createElement('div'); cursorEl.className = 'cursor'; cursorEl.innerHTML = '<span></span>';
    doc.body.appendChild(cursorEl); root.classList.add('has-cursor');
    var x = -100, y = -100, cx = -100, cy = -100, label = cursorEl.firstChild;
    window.addEventListener('mousemove', function (e) { x = e.clientX; y = e.clientY; }, { passive: true });
    doc.addEventListener('mouseover', function (e) {
      var t = e.target.closest ? e.target.closest('[data-cursor]') : null;
      if (t) { label.textContent = t.getAttribute('data-cursor'); cursorEl.classList.add('big'); }
      else cursorEl.classList.remove('big');
    });
    doc.addEventListener('mouseleave', function () { x = y = -100; });
    (function tick() {
      cx += (x - cx) * .22; cy += (y - cy) * .22;
      cursorEl.style.transform = 'translate3d(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px,0)';
      requestAnimationFrame(tick);
    })();
  }

  function initWipe() {
    try { if (sessionStorage.getItem('jdwipe')) { sessionStorage.removeItem('jdwipe'); setTimeout(function () { root.classList.remove('wipe-off'); }, 700); } } catch (e) { root.classList.remove('wipe-off'); }
    window.addEventListener('pageshow', function (e) { if (e.persisted) { root.classList.remove('wipe-on'); root.classList.remove('wipe-off'); } });
    doc.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;
      var h = a.getAttribute('href');
      if (!h || h.charAt(0) === '#' || /^(mailto:|tel:|https?:)/.test(h) || a.target === '_blank' || a.hasAttribute('download')) return;
      if (!/\.html?(#.*)?$/.test(h) && h !== './' && h !== '/') return;
      if (reduce) return;
      e.preventDefault();
      try { sessionStorage.setItem('jdwipe', '1'); } catch (err) {}
      root.classList.add('wipe-on');
      setTimeout(function () { location.href = a.href; }, 520);
    });
  }


  /* mailto: open the native mail app; if nothing takes over, copy the address and say so */
  function initMail() {
    var toast;
    function say(addr) {
      if (!toast) {
        toast = doc.createElement('div'); toast.className = 'toast'; toast.setAttribute('role', 'status');
        doc.body.appendChild(toast);
      }
      toast.innerHTML = '<b>No mail app opened.</b> <span></span> <a target="_blank" rel="noopener" href="https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(addr) + '&su=Hello%20Joshua">Open Gmail</a>';
      $('span', toast).textContent = addr + ' is copied.';
      toast.classList.add('on'); clearTimeout(toast._t); toast._t = setTimeout(function () { toast.classList.remove('on'); }, 7000);
    }
    doc.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="mailto:"]');
      if (!a || e.defaultPrevented) return;
      var addr = a.getAttribute('href').replace(/^mailto:/, '').split('?')[0], left = false;
      function gone() { left = true; }
      window.addEventListener('blur', gone, { once: true });
      doc.addEventListener('visibilitychange', gone, { once: true });
      setTimeout(function () {
        window.removeEventListener('blur', gone); doc.removeEventListener('visibilitychange', gone);
        if (left || doc.hidden) return;
        try { navigator.clipboard.writeText(addr); } catch (x) {}
        say(addr);
      }, 1400);
    });
  }

  function initNav() {
    var nav = $('.nav'); if (!nav) return;
    function s() { nav.classList.toggle('solid', window.scrollY > 24); }
    s(); window.addEventListener('scroll', s, { passive: true });
    var b = $('.burger');
    if (b) {
      b.addEventListener('click', function () {
        var o = root.classList.toggle('menu-open');
        b.setAttribute('aria-expanded', o ? 'true' : 'false');
        root.classList.toggle('lock', o);
      });
      $$('.mmenu a').forEach(function (a) { a.addEventListener('click', function () { root.classList.remove('menu-open'); root.classList.remove('lock'); }); });
    }
  }

  function initReveal(scope, rootEl) {
    var els = $$('.rv:not(.in)', scope);
    if (!('IntersectionObserver' in window) || reduce) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } });
    }, { root: rootEl || null, rootMargin: '0px 0px -8% 0px', threshold: .08 });
    els.forEach(function (e) { io.observe(e); });
  }

  function initCounters() {
    var els = $$('[data-count]'); if (!els.length) return;
    function run(el) {
      var n = +el.getAttribute('data-count'), t0 = null, dur = 1500;
      if (reduce) { el.textContent = n; return; }
      function f(t) { if (!t0) t0 = t; var k = clamp((t - t0) / dur, 0, 1); el.textContent = Math.round(n * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(f); }
      requestAnimationFrame(f);
    }
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.textContent = e.getAttribute('data-count'); }); return; }
    var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { run(x.target); io.unobserve(x.target); } }); }, { threshold: .4 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------------------------------------------------------
     HOME: the shelf
     --------------------------------------------------------- */
  function initShelf() {
    var track = $('#track'), row = $('#row'); if (!track || !row) return;
    var n = D.projects.length;
    var ys = [-3, 5, -5, 4, -4, 6, -3, 4], zs = [-4, 3, -2, 5, -5, 2, -3, 4];
    row.innerHTML = D.projects.map(function (p, i) {
      return '<div class="tape-slot" style="--i:' + i + ';--y:' + ys[i % 8] + 'vh;--rz:' + zs[i % 8] + 'deg"><div class="tape-in">' + projectTape(p) + '</div></div>';
    }).join('');
    var slots = $$('.tape-slot', row);
    var sun = $('#sun'), nowEl = $('.now'), nowT = $('#nowTitle'), nowM = $('#nowMeta'), ctrN = $('#ctrN'), prog = $('#prog'), osdT = $('#osdTime');
    $('#ctrTotal').textContent = pad(n);

    var cur = 0, target = 0, last = 0, active = -1, idleT, running = true, max = 0, drag = null, suppress = false;
    function measure() { max = Math.max(0, track.scrollWidth - track.clientWidth); }
    function posOf(i) { var s = slots[i]; return clamp(s.offsetLeft + s.offsetWidth / 2 - track.clientWidth / 2, 0, max); }
    function nearest() {
      var best = 0, bd = 1e9;
      for (var i = 0; i < n; i++) { var d = Math.abs(posOf(i) - cur); if (d < bd) { bd = d; best = i; } }
      return best;
    }
    function setActive(i) {
      if (i === active) return; active = i;
      var p = D.projects[i];
      if (sun) sun.style.setProperty('--sun', SUN[p.color]);
      nowEl.classList.add('swap');
      setTimeout(function () {
        nowT.textContent = p.shortTitle;
        nowM.textContent = p.role + '  ·  ' + p.network + '  ·  ' + p.year;
        ctrN.textContent = pad(i + 1);
        nowEl.classList.remove('swap');
      }, 140);
    }
    function frame() {
      if (!fine) cur = track.scrollLeft;
      else { cur += (target - cur) * .11; if (Math.abs(target - cur) < .4) cur = target; if (Math.abs(track.scrollLeft - cur) > .4) track.scrollLeft = cur; }
      var vel = clamp(cur - last, -60, 60); last = cur;
      var vw = track.clientWidth;
      for (var i = 0; i < n; i++) {
        var s = slots[i], c = s.offsetLeft + s.offsetWidth / 2 - cur, dn = (c - vw / 2) / (vw / 2);
        var ry = clamp(dn, -1.7, 1.7) * -20, sc = 1 - Math.min(Math.abs(dn), 1.5) * .12;
        if (!s._b) { s._b = parseFloat(s.style.getPropertyValue('--rz')) || 0; }
        s.style.setProperty('--ry', reduce ? '0deg' : ry.toFixed(2) + 'deg');
        s.style.setProperty('--s', sc.toFixed(3));
        s.style.setProperty('--rz', (s._b + clamp(vel * -.09, -7, 7)).toFixed(2) + 'deg');
      }
      var a = nearest(); setActive(a);
      if (prog) prog.style.transform = 'scaleX(' + (max ? (.06 + .94 * cur / max) : 1).toFixed(3) + ')';
      if (osdT) { var sec = Math.floor(cur / 9); osdT.textContent = '0:' + pad(Math.floor(sec / 60) % 60) + ':' + pad(sec % 60); }
      if (running) requestAnimationFrame(frame);
    }
    function go(i) {
      i = clamp(i, 0, n - 1);
      if (fine) target = posOf(i); else track.scrollTo({ left: posOf(i), behavior: 'smooth' });
    }
    function snapSoon(ms) { clearTimeout(idleT); idleT = setTimeout(function () { target = posOf(nearest()); }, ms == null ? 140 : ms); }

    measure(); window.addEventListener('resize', function () { measure(); if (fine) { target = cur = clamp(cur, 0, max); } });
    if (fine) {
      track.addEventListener('wheel', function (e) {
        if (e.ctrlKey) return;
        var dx = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        var r = track.getBoundingClientRect();
        var whole = r.top >= -4 && r.bottom <= window.innerHeight + 4;
        if (!whole) return;
        if ((dx < 0 && target <= 2) || (dx > 0 && target >= max - 2)) return;
        e.preventDefault();
        target = clamp(target + dx * 1.1, 0, max); snapSoon();
      }, { passive: false });
      track.addEventListener('pointerdown', function (e) {
        if (e.pointerType !== 'mouse' || e.button !== 0) return;
        drag = { x: e.clientX, t: target, moved: false };
      });
      window.addEventListener('pointermove', function (e) {
        if (!drag) return; var dx = e.clientX - drag.x;
        if (Math.abs(dx) > 6) { drag.moved = true; track.classList.add('dragging'); }
        if (drag.moved) target = clamp(drag.t - dx * 1.25, 0, max);
      });
      window.addEventListener('pointerup', function () {
        if (!drag) return;
        if (drag.moved) { suppress = true; setTimeout(function () { suppress = false; }, 0); snapSoon(60); }
        drag = null; track.classList.remove('dragging');
      });
      track.addEventListener('click', function (e) { if (suppress) { e.preventDefault(); e.stopPropagation(); } }, true);
      track.addEventListener('dragstart', function (e) { e.preventDefault(); });
    } else {
      track.addEventListener('scroll', function () { cur = track.scrollLeft; }, { passive: true });
    }
    $('#rew').addEventListener('click', function () { go(nearest() - 1); });
    $('#ff').addEventListener('click', function () { go(nearest() + 1); });
    doc.addEventListener('keydown', function (e) {
      if (projOpen || vcrOpen) return;
      if (e.key === 'ArrowRight') { go(nearest() + 1); }
      else if (e.key === 'ArrowLeft') { go(nearest() - 1); }
    });
    var io = new IntersectionObserver(function (en) {
      var vis = en[0].isIntersecting;
      if (vis && !running) { running = true; requestAnimationFrame(frame); } else if (!vis) running = false;
    }, { threshold: 0 });
    io.observe(track);
    var ring = $('#ring'); if (ring) ring.addEventListener('click', function () { var nx = $('#after'); if (nx) nx.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); });
    setTimeout(function () { measure(); }, 400);
    setActive(0); nowT.textContent = D.projects[0].shortTitle; nowM.textContent = D.projects[0].role + '  ·  ' + D.projects[0].network + '  ·  ' + D.projects[0].year;
    requestAnimationFrame(frame);
  }

  /* ---------------------------------------------------------
     LIBRARY page
     --------------------------------------------------------- */
  function initLibrary() {
    var g = $('#libSeries'); if (!g) return;
    g.innerHTML = D.projects.map(function (p) {
      return '<li class="rv">' + projectTape(p) + '<div class="lib-cap"><b>' + esc(p.shortTitle) + '</b><span>' + esc(p.role) + '<br>' + esc(p.dates) + '</span></div></li>';
    }).join('');
    function fill(sel, group, start, shown) {
      var ul = $(sel), list = D.clips.filter(function (c) { return c.group === group; });
      ul.innerHTML = list.map(function (c, i) { return clipItem(c, start + i, i >= shown); }).join('');
      var btn = $('[data-more="' + sel + '"]');
      if (list.length <= shown) { if (btn) btn.parentNode.hidden = true; return; }
      btn.textContent = 'Load more tapes (' + (list.length - shown) + ')';
      btn.addEventListener('click', function () {
        $$('li[hidden]', ul).forEach(function (li, k) { li.hidden = false; setTimeout(function () { li.classList.add('in'); }, 60 + k * 70); });
        btn.parentNode.hidden = true;
      });
    }
    fill('#clipsDP', 'dp', 0, 4);
    fill('#clipsT10', 'top10', 2, 3);
  }

  /* ---------------------------------------------------------
     ABOUT page accordion
     --------------------------------------------------------- */
  function initCredits() {
    var host = $('#acc'); if (!host) return;
    var other = false, html = '<div class="acc">';
    D.credits.forEach(function (c, i) {
      var p = c.slug ? bySlug(c.slug) : null;
      var title = p ? p.shortTitle : c.title, role = p ? p.role : c.title, org = p ? p.network : c.org, dates = p ? p.dates : c.dates;
      var body = p ? p.body : c.body;
      var photo = p ? (p.photos && p.photos[0]) : c.photo;
      var heading = p ? title : (c.org + ', ' + c.title);
      if (c.other && !other) { other = true; html += '</div><div class="sub-h"><span>Other experience</span><i class="rule" style="flex:1"></i></div><div class="acc">'; }
      html += '<div class="acc-item rv' + (i === 0 ? ' open' : '') + '"><button class="acc-h" aria-expanded="' + (i === 0) + '" aria-controls="acc' + i + '">' +
        '<span class="dt">' + esc(dates) + '</span><span class="ti">' + esc(heading) + '</span>' +
        '<span class="ro">' + esc(role) + '<small>' + esc(org) + '</small></span><span class="pm" aria-hidden="true"></span></button>' +
        '<div class="acc-p" id="acc' + i + '"><div><div class="acc-in"><div class="copy">' +
        body.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') +
        (p ? '<a class="pill" href="#/' + p.slug + '" data-slug="' + p.slug + '">' + ICON.play + ' Open the tape</a>' : '') +
        '</div>' + (photo ? '<div class="ph"><div class="photo"><img src="' + photo.src + '" alt="' + esc(photo.alt || '') + '" loading="lazy" style="object-position:' + (photo.pos || '50% 50%') + '"></div></div>' : '') +
        '</div></div></div></div>';
    });
    host.innerHTML = html + '</div>';
    host.addEventListener('click', function (e) {
      var h = e.target.closest('.acc-h'); if (!h) return;
      var it = h.parentNode, o = it.classList.toggle('open');
      h.setAttribute('aria-expanded', o ? 'true' : 'false');
    });
  }

  /* ---------------------------------------------------------
     THE PLAYER (inline on project pages and inside the VCR modal)
     custom controls: scrub, skip 10s, volume, fullscreen, keys
     --------------------------------------------------------- */
  var PI = {
    play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 4.5h4v15H6zM14 4.5h4v15h-4z"/></svg>',
    again: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12a8 8 0 1 0 3-6.2M4 4v5h5"/></svg>',
    rew: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12a8 8 0 1 1 2.6 5.9M4 6v6h6"/></svg>',
    ff: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 12a8 8 0 1 0-2.6 5.9M20 6v6h-6"/></svg>',
    vol: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 9.5v5h4l5 4v-13l-5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    mute: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 9.5v5h4l5 4v-13l-5 4z"/><path d="M16 9l5 6M21 9l-5 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    fs: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
    fsx: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/></svg>'
  };
  function fmt(t) {
    if (!isFinite(t) || t < 0) t = 0;
    var h = Math.floor(t / 3600), m = Math.floor(t % 3600 / 60), s = Math.floor(t % 60);
    return (h ? h + ':' + pad(m) : m) + ':' + pad(s);
  }
  var activePlayer = null;

  function makePlayer(opts) {
    opts = opts || {};
    var el = doc.createElement('figure');
    el.className = 'player' + (opts.modal ? ' is-modal' : '') + ' idle';
    el.tabIndex = 0;
    el.setAttribute('aria-label', 'Video player');
    el.innerHTML =
      '<div class="pl-screen">' +
      '<video playsinline preload="metadata"></video>' +
      '<canvas class="pl-noise" width="192" height="108"></canvas>' +
      '<div class="pl-scan"></div><div class="pl-osd"></div>' +
      '<button class="pl-big" type="button" aria-label="Play trailer">' + PI.play + '<span>PLAY</span></button>' +
      '<div class="pl-soon"><b>BLANK TAPE</b><span>Trailer coming soon</span></div>' +
      '<div class="pl-err"><b>NO SIGNAL</b><span>This tape would not load. Try refreshing or another browser.</span></div>' +
      '<div class="pl-ctl">' +
      '<div class="pl-bar" role="slider" tabindex="0" aria-label="Seek" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" aria-valuetext="0:00"><i class="buf"></i><i class="fill"></i><i class="knob"></i><span class="tip">0:00</span></div>' +
      '<div class="pl-row">' +
      '<button class="pl-b b-play" type="button" aria-label="Play">' + PI.play + '</button>' +
      '<button class="pl-b b-rew" type="button" aria-label="Back 10 seconds">' + PI.rew + '<em>10</em></button>' +
      '<button class="pl-b b-ff" type="button" aria-label="Forward 10 seconds">' + PI.ff + '<em>10</em></button>' +
      '<span class="pl-time"><b>0:00</b><u> / 0:00</u></span><span class="sp"></span>' +
      '<button class="pl-b b-mute" type="button" aria-label="Mute">' + PI.vol + '</button>' +
      '<input class="pl-vol" type="range" min="0" max="1" step="0.05" value="1" aria-label="Volume">' +
      '<button class="pl-b b-fs" type="button" aria-label="Fullscreen">' + PI.fs + '</button>' +
      '</div></div></div>' +
      '<figcaption class="pl-cap"><i class="led"></i><span class="t"></span><span class="ctr">CTR 0:00:00</span></figcaption>';

    var v = $('video', el), screen = $('.pl-screen', el), bar = $('.pl-bar', el), fill = $('.fill', bar), buf = $('.buf', bar), knob = $('.knob', bar), tip = $('.tip', bar);
    var tcur = $('.pl-time b', el), tdur = $('.pl-time u', el), osd = $('.pl-osd', el), vol = $('.pl-vol', el), ctr = $('.ctr', el), capT = $('.pl-cap .t', el), cv = $('.pl-noise', el);
    var bPlay = $('.b-play', el), bMute = $('.b-mute', el), bFs = $('.b-fs', el);
    var hasSrc = false, hideT, osdT, noiseT, noiseStop, raf, dragging = false, started = false;

    function setPlayIcon() { bPlay.innerHTML = (v.paused || v.ended) ? (v.ended ? PI.again : PI.play) : PI.pause; bPlay.setAttribute('aria-label', v.paused ? 'Play' : 'Pause'); }
    function show(t, stay) { osd.textContent = t; osd.classList.add('on'); clearTimeout(osdT); if (!stay) osdT = setTimeout(function () { osd.classList.remove('on'); }, 1800); }
    function ui() {
      var d = v.duration || 0, t = v.currentTime || 0, p = d ? clamp(t / d, 0, 1) : 0;
      fill.style.transform = 'scaleX(' + p.toFixed(4) + ')'; knob.style.left = (p * 100).toFixed(2) + '%';
      tcur.textContent = fmt(t);
      bar.setAttribute('aria-valuenow', Math.round(p * 100)); bar.setAttribute('aria-valuetext', fmt(t) + ' of ' + fmt(d));
      var s = Math.floor(t); ctr.textContent = 'CTR ' + Math.floor(s / 3600) + ':' + pad(Math.floor(s / 60) % 60) + ':' + pad(s % 60);
    }
    function loop() { ui(); if (!v.paused || dragging) raf = requestAnimationFrame(loop); }
    function buffered() { var d = v.duration || 0; if (!d || !v.buffered.length) return; buf.style.transform = 'scaleX(' + clamp(v.buffered.end(v.buffered.length - 1) / d, 0, 1).toFixed(4) + ')'; }
    function noise(on) {
      clearInterval(noiseT);
      if (!on) return;
      var g = cv.getContext('2d'), img = g.createImageData(cv.width, cv.height), d = img.data;
      noiseT = setInterval(function () { for (var i = 0; i < d.length; i += 4) { var x = Math.random() * 255 | 0; d[i] = d[i + 1] = d[i + 2] = x; d[i + 3] = 255; } g.putImageData(img, 0, 0); }, 80);
    }
    function tune() {
      if (reduce) return;
      el.classList.add('is-tuning'); noise(true);
      clearTimeout(noiseStop); noiseStop = setTimeout(function () { el.classList.remove('is-tuning'); if (!el.classList.contains('is-soon')) noise(false); }, 520);
    }
    function wake() {
      el.classList.remove('idle'); clearTimeout(hideT);
      if (!v.paused) hideT = setTimeout(function () { if (!dragging) el.classList.add('idle'); }, 2600);
    }
    function play() {
      if (!hasSrc) return;
      if (activePlayer && activePlayer !== api) activePlayer.pause();
      activePlayer = api;
      if (!started) tune();
      var pr = v.play(); if (pr && pr.catch) pr.catch(function () {});
    }
    function pause() { try { v.pause(); } catch (e) {} }
    function toggle() { if (!hasSrc) return; if (v.paused || v.ended) { if (v.ended) v.currentTime = 0; play(); } else pause(); }
    function seekBy(s) { if (!hasSrc) return; var d = v.duration || 0; v.currentTime = clamp(v.currentTime + s, 0, d || 1e9); show(s < 0 ? '◀◀ REW' : '▶▶ FF'); ui(); wake(); }
    function seekTo(p) { var d = v.duration || 0; if (d) { v.currentTime = clamp(p, 0, 1) * d; ui(); } }
    function fullscreen() {
      var d = doc;
      if (d.fullscreenElement || d.webkitFullscreenElement) { (d.exitFullscreen || d.webkitExitFullscreen).call(d); return; }
      if (el.requestFullscreen) el.requestFullscreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      else if (v.webkitEnterFullscreen) v.webkitEnterFullscreen();
    }

    v.addEventListener('loadedmetadata', function () { tdur.textContent = ' / ' + fmt(v.duration); ui(); buffered(); });
    v.addEventListener('durationchange', function () { tdur.textContent = ' / ' + fmt(v.duration); });
    v.addEventListener('progress', buffered);
    v.addEventListener('timeupdate', function () { if (v.paused) ui(); buffered(); });
    v.addEventListener('play', function () { started = true; el.classList.add('is-started', 'is-playing'); el.classList.remove('is-ended'); setPlayIcon(); show('▶ PLAY'); cancelAnimationFrame(raf); loop(); wake(); });
    v.addEventListener('pause', function () { el.classList.remove('is-playing'); setPlayIcon(); if (!v.ended && !dragging) show('❚❚ PAUSE', true); wake(); ui(); });
    v.addEventListener('ended', function () { el.classList.add('is-ended'); el.classList.remove('is-playing'); setPlayIcon(); show('■ STOP', true); el.classList.remove('idle'); });
    v.addEventListener('waiting', function () { el.classList.add('is-loading'); });
    v.addEventListener('playing', function () { el.classList.remove('is-loading'); });
    v.addEventListener('canplay', function () { el.classList.remove('is-loading'); });
    v.addEventListener('error', function () { if (hasSrc && v.getAttribute('src')) { el.classList.add('is-error'); noise(false); } });
    v.addEventListener('volumechange', function () { bMute.innerHTML = (v.muted || v.volume === 0) ? PI.mute : PI.vol; vol.value = v.muted ? 0 : v.volume; });

    /* scrubbing: pointer capture on the bar */
    function fromEvent(e) { var r = bar.getBoundingClientRect(); return clamp((e.clientX - r.left) / r.width, 0, 1); }
    function moveTip(e) {
      var p = fromEvent(e), r = bar.getBoundingClientRect();
      tip.style.left = clamp(p * r.width, 28, r.width - 28) + 'px'; tip.textContent = fmt(p * (v.duration || 0));
    }
    bar.addEventListener('pointermove', function (e) { moveTip(e); if (dragging) { seekTo(fromEvent(e)); } });
    bar.addEventListener('pointerdown', function (e) {
      if (!hasSrc) return; dragging = true; el.classList.add('scrubbing'); show('▶▶ SEARCH', true);
      try { bar.setPointerCapture(e.pointerId); } catch (x) {}
      seekTo(fromEvent(e)); moveTip(e); cancelAnimationFrame(raf); loop();
    });
    function endDrag() { if (!dragging) return; dragging = false; el.classList.remove('scrubbing'); if (v.paused) show('❚❚ PAUSE', true); else show('▶ PLAY'); wake(); }
    bar.addEventListener('pointerup', endDrag); bar.addEventListener('pointercancel', endDrag);
    bar.addEventListener('keydown', function (e) {
      var d = v.duration || 0, k = e.key;
      if (k === 'ArrowLeft' || k === 'ArrowDown') { seekBy(-5); }
      else if (k === 'ArrowRight' || k === 'ArrowUp') { seekBy(5); }
      else if (k === 'Home') { seekTo(0); } else if (k === 'End') { seekTo(.999); }
      else return;
      e.preventDefault(); e.stopPropagation();
    });

    /* buttons and screen */
    $('.pl-big', el).addEventListener('click', function (e) { e.stopPropagation(); toggle(); });
    bPlay.addEventListener('click', toggle);
    $('.b-rew', el).addEventListener('click', function () { seekBy(-10); });
    $('.b-ff', el).addEventListener('click', function () { seekBy(10); });
    bMute.addEventListener('click', function () { v.muted = !v.muted; });
    vol.addEventListener('input', function () { v.muted = false; v.volume = +vol.value; });
    bFs.addEventListener('click', fullscreen);
    screen.addEventListener('click', function (e) { if (e.target.closest('.pl-ctl,.pl-big')) return; toggle(); });
    screen.addEventListener('dblclick', function (e) { if (e.target.closest('.pl-ctl')) return; fullscreen(); });
    el.addEventListener('pointermove', wake); el.addEventListener('pointerdown', wake); el.addEventListener('focusin', wake);
    el.addEventListener('keydown', function (e) {
      if (e.target.closest('input') || e.metaKey || e.ctrlKey || e.altKey) return;
      var k = e.key, onBtn = !!e.target.closest('button');
      if ((k === ' ' || k === 'Enter') && onBtn) return;
      if (k === ' ' || k === 'k' || k === 'K') toggle();
      else if (k === 'ArrowLeft') seekBy(-5); else if (k === 'ArrowRight') seekBy(5);
      else if (k === 'j' || k === 'J') seekBy(-10); else if (k === 'l' || k === 'L') seekBy(10);
      else if (k === 'ArrowUp') { v.muted = false; v.volume = clamp(v.volume + .1, 0, 1); }
      else if (k === 'ArrowDown') { v.volume = clamp(v.volume - .1, 0, 1); }
      else if (k === 'm' || k === 'M') v.muted = !v.muted;
      else if (k === 'f' || k === 'F') fullscreen();
      else return;
      e.preventDefault();
    });
    function fsChange() { var on = doc.fullscreenElement === el || doc.webkitFullscreenElement === el; el.classList.toggle('is-fs', on); bFs.innerHTML = on ? PI.fsx : PI.fs; bFs.setAttribute('aria-label', on ? 'Exit fullscreen' : 'Fullscreen'); }
    doc.addEventListener('fullscreenchange', fsChange); doc.addEventListener('webkitfullscreenchange', fsChange);

    function load(o) {
      pause(); started = false; dragging = false; clearTimeout(noiseStop);
      el.classList.remove('is-started', 'is-playing', 'is-ended', 'is-error', 'is-loading', 'is-tuning', 'scrubbing');
      el.classList.add('idle'); osd.classList.remove('on');
      hasSrc = !!o.src; el.classList.toggle('is-soon', !hasSrc);
      capT.textContent = o.title || '';
      v.removeAttribute('src'); v.removeAttribute('poster'); try { v.load(); } catch (e) {}
      if (o.poster) v.setAttribute('poster', url(o.poster));
      fill.style.transform = 'scaleX(0)'; buf.style.transform = 'scaleX(0)'; knob.style.left = '0%'; tcur.textContent = '0:00'; tdur.textContent = ' / 0:00'; ctr.textContent = 'CTR 0:00:00';
      setPlayIcon();
      if (hasSrc) { noise(false); v.src = url(o.src); v.load(); if (o.autoplay) { play(); } }
      else noise(!reduce);
    }
    function destroy() {
      pause(); cancelAnimationFrame(raf); clearInterval(noiseT); clearTimeout(hideT); clearTimeout(noiseStop); clearTimeout(osdT);
      v.removeAttribute('src'); try { v.load(); } catch (e) {}
      doc.removeEventListener('fullscreenchange', fsChange); doc.removeEventListener('webkitfullscreenchange', fsChange);
      if (activePlayer === api) activePlayer = null;
      if (el.parentNode) el.parentNode.removeChild(el);
    }
    var api = { el: el, load: load, play: play, pause: pause, destroy: destroy, video: v };
    return api;
  }

  /* ---------------------------------------------------------
     VCR modal (library clips on any page)
     --------------------------------------------------------- */
  var vcr, vcrPlayer, vcrOpen = false, lastFocusVCR;
  function buildVCR() {
    vcr = doc.createElement('div'); vcr.className = 'vcr'; vcr.setAttribute('role', 'dialog'); vcr.setAttribute('aria-modal', 'true'); vcr.setAttribute('aria-label', 'Video player');
    vcr.innerHTML = '<div class="vcr-bar"><span class="ttl" id="vcrTitle"></span><button class="vcr-x" type="button">Eject <kbd style="font:inherit;opacity:.7">ESC</kbd></button></div><div class="vcr-stage"></div>';
    doc.body.appendChild(vcr);
    vcrPlayer = makePlayer({ modal: true }); $('.vcr-stage', vcr).appendChild(vcrPlayer.el);
    $('.vcr-x', vcr).addEventListener('click', closeVCR);
    vcr.addEventListener('click', function (e) { if (e.target === vcr || e.target.classList.contains('vcr-stage')) closeVCR(); });
  }
  function openVCR(title, src, poster) {
    if (!vcr) buildVCR();
    $('#vcrTitle').textContent = title;
    vcrOpen = true; lastFocusVCR = doc.activeElement;
    vcr.classList.add('open');
    vcrPlayer.load({ src: src, poster: poster, title: title, autoplay: true });
    setTimeout(function () { try { vcrPlayer.el.focus({ preventScroll: true }); } catch (e) {} }, 120);
  }
  function closeVCR() {
    if (!vcrOpen) return; vcrOpen = false;
    vcr.classList.remove('open'); vcrPlayer.pause();
    setTimeout(function () { if (!vcrOpen) vcrPlayer.load({ src: null }); }, 400);
    if (lastFocusVCR && lastFocusVCR.focus) lastFocusVCR.focus();
  }

  /* ---------------------------------------------------------
     PROJECT page
     --------------------------------------------------------- */
  var proj, projOpen = false, projSlug = null, projRAF, openedByClick = false, lastFocus, projPlayer = null;
  function buildProj() {
    proj = doc.createElement('div'); proj.className = 'proj'; proj.id = 'proj';
    proj.setAttribute('role', 'dialog'); proj.setAttribute('aria-modal', 'true'); proj.setAttribute('aria-label', 'Tape details'); proj.setAttribute('aria-hidden', 'true');
    proj.setAttribute('inert', '');
    doc.body.appendChild(proj);
    proj.addEventListener('click', function (e) {
      var t = e.target;
      if (t.closest('[data-close]')) { e.preventDefault(); closeProject(true); return; }
      var cl = t.closest('[data-clip]');
      if (cl) {
        var c = clipById(cl.getAttribute('data-clip')), p = bySlug(projSlug);
        if (c && projPlayer && p && p.reel) {
          projPlayer.load({ src: c.src, poster: c.poster, title: 'Daily Planet reel: ' + c.title, autoplay: true });
          var st = $('[data-stage]', proj); if (st) proj.scrollTo({ top: Math.max(0, st.offsetTop - 90), behavior: reduce ? 'auto' : 'smooth' });
        } else if (c) openVCR(c.title, c.src, c.poster);
        return;
      }
      var mo = t.closest('[data-reelmore]');
      if (mo) { $$('li[hidden]', proj).forEach(function (li, k) { li.hidden = false; setTimeout(function () { li.classList.add('in'); }, 60 + k * 60); }); mo.parentNode.hidden = true; return; }
      var s = t.closest('a[data-slug]');
      if (s) { e.preventDefault(); swapProject(s.getAttribute('data-slug')); }
    });
  }
  function clipById(id) { for (var i = 0; i < D.clips.length; i++) if (D.clips[i].id === id) return D.clips[i]; return null; }

  function renderProj(p) {
    var i = idxOf(p.slug), nx = D.projects[(i + 1) % D.projects.length];
    var lines = p.title.map(function (t, k) { return '<span class="ln" style="--k:' + k + '"><span>' + esc(t) + '</span></span>'; }).join('');
    var rows = [['Year', p.year], ['Role', p.role], ['Network', p.network], ['Dates', p.dates], ['Format', p.format], ['Location', p.location]]
      .map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>' + esc(r[1]) + '</dd></div>'; }).join('');
    var acts = p.links.map(function (l) { return '<a class="act" href="' + l.href + '" target="_blank" rel="noopener">' + esc(l.label) + ' ' + ICON.out + '</a>'; }).join('');
    var figs, single = false;
    if (p.photos.length) {
      figs = p.photos.map(function (ph, k) {
        return '<div class="photo rv' + (p.photos.length === 1 ? ' wide' : '') + '" style="--d:' + (k * .08) + 's"><img src="' + ph.src + '" alt="' + esc(ph.alt) + '" loading="lazy" decoding="async" style="object-position:' + (ph.pos || '50% 50%') + '"><span class="fig">FIG. ' + pad(k + 1) + '</span></div>';
      }).join('');
    } else if (p.poster) {
      figs = '<div class="photo wide rv"><img src="' + p.poster + '" alt="' + esc(p.shortTitle) + ' title card" loading="lazy" decoding="async"><span class="fig">FIG. 01</span></div>';
    } else { figs = ''; single = true; }
    var reel = '';
    if (p.reel) {
      reel = '<section class="reel-sec"><h2 class="rv">On the reel</h2><ul class="clip-grid">' +
        D.clips.map(function (c, k) { return clipItem(c, k, k >= 4); }).join('') +
        '</ul><div class="more"><button class="pill" type="button" data-reelmore>Load more tapes (' + (D.clips.length - 4) + ')</button></div></section>';
    }
    return '<div class="proj-top"><button class="back" type="button" data-close>' + ICON.back + ' Back to the shelf</button><span class="mid">TAPE ' + pad(p.no) + '</span><span class="esc">ESC TO EJECT</span></div>' +
      '<header class="proj-hero"><div class="proj-rule"></div>' +
      '<h2 class="proj-title l' + p.title.length + '">' + lines + '</h2><div class="proj-rule"></div>' +
      '<p class="proj-by">' + esc(p.role) + ' <b>·</b> Joshua Deosaran</p>' +
      '<div class="stage" data-stage></div>' +
      (acts ? '<div class="acts">' + acts + '</div>' : '') +
      '<dl class="meta">' + rows + '</dl></header>' +
      '<div class="rise" data-rise><div class="rise-tape">' + projectTape(p, { tag: 'div' }) + '</div></div>' +
      '<section class="band" data-band><div class="band-in"><div class="band-img" style="background-image:url(\'' + url(p.band.src) + '\')"></div>' +
      '<i class="band-hair"></i><i class="band-hair"></i>' +
      p.tagline.map(function (t, k) { return '<div class="band-line l' + (k + 1) + '">' + esc(t) + '</div>'; }).join('') +
      '<span class="band-cap">REC ● ' + esc(p.shortTitle.toUpperCase()) + '</span></div></section>' +
      '<section class="pbody' + (single ? ' single' : '') + '"><div class="txt rv"><span class="eyebrow">Side A, the story</span>' +
      p.body.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') + '</div><div class="figs">' + figs + '</div></section>' +
      reel +
      '<section class="next"><span class="eyebrow">Next tape · ' + pad(nx.no) + '</span><h2>' + esc(nx.shortTitle) + '</h2><div class="tape-wrap">' + projectTape(nx) + '</div></section>';
  }
  function mountStage(p) {
    if (projPlayer) { projPlayer.destroy(); projPlayer = null; }
    var st = $('[data-stage]', proj); if (!st) return;
    projPlayer = makePlayer({});
    st.appendChild(projPlayer.el);
    var src = p.video, poster = p.poster || p.band.src, title = p.shortTitle + ', trailer';
    if (!src && p.reel && D.clips.length) { var c = D.clips[0]; src = c.src; poster = c.poster; title = 'Daily Planet reel: ' + c.title; }
    projPlayer.load({ src: src, poster: poster, title: title });
  }

  function setBackgroundInert(on) {
    ['.nav', 'main', '.foot', '.mmenu'].forEach(function (s) {
      $$(s).forEach(function (el) { if (on) el.setAttribute('inert', ''); else el.removeAttribute('inert'); });
    });
  }

  function openProject(slug, fromEl, push) {
    var p = bySlug(slug); if (!p) return;
    if (!proj) buildProj();
    lastFocus = doc.activeElement;
    projSlug = slug;
    proj.innerHTML = renderProj(p); mountStage(p);
    var ox = '50%', oy = '60%';
    if (fromEl && fromEl.getBoundingClientRect) { var r = fromEl.getBoundingClientRect(); ox = (r.left + r.width / 2) + 'px'; oy = (r.top + r.height / 2) + 'px'; }
    proj.style.setProperty('--ox', ox); proj.style.setProperty('--oy', oy);
    proj.scrollTop = 0;
    proj.removeAttribute('inert'); proj.setAttribute('aria-hidden', 'false');
    setBackgroundInert(true);
    root.classList.add('lock');
    if (push !== false) { try { history.pushState({ jd: 1 }, '', '#/' + slug); openedByClick = true; } catch (e) {} }
    projOpen = true;
    requestAnimationFrame(function () { requestAnimationFrame(function () { proj.classList.add('open'); }); });
    initReveal(proj, proj);
    startProjLoop();
    proj.setAttribute('tabindex', '-1'); setTimeout(function () { try { proj.focus({ preventScroll: true }); } catch (e) {} }, 60);
    document.title = p.shortTitle + ', Joshua Deosaran';
  }
  function swapProject(slug) {
    var p = bySlug(slug); if (!p) return;
    projSlug = slug; proj.innerHTML = renderProj(p); mountStage(p); proj.scrollTop = 0;
    try { history.replaceState({ jd: 1 }, '', '#/' + slug); } catch (e) {}
    initReveal(proj, proj); document.title = p.shortTitle + ', Joshua Deosaran';
  }
  function closeProject(user) {
    if (!projOpen) return;
    if (user && openedByClick && history.state && history.state.jd) { history.back(); return; }
    if (user) { try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {} }
    projOpen = false; openedByClick = false;
    proj.classList.remove('open');
    root.classList.remove('lock');
    setBackgroundInert(false);
    cancelAnimationFrame(projRAF);
    if (projPlayer) projPlayer.pause();
    setTimeout(function () { if (!projOpen) { if (projPlayer) { projPlayer.destroy(); projPlayer = null; } proj.setAttribute('inert', ''); proj.setAttribute('aria-hidden', 'true'); proj.innerHTML = ''; } }, 950);
    if (lastFocus && lastFocus.focus) { try { lastFocus.focus({ preventScroll: true }); } catch (e) {} }
    document.title = D.pageTitle || document.title.split(',')[0];
  }
  function startProjLoop() {
    cancelAnimationFrame(projRAF);
    function f() {
      if (!projOpen) return;
      var vh = window.innerHeight;
      var rise = $('[data-rise]', proj), band = $('[data-band]', proj);
      if (rise) {
        var r = rise.getBoundingClientRect(), k = clamp((vh - r.top) / (vh * .85), 0, 1), e = 1 - Math.pow(1 - k, 3);
        var t = $('.rise-tape', rise);
        t.style.setProperty('--ty', ((1 - e) * 58).toFixed(1) + '%');
        t.style.setProperty('--rr', ((1 - e) * 9 - e * 2).toFixed(2) + 'deg');
      }
      if (band) {
        var b = band.getBoundingClientRect(), p = clamp((vh - b.top) / (vh + b.height), 0, 1);
        $$('.band-line', band).forEach(function (l, i) { l.style.setProperty('--a', clamp((p - .3 - i * .1) / .12, 0, 1).toFixed(3)); });
        $('.band-img', band).style.setProperty('--py', ((p - .5) * -50).toFixed(1) + 'px');
      }
      projRAF = requestAnimationFrame(f);
    }
    projRAF = requestAnimationFrame(f);
  }

  /* routing: #/slug opens a tape, empty hash closes it */
  function route() {
    var m = /^#\/([\w-]+)/.exec(location.hash);
    if (m && bySlug(m[1])) {
      if (!projOpen) openProject(m[1], null, false);
      else if (projSlug !== m[1]) swapProject(m[1]);
    } else if (projOpen) closeProject(false);
  }

  function initProjects() {
    if (!D || !D.projects) return;
    doc.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[data-slug]');
      if (a && !(proj && proj.contains(a))) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
        e.preventDefault();
        openProject(a.getAttribute('data-slug'), a.classList.contains('tape') ? a : null, true);
        return;
      }
      var c = e.target.closest && e.target.closest('[data-clip]');
      if (c && !(proj && proj.contains(c))) { var cl = clipById(c.getAttribute('data-clip')); if (cl) openVCR(cl.title, cl.src, cl.poster); }
    });
    doc.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (vcrOpen) closeVCR(); else if (projOpen) closeProject(true); else if (root.classList.contains('menu-open')) { root.classList.remove('menu-open'); root.classList.remove('lock'); }
    });
    window.addEventListener('popstate', route);
    window.addEventListener('hashchange', route);
    route();
  }

  /* ---------------------------------------------------------
     go
     --------------------------------------------------------- */
  function ready(fn) { if (doc.readyState !== 'loading') fn(); else doc.addEventListener('DOMContentLoaded', fn); }
  ready(function () {
    D.pageTitle = doc.title;
    initWipe(); initCursor(); initNav(); initMail();
    initShelf(); initLibrary(); initCredits();
    initReveal(doc); initCounters();
    initProjects();
  });
})();
