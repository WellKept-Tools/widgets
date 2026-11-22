/* WellKept Widgets : thème commun, réglages par l'URL, stockage local, pied de page.
   Réglages communs : ?theme=ivory|evergreen|violet|notion-light|notion-dark|blush|sage|pixel
   &accent=8A6A4A &bg=… &card=… &ink=… &muted=… &line=… (hexadécimal sans #)
   &font=serif|sans|mono|rounded  &radius=14  &brand=0 (masque la ligne « Made by », le logo reste) */
(function () {
  var THEMES = {
    "ivory":        { bg: "F6F1E7", card: "FBF8F1", ink: "3E3128", muted: "8A6A4A", accent: "8A6A4A", accent2: "9AA58C", line: "D9CCB4", font: "serif" },
    "evergreen":    { bg: "16261F", card: "1F3A2E", ink: "F4EFE3", muted: "C9B48A", accent: "D4B47E", accent2: "7FA08A", line: "2F4D40", font: "serif" },
    "violet":       { bg: "17151F", card: "211E2E", ink: "EDE9FF", muted: "A79BD6", accent: "9B7BFF", accent2: "E58BD8", line: "332E4D", font: "sans" },
    "notion-light": { bg: "FFFFFF", card: "FFFFFF", ink: "37352F", muted: "787774", accent: "2383E2", accent2: "0F7B6C", line: "E9E9E7", font: "sans" },
    "notion-dark":  { bg: "191919", card: "202020", ink: "E6E6E5", muted: "9B9A97", accent: "529CCA", accent2: "4DAB9A", line: "2F2F2F", font: "sans" },
    "blush":        { bg: "FBF3F1", card: "FFFFFF", ink: "4A3A3A", muted: "B07D7D", accent: "D98C8C", accent2: "A7C4A0", line: "F0DCD8", font: "rounded" },
    "sage":         { bg: "F2F4EE", card: "FAFBF7", ink: "2F3B2F", muted: "6D7F6A", accent: "6B8F71", accent2: "C9A66B", line: "DCE3D5", font: "sans" },
    "pixel":        { bg: "1B1D2A", card: "232638", ink: "E8E8F0", muted: "9AA0C3", accent: "7AA2F7", accent2: "F7768E", line: "343852", font: "mono" }
  };
  var FONTS = {
    serif: "Georgia, 'Times New Roman', serif",
    sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif",
    mono: "ui-monospace, 'SFMono-Regular', Menlo, Consolas, 'Courier New', monospace",
    rounded: "'Nunito', 'Quicksand', ui-rounded, 'Segoe UI', Arial, sans-serif"
  };
  var q = new URLSearchParams(location.search);
  function hex(v) { return /^[0-9a-fA-F]{3,8}$/.test(v || "") ? "#" + v : null; }
  var name = q.get("theme") || "notion-light";
  var t = Object.assign({}, THEMES[name] || THEMES["notion-light"]);
  ["bg", "card", "ink", "muted", "accent", "accent2", "line"].forEach(function (k) {
    var v = hex(q.get(k)); if (v) t[k] = v.slice(1);
  });
  var font = FONTS[q.get("font")] || FONTS[t.font] || FONTS.sans;
  var radius = Math.max(0, Math.min(30, parseInt(q.get("radius") || "14", 10) || 0));
  var r = document.documentElement.style;
  ["bg", "card", "ink", "muted", "accent", "accent2", "line"].forEach(function (k) { r.setProperty("--" + k, "#" + t[k]); });
  r.setProperty("--font", font);
  r.setProperty("--radius", radius + "px");

  var LOGO = '<svg viewBox="0 0 72 52" aria-hidden="true"><g transform="translate(3.5,-3.5)" fill="none" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">' +
    '<polyline points="8,26 20,44 31,28 42,44" stroke="currentColor"/><polyline points="42,44 57,15" stroke="var(--accent)"/></g></svg>';

  window.WK = {
    q: q,
    param: function (k, d) { var v = q.get(k); return v === null || v === "" ? d : v; },
    num: function (k, d, min, max) {
      var v = parseFloat(q.get(k)); if (isNaN(v)) v = d;
      if (min !== undefined) v = Math.max(min, v); if (max !== undefined) v = Math.min(max, v); return v;
    },
    /* Stockage propre à chaque widget et à son identifiant (&id=…), jamais bloquant. */
    store: function (ns) {
      var key = "wk-" + ns + "-" + (q.get("id") || "default");
      return {
        get: function (d) { try { var v = localStorage.getItem(key); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
        set: function (v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) {} }
      };
    },
    today: function () { var d = new Date(); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); },
    brand: function (el) {
      el.className = "wk-brand";
      el.innerHTML = LOGO + (q.get("brand") === "0" ? "" : "<span>Made by WellKept Tools</span>");
    }
  };
  document.addEventListener("DOMContentLoaded", function () {
    var b = document.getElementById("wk-brand"); if (b) WK.brand(b);
  });
})();
