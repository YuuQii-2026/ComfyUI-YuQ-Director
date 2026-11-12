var Ft, me, ur, qe, Cn, hr, mr, Qt, $t, ht, fr, pn, nn, rn, zt = {}, At = [], po = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i, Gt = Array.isArray;
function Ue(e, t) {
  for (var r in t) e[r] = t[r];
  return e;
}
function un(e) {
  e && e.parentNode && e.parentNode.removeChild(e);
}
function uo(e, t, r) {
  var o, i, a, l = {};
  for (a in t) a == "key" ? o = t[a] : a == "ref" ? i = t[a] : l[a] = t[a];
  if (arguments.length > 2 && (l.children = arguments.length > 3 ? Ft.call(arguments, 2) : r), typeof e == "function" && e.defaultProps != null) for (a in e.defaultProps) l[a] === void 0 && (l[a] = e.defaultProps[a]);
  return It(e, l, o, i, null);
}
function It(e, t, r, o, i) {
  var a = { type: e, props: t, key: r, ref: o, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: i ?? ++ur, __i: -1, __u: 0 };
  return i == null && me.vnode != null && me.vnode(a), a;
}
function Vt(e) {
  return e.children;
}
function Pt(e, t) {
  this.props = e, this.context = t;
}
function Ze(e, t) {
  if (t == null) return e.__ ? Ze(e.__, e.__i + 1) : null;
  for (var r; t < e.__k.length; t++) if ((r = e.__k[t]) != null && r.__e != null) return r.__e;
  return typeof e.type == "function" ? Ze(e) : null;
}
function ho(e) {
  if (e.__P && e.__d) {
    var t = e.__v, r = t.__e, o = [], i = [], a = Ue({}, t);
    a.__v = t.__v + 1, me.vnode && me.vnode(a), hn(e.__P, a, t, e.__n, e.__P.namespaceURI, 32 & t.__u ? [r] : null, o, r ?? Ze(t), !!(32 & t.__u), i), a.__v = t.__v, a.__.__k[a.__i] = a, wr(o, a, i), t.__e = t.__ = null, a.__e != r && gr(a);
  }
}
function gr(e) {
  if ((e = e.__) != null && e.__c != null) return e.__e = e.__c.base = null, e.__k.some(function(t) {
    if (t != null && t.__e != null) return e.__e = e.__c.base = t.__e;
  }), gr(e);
}
function En(e) {
  (!e.__d && (e.__d = !0) && qe.push(e) && !Tt.__r++ || Cn != me.debounceRendering) && ((Cn = me.debounceRendering) || hr)(Tt);
}
function Tt() {
  try {
    for (var e, t = 1; qe.length; ) qe.length > t && qe.sort(mr), e = qe.shift(), t = qe.length, ho(e);
  } finally {
    qe.length = Tt.__r = 0;
  }
}
function br(e, t, r, o, i, a, l, s, m, h, d) {
  var f, c, p, b, _, N, k = o && o.__k || At, w = t.length;
  for (m = mo(r, t, k, m, w), f = 0; f < w; f++) (p = r.__k[f]) != null && (c = p.__i != -1 && k[p.__i] || zt, p.__i = f, N = hn(e, p, c, i, a, l, s, m, h, d), b = p.__e, p.ref && c.ref != p.ref && (c.ref && mn(c.ref, null, p), d.push(p.ref, p.__c || b, p)), _ == null && b != null && (_ = b), 4 & p.__u ? (m = xr(p, m, e), c.__e && (c.__e = null)) : typeof p.type == "function" && N !== void 0 ? m = N : b && (m = b.nextSibling), p.__u &= -7);
  return r.__e = _, m;
}
function mo(e, t, r, o, i) {
  var a, l, s, m, h, d = r.length, f = d, c = 0;
  for (e.__k = new Array(i), a = 0; a < i; a++) (l = t[a]) != null && typeof l != "boolean" && typeof l != "function" ? (typeof l == "string" || typeof l == "number" || typeof l == "bigint" || l.constructor == String ? l = e.__k[a] = It(null, l, null, null, null) : Gt(l) ? l = e.__k[a] = It(Vt, { children: l }, null, null, null) : l.constructor === void 0 && l.__b > 0 ? l = e.__k[a] = It(l.type, l.props, l.key, l.ref ? l.ref : null, l.__v) : e.__k[a] = l, m = a + c, l.__ = e, l.__b = e.__b + 1, s = null, (h = l.__i = fo(l, r, m, f)) != -1 && (f--, (s = r[h]) && (s.__u |= 2)), s == null || s.__v == null ? (h == -1 && (i > d ? c-- : i < d && c++), typeof l.type != "function" && (l.__u |= 4)) : h != m && (h == m - 1 ? c-- : h == m + 1 ? c++ : (h > m ? c-- : c++, l.__u |= 4))) : e.__k[a] = null;
  if (f) for (a = 0; a < d; a++) (s = r[a]) != null && (2 & s.__u) == 0 && (s.__e == o && (o = Ze(s)), _r(s, s));
  return o;
}
function xr(e, t, r) {
  var o, i;
  if (typeof e.type == "function") {
    for (o = e.__k, i = 0; o && i < o.length; i++) o[i] && (o[i].__ = e, t = xr(o[i], t, r));
    return t;
  }
  e.__e != t && (t && e.type && !t.parentNode && (t = Ze(e)), t = r.insertBefore(e.__e, t || null));
  do
    t = t && t.nextSibling;
  while (t != null && t.nodeType == 8);
  return t;
}
function fo(e, t, r, o) {
  var i, a, l, s = e.key, m = e.type, h = t[r], d = h != null && (2 & h.__u) == 0;
  if (h === null && s == null || d && s == h.key && m == h.type) return r;
  if (o > (d ? 1 : 0)) {
    for (i = r - 1, a = r + 1; i >= 0 || a < t.length; ) if ((h = t[l = i >= 0 ? i-- : a++]) != null && (2 & h.__u) == 0 && s == h.key && m == h.type) return l;
  }
  return -1;
}
function zn(e, t, r) {
  t[0] == "-" ? e.setProperty(t, r ?? "") : e[t] = r == null ? "" : typeof r != "number" || po.test(t) ? r : r + "px";
}
function St(e, t, r, o, i) {
  var a, l;
  e: if (t == "style") if (typeof r == "string") e.style.cssText = r;
  else {
    if (typeof o == "string" && (e.style.cssText = o = ""), o) for (t in o) r && t in r || zn(e.style, t, "");
    if (r) for (t in r) o && r[t] == o[t] || zn(e.style, t, r[t]);
  }
  else if (t[0] == "o" && t[1] == "n") a = t != (t = t.replace(fr, "$1")), l = t.toLowerCase(), t = l in e || t == "onFocusOut" || t == "onFocusIn" ? l.slice(2) : t.slice(2), e.l || (e.l = {}), e.l[t + a] = r, r ? o ? r[ht] = o[ht] : (r[ht] = pn, e.addEventListener(t, a ? rn : nn, a)) : e.removeEventListener(t, a ? rn : nn, a);
  else {
    if (i == "http://www.w3.org/2000/svg") t = t.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
    else if (t != "width" && t != "height" && t != "href" && t != "list" && t != "form" && t != "tabIndex" && t != "download" && t != "rowSpan" && t != "colSpan" && t != "role" && t != "popover" && t in e) try {
      e[t] = r ?? "";
      break e;
    } catch {
    }
    typeof r == "function" || (r == null || r === !1 && t[4] != "-" ? e.removeAttribute(t) : e.setAttribute(t, t == "popover" && r == 1 ? "" : r));
  }
}
function An(e) {
  return function(t) {
    if (this.l) {
      var r = this.l[t.type + e];
      if (t[$t] == null) t[$t] = pn++;
      else if (t[$t] < r[ht]) return;
      return r(me.event ? me.event(t) : t);
    }
  };
}
function hn(e, t, r, o, i, a, l, s, m, h) {
  var d, f, c, p, b, _, N, k, w, z, g, $, T, C, S, L, V = t.type;
  if (t.constructor !== void 0) return null;
  128 & r.__u && (m = !!(32 & r.__u), a = [s = t.__e = r.__e]), (d = me.__b) && d(t);
  e: if (typeof V == "function") {
    f = l.length;
    try {
      if (w = t.props, z = V.prototype && V.prototype.render, g = (d = V.contextType) && o[d.__c], $ = d ? g ? g.props.value : d.__ : o, r.__c ? k = (c = t.__c = r.__c).__ = c.__E : (z ? t.__c = c = new V(w, $) : (t.__c = c = new Pt(w, $), c.constructor = V, c.render = bo), g && g.sub(c), c.state || (c.state = {}), c.__n = o, p = c.__d = !0, c.__h = [], c._sb = []), z && c.__s == null && (c.__s = c.state), z && V.getDerivedStateFromProps != null && (c.__s == c.state && (c.__s = Ue({}, c.__s)), Ue(c.__s, V.getDerivedStateFromProps(w, c.__s))), b = c.props, _ = c.state, c.__v = t, p) z && V.getDerivedStateFromProps == null && c.componentWillMount != null && c.componentWillMount(), z && c.componentDidMount != null && c.__h.push(c.componentDidMount);
      else {
        if (z && V.getDerivedStateFromProps == null && w !== b && c.componentWillReceiveProps != null && c.componentWillReceiveProps(w, $), t.__v == r.__v || !c.__e && c.shouldComponentUpdate != null && c.shouldComponentUpdate(w, c.__s, $) === !1) {
          t.__v != r.__v && (c.props = w, c.state = c.__s, c.__d = !1), t.__e = r.__e, t.__k = r.__k, t.__k.some(function(O) {
            O && (O.__ = t);
          }), At.push.apply(c.__h, c._sb), c._sb = [], c.__h.length && l.push(c), s = Ze(r);
          break e;
        }
        c.componentWillUpdate != null && c.componentWillUpdate(w, c.__s, $), z && c.componentDidUpdate != null && c.__h.push(function() {
          c.componentDidUpdate(b, _, N);
        });
      }
      if (c.context = $, c.props = w, c.__P = e, c.__e = !1, T = me.__r, C = 0, z) c.state = c.__s, c.__d = !1, T && T(t), d = c.render(c.props, c.state, c.context), At.push.apply(c.__h, c._sb), c._sb = [];
      else do
        c.__d = !1, T && T(t), d = c.render(c.props, c.state, c.context), c.state = c.__s;
      while (c.__d && ++C < 25);
      c.state = c.__s, c.getChildContext != null && (o = Ue(Ue({}, o), c.getChildContext())), z && !p && c.getSnapshotBeforeUpdate != null && (N = c.getSnapshotBeforeUpdate(b, _)), S = d != null && d.type === Vt && d.key == null ? yr(d.props.children) : d, s = br(e, Gt(S) ? S : [S], t, r, o, i, a, l, s, m, h), c.base = t.__e, t.__u &= -161, c.__h.length && l.push(c), k && (c.__E = c.__ = null);
    } catch (O) {
      if (l.length = f, t.__v = null, m || a != null) {
        if (O.then) {
          for (t.__u |= m ? 160 : 128; s && s.nodeType == 8 && s.nextSibling; ) s = s.nextSibling;
          a != null && (a[a.indexOf(s)] = null), t.__e = s;
        } else if (a != null) for (L = a.length; L--; ) un(a[L]);
      } else t.__e = r.__e;
      t.__k == null && (t.__k = r.__k || []), O.then || vr(t), me.__e(O, t, r);
    }
  } else a == null && t.__v == r.__v ? (t.__k = r.__k, t.__e = r.__e) : s = t.__e = go(r.__e, t, r, o, i, a, l, m, h);
  return (d = me.diffed) && d(t), 128 & t.__u ? void 0 : s;
}
function vr(e) {
  e && (e.__c && (e.__c.__e = !0), e.__k && e.__k.some(vr));
}
function wr(e, t, r) {
  for (var o = 0; o < r.length; o++) mn(r[o], r[++o], r[++o]);
  me.__c && me.__c(t, e), e.some(function(i) {
    try {
      e = i.__h, i.__h = [], e.some(function(a) {
        a.call(i);
      });
    } catch (a) {
      me.__e(a, i.__v);
    }
  });
}
function yr(e) {
  return typeof e != "object" || e == null || e.__b > 0 ? e : Gt(e) ? e.map(yr) : e.constructor !== void 0 ? null : Ue({}, e);
}
function go(e, t, r, o, i, a, l, s, m) {
  var h, d, f, c, p, b, _, N = r.props || zt, k = t.props, w = t.type;
  if (w == "svg" ? i = "http://www.w3.org/2000/svg" : w == "math" ? i = "http://www.w3.org/1998/Math/MathML" : i || (i = "http://www.w3.org/1999/xhtml"), a != null) {
    for (h = 0; h < a.length; h++) if ((p = a[h]) && "setAttribute" in p == !!w && (w ? p.localName == w : p.nodeType == 3)) {
      e = p, a[h] = null;
      break;
    }
  }
  if (e == null) {
    if (w == null) return document.createTextNode(k);
    e = document.createElementNS(i, w, k.is && k), s && (me.__m && me.__m(t, a), s = !1), a = null;
  }
  if (w == null) N === k || s && e.data == k || (e.data = k);
  else {
    if (a = w == "textarea" && k.defaultValue != null ? null : a && Ft.call(e.childNodes), !s && a != null) for (N = {}, h = 0; h < e.attributes.length; h++) N[(p = e.attributes[h]).name] = p.value;
    for (h in N) p = N[h], h == "dangerouslySetInnerHTML" ? f = p : h == "children" || h in k || h == "value" && "defaultValue" in k || h == "checked" && "defaultChecked" in k || St(e, h, null, p, i);
    for (h in k) p = k[h], h == "children" ? c = p : h == "dangerouslySetInnerHTML" ? d = p : h == "value" ? b = p : h == "checked" ? _ = p : s && typeof p != "function" || N[h] === p || St(e, h, p, N[h], i);
    if (d) s || f && (d.__html == f.__html || d.__html == e.innerHTML) || (e.innerHTML = d.__html), t.__k = [];
    else if (f && (e.innerHTML = ""), br(t.type == "template" ? e.content : e, Gt(c) ? c : [c], t, r, o, w == "foreignObject" ? "http://www.w3.org/1999/xhtml" : i, a, l, a ? a[0] : r.__k && Ze(r, 0), s, m), a != null) for (h = a.length; h--; ) un(a[h]);
    s && w != "textarea" || (h = "value", w == "progress" && b == null ? e.removeAttribute("value") : b != null && (b !== e[h] || w == "progress" && !b || w == "option" && b != N[h]) && St(e, h, b, N[h], i), h = "checked", _ != null && _ != e[h] && St(e, h, _, N[h], i));
  }
  return e;
}
function mn(e, t, r) {
  try {
    if (typeof e == "function") {
      var o = typeof e.__u == "function";
      o && e.__u(), o && t == null || (e.__u = e(t));
    } else e.current = t;
  } catch (i) {
    me.__e(i, r);
  }
}
function _r(e, t, r) {
  var o, i;
  if (me.unmount && me.unmount(e), (o = e.ref) && (o.current && o.current != e.__e || mn(o, null, t)), (o = e.__c) != null) {
    if (o.componentWillUnmount) try {
      o.componentWillUnmount();
    } catch (a) {
      me.__e(a, t);
    }
    o.base = o.__P = o.__n = null;
  }
  if (o = e.__k) for (i = 0; i < o.length; i++) o[i] && _r(o[i], t, r || typeof e.type != "function");
  r || un(e.__e), e.__c = e.__ = e.__e = void 0;
}
function bo(e, t, r) {
  return this.constructor(e, r);
}
function Tn(e, t, r) {
  var o, i, a, l;
  t == document && (t = document.documentElement), me.__ && me.__(e, t), i = (o = !1) ? null : t.__k, a = [], l = [], hn(t, e = t.__k = uo(Vt, null, [e]), i || zt, zt, t.namespaceURI, i ? null : t.firstChild ? Ft.call(t.childNodes) : null, a, i ? i.__e : t.firstChild, o, l), wr(a, e, l), e.props.children = null;
}
Ft = At.slice, me = { __e: function(e, t, r, o) {
  for (var i, a, l; t = t.__; ) if ((i = t.__c) && !i.__) try {
    if ((a = i.constructor) && a.getDerivedStateFromError != null && (i.setState(a.getDerivedStateFromError(e)), l = i.__d), i.componentDidCatch != null && (i.componentDidCatch(e, o || {}), l = i.__d), l) return i.__E = i;
  } catch (s) {
    e = s;
  }
  throw e;
} }, ur = 0, Pt.prototype.setState = function(e, t) {
  var r;
  r = this.__s != null && this.__s != this.state ? this.__s : this.__s = Ue({}, this.state), typeof e == "function" && (e = e(Ue({}, r), this.props)), e && Ue(r, e), e != null && this.__v && (t && this._sb.push(t), En(this));
}, Pt.prototype.forceUpdate = function(e) {
  this.__v && (this.__e = !0, e && this.__h.push(e), En(this));
}, Pt.prototype.render = Vt, qe = [], hr = typeof Promise == "function" ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, mr = function(e, t) {
  return e.__v.__b - t.__v.__b;
}, Tt.__r = 0, Qt = Math.random().toString(8), $t = "__d" + Qt, ht = "__a" + Qt, fr = /(PointerCapture)$|Capture$/i, pn = 0, nn = An(!1), rn = An(!0);
var xo = 0;
function n(e, t, r, o, i, a) {
  t || (t = {});
  var l, s, m = t;
  if ("ref" in m) for (s in m = {}, t) s == "ref" ? l = t[s] : m[s] = t[s];
  var h = { type: e, props: m, key: r, ref: l, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --xo, __i: -1, __u: 0, __source: i, __self: a };
  if (typeof e == "function" && (l = e.defaultProps)) for (s in l) m[s] === void 0 && (m[s] = l[s]);
  return me.vnode && me.vnode(h), h;
}
var it, ve, Yt, jn, jt = 0, kr = [], we = me, Nn = we.__b, Ln = we.__r, Mn = we.diffed, Rn = we.__c, Dn = we.unmount, On = we.__;
function Ht(e, t) {
  we.__h && we.__h(ve, e, jt || t), jt = 0;
  var r = ve.__H || (ve.__H = { __: [], __h: [] });
  return e >= r.__.length && r.__.push({}), r.__[e];
}
function R(e) {
  return jt = 1, vo(Sr, e);
}
function vo(e, t, r) {
  var o = Ht(it++, 2);
  if (o.t = e, !o.__c && (o.__ = [Sr(void 0, t), function(s) {
    var m = o.__N ? o.__N[0] : o.__[0], h = o.t(m, s);
    m !== h && (o.__N = [h, o.__[1]], o.__c.setState({}));
  }], o.__c = ve, !ve.__f)) {
    var i = function(s, m, h) {
      if (!o.__c.__H) return !0;
      var d = !1, f = o.__c.props !== s;
      if (o.__c.__H.__.some(function(p) {
        if (p.__N) {
          d = !0;
          var b = p.__[0];
          p.__ = p.__N, p.__N = void 0, b !== p.__[0] && (f = !0);
        }
      }), a) {
        var c = a.call(this, s, m, h);
        return d ? c || f : c;
      }
      return !d || f;
    };
    ve.__f = !0;
    var a = ve.shouldComponentUpdate, l = ve.componentWillUpdate;
    ve.componentWillUpdate = function(s, m, h) {
      if (this.__e) {
        var d = a;
        a = void 0, i(s, m, h), a = d;
      }
      l && l.call(this, s, m, h);
    }, ve.shouldComponentUpdate = i;
  }
  return o.__N || o.__;
}
function Pe(e, t) {
  var r = Ht(it++, 3);
  !we.__s && fn(r.__H, t) && (r.__ = e, r.u = t, ve.__H.__h.push(r));
}
function wo(e, t) {
  var r = Ht(it++, 4);
  !we.__s && fn(r.__H, t) && (r.__ = e, r.u = t, ve.__h.push(r));
}
function ke(e) {
  return jt = 5, Ve(function() {
    return { current: e };
  }, []);
}
function Ve(e, t) {
  var r = Ht(it++, 7);
  return fn(r.__H, t) && (r.__ = e(), r.__H = t, r.__h = e), r.__;
}
function yo() {
  for (var e; e = kr.shift(); ) {
    var t = e.__H;
    if (e.__P && t) try {
      t.__h.some(Ct), t.__h.some(on), t.__h = [];
    } catch (r) {
      t.__h = [], we.__e(r, e.__v);
    }
  }
}
we.__b = function(e) {
  ve = null, Nn && Nn(e);
}, we.__ = function(e, t) {
  e && t.__k && t.__k.__m && (e.__m = t.__k.__m), On && On(e, t);
}, we.__r = function(e) {
  Ln && Ln(e), it = 0;
  var t = (ve = e.__c).__H;
  t && (Yt === ve ? (t.__h = [], ve.__h = [], t.__.some(function(r) {
    r.__N && (r.__ = r.__N), r.u = r.__N = void 0;
  })) : (t.__h.some(Ct), t.__h.some(on), t.__h = [], it = 0)), Yt = ve;
}, we.diffed = function(e) {
  Mn && Mn(e);
  var t = e.__c;
  t && t.__H && (t.__H.__h.length && (kr.push(t) !== 1 && jn === we.requestAnimationFrame || ((jn = we.requestAnimationFrame) || _o)(yo)), t.__H.__.some(function(r) {
    r.u && (r.__H = r.u, r.u = void 0);
  })), Yt = ve = null;
}, we.__c = function(e, t) {
  t.some(function(r) {
    try {
      r.__h.some(Ct), r.__h = r.__h.filter(function(o) {
        return !o.__ || on(o);
      });
    } catch (o) {
      t.some(function(i) {
        i.__h && (i.__h = []);
      }), t = [], we.__e(o, r.__v);
    }
  }), Rn && Rn(e, t);
}, we.unmount = function(e) {
  Dn && Dn(e);
  var t, r = e.__c;
  r && r.__H && (r.__H.__.some(function(o) {
    try {
      Ct(o);
    } catch (i) {
      t = i;
    }
  }), r.__H = void 0, t && we.__e(t, r.__v));
};
var Un = typeof requestAnimationFrame == "function";
function _o(e) {
  var t, r = function() {
    clearTimeout(o), Un && cancelAnimationFrame(t), setTimeout(e);
  }, o = setTimeout(r, 35);
  Un && (t = requestAnimationFrame(r));
}
function Ct(e) {
  var t = ve, r = e.__c;
  typeof r == "function" && (e.__c = void 0, r()), ve = t;
}
function on(e) {
  var t = ve;
  e.__c = e.__(), ve = t;
}
function fn(e, t) {
  return !e || e.length !== t.length || t.some(function(r, o) {
    return r !== e[o];
  });
}
function Sr(e, t) {
  return typeof t == "function" ? t(e) : t;
}
async function $r(e) {
  var a;
  if ((a = navigator.clipboard) != null && a.writeText)
    try {
      await navigator.clipboard.writeText(e);
      return;
    } catch {
    }
  const t = document.activeElement, r = t instanceof HTMLTextAreaElement || t instanceof HTMLInputElement ? { start: t.selectionStart, end: t.selectionEnd, direction: t.selectionDirection } : null, o = document.createElement("textarea");
  o.value = e, o.style.position = "fixed", o.style.opacity = "0", document.body.append(o), o.select();
  const i = document.execCommand("copy");
  if (o.remove(), t instanceof HTMLElement && t.focus({ preventScroll: !0 }), r && (t instanceof HTMLTextAreaElement || t instanceof HTMLInputElement) && t.setSelectionRange(r.start, r.end, r.direction ?? void 0), !i) throw new Error("浏览器拒绝写入剪贴板");
}
function Ie(e, t) {
  const r = e.trim().replace(/\\/g, "/").replace(/^\.\//, "");
  if (!r || r.startsWith("/") || /^[A-Za-z]:\//.test(r)) return null;
  const o = r.split("/").filter(Boolean), i = o.pop();
  if (!i || o.some((l) => l === "..")) return null;
  const a = new URLSearchParams({ filename: i, type: t });
  return o.length && a.set("subfolder", o.join("/")), `/view?${a.toString()}`;
}
function Ir(e) {
  return Ie(e, "input");
}
function Ce(e) {
  return e.trim().replace(/\\/g, "/").split("/").filter(Boolean).pop() ?? "";
}
function Pr({ asset: e, compact: t = !1 }) {
  const r = Ir(e.path), o = `td-media-preview ${t ? "compact" : ""}`;
  return r ? e.kind === "image" ? /* @__PURE__ */ n("div", { class: o, children: /* @__PURE__ */ n("img", { src: r, alt: e.alias, loading: "lazy" }) }) : e.kind === "video" ? /* @__PURE__ */ n("div", { class: o, children: /* @__PURE__ */ n("video", { src: r, controls: !0, preload: "metadata", playsInline: !0 }) }) : /* @__PURE__ */ n("div", { class: o, children: /* @__PURE__ */ n("audio", { src: r, controls: !0, preload: "metadata" }) }) : e.path ? /* @__PURE__ */ n("div", { class: `${o} unavailable`, children: "该路径无法在浏览器中预览 / Preview unavailable" }) : /* @__PURE__ */ n("div", { class: `${o} empty`, children: "尚未选择素材 / No media selected" });
}
function Cr(e, t) {
  return t === "image" ? Promise.resolve(null) : new Promise((r) => {
    const o = document.createElement(t === "video" ? "video" : "audio"), i = URL.createObjectURL(e);
    let a = !1;
    const l = (s) => {
      a || (a = !0, o.onloadedmetadata = null, o.onerror = null, o.removeAttribute("src"), o.load(), URL.revokeObjectURL(i), r(s));
    };
    o.preload = "metadata", o.onloadedmetadata = () => l(Number.isFinite(o.duration) && o.duration > 0 ? Math.round(o.duration * 10) / 10 : null), o.onerror = () => l(null), o.src = i;
  });
}
const ko = (e) => `${e}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`, sn = { image: "图片", video: "视频", audio: "音频" }, Fn = ["角色", "场景", "道具", "声音"];
function So(e, t) {
  const r = ko(e);
  return { id: r, alias: r, kind: e, path: "", enabled: !0, fixed: !1, fixedOrder: t, shotIds: [], includeVideoAudio: !1, durationSeconds: e === "image" ? null : 6, audioDurationSeconds: null, fingerprint: "" };
}
function Gn(e, t) {
  var r;
  return (r = e.group) != null && r.trim() ? e.group.trim() : t === "zh" ? `${sn[e.kind]}素材` : `${e.kind} assets`;
}
function $o({ plan: e, language: t, mutate: r, uploadAsset: o, importingDisabled: i, onImportLibrary: a, onExportLibrary: l, onOpenBatch: s, onGenerateImage: m, onBatchGenerateImages: h, notify: d }) {
  const f = (O, U) => t === "zh" ? O : U, [c, p] = R({}), [b, _] = R({}), [N, k] = R(""), [w, z] = R(!1), g = e.assets.filter((O) => O.enabled && !O.path.trim()), $ = w ? e.assets.filter((O) => g.includes(O) || c[O.id] !== void 0) : e.assets, T = /* @__PURE__ */ new Map();
  for (const O of $) {
    const U = c[O.id] ?? Gn(O, t);
    T.set(U, [...T.get(U) ?? [], O]);
  }
  const C = [...T.entries()].sort(([O], [U]) => {
    const P = (oe) => {
      const y = Fn.indexOf(oe);
      return y < 0 ? Fn.length : y;
    };
    return P(O) - P(U) || O.localeCompare(U, "zh");
  }), S = (O, U) => r((P) => {
    const oe = P.assets.find((y) => y.id === O);
    oe && U(oe);
  }), L = async (O, U) => {
    _((P) => ({ ...P, [O.id]: U.name }));
    try {
      const [P, oe] = await Promise.all([o(e.project.name, O.kind, U), Cr(U, O.kind)]);
      S(O.id, (y) => {
        y.path = P, O.kind !== "image" && oe != null && (y.durationSeconds = oe);
      }), d(f(`已上传 ${O.alias}`, `Uploaded ${O.alias}`));
    } catch (P) {
      d(`${f("上传失败", "Upload failed")}：${P instanceof Error ? P.message : String(P)}`, "error");
    } finally {
      _((P) => {
        const oe = { ...P };
        return delete oe[O.id], oe;
      });
    }
  }, V = async (O, U) => {
    try {
      await $r(O), d(U);
    } catch (P) {
      d(`${f("复制失败", "Copy failed")}：${String(P)}`, "error");
    }
  };
  return /* @__PURE__ */ n("div", { class: "td-assets-panel", children: [
    /* @__PURE__ */ n("div", { class: "td-assets-toolbar", children: [
      /* @__PURE__ */ n("div", { class: "td-assets-summary", children: [
        /* @__PURE__ */ n("strong", { children: f(`共 ${e.assets.length} 项素材`, `${e.assets.length} assets`) }),
        g.length ? /* @__PURE__ */ n("span", { class: "td-chip warn", children: f(`${g.length} 项待上传`, `${g.length} missing`) }) : /* @__PURE__ */ n("span", { class: "td-chip ok", children: f("全部就绪", "All ready") }),
        /* @__PURE__ */ n("label", { class: "td-inline-check", children: [
          /* @__PURE__ */ n("input", { type: "checkbox", checked: w, onChange: (O) => z(O.currentTarget.checked) }),
          f("只看待上传", "Missing only")
        ] })
      ] }),
      /* @__PURE__ */ n("div", { class: "td-assets-actions", children: [
        /* @__PURE__ */ n("label", { class: "td-button", title: f("载入共用素材清单与远程文件路径，保留当前分镜", "Load a shared library and remote media paths; preserve current shots"), children: [
          f("导入素材库", "Import library"),
          /* @__PURE__ */ n("input", { type: "file", accept: "application/json,.json", disabled: i, onChange: (O) => {
            var oe;
            const U = O.currentTarget, P = (oe = U.files) == null ? void 0 : oe[0];
            U.value = "", P && a(P);
          } })
        ] }),
        /* @__PURE__ */ n("button", { onClick: l, children: f("导出素材库", "Export library") }),
        ["image", "video", "audio"].map((O) => /* @__PURE__ */ n("button", { onClick: () => r((U) => {
          U.assets.push(So(O, U.assets.length + 1));
        }), children: [
          "＋ ",
          f(sn[O], O)
        ] })),
        /* @__PURE__ */ n("button", { class: "accent", onClick: s, children: [
          "⇪ ",
          f("批量导入 / 按文件名填充", "Batch import / fill by name")
        ] }),
        /* @__PURE__ */ n("button", { class: "primary", disabled: i || !h, onClick: h, children: f("批量生图", "Batch generate images") })
      ] })
    ] }),
    !e.assets.length && /* @__PURE__ */ n("div", { class: "td-empty-state", children: [
      /* @__PURE__ */ n("strong", { children: f("素材库为空", "No assets yet") }),
      /* @__PURE__ */ n("p", { children: f("导入 skill 生成的 .assets.json 共用素材库，或已上传后导出的素材库，即可载入角色、场景和声音参考。每集用顶部“导入分镜”切换。", "Import a shared .assets.json library with character, scene and voice references. Use Import shots to switch episodes.") })
    ] }),
    C.map(([O, U]) => /* @__PURE__ */ n("section", { class: "td-asset-group", children: [
      /* @__PURE__ */ n("h3", { children: [
        O,
        /* @__PURE__ */ n("span", { children: U.length })
      ] }),
      /* @__PURE__ */ n("div", { class: "td-asset-grid", children: U.map((P) => {
        const oe = !!P.path.trim(), y = c[P.id] !== void 0, D = `{{ref:${P.alias}}}`;
        return /* @__PURE__ */ n(
          "article",
          {
            class: `td-asset-card ${y ? "expanded" : ""} ${oe ? "" : "missing"} ${P.enabled ? "" : "disabled"} ${N === P.id ? "dragging" : ""}`,
            onDragOver: (j) => {
              j.preventDefault(), k(P.id);
            },
            onDragLeave: () => k((j) => j === P.id ? "" : j),
            onDrop: (j) => {
              var te, X;
              j.preventDefault(), k("");
              const H = (X = (te = j.dataTransfer) == null ? void 0 : te.files) == null ? void 0 : X[0];
              H && L(P, H);
            },
            children: [
              /* @__PURE__ */ n("div", { class: "td-asset-card-media", children: [
                oe ? /* @__PURE__ */ n(Pr, { asset: P, compact: !0 }) : /* @__PURE__ */ n("label", { class: "td-asset-drop", children: [
                  /* @__PURE__ */ n("span", { children: b[P.id] ? f("上传中…", "Uploading…") : f("拖入文件或点击上传", "Drop or click to upload") }),
                  /* @__PURE__ */ n("small", { children: [
                    f("建议文件名", "Suggested name"),
                    "：",
                    P.alias,
                    ".",
                    P.kind === "image" ? "png" : P.kind === "video" ? "mp4" : "wav"
                  ] }),
                  /* @__PURE__ */ n("input", { type: "file", accept: `${P.kind}/*`, onChange: (j) => {
                    var X;
                    const H = j.currentTarget, te = (X = H.files) == null ? void 0 : X[0];
                    H.value = "", te && L(P, te);
                  } })
                ] }),
                /* @__PURE__ */ n("span", { class: "td-asset-kind", children: [
                  f(sn[P.kind], P.kind),
                  P.kind !== "image" && P.durationSeconds ? ` · ${P.durationSeconds}s` : ""
                ] }),
                /* @__PURE__ */ n("span", { class: `td-asset-status ${oe ? "ok" : "warn"}`, children: b[P.id] ? f("上传中", "Uploading") : oe ? f("已就绪", "Ready") : f("待上传", "Missing") })
              ] }),
              /* @__PURE__ */ n("div", { class: "td-asset-card-body", children: [
                /* @__PURE__ */ n("div", { class: "td-asset-card-title", children: [
                  /* @__PURE__ */ n("input", { "aria-label": f("别名", "Alias"), value: P.alias, onInput: (j) => S(P.id, (H) => {
                    H.alias = j.currentTarget.value;
                  }) }),
                  /* @__PURE__ */ n("button", { title: f(`复制引用 ${D}`, `Copy ${D}`), onClick: () => void V(D, f(`已复制 ${D}`, `Copied ${D}`)), children: "{ }" })
                ] }),
                P.note && /* @__PURE__ */ n("p", { class: "td-asset-note", title: P.note, children: P.note }),
                /* @__PURE__ */ n("div", { class: "td-asset-card-actions", children: [
                  P.kind === "image" && /* @__PURE__ */ n("button", { class: "accent", disabled: i || !m, onClick: () => m == null ? void 0 : m(P), children: f("自动生图", "Generate image") }),
                  oe && /* @__PURE__ */ n("label", { class: "td-file-label", children: [
                    b[P.id] ? f("上传中…", "Uploading…") : f("替换文件", "Replace"),
                    /* @__PURE__ */ n("input", { type: "file", accept: `${P.kind}/*`, onChange: (j) => {
                      var X;
                      const H = j.currentTarget, te = (X = H.files) == null ? void 0 : X[0];
                      H.value = "", te && L(P, te);
                    } })
                  ] }),
                  P.genPrompt && /* @__PURE__ */ n("button", { class: "accent", onClick: () => void V(P.genPrompt ?? "", f("已复制生成提示词", "Generation prompt copied")), children: f("复制生成提示词", "Copy gen prompt") }),
                  /* @__PURE__ */ n("button", { "aria-expanded": y, "aria-controls": `td-asset-details-${P.id}`, onClick: () => p((j) => {
                    const H = { ...j };
                    return y ? delete H[P.id] : H[P.id] = Gn(P, t), H;
                  }), children: y ? f("收起", "Less") : f("详情", "More") })
                ] }),
                y && /* @__PURE__ */ n("div", { class: "td-asset-details", id: `td-asset-details-${P.id}`, children: [
                  P.genPrompt && /* @__PURE__ */ n("details", { class: "td-gen-prompt", children: [
                    /* @__PURE__ */ n("summary", { children: f("生成提示词", "Generation prompt") }),
                    /* @__PURE__ */ n("pre", { children: P.genPrompt })
                  ] }),
                  /* @__PURE__ */ n("label", { children: [
                    f("输入目录相对路径", "Input-relative path"),
                    /* @__PURE__ */ n("input", { value: P.path, placeholder: "theodore_director/项目名/文件名", onInput: (j) => S(P.id, (H) => {
                      H.path = j.currentTarget.value;
                    }) }),
                    /* @__PURE__ */ n("small", { children: Ce(P.path) })
                  ] }),
                  /* @__PURE__ */ n("div", { class: "td-asset-detail-grid", children: [
                    /* @__PURE__ */ n("label", { children: [
                      f("类型", "Kind"),
                      /* @__PURE__ */ n("select", { value: P.kind, onChange: (j) => S(P.id, (H) => {
                        H.kind = j.currentTarget.value;
                      }), children: [
                        /* @__PURE__ */ n("option", { value: "image", children: f("图片", "image") }),
                        /* @__PURE__ */ n("option", { value: "video", children: f("视频", "video") }),
                        /* @__PURE__ */ n("option", { value: "audio", children: f("音频", "audio") })
                      ] })
                    ] }),
                    /* @__PURE__ */ n("label", { children: [
                      f("分组", "Group"),
                      /* @__PURE__ */ n("input", { "aria-label": f("分组", "Group"), value: P.group ?? "", placeholder: f("角色 / 场景 / 道具 / 声音", "Group"), onInput: (j) => S(P.id, (H) => {
                        H.group = j.currentTarget.value;
                      }) }),
                      /* @__PURE__ */ n("small", { children: f("收起详情后按新分组归类", "Regroup after closing details") })
                    ] }),
                    P.kind !== "image" && /* @__PURE__ */ n("label", { children: [
                      f("时长（秒）", "Duration (s)"),
                      /* @__PURE__ */ n("input", { type: "number", min: "0", step: "0.1", value: P.durationSeconds ?? "", onInput: (j) => S(P.id, (H) => {
                        H.durationSeconds = j.currentTarget.value ? Number(j.currentTarget.value) : null;
                      }) })
                    ] }),
                    /* @__PURE__ */ n("label", { children: [
                      f("固定顺序", "Fixed order"),
                      /* @__PURE__ */ n("input", { type: "number", value: P.fixedOrder, onInput: (j) => S(P.id, (H) => {
                        H.fixedOrder = Number(j.currentTarget.value);
                      }) })
                    ] }),
                    /* @__PURE__ */ n("label", { class: "wide", children: [
                      f("仅用于这些镜头 ID（逗号分隔，留空=全部）", "Limit to shot IDs (comma separated)"),
                      /* @__PURE__ */ n("input", { value: P.shotIds.join(", "), onInput: (j) => S(P.id, (H) => {
                        H.shotIds = j.currentTarget.value.split(",").map((te) => te.trim()).filter(Boolean);
                      }) })
                    ] }),
                    /* @__PURE__ */ n("label", { class: "wide", children: [
                      f("说明", "Note"),
                      /* @__PURE__ */ n("textarea", { rows: 2, value: P.note ?? "", onInput: (j) => S(P.id, (H) => {
                        H.note = j.currentTarget.value;
                      }) })
                    ] })
                  ] }),
                  /* @__PURE__ */ n("div", { class: "td-asset-flags", children: [
                    /* @__PURE__ */ n("label", { class: "td-inline-check", children: [
                      /* @__PURE__ */ n("input", { type: "checkbox", checked: P.enabled, onChange: (j) => S(P.id, (H) => {
                        H.enabled = j.currentTarget.checked;
                      }) }),
                      f("启用", "Enabled")
                    ] }),
                    /* @__PURE__ */ n("label", { class: "td-inline-check", title: f("固定引用会被每个镜头自动加载，即使提示词没有写 {{ref}}", "Fixed assets load in every shot even without {{ref}}"), children: [
                      /* @__PURE__ */ n("input", { type: "checkbox", checked: P.fixed, onChange: (j) => S(P.id, (H) => {
                        H.fixed = j.currentTarget.checked;
                      }) }),
                      f("固定引用", "Always load")
                    ] }),
                    P.kind === "video" && /* @__PURE__ */ n("label", { class: "td-inline-check", children: [
                      /* @__PURE__ */ n("input", { type: "checkbox", checked: P.includeVideoAudio, onChange: (j) => S(P.id, (H) => {
                        H.includeVideoAudio = j.currentTarget.checked;
                      }) }),
                      f("启用视频伴音", "Use video audio")
                    ] }),
                    /* @__PURE__ */ n("button", { class: "danger", onClick: () => {
                      window.confirm(f(`删除素材 ${P.alias}？本地文件不会被删除。`, `Remove ${P.alias}? Local files are kept.`)) && r((j) => {
                        j.assets = j.assets.filter((H) => H.id !== P.id);
                      });
                    }, children: f("删除素材", "Remove") })
                  ] })
                ] })
              ] })
            ]
          },
          P.id
        );
      }) })
    ] }, O))
  ] });
}
const Io = {
  png: "image",
  jpg: "image",
  jpeg: "image",
  webp: "image",
  bmp: "image",
  mp4: "video",
  webm: "video",
  mov: "video",
  mkv: "video",
  wav: "audio",
  mp3: "audio",
  flac: "audio",
  ogg: "audio",
  m4a: "audio",
  aac: "audio"
};
function Er(e) {
  var o;
  const t = ((o = e.name.split(".").pop()) == null ? void 0 : o.toLocaleLowerCase()) ?? "";
  if (e.name.includes(".")) return Io[t] ?? null;
  const r = e.type.split("/", 1)[0];
  return r === "image" || r === "video" || r === "audio" ? r : null;
}
function Po(e) {
  const i = e.replace(/\.[^.]+$/, "").replace(/^\s*\d+\s*[-_. ]+/, "").normalize("NFKC").replace(/[\s-]+/g, "_").replace(/[{}]/g, "").replace(/_+/g, "_").replace(/^[_\.]+|[_\.]+$/g, "").slice(0, 96) || "asset";
  return i.toLocaleLowerCase().endsWith(".audio") ? `${i}_asset` : i;
}
function Co(e, t) {
  const r = new Set(Array.from(t, (i) => i.toLocaleLowerCase()));
  if (!r.has(e.toLocaleLowerCase())) return e;
  let o = 2;
  for (; r.has(`${e}_${o}`.toLocaleLowerCase()); ) o += 1;
  return `${e}_${o}`;
}
function Eo(e, t, r) {
  const o = e.trim().toLocaleLowerCase();
  return !e.trim() || /[\s{}]/.test(e) || o.endsWith(".audio") ? "invalid" : Array.from(t, (a) => a.toLocaleLowerCase()).includes(o) || Array.from(r, (a) => a.trim().toLocaleLowerCase()).filter((a) => a === o).length > 1 ? "duplicate" : null;
}
function zo(e, t, r, o = []) {
  const i = [], a = [], l = new Map(o.filter((m) => !m.path.trim()).map((m) => [`${m.kind}:${m.alias.toLocaleLowerCase()}`, m])), s = e.map((m) => "file" in m ? m : { file: m, relativePath: m.webkitRelativePath || m.name });
  s.sort((m, h) => m.relativePath.localeCompare(h.relativePath, "en", { numeric: !0, sensitivity: "base" }));
  for (const m of s) {
    const { file: h } = m, d = Er(h);
    if (!d) {
      a.push(m.relativePath);
      continue;
    }
    const f = Po(h.name), c = `${d}:${f.toLocaleLowerCase()}`, p = l.get(c);
    if (p) {
      l.delete(c), i.push({ id: r(), file: h, sourcePath: m.relativePath, alias: p.alias, kind: d, durationSeconds: d === "image" ? null : p.durationSeconds ?? 2, includeVideoAudio: p.includeVideoAudio, status: "pending", error: "", fillAssetId: p.id });
      continue;
    }
    const b = f;
    i.push({ id: r(), file: h, sourcePath: m.relativePath, alias: b, kind: d, durationSeconds: d === "image" ? null : 2, includeVideoAudio: !1, status: "pending", error: "" });
  }
  return { drafts: i, rejected: a };
}
const mt = (e) => e.trim().toLocaleLowerCase();
function Xe(e, t, r) {
  if (e.status === "imported") return null;
  const o = mt(e.alias), i = t.find((l) => mt(l.alias) === o);
  return !r.filter((l) => l.id !== e.id && l.status !== "imported" && mt(l.alias) === o).length && (!i || i.id === e.fillAssetId) ? null : { target: i, canReplace: !i || i.kind === e.kind };
}
function zr(e, t, r, o) {
  const i = e.find((l) => l.id === t);
  if (!i || i.status === "imported" || i.status === "uploading") return e;
  if (r === "skip") return e.filter((l) => l.id !== t);
  if (r === "keep") {
    const l = Co(i.alias.trim(), [...o.map((s) => s.alias), ...e.filter((s) => s.id !== t).map((s) => s.alias)]);
    return e.map((s) => s.id === t ? { ...s, alias: l, fillAssetId: void 0, replaceExisting: !1, status: "pending", error: "" } : s);
  }
  const a = Xe(i, o, e);
  return a != null && a.canReplace ? e.filter((l) => l.id === t || l.status === "imported" || mt(l.alias) !== mt(i.alias)).map((l) => {
    var s, m, h, d;
    return l.id === t ? {
      ...l,
      alias: ((s = a.target) == null ? void 0 : s.alias) ?? i.alias.trim(),
      fillAssetId: (m = a.target) == null ? void 0 : m.id,
      replaceExisting: !!((h = a.target) != null && h.path.trim()),
      includeVideoAudio: ((d = a.target) == null ? void 0 : d.includeVideoAudio) ?? l.includeVideoAudio,
      status: "pending",
      error: ""
    } : l;
  }) : e;
}
function Ao(e, t, r) {
  return e.filter((i) => Xe(i, r, e)).map((i) => i.id).reduce((i, a) => {
    const l = i.find((s) => s.id === a);
    return l && (t === "skip" || Xe(l, r, i)) ? zr(i, a, t, r) : i;
  }, e);
}
function To(e, t, r) {
  return {
    ...e,
    path: t,
    durationSeconds: e.kind === "image" ? null : r ?? e.durationSeconds,
    audioDurationSeconds: null,
    fingerprint: ""
  };
}
function jo(e, t, r) {
  return {
    id: e.id,
    alias: e.alias.trim(),
    kind: e.kind,
    path: t,
    enabled: !0,
    fixed: !1,
    fixedOrder: r,
    shotIds: [],
    includeVideoAudio: e.kind === "video" && e.includeVideoAudio,
    durationSeconds: e.kind === "image" ? null : e.durationSeconds,
    audioDurationSeconds: null,
    fingerprint: ""
  };
}
const Ar = (e, t) => e.relativePath.localeCompare(t.relativePath, "en", { numeric: !0, sensitivity: "base" });
function Tr(e, t) {
  return e.replace(/\\/g, "/").replace(/^\/+/, "").replace(/\/{2,}/g, "/") || t;
}
function an(e) {
  return Array.from(e, (t) => ({
    file: t,
    // webkitRelativePath 由目录选择器提供；普通多文件选择回退到文件名。
    relativePath: Tr(t.webkitRelativePath, t.name)
  })).sort(Ar);
}
function No(e) {
  return new Promise((t, r) => e.file(t, r));
}
function Lo(e) {
  return new Promise((t, r) => e.readEntries(t, r));
}
async function Mo(e, t) {
  const r = e.createReader(), o = [];
  for (; t(); ) {
    const i = await Lo(r);
    if (!i.length) return o;
    o.push(...i);
  }
  return o;
}
async function Ro(e, t, r = () => !0) {
  const o = [], i = async (a) => {
    if (!r()) return;
    if (a.isFile) {
      const s = await No(a);
      if (!r()) return;
      o.push({ file: s, relativePath: Tr(a.fullPath, s.name) }), t == null || t(o.length);
      return;
    }
    if (!a.isDirectory) return;
    const l = await Mo(a, r);
    for (const s of l) await i(s);
  };
  for (const a of e) {
    if (!r()) break;
    await i(a);
  }
  return o.sort(Ar);
}
async function Do(e, t, r = () => !0) {
  const i = Array.from(e.items ?? []).filter((l) => l.kind === "file" && typeof l.webkitGetAsEntry == "function");
  if (i.length) {
    const l = i.map((s) => {
      var m;
      return (m = s.webkitGetAsEntry) == null ? void 0 : m.call(s);
    }).filter((s) => !!s);
    if (l.length) return Ro(l, t, r);
  }
  const a = an(e.files ?? []);
  return r() && (t == null || t(a.length)), a;
}
const Oo = () => `asset_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`, Xt = (e, t) => t === "zh" ? { image: "图片", video: "视频", audio: "音频" }[e] : e;
function Uo({ language: e, assets: t, projectName: r, onClose: o, onImported: i, onFilled: a, uploadFile: l }) {
  const [s, m] = R([]), [h, d] = R([]), [f, c] = R(!1), [p, b] = R(!1), [_, N] = R(0), [k, w] = R(!1), z = ke([]), g = ke(null), $ = ke(0);
  z.current = s;
  const T = t.map((v) => v.alias);
  Pe(() => {
    var v, K;
    return (v = g.current) == null || v.setAttribute("webkitdirectory", ""), (K = g.current) == null || K.setAttribute("directory", ""), () => {
      $.current += 1;
    };
  }, []);
  const C = (v, K) => m((Z) => Z.map((Q) => Q.id === v ? { ...Q, ...K } : Q)), S = (v, K) => {
    let Z = 0;
    const Q = async () => {
      for (; Z < v.length && $.current === K; ) {
        const ee = v[Z++];
        if (ee.kind === "image") continue;
        const pe = await Cr(ee.file, ee.kind);
        pe == null || $.current !== K || m((E) => E.map((B) => B.id === ee.id && B.kind === ee.kind && !B.durationEdited ? { ...B, durationSeconds: pe } : B));
      }
    };
    Promise.all(Array.from({ length: Math.min(4, v.length) }, Q));
  }, L = (v) => {
    if (!v.length || k) return;
    const K = [...T, ...z.current.map((ee) => ee.alias)], Z = new Set(z.current.map((ee) => ee.fillAssetId).filter(Boolean)), Q = zo(v, K, Oo, t.filter((ee) => !Z.has(ee.id)));
    Q.rejected.length && d((ee) => [...ee, ...Q.rejected]), Q.drafts.length && (m((ee) => [...ee, ...Q.drafts]), S(Q.drafts, $.current));
  }, V = async (v) => {
    if (p || k) return;
    const K = $.current;
    b(!0), N(0);
    try {
      const Z = () => $.current === K, Q = await v((ee) => {
        Z() && N(ee);
      }, Z);
      if ($.current !== K) return;
      N(Q.length), L(Q);
    } catch (Z) {
      $.current === K && d((Q) => [...Q, String(Z)]);
    } finally {
      $.current === K && b(!1);
    }
  }, O = s.filter((v) => Xe(v, t, s)), U = (v, K) => m((Z) => zr(Z, v, K, t)), P = (v) => m((K) => Ao(K, v, t)), y = s.filter((v) => v.status !== "imported").map((v) => v.alias), D = (v) => {
    if (v.status === "imported") return null;
    const K = Xe(v, t, s);
    if (K) return e === "zh" ? K.canReplace ? "发现重名，请选择替换、保留两份或跳过" : "重名素材类型不同，请保留两份或跳过" : K.canReplace ? "Name conflict: replace, keep both, or skip" : "Different asset kinds: keep both or skip";
    if (v.fillAssetId && !t.some((Q) => Q.id === v.fillAssetId && Q.kind === v.kind && Q.alias === v.alias)) return e === "zh" ? "原素材已变更，请移除后重新添加文件" : "The target changed; remove and add the file again";
    const Z = Eo(v.alias, t.filter((Q) => Q.id !== v.fillAssetId).map((Q) => Q.alias), y);
    return Z === "invalid" ? e === "zh" ? "别名为空、包含空白/花括号，或使用了保留后缀 .audio" : "Alias is empty, contains whitespace/braces, or uses reserved .audio" : Z === "duplicate" ? e === "zh" ? "别名与素材库或本批次其他素材重复" : "Alias duplicates an existing or staged asset" : Er(v.file) !== v.kind ? e === "zh" ? "文件扩展名与所选类型不匹配" : "The extension does not match the selected kind" : v.kind !== "image" && (v.durationSeconds == null || v.durationSeconds <= 0) ? e === "zh" ? "视频或音频时长必须大于 0" : "Video/audio duration must be greater than 0" : null;
  }, j = async () => {
    const K = z.current.filter((pe) => pe.status === "pending" || pe.status === "error");
    if (!K.length || p || k) return;
    if (K.some(D)) {
      window.alert(e === "zh" ? "请先修正列表中标红的项目。" : "Fix the highlighted rows before importing.");
      return;
    }
    w(!0);
    const Z = Math.max(0, ...t.map((pe) => pe.fixedOrder)) + 1;
    let Q = 0;
    const ee = async () => {
      for (; Q < K.length; ) {
        const pe = Q++, E = K[pe];
        C(E.id, { status: "uploading", error: "" });
        try {
          const B = await l(r, E.kind, E.file);
          E.fillAssetId ? a(E.fillAssetId, B, E.kind === "image" ? null : E.durationSeconds) : i([jo(E, B, Z + pe)]), C(E.id, { status: "imported", error: "" });
        } catch (B) {
          C(E.id, { status: "error", error: String(B) });
        }
      }
    };
    await Promise.all(Array.from({ length: Math.min(2, K.length) }, ee)), w(!1);
  }, H = s.filter((v) => v.status === "imported").length, te = s.filter((v) => v.status === "error").length, X = s.length - H, M = () => {
    $.current += 1, o();
  };
  return /* @__PURE__ */ n("div", { class: "td-batch-overlay", role: "presentation", children: /* @__PURE__ */ n("section", { class: "td-asset-batch-panel", role: "dialog", "aria-modal": "true", "aria-label": e === "zh" ? "批量导入素材" : "Batch import assets", children: [
    /* @__PURE__ */ n("header", { class: "td-batch-header", children: [
      /* @__PURE__ */ n("div", { children: [
        /* @__PURE__ */ n("h2", { children: e === "zh" ? "批量导入素材" : "Batch import assets" }),
        /* @__PURE__ */ n("p", { children: e === "zh" ? "可混合选择文件或递归导入文件夹。空缺素材自动填充；重名时先选择替换、保留两份或跳过。替换保留原有镜头引用。" : "Select files or folders. Empty assets are filled automatically. For name conflicts, choose replace, keep both, or skip. Replacing preserves shot references." })
      ] }),
      /* @__PURE__ */ n("button", { disabled: k, "aria-label": e === "zh" ? "关闭" : "Close", onClick: M, children: "×" })
    ] }),
    /* @__PURE__ */ n("div", { class: `td-asset-dropzone ${f ? "dragging" : ""}`, onDragEnter: (v) => {
      v.preventDefault(), c(!0);
    }, onDragOver: (v) => v.preventDefault(), onDragLeave: (v) => {
      v.currentTarget === v.target && c(!1);
    }, onDrop: (v) => {
      v.preventDefault(), c(!1);
      const K = v.dataTransfer;
      K && V((Z, Q) => Do(K, Z, Q));
    }, children: [
      /* @__PURE__ */ n("strong", { children: p ? e === "zh" ? `正在扫描文件夹…已发现 ${_} 个文件` : `Scanning folders… ${_} files found` : e === "zh" ? "拖拽文件或文件夹到这里" : "Drop files or folders here" }),
      /* @__PURE__ */ n("span", { children: e === "zh" ? "递归识别子文件夹中的图片、视频和音频" : "Images, videos, and audio are detected recursively" }),
      /* @__PURE__ */ n("div", { class: "td-asset-picker-actions", children: [
        /* @__PURE__ */ n("label", { class: "td-asset-picker-button", children: [
          e === "zh" ? "选择多个文件" : "Choose files",
          /* @__PURE__ */ n("input", { type: "file", multiple: !0, accept: "image/*,video/*,audio/*", disabled: k || p, onChange: (v) => {
            L(an(v.currentTarget.files ?? [])), v.currentTarget.value = "";
          } })
        ] }),
        /* @__PURE__ */ n("label", { class: "td-asset-picker-button", children: [
          e === "zh" ? "选择文件夹" : "Choose folder",
          /* @__PURE__ */ n("input", { ref: g, type: "file", multiple: !0, disabled: k || p, onChange: (v) => {
            const K = an(v.currentTarget.files ?? []);
            v.currentTarget.value = "", V(async (Z) => (Z(K.length), K));
          } })
        ] })
      ] })
    ] }),
    h.length > 0 && /* @__PURE__ */ n("div", { class: "td-asset-batch-warning", children: [
      /* @__PURE__ */ n("span", { children: e === "zh" ? `已跳过 ${h.length} 个不支持的文件：${h.join("、")}` : `Skipped ${h.length} unsupported files: ${h.join(", ")}` }),
      /* @__PURE__ */ n("button", { onClick: () => d([]), children: "×" })
    ] }),
    O.length > 0 && /* @__PURE__ */ n("div", { class: "td-asset-batch-conflicts", role: "status", children: [
      /* @__PURE__ */ n("strong", { children: e === "zh" ? `发现 ${O.length} 项重名素材，如何处理？` : `${O.length} name conflicts. How should they be handled?` }),
      /* @__PURE__ */ n("div", { children: [
        /* @__PURE__ */ n("button", { disabled: k || O.some((v) => {
          var K;
          return !((K = Xe(v, t, s)) != null && K.canReplace);
        }), onClick: () => P("replace"), children: e === "zh" ? "全部替换" : "Replace all" }),
        /* @__PURE__ */ n("button", { disabled: k, onClick: () => P("keep"), children: e === "zh" ? "全部保留两份" : "Keep all copies" }),
        /* @__PURE__ */ n("button", { disabled: k, onClick: () => P("skip"), children: e === "zh" ? "全部跳过" : "Skip all" })
      ] })
    ] }),
    /* @__PURE__ */ n("div", { class: "td-asset-batch-summary", children: [
      /* @__PURE__ */ n("span", { children: e === "zh" ? `共 ${s.length} 项 · 已导入 ${H} · 待处理 ${X}${te ? ` · 失败 ${te}` : ""}` : `${s.length} items · ${H} imported · ${X} pending${te ? ` · ${te} failed` : ""}` }),
      /* @__PURE__ */ n("button", { disabled: k || !s.length, onClick: () => m([]), children: e === "zh" ? "清空列表" : "Clear list" })
    ] }),
    /* @__PURE__ */ n("div", { class: "td-asset-batch-list", children: [
      /* @__PURE__ */ n("div", { class: "td-asset-batch-row td-asset-batch-head", children: [
        /* @__PURE__ */ n("span", { children: e === "zh" ? "状态 / 文件" : "Status / File" }),
        /* @__PURE__ */ n("span", { children: e === "zh" ? "别名" : "Alias" }),
        /* @__PURE__ */ n("span", { children: e === "zh" ? "类型" : "Kind" }),
        /* @__PURE__ */ n("span", { children: e === "zh" ? "时长" : "Duration" }),
        /* @__PURE__ */ n("span", { children: e === "zh" ? "视频伴音" : "Video audio" }),
        /* @__PURE__ */ n("span", { children: e === "zh" ? "操作" : "Action" })
      ] }),
      !s.length && /* @__PURE__ */ n("div", { class: "td-asset-batch-empty", children: e === "zh" ? "尚未选择素材" : "No media selected" }),
      s.map((v) => {
        const K = Xe(v, t, s), Z = D(v), Q = k || v.status === "imported" || v.status === "uploading";
        return /* @__PURE__ */ n("div", { class: `td-asset-batch-row ${Z || v.status === "error" ? "invalid" : ""} ${v.status === "imported" ? "imported" : ""}`, children: [
          /* @__PURE__ */ n("div", { class: "td-asset-batch-file", children: [
            /* @__PURE__ */ n("strong", { title: v.sourcePath, children: v.sourcePath }),
            /* @__PURE__ */ n("small", { children: [
              (v.file.size / 1024 / 1024).toFixed(1),
              " MB · ",
              v.status === "pending" ? e === "zh" ? "待导入" : "Pending" : v.status === "uploading" ? e === "zh" ? "上传中" : "Uploading" : v.status === "imported" ? e === "zh" ? "已完成" : "Imported" : e === "zh" ? "失败" : "Failed"
            ] }),
            (Z || v.error) && /* @__PURE__ */ n("em", { title: Z || v.error, children: Z || v.error })
          ] }),
          /* @__PURE__ */ n("div", { class: "td-asset-batch-alias", children: [
            v.fillAssetId ? /* @__PURE__ */ n("span", { class: "td-asset-batch-fill", title: e === "zh" ? "更新原素材，保留别名与镜头引用" : "Updates the original asset and preserves references", children: [
              "↳ ",
              v.alias,
              /* @__PURE__ */ n("em", { children: v.replaceExisting ? e === "zh" ? "替换" : "replace" : e === "zh" ? "填充" : "fill" })
            ] }) : /* @__PURE__ */ n("input", { disabled: Q, value: v.alias, onInput: (ee) => C(v.id, { alias: ee.currentTarget.value, status: "pending", error: "" }) }),
            K && /* @__PURE__ */ n("div", { class: "td-asset-conflict-actions", children: [
              /* @__PURE__ */ n("button", { disabled: Q || !K.canReplace, onClick: () => U(v.id, "replace"), children: e === "zh" ? "替换" : "Replace" }),
              /* @__PURE__ */ n("button", { disabled: Q, onClick: () => U(v.id, "keep"), children: e === "zh" ? "保留两份" : "Keep both" }),
              /* @__PURE__ */ n("button", { disabled: Q, onClick: () => U(v.id, "skip"), children: e === "zh" ? "跳过" : "Skip" })
            ] })
          ] }),
          /* @__PURE__ */ n("select", { disabled: Q || !!v.fillAssetId, value: v.kind, onChange: (ee) => {
            const pe = ee.currentTarget.value;
            C(v.id, { kind: pe, durationSeconds: pe === "image" ? null : v.durationSeconds ?? 2, includeVideoAudio: pe === "video" && v.includeVideoAudio, status: "pending", error: "" });
          }, children: [
            /* @__PURE__ */ n("option", { value: "image", children: Xt("image", e) }),
            /* @__PURE__ */ n("option", { value: "video", children: Xt("video", e) }),
            /* @__PURE__ */ n("option", { value: "audio", children: Xt("audio", e) })
          ] }),
          /* @__PURE__ */ n("label", { class: "td-asset-batch-duration", children: [
            /* @__PURE__ */ n("input", { type: "number", min: "0.1", step: "0.1", disabled: Q || v.kind === "image", value: v.durationSeconds ?? "", onInput: (ee) => C(v.id, { durationSeconds: ee.currentTarget.value ? Number(ee.currentTarget.value) : null, durationEdited: !0, status: "pending", error: "" }) }),
            /* @__PURE__ */ n("span", { children: v.kind === "image" ? "—" : e === "zh" ? "秒" : "sec" })
          ] }),
          /* @__PURE__ */ n("label", { class: "td-asset-batch-audio", children: [
            /* @__PURE__ */ n("input", { type: "checkbox", disabled: Q || !!v.fillAssetId || v.kind !== "video", checked: v.kind === "video" && v.includeVideoAudio, onChange: (ee) => C(v.id, { includeVideoAudio: ee.currentTarget.checked }) }),
            /* @__PURE__ */ n("span", { children: v.kind === "video" ? v.includeVideoAudio ? e === "zh" ? "开" : "ON" : e === "zh" ? "关" : "OFF" : "—" })
          ] }),
          /* @__PURE__ */ n("button", { class: "danger", disabled: Q, onClick: () => m((ee) => ee.filter((pe) => pe.id !== v.id)), children: e === "zh" ? "移除" : "Remove" })
        ] }, v.id);
      })
    ] }),
    /* @__PURE__ */ n("footer", { children: [
      /* @__PURE__ */ n("button", { disabled: k, onClick: M, children: e === "zh" ? "关闭" : "Close" }),
      /* @__PURE__ */ n("button", { class: "primary", disabled: k || p || O.length > 0 || !s.some((v) => v.status === "pending" || v.status === "error"), onClick: () => void j(), children: p ? e === "zh" ? "正在扫描…" : "Scanning…" : k ? e === "zh" ? "正在导入…" : "Importing…" : te ? e === "zh" ? "重试失败项" : "Retry failed" : e === "zh" ? "开始导入" : "Start import" })
    ] })
  ] }) });
}
function Fo(e, t) {
  return { projectName: e, runId: t };
}
async function Go(e, t) {
  const r = await fetch("/theodore-director/v1/project/clear", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(Fo(e, t))
  }), o = await r.json();
  if (!r.ok || !o.ok) throw new Error(o.error || `HTTP ${r.status}`);
  return o.path || "";
}
function Vo(e, t) {
  if (!Number.isInteger(t) || t < 0 || t > e.length) return null;
  const o = e.slice(0, t).lastIndexOf("@");
  if (o < 0) return null;
  const i = o > 0 ? e[o - 1] : "";
  if (i && /[A-Za-z0-9_.+-]/.test(i)) return null;
  const a = e.slice(o + 1, t);
  return /[\s{}@]/u.test(a) ? null : { start: o, end: t, query: a };
}
function Ho(e, t) {
  const r = t.trim().toLocaleLowerCase();
  if (!r) return e;
  const o = [], i = [];
  for (const a of e)
    a.alias.toLocaleLowerCase().includes(r) ? o.push(a) : Ce(a.path).toLocaleLowerCase().includes(r) && i.push(a);
  return [...o, ...i];
}
function Bo(e, t, r) {
  const o = `{{ref:${r}}}`;
  return {
    value: `${e.slice(0, t.start)}${o}${e.slice(t.end)}`,
    caret: t.start + o.length
  };
}
const jr = String.raw`\{\{ref:([^{}]+)}}`;
function Vn() {
  return new RegExp(jr, "g");
}
function Nr(e, t) {
  return e.assets.filter((r) => r.enabled && r.path.trim() && (!(r.shotIds ?? []).length || (r.shotIds ?? []).includes(t.id)) && !(t.disabledAssetIds ?? []).includes(r.id));
}
function Lr(e, t) {
  const r = /* @__PURE__ */ new Map();
  for (const o of Nr(e, t)) r.set(o.alias, o);
  return r;
}
function Mr(e, t, r) {
  const o = r.trim(), i = o.endsWith(".audio"), a = i ? o.slice(0, -6) : o, l = Lr(e, t).get(a);
  return l ? !i || l.kind === "video" && l.includeVideoAudio : !1;
}
function Hn(e, t) {
  const r = e.shots.filter((o) => o.enabled);
  return r.length > 0 && r.every((o) => Mr(e, o, t));
}
function Wo(e) {
  return {
    ...e,
    assets: [],
    shots: e.shots.map((t) => ({ ...t, disabledAssetIds: [] }))
  };
}
function Rr(e, t) {
  const r = [], o = Lr(e, t), i = [e.promptPrefix, t.prompt, e.promptSuffix].filter(Boolean).join(`
`), a = [...i.matchAll(Vn())].map((g) => g[1].trim()), l = [], s = /* @__PURE__ */ new Set(), m = (g) => {
    s.has(g.id) || (s.add(g.id), l.push(g));
  };
  [...o.values()].filter((g) => g.fixed).sort((g, $) => g.fixedOrder - $.fixedOrder || g.alias.localeCompare($.alias)).forEach(m);
  for (const g of a) {
    const $ = g.endsWith(".audio") ? g.slice(0, -6) : g, T = o.get($);
    if (!T) {
      r.push(`未找到或已禁用素材：${g}`);
      continue;
    }
    g.endsWith(".audio") && (T.kind !== "video" || !T.includeVideoAudio) && r.push(`视频伴音未启用：${g}`), m(T);
  }
  const h = l.filter((g) => g.kind === "image"), d = l.filter((g) => g.kind === "video"), f = d.filter((g) => g.includeVideoAudio), c = l.filter((g) => g.kind === "audio"), p = f.length + c.length, b = h.length + d.length + c.length;
  h.length > 9 && r.push(`参考图 ${h.length}/9，超出 H3 上限`), d.length > 3 && r.push(`参考视频 ${d.length}/3，超出 H3 上限`), p > 3 && r.push(`有效音频 ${p}/3，超出 H3 总上限`), b > 12 && r.push(`混合文件 ${b}/12，超出 H3 上限`), p && !h.length && !d.length && r.push("音频参考不能单独使用");
  const _ = d.filter((g) => typeof g.durationSeconds == "number");
  for (const g of d) (g.durationSeconds == null || g.durationSeconds < 2 || g.durationSeconds > 15) && r.push(`视频 ${g.alias} 的时长必须为 2–15 秒`);
  _.reduce((g, $) => g + ($.durationSeconds ?? 0), 0) > 15 && r.push("参考视频总时长超过 15 秒");
  const N = [...f.map((g) => g.audioDurationSeconds ?? g.durationSeconds), ...c.map((g) => g.durationSeconds)];
  N.some((g) => g == null || g < 2 || g > 15) && r.push("每路有效音频时长必须为 2–15 秒"), N.reduce((g, $) => g + ($ ?? 0), 0) > 15 && r.push("有效音频总时长超过 15 秒");
  const k = /* @__PURE__ */ new Map();
  h.forEach((g, $) => k.set(g.alias, `<Picture ${$ + 1}>`)), d.forEach((g, $) => k.set(g.alias, `<Video ${$ + 1}>`)), f.forEach((g, $) => k.set(`${g.alias}.audio`, `<Audio ${$ + 1}>`)), c.forEach((g, $) => k.set(g.alias, `<Audio ${f.length + $ + 1}>`));
  const w = i.replace(Vn(), (g, $) => k.get($.trim()) ?? g), z = [...k.entries()].map(([g, $]) => ({ label: $, alias: g, kind: $.slice(1).split(" ")[0].toLowerCase() }));
  return { compiledPrompt: w, errors: r, slots: z, mixedFiles: b, audioCount: p };
}
function Jo(e, t) {
  var s, m, h, d, f, c;
  const r = [], o = /* @__PURE__ */ new Set(["off", "super_resolution_second_pass", "latent_upscale_second_pass", "super_resolution_only"]);
  (m = (s = e.project) == null ? void 0 : s.name) != null && m.trim() || r.push("Project name 不能为空"), (d = (h = e.project) == null ? void 0 : h.runId) != null && d.trim() || r.push("Run ID 不能为空"), (!Array.isArray(e.shots) || !e.shots.some((p) => p.enabled)) && r.push("至少需要一个启用分镜");
  const i = /* @__PURE__ */ new Set();
  for (const p of e.shots ?? [])
    (!((f = p.id) != null && f.trim()) || i.has(p.id)) && r.push(`分镜 ID 为空或重复：${p.id || "(空)"}`), i.add(p.id), p.durationSeconds > 0 || r.push(`分镜 ${p.id} 的时长必须大于 0`), o.has(p.secondSamplingMode) || r.push(`分镜 ${p.id} 的高清处理模式无效`);
  const a = /* @__PURE__ */ new Set();
  for (const p of e.assets ?? []) {
    const b = (c = p.alias) == null ? void 0 : c.toLocaleLowerCase();
    (!p.alias || /[\s{}]/.test(p.alias) || p.alias.endsWith(".audio") || a.has(b)) && r.push(`素材别名无效或重复：${p.alias || "(空)"}`), a.add(b), p.enabled && !p.path && !t && r.push(`素材 ${p.alias} 尚未选择文件`);
  }
  const l = e.shots.filter((p) => p.enabled && (!t || t.includes(p.id)));
  for (const p of l) {
    const b = (k) => k.fixed && (!(k.shotIds ?? []).length || k.shotIds.includes(p.id)) && !(p.disabledAssetIds ?? []).includes(k.id), _ = e.assets.filter((k) => k.enabled && !k.path.trim() && (b(k) || p.prompt.includes(`{{ref:${k.alias}}}`) || p.prompt.includes(`{{ref:${k.alias}.audio}}`)));
    _.forEach((k) => r.push(`${p.title}: 素材 ${k.alias} 尚未上传文件`));
    const N = new Set(_.map((k) => k.alias));
    r.push(...Rr(e, p).errors.filter((k) => ![...N].some((w) => k.endsWith(`：${w}`) || k.endsWith(`：${w}.audio`))).map((k) => `${p.title}: ${k}`));
  }
  return [...new Set(r)];
}
function qo(e, t) {
  const r = [], o = new RegExp(jr, "g");
  let i = 0;
  for (const a of e.matchAll(o)) {
    const l = a.index ?? 0;
    l > i && r.push({ text: e.slice(i, l), reference: !1 }), r.push({ text: a[0], reference: !0, valid: t(a[1]) }), i = l + a[0].length;
  }
  return i < e.length && r.push({ text: e.slice(i), reference: !1 }), r;
}
const Ko = [
  "boxSizing",
  "borderTopWidth",
  "borderRightWidth",
  "borderBottomWidth",
  "borderLeftWidth",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "fontFamily",
  "fontSize",
  "fontStyle",
  "fontVariant",
  "fontWeight",
  "fontStretch",
  "lineHeight",
  "letterSpacing",
  "textAlign",
  "textIndent",
  "textTransform",
  "tabSize",
  "wordSpacing",
  "overflowWrap",
  "wordBreak"
];
function Qo(e, t) {
  const r = window.getComputedStyle(e), o = e.getBoundingClientRect(), i = document.createElement("div");
  i.setAttribute("aria-hidden", "true"), i.style.position = "fixed", i.style.visibility = "hidden", i.style.pointerEvents = "none", i.style.left = `${o.left}px`, i.style.top = `${o.top}px`, i.style.width = `${e.offsetWidth}px`, i.style.height = `${e.offsetHeight}px`, i.style.overflow = "hidden", i.style.whiteSpace = "pre-wrap";
  for (const m of Ko) i.style[m] = r[m];
  i.append(document.createTextNode(e.value.slice(0, t)));
  const a = document.createElement("span");
  a.textContent = "​", i.append(a), document.body.append(i), i.scrollTop = e.scrollTop, i.scrollLeft = e.scrollLeft;
  const l = a.getBoundingClientRect(), s = Number.parseFloat(r.lineHeight) || Number.parseFloat(r.fontSize) * 1.45 || 20;
  return i.remove(), { left: l.left, top: l.top, bottom: l.top + s };
}
const Yo = {
  zh: { image: "图片", video: "视频", audio: "音频" },
  en: { image: "Image", video: "Video", audio: "Audio" }
};
function dn({ value: e, rows: t, onInput: r, isReferenceValid: o, mentionAssets: i, mentionLanguage: a = "zh" }) {
  const l = ke(null), s = ke(null), m = ke(null), h = ke(null), d = ke(!1), f = ke(!1), c = ke([]), p = ke([]), b = ke(`td-reference-mention-${Math.random().toString(36).slice(2)}`).current, [_, N] = R(null), [k, w] = R(0), [z, g] = R(null), $ = qo(e, o), T = Ve(
    () => _ && i ? Ho(i, _.query) : [],
    [_, i]
  ), C = () => {
    N(null), g(null), w(0);
  }, S = (y) => {
    if (!i || y.selectionStart !== y.selectionEnd) {
      C();
      return;
    }
    const D = Vo(y.value, y.selectionStart);
    if (!D) {
      C();
      return;
    }
    N((j) => j && j.start === D.start && j.end === D.end && j.query === D.query ? j : D);
  }, L = () => {
    var K;
    if (!_ || !m.current) return;
    const y = Qo(m.current, _.end), D = 8, j = Math.min(390, Math.max(240, window.innerWidth - D * 2)), H = Math.min(320, Math.max(150, window.innerHeight - D * 2)), te = Math.min(((K = h.current) == null ? void 0 : K.offsetHeight) || H, H), X = Math.min(Math.max(y.left, D), window.innerWidth - j - D), v = y.bottom + 6 + te > window.innerHeight - D && y.top - te - 6 >= D ? y.top - te - 6 : Math.min(y.bottom + 6, window.innerHeight - te - D);
    g((Z) => Z && Z.left === X && Z.top === v && Z.width === j && Z.maxHeight === H ? Z : { left: X, top: v, width: j, maxHeight: H });
  };
  wo(L, [_, T.length, !!z]), Pe(() => {
    if (!_) return;
    const y = () => L(), D = (j) => {
      var H, te;
      j.target instanceof Node && ((H = l.current) != null && H.contains(j.target) || (te = h.current) != null && te.contains(j.target)) || C();
    };
    return window.addEventListener("resize", y), document.addEventListener("scroll", y, !0), document.addEventListener("mousedown", D), () => {
      window.removeEventListener("resize", y), document.removeEventListener("scroll", y, !0), document.removeEventListener("mousedown", D);
    };
  }, [_]), Pe(() => w(0), [_ == null ? void 0 : _.query]), Pe(() => {
    k >= T.length && w(Math.max(0, T.length - 1));
  }, [k, T.length]), Pe(() => {
    var y, D;
    (D = (y = h.current) == null ? void 0 : y.querySelector('[aria-selected="true"]')) == null || D.scrollIntoView({ block: "nearest" });
  }, [k, T.length]);
  const V = (y) => {
    s.current && (s.current.scrollTop = y.currentTarget.scrollTop, s.current.scrollLeft = y.currentTarget.scrollLeft), _ && L();
  }, O = (y, D) => {
    if (!m.current) return;
    const j = m.current;
    f.current = !0, j.value = y, j.dispatchEvent(new Event("input", { bubbles: !0 })), f.current = !1, C(), window.requestAnimationFrame(() => {
      j.focus({ preventScroll: !0 }), j.setSelectionRange(D, D);
    });
  }, U = (y) => {
    if (!(y.ctrlKey || y.metaKey) || y.altKey) return !1;
    const D = y.key.toLocaleLowerCase(), j = D === "y" || D === "z" && y.shiftKey;
    if (!(D === "z" && !y.shiftKey) && !j) return !1;
    const te = j ? p.current : c.current, X = te[te.length - 1], M = j ? X == null ? void 0 : X.beforeValue : X == null ? void 0 : X.afterValue;
    return !X || y.currentTarget.value !== M ? !1 : (y.preventDefault(), te.pop(), (j ? c.current : p.current).push(X), O(j ? X.afterValue : X.beforeValue, j ? X.afterCaret : X.beforeCaret), !0);
  }, P = (y) => {
    if (!_ || !m.current) return;
    const D = m.current, j = Bo(D.value, _, y.alias), H = `{{ref:${y.alias}}}`, te = {
      beforeValue: D.value,
      afterValue: j.value,
      beforeCaret: _.end,
      afterCaret: j.caret
    };
    D.focus({ preventScroll: !0 }), D.setSelectionRange(_.start, _.end);
    let X = !1;
    try {
      document.execCommand("insertText", !1, H), X = D.value === j.value;
    } catch {
    }
    X || (D.value = j.value, D.dispatchEvent(new Event("input", { bubbles: !0 }))), c.current.push(te), c.current.length > 100 && c.current.shift(), p.current = [], C(), window.requestAnimationFrame(() => {
      var M, v;
      (M = m.current) == null || M.focus({ preventScroll: !0 }), (v = m.current) == null || v.setSelectionRange(j.caret, j.caret);
    });
  }, oe = (y) => {
    if (!(y.isComposing || d.current) && !U(y) && _) {
      if (y.key === "Escape") {
        y.preventDefault(), C();
        return;
      }
      if (T.length) {
        if (y.key === "ArrowDown" || y.key === "ArrowUp") {
          y.preventDefault();
          const D = y.key === "ArrowDown" ? 1 : -1;
          w((j) => (j + D + T.length) % T.length);
          return;
        }
        (y.key === "Enter" || y.key === "Tab") && (y.preventDefault(), P(T[k] ?? T[0]));
      }
    }
  };
  return /* @__PURE__ */ n("span", { ref: l, class: "td-highlight-textarea", children: [
    /* @__PURE__ */ n("pre", { ref: s, class: "td-highlight-backdrop", "aria-hidden": "true", children: [
      $.map((y, D) => y.reference ? /* @__PURE__ */ n("mark", { class: y.valid ? "valid" : "invalid", children: y.text }, D) : y.text),
      e.endsWith(`
`) && " "
    ] }),
    /* @__PURE__ */ n(
      "textarea",
      {
        ref: m,
        class: "td-highlight-input",
        rows: t,
        value: e,
        "aria-autocomplete": i ? "list" : void 0,
        "aria-controls": _ ? b : void 0,
        "aria-expanded": i ? !!_ : void 0,
        "aria-activedescendant": _ && T[k] ? `${b}-${T[k].id}` : void 0,
        onInput: (y) => {
          r(y);
          const D = y instanceof InputEvent ? y.inputType : "";
          !f.current && D !== "historyUndo" && D !== "historyRedo" && (p.current = []), d.current || S(y.currentTarget);
        },
        onClick: (y) => S(y.currentTarget),
        onSelect: (y) => {
          d.current || S(y.currentTarget);
        },
        onKeyDown: oe,
        onKeyUp: (y) => {
          !d.current && !["ArrowDown", "ArrowUp", "Enter", "Tab", "Escape"].includes(y.key) && S(y.currentTarget);
        },
        onCompositionStart: () => {
          d.current = !0;
        },
        onCompositionEnd: (y) => {
          d.current = !1, S(y.currentTarget);
        },
        onBlur: () => window.setTimeout(() => {
          document.activeElement !== m.current && C();
        }, 0),
        onScroll: V
      }
    ),
    _ && z && /* @__PURE__ */ n(
      "div",
      {
        ref: h,
        id: b,
        class: "td-reference-mention-menu",
        role: "listbox",
        "aria-label": a === "zh" ? "选择参考素材" : "Choose reference media",
        style: { left: z.left, top: z.top, width: z.width, maxHeight: z.maxHeight },
        onMouseDown: (y) => y.preventDefault(),
        children: [
          /* @__PURE__ */ n("header", { children: [
            /* @__PURE__ */ n("strong", { children: a === "zh" ? "@ 参考素材" : "@ Reference media" }),
            /* @__PURE__ */ n("span", { children: T.length })
          ] }),
          T.length ? /* @__PURE__ */ n("div", { class: "td-reference-mention-options", children: T.map((y, D) => {
            const j = y.kind === "image" ? Ir(y.path) : null, H = Ce(y.path);
            return /* @__PURE__ */ n(
              "button",
              {
                id: `${b}-${y.id}`,
                type: "button",
                role: "option",
                "aria-selected": D === k,
                class: D === k ? "active" : "",
                onMouseEnter: () => w(D),
                onClick: () => P(y),
                children: [
                  /* @__PURE__ */ n("span", { class: `td-reference-mention-thumb ${y.kind}`, children: j ? /* @__PURE__ */ n("img", { src: j, alt: "", loading: "lazy" }) : /* @__PURE__ */ n("span", { children: y.kind === "image" ? "▧" : y.kind === "video" ? "▶" : "♫" }) }),
                  /* @__PURE__ */ n("span", { class: "td-reference-mention-copy", children: [
                    /* @__PURE__ */ n("strong", { children: y.alias }),
                    /* @__PURE__ */ n("small", { children: H || y.path })
                  ] }),
                  /* @__PURE__ */ n("em", { children: Yo[a][y.kind] })
                ]
              },
              y.id
            );
          }) }) : /* @__PURE__ */ n("p", { class: "td-reference-mention-empty", children: a === "zh" ? "没有匹配的可用素材" : "No available media matches" })
        ]
      }
    )
  ] });
}
const Xo = {
  zh: { title: "YuQ 导播台", save: "保存", close: "关闭", shots: "分镜", assets: "素材库", settings: "项目设置", postprocess: "后处理", addShot: "添加分镜", addAsset: "添加素材", preview: "H3 编译预览", noErrors: "当前分镜通过预检" },
  en: { title: "YuQ Director", save: "Save", close: "Close", shots: "Shots", assets: "Media", settings: "Project", postprocess: "Post-process", addShot: "Add shot", addAsset: "Add asset", preview: "H3 compile preview", noErrors: "Current shot passes validation" }
}, Dr = "theodore-director-language";
function Bn(e, t) {
  return Xo[e][t];
}
function Zo() {
  try {
    return window.localStorage.getItem(Dr) === "en" ? "en" : "zh";
  } catch {
    return "zh";
  }
}
function ei(e) {
  try {
    window.localStorage.setItem(Dr, e);
  } catch {
  }
}
const gn = (e) => `${e}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`, et = (e) => JSON.parse(JSON.stringify(e)), Or = 0.3;
function ft(e) {
  var r, o, i, a, l, s, m, h, d, f, c, p, b, _, N, k, w, z;
  const t = et(e);
  return t.schemaVersion = 5, t.project = { ...t.project, name: ((r = t.project) == null ? void 0 : r.name) ?? "YuQ Project", runId: ((o = t.project) == null ? void 0 : o.runId) ?? "run_001", id: ((i = t.project) == null ? void 0 : i.id) ?? "" }, (a = t.project.id) != null && a.trim() || (t.project.id = gn("project")), t.defaults = { fps: ((l = t.defaults) == null ? void 0 : l.fps) ?? 24, baseSeed: ((s = t.defaults) == null ? void 0 : s.baseSeed) ?? 123456790, durationSeconds: ((m = t.defaults) == null ? void 0 : m.durationSeconds) ?? 6, secondSamplingMode: ((h = t.defaults) == null ? void 0 : h.secondSamplingMode) ?? "off" }, t.promptPrefix = t.promptPrefix ?? "", t.promptSuffix = t.promptSuffix ?? "", t.continuity = {
    mode: ((d = t.continuity) == null ? void 0 : d.mode) ?? "h3_av_latent",
    videoContextFrames: ((f = t.continuity) == null ? void 0 : f.videoContextFrames) ?? 22,
    audioContextFrames: ((c = t.continuity) == null ? void 0 : c.audioContextFrames) ?? 24,
    durationMode: ((p = t.continuity) == null ? void 0 : p.durationMode) ?? "final_output"
  }, t.shots = (t.shots ?? []).map((g, $) => {
    const T = g, C = g.id || `shot_${String($ + 1).padStart(3, "0")}`;
    return {
      ...g,
      id: C,
      title: g.title || C,
      prompt: g.prompt ?? "",
      negativePrompt: g.negativePrompt ?? "",
      durationSeconds: Number(g.durationSeconds) || 5,
      enabled: g.enabled ?? !0,
      latentRelay: g.latentRelay ?? !0,
      // 旧 BOOL 开关无损迁移到 V7.2 原有的超分二采模式。
      secondSamplingMode: g.secondSamplingMode ?? (T.secondSampling === !1 ? "off" : t.defaults.secondSamplingMode ?? "super_resolution_second_pass"),
      seed: g.seed ?? null,
      disabledAssetIds: g.disabledAssetIds ?? []
    };
  }), t.assets = (t.assets ?? []).map((g, $) => ({
    ...g,
    id: g.id || `asset_${String($ + 1).padStart(3, "0")}`,
    path: g.path ?? "",
    enabled: g.enabled ?? !0,
    fixed: g.fixed ?? !1,
    fixedOrder: g.fixedOrder ?? $ + 1,
    shotIds: g.shotIds ?? [],
    includeVideoAudio: g.includeVideoAudio ?? !1,
    durationSeconds: g.durationSeconds ?? null,
    audioDurationSeconds: g.audioDurationSeconds ?? null,
    fingerprint: g.fingerprint ?? ""
  })), t.pipeline = {
    ...t.pipeline,
    phase: ((b = t.pipeline) == null ? void 0 : b.phase) ?? "first_pass",
    firstPassConfirmed: !!((_ = t.pipeline) != null && _.firstPassConfirmed),
    secondPassMode: ((N = t.pipeline) == null ? void 0 : N.secondPassMode) ?? "super_resolution_second_pass",
    secondPassDenoise: ((k = t.pipeline) == null ? void 0 : k.secondPassDenoise) ?? Or
  }, t.uiPreferences = { autoSave: ((w = t.uiPreferences) == null ? void 0 : w.autoSave) ?? !1, compactMode: ((z = t.uiPreferences) == null ? void 0 : z.compactMode) ?? !1 }, t;
}
function Zt(e) {
  const t = e;
  if (!t || typeof t != "object" || !t.project || !Array.isArray(t.shots) || !Array.isArray(t.assets))
    throw new Error("不是有效的 Theodore Director 计划：需要 project、assets 和 shots 字段");
}
function Ur(e, t) {
  var h;
  const r = ft(t), o = new Map(e.assets.map((d) => [`${d.kind}:${d.alias.toLocaleLowerCase()}`, d])), i = [];
  r.assets = r.assets.map((d) => {
    const f = o.get(`${d.kind}:${d.alias.toLocaleLowerCase()}`);
    if (!f) return d;
    const c = {
      imageGeneration: d.imageGeneration ?? f.imageGeneration,
      imageGenerationPending: d.imageGenerationPending ?? f.imageGenerationPending
    };
    return d.path.trim() || !f.path.trim() ? { ...d, ...c } : (i.push(d.alias), {
      ...d,
      ...c,
      path: f.path,
      // 已上传文件的真实时长比 skill 中的计划时长更可靠。
      durationSeconds: f.durationSeconds ?? d.durationSeconds,
      audioDurationSeconds: f.audioDurationSeconds ?? d.audioDurationSeconds,
      fingerprint: f.fingerprint || d.fingerprint
    });
  });
  const a = e.project.name === r.project.name && e.project.runId === r.project.runId, l = new Map((a ? e.shots : []).map((d) => [d.id, d]));
  let s = 0, m = 0;
  return r.shots = r.shots.map((d) => {
    const f = l.get(d.id);
    if (!f) return d;
    const c = { ...d };
    return !c.review && f.review && (c.review = f.review, s += 1), c.seed == null && f.seed != null && (c.seed = f.seed, m += 1), c;
  }), e.pipeline && r.pipeline && (r.pipeline.secondPassDenoise = ((h = t.pipeline) == null ? void 0 : h.secondPassDenoise) ?? e.pipeline.secondPassDenoise ?? Or), { plan: r, keptPaths: i, keptReviews: s, keptSeeds: m };
}
function en(e) {
  return e.trim().replace(/[<>:"/\\|?*\u0000-\u001f]+/g, "_").replace(/[. ]+$/g, "").slice(0, 96) || "theodore_project";
}
const je = (e) => e.trim().toLocaleLowerCase(), ti = /* @__PURE__ */ new Set(["image", "video", "audio"]);
function Fr(e) {
  if (!Array.isArray(e)) throw new Error("素材清单必须为数组 / Expected an asset list");
  const t = /* @__PURE__ */ new Set();
  for (const r of e) {
    if (!r || typeof r.alias != "string" || !r.alias.trim() || /[\s{}]/.test(r.alias) || je(r.alias).endsWith(".audio") || !ti.has(r.kind)) throw new Error("素材别名或类型无效 / Invalid asset alias or kind");
    if (t.has(je(r.alias))) throw new Error(`素材别名重复 / Duplicate alias: ${r.alias}`);
    if (t.add(je(r.alias)), r.path != null && typeof r.path != "string") throw new Error("素材路径必须为字符串 / Expected a string path");
  }
}
function Gr(e) {
  var r, o;
  const t = e;
  if (!t || t.format !== "theodore-assets" || t.version !== 1 || typeof ((r = t.library) == null ? void 0 : r.id) != "string" || !t.library.id.trim() || typeof ((o = t.library) == null ? void 0 : o.name) != "string") throw new Error("不是有效的素材库 JSON / Invalid asset library JSON");
  Fr(t.assets);
}
function bn(e) {
  var o;
  const t = e;
  if (!t || t.format !== "theodore-episode" || t.version !== 1 || typeof ((o = t.project) == null ? void 0 : o.name) != "string" || !t.project.name.trim() || !Array.isArray(t.shots) || !Array.isArray(t.requiredAssets)) throw new Error("不是有效的分镜 JSON / Invalid episode JSON");
  Fr(t.requiredAssets);
  const r = new Set(t.requiredAssets.map((i) => je(i.alias)));
  for (const i of Vr(t)) if (!r.has(i)) throw new Error(`分镜未声明素材 / Undeclared asset: ${i}`);
}
function Vr(e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of [e.promptPrefix, e.promptSuffix, ...e.shots.flatMap((o) => [o.prompt, o.negativePrompt])])
    for (const o of (r ?? "").matchAll(/\{\{ref:([^}]+)\}\}/g)) t.add(je(o[1].replace(/\.audio$/i, "")));
  return t;
}
function Wn(e) {
  return {
    format: "theodore-assets",
    version: 1,
    library: et(e.assetLibrary ?? { id: `library_${e.project.id}`, name: e.project.name }),
    // 镜头适用范围属于当集，系列清单不携带其他集的镜头 ID。
    assets: e.assets.map((t) => ({ ...et(t), enabled: !0, fixed: !1, shotIds: [] }))
  };
}
function Jn(e) {
  const { assets: t, ...r } = et(e), o = Vr(e), i = new Set(e.shots.flatMap((s) => s.disabledAssetIds)), a = t.filter((s) => o.has(je(s.alias)) || s.fixed || i.has(s.id)).map(({ id: s, alias: m, kind: h, enabled: d, fixed: f, shotIds: c, includeVideoAudio: p }) => ({ id: s, alias: m, kind: h, enabled: d, fixed: f, shotIds: c, includeVideoAudio: p })), l = { ...r, format: "theodore-episode", version: 1, requiredAssets: a };
  return bn(l), l;
}
function ni(e, t) {
  Gr(t);
  const r = ft({ ...e, assets: t.assets }).assets, o = et(e), i = new Map(o.assets.map((h) => [je(h.alias), h])), a = new Set(o.assets.map((h) => h.id));
  let l = 0, s = 0;
  const m = [];
  for (const h of r) {
    const d = i.get(je(h.alias));
    if (d) {
      if (d.kind !== h.kind) throw new Error(`同名素材类型不同 / Asset kind mismatch: ${h.alias}`);
      const f = !h.path.trim() && !!d.path.trim(), c = {
        ...d,
        ...h,
        id: d.id,
        alias: d.alias,
        enabled: d.enabled,
        fixed: d.fixed,
        fixedOrder: d.fixedOrder,
        shotIds: d.shotIds,
        imageGeneration: h.imageGeneration ?? d.imageGeneration,
        imageGenerationPending: h.imageGenerationPending ?? d.imageGenerationPending
      };
      f && (c.path = d.path, c.durationSeconds = d.durationSeconds, c.audioDurationSeconds = d.audioDurationSeconds, c.fingerprint = d.fingerprint, m.push(d.alias)), Object.assign(d, c), s += 1;
    } else {
      const f = { ...h, id: a.has(h.id) ? gn("asset") : h.id, shotIds: [] };
      a.add(f.id), i.set(je(h.alias), f), o.assets.push(f), l += 1;
    }
  }
  return o.assetLibrary = et(t.library), { plan: o, added: l, updated: s, keptPaths: m };
}
function ri(e, t) {
  bn(t);
  const r = et(e.assets).map((c) => ({ ...c, fixed: !1, shotIds: [] })), o = new Map(r.map((c) => [je(c.alias), c])), i = new Set(r.map((c) => c.id)), a = /* @__PURE__ */ new Map(), l = [];
  for (const c of t.requiredAssets) {
    let p = o.get(je(c.alias));
    if (p && p.kind !== c.kind) throw new Error(`同名素材类型不同 / Asset kind mismatch: ${c.alias}`);
    if (!p) {
      const b = c.id && !i.has(c.id) ? c.id : gn("asset");
      p = { id: b, alias: c.alias, kind: c.kind, path: "", enabled: !0, fixed: !1, fixedOrder: r.length + 1, shotIds: [], includeVideoAudio: !1, durationSeconds: null, audioDurationSeconds: null, fingerprint: "" }, r.push(p), o.set(je(c.alias), p), i.add(b);
    }
    p.enabled = c.enabled ?? !0, p.fixed = c.fixed ?? !1, p.shotIds = [...c.shotIds ?? []], p.includeVideoAudio = c.includeVideoAudio ?? p.includeVideoAudio, c.id && a.set(c.id, p.id), p.path.trim() || l.push(c.alias);
  }
  const { format: s, version: m, requiredAssets: h, ...d } = t, f = Ur(e, { ...d, assetLibrary: t.assetLibrary ?? e.assetLibrary, assets: r });
  return f.plan.assets = r, f.plan.shots = f.plan.shots.map((c) => ({ ...c, disabledAssetIds: c.disabledAssetIds.map((p) => a.get(p) ?? p) })), { ...f, keptPaths: r.filter((c) => c.path.trim()).map((c) => c.alias), missingAssets: l };
}
function Fe(e) {
  return (Array.isArray(e.results) && e.results.length ? e.results : e.path ? [{ path: e.path, bytes: e.bytes, modifiedAt: e.modifiedAt, stage: e.stage, processingMode: e.processingMode, sourcePath: e.sourcePath, completedAt: e.completedAt }] : []).filter((r) => typeof r.path == "string" && r.path.trim().length > 0).sort((r, o) => (o.modifiedAt ?? 0) - (r.modifiedAt ?? 0));
}
function oi(e, t) {
  const r = /_video_(\d+)/i.exec(e.replace(/\\/g, "/"));
  return r ? Number(r[1]) : t;
}
function ii(e, t) {
  return e.stage === "second_pass" && t !== "super_resolution_only" ? "second_pass_requires_upscale_only" : e.stage === "upscaled" ? "upscaled_is_terminal" : null;
}
function si(e, t) {
  return ii(e, t) === null;
}
function ai(e) {
  return ["super_resolution_second_pass", "latent_upscale_second_pass", "super_resolution_only"].filter((r) => si(e, r));
}
function Hr(e) {
  const t = ke(null), [r, o] = R(!1);
  return Pe(() => {
    const i = t.current;
    if (!i) return;
    if (!("IntersectionObserver" in window)) {
      o(!0);
      return;
    }
    const a = new IntersectionObserver((l) => {
      o(l.some((s) => s.isIntersecting));
    }, { rootMargin: e });
    return a.observe(i), () => a.disconnect();
  }, []), { hostRef: t, active: r };
}
function di({ src: e, className: t }) {
  const { hostRef: r, active: o } = Hr("320px");
  return /* @__PURE__ */ n("div", { class: `td-lazy-player ${t ?? ""}`, ref: r, children: o ? /* @__PURE__ */ n("video", { src: e, controls: !0, preload: "metadata", playsInline: !0 }, e) : /* @__PURE__ */ n("span", { children: "…" }) });
}
function st({ src: e, alt: t }) {
  const { hostRef: r, active: o } = Hr("160px");
  return /* @__PURE__ */ n("div", { class: "td-result-thumb", ref: r, children: o ? /* @__PURE__ */ n("video", { src: e, "aria-label": t, muted: !0, playsInline: !0, preload: "metadata", onLoadedMetadata: (i) => {
    const a = i.currentTarget;
    Number.isFinite(a.duration) && a.duration > 0.02 && (a.currentTime = Math.min(0.25, Math.max(0, a.duration - 0.05)));
  } }) : /* @__PURE__ */ n("span", { children: "…" }) });
}
function xn(e) {
  let t = 0;
  return e.shots.map((r, o) => {
    const i = {
      key: `${o}:${r.id}`,
      shot: r,
      sourceIndex: o,
      activeIndex: r.enabled ? t : -1
    };
    return r.enabled && (t += 1), i;
  });
}
function li(e, t, r) {
  return e.filter((o) => o.shot.enabled && t[o.key]).map((o) => ({
    shotId: o.shot.id,
    activeIndex: o.activeIndex,
    path: r[o.key] ?? ""
  }));
}
function ci(e, t, r) {
  const o = {};
  return e.forEach((i) => {
    const a = i.sourceIndex + 1;
    o[i.key] = i.shot.enabled && a >= t && a <= r;
  }), o;
}
function pi(e, t, r) {
  return `/theodore-director/v1/generated-video?${new URLSearchParams({ projectName: e.project.name, runId: e.project.runId, shotId: t, activeIndex: String(r) }).toString()}`;
}
function ui(e, t, r) {
  return t === "latent_upscale_second_pass" ? r === "zh" ? "Latent 放大二采" : "Latent upscale 2nd pass" : t === "super_resolution_second_pass" || e === "second_pass" ? r === "zh" ? "超分二采" : "Super-res 2nd pass" : t === "super_resolution_only" || e === "upscaled" ? r === "zh" ? "只超分" : "Super-res only" : e === "first_pass" ? r === "zh" ? "一采" : "1st pass" : r === "zh" ? "旧结果" : "Legacy";
}
function hi(e, t) {
  return e === "latent_upscale_second_pass" ? t === "zh" ? "Latent 放大二采" : "Latent upscale 2nd pass" : e === "super_resolution_only" ? t === "zh" ? "只超分" : "Super-res only" : t === "zh" ? "超分二采" : "Super-res 2nd pass";
}
function mi({ plan: e, language: t, queueSecondPass: r }) {
  var g;
  const o = Ve(() => xn(e), [e]), [i, a] = R({}), [l, s] = R({}), [m, h] = R(null), [d, f] = R(0), [c, p] = R({}), [b, _] = R({ value: 0, max: 0 }), N = ke(!1), k = ((g = e.pipeline) == null ? void 0 : g.secondPassDenoise) ?? 0.3;
  Pe(() => {
    let $ = !1;
    const T = {};
    return o.forEach((C) => {
      T[C.key] = { loading: !0, response: { found: !1, results: [] } };
    }), a(T), o.forEach((C) => {
      fetch(pi(e, C.shot.id, C.activeIndex)).then(async (S) => {
        const L = await S.json();
        if (!S.ok) throw new Error(L.error || `HTTP ${S.status}`);
        $ || a((V) => ({ ...V, [C.key]: { loading: !1, response: L } }));
      }).catch((S) => {
        $ || a((L) => ({ ...L, [C.key]: { loading: !1, response: { found: !1, results: [], error: String(S) } } }));
      });
    }), () => {
      $ = !0;
    };
  }, [e.project.name, e.project.runId, e.shots.map(($) => $.id).join("|"), d]);
  const w = async ($, T, C) => {
    if (!r || N.current) return;
    N.current = !0;
    const S = `${T}:${C}`;
    s((L) => ({ ...L, [S]: { state: "queued" } }));
    try {
      await r({
        plan: e,
        shotId: $,
        sourcePath: T,
        requestId: `td2_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`,
        processingMode: C,
        phase: "second_pass",
        denoise: C === "super_resolution_only" ? void 0 : k,
        onProgress: _
      }), s((L) => ({ ...L, [S]: { state: "done" } })), f((L) => L + 1);
    } catch (L) {
      s((V) => ({ ...V, [S]: { state: "error", message: String(L instanceof Error ? L.message : L) } }));
    } finally {
      N.current = !1;
    }
  }, z = Object.values(l).some(($) => $.state === "queued");
  return /* @__PURE__ */ n("section", { class: "td-postprocess td-second-pass-panel", children: [
    /* @__PURE__ */ n("div", { class: "td-post-header", children: [
      /* @__PURE__ */ n("div", { children: [
        /* @__PURE__ */ n("h2", { children: t === "zh" ? "单独二采" : "Standalone processing" }),
        /* @__PURE__ */ n("p", { children: t === "zh" ? "对满意结果执行所选高清处理；二采结果只能继续只超分，不重跑一采或启动 Impact 循环。" : "Process a selected result; second-pass outputs may only continue with Super-res only, without rerunning the first pass or Impact loop." })
      ] }),
      /* @__PURE__ */ n("div", { class: "td-post-actions", children: /* @__PURE__ */ n("button", { onClick: () => f(($) => $ + 1), children: [
        "↻ ",
        t === "zh" ? "刷新结果" : "Refresh"
      ] }) })
    ] }),
    /* @__PURE__ */ n("div", { class: "td-post-warning", children: t === "zh" ? `整体二采请到「审片与生成」页执行（使用每段选定的结果，按分镜顺序）。这里用于单独处理某一个结果；重绘强度沿用审片页设置：${k.toFixed(2)}。` : `Run the batch second pass from Review & generate. Denoise: ${k.toFixed(2)}.` }),
    z && /* @__PURE__ */ n("div", { class: "td-batch-progress", children: [
      /* @__PURE__ */ n("span", { children: t === "zh" ? "当前任务进度" : "Current task" }),
      /* @__PURE__ */ n("progress", { max: b.max || 1, value: b.value }),
      /* @__PURE__ */ n("b", { children: b.max ? `${Math.round(b.value / b.max * 100)}%` : "…" })
    ] }),
    !r && /* @__PURE__ */ n("div", { class: "td-post-warning", children: t === "zh" ? "当前工作流缺少后处理二采支流，请重新载入仓库中的 V7 导播台示例工作流。" : "This workflow does not contain the standalone second-pass branch. Reload the V7 example workflow from the repository." }),
    /* @__PURE__ */ n("div", { class: "td-post-shot-list", children: o.map(($) => {
      const T = i[$.key], C = Fe((T == null ? void 0 : T.response) ?? { results: [] });
      return /* @__PURE__ */ n("article", { class: "td-post-shot", children: [
        /* @__PURE__ */ n("header", { children: [
          /* @__PURE__ */ n("span", { children: [
            /* @__PURE__ */ n("strong", { children: $.shot.id }),
            /* @__PURE__ */ n("em", { children: $.shot.title })
          ] }),
          /* @__PURE__ */ n("span", { children: [
            $.shot.durationSeconds,
            "s"
          ] })
        ] }),
        !$.shot.enabled && /* @__PURE__ */ n("div", { class: "td-post-shot-disabled-note", children: t === "zh" ? "镜头已禁用，但仍可对历史一采结果进行后处理。" : "This shot is disabled, but its historical first-pass results remain available." }),
        T != null && T.loading ? /* @__PURE__ */ n("div", { class: "td-post-shot-empty", children: t === "zh" ? "正在查询生成结果…" : "Loading results…" }) : T != null && T.response.error ? /* @__PURE__ */ n("div", { class: "td-post-shot-empty errors", children: t === "zh" ? "查询失败，请重启 ComfyUI 后重试。" : "Query failed. Restart ComfyUI and retry." }) : C.length ? /* @__PURE__ */ n("div", { class: "td-post-result-list", children: C.map((S) => {
          const L = Ie(S.path, "output"), V = ai(S), O = V.includes(c[S.path]) ? c[S.path] : V[0], U = O ? l[`${S.path}:${O}`] : void 0;
          return /* @__PURE__ */ n("div", { class: "td-second-pass-result", children: [
            /* @__PURE__ */ n("button", { class: "td-post-result-choice", onClick: () => L && h({ path: S.path, title: `${$.shot.id} · ${$.shot.title}` }), children: [
              L ? /* @__PURE__ */ n(st, { src: L, alt: Ce(S.path) }) : /* @__PURE__ */ n("div", { class: "td-result-thumb", children: "×" }),
              /* @__PURE__ */ n("span", { children: [
                /* @__PURE__ */ n("strong", { children: [
                  ui(S.stage, S.processingMode, t),
                  (S.stage === "legacy_unknown" || !S.stage) && /* @__PURE__ */ n("em", { children: t === "zh" ? "兼容" : "Compatible" })
                ] }),
                /* @__PURE__ */ n("span", { title: S.path, children: Ce(S.path) }),
                /* @__PURE__ */ n("small", { children: S.bytes ? `${(S.bytes / 1024 / 1024).toFixed(1)} MB` : "" })
              ] })
            ] }),
            /* @__PURE__ */ n("div", { class: "td-second-pass-actions", children: [
              O ? /* @__PURE__ */ n("select", { "aria-label": t === "zh" ? "该视频可用的处理方式" : "Available processing modes for this video", value: O, disabled: z, onChange: (P) => p((oe) => ({ ...oe, [S.path]: P.currentTarget.value })), children: V.map((P) => /* @__PURE__ */ n("option", { value: P, children: hi(P, t) })) }) : /* @__PURE__ */ n("span", { class: "td-second-pass-terminal", children: t === "zh" ? "只超分后不可再处理" : "Upscaled: no further processing" }),
              /* @__PURE__ */ n("button", { class: "primary td-second-pass-run", disabled: !r || !O || z, onClick: () => O && void w($.shot.id, S.path, O), children: (U == null ? void 0 : U.state) === "queued" ? t === "zh" ? "排队/执行中…" : "Queued/running…" : (U == null ? void 0 : U.state) === "done" ? t === "zh" ? "处理完成" : "Completed" : t === "zh" ? "开始处理" : "Process" })
            ] }),
            (U == null ? void 0 : U.state) === "error" && /* @__PURE__ */ n("div", { class: "td-second-pass-error", children: U.message })
          ] }, S.path);
        }) }) : /* @__PURE__ */ n("div", { class: "td-post-shot-empty", children: t === "zh" ? "没有可用的生成结果" : "No generated result available" })
      ] }, $.key);
    }) }),
    m && Ie(m.path, "output") && /* @__PURE__ */ n("div", { class: "td-post-preview-overlay", role: "presentation", onClick: () => h(null), children: /* @__PURE__ */ n("section", { role: "dialog", "aria-modal": "true", onClick: ($) => $.stopPropagation(), children: [
      /* @__PURE__ */ n("header", { children: [
        /* @__PURE__ */ n("strong", { children: m.title }),
        /* @__PURE__ */ n("button", { onClick: () => h(null), children: "×" })
      ] }),
      /* @__PURE__ */ n("video", { src: Ie(m.path, "output") ?? "", controls: !0, autoPlay: !0, preload: "metadata", playsInline: !0 }),
      /* @__PURE__ */ n("p", { children: Ce(m.path) })
    ] }) })
  ] });
}
function fi(e, t, r) {
  return `/theodore-director/v1/generated-video?${new URLSearchParams({ projectName: e.project.name, runId: e.project.runId, shotId: t, activeIndex: String(r) }).toString()}`;
}
function gi(e) {
  return `/theodore-director/v1/postprocess/merged-videos?${new URLSearchParams({ projectName: e.project.name, runId: e.project.runId }).toString()}`;
}
async function qn(e) {
  const t = await fetch(e), r = await t.json();
  if (!t.ok) throw new Error(r.error || `HTTP ${t.status}`);
  return r;
}
function Kn(e, t) {
  const r = Fe(e).filter((o) => o.path !== t);
  return { found: !!r.length, count: r.length, results: r };
}
function bi(e, t, r, o = "") {
  return { projectName: e.project.name, runId: e.project.runId, kind: t, shotId: o, path: r };
}
function xi(e, t) {
  return e.processingMode === "latent_upscale_second_pass" ? t === "zh" ? "Latent 放大二采" : "Latent upscale 2nd pass" : e.processingMode === "super_resolution_second_pass" || e.stage === "second_pass" ? t === "zh" ? "超分二采" : "Super-res 2nd pass" : e.processingMode === "super_resolution_only" || e.stage === "upscaled" ? t === "zh" ? "只超分" : "Super-res only" : e.stage === "first_pass" ? t === "zh" ? "一采" : "1st pass" : t === "zh" ? "旧结果" : "Legacy";
}
function vi({ plan: e, language: t }) {
  const r = Ve(() => xn(e), [e]), [o, i] = R({}), [a, l] = R({ loading: !0, response: { found: !1, results: [] } }), [s, m] = R({}), [h, d] = R(null), [f, c] = R(""), [p, b] = R(0);
  Pe(() => {
    let w = !1;
    const z = {};
    return r.forEach((g) => {
      z[g.key] = { loading: !0, response: { found: !1, results: [] } };
    }), i(z), c(""), r.forEach((g) => {
      qn(fi(e, g.shot.id, g.activeIndex)).then(($) => {
        w || i((T) => ({ ...T, [g.key]: { loading: !1, response: $ } }));
      }).catch(($) => {
        w || i((T) => ({ ...T, [g.key]: { loading: !1, response: { found: !1, results: [], error: String($) } } }));
      });
    }), () => {
      w = !0;
    };
  }, [e.project.name, e.project.runId, e.shots.map((w) => w.id).join("|"), p]), Pe(() => {
    let w = !1;
    return l({ loading: !0, response: { found: !1, results: [] } }), qn(gi(e)).then((z) => {
      w || l({ loading: !1, response: z });
    }).catch((z) => {
      w || l({ loading: !1, response: { found: !1, results: [], error: String(z) } });
    }), () => {
      w = !0;
    };
  }, [e.project.name, e.project.runId, p]);
  const _ = async (w, z, g = "", $ = "") => {
    const T = Ce(z.path);
    if (window.confirm(t === "zh" ? `确定将“${T}”移入系统回收站吗？
可从系统回收站恢复。` : `Move “${T}” to the system trash?
You can restore it from the trash.`)) {
      (h == null ? void 0 : h.path) === z.path && d(null), m((S) => ({ ...S, [z.path]: !0 })), c(""), await new Promise((S) => requestAnimationFrame(() => requestAnimationFrame(() => S())));
      try {
        const S = await fetch("/theodore-director/v1/postprocess/delete-video", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bi(e, w, z.path, g))
        }), L = await S.json();
        if (!S.ok) throw new Error(L.error || `HTTP ${S.status}`);
        w === "merged" ? l((V) => ({ ...V, response: Kn(V.response, z.path) })) : i((V) => {
          var O;
          return {
            ...V,
            [$]: { ...V[$], response: Kn(((O = V[$]) == null ? void 0 : O.response) ?? { found: !1, results: [] }, z.path) }
          };
        });
      } catch (S) {
        c(String(S instanceof Error ? S.message : S));
      } finally {
        m((S) => {
          const L = { ...S };
          return delete L[z.path], L;
        });
      }
    }
  }, N = (w, z, g, $ = "", T = "") => {
    const C = Ie(w.path, "output"), S = !!s[w.path];
    return /* @__PURE__ */ n("div", { class: `td-delete-result ${S ? "deleting" : ""}`, children: [
      /* @__PURE__ */ n("button", { class: "td-post-result-choice", disabled: S || !C, onClick: () => C && d({ path: w.path, title: g }), children: [
        S ? /* @__PURE__ */ n("div", { class: "td-result-thumb", children: "…" }) : C ? /* @__PURE__ */ n(st, { src: C, alt: wi(w, t) }) : /* @__PURE__ */ n("div", { class: "td-result-thumb", children: "×" }),
        /* @__PURE__ */ n("span", { children: [
          /* @__PURE__ */ n("strong", { children: z === "merged" ? t === "zh" ? "合并视频" : "Merged video" : xi(w, t) }),
          /* @__PURE__ */ n("span", { title: w.path, children: Ce(w.path) }),
          /* @__PURE__ */ n("small", { children: w.bytes ? `${(w.bytes / 1024 / 1024).toFixed(1)} MB` : "" })
        ] })
      ] }),
      /* @__PURE__ */ n("button", { class: "danger td-delete-video-button", disabled: S, onClick: () => void _(z, w, $, T), children: S ? t === "zh" ? "正在移动…" : "Moving…" : t === "zh" ? "移入回收站" : "Move to trash" })
    ] }, w.path);
  }, k = Fe(a.response);
  return /* @__PURE__ */ n("section", { class: "td-postprocess td-delete-panel", children: [
    /* @__PURE__ */ n("div", { class: "td-post-header", children: [
      /* @__PURE__ */ n("div", { children: [
        /* @__PURE__ */ n("h2", { children: t === "zh" ? "删除视频" : "Delete videos" }),
        /* @__PURE__ */ n("p", { children: t === "zh" ? "逐条预览并将当前项目的视频移入系统回收站；不会删除素材、latent 或尾帧。" : "Preview videos and move them to the system trash one at a time. Assets, latent files, and tail frames are preserved." })
      ] }),
      /* @__PURE__ */ n("div", { class: "td-post-actions", children: /* @__PURE__ */ n("button", { onClick: () => b((w) => w + 1), children: [
        "↻ ",
        t === "zh" ? "刷新结果" : "Refresh"
      ] }) })
    ] }),
    f && /* @__PURE__ */ n("div", { class: "td-post-error", children: [
      t === "zh" ? "删除失败：" : "Delete failed: ",
      f
    ] }),
    /* @__PURE__ */ n("div", { class: "td-post-shot-list", children: r.map((w) => {
      const z = o[w.key], g = Fe((z == null ? void 0 : z.response) ?? { results: [] });
      return /* @__PURE__ */ n("article", { class: "td-post-shot", children: [
        /* @__PURE__ */ n("header", { children: [
          /* @__PURE__ */ n("span", { children: [
            /* @__PURE__ */ n("strong", { children: w.shot.id }),
            /* @__PURE__ */ n("em", { children: w.shot.title })
          ] }),
          /* @__PURE__ */ n("span", { children: [
            w.shot.durationSeconds,
            "s"
          ] })
        ] }),
        !w.shot.enabled && /* @__PURE__ */ n("div", { class: "td-post-shot-disabled-note", children: t === "zh" ? "镜头已禁用，仍可管理其历史视频。" : "This shot is disabled; its historical videos can still be managed." }),
        z != null && z.loading ? /* @__PURE__ */ n("div", { class: "td-post-shot-empty", children: t === "zh" ? "正在查询生成结果…" : "Loading results…" }) : z != null && z.response.error ? /* @__PURE__ */ n("div", { class: "td-post-shot-empty errors", children: t === "zh" ? "查询失败" : "Unable to load results" }) : g.length ? /* @__PURE__ */ n("div", { class: "td-post-result-list", children: g.map(($) => N($, "shot", `${w.shot.id} · ${w.shot.title}`, w.shot.id, w.key)) }) : /* @__PURE__ */ n("div", { class: "td-post-shot-empty", children: t === "zh" ? "没有生成视频" : "No generated videos" })
      ] }, w.key);
    }) }),
    /* @__PURE__ */ n("section", { class: "td-post-merged td-delete-merged", children: [
      /* @__PURE__ */ n("header", { children: /* @__PURE__ */ n("div", { children: [
        /* @__PURE__ */ n("h2", { children: t === "zh" ? "合并视频" : "Merged videos" }),
        /* @__PURE__ */ n("span", { class: `td-result-state ${k.length ? "found" : ""}`, children: a.loading ? t === "zh" ? "查询中" : "Loading" : t === "zh" ? `${k.length} 个结果` : `${k.length} results` })
      ] }) }),
      a.loading ? /* @__PURE__ */ n("div", { class: "td-result-empty", children: t === "zh" ? "正在查询合并视频…" : "Loading merged videos…" }) : a.response.error ? /* @__PURE__ */ n("div", { class: "td-result-empty errors", children: t === "zh" ? "无法查询合并视频" : "Unable to load merged videos" }) : k.length ? /* @__PURE__ */ n("div", { class: "td-delete-merged-list", children: k.map((w) => N(w, "merged", t === "zh" ? "合并视频" : "Merged video")) }) : /* @__PURE__ */ n("div", { class: "td-result-empty", children: t === "zh" ? "没有合并视频" : "No merged videos" })
    ] }),
    h && Ie(h.path, "output") && /* @__PURE__ */ n("div", { class: "td-post-preview-overlay", role: "presentation", onClick: () => d(null), children: /* @__PURE__ */ n("section", { role: "dialog", "aria-modal": "true", onClick: (w) => w.stopPropagation(), children: [
      /* @__PURE__ */ n("header", { children: [
        /* @__PURE__ */ n("strong", { children: h.title }),
        /* @__PURE__ */ n("button", { "aria-label": t === "zh" ? "关闭预览" : "Close preview", onClick: () => d(null), children: "×" })
      ] }),
      /* @__PURE__ */ n("video", { src: Ie(h.path, "output") ?? "", controls: !0, autoPlay: !0, preload: "metadata", playsInline: !0 }),
      /* @__PURE__ */ n("p", { title: h.path, children: Ce(h.path) })
    ] }) })
  ] });
}
function wi(e, t) {
  return `${t === "zh" ? "视频" : "Video"} ${Ce(e.path)}`;
}
async function Qn(e) {
  const t = await fetch(e), r = await t.json();
  if (!t.ok) throw new Error(r.error || `HTTP ${t.status}`);
  return r;
}
function yi(e, t, r) {
  return `/theodore-director/v1/generated-video?${new URLSearchParams({
    projectName: e.project.name,
    runId: e.project.runId,
    shotId: t,
    activeIndex: String(r)
  }).toString()}`;
}
function _i(e) {
  return `/theodore-director/v1/postprocess/merged-videos?${new URLSearchParams({ projectName: e.project.name, runId: e.project.runId }).toString()}`;
}
function ki({ plan: e, language: t, queueSecondPass: r }) {
  const [o, i] = R("merge");
  return /* @__PURE__ */ n("section", { class: "td-postprocess-shell", children: [
    /* @__PURE__ */ n("div", { class: "td-post-mode-tabs", role: "tablist", children: [
      /* @__PURE__ */ n("button", { class: o === "merge" ? "active" : "", role: "tab", "aria-selected": o === "merge", onClick: () => i("merge"), children: t === "zh" ? "合并视频" : "Merge videos" }),
      /* @__PURE__ */ n("button", { class: o === "second-pass" ? "active" : "", role: "tab", "aria-selected": o === "second-pass", onClick: () => i("second-pass"), children: t === "zh" ? "单独二采" : "Standalone second pass" }),
      /* @__PURE__ */ n("button", { class: o === "delete" ? "active" : "", role: "tab", "aria-selected": o === "delete", onClick: () => i("delete"), children: t === "zh" ? "删除视频" : "Delete videos" })
    ] }),
    o === "merge" ? /* @__PURE__ */ n(Si, { plan: e, language: t }) : o === "second-pass" ? /* @__PURE__ */ n(mi, { plan: e, language: t, queueSecondPass: r }) : /* @__PURE__ */ n(vi, { plan: e, language: t })
  ] });
}
function Si({ plan: e, language: t }) {
  const r = Ve(() => xn(e), [e]), [o, i] = R({}), [a, l] = R({}), [s, m] = R({}), [h, d] = R(null), [f, c] = R(!1), [p, b] = R(""), [_, N] = R(""), [k, w] = R({ found: !1, results: [] }), [z, g] = R(!1), [$, T] = R(!1), [C, S] = R(""), [L, V] = R(0), [O, U] = R("1"), [P, oe] = R(String(r.length || 1)), y = r.filter((E) => E.shot.enabled), D = y.length > 0 && y.every((E) => a[E.key]), j = li(r, a, s), H = j.filter((E) => !E.path), te = r.some((E) => {
    var B;
    return a[E.key] && ((B = o[E.key]) == null ? void 0 : B.loading);
  }), X = r.reduce(
    (E, B) => E + (B.shot.enabled && a[B.key] ? B.shot.durationSeconds : 0),
    0
  ), M = Ve(() => Fe(k), [k]), v = M.find((E) => E.path === C) ?? M[0];
  Pe(() => {
    let E = !1;
    const B = {}, ue = {};
    return r.forEach((ne) => {
      B[ne.key] = ne.shot.enabled, ue[ne.key] = { loading: !0, response: { found: !1, results: [] } };
    }), l((ne) => {
      const u = {};
      return r.forEach((G) => {
        u[G.key] = G.shot.enabled ? ne[G.key] ?? B[G.key] : !1;
      }), u;
    }), i(ue), b(""), r.forEach((ne) => {
      Qn(yi(e, ne.shot.id, ne.activeIndex)).then((u) => {
        if (E) return;
        const G = Fe(u);
        i((Y) => ({ ...Y, [ne.key]: { loading: !1, response: u } })), m((Y) => {
          var ce;
          return {
            ...Y,
            [ne.key]: G.some((be) => be.path === Y[ne.key]) ? Y[ne.key] : ((ce = G[0]) == null ? void 0 : ce.path) ?? ""
          };
        });
      }).catch((u) => {
        E || i((G) => ({
          ...G,
          [ne.key]: { loading: !1, response: { found: !1, results: [], error: String(u) } }
        }));
      });
    }), () => {
      E = !0;
    };
  }, [e.project.name, e.project.runId, e.shots.map((E) => `${E.id}:${E.enabled}`).join("|"), L]), Pe(() => {
    let E = !1;
    return g(!0), Qn(_i(e)).then((B) => {
      if (E) return;
      const ue = Fe(B);
      w(B), S((ne) => {
        var u;
        return ue.some((G) => G.path === ne) ? ne : ((u = ue[0]) == null ? void 0 : u.path) ?? "";
      });
    }).catch((B) => {
      E || w({ found: !1, results: [], error: String(B) });
    }).finally(() => {
      E || g(!1);
    }), () => {
      E = !0;
    };
  }, [e.project.name, e.project.runId, L]);
  const K = () => {
    const E = !D;
    l((B) => {
      const ue = { ...B };
      return y.forEach((ne) => {
        ue[ne.key] = E;
      }), ue;
    });
  }, Z = () => {
    const E = Number(O), B = Number(P);
    if (!Number.isInteger(E) || !Number.isInteger(B) || E < 1 || B < E || B > r.length) {
      window.alert(t === "zh" ? `请输入有效范围：1 ≤ m ≤ n ≤ ${r.length}` : `Enter a valid range: 1 ≤ m ≤ n ≤ ${r.length}`);
      return;
    }
    l(ci(r, E, B));
  }, Q = async () => {
    if (!j.length) {
      window.alert(t === "zh" ? "请至少选择一个镜头" : "Select at least one shot.");
      return;
    }
    if (H.length) {
      window.alert(t === "zh" ? `以下已选镜头没有可用结果：${H.map((E) => E.shotId).join("、")}` : `Selected shots without a result: ${H.map((E) => E.shotId).join(", ")}`);
      return;
    }
    c(!0), b("");
    try {
      const E = await fetch("/theodore-director/v1/postprocess/merge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectName: e.project.name, runId: e.project.runId, selections: j })
      }), B = await E.json();
      if (!E.ok) throw new Error(B.error || `HTTP ${E.status}`);
      V((ue) => ue + 1);
    } catch (E) {
      b(String(E instanceof Error ? E.message : E));
    } finally {
      c(!1);
    }
  }, ee = async () => {
    T(!0), N("");
    try {
      const E = await fetch("/theodore-director/v1/postprocess/open-folder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectName: e.project.name, runId: e.project.runId })
      }), B = await E.json();
      if (!E.ok) throw new Error(B.error || `HTTP ${E.status}`);
    } catch (E) {
      N(String(E instanceof Error ? E.message : E));
    } finally {
      T(!1);
    }
  }, pe = v != null && v.path ? Ie(v.path, "output") : null;
  return /* @__PURE__ */ n("section", { class: "td-postprocess", children: [
    /* @__PURE__ */ n("div", { class: "td-post-header", children: [
      /* @__PURE__ */ n("div", { children: [
        /* @__PURE__ */ n("h2", { children: t === "zh" ? "合并视频" : "Merge videos" }),
        /* @__PURE__ */ n("p", { children: t === "zh" ? "从每个镜头选择一个结果，按当前分镜顺序进行无损合并。" : "Choose one result per shot and merge them losslessly in storyboard order." })
      ] }),
      /* @__PURE__ */ n("div", { class: "td-post-actions", children: [
        /* @__PURE__ */ n("button", { disabled: $, onClick: ee, children: [
          "📁 ",
          $ ? t === "zh" ? "正在打开…" : "Opening…" : t === "zh" ? "打开结果文件夹" : "Open results folder"
        ] }),
        /* @__PURE__ */ n("button", { onClick: () => V((E) => E + 1), children: [
          "↻ ",
          t === "zh" ? "刷新结果" : "Refresh"
        ] }),
        /* @__PURE__ */ n("button", { onClick: K, children: D ? t === "zh" ? "全部取消" : "Clear all" : t === "zh" ? "一键全选" : "Select all" })
      ] })
    ] }),
    _ && /* @__PURE__ */ n("div", { class: "td-post-error", children: [
      t === "zh" ? "打开结果文件夹失败：" : "Unable to open results folder: ",
      _
    ] }),
    /* @__PURE__ */ n("div", { class: "td-post-summary", children: [
      /* @__PURE__ */ n("span", { children: t === "zh" ? `已选择 ${j.length}/${y.length} 个启用镜头` : `${j.length}/${y.length} enabled shots selected` }),
      /* @__PURE__ */ n("span", { children: t === "zh" ? `预计时长 ${X.toFixed(1)} 秒` : `Estimated duration ${X.toFixed(1)} sec` }),
      /* @__PURE__ */ n("div", { class: "td-post-range", role: "group", "aria-label": t === "zh" ? "合并视频范围" : "Merge video range", children: [
        /* @__PURE__ */ n("span", { children: t === "zh" ? "范围" : "Range" }),
        /* @__PURE__ */ n("input", { type: "number", min: "1", max: r.length, step: "1", value: O, "aria-label": t === "zh" ? "起始镜头 m" : "Start shot m", onInput: (E) => U(E.currentTarget.value) }),
        /* @__PURE__ */ n("span", { children: "—" }),
        /* @__PURE__ */ n("input", { type: "number", min: "1", max: r.length, step: "1", value: P, "aria-label": t === "zh" ? "结束镜头 n" : "End shot n", onInput: (E) => oe(E.currentTarget.value) }),
        /* @__PURE__ */ n("button", { disabled: !r.length, onClick: Z, children: t === "zh" ? "确认范围" : "Apply range" })
      ] }),
      /* @__PURE__ */ n("button", { class: "primary", disabled: f || te || !j.length || !!H.length, onClick: Q, children: f ? t === "zh" ? "正在合并…" : "Merging…" : t === "zh" ? "合并所选视频" : "Merge selected videos" })
    ] }),
    p && /* @__PURE__ */ n("div", { class: "td-post-error", children: [
      t === "zh" ? "合并失败：" : "Merge failed: ",
      p
    ] }),
    H.length > 0 && /* @__PURE__ */ n("div", { class: "td-post-warning", children: t === "zh" ? "已选镜头中存在尚未生成视频的镜头。" : "Some selected shots do not have generated videos yet." }),
    /* @__PURE__ */ n("div", { class: "td-post-shot-list", children: r.map((E) => {
      const B = o[E.key], ue = Fe((B == null ? void 0 : B.response) ?? { results: [] }), ne = !!a[E.key];
      return /* @__PURE__ */ n("article", { class: `td-post-shot ${ne ? "selected" : ""} ${E.shot.enabled ? "" : "disabled"}`, children: [
        /* @__PURE__ */ n("header", { children: [
          /* @__PURE__ */ n("label", { children: [
            /* @__PURE__ */ n("input", { type: "checkbox", checked: ne, disabled: !E.shot.enabled, onChange: (u) => l((G) => ({ ...G, [E.key]: u.currentTarget.checked })) }),
            /* @__PURE__ */ n("span", { children: [
              /* @__PURE__ */ n("strong", { children: E.shot.id }),
              /* @__PURE__ */ n("em", { children: E.shot.title })
            ] })
          ] }),
          /* @__PURE__ */ n("span", { children: [
            E.shot.durationSeconds,
            "s"
          ] })
        ] }),
        !E.shot.enabled && /* @__PURE__ */ n("div", { class: "td-post-shot-disabled-note", children: t === "zh" ? "该镜头当前已禁用：历史结果可以预览，但不能参加合并。" : "This shot is disabled: historical results can be previewed but cannot be merged." }),
        B != null && B.loading ? /* @__PURE__ */ n("div", { class: "td-post-shot-empty", children: t === "zh" ? "正在查询生成结果…" : "Loading generated results…" }) : B != null && B.response.error ? /* @__PURE__ */ n("div", { class: "td-post-shot-empty errors", children: t === "zh" ? "查询失败，请重启 ComfyUI 后重试。" : "Query failed. Restart ComfyUI and retry." }) : ue.length ? /* @__PURE__ */ n("div", { class: "td-post-result-list", children: ue.map((u, G) => {
          const Y = Ie(u.path, "output"), ce = s[E.key] === u.path, be = oi(u.path, ue.length - G);
          return /* @__PURE__ */ n("div", { class: `td-post-result ${ce ? "selected" : ""}`, children: [
            /* @__PURE__ */ n("button", { class: "td-post-result-choice", role: "radio", "aria-checked": ce, onClick: () => m((le) => ({ ...le, [E.key]: u.path })), children: [
              Y ? /* @__PURE__ */ n(st, { src: Y, alt: `${E.shot.title} ${t === "zh" ? "结果" : "result"} ${be}` }) : /* @__PURE__ */ n("div", { class: "td-result-thumb", children: "×" }),
              /* @__PURE__ */ n("span", { children: [
                /* @__PURE__ */ n("strong", { children: [
                  t === "zh" ? `结果 ${be}` : `Result ${be}`,
                  G === 0 && /* @__PURE__ */ n("em", { children: t === "zh" ? "最新" : "Latest" })
                ] }),
                /* @__PURE__ */ n("span", { title: u.path, children: Ce(u.path) }),
                /* @__PURE__ */ n("small", { children: u.bytes ? `${(u.bytes / 1024 / 1024).toFixed(1)} MB` : "" })
              ] })
            ] }),
            /* @__PURE__ */ n("button", { class: "td-post-result-play", disabled: !Y, title: t === "zh" ? "播放预览" : "Play preview", onClick: () => Y && d({ path: u.path, title: `${E.shot.id} · ${E.shot.title}` }), children: "▶" })
          ] }, u.path);
        }) }) : /* @__PURE__ */ n("div", { class: "td-post-shot-empty", children: t === "zh" ? "未找到这个镜头的生成结果" : "No generated result found for this shot" })
      ] }, E.key);
    }) }),
    /* @__PURE__ */ n("section", { class: "td-post-merged", children: [
      /* @__PURE__ */ n("header", { children: /* @__PURE__ */ n("div", { children: [
        /* @__PURE__ */ n("h2", { children: t === "zh" ? "合并结果" : "Merged results" }),
        /* @__PURE__ */ n("span", { class: `td-result-state ${M.length ? "found" : ""}`, children: z ? t === "zh" ? "查询中" : "Checking" : t === "zh" ? `${M.length} 个结果` : `${M.length} results` })
      ] }) }),
      z ? /* @__PURE__ */ n("div", { class: "td-result-empty", children: t === "zh" ? "正在查询合并结果…" : "Loading merged results…" }) : k.error ? /* @__PURE__ */ n("div", { class: "td-result-empty errors", children: t === "zh" ? "无法查询合并结果" : "Unable to query merged results" }) : v && pe ? /* @__PURE__ */ n("div", { class: "td-generated-results", children: [
        /* @__PURE__ */ n("div", { class: "td-generated-video", children: [
          /* @__PURE__ */ n("video", { src: pe, controls: !0, preload: "metadata", playsInline: !0 }, v.path),
          /* @__PURE__ */ n("div", { class: "td-generated-meta", title: v.path, children: v.path })
        ] }),
        /* @__PURE__ */ n("div", { class: "td-result-list", children: M.map((E, B) => {
          const ue = Ie(E.path, "output");
          return /* @__PURE__ */ n("button", { class: `td-result-item ${E.path === v.path ? "selected" : ""}`, onClick: () => S(E.path), children: [
            ue ? /* @__PURE__ */ n(st, { src: ue, alt: `${t === "zh" ? "合并结果" : "Merged result"} ${M.length - B}` }) : /* @__PURE__ */ n("div", { class: "td-result-thumb", children: "×" }),
            /* @__PURE__ */ n("span", { class: "td-result-item-copy", children: [
              /* @__PURE__ */ n("strong", { children: [
                t === "zh" ? `合并结果 ${M.length - B}` : `Merged result ${M.length - B}`,
                B === 0 && /* @__PURE__ */ n("em", { children: t === "zh" ? "最新" : "Latest" })
              ] }),
              /* @__PURE__ */ n("span", { children: Ce(E.path) }),
              /* @__PURE__ */ n("small", { children: E.bytes ? `${(E.bytes / 1024 / 1024).toFixed(1)} MB` : "" })
            ] })
          ] }, E.path);
        }) })
      ] }) : /* @__PURE__ */ n("div", { class: "td-result-empty", children: t === "zh" ? "还没有合并结果" : "No merged result yet" })
    ] }),
    h && Ie(h.path, "output") && /* @__PURE__ */ n("div", { class: "td-post-preview-overlay", role: "presentation", onClick: () => d(null), children: /* @__PURE__ */ n("section", { role: "dialog", "aria-modal": "true", onClick: (E) => E.stopPropagation(), children: [
      /* @__PURE__ */ n("header", { children: [
        /* @__PURE__ */ n("strong", { children: h.title }),
        /* @__PURE__ */ n("button", { "aria-label": t === "zh" ? "关闭预览" : "Close preview", onClick: () => d(null), children: "×" })
      ] }),
      /* @__PURE__ */ n("video", { src: Ie(h.path, "output") ?? "", controls: !0, autoPlay: !0, preload: "metadata", playsInline: !0 }),
      /* @__PURE__ */ n("p", { title: h.path, children: Ce(h.path) })
    ] }) })
  ] });
}
const Br = 5;
function $i(e) {
  return !e.stage || e.stage === "first_pass" || e.stage === "legacy_unknown";
}
function Re(e) {
  return e.filter($i).sort((t, r) => (r.modifiedAt ?? 0) - (t.modifiedAt ?? 0));
}
function tt(e, t) {
  var o;
  const r = (o = e.review) == null ? void 0 : o.take;
  return r && t.find((i) => i.path === r) || t[0];
}
const Yn = (e) => (e ?? "").replace(/\\/g, "/").replace(/^\.\//, "");
function gt(e, t, r) {
  const o = Yn(t);
  return e.filter((i) => (i.stage === "second_pass" || i.stage === "upscaled") && Yn(i.sourcePath) === o).filter((i) => !r || !i.processingMode || i.processingMode === r).sort((i, a) => (a.modifiedAt ?? 0) - (i.modifiedAt ?? 0));
}
function Wr(e, t) {
  const r = tt(e, Re(t));
  if (!r) return;
  const o = gt(t, r.path)[0];
  return o ? { item: o, processed: !0 } : { item: r, processed: !1 };
}
function Bt(e, t) {
  const r = e.shots.findIndex((o) => o.id === t);
  for (let o = r - 1; o >= 0; o -= 1)
    if (e.shots[o].enabled) return e.shots[o];
}
function xt(e, t) {
  return t.enabled && t.latentRelay && e.continuity.mode === "h3_av_latent" && !!Bt(e, t.id);
}
function Jr(e, t) {
  const r = e.shots.findIndex((i) => i.id === t);
  if (r < 0) return [];
  const o = [t];
  for (let i = r + 1; i < e.shots.length; i += 1) {
    const a = e.shots[i];
    if (a.enabled) {
      if (!xt(e, a)) break;
      o.push(a.id);
    }
  }
  return o;
}
function Nt(e, t) {
  return e.shots.filter((r) => r.enabled).findIndex((r) => r.id === t);
}
function Ii(e, t) {
  const r = e.shots.filter((i) => i.enabled), o = r.findIndex((i) => i.id === t);
  return o >= 0 && o + 1 < r.length ? o + 1 : 0;
}
function qr(e, t) {
  var a, l;
  const r = (a = e.pipeline) == null ? void 0 : a.latentWriters, o = e.shots.find((s) => s.id === t);
  if (!r || !o || !xt(e, o)) return null;
  const i = r[String(Nt(e, t))];
  return i ? i.shotId === ((l = Bt(e, t)) == null ? void 0 : l.id) ? null : "wrong" : "missing";
}
function Pi(e, t) {
  const r = new Set(t), o = [];
  let i = !0;
  for (; i; ) {
    i = !1;
    for (const l of [...r]) {
      const s = Bt(e, l);
      !s || r.has(s.id) || !qr(e, l) || (r.add(s.id), o.push(s.id), i = !0);
    }
  }
  return { shotIds: e.shots.filter((l) => r.has(l.id)).map((l) => l.id), added: e.shots.filter((l) => o.includes(l.id)).map((l) => l.id) };
}
function Ci(e, t) {
  var o;
  if (!t) return;
  const r = (t.modifiedAt ?? 0) + Br;
  return [...((o = e.review) == null ? void 0 : o.relayHistory) ?? []].sort((i, a) => a.at - i.at).find((i) => i.at <= r);
}
function Ei(e, t, r) {
  const o = r != null ? r + Br : t.modifiedAt ?? 0;
  return [...e].sort((i, a) => (a.modifiedAt ?? 0) - (i.modifiedAt ?? 0)).find((i) => (i.modifiedAt ?? 0) <= o);
}
function zi(e, t, r, o, i) {
  if (!e || !r) return "unknown";
  if (i) {
    if (i.source == null) return "unknown";
    if (o && i.source !== o) return "wrong_source";
  }
  const a = Ei(t, r, i == null ? void 0 : i.sourceAt);
  return a ? a.path === e.path ? "ok" : "mismatch" : "unknown";
}
function Ai(e) {
  let t = 5381;
  for (let r = 0; r < e.length; r += 1) t = (t << 5) + t + e.charCodeAt(r) | 0;
  return (t >>> 0).toString(36);
}
function Kr(e, t) {
  const r = e.assets.filter((o) => !(o.shotIds ?? []).length || o.shotIds.includes(t.id)).map((o) => [o.alias, o.kind, o.path, o.enabled, o.includeVideoAudio, o.durationSeconds, o.fixed, o.fixedOrder]);
  return Ai(JSON.stringify([
    t.prompt,
    t.negativePrompt,
    t.durationSeconds,
    t.latentRelay,
    t.seed,
    [...t.disabledAssetIds ?? []].sort(),
    e.promptPrefix,
    e.promptSuffix,
    e.continuity,
    r
  ]));
}
function Qr(e, t) {
  var o;
  const r = (o = t.review) == null ? void 0 : o.generatedSig;
  return !!r && r !== Kr(e, t);
}
function Yr() {
  return Math.floor(Math.random() * 4294967295);
}
const Je = { kind: null, total: 0, done: 0, progress: { value: 0, max: 0 }, message: "" }, Xn = {
  super_resolution_second_pass: ["超分二采（RTX 1.5× + 低噪重采）", "Super-res 2nd pass"],
  latent_upscale_second_pass: ["Latent 放大二采", "Latent upscale 2nd pass"],
  super_resolution_only: ["只超分（不重采，接缝零变化）", "Super-res only"]
};
function Ti({ plan: e, language: t, results: r, run: o, supportsSecondPass: i, setReview: a, setPipeline: l, onRunFirstPass: s, onRunSecondPass: m, onMerge: h, onStop: d, onRefresh: f, onOpenShot: c }) {
  var H, te, X;
  const p = (M, v) => t === "zh" ? M : v, [b, _] = R("all"), [N, k] = R(!0), w = e.shots.filter((M) => M.enabled), z = (M) => Re(r.byShot[M.id] ?? []), g = w.filter((M) => !z(M).length), $ = w.filter((M) => {
    var v;
    return ((v = M.review) == null ? void 0 : v.status) === "approved" && z(M).length;
  }), T = w.filter((M) => {
    var v;
    return ((v = M.review) == null ? void 0 : v.status) === "redo";
  }), C = ((H = e.pipeline) == null ? void 0 : H.secondPassMode) ?? "super_resolution_second_pass", S = ((te = e.pipeline) == null ? void 0 : te.secondPassDenoise) ?? 0.3, L = w.filter((M) => {
    const v = tt(M, z(M));
    return v && gt(r.byShot[M.id] ?? [], v.path).length;
  }).length, V = w.length > 0 && w.every((M) => Wr(M, r.byShot[M.id] ?? [])), O = w.length > 0 && L === w.length, U = o.kind !== null, P = (M) => {
    var v;
    return ((v = M.review) == null ? void 0 : v.status) ?? "pending";
  }, oe = e.shots.filter((M) => b === "all" || M.enabled && P(M) === b), y = o.progress.max ? Math.round(o.progress.value / o.progress.max * 100) : 0, D = (X = e.shots.find((M) => M.id === o.currentShotId)) == null ? void 0 : X.title, j = () => {
    const M = $.map((K) => K.id);
    if (!M.length) return;
    const v = w.length - $.length;
    v > 0 && !window.confirm(p(`还有 ${v} 段没有通过审片，本次只对已通过的 ${M.length} 段执行二采。继续？`, `${v} shots are not approved; only ${M.length} will be processed. Continue?`)) || m(M, N);
  };
  return /* @__PURE__ */ n("div", { class: "td-review", children: [
    /* @__PURE__ */ n("section", { class: "td-review-steps", children: [
      /* @__PURE__ */ n("div", { class: `td-step ${g.length ? "active" : "done"}`, children: [
        /* @__PURE__ */ n("b", { children: "1" }),
        /* @__PURE__ */ n("div", { children: [
          /* @__PURE__ */ n("strong", { children: p("整体一采", "First pass") }),
          /* @__PURE__ */ n("span", { children: p(`${w.length - g.length}/${w.length} 段已有结果`, `${w.length - g.length}/${w.length} generated`) })
        ] })
      ] }),
      /* @__PURE__ */ n("div", { class: `td-step ${!g.length && $.length < w.length ? "active" : $.length === w.length && w.length ? "done" : ""}`, children: [
        /* @__PURE__ */ n("b", { children: "2" }),
        /* @__PURE__ */ n("div", { children: [
          /* @__PURE__ */ n("strong", { children: p("审片 / 单段重生", "Review / re-roll") }),
          /* @__PURE__ */ n("span", { children: p(`通过 ${$.length} · 需重生 ${T.length}`, `${$.length} approved · ${T.length} redo`) })
        ] })
      ] }),
      /* @__PURE__ */ n("div", { class: `td-step ${$.length === w.length && w.length && L < w.length ? "active" : L === w.length && w.length ? "done" : ""}`, children: [
        /* @__PURE__ */ n("b", { children: "3" }),
        /* @__PURE__ */ n("div", { children: [
          /* @__PURE__ */ n("strong", { children: p("整体二采", "Batch 2nd pass") }),
          /* @__PURE__ */ n("span", { children: p(`${L}/${w.length} 段已二采`, `${L}/${w.length} processed`) })
        ] })
      ] }),
      /* @__PURE__ */ n("div", { class: `td-step ${O ? "active" : ""}`, children: [
        /* @__PURE__ */ n("b", { children: "4" }),
        /* @__PURE__ */ n("div", { children: [
          /* @__PURE__ */ n("strong", { children: p("合并成片", "Merge") }),
          /* @__PURE__ */ n("span", { children: p("每段使用选定结果", "Uses each chosen take") })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ n("section", { class: "td-review-actions", children: [
      /* @__PURE__ */ n("div", { class: "td-action-group", children: [
        /* @__PURE__ */ n("span", { class: "td-action-title", children: p("一采", "First pass") }),
        /* @__PURE__ */ n("button", { class: "primary", disabled: U || r.loading || !g.length, onClick: () => s(g.map((M) => M.id), !1), children: r.loading ? p("正在读取结果…", "Loading results…") : g.length ? p(`生成缺失的 ${g.length} 段`, `Generate ${g.length} missing`) : p("全部已有一采", "All generated") }),
        T.length > 0 && /* @__PURE__ */ n("button", { disabled: U, onClick: () => s(T.map((M) => M.id), !0), children: [
          "↻ ",
          p(`重生标记的 ${T.length} 段`, `Re-roll ${T.length} marked`)
        ] }),
        /* @__PURE__ */ n("button", { disabled: U || !w.length, onClick: () => {
          window.confirm(p(`为全部 ${w.length} 段换新种子重新一采？旧结果会保留。`, `Re-roll all ${w.length} shots with new seeds?`)) && s(w.map((M) => M.id), !0);
        }, children: p("全部重新一采", "Re-roll all") })
      ] }),
      i && /* @__PURE__ */ n("div", { class: "td-action-group", children: [
        /* @__PURE__ */ n("span", { class: "td-action-title", children: p("二采", "2nd pass") }),
        /* @__PURE__ */ n("select", { value: C, disabled: U, onChange: (M) => l({ secondPassMode: M.currentTarget.value }), children: Object.keys(Xn).map((M) => /* @__PURE__ */ n("option", { value: M, children: Xn[M][t === "zh" ? 0 : 1] })) }),
        C !== "super_resolution_only" && /* @__PURE__ */ n("label", { class: "td-denoise", title: p("重绘强度越低，段与段接缝越稳定、人物越不易变；越高细节越多但接缝可能跳变。接力镜头多时建议 0.20–0.25。", "Lower = steadier seams, higher = more detail"), children: [
          /* @__PURE__ */ n("span", { children: p("重绘强度", "Denoise") }),
          /* @__PURE__ */ n("input", { type: "range", min: "0.1", max: "0.45", step: "0.01", value: S, disabled: U, onInput: (M) => l({ secondPassDenoise: Number(M.currentTarget.value) }) }),
          /* @__PURE__ */ n("b", { children: S.toFixed(2) })
        ] }),
        /* @__PURE__ */ n("label", { class: "td-inline-check", children: [
          /* @__PURE__ */ n("input", { type: "checkbox", checked: N, onChange: (M) => k(M.currentTarget.checked) }),
          p("跳过已二采的段", "Skip processed")
        ] }),
        /* @__PURE__ */ n("button", { class: "primary", disabled: U || !$.length, onClick: j, children: p(`整体二采（已通过 ${$.length} 段）`, `Batch 2nd pass (${$.length})`) })
      ] }),
      /* @__PURE__ */ n("div", { class: "td-action-group", children: [
        /* @__PURE__ */ n("button", { disabled: U || !V, title: p("把每段选定的一采结果拼成整片，审片时检查整体连贯性", "Concatenate chosen first-pass takes for review"), onClick: () => h(!1), children: p("合并一采样片", "Merge 1st-pass cut") }),
        /* @__PURE__ */ n("button", { class: "accent", disabled: U || !O, title: O ? "" : p("全部镜头完成二采后才能合并成片（一采与二采分辨率不同，不能混拼）", "All shots need a 2nd pass first"), onClick: () => h(!0), children: p("合并二采成片", "Merge final") }),
        /* @__PURE__ */ n("button", { disabled: U, onClick: f, children: [
          "↻ ",
          p("刷新", "Refresh")
        ] })
      ] })
    ] }),
    (U || o.error || o.message) && /* @__PURE__ */ n("section", { class: `td-run-bar ${o.error ? "error" : U ? "running" : "done"}`, children: [
      /* @__PURE__ */ n("div", { children: [
        /* @__PURE__ */ n("strong", { children: o.error ? p("执行中断", "Stopped") : U ? o.kind === "first" ? p("一采进行中", "First pass running") : o.kind === "second" ? p("二采进行中", "Second pass running") : p("合并中", "Merging") : p("完成", "Done") }),
        /* @__PURE__ */ n("span", { children: o.error || (U ? `${o.done}/${o.total}${D ? ` · ${D}` : ""}` : o.message) })
      ] }),
      U && o.kind !== "merge" && /* @__PURE__ */ n("progress", { max: 100, value: y }),
      U && o.kind !== "merge" && /* @__PURE__ */ n("b", { children: [
        y,
        "%"
      ] }),
      U && /* @__PURE__ */ n("button", { class: "danger", onClick: d, children: p("停止", "Stop") })
    ] }),
    /* @__PURE__ */ n("nav", { class: "td-review-filter", children: [
      ["all", "pending", "approved", "redo"].map((M) => /* @__PURE__ */ n("button", { class: b === M ? "active" : "", onClick: () => _(M), children: { all: p(`全部 ${e.shots.length}`, `All ${e.shots.length}`), pending: p(`待审 ${w.filter((v) => P(v) === "pending").length}`, "Pending"), approved: p(`通过 ${$.length}`, "Approved"), redo: p(`需重生 ${T.length}`, "Redo") }[M] })),
      /* @__PURE__ */ n("span", { class: "td-review-hint", children: p("提示：接力段读取的是上一段“最近一次生成”的 latent，重生上一段后请连同后续接力段一起重生。", "Relay shots continue from the previous shot's latest take.") })
    ] }),
    /* @__PURE__ */ n("div", { class: "td-review-grid", children: oe.map((M) => /* @__PURE__ */ n(ji, { plan: e, shot: M, language: t, results: r, busy: U, running: o.currentShotId === M.id, setReview: a, onRunFirstPass: s, onOpenShot: c }, M.id)) })
  ] });
}
function ji({ plan: e, shot: t, language: r, results: o, busy: i, running: a, setReview: l, onRunFirstPass: s, onOpenShot: m }) {
  var O;
  const h = (U, P) => r === "zh" ? U : P, [d, f] = R(!1), c = o.byShot[t.id] ?? [], p = Re(c), b = tt(t, p), _ = b ? gt(c, b.path) : [], N = d && _[0] ? _[0] : b, k = N ? Ie(N.path, "output") : null, w = e.shots.findIndex((U) => U.id === t.id), z = xt(e, t), g = z ? Bt(e, t.id) : void 0, $ = g ? Re(o.byShot[g.id] ?? []) : [], T = g ? zi(tt(g, $), $, b, g.id, Ci(t, b)) : "unknown", C = qr(e, t.id), S = Jr(e, t.id), L = ((O = t.review) == null ? void 0 : O.status) ?? "pending", V = Qr(e, t);
  return /* @__PURE__ */ n("article", { class: `td-review-card ${L} ${t.enabled ? "" : "off"} ${a ? "running" : ""}`, children: [
    /* @__PURE__ */ n("header", { children: [
      /* @__PURE__ */ n("button", { class: "td-review-title", title: h("在分镜页打开", "Open in editor"), onClick: () => m(t.id), children: [
        /* @__PURE__ */ n("em", { children: w + 1 }),
        t.title
      ] }),
      /* @__PURE__ */ n("span", { class: "td-review-tags", children: [
        /* @__PURE__ */ n("i", { children: [
          t.durationSeconds,
          "s"
        ] }),
        z && /* @__PURE__ */ n("i", { class: "relay", title: h(`接力自「${g == null ? void 0 : g.title}」`, "Relay"), children: [
          "⛓ ",
          h("接力", "relay")
        ] }),
        !t.enabled && /* @__PURE__ */ n("i", { children: h("禁用", "off") }),
        /* @__PURE__ */ n("i", { class: L, children: L === "approved" ? h("✓ 通过", "✓ OK") : L === "redo" ? h("↻ 需重生", "↻ redo") : h("待审", "pending") })
      ] })
    ] }),
    /* @__PURE__ */ n("div", { class: "td-review-media", children: [
      a ? /* @__PURE__ */ n("div", { class: "td-result-empty running", children: h("正在生成…", "Generating…") }) : k ? /* @__PURE__ */ n(di, { src: k }) : /* @__PURE__ */ n("div", { class: "td-result-empty", children: h("还没有一采结果", "No take yet") }),
      _.length > 0 && /* @__PURE__ */ n("div", { class: "td-review-media-switch", children: [
        /* @__PURE__ */ n("button", { class: d ? "" : "active", onClick: () => f(!1), children: h("一采", "1st") }),
        /* @__PURE__ */ n("button", { class: d ? "active" : "", onClick: () => f(!0), children: h("二采", "2nd") })
      ] })
    ] }),
    p.length > 1 && /* @__PURE__ */ n("div", { class: "td-take-strip", children: p.map((U, P) => {
      const oe = Ie(U.path, "output");
      return /* @__PURE__ */ n("button", { class: `td-take ${U.path === (b == null ? void 0 : b.path) ? "selected" : ""}`, title: `${Ce(U.path)}${U.modifiedAt ? `
${new Date(U.modifiedAt * 1e3).toLocaleString()}` : ""}`, onClick: () => l(t.id, { take: U.path }), children: [
        oe ? /* @__PURE__ */ n(st, { src: oe, alt: U.path }) : null,
        /* @__PURE__ */ n("span", { children: [
          "#",
          p.length - P,
          gt(c, U.path).length ? " ★" : ""
        ] })
      ] }, U.path);
    }) }),
    T === "mismatch" && /* @__PURE__ */ n("p", { class: "td-review-warning", children: h(`接缝不匹配：本段结果生成时接力的是「${g == null ? void 0 : g.title}」的另一个结果。请把上一段选回对应结果，或重生本段。`, "Seam mismatch with the chosen take of the previous shot.") }),
    T === "wrong_source" && /* @__PURE__ */ n("p", { class: "td-review-warning", children: h(`接力来源错误：本段结果生成时读取的不是「${g == null ? void 0 : g.title}」的 latent（镜头顺序或启用状态变过）。请连同上一段一起重生。`, "This take relayed from a different shot; re-roll it together with the previous shot.") }),
    C && T !== "wrong_source" && /* @__PURE__ */ n("p", { class: "td-review-warning", children: h(`下次生成本段时将读到不属于「${g == null ? void 0 : g.title}」的 latent（镜头顺序或启用状态变过），重生时会建议连同上一段一起生成。`, "The relay slot no longer belongs to the previous shot.") }),
    V && /* @__PURE__ */ n("p", { class: "td-review-warning", children: h("提示词或素材在生成后被修改过，当前结果不代表最新设置。", "Prompt changed after this take was generated.") }),
    t.note && /* @__PURE__ */ n("p", { class: "td-review-note", title: t.note, children: t.note }),
    /* @__PURE__ */ n("footer", { children: [
      /* @__PURE__ */ n("button", { class: `ok ${L === "approved" ? "active" : ""}`, disabled: !b, onClick: () => l(t.id, { status: L === "approved" ? "pending" : "approved", take: b == null ? void 0 : b.path }), children: [
        "✓ ",
        h("通过", "Approve")
      ] }),
      /* @__PURE__ */ n("button", { class: `warn ${L === "redo" ? "active" : ""}`, onClick: () => l(t.id, { status: L === "redo" ? "pending" : "redo" }), children: [
        "✗ ",
        h("需重生", "Redo")
      ] }),
      /* @__PURE__ */ n("button", { disabled: i || !t.enabled, onClick: () => s([t.id], !0), children: [
        "↻ ",
        h("重生", "Re-roll")
      ] }),
      S.length > 1 && /* @__PURE__ */ n("button", { disabled: i || !t.enabled, title: h(`后面 ${S.length - 1} 段接力自本段；一起重生才能保证接缝衔接`, "Re-roll with following relay shots"), onClick: () => s(S, !0), children: [
        "↻ ",
        h(`连同后续 ${S.length - 1} 段`, `+${S.length - 1} relay`)
      ] })
    ] })
  ] });
}
function Ni(e) {
  const t = e.reduce((r, o) => {
    const i = /^shot_(\d+)(?:_[a-z0-9]+)?$/i.exec(o.id.trim());
    return i ? Math.max(r, Number(i[1])) : r;
  }, 0);
  return Math.max(t, e.length) + 1;
}
function ln() {
  return Math.random().toString(36).slice(2, 6);
}
function Xr(e, t = 5, r, o = "super_resolution_second_pass") {
  const i = `shot_${String(e).padStart(3, "0")}`;
  return {
    id: r ? `${i}_${r()}` : i,
    title: `Shot ${e}`,
    prompt: "",
    negativePrompt: "",
    durationSeconds: t,
    enabled: !0,
    latentRelay: !0,
    secondSamplingMode: o,
    seed: null,
    disabledAssetIds: []
  };
}
function Zr(e, t, r, o, i = "super_resolution_second_pass") {
  const a = Ni(e), l = Array.from({ length: t }, (s, m) => Xr(a + m, r, o, i));
  return [...e, ...l];
}
function Li(e = 5, t, r = "super_resolution_second_pass") {
  return [Xr(1, e, t, r)];
}
async function Mi(e, t) {
  const r = new URLSearchParams({ projectName: e.project.name, runId: e.project.runId, shotId: t, activeIndex: "-1" }), o = await fetch(`/theodore-director/v1/generated-video?${r.toString()}`), i = await o.json();
  if (!o.ok) throw new Error(i.error || `HTTP ${o.status}`);
  return Fe(i);
}
function Ri(e, t) {
  const [r, o] = R({ byShot: {}, errors: {}, loading: !0 }), i = e.shots.map((a) => a.id).join("|");
  return Pe(() => {
    let a = !1;
    o((s) => ({ ...s, loading: !0 }));
    const l = e.shots.map((s) => s.id);
    return Promise.all(l.map(async (s) => {
      try {
        return [s, await Mi(e, s), ""];
      } catch (m) {
        return [s, [], String(m instanceof Error ? m.message : m)];
      }
    })).then((s) => {
      if (a) return;
      const m = {}, h = {};
      for (const [d, f, c] of s)
        m[d] = f, c && (h[d] = c);
      o({ byShot: m, errors: h, loading: !1 });
    }), () => {
      a = !0;
    };
  }, [e.project.name, e.project.runId, i, t]), r;
}
const Zn = [
  { value: "pushes in", label: ["推近", "Push in"] },
  { value: "pulls back", label: ["拉远", "Pull back"] },
  { value: "zooms in", label: ["变焦推近", "Zoom in"] },
  { value: "zooms out", label: ["变焦拉远", "Zoom out"] },
  { value: "pans left", label: ["左摇", "Pan left"] },
  { value: "pans right", label: ["右摇", "Pan right"] },
  { value: "trucks left", label: ["左移", "Truck left"] },
  { value: "trucks right", label: ["右移", "Truck right"] },
  { value: "tilts up", label: ["上摇", "Tilt up"] },
  { value: "tilts down", label: ["下摇", "Tilt down"] },
  { value: "pedestals up", label: ["升高", "Pedestal up"] },
  { value: "pedestals down", label: ["降低", "Pedestal down"] },
  { value: "tracks with the subject", label: ["跟拍", "Track subject"] },
  { value: "arcs around the subject", label: ["弧线移动", "Arc around subject"] },
  { value: "shakes slightly", label: ["轻微晃动", "Shake slightly"] },
  { value: "shakes strongly", label: ["强烈晃动", "Shake strongly"] },
  { value: "uses a POV shot", label: ["主观视角", "POV"] },
  { value: "rolls clockwise", label: ["顺时针旋转", "Roll clockwise"] },
  { value: "rolls counterclockwise", label: ["逆时针旋转", "Roll counterclockwise"] },
  { value: "remains static", label: ["静机", "Static"] },
  { value: "holds position and racks focus", label: ["静机移焦", "Rack focus"] }
], Di = [
  { value: "", label: ["默认", "Default"] },
  { value: "small amplitude", label: ["小幅度", "Small"] },
  { value: "large amplitude", label: ["大幅度", "Large"] }
], Oi = [
  { value: "", label: ["默认", "Default"] },
  { value: "slow", label: ["缓慢", "Slow"] },
  { value: "fast", label: ["快速", "Fast"] }
];
function Ui(e, t, r, o, i = "", a = "", l = "") {
  if (e === "remains static")
    return o.trim() ? `The camera remains static on ${o.trim()}.` : "The camera remains static.";
  if (e === "holds position and racks focus") {
    const d = r.trim() ? `from ${r.trim()}` : "from the foreground", f = o.trim() ? ` to ${o.trim()}` : " to the background";
    return `The camera holds position and racks focus ${d}${f}.`;
  }
  if (e === "uses a POV shot")
    return `The camera adopts a POV perspective ${r.trim() ? `from ${r.trim()}` : "from the subject's viewpoint"}${o.trim() ? `, settling on ${o.trim()}` : ""}.`;
  const s = [`As ${t.trim() || "the action unfolds"}, the camera ${e}`], m = !e.startsWith("shakes") && !e.startsWith("rolls");
  m && r.trim() && s.push(`toward ${r.trim()}`), m && l.trim() && s.push(`along ${l.trim()}`), i.trim() && s.push(`with ${i.trim()}`), a.trim() && s.push(`at ${a.trim()} speed`);
  let h = s.join(" ");
  return o.trim() && (h += `, settling on ${o.trim()}`), `${h}.`;
}
const Fi = ["off", "super_resolution_second_pass", "latent_upscale_second_pass", "super_resolution_only"], Gi = {
  off: ["关闭（推荐）", "Off (recommended)"],
  super_resolution_second_pass: ["超分二采", "Super-res 2nd pass"],
  latent_upscale_second_pass: ["Latent 放大二采", "Latent upscale 2nd pass"],
  super_resolution_only: ["只超分", "Super-res only"]
};
function Lt(e) {
  const t = Math.round(e);
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
}
function Vi({ plan: e, language: t, selected: r, setSelected: o, mutate: i, setReview: a, results: l, supportsSecondSampling: s, running: m, runningShotId: h, onRegenerate: d, onOpenBatch: f, notify: c }) {
  var ne;
  const p = ke(null);
  Pe(() => {
    const u = p.current, G = u == null ? void 0 : u.querySelector(".selected");
    if (!u || !G) return;
    const Y = u.getBoundingClientRect(), ce = G.getBoundingClientRect();
    ce.left < Y.left ? u.scrollLeft -= Y.left - ce.left : ce.right > Y.right && (u.scrollLeft += ce.right - Y.right);
  }, [r]);
  const b = (u, G) => t === "zh" ? u : G, [_, N] = R(!1), [k, w] = R(Zn[0].value), [z, g] = R(""), [$, T] = R(""), [C, S] = R(""), [L, V] = R(""), [O, U] = R(""), [P, oe] = R(""), y = e.shots[Math.min(r, e.shots.length - 1)], D = Ve(() => y ? Rr(e, y) : null, [e, y]), j = Ve(() => y ? Nr(e, y) : [], [e, y]), H = e.shots.filter((u) => u.enabled), te = H.reduce((u, G) => u + G.durationSeconds, 0), X = y ? ((ne = H[0]) == null ? void 0 : ne.id) === y.id : !1, M = y ? Re(l.byShot[y.id] ?? []) : [], v = y ? tt(y, M) : void 0, K = v ? Ie(v.path, "output") : null, Z = y ? Jr(e, y.id) : [], Q = k === "remains static", ee = k === "holds position and racks focus", pe = k.startsWith("shakes") || k.startsWith("rolls"), E = (u) => i((G) => {
    const Y = G.shots[r];
    Y && u(Y);
  }), B = (u, G) => i((Y) => {
    const ce = u + G;
    ce < 0 || ce >= Y.shots.length || ([Y.shots[u], Y.shots[ce]] = [Y.shots[ce], Y.shots[u]], o(ce));
  }), ue = (u) => {
    const G = e.shots[u];
    e.shots.length <= 1 || !G || window.confirm(b(`删除镜头「${G.title}」？已生成的视频文件不会被删除。`, `Delete "${G.title}"? Generated files are kept.`)) && (i((Y) => {
      Y.shots.splice(u, 1);
    }), o(Math.max(0, Math.min(r > u ? r - 1 : r, e.shots.length - 2))));
  };
  return /* @__PURE__ */ n("div", { class: "td-shots", children: [
    /* @__PURE__ */ n("aside", { class: "td-shot-sidebar", children: [
      /* @__PURE__ */ n("div", { class: "td-timeline-heading", children: [
        /* @__PURE__ */ n("strong", { children: b("分镜时间线", "SHOT TIMELINE") }),
        /* @__PURE__ */ n("span", { children: b("按顺序选择镜头 · 接力镜头保持相邻", "Select shots in sequence · keep relay shots together") })
      ] }),
      /* @__PURE__ */ n("div", { class: "td-shot-list", ref: p, children: e.shots.map((u, G) => {
        var le;
        const Y = Re(l.byShot[u.id] ?? []), ce = xt(e, u), be = (le = u.review) == null ? void 0 : le.status;
        return /* @__PURE__ */ n("div", { class: `td-shot-card ${G === r ? "selected" : ""} ${u.enabled ? "" : "off"} ${ce ? "relay" : ""} ${h === u.id ? "running" : ""}`, onClick: () => o(G), children: [
          ce && /* @__PURE__ */ n("span", { class: "td-relay-link", title: b("latent 接力：本段从上一段末尾无缝延续", "Latent relay from previous shot") }),
          /* @__PURE__ */ n("div", { class: "td-shot-card-main", children: [
            /* @__PURE__ */ n("strong", { children: [
              /* @__PURE__ */ n("em", { children: G + 1 }),
              u.title
            ] }),
            /* @__PURE__ */ n("span", { class: "td-shot-card-meta", children: [
              /* @__PURE__ */ n("b", { children: [
                u.durationSeconds,
                "s"
              ] }),
              ce && /* @__PURE__ */ n("i", { class: "relay", children: b("接力", "relay") }),
              !u.enabled && /* @__PURE__ */ n("i", { children: b("已禁用", "off") }),
              Y.length > 0 && /* @__PURE__ */ n("i", { children: b(`${Y.length} 个结果`, `${Y.length} takes`) }),
              be === "approved" && /* @__PURE__ */ n("i", { class: "ok", children: [
                "✓ ",
                b("通过", "OK")
              ] }),
              be === "redo" && /* @__PURE__ */ n("i", { class: "warn", children: [
                "↻ ",
                b("需重生", "redo")
              ] }),
              Qr(e, u) && /* @__PURE__ */ n("i", { class: "warn", children: b("已修改", "edited") }),
              h === u.id && /* @__PURE__ */ n("i", { class: "run", children: b("生成中", "running") })
            ] })
          ] }),
          /* @__PURE__ */ n("div", { class: "td-shot-card-actions", onClick: (Me) => Me.stopPropagation(), children: [
            /* @__PURE__ */ n("button", { title: b("上移", "Move up"), disabled: G === 0, onClick: () => B(G, -1), children: "↑" }),
            /* @__PURE__ */ n("button", { title: b("下移", "Move down"), disabled: G === e.shots.length - 1, onClick: () => B(G, 1), children: "↓" }),
            /* @__PURE__ */ n("button", { class: "danger", title: b("删除镜头", "Delete"), disabled: e.shots.length <= 1, onClick: () => ue(G), children: "×" })
          ] })
        ] }, u.id);
      }) }),
      /* @__PURE__ */ n("div", { class: "td-shot-sidebar-footer", children: [
        /* @__PURE__ */ n("span", { class: "td-total", children: b(`${H.length} 段启用 · 总时长 ${Lt(te)}`, `${H.length} enabled · ${Lt(te)}`) }),
        /* @__PURE__ */ n("div", { class: "td-two-buttons", children: [
          /* @__PURE__ */ n("button", { onClick: () => i((u) => {
            const G = u.shots.length;
            u.shots = Zr(u.shots, 1, u.defaults.durationSeconds ?? 6, ln, u.defaults.secondSamplingMode ?? "off").map((Y, ce) => ce === G ? { ...Y, latentRelay: !1, title: b(`镜头 ${G + 1}`, `Shot ${G + 1}`) } : Y), o(G);
          }), children: [
            "＋ ",
            b("添加镜头", "Add shot")
          ] }),
          /* @__PURE__ */ n("button", { onClick: f, children: b("批量编辑", "Batch edit") })
        ] })
      ] })
    ] }),
    y && /* @__PURE__ */ n("section", { class: "td-form td-shot-form", children: [
      /* @__PURE__ */ n("div", { class: "td-composer-heading", children: [
        /* @__PURE__ */ n("div", { children: [
          /* @__PURE__ */ n("small", { children: b(`镜头 ${String(r + 1).padStart(2, "0")} / ${e.shots.length}`, `SHOT ${String(r + 1).padStart(2, "0")} / ${e.shots.length}`) }),
          /* @__PURE__ */ n("h3", { children: b("镜头编排", "Shot composer") })
        ] }),
        /* @__PURE__ */ n("div", { children: [
          /* @__PURE__ */ n("button", { disabled: r === 0, onClick: () => o(r - 1), "aria-label": b("上一镜头", "Previous shot"), children: "←" }),
          /* @__PURE__ */ n("button", { disabled: r === e.shots.length - 1, onClick: () => o(r + 1), "aria-label": b("下一镜头", "Next shot"), children: "→" })
        ] })
      ] }),
      /* @__PURE__ */ n("div", { class: "td-shot-head", children: [
        /* @__PURE__ */ n("label", { class: "grow", children: [
          b("标题", "Title"),
          /* @__PURE__ */ n("input", { value: y.title, onInput: (u) => E((G) => {
            G.title = u.currentTarget.value;
          }) })
        ] }),
        /* @__PURE__ */ n("label", { class: "narrow", children: [
          b("时长（秒）", "Duration (s)"),
          /* @__PURE__ */ n("input", { type: "number", min: "1", max: "15", step: "0.5", value: y.durationSeconds, onInput: (u) => E((G) => {
            G.durationSeconds = Number(u.currentTarget.value);
          }) })
        ] }),
        /* @__PURE__ */ n("label", { class: "seed", children: [
          b("种子", "Seed"),
          /* @__PURE__ */ n("span", { class: "td-seed-input", children: [
            /* @__PURE__ */ n("input", { type: "number", placeholder: b("自动", "auto"), value: y.seed ?? "", onInput: (u) => E((G) => {
              G.seed = u.currentTarget.value === "" ? null : Number(u.currentTarget.value);
            }) }),
            /* @__PURE__ */ n("button", { title: b("随机新种子（重生时会自动换）", "Random seed"), onClick: () => E((u) => {
              u.seed = Yr();
            }), children: "🎲" })
          ] })
        ] })
      ] }),
      (y.durationSeconds < 5 || y.durationSeconds > 15) && /* @__PURE__ */ n("div", { class: "td-inline-warning", children: b("H3 单段建议 5–15 秒；超出范围容易出现动作压缩或拖沓。", "H3 segments work best between 5 and 15 seconds.") }),
      /* @__PURE__ */ n("div", { class: "td-shot-switches", children: [
        /* @__PURE__ */ n("label", { class: "td-toggle", children: [
          /* @__PURE__ */ n("input", { type: "checkbox", checked: y.enabled, onChange: (u) => E((G) => {
            G.enabled = u.currentTarget.checked;
          }) }),
          /* @__PURE__ */ n("span", { children: b("启用", "Enabled") })
        ] }),
        /* @__PURE__ */ n("label", { class: "td-toggle", title: b("只在与上一段是同一个不切镜的连续长镜头时开启。开启后本段开头会钉住上一段末尾约 0.9 秒画面与声音。", "Only for an uninterrupted long take."), children: [
          /* @__PURE__ */ n("input", { type: "checkbox", checked: y.latentRelay, disabled: X, onChange: (u) => E((G) => {
            G.latentRelay = u.currentTarget.checked;
          }) }),
          /* @__PURE__ */ n("span", { children: X ? b("接力上一段（首段不可用）", "Relay (n/a for first)") : b("接力上一段（同一长镜头）", "Relay from previous (long take)") })
        ] }),
        /* @__PURE__ */ n("details", { class: "td-advanced", children: [
          /* @__PURE__ */ n("summary", { children: b("高级", "Advanced") }),
          /* @__PURE__ */ n("div", { class: "td-advanced-body", children: [
            /* @__PURE__ */ n("label", { children: [
              b("镜头 ID", "Shot ID"),
              /* @__PURE__ */ n("input", { value: y.id, onInput: (u) => E((G) => {
                G.id = u.currentTarget.value;
              }) })
            ] }),
            s && /* @__PURE__ */ n("label", { title: b("导播台的“一采”始终关闭高清处理；该选项只在直接点击 ComfyUI 原生 Queue 时生效。", "The director's first pass always disables this."), children: [
              b("原生 Queue 时的高清处理", "Processing for native Queue"),
              /* @__PURE__ */ n("select", { value: y.secondSamplingMode, onChange: (u) => E((G) => {
                G.secondSamplingMode = u.currentTarget.value;
              }), children: Fi.map((u) => /* @__PURE__ */ n("option", { value: u, children: Gi[u][t === "zh" ? 0 : 1] })) })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ n("details", { class: "td-note", open: !!y.note, children: [
        /* @__PURE__ */ n("summary", { children: b("分镜说明（中文，审片对照用）", "Shot notes") }),
        /* @__PURE__ */ n("textarea", { rows: 4, placeholder: b("画面、站位、动作与对白摘要。只供审片对照，不会发送给模型。", "Not sent to the model."), value: y.note ?? "", onInput: (u) => E((G) => {
          G.note = u.currentTarget.value;
        }) })
      ] }),
      /* @__PURE__ */ n("label", { class: "td-prompt-field", children: [
        /* @__PURE__ */ n("span", { class: "td-field-label", children: [
          b("正向提示词", "Prompt"),
          /* @__PURE__ */ n("small", { children: b("用 {{ref:别名}} 引用素材，输入 @ 快速选择", "Use {{ref:alias}}; type @ to pick") })
        ] }),
        /* @__PURE__ */ n(dn, { rows: 18, value: y.prompt, mentionAssets: j, mentionLanguage: t, isReferenceValid: (u) => Mr(e, y, u), onInput: (u) => E((G) => {
          G.prompt = u.currentTarget.value;
        }) }, y.id)
      ] }),
      /* @__PURE__ */ n("details", { class: "td-camera-builder", children: [
        /* @__PURE__ */ n("summary", { children: b("运镜句构造", "Camera move") }),
        /* @__PURE__ */ n("div", { class: "td-camera-builder-fields", children: [
          /* @__PURE__ */ n("label", { children: [
            b("主运动", "Main move"),
            /* @__PURE__ */ n("select", { value: k, onChange: (u) => w(u.currentTarget.value), children: Zn.map((u) => /* @__PURE__ */ n("option", { value: u.value, children: u.label[t === "zh" ? 0 : 1] })) })
          ] }),
          /* @__PURE__ */ n("label", { children: [
            b("幅度", "Amplitude"),
            /* @__PURE__ */ n("select", { value: z, disabled: Q || ee || k === "uses a POV shot", onChange: (u) => g(u.currentTarget.value), children: Di.map((u) => /* @__PURE__ */ n("option", { value: u.value, children: u.label[t === "zh" ? 0 : 1] })) })
          ] }),
          /* @__PURE__ */ n("label", { children: [
            b("速度", "Speed"),
            /* @__PURE__ */ n("select", { value: $, disabled: Q || ee || k === "uses a POV shot", onChange: (u) => T(u.currentTarget.value), children: Oi.map((u) => /* @__PURE__ */ n("option", { value: u.value, children: u.label[t === "zh" ? 0 : 1] })) })
          ] }),
          /* @__PURE__ */ n("label", { children: [
            b("触发动作", "Action trigger"),
            /* @__PURE__ */ n("input", { value: C, disabled: Q || ee || k === "uses a POV shot", onInput: (u) => S(u.currentTarget.value), placeholder: b("可选", "Optional") })
          ] }),
          /* @__PURE__ */ n("label", { children: [
            b(ee ? "起始焦点" : k === "uses a POV shot" ? "视点主体" : "运动目标", ee ? "Focus from" : k === "uses a POV shot" ? "POV subject" : "Movement target"),
            /* @__PURE__ */ n("input", { value: L, disabled: Q || pe, onInput: (u) => V(u.currentTarget.value), placeholder: b("可选", "Optional") })
          ] }),
          /* @__PURE__ */ n("label", { children: [
            b("经过路径", "Path"),
            /* @__PURE__ */ n("input", { value: O, disabled: Q || ee || pe || k === "uses a POV shot", onInput: (u) => U(u.currentTarget.value), placeholder: b("可选", "Optional") })
          ] }),
          /* @__PURE__ */ n("label", { children: [
            b(ee ? "结束焦点" : "结束构图", ee ? "Focus to" : "End framing"),
            /* @__PURE__ */ n("input", { value: P, onInput: (u) => oe(u.currentTarget.value), placeholder: b("可选", "Optional") })
          ] }),
          /* @__PURE__ */ n("button", { onClick: () => E((u) => {
            const G = Ui(k, C, L, P, z, $, O);
            u.prompt = [u.prompt.trimEnd(), G].filter(Boolean).join(`
`);
          }), children: b("追加到提示词", "Append to prompt") })
        ] })
      ] }),
      /* @__PURE__ */ n("label", { children: [
        /* @__PURE__ */ n("span", { class: "td-field-label", children: b("负向提示词", "Negative prompt") }),
        /* @__PURE__ */ n("textarea", { rows: 3, value: y.negativePrompt, onInput: (u) => E((G) => {
          G.negativePrompt = u.currentTarget.value;
        }) })
      ] }),
      e.assets.length > 0 && /* @__PURE__ */ n("fieldset", { class: "td-shot-media", children: [
        /* @__PURE__ */ n("legend", { children: b("本镜头可用素材（点名称复制引用，取消勾选=本镜头禁用）", "Shot media") }),
        e.assets.map((u) => {
          const G = !y.disabledAssetIds.includes(u.id), Y = `{{ref:${u.alias}}}`, ce = y.prompt.includes(Y) || y.prompt.includes(`{{ref:${u.alias}.audio}}`);
          return /* @__PURE__ */ n("div", { class: `td-shot-media-card ${G ? "" : "disabled"} ${ce ? "used" : ""}`, children: [
            /* @__PURE__ */ n("div", { class: "td-shot-media-frame", children: [
              /* @__PURE__ */ n(Pr, { asset: u, compact: !0 }),
              /* @__PURE__ */ n("label", { class: "td-shot-media-toggle", title: G ? b("在本镜头禁用", "Disable in this shot") : b("在本镜头启用", "Enable"), children: /* @__PURE__ */ n("input", { type: "checkbox", checked: G, onChange: (be) => E((le) => {
                le.disabledAssetIds = be.currentTarget.checked ? le.disabledAssetIds.filter((Me) => Me !== u.id) : [.../* @__PURE__ */ new Set([...le.disabledAssetIds, u.id])];
              }) }) })
            ] }),
            /* @__PURE__ */ n("button", { class: "td-shot-media-name", title: `${u.note ?? ""}
${b("点击复制", "Copy")} ${Y}`, onMouseDown: (be) => be.preventDefault(), onClick: async () => {
              try {
                await $r(Y), c(b(`已复制 ${Y}`, `Copied ${Y}`));
              } catch (be) {
                c(String(be), "error");
              }
            }, children: [
              ce && /* @__PURE__ */ n("i", { children: "●" }),
              u.alias
            ] })
          ] }, u.id);
        })
      ] })
    ] }),
    y && /* @__PURE__ */ n("aside", { class: "td-preview", children: [
      /* @__PURE__ */ n("section", { class: "td-card", children: [
        /* @__PURE__ */ n("header", { children: [
          /* @__PURE__ */ n("strong", { children: b("H3 预检", "H3 check") }),
          /* @__PURE__ */ n("span", { class: "td-summary-counts", children: [
            b("图", "Img"),
            " ",
            (D == null ? void 0 : D.slots.filter((u) => u.kind === "picture").length) ?? 0,
            "/9 · ",
            b("视频", "Vid"),
            " ",
            (D == null ? void 0 : D.slots.filter((u) => u.kind === "video").length) ?? 0,
            "/3 · ",
            b("音频", "Aud"),
            " ",
            (D == null ? void 0 : D.audioCount) ?? 0,
            "/3"
          ] })
        ] }),
        /* @__PURE__ */ n("div", { class: "td-card-body", children: [
          D != null && D.errors.length ? /* @__PURE__ */ n("ul", { class: "errors", children: D.errors.map((u) => /* @__PURE__ */ n("li", { children: u })) }) : /* @__PURE__ */ n("p", { class: "ok", children: [
            "✓ ",
            b("本镜头通过预检", "This shot passes")
          ] }),
          D && D.slots.length > 0 && /* @__PURE__ */ n("ol", { class: "td-slot-list", children: D.slots.map((u) => /* @__PURE__ */ n("li", { children: [
            /* @__PURE__ */ n("code", { children: u.label }),
            /* @__PURE__ */ n("span", { children: u.alias })
          ] })) }),
          /* @__PURE__ */ n("button", { class: "td-link-button", onClick: () => N((u) => !u), children: _ ? b("收起编译结果", "Hide compiled prompt") : b("查看发送给 H3 的最终提示词", "Show compiled prompt") }),
          _ && /* @__PURE__ */ n("pre", { class: "td-compiled", children: D == null ? void 0 : D.compiledPrompt })
        ] })
      ] }),
      /* @__PURE__ */ n("section", { class: "td-card", children: [
        /* @__PURE__ */ n("header", { children: [
          /* @__PURE__ */ n("strong", { children: b("本段结果", "Takes") }),
          /* @__PURE__ */ n("span", { class: `td-chip ${M.length ? "ok" : ""}`, children: l.loading ? b("查询中", "Loading") : b(`${M.length} 个一采`, `${M.length} takes`) })
        ] }),
        /* @__PURE__ */ n("div", { class: "td-card-body", children: [
          v && K ? /* @__PURE__ */ n("video", { class: "td-take-player", src: K, controls: !0, preload: "metadata", playsInline: !0 }, v.path) : /* @__PURE__ */ n("div", { class: "td-result-empty", children: b("还没有一采结果", "No first-pass take yet") }),
          M.length > 1 && /* @__PURE__ */ n("div", { class: "td-take-strip", children: M.map((u, G) => {
            const Y = Ie(u.path, "output");
            return /* @__PURE__ */ n("button", { class: `td-take ${u.path === (v == null ? void 0 : v.path) ? "selected" : ""}`, title: Ce(u.path), onClick: () => a(y.id, { take: u.path }), children: [
              Y ? /* @__PURE__ */ n(st, { src: Y, alt: u.path }) : null,
              /* @__PURE__ */ n("span", { children: [
                "#",
                M.length - G
              ] })
            ] }, u.path);
          }) }),
          /* @__PURE__ */ n("div", { class: "td-take-actions", children: [
            /* @__PURE__ */ n("button", { class: "primary", disabled: m || !y.enabled, onClick: () => d([y.id]), children: [
              "↻ ",
              M.length ? b("重生本段", "Re-roll") : b("生成本段", "Generate")
            ] }),
            Z.length > 1 && /* @__PURE__ */ n("button", { disabled: m || !y.enabled, title: b("后面这些镜头接力自本段，本段换结果后它们的接缝会失配", "Following shots relay from this one"), onClick: () => d(Z), children: [
              "↻ ",
              b(`连同后续 ${Z.length - 1} 段接力`, `+${Z.length - 1} relay shots`)
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}
function Ge() {
  const e = new Error("已停止");
  return e.name = "AbortError", e;
}
function Hi(e) {
  return e.detail ?? {};
}
const Bi = ["execution_start", "executing", "progress", "execution_success", "execution_error", "execution_interrupted"];
function tn(e, t, r, o, i, a = 6e4, l) {
  return new Promise((s, m) => {
    let h = "", d = !1, f = !1, c = !1, p = !1, b;
    const _ = [], N = Bi.map((C) => [C, (S) => $(C, Hi(S))]), k = () => {
      p || (p = !0, clearTimeout(b), N.forEach(([C, S]) => e.removeEventListener(C, S)), i == null || i.removeEventListener("abort", T));
    }, w = (C) => {
      f || (f = !0, c || k(), C ? m(C) : s());
    }, z = () => {
      var S, L;
      if (!h) return;
      const C = d ? (S = e.interrupt) == null ? void 0 : S.call(e, h) : (L = e.deleteItem) == null ? void 0 : L.call(e, "queue", h);
      Promise.resolve(C).catch(() => {
      });
    }, g = async () => {
      if (!(!l || f)) {
        try {
          if (await l.probe(h) === "success") {
            w();
            return;
          }
        } catch (C) {
          w(C instanceof Error ? C : new Error(String(C)));
          return;
        }
        f || (b = setTimeout(() => void g(), l.pollMs ?? 2500));
      }
    };
    function $(C, S) {
      const L = String(S.prompt_id ?? "");
      if (!h) {
        L && _.push([C, S]);
        return;
      }
      if (!(L !== h && (C !== "progress" || L || !d))) {
        if (C === "execution_start" || C === "executing" || C === "progress") {
          const V = d;
          if (d = !0, c) {
            V || z();
            return;
          }
        }
        if (C === "progress") {
          const V = Number(S.value ?? 0), O = Number(S.max ?? 0);
          Number.isFinite(V) && Number.isFinite(O) && O > 0 && (r == null || r({ value: V, max: O, node: String(S.node ?? "") }));
        } else C === "execution_success" ? c ? k() : w() : (C === "execution_error" || C === "execution_interrupted") && (c ? k() : w(new Error(String(S.exception_message ?? S.error ?? o))));
      }
    }
    function T() {
      c || (c = !0, z(), w(Ge()), setTimeout(k, a));
    }
    if (N.forEach(([C, S]) => e.addEventListener(C, S)), i == null || i.addEventListener("abort", T), i != null && i.aborted) {
      T();
      return;
    }
    t().then((C) => {
      if (!C.prompt_id) {
        w(new Error("ComfyUI 没有返回任务 ID"));
        return;
      }
      h = C.prompt_id;
      for (const [S, L] of _.splice(0)) $(S, L);
      c && !d && z(), l && !f && (b = setTimeout(() => void g(), l.pollMs ?? 2500));
    }, (C) => w(C instanceof Error ? C : new Error(String(C))));
  });
}
const vn = {
  KSampler: ["seed", "control_after_generate", "steps", "cfg", "sampler_name", "scheduler", "denoise"],
  EmptySD3LatentImage: ["width", "height", "batch_size"],
  CLIPTextEncode: ["text"],
  UNETLoader: ["unet_name", "weight_dtype"],
  CLIPLoader: ["clip_name", "type", "device"],
  VAELoader: ["vae_name"],
  SaveImage: ["filename_prefix"],
  ModelSamplingAuraFlow: ["shift"],
  VAEDecode: []
}, Wi = {
  KSampler: ["model", "positive", "negative", "latent_image", "seed", "steps", "cfg", "sampler_name", "scheduler", "denoise"],
  EmptySD3LatentImage: ["width", "height", "batch_size"],
  CLIPTextEncode: ["text", "clip"],
  UNETLoader: ["unet_name", "weight_dtype"],
  CLIPLoader: ["clip_name", "type"],
  VAELoader: ["vae_name"],
  SaveImage: ["images", "filename_prefix"],
  ModelSamplingAuraFlow: ["model", "shift"],
  VAEDecode: ["samples", "vae"]
}, er = "画面干净，无文字、字幕、标语、水印、Logo 或画面叠字。", tr = "text, subtitles, captions, watermark, logo, letters, typography, signature";
function Mt(e) {
  const t = /(?:^|\n)\s*(?:Negative\s+prompt|负向提示词|负面提示词)\s*[:：]\s*/i.exec(e);
  return t ? { positive: e.slice(0, t.index).trim(), negative: e.slice(t.index + t[0].length).trim() } : { positive: e.trim(), negative: "" };
}
function cn(e, t) {
  return t.trim() ? `${e.trim()}
Negative prompt: ${t.trim()}` : e.trim();
}
function eo(e) {
  return JSON.parse(JSON.stringify(e));
}
function Le(e) {
  const t = {};
  return (vn[e.type] ?? []).forEach((r, o) => {
    var a, l;
    const i = ((a = e.widgets_values_named) == null ? void 0 : a[r]) ?? ((l = e.widgets_values) == null ? void 0 : l[o]);
    i !== void 0 && (t[r] = i);
  }), t;
}
function Oe(e, t) {
  const r = e.nodes.filter((o) => o.type === t);
  if (r.length !== 1) throw new Error(`生图工作流需要一个 ${t} 节点，当前为 ${r.length} 个`);
  return r[0];
}
function bt(e, t) {
  var l;
  const o = (l = Oe(e, "KSampler").inputs) == null ? void 0 : l.find((s) => s.name === t), i = e.links.find((s) => Array.isArray(s) && s[0] === (o == null ? void 0 : o.link)), a = i && e.nodes.find((s) => String(s.id) === String(i[1]));
  if (!a || a.type !== "CLIPTextEncode") throw new Error(`生图工作流的 ${t} 未直连 CLIPTextEncode`);
  return a;
}
const nr = 4;
function Ji(e) {
  if (!Array.isArray(e == null ? void 0 : e.nodes) || !Array.isArray(e.links)) throw new Error("生图工作流需要 nodes 与 links");
  const t = new Map(e.nodes.map((s) => [String(s.id), s]));
  if (t.size !== e.nodes.length) throw new Error("生图工作流节点 ID 重复");
  const r = /* @__PURE__ */ new Map();
  for (const s of e.links) {
    if (!Array.isArray(s) || s.length < 6 || !t.has(String(s[1])) || !t.has(String(s[3])) || !Number.isInteger(s[2]) || s[2] < 0) throw new Error("生图工作流存在无效连线");
    if (r.has(String(s[0]))) throw new Error("生图工作流连线 ID 重复");
    r.set(String(s[0]), s);
  }
  const o = {}, i = /* @__PURE__ */ new Set(), a = (s, m) => {
    var d;
    const h = String(s.id);
    if (s.mode === nr) {
      if (m !== 0) throw new Error(`旁路节点 ${h} 不支持输出端口 ${m}`);
      const f = (s.inputs ?? []).filter((_) => _.link != null);
      if (f.length !== 1) throw new Error(`旁路节点 ${h} 需要恰好一个输入连线`);
      const c = r.get(String(f[0].link)), p = c && t.get(String(c[1])), b = (s.inputs ?? []).indexOf(f[0]);
      if (!c || !p || String(c[3]) !== h || c[4] !== b || !((d = p.outputs) != null && d[Number(c[2])]))
        throw new Error(`旁路节点 ${h} 的输入连线无效`);
      if (i.has(h)) throw new Error("生图工作流连线形成循环");
      i.add(h);
      try {
        return a(p, Number(c[2]));
      } finally {
        i.delete(h);
      }
    }
    return l(s), [h, m];
  }, l = (s) => {
    var d;
    const m = String(s.id);
    if (i.has(m)) throw new Error("生图工作流连线形成循环");
    if (o[m]) return;
    if (!(s.type in vn)) throw new Error(`生图工作流包含未支持的节点：${s.type}`);
    if (s.mode === nr) return;
    if (s.mode && s.mode !== 0) throw new Error(`生图节点 ${m} 已静音或旁路`);
    i.add(m);
    const h = Le(s);
    delete h.control_after_generate;
    for (const [f, c] of (s.inputs ?? []).entries()) {
      if (c.link == null) continue;
      const p = r.get(String(c.link)), b = p && t.get(String(p[1]));
      if (!p || !b || String(p[3]) !== m || p[4] !== f || !((d = b.outputs) != null && d[Number(p[2])])) throw new Error(`生图节点 ${m}.${c.name} 的连线无效`);
      h[c.name] = a(b, Number(p[2]));
    }
    for (const f of Wi[s.type]) if (h[f] == null) throw new Error(`生图节点 ${m} 缺少输入 ${f}`);
    o[m] = { class_type: s.type, inputs: h, _meta: { title: s.title ?? s.type } }, i.delete(m);
  };
  return l(Oe(e, "SaveImage")), bt(e, "positive"), bt(e, "negative"), o;
}
function ut(e, t, r, o, i = 1) {
  if (!Number.isSafeInteger(e) || e < r || e > o || e % i) throw new Error(`${t} 必须为 ${r}–${o} 的整数${i > 1 ? `，且为 ${i} 的倍数` : ""}`);
}
function qi(e) {
  if (!e.positivePrompt.trim()) throw new Error("请填写生图提示词");
  if (ut(e.width, "宽度", 256, 2048, 8), ut(e.height, "高度", 256, 2048, 8), ut(e.steps, "步数", 1, 100), ut(e.batchSize, "生成数量", 1, 4), ut(e.seed, "种子", 0, Number.MAX_SAFE_INTEGER), !Number.isFinite(e.cfg) || e.cfg < 0 || e.cfg > 30) throw new Error("CFG 范围为 0–30");
  if (!e.filenamePrefix.startsWith("TheodoreDirector/ImageGen/") || /[\\:*?"<>|\u0000-\u001f]/.test(e.filenamePrefix) || e.filenamePrefix.split("/").some((t) => !t || t === "." || t === "..")) throw new Error("生图保存路径无效");
}
function Wt(e) {
  return qi(e), {
    ...e,
    positivePrompt: e.positivePrompt.includes(er) ? e.positivePrompt.trim() : `${e.positivePrompt.trim()}
${er}`,
    negativePrompt: e.negativePrompt.includes(tr) ? e.negativePrompt.trim() : [e.negativePrompt.trim(), tr].filter(Boolean).join(", ")
  };
}
function Ki(e) {
  const t = Le(Oe(e, "KSampler")), r = Le(Oe(e, "EmptySD3LatentImage")), o = e.nodes.flatMap((i) => [Le(i).unet_name, Le(i).clip_name, Le(i).vae_name].filter((a) => typeof a == "string"));
  return {
    negativePrompt: String(Le(bt(e, "negative")).text ?? ""),
    width: Number(r.width),
    height: Number(r.height),
    batchSize: Number(r.batch_size),
    steps: Number(t.steps),
    cfg: Number(t.cfg),
    seed: Number(t.seed),
    models: o,
    unetName: String(Le(Oe(e, "UNETLoader")).unet_name),
    clipName: String(Le(Oe(e, "CLIPLoader")).clip_name),
    clipType: String(Le(Oe(e, "CLIPLoader")).type),
    vaeName: String(Le(Oe(e, "VAELoader")).vae_name)
  };
}
async function Qi(e = fetch, t) {
  var s, m, h;
  const r = [["unetName", "UNETLoader", "unet_name"], ["clipName", "CLIPLoader", "clip_name"], ["vaeName", "VAELoader", "vae_name"], ["clipType", "CLIPLoader", "type"]], o = [...new Set(r.map(([, d]) => d))], i = await Promise.all(o.map(async (d) => {
    const f = await e(`/object_info/${d}`, { signal: t });
    if (!f.ok) throw new Error(`读取生图模型列表失败：${d} HTTP ${f.status}`);
    return await f.json();
  })), a = Object.assign({}, ...i), l = {};
  for (const [d, f, c] of r) {
    const p = (h = (m = (s = a[f]) == null ? void 0 : s.input) == null ? void 0 : m.required) == null ? void 0 : h[c], b = Array.isArray(p) && Array.isArray(p[0]) ? p[0] : [];
    if (l[d] = [...new Set(b.filter((_) => typeof _ == "string" && !!_.trim()))], !l[d].length) throw new Error(`当前 ComfyUI 的 ${f}.${c} 没有可用选项`);
  }
  return l;
}
function Yi(e, t, r) {
  const o = Wt(r), i = eo(e), a = (l) => {
    var m;
    const s = String(Oe(t, l).id);
    if (((m = i[s]) == null ? void 0 : m.class_type) !== l) throw new Error(`生图 API 缺少节点 ${s} (${l})`);
    return i[s];
  };
  i[String(bt(t, "positive").id)].inputs.text = o.positivePrompt, i[String(bt(t, "negative").id)].inputs.text = o.negativePrompt, Object.assign(a("KSampler").inputs, { seed: o.seed, steps: o.steps, cfg: o.cfg }), Object.assign(a("EmptySD3LatentImage").inputs, { width: o.width, height: o.height, batch_size: o.batchSize });
  for (const [l, s, m] of [["unetName", "UNETLoader", "unet_name"], ["clipName", "CLIPLoader", "clip_name"], ["clipType", "CLIPLoader", "type"], ["vaeName", "VAELoader", "vae_name"]])
    o[l] && (a(s).inputs[m] = o[l]);
  return a("SaveImage").inputs.filename_prefix = o.filenamePrefix, i;
}
function Xi(e, t) {
  var o;
  const r = eo(e);
  for (const i of r.nodes) {
    const a = (o = t[String(i.id)]) == null ? void 0 : o.inputs;
    if (a)
      for (const [l, s] of (vn[i.type] ?? []).entries()) {
        const m = s === "control_after_generate" ? "fixed" : a[s];
        m === void 0 || Array.isArray(m) || (i.widgets_values && (i.widgets_values[l] = m), i.widgets_values_named && (i.widgets_values_named[s] = m));
      }
  }
  return r;
}
function rr(e) {
  return e.trim().replace(/[^\p{L}\p{N}._-]+/gu, "_").replace(/^[_.]+|[_.]+$/g, "").slice(0, 72) || "asset";
}
function to(e, t) {
  return `TheodoreDirector/ImageGen/${rr(e)}/${rr(t)}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
function no() {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
}
function Zi(e) {
  return `/view?${new URLSearchParams({ filename: e.filename, subfolder: e.subfolder, type: e.type })}`;
}
function es(e, t, r) {
  const o = ro(e, t), i = o == null ? void 0 : o.outputs;
  if (!i || typeof i != "object") return [];
  const a = Object.values(i), l = /* @__PURE__ */ new Map();
  for (const s of a) {
    const m = s == null ? void 0 : s.images;
    if (Array.isArray(m))
      for (const h of m) {
        const d = h;
        if (!d || typeof d.filename != "string" || !/\.(png|jpe?g|webp|bmp)$/i.test(d.filename) || d.type && d.type !== "output") continue;
        const f = { filename: d.filename, subfolder: typeof d.subfolder == "string" ? d.subfolder : "", type: "output" };
        l.set(`${f.subfolder}/${f.filename}`, { ...f, url: Zi(f) });
      }
  }
  return [...l.values()];
}
function ro(e, t) {
  if (!e || typeof e != "object") return;
  const r = e[t];
  return r && typeof r == "object" ? r : void 0;
}
function oo(e, t) {
  var o;
  const r = (o = ro(e, t)) == null ? void 0 : o.status;
  if ((r == null ? void 0 : r.status_str) === "error") {
    for (const i of r.messages ?? [])
      if (Array.isArray(i) && i[1] && typeof i[1] == "object") {
        const a = i[1];
        if (a.exception_message) throw new Error(String(a.exception_message));
        if (i[0] === "execution_interrupted") throw new Error("生图任务已中断");
      }
    throw new Error("生图任务执行失败，请查看 ComfyUI 执行记录");
  }
  return r != null && r.completed ? "success" : "pending";
}
async function or(e, t, r = fetch, o) {
  for (let i = 0; i < 40; i++) {
    if (t != null && t.aborted) throw Ge();
    const a = await r(`/history/${encodeURIComponent(e)}`, { signal: t });
    if (!a.ok) throw new Error(`读取生图结果失败：HTTP ${a.status}`);
    const l = await a.json();
    oo(l, e);
    const s = es(l, e);
    if (s.length) return s;
    i < 39 && await new Promise((m, h) => {
      const d = () => {
        clearTimeout(f), h(Ge());
      }, f = setTimeout(() => {
        t == null || t.removeEventListener("abort", d), m();
      }, 500);
      t == null || t.addEventListener("abort", d, { once: !0 });
    });
  }
  throw new Error("任务已结束，但没有 SaveImage 图片输出；可用任务 ID 在 ComfyUI 历史记录中核查");
}
function ts(e, t, r, o, i) {
  const a = new Set(o.map((s) => s.alias.toLowerCase()));
  let l = 1;
  for (; a.has(`${e.alias}_${l}`.toLowerCase()); ) l++;
  return {
    ...e,
    id: `image_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`,
    alias: `${e.alias}_${l}`,
    kind: "image",
    path: t,
    genPrompt: r,
    fingerprint: "",
    fixed: !1,
    enabled: !0,
    fixedOrder: Math.max(0, ...o.map((s) => s.fixedOrder)) + 1,
    shotIds: [],
    imageGeneration: i,
    imageGenerationPending: void 0,
    includeVideoAudio: !1,
    durationSeconds: null,
    audioDurationSeconds: null
  };
}
const io = "theodore-director-image-settings-v1", ns = {
  width: 1080,
  height: 720,
  steps: 12,
  cfg: 1,
  batchSize: 1,
  seed: 0,
  randomSeed: !1
};
let Rt = {};
function so() {
  try {
    return globalThis.localStorage;
  } catch {
    return;
  }
}
function Dt(e) {
  if (!e || typeof e != "object") return {};
  const t = e, r = {};
  for (const o of ["width", "height", "steps", "cfg", "batchSize", "seed"]) {
    const i = t[o];
    if (typeof i != "number" || !Number.isFinite(i)) continue;
    (o === "width" || o === "height" ? Number.isSafeInteger(i) && i >= 256 && i <= 2048 && i % 8 === 0 : o === "steps" ? Number.isSafeInteger(i) && i >= 1 && i <= 100 : o === "batchSize" ? Number.isSafeInteger(i) && i >= 1 && i <= 4 : o === "seed" ? Number.isSafeInteger(i) && i >= 0 : i >= 0 && i <= 30) && (r[o] = i);
  }
  typeof t.randomSeed == "boolean" && (r.randomSeed = t.randomSeed);
  for (const o of ["unetName", "clipName", "vaeName", "clipType"])
    typeof t[o] == "string" && t[o].trim() && !/[\u0000-\u001f]/.test(t[o]) && (r[o] = t[o]);
  return r;
}
function ao(e = so()) {
  try {
    const t = e == null ? void 0 : e.getItem(io);
    return { ...Dt(t ? JSON.parse(t) : null), ...Rt };
  } catch {
    return { ...Rt };
  }
}
function ir(e, t = ao()) {
  return { ...ns, ...Dt(e), ...Dt(t) };
}
function rs(e, t = so()) {
  Rt = { ...ao(t), ...Dt(e) };
  try {
    t == null || t.setItem(io, JSON.stringify(Rt));
  } catch {
  }
}
function Ot(e) {
  return e.filter((t) => t.enabled && t.kind === "image" && !!Mt(t.genPrompt ?? "").positive);
}
async function os(e) {
  var a, l;
  const { signal: t } = e, r = () => {
    if (t.aborted) throw Ge();
  }, i = Ot(e.assets).map((s) => {
    const m = Mt(s.genPrompt ?? ""), { randomSeed: h, ...d } = e.preferences;
    return { asset: s, settings: Wt({
      ...d,
      positivePrompt: m.positive,
      negativePrompt: m.negative || e.negativePrompt,
      seed: h ? no() : d.seed,
      filenamePrefix: to(e.projectName, s.alias)
    }) };
  });
  for (const [s, { asset: m, settings: h }] of i.entries()) {
    r(), (a = e.onItem) == null || a.call(e, m, s, i.length);
    try {
      const d = Date.now(), f = m.imageGenerationPending ? await e.recover(m.imageGenerationPending) : await e.queue({
        ...h,
        signal: t,
        onProgress: e.onProgress,
        onQueued: (N) => e.onPending(m.id, { promptId: N, createdAt: d, settings: h })
      });
      await e.onRecord(m.id, f), e.onPending(m.id, null), r();
      const c = f.images[0];
      if (!c) throw new Error("任务完成，但没有可用图片结果");
      const p = `${c.subfolder}/${c.filename}`, b = ((l = f.registeredPaths) == null ? void 0 : l[p]) ?? await e.register(e.projectName, c), _ = { ...f, registeredPaths: { ...f.registeredPaths, [p]: b } };
      await e.onApply(m.id, b, cn(f.settings.positivePrompt, f.settings.negativePrompt), _), e.onResult({ assetId: m.id, alias: m.alias, status: "success" });
    } catch (d) {
      if (t.aborted || d instanceof Error && d.name === "AbortError") throw Ge();
      e.onResult({ assetId: m.id, alias: m.alias, status: "error", error: d instanceof Error ? d.message : String(d) });
    }
  }
}
const sr = { negativePrompt: "blurry ugly bad", width: 1080, height: 720, batchSize: 1, steps: 12, cfg: 1, seed: 0, models: [] };
function is({ asset: e, batchAssets: t, projectName: r, language: o, defaults: i, queue: a, recover: l, running: s, progress: m, register: h, onPending: d, onRecord: f, onPromptChange: c, onStart: p, onProgress: b, onFinish: _, onApply: N, onCreateAsset: k, onStop: w, onClose: z }) {
  var ot, _t;
  const g = (A, se) => o === "zh" ? A : se, [$, T] = R(sr), [C, S] = R(!0), [L, V] = R(""), O = Mt(e.genPrompt ?? ""), U = (ot = e.imageGeneration) == null ? void 0 : ot.settings, [P, oe] = R(O.positive || (U == null ? void 0 : U.positivePrompt) || ""), [y, D] = R(O.negative || ""), [j, H] = R(() => ir()), { width: te, height: X, steps: M, cfg: v, batchSize: K, seed: Z, randomSeed: Q } = j, ee = [["unetName", "扩散模型 / UNet"], ["clipName", "文本编码器 / CLIP"], ["vaeName", "VAE"], ["clipType", "CLIP 类型"]], pe = ee.filter(([A]) => $.modelOptions && (!j[A] || !$.modelOptions[A].includes(j[A]))), E = pe.length ? g(`当前选择不可用：${pe.map(([, A]) => A).join("、")}。请选择服务器已安装的模型。`, "Some selected model files or types are unavailable. Choose installed models.") : "", B = (A, se) => {
    rs({ [A]: se }), H((de) => ({ ...de, [A]: se }));
  }, ue = Ot(t ?? []), [ne, u] = R(() => Ot(t ?? []).filter((A) => !A.path.trim()).map((A) => A.id)), [G, Y] = R([]), [ce, be] = R(""), le = !!t, [Me, xe] = R(((_t = e.imageGeneration) == null ? void 0 : _t.images) ?? []), [ae, nt] = R(e.imageGeneration ?? null), [at, ye] = R(""), [Ne, dt] = R(""), [vt, rt] = R(0);
  Pe(() => {
    let A = !0;
    return i().then((se) => {
      A && (T(se), D((de) => de.trim() ? de : se.negativePrompt), H(ir(se)), S(!1));
    }).catch((se) => {
      A && (V(se instanceof Error ? se.message : String(se)), D((de) => de.trim() ? de : sr.negativePrompt), S(!1));
    }), () => {
      A = !1;
    };
  }, [i, vt]);
  const Jt = () => cn(P, y), qt = async () => {
    ye("");
    let A;
    try {
      const { randomSeed: fe, ...$e } = j;
      A = Wt({ ...$e, positivePrompt: P, negativePrompt: y, width: te, height: X, steps: M, cfg: v, batchSize: K, seed: Q ? no() : Z, filenamePrefix: to(r, e.alias) });
    } catch (fe) {
      ye(fe instanceof Error ? fe.message : String(fe));
      return;
    }
    c(e.id, Jt());
    const se = new AbortController();
    p(se);
    const de = Date.now();
    try {
      const fe = await a({ ...A, signal: se.signal, onProgress: b, onQueued: ($e) => d(e.id, { promptId: $e, createdAt: de, settings: A }) });
      nt(fe), xe(fe.images), await f(e.id, fe), d(e.id, null), fe.images.length || ye(g("任务完成，但没有可用图片结果。", "The job finished without image results."));
    } catch (fe) {
      fe instanceof Error && fe.name === "AbortError" || ye(fe instanceof Error ? fe.message : String(fe));
    } finally {
      _(se);
    }
  }, wt = async (A = !1) => {
    if (s) return;
    const se = new Set(G.filter((he) => he.status === "error").map((he) => he.assetId)), de = ue.filter((he) => ne.includes(he.id) && (!A || se.has(he.id)));
    if (!de.length) {
      ye(g("请先勾选要生成的图片素材。", "Select image assets first."));
      return;
    }
    const fe = de.filter((he) => he.path.trim());
    if (fe.length && !window.confirm(g(`将替换 ${fe.length} 项已有素材，生成并绑定成功后清理未被其他素材使用的旧资源。继续？`, `Replace ${fe.length} existing assets and remove their unused old resources after assigning the new images?`))) return;
    const $e = new AbortController();
    ye(""), Y(A ? (he) => he.filter((ge) => !de.some((Ee) => Ee.id === ge.assetId)) : []), p($e);
    try {
      await os({
        assets: de,
        projectName: r,
        preferences: { ...j },
        negativePrompt: y,
        signal: $e.signal,
        queue: a,
        recover: l,
        register: h,
        onPending: d,
        onRecord: f,
        onApply: N,
        onProgress: b,
        onItem: (he, ge, Ee) => {
          be(`${ge + 1}/${Ee} · ${he.alias}`), b({ value: 0, max: 0 });
        },
        onResult: (he) => Y((ge) => [...ge, he])
      });
    } catch (he) {
      ye(he instanceof Error && he.name === "AbortError" ? g("批量生成已停止，完成项已保存，未完成任务可在对应素材中恢复结果。", "Batch stopped. Completed assets are saved; recover pending jobs from their asset panels.") : he instanceof Error ? he.message : String(he));
    } finally {
      _($e), be("");
    }
  }, lt = async () => {
    const A = e.imageGenerationPending;
    if (!A || s) return;
    const se = new AbortController();
    p(se), ye("");
    try {
      const de = await l(A);
      nt(de), xe(de.images), await f(e.id, de), d(e.id, null);
    } catch (de) {
      ye(de instanceof Error ? de.message : String(de));
    } finally {
      _(se);
    }
  }, yt = async (A, se, de) => {
    var fe;
    if (!Ne && !(se === "replace" && e.path && !window.confirm(g(`当前素材“${e.alias}”已有文件。新图绑定成功后将清理未被其他素材使用的旧资源。继续？`, `Replace “${e.alias}” and remove its unused old resources after assigning the new image?`)))) {
      dt(A.filename), ye("");
      try {
        if (!ae) throw new Error("生成记录不存在，请重新生成");
        const $e = `${A.subfolder}/${A.filename}`;
        let he = ae, ge = (fe = ae.registeredPaths) == null ? void 0 : fe[$e];
        ge || (ge = await h(r, A), he = { ...ae, registeredPaths: { ...ae.registeredPaths, [$e]: ge } }, nt(he), await f(e.id, he));
        const Ee = cn(ae.settings.positivePrompt, ae.settings.negativePrompt);
        se === "replace" ? await N(e.id, ge, Ee, he) : k(e, ge, Ee, de, he);
      } catch ($e) {
        ye($e instanceof Error ? $e.message : String($e));
      } finally {
        dt("");
      }
    }
  }, ct = m.max > 0 ? Math.max(0, Math.min(100, Math.round(m.value / m.max * 100))) : 0;
  return /* @__PURE__ */ n("div", { class: "td-batch-overlay td-imagegen-overlay", role: "presentation", children: /* @__PURE__ */ n("section", { class: "td-imagegen-panel", role: "dialog", "aria-modal": "true", "aria-label": g("自动生图", "Generate image"), children: [
    /* @__PURE__ */ n("header", { class: "td-batch-header", children: [
      /* @__PURE__ */ n("div", { children: [
        /* @__PURE__ */ n("h2", { children: le ? g("批量生图", "Batch image generation") : g("导播台内自动生图", "Generate inside Director") }),
        /* @__PURE__ */ n("p", { children: le ? g("逐项使用各自提示词生成并自动绑定首张结果；完成项立即保存。", "Generate each asset with its own prompt and assign its first image; save each completed item immediately.") : g(`目标素材：${e.alias}`, `Target: ${e.alias}`) }),
        /* @__PURE__ */ n("small", { children: g("参数修改自动记住，下一个素材、重开窗口和刷新后沿用。", "Settings are remembered across assets, panels and page reloads.") })
      ] }),
      /* @__PURE__ */ n("button", { "aria-label": g("关闭", "Close"), disabled: s || !!Ne, onClick: z, children: "×" })
    ] }),
    le && /* @__PURE__ */ n("section", { class: "td-imagegen-batch-selection", children: [
      /* @__PURE__ */ n("header", { children: [
        /* @__PURE__ */ n("strong", { children: g(`已选 ${ne.length} / ${ue.length} 项`, `${ne.length} / ${ue.length} selected`) }),
        /* @__PURE__ */ n("button", { disabled: s, onClick: () => u(ue.filter((A) => !A.path.trim()).map((A) => A.id)), children: g("只选缺图", "Missing only") }),
        /* @__PURE__ */ n("button", { disabled: s, onClick: () => u(ue.map((A) => A.id)), children: g("全选", "Select all") }),
        /* @__PURE__ */ n("button", { disabled: s, onClick: () => u([]), children: g("全不选", "Clear selection") })
      ] }),
      /* @__PURE__ */ n("div", { class: "td-imagegen-batch-list", children: ue.map((A) => /* @__PURE__ */ n("label", { children: [
        /* @__PURE__ */ n("input", { type: "checkbox", checked: ne.includes(A.id), disabled: s, onChange: (se) => u((de) => se.currentTarget.checked ? [...de, A.id] : de.filter((fe) => fe !== A.id)) }),
        /* @__PURE__ */ n("strong", { children: A.alias }),
        /* @__PURE__ */ n("span", { children: A.path.trim() ? g("已有图（将替换）", "Existing image (replace)") : g("缺图", "Missing") }),
        /* @__PURE__ */ n("small", { title: A.genPrompt, children: Mt(A.genPrompt ?? "").positive.slice(0, 120) })
      ] }, A.id)) }),
      /* @__PURE__ */ n("small", { children: g("仅列出已启用且填写了生图提示词的图片素材。每项结果可回到“自动生图”查看或换选。", "Only enabled image assets with prompts are listed. View or choose other results from each asset's Generate image panel.") })
    ] }),
    /* @__PURE__ */ n("div", { class: "td-imagegen-models", children: [
      /* @__PURE__ */ n("header", { children: [
        /* @__PURE__ */ n("strong", { children: g("生图模型", "Image models") }),
        /* @__PURE__ */ n("button", { disabled: s || C, onClick: () => {
          S(!0), V(""), rt((A) => A + 1);
        }, children: g("刷新模型列表", "Refresh models") })
      ] }),
      $.modelOptions ? /* @__PURE__ */ n("div", { class: "td-imagegen-model-selects", children: ee.map(([A, se]) => /* @__PURE__ */ n("label", { children: [
        se,
        /* @__PURE__ */ n("select", { "aria-label": se, value: j[A] ?? "", disabled: s || C, onChange: (de) => B(A, de.currentTarget.value), children: [
          !$.modelOptions[A].includes(j[A] ?? "") && /* @__PURE__ */ n("option", { value: j[A] ?? "", children: j[A] ? `${j[A]} ${g("（不可用）", "(unavailable)")}` : g("请选择", "Select") }),
          $.modelOptions[A].map((de) => /* @__PURE__ */ n("option", { value: de, children: de }, de))
        ] })
      ] }, A)) }) : $.models.map((A) => /* @__PURE__ */ n("code", { children: A }, A)),
      /* @__PURE__ */ n("small", { children: g("选择会自动记住，并用于单张和批量生图。UNet、CLIP、VAE 及类型需与当前工作流架构匹配。当前为文生图，不接收参考图片。", "Selections are remembered for single and batch jobs. Match UNet, CLIP, VAE and encoder type to the workflow architecture. This workflow is text-to-image.") })
    ] }),
    E && /* @__PURE__ */ n("div", { class: "td-imagegen-error", children: E }),
    L && /* @__PURE__ */ n("div", { class: "td-imagegen-error", children: [
      g("读取内置生图工作流失败", "Could not load bundled image workflow"),
      ": ",
      L,
      /* @__PURE__ */ n("button", { onClick: () => {
        S(!0), V(""), rt((A) => A + 1);
      }, children: g("重试", "Retry") })
    ] }),
    /* @__PURE__ */ n("div", { class: "td-imagegen-form", children: [
      !le && /* @__PURE__ */ n("label", { class: "wide", children: [
        g("正向提示词", "Positive prompt"),
        /* @__PURE__ */ n("textarea", { rows: 5, value: P, disabled: s, onInput: (A) => oe(A.currentTarget.value), placeholder: g("描述主体、外观、场景、构图与光线", "Describe subject, appearance, scene, framing and light") })
      ] }),
      /* @__PURE__ */ n("label", { class: "wide", children: [
        g("负向提示词", "Negative prompt"),
        /* @__PURE__ */ n("textarea", { rows: 3, value: y, disabled: s, onInput: (A) => D(A.currentTarget.value) }),
        /* @__PURE__ */ n("small", { children: g("画面无文字、字幕、水印或标识为固定约束。", "No text, captions, watermarks or logos are enforced.") })
      ] }),
      /* @__PURE__ */ n("label", { children: [
        g("宽度", "Width"),
        /* @__PURE__ */ n("input", { type: "number", min: "256", max: "2048", step: "8", value: te, disabled: s, onInput: (A) => B("width", A.currentTarget.valueAsNumber) })
      ] }),
      /* @__PURE__ */ n("label", { children: [
        g("高度", "Height"),
        /* @__PURE__ */ n("input", { type: "number", min: "256", max: "2048", step: "8", value: X, disabled: s, onInput: (A) => B("height", A.currentTarget.valueAsNumber) })
      ] }),
      /* @__PURE__ */ n("label", { children: [
        g("采样步数", "Steps"),
        /* @__PURE__ */ n("input", { type: "number", min: "1", max: "100", step: "1", value: M, disabled: s, onInput: (A) => B("steps", A.currentTarget.valueAsNumber) })
      ] }),
      /* @__PURE__ */ n("label", { children: [
        "CFG",
        /* @__PURE__ */ n("input", { type: "number", min: "0", max: "30", step: "0.1", value: v, disabled: s, onInput: (A) => B("cfg", A.currentTarget.valueAsNumber) })
      ] }),
      /* @__PURE__ */ n("label", { children: [
        g("每项出图数（1–4）", "Images per asset (1–4)"),
        /* @__PURE__ */ n("input", { type: "number", min: "1", max: "4", step: "1", value: K, disabled: s, onInput: (A) => B("batchSize", A.currentTarget.valueAsNumber) })
      ] }),
      /* @__PURE__ */ n("label", { class: "td-imagegen-seed", children: [
        /* @__PURE__ */ n("span", { children: g("种子", "Seed") }),
        /* @__PURE__ */ n("input", { type: "number", min: "0", max: Number.MAX_SAFE_INTEGER, value: Z, disabled: s || Q, onInput: (A) => B("seed", A.currentTarget.valueAsNumber) })
      ] }),
      /* @__PURE__ */ n("label", { class: "td-imagegen-random", children: [
        /* @__PURE__ */ n("input", { type: "checkbox", checked: Q, disabled: s, onChange: (A) => B("randomSeed", A.currentTarget.checked) }),
        g("每次随机", "Randomize")
      ] })
    ] }),
    s && /* @__PURE__ */ n("div", { class: "td-batch-progress", children: [
      /* @__PURE__ */ n("span", { children: ce || g("生图进行中", "Generating") }),
      /* @__PURE__ */ n("progress", { max: "100", value: ct }),
      /* @__PURE__ */ n("b", { children: m.max ? `${ct}%` : g("排队中", "Queued") })
    ] }),
    le && G.length > 0 && /* @__PURE__ */ n("section", { class: "td-imagegen-batch-outcomes", children: [
      /* @__PURE__ */ n("header", { children: /* @__PURE__ */ n("strong", { children: g(`完成 ${G.filter((A) => A.status === "success").length} · 失败 ${G.filter((A) => A.status === "error").length}`, `${G.filter((A) => A.status === "success").length} completed · ${G.filter((A) => A.status === "error").length} failed`) }) }),
      /* @__PURE__ */ n("div", { class: "td-imagegen-batch-log", role: "log", "aria-label": g("批量生图日志", "Batch generation log"), tabIndex: 0, children: G.map((A) => /* @__PURE__ */ n("div", { class: `td-imagegen-log-row ${A.status}`, children: [
        /* @__PURE__ */ n("strong", { children: A.alias }),
        /* @__PURE__ */ n("span", { children: A.status === "success" ? g("已生成并绑定", "Generated and assigned") : A.error })
      ] }, A.assetId)) }),
      G.some((A) => A.status === "error") && /* @__PURE__ */ n("button", { disabled: s || C || !!L || !!E, onClick: () => void wt(!0), children: g("重试勾选的失败项", "Retry selected failures") })
    ] }),
    !le && e.imageGenerationPending && !s && /* @__PURE__ */ n("div", { class: "td-imagegen-pending", children: [
      /* @__PURE__ */ n("span", { children: g(`未完成任务：${e.imageGenerationPending.promptId}`, `Pending task: ${e.imageGenerationPending.promptId}`) }),
      /* @__PURE__ */ n("button", { onClick: () => void lt(), children: g("恢复结果", "Recover results") })
    ] }),
    at && /* @__PURE__ */ n("div", { class: "td-imagegen-error", children: at }),
    !le && ae && /* @__PURE__ */ n("div", { class: "td-imagegen-record", children: [
      /* @__PURE__ */ n("span", { children: [
        g("实际种子", "Seed"),
        ": ",
        ae.settings.seed
      ] }),
      /* @__PURE__ */ n("span", { children: [
        ae.settings.width,
        " × ",
        ae.settings.height
      ] }),
      /* @__PURE__ */ n("span", { children: [
        ae.settings.steps,
        " steps · CFG ",
        ae.settings.cfg
      ] }),
      /* @__PURE__ */ n("span", { title: ae.promptId, children: [
        "ID ",
        ae.promptId
      ] })
    ] }),
    !le && Me.length > 0 && /* @__PURE__ */ n("section", { class: "td-imagegen-results", children: [
      /* @__PURE__ */ n("header", { children: [
        /* @__PURE__ */ n("strong", { children: g(`生成结果（${Me.length}）`, `Generated images (${Me.length})`) }),
        /* @__PURE__ */ n("span", { children: g("选一张绑定当前素材，或登记为新素材", "Assign an image to this asset or add it as a new asset") })
      ] }),
      /* @__PURE__ */ n("div", { class: "td-imagegen-grid", children: Me.map((A, se) => /* @__PURE__ */ n("article", { children: [
        /* @__PURE__ */ n("img", { src: A.url, alt: `${e.alias} ${se + 1}`, loading: "lazy" }),
        /* @__PURE__ */ n("small", { title: A.filename, children: A.filename }),
        /* @__PURE__ */ n("button", { class: "primary", disabled: s || !!Ne, onClick: () => void yt(A, "replace", se), children: Ne === A.filename ? g("正在登记…", "Saving…") : g("设为当前素材", "Use for this asset") }),
        /* @__PURE__ */ n("button", { disabled: s || !!Ne, onClick: () => void yt(A, "new", se), children: Ne === A.filename ? g("正在登记…", "Saving…") : g("登记为新素材", "Add as new asset") })
      ] }, `${A.subfolder}/${A.filename}`)) })
    ] }),
    /* @__PURE__ */ n("footer", { children: [
      /* @__PURE__ */ n("span", { class: "td-imagegen-footer-note", children: g("按当前选择加载模型；采样器与调度器沿用工作流，入队前检查实际模型。", "Load selected models; retain workflow sampler and scheduler. Validate selected files before queueing.") }),
      s && /* @__PURE__ */ n("button", { class: "danger", onClick: w, children: g("停止生图", "Stop") }),
      /* @__PURE__ */ n("button", { disabled: s || C || !!L || !!E || le && !ne.length, onClick: () => void (le ? wt() : qt()), class: "primary", children: s ? g("正在生成…", "Generating…") : le ? g(`开始批量生成（${ne.length}项）`, `Generate selected (${ne.length})`) : g("开始生图", "Generate") })
    ] })
  ] }) });
}
function ss(e, t, r) {
  const i = e.assets.filter((l) => !t.some((s) => s.id === l.id)).flatMap((l) => {
    var h;
    const s = l.path ? [{ type: "input", path: l.path }] : [];
    for (const d of Object.values(((h = l.imageGeneration) == null ? void 0 : h.registeredPaths) ?? {})) s.push({ type: "input", path: d });
    const m = l.id === (r == null ? void 0 : r.assetId) ? [] : l.imageGenerationHistory ?? [];
    for (const d of [l.imageGeneration, ...m]) {
      for (const f of (d == null ? void 0 : d.images) ?? []) s.push({ type: "output", path: `${f.subfolder}/${f.filename}` });
      for (const f of Object.values((d == null ? void 0 : d.registeredPaths) ?? {})) s.push({ type: "input", path: f });
    }
    return s;
  }), a = t.flatMap((l) => l.path ? [{ type: "input", path: l.path }] : []);
  r != null && r.oldPath && a.push({ type: "input", path: r.oldPath });
  for (const l of [r == null ? void 0 : r.oldGeneration, ...(r == null ? void 0 : r.oldGenerations) ?? []]) {
    for (const s of Object.values((l == null ? void 0 : l.registeredPaths) ?? {})) a.push({ type: "input", path: s });
    for (const s of (l == null ? void 0 : l.images) ?? []) a.push({ type: "output", path: `${s.subfolder}/${s.filename}` });
  }
  return { candidates: a, keep: i };
}
async function as(e, t) {
  const r = await fetch("/theodore-director/v1/storyboard/resources/clear", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ projectName: e, runId: t }) }), o = await r.json();
  if (!r.ok || !o.ok) throw new Error(o.error || `HTTP ${r.status}`);
  return { deleted: o.deleted ?? [], bytes: o.bytes ?? 0 };
}
async function ds(e, t) {
  var i;
  const r = await fetch("/theodore-director/v1/assets/cleanup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ projectName: e, ...t }) }), o = await r.json();
  if (!r.ok && r.status !== 409) throw new Error(o.error || `HTTP ${r.status}`);
  if ((i = o.failures) != null && i.length) throw new Error(`资源清理失败：${o.failures.map((a) => a.path).join(", ")}`);
  return o;
}
const ls = { unet_name: "H3 主模型", weight_dtype: "模型精度", clip_name: "文本编码器", type: "编码器类型", device: "设备", vae_name: "VAE 模型", aspect_ratio: "画幅比例", megapixels: "画面大小（百万像素）", multiple: "尺寸对齐倍数", scheduler: "调度器", steps: "采样步数", denoise: "重绘强度", sampler_name: "采样算法", lora_name: "LoRA 模型", strength_model: "LoRA 强度", strength: "Turbo LoRA 强度", low_vram: "低显存模式", shift_video: "视频 Sigma Shift", shift_audio: "音频 Sigma Shift", scale: "超分倍数", scale_factor: "超分倍数", quality: "超分质量", solver: "求解器", eta: "Eta" };
function cs({ controller: e, language: t, busy: r, notify: o }) {
  const i = (c, p) => t === "zh" ? c : p, [a, l] = R(() => e.read()), [s, m] = R({}), h = [...new Set(a.map((c) => c.group))], d = (c, p) => m((b) => {
    const _ = { ...b };
    return p === c.value ? delete _[c.id] : _[c.id] = p, _;
  }), f = () => {
    try {
      e.apply(s), l(e.read()), m({}), o(i("生成参数已写入当前画布；保存 ComfyUI 工作流后，重新加载也会保留。", "Generation settings applied. Save the ComfyUI workflow to retain them after reloading."));
    } catch (c) {
      o(c instanceof Error ? c.message : String(c), "error");
    }
  };
  return /* @__PURE__ */ n("section", { class: "td-workflow-settings", children: [
    /* @__PURE__ */ n("header", { children: [
      /* @__PURE__ */ n("div", { children: [
        /* @__PURE__ */ n("h2", { children: i("生成引擎", "Generation engine") }),
        /* @__PURE__ */ n("p", { children: i("直接调整当前工作流的模型、画幅、采样和 LoRA。应用后用于下一次生成。", "Edit the current workflow's models, framing, sampling and LoRAs for the next run.") })
      ] }),
      /* @__PURE__ */ n("button", { class: "primary", disabled: r || !Object.keys(s).length, onClick: f, children: [
        i("应用生成参数", "Apply engine settings"),
        Object.keys(s).length ? ` (${Object.keys(s).length})` : ""
      ] })
    ] }),
    h.map((c) => /* @__PURE__ */ n("section", { class: "td-workflow-group", children: [
      /* @__PURE__ */ n("h3", { children: c }),
      /* @__PURE__ */ n("div", { class: "td-workflow-fields", children: a.filter((p) => p.group === c).map((p) => {
        const b = s[p.id] ?? p.value;
        return /* @__PURE__ */ n("label", { children: [
          t === "zh" ? ls[p.label] ?? p.label : p.label,
          p.choices ? /* @__PURE__ */ n("select", { disabled: r, value: String(b), onChange: (_) => d(p, _.currentTarget.value), children: [
            !p.choices.includes(String(b)) && /* @__PURE__ */ n("option", { value: String(b), children: String(b) }),
            p.choices.map((_) => /* @__PURE__ */ n("option", { value: _, children: _ }, _))
          ] }) : typeof p.value == "boolean" ? /* @__PURE__ */ n("input", { disabled: r, type: "checkbox", checked: !!b, onChange: (_) => d(p, _.currentTarget.checked) }) : /* @__PURE__ */ n("input", { disabled: r, type: typeof p.value == "number" ? "number" : "text", min: p.min, max: p.max, step: "any", value: String(b), onInput: (_) => d(p, typeof p.value == "number" ? _.currentTarget.value === "" ? NaN : Number(_.currentTarget.value) : _.currentTarget.value) })
        ] }, p.id);
      }) })
    ] }, c)),
    !a.length && /* @__PURE__ */ n("p", { class: "td-hint", children: i("当前画布没有可编辑的生成控件。", "No editable engine controls in the current graph.") })
  ] });
}
const Ye = (e) => JSON.parse(JSON.stringify(e));
async function ar(e, t, r) {
  const o = new FormData();
  o.append("projectName", e), o.append("kind", t), o.append("file", r);
  const i = await fetch("/theodore-director/v1/assets", { method: "POST", body: o }), a = await i.json();
  if (!i.ok || !a.path) throw new Error(a.error || `HTTP ${i.status}`);
  return a.path;
}
function dr(e) {
  return e instanceof Error && e.name === "AbortError";
}
function ps({ language: e, projectName: t, runId: r, busy: o, onClearShots: i, onClearAssets: a, onProjectCleared: l }) {
  const [s, m] = R(!1), [h, d] = R(!1), f = !!(t.trim() && r.trim()), c = async () => {
    const _ = `${t.trim()} / Run ${r.trim()}`, N = e === "zh" ? `确认清空 ${_}？

该运行目录内的全部视频、latent、尾帧、结果文件和元数据都会移入系统回收站。输入素材及其他 Run 不会被删除。` : `Clear ${_}?

All videos, latent files, tail frames, result files, and metadata in this run will be moved to the system trash. Input assets and other runs will not be deleted.`;
    if (window.confirm(N)) {
      m(!0);
      try {
        const k = await Go(t, r);
        l(), window.alert(e === "zh" ? `已移入系统回收站：${k}` : `Moved to system trash: ${k}`);
      } catch (k) {
        window.alert(`${e === "zh" ? "清空项目失败" : "Failed to clear project"}: ${k instanceof Error ? k.message : String(k)}`);
      } finally {
        m(!1);
      }
    }
  }, p = async () => {
    const _ = e === "zh" ? `确认清空全部分镜及其正向、负向提示词？

操作后会保留一个空白镜头以便继续编辑。${h ? "当前 Run 的生成文件也会删除。" : "磁盘生成文件会保留。"}` : `Clear every shot and its positive and negative prompts?

One blank shot will remain. ${h ? "Generated files for this Run will also be deleted." : "Generated files remain on disk."}`;
    if (window.confirm(_)) {
      m(!0);
      try {
        await i(h);
      } catch (N) {
        window.alert(`${e === "zh" ? "清理失败" : "Cleanup failed"}: ${N instanceof Error ? N.message : String(N)}`);
      } finally {
        m(!1);
      }
    }
  };
  return /* @__PURE__ */ n("section", { class: "td-project-cleanup", children: [
    /* @__PURE__ */ n("h3", { children: e === "zh" ? "危险操作" : "Danger zone" }),
    /* @__PURE__ */ n("article", { children: [
      /* @__PURE__ */ n("div", { children: [
        /* @__PURE__ */ n("strong", { children: e === "zh" ? "清空分镜" : "Clear shots" }),
        /* @__PURE__ */ n("p", { children: e === "zh" ? "删除全部分镜及其提示词，并保留一个空白镜头。" : "Remove all shots and their prompts, leaving one blank shot." }),
        /* @__PURE__ */ n("label", { class: "td-inline-check", children: [
          /* @__PURE__ */ n("input", { type: "checkbox", checked: h, disabled: s || o, onChange: (_) => d(_.currentTarget.checked) }),
          e === "zh" ? "同时删除当前 Run 的生成资源" : "Also delete generated resources for this Run"
        ] })
      ] }),
      /* @__PURE__ */ n("button", { class: "danger", disabled: s || o, onClick: () => void p(), children: s ? e === "zh" ? "清理中…" : "Cleaning…" : e === "zh" ? "清空分镜" : "Clear shots" })
    ] }),
    /* @__PURE__ */ n("article", { children: [
      /* @__PURE__ */ n("div", { children: [
        /* @__PURE__ */ n("strong", { children: e === "zh" ? "清空素材库" : "Clear media library" }),
        /* @__PURE__ */ n("p", { children: e === "zh" ? "只移除当前工作流中的素材引用；本地图片、视频和音频文件保持不变。" : "Remove media references from this workflow only; local image, video, and audio files remain untouched." })
      ] }),
      /* @__PURE__ */ n("button", { class: "danger", onClick: () => {
        const _ = e === "zh" ? `确认清空素材库中的全部引用？

素材条目会从当前工作流中移除，但本地图片、视频和音频文件不会被删除。提示词中的引用文本会保留并显示为不可用。` : `Clear every media reference from this workflow?

Media entries will be removed, but local image, video, and audio files will not be deleted. Reference text in prompts will remain and be shown as unavailable.`;
        window.confirm(_) && a();
      }, children: e === "zh" ? "清空素材库" : "Clear media" })
    ] }),
    /* @__PURE__ */ n("article", { children: [
      /* @__PURE__ */ n("div", { children: [
        /* @__PURE__ */ n("strong", { children: e === "zh" ? "清空当前项目的生成文件" : "Clear generated files" }),
        /* @__PURE__ */ n("p", { children: e === "zh" ? "把当前 Project name + Run ID 的全部生成文件移入系统回收站。输入素材和其他 Run 不受影响。" : "Move every generated file for the current Project name + Run ID to the system trash. Input assets and other runs are unaffected." })
      ] }),
      /* @__PURE__ */ n("button", { class: "danger", disabled: !f || s, onClick: () => void c(), children: s ? e === "zh" ? "正在移入回收站…" : "Moving to trash…" : e === "zh" ? "清空项目" : "Clear project" })
    ] })
  ] });
}
function us({ initial: e, onSave: t, onPersist: r, onClose: o, supportsSecondSampling: i, queueSecondPass: a, queueFirstPass: l, imageGeneration: s, workflowSettings: m }) {
  var kn, Sn, $n;
  const [h] = R(() => ft(e)), [d, f] = R(h), [c, p] = R(() => JSON.stringify(h)), b = ke(d);
  b.current = d;
  const [_, N] = R("shots"), [k, w] = R(0), [z, g] = R(Zo), [$, T] = R(0), [C, S] = R([]), [L, V] = R(Je), [O, U] = R(!1), [P, oe] = R(!1), [y, D] = R(null), [j, H] = R(!1), [te, X] = R(!1), [M, v] = R([]), [K, Z] = R(() => String(h.defaults.durationSeconds ?? 6)), [Q, ee] = R("1"), [pe, E] = R(() => String(h.defaults.durationSeconds ?? 6)), B = ke(null), ue = ke(0), ne = Ri(d, $), u = (x, I) => z === "zh" ? x : I, Y = Ve(() => JSON.stringify(d), [d]) !== c, ce = M.length > 0 && M.every((x) => x.enabled), be = d.assets.filter((x) => x.enabled && !x.path.trim()).length, le = L.kind !== null, Me = (x) => {
    g(x), ei(x);
  }, xe = (x, I = "info") => {
    const F = ++ue.current;
    S((q) => [...q.slice(-3), { id: F, message: x, tone: I }]), window.setTimeout(() => S((q) => q.filter((W) => W.id !== F)), I === "error" ? 7e3 : 3200);
  }, ae = (x) => f((I) => {
    var q;
    const F = Ye(I);
    return x(F), (q = I.uiPreferences) != null && q.autoSave && queueMicrotask(() => ye(F)), F;
  }), nt = (x, I) => ae((F) => {
    const q = F.shots.find((W) => W.id === x);
    q && (q.review = { status: "pending", ...q.review, ...I, updatedAt: Date.now() });
  }), at = (x) => ae((I) => {
    I.pipeline = { phase: "first_pass", firstPassConfirmed: !1, secondPassMode: "super_resolution_second_pass", ...I.pipeline, ...x };
  }), ye = (x) => {
    (r ?? t)(x), p(JSON.stringify(x));
  }, Ne = (x, I, F = !0) => {
    const q = Ye(b.current), W = q.assets.find((J) => J.id === x);
    W && (I(W), b.current = q, f(q), F && ye(q));
  }, dt = () => {
    ye(d), xe(u("已保存到工作流", "Saved to workflow"));
  }, vt = () => {
    if (le) {
      xe(u("任务执行中，请先停止或等待完成再关闭", "A job is running"), "error");
      return;
    }
    Y ? X(!0) : o();
  }, rt = (x, I) => {
    const F = URL.createObjectURL(new Blob([JSON.stringify(x, null, 2)], { type: "application/json" })), q = document.createElement("a");
    q.href = F, q.download = I, q.click(), URL.revokeObjectURL(F);
  }, Jt = () => rt(d, `${en(d.project.name)}.director.json`), qt = () => {
    try {
      rt(Jn(d), `${en(d.project.name)}.episode.json`);
    } catch (x) {
      xe(String(x), "error");
    }
  }, wt = () => {
    const x = Wn(d);
    rt(x, `${en(x.library.name)}.assets.json`);
  }, lt = async (x, I = "auto") => {
    if (!le)
      try {
        const F = JSON.parse(await x.text()), q = F == null ? void 0 : F.format;
        if (I === "assets" || q === "theodore-assets") {
          let W;
          q === "theodore-assets" ? (Gr(F), W = F) : (Zt(F), W = Wn(ft(F)));
          const J = ni(d, W);
          f(J.plan), N("assets"), xe(u(`已导入素材库：新增 ${J.added} 项，更新 ${J.updated} 项，沿用 ${J.keptPaths.length} 个已上传文件。分镜保持原样。`, `Library imported: ${J.added} added, ${J.updated} updated, ${J.keptPaths.length} uploaded files kept. Shots preserved.`));
        } else if (I === "episode" || q === "theodore-episode") {
          let W;
          q === "theodore-episode" ? (bn(F), W = F) : (Zt(F), W = Jn(ft(F)));
          const J = ri(d, W);
          f(J.plan), w(0), N("shots"), xe(u(`已导入 ${J.plan.shots.length} 个分镜，保留素材库 ${J.keptPaths.length} 个已上传文件${J.missingAssets.length ? `；待补素材：${J.missingAssets.join("、")}` : ""}。点“保存”写入工作流。`, `Imported ${J.plan.shots.length} shots; ${J.keptPaths.length} uploaded assets kept${J.missingAssets.length ? `; missing: ${J.missingAssets.join(", ")}` : ""}. Click Save.`));
        } else {
          Zt(F);
          const W = Ur(d, F);
          f(W.plan), w(0), N("shots"), xe(u(`已导入 ${W.plan.shots.length} 个镜头，沿用 ${W.keptPaths.length} 个已上传素材。点“保存”写入工作流。`, `Imported ${W.plan.shots.length} shots; kept ${W.keptPaths.length} uploaded assets. Click Save.`));
        }
        oe(!1);
      } catch (F) {
        xe(`${u("导入失败", "Import failed")}：${F instanceof Error ? F.message : String(F)}`, "error");
      }
  }, yt = (x) => {
    const I = Jo(b.current, x);
    return I.length ? (window.alert(`${u("计划未通过校验，请先修正", "Plan validation failed")}：

${I.slice(0, 20).join(`
`)}${I.length > 20 ? `
…` : ""}`), !1) : !0;
  }, ct = (x) => {
    b.current = x, f(x), ye(x);
  }, ot = async (x, I) => {
    var ze;
    if (!l) {
      xe(u("当前环境无法排队（未连接 ComfyUI）", "Queue unavailable"), "error");
      return;
    }
    if (le || !x.length) return;
    const F = b.current, q = Pi(F, x);
    let W = F.shots.filter((re) => x.includes(re.id)).map((re) => re.id), J = new Set(I ? W : []);
    if (q.added.length) {
      const re = q.added.map((Se) => {
        var Qe;
        return ((Qe = F.shots.find((Be) => Be.id === Se)) == null ? void 0 : Qe.title) ?? Se;
      }).join("、");
      window.confirm(u(
        `接力段需要的上一段 latent 不是当前顺序下生成的（插入、删除、禁用或调换过镜头后会这样）。

建议连同上一段一起生成：${re}

点“确定”一起生成（推荐，上一段会换种子重生）；点“取消”只生成所选镜头，接缝可能不衔接。`,
        `Relay shots would read a latent not written by their current previous shot. Also regenerate: ${re}?`
      )) && (W = q.shotIds, J = /* @__PURE__ */ new Set([...J, ...q.added]));
    }
    if (!yt(W)) return;
    const ie = Ye(F);
    for (const re of J) {
      const Ae = ie.shots.find((Se) => Se.id === re);
      Ae && (Ae.seed = Yr());
    }
    ie.pipeline = { phase: "first_pass", firstPassConfirmed: !1, secondPassMode: "super_resolution_second_pass", ...ie.pipeline, latentWriters: ((ze = ie.pipeline) == null ? void 0 : ze.latentWriters) ?? {} };
    const De = new Map(W.map((re) => [re, Kr(ie, ie.shots.find((Ae) => Ae.id === re))])), He = new Map(W.map((re) => [re, Ii(ie, re)])), _e = new Set(W.filter((re) => xt(ie, ie.shots.find((Ae) => Ae.id === re)))), Te = /* @__PURE__ */ new Map();
    ct(ie);
    const Ke = new AbortController();
    B.current = Ke, V({ kind: "first", total: W.length, done: 0, progress: { value: 0, max: 0 }, message: "" });
    try {
      await l({
        plan: ie,
        shotIds: W,
        signal: Ke.signal,
        onProgress: (re) => V((Ae) => ({ ...Ae, progress: re })),
        onShotStart: (re, Ae) => {
          var Qe, Be;
          const Se = (Be = (Qe = b.current.pipeline) == null ? void 0 : Qe.latentWriters) == null ? void 0 : Be[String(Nt(ie, re))];
          Te.set(re, { at: Date.now() / 1e3, source: (Se == null ? void 0 : Se.shotId) ?? null, sourceAt: (Se == null ? void 0 : Se.at) ?? null }), V((kt) => ({ ...kt, currentShotId: re, done: Ae, progress: { value: 0, max: 0 } }));
        },
        onShotDone: (re, Ae) => {
          var kt, In;
          const Se = Ye(b.current), Qe = Date.now() / 1e3, Be = Se.shots.find((We) => We.id === re);
          if (Be) {
            const We = ((kt = Be.review) == null ? void 0 : kt.relayHistory) ?? [], Pn = Te.get(re);
            Be.review = {
              status: "pending",
              generatedSig: De.get(re),
              updatedAt: Date.now(),
              relayHistory: _e.has(re) && Pn ? [...We, Pn].slice(-20) : We
            };
          }
          Se.pipeline = { phase: "first_pass", firstPassConfirmed: !1, secondPassMode: "super_resolution_second_pass", ...Se.pipeline, latentWriters: { ...(In = Se.pipeline) == null ? void 0 : In.latentWriters, [String(He.get(re) ?? 0)]: { shotId: re, at: Qe } } }, ct(Se), V((We) => ({ ...We, done: Ae + 1 })), T((We) => We + 1);
        }
      }), V({ ...Je, message: u(`一采完成：${W.length} 段。请在“审片”页逐段确认。`, `First pass done: ${W.length} shots.`) }), xe(u(`一采完成 ${W.length} 段`, `First pass done (${W.length})`)), N("review");
    } catch (re) {
      V({ ...Je, error: dr(re) ? u("已停止", "Stopped") : String(re instanceof Error ? re.message : re) });
    } finally {
      B.current = null, T((re) => re + 1);
    }
  }, _t = async (x, I) => {
    var De, He;
    if (!a || le) return;
    const F = ((De = d.pipeline) == null ? void 0 : De.secondPassMode) ?? "super_resolution_second_pass", q = ((He = d.pipeline) == null ? void 0 : He.secondPassDenoise) ?? 0.3, W = x.flatMap((_e) => {
      const Te = d.shots.find((re) => re.id === _e), Ke = ne.byShot[_e] ?? [], ze = Te ? tt(Te, Re(Ke)) : void 0;
      return !Te || !ze ? [] : I && gt(Ke, ze.path, F).length ? [] : [{ shot: Te, take: ze }];
    });
    if (!W.length) {
      xe(u("没有需要二采的镜头（已全部完成或缺少一采结果）", "Nothing to process"));
      return;
    }
    const J = new AbortController();
    B.current = J;
    const ie = `td_batch_${Date.now().toString(36)}`;
    V({ kind: "second", total: W.length, done: 0, progress: { value: 0, max: 0 }, message: "" });
    try {
      for (const [_e, { shot: Te, take: Ke }] of W.entries())
        V((ze) => ({ ...ze, currentShotId: Te.id, done: _e, progress: { value: 0, max: 0 } })), await a({
          plan: d,
          shotId: Te.id,
          sourcePath: Ke.path,
          requestId: `${ie}_${Te.id}`,
          processingMode: F,
          batchId: ie,
          sequenceIndex: _e,
          latentRelay: !!Te.latentRelay,
          phase: "second_pass",
          denoise: F === "super_resolution_only" ? void 0 : q,
          signal: J.signal,
          onProgress: (ze) => V((re) => ({ ...re, progress: ze }))
        }), V((ze) => ({ ...ze, done: _e + 1 })), T((ze) => ze + 1);
      at({ phase: "second_pass", firstPassConfirmed: !0 }), V({ ...Je, message: u(`二采完成：${W.length} 段`, `Second pass done: ${W.length}`) }), xe(u(`二采完成 ${W.length} 段`, `Second pass done (${W.length})`));
    } catch (_e) {
      V({ ...Je, error: dr(_e) ? u("已停止", "Stopped") : String(_e instanceof Error ? _e.message : _e) });
    } finally {
      B.current = null, T((_e) => _e + 1);
    }
  }, A = async (x) => {
    var W;
    if (le) return;
    const I = d.shots.filter((J) => J.enabled), F = [], q = [];
    for (const J of I) {
      const ie = ne.byShot[J.id] ?? [], De = x ? Wr(J, ie) : void 0, He = tt(J, Re(ie)), _e = x ? De != null && De.processed ? De.item.path : "" : (He == null ? void 0 : He.path) ?? "";
      _e ? F.push({ shotId: J.id, activeIndex: Nt(d, J.id), path: _e }) : q.push(J.title);
    }
    if (q.length) {
      xe(`${u("以下镜头缺少可合并的结果", "Missing results")}：${q.join("、")}`, "error");
      return;
    }
    V({ kind: "merge", total: 1, done: 0, progress: { value: 0, max: 0 }, message: "" });
    try {
      const J = await fetch("/theodore-director/v1/postprocess/merge", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ projectName: d.project.name, runId: d.project.runId, selections: F }) }), ie = await J.json();
      if (!J.ok) throw new Error(ie.error || `HTTP ${J.status}`);
      V({ ...Je, message: `${u("已合并", "Merged")}：${((W = ie.result) == null ? void 0 : W.path) ?? ""}` }), xe(u("合并完成，可在“后处理 → 合并视频”查看", "Merged; see Post-process → Merge"));
    } catch (J) {
      V({ ...Je, error: String(J instanceof Error ? J.message : J) });
    }
  }, se = () => {
    var x;
    return (x = B.current) == null ? void 0 : x.abort();
  };
  Pe(() => {
    const x = (I) => {
      if ((I.ctrlKey || I.metaKey) && I.key.toLocaleLowerCase() === "s") {
        I.preventDefault(), I.stopPropagation(), dt();
        return;
      }
      if (I.key !== "Escape" || I.defaultPrevented) return;
      const F = I.target;
      if (F && /^(TEXTAREA|INPUT|SELECT)$/.test(F.tagName)) {
        F.blur();
        return;
      }
      if (y) return;
      if (te) {
        X(!1);
        return;
      }
      const q = document.querySelector("#theodore-director-modal .td-post-preview-overlay");
      if (q) {
        q.click();
        return;
      }
      if (O) {
        U(!1);
        return;
      }
      P || vt();
    };
    return document.addEventListener("keydown", x, !0), () => document.removeEventListener("keydown", x, !0);
  });
  const de = () => {
    v(Ye(d.shots)), U(!0);
  }, fe = () => {
    const x = Number(K);
    if (!Number.isFinite(x) || x <= 0) {
      window.alert(u("统一时长必须大于 0 秒", "The shared duration must be greater than 0 seconds."));
      return;
    }
    v((I) => I.map((F) => ({ ...F, durationSeconds: x })));
  }, $e = () => {
    const x = Number(Q), I = Number(pe);
    if (!Number.isInteger(x) || x < 1 || x > 100) {
      window.alert(u("新增镜头数量必须是 1–100 的整数", "The shot count must be an integer from 1 to 100."));
      return;
    }
    if (!Number.isFinite(I) || I <= 0) {
      window.alert(u("新增镜头时长必须大于 0 秒", "The new-shot duration must be greater than 0 seconds."));
      return;
    }
    v((F) => Zr(F, x, I, ln, b.current.defaults.secondSamplingMode ?? "off").map((q, W) => W >= F.length ? { ...q, latentRelay: !1 } : q));
  }, he = () => {
    if (M.some((x) => !Number.isFinite(x.durationSeconds) || x.durationSeconds <= 0)) {
      window.alert(u("每个镜头的时长都必须大于 0 秒", "Every shot duration must be greater than 0 seconds."));
      return;
    }
    ae((x) => {
      x.shots = Ye(M);
    }), w((x) => Math.min(x, M.length - 1)), U(!1);
  }, ge = d.shots.filter((x) => x.enabled), Ee = ge.filter((x) => Re(ne.byShot[x.id] ?? []).length).length, pt = ge.filter((x) => {
    var I;
    return ((I = x.review) == null ? void 0 : I.status) === "approved";
  }).length, yn = ge.reduce((x, I) => x + I.durationSeconds, 0), co = L.progress.max ? Math.round(L.progress.value / L.progress.max * 100) : 0, _n = [
    { id: "assets", number: "01", title: u("素材库", "Media library"), description: u("角色 · 场景 · 声音", "Cast · sets · voices"), badge: be ? String(be) : void 0 },
    { id: "shots", number: "02", title: u("分镜工作台", "Storyboard"), description: u("写镜头，安排连续性", "Compose each shot") },
    { id: "review", number: "03", title: u("生成与审片", "Generate & review"), description: u("挑选结果，确认成片", "Choose your takes"), badge: `${pt}/${ge.length}` },
    { id: "postprocess", number: "04", title: u("后处理与交付", "Finish & deliver"), description: u("高清处理 · 合并导出", "Enhance · assemble") },
    { id: "settings", number: "05", title: u("项目配置", "Project settings"), description: u("默认参数与全局提示词", "Defaults & global prompts") }
  ], Kt = _n.find((x) => x.id === _);
  return /* @__PURE__ */ n("div", { class: `td-shell ${(kn = d.uiPreferences) != null && kn.compactMode ? "td-compact" : ""}`, lang: z === "zh" ? "zh-CN" : "en", children: [
    /* @__PURE__ */ n("aside", { class: "td-workspace-rail", children: [
      /* @__PURE__ */ n("div", { class: "td-rail-brand", children: [
        /* @__PURE__ */ n("span", { class: "td-brand-mark", children: "YQ" }),
        /* @__PURE__ */ n("div", { children: [
          /* @__PURE__ */ n("h1", { children: Bn(z, "title") }),
          /* @__PURE__ */ n("small", { children: "MINIMAX H3 · STUDIO" })
        ] })
      ] }),
      /* @__PURE__ */ n("button", { class: "td-project-home", onClick: () => N("settings"), title: d.project.name, children: [
        /* @__PURE__ */ n("small", { children: u("当前项目", "CURRENT PROJECT") }),
        /* @__PURE__ */ n("strong", { children: d.project.name }),
        /* @__PURE__ */ n("span", { children: d.project.runId })
      ] }),
      /* @__PURE__ */ n("nav", { class: "td-stage-nav", "aria-label": u("制作阶段", "Production stages"), children: _n.map((x) => /* @__PURE__ */ n("button", { class: _ === x.id ? "active" : "", "aria-label": x.title, title: x.title, "aria-current": _ === x.id ? "page" : void 0, onClick: () => N(x.id), children: [
        /* @__PURE__ */ n("span", { class: "td-stage-number", children: x.number }),
        /* @__PURE__ */ n("span", { children: [
          /* @__PURE__ */ n("strong", { children: x.title }),
          /* @__PURE__ */ n("small", { children: x.description })
        ] }),
        x.badge && /* @__PURE__ */ n("em", { class: x.id === "assets" ? "warn" : "", children: x.badge })
      ] }, x.id)) }),
      /* @__PURE__ */ n("div", { class: "td-rail-progress", children: [
        /* @__PURE__ */ n("div", { children: [
          /* @__PURE__ */ n("span", { children: u("本集进度", "EPISODE PROGRESS") }),
          /* @__PURE__ */ n("strong", { children: [
            pt,
            "/",
            ge.length
          ] })
        ] }),
        /* @__PURE__ */ n("progress", { max: Math.max(1, ge.length), value: pt }),
        /* @__PURE__ */ n("p", { children: u(`已生成 ${Ee} 段 · ${Lt(yn)}`, `${Ee} generated · ${Lt(yn)}`) }),
        /* @__PURE__ */ n("button", { onClick: () => N(be ? "assets" : "review"), children: be ? u(`补齐 ${be} 个素材`, `Fill ${be} media files`) : u("查看审片进度 →", "Review progress →") })
      ] })
    ] }),
    /* @__PURE__ */ n("header", { class: "td-topbar", children: [
      /* @__PURE__ */ n("div", { class: "td-workspace-title", children: [
        /* @__PURE__ */ n("span", { class: "td-eyebrow", children: [
          u("制作空间", "PRODUCTION SPACE"),
          " / ",
          Kt.number
        ] }),
        /* @__PURE__ */ n("div", { children: [
          /* @__PURE__ */ n("h2", { children: Kt.title }),
          Y ? /* @__PURE__ */ n("span", { class: "td-chip warn", children: u("未保存", "Unsaved") }) : /* @__PURE__ */ n("span", { class: "td-chip", children: u("已保存", "Saved") })
        ] })
      ] }),
      /* @__PURE__ */ n("div", { class: "td-actions", children: [
        /* @__PURE__ */ n("details", { class: "td-project-menu", children: [
          /* @__PURE__ */ n("summary", { children: [
            u("导入 / 导出", "Import / export"),
            " ",
            /* @__PURE__ */ n("span", { children: "⌄" })
          ] }),
          /* @__PURE__ */ n("div", { class: "td-project-menu-items", children: [
            /* @__PURE__ */ n("label", { class: "td-button", title: u("只更新本集分镜与提示词，保留整个素材库", "Import episode shots and preserve the media library"), children: [
              u("导入分镜", "Import shots"),
              /* @__PURE__ */ n("input", { type: "file", accept: "application/json,.json", disabled: le, onChange: (x) => {
                var q;
                const I = x.currentTarget, F = (q = I.files) == null ? void 0 : q[0];
                I.value = "", F && lt(F, "episode");
              } })
            ] }),
            /* @__PURE__ */ n("button", { onClick: qt, children: u("导出分镜", "Export shots") }),
            /* @__PURE__ */ n("label", { class: "td-button", title: u("导入 skill 生成的 .director.json；同名素材会沿用已上传文件", "Import a .director.json"), children: [
              u("导入计划", "Import"),
              /* @__PURE__ */ n("input", { type: "file", accept: "application/json,.json", disabled: le, onChange: (x) => {
                var q;
                const I = x.currentTarget, F = (q = I.files) == null ? void 0 : q[0];
                I.value = "", F && lt(F);
              } })
            ] }),
            /* @__PURE__ */ n("button", { onClick: Jt, children: u("导出计划", "Export") })
          ] })
        ] }),
        /* @__PURE__ */ n("button", { class: "td-lang", title: u("切换语言", "Language"), onClick: () => Me(z === "zh" ? "en" : "zh"), children: z === "zh" ? "EN" : "中文" }),
        /* @__PURE__ */ n("button", { class: "primary", title: "Ctrl+S", onClick: dt, children: u("保存项目", "Save project") }),
        /* @__PURE__ */ n("button", { onClick: vt, children: Bn(z, "close") })
      ] })
    ] }),
    /* @__PURE__ */ n("section", { class: "td-session-bar", "aria-label": u("生成状态", "Generation status"), children: [
      /* @__PURE__ */ n("span", { class: "td-session-context", children: _ === "shots" ? u("编辑镜头 → 右侧监看 → 底部切换分镜", "Compose → monitor → switch shots below") : Kt.description }),
      /* @__PURE__ */ n("div", { class: "td-tab-status", "aria-live": "polite", children: [
        le ? /* @__PURE__ */ n("span", { class: "td-run-pill", children: [
          /* @__PURE__ */ n("i", {}),
          L.kind === "first" ? u("一采", "1st pass") : L.kind === "second" ? u("二采", "2nd pass") : L.kind === "image" ? u("生图", "Image") : u("合并", "Merge"),
          " ",
          L.done,
          "/",
          L.total,
          L.kind !== "merge" && L.progress.max ? ` · ${co}%` : "",
          /* @__PURE__ */ n("button", { onClick: se, children: u("停止", "Stop") })
        ] }) : /* @__PURE__ */ n("span", { class: "td-progress-text", children: u(`一采 ${Ee}/${ge.length} · 通过 ${pt}/${ge.length}`, `Generated ${Ee}/${ge.length} · Approved ${pt}/${ge.length}`) }),
        !le && !ne.loading && l && Ee < ge.length && /* @__PURE__ */ n("button", { class: "primary", onClick: () => void ot(ge.filter((x) => !Re(ne.byShot[x.id] ?? []).length).map((x) => x.id), !1), children: u(`开始一采（${ge.length - Ee} 段）`, `Start first pass (${ge.length - Ee})`) })
      ] })
    ] }),
    /* @__PURE__ */ n("main", { children: [
      _ === "shots" && /* @__PURE__ */ n(Vi, { plan: d, language: z, selected: k, setSelected: w, mutate: ae, setReview: nt, results: ne, supportsSecondSampling: i, running: le, runningShotId: L.kind === "first" ? L.currentShotId : void 0, onRegenerate: (x) => void ot(x, !0), onOpenBatch: de, notify: xe }),
      _ === "assets" && /* @__PURE__ */ n($o, { plan: d, language: z, mutate: ae, uploadAsset: ar, importingDisabled: le || !!y || j, onImportLibrary: (x) => void lt(x, "assets"), onExportLibrary: wt, onOpenBatch: () => oe(!0), onGenerateImage: s ? D : void 0, onBatchGenerateImages: s ? () => {
        const x = Ot(b.current.assets)[0];
        if (!x) {
          xe(u("请先添加已启用且填写了生图提示词的图片素材。", "Add enabled image assets with generation prompts first."), "error");
          return;
        }
        D(x), H(!0);
      } : void 0, notify: xe }),
      _ === "review" && /* @__PURE__ */ n(Ti, { plan: d, language: z, results: ne, run: L, supportsSecondPass: !!a, setReview: nt, setPipeline: at, onRunFirstPass: (x, I) => void ot(x, I), onRunSecondPass: (x, I) => void _t(x, I), onMerge: (x) => void A(x), onStop: se, onRefresh: () => T((x) => x + 1), onOpenShot: (x) => {
        w(Math.max(0, d.shots.findIndex((I) => I.id === x))), N("shots");
      } }),
      /* @__PURE__ */ n("section", { class: "td-form settings", style: _ === "settings" ? void 0 : { display: "none" }, children: [
        /* @__PURE__ */ n("h2", { children: u("项目", "Project") }),
        /* @__PURE__ */ n("div", { class: "td-settings-grid", children: [
          /* @__PURE__ */ n("label", { children: [
            u("项目名（决定输出目录）", "Project name"),
            /* @__PURE__ */ n("input", { value: d.project.name, onInput: (x) => ae((I) => {
              I.project.name = x.currentTarget.value;
            }) })
          ] }),
          /* @__PURE__ */ n("label", { children: [
            "Run ID",
            /* @__PURE__ */ n("input", { value: d.project.runId, onInput: (x) => ae((I) => {
              I.project.runId = x.currentTarget.value;
            }) })
          ] }),
          /* @__PURE__ */ n("label", { children: [
            "FPS",
            /* @__PURE__ */ n("input", { type: "number", min: "1", step: "1", value: d.defaults.fps, onInput: (x) => ae((I) => {
              I.defaults.fps = Number(x.currentTarget.value);
            }) })
          ] }),
          /* @__PURE__ */ n("label", { children: [
            u("基础种子", "Base seed"),
            /* @__PURE__ */ n("input", { type: "number", value: d.defaults.baseSeed, onInput: (x) => ae((I) => {
              I.defaults.baseSeed = Number(x.currentTarget.value);
            }) })
          ] }),
          /* @__PURE__ */ n("label", { children: [
            u("新分镜默认时长", "Default shot duration"),
            /* @__PURE__ */ n("input", { type: "number", min: "0.1", step: "0.1", value: d.defaults.durationSeconds ?? 6, onInput: (x) => ae((I) => {
              I.defaults.durationSeconds = Math.max(0.1, Number(x.currentTarget.value) || 6), Z(x.currentTarget.value), E(x.currentTarget.value);
            }) })
          ] }),
          /* @__PURE__ */ n("label", { children: [
            u("新分镜默认处理", "Default processing"),
            /* @__PURE__ */ n("select", { value: d.defaults.secondSamplingMode ?? "off", onChange: (x) => ae((I) => {
              I.defaults.secondSamplingMode = x.currentTarget.value;
            }), children: [
              /* @__PURE__ */ n("option", { value: "off", children: u("关闭二采", "Off") }),
              /* @__PURE__ */ n("option", { value: "super_resolution_second_pass", children: u("超分二采", "Super-resolution 2nd pass") }),
              /* @__PURE__ */ n("option", { value: "latent_upscale_second_pass", children: u("Latent 二采", "Latent 2nd pass") }),
              /* @__PURE__ */ n("option", { value: "super_resolution_only", children: u("只超分", "Super-resolution only") })
            ] })
          ] }),
          /* @__PURE__ */ n("label", { class: "td-setting-check", children: [
            /* @__PURE__ */ n("span", { children: u("网页偏好", "Web preferences") }),
            /* @__PURE__ */ n("span", { children: [
              /* @__PURE__ */ n("input", { type: "checkbox", checked: ((Sn = d.uiPreferences) == null ? void 0 : Sn.autoSave) ?? !1, onChange: (x) => ae((I) => {
                I.uiPreferences = { ...I.uiPreferences, autoSave: x.currentTarget.checked };
              }) }),
              u("编辑后自动保存到工作流", "Auto-save edits to workflow")
            ] })
          ] }),
          /* @__PURE__ */ n("label", { class: "td-setting-check", children: [
            /* @__PURE__ */ n("span", { children: u("紧凑布局", "Compact layout") }),
            /* @__PURE__ */ n("span", { children: [
              /* @__PURE__ */ n("input", { type: "checkbox", checked: (($n = d.uiPreferences) == null ? void 0 : $n.compactMode) ?? !1, onChange: (x) => ae((I) => {
                I.uiPreferences = { ...I.uiPreferences, compactMode: x.currentTarget.checked };
              }) }),
              u("减少面板间距", "Reduce panel spacing")
            ] })
          ] })
        ] }),
        /* @__PURE__ */ n("p", { class: "td-hint", children: u("修改项目名或 Run ID 会切换到另一个输出目录，已有结果不会被移动。", "Changing the project name or Run ID switches the output folder.") }),
        /* @__PURE__ */ n("label", { children: [
          u("全局提示词前缀（每段都会自动加在最前面，只放全片通用内容）", "Global prompt prefix"),
          /* @__PURE__ */ n(dn, { value: d.promptPrefix, isReferenceValid: (x) => Hn(d, x), onInput: (x) => ae((I) => {
            I.promptPrefix = x.currentTarget.value;
          }) })
        ] }),
        /* @__PURE__ */ n("label", { children: [
          u("全局提示词后缀", "Global prompt suffix"),
          /* @__PURE__ */ n(dn, { value: d.promptSuffix, isReferenceValid: (x) => Hn(d, x), onInput: (x) => ae((I) => {
            I.promptSuffix = x.currentTarget.value;
          }) })
        ] }),
        /* @__PURE__ */ n("label", { children: [
          u("项目备注（风格/人物/场景锁定块等，仅供参考，不发送给模型）", "Project notes"),
          /* @__PURE__ */ n("textarea", { rows: 8, value: d.project.notes ?? "", onInput: (x) => ae((I) => {
            I.project.notes = x.currentTarget.value;
          }) })
        ] }),
        m && /* @__PURE__ */ n(cs, { controller: m, language: z, busy: le, notify: xe }),
        /* @__PURE__ */ n(ps, { language: z, projectName: d.project.name, runId: d.project.runId, busy: le, onClearShots: async (x) => {
          x && await as(d.project.name, d.project.runId), ae((I) => {
            I.shots = Li(I.defaults.durationSeconds ?? 6, ln, I.defaults.secondSamplingMode ?? "off");
          }), w(0), v([]), T((I) => I + 1);
        }, onClearAssets: () => {
          ae((x) => {
            const I = Wo(x);
            x.assets = I.assets, x.shots = I.shots;
          });
        }, onProjectCleared: () => T((x) => x + 1) })
      ] }),
      _ === "postprocess" && /* @__PURE__ */ n(ki, { plan: d, language: z, queueSecondPass: a })
    ] }),
    O && /* @__PURE__ */ n("div", { class: "td-batch-overlay", role: "presentation", children: /* @__PURE__ */ n("section", { class: "td-batch-panel", role: "dialog", "aria-modal": "true", "aria-label": u("批量编辑镜头", "Batch edit shots"), children: [
      /* @__PURE__ */ n("header", { class: "td-batch-header", children: [
        /* @__PURE__ */ n("div", { children: [
          /* @__PURE__ */ n("h2", { children: u("批量编辑镜头", "Batch edit shots") }),
          /* @__PURE__ */ n("p", { children: u(`当前共 ${M.length} 个镜头`, `${M.length} shots`) })
        ] }),
        /* @__PURE__ */ n("button", { "aria-label": u("关闭", "Close"), onClick: () => U(!1), children: "×" })
      ] }),
      /* @__PURE__ */ n("div", { class: "td-batch-tools", children: [
        /* @__PURE__ */ n("div", { children: [
          /* @__PURE__ */ n("label", { children: [
            u("所有镜头时长", "Duration for all shots"),
            /* @__PURE__ */ n("span", { children: [
              /* @__PURE__ */ n("input", { type: "number", min: "0.1", step: "0.1", value: K, onInput: (x) => Z(x.currentTarget.value) }),
              /* @__PURE__ */ n("em", { children: u("秒", "sec") })
            ] })
          ] }),
          /* @__PURE__ */ n("button", { onClick: fe, children: u("一键设置所有时长", "Set all durations") })
        ] }),
        /* @__PURE__ */ n("div", { children: [
          /* @__PURE__ */ n("label", { children: [
            u("新增镜头数量", "New shot count"),
            /* @__PURE__ */ n("input", { type: "number", min: "1", max: "100", step: "1", value: Q, onInput: (x) => ee(x.currentTarget.value) })
          ] }),
          /* @__PURE__ */ n("label", { children: [
            u("每个镜头时长", "Duration per shot"),
            /* @__PURE__ */ n("span", { children: [
              /* @__PURE__ */ n("input", { type: "number", min: "0.1", step: "0.1", value: pe, onInput: (x) => E(x.currentTarget.value) }),
              /* @__PURE__ */ n("em", { children: u("秒", "sec") })
            ] })
          ] }),
          /* @__PURE__ */ n("button", { onClick: $e, children: u("批量新增镜头", "Add shots") })
        ] })
      ] }),
      /* @__PURE__ */ n("div", { class: "td-batch-global-actions", children: [
        /* @__PURE__ */ n("span", { children: u(`已启用 ${M.filter((x) => x.enabled).length}/${M.length} 个镜头`, `${M.filter((x) => x.enabled).length}/${M.length} shots enabled`) }),
        /* @__PURE__ */ n("button", { class: ce ? "active" : "", onClick: () => v((x) => x.map((I) => ({ ...I, enabled: !ce }))), children: ce ? u("全部禁用", "Disable all") : u("全部启用", "Enable all") })
      ] }),
      /* @__PURE__ */ n("div", { class: "td-batch-table", children: [
        /* @__PURE__ */ n("div", { class: "td-batch-row td-batch-table-head", children: [
          /* @__PURE__ */ n("span", { children: "#" }),
          /* @__PURE__ */ n("span", { children: u("镜头名", "Shot name") }),
          /* @__PURE__ */ n("span", { children: u("启用", "Enabled") }),
          /* @__PURE__ */ n("span", { children: u("具体时长", "Duration") }),
          /* @__PURE__ */ n("span", { children: u("接力上一段", "Relay") })
        ] }),
        M.map((x, I) => /* @__PURE__ */ n("div", { class: "td-batch-row", children: [
          /* @__PURE__ */ n("span", { children: I + 1 }),
          /* @__PURE__ */ n("input", { value: x.title, "aria-label": `${u("镜头名", "Shot name")} ${I + 1}`, onInput: (F) => v((q) => q.map((W, J) => J === I ? { ...W, title: F.currentTarget.value } : W)) }),
          /* @__PURE__ */ n("label", { class: "td-batch-enabled", children: [
            /* @__PURE__ */ n("input", { type: "checkbox", checked: x.enabled, onChange: (F) => v((q) => q.map((W, J) => J === I ? { ...W, enabled: F.currentTarget.checked } : W)) }),
            /* @__PURE__ */ n("span", { children: x.enabled ? u("开", "ON") : u("关", "OFF") })
          ] }),
          /* @__PURE__ */ n("label", { class: "td-batch-duration", children: [
            /* @__PURE__ */ n("input", { type: "number", min: "0.1", step: "0.1", value: x.durationSeconds, onInput: (F) => v((q) => q.map((W, J) => J === I ? { ...W, durationSeconds: Number(F.currentTarget.value) } : W)) }),
            /* @__PURE__ */ n("span", { children: u("秒", "sec") })
          ] }),
          /* @__PURE__ */ n("label", { class: "td-batch-relay", children: [
            /* @__PURE__ */ n("input", { type: "checkbox", checked: x.latentRelay, onChange: (F) => v((q) => q.map((W, J) => J === I ? { ...W, latentRelay: F.currentTarget.checked } : W)) }),
            /* @__PURE__ */ n("span", { children: x.latentRelay ? u("开", "ON") : u("关", "OFF") })
          ] })
        ] }, x.id))
      ] }),
      /* @__PURE__ */ n("footer", { children: [
        /* @__PURE__ */ n("button", { onClick: () => U(!1), children: u("取消", "Cancel") }),
        /* @__PURE__ */ n("button", { class: "primary", onClick: he, children: u("应用更改", "Apply changes") })
      ] })
    ] }) }),
    P && /* @__PURE__ */ n(Uo, { language: z, assets: d.assets, projectName: d.project.name, uploadFile: ar, onImported: (x) => ae((I) => {
      I.assets.push(...x);
    }), onFilled: (x, I, F) => ae((q) => {
      const W = q.assets.find((J) => J.id === x);
      W && Object.assign(W, To(W, I, F));
    }), onClose: () => oe(!1) }),
    y && s && /* @__PURE__ */ n(
      is,
      {
        asset: d.assets.find((x) => x.id === y.id) ?? y,
        batchAssets: j ? d.assets : void 0,
        projectName: d.project.name,
        language: z,
        defaults: s.defaults,
        queue: s.queue,
        recover: s.recover,
        running: L.kind === "image",
        progress: L.progress,
        register: s.register,
        onPending: (x, I) => Ne(x, (F) => {
          I ? F.imageGenerationPending = I : delete F.imageGenerationPending;
        }),
        onRecord: (x, I) => Ne(x, (F) => {
          F.imageGeneration && F.imageGeneration.promptId !== I.promptId && (F.imageGenerationHistory = [...F.imageGenerationHistory ?? [], F.imageGeneration].slice(-20)), F.imageGeneration = I;
        }),
        onPromptChange: (x, I) => Ne(x, (F) => {
          F.genPrompt = I;
        }),
        onStart: (x) => {
          B.current = x, V({ kind: "image", total: 1, done: 0, progress: { value: 0, max: 0 }, message: "" });
        },
        onProgress: (x) => V((I) => ({ ...I, progress: x })),
        onFinish: (x) => {
          B.current === x && (B.current = null), V((I) => I.kind === "image" ? { ...Je } : I);
        },
        onApply: async (x, I, F, q) => {
          const W = b.current.assets.find((ie) => ie.id === x);
          Ne(x, (ie) => {
            ie.path = I, ie.genPrompt = F, ie.fingerprint = "", ie.imageGeneration = q, delete ie.imageGenerationPending, delete ie.imageGenerationHistory;
          });
          const J = W ? ss(b.current, [], { assetId: x, oldPath: W.path, oldGeneration: W.imageGeneration, oldGenerations: W.imageGenerationHistory }) : { candidates: [], keep: [] };
          try {
            const ie = await ds(d.project.name, J);
            ie.deleted.length ? xe(u(`已替换素材并清理 ${ie.deleted.length} 个旧资源`, `Replaced asset and removed ${ie.deleted.length} old resources`)) : xe(u("已将生图绑定到当前素材", "Generated image assigned to the asset"));
          } catch (ie) {
            xe(`${u("新图已绑定，但旧资源清理失败", "New image assigned, but old-resource cleanup failed")}：${ie instanceof Error ? ie.message : String(ie)}`, "error");
          }
        },
        onCreateAsset: (x, I, F, q, W) => {
          const J = Ye(b.current);
          J.assets.push(ts(x, I, F, J.assets, W)), b.current = J, f(J), ye(J), xe(u("已登记为新素材", "Generated image added as a new asset"));
        },
        onStop: se,
        onClose: () => {
          L.kind !== "image" && (D(null), H(!1));
        }
      },
      j ? "batch-images" : y.id
    ),
    te && /* @__PURE__ */ n("div", { class: "td-batch-overlay", role: "presentation", children: /* @__PURE__ */ n("section", { class: "td-confirm", role: "dialog", "aria-modal": "true", children: [
      /* @__PURE__ */ n("h2", { children: u("有未保存的修改", "Unsaved changes") }),
      /* @__PURE__ */ n("p", { children: u("关闭前要把修改保存到工作流吗？", "Save changes to the workflow before closing?") }),
      /* @__PURE__ */ n("footer", { children: [
        /* @__PURE__ */ n("button", { onClick: () => X(!1), children: u("取消", "Cancel") }),
        /* @__PURE__ */ n("button", { class: "danger", onClick: () => {
          X(!1), o();
        }, children: u("不保存，直接关闭", "Discard") }),
        /* @__PURE__ */ n("button", { class: "primary", onClick: () => {
          ye(d), X(!1), o();
        }, children: u("保存并关闭", "Save & close") })
      ] })
    ] }) }),
    /* @__PURE__ */ n("div", { class: "td-toasts", "aria-live": "polite", children: C.map((x) => /* @__PURE__ */ n("div", { class: `td-toast ${x.tone}`, children: x.message }, x.id)) })
  ] });
}
function hs(e, t, r = !1, o, i, a, l, s) {
  const m = document.getElementById("theodore-director-modal");
  if (m) {
    m.focus();
    return;
  }
  const h = document.createElement("div");
  h.id = "theodore-director-modal", h.className = "td-modal", h.tabIndex = -1, document.body.append(h);
  const d = () => {
    Tn(null, h), h.remove();
  };
  h.addEventListener("keydown", (f) => f.stopPropagation()), Tn(/* @__PURE__ */ n(us, { initial: e, onSave: t, onPersist: a, onClose: d, supportsSecondSampling: r, queueSecondPass: o, queueFirstPass: i, imageGeneration: l, workflowSettings: s }), h), h.focus();
}
function Ut(e) {
  return Array.isArray(e) && e.length === 2 && (typeof e[0] == "string" || typeof e[0] == "number") && typeof e[1] == "number";
}
function Et(e) {
  return Ut(e) ? String(e[0]) : null;
}
function wn(e, t) {
  return Object.keys(e).filter((r) => {
    var o;
    return ((o = e[r]) == null ? void 0 : o.class_type) === t;
  });
}
function lr(e, t, r) {
  const o = wn(e, t);
  if (!o.length) throw new Error(`当前工作流缺少 ${r}（${t}）节点`);
  if (o.length > 1) throw new Error(`当前工作流存在多个 ${r}（${t}）节点，无法确定要控制哪一个`);
  return o[0];
}
function lo(e, t, r, o, i = 0) {
  const a = e[t];
  if (!a || i > 6) return !1;
  const l = a.inputs[r];
  if (typeof l == "number")
    return a.inputs[r] = o, !0;
  const s = Et(l);
  if (!s || !e[s]) return !1;
  const m = e[s];
  return typeof m.inputs.value == "number" || Ut(m.inputs.value) ? lo(e, s, "value", o, i + 1) : !1;
}
function ms(e, t) {
  const r = JSON.parse(JSON.stringify(e)), o = lr(r, "TheodoreDirector_Project", "Theodore 项目");
  r[o].inputs.plan_json = t.planJson;
  const i = lr(r, "TheodoreDirector_SelectShot", "Theodore 当前分镜"), a = r[i];
  if ("resume_mode" in a.inputs && (a.inputs.resume_mode = "fresh"), !lo(r, i, "queue_index", t.activeIndex))
    throw new Error("无法定位当前片段序号节点（SelectShot.queue_index 的上游整数）");
  for (const l of wn(r, "ImpactQueueTrigger"))
    r[l].inputs.mode = !1;
  return r;
}
function fs(e) {
  var i;
  const t = new Set(wn(e, "TheodoreDirector_PostprocessSecondPassSource"));
  if (!t.size) return [];
  const r = new Set(Object.keys(e).filter((a) => {
    const l = e[a];
    return l.class_type === "RandomNoise" && t.has(Et(l.inputs.noise_seed) ?? "");
  })), o = /* @__PURE__ */ new Set();
  for (const a of Object.keys(e)) {
    const l = e[a];
    if (l.class_type !== "SamplerCustomAdvanced" || !r.has(Et(l.inputs.noise) ?? "")) continue;
    const s = Et(l.inputs.sigmas);
    s && ((i = e[s]) == null ? void 0 : i.class_type) === "BasicScheduler" && o.add(s);
  }
  return [...o];
}
function gs(e, t) {
  const r = fs(e);
  for (const o of r) e[o].inputs.denoise = t;
  return r.length;
}
function bs(e, t) {
  var l, s;
  const r = JSON.parse(JSON.stringify(e));
  if (((l = r[t.sourceId]) == null ? void 0 : l.class_type) !== "TheodoreDirector_PostprocessSecondPassSource")
    throw new Error("无法序列化后处理二采源节点");
  if (((s = r[t.targetId]) == null ? void 0 : s.class_type) !== "TheodoreDirector_SaveSecondPass")
    throw new Error("无法序列化后处理二采保存节点");
  if (r[t.sourceId].inputs.request_json = t.requestJson, typeof t.denoise == "number" && t.processingMode !== "super_resolution_only" && !gs(r, t.denoise))
    throw new Error("当前工作流的后处理二采支流中找不到 BasicScheduler，无法设置重绘强度");
  const o = {
    8: "super_resolution_second_pass",
    9: "latent_upscale_second_pass",
    10: "super_resolution_only"
  };
  for (const m of Object.values(r)) {
    const h = m.inputs.cond;
    if (m.class_type !== "ImpactConditionalBranch" || !Ut(h) || String(h[0]) !== t.sourceId) continue;
    const d = o[h[1]];
    if (!d) continue;
    const f = t.processingMode === d, c = m.inputs[f ? "tt_value" : "ff_value"];
    if (c === void 0) throw new Error("后处理二采模式选择节点缺少输入");
    m.inputs = { cond: f, tt_value: c, ff_value: c };
  }
  const i = {}, a = [t.targetId];
  for (; a.length; ) {
    const m = a.pop();
    if (i[m]) continue;
    const h = r[m];
    if (!h) throw new Error(`后处理二采依赖节点 ${m} 不存在`);
    if (["TheodoreDirector_Project", "TheodoreDirector_SelectShot", "TheodoreDirector_CommitResult", "ImpactQueueTrigger", "ImpactSetWidgetValue"].includes(h.class_type))
      throw new Error(`后处理二采支流错误连接到主循环节点 ${m}（${h.class_type}）`);
    i[m] = h;
    for (const d of Object.values(h.inputs))
      Ut(d) && a.push(String(d[0]));
  }
  if (!i[t.sourceId]) throw new Error("后处理二采保存目标未连接到所选源节点");
  return i;
}
const xs = `{
  "id": "92112d97-bb64-4b44-86f2-ea5691ef8f6e",
  "revision": 0,
  "last_node_id": 27,
  "last_link_id": 51,
  "nodes": [
    {
      "id": 8,
      "type": "VAEDecode",
      "pos": [
        1209,
        188
      ],
      "size": [
        225,
        54
      ],
      "flags": {},
      "order": 9,
      "mode": 0,
      "inputs": [
        {
          "name": "samples",
          "type": "LATENT",
          "link": 51
        },
        {
          "name": "vae",
          "type": "VAE",
          "link": 45
        }
      ],
      "outputs": [
        {
          "name": "IMAGE",
          "type": "IMAGE",
          "slot_index": 0,
          "links": [
            16
          ]
        }
      ],
      "properties": {
        "Node name for S&R": "VAEDecode",
        "cnr_id": "comfy-core",
        "ver": "0.3.75"
      }
    },
    {
      "id": 9,
      "type": "SaveImage",
      "pos": [
        1454.93896484375,
        190.9700164794922
      ],
      "size": [
        976.046875,
        1060.96875
      ],
      "flags": {},
      "order": 10,
      "mode": 0,
      "inputs": [
        {
          "name": "images",
          "type": "IMAGE",
          "link": 16
        }
      ],
      "outputs": [
        {
          "name": "images",
          "type": "IMAGE",
          "links": null
        }
      ],
      "properties": {
        "Node name for S&R": "SaveImage",
        "cnr_id": "comfy-core",
        "ver": "0.3.75"
      },
      "widgets_values": [
        "ComfyUI"
      ],
      "widgets_values_named": {
        "filename_prefix": "ComfyUI"
      }
    },
    {
      "id": 15,
      "type": "Note",
      "pos": [
        71.95149993896484,
        192.96051025390625
      ],
      "size": [
        319.25,
        197.890625
      ],
      "flags": {},
      "order": 0,
      "mode": 0,
      "inputs": [],
      "outputs": [],
      "properties": {},
      "widgets_values": [
        "The \\"You are an assistant... <Prompt Start> \\" text before the actual prompt is the one used in the official example.\\n\\nThe reason it is exposed to the user like this is because the model still works if you modify or remove it."
      ],
      "widgets_values_named": {
        "text": "The \\"You are an assistant... <Prompt Start> \\" text before the actual prompt is the one used in the official example.\\n\\nThe reason it is exposed to the user like this is because the model still works if you modify or remove it."
      },
      "color": "#432",
      "bgcolor": "#653"
    },
    {
      "id": 17,
      "type": "VAELoader",
      "pos": [
        71.22825209024009,
        614.4132208648346
      ],
      "size": [
        270,
        62
      ],
      "flags": {},
      "order": 1,
      "mode": 0,
      "inputs": [],
      "outputs": [
        {
          "name": "VAE",
          "type": "VAE",
          "links": [
            45
          ]
        }
      ],
      "properties": {
        "Node name for S&R": "VAELoader",
        "cnr_id": "comfy-core",
        "ver": "0.3.75"
      },
      "widgets_values": [
        "ae.safetensors"
      ],
      "widgets_values_named": {
        "vae_name": "ae.safetensors"
      }
    },
    {
      "id": 7,
      "type": "CLIPTextEncode",
      "pos": [
        420,
        400
      ],
      "size": [
        425.265625,
        180.59375
      ],
      "flags": {},
      "order": 6,
      "mode": 0,
      "inputs": [
        {
          "name": "clip",
          "type": "CLIP",
          "link": 44
        }
      ],
      "outputs": [
        {
          "name": "CONDITIONING",
          "type": "CONDITIONING",
          "slot_index": 0,
          "links": [
            6
          ]
        }
      ],
      "title": "CLIP Text Encode (Negative Prompt)",
      "properties": {
        "Node name for S&R": "CLIPTextEncode",
        "cnr_id": "comfy-core",
        "ver": "0.3.75"
      },
      "widgets_values": [
        "blurry ugly bad",
        [
          false,
          true
        ]
      ],
      "widgets_values_named": {
        "text": "blurry ugly bad",
        "speak_and_recognation": [
          false,
          true
        ]
      },
      "color": "#322",
      "bgcolor": "#533"
    },
    {
      "id": 18,
      "type": "CLIPLoader",
      "pos": [
        80,
        460
      ],
      "size": [
        270,
        114
      ],
      "flags": {},
      "order": 2,
      "mode": 0,
      "inputs": [],
      "outputs": [
        {
          "name": "CLIP",
          "type": "CLIP",
          "links": [
            43,
            44
          ]
        }
      ],
      "properties": {
        "Node name for S&R": "CLIPLoader",
        "cnr_id": "comfy-core",
        "ver": "0.3.75"
      },
      "widgets_values": [
        "qwen_3_4b.safetensors",
        "lumina2",
        "default"
      ],
      "widgets_values_named": {
        "clip_name": "qwen_3_4b.safetensors",
        "type": "lumina2",
        "device": "default"
      }
    },
    {
      "id": 16,
      "type": "UNETLoader",
      "pos": [
        80,
        60
      ],
      "size": [
        270,
        86
      ],
      "flags": {},
      "order": 3,
      "mode": 0,
      "inputs": [],
      "outputs": [
        {
          "name": "MODEL",
          "type": "MODEL",
          "links": [
            42
          ]
        }
      ],
      "properties": {
        "Node name for S&R": "UNETLoader",
        "cnr_id": "comfy-core",
        "ver": "0.3.75"
      },
      "widgets_values": [
        "z_image_turbo_bf16.safetensors",
        "default"
      ],
      "widgets_values_named": {
        "unet_name": "z_image_turbo_bf16.safetensors",
        "weight_dtype": "default"
      }
    },
    {
      "id": 11,
      "type": "ModelSamplingAuraFlow",
      "pos": [
        390,
        60
      ],
      "size": [
        315,
        62
      ],
      "flags": {},
      "order": 7,
      "mode": 4,
      "inputs": [
        {
          "name": "model",
          "type": "MODEL",
          "link": 42
        }
      ],
      "outputs": [
        {
          "name": "MODEL",
          "type": "MODEL",
          "slot_index": 0,
          "links": [
            47
          ]
        }
      ],
      "properties": {
        "Node name for S&R": "ModelSamplingAuraFlow",
        "cnr_id": "comfy-core",
        "ver": "0.3.75"
      },
      "widgets_values": [
        3
      ],
      "widgets_values_named": {
        "shift": 3
      }
    },
    {
      "id": 6,
      "type": "CLIPTextEncode",
      "pos": [
        420,
        190
      ],
      "size": [
        423.828125,
        177.109375
      ],
      "flags": {},
      "order": 5,
      "mode": 0,
      "inputs": [
        {
          "name": "clip",
          "type": "CLIP",
          "link": 43
        }
      ],
      "outputs": [
        {
          "name": "CONDITIONING",
          "type": "CONDITIONING",
          "slot_index": 0,
          "links": [
            4
          ]
        }
      ],
      "title": "CLIP Text Encode (Positive Prompt)",
      "properties": {
        "Node name for S&R": "CLIPTextEncode",
        "cnr_id": "comfy-core",
        "ver": "0.3.75"
      },
      "widgets_values": [
        "cute anime style girl with massive fluffy fennec ears and a big fluffy tail blonde messy long hair blue eyes wearing a maid outfit with a long black gold leaf pattern dress and a white apron, it is a postcard held by a hand in front of a beautiful realistic city at sunset and there is cursive writing that says \\"ZImage, Now in ComfyUI\\"",
        [
          false,
          true
        ]
      ],
      "widgets_values_named": {
        "text": "cute anime style girl with massive fluffy fennec ears and a big fluffy tail blonde messy long hair blue eyes wearing a maid outfit with a long black gold leaf pattern dress and a white apron, it is a postcard held by a hand in front of a beautiful realistic city at sunset and there is cursive writing that says \\"ZImage, Now in ComfyUI\\"",
        "speak_and_recognation": [
          false,
          true
        ]
      },
      "color": "#232",
      "bgcolor": "#353"
    },
    {
      "id": 13,
      "type": "EmptySD3LatentImage",
      "pos": [
        525.8186605881135,
        622.5087730224612
      ],
      "size": [
        315,
        118
      ],
      "flags": {},
      "order": 4,
      "mode": 0,
      "inputs": [],
      "outputs": [
        {
          "name": "LATENT",
          "type": "LATENT",
          "slot_index": 0,
          "links": [
            17
          ]
        }
      ],
      "properties": {
        "Node name for S&R": "EmptySD3LatentImage",
        "cnr_id": "comfy-core",
        "ver": "0.3.75"
      },
      "widgets_values": [
        1024,
        1024,
        1
      ],
      "widgets_values_named": {
        "width": 1024,
        "height": 1024,
        "batch_size": 1
      }
    },
    {
      "id": 3,
      "type": "KSampler",
      "pos": [
        863,
        186
      ],
      "size": [
        315,
        262
      ],
      "flags": {},
      "order": 8,
      "mode": 0,
      "inputs": [
        {
          "name": "model",
          "type": "MODEL",
          "link": 47
        },
        {
          "name": "positive",
          "type": "CONDITIONING",
          "link": 4
        },
        {
          "name": "negative",
          "type": "CONDITIONING",
          "link": 6
        },
        {
          "name": "latent_image",
          "type": "LATENT",
          "link": 17
        }
      ],
      "outputs": [
        {
          "name": "LATENT",
          "type": "LATENT",
          "slot_index": 0,
          "links": [
            51
          ]
        }
      ],
      "properties": {
        "Node name for S&R": "KSampler",
        "cnr_id": "comfy-core",
        "ver": "0.3.75"
      },
      "widgets_values": [
        723597249731813,
        "randomize",
        12,
        1,
        "euler",
        "simple",
        1
      ],
      "widgets_values_named": {
        "seed": 723597249731813,
        "control_after_generate": "randomize",
        "steps": 12,
        "cfg": 1,
        "sampler_name": "euler",
        "scheduler": "simple",
        "denoise": 1
      }
    }
  ],
  "links": [
    [
      4,
      6,
      0,
      3,
      1,
      "CONDITIONING"
    ],
    [
      6,
      7,
      0,
      3,
      2,
      "CONDITIONING"
    ],
    [
      16,
      8,
      0,
      9,
      0,
      "IMAGE"
    ],
    [
      17,
      13,
      0,
      3,
      3,
      "LATENT"
    ],
    [
      42,
      16,
      0,
      11,
      0,
      "MODEL"
    ],
    [
      43,
      18,
      0,
      6,
      0,
      "CLIP"
    ],
    [
      44,
      18,
      0,
      7,
      0,
      "CLIP"
    ],
    [
      45,
      17,
      0,
      8,
      1,
      "VAE"
    ],
    [
      47,
      11,
      0,
      3,
      0,
      "MODEL"
    ],
    [
      51,
      3,
      0,
      8,
      0,
      "LATENT"
    ]
  ],
  "groups": [],
  "config": {},
  "extra": {
    "ds": {
      "scale": 1.1671841070450009,
      "offset": [
        467.1606285161531,
        407.4661663364565
      ]
    },
    "frontendVersion": "1.49.6",
    "workflowRendererVersion": "LG",
    "VHS_latentpreview": false,
    "VHS_latentpreviewrate": 0,
    "VHS_MetadataImage": true,
    "VHS_KeepIntermediate": true
  },
  "version": 0.4
}`, vs = '.td-modal{--td-bg:#0b1020;--td-panel:#121a2b;--td-panel-2:#18243a;--td-panel-3:#20314d;--td-line:#273b5b;--td-line-strong:#3e5b82;--td-text:#edf5ff;--td-muted:#9cafc9;--td-faint:#7185a3;--td-accent:#69e1c0;--td-accent-dim:#153d3d;--td-relay:#8bb8ff;--td-relay-dim:#1d3155;--td-warn:#f4c96d;--td-warn-dim:#44351d;--td-danger:#ff858f;--td-danger-dim:#45232e;--td-radius:10px;--td-font:"PingFang SC","Microsoft YaHei UI","Microsoft YaHei","Noto Sans SC","Segoe UI",system-ui,sans-serif;--td-mono:"Cascadia Mono",Consolas,"SF Mono",ui-monospace,"Microsoft YaHei",monospace}.td-modal{position:fixed;top:0;right:0;bottom:0;left:0;z-index:2147483000;display:block;overflow:hidden;pointer-events:auto;background:var(--td-bg);color:var(--td-text);font:13.5px/1.5 var(--td-font);isolation:isolate;outline:none}.td-modal *{box-sizing:border-box}.td-shell{height:100dvh;display:grid;grid-template-columns:214px minmax(0,1fr);grid-template-rows:auto auto minmax(0,1fr);grid-template-areas:"rail header" "rail status" "rail content";background:var(--td-bg)}.td-shell h1,.td-shell h2,.td-shell h3{margin:0;font-weight:650;letter-spacing:.01em}.td-shell h1{font-size:17px}.td-shell h2{font-size:15px}.td-shell h3{font-size:13.5px}.td-shell button,.td-shell input,.td-shell textarea,.td-shell select,.td-button{font:inherit;color:var(--td-text);background:var(--td-panel-3);border:1px solid var(--td-line-strong);border-radius:6px;padding:6px 10px}.td-shell button,.td-button{cursor:pointer;white-space:nowrap;transition:border-color .12s,background .12s,color .12s}.td-shell button:hover:not(:disabled),.td-button:hover{border-color:var(--td-accent)}.td-shell button:disabled{opacity:.45;cursor:not-allowed}.td-shell button.primary{background:var(--td-accent);border-color:var(--td-accent);color:#07140e;font-weight:600}.td-shell button.primary:hover:not(:disabled){filter:brightness(1.08)}.td-shell button.accent{background:var(--td-accent-dim);border-color:#2f6b52;color:var(--td-accent)}.td-shell button.danger{color:var(--td-danger)}.td-shell button.danger:hover:not(:disabled){border-color:var(--td-danger)}.td-shell input:focus,.td-shell textarea:focus,.td-shell select:focus{outline:none;border-color:var(--td-accent);box-shadow:0 0 0 2px #5fd0a022}.td-shell textarea{resize:vertical}.td-button{display:inline-flex;align-items:center;gap:6px}.td-button input{display:none}.td-chip{display:inline-flex;align-items:center;gap:4px;padding:1px 8px;border-radius:999px;background:var(--td-panel-3);color:var(--td-muted);font-size:11.5px;white-space:nowrap}.td-chip.ok{background:var(--td-accent-dim);color:var(--td-accent)}.td-chip.warn{background:var(--td-warn-dim);color:var(--td-warn)}.td-inline-check{display:inline-flex!important;flex-direction:row!important;align-items:center;gap:6px!important;color:var(--td-text)!important;cursor:pointer;white-space:nowrap}.td-inline-check input{width:15px!important;height:15px;margin:0}.td-hint{margin:0;color:var(--td-faint);font-size:12px}.errors{color:var(--td-danger)}.ok{color:var(--td-accent)}.wide{width:100%}.td-topbar{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:10px 18px;border-bottom:1px solid var(--td-line);background:var(--td-panel)}.td-brand{display:flex;align-items:center;gap:12px;min-width:0}.td-project-chip{display:inline-flex;align-items:center;gap:6px;max-width:320px;overflow:hidden;padding:3px 10px;border:1px solid var(--td-line-strong);border-radius:999px;text-overflow:ellipsis;white-space:nowrap}.td-project-chip em{color:var(--td-faint);font-style:normal;font-size:12px}.td-project-meta{color:var(--td-muted);font-size:12.5px;white-space:nowrap}.td-actions{display:flex;gap:8px;align-items:center;flex:none}.td-actions .td-lang{min-width:46px}.td-tabs{display:flex;align-items:center;gap:4px;padding:0 18px;border-bottom:1px solid var(--td-line);background:var(--td-panel)}.td-shell .td-tabs>button{position:relative;padding:10px 14px;border:0;border-radius:0;background:transparent;color:var(--td-muted)}.td-shell .td-tabs>button:hover:not(:disabled){color:var(--td-text);border-color:transparent}.td-shell .td-tabs>button.active{color:var(--td-text);font-weight:600}.td-tabs>button.active:after{content:"";position:absolute;left:10px;right:10px;bottom:0;height:2px;border-radius:2px;background:var(--td-accent)}.td-shell .td-tabs>button.attention{color:var(--td-warn)}.td-tab-status{display:flex;align-items:center;gap:10px;margin-left:auto;padding:6px 0}.td-progress-text{color:var(--td-muted);font-size:12.5px}.td-run-pill{display:inline-flex;align-items:center;gap:8px;padding:3px 4px 3px 10px;border:1px solid #2f6b52;border-radius:999px;background:var(--td-accent-dim);color:var(--td-accent);font-size:12.5px}.td-run-pill i{width:8px;height:8px;border-radius:50%;background:var(--td-accent);animation:td-pulse 1.2s infinite}.td-shell .td-run-pill button{padding:2px 10px;border-radius:999px;color:var(--td-danger)}@keyframes td-pulse{50%{opacity:.25}}.td-shell main{min-height:0;overflow:auto;padding:14px 18px}.td-shell.td-compact main{padding:8px 12px}.td-shell.td-compact .td-topbar{padding:7px 14px}.td-shell.td-compact .td-tabs>button{padding-top:7px;padding-bottom:7px}.td-shots{display:grid;grid-template-columns:270px minmax(420px,1fr) minmax(320px,380px);gap:14px;height:100%;min-height:0}.td-shots>aside,.td-shot-form{min-height:0;background:var(--td-panel);border:1px solid var(--td-line);border-radius:var(--td-radius)}.td-shot-sidebar{display:flex;flex-direction:column;overflow:hidden}.td-shot-list{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:8px}.td-shot-card{position:relative;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:6px;align-items:center;margin-bottom:4px;padding:8px 8px 8px 10px;border:1px solid transparent;border-radius:7px;cursor:pointer}.td-shot-card:hover{background:var(--td-panel-2)}.td-shot-card.selected{border-color:#2f6b52;background:var(--td-accent-dim)}.td-shot-card.off{opacity:.55}.td-shot-card.running{border-color:var(--td-accent);box-shadow:inset 3px 0 0 var(--td-accent)}.td-shot-card.relay{margin-top:-2px}.td-relay-link{position:absolute;left:3px;top:-8px;height:16px;border-left:2px dashed var(--td-relay)}.td-shot-card-main{min-width:0}.td-shot-card-main strong{display:block;overflow:hidden;font-weight:600;text-overflow:ellipsis;white-space:nowrap}.td-shot-card-main strong em{margin-right:6px;color:var(--td-faint);font-style:normal;font-variant-numeric:tabular-nums}.td-shot-card-meta{display:flex;flex-wrap:wrap;gap:4px;margin-top:3px;font-size:11.5px;color:var(--td-muted)}.td-shot-card-meta b{font-weight:500}.td-shot-card-meta i{padding:0 6px;border-radius:999px;background:var(--td-panel-3);font-style:normal}.td-shot-card-meta i.relay{background:var(--td-relay-dim);color:var(--td-relay)}.td-shot-card-meta i.ok{background:var(--td-accent-dim);color:var(--td-accent)}.td-shot-card-meta i.warn{background:var(--td-warn-dim);color:var(--td-warn)}.td-shot-card-meta i.run{background:var(--td-accent);color:#07140e}.td-shot-card-actions{display:flex;gap:2px;opacity:0;transition:opacity .12s}.td-shot-card:hover .td-shot-card-actions,.td-shot-card.selected .td-shot-card-actions{opacity:1}.td-shell .td-shot-card-actions button{padding:1px 6px;font-size:12px;background:transparent}.td-shot-sidebar-footer{flex:none;display:grid;gap:8px;padding:10px;border-top:1px solid var(--td-line)}.td-total{color:var(--td-muted);font-size:12px;text-align:center}.td-two-buttons{display:grid;grid-template-columns:1fr 1fr;gap:6px}.td-form{display:flex;flex-direction:column;gap:10px}.td-form label,.td-settings-grid label{display:flex;flex-direction:column;gap:4px;color:var(--td-muted);font-size:12.5px}.td-form input,.td-form textarea,.td-form select{width:100%}.td-shot-form{overflow:auto;padding:14px}.td-shot-head{display:grid;grid-template-columns:minmax(0,1fr) 110px 200px;gap:10px;align-items:end}.td-shot-head input{font-size:14px}.td-seed-input{display:flex;gap:4px}.td-seed-input input{min-width:0}.td-shell .td-seed-input button{flex:none;padding:6px 8px}.td-inline-warning{padding:6px 10px;border:1px solid #6b5527;border-radius:6px;background:var(--td-warn-dim);color:var(--td-warn);font-size:12.5px}.td-shot-switches{display:flex;flex-wrap:wrap;align-items:flex-start;gap:8px}.td-form label.td-toggle{flex-direction:row;align-items:center;gap:7px;padding:6px 10px;border:1px solid var(--td-line-strong);border-radius:6px;background:var(--td-panel-2);color:var(--td-text);cursor:pointer;white-space:nowrap}.td-form label.td-toggle input{width:15px;height:15px;margin:0}.td-form label.td-toggle:has(input:checked){border-color:#2f6b52;background:var(--td-accent-dim)}.td-form label.td-toggle:has(input:disabled){opacity:.55;cursor:not-allowed}.td-advanced{margin-left:auto}.td-advanced>summary{padding:6px 10px;color:var(--td-muted);cursor:pointer;list-style:none;border:1px dashed var(--td-line-strong);border-radius:6px}.td-advanced[open]>summary{color:var(--td-text)}.td-advanced-body{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px;min-width:420px;padding:10px;border:1px solid var(--td-line);border-radius:7px;background:var(--td-panel-2)}.td-note{border:1px solid var(--td-line);border-radius:7px;background:var(--td-panel-2)}.td-note>summary{padding:7px 10px;color:var(--td-muted);cursor:pointer}.td-note[open]>summary{border-bottom:1px solid var(--td-line)}.td-note textarea{display:block;width:100%;border:0;border-radius:0 0 7px 7px;background:transparent;line-height:1.6}.td-field-label{display:flex;align-items:baseline;gap:10px;color:var(--td-muted)}.td-field-label small{color:var(--td-faint);font-size:11.5px}.td-prompt-field{flex:1 0 auto}.td-prompt-field .td-highlight-input{min-height:360px}.td-camera-builder{border:1px solid var(--td-line);border-radius:6px;background:var(--td-panel-2)}.td-camera-builder>summary{padding:8px 10px;color:var(--td-muted);cursor:pointer}.td-camera-builder[open]>summary{border-bottom:1px solid var(--td-line)}.td-camera-builder-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;padding:10px}.td-camera-builder-fields label{display:grid;gap:4px;color:var(--td-muted);font-size:12px}.td-camera-builder-fields input,.td-camera-builder-fields select{min-width:0}.td-camera-builder-fields button{justify-self:start;align-self:end}.td-camera-builder-fields label:first-child{grid-column:1/-1}.td-highlight-textarea{position:relative;display:block;width:100%;min-width:0}.td-highlight-backdrop,.td-form textarea.td-highlight-input{box-sizing:border-box;width:100%;margin:0;padding:9px 11px;font-family:var(--td-mono);font-size:13px;line-height:1.6;letter-spacing:normal;-moz-tab-size:8;tab-size:8;white-space:pre-wrap;overflow-wrap:break-word;word-break:break-word}.td-highlight-backdrop{position:absolute;top:0;right:0;bottom:0;left:0;z-index:0;overflow:hidden;border:1px solid transparent;border-radius:6px;background:#11161d;color:var(--td-text);pointer-events:none}.td-form textarea.td-highlight-input{position:relative;z-index:1;display:block;background:transparent;color:transparent;caret-color:var(--td-text);-webkit-text-fill-color:transparent}.td-highlight-input::selection{background:#5898d46b}.td-highlight-backdrop mark{padding:0;border-radius:3px;color:inherit}.td-highlight-backdrop mark.valid{background:#1d6b50;color:#bfffe6}.td-highlight-backdrop mark.invalid{background:#7a2931;color:#ffd1d5;text-decoration:underline;text-decoration-color:#ff9aa4;text-underline-offset:2px}.td-reference-mention-menu{position:fixed;z-index:80;display:flex;flex-direction:column;overflow:hidden;border:1px solid #526174;border-radius:9px;background:#161d26;color:var(--td-text);box-shadow:0 14px 42px #000b}.td-reference-mention-menu>header{display:flex;align-items:center;justify-content:space-between;flex:none;padding:8px 10px;border-bottom:1px solid var(--td-line);background:#202936}.td-reference-mention-menu>header strong{color:var(--td-text);font-size:13px}.td-reference-mention-menu>header span{padding:1px 7px;border-radius:999px;background:#2b3745;color:var(--td-muted);font-size:11px}.td-reference-mention-options{min-height:0;overflow:auto;padding:5px}.td-shell .td-reference-mention-options>button{display:grid;grid-template-columns:66px minmax(0,1fr) auto;gap:9px;align-items:center;width:100%;min-height:56px;padding:5px;border:1px solid transparent;background:transparent;text-align:left}.td-shell .td-reference-mention-options>button:hover,.td-shell .td-reference-mention-options>button.active{border-color:#527e6c;background:#1d302b}.td-reference-mention-thumb{display:flex;width:66px;height:46px;align-items:center;justify-content:center;overflow:hidden;border:1px solid var(--td-line);border-radius:5px;background:#0b0f14;color:var(--td-accent);font-size:20px}.td-reference-mention-thumb img{display:block;width:100%;height:100%;object-fit:cover}.td-reference-mention-copy{display:flex;min-width:0;flex-direction:column;gap:2px}.td-reference-mention-copy strong,.td-reference-mention-copy small{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.td-reference-mention-copy strong{color:var(--td-text)}.td-reference-mention-copy small{color:var(--td-muted);font-size:11px}.td-reference-mention-options>button>em{padding:2px 7px;border-radius:999px;background:#293440;color:var(--td-muted);font-size:10px;font-style:normal;white-space:nowrap}.td-reference-mention-empty{margin:0;padding:22px 12px;color:var(--td-muted);text-align:center}.td-shot-media{display:grid;grid-template-columns:repeat(auto-fill,minmax(112px,1fr));gap:8px;margin:0;padding:10px;border:1px solid var(--td-line);border-radius:7px}.td-shot-media legend{padding:0 6px;color:var(--td-muted);font-size:12px}.td-shot-media-card{min-width:0;overflow:hidden;border:1px solid var(--td-line);border-radius:6px;background:var(--td-panel-2)}.td-shot-media-card.used{border-color:#2f6b52}.td-shot-media-card.disabled{opacity:.4}.td-shot-media-frame{position:relative}.td-shot-media-card .td-media-preview{min-height:64px;border:0;border-radius:0}.td-shot-media-card .td-media-preview img,.td-shot-media-card .td-media-preview video{height:70px;object-fit:cover}.td-shot-media-card .td-media-preview.empty,.td-shot-media-card .td-media-preview.unavailable{height:70px;font-size:11px}.td-shot-media-card .td-media-preview audio{width:calc(100% - 8px)}.td-form label.td-shot-media-toggle{position:absolute;top:5px;right:5px;z-index:2;display:flex;align-items:center;justify-content:center;width:22px;height:22px;padding:0;border-radius:5px;background:#090d12d9;border:1px solid #ffffff38;cursor:pointer}.td-form label.td-shot-media-toggle input{width:14px;height:14px;margin:0}.td-shell button.td-shot-media-name{display:block;width:100%;overflow:hidden;padding:5px 8px;border:0;border-radius:0;background:transparent;font-size:12px;text-align:left;text-overflow:ellipsis;white-space:nowrap}.td-shell button.td-shot-media-name:hover{color:var(--td-accent)}.td-shot-media-name i{margin-right:4px;color:var(--td-accent);font-style:normal;font-size:9px}.td-preview{display:flex;flex-direction:column;gap:12px;overflow:auto;padding:0!important;border:0!important;background:transparent!important}.td-card{border:1px solid var(--td-line);border-radius:var(--td-radius);background:var(--td-panel)}.td-card>header{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 12px;border-bottom:1px solid var(--td-line)}.td-card-body{display:flex;flex-direction:column;gap:9px;padding:12px}.td-card-body ul.errors{margin:0;padding-left:18px}.td-card-body p{margin:0}.td-summary-counts{color:var(--td-muted);font-size:11.5px;white-space:nowrap}.td-slot-list{display:grid;gap:3px;margin:0;padding:0;list-style:none;font-size:12.5px}.td-slot-list li{display:flex;gap:8px}.td-slot-list code{min-width:84px;color:#9ee6c7}.td-shell .td-link-button{align-self:flex-start;padding:0;border:0;background:transparent;color:var(--td-relay);font-size:12.5px}.td-compiled{max-height:360px;margin:0;overflow:auto;padding:10px;border-radius:6px;background:#0d1117;font-family:var(--td-mono);font-size:12px;white-space:pre-wrap}.td-take-player,.td-lazy-player video{display:block;width:100%;max-height:300px;border-radius:6px;background:#06090c}.td-take-strip{display:flex;gap:6px;overflow-x:auto;padding-bottom:2px}.td-shell button.td-take{position:relative;flex:none;width:84px;padding:0;overflow:hidden;border:2px solid transparent;border-radius:6px;background:#06090c}.td-shell button.td-take.selected{border-color:var(--td-accent)}.td-take .td-result-thumb{width:100%;aspect-ratio:16/9;border-radius:0}.td-take>span{position:absolute;left:3px;bottom:2px;padding:0 5px;border-radius:4px;background:#000a;font-size:10.5px}.td-take-actions{display:flex;flex-wrap:wrap;gap:6px}.td-result-empty{min-height:120px;display:flex;align-items:center;justify-content:center;padding:12px;border:1px dashed var(--td-line-strong);border-radius:7px;color:var(--td-muted);text-align:center}.td-result-empty.running{border-color:var(--td-accent);color:var(--td-accent);animation:td-pulse 1.6s infinite}.td-assets-panel{display:flex;flex-direction:column;gap:16px;max-width:1500px;margin:0 auto}.td-assets-toolbar{position:sticky;top:-14px;z-index:5;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px;padding:10px 12px;border:1px solid var(--td-line);border-radius:var(--td-radius);background:var(--td-panel)}.td-assets-summary,.td-assets-actions{display:flex;flex-wrap:wrap;align-items:center;gap:10px}.td-empty-state{padding:36px;border:1px dashed var(--td-line-strong);border-radius:var(--td-radius);color:var(--td-muted);text-align:center}.td-empty-state strong{color:var(--td-text);font-size:15px}.td-empty-state p{max-width:620px;margin:8px auto 0}.td-asset-group>h3{display:flex;align-items:center;gap:8px;margin-bottom:10px}.td-asset-group>h3 span{padding:0 7px;border-radius:999px;background:var(--td-panel-3);color:var(--td-muted);font-size:11.5px;font-weight:500}.td-asset-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(250px,100%),1fr));gap:12px;align-items:start}.td-asset-card{display:flex;min-width:0;flex-direction:column;overflow:hidden;border:1px solid var(--td-line);border-radius:var(--td-radius);background:var(--td-panel);transition:border-color .12s}.td-asset-card.expanded{grid-column:1/-1}.td-asset-card.expanded .td-asset-note{display:block;overflow-wrap:anywhere}.td-asset-card.missing{border-color:#6b5527}.td-asset-card.dragging{border-color:var(--td-accent);box-shadow:0 0 0 2px #5fd0a033}.td-asset-card.disabled{opacity:.55}.td-asset-card-media{position:relative;height:170px;background:#0b0f14}.td-asset-card-media .td-media-preview{height:100%;min-height:0;border:0;border-radius:0}.td-asset-card-media .td-media-preview img,.td-asset-card-media .td-media-preview video{height:170px;object-fit:contain}.td-asset-drop{display:flex;height:100%;flex-direction:column;align-items:center;justify-content:center;gap:4px;margin:8px;border:1px dashed #6b5527;border-radius:6px;color:var(--td-warn);cursor:pointer}.td-asset-drop:hover{background:var(--td-warn-dim)}.td-asset-drop small{color:var(--td-muted);font-size:11.5px}.td-asset-drop input{display:none}.td-asset-kind,.td-asset-status{position:absolute;top:8px;padding:1px 8px;border-radius:999px;background:#090d12d9;font-size:11.5px}.td-asset-kind{left:8px;color:var(--td-text)}.td-asset-status{right:8px}.td-asset-status.ok{color:var(--td-accent)}.td-asset-status.warn{color:var(--td-warn)}.td-asset-card-body{display:flex;flex-direction:column;gap:8px;padding:10px}.td-asset-card-title{display:flex;gap:6px}.td-asset-card-title input{min-width:0;flex:1;font-weight:600}.td-shell .td-asset-card-title button{flex:none;padding:4px 8px;font-family:var(--td-mono);font-size:12px}.td-asset-note{display:-webkit-box;margin:0;overflow:hidden;color:var(--td-muted);font-size:12.5px;line-height:1.55;-webkit-line-clamp:3;-webkit-box-orient:vertical}.td-asset-card-actions{display:flex;flex-wrap:wrap;gap:6px}.td-asset-card-actions>*{font-size:12.5px}.td-file-label{display:inline-flex;align-items:center;padding:6px 10px;border:1px solid var(--td-line-strong);border-radius:6px;background:var(--td-panel-3);cursor:pointer}.td-file-label:hover{border-color:var(--td-accent)}.td-file-label input{display:none}.td-asset-details{display:flex;min-width:0;flex-direction:column;gap:8px;padding-top:8px;border-top:1px solid var(--td-line)}.td-asset-details label{display:flex;min-width:0;flex-direction:column;gap:3px;color:var(--td-muted);font-size:12px}.td-asset-details label small{color:var(--td-faint);overflow-wrap:anywhere}.td-asset-details input,.td-asset-details textarea,.td-asset-details select{min-width:0;width:100%;max-width:100%}.td-asset-detail-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.td-asset-detail-grid .wide{grid-column:1/-1}.td-asset-flags{display:flex;flex-wrap:wrap;align-items:center;gap:10px}.td-asset-flags button{margin-left:auto}.td-gen-prompt{min-width:0}.td-gen-prompt>summary{color:var(--td-relay);cursor:pointer;font-size:12.5px}.td-gen-prompt pre{max-height:220px;margin:6px 0 0;overflow:auto;padding:8px;border-radius:6px;background:#0d1117;font-family:var(--td-mono);font-size:11.5px;white-space:pre-wrap;overflow-wrap:anywhere}@media(max-width:600px){.td-asset-detail-grid{grid-template-columns:minmax(0,1fr)}}.td-media-preview{min-height:120px;display:flex;align-items:center;justify-content:center;overflow:hidden;border:1px solid var(--td-line);border-radius:7px;background:#0b0f14;color:var(--td-muted);text-align:center}.td-media-preview img,.td-media-preview video{display:block;width:100%;height:200px;object-fit:contain;background:#090c10}.td-media-preview audio{display:block;width:calc(100% - 16px)}.td-media-preview.empty,.td-media-preview.unavailable{padding:12px}.td-review{display:flex;flex-direction:column;gap:12px;max-width:1700px;margin:0 auto}.td-review-steps{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.td-step{display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid var(--td-line);border-radius:var(--td-radius);background:var(--td-panel);color:var(--td-muted)}.td-step b{display:grid;flex:none;place-items:center;width:26px;height:26px;border-radius:50%;background:var(--td-panel-3);color:var(--td-muted)}.td-step div{display:flex;min-width:0;flex-direction:column}.td-step strong{color:var(--td-text);font-weight:600}.td-step span{overflow:hidden;font-size:12px;text-overflow:ellipsis;white-space:nowrap}.td-step.active{border-color:#2f6b52;background:var(--td-accent-dim)}.td-step.active b{background:var(--td-accent);color:#07140e}.td-step.done b{background:#2f6b52;color:#d9fff0}.td-review-actions{display:flex;flex-wrap:wrap;gap:10px}.td-action-group{display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:8px 10px;border:1px solid var(--td-line);border-radius:var(--td-radius);background:var(--td-panel)}.td-action-title{color:var(--td-faint);font-size:12px}.td-denoise{display:flex!important;flex-direction:row!important;align-items:center;gap:8px;color:var(--td-muted);font-size:12.5px}.td-shell .td-denoise input{width:120px;padding:0;accent-color:var(--td-accent)}.td-denoise b{min-width:34px;color:var(--td-accent);font-variant-numeric:tabular-nums}.td-run-bar{display:flex;align-items:center;gap:12px;padding:10px 14px;border:1px solid var(--td-line);border-radius:var(--td-radius);background:var(--td-panel)}.td-run-bar>div{display:flex;min-width:0;flex:1;align-items:baseline;gap:10px}.td-run-bar span{overflow:hidden;color:var(--td-muted);text-overflow:ellipsis;white-space:nowrap}.td-run-bar.running{border-color:#2f6b52}.td-run-bar.running strong{color:var(--td-accent)}.td-run-bar.error{border-color:#7a3a40;background:var(--td-danger-dim)}.td-run-bar.error strong{color:var(--td-danger)}.td-run-bar.done strong{color:var(--td-accent)}.td-run-bar progress{width:220px;height:8px;accent-color:var(--td-accent)}.td-run-bar b{min-width:40px;color:var(--td-accent);text-align:right}.td-review-filter{display:flex;flex-wrap:wrap;align-items:center;gap:6px}.td-shell .td-review-filter button{border-radius:999px;padding:4px 12px;font-size:12.5px}.td-shell .td-review-filter button.active{border-color:var(--td-accent);color:var(--td-accent)}.td-review-hint{margin-left:auto;color:var(--td-faint);font-size:12px}.td-review-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(380px,1fr));gap:12px;align-items:start}.td-review-card{display:flex;flex-direction:column;gap:8px;padding:10px;border:1px solid var(--td-line);border-radius:var(--td-radius);background:var(--td-panel)}.td-review-card.approved{border-color:#2f6b52}.td-review-card.redo{border-color:#6b5527}.td-review-card.off{opacity:.55}.td-review-card.running{box-shadow:0 0 0 2px #5fd0a055}.td-review-card>header{display:flex;align-items:center;justify-content:space-between;gap:8px}.td-shell .td-review-title{min-width:0;overflow:hidden;padding:0;border:0;background:transparent;font-weight:600;text-align:left;text-overflow:ellipsis}.td-shell .td-review-title:hover{color:var(--td-accent)}.td-review-title em{margin-right:6px;color:var(--td-faint);font-style:normal}.td-review-tags{display:flex;flex:none;gap:4px}.td-review-tags i{padding:0 7px;border-radius:999px;background:var(--td-panel-3);color:var(--td-muted);font-size:11.5px;font-style:normal}.td-review-tags i.relay{background:var(--td-relay-dim);color:var(--td-relay)}.td-review-tags i.approved{background:var(--td-accent-dim);color:var(--td-accent)}.td-review-tags i.redo{background:var(--td-warn-dim);color:var(--td-warn)}.td-review-media{position:relative}.td-lazy-player{display:flex;aspect-ratio:16/9;align-items:center;justify-content:center;overflow:hidden;border-radius:6px;background:#06090c;color:var(--td-faint)}.td-lazy-player video{width:100%;height:100%;max-height:none;object-fit:contain}.td-review-media>.td-result-empty{aspect-ratio:16/9;min-height:0}.td-review-media-switch{position:absolute;top:6px;right:6px;display:flex;overflow:hidden;border:1px solid var(--td-line-strong);border-radius:6px}.td-shell .td-review-media-switch button{padding:2px 9px;border:0;border-radius:0;background:#090d12d9;font-size:11.5px}.td-shell .td-review-media-switch button.active{background:var(--td-accent);color:#07140e}.td-review-warning{margin:0;padding:6px 9px;border-radius:6px;background:var(--td-warn-dim);color:var(--td-warn);font-size:12px}.td-review-note{display:-webkit-box;margin:0;overflow:hidden;color:var(--td-muted);font-size:12.5px;white-space:pre-line;-webkit-line-clamp:4;-webkit-box-orient:vertical;cursor:help}.td-review-card>footer{display:flex;flex-wrap:wrap;gap:6px}.td-shell .td-review-card>footer button{padding:5px 10px;font-size:12.5px}.td-shell .td-review-card>footer button.ok.active{border-color:var(--td-accent);background:var(--td-accent-dim);color:var(--td-accent)}.td-shell .td-review-card>footer button.warn.active{border-color:var(--td-warn);background:var(--td-warn-dim);color:var(--td-warn)}.settings{max-width:860px;margin:0 auto;padding:18px;border:1px solid var(--td-line);border-radius:var(--td-radius);background:var(--td-panel)}.td-settings-grid{display:grid;grid-template-columns:2fr 1fr 100px 1fr;gap:10px}.td-settings-grid .td-setting-check{justify-content:space-between}.td-setting-check>span:last-child{display:flex;align-items:center;gap:7px;color:var(--td-text)}.td-setting-check input{width:15px!important;height:15px;margin:0}.td-project-cleanup{display:grid;gap:9px;margin-top:18px}.td-project-cleanup h3{color:var(--td-danger)}.td-project-cleanup article{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:12px 14px;border:1px solid #5a2f35;border-radius:8px;background:#22161a}.td-project-cleanup strong{color:#ffd1d5}.td-project-cleanup p{margin:4px 0 0;color:#c99da2;font-size:12.5px;line-height:1.5}.td-project-cleanup button{min-width:120px;flex:none}.td-batch-overlay{position:fixed;top:0;right:0;bottom:0;left:0;z-index:20;display:flex;align-items:center;justify-content:center;padding:28px;background:#05080dcc}.td-confirm{width:min(440px,100%);padding:18px;border:1px solid var(--td-line-strong);border-radius:10px;background:var(--td-panel);box-shadow:0 20px 70px #000b}.td-confirm p{color:var(--td-muted)}.td-confirm footer{display:flex;justify-content:flex-end;gap:8px}.td-toasts{position:fixed;right:20px;bottom:20px;z-index:40;display:flex;flex-direction:column;gap:8px;max-width:420px;pointer-events:none}.td-toast{padding:10px 14px;border:1px solid #2f6b52;border-radius:8px;background:#122019;color:var(--td-text);box-shadow:0 10px 30px #0009;animation:td-toast-in .18s ease-out}.td-toast.error{border-color:#7a3a40;background:#2a1418;color:#ffd1d5}@keyframes td-toast-in{0%{opacity:0;transform:translateY(8px)}}.td-batch-panel{display:flex;flex-direction:column;width:min(1040px,100%);max-height:min(820px,calc(100vh - 56px));overflow:hidden;border:1px solid var(--td-line);border-radius:10px;background:var(--td-panel);box-shadow:0 20px 70px #000b}.td-batch-panel>.td-batch-header{display:flex;align-items:center;justify-content:space-between;padding:15px 18px;border-bottom:1px solid var(--td-line)}.td-batch-header h2{font-size:17px;margin:0}.td-batch-header p{margin:3px 0 0;color:var(--td-muted)}.td-batch-header>button{font-size:20px;line-height:1;padding:5px 9px}.td-batch-tools{display:grid;grid-template-columns:1fr 1.4fr;gap:12px;padding:14px 18px;border-bottom:1px solid var(--td-line);background:#151b23}.td-batch-tools>div{display:flex;align-items:end;gap:8px;padding:10px;border:1px solid var(--td-line);border-radius:7px}.td-batch-tools label{display:flex;flex:1;flex-direction:column;gap:4px;color:var(--td-muted);white-space:nowrap}.td-batch-tools label>span,.td-batch-duration{display:flex;align-items:center;gap:6px}.td-batch-tools input{width:100%}.td-batch-tools em{color:var(--td-muted);font-style:normal}.td-batch-tools button{white-space:nowrap}.td-batch-global-actions{display:flex;align-items:center;justify-content:flex-end;gap:12px;padding:9px 22px;border-bottom:1px solid var(--td-line);background:#171e27;color:var(--td-muted)}.td-batch-global-actions button.active{border-color:#527e6c;background:#1b302a;color:var(--td-accent)}.td-batch-table{overflow:auto;padding:0 18px}.td-batch-row{display:grid;grid-template-columns:42px minmax(180px,1fr) 100px 150px 120px;gap:10px;align-items:center;padding:8px 4px;border-bottom:1px solid #2a3442}.td-batch-table-head{position:sticky;top:0;z-index:1;background:var(--td-panel);color:var(--td-muted);font-weight:600}.td-batch-duration input{min-width:0;width:100%}.td-batch-duration>span{color:var(--td-muted)}.td-batch-enabled,.td-batch-relay{display:flex;align-items:center;gap:7px;justify-content:flex-start;color:var(--td-text)}.td-batch-enabled input,.td-batch-relay input{width:17px;height:17px;margin:0}.td-batch-panel>footer{display:flex;justify-content:flex-end;gap:8px;padding:13px 18px;border-top:1px solid var(--td-line)}.td-asset-batch-panel{display:flex;flex-direction:column;width:min(1420px,100%);max-height:min(880px,calc(100vh - 56px));overflow:hidden;border:1px solid var(--td-line);border-radius:10px;background:var(--td-panel);box-shadow:0 20px 70px #000b}.td-asset-batch-panel>.td-batch-header{display:flex;align-items:center;justify-content:space-between;padding:15px 18px;border-bottom:1px solid var(--td-line)}.td-asset-batch-panel>footer{display:flex;justify-content:flex-end;gap:8px;padding:13px 18px;border-top:1px solid var(--td-line)}.td-asset-dropzone{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;min-height:112px;margin:14px 18px 10px;border:1px dashed #597084;border-radius:9px;background:#151b23;color:var(--td-text);transition:border-color .15s,background .15s}.td-asset-dropzone:hover,.td-asset-dropzone.dragging{border-color:var(--td-accent);background:#1b2c28}.td-asset-dropzone span{color:var(--td-muted);font-size:12px}.td-asset-dropzone input{display:none}.td-asset-batch-warning{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:0 18px 10px;padding:8px 10px;border:1px solid #836a32;border-radius:7px;background:#3a301c;color:#f4d991}.td-asset-batch-warning span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.td-asset-batch-warning button{padding:2px 7px}.td-asset-batch-summary{display:flex;align-items:center;justify-content:space-between;padding:8px 18px;border-top:1px solid var(--td-line);border-bottom:1px solid var(--td-line);background:#151b23;color:var(--td-muted)}.td-asset-batch-summary button{padding:5px 8px}.td-asset-batch-list{overflow:auto;padding:0 18px 10px}.td-asset-batch-row{display:grid;grid-template-columns:minmax(210px,1.4fr) minmax(150px,1fr) 115px 135px 105px 72px;gap:10px;align-items:center;padding:8px 4px;border-bottom:1px solid #2a3442}.td-asset-batch-head{position:sticky;top:0;z-index:2;padding-top:10px;background:var(--td-panel);color:var(--td-muted);font-weight:600}.td-asset-batch-row.invalid{background:#3b202560}.td-asset-batch-row.imported{background:#17372d55}.td-asset-batch-file{display:flex;min-width:0;flex-direction:column;gap:2px}.td-asset-batch-file strong,.td-asset-batch-file small,.td-asset-batch-file em{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.td-asset-batch-file small{color:var(--td-muted);font-weight:400}.td-asset-batch-file em{color:var(--td-danger);font-size:11px;font-style:normal}.td-asset-batch-duration,.td-asset-batch-audio{display:flex;align-items:center;gap:6px;color:var(--td-muted)}.td-asset-batch-duration input{min-width:0;width:100%}.td-asset-batch-audio input{width:17px;height:17px;margin:0}.td-asset-batch-empty{display:flex;min-height:130px;align-items:center;justify-content:center;color:var(--td-muted)}.td-asset-batch-panel button:disabled,.td-asset-batch-panel input:disabled,.td-asset-batch-panel select:disabled{opacity:.55;cursor:not-allowed}.td-asset-picker-actions{display:flex;gap:8px;margin-top:8px}.td-asset-picker-button{padding:7px 12px;border:1px solid var(--td-line);border-radius:6px;background:#222c39;color:var(--td-text);cursor:pointer}.td-asset-picker-button:hover{border-color:var(--td-accent);background:#263b38}.td-asset-picker-button:has(input:disabled){opacity:.55;cursor:not-allowed}.td-asset-batch-fill{display:flex;align-items:center;gap:6px;min-width:0;overflow:hidden;color:var(--td-accent);white-space:nowrap}.td-asset-batch-fill em{padding:0 6px;border-radius:999px;background:var(--td-accent-dim);font-size:11px;font-style:normal}.td-asset-batch-alias{display:flex;flex-direction:column;gap:6px;min-width:0}.td-asset-batch-alias>input{width:100%;min-width:0}.td-asset-conflict-actions{display:flex;flex-wrap:wrap;gap:4px}.td-asset-conflict-actions button{padding:4px 6px;font-size:11px}.td-asset-batch-conflicts{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px;margin:0 18px 10px;padding:10px;border:1px solid #836a32;border-radius:7px;background:#3a301c;color:#f4d991}.td-asset-batch-conflicts>div{display:flex;flex-wrap:wrap;gap:6px}.td-postprocess{display:flex;flex-direction:column;gap:14px;max-width:1500px;margin:0 auto}.td-post-header,.td-post-summary,.td-post-merged{border:1px solid var(--td-line);border-radius:9px;background:var(--td-panel)}.td-post-header{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 16px}.td-post-header h2,.td-post-merged h2{margin:0;font-size:16px}.td-post-header p{margin:4px 0 0;color:var(--td-muted)}.td-post-actions{display:flex;gap:8px;flex:none}.td-post-summary{display:flex;align-items:center;gap:18px;padding:10px 14px;color:var(--td-muted)}.td-post-summary>button{margin-left:auto}.td-post-range{display:flex;align-items:center;gap:6px;margin-left:auto}.td-post-range input{width:64px;padding:6px 7px;text-align:center}.td-post-range button{white-space:nowrap}.td-post-summary>.td-post-range+button{margin-left:0}.td-post-error,.td-post-warning{padding:10px 13px;border-radius:7px}.td-post-error{border:1px solid #8b4149;background:#442228;color:#ffd1d5;white-space:pre-wrap}.td-post-warning{border:1px solid #836a32;background:#3a301c;color:#f4d991}.td-post-shot-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(390px,1fr));gap:12px;align-items:start}.td-post-shot{min-width:0;border:1px solid var(--td-line);border-radius:9px;background:var(--td-panel);overflow:hidden}.td-post-shot.selected{border-color:#527e6c}.td-post-shot.disabled{opacity:.72}.td-post-shot>header{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 12px;border-bottom:1px solid var(--td-line);background:#1d2530}.td-post-shot>header>label{display:flex;align-items:center;gap:9px;min-width:0;cursor:pointer}.td-post-shot>header input{width:18px;height:18px;margin:0;flex:none}.td-post-shot>header label>span{display:flex;min-width:0;gap:8px;align-items:baseline}.td-post-shot>header strong{color:var(--td-text)}.td-post-shot>header em{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--td-muted);font-style:normal}.td-post-shot>header>span{flex:none;padding:2px 7px;border-radius:999px;background:#29313d;color:var(--td-muted)}.td-post-shot-disabled-note{padding:7px 10px;border-bottom:1px solid var(--td-line);background:#332b1d;color:#e5c77d;font-size:11px}.td-post-shot-empty{min-height:96px;display:flex;align-items:center;justify-content:center;padding:12px;color:var(--td-muted);text-align:center}.td-post-result-list{display:flex;flex-direction:column;gap:7px;max-height:360px;overflow:auto;padding:9px}.td-post-result{display:grid;grid-template-columns:minmax(0,1fr) 35px;gap:6px;align-items:center;border:1px solid var(--td-line);border-radius:7px;background:#151b23;padding:5px}.td-post-result.selected{border-color:var(--td-accent);background:#1c2a2a}.td-shell button.td-post-result-choice{display:grid;grid-template-columns:112px minmax(0,1fr);gap:9px;align-items:center;min-width:0;padding:0;border:0;background:transparent;text-align:left}.td-post-result-choice>span{display:flex;min-width:0;flex-direction:column;gap:3px}.td-post-result-choice>span>strong{display:flex;align-items:center;gap:6px}.td-post-result-choice>span>strong em{padding:1px 5px;border-radius:999px;background:#183a2e;color:var(--td-accent);font-size:10px;font-style:normal}.td-post-result-choice>span>span,.td-post-result-choice>span>small{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--td-muted)}.td-post-result-choice>span>small{font-size:10px}.td-post-result-play{width:35px;height:35px;padding:0!important}.td-post-merged{padding:12px}.td-post-merged>header>div{display:flex;align-items:center;justify-content:space-between;margin-bottom:11px}.td-post-merged .td-generated-results{display:grid;grid-template-columns:minmax(360px,1.6fr) minmax(300px,1fr);align-items:start}.td-post-merged .td-result-list{max-height:420px}.td-post-preview-overlay{position:fixed;top:0;right:0;bottom:0;left:0;z-index:30;display:flex;align-items:center;justify-content:center;padding:26px;background:#030609d6}.td-post-preview-overlay>section{width:min(980px,100%);max-height:calc(100vh - 52px);overflow:auto;border:1px solid var(--td-line);border-radius:10px;background:var(--td-panel);box-shadow:0 20px 80px #000c}.td-post-preview-overlay header{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-bottom:1px solid var(--td-line)}.td-post-preview-overlay header button{font-size:20px;line-height:1;padding:5px 9px}.td-post-preview-overlay video{display:block;width:100%;max-height:calc(100vh - 170px);background:#070a0e}.td-post-preview-overlay p{margin:0;padding:9px 12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--td-muted)}.td-result-state{padding:2px 7px;border-radius:999px;background:#29313d;color:var(--td-muted);font-size:11px}.td-result-state.found{background:#183a2e;color:var(--td-accent)}.td-generated-video video{display:block;width:100%;max-height:420px;background:#080b0f;border-radius:7px}.td-generated-meta{margin-top:7px;color:var(--td-muted);font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.td-generated-results{display:flex;flex-direction:column;gap:12px}.td-result-list{display:flex;flex-direction:column;gap:7px;max-height:280px;overflow:auto;padding-right:3px}.td-shell button.td-result-item{display:grid;grid-template-columns:112px minmax(0,1fr);gap:10px;align-items:center;width:100%;padding:6px;text-align:left;background:#151b23}.td-shell button.td-result-item.selected{border-color:var(--td-accent);background:#1c2a2a}.td-result-thumb{width:112px;aspect-ratio:16/9;display:flex;align-items:center;justify-content:center;overflow:hidden;border-radius:5px;background:#090c10;color:var(--td-muted)}.td-result-thumb img,.td-result-thumb video{display:block;width:100%;height:100%;object-fit:contain}.td-result-item-copy{display:flex;min-width:0;flex-direction:column;gap:3px}.td-result-item-copy>strong{display:flex;align-items:center;gap:7px;color:var(--td-text)}.td-result-item-copy>strong em{padding:1px 6px;border-radius:999px;background:#183a2e;color:var(--td-accent);font-size:10px;font-style:normal}.td-result-item-copy>span,.td-result-item-copy>small{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--td-muted)}.td-result-item-copy>small{font-size:10px}.td-batch-progress{display:flex;align-items:center;gap:10px;padding:8px 12px;border:1px solid var(--td-line);border-radius:7px;background:#151b23;color:var(--td-muted)}.td-batch-progress progress{width:100%;height:8px;accent-color:var(--td-accent)}.td-batch-progress b{min-width:42px;color:var(--td-accent);text-align:right}.td-postprocess-shell{display:flex;flex-direction:column;gap:12px;max-width:1500px;margin:0 auto}.td-postprocess-shell>.td-postprocess{max-width:none;width:100%;margin:0}.td-post-mode-tabs{display:flex;gap:7px;padding:5px;border:1px solid var(--td-line);border-radius:9px;background:var(--td-panel)}.td-post-mode-tabs button{min-width:130px}.td-shell .td-post-mode-tabs button.active{border-color:#527e6c;background:#1b302a;color:var(--td-accent)}.td-second-pass-panel .td-post-shot>header>span:first-child{display:flex;min-width:0;gap:8px;align-items:baseline;padding:0;background:transparent}.td-second-pass-result{display:grid;grid-template-columns:minmax(0,1fr) 154px;gap:8px;align-items:center;border:1px solid var(--td-line);border-radius:7px;background:#151b23;padding:6px}.td-second-pass-actions{display:flex;min-width:0;flex-direction:column;gap:6px}.td-second-pass-actions select{width:100%;min-width:0;padding:6px}.td-second-pass-terminal{display:flex;min-height:32px;align-items:center;justify-content:center;border:1px solid var(--td-line);border-radius:6px;color:var(--td-muted);font-size:11px;text-align:center}.td-second-pass-run{width:100%;min-height:34px;padding:6px!important}.td-second-pass-error{grid-column:1/-1;padding:6px 8px;border-radius:5px;background:#442228;color:#ffd1d5;font-size:11px;white-space:pre-wrap}.td-delete-panel .td-post-shot>header>span:first-child{display:flex;min-width:0;gap:8px;align-items:baseline;padding:0;background:transparent}.td-delete-result{display:grid;grid-template-columns:minmax(0,1fr) 118px;gap:8px;align-items:center;border:1px solid var(--td-line);border-radius:7px;background:#151b23;padding:6px}.td-delete-result.deleting{opacity:.58}.td-delete-video-button{min-height:40px;padding:6px!important}.td-delete-merged{padding:12px}.td-delete-merged-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(390px,1fr));gap:8px}.td-delete-merged .td-post-result-choice>span>strong{color:var(--td-text)}@media(max-width:1280px){.td-shots{grid-template-columns:230px minmax(0,1fr)}.td-shots>.td-preview{grid-column:1/-1;flex-direction:row;flex-wrap:wrap}.td-shots>.td-preview>.td-card{flex:1 1 340px}.td-shots{height:auto}.td-review-steps{grid-template-columns:1fr 1fr}.td-project-meta{display:none}}@media(max-width:900px){.td-shots{grid-template-columns:1fr}.td-shot-sidebar{max-height:300px}.td-shot-head{grid-template-columns:1fr 1fr}.td-shot-head .grow{grid-column:1/-1}.td-settings-grid{grid-template-columns:1fr 1fr}.td-review-grid,.td-post-shot-list,.td-delete-merged-list,.td-post-merged .td-generated-results{grid-template-columns:1fr}.td-topbar,.td-tabs{flex-wrap:wrap}.td-advanced-body{min-width:0;grid-template-columns:1fr}}.td-assets-actions .td-button input{display:none}.td-assets-actions .td-button{display:inline-flex;align-items:center;cursor:pointer}.td-assets-actions,.td-actions{flex-wrap:wrap}.td-imagegen-overlay{z-index:25;padding:16px}.td-imagegen-panel{display:flex;flex-direction:column;gap:12px;width:min(1040px,100%);min-width:0;max-height:min(980px,calc(100dvh - 32px));overflow:auto;border:1px solid var(--td-line);border-radius:9px;background:var(--td-panel);box-shadow:0 20px 70px #000b}.td-imagegen-panel>*{flex-shrink:0;min-width:0}.td-imagegen-panel>.td-batch-header{position:sticky;top:0;z-index:2;flex:none;padding:13px 16px;background:var(--td-panel)}.td-imagegen-models{display:flex;flex-wrap:wrap;align-items:center;gap:7px;padding:0 16px;color:var(--td-muted)}.td-imagegen-models strong{color:var(--td-text)}.td-imagegen-models code{padding:3px 6px;border:1px solid var(--td-line);border-radius:5px;background:#151b23;font-size:11px;overflow-wrap:anywhere}.td-imagegen-models small{flex-basis:100%;line-height:1.5}.td-imagegen-models>header{display:flex;width:100%;align-items:center;justify-content:space-between;gap:8px}.td-imagegen-model-selects{display:grid;width:100%;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.td-imagegen-model-selects label{display:flex;flex-direction:column;min-width:0;gap:5px}.td-imagegen-model-selects select{width:100%;min-width:0;text-overflow:ellipsis}.td-imagegen-form{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;padding:0 16px}.td-imagegen-form label{display:flex;min-width:0;flex-direction:column;gap:5px;color:var(--td-muted)}.td-imagegen-form label.wide{grid-column:1/-1}.td-imagegen-form textarea{min-height:64px;resize:vertical;line-height:1.5}.td-imagegen-form label small{line-height:1.4}.td-imagegen-form .td-imagegen-seed{grid-column:span 2}.td-imagegen-form .td-imagegen-random{display:flex;grid-column:span 2;flex-direction:row;align-items:center;align-self:end;min-height:36px}.td-imagegen-form .td-imagegen-random input{width:17px;height:17px;margin:0}.td-imagegen-pending,.td-imagegen-record{display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:8px 16px;border-top:1px solid var(--td-line);border-bottom:1px solid var(--td-line);background:#151b23;color:var(--td-muted);font-size:12px}.td-imagegen-pending button{margin-left:auto}.td-imagegen-record span{padding-right:9px;border-right:1px solid var(--td-line)}.td-imagegen-record span:last-child{max-width:230px;overflow:hidden;border:0;text-overflow:ellipsis;white-space:nowrap}.td-imagegen-results{padding:0 16px}.td-imagegen-results>header{display:flex;flex-wrap:wrap;justify-content:space-between;gap:5px;margin-bottom:8px;color:var(--td-muted)}.td-imagegen-results>header strong{color:var(--td-text)}.td-imagegen-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:9px}.td-imagegen-grid article{display:flex;min-width:0;flex-direction:column;gap:6px;padding:7px;border:1px solid var(--td-line);border-radius:7px;background:#151b23}.td-imagegen-grid img{display:block;width:100%;aspect-ratio:4/3;object-fit:contain;background:#080b0f;border-radius:4px}.td-imagegen-grid small{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--td-muted)}.td-imagegen-grid button{width:100%;min-height:34px}.td-imagegen-error{margin:0 16px;padding:9px 11px;border:1px solid #8b4149;border-radius:6px;background:#442228;color:#ffd1d5;white-space:pre-wrap;overflow-wrap:anywhere}.td-imagegen-panel>footer{position:sticky;bottom:0;z-index:2;display:flex;flex-wrap:wrap;align-items:center;justify-content:flex-end;gap:8px;padding:11px 16px;border-top:1px solid var(--td-line);background:var(--td-panel)}.td-imagegen-footer-note{margin-right:auto;color:var(--td-muted);font-size:11px;line-height:1.4}.td-imagegen-batch-selection,.td-imagegen-batch-outcomes{margin:0 16px;display:flex;flex-direction:column;gap:8px}.td-imagegen-batch-selection>header{display:flex;align-items:center;flex-wrap:wrap;gap:8px}.td-imagegen-batch-list{max-height:240px;overflow:auto;border:1px solid var(--td-line);border-radius:6px}.td-imagegen-batch-list>label{display:flex;align-items:center;flex-wrap:wrap;gap:8px;padding:9px;border-bottom:1px solid var(--td-line);cursor:pointer}.td-imagegen-batch-list input{width:17px;height:17px;flex:none}.td-imagegen-batch-list small{flex-basis:100%;padding-left:25px;overflow-wrap:anywhere;color:var(--td-muted)}.td-imagegen-batch-selection>small{color:var(--td-muted);line-height:1.5}.td-imagegen-batch-outcomes{padding:10px;border:1px solid var(--td-line);border-radius:6px;overflow-wrap:anywhere}.td-imagegen-batch-outcomes>header{flex:none;line-height:1.5}.td-imagegen-batch-log{min-height:100px;max-height:min(320px,35dvh);overflow:auto;overscroll-behavior:contain;scrollbar-gutter:stable}.td-imagegen-log-row{display:grid;grid-template-columns:minmax(100px,1fr) minmax(0,3fr);gap:10px;padding:8px 4px;border-bottom:1px solid var(--td-line);line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}.td-imagegen-log-row>*{min-width:0}.td-imagegen-log-row.error>span{color:#ffd1d5}@media(max-width:600px){.td-imagegen-model-selects{grid-template-columns:1fr}.td-imagegen-log-row{grid-template-columns:1fr;gap:3px}.td-imagegen-batch-log{max-height:30dvh}.td-imagegen-panel .td-batch-progress{flex-wrap:wrap}.td-imagegen-panel .td-batch-progress>span{flex-basis:100%;overflow-wrap:anywhere}}@media(max-width:600px){.td-imagegen-overlay{align-items:flex-end;padding:0}.td-imagegen-panel{width:100%;max-height:94vh;border-radius:9px 9px 0 0}.td-imagegen-form{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;padding:0 12px}.td-imagegen-form label.wide{grid-column:1/-1}.td-imagegen-models,.td-imagegen-results{padding-right:12px;padding-left:12px}.td-imagegen-panel>.td-batch-header,.td-imagegen-panel>footer{padding-right:12px;padding-left:12px}.td-imagegen-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.td-imagegen-footer-note{flex-basis:100%}}.td-modal{--td-bg:#0e1116;--td-panel:#171c24;--td-panel-2:#1c2430;--td-panel-3:#252f3c;--td-line:#2a3442;--td-line-strong:#404f62;--td-text:#edf0f5;--td-muted:#a6b2c3;--td-faint:#7e8da2;--td-accent:#d7f390;--td-accent-dim:#2c3823;--td-radius:12px}.td-workspace-rail{grid-area:rail;display:flex;min-height:0;flex-direction:column;gap:24px;padding:24px 14px 16px;border-right:1px solid var(--td-line);background:#131820;overflow:auto}.td-rail-brand{display:flex;align-items:center;gap:10px;padding:0 6px}.td-rail-brand h1{font-size:16px}.td-rail-brand small{color:var(--td-faint);font-size:9px;letter-spacing:1.2px}.td-brand-mark{display:grid;place-items:center;flex:none;width:38px;height:38px;border-radius:11px;background:var(--td-accent);color:#1b2412;font-size:16px;font-weight:800;letter-spacing:-1px}.td-shell .td-project-home{display:flex;flex-direction:column;align-items:flex-start;gap:5px;padding:14px;text-align:left;background:var(--td-panel-2);border-color:var(--td-line);white-space:normal}.td-project-home small{color:var(--td-faint);font-size:10px;letter-spacing:1px}.td-project-home strong{display:-webkit-box;overflow:hidden;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow-wrap:anywhere}.td-project-home>span{font:11px var(--td-mono);color:var(--td-muted);overflow-wrap:anywhere}.td-stage-nav{display:flex;flex-direction:column;gap:7px}.td-shell .td-stage-nav>button{display:flex;align-items:center;gap:10px;position:relative;min-height:64px;padding:10px;text-align:left;border:1px solid transparent;background:transparent;border-radius:10px}.td-stage-number{font:11px var(--td-mono);color:var(--td-faint)}.td-stage-nav>button>span:nth-child(2){min-width:0}.td-stage-nav strong,.td-stage-nav small{display:block}.td-stage-nav strong{font-size:13px;font-weight:500}.td-stage-nav small{margin-top:3px;font-size:10px;color:var(--td-faint)}.td-shell .td-stage-nav>button.active{background:var(--td-accent-dim);border-color:#4b5d37}.td-stage-nav>button.active .td-stage-number,.td-stage-nav>button.active strong{color:var(--td-accent)}.td-stage-nav em{margin-left:auto;font:10px var(--td-mono);color:var(--td-muted)}.td-stage-nav em.warn{color:var(--td-warn)}.td-rail-progress{margin-top:auto;padding:15px 7px 0;border-top:1px solid var(--td-line);font-size:11px}.td-rail-progress>div{display:flex;justify-content:space-between;color:var(--td-muted)}.td-rail-progress strong{color:var(--td-accent)}.td-rail-progress progress{display:block;width:100%;height:4px;margin-top:12px;accent-color:var(--td-accent)}.td-rail-progress p{color:var(--td-faint);font-size:11px}.td-shell .td-rail-progress button{padding:0;border:0;background:transparent;font-size:11px;color:var(--td-muted)}.td-topbar{grid-area:header;min-width:0;padding:19px 24px;background:var(--td-bg);border-bottom:0;flex-wrap:nowrap}.td-workspace-title{min-width:0}.td-eyebrow{color:var(--td-faint);font-size:10px;letter-spacing:1px}.td-workspace-title>div{display:flex;align-items:center;gap:12px;margin-top:4px}.td-workspace-title h2{font-size:23px;font-weight:600}.td-actions{gap:8px;flex-wrap:nowrap}.td-shell .td-actions>button{padding:8px 13px}.td-shell button.primary{color:#17210d}.td-project-menu{position:relative}.td-project-menu>summary{padding:8px 12px;cursor:pointer;list-style:none;border:1px solid var(--td-line-strong);border-radius:6px;color:var(--td-muted)}.td-project-menu>summary>span{margin-left:12px}.td-project-menu-items{position:absolute;right:0;top:calc(100% + 8px);z-index:25;display:grid;gap:5px;min-width:180px;padding:8px;border:1px solid var(--td-line-strong);border-radius:10px;background:var(--td-panel);box-shadow:0 12px 36px #0006}.td-project-menu-items>*{text-align:left}.td-session-bar{grid-area:status;display:flex;align-items:center;justify-content:space-between;gap:12px;min-width:0;min-height:45px;margin:0 24px;border-top:1px solid var(--td-line);border-bottom:1px solid var(--td-line)}.td-session-context{color:var(--td-faint);font-size:12px}.td-tab-status{min-width:0;flex-wrap:wrap;justify-content:flex-end}.td-progress-text{font-size:11px}.td-shell main{grid-area:content;min-width:0;padding:18px 24px 20px}.td-shell.td-compact main{padding:10px 16px}.td-shell.td-compact .td-topbar{padding:12px 24px}.td-shots{height:100%;min-height:0;grid-template-columns:minmax(0,1.2fr) minmax(300px,1fr);grid-template-rows:minmax(0,1fr) 158px;grid-template-areas:"composer monitor" "timeline timeline";gap:16px}.td-shot-form{grid-area:composer;padding:18px;gap:14px}.td-composer-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;padding-bottom:14px;border-bottom:1px solid var(--td-line)}.td-composer-heading small{font:10px var(--td-mono);color:var(--td-faint)}.td-composer-heading h3{font-size:16px;margin-top:4px}.td-composer-heading>div:last-child{display:flex;gap:6px}.td-shell .td-composer-heading button{padding:4px 10px}.td-shot-head{grid-template-columns:minmax(0,1fr) 85px 140px;gap:8px}.td-prompt-field .td-highlight-input{min-height:260px}.td-field-label{flex-wrap:wrap;gap:4px 10px}.td-shots>.td-preview{grid-area:monitor;grid-column:auto;display:flex;flex-direction:column;flex-wrap:nowrap;gap:14px}.td-shots>.td-preview>.td-card{flex:none}.td-preview>.td-card:first-child{order:2}.td-preview>.td-card:last-child{order:1}.td-take-player{max-height:42dvh;aspect-ratio:16/9;background:#080b10;object-fit:contain}.td-preview .td-result-empty{aspect-ratio:16/9;min-height:160px;display:grid;place-items:center;background:#10141b}.td-shot-sidebar{grid-area:timeline;display:grid;grid-template-columns:minmax(0,1fr) 210px;grid-template-rows:29px minmax(0,1fr);max-height:none;padding:10px 12px;gap:0 14px;overflow:hidden}.td-timeline-heading{grid-column:1/-1;display:flex;align-items:baseline;gap:14px}.td-timeline-heading strong{font-size:11px;letter-spacing:1px}.td-timeline-heading>span{color:var(--td-faint);font-size:10px}.td-shot-list{display:flex;gap:8px;overflow-x:auto;overflow-y:hidden;padding:3px 0 7px;scroll-snap-type:x proximity}.td-shot-card{flex:0 0 182px;grid-template-columns:minmax(0,1fr);align-content:space-between;gap:5px;padding:9px 10px;margin:0;border-color:var(--td-line);background:var(--td-panel-2);scroll-snap-align:start}.td-shot-card.relay{margin-top:0}.td-shot-card.selected{border-color:var(--td-accent);background:var(--td-accent-dim)}.td-shot-card.selected strong em{color:var(--td-accent)}.td-shot-card-actions{justify-content:flex-end;opacity:1}.td-shot-card-meta{flex-wrap:nowrap;overflow:hidden;font-size:10px}.td-shot-card-meta>*{flex:none}.td-shot-card-main strong{font-size:12px}.td-relay-link{top:50%;left:-9px;width:14px;height:0;border-left:0;border-top:2px dashed var(--td-relay)}.td-shot-sidebar-footer{display:flex;justify-content:center;flex-direction:column;border-top:0;border-left:1px solid var(--td-line);padding:0 0 0 14px;gap:10px}.td-total{font-size:11px}.td-shell .td-shot-sidebar-footer button{font-size:11px;padding:7px 6px}.settings{max-width:1120px;padding:24px;gap:18px}.td-settings-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.td-workflow-settings{border-top:1px solid var(--td-line);padding-top:20px;display:grid;gap:14px}.td-workflow-settings>header{display:flex;justify-content:space-between;align-items:center;gap:12px}.td-workflow-settings>header p{margin:5px 0 0;color:var(--td-faint);font-size:12px}.td-workflow-group{display:grid;gap:12px;padding:14px;border:1px solid var(--td-line);border-radius:9px}.td-workflow-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.td-workflow-fields input,.td-workflow-fields select{min-width:0}.td-workflow-group h3{color:var(--td-muted)}@media(min-width:1700px){.td-shell{grid-template-columns:232px minmax(0,1fr)}.td-shots{grid-template-columns:minmax(0,1.15fr) minmax(430px,1fr)}.td-shot-head{grid-template-columns:minmax(0,1fr) 100px 170px}}@media(max-width:1150px){.td-shell{grid-template-columns:174px minmax(0,1fr)}.td-workspace-rail{padding:20px 9px}.td-rail-brand{gap:7px;padding:0}.td-rail-brand h1{font-size:14px}.td-rail-brand small{font-size:8px}.td-brand-mark{width:30px;height:32px}.td-stage-nav small{font-size:9px}.td-topbar{padding:15px 16px}.td-workspace-title h2{font-size:20px}.td-session-bar{margin:0 16px}.td-session-context{display:none}.td-shell main{padding:14px 16px}.td-shots{grid-template-columns:minmax(0,1fr) minmax(265px,.85fr);height:100%}.td-shot-head{grid-template-columns:1fr 1fr}.td-shot-head .grow{grid-column:1/-1}.td-shot-sidebar{grid-template-columns:minmax(0,1fr) 170px}.td-two-buttons{grid-template-columns:1fr}.td-advanced-body{min-width:0;grid-template-columns:1fr}.td-settings-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:850px){.td-shell{grid-template-columns:68px minmax(0,1fr)}.td-workspace-rail{padding:18px 7px;gap:16px}.td-rail-brand{justify-content:center}.td-rail-brand>div,.td-project-home,.td-rail-progress{display:none!important}.td-shell .td-stage-nav>button{min-height:58px;justify-content:center;padding:7px}.td-stage-nav>button>span:nth-child(2),.td-stage-nav em{display:none}.td-stage-number{font-size:14px}.td-topbar{flex-wrap:wrap;gap:10px}.td-workspace-title h2{font-size:18px}.td-eyebrow{font-size:9px}.td-shell .td-actions>button{padding:6px 8px}.td-project-menu>summary{padding:6px 8px}.td-shots{height:auto;grid-template-columns:minmax(0,1fr);grid-template-rows:auto auto 165px;grid-template-areas:"composer" "monitor" "timeline"}.td-shot-form{overflow:visible}.td-shots>.td-preview{grid-column:auto;overflow:visible}.td-take-player{max-height:none}.td-shot-sidebar{grid-template-columns:minmax(0,1fr) 135px}.td-timeline-heading>span{display:none}.td-shot-list{min-height:0}.td-tab-status{margin-left:0;justify-content:flex-start}.td-session-bar{overflow:visible}.td-progress-text{font-size:10px}.td-settings-grid,.td-workflow-fields{grid-template-columns:minmax(0,1fr)}.settings{padding:14px}.td-review-grid,.td-post-shot-list{grid-template-columns:minmax(0,1fr)}.td-review-steps{grid-template-columns:1fr 1fr}}@media(max-width:520px){.td-shell{grid-template-columns:52px minmax(0,1fr)}.td-workspace-rail{padding:14px 4px}.td-brand-mark{width:30px;height:30px;font-size:13px}.td-topbar{padding:12px 10px}.td-shell .td-actions{gap:5px;flex-wrap:wrap}.td-shell .td-actions>button,.td-project-menu>summary{font-size:11px}.td-shell main{padding:10px}.td-session-bar{margin:0 10px}.td-workspace-title h2{font-size:17px}.td-shot-form{padding:12px}.td-shot-sidebar{grid-template-columns:minmax(0,1fr);grid-template-rows:24px minmax(0,1fr) auto}.td-shot-sidebar-footer{flex-direction:row;align-items:center;border-left:0;border-top:1px solid var(--td-line);padding:5px 0 0}.td-shot-sidebar-footer .td-total{display:none}.td-shot-sidebar-footer .td-two-buttons{display:flex}.td-shots{grid-template-rows:auto auto 195px}.td-review-steps{grid-template-columns:1fr}.td-review-hint{margin-left:0}}@media(max-width:850px){.td-post-header{flex-direction:column;align-items:stretch}.td-post-actions,.td-post-summary{flex-wrap:wrap;gap:8px}.td-post-summary>button,.td-post-range{margin-left:0}.td-post-mode-tabs button{min-width:0;flex:1}.td-post-range{flex-wrap:wrap}.td-workflow-settings>header{flex-wrap:wrap}.td-post-merged>header>div{flex-wrap:wrap;gap:8px}}@media(max-width:850px){.td-project-cleanup{grid-template-columns:minmax(0,1fr)}.td-project-cleanup article{flex-direction:column;align-items:stretch;gap:10px}.td-project-cleanup article>div{min-width:0;overflow-wrap:anywhere}}.td-modal{--td-bg:#10131b;--td-panel:#1b202b;--td-panel-2:#222937;--td-panel-3:#2a3342;--td-line:#303a49;--td-line-strong:#465264;--td-text:#f0f2f6;--td-muted:#b2bdcc;--td-faint:#8b99ab;--td-accent:#c1e9cf;--td-accent-dim:#263c35;--td-radius:16px}.td-shell{background:radial-gradient(ellipse at 70% -30%,#263243 0,transparent 48%),var(--td-bg)}.td-workspace-rail{gap:22px;padding:26px 16px 18px;background:#171b25;border-right:1px solid #2a3240}.td-rail-brand{gap:12px;padding:0 3px}.td-rail-brand h1{letter-spacing:.02em}.td-rail-brand small{color:#92a1b2;letter-spacing:1.1px}.td-brand-mark{width:40px;height:40px;border:1px solid #d4f2df;border-radius:14px;background:linear-gradient(145deg,#d4f2df,#9ed9bd);box-shadow:0 5px 18px #0003;color:#192c25}.td-shell .td-project-home{gap:6px;padding:15px;border-radius:13px;background:#222a37;border-color:#344151;box-shadow:0 8px 22px #0002}.td-project-home small{text-transform:uppercase}.td-project-home strong{font-size:14px}.td-project-home>span{color:#a6b6c6}.td-stage-nav{gap:5px}.td-shell .td-stage-nav>button{min-height:62px;padding:10px 11px;border-radius:12px}.td-shell .td-stage-nav>button:hover:not(:disabled){background:#252d39}.td-shell .td-stage-nav>button.active{background:#293d39;border-color:#42675b;box-shadow:inset 3px 0 0 var(--td-accent)}.td-stage-number{display:grid;place-items:center;flex:none;width:26px;height:26px;border-radius:8px;background:#28303c;color:#aab8c8;font-size:10px}.td-stage-nav>button.active .td-stage-number{background:#c1e9cf;color:#213a30}.td-stage-nav strong{font-size:13px;font-weight:600}.td-stage-nav small{margin-top:4px;color:#96a4b5}.td-rail-progress{padding:17px 5px 0}.td-rail-progress progress{border-radius:999px;overflow:hidden}.td-rail-progress p{line-height:1.6}.td-topbar{padding:21px 26px 18px;background:transparent}.td-workspace-title h2{font-size:24px;letter-spacing:.02em}.td-eyebrow{color:#96a5b7;font-weight:600;letter-spacing:1.2px}.td-shell button,.td-button,.td-project-menu>summary{border-radius:9px}.td-shell button,.td-button{transition:border-color .16s,background .16s,color .16s,box-shadow .16s}.td-shell button:hover:not(:disabled),.td-button:hover{box-shadow:0 3px 12px #0002}.td-shell button.primary{background:var(--td-accent);border-color:var(--td-accent);color:#1a3025;box-shadow:0 4px 15px #77c49c26}.td-shell button.primary:hover:not(:disabled){filter:brightness(1.05)}.td-session-bar{min-height:48px;margin:0 26px;border-top:1px solid #303947;border-bottom:1px solid #303947}.td-session-context{color:#a3b0c1}.td-shell main{padding:20px 26px 22px}.td-shots{gap:18px;grid-template-rows:minmax(0,1fr) 166px}.td-shot-form,.td-card,.td-shot-sidebar,.td-asset-card,.td-review-card,.td-post-shot,.settings{box-shadow:0 12px 32px #06091030}.td-shot-form{padding:20px;gap:16px;background:linear-gradient(155deg,#202733,#1b202b 38%)}.td-composer-heading{padding-bottom:16px}.td-composer-heading small{color:#a1b3c5;letter-spacing:.08em}.td-composer-heading h3{font-size:17px}.td-shell .td-composer-heading button{min-width:36px;padding:6px 10px}.td-form label,.td-settings-grid label{gap:6px;color:#b5c1d0}.td-shot-head{gap:10px}.td-shell input:not([type=checkbox]):not([type=radio]):not([type=range]),.td-shell textarea,.td-shell select{border-color:#3a4859;background-color:#252e3c}.td-shell input:focus,.td-shell textarea:focus,.td-shell select:focus{border-color:var(--td-accent);box-shadow:0 0 0 3px #b2eac82b}.td-form label.td-toggle{border-radius:9px;background:#252e39}.td-form label.td-toggle:has(input:checked){border-color:#507f69;background:#294338}.td-advanced>summary{border-radius:9px}.td-note{border-radius:10px;background:#232c39}.td-note>summary{padding:10px 12px;color:#c2cbd8}.td-note textarea{padding:11px 12px}.td-field-label{margin-bottom:2px;color:#d3dae4}.td-field-label small{color:#9aaabd}.td-highlight-wrap{border-radius:10px}.td-highlight-backdrop,.td-form textarea.td-highlight-input{padding:12px 13px;line-height:1.7}.td-card{overflow:hidden;background:#1b212c}.td-card>header{padding:13px 15px;background:#202733}.td-card-body{gap:11px;padding:14px}.td-preview .td-result-empty{border-radius:10px;background:#10151d}.td-take-player{border-radius:10px}.td-shot-sidebar{padding:12px 14px;background:#1b212b}.td-timeline-heading{gap:12px}.td-timeline-heading strong{color:#e5eaf1;letter-spacing:.04em}.td-timeline-heading>span{color:#9baabc}.td-shot-list{gap:9px}.td-shot-card{flex-basis:186px;padding:10px 11px;border-radius:11px;background:#252e3b}.td-shot-card:hover{background:#2c3745}.td-shot-card.selected{border-color:#9ed6b8;background:#294238;box-shadow:inset 0 2px #b9e5ca}.td-shot-card-main strong{font-size:12.5px}.td-shot-card-meta{color:#b3c1d0}.td-shot-sidebar-footer{gap:10px}.td-chip{padding:3px 9px}.td-settings-grid,.td-workflow-fields{gap:16px}.td-workflow-group{padding:17px;border-radius:12px;background:#1e2530}.td-assets-toolbar,.td-post-header,.td-post-summary,.td-post-merged,.td-step,.td-action-group,.td-run-bar{border-radius:12px}@media(max-width:1150px){.td-workspace-rail{padding:20px 9px}.td-topbar{padding:15px 16px}.td-session-bar{margin:0 16px}.td-shell main{padding:14px 16px}.td-shots{gap:14px}}@media(max-width:850px){.td-workspace-rail{padding:18px 7px}.td-shell .td-stage-nav>button{padding:7px}.td-stage-number{width:30px;height:30px;font-size:11px}.td-shots{grid-template-rows:auto auto 170px}.td-shot-form{padding:16px}}@media(max-width:520px){.td-workspace-rail{padding:14px 4px}.td-topbar{padding:12px 10px}.td-session-bar{margin:0 10px}.td-shell main{padding:10px}.td-shot-form{padding:13px}.td-shots{grid-template-rows:auto auto 195px}.td-shot-sidebar{padding:10px}}', ws = {
  UNETLoader: ["unet_name", "weight_dtype"],
  CLIPLoader: ["clip_name", "type", "device"],
  VAELoader: ["vae_name"],
  ResolutionSelector: ["aspect_ratio", "megapixels", "multiple"],
  BasicScheduler: ["scheduler", "steps", "denoise"],
  KSamplerSelect: ["sampler_name"],
  MiniMaxH3TurboSampler: ["solver", "sampler_name", "eta"],
  MiniMaxH3TurboLoRA: ["lora_name", "strength", "low_vram"],
  LoraLoaderModelOnly: ["lora_name", "strength_model"],
  MiniMaxH3SigmaShift: ["shift_video", "shift_audio"],
  RTXVideoSuperResolution: ["scale", "scale_factor", "quality"]
};
function cr(e) {
  var r;
  const t = (r = e.options) == null ? void 0 : r.values;
  return Array.isArray(t) && t.every((o) => typeof o == "string") ? t : void 0;
}
function ys(e, t) {
  const r = () => e().flatMap((o) => (o.widgets ?? []).filter((i) => {
    var a, l;
    return ((a = ws[o.type ?? ""]) == null ? void 0 : a.includes(i.name)) && !((l = o.inputs) != null && l.some((s) => s.name === i.name && s.link != null)) && ["string", "number", "boolean"].includes(typeof i.value);
  }).map((i) => ({ node: o, widget: i, id: `${o.id}:${i.name}` })));
  return {
    read: () => r().map(({ node: o, widget: i, id: a }) => {
      var l, s;
      return {
        id: a,
        group: `${o.title || o.type} · #${o.id}`,
        label: i.name,
        value: i.value,
        choices: cr(i),
        min: (l = i.options) == null ? void 0 : l.min,
        max: (s = i.options) == null ? void 0 : s.max
      };
    }),
    apply: (o) => {
      var l;
      const i = new Map(r().map((s) => [s.id, s])), a = Object.entries(o).map(([s, m]) => {
        var c, p;
        const h = i.get(s);
        if (!h) throw new Error(`配置控件已变化，请重新打开项目配置：${s}`);
        const { widget: d } = h;
        if (typeof m != typeof d.value) throw new Error(`${d.name} 的值类型不正确`);
        if (typeof m == "number" && ["steps", "multiple"].includes(d.name) && !Number.isInteger(m)) throw new Error(`${d.name} 必须为整数`);
        if (typeof m == "number" && (!Number.isFinite(m) || ((c = d.options) == null ? void 0 : c.min) != null && m < d.options.min || ((p = d.options) == null ? void 0 : p.max) != null && m > d.options.max)) throw new Error(`${d.name} 超出可用范围`);
        const f = cr(d);
        if (f && !f.includes(String(m))) throw new Error(`${d.name} 的选项不可用：${m}`);
        return { ...h, value: m, previous: d.value };
      });
      try {
        for (const { widget: s, value: m } of a)
          s.value = m, (l = s.callback) == null || l.call(s, m);
      } catch (s) {
        for (const { widget: m, previous: h } of a) m.value = h;
        throw s;
      }
      for (const { node: s } of a) s.setDirtyCanvas(!0, !0);
      a.length && t();
    }
  };
}
const pr = "yuq-director-styles";
function _s() {
  if (document.getElementById(pr)) return;
  const e = document.createElement("style");
  e.id = pr, e.textContent = vs, document.head.append(e);
}
_s();
function ks() {
  const e = JSON.parse(xs);
  if (!Array.isArray(e.nodes) || !e.nodes.length) throw new Error("内置生图工作流为空");
  return e;
}
const Ss = "/scripts/app.js", $s = "/scripts/api.js";
Promise.all([
  import(
    /* @vite-ignore */
    Ss
  ),
  import(
    /* @vite-ignore */
    $s
  )
]).then(([{ app: e }, { api: t }]) => {
  const r = async (d) => {
    var _, N, k, w;
    const f = {
      ...d.plan,
      pipeline: { ...d.plan.pipeline ?? { firstPassConfirmed: !1, secondPassMode: "super_resolution_second_pass" }, phase: "first_pass", firstPassConfirmed: !1 },
      // 一采只生成基础结果；二采只在审片确认后由后处理支流单独执行。
      shots: d.plan.shots.map((z) => ({ ...z, secondSamplingMode: "off" }))
    }, c = d.shotIds ?? f.shots.filter((z) => z.enabled).map((z) => z.id), p = JSON.stringify(f), b = await e.graphToPrompt(e.rootGraph);
    for (const [z, g] of c.entries()) {
      if ((_ = d.signal) != null && _.aborted) throw Ge();
      const $ = Nt(f, g);
      if ($ < 0) throw new Error(`镜头 ${g} 未启用或不存在，无法生成`);
      const T = ms(b.output, { planJson: p, activeIndex: $ });
      (N = d.onShotStart) == null || N.call(d, g, z, c.length), (k = d.onProgress) == null || k.call(d, { value: 0, max: 0 }), await tn(t, () => t.queuePrompt(0, { output: T, workflow: b.workflow }), d.onProgress, `镜头 ${g} 一采执行失败`, d.signal), (w = d.onShotDone) == null || w.call(d, g, z, c.length);
    }
  }, o = async (d) => {
    var $;
    const f = (($ = e.graph) == null ? void 0 : $._nodes) ?? [], c = f.find((T) => T.type === "TheodoreDirector_PostprocessSecondPassSource"), p = f.find((T) => T.type === "TheodoreDirector_SaveSecondPass");
    if (!c || !p || c.id === void 0 || p.id === void 0)
      throw new Error("当前工作流缺少后处理单独二采支流，请重新载入仓库中的 V7 导播台示例工作流");
    const b = c.mode, _ = p.mode;
    let N;
    try {
      c.mode = 0, p.mode = 0, N = await e.graphToPrompt(e.rootGraph);
    } finally {
      c.mode = b, p.mode = _;
    }
    const { onProgress: k, signal: w, ...z } = d, g = bs(N.output, {
      sourceId: String(c.id),
      targetId: String(p.id),
      requestJson: JSON.stringify(z),
      processingMode: d.processingMode,
      denoise: d.denoise
    });
    if (w != null && w.aborted) throw Ge();
    await tn(t, () => t.queuePrompt(0, { output: g, workflow: N.workflow }), k, "单独二采任务执行失败", w);
  };
  let i, a;
  const l = () => (i ?? (i = ks()), a ?? (a = Ji(i)), { graph: i, prompt: a }), s = (d, f) => {
    const c = d instanceof Request ? d.url : String(d);
    return t.fetchApi ? t.fetchApi(c, f) : fetch(d, f);
  }, m = async (d, f) => {
    const c = [], p = [];
    for (const _ of d.nodes) {
      const N = _.widgets_values_named ?? {};
      _.type === "UNETLoader" && p.push([_.type, "unet_name", N.unet_name]), _.type === "CLIPLoader" && p.push([_.type, "clip_name", N.clip_name]), _.type === "CLIPLoader" && p.push([_.type, "type", N.type]), _.type === "VAELoader" && p.push([_.type, "vae_name", N.vae_name]);
    }
    const b = [...new Set(d.nodes.filter((_) => _.mode !== 4).map((_) => _.type).filter((_) => _ !== "Note"))];
    if (await Promise.all(b.map(async (_) => {
      var w, z, g;
      const N = await s(`/object_info/${encodeURIComponent(_)}`, { signal: f });
      if (!N.ok) {
        c.push(`节点 ${_} 不可用（HTTP ${N.status}）`);
        return;
      }
      const k = await N.json();
      if (!k[_]) {
        c.push(`当前 ComfyUI 缺少节点 ${_}`);
        return;
      }
      for (const [$, T, C] of p.filter((S) => S[0] === _)) {
        const S = (g = (z = (w = k[$]) == null ? void 0 : w.input) == null ? void 0 : z.required) == null ? void 0 : g[T], L = Array.isArray(S) && Array.isArray(S[0]) ? S[0] : [];
        (typeof C != "string" || !L.includes(C)) && c.push(`模型/类型 ${String(C)} 未安装或不在 ${$}.${T} 可用列表中`);
      }
    })), f != null && f.aborted) throw Ge();
    if (c.length) throw new Error(c.join(`
`));
  }, h = {
    defaults: async () => ({ ...Ki(l().graph), width: 1080, height: 720, batchSize: 1, modelOptions: await Qi(s) }),
    register: async (d, f) => {
      const c = await s("/theodore-director/v1/image-generation/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectName: d, filename: f.filename, subfolder: f.subfolder, type: f.type })
      }), p = await c.json();
      if (!c.ok || !p.path) throw new Error(p.error ?? `登记图片失败：HTTP ${c.status}`);
      return p.path;
    },
    recover: async (d) => ({
      promptId: d.promptId,
      createdAt: d.createdAt,
      settings: d.settings,
      images: await or(d.promptId, void 0, s)
    }),
    queue: async (d) => {
      const { graph: f, prompt: c } = l(), { signal: p, onProgress: b, onQueued: _, ...N } = d, k = Wt(N), w = Yi(c, f, k), z = Xi(f, w);
      if (await m(z, p), p != null && p.aborted) throw Ge();
      let g = "";
      if (await tn(t, async () => {
        const T = await t.queuePrompt(0, { output: w, workflow: z });
        return g = String(T.prompt_id ?? ""), g && (_ == null || _(g)), T;
      }, b, "自动生图任务执行失败", p, 6e4, {
        probe: async (T) => {
          const C = await s(`/history/${encodeURIComponent(T)}`);
          if (!C.ok) throw new Error(`查询生图任务状态失败：HTTP ${C.status}`);
          return oo(await C.json(), T);
        },
        pollMs: 2500
      }), !g) throw new Error("ComfyUI 没有返回生图任务 ID");
      const $ = await or(g, p, s);
      return { promptId: g, createdAt: Date.now(), settings: k, images: $ };
    }
  };
  e.registerExtension({
    name: "YuQ.Director.UI",
    beforeRegisterNodeDef(d, f) {
      if (f.name === "TheodoreDirector_PostprocessSecondPassSource") {
        const p = d.prototype.onNodeCreated;
        d.prototype.onNodeCreated = function() {
          var _, N;
          p == null || p.apply(this);
          const b = (_ = this.widgets) == null ? void 0 : _.find((k) => k.name === "request_json");
          b && (b.type = "hidden", b.computeSize = () => [0, -4]), this.size = [Math.max(((N = this.size) == null ? void 0 : N[0]) ?? 300, 380), 80];
        };
        return;
      }
      if (f.name !== "TheodoreDirector_Project") return;
      const c = d.prototype.onNodeCreated;
      d.prototype.onNodeCreated = function() {
        var b, _;
        c == null || c.apply(this);
        const p = (b = this.widgets) == null ? void 0 : b.find((N) => N.name === "plan_json");
        p && (p.type = "hidden", p.computeSize = () => [0, -4], this.addWidget("button", "打开 YuQ 导播台", null, () => {
          var N;
          try {
            const k = JSON.parse(String(p.value)), w = ((N = e.graph) == null ? void 0 : N._nodes) ?? [], z = w.some((C) => C.type === "TheodoreDirector_PostprocessSecondPassSource") && w.some((C) => C.type === "TheodoreDirector_SaveSecondPass"), g = (C) => {
              var S, L;
              p.value = JSON.stringify(C, null, 2), this.setDirtyCanvas(!0, !0), (L = (S = e.graph) == null ? void 0 : S.setDirtyCanvas) == null || L.call(S, !0, !0);
            }, $ = w.some((C) => {
              var S;
              return C.type === "TheodoreDirector_SelectShot" && ((S = C.outputs) == null ? void 0 : S.some((L) => {
                var V;
                return ["super-res 2nd pass", "latent upscale 2nd pass", "super-res only"].includes(L.name) && ((V = L.links) == null ? void 0 : V.length);
              }));
            }), T = ys(() => {
              var C;
              return ((C = e.graph) == null ? void 0 : C._nodes) ?? [];
            }, () => {
              var C, S;
              return (S = (C = e.graph) == null ? void 0 : C.setDirtyCanvas) == null ? void 0 : S.call(C, !0, !0);
            });
            hs(k, g, $, z ? o : void 0, r, g, h, T);
          } catch (k) {
            window.alert(`YuQ Director: ${k instanceof Error ? k.message : String(k)}`);
          }
        }), this.size = [Math.max(((_ = this.size) == null ? void 0 : _[0]) ?? 300, 360), 110]);
      };
    }
  });
});
