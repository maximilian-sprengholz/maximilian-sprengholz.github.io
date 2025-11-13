function Q(e, n, r) {
  const i = `${n}=${r}`;
  let o = `?${i}`;
  if (e) {
    const t = new RegExp(`([?&])${n}=[^&]*`);
    t.exec(e) !== null ? o = e.replace(t, `$1${i}`) : o = `${e}&${i}`;
  }
  return o;
}
function B(e) {
  const n = new RegExp(`[?&]${e}(=([^&#]*)|&|#|$)`).exec(
    document.location.search
  );
  if ((n == null ? void 0 : n[2]) !== void 0)
    return decodeURIComponent(n[2].replace(/\+/g, " "));
}
function z(e, n) {
  let r = e;
  if (r) {
    const i = new RegExp(`\\?${n}=[^&]*`), o = new RegExp(`&${n}=[^&]*`);
    r = r.replace(i, "?"), r = r.replace(o, "");
  }
  return r;
}
var E = /* @__PURE__ */ ((e) => (e[e.Left = 1] = "Left", e[e.None = 0] = "None", e[e.Right = -1] = "Right", e))(E || {});
function J(e, n, r) {
  if (B("imageLightboxSet") !== e)
    return;
  const i = B("imageLightboxIndex");
  if (i === void 0)
    return;
  let o = n.findIndex((t) => t.dataset.ilb2Id === i);
  o < 0 && (o = parseInt(i, 10)), r(o, !0);
}
function U(e, n, r, i, o, t, l) {
  const f = e.state;
  if (!f || Object.keys(f).length === 0) {
    t(!0);
    return;
  }
  if (f.imageLightboxSet !== n)
    return;
  const u = f.imageLightboxIndex;
  if (u === void 0) {
    t(!0);
    return;
  }
  let m = r.findIndex(
    (y) => y.dataset.ilb2Id === u
  );
  if (m < 0 && (m = parseInt(u, 10)), i === null) {
    o(m, !0);
    return;
  }
  l(
    m,
    m > i ? E.Right : E.Left,
    !0
  );
}
function G() {
  let e = z(
    document.location.search,
    "imageLightboxIndex"
  );
  e = z(e, "imageLightboxSet"), window.history.pushState({}, "", document.location.pathname + e);
}
function K(e, n, r) {
  const i = r[e].dataset.ilb2Id ?? e.toString();
  let o = Q(
    document.location.search,
    "imageLightboxIndex",
    i
  );
  const t = {
    imageLightboxIndex: i,
    imageLightboxSet: ""
  };
  n !== void 0 && (t.imageLightboxSet = n, o = Q(o, "imageLightboxSet", n)), window.history.pushState(
    t,
    "",
    document.location.pathname + o
  );
}
const v = document.createElement("dialog");
v.setAttribute("id", "ilb-container");
document.body.appendChild(v);
let M = null;
function Y(e, n, r) {
  v.classList.remove("ilb-overlay"), document.body.classList.add("ilb-body"), v.showModal(), n && (M = (i) => {
    i.stopPropagation(), r();
  }, v.addEventListener("click", M), v.addEventListener("touchend", M)), v.style.transition = `opacity ${e.toString()}ms ease`, setTimeout(() => {
    v.style.opacity = "1";
  }, 50);
}
function Z() {
  v.classList.add("ilb-overlay");
}
function h() {
  return v;
}
function _() {
  M !== null && (v.removeEventListener("click", M), v.removeEventListener("touchend", M)), v.close(), v.textContent = "", document.body.classList.remove("ilb-body");
}
function ee() {
  v.style.opacity = "0";
}
const H = document.createElement("div");
H.setAttribute("id", "ilb-activity-indicator");
H.appendChild(document.createElement("div"));
function q() {
  h().appendChild(H);
}
function j() {
  H.remove();
}
const I = document.createElement("div");
I.classList.add("ilb-button", "ilb-arrow");
I.setAttribute("id", "ilb-arrow-left");
const O = document.createElement("div");
O.classList.add("ilb-button", "ilb-arrow");
O.setAttribute("id", "ilb-arrow-right");
let C = null, k = null;
function te(e, n) {
  C = (r) => {
    r.stopPropagation(), e();
  }, k = (r) => {
    r.stopPropagation(), n();
  }, I.addEventListener("click", C), I.addEventListener("touchend", C), O.addEventListener("click", k), O.addEventListener("touchend", k), h().append(I, O);
}
function ne() {
  I.remove(), C !== null && (I.removeEventListener("click", C), I.removeEventListener("touchend", C)), k !== null && (O.removeEventListener("click", k), O.removeEventListener("touchend", k)), C = null, k = null;
}
const L = document.createElement("caption");
L.setAttribute("id", "ilb-caption");
L.textContent = "&nbsp;";
L.addEventListener("click", (e) => {
  e.stopPropagation();
});
function ie(e, n) {
  e !== "" ? (h().appendChild(L), L.style.transition = `opacity ${n.toString()}ms ease`, setTimeout(() => {
    L.style.opacity = "1";
  }, 1), L.textContent = e) : (L.style.opacity = "0", setTimeout(() => {
    L.remove();
  }, n));
}
const R = document.createElement("button");
R.classList.add("ilb-button");
R.setAttribute("id", "ilb-close-button");
let D = null;
function oe(e) {
  D = (n) => {
    n.stopPropagation(), e();
  }, R.addEventListener("click", D), h().appendChild(R);
}
function ae() {
  D !== null && R.removeEventListener("click", D), R.remove();
}
const re = (
  // eslint-disable-next-line compat/compat -- The prefixed version fixes the incompatibility
  document.fullscreenEnabled || (document.webkitFullscreenEnabled ?? !1)
);
function se() {
  return (
    // eslint-disable-next-line compat/compat -- The prefixed version fixes the incompatibility
    document.fullscreenElement ?? document.webkitFullscreenElement ?? null
  );
}
const le = (e) => {
  (e.requestFullscreen || e.webkitRequestFullScreen).call(e);
}, de = () => {
  (document.exitFullscreen || document.webkitExitFullscreen).call(document);
};
function ce() {
  se() === null ? le(h()) : de();
}
const P = document.createElement("button");
P.classList.add("ilb-button");
P.setAttribute("id", "ilb-fullscreen-button");
P.innerHTML = "&#x26F6;";
P.addEventListener("click", (e) => {
  e.stopPropagation(), ce();
});
function ue() {
  h().appendChild(P);
}
function fe() {
  P.remove();
}
function me(e, n, r) {
  let i = 0, o = 0, t = document.createElement("img");
  t.addEventListener("error", (d) => {
    h().dispatchEvent(
      new CustomEvent("ilb:error", {
        bubbles: !0,
        detail: { target: d.target }
      })
    );
  }), t.setAttribute("id", "ilb-image"), t.setAttribute("src", e.getAttribute("href") ?? ""), t.setAttribute("srcset", e.dataset.ilb2Srcset ?? ""), t.setAttribute("sizes", e.dataset.ilb2Sizes ?? "");
  const l = document.createElement("div");
  l.classList.add("ilb-image-container");
  let f;
  const u = e.dataset.ilb2VideoId;
  let m = e.dataset.ilb2Video !== void 0 && u !== void 0;
  if (m) {
    const d = r.get(u);
    d !== void 0 ? [t, f] = d.element() : m = !1;
  }
  l.appendChild(t);
  function y(d, p, b, F) {
    if (m) {
      const a = r.get(u);
      if ((a == null ? void 0 : a.shouldAutoplay()) === !0) {
        const [s, c] = a.element();
        c ? s.play() : s.autoplay = !0;
      }
    } else
      t.addEventListener("click", (a) => {
        if (a.stopPropagation(), n.quitOnImgClick) {
          F();
          return;
        }
        (a.pageX - t.offsetLeft) / t.width <= 1 / 3 ? p() : b();
      });
    t.addEventListener("touchstart", (a) => {
      i = a.touches[0].pageX, t.style.transitionProperty = "opacity";
    }), t.addEventListener("touchmove", (a) => {
      o = a.touches[0].pageX - i, t.style.left = `${o.toString()}px`;
    }), t.addEventListener("touchend", (a) => {
      a.stopPropagation(), t.style.transitionProperty = "left, opacity", o > 50 && p(), o < -50 && b(), t.style.left = "0";
    }), t.addEventListener("touchcancel", (a) => {
      a.stopPropagation(), t.style.transitionProperty = "left, opacity", t.style.left = "0";
    }), d();
  }
  function x(d, p) {
    h().appendChild(l);
    const b = Math.abs(100 - n.gutter);
    t.style.maxHeight = `${b.toString()}%`, t.style.maxWidth = `${b.toString()}%`, t.style.left = `${(-100 * d).toString()}px`, t.style.transition = `all ease ${n.animationSpeed.toString()}ms`, setTimeout(p, 50);
  }
  function A(d, p) {
    t.addEventListener("error", p), f === !0 ? d() : (t.addEventListener("load", d), t.addEventListener("loadedmetadata", d));
  }
  function g(d, p, b, F) {
    t.style.left = "0", t.style.opacity = "1", setTimeout(() => {
      y(d, p, b, F);
    }, n.animationSpeed);
  }
  function S(d, p) {
    if (d !== E.None) {
      const b = parseInt(t.style.left, 10) || 0;
      t.style.left = `${(b + 100 * d).toString()}px`;
    }
    t.style.opacity = "0", setTimeout(() => {
      p();
    }, n.animationSpeed);
  }
  function $() {
    l.remove();
  }
  return {
    addToDOM: x,
    removeFromDOM: $,
    startLoading: A,
    transitionIn: g,
    transitionOut: S
  };
}
let T = null;
function ve(e, n, r, i) {
  e.enableKeyboard && (T = (o) => {
    o.key === "Escape" && (o.preventDefault(), n()), o.key === "ArrowLeft" && (o.preventDefault(), r()), o.key === "ArrowRight" && (o.preventDefault(), i());
  }, document.addEventListener("keyup", T));
}
function pe() {
  T !== null && document.removeEventListener("keyup", T);
}
const w = document.createElement("div");
w.classList.add("ilb-navigation");
function W(e, n, r, i) {
  for (let o = 0; o < e.length; o++) {
    const t = document.createElement("button");
    t.style.transition = `background-color ${i.toString()}ms ease`;
    const l = () => {
      const f = n();
      if (t.classList.contains("ilb-navigation-active") || f === null || t.parentNode === null)
        return;
      const u = Array.prototype.indexOf.call(
        t.parentNode.childNodes,
        t
      ), m = u < f ? E.Left : E.Right;
      r(u, m);
    };
    t.addEventListener("click", l), t.addEventListener("touchend", l), w.appendChild(t);
  }
}
function ge(e, n, r, i) {
  w.textContent = "", W(e, n, r, i);
  const o = n();
  o !== null && X(o), h().appendChild(w), w.addEventListener("click", (t) => {
    t.stopPropagation();
  }), w.addEventListener("touchend", (t) => {
    t.stopPropagation();
  });
}
function X(e) {
  var n, r;
  for (let i = 0; i < w.children.length; i++)
    (n = w.children.item(i)) == null || n.classList.remove("ilb-navigation-active");
  (r = w.children.item(e)) == null || r.classList.add("ilb-navigation-active");
}
function be(e, n) {
  let r = e.dataset.ilb2Id;
  r ?? (r = `a${((1 + Math.random()) * 65536 | 0).toString(16)}`), e.dataset.ilb2VideoId = r;
  const i = r, o = document.createElement("video");
  o.setAttribute("id", "ilb-image"), o.preload = "metadata", o.dataset.ilb2VideoId = i;
  let t = !1, l = !1;
  for (const [y, x] of Object.entries(n))
    switch (y) {
      case "autoplay":
        l = !0;
        break;
      case "controls":
      case "loop":
      case "muted":
      case "poster":
      case "preload":
      case "src":
        o.setAttribute(y, x.toString());
        break;
    }
  if (n.sources)
    for (const y of n.sources) {
      const x = document.createElement("source");
      for (const [A, g] of Object.entries(y))
        x.setAttribute(A, g);
      o.appendChild(x);
    }
  o.addEventListener("loadedmetadata", () => {
    t = !0;
  });
  function f() {
    return i;
  }
  function u() {
    return [o, t];
  }
  function m() {
    return l;
  }
  return {
    element: u,
    id: f,
    shouldAutoplay: m
  };
}
function he() {
  const e = [];
  function n(i) {
    for (const o of i) {
      const t = o.dataset.ilb2Video;
      t !== void 0 && e.push(
        be(o, JSON.parse(t))
      );
    }
  }
  function r(i) {
    return e.find((o) => o.id() === i);
  }
  return {
    add: n,
    get: r
  };
}
function ye(e, n, r) {
  const i = [], o = he();
  let t = null, l = null;
  function f() {
    return n;
  }
  function u() {
    return i;
  }
  function m(a, s) {
    if (l === null)
      return;
    const c = l;
    c.transitionOut(a, () => {
      c.removeFromDOM(), s == null || s();
    });
  }
  function y() {
    l == null || l.transitionIn(
      j,
      $,
      d,
      g
    );
  }
  function x(a) {
    l == null || l.addToDOM(a, () => {
      var c;
      if (t === null)
        return;
      const s = i[t];
      if (e.caption && ie(
        s.dataset.ilb2Caption ?? ((c = s.getElementsByTagName("img").item(0)) == null ? void 0 : c.alt) ?? "",
        e.animationSpeed
      ), y(), e.preloadNext && t + 1 < i.length) {
        const N = i[t + 1], V = document.createElement("img");
        V.setAttribute(
          "src",
          N.getAttribute("href") ?? ""
        ), V.setAttribute(
          "srcset",
          N.dataset.ilb2Srcset ?? ""
        ), V.setAttribute(
          "sizes",
          N.dataset.ilb2Sizes ?? ""
        );
      }
      h().dispatchEvent(new Event("ilb:loaded", { bubbles: !0 }));
    });
  }
  function A(a, s) {
    const c = me(i[a], e, o);
    t = a, l = c, c.startLoading(
      () => {
        x(s);
      },
      () => {
        j();
      }
    );
  }
  function g(a = !1) {
    t !== null && (e.activity && q(), pe(), e.history && !a && G(), h().dispatchEvent(new Event("ilb:quit", { bubbles: !0 })), ee(), m(E.None, () => {
      t = null, l = null, ne(), ae(), fe(), _();
    }));
  }
  function S(a, s, c = !1) {
    t !== null && (e.history && !c && K(a, f(), u()), e.activity && q(), X(a), m(s), A(a, s));
  }
  function $() {
    if (t === null)
      return;
    let a = t - 1;
    if (t === 0) {
      if (e.quitOnEnd) {
        g();
        return;
      }
      a = i.length - 1;
    }
    i[a].dispatchEvent(
      new Event("ilb:previous", { bubbles: !0 })
    ), S(a, E.Left);
  }
  function d() {
    if (t === null)
      return;
    let a = t + 1;
    if (t === i.length - 1) {
      if (e.quitOnEnd) {
        g();
        return;
      }
      a = 0;
    }
    i[a].dispatchEvent(
      new Event("ilb:next", { bubbles: !0 })
    ), S(a, E.Right);
  }
  function p(a, s = !1) {
    t === null && (Y(e.animationSpeed, e.quitOnDocClick, g), e.activity && q(), ve(e, g, $, d), e.arrows && te($, d), e.button && oe(g), e.fullscreen && re && ue(), e.overlay && Z(), e.history && !s && K(a, f(), u()), i[a].dispatchEvent(
      new Event("ilb:start", { bubbles: !0 })
    ), A(a, E.None), e.navigation && ge(
      u(),
      () => t,
      S,
      e.animationSpeed
    ));
  }
  function b(a) {
    const s = i.indexOf(a);
    s < 0 || p(s);
  }
  function F(a) {
    const s = a.filter((c) => !i.includes(c)).filter(
      (c) => c.tagName.toLowerCase() === "a" && (new RegExp(`.(${e.allowedTypes})$`, "i").test(c.href) || c.dataset.ilb2Srcset !== void 0 || c.dataset.ilb2Video !== void 0)
    );
    o.add(s), i.push(...s);
    for (const c of s)
      c.addEventListener("click", (N) => {
        N.preventDefault(), N.stopPropagation(), b(c);
      });
    W(
      s,
      () => t,
      S,
      e.animationSpeed
    );
  }
  return F(r), e.history && window.addEventListener("popstate", (a) => {
    U(a, f(), u(), t, p, g, S);
  }), {
    addImages: F,
    close: g,
    images: u,
    next: d,
    open: p,
    openWithImage: b,
    previous: $,
    set: f
  };
}
class Ee {
  constructor(n, r) {
    const i = {
      activity: !0,
      allowedTypes: "",
      animationSpeed: 250,
      arrows: !0,
      button: !0,
      caption: !1,
      enableKeyboard: !0,
      fullscreen: !0,
      gutter: 10,
      history: !1,
      navigation: !1,
      overlay: !0,
      preloadNext: !0,
      quitOnDocClick: !0,
      quitOnEnd: !0,
      quitOnImgClick: !1,
      ...r
    };
    this.s = ye(
      i,
      n.length > 0 ? n[0].dataset.imagelightbox ?? "" : "",
      Array.from(n)
    ), i.history && this.openHistory();
  }
  addImages(n) {
    this.s.addImages(Array.from(n));
  }
  close() {
    this.s.close();
  }
  next() {
    this.s.next();
  }
  open(n) {
    n !== void 0 ? this.s.openWithImage(n) : this.s.open(0);
  }
  openHistory() {
    J(
      this.s.set(),
      this.s.images(),
      (n, r) => {
        this.s.open(n, r);
      }
    );
  }
  previous() {
    this.s.previous();
  }
}
export {
  Ee as ImageLightbox
};
//# sourceMappingURL=imagelightbox.js.map
