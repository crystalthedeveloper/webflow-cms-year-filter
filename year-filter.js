
/*!
 * webflow-cms-year-filter – single-file
 * usage: add data-year-scope wrapper, buttons with data-filter-year, cards with data-year
 */
(function (global) {
    function ready(fn) {
        if (document.readyState === "complete" || document.readyState === "interactive") requestAnimationFrame(fn);
        else document.addEventListener("DOMContentLoaded", () => requestAnimationFrame(fn));
    }
    const s = v => String(v || "").trim();

    function init(opts = {}) {
        const cfg = {
            scopeSelector: "[data-year-scope]",
            buttonSelector: "[data-filter-year]",
            itemSelector: "[data-year]",
            emptySelector: "[data-empty]",
            readURL: true,
            defaultToMaxYear: true,
            // inline styles for active button (set to null to disable)
            activeStyles: { backgroundColor: "#e63946", color: "#fff" },
            createEmptyIfMissing: false,
            emptyText: "No items found.",
            ...opts
        };

        ready(() => {
            document.querySelectorAll(cfg.scopeSelector).forEach(scope => {
                const buttons = [...scope.querySelectorAll(cfg.buttonSelector)];
                if (!buttons.length) return;

                let emptyEl = scope.querySelector(cfg.emptySelector);
                if (!emptyEl && cfg.createEmptyIfMissing) {
                    emptyEl = document.createElement("p");
                    emptyEl.setAttribute("data-empty", "");
                    emptyEl.style.display = "none";
                    emptyEl.textContent = cfg.emptyText;
                    scope.appendChild(emptyEl);
                }

                const items = () => [...scope.querySelectorAll(cfg.itemSelector)];

                function setActive(btn) {
                    buttons.forEach(b => {
                        b.removeAttribute("aria-pressed");
                        if (cfg.activeStyles && b !== btn) b.style.cssText = b.dataset._yfPrevStyle || "";
                    });
                    if (btn) {
                        btn.setAttribute("aria-pressed", "true");
                        if (cfg.activeStyles) {
                            btn.dataset._yfPrevStyle = btn.style.cssText;
                            Object.assign(btn.style, cfg.activeStyles);
                        }
                    }
                }

                function apply(yearRaw) {
                    const year = s(yearRaw);
                    let visible = 0;
                    items().forEach(el => {
                        const show = (year === "all" || year === "" || s(el.getAttribute("data-year")) === year);
                        el.style.display = show ? "" : "none";
                        if (show) visible++;
                    });
                    if (emptyEl) {
                        const none = visible === 0;
                        emptyEl.style.display = none ? "" : "none";
                        if (none) emptyEl.textContent = (year && year !== "all") ? `No items found for ${year}.` : cfg.emptyText;
                    }
                }

                scope.addEventListener("click", e => {
                    const btn = e.target.closest(cfg.buttonSelector);
                    if (!btn || !scope.contains(btn)) return;
                    setActive(btn);
                    apply(btn.getAttribute("data-filter-year"));
                });

                // init
                let initYear = null;
                if (cfg.readURL) {
                    const q = new URLSearchParams(location.search);
                    initYear = q.get("year") || (location.hash.startsWith("#year=") ? location.hash.slice(6) : null);
                }
                if (initYear) {
                    const btn = buttons.find(b => s(b.getAttribute("data-filter-year")) === s(initYear));
                    setActive(btn || null);
                    apply(initYear);
                } else if (cfg.defaultToMaxYear) {
                    const numeric = buttons.map(b => ({ b, y: parseInt(b.getAttribute("data-filter-year"), 10) }))
                        .filter(o => !Number.isNaN(o.y))
                        .sort((a, b) => b.y - a.y);
                    (numeric[0]?.b || buttons[0])?.click();
                } else {
                    buttons[0]?.click();
                }
            });
        });
    }

    // auto-init with defaults; expose for custom init if needed
    init();
    global.WebflowCMSYearFilter = { init };
})(window);

