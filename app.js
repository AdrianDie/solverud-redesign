/* Advokatfirmaet Sølverud — interaksjon */

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
