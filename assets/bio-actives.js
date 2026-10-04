/* SF BioActives — in-page navigation.
   Replaces the browser's built-in smooth scrolling, which is duration-by-
   distance and crawls across this page (jumps run to ~3,500px). This keeps
   every jump the same short length.

   Note: nothing here animates a product row. A transform (or `translate`)
   on .ba-product would make it the containing block for its descendants and
   break `position: sticky` on .ba-product-media, so product rows are left
   alone deliberately. */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var GLIDE_MS = 460;

  /* Destination comes from the browser's own scrollIntoView so that
     scroll-margin-top is honoured. Reading getBoundingClientRect() on a
     sticky element would give its pinned position, not its layout position. */
  function destinationFor(target) {
    var here = window.pageYOffset;
    target.scrollIntoView({ block: 'start', behavior: 'instant' });
    var dest = window.pageYOffset;
    window.scrollTo(0, here); // restored in the same task, so nothing paints
    return dest;
  }

  function glide(dest) {
    var start = window.pageYOffset;
    var delta = dest - start;
    if (Math.abs(delta) < 2) return;
    var t0 = performance.now();
    (function step(now) {
      var p = Math.min(1, (now - t0) / GLIDE_MS);
      // easeInOutCubic
      var e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      window.scrollTo(0, start + delta * e);
      if (p < 1) window.requestAnimationFrame(step);
    })(t0);
  }

  document.addEventListener('click', function (event) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey ||
        event.ctrlKey || event.shiftKey || event.altKey) return;

    var link = event.target.closest && event.target.closest('a[href^="#"]');
    if (!link) return;

    var hash = link.getAttribute('href');
    if (!hash || hash === '#') return;

    var target = document.getElementById(hash.slice(1));
    if (!target) return;

    event.preventDefault();
    var dest = destinationFor(target);
    // rAF is suspended in a hidden tab, so the glide would never run and the
    // click would do nothing at all — jump straight there instead.
    if (reduced.matches || document.hidden) window.scrollTo(0, dest);
    else glide(dest);

    if (window.history && history.replaceState) history.replaceState(null, '', hash);
    // keep keyboard users on the thing they jumped to
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
})();
