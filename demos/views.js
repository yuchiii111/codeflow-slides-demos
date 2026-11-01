// Small SVG renderers that imitate CodeFlow's views (for slide demos only).
(function (G) {
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const svg = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="-apple-system,Segoe UI,Arial,sans-serif">${body}</svg>`;
  const T = (x, y, t, o = {}) => `<text x="${x}" y="${y}" text-anchor="${o.a || "middle"}" dominant-baseline="central" font-size="${o.fs || 18}" fill="${o.fill || "#111827"}" font-weight="${o.fw || 400}" ${o.mono ? 'font-family="Menlo,Consolas,monospace"' : ""}>${esc(t)}</text>`;
  const R = (x, y, w, h, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx || 0}" fill="${o.fill || "#fff"}" stroke="${o.stroke || "#64748b"}" stroke-width="${o.sw || 2}"/>`;
  const L = (x1, y1, x2, y2, o = {}) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${o.stroke || "#64748b"}" stroke-width="${o.sw || 1.6}" ${o.arrow ? 'marker-end="url(#ah)"' : ""} ${o.dash ? 'stroke-dasharray="5 4"' : ""}/>`;
  const C = (x, y, r, o = {}) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${o.fill || "#fff"}" stroke="${o.stroke || "#64748b"}" stroke-width="${o.sw || 1.8}"/>`;
  const defs = (c = "#64748b") => `<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${c}"/></marker></defs>`;
  const fmt = (v) => typeof v === "number" ? (Number.isInteger(v) ? String(v) : String(Math.round(v * 100) / 100)) : (Array.isArray(v) ? "(" + v.map(fmt).join(", ") + ")" : String(v));

  const V = {};
  V.array = (vals, o = {}) => {
    const c = o.color || "#64748b", cw = Math.max(52, ...vals.map((v) => fmt(v).length * 11 + 24)), h = 52, n = vals.length;
    let b = "";
    vals.forEach((v, i) => {
      const hl = o.hl && o.hl.includes(i);
      b += R(10 + i * cw, 10, cw, h, { stroke: c, fill: hl ? "#fff7e6" : "#fff", sw: hl ? 3 : 2 }) + T(10 + i * cw + cw / 2, 36, fmt(v), { fs: 20 });
      b += T(10 + i * cw + cw / 2, 80, i, { fs: 15, fill: "#dc2626" });
    });
    return svg(n * cw + 20, 96, b);
  };
  V.matrix = (rows, o = {}) => {
    const c = o.color || "#64748b", cw = 54, h = 46;
    let b = "";
    rows.forEach((r, i) => r.forEach((v, j) => { b += R(40 + j * cw, 34 + i * h, cw, h, { stroke: c }) + T(40 + j * cw + cw / 2, 34 + i * h + h / 2, fmt(v), { fs: 19 }); }));
    rows[0].forEach((_, j) => { b += T(40 + j * cw + cw / 2, 18, j, { fs: 14, fill: "#dc2626" }); });
    rows.forEach((_, i) => { b += T(22, 34 + i * h + h / 2, i, { fs: 14, fill: "#dc2626" }); });
    return svg(50 + rows[0].length * cw, 44 + rows.length * h, b);
  };
  V.table = (obj, o = {}) => {
    const c = o.color || "#64748b", keys = Object.keys(obj), cw = keys.map((k) => Math.max(60, Math.max(k.length, fmt(obj[k]).length) * 12 + 26)), h = 46;
    let b = R(6, 6, cw.reduce((a, x) => a + x, 0) + 8, 2 * h + 8, { stroke: c, sw: 2.5 }), x = 10;
    keys.forEach((k, i) => { b += R(x, 10, cw[i], h, { stroke: c, fill: "#fff" }) + T(x + cw[i] / 2, 10 + h / 2, k, { fs: 18, fw: 700 }) + R(x, 10 + h, cw[i], h, { stroke: c }) + T(x + cw[i] / 2, 10 + 1.5 * h, fmt(obj[k]), { fs: 18 }); x += cw[i]; });
    return svg(x + 10, 2 * h + 22, b);
  };
  V.linked = (labels, o = {}) => {
    const c = o.color || "#64748b", bw = 62, g = 42;
    let b = defs(c);
    labels.forEach((l, i) => { const x = 10 + i * (bw + g); b += R(x, 20, bw, 48, { stroke: c, rx: 6 }) + T(x + bw / 2, 44, l, { fs: 19 }); if (i < labels.length - 1) b += L(x + bw, 44, x + bw + g - 2, 44, { stroke: c, arrow: true }); });
    b += L(10 + labels.length * (bw + g) - g, 44, 10 + labels.length * (bw + g) - g + 30, 44, { stroke: c, dash: true }) + T(10 + labels.length * (bw + g) - g + 52, 44, "None", { fs: 14, fill: "#9ca3af" });
    return svg(labels.length * (bw + g) + 60, 88, b);
  };
  V.hash = (buckets, o = {}) => {
    const c = o.color || "#64748b", h = 42;
    let b = defs(c);
    buckets.forEach((bk, i) => {
      const y = 10 + i * (h + 10);
      b += R(10, y, 44, h, { stroke: c, fill: "#f3f4f6" }) + T(32, y + h / 2, i, { fs: 16, fill: "#dc2626" });
      bk.forEach(([k, v], j) => { const x = 90 + j * 120; b += L(j ? x - 26 : 54, y + h / 2, x - 2, y + h / 2, { stroke: c, arrow: true }) + R(x, y, 94, h, { stroke: c, rx: 6 }) + T(x + 47, y + h / 2, `${k}: ${v}`, { fs: 16 }); });
    });
    return svg(90 + Math.max(1, ...buckets.map((x) => x.length)) * 120, buckets.length * (h + 10) + 14, b);
  };
  const layoutTree = (node) => { // node: [label, left, right]
    const pts = []; let leaf = 0;
    const walk = (n, d) => { if (!n) return null; const l = walk(n[1], d + 1); const me = { label: n[0], d }; pts.push(me); const r = walk(n[2], d + 1); if (l === null && r === null) me.x = leaf++; else me.x = ((l ? l.x : r.x - 1) + (r ? r.x : l.x + 1)) / 2; me.l = l; me.r = r; return me; };
    const root = walk(node, 0); return { root, pts, leaves: leaf };
  };
  V.tree = (node, o = {}) => {
    const c = o.color || "#64748b", { pts, leaves } = layoutTree(node), dx = 64, dy = 70, ox = 36, oy = 32;
    const P = (p) => [ox + p.x * dx, oy + p.d * dy];
    let b = "";
    pts.forEach((p) => [p.l, p.r].forEach((ch) => { if (ch) { const [x1, y1] = P(p), [x2, y2] = P(ch); b += L(x1, y1, x2, y2, { stroke: c }); } }));
    pts.forEach((p) => { const [x, y] = P(p); const hl = o.hl && o.hl.includes(p.label); b += C(x, y, 22, { stroke: hl ? "#f59e0b" : c, fill: hl ? "#fff7e6" : "#fff", sw: hl ? 3 : 1.8 }) + T(x, y, p.label, { fs: 17 }); });
    const depth = Math.max(...pts.map((p) => p.d));
    return svg(ox * 2 + (leaves - 1) * dx, oy * 2 + depth * dy, b);
  };
  V.heap = (vals, o = {}) => {
    const build = (i) => i < vals.length ? [String(vals[i]), build(2 * i + 1), build(2 * i + 2)] : null;
    const t = V.tree(build(0), o), a = V.array(vals, o);
    const tw = +t.match(/width="(\d+\.?\d*)"/)[1], th = +t.match(/height="(\d+\.?\d*)"/)[1], aw = +a.match(/width="(\d+\.?\d*)"/)[1];
    const W = Math.max(tw, aw) + 20;
    return svg(W, th + 120, `<g transform="translate(${(W - tw) / 2},0)">${t.replace(/^<svg[^>]*>|<\/svg>$/g, "")}</g><g transform="translate(${(W - aw) / 2},${th + 16})">${a.replace(/^<svg[^>]*>|<\/svg>$/g, "")}</g>`);
  };
  V.graph = (nodes, edges, o = {}) => { // nodes: {id:[x,y]}, edges: [[a,b,w]]
    const c = o.color || "#64748b";
    let b = defs(c);
    edges.forEach(([a, z, w]) => { const [x1, y1] = nodes[a], [x2, y2] = nodes[z]; const dx = x2 - x1, dy = y2 - y1, d = Math.hypot(dx, dy); b += L(x1 + dx / d * 24, y1 + dy / d * 24, x2 - dx / d * 26, y2 - dy / d * 26, { stroke: c, arrow: true }); if (w !== undefined) b += T((x1 + x2) / 2 + 10, (y1 + y2) / 2 - 10, w, { fs: 14, fill: "#475569" }); });
    Object.entries(nodes).forEach(([id, [x, y]]) => { const hl = o.hl && o.hl.includes(id); b += C(x, y, 22, { stroke: hl ? "#f59e0b" : c, fill: hl ? "#fff7e6" : "#fff", sw: hl ? 3 : 1.8 }) + T(x, y, id, { fs: 17 }); });
    const xs = Object.values(nodes).map((p) => p[0]), ys = Object.values(nodes).map((p) => p[1]);
    return svg(Math.max(...xs) + 40, Math.max(...ys) + 40, b);
  };
  // chart: layers [{kind:'line'|'scatter'|'bar', pts:[[x,y]], color, name}]
  V.chart = (layers, o = {}) => {
    const W = o.w || 420, H = o.h || 260, pl = 46, pb = 34, pt = 14, pr = 16;
    const all = layers.flatMap((l) => l.pts);
    let x0 = o.x0 ?? Math.min(...all.map((p) => p[0])), x1 = o.x1 ?? Math.max(...all.map((p) => p[0])), y0 = o.y0 ?? Math.min(0, ...all.map((p) => p[1])), y1 = o.y1 ?? Math.max(...all.map((p) => p[1]));
    if (layers.some((l) => l.kind === "bar")) { x0 -= 0.6; x1 += 0.6; }
    if (x1 === x0) x1 = x0 + 1; if (y1 === y0) y1 = y0 + 1;
    if (!layers.some((l) => l.kind === "bar") && o.x0 === undefined) { const px = (x1 - x0) * 0.05; x0 -= px; x1 += px; }
    if (o.y1 === undefined) y1 += (y1 - y0) * 0.06;
    const X = (v) => pl + (v - x0) / (x1 - x0) * (W - pl - pr), Y = (v) => H - pb - (v - y0) / (y1 - y0) * (H - pb - pt);
    let b = L(pl, H - pb, W - pr, H - pb, { stroke: "#9ca3af", sw: 1.2 }) + L(pl, pt, pl, H - pb, { stroke: "#9ca3af", sw: 1.2 });
    const ticks = (a, z, n) => { const out = [], st = (z - a) / n; for (let i = 0; i <= n; i++) out.push(a + i * st); return out; };
    ticks(y0, y1, 4).forEach((v) => { b += L(pl, Y(v), W - pr, Y(v), { stroke: "#eef0f3", sw: 1 }) + T(pl - 8, Y(v), fmt(Math.round(v * 10) / 10), { fs: 12, a: "end", fill: "#6b7280" }); });
    const allx = [...new Set(all.map((p) => p[0]))];
    const xt = layers.some((l) => l.kind === "bar") ? layers[0].pts.map((p) => p[0]) : (allx.length <= 8 && allx.every(Number.isInteger) ? allx : ticks(x0, x1, 4));
    xt.forEach((v) => { b += T(X(v), H - pb + 16, fmt(Math.round(v * 10) / 10), { fs: 12, fill: "#6b7280" }); });
    layers.forEach((l) => {
      const c = l.color || "#64748b";
      if (l.kind === "bar") { const bw = (W - pl - pr) / (x1 - x0) * 0.7; l.pts.forEach(([x, y], i) => { const hl = o.hl && o.hl.includes(i); b += `<rect x="${X(x) - bw / 2}" y="${Y(Math.max(0, y))}" width="${bw}" height="${Math.abs(Y(y) - Y(0))}" fill="${hl ? "#f59e0b" : c}" rx="2"/>`; }); }
      if (l.kind === "line") { b += `<polyline fill="none" stroke="${c}" stroke-width="3" points="${l.pts.map(([x, y]) => X(x) + "," + Y(y)).join(" ")}"/>`; l.pts.forEach(([x, y]) => { b += `<circle cx="${X(x)}" cy="${Y(y)}" r="4" fill="${c}"/>`; }); }
      if (l.kind === "scatter") l.pts.forEach(([x, y]) => { b += `<circle cx="${X(x)}" cy="${Y(y)}" r="7" fill="${c}" fill-opacity=".85"/>`; });
    });
    if (layers.length > 1 && o.legend !== false) layers.forEach((l, i) => { const lx = pl + 12 + i * 130; b += `<rect x="${lx}" y="${pt + 2}" width="14" height="14" rx="3" fill="${l.color}"/>` + T(lx + 20, pt + 9, l.name, { fs: 13, a: "start", fill: "#374151", mono: true }); });
    return svg(W, H, b);
  };
  V.line = (vals, o = {}) => V.chart([{ kind: "line", pts: toPts(vals), color: o.color }], o);
  V.scatter = (vals, o = {}) => V.chart([{ kind: "scatter", pts: toPts(vals), color: o.color }], o);
  V.bar = (vals, o = {}) => V.chart([{ kind: "bar", pts: vals.map((v, i) => [i, v]), color: o.color }], Object.assign({ y0: 0 }, o));
  V.value = (v, o = {}) => svg(160, 80, R(20, 14, 120, 52, { stroke: o.color || "#64748b", rx: 8 }) + T(80, 40, fmt(v), { fs: 22 }));
  const toPts = (vals) => vals.map((v, i) => Array.isArray(v) ? v : [i, v]);
  V.fmt = fmt;
  // place an svg string into a box, scaled to fit (up to maxScale)
  V.fit = (el, svgStr, maxScale = 1.8) => {
    el.innerHTML = svgStr; const sv = el.querySelector("svg"); if (!sv) return;
    const w = +sv.getAttribute("width"), h = +sv.getAttribute("height");
    const cw = el.clientWidth - 16, ch = el.clientHeight - 16;
    const k = Math.min(maxScale, cw / w, ch / h);
    sv.setAttribute("width", Math.max(10, w * k)); sv.setAttribute("height", Math.max(10, h * k));
    sv.style.maxWidth = "none"; sv.style.maxHeight = "none";
  };
  G.CFV = V;
})(window);
