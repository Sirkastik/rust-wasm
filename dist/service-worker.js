if (!self.define) { const e = e => { "require" !== e && (e += ".js"); let r = Promise.resolve(); return s[e] || (r = new Promise((async r => { if ("document" in self) { const s = document.createElement("script"); s.src = e, document.head.appendChild(s), s.onload = r } else importScripts(e), r() }))), r.then((() => { if (!s[e]) throw new Error(`Module ${e} didn’t register its module`); return s[e] })) }, r = (r, s) => { Promise.all(r.map(e)).then((e => s(1 === e.length ? e[0] : e))) }, s = { require: Promise.resolve(r) }; self.define = (r, i, t) => { s[r] || (s[r] = Promise.resolve().then((() => { let s = {}; const o = { uri: location.origin + r.slice(1) }; return Promise.all(i.map((r => { switch (r) { case "exports": return s; case "module": return o; default: return e(r) } }))).then((e => { const r = t(...e); return s.default || (s.default = r), s })) }))) } } define("./service-worker.js", ["./workbox-543be79b"], (function (e) { "use strict"; self.addEventListener("message", (e => { e.data && "SKIP_WAITING" === e.data.type && self.skipWaiting() })), e.precacheAndRoute([{ url: "ab37f158a3bc12a8dd39.module.wasm", revision: null }, { url: "index.html", revision: "a80d8a65f0f596e46e15e5d052eb3869" }, { url: "index.js", revision: "255a6e0cefb2654d654e725f55bce75d" }], {}) }));