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

const SITE = "https://kanakmalpani.github.io/Kanak-Malpani/";

const textFor = (button) => {
  const from = button.getAttribute("data-copy-from");
  if (from) {
    const node = document.getElementById(from);
    return node ? node.innerText.trim() : "";
  }
  const path = button.getAttribute("data-copy-path");
  if (path) return `${SITE}${path.replace(/^\//, "")}`;
  return (button.getAttribute("data-copy") || "").trim();
};

const copyText = async (text) => {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      /* fall through to the selection copy */
    }
  }
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "absolute";
  area.style.left = "-9999px";
  document.body.appendChild(area);
  area.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  area.remove();
  return ok;
};

for (const button of document.querySelectorAll(
  "button[data-copy], button[data-copy-from], button[data-copy-path]"
)) {
  const label = button.textContent;
  button.addEventListener("click", async () => {
    const text = textFor(button);
    let ok = false;
    if (text) {
      try {
        ok = await copyText(text);
      } catch {
        ok = false;
      }
    }
    button.textContent = ok ? "Copied" : "Copy failed";
    window.setTimeout(() => {
      button.textContent = label;
    }, 1600);
  });
}
