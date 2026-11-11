const nav = document.querySelector(".bar nav");
if (nav) {
  const links = [...nav.querySelectorAll("a[href^='#']")];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter((section) => section instanceof HTMLElement);

  const setCurrent = (id) => {
    for (const link of links) {
      const active = link.getAttribute("href") === `#${id}`;
      if (active) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    }
  };

  const ratios = new Map();
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
      }
      let bestId = "";
      let bestRatio = 0;
      for (const [id, ratio] of ratios) {
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestId = id;
        }
      }
      setCurrent(bestId);
    },
    { rootMargin: "-20% 0px -50% 0px", threshold: [0, 0.25, 0.6, 1] }
  );

  for (const section of sections) observer.observe(section);
}
