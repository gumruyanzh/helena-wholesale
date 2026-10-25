// Helena Wholesale Distributions Inc — site behaviour
(function () {
  'use strict';

  var doc = document.documentElement;
  doc.classList.add('js');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var PHONE = '406-439-9079';

  // ---------- Manifest reference + date ----------
  var MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  var now = new Date();
  var pad = function (n) { return String(n).padStart(2, '0'); };
  var stampDate = pad(now.getDate()) + ' ' + MONTHS[now.getMonth()] + ' ' + now.getFullYear();

  function makeRef() {
    var alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var bytes = new Uint8Array(4);
    (window.crypto || window.msCrypto).getRandomValues(bytes);
    var tail = Array.prototype.map.call(bytes, function (b) { return alphabet[b % alphabet.length]; }).join('');
    return 'HW-' + String(now.getFullYear()).slice(2) + pad(now.getMonth() + 1) + pad(now.getDate()) + '-' + tail;
  }
  var ref = makeRef();

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  var refEl = $('#mf-ref'), dateEl = $('#mf-date'), stampDateEl = $('#mf-stamp-date');
  if (refEl) refEl.textContent = ref;
  if (dateEl) dateEl.textContent = stampDate;
  if (stampDateEl) stampDateEl.textContent = stampDate;
  var stampRefEl = $('#mf-stamp-ref');
  if (stampRefEl) stampRefEl.textContent = ref;

  // ---------- Side (Supplier / Buyer) ----------
  var form = $('#manifest-form');
  var SIDE_COPY = {
    Supplier: { party: 'Shipper — your company', goods: 'What goods do you want placed?' },
    Buyer: { party: 'Consignee — your company', goods: 'What goods are you looking to source?' }
  };

  function applySide(value) {
    var copy = SIDE_COPY[value];
    if (!copy || !form) return;
    var party = $('[data-party-label]', form), goods = $('[data-goods-label]', form);
    if (party) party.textContent = copy.party;
    if (goods) goods.textContent = copy.goods;
    var err = $('#err-side');
    if (err) err.hidden = true;
  }

  function chooseSide(value) {
    if (!form) return;
    var radio = $('input[name="side"][value="' + value + '"]', form);
    if (radio && !form.classList.contains('is-filed')) { radio.checked = true; applySide(value); }
  }

  if (form) {
    $$('input[name="side"]', form).forEach(function (r) {
      r.addEventListener('change', function () { applySide(r.value); });
    });
  }

  $$('[data-side]').forEach(function (link) {
    link.addEventListener('click', function () {
      chooseSide(link.getAttribute('data-side') === 'buyer' ? 'Buyer' : 'Supplier');
    });
  });

  // ---------- Tabs ----------
  $$('[data-tabs]').forEach(function (root) {
    var tabs = $$('[role="tab"]', root);
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus();
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(tab); });
      tab.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
        else if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (e.key === 'Home') next = tabs[0];
        else if (e.key === 'End') next = tabs[tabs.length - 1];
        if (next) { e.preventDefault(); select(next, true); }
      });
    });
  });

  // ---------- Signature mirrors the contact name ----------
  var nameInput = $('#mf-name'), signature = $('#mf-signature');
  if (nameInput && signature) {
    nameInput.addEventListener('input', function () {
      signature.textContent = nameInput.value.trim() || ' ';
    });
  }

  // ---------- Validation + submission ----------
  var status = $('#mf-status');
  function setStatus(msg, kind) {
    if (!status) return;
    status.textContent = msg;
    status.classList.toggle('is-error', kind === 'error');
    status.classList.toggle('is-ok', kind === 'ok');
  }

  var FIELD_NAMES = { company: 'company', name: 'contact name', email: 'email', goods: 'description of goods' };
  var ERRORS = {
    company: 'Enter your company name.',
    name: 'Enter a contact name.',
    email: 'Enter a valid email address, like name@company.com.',
    goods: 'Describe the goods involved.'
  };
  if (form) {
    Object.keys(ERRORS).forEach(function (n) {
      var el = form.elements[n];
      if (!el) return;
      var p = document.createElement('p');
      p.className = 'field-error';
      p.id = 'err-' + n;
      p.hidden = true;
      el.insertAdjacentElement('afterend', p);
      el.setAttribute('aria-describedby', p.id);
    });
  }
  function showError(el, msg) {
    var p = document.getElementById('err-' + el.name);
    if (!p) return;
    p.textContent = msg || '';
    p.hidden = !msg;
  }

  function validate() {
    var firstBad = null, bad = [];
    var side = $('input[name="side"]:checked', form);
    var sideErr = $('#err-side');
    if (sideErr) sideErr.hidden = !!side;
    if (!side) firstBad = $('input[name="side"]', form);

    $$('input[required], textarea[required]', form).forEach(function (el) {
      if (el.name === 'side') return;
      var v = el.value.trim();
      var ok = v.length > 0 && (el.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
      el.setAttribute('aria-invalid', ok ? 'false' : 'true');
      showError(el, ok ? '' : ERRORS[el.name]);
      if (!ok) { bad.push(FIELD_NAMES[el.name] || el.name); if (!firstBad) firstBad = el; }
    });
    if (!side) bad.unshift('filing as');
    validate.missing = bad;
    if (firstBad) firstBad.focus();
    return !firstBad;
  }

  if (form) {
    $$('input, textarea', form).forEach(function (el) {
      el.addEventListener('input', function () {
        if (el.getAttribute('aria-invalid') === 'true') { el.setAttribute('aria-invalid', 'false'); showError(el, ''); }
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.classList.contains('is-filed')) return;
      if (!validate()) {
        setStatus('Please check: ' + validate.missing.join(', ') + '.', 'error');
        return;
      }

      var endpoint = form.getAttribute('data-endpoint');
      if (!endpoint) {
        setStatus('Online filing is being connected. Please call ' + PHONE + ' and quote reference ' + ref + '.', 'error');
        return;
      }

      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      if (data.botcheck) return; // honeypot tripped
      delete data.botcheck;

      var payload = {
        _subject: 'Manifest ' + ref + ' — ' + data.side + ' — ' + data.company,
        _replyto: data.email,
        _template: 'table',
        _captcha: 'false',
        reference: ref,
        filed: stampDate
      };
      Object.keys(data).forEach(function (k) { payload[k] = data[k]; });

      var btn = $('button[type="submit"]', form);
      btn.disabled = true;
      btn.textContent = 'Filing…';
      setStatus('', null);

      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (res) { return res.json().then(function (j) { return { ok: res.ok && String(j.success) === 'true', body: j }; }); })
        .then(function (r) {
          if (!r.ok) throw new Error((r.body && r.body.message) || 'Submission failed');
          form.classList.add('is-filed');
          $$('input, textarea, select', form).forEach(function (el) { el.disabled = true; });
          btn.textContent = 'Filed';
          setStatus('Manifest ' + ref + ' received. We will reply within one business day.', 'ok');
          status.focus();
        })
        .catch(function () {
          btn.disabled = false;
          btn.textContent = 'File Manifest';
          setStatus('We couldn’t file your Manifest just now. Please try again or call ' + PHONE + '.', 'error');
        });
    });
  }

  // ---------- Reveal on scroll ----------
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  // ---------- Hero contour drift ----------
  var contours = $('.hero__contours');
  if (contours && !reduceMotion) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = Math.min(window.scrollY, 900);
        contours.style.transform = 'translate3d(0,' + (y * 0.18) + 'px,0) scale(' + (1 + y / 9000) + ')';
        ticking = false;
      });
    }, { passive: true });
  }
})();
