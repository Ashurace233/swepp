document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menuBtn');
  const topNav = document.getElementById('topNav');
  if (!menuBtn || !topNav) return;

  const isOpen = () => topNav.classList.contains('open');

  function openMenu() {
    topNav.classList.add('open');
    topNav.setAttribute('aria-hidden', 'false');
    menuBtn.setAttribute('aria-expanded', 'true');
  }
  function closeMenu() {
    topNav.classList.remove('open');
    topNav.setAttribute('aria-hidden', 'true');
    menuBtn.setAttribute('aria-expanded', 'false');
  }
  function toggleMenu() { isOpen() ? closeMenu() : openMenu(); }

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close when clicking a nav link
  topNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      // allow normal navigation, but ensure menu collapsed on mobile
      closeMenu();
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!isOpen()) return;
    if (!topNav.contains(e.target) && !menuBtn.contains(e.target)) closeMenu();
  });

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) closeMenu();
  });

  // Reset menu on resize (show/hide controlled by CSS)
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 740) {
      topNav.classList.remove('open');
      topNav.setAttribute('aria-hidden', 'false');
      menuBtn.setAttribute('aria-expanded', 'false');
    } else {
      topNav.setAttribute('aria-hidden', 'true');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });
});