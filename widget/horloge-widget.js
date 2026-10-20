// Horloge des durées — widget pour l'app Scriptable (iPhone)
// Même cadran que l'horloge : disque rouge = heures, disque bleu = minutes,
// loupe rouge = heure (24 h), loupe bleue = minutes.
// Toucher le widget ouvre l'horloge complète (temps restant, rendez-vous…).

// ---- Réglages ----
const OUVRIR = "https://universalix.github.io/horloge/"; // page ouverte au toucher
const AFFICHER_LOUPES = true;  // false = pas de chiffres sur le cadran (plus sûr si le widget tarde à se mettre à jour)

// ---- Couleurs (mêmes que l'horloge, clair / sombre) ----
const sombre = Device.isUsingDarkAppearance();
const C = sombre
  ? { fond: "#15171a", cadran: "#1d2024", piste: "#2a2d32", heure: "#ef5a43", minute: "#5b9fe0", texte: "#eceae5", surCouleur: "#15171a" }
  : { fond: "#f6f5f2", cadran: "#ffffff", piste: "#e4e2dc", heure: "#c63a25", minute: "#2a6db5", texte: "#22262b", surCouleur: "#ffffff" };
const col = h => new Color(h);

// ---- Outils de dessin ----
function pt(cx, cy, r, frac) {
  const a = frac * 2 * Math.PI - Math.PI / 2;
  return new Point(cx + r * Math.cos(a), cy + r * Math.sin(a));
}
function disque(ctx, cx, cy, r, couleur) {
  ctx.setFillColor(col(couleur));
  ctx.fillEllipse(new Rect(cx - r, cy - r, 2 * r, 2 * r));
}
function part(ctx, cx, cy, r, debut, longueur, couleur) {
  if (longueur <= 0.001) return;
  const p = new Path();
  p.move(new Point(cx, cy));
  const n = Math.max(2, Math.ceil(longueur * 120));
  for (let i = 0; i <= n; i++) p.addLine(pt(cx, cy, r, debut + longueur * i / n));
  p.closeSubpath();
  ctx.addPath(p);
  ctx.setFillColor(col(couleur));
  ctx.fillPath();
}
function texte(ctx, s, x, y, taille, couleur) {
  ctx.setFont(new Font("Verdana-Bold", taille));
  ctx.setTextColor(col(couleur));
  ctx.setTextAlignedCenter();
  ctx.drawTextInRect(s, new Rect(x - 60, y - taille * 0.72, 120, taille * 1.5));
}
function loupe(ctx, x, y, k, couleur, valeur) {
  // loupes agrandies pour rester lisibles en petit widget
  const w = (String(valeur).length > 1 ? 68 : 50) * k, h = 48 * k, b = 4 * k;
  const bord = new Path();
  bord.addRoundedRect(new Rect(x - w / 2 - b, y - h / 2 - b, w + 2 * b, h + 2 * b), h / 2 + b, h / 2 + b);
  ctx.addPath(bord); ctx.setFillColor(col(C.cadran)); ctx.fillPath();
  const p = new Path();
  p.addRoundedRect(new Rect(x - w / 2, y - h / 2, w, h), h / 2, h / 2);
  ctx.addPath(p); ctx.setFillColor(col(couleur)); ctx.fillPath();
  texte(ctx, String(valeur), x, y, 34 * k, C.surCouleur);
}

// ---- Le cadran ----
function dessinerHorloge(maintenant, S) {
  const ctx = new DrawContext();
  ctx.size = new Size(S, S);
  ctx.opaque = false;
  ctx.respectScreenScale = true;
  // cadran agrandi : il occupe tout le widget, comme l'horloge d'Apple
  const k = S / 386, cx = S / 2, cy = S / 2;
  const h = maintenant.getHours(), m = maintenant.getMinutes();
  const fracMin = m / 60, fracHeure = ((h % 12) + m / 60) / 12;

  ctx.setFillColor(col(C.cadran));
  ctx.fillRect(new Rect(0, 0, S, S));
  // disque bleu des minutes
  disque(ctx, cx, cy, 138 * k, C.piste);
  part(ctx, cx, cy, 138 * k, 0, fracMin, C.minute);
  for (let i = 0; i < 12; i++) {
    const p = new Path();
    p.move(pt(cx, cy, 128 * k, i / 12));
    p.addLine(pt(cx, cy, 138 * k, i / 12));
    ctx.addPath(p);
    ctx.setStrokeColor(col(C.cadran));
    ctx.setLineWidth((i % 3 ? 2 : 4) * k);
    ctx.strokePath();
  }
  // disque rouge des heures
  disque(ctx, cx, cy, 86 * k, C.cadran);
  disque(ctx, cx, cy, 80 * k, C.piste);
  part(ctx, cx, cy, 80 * k, 0, fracHeure, C.heure);
  // chiffres des heures
  for (let n = 1; n <= 12; n++) {
    const p = pt(cx, cy, 176 * k, n / 12);
    texte(ctx, String(n), p.x, p.y, (n % 3 ? 25 : 29) * k, C.texte);
  }
  // loupes
  if (AFFICHER_LOUPES) {
    const r = pt(cx, cy, 80 * k, fracHeure);
    loupe(ctx, r.x, r.y, k, C.heure, h);
    const q = pt(cx, cy, 136 * k, fracMin);
    loupe(ctx, q.x, q.y, k, C.minute, m);
  }
  return ctx.getImage();
}

// ---- Le widget ----
const maintenant = new Date();
const widget = new ListWidget();
widget.backgroundColor = col(C.cadran);
widget.url = OUVRIR;
widget.setPadding(0, 0, 0, 0);
// l'image du cadran sert de fond : elle remplit tout le widget, sans marge
widget.backgroundImage = dessinerHorloge(maintenant, 500);
// demander une mise à jour à la minute suivante (iOS décide du moment réel)
widget.refreshAfterDate = new Date(Math.ceil((maintenant.getTime() + 1000) / 60000) * 60000);

if (config.runsInWidget) {
  Script.setWidget(widget);
} else {
  await widget.presentSmall();   // aperçu quand on lance le script dans l'app
}
Script.complete();
