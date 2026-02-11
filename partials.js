(async function () {
  async function inject(selector, url) {
    const el = document.querySelector(selector);
    if (!el) return;
    const res = await fetch(url, { cache: "no-cache" });
    const html = await res.text();
    el.outerHTML = html;
  }

  // Use RELATIVE paths (more reliable on static hosting)
  await inject("#header-slot", "header.html");
  await inject("#footer-slot", "footer.html");

  // Set footer year (scripts inside injected HTML won't run)
  const y = document.getElementById("y");
  if (y) y.textContent = new Date().getFullYear();

  // Wire hamburger (must be done after header injection)
  const btn = document.querySelector(".nav-toggle");
  const menu = document.getElementById("site-menu");
  const overlay = document.getElementById("navOverlay");

  if (btn && menu && overlay) {
    function openMenu() {
      menu.classList.add("open");
      overlay.style.display = "block";
      btn.setAttribute("aria-expanded", "true");
      btn.classList.add("open");
      document.body.classList.add("nav-open");
    }

    function closeMenu() {
      menu.classList.remove("open");
      overlay.style.display = "none";
      btn.setAttribute("aria-expanded", "false");
      btn.classList.remove("open");
      document.body.classList.remove("nav-open");
    }

    btn.addEventListener("click", () => {
      menu.classList.contains("open") ? closeMenu() : openMenu();
    });

    overlay.addEventListener("click", closeMenu);
    menu.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));
    window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });
  }

  // Auto-highlight active link
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll('#site-menu a').forEach(a => {
    if (a.getAttribute("href") === path) a.classList.add("active");
  });
})();

