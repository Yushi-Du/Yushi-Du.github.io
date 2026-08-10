(function () {
  'use strict';

  var header = document.querySelector('[data-home-header]');
  var menuButton = document.querySelector('[data-menu-toggle]');
  var navigation = document.querySelector('[data-home-nav]');
  var navLinks = navigation ? Array.prototype.slice.call(navigation.querySelectorAll('a[href^="#"]')) : [];
  var revealItems = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  function updateHeader() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 18);
  }

  function closeMenu() {
    if (!menuButton || !navigation) return;
    menuButton.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
  }

  if (menuButton && navigation) {
    menuButton.addEventListener('click', function () {
      var isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!isOpen));
      navigation.classList.toggle('is-open', !isOpen);
    });

    navLinks.forEach(function (link) { link.addEventListener('click', closeMenu); });
  }

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealItems.forEach(function (item) {
      if (!item.classList.contains('is-visible')) revealObserver.observe(item);
    });
  } else {
    revealItems.forEach(function (item) { item.classList.add('is-visible'); });
  }

  if ('IntersectionObserver' in window && navLinks.length) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-30% 0px -58% 0px', threshold: 0 });

    ['about', 'publications'].forEach(function (id) {
      var section = document.getElementById(id);
      if (section) sectionObserver.observe(section);
    });
  }

  updateHeader();

  window.addEventListener('scroll', updateHeader, { passive: true });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 760) closeMenu();
  });
}());
