/* Advokatfirmaet Sølverud — interaksjon */

/* ---- Saksområder (kundens ekte innhold) ---- */
const AREAS = [
  { t:"Barnerett", d:"Foreldreansvar, samvær og bosted ved separasjon og skilsmisse.",
    icon:'<path d="M12 21s-6.5-4.3-9-8.3C1.4 9.9 2.6 6.5 5.7 6c1.9-.3 3.6.7 4.3 2.3.7-1.6 2.4-2.6 4.3-2.3 3.1.5 4.3 3.9 2.7 6.7C18.5 16.7 12 21 12 21Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>' },
  { t:"Barnevern", d:"Bistand i saker hvor barnevernet er involvert.",
    icon:'<path d="M12 3l7 3v5c0 4.6-3 8-7 10-4-2-7-5.4-7-10V6l7-3Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 11.5l2 2 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>' },
  { t:"Arbeidsrett", d:"Oppsigelser, varsling og arbeidskonflikt.",
    icon:'<rect x="3" y="7" width="18" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M3 12h18" stroke="currentColor" stroke-width="1.6"/>' },
  { t:"NAV-saker", d:"Klage på vedtak fra NAV og trygderett.",
    icon:'<path d="M4 20V9l8-5 8 5v11" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 20v-6h6v6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>' },
  { t:"Strafferett", d:"Forsvarer i straffesaker av alle typer.",
    icon:'<path d="M12 3v18M6 21h12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M4.5 8.5l4-2 4 2-4 2-4-2Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M11.5 8.5l4-2 4 2-4 2-4-2Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>' },
  { t:"Mekling", d:"Obligatorisk mekling og konfliktløsning.",
    icon:'<path d="M12 4v16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="7" cy="9" r="3" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="17" cy="9" r="3" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M4 20c0-2.2 1.8-4 3-4s3 1.8 3 4M14 20c0-2.2 1.8-4 3-4s3 1.8 3 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>' },
];

const grid = document.getElementById("areasGrid");
if (grid){
  grid.innerHTML = AREAS.map(a => `
    <article class="area-card reveal">
      <div class="area-card__icon"><svg viewBox="0 0 24 24" aria-hidden="true">${a.icon}</svg></div>
      <h3>${a.t}</h3>
      <p>${a.d}</p>
    </article>`).join("");
}

/* ---- Sticky header state ---- */
const header = document.getElementById("siteHeader");
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
onScroll();
window.addEventListener("scroll", onScroll, { passive:true });

/* ---- Mobil-meny ---- */
const drawer  = document.getElementById("mobileMenu");
const overlay = document.getElementById("drawerOverlay");
const openBtn = document.getElementById("hamburger");
const closeBtn= document.getElementById("drawerClose");
const setMenu = (open) => {
  drawer.classList.toggle("open", open);
  overlay.classList.toggle("open", open);
  openBtn.setAttribute("aria-expanded", open);
  drawer.setAttribute("aria-hidden", !open);
  document.body.style.overflow = open ? "hidden" : "";
};
openBtn.addEventListener("click", () => setMenu(true));
closeBtn.addEventListener("click", () => setMenu(false));
overlay.addEventListener("click", () => setMenu(false));
drawer.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });

/* ---- Reveal-animasjon (robust: IntersectionObserver + CSS) ---- */
const reveals = document.querySelectorAll(".reveal");
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const showAll = () => reveals.forEach(el => el.classList.add("is-in"));

if (reduce || !("IntersectionObserver" in window)){
  showAll();
} else {
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        const el = entry.target;
        const sibs = [...(el.parentElement?.children || [])].filter(c => c.classList.contains("reveal"));
        el.style.transitionDelay = Math.min(sibs.indexOf(el), 5) * 70 + "ms";
        el.classList.add("is-in");
        obs.unobserve(el);
      }
    });
  }, { threshold:0.12, rootMargin:"0px 0px -8% 0px" });
  reveals.forEach(el => io.observe(el));
  /* vis alt over folden umiddelbart, så innhold aldri er skjult ved last */
  const revealAboveFold = () => reveals.forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) el.classList.add("is-in");
  });
  revealAboveFold();
  window.addEventListener("load", revealAboveFold);
  /* failsafe: vis alt uansett etter 1.6s */
  setTimeout(showAll, 1600);
}
