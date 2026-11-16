var Ht, me, br, Qe, An, xr, vr, tn, Tt, wt, wr, xn, dn, ln, Mt = {}, Rt = [], bi = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i, Wt = Array.isArray;
function Ve(e, t) {
  for (var r in t) e[r] = t[r];
  return e;
}
function vn(e) {
  e && e.parentNode && e.parentNode.removeChild(e);
}
function xi(e, t, r) {
  var i, o, s, l = {};
  for (s in t) s == "key" ? i = t[s] : s == "ref" ? o = t[s] : l[s] = t[s];
  if (arguments.length > 2 && (l.children = arguments.length > 3 ? Ht.call(arguments, 2) : r), typeof e == "function" && e.defaultProps != null) for (s in e.defaultProps) l[s] === void 0 && (l[s] = e.defaultProps[s]);
  return At(e, l, i, o, null);
}
function At(e, t, r, i, o) {
  var s = { type: e, props: t, key: r, ref: i, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: o ?? ++br, __i: -1, __u: 0 };
  return o == null && me.vnode != null && me.vnode(s), s;
}
function Jt(e) {
  return e.children;
}
function jt(e, t) {
  this.props = e, this.context = t;
}
function it(e, t) {
  if (t == null) return e.__ ? it(e.__, e.__i + 1) : null;
  for (var r; t < e.__k.length; t++) if ((r = e.__k[t]) != null && r.__e != null) return r.__e;
  return typeof e.type == "function" ? it(e) : null;
}
function vi(e) {
  if (e.__P && e.__d) {
    var t = e.__v, r = t.__e, i = [], o = [], s = Ve({}, t);
    s.__v = t.__v + 1, me.vnode && me.vnode(s), wn(e.__P, s, t, e.__n, e.__P.namespaceURI, 32 & t.__u ? [r] : null, i, r ?? it(t), !!(32 & t.__u), o), s.__v = t.__v, s.__.__k[s.__i] = s, $r(i, s, o), t.__e = t.__ = null, s.__e != r && yr(s);
  }
}
function yr(e) {
  if ((e = e.__) != null && e.__c != null) return e.__e = e.__c.base = null, e.__k.some(function(t) {
    if (t != null && t.__e != null) return e.__e = e.__c.base = t.__e;
  }), yr(e);
}
function jn(e) {
  (!e.__d && (e.__d = !0) && Qe.push(e) && !Lt.__r++ || An != me.debounceRendering) && ((An = me.debounceRendering) || xr)(Lt);
}
function Lt() {
  try {
    for (var e, t = 1; Qe.length; ) Qe.length > t && Qe.sort(vr), e = Qe.shift(), t = Qe.length, vi(e);
  } finally {
    Qe.length = Lt.__r = 0;
  }
}
function _r(e, t, r, i, o, s, l, a, d, p, m) {
  var b, h, c, g, S, T, y = i && i.__k || Rt, v = t.length;
  for (d = wi(r, t, y, d, v), b = 0; b < v; b++) (c = r.__k[b]) != null && (h = c.__i != -1 && y[c.__i] || Mt, c.__i = b, T = wn(e, c, h, o, s, l, a, d, p, m), g = c.__e, c.ref && h.ref != c.ref && (h.ref && yn(h.ref, null, c), m.push(c.ref, c.__c || g, c)), S == null && g != null && (S = g), 4 & c.__u ? (d = kr(c, d, e), h.__e && (h.__e = null)) : typeof c.type == "function" && T !== void 0 ? d = T : g && (d = g.nextSibling), c.__u &= -7);
  return r.__e = S, d;
}
function wi(e, t, r, i, o) {
  var s, l, a, d, p, m = r.length, b = m, h = 0;
  for (e.__k = new Array(o), s = 0; s < o; s++) (l = t[s]) != null && typeof l != "boolean" && typeof l != "function" ? (typeof l == "string" || typeof l == "number" || typeof l == "bigint" || l.constructor == String ? l = e.__k[s] = At(null, l, null, null, null) : Wt(l) ? l = e.__k[s] = At(Jt, { children: l }, null, null, null) : l.constructor === void 0 && l.__b > 0 ? l = e.__k[s] = At(l.type, l.props, l.key, l.ref ? l.ref : null, l.__v) : e.__k[s] = l, d = s + h, l.__ = e, l.__b = e.__b + 1, a = null, (p = l.__i = yi(l, r, d, b)) != -1 && (b--, (a = r[p]) && (a.__u |= 2)), a == null || a.__v == null ? (p == -1 && (o > m ? h-- : o < m && h++), typeof l.type != "function" && (l.__u |= 4)) : p != d && (p == d - 1 ? h-- : p == d + 1 ? h++ : (p > d ? h-- : h++, l.__u |= 4))) : e.__k[s] = null;
  if (b) for (s = 0; s < m; s++) (a = r[s]) != null && (2 & a.__u) == 0 && (a.__e == i && (i = it(a)), Pr(a, a));
  return i;
}
function kr(e, t, r) {
  var i, o;
  if (typeof e.type == "function") {
    for (i = e.__k, o = 0; i && o < i.length; o++) i[o] && (i[o].__ = e, t = kr(i[o], t, r));
    return t;
  }
  e.__e != t && (t && e.type && !t.parentNode && (t = it(e)), t = r.insertBefore(e.__e, t || null));
  do
    t = t && t.nextSibling;
  while (t != null && t.nodeType == 8);
  return t;
}
function yi(e, t, r, i) {
  var o, s, l, a = e.key, d = e.type, p = t[r], m = p != null && (2 & p.__u) == 0;
  if (p === null && a == null || m && a == p.key && d == p.type) return r;
  if (i > (m ? 1 : 0)) {
    for (o = r - 1, s = r + 1; o >= 0 || s < t.length; ) if ((p = t[l = o >= 0 ? o-- : s++]) != null && (2 & p.__u) == 0 && a == p.key && d == p.type) return l;
  }
  return -1;
}
function Nn(e, t, r) {
  t[0] == "-" ? e.setProperty(t, r ?? "") : e[t] = r == null ? "" : typeof r != "number" || bi.test(t) ? r : r + "px";
}
function Et(e, t, r, i, o) {
  var s, l;
  e: if (t == "style") if (typeof r == "string") e.style.cssText = r;
  else {
    if (typeof i == "string" && (e.style.cssText = i = ""), i) for (t in i) r && t in r || Nn(e.style, t, "");
    if (r) for (t in r) i && r[t] == i[t] || Nn(e.style, t, r[t]);
  }
  else if (t[0] == "o" && t[1] == "n") s = t != (t = t.replace(wr, "$1")), l = t.toLowerCase(), t = l in e || t == "onFocusOut" || t == "onFocusIn" ? l.slice(2) : t.slice(2), e.l || (e.l = {}), e.l[t + s] = r, r ? i ? r[wt] = i[wt] : (r[wt] = xn, e.addEventListener(t, s ? ln : dn, s)) : e.removeEventListener(t, s ? ln : dn, s);
  else {
    if (o == "http://www.w3.org/2000/svg") t = t.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
    else if (t != "width" && t != "height" && t != "href" && t != "list" && t != "form" && t != "tabIndex" && t != "download" && t != "rowSpan" && t != "colSpan" && t != "role" && t != "popover" && t in e) try {
      e[t] = r ?? "";
      break e;
    } catch {
    }
    typeof r == "function" || (r == null || r === !1 && t[4] != "-" ? e.removeAttribute(t) : e.setAttribute(t, t == "popover" && r == 1 ? "" : r));
  }
}
function Mn(e) {
  return function(t) {
    if (this.l) {
      var r = this.l[t.type + e];
      if (t[Tt] == null) t[Tt] = xn++;
      else if (t[Tt] < r[wt]) return;
      return r(me.event ? me.event(t) : t);
    }
  };
}
function wn(e, t, r, i, o, s, l, a, d, p) {
  var m, b, h, c, g, S, T, y, v, x, u, $, j, E, P, C, N = t.type;
  if (t.constructor !== void 0) return null;
  128 & r.__u && (d = !!(32 & r.__u), s = [a = t.__e = r.__e]), (m = me.__b) && m(t);
  e: if (typeof N == "function") {
    b = l.length;
    try {
      if (v = t.props, x = N.prototype && N.prototype.render, u = (m = N.contextType) && i[m.__c], $ = m ? u ? u.props.value : m.__ : i, r.__c ? y = (h = t.__c = r.__c).__ = h.__E : (x ? t.__c = h = new N(v, $) : (t.__c = h = new jt(v, $), h.constructor = N, h.render = ki), u && u.sub(h), h.state || (h.state = {}), h.__n = i, c = h.__d = !0, h.__h = [], h._sb = []), x && h.__s == null && (h.__s = h.state), x && N.getDerivedStateFromProps != null && (h.__s == h.state && (h.__s = Ve({}, h.__s)), Ve(h.__s, N.getDerivedStateFromProps(v, h.__s))), g = h.props, S = h.state, h.__v = t, c) x && N.getDerivedStateFromProps == null && h.componentWillMount != null && h.componentWillMount(), x && h.componentDidMount != null && h.__h.push(h.componentDidMount);
      else {
        if (x && N.getDerivedStateFromProps == null && v !== g && h.componentWillReceiveProps != null && h.componentWillReceiveProps(v, $), t.__v == r.__v || !h.__e && h.shouldComponentUpdate != null && h.shouldComponentUpdate(v, h.__s, $) === !1) {
          t.__v != r.__v && (h.props = v, h.state = h.__s, h.__d = !1), t.__e = r.__e, t.__k = r.__k, t.__k.some(function(R) {
            R && (R.__ = t);
          }), Rt.push.apply(h.__h, h._sb), h._sb = [], h.__h.length && l.push(h), a = it(r);
          break e;
        }
        h.componentWillUpdate != null && h.componentWillUpdate(v, h.__s, $), x && h.componentDidUpdate != null && h.__h.push(function() {
          h.componentDidUpdate(g, S, T);
        });
      }
      if (h.context = $, h.props = v, h.__P = e, h.__e = !1, j = me.__r, E = 0, x) h.state = h.__s, h.__d = !1, j && j(t), m = h.render(h.props, h.state, h.context), Rt.push.apply(h.__h, h._sb), h._sb = [];
      else do
        h.__d = !1, j && j(t), m = h.render(h.props, h.state, h.context), h.state = h.__s;
      while (h.__d && ++E < 25);
      h.state = h.__s, h.getChildContext != null && (i = Ve(Ve({}, i), h.getChildContext())), x && !c && h.getSnapshotBeforeUpdate != null && (T = h.getSnapshotBeforeUpdate(g, S)), P = m != null && m.type === Jt && m.key == null ? Ir(m.props.children) : m, a = _r(e, Wt(P) ? P : [P], t, r, i, o, s, l, a, d, p), h.base = t.__e, t.__u &= -161, h.__h.length && l.push(h), y && (h.__E = h.__ = null);
    } catch (R) {
      if (l.length = b, t.__v = null, d || s != null) {
        if (R.then) {
          for (t.__u |= d ? 160 : 128; a && a.nodeType == 8 && a.nextSibling; ) a = a.nextSibling;
          s != null && (s[s.indexOf(a)] = null), t.__e = a;
        } else if (s != null) for (C = s.length; C--; ) vn(s[C]);
      } else t.__e = r.__e;
      t.__k == null && (t.__k = r.__k || []), R.then || Sr(t), me.__e(R, t, r);
    }
  } else s == null && t.__v == r.__v ? (t.__k = r.__k, t.__e = r.__e) : a = t.__e = _i(r.__e, t, r, i, o, s, l, d, p);
  return (m = me.diffed) && m(t), 128 & t.__u ? void 0 : a;
}
function Sr(e) {
  e && (e.__c && (e.__c.__e = !0), e.__k && e.__k.some(Sr));
}
function $r(e, t, r) {
  for (var i = 0; i < r.length; i++) yn(r[i], r[++i], r[++i]);
  me.__c && me.__c(t, e), e.some(function(o) {
    try {
      e = o.__h, o.__h = [], e.some(function(s) {
        s.call(o);
      });
    } catch (s) {
      me.__e(s, o.__v);
    }
  });
}
function Ir(e) {
  return typeof e != "object" || e == null || e.__b > 0 ? e : Wt(e) ? e.map(Ir) : e.constructor !== void 0 ? null : Ve({}, e);
}
function _i(e, t, r, i, o, s, l, a, d) {
  var p, m, b, h, c, g, S, T = r.props || Mt, y = t.props, v = t.type;
  if (v == "svg" ? o = "http://www.w3.org/2000/svg" : v == "math" ? o = "http://www.w3.org/1998/Math/MathML" : o || (o = "http://www.w3.org/1999/xhtml"), s != null) {
    for (p = 0; p < s.length; p++) if ((c = s[p]) && "setAttribute" in c == !!v && (v ? c.localName == v : c.nodeType == 3)) {
      e = c, s[p] = null;
      break;
    }
  }
  if (e == null) {
    if (v == null) return document.createTextNode(y);
    e = document.createElementNS(o, v, y.is && y), a && (me.__m && me.__m(t, s), a = !1), s = null;
  }
  if (v == null) T === y || a && e.data == y || (e.data = y);
  else {
    if (s = v == "textarea" && y.defaultValue != null ? null : s && Ht.call(e.childNodes), !a && s != null) for (T = {}, p = 0; p < e.attributes.length; p++) T[(c = e.attributes[p]).name] = c.value;
    for (p in T) c = T[p], p == "dangerouslySetInnerHTML" ? b = c : p == "children" || p in y || p == "value" && "defaultValue" in y || p == "checked" && "defaultChecked" in y || Et(e, p, null, c, o);
    for (p in y) c = y[p], p == "children" ? h = c : p == "dangerouslySetInnerHTML" ? m = c : p == "value" ? g = c : p == "checked" ? S = c : a && typeof c != "function" || T[p] === c || Et(e, p, c, T[p], o);
    if (m) a || b && (m.__html == b.__html || m.__html == e.innerHTML) || (e.innerHTML = m.__html), t.__k = [];
    else if (b && (e.innerHTML = ""), _r(t.type == "template" ? e.content : e, Wt(h) ? h : [h], t, r, i, v == "foreignObject" ? "http://www.w3.org/1999/xhtml" : o, s, l, s ? s[0] : r.__k && it(r, 0), a, d), s != null) for (p = s.length; p--; ) vn(s[p]);
    a && v != "textarea" || (p = "value", v == "progress" && g == null ? e.removeAttribute("value") : g != null && (g !== e[p] || v == "progress" && !g || v == "option" && g != T[p]) && Et(e, p, g, T[p], o), p = "checked", S != null && S != e[p] && Et(e, p, S, T[p], o));
  }
  return e;
}
function yn(e, t, r) {
  try {
    if (typeof e == "function") {
      var i = typeof e.__u == "function";
      i && e.__u(), i && t == null || (e.__u = e(t));
    } else e.current = t;
  } catch (o) {
    me.__e(o, r);
  }
}
function Pr(e, t, r) {
  var i, o;
  if (me.unmount && me.unmount(e), (i = e.ref) && (i.current && i.current != e.__e || yn(i, null, t)), (i = e.__c) != null) {
    if (i.componentWillUnmount) try {
      i.componentWillUnmount();
    } catch (s) {
      me.__e(s, t);
    }
    i.base = i.__P = i.__n = null;
  }
  if (i = e.__k) for (o = 0; o < i.length; o++) i[o] && Pr(i[o], t, r || typeof e.type != "function");
  r || vn(e.__e), e.__c = e.__ = e.__e = void 0;
}
function ki(e, t, r) {
  return this.constructor(e, r);
}
function Rn(e, t, r) {
  var i, o, s, l;
  t == document && (t = document.documentElement), me.__ && me.__(e, t), o = (i = !1) ? null : t.__k, s = [], l = [], wn(t, e = t.__k = xi(Jt, null, [e]), o || Mt, Mt, t.namespaceURI, o ? null : t.firstChild ? Ht.call(t.childNodes) : null, s, o ? o.__e : t.firstChild, i, l), $r(s, e, l), e.props.children = null;
}
Ht = Rt.slice, me = { __e: function(e, t, r, i) {
  for (var o, s, l; t = t.__; ) if ((o = t.__c) && !o.__) try {
    if ((s = o.constructor) && s.getDerivedStateFromError != null && (o.setState(s.getDerivedStateFromError(e)), l = o.__d), o.componentDidCatch != null && (o.componentDidCatch(e, i || {}), l = o.__d), l) return o.__E = o;
  } catch (a) {
    e = a;
  }
  throw e;
} }, br = 0, jt.prototype.setState = function(e, t) {
  var r;
  r = this.__s != null && this.__s != this.state ? this.__s : this.__s = Ve({}, this.state), typeof e == "function" && (e = e(Ve({}, r), this.props)), e && Ve(r, e), e != null && this.__v && (t && this._sb.push(t), jn(this));
}, jt.prototype.forceUpdate = function(e) {
  this.__v && (this.__e = !0, e && this.__h.push(e), jn(this));
}, jt.prototype.render = Jt, Qe = [], xr = typeof Promise == "function" ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, vr = function(e, t) {
  return e.__v.__b - t.__v.__b;
}, Lt.__r = 0, tn = Math.random().toString(8), Tt = "__d" + tn, wt = "__a" + tn, wr = /(PointerCapture)$|Capture$/i, xn = 0, dn = Mn(!1), ln = Mn(!0);
var Si = 0;
function n(e, t, r, i, o, s) {
  t || (t = {});
  var l, a, d = t;
  if ("ref" in d) for (a in d = {}, t) a == "ref" ? l = t[a] : d[a] = t[a];
  var p = { type: e, props: d, key: r, ref: l, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --Si, __i: -1, __u: 0, __source: o, __self: s };
  if (typeof e == "function" && (l = e.defaultProps)) for (a in l) d[a] === void 0 && (d[a] = l[a]);
  return me.vnode && me.vnode(p), p;
}
var lt, we, nn, Ln, Ot = 0, Cr = [], ye = me, On = ye.__b, Dn = ye.__r, Gn = ye.diffed, Fn = ye.__c, Un = ye.unmount, Bn = ye.__;
function Kt(e, t) {
  ye.__h && ye.__h(we, e, Ot || t), Ot = 0;
  var r = we.__H || (we.__H = { __: [], __h: [] });
  return e >= r.__.length && r.__.push({}), r.__[e];
}
function G(e) {
  return Ot = 1, $i(Er, e);
}
function $i(e, t, r) {
  var i = Kt(lt++, 2);
  if (i.t = e, !i.__c && (i.__ = [Er(void 0, t), function(a) {
    var d = i.__N ? i.__N[0] : i.__[0], p = i.t(d, a);
    d !== p && (i.__N = [p, i.__[1]], i.__c.setState({}));
  }], i.__c = we, !we.__f)) {
    var o = function(a, d, p) {
      if (!i.__c.__H) return !0;
      var m = !1, b = i.__c.props !== a;
      if (i.__c.__H.__.some(function(c) {
        if (c.__N) {
          m = !0;
          var g = c.__[0];
          c.__ = c.__N, c.__N = void 0, g !== c.__[0] && (b = !0);
        }
      }), s) {
        var h = s.call(this, a, d, p);
        return m ? h || b : h;
      }
      return !m || b;
    };
    we.__f = !0;
    var s = we.shouldComponentUpdate, l = we.componentWillUpdate;
    we.componentWillUpdate = function(a, d, p) {
      if (this.__e) {
        var m = s;
        s = void 0, o(a, d, p), s = m;
      }
      l && l.call(this, a, d, p);
    }, we.shouldComponentUpdate = o;
  }
  return i.__N || i.__;
}
function Ee(e, t) {
  var r = Kt(lt++, 3);
  !ye.__s && _n(r.__H, t) && (r.__ = e, r.u = t, we.__H.__h.push(r));
}
function Ii(e, t) {
  var r = Kt(lt++, 4);
  !ye.__s && _n(r.__H, t) && (r.__ = e, r.u = t, we.__h.push(r));
}
function ke(e) {
  return Ot = 5, He(function() {
    return { current: e };
  }, []);
}
function He(e, t) {
  var r = Kt(lt++, 7);
  return _n(r.__H, t) && (r.__ = e(), r.__H = t, r.__h = e), r.__;
}
function Pi() {
  for (var e; e = Cr.shift(); ) {
    var t = e.__H;
    if (e.__P && t) try {
      t.__h.some(Nt), t.__h.some(cn), t.__h = [];
    } catch (r) {
      t.__h = [], ye.__e(r, e.__v);
    }
  }
}
ye.__b = function(e) {
  we = null, On && On(e);
}, ye.__ = function(e, t) {
  e && t.__k && t.__k.__m && (e.__m = t.__k.__m), Bn && Bn(e, t);
}, ye.__r = function(e) {
  Dn && Dn(e), lt = 0;
  var t = (we = e.__c).__H;
  t && (nn === we ? (t.__h = [], we.__h = [], t.__.some(function(r) {
    r.__N && (r.__ = r.__N), r.u = r.__N = void 0;
  })) : (t.__h.some(Nt), t.__h.some(cn), t.__h = [], lt = 0)), nn = we;
}, ye.diffed = function(e) {
  Gn && Gn(e);
  var t = e.__c;
  t && t.__H && (t.__H.__h.length && (Cr.push(t) !== 1 && Ln === ye.requestAnimationFrame || ((Ln = ye.requestAnimationFrame) || Ci)(Pi)), t.__H.__.some(function(r) {
    r.u && (r.__H = r.u, r.u = void 0);
  })), nn = we = null;
}, ye.__c = function(e, t) {
  t.some(function(r) {
    try {
      r.__h.some(Nt), r.__h = r.__h.filter(function(i) {
        return !i.__ || cn(i);
      });
    } catch (i) {
      t.some(function(o) {
        o.__h && (o.__h = []);
      }), t = [], ye.__e(i, r.__v);
    }
  }), Fn && Fn(e, t);
}, ye.unmount = function(e) {
  Un && Un(e);
  var t, r = e.__c;
  r && r.__H && (r.__H.__.some(function(i) {
    try {
      Nt(i);
    } catch (o) {
      t = o;
    }
  }), r.__H = void 0, t && ye.__e(t, r.__v));
};
var Vn = typeof requestAnimationFrame == "function";
function Ci(e) {
  var t, r = function() {
    clearTimeout(i), Vn && cancelAnimationFrame(t), setTimeout(e);
  }, i = setTimeout(r, 35);
  Vn && (t = requestAnimationFrame(r));
}
function Nt(e) {
  var t = we, r = e.__c;
  typeof r == "function" && (e.__c = void 0, r()), we = t;
}
function cn(e) {
  var t = we;
  e.__c = e.__(), we = t;
}
function _n(e, t) {
  return !e || e.length !== t.length || t.some(function(r, i) {
    return r !== e[i];
  });
}
function Er(e, t) {
  return typeof t == "function" ? t(e) : t;
}
async function zr(e) {
  var s;
  if ((s = navigator.clipboard) != null && s.writeText)
    try {
      await navigator.clipboard.writeText(e);
      return;
    } catch {
    }
  const t = document.activeElement, r = t instanceof HTMLTextAreaElement || t instanceof HTMLInputElement ? { start: t.selectionStart, end: t.selectionEnd, direction: t.selectionDirection } : null, i = document.createElement("textarea");
  i.value = e, i.style.position = "fixed", i.style.opacity = "0", document.body.append(i), i.select();
  const o = document.execCommand("copy");
  if (i.remove(), t instanceof HTMLElement && t.focus({ preventScroll: !0 }), r && (t instanceof HTMLTextAreaElement || t instanceof HTMLInputElement) && t.setSelectionRange(r.start, r.end, r.direction ?? void 0), !o) throw new Error("浏览器拒绝写入剪贴板");
}
function Pe(e, t) {
  const r = e.trim().replace(/\\/g, "/").replace(/^\.\//, "");
  if (!r || r.startsWith("/") || /^[A-Za-z]:\//.test(r)) return null;
  const i = r.split("/").filter(Boolean), o = i.pop();
  if (!o || i.some((l) => l === "..")) return null;
  const s = new URLSearchParams({ filename: o, type: t });
  return i.length && s.set("subfolder", i.join("/")), `/view?${s.toString()}`;
}
function Tr(e) {
  return Pe(e, "input");
}
function ze(e) {
  return e.trim().replace(/\\/g, "/").split("/").filter(Boolean).pop() ?? "";
}
function Ar({ asset: e, compact: t = !1 }) {
  const r = Tr(e.path), i = `td-media-preview ${t ? "compact" : ""}`;
  return r ? e.kind === "image" ? /* @__PURE__ */ n("div", { class: i, children: /* @__PURE__ */ n("img", { src: r, alt: e.alias, loading: "lazy" }) }) : e.kind === "video" ? /* @__PURE__ */ n("div", { class: i, children: /* @__PURE__ */ n("video", { src: r, controls: !0, preload: "metadata", playsInline: !0 }) }) : /* @__PURE__ */ n("div", { class: i, children: /* @__PURE__ */ n("audio", { src: r, controls: !0, preload: "metadata" }) }) : e.path ? /* @__PURE__ */ n("div", { class: `${i} unavailable`, children: "该路径无法在浏览器中预览 / Preview unavailable" }) : /* @__PURE__ */ n("div", { class: `${i} empty`, children: "尚未选择素材 / No media selected" });
}
function jr(e, t) {
  return t === "image" ? Promise.resolve(null) : new Promise((r) => {
    const i = document.createElement(t === "video" ? "video" : "audio"), o = URL.createObjectURL(e);
    let s = !1;
    const l = (a) => {
      s || (s = !0, i.onloadedmetadata = null, i.onerror = null, i.removeAttribute("src"), i.load(), URL.revokeObjectURL(o), r(a));
    };
    i.preload = "metadata", i.onloadedmetadata = () => l(Number.isFinite(i.duration) && i.duration > 0 ? Math.round(i.duration * 10) / 10 : null), i.onerror = () => l(null), i.src = o;
  });
}
const Ei = (e) => `${e}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`, pn = { image: "图片", video: "视频", audio: "音频" }, qn = ["角色", "场景", "道具", "声音"];
function zi(e, t) {
  const r = Ei(e);
  return { id: r, alias: r, kind: e, path: "", enabled: !0, fixed: !1, fixedOrder: t, shotIds: [], includeVideoAudio: !1, durationSeconds: e === "image" ? null : 6, audioDurationSeconds: null, fingerprint: "" };
}
function Hn(e, t) {
  var r;
  return (r = e.group) != null && r.trim() ? e.group.trim() : t === "zh" ? `${pn[e.kind]}素材` : `${e.kind} assets`;
}
function Ti({ plan: e, language: t, mutate: r, uploadAsset: i, importingDisabled: o, onImportLibrary: s, onExportLibrary: l, onOpenBatch: a, onGenerateImage: d, onBatchGenerateImages: p, notify: m }) {
  const b = (R, F) => t === "zh" ? R : F, [h, c] = G({}), [g, S] = G({}), [T, y] = G(""), [v, x] = G(!1), u = e.assets.filter((R) => R.enabled && !R.path.trim()), $ = v ? e.assets.filter((R) => u.includes(R) || h[R.id] !== void 0) : e.assets, j = /* @__PURE__ */ new Map();
  for (const R of $) {
    const F = h[R.id] ?? Hn(R, t);
    j.set(F, [...j.get(F) ?? [], R]);
  }
  const E = [...j.entries()].sort(([R], [F]) => {
    const I = (ne) => {
      const k = qn.indexOf(ne);
      return k < 0 ? qn.length : k;
    };
    return I(R) - I(F) || R.localeCompare(F, "zh");
  }), P = (R, F) => r((I) => {
    const ne = I.assets.find((k) => k.id === R);
    ne && F(ne);
  }), C = async (R, F) => {
    S((I) => ({ ...I, [R.id]: F.name }));
    try {
      const [I, ne] = await Promise.all([i(e.project.name, R.kind, F), jr(F, R.kind)]);
      P(R.id, (k) => {
        k.path = I, R.kind !== "image" && ne != null && (k.durationSeconds = ne);
      }), m(b(`已上传 ${R.alias}`, `Uploaded ${R.alias}`));
    } catch (I) {
      m(`${b("上传失败", "Upload failed")}：${I instanceof Error ? I.message : String(I)}`, "error");
    } finally {
      S((I) => {
        const ne = { ...I };
        return delete ne[R.id], ne;
      });
    }
  }, N = async (R, F) => {
    try {
      await zr(R), m(F);
    } catch (I) {
      m(`${b("复制失败", "Copy failed")}：${String(I)}`, "error");
    }
  };
  return /* @__PURE__ */ n("div", { class: "td-assets-panel", children: [
    /* @__PURE__ */ n("div", { class: "td-assets-toolbar", children: [
      /* @__PURE__ */ n("div", { class: "td-assets-summary", children: [
        /* @__PURE__ */ n("strong", { children: b(`共 ${e.assets.length} 项素材`, `${e.assets.length} assets`) }),
        u.length ? /* @__PURE__ */ n("span", { class: "td-chip warn", children: b(`${u.length} 项待上传`, `${u.length} missing`) }) : /* @__PURE__ */ n("span", { class: "td-chip ok", children: b("全部就绪", "All ready") }),
        /* @__PURE__ */ n("label", { class: "td-inline-check", children: [
          /* @__PURE__ */ n("input", { type: "checkbox", checked: v, onChange: (R) => x(R.currentTarget.checked) }),
          b("只看待上传", "Missing only")
        ] })
      ] }),
      /* @__PURE__ */ n("div", { class: "td-assets-actions", children: [
        /* @__PURE__ */ n("label", { class: "td-button", title: b("载入共用素材清单与远程文件路径，保留当前分镜", "Load a shared library and remote media paths; preserve current shots"), children: [
          b("导入素材库", "Import library"),
          /* @__PURE__ */ n("input", { type: "file", accept: "application/json,.json", disabled: o, onChange: (R) => {
            var ne;
            const F = R.currentTarget, I = (ne = F.files) == null ? void 0 : ne[0];
            F.value = "", I && s(I);
          } })
        ] }),
        /* @__PURE__ */ n("button", { onClick: l, children: b("导出素材库", "Export library") }),
        ["image", "video", "audio"].map((R) => /* @__PURE__ */ n("button", { onClick: () => r((F) => {
          F.assets.push(zi(R, F.assets.length + 1));
        }), children: [
          "＋ ",
          b(pn[R], R)
        ] })),
        /* @__PURE__ */ n("button", { class: "accent", onClick: a, children: [
          "⇪ ",
          b("批量导入 / 按文件名填充", "Batch import / fill by name")
        ] }),
        /* @__PURE__ */ n("button", { class: "primary", disabled: o || !p, onClick: p, children: b("批量生图", "Batch generate images") })
      ] })
    ] }),
    !e.assets.length && /* @__PURE__ */ n("div", { class: "td-empty-state", children: [
      /* @__PURE__ */ n("strong", { children: b("素材库为空", "No assets yet") }),
      /* @__PURE__ */ n("p", { children: b("导入 skill 生成的 .assets.json 共用素材库，或已上传后导出的素材库，即可载入角色、场景和声音参考。每集用顶部“导入分镜”切换。", "Import a shared .assets.json library with character, scene and voice references. Use Import shots to switch episodes.") })
    ] }),
    E.map(([R, F]) => /* @__PURE__ */ n("section", { class: "td-asset-group", children: [
      /* @__PURE__ */ n("h3", { children: [
        R,
        /* @__PURE__ */ n("span", { children: F.length })
      ] }),
      /* @__PURE__ */ n("div", { class: "td-asset-grid", children: F.map((I) => {
        const ne = !!I.path.trim(), k = h[I.id] !== void 0, D = `{{ref:${I.alias}}}`;
        return /* @__PURE__ */ n(
          "article",
          {
            class: `td-asset-card ${k ? "expanded" : ""} ${ne ? "" : "missing"} ${I.enabled ? "" : "disabled"} ${T === I.id ? "dragging" : ""}`,
            onDragOver: (M) => {
              M.preventDefault(), y(I.id);
            },
            onDragLeave: () => y((M) => M === I.id ? "" : M),
            onDrop: (M) => {
              var Z, Y;
              M.preventDefault(), y("");
              const V = (Y = (Z = M.dataTransfer) == null ? void 0 : Z.files) == null ? void 0 : Y[0];
              V && C(I, V);
            },
            children: [
              /* @__PURE__ */ n("div", { class: "td-asset-card-media", children: [
                ne ? /* @__PURE__ */ n(Ar, { asset: I, compact: !0 }) : /* @__PURE__ */ n("label", { class: "td-asset-drop", children: [
                  /* @__PURE__ */ n("span", { children: g[I.id] ? b("上传中…", "Uploading…") : b("拖入文件或点击上传", "Drop or click to upload") }),
                  /* @__PURE__ */ n("small", { children: [
                    b("建议文件名", "Suggested name"),
                    "：",
                    I.alias,
                    ".",
                    I.kind === "image" ? "png" : I.kind === "video" ? "mp4" : "wav"
                  ] }),
                  /* @__PURE__ */ n("input", { type: "file", accept: `${I.kind}/*`, onChange: (M) => {
                    var Y;
                    const V = M.currentTarget, Z = (Y = V.files) == null ? void 0 : Y[0];
                    V.value = "", Z && C(I, Z);
                  } })
                ] }),
                /* @__PURE__ */ n("span", { class: "td-asset-kind", children: [
                  b(pn[I.kind], I.kind),
                  I.kind !== "image" && I.durationSeconds ? ` · ${I.durationSeconds}s` : ""
                ] }),
                /* @__PURE__ */ n("span", { class: `td-asset-status ${ne ? "ok" : "warn"}`, children: g[I.id] ? b("上传中", "Uploading") : ne ? b("已就绪", "Ready") : b("待上传", "Missing") })
              ] }),
              /* @__PURE__ */ n("div", { class: "td-asset-card-body", children: [
                /* @__PURE__ */ n("div", { class: "td-asset-card-title", children: [
                  /* @__PURE__ */ n("input", { "aria-label": b("别名", "Alias"), value: I.alias, onInput: (M) => P(I.id, (V) => {
                    V.alias = M.currentTarget.value;
                  }) }),
                  /* @__PURE__ */ n("button", { title: b(`复制引用 ${D}`, `Copy ${D}`), onClick: () => void N(D, b(`已复制 ${D}`, `Copied ${D}`)), children: "{ }" })
                ] }),
                I.note && /* @__PURE__ */ n("p", { class: "td-asset-note", title: I.note, children: I.note }),
                /* @__PURE__ */ n("div", { class: "td-asset-card-actions", children: [
                  I.kind === "image" && /* @__PURE__ */ n("button", { class: "accent", disabled: o || !d, onClick: () => d == null ? void 0 : d(I), children: b("自动生图", "Generate image") }),
                  ne && /* @__PURE__ */ n("label", { class: "td-file-label", children: [
                    g[I.id] ? b("上传中…", "Uploading…") : b("替换文件", "Replace"),
                    /* @__PURE__ */ n("input", { type: "file", accept: `${I.kind}/*`, onChange: (M) => {
                      var Y;
                      const V = M.currentTarget, Z = (Y = V.files) == null ? void 0 : Y[0];
                      V.value = "", Z && C(I, Z);
                    } })
                  ] }),
                  I.genPrompt && /* @__PURE__ */ n("button", { class: "accent", onClick: () => void N(I.genPrompt ?? "", b("已复制生成提示词", "Generation prompt copied")), children: b("复制生成提示词", "Copy gen prompt") }),
                  /* @__PURE__ */ n("button", { "aria-expanded": k, "aria-controls": `td-asset-details-${I.id}`, onClick: () => c((M) => {
                    const V = { ...M };
                    return k ? delete V[I.id] : V[I.id] = Hn(I, t), V;
                  }), children: k ? b("收起", "Less") : b("详情", "More") })
                ] }),
                k && /* @__PURE__ */ n("div", { class: "td-asset-details", id: `td-asset-details-${I.id}`, children: [
                  I.genPrompt && /* @__PURE__ */ n("details", { class: "td-gen-prompt", children: [
                    /* @__PURE__ */ n("summary", { children: b("生成提示词", "Generation prompt") }),
                    /* @__PURE__ */ n("pre", { children: I.genPrompt })
                  ] }),
                  /* @__PURE__ */ n("label", { children: [
                    b("输入目录相对路径", "Input-relative path"),
                    /* @__PURE__ */ n("input", { value: I.path, placeholder: "theodore_director/项目名/文件名", onInput: (M) => P(I.id, (V) => {
                      V.path = M.currentTarget.value;
                    }) }),
                    /* @__PURE__ */ n("small", { children: ze(I.path) })
                  ] }),
                  /* @__PURE__ */ n("div", { class: "td-asset-detail-grid", children: [
                    /* @__PURE__ */ n("label", { children: [
                      b("类型", "Kind"),
                      /* @__PURE__ */ n("select", { value: I.kind, onChange: (M) => P(I.id, (V) => {
                        V.kind = M.currentTarget.value;
                      }), children: [
                        /* @__PURE__ */ n("option", { value: "image", children: b("图片", "image") }),
                        /* @__PURE__ */ n("option", { value: "video", children: b("视频", "video") }),
                        /* @__PURE__ */ n("option", { value: "audio", children: b("音频", "audio") })
                      ] })
                    ] }),
                    /* @__PURE__ */ n("label", { children: [
                      b("分组", "Group"),
                      /* @__PURE__ */ n("input", { "aria-label": b("分组", "Group"), value: I.group ?? "", placeholder: b("角色 / 场景 / 道具 / 声音", "Group"), onInput: (M) => P(I.id, (V) => {
                        V.group = M.currentTarget.value;
                      }) }),
                      /* @__PURE__ */ n("small", { children: b("收起详情后按新分组归类", "Regroup after closing details") })
                    ] }),
                    I.kind !== "image" && /* @__PURE__ */ n("label", { children: [
                      b("时长（秒）", "Duration (s)"),
                      /* @__PURE__ */ n("input", { type: "number", min: "0", step: "0.1", value: I.durationSeconds ?? "", onInput: (M) => P(I.id, (V) => {
                        V.durationSeconds = M.currentTarget.value ? Number(M.currentTarget.value) : null;
                      }) })
                    ] }),
                    /* @__PURE__ */ n("label", { children: [
                      b("固定顺序", "Fixed order"),
                      /* @__PURE__ */ n("input", { type: "number", value: I.fixedOrder, onInput: (M) => P(I.id, (V) => {
                        V.fixedOrder = Number(M.currentTarget.value);
                      }) })
                    ] }),
                    /* @__PURE__ */ n("label", { class: "wide", children: [
                      b("仅用于这些镜头 ID（逗号分隔，留空=全部）", "Limit to shot IDs (comma separated)"),
                      /* @__PURE__ */ n("input", { value: I.shotIds.join(", "), onInput: (M) => P(I.id, (V) => {
                        V.shotIds = M.currentTarget.value.split(",").map((Z) => Z.trim()).filter(Boolean);
                      }) })
                    ] }),
                    /* @__PURE__ */ n("label", { class: "wide", children: [
                      b("说明", "Note"),
                      /* @__PURE__ */ n("textarea", { rows: 2, value: I.note ?? "", onInput: (M) => P(I.id, (V) => {
                        V.note = M.currentTarget.value;
                      }) })
                    ] })
                  ] }),
                  /* @__PURE__ */ n("div", { class: "td-asset-flags", children: [
                    /* @__PURE__ */ n("label", { class: "td-inline-check", children: [
                      /* @__PURE__ */ n("input", { type: "checkbox", checked: I.enabled, onChange: (M) => P(I.id, (V) => {
                        V.enabled = M.currentTarget.checked;
                      }) }),
                      b("启用", "Enabled")
                    ] }),
                    /* @__PURE__ */ n("label", { class: "td-inline-check", title: b("固定引用会被每个镜头自动加载，即使提示词没有写 {{ref}}", "Fixed assets load in every shot even without {{ref}}"), children: [
                      /* @__PURE__ */ n("input", { type: "checkbox", checked: I.fixed, onChange: (M) => P(I.id, (V) => {
                        V.fixed = M.currentTarget.checked;
                      }) }),
                      b("固定引用", "Always load")
                    ] }),
                    I.kind === "video" && /* @__PURE__ */ n("label", { class: "td-inline-check", children: [
                      /* @__PURE__ */ n("input", { type: "checkbox", checked: I.includeVideoAudio, onChange: (M) => P(I.id, (V) => {
                        V.includeVideoAudio = M.currentTarget.checked;
                      }) }),
                      b("启用视频伴音", "Use video audio")
                    ] }),
                    /* @__PURE__ */ n("button", { class: "danger", onClick: () => {
                      window.confirm(b(`删除素材 ${I.alias}？本地文件不会被删除。`, `Remove ${I.alias}? Local files are kept.`)) && r((M) => {
                        M.assets = M.assets.filter((V) => V.id !== I.id);
                      });
                    }, children: b("删除素材", "Remove") })
                  ] })
                ] })
              ] })
            ]
          },
          I.id
        );
      }) })
    ] }, R))
  ] });
}
const Ai = {
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
function Nr(e) {
  var i;
  const t = ((i = e.name.split(".").pop()) == null ? void 0 : i.toLocaleLowerCase()) ?? "";
  if (e.name.includes(".")) return Ai[t] ?? null;
  const r = e.type.split("/", 1)[0];
  return r === "image" || r === "video" || r === "audio" ? r : null;
}
function ji(e) {
  const o = e.replace(/\.[^.]+$/, "").replace(/^\s*\d+\s*[-_. ]+/, "").normalize("NFKC").replace(/[\s-]+/g, "_").replace(/[{}]/g, "").replace(/_+/g, "_").replace(/^[_\.]+|[_\.]+$/g, "").slice(0, 96) || "asset";
  return o.toLocaleLowerCase().endsWith(".audio") ? `${o}_asset` : o;
}
function Ni(e, t) {
  const r = new Set(Array.from(t, (o) => o.toLocaleLowerCase()));
  if (!r.has(e.toLocaleLowerCase())) return e;
  let i = 2;
  for (; r.has(`${e}_${i}`.toLocaleLowerCase()); ) i += 1;
  return `${e}_${i}`;
}
function Mi(e, t, r) {
  const i = e.trim().toLocaleLowerCase();
  return !e.trim() || /[\s{}]/.test(e) || i.endsWith(".audio") ? "invalid" : Array.from(t, (s) => s.toLocaleLowerCase()).includes(i) || Array.from(r, (s) => s.trim().toLocaleLowerCase()).filter((s) => s === i).length > 1 ? "duplicate" : null;
}
function Ri(e, t, r, i = []) {
  const o = [], s = [], l = new Map(i.filter((d) => !d.path.trim()).map((d) => [`${d.kind}:${d.alias.toLocaleLowerCase()}`, d])), a = e.map((d) => "file" in d ? d : { file: d, relativePath: d.webkitRelativePath || d.name });
  a.sort((d, p) => d.relativePath.localeCompare(p.relativePath, "en", { numeric: !0, sensitivity: "base" }));
  for (const d of a) {
    const { file: p } = d, m = Nr(p);
    if (!m) {
      s.push(d.relativePath);
      continue;
    }
    const b = ji(p.name), h = `${m}:${b.toLocaleLowerCase()}`, c = l.get(h);
    if (c) {
      l.delete(h), o.push({ id: r(), file: p, sourcePath: d.relativePath, alias: c.alias, kind: m, durationSeconds: m === "image" ? null : c.durationSeconds ?? 2, includeVideoAudio: c.includeVideoAudio, status: "pending", error: "", fillAssetId: c.id });
      continue;
    }
    const g = b;
    o.push({ id: r(), file: p, sourcePath: d.relativePath, alias: g, kind: m, durationSeconds: m === "image" ? null : 2, includeVideoAudio: !1, status: "pending", error: "" });
  }
  return { drafts: o, rejected: s };
}
const yt = (e) => e.trim().toLocaleLowerCase();
function rt(e, t, r) {
  if (e.status === "imported") return null;
  const i = yt(e.alias), o = t.find((l) => yt(l.alias) === i);
  return !r.filter((l) => l.id !== e.id && l.status !== "imported" && yt(l.alias) === i).length && (!o || o.id === e.fillAssetId) ? null : { target: o, canReplace: !o || o.kind === e.kind };
}
function Mr(e, t, r, i) {
  const o = e.find((l) => l.id === t);
  if (!o || o.status === "imported" || o.status === "uploading") return e;
  if (r === "skip") return e.filter((l) => l.id !== t);
  if (r === "keep") {
    const l = Ni(o.alias.trim(), [...i.map((a) => a.alias), ...e.filter((a) => a.id !== t).map((a) => a.alias)]);
    return e.map((a) => a.id === t ? { ...a, alias: l, fillAssetId: void 0, replaceExisting: !1, status: "pending", error: "" } : a);
  }
  const s = rt(o, i, e);
  return s != null && s.canReplace ? e.filter((l) => l.id === t || l.status === "imported" || yt(l.alias) !== yt(o.alias)).map((l) => {
    var a, d, p, m;
    return l.id === t ? {
      ...l,
      alias: ((a = s.target) == null ? void 0 : a.alias) ?? o.alias.trim(),
      fillAssetId: (d = s.target) == null ? void 0 : d.id,
      replaceExisting: !!((p = s.target) != null && p.path.trim()),
      includeVideoAudio: ((m = s.target) == null ? void 0 : m.includeVideoAudio) ?? l.includeVideoAudio,
      status: "pending",
      error: ""
    } : l;
  }) : e;
}
function Li(e, t, r) {
  return e.filter((o) => rt(o, r, e)).map((o) => o.id).reduce((o, s) => {
    const l = o.find((a) => a.id === s);
    return l && (t === "skip" || rt(l, r, o)) ? Mr(o, s, t, r) : o;
  }, e);
}
function Oi(e, t, r) {
  return {
    ...e,
    path: t,
    durationSeconds: e.kind === "image" ? null : r ?? e.durationSeconds,
    audioDurationSeconds: null,
    fingerprint: ""
  };
}
function Di(e, t, r) {
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
const Rr = (e, t) => e.relativePath.localeCompare(t.relativePath, "en", { numeric: !0, sensitivity: "base" });
function Lr(e, t) {
  return e.replace(/\\/g, "/").replace(/^\/+/, "").replace(/\/{2,}/g, "/") || t;
}
function hn(e) {
  return Array.from(e, (t) => ({
    file: t,
    // webkitRelativePath 由目录选择器提供；普通多文件选择回退到文件名。
    relativePath: Lr(t.webkitRelativePath, t.name)
  })).sort(Rr);
}
function Gi(e) {
  return new Promise((t, r) => e.file(t, r));
}
function Fi(e) {
  return new Promise((t, r) => e.readEntries(t, r));
}
async function Ui(e, t) {
  const r = e.createReader(), i = [];
  for (; t(); ) {
    const o = await Fi(r);
    if (!o.length) return i;
    i.push(...o);
  }
  return i;
}
async function Bi(e, t, r = () => !0) {
  const i = [], o = async (s) => {
    if (!r()) return;
    if (s.isFile) {
      const a = await Gi(s);
      if (!r()) return;
      i.push({ file: a, relativePath: Lr(s.fullPath, a.name) }), t == null || t(i.length);
      return;
    }
    if (!s.isDirectory) return;
    const l = await Ui(s, r);
    for (const a of l) await o(a);
  };
  for (const s of e) {
    if (!r()) break;
    await o(s);
  }
  return i.sort(Rr);
}
async function Vi(e, t, r = () => !0) {
  const o = Array.from(e.items ?? []).filter((l) => l.kind === "file" && typeof l.webkitGetAsEntry == "function");
  if (o.length) {
    const l = o.map((a) => {
      var d;
      return (d = a.webkitGetAsEntry) == null ? void 0 : d.call(a);
    }).filter((a) => !!a);
    if (l.length) return Bi(l, t, r);
  }
  const s = hn(e.files ?? []);
  return r() && (t == null || t(s.length)), s;
}
const qi = () => `asset_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`, rn = (e, t) => t === "zh" ? { image: "图片", video: "视频", audio: "音频" }[e] : e;
function Hi({ language: e, assets: t, projectName: r, onClose: i, onImported: o, onFilled: s, uploadFile: l }) {
  const [a, d] = G([]), [p, m] = G([]), [b, h] = G(!1), [c, g] = G(!1), [S, T] = G(0), [y, v] = G(!1), x = ke([]), u = ke(null), $ = ke(0);
  x.current = a;
  const j = t.map((_) => _.alias);
  Ee(() => {
    var _, K;
    return (_ = u.current) == null || _.setAttribute("webkitdirectory", ""), (K = u.current) == null || K.setAttribute("directory", ""), () => {
      $.current += 1;
    };
  }, []);
  const E = (_, K) => d((ee) => ee.map((Q) => Q.id === _ ? { ...Q, ...K } : Q)), P = (_, K) => {
    let ee = 0;
    const Q = async () => {
      for (; ee < _.length && $.current === K; ) {
        const te = _[ee++];
        if (te.kind === "image") continue;
        const ce = await jr(te.file, te.kind);
        ce == null || $.current !== K || d((z) => z.map((q) => q.id === te.id && q.kind === te.kind && !q.durationEdited ? { ...q, durationSeconds: ce } : q));
      }
    };
    Promise.all(Array.from({ length: Math.min(4, _.length) }, Q));
  }, C = (_) => {
    if (!_.length || y) return;
    const K = [...j, ...x.current.map((te) => te.alias)], ee = new Set(x.current.map((te) => te.fillAssetId).filter(Boolean)), Q = Ri(_, K, qi, t.filter((te) => !ee.has(te.id)));
    Q.rejected.length && m((te) => [...te, ...Q.rejected]), Q.drafts.length && (d((te) => [...te, ...Q.drafts]), P(Q.drafts, $.current));
  }, N = async (_) => {
    if (c || y) return;
    const K = $.current;
    g(!0), T(0);
    try {
      const ee = () => $.current === K, Q = await _((te) => {
        ee() && T(te);
      }, ee);
      if ($.current !== K) return;
      T(Q.length), C(Q);
    } catch (ee) {
      $.current === K && m((Q) => [...Q, String(ee)]);
    } finally {
      $.current === K && g(!1);
    }
  }, R = a.filter((_) => rt(_, t, a)), F = (_, K) => d((ee) => Mr(ee, _, K, t)), I = (_) => d((K) => Li(K, _, t)), k = a.filter((_) => _.status !== "imported").map((_) => _.alias), D = (_) => {
    if (_.status === "imported") return null;
    const K = rt(_, t, a);
    if (K) return e === "zh" ? K.canReplace ? "发现重名，请选择替换、保留两份或跳过" : "重名素材类型不同，请保留两份或跳过" : K.canReplace ? "Name conflict: replace, keep both, or skip" : "Different asset kinds: keep both or skip";
    if (_.fillAssetId && !t.some((Q) => Q.id === _.fillAssetId && Q.kind === _.kind && Q.alias === _.alias)) return e === "zh" ? "原素材已变更，请移除后重新添加文件" : "The target changed; remove and add the file again";
    const ee = Mi(_.alias, t.filter((Q) => Q.id !== _.fillAssetId).map((Q) => Q.alias), k);
    return ee === "invalid" ? e === "zh" ? "别名为空、包含空白/花括号，或使用了保留后缀 .audio" : "Alias is empty, contains whitespace/braces, or uses reserved .audio" : ee === "duplicate" ? e === "zh" ? "别名与素材库或本批次其他素材重复" : "Alias duplicates an existing or staged asset" : Nr(_.file) !== _.kind ? e === "zh" ? "文件扩展名与所选类型不匹配" : "The extension does not match the selected kind" : _.kind !== "image" && (_.durationSeconds == null || _.durationSeconds <= 0) ? e === "zh" ? "视频或音频时长必须大于 0" : "Video/audio duration must be greater than 0" : null;
  }, M = async () => {
    const K = x.current.filter((ce) => ce.status === "pending" || ce.status === "error");
    if (!K.length || c || y) return;
    if (K.some(D)) {
      window.alert(e === "zh" ? "请先修正列表中标红的项目。" : "Fix the highlighted rows before importing.");
      return;
    }
    v(!0);
    const ee = Math.max(0, ...t.map((ce) => ce.fixedOrder)) + 1;
    let Q = 0;
    const te = async () => {
      for (; Q < K.length; ) {
        const ce = Q++, z = K[ce];
        E(z.id, { status: "uploading", error: "" });
        try {
          const q = await l(r, z.kind, z.file);
          z.fillAssetId ? s(z.fillAssetId, q, z.kind === "image" ? null : z.durationSeconds) : o([Di(z, q, ee + ce)]), E(z.id, { status: "imported", error: "" });
        } catch (q) {
          E(z.id, { status: "error", error: String(q) });
        }
      }
    };
    await Promise.all(Array.from({ length: Math.min(2, K.length) }, te)), v(!1);
  }, V = a.filter((_) => _.status === "imported").length, Z = a.filter((_) => _.status === "error").length, Y = a.length - V, L = () => {
    $.current += 1, i();
  };
  return /* @__PURE__ */ n("div", { class: "td-batch-overlay", role: "presentation", children: /* @__PURE__ */ n("section", { class: "td-asset-batch-panel", role: "dialog", "aria-modal": "true", "aria-label": e === "zh" ? "批量导入素材" : "Batch import assets", children: [
    /* @__PURE__ */ n("header", { class: "td-batch-header", children: [
      /* @__PURE__ */ n("div", { children: [
        /* @__PURE__ */ n("h2", { children: e === "zh" ? "批量导入素材" : "Batch import assets" }),
        /* @__PURE__ */ n("p", { children: e === "zh" ? "可混合选择文件或递归导入文件夹。空缺素材自动填充；重名时先选择替换、保留两份或跳过。替换保留原有镜头引用。" : "Select files or folders. Empty assets are filled automatically. For name conflicts, choose replace, keep both, or skip. Replacing preserves shot references." })
      ] }),
      /* @__PURE__ */ n("button", { disabled: y, "aria-label": e === "zh" ? "关闭" : "Close", onClick: L, children: "×" })
    ] }),
    /* @__PURE__ */ n("div", { class: `td-asset-dropzone ${b ? "dragging" : ""}`, onDragEnter: (_) => {
      _.preventDefault(), h(!0);
    }, onDragOver: (_) => _.preventDefault(), onDragLeave: (_) => {
      _.currentTarget === _.target && h(!1);
    }, onDrop: (_) => {
      _.preventDefault(), h(!1);
      const K = _.dataTransfer;
      K && N((ee, Q) => Vi(K, ee, Q));
    }, children: [
      /* @__PURE__ */ n("strong", { children: c ? e === "zh" ? `正在扫描文件夹…已发现 ${S} 个文件` : `Scanning folders… ${S} files found` : e === "zh" ? "拖拽文件或文件夹到这里" : "Drop files or folders here" }),
      /* @__PURE__ */ n("span", { children: e === "zh" ? "递归识别子文件夹中的图片、视频和音频" : "Images, videos, and audio are detected recursively" }),
      /* @__PURE__ */ n("div", { class: "td-asset-picker-actions", children: [
        /* @__PURE__ */ n("label", { class: "td-asset-picker-button", children: [
          e === "zh" ? "选择多个文件" : "Choose files",
          /* @__PURE__ */ n("input", { type: "file", multiple: !0, accept: "image/*,video/*,audio/*", disabled: y || c, onChange: (_) => {
            C(hn(_.currentTarget.files ?? [])), _.currentTarget.value = "";
          } })
        ] }),
        /* @__PURE__ */ n("label", { class: "td-asset-picker-button", children: [
          e === "zh" ? "选择文件夹" : "Choose folder",
          /* @__PURE__ */ n("input", { ref: u, type: "file", multiple: !0, disabled: y || c, onChange: (_) => {
            const K = hn(_.currentTarget.files ?? []);
            _.currentTarget.value = "", N(async (ee) => (ee(K.length), K));
          } })
        ] })
      ] })
    ] }),
    p.length > 0 && /* @__PURE__ */ n("div", { class: "td-asset-batch-warning", children: [
      /* @__PURE__ */ n("span", { children: e === "zh" ? `已跳过 ${p.length} 个不支持的文件：${p.join("、")}` : `Skipped ${p.length} unsupported files: ${p.join(", ")}` }),
      /* @__PURE__ */ n("button", { onClick: () => m([]), children: "×" })
    ] }),
    R.length > 0 && /* @__PURE__ */ n("div", { class: "td-asset-batch-conflicts", role: "status", children: [
      /* @__PURE__ */ n("strong", { children: e === "zh" ? `发现 ${R.length} 项重名素材，如何处理？` : `${R.length} name conflicts. How should they be handled?` }),
      /* @__PURE__ */ n("div", { children: [
        /* @__PURE__ */ n("button", { disabled: y || R.some((_) => {
          var K;
          return !((K = rt(_, t, a)) != null && K.canReplace);
        }), onClick: () => I("replace"), children: e === "zh" ? "全部替换" : "Replace all" }),
        /* @__PURE__ */ n("button", { disabled: y, onClick: () => I("keep"), children: e === "zh" ? "全部保留两份" : "Keep all copies" }),
        /* @__PURE__ */ n("button", { disabled: y, onClick: () => I("skip"), children: e === "zh" ? "全部跳过" : "Skip all" })
      ] })
    ] }),
    /* @__PURE__ */ n("div", { class: "td-asset-batch-summary", children: [
      /* @__PURE__ */ n("span", { children: e === "zh" ? `共 ${a.length} 项 · 已导入 ${V} · 待处理 ${Y}${Z ? ` · 失败 ${Z}` : ""}` : `${a.length} items · ${V} imported · ${Y} pending${Z ? ` · ${Z} failed` : ""}` }),
      /* @__PURE__ */ n("button", { disabled: y || !a.length, onClick: () => d([]), children: e === "zh" ? "清空列表" : "Clear list" })
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
      !a.length && /* @__PURE__ */ n("div", { class: "td-asset-batch-empty", children: e === "zh" ? "尚未选择素材" : "No media selected" }),
      a.map((_) => {
        const K = rt(_, t, a), ee = D(_), Q = y || _.status === "imported" || _.status === "uploading";
        return /* @__PURE__ */ n("div", { class: `td-asset-batch-row ${ee || _.status === "error" ? "invalid" : ""} ${_.status === "imported" ? "imported" : ""}`, children: [
          /* @__PURE__ */ n("div", { class: "td-asset-batch-file", children: [
            /* @__PURE__ */ n("strong", { title: _.sourcePath, children: _.sourcePath }),
            /* @__PURE__ */ n("small", { children: [
              (_.file.size / 1024 / 1024).toFixed(1),
              " MB · ",
              _.status === "pending" ? e === "zh" ? "待导入" : "Pending" : _.status === "uploading" ? e === "zh" ? "上传中" : "Uploading" : _.status === "imported" ? e === "zh" ? "已完成" : "Imported" : e === "zh" ? "失败" : "Failed"
            ] }),
            (ee || _.error) && /* @__PURE__ */ n("em", { title: ee || _.error, children: ee || _.error })
          ] }),
          /* @__PURE__ */ n("div", { class: "td-asset-batch-alias", children: [
            _.fillAssetId ? /* @__PURE__ */ n("span", { class: "td-asset-batch-fill", title: e === "zh" ? "更新原素材，保留别名与镜头引用" : "Updates the original asset and preserves references", children: [
              "↳ ",
              _.alias,
              /* @__PURE__ */ n("em", { children: _.replaceExisting ? e === "zh" ? "替换" : "replace" : e === "zh" ? "填充" : "fill" })
            ] }) : /* @__PURE__ */ n("input", { disabled: Q, value: _.alias, onInput: (te) => E(_.id, { alias: te.currentTarget.value, status: "pending", error: "" }) }),
            K && /* @__PURE__ */ n("div", { class: "td-asset-conflict-actions", children: [
              /* @__PURE__ */ n("button", { disabled: Q || !K.canReplace, onClick: () => F(_.id, "replace"), children: e === "zh" ? "替换" : "Replace" }),
              /* @__PURE__ */ n("button", { disabled: Q, onClick: () => F(_.id, "keep"), children: e === "zh" ? "保留两份" : "Keep both" }),
              /* @__PURE__ */ n("button", { disabled: Q, onClick: () => F(_.id, "skip"), children: e === "zh" ? "跳过" : "Skip" })
            ] })
          ] }),
          /* @__PURE__ */ n("select", { disabled: Q || !!_.fillAssetId, value: _.kind, onChange: (te) => {
            const ce = te.currentTarget.value;
            E(_.id, { kind: ce, durationSeconds: ce === "image" ? null : _.durationSeconds ?? 2, includeVideoAudio: ce === "video" && _.includeVideoAudio, status: "pending", error: "" });
          }, children: [
            /* @__PURE__ */ n("option", { value: "image", children: rn("image", e) }),
            /* @__PURE__ */ n("option", { value: "video", children: rn("video", e) }),
            /* @__PURE__ */ n("option", { value: "audio", children: rn("audio", e) })
          ] }),
          /* @__PURE__ */ n("label", { class: "td-asset-batch-duration", children: [
            /* @__PURE__ */ n("input", { type: "number", min: "0.1", step: "0.1", disabled: Q || _.kind === "image", value: _.durationSeconds ?? "", onInput: (te) => E(_.id, { durationSeconds: te.currentTarget.value ? Number(te.currentTarget.value) : null, durationEdited: !0, status: "pending", error: "" }) }),
            /* @__PURE__ */ n("span", { children: _.kind === "image" ? "—" : e === "zh" ? "秒" : "sec" })
          ] }),
          /* @__PURE__ */ n("label", { class: "td-asset-batch-audio", children: [
            /* @__PURE__ */ n("input", { type: "checkbox", disabled: Q || !!_.fillAssetId || _.kind !== "video", checked: _.kind === "video" && _.includeVideoAudio, onChange: (te) => E(_.id, { includeVideoAudio: te.currentTarget.checked }) }),
            /* @__PURE__ */ n("span", { children: _.kind === "video" ? _.includeVideoAudio ? e === "zh" ? "开" : "ON" : e === "zh" ? "关" : "OFF" : "—" })
          ] }),
          /* @__PURE__ */ n("button", { class: "danger", disabled: Q, onClick: () => d((te) => te.filter((ce) => ce.id !== _.id)), children: e === "zh" ? "移除" : "Remove" })
        ] }, _.id);
      })
    ] }),
    /* @__PURE__ */ n("footer", { children: [
      /* @__PURE__ */ n("button", { disabled: y, onClick: L, children: e === "zh" ? "关闭" : "Close" }),
      /* @__PURE__ */ n("button", { class: "primary", disabled: y || c || R.length > 0 || !a.some((_) => _.status === "pending" || _.status === "error"), onClick: () => void M(), children: c ? e === "zh" ? "正在扫描…" : "Scanning…" : y ? e === "zh" ? "正在导入…" : "Importing…" : Z ? e === "zh" ? "重试失败项" : "Retry failed" : e === "zh" ? "开始导入" : "Start import" })
    ] })
  ] }) });
}
function Wi(e, t) {
  return { projectName: e, runId: t };
}
async function Ji(e, t) {
  const r = await fetch("/theodore-director/v1/project/clear", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(Wi(e, t))
  }), i = await r.json();
  if (!r.ok || !i.ok) throw new Error(i.error || `HTTP ${r.status}`);
  return i.path || "";
}
const Ki = {
  zh: { title: "YuQ 导播台", save: "保存", close: "关闭", shots: "分镜", assets: "素材库", settings: "项目设置", postprocess: "后处理", addShot: "添加分镜", addAsset: "添加素材", preview: "H3 编译预览", noErrors: "当前分镜通过预检" },
  en: { title: "YuQ Director", save: "Save", close: "Close", shots: "Shots", assets: "Media", settings: "Project", postprocess: "Post-process", addShot: "Add shot", addAsset: "Add asset", preview: "H3 compile preview", noErrors: "Current shot passes validation" }
}, Or = "theodore-director-language";
function Wn(e, t) {
  return Ki[e][t];
}
function Qi() {
  try {
    return window.localStorage.getItem(Or) === "en" ? "en" : "zh";
  } catch {
    return "zh";
  }
}
function Yi(e) {
  try {
    window.localStorage.setItem(Or, e);
  } catch {
  }
}
const kn = (e) => `${e}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`, ot = (e) => JSON.parse(JSON.stringify(e)), Dr = 0.3;
function _t(e) {
  var r, i, o, s, l, a, d, p, m, b, h, c, g, S, T, y, v, x;
  const t = ot(e);
  return t.schemaVersion = 5, t.project = { ...t.project, name: ((r = t.project) == null ? void 0 : r.name) ?? "YuQ Project", runId: ((i = t.project) == null ? void 0 : i.runId) ?? "run_001", id: ((o = t.project) == null ? void 0 : o.id) ?? "" }, (s = t.project.id) != null && s.trim() || (t.project.id = kn("project")), t.defaults = { fps: ((l = t.defaults) == null ? void 0 : l.fps) ?? 24, baseSeed: ((a = t.defaults) == null ? void 0 : a.baseSeed) ?? 123456790, durationSeconds: ((d = t.defaults) == null ? void 0 : d.durationSeconds) ?? 6, secondSamplingMode: ((p = t.defaults) == null ? void 0 : p.secondSamplingMode) ?? "off" }, t.promptPrefix = t.promptPrefix ?? "", t.promptSuffix = t.promptSuffix ?? "", t.continuity = {
    mode: ((m = t.continuity) == null ? void 0 : m.mode) ?? "h3_av_latent",
    videoContextFrames: ((b = t.continuity) == null ? void 0 : b.videoContextFrames) ?? 22,
    audioContextFrames: ((h = t.continuity) == null ? void 0 : h.audioContextFrames) ?? 24,
    durationMode: ((c = t.continuity) == null ? void 0 : c.durationMode) ?? "final_output"
  }, t.shots = (t.shots ?? []).map((u, $) => {
    const j = u, E = u.id || `shot_${String($ + 1).padStart(3, "0")}`;
    return {
      ...u,
      id: E,
      title: u.title || E,
      prompt: u.prompt ?? "",
      negativePrompt: u.negativePrompt ?? "",
      durationSeconds: Number(u.durationSeconds) || 5,
      enabled: u.enabled ?? !0,
      latentRelay: u.latentRelay ?? !0,
      // 旧 BOOL 开关无损迁移到 V7.2 原有的超分二采模式。
      secondSamplingMode: u.secondSamplingMode ?? (j.secondSampling === !1 ? "off" : t.defaults.secondSamplingMode ?? "super_resolution_second_pass"),
      seed: u.seed ?? null,
      disabledAssetIds: u.disabledAssetIds ?? []
    };
  }), t.assets = (t.assets ?? []).map((u, $) => ({
    ...u,
    id: u.id || `asset_${String($ + 1).padStart(3, "0")}`,
    path: u.path ?? "",
    enabled: u.enabled ?? !0,
    fixed: u.fixed ?? !1,
    fixedOrder: u.fixedOrder ?? $ + 1,
    shotIds: u.shotIds ?? [],
    includeVideoAudio: u.includeVideoAudio ?? !1,
    durationSeconds: u.durationSeconds ?? null,
    audioDurationSeconds: u.audioDurationSeconds ?? null,
    fingerprint: u.fingerprint ?? ""
  })), t.pipeline = {
    ...t.pipeline,
    phase: ((g = t.pipeline) == null ? void 0 : g.phase) ?? "first_pass",
    firstPassConfirmed: !!((S = t.pipeline) != null && S.firstPassConfirmed),
    secondPassMode: ((T = t.pipeline) == null ? void 0 : T.secondPassMode) ?? "super_resolution_second_pass",
    secondPassDenoise: ((y = t.pipeline) == null ? void 0 : y.secondPassDenoise) ?? Dr
  }, t.uiPreferences = { autoSave: ((v = t.uiPreferences) == null ? void 0 : v.autoSave) ?? !1, compactMode: ((x = t.uiPreferences) == null ? void 0 : x.compactMode) ?? !1 }, t;
}
function on(e) {
  const t = e;
  if (!t || typeof t != "object" || !t.project || !Array.isArray(t.shots) || !Array.isArray(t.assets))
    throw new Error("不是有效的 Theodore Director 计划：需要 project、assets 和 shots 字段");
}
function Gr(e, t) {
  var p, m;
  const r = _t(t);
  !t.generation && e.generation && (r.generation = { ...e.generation });
  const i = new Map(e.assets.map((b) => [`${b.kind}:${b.alias.toLocaleLowerCase()}`, b])), o = [];
  r.assets = r.assets.map((b) => {
    const h = i.get(`${b.kind}:${b.alias.toLocaleLowerCase()}`);
    if (!h) return b;
    const c = {
      imageGeneration: b.imageGeneration ?? h.imageGeneration,
      imageGenerationPending: b.imageGenerationPending ?? h.imageGenerationPending
    };
    return b.path.trim() || !h.path.trim() ? { ...b, ...c } : (o.push(b.alias), {
      ...b,
      ...c,
      path: h.path,
      // 已上传文件的真实时长比 skill 中的计划时长更可靠。
      durationSeconds: h.durationSeconds ?? b.durationSeconds,
      audioDurationSeconds: h.audioDurationSeconds ?? b.audioDurationSeconds,
      fingerprint: h.fingerprint || b.fingerprint
    });
  });
  const s = e.project.name === r.project.name && e.project.runId === r.project.runId, l = new Map((s ? e.shots : []).map((b) => [b.id, b]));
  let a = 0, d = 0;
  return r.shots = r.shots.map((b) => {
    const h = l.get(b.id);
    if (!h) return b;
    const c = { ...b };
    return !c.review && h.review && (c.review = h.review, a += 1), c.seed == null && h.seed != null && (c.seed = h.seed, d += 1), c;
  }), e.pipeline && r.pipeline && (r.pipeline.secondPassDenoise = ((p = t.pipeline) == null ? void 0 : p.secondPassDenoise) ?? e.pipeline.secondPassDenoise ?? Dr, r.pipeline.secondPassScale = ((m = t.pipeline) == null ? void 0 : m.secondPassScale) ?? e.pipeline.secondPassScale), { plan: r, keptPaths: o, keptReviews: a, keptSeeds: d };
}
function an(e) {
  return e.trim().replace(/[<>:"/\\|?*\u0000-\u001f]+/g, "_").replace(/[. ]+$/g, "").slice(0, 96) || "theodore_project";
}
const Me = (e) => e.trim().toLocaleLowerCase(), Xi = /* @__PURE__ */ new Set(["image", "video", "audio"]);
function Fr(e) {
  if (!Array.isArray(e)) throw new Error("素材清单必须为数组 / Expected an asset list");
  const t = /* @__PURE__ */ new Set();
  for (const r of e) {
    if (!r || typeof r.alias != "string" || !r.alias.trim() || /[\s{}]/.test(r.alias) || Me(r.alias).endsWith(".audio") || !Xi.has(r.kind)) throw new Error("素材别名或类型无效 / Invalid asset alias or kind");
    if (t.has(Me(r.alias))) throw new Error(`素材别名重复 / Duplicate alias: ${r.alias}`);
    if (t.add(Me(r.alias)), r.path != null && typeof r.path != "string") throw new Error("素材路径必须为字符串 / Expected a string path");
  }
}
function Ur(e) {
  var r, i;
  const t = e;
  if (!t || t.format !== "theodore-assets" || t.version !== 1 || typeof ((r = t.library) == null ? void 0 : r.id) != "string" || !t.library.id.trim() || typeof ((i = t.library) == null ? void 0 : i.name) != "string") throw new Error("不是有效的素材库 JSON / Invalid asset library JSON");
  Fr(t.assets);
}
function Sn(e) {
  var i;
  const t = e;
  if (!t || t.format !== "theodore-episode" || t.version !== 1 || typeof ((i = t.project) == null ? void 0 : i.name) != "string" || !t.project.name.trim() || !Array.isArray(t.shots) || !Array.isArray(t.requiredAssets)) throw new Error("不是有效的分镜 JSON / Invalid episode JSON");
  Fr(t.requiredAssets);
  const r = new Set(t.requiredAssets.map((o) => Me(o.alias)));
  for (const o of Br(t)) if (!r.has(o)) throw new Error(`分镜未声明素材 / Undeclared asset: ${o}`);
}
function Br(e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of [e.promptPrefix, e.promptSuffix, ...e.shots.flatMap((i) => [i.prompt, i.negativePrompt])])
    for (const i of (r ?? "").matchAll(/\{\{ref:([^}]+)\}\}/g)) t.add(Me(i[1].replace(/\.audio$/i, "")));
  return t;
}
function Jn(e) {
  return {
    format: "theodore-assets",
    version: 1,
    library: ot(e.assetLibrary ?? { id: `library_${e.project.id}`, name: e.project.name }),
    // 镜头适用范围属于当集，系列清单不携带其他集的镜头 ID。
    assets: e.assets.map((t) => ({ ...ot(t), enabled: !0, fixed: !1, shotIds: [] }))
  };
}
function Kn(e) {
  const { assets: t, ...r } = ot(e), i = Br(e), o = new Set(e.shots.flatMap((a) => a.disabledAssetIds)), s = t.filter((a) => i.has(Me(a.alias)) || a.fixed || o.has(a.id)).map(({ id: a, alias: d, kind: p, enabled: m, fixed: b, shotIds: h, includeVideoAudio: c }) => ({ id: a, alias: d, kind: p, enabled: m, fixed: b, shotIds: h, includeVideoAudio: c })), l = { ...r, format: "theodore-episode", version: 1, requiredAssets: s };
  return Sn(l), l;
}
function Zi(e, t) {
  Ur(t);
  const r = _t({ ...e, assets: t.assets }).assets, i = ot(e), o = new Map(i.assets.map((p) => [Me(p.alias), p])), s = new Set(i.assets.map((p) => p.id));
  let l = 0, a = 0;
  const d = [];
  for (const p of r) {
    const m = o.get(Me(p.alias));
    if (m) {
      if (m.kind !== p.kind) throw new Error(`同名素材类型不同 / Asset kind mismatch: ${p.alias}`);
      const b = !p.path.trim() && !!m.path.trim(), h = {
        ...m,
        ...p,
        id: m.id,
        alias: m.alias,
        enabled: m.enabled,
        fixed: m.fixed,
        fixedOrder: m.fixedOrder,
        shotIds: m.shotIds,
        imageGeneration: p.imageGeneration ?? m.imageGeneration,
        imageGenerationPending: p.imageGenerationPending ?? m.imageGenerationPending
      };
      b && (h.path = m.path, h.durationSeconds = m.durationSeconds, h.audioDurationSeconds = m.audioDurationSeconds, h.fingerprint = m.fingerprint, d.push(m.alias)), Object.assign(m, h), a += 1;
    } else {
      const b = { ...p, id: s.has(p.id) ? kn("asset") : p.id, shotIds: [] };
      s.add(b.id), o.set(Me(p.alias), b), i.assets.push(b), l += 1;
    }
  }
  return i.assetLibrary = ot(t.library), { plan: i, added: l, updated: a, keptPaths: d };
}
function eo(e, t) {
  Sn(t);
  const r = ot(e.assets).map((h) => ({ ...h, fixed: !1, shotIds: [] })), i = new Map(r.map((h) => [Me(h.alias), h])), o = new Set(r.map((h) => h.id)), s = /* @__PURE__ */ new Map(), l = [];
  for (const h of t.requiredAssets) {
    let c = i.get(Me(h.alias));
    if (c && c.kind !== h.kind) throw new Error(`同名素材类型不同 / Asset kind mismatch: ${h.alias}`);
    if (!c) {
      const g = h.id && !o.has(h.id) ? h.id : kn("asset");
      c = { id: g, alias: h.alias, kind: h.kind, path: "", enabled: !0, fixed: !1, fixedOrder: r.length + 1, shotIds: [], includeVideoAudio: !1, durationSeconds: null, audioDurationSeconds: null, fingerprint: "" }, r.push(c), i.set(Me(h.alias), c), o.add(g);
    }
    c.enabled = h.enabled ?? !0, c.fixed = h.fixed ?? !1, c.shotIds = [...h.shotIds ?? []], c.includeVideoAudio = h.includeVideoAudio ?? c.includeVideoAudio, h.id && s.set(h.id, c.id), c.path.trim() || l.push(h.alias);
  }
  const { format: a, version: d, requiredAssets: p, ...m } = t, b = Gr(e, { ...m, assetLibrary: t.assetLibrary ?? e.assetLibrary, assets: r });
  return b.plan.assets = r, b.plan.shots = b.plan.shots.map((h) => ({ ...h, disabledAssetIds: h.disabledAssetIds.map((c) => s.get(c) ?? c) })), { ...b, keptPaths: r.filter((h) => h.path.trim()).map((h) => h.alias), missingAssets: l };
}
function Ge(e) {
  return (Array.isArray(e.results) && e.results.length ? e.results : e.path ? [{ path: e.path, bytes: e.bytes, modifiedAt: e.modifiedAt, stage: e.stage, processingMode: e.processingMode, sourcePath: e.sourcePath, completedAt: e.completedAt }] : []).filter((r) => typeof r.path == "string" && r.path.trim().length > 0).sort((r, i) => (i.modifiedAt ?? 0) - (r.modifiedAt ?? 0));
}
function to(e, t) {
  const r = /_video_(\d+)/i.exec(e.replace(/\\/g, "/"));
  return r ? Number(r[1]) : t;
}
function no(e, t) {
  return e.stage === "second_pass" && t !== "super_resolution_only" ? "second_pass_requires_upscale_only" : e.stage === "upscaled" ? "upscaled_is_terminal" : null;
}
function ro(e, t) {
  return no(e, t) === null;
}
function io(e) {
  return ["super_resolution_second_pass", "latent_upscale_second_pass", "super_resolution_only"].filter((r) => ro(e, r));
}
function Vr(e) {
  const t = ke(null), [r, i] = G(!1);
  return Ee(() => {
    const o = t.current;
    if (!o) return;
    if (!("IntersectionObserver" in window)) {
      i(!0);
      return;
    }
    const s = new IntersectionObserver((l) => {
      i(l.some((a) => a.isIntersecting));
    }, { rootMargin: e });
    return s.observe(o), () => s.disconnect();
  }, []), { hostRef: t, active: r };
}
function oo({ src: e, className: t }) {
  const { hostRef: r, active: i } = Vr("320px");
  return /* @__PURE__ */ n("div", { class: `td-lazy-player ${t ?? ""}`, ref: r, children: i ? /* @__PURE__ */ n("video", { src: e, controls: !0, preload: "metadata", playsInline: !0 }, e) : /* @__PURE__ */ n("span", { children: "…" }) });
}
function ct({ src: e, alt: t }) {
  const { hostRef: r, active: i } = Vr("160px");
  return /* @__PURE__ */ n("div", { class: "td-result-thumb", ref: r, children: i ? /* @__PURE__ */ n("video", { src: e, "aria-label": t, muted: !0, playsInline: !0, preload: "metadata", onLoadedMetadata: (o) => {
    const s = o.currentTarget;
    Number.isFinite(s.duration) && s.duration > 0.02 && (s.currentTime = Math.min(0.25, Math.max(0, s.duration - 0.05)));
  } }) : /* @__PURE__ */ n("span", { children: "…" }) });
}
function $n(e) {
  let t = 0;
  return e.shots.map((r, i) => {
    const o = {
      key: `${i}:${r.id}`,
      shot: r,
      sourceIndex: i,
      activeIndex: r.enabled ? t : -1
    };
    return r.enabled && (t += 1), o;
  });
}
function ao(e, t, r) {
  return e.filter((i) => i.shot.enabled && t[i.key]).map((i) => ({
    shotId: i.shot.id,
    activeIndex: i.activeIndex,
    path: r[i.key] ?? ""
  }));
}
function so(e, t, r) {
  const i = {};
  return e.forEach((o) => {
    const s = o.sourceIndex + 1;
    i[o.key] = o.shot.enabled && s >= t && s <= r;
  }), i;
}
const qr = 5;
function lo(e) {
  return !e.stage || e.stage === "first_pass" || e.stage === "legacy_unknown";
}
function Le(e) {
  return e.filter(lo).sort((t, r) => (r.modifiedAt ?? 0) - (t.modifiedAt ?? 0));
}
function Xe(e, t) {
  var i;
  const r = (i = e.review) == null ? void 0 : i.take;
  return r && t.find((o) => o.path === r) || t[0];
}
const Qn = (e) => (e ?? "").replace(/\\/g, "/").replace(/^\.\//, "");
function Dt(e, t, r) {
  const i = Qn(t);
  return e.filter((o) => (o.stage === "second_pass" || o.stage === "upscaled") && Qn(o.sourcePath) === i).filter((o) => o.relayValid !== !1).filter((o) => !0).sort((o, s) => (s.modifiedAt ?? 0) - (o.modifiedAt ?? 0));
}
function Hr(e, t) {
  const r = Xe(e, Le(t));
  if (!r) return;
  const i = Dt(t, r.path)[0];
  return i ? { item: i, processed: !0 } : { item: r, processed: !1 };
}
function kt(e, t) {
  const r = e.shots.findIndex((i) => i.id === t);
  for (let i = r - 1; i >= 0; i -= 1)
    if (e.shots[i].enabled) return e.shots[i];
}
function at(e, t) {
  return t.enabled && t.latentRelay && e.continuity.mode === "h3_av_latent" && !!kt(e, t.id);
}
function Wr(e, t) {
  const r = e.shots.findIndex((o) => o.id === t);
  if (r < 0) return [];
  const i = [t];
  for (let o = r + 1; o < e.shots.length; o += 1) {
    const s = e.shots[o];
    if (s.enabled) {
      if (!at(e, s)) break;
      i.push(s.id);
    }
  }
  return i;
}
function Gt(e, t) {
  return e.shots.filter((r) => r.enabled).findIndex((r) => r.id === t);
}
function co(e, t) {
  const r = e.shots.filter((o) => o.enabled), i = r.findIndex((o) => o.id === t);
  return i >= 0 && i + 1 < r.length ? i + 1 : 0;
}
function Jr(e, t) {
  var s, l;
  const r = (s = e.pipeline) == null ? void 0 : s.latentWriters, i = e.shots.find((a) => a.id === t);
  if (!r || !i || !at(e, i)) return null;
  const o = r[String(Gt(e, t))];
  return o ? o.shotId === ((l = kt(e, t)) == null ? void 0 : l.id) ? null : "wrong" : "missing";
}
function po(e, t) {
  const r = new Set(t), i = [];
  let o = !0;
  for (; o; ) {
    o = !1;
    for (const l of [...r]) {
      const a = kt(e, l);
      !a || r.has(a.id) || !Jr(e, l) || (r.add(a.id), i.push(a.id), o = !0);
    }
  }
  return { shotIds: e.shots.filter((l) => r.has(l.id)).map((l) => l.id), added: e.shots.filter((l) => i.includes(l.id)).map((l) => l.id) };
}
function ho(e, t) {
  var i;
  if (!t) return;
  const r = (t.modifiedAt ?? 0) + qr;
  return [...((i = e.review) == null ? void 0 : i.relayHistory) ?? []].sort((o, s) => s.at - o.at).find((o) => o.at <= r);
}
function uo(e, t, r) {
  const i = r != null ? r + qr : t.modifiedAt ?? 0;
  return [...e].sort((o, s) => (s.modifiedAt ?? 0) - (o.modifiedAt ?? 0)).find((o) => (o.modifiedAt ?? 0) <= i);
}
function mo(e, t, r, i, o) {
  if (!e || !r) return "unknown";
  if (o) {
    if (o.source == null) return "unknown";
    if (i && o.source !== i) return "wrong_source";
  }
  const s = uo(t, r, o == null ? void 0 : o.sourceAt);
  return s ? s.path === e.path ? "ok" : "mismatch" : "unknown";
}
function go(e) {
  let t = 5381;
  for (let r = 0; r < e.length; r += 1) t = (t << 5) + t + e.charCodeAt(r) | 0;
  return (t >>> 0).toString(36);
}
function Kr(e, t) {
  const r = e.assets.filter((i) => !(i.shotIds ?? []).length || i.shotIds.includes(t.id)).map((i) => [i.alias, i.kind, i.path, i.enabled, i.includeVideoAudio, i.durationSeconds, i.fixed, i.fixedOrder]);
  return go(JSON.stringify([
    t.prompt,
    t.negativePrompt,
    t.durationSeconds,
    t.latentRelay,
    t.seed,
    [...t.disabledAssetIds ?? []].sort(),
    e.promptPrefix,
    e.promptSuffix,
    e.continuity,
    r,
    ...e.generation ? [e.generation, e.defaults.fps, e.defaults.baseSeed] : []
  ]));
}
function Qr(e, t) {
  var i;
  const r = (i = t.review) == null ? void 0 : i.generatedSig;
  return !!r && r !== Kr(e, t);
}
function Yr() {
  return Math.floor(Math.random() * 4294967295);
}
function fo(e, t, r) {
  return `/theodore-director/v1/generated-video?${new URLSearchParams({ projectName: e.project.name, runId: e.project.runId, shotId: t, activeIndex: String(r) }).toString()}`;
}
function bo(e, t, r) {
  return t === "latent_upscale_second_pass" ? r === "zh" ? "Latent 放大二采" : "Latent upscale 2nd pass" : t === "super_resolution_second_pass" || e === "second_pass" ? r === "zh" ? "超分二采" : "Super-res 2nd pass" : t === "super_resolution_only" || e === "upscaled" ? r === "zh" ? "只超分" : "Super-res only" : e === "first_pass" ? r === "zh" ? "一采" : "1st pass" : r === "zh" ? "旧结果" : "Legacy";
}
function xo(e, t) {
  return e === "latent_upscale_second_pass" ? t === "zh" ? "Latent 放大二采" : "Latent upscale 2nd pass" : e === "super_resolution_only" ? t === "zh" ? "只超分" : "Super-res only" : t === "zh" ? "超分二采" : "Super-res 2nd pass";
}
function vo({ plan: e, language: t, queueSecondPass: r }) {
  var u;
  const i = He(() => $n(e), [e]), [o, s] = G({}), [l, a] = G({}), [d, p] = G(null), [m, b] = G(0), [h, c] = G({}), [g, S] = G({ value: 0, max: 0 }), T = ke(!1), y = ((u = e.pipeline) == null ? void 0 : u.secondPassDenoise) ?? 0.3;
  Ee(() => {
    let $ = !1;
    const j = {};
    return i.forEach((E) => {
      j[E.key] = { loading: !0, response: { found: !1, results: [] } };
    }), s(j), i.forEach((E) => {
      fetch(fo(e, E.shot.id, E.activeIndex)).then(async (P) => {
        const C = await P.json();
        if (!P.ok) throw new Error(C.error || `HTTP ${P.status}`);
        $ || s((N) => ({ ...N, [E.key]: { loading: !1, response: C } }));
      }).catch((P) => {
        $ || s((C) => ({ ...C, [E.key]: { loading: !1, response: { found: !1, results: [], error: String(P) } } }));
      });
    }), () => {
      $ = !0;
    };
  }, [e.project.name, e.project.runId, e.shots.map(($) => $.id).join("|"), m]);
  const v = async ($, j, E) => {
    if (!r || T.current) return;
    T.current = !0;
    const P = `${j}:${E}`;
    a((C) => ({ ...C, [P]: { state: "queued" } }));
    try {
      await r({
        plan: e,
        shotId: $,
        sourcePath: j,
        requestId: `td2_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`,
        processingMode: E,
        relayVersion: 1,
        sourceSelections: Object.fromEntries(i.flatMap((C) => {
          var R;
          const N = Xe(C.shot, Le(Ge(((R = o[C.key]) == null ? void 0 : R.response) ?? { found: !1 })));
          return N ? [[C.shot.id, N.path]] : [];
        })),
        phase: "second_pass",
        denoise: E === "super_resolution_only" ? void 0 : y,
        onProgress: S
      }), a((C) => ({ ...C, [P]: { state: "done" } })), b((C) => C + 1);
    } catch (C) {
      a((N) => ({ ...N, [P]: { state: "error", message: String(C instanceof Error ? C.message : C) } }));
    } finally {
      T.current = !1;
    }
  }, x = Object.values(l).some(($) => $.state === "queued");
  return /* @__PURE__ */ n("section", { class: "td-postprocess td-second-pass-panel", children: [
    /* @__PURE__ */ n("div", { class: "td-post-header", children: [
      /* @__PURE__ */ n("div", { children: [
        /* @__PURE__ */ n("h2", { children: t === "zh" ? "单独二采" : "Standalone processing" }),
        /* @__PURE__ */ n("p", { children: t === "zh" ? "对满意结果执行所选高清处理；二采结果只能继续只超分，不重跑一采或启动 Impact 循环。" : "Process a selected result; second-pass outputs may only continue with Super-res only, without rerunning the first pass or Impact loop." })
      ] }),
      /* @__PURE__ */ n("div", { class: "td-post-actions", children: /* @__PURE__ */ n("button", { onClick: () => b(($) => $ + 1), children: [
        "↻ ",
        t === "zh" ? "刷新结果" : "Refresh"
      ] }) })
    ] }),
    /* @__PURE__ */ n("div", { class: "td-post-warning", children: t === "zh" ? `整体二采请到「审片与生成」页执行（使用每段选定的结果，按分镜顺序）。这里用于单独处理某一个结果；重绘强度沿用审片页设置：${y.toFixed(2)}。` : `Run the batch second pass from Review & generate. Denoise: ${y.toFixed(2)}.` }),
    x && /* @__PURE__ */ n("div", { class: "td-batch-progress", children: [
      /* @__PURE__ */ n("span", { children: t === "zh" ? "当前任务进度" : "Current task" }),
      /* @__PURE__ */ n("progress", { max: g.max || 1, value: g.value }),
      /* @__PURE__ */ n("b", { children: g.max ? `${Math.round(g.value / g.max * 100)}%` : "…" })
    ] }),
    !r && /* @__PURE__ */ n("div", { class: "td-post-warning", children: t === "zh" ? "当前工作流缺少后处理二采支流，请重新载入仓库中的 V7 导播台示例工作流。" : "This workflow does not contain the standalone second-pass branch. Reload the V7 example workflow from the repository." }),
    /* @__PURE__ */ n("div", { class: "td-post-shot-list", children: i.map(($) => {
      const j = o[$.key], E = Ge((j == null ? void 0 : j.response) ?? { results: [] });
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
        j != null && j.loading ? /* @__PURE__ */ n("div", { class: "td-post-shot-empty", children: t === "zh" ? "正在查询生成结果…" : "Loading results…" }) : j != null && j.response.error ? /* @__PURE__ */ n("div", { class: "td-post-shot-empty errors", children: t === "zh" ? "查询失败，请重启 ComfyUI 后重试。" : "Query failed. Restart ComfyUI and retry." }) : E.length ? /* @__PURE__ */ n("div", { class: "td-post-result-list", children: E.map((P) => {
          const C = Pe(P.path, "output"), N = io(P), R = N.includes(h[P.path]) ? h[P.path] : N[0], F = R ? l[`${P.path}:${R}`] : void 0;
          return /* @__PURE__ */ n("div", { class: "td-second-pass-result", children: [
            /* @__PURE__ */ n("button", { class: "td-post-result-choice", onClick: () => C && p({ path: P.path, title: `${$.shot.id} · ${$.shot.title}` }), children: [
              C ? /* @__PURE__ */ n(ct, { src: C, alt: ze(P.path) }) : /* @__PURE__ */ n("div", { class: "td-result-thumb", children: "×" }),
              /* @__PURE__ */ n("span", { children: [
                /* @__PURE__ */ n("strong", { children: [
                  bo(P.stage, P.processingMode, t),
                  (P.stage === "legacy_unknown" || !P.stage) && /* @__PURE__ */ n("em", { children: t === "zh" ? "兼容" : "Compatible" })
                ] }),
                /* @__PURE__ */ n("span", { title: P.path, children: ze(P.path) }),
                /* @__PURE__ */ n("small", { children: P.bytes ? `${(P.bytes / 1024 / 1024).toFixed(1)} MB` : "" })
              ] })
            ] }),
            /* @__PURE__ */ n("div", { class: "td-second-pass-actions", children: [
              R ? /* @__PURE__ */ n("select", { "aria-label": t === "zh" ? "该视频可用的处理方式" : "Available processing modes for this video", value: R, disabled: x, onChange: (I) => c((ne) => ({ ...ne, [P.path]: I.currentTarget.value })), children: N.map((I) => /* @__PURE__ */ n("option", { value: I, children: xo(I, t) })) }) : /* @__PURE__ */ n("span", { class: "td-second-pass-terminal", children: t === "zh" ? "只超分后不可再处理" : "Upscaled: no further processing" }),
              /* @__PURE__ */ n("button", { class: "primary td-second-pass-run", disabled: !r || !R || x, onClick: () => R && void v($.shot.id, P.path, R), children: (F == null ? void 0 : F.state) === "queued" ? t === "zh" ? "排队/执行中…" : "Queued/running…" : (F == null ? void 0 : F.state) === "done" ? t === "zh" ? "处理完成" : "Completed" : t === "zh" ? "开始处理" : "Process" })
            ] }),
            (F == null ? void 0 : F.state) === "error" && /* @__PURE__ */ n("div", { class: "td-second-pass-error", children: F.message })
          ] }, P.path);
        }) }) : /* @__PURE__ */ n("div", { class: "td-post-shot-empty", children: t === "zh" ? "没有可用的生成结果" : "No generated result available" })
      ] }, $.key);
    }) }),
    d && Pe(d.path, "output") && /* @__PURE__ */ n("div", { class: "td-post-preview-overlay", role: "presentation", onClick: () => p(null), children: /* @__PURE__ */ n("section", { role: "dialog", "aria-modal": "true", onClick: ($) => $.stopPropagation(), children: [
      /* @__PURE__ */ n("header", { children: [
        /* @__PURE__ */ n("strong", { children: d.title }),
        /* @__PURE__ */ n("button", { onClick: () => p(null), children: "×" })
      ] }),
      /* @__PURE__ */ n("video", { src: Pe(d.path, "output") ?? "", controls: !0, autoPlay: !0, preload: "metadata", playsInline: !0 }),
      /* @__PURE__ */ n("p", { children: ze(d.path) })
    ] }) })
  ] });
}
function wo(e, t, r) {
  return `/theodore-director/v1/generated-video?${new URLSearchParams({ projectName: e.project.name, runId: e.project.runId, shotId: t, activeIndex: String(r) }).toString()}`;
}
function yo(e) {
  return `/theodore-director/v1/postprocess/merged-videos?${new URLSearchParams({ projectName: e.project.name, runId: e.project.runId }).toString()}`;
}
async function Yn(e) {
  const t = await fetch(e), r = await t.json();
  if (!t.ok) throw new Error(r.error || `HTTP ${t.status}`);
  return r;
}
function Xn(e, t) {
  const r = Ge(e).filter((i) => i.path !== t);
  return { found: !!r.length, count: r.length, results: r };
}
function _o(e, t, r, i = "") {
  return { projectName: e.project.name, runId: e.project.runId, kind: t, shotId: i, path: r };
}
function ko(e, t) {
  return e.processingMode === "latent_upscale_second_pass" ? t === "zh" ? "Latent 放大二采" : "Latent upscale 2nd pass" : e.processingMode === "super_resolution_second_pass" || e.stage === "second_pass" ? t === "zh" ? "超分二采" : "Super-res 2nd pass" : e.processingMode === "super_resolution_only" || e.stage === "upscaled" ? t === "zh" ? "只超分" : "Super-res only" : e.stage === "first_pass" ? t === "zh" ? "一采" : "1st pass" : t === "zh" ? "旧结果" : "Legacy";
}
function So({ plan: e, language: t }) {
  const r = He(() => $n(e), [e]), [i, o] = G({}), [s, l] = G({ loading: !0, response: { found: !1, results: [] } }), [a, d] = G({}), [p, m] = G(null), [b, h] = G(""), [c, g] = G(0);
  Ee(() => {
    let v = !1;
    const x = {};
    return r.forEach((u) => {
      x[u.key] = { loading: !0, response: { found: !1, results: [] } };
    }), o(x), h(""), r.forEach((u) => {
      Yn(wo(e, u.shot.id, u.activeIndex)).then(($) => {
        v || o((j) => ({ ...j, [u.key]: { loading: !1, response: $ } }));
      }).catch(($) => {
        v || o((j) => ({ ...j, [u.key]: { loading: !1, response: { found: !1, results: [], error: String($) } } }));
      });
    }), () => {
      v = !0;
    };
  }, [e.project.name, e.project.runId, e.shots.map((v) => v.id).join("|"), c]), Ee(() => {
    let v = !1;
    return l({ loading: !0, response: { found: !1, results: [] } }), Yn(yo(e)).then((x) => {
      v || l({ loading: !1, response: x });
    }).catch((x) => {
      v || l({ loading: !1, response: { found: !1, results: [], error: String(x) } });
    }), () => {
      v = !0;
    };
  }, [e.project.name, e.project.runId, c]);
  const S = async (v, x, u = "", $ = "") => {
    const j = ze(x.path);
    if (window.confirm(t === "zh" ? `确定将“${j}”移入系统回收站吗？
可从系统回收站恢复。` : `Move “${j}” to the system trash?
You can restore it from the trash.`)) {
      (p == null ? void 0 : p.path) === x.path && m(null), d((P) => ({ ...P, [x.path]: !0 })), h(""), await new Promise((P) => requestAnimationFrame(() => requestAnimationFrame(() => P())));
      try {
        const P = await fetch("/theodore-director/v1/postprocess/delete-video", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(_o(e, v, x.path, u))
        }), C = await P.json();
        if (!P.ok) throw new Error(C.error || `HTTP ${P.status}`);
        v === "merged" ? l((N) => ({ ...N, response: Xn(N.response, x.path) })) : o((N) => {
          var R;
          return {
            ...N,
            [$]: { ...N[$], response: Xn(((R = N[$]) == null ? void 0 : R.response) ?? { found: !1, results: [] }, x.path) }
          };
        });
      } catch (P) {
        h(String(P instanceof Error ? P.message : P));
      } finally {
        d((P) => {
          const C = { ...P };
          return delete C[x.path], C;
        });
      }
    }
  }, T = (v, x, u, $ = "", j = "") => {
    const E = Pe(v.path, "output"), P = !!a[v.path];
    return /* @__PURE__ */ n("div", { class: `td-delete-result ${P ? "deleting" : ""}`, children: [
      /* @__PURE__ */ n("button", { class: "td-post-result-choice", disabled: P || !E, onClick: () => E && m({ path: v.path, title: u }), children: [
        P ? /* @__PURE__ */ n("div", { class: "td-result-thumb", children: "…" }) : E ? /* @__PURE__ */ n(ct, { src: E, alt: $o(v, t) }) : /* @__PURE__ */ n("div", { class: "td-result-thumb", children: "×" }),
        /* @__PURE__ */ n("span", { children: [
          /* @__PURE__ */ n("strong", { children: x === "merged" ? t === "zh" ? "合并视频" : "Merged video" : ko(v, t) }),
          /* @__PURE__ */ n("span", { title: v.path, children: ze(v.path) }),
          /* @__PURE__ */ n("small", { children: v.bytes ? `${(v.bytes / 1024 / 1024).toFixed(1)} MB` : "" })
        ] })
      ] }),
      /* @__PURE__ */ n("button", { class: "danger td-delete-video-button", disabled: P, onClick: () => void S(x, v, $, j), children: P ? t === "zh" ? "正在移动…" : "Moving…" : t === "zh" ? "移入回收站" : "Move to trash" })
    ] }, v.path);
  }, y = Ge(s.response);
  return /* @__PURE__ */ n("section", { class: "td-postprocess td-delete-panel", children: [
    /* @__PURE__ */ n("div", { class: "td-post-header", children: [
      /* @__PURE__ */ n("div", { children: [
        /* @__PURE__ */ n("h2", { children: t === "zh" ? "删除视频" : "Delete videos" }),
        /* @__PURE__ */ n("p", { children: t === "zh" ? "逐条预览并将当前项目的视频移入系统回收站；不会删除素材、latent 或尾帧。" : "Preview videos and move them to the system trash one at a time. Assets, latent files, and tail frames are preserved." })
      ] }),
      /* @__PURE__ */ n("div", { class: "td-post-actions", children: /* @__PURE__ */ n("button", { onClick: () => g((v) => v + 1), children: [
        "↻ ",
        t === "zh" ? "刷新结果" : "Refresh"
      ] }) })
    ] }),
    b && /* @__PURE__ */ n("div", { class: "td-post-error", children: [
      t === "zh" ? "删除失败：" : "Delete failed: ",
      b
    ] }),
    /* @__PURE__ */ n("div", { class: "td-post-shot-list", children: r.map((v) => {
      const x = i[v.key], u = Ge((x == null ? void 0 : x.response) ?? { results: [] });
      return /* @__PURE__ */ n("article", { class: "td-post-shot", children: [
        /* @__PURE__ */ n("header", { children: [
          /* @__PURE__ */ n("span", { children: [
            /* @__PURE__ */ n("strong", { children: v.shot.id }),
            /* @__PURE__ */ n("em", { children: v.shot.title })
          ] }),
          /* @__PURE__ */ n("span", { children: [
            v.shot.durationSeconds,
            "s"
          ] })
        ] }),
        !v.shot.enabled && /* @__PURE__ */ n("div", { class: "td-post-shot-disabled-note", children: t === "zh" ? "镜头已禁用，仍可管理其历史视频。" : "This shot is disabled; its historical videos can still be managed." }),
        x != null && x.loading ? /* @__PURE__ */ n("div", { class: "td-post-shot-empty", children: t === "zh" ? "正在查询生成结果…" : "Loading results…" }) : x != null && x.response.error ? /* @__PURE__ */ n("div", { class: "td-post-shot-empty errors", children: t === "zh" ? "查询失败" : "Unable to load results" }) : u.length ? /* @__PURE__ */ n("div", { class: "td-post-result-list", children: u.map(($) => T($, "shot", `${v.shot.id} · ${v.shot.title}`, v.shot.id, v.key)) }) : /* @__PURE__ */ n("div", { class: "td-post-shot-empty", children: t === "zh" ? "没有生成视频" : "No generated videos" })
      ] }, v.key);
    }) }),
    /* @__PURE__ */ n("section", { class: "td-post-merged td-delete-merged", children: [
      /* @__PURE__ */ n("header", { children: /* @__PURE__ */ n("div", { children: [
        /* @__PURE__ */ n("h2", { children: t === "zh" ? "合并视频" : "Merged videos" }),
        /* @__PURE__ */ n("span", { class: `td-result-state ${y.length ? "found" : ""}`, children: s.loading ? t === "zh" ? "查询中" : "Loading" : t === "zh" ? `${y.length} 个结果` : `${y.length} results` })
      ] }) }),
      s.loading ? /* @__PURE__ */ n("div", { class: "td-result-empty", children: t === "zh" ? "正在查询合并视频…" : "Loading merged videos…" }) : s.response.error ? /* @__PURE__ */ n("div", { class: "td-result-empty errors", children: t === "zh" ? "无法查询合并视频" : "Unable to load merged videos" }) : y.length ? /* @__PURE__ */ n("div", { class: "td-delete-merged-list", children: y.map((v) => T(v, "merged", t === "zh" ? "合并视频" : "Merged video")) }) : /* @__PURE__ */ n("div", { class: "td-result-empty", children: t === "zh" ? "没有合并视频" : "No merged videos" })
    ] }),
    p && Pe(p.path, "output") && /* @__PURE__ */ n("div", { class: "td-post-preview-overlay", role: "presentation", onClick: () => m(null), children: /* @__PURE__ */ n("section", { role: "dialog", "aria-modal": "true", onClick: (v) => v.stopPropagation(), children: [
      /* @__PURE__ */ n("header", { children: [
        /* @__PURE__ */ n("strong", { children: p.title }),
        /* @__PURE__ */ n("button", { "aria-label": t === "zh" ? "关闭预览" : "Close preview", onClick: () => m(null), children: "×" })
      ] }),
      /* @__PURE__ */ n("video", { src: Pe(p.path, "output") ?? "", controls: !0, autoPlay: !0, preload: "metadata", playsInline: !0 }),
      /* @__PURE__ */ n("p", { title: p.path, children: ze(p.path) })
    ] }) })
  ] });
}
function $o(e, t) {
  return `${t === "zh" ? "视频" : "Video"} ${ze(e.path)}`;
}
async function Zn(e) {
  const t = await fetch(e), r = await t.json();
  if (!t.ok) throw new Error(r.error || `HTTP ${t.status}`);
  return r;
}
function Io(e, t, r) {
  return `/theodore-director/v1/generated-video?${new URLSearchParams({
    projectName: e.project.name,
    runId: e.project.runId,
    shotId: t,
    activeIndex: String(r)
  }).toString()}`;
}
function Po(e) {
  return `/theodore-director/v1/postprocess/merged-videos?${new URLSearchParams({ projectName: e.project.name, runId: e.project.runId }).toString()}`;
}
function Co({ plan: e, language: t, queueSecondPass: r }) {
  const [i, o] = G("merge");
  return /* @__PURE__ */ n("section", { class: "td-postprocess-shell", children: [
    /* @__PURE__ */ n("div", { class: "td-post-mode-tabs", role: "tablist", children: [
      /* @__PURE__ */ n("button", { class: i === "merge" ? "active" : "", role: "tab", "aria-selected": i === "merge", onClick: () => o("merge"), children: t === "zh" ? "合并视频" : "Merge videos" }),
      /* @__PURE__ */ n("button", { class: i === "second-pass" ? "active" : "", role: "tab", "aria-selected": i === "second-pass", onClick: () => o("second-pass"), children: t === "zh" ? "单独二采" : "Standalone second pass" }),
      /* @__PURE__ */ n("button", { class: i === "delete" ? "active" : "", role: "tab", "aria-selected": i === "delete", onClick: () => o("delete"), children: t === "zh" ? "删除视频" : "Delete videos" })
    ] }),
    i === "merge" ? /* @__PURE__ */ n(Eo, { plan: e, language: t }) : i === "second-pass" ? /* @__PURE__ */ n(vo, { plan: e, language: t, queueSecondPass: r }) : /* @__PURE__ */ n(So, { plan: e, language: t })
  ] });
}
function Eo({ plan: e, language: t }) {
  const r = He(() => $n(e), [e]), [i, o] = G({}), [s, l] = G({}), [a, d] = G({}), [p, m] = G(null), [b, h] = G(!1), [c, g] = G(""), [S, T] = G(""), [y, v] = G({ found: !1, results: [] }), [x, u] = G(!1), [$, j] = G(!1), [E, P] = G(""), [C, N] = G(0), [R, F] = G("1"), [I, ne] = G(String(r.length || 1)), k = r.filter((z) => z.shot.enabled), D = k.length > 0 && k.every((z) => s[z.key]), M = ao(r, s, a), V = M.filter((z) => !z.path), Z = r.some((z) => {
    var q;
    return s[z.key] && ((q = i[z.key]) == null ? void 0 : q.loading);
  }), Y = r.reduce(
    (z, q) => z + (q.shot.enabled && s[q.key] ? q.shot.durationSeconds : 0),
    0
  ), L = He(() => Ge(y), [y]), _ = L.find((z) => z.path === E) ?? L[0];
  Ee(() => {
    let z = !1;
    const q = {}, pe = {};
    return r.forEach((re) => {
      q[re.key] = re.shot.enabled, pe[re.key] = { loading: !0, response: { found: !1, results: [] } };
    }), l((re) => {
      const f = {};
      return r.forEach((B) => {
        f[B.key] = B.shot.enabled ? re[B.key] ?? q[B.key] : !1;
      }), f;
    }), o(pe), g(""), r.forEach((re) => {
      Zn(Io(e, re.shot.id, re.activeIndex)).then((f) => {
        if (z) return;
        const B = Ge(f);
        o((X) => ({ ...X, [re.key]: { loading: !1, response: f } })), d((X) => {
          var le;
          return {
            ...X,
            [re.key]: B.some((xe) => xe.path === X[re.key]) ? X[re.key] : ((le = B[0]) == null ? void 0 : le.path) ?? ""
          };
        });
      }).catch((f) => {
        z || o((B) => ({
          ...B,
          [re.key]: { loading: !1, response: { found: !1, results: [], error: String(f) } }
        }));
      });
    }), () => {
      z = !0;
    };
  }, [e.project.name, e.project.runId, e.shots.map((z) => `${z.id}:${z.enabled}`).join("|"), C]), Ee(() => {
    let z = !1;
    return u(!0), Zn(Po(e)).then((q) => {
      if (z) return;
      const pe = Ge(q);
      v(q), P((re) => {
        var f;
        return pe.some((B) => B.path === re) ? re : ((f = pe[0]) == null ? void 0 : f.path) ?? "";
      });
    }).catch((q) => {
      z || v({ found: !1, results: [], error: String(q) });
    }).finally(() => {
      z || u(!1);
    }), () => {
      z = !0;
    };
  }, [e.project.name, e.project.runId, C]);
  const K = () => {
    const z = !D;
    l((q) => {
      const pe = { ...q };
      return k.forEach((re) => {
        pe[re.key] = z;
      }), pe;
    });
  }, ee = () => {
    const z = Number(R), q = Number(I);
    if (!Number.isInteger(z) || !Number.isInteger(q) || z < 1 || q < z || q > r.length) {
      window.alert(t === "zh" ? `请输入有效范围：1 ≤ m ≤ n ≤ ${r.length}` : `Enter a valid range: 1 ≤ m ≤ n ≤ ${r.length}`);
      return;
    }
    l(so(r, z, q));
  }, Q = async () => {
    if (!M.length) {
      window.alert(t === "zh" ? "请至少选择一个镜头" : "Select at least one shot.");
      return;
    }
    if (V.length) {
      window.alert(t === "zh" ? `以下已选镜头没有可用结果：${V.map((z) => z.shotId).join("、")}` : `Selected shots without a result: ${V.map((z) => z.shotId).join(", ")}`);
      return;
    }
    h(!0), g("");
    try {
      const z = await fetch("/theodore-director/v1/postprocess/merge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectName: e.project.name, runId: e.project.runId, selections: M })
      }), q = await z.json();
      if (!z.ok) throw new Error(q.error || `HTTP ${z.status}`);
      N((pe) => pe + 1);
    } catch (z) {
      g(String(z instanceof Error ? z.message : z));
    } finally {
      h(!1);
    }
  }, te = async () => {
    j(!0), T("");
    try {
      const z = await fetch("/theodore-director/v1/postprocess/open-folder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectName: e.project.name, runId: e.project.runId })
      }), q = await z.json();
      if (!z.ok) throw new Error(q.error || `HTTP ${z.status}`);
    } catch (z) {
      T(String(z instanceof Error ? z.message : z));
    } finally {
      j(!1);
    }
  }, ce = _ != null && _.path ? Pe(_.path, "output") : null;
  return /* @__PURE__ */ n("section", { class: "td-postprocess", children: [
    /* @__PURE__ */ n("div", { class: "td-post-header", children: [
      /* @__PURE__ */ n("div", { children: [
        /* @__PURE__ */ n("h2", { children: t === "zh" ? "合并视频" : "Merge videos" }),
        /* @__PURE__ */ n("p", { children: t === "zh" ? "从每个镜头选择一个结果，按当前分镜顺序进行无损合并。" : "Choose one result per shot and merge them losslessly in storyboard order." })
      ] }),
      /* @__PURE__ */ n("div", { class: "td-post-actions", children: [
        /* @__PURE__ */ n("button", { disabled: $, onClick: te, children: [
          "📁 ",
          $ ? t === "zh" ? "正在打开…" : "Opening…" : t === "zh" ? "打开结果文件夹" : "Open results folder"
        ] }),
        /* @__PURE__ */ n("button", { onClick: () => N((z) => z + 1), children: [
          "↻ ",
          t === "zh" ? "刷新结果" : "Refresh"
        ] }),
        /* @__PURE__ */ n("button", { onClick: K, children: D ? t === "zh" ? "全部取消" : "Clear all" : t === "zh" ? "一键全选" : "Select all" })
      ] })
    ] }),
    S && /* @__PURE__ */ n("div", { class: "td-post-error", children: [
      t === "zh" ? "打开结果文件夹失败：" : "Unable to open results folder: ",
      S
    ] }),
    /* @__PURE__ */ n("div", { class: "td-post-summary", children: [
      /* @__PURE__ */ n("span", { children: t === "zh" ? `已选择 ${M.length}/${k.length} 个启用镜头` : `${M.length}/${k.length} enabled shots selected` }),
      /* @__PURE__ */ n("span", { children: t === "zh" ? `预计时长 ${Y.toFixed(1)} 秒` : `Estimated duration ${Y.toFixed(1)} sec` }),
      /* @__PURE__ */ n("div", { class: "td-post-range", role: "group", "aria-label": t === "zh" ? "合并视频范围" : "Merge video range", children: [
        /* @__PURE__ */ n("span", { children: t === "zh" ? "范围" : "Range" }),
        /* @__PURE__ */ n("input", { type: "number", min: "1", max: r.length, step: "1", value: R, "aria-label": t === "zh" ? "起始镜头 m" : "Start shot m", onInput: (z) => F(z.currentTarget.value) }),
        /* @__PURE__ */ n("span", { children: "—" }),
        /* @__PURE__ */ n("input", { type: "number", min: "1", max: r.length, step: "1", value: I, "aria-label": t === "zh" ? "结束镜头 n" : "End shot n", onInput: (z) => ne(z.currentTarget.value) }),
        /* @__PURE__ */ n("button", { disabled: !r.length, onClick: ee, children: t === "zh" ? "确认范围" : "Apply range" })
      ] }),
      /* @__PURE__ */ n("button", { class: "primary", disabled: b || Z || !M.length || !!V.length, onClick: Q, children: b ? t === "zh" ? "正在合并…" : "Merging…" : t === "zh" ? "合并所选视频" : "Merge selected videos" })
    ] }),
    c && /* @__PURE__ */ n("div", { class: "td-post-error", children: [
      t === "zh" ? "合并失败：" : "Merge failed: ",
      c
    ] }),
    V.length > 0 && /* @__PURE__ */ n("div", { class: "td-post-warning", children: t === "zh" ? "已选镜头中存在尚未生成视频的镜头。" : "Some selected shots do not have generated videos yet." }),
    /* @__PURE__ */ n("div", { class: "td-post-shot-list", children: r.map((z) => {
      const q = i[z.key], pe = Ge((q == null ? void 0 : q.response) ?? { results: [] }), re = !!s[z.key];
      return /* @__PURE__ */ n("article", { class: `td-post-shot ${re ? "selected" : ""} ${z.shot.enabled ? "" : "disabled"}`, children: [
        /* @__PURE__ */ n("header", { children: [
          /* @__PURE__ */ n("label", { children: [
            /* @__PURE__ */ n("input", { type: "checkbox", checked: re, disabled: !z.shot.enabled, onChange: (f) => l((B) => ({ ...B, [z.key]: f.currentTarget.checked })) }),
            /* @__PURE__ */ n("span", { children: [
              /* @__PURE__ */ n("strong", { children: z.shot.id }),
              /* @__PURE__ */ n("em", { children: z.shot.title })
            ] })
          ] }),
          /* @__PURE__ */ n("span", { children: [
            z.shot.durationSeconds,
            "s"
          ] })
        ] }),
        !z.shot.enabled && /* @__PURE__ */ n("div", { class: "td-post-shot-disabled-note", children: t === "zh" ? "该镜头当前已禁用：历史结果可以预览，但不能参加合并。" : "This shot is disabled: historical results can be previewed but cannot be merged." }),
        q != null && q.loading ? /* @__PURE__ */ n("div", { class: "td-post-shot-empty", children: t === "zh" ? "正在查询生成结果…" : "Loading generated results…" }) : q != null && q.response.error ? /* @__PURE__ */ n("div", { class: "td-post-shot-empty errors", children: t === "zh" ? "查询失败，请重启 ComfyUI 后重试。" : "Query failed. Restart ComfyUI and retry." }) : pe.length ? /* @__PURE__ */ n("div", { class: "td-post-result-list", children: pe.map((f, B) => {
          const X = Pe(f.path, "output"), le = a[z.key] === f.path, xe = to(f.path, pe.length - B);
          return /* @__PURE__ */ n("div", { class: `td-post-result ${le ? "selected" : ""}`, children: [
            /* @__PURE__ */ n("button", { class: "td-post-result-choice", role: "radio", "aria-checked": le, onClick: () => d((de) => ({ ...de, [z.key]: f.path })), children: [
              X ? /* @__PURE__ */ n(ct, { src: X, alt: `${z.shot.title} ${t === "zh" ? "结果" : "result"} ${xe}` }) : /* @__PURE__ */ n("div", { class: "td-result-thumb", children: "×" }),
              /* @__PURE__ */ n("span", { children: [
                /* @__PURE__ */ n("strong", { children: [
                  t === "zh" ? `结果 ${xe}` : `Result ${xe}`,
                  B === 0 && /* @__PURE__ */ n("em", { children: t === "zh" ? "最新" : "Latest" })
                ] }),
                /* @__PURE__ */ n("span", { title: f.path, children: ze(f.path) }),
                /* @__PURE__ */ n("small", { children: f.bytes ? `${(f.bytes / 1024 / 1024).toFixed(1)} MB` : "" })
              ] })
            ] }),
            /* @__PURE__ */ n("button", { class: "td-post-result-play", disabled: !X, title: t === "zh" ? "播放预览" : "Play preview", onClick: () => X && m({ path: f.path, title: `${z.shot.id} · ${z.shot.title}` }), children: "▶" })
          ] }, f.path);
        }) }) : /* @__PURE__ */ n("div", { class: "td-post-shot-empty", children: t === "zh" ? "未找到这个镜头的生成结果" : "No generated result found for this shot" })
      ] }, z.key);
    }) }),
    /* @__PURE__ */ n("section", { class: "td-post-merged", children: [
      /* @__PURE__ */ n("header", { children: /* @__PURE__ */ n("div", { children: [
        /* @__PURE__ */ n("h2", { children: t === "zh" ? "合并结果" : "Merged results" }),
        /* @__PURE__ */ n("span", { class: `td-result-state ${L.length ? "found" : ""}`, children: x ? t === "zh" ? "查询中" : "Checking" : t === "zh" ? `${L.length} 个结果` : `${L.length} results` })
      ] }) }),
      x ? /* @__PURE__ */ n("div", { class: "td-result-empty", children: t === "zh" ? "正在查询合并结果…" : "Loading merged results…" }) : y.error ? /* @__PURE__ */ n("div", { class: "td-result-empty errors", children: t === "zh" ? "无法查询合并结果" : "Unable to query merged results" }) : _ && ce ? /* @__PURE__ */ n("div", { class: "td-generated-results", children: [
        /* @__PURE__ */ n("div", { class: "td-generated-video", children: [
          /* @__PURE__ */ n("video", { src: ce, controls: !0, preload: "metadata", playsInline: !0 }, _.path),
          /* @__PURE__ */ n("div", { class: "td-generated-meta", title: _.path, children: _.path })
        ] }),
        /* @__PURE__ */ n("div", { class: "td-result-list", children: L.map((z, q) => {
          const pe = Pe(z.path, "output");
          return /* @__PURE__ */ n("button", { class: `td-result-item ${z.path === _.path ? "selected" : ""}`, onClick: () => P(z.path), children: [
            pe ? /* @__PURE__ */ n(ct, { src: pe, alt: `${t === "zh" ? "合并结果" : "Merged result"} ${L.length - q}` }) : /* @__PURE__ */ n("div", { class: "td-result-thumb", children: "×" }),
            /* @__PURE__ */ n("span", { class: "td-result-item-copy", children: [
              /* @__PURE__ */ n("strong", { children: [
                t === "zh" ? `合并结果 ${L.length - q}` : `Merged result ${L.length - q}`,
                q === 0 && /* @__PURE__ */ n("em", { children: t === "zh" ? "最新" : "Latest" })
              ] }),
              /* @__PURE__ */ n("span", { children: ze(z.path) }),
              /* @__PURE__ */ n("small", { children: z.bytes ? `${(z.bytes / 1024 / 1024).toFixed(1)} MB` : "" })
            ] })
          ] }, z.path);
        }) })
      ] }) : /* @__PURE__ */ n("div", { class: "td-result-empty", children: t === "zh" ? "还没有合并结果" : "No merged result yet" })
    ] }),
    p && Pe(p.path, "output") && /* @__PURE__ */ n("div", { class: "td-post-preview-overlay", role: "presentation", onClick: () => m(null), children: /* @__PURE__ */ n("section", { role: "dialog", "aria-modal": "true", onClick: (z) => z.stopPropagation(), children: [
      /* @__PURE__ */ n("header", { children: [
        /* @__PURE__ */ n("strong", { children: p.title }),
        /* @__PURE__ */ n("button", { "aria-label": t === "zh" ? "关闭预览" : "Close preview", onClick: () => m(null), children: "×" })
      ] }),
      /* @__PURE__ */ n("video", { src: Pe(p.path, "output") ?? "", controls: !0, autoPlay: !0, preload: "metadata", playsInline: !0 }),
      /* @__PURE__ */ n("p", { title: p.path, children: ze(p.path) })
    ] }) })
  ] });
}
const Xr = String.raw`\{\{ref:([^{}]+)}}`;
function er() {
  return new RegExp(Xr, "g");
}
function Zr(e, t) {
  return e.assets.filter((r) => r.enabled && r.path.trim() && (!(r.shotIds ?? []).length || (r.shotIds ?? []).includes(t.id)) && !(t.disabledAssetIds ?? []).includes(r.id));
}
function ei(e, t) {
  const r = /* @__PURE__ */ new Map();
  for (const i of Zr(e, t)) r.set(i.alias, i);
  return r;
}
function ti(e, t, r) {
  const i = r.trim(), o = i.endsWith(".audio"), s = o ? i.slice(0, -6) : i, l = ei(e, t).get(s);
  return l ? !o || l.kind === "video" && l.includeVideoAudio : !1;
}
function tr(e, t) {
  const r = e.shots.filter((i) => i.enabled);
  return r.length > 0 && r.every((i) => ti(e, i, t));
}
function zo(e) {
  return {
    ...e,
    assets: [],
    shots: e.shots.map((t) => ({ ...t, disabledAssetIds: [] }))
  };
}
function ni(e, t) {
  const r = [], i = ei(e, t), o = [e.promptPrefix, t.prompt, e.promptSuffix].filter(Boolean).join(`
`), s = [...o.matchAll(er())].map((u) => u[1].trim()), l = [], a = /* @__PURE__ */ new Set(), d = (u) => {
    a.has(u.id) || (a.add(u.id), l.push(u));
  };
  [...i.values()].filter((u) => u.fixed).sort((u, $) => u.fixedOrder - $.fixedOrder || u.alias.localeCompare($.alias)).forEach(d);
  for (const u of s) {
    const $ = u.endsWith(".audio") ? u.slice(0, -6) : u, j = i.get($);
    if (!j) {
      r.push(`未找到或已禁用素材：${u}`);
      continue;
    }
    u.endsWith(".audio") && (j.kind !== "video" || !j.includeVideoAudio) && r.push(`视频伴音未启用：${u}`), d(j);
  }
  const p = l.filter((u) => u.kind === "image"), m = l.filter((u) => u.kind === "video"), b = m.filter((u) => u.includeVideoAudio), h = l.filter((u) => u.kind === "audio"), c = b.length + h.length, g = p.length + m.length + h.length;
  p.length > 9 && r.push(`参考图 ${p.length}/9，超出 H3 上限`), m.length > 3 && r.push(`参考视频 ${m.length}/3，超出 H3 上限`), c > 3 && r.push(`有效音频 ${c}/3，超出 H3 总上限`), g > 12 && r.push(`混合文件 ${g}/12，超出 H3 上限`), c && !p.length && !m.length && r.push("音频参考不能单独使用");
  const S = m.filter((u) => typeof u.durationSeconds == "number");
  for (const u of m) (u.durationSeconds == null || u.durationSeconds < 2 || u.durationSeconds > 15) && r.push(`视频 ${u.alias} 的时长必须为 2–15 秒`);
  S.reduce((u, $) => u + ($.durationSeconds ?? 0), 0) > 15 && r.push("参考视频总时长超过 15 秒");
  const T = [...b.map((u) => u.audioDurationSeconds ?? u.durationSeconds), ...h.map((u) => u.durationSeconds)];
  T.some((u) => u == null || u < 2 || u > 15) && r.push("每路有效音频时长必须为 2–15 秒"), T.reduce((u, $) => u + ($ ?? 0), 0) > 15 && r.push("有效音频总时长超过 15 秒");
  const y = /* @__PURE__ */ new Map();
  p.forEach((u, $) => y.set(u.alias, `<Picture ${$ + 1}>`)), m.forEach((u, $) => y.set(u.alias, `<Video ${$ + 1}>`)), b.forEach((u, $) => y.set(`${u.alias}.audio`, `<Audio ${$ + 1}>`)), h.forEach((u, $) => y.set(u.alias, `<Audio ${b.length + $ + 1}>`));
  const v = o.replace(er(), (u, $) => y.get($.trim()) ?? u), x = [...y.entries()].map(([u, $]) => ({ label: $, alias: u, kind: $.slice(1).split(" ")[0].toLowerCase() }));
  return { compiledPrompt: v, errors: r, slots: x, mixedFiles: g, audioCount: c };
}
function To(e, t) {
  var a, d, p, m, b, h;
  const r = [], i = /* @__PURE__ */ new Set(["off", "super_resolution_second_pass", "latent_upscale_second_pass", "super_resolution_only"]);
  (d = (a = e.project) == null ? void 0 : a.name) != null && d.trim() || r.push("Project name 不能为空"), (m = (p = e.project) == null ? void 0 : p.runId) != null && m.trim() || r.push("Run ID 不能为空"), (!Array.isArray(e.shots) || !e.shots.some((c) => c.enabled)) && r.push("至少需要一个启用分镜");
  const o = /* @__PURE__ */ new Set();
  for (const c of e.shots ?? [])
    (!((b = c.id) != null && b.trim()) || o.has(c.id)) && r.push(`分镜 ID 为空或重复：${c.id || "(空)"}`), o.add(c.id), c.durationSeconds > 0 || r.push(`分镜 ${c.id} 的时长必须大于 0`), i.has(c.secondSamplingMode) || r.push(`分镜 ${c.id} 的高清处理模式无效`);
  const s = /* @__PURE__ */ new Set();
  for (const c of e.assets ?? []) {
    const g = (h = c.alias) == null ? void 0 : h.toLocaleLowerCase();
    (!c.alias || /[\s{}]/.test(c.alias) || c.alias.endsWith(".audio") || s.has(g)) && r.push(`素材别名无效或重复：${c.alias || "(空)"}`), s.add(g), c.enabled && !c.path && !t && r.push(`素材 ${c.alias} 尚未选择文件`);
  }
  const l = e.shots.filter((c) => c.enabled && (!t || t.includes(c.id)));
  for (const c of l) {
    const g = (y) => y.fixed && (!(y.shotIds ?? []).length || y.shotIds.includes(c.id)) && !(c.disabledAssetIds ?? []).includes(y.id), S = e.assets.filter((y) => y.enabled && !y.path.trim() && (g(y) || c.prompt.includes(`{{ref:${y.alias}}}`) || c.prompt.includes(`{{ref:${y.alias}.audio}}`)));
    S.forEach((y) => r.push(`${c.title}: 素材 ${y.alias} 尚未上传文件`));
    const T = new Set(S.map((y) => y.alias));
    r.push(...ni(e, c).errors.filter((y) => ![...T].some((v) => y.endsWith(`：${v}`) || y.endsWith(`：${v}.audio`))).map((y) => `${c.title}: ${y}`));
  }
  return [...new Set(r)];
}
const Be = { kind: null, total: 0, done: 0, progress: { value: 0, max: 0 }, message: "" }, nr = {
  super_resolution_second_pass: ["超分二采（RTX 1.5× + 低噪重采）", "Super-res 2nd pass"],
  latent_upscale_second_pass: ["Latent 放大二采", "Latent upscale 2nd pass"],
  super_resolution_only: ["只超分（不重采，接缝零变化）", "Super-res only"]
};
function Ao({ plan: e, language: t, results: r, run: i, supportsSecondPass: o, setReview: s, setPipeline: l, onRunFirstPass: a, onRunSecondPass: d, onMerge: p, onStop: m, onRefresh: b, onOpenShot: h }) {
  var V, Z, Y;
  const c = (L, _) => t === "zh" ? L : _, [g, S] = G("all"), [T, y] = G(!0), v = e.shots.filter((L) => L.enabled), x = (L) => Le(r.byShot[L.id] ?? []), u = v.filter((L) => !x(L).length), $ = v.filter((L) => {
    var _;
    return ((_ = L.review) == null ? void 0 : _.status) === "approved" && x(L).length;
  }), j = v.filter((L) => {
    var _;
    return ((_ = L.review) == null ? void 0 : _.status) === "redo";
  }), E = ((V = e.pipeline) == null ? void 0 : V.secondPassMode) ?? "super_resolution_second_pass", P = ((Z = e.pipeline) == null ? void 0 : Z.secondPassDenoise) ?? 0.3, C = v.filter((L) => {
    const _ = Xe(L, x(L));
    return _ && Dt(r.byShot[L.id] ?? [], _.path).length;
  }).length, N = v.length > 0 && v.every((L) => Hr(L, r.byShot[L.id] ?? [])), R = v.length > 0 && C === v.length, F = i.kind !== null, I = (L) => {
    var _;
    return ((_ = L.review) == null ? void 0 : _.status) ?? "pending";
  }, ne = e.shots.filter((L) => g === "all" || L.enabled && I(L) === g), k = i.progress.max ? Math.round(i.progress.value / i.progress.max * 100) : 0, D = (Y = e.shots.find((L) => L.id === i.currentShotId)) == null ? void 0 : Y.title, M = () => {
    const L = $.map((K) => K.id);
    if (!L.length) return;
    const _ = v.length - $.length;
    _ > 0 && !window.confirm(c(`还有 ${_} 段没有通过审片，本次只对已通过的 ${L.length} 段执行二采。继续？`, `${_} shots are not approved; only ${L.length} will be processed. Continue?`)) || d(L, T);
  };
  return /* @__PURE__ */ n("div", { class: "td-review", children: [
    /* @__PURE__ */ n("section", { class: "td-review-steps", children: [
      /* @__PURE__ */ n("div", { class: `td-step ${u.length ? "active" : "done"}`, children: [
        /* @__PURE__ */ n("b", { children: "1" }),
        /* @__PURE__ */ n("div", { children: [
          /* @__PURE__ */ n("strong", { children: c("整体一采", "First pass") }),
          /* @__PURE__ */ n("span", { children: c(`${v.length - u.length}/${v.length} 段已有结果`, `${v.length - u.length}/${v.length} generated`) })
        ] })
      ] }),
      /* @__PURE__ */ n("div", { class: `td-step ${!u.length && $.length < v.length ? "active" : $.length === v.length && v.length ? "done" : ""}`, children: [
        /* @__PURE__ */ n("b", { children: "2" }),
        /* @__PURE__ */ n("div", { children: [
          /* @__PURE__ */ n("strong", { children: c("审片 / 单段重生", "Review / re-roll") }),
          /* @__PURE__ */ n("span", { children: c(`通过 ${$.length} · 需重生 ${j.length}`, `${$.length} approved · ${j.length} redo`) })
        ] })
      ] }),
      /* @__PURE__ */ n("div", { class: `td-step ${$.length === v.length && v.length && C < v.length ? "active" : C === v.length && v.length ? "done" : ""}`, children: [
        /* @__PURE__ */ n("b", { children: "3" }),
        /* @__PURE__ */ n("div", { children: [
          /* @__PURE__ */ n("strong", { children: c("整体二采", "Batch 2nd pass") }),
          /* @__PURE__ */ n("span", { children: c(`${C}/${v.length} 段已二采`, `${C}/${v.length} processed`) })
        ] })
      ] }),
      /* @__PURE__ */ n("div", { class: `td-step ${R ? "active" : ""}`, children: [
        /* @__PURE__ */ n("b", { children: "4" }),
        /* @__PURE__ */ n("div", { children: [
          /* @__PURE__ */ n("strong", { children: c("合并成片", "Merge") }),
          /* @__PURE__ */ n("span", { children: c("每段使用选定结果", "Uses each chosen take") })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ n("section", { class: "td-review-actions", children: [
      /* @__PURE__ */ n("div", { class: "td-action-group", children: [
        /* @__PURE__ */ n("span", { class: "td-action-title", children: c("一采", "First pass") }),
        /* @__PURE__ */ n("button", { class: "primary", disabled: F || r.loading || !u.length, onClick: () => a(u.map((L) => L.id), !1), children: r.loading ? c("正在读取结果…", "Loading results…") : u.length ? c(`生成缺失的 ${u.length} 段`, `Generate ${u.length} missing`) : c("全部已有一采", "All generated") }),
        j.length > 0 && /* @__PURE__ */ n("button", { disabled: F, onClick: () => a(j.map((L) => L.id), !0), children: [
          "↻ ",
          c(`重生标记的 ${j.length} 段`, `Re-roll ${j.length} marked`)
        ] }),
        /* @__PURE__ */ n("button", { disabled: F || !v.length, onClick: () => {
          window.confirm(c(`为全部 ${v.length} 段换新种子重新一采？旧结果会保留。`, `Re-roll all ${v.length} shots with new seeds?`)) && a(v.map((L) => L.id), !0);
        }, children: c("全部重新一采", "Re-roll all") })
      ] }),
      o && /* @__PURE__ */ n("div", { class: "td-action-group", children: [
        /* @__PURE__ */ n("span", { class: "td-action-title", children: c("二采", "2nd pass") }),
        /* @__PURE__ */ n("select", { value: E, disabled: F, onChange: (L) => l({ secondPassMode: L.currentTarget.value }), children: Object.keys(nr).map((L) => /* @__PURE__ */ n("option", { value: L, children: nr[L][t === "zh" ? 0 : 1] })) }),
        E !== "super_resolution_only" && /* @__PURE__ */ n("label", { class: "td-denoise", title: c("重绘强度越低，段与段接缝越稳定、人物越不易变；越高细节越多但接缝可能跳变。接力镜头多时建议 0.20–0.25。", "Lower = steadier seams, higher = more detail"), children: [
          /* @__PURE__ */ n("span", { children: c("重绘强度", "Denoise") }),
          /* @__PURE__ */ n("input", { type: "range", min: "0.1", max: "0.45", step: "0.01", value: P, disabled: F, onInput: (L) => l({ secondPassDenoise: Number(L.currentTarget.value) }) }),
          /* @__PURE__ */ n("b", { children: P.toFixed(2) })
        ] }),
        /* @__PURE__ */ n("label", { class: "td-inline-check", children: [
          /* @__PURE__ */ n("input", { type: "checkbox", checked: T, onChange: (L) => y(L.currentTarget.checked) }),
          c("复用有效二采（校验选片与接力来源）", "Reuse valid results")
        ] }),
        /* @__PURE__ */ n("button", { class: "primary", disabled: F || !$.length, onClick: M, children: c(`整体二采（已通过 ${$.length} 段）`, `Batch 2nd pass (${$.length})`) })
      ] }),
      E !== "super_resolution_only" && /* @__PURE__ */ n("p", { class: "td-hint", children: c("二采按接力链执行，自动补齐已通过审片的上游段；接力段读取上一段的高清画面与 AV latent。更换选片、参数或上游结果后需重跑，原音轨和片段帧数保留。", "Second passes follow relay chains and include approved predecessors. Changed sources or settings invalidate cached results. Original audio and frame counts are preserved.") }),
      /* @__PURE__ */ n("div", { class: "td-action-group", children: [
        /* @__PURE__ */ n("button", { disabled: F || !N, title: c("把每段选定的一采结果拼成整片，审片时检查整体连贯性", "Concatenate chosen first-pass takes for review"), onClick: () => p(!1), children: c("合并一采样片", "Merge 1st-pass cut") }),
        /* @__PURE__ */ n("button", { class: "accent", disabled: F || !R, title: R ? "" : c("全部镜头完成二采后才能合并成片（一采与二采分辨率不同，不能混拼）", "All shots need a 2nd pass first"), onClick: () => p(!0), children: c("合并二采成片", "Merge final") }),
        /* @__PURE__ */ n("button", { disabled: F, onClick: b, children: [
          "↻ ",
          c("刷新", "Refresh")
        ] })
      ] })
    ] }),
    (F || i.error || i.message) && /* @__PURE__ */ n("section", { class: `td-run-bar ${i.error ? "error" : F ? "running" : "done"}`, children: [
      /* @__PURE__ */ n("div", { children: [
        /* @__PURE__ */ n("strong", { children: i.error ? c("执行中断", "Stopped") : F ? i.kind === "first" ? c("一采进行中", "First pass running") : i.kind === "second" ? c("二采进行中", "Second pass running") : c("合并中", "Merging") : c("完成", "Done") }),
        /* @__PURE__ */ n("span", { children: i.error || (F ? `${i.done}/${i.total}${D ? ` · ${D}` : ""}` : i.message) })
      ] }),
      F && i.kind !== "merge" && /* @__PURE__ */ n("progress", { max: 100, value: k }),
      F && i.kind !== "merge" && /* @__PURE__ */ n("b", { children: [
        k,
        "%"
      ] }),
      F && /* @__PURE__ */ n("button", { class: "danger", onClick: m, children: c("停止", "Stop") })
    ] }),
    /* @__PURE__ */ n("nav", { class: "td-review-filter", children: [
      ["all", "pending", "approved", "redo"].map((L) => /* @__PURE__ */ n("button", { class: g === L ? "active" : "", onClick: () => S(L), children: { all: c(`全部 ${e.shots.length}`, `All ${e.shots.length}`), pending: c(`待审 ${v.filter((_) => I(_) === "pending").length}`, "Pending"), approved: c(`通过 ${$.length}`, "Approved"), redo: c(`需重生 ${j.length}`, "Redo") }[L] })),
      /* @__PURE__ */ n("span", { class: "td-review-hint", children: c("提示：接力段读取的是上一段“最近一次生成”的 latent，重生上一段后请连同后续接力段一起重生。", "Relay shots continue from the previous shot's latest take.") })
    ] }),
    /* @__PURE__ */ n("div", { class: "td-review-grid", children: ne.map((L) => /* @__PURE__ */ n(jo, { plan: e, shot: L, language: t, results: r, busy: F, running: i.currentShotId === L.id, setReview: s, onRunFirstPass: a, onOpenShot: h }, L.id)) })
  ] });
}
function jo({ plan: e, shot: t, language: r, results: i, busy: o, running: s, setReview: l, onRunFirstPass: a, onOpenShot: d }) {
  var F;
  const p = (I, ne) => r === "zh" ? I : ne, [m, b] = G(!1), h = i.byShot[t.id] ?? [], c = Le(h), g = Xe(t, c), S = g ? Dt(h, g.path) : [], T = m && S[0] ? S[0] : g, y = T ? Pe(T.path, "output") : null, v = e.shots.findIndex((I) => I.id === t.id), x = at(e, t), u = x ? kt(e, t.id) : void 0, $ = u ? Le(i.byShot[u.id] ?? []) : [], j = u ? mo(Xe(u, $), $, g, u.id, ho(t, g)) : "unknown", E = Jr(e, t.id), P = Wr(e, t.id), C = ((F = t.review) == null ? void 0 : F.status) ?? "pending", N = Qr(e, t), R = h.find((I) => I.stage === "second_pass" && I.sourcePath === (g == null ? void 0 : g.path) && I.relayValid === !1);
  return /* @__PURE__ */ n("article", { class: `td-review-card ${C} ${t.enabled ? "" : "off"} ${s ? "running" : ""}`, children: [
    /* @__PURE__ */ n("header", { children: [
      /* @__PURE__ */ n("button", { class: "td-review-title", title: p("在分镜页打开", "Open in editor"), onClick: () => d(t.id), children: [
        /* @__PURE__ */ n("em", { children: v + 1 }),
        t.title
      ] }),
      /* @__PURE__ */ n("span", { class: "td-review-tags", children: [
        /* @__PURE__ */ n("i", { children: [
          t.durationSeconds,
          "s"
        ] }),
        x && /* @__PURE__ */ n("i", { class: "relay", title: p(`接力自「${u == null ? void 0 : u.title}」`, "Relay"), children: [
          "⛓ ",
          p("接力", "relay")
        ] }),
        !t.enabled && /* @__PURE__ */ n("i", { children: p("禁用", "off") }),
        /* @__PURE__ */ n("i", { class: C, children: C === "approved" ? p("✓ 通过", "✓ OK") : C === "redo" ? p("↻ 需重生", "↻ redo") : p("待审", "pending") })
      ] })
    ] }),
    /* @__PURE__ */ n("div", { class: "td-review-media", children: [
      s ? /* @__PURE__ */ n("div", { class: "td-result-empty running", children: p("正在生成…", "Generating…") }) : y ? /* @__PURE__ */ n(oo, { src: y }) : /* @__PURE__ */ n("div", { class: "td-result-empty", children: p("还没有一采结果", "No take yet") }),
      S.length > 0 && /* @__PURE__ */ n("div", { class: "td-review-media-switch", children: [
        /* @__PURE__ */ n("button", { class: m ? "" : "active", onClick: () => b(!1), children: p("一采", "1st") }),
        /* @__PURE__ */ n("button", { class: m ? "active" : "", onClick: () => b(!0), children: p("二采", "2nd") })
      ] })
    ] }),
    c.length > 1 && /* @__PURE__ */ n("div", { class: "td-take-strip", children: c.map((I, ne) => {
      const k = Pe(I.path, "output");
      return /* @__PURE__ */ n("button", { class: `td-take ${I.path === (g == null ? void 0 : g.path) ? "selected" : ""}`, title: `${ze(I.path)}${I.modifiedAt ? `
${new Date(I.modifiedAt * 1e3).toLocaleString()}` : ""}`, onClick: () => l(t.id, { take: I.path }), children: [
        k ? /* @__PURE__ */ n(ct, { src: k, alt: I.path }) : null,
        /* @__PURE__ */ n("span", { children: [
          "#",
          c.length - ne,
          Dt(h, I.path).length ? " ★" : ""
        ] })
      ] }, I.path);
    }) }),
    j === "mismatch" && /* @__PURE__ */ n("p", { class: "td-review-warning", children: p(`接缝不匹配：本段结果生成时接力的是「${u == null ? void 0 : u.title}」的另一个结果。请把上一段选回对应结果，或重生本段。`, "Seam mismatch with the chosen take of the previous shot.") }),
    j === "wrong_source" && /* @__PURE__ */ n("p", { class: "td-review-warning", children: p(`接力来源错误：本段结果生成时读取的不是「${u == null ? void 0 : u.title}」的 latent（镜头顺序或启用状态变过）。请连同上一段一起重生。`, "This take relayed from a different shot; re-roll it together with the previous shot.") }),
    E && j !== "wrong_source" && /* @__PURE__ */ n("p", { class: "td-review-warning", children: p(`下次生成本段时将读到不属于「${u == null ? void 0 : u.title}」的 latent（镜头顺序或启用状态变过），重生时会建议连同上一段一起生成。`, "The relay slot no longer belongs to the previous shot.") }),
    N && /* @__PURE__ */ n("p", { class: "td-review-warning", children: p("提示词或素材在生成后被修改过，当前结果不代表最新设置。", "Prompt changed after this take was generated.") }),
    R && !S.length && /* @__PURE__ */ n("p", { class: "td-review-warning", children: p(R.relayReason || "二采接力状态已失效，请重新执行接力链。", "Second-pass relay is stale. Run this chain again.") }),
    t.note && /* @__PURE__ */ n("p", { class: "td-review-note", title: t.note, children: t.note }),
    /* @__PURE__ */ n("footer", { children: [
      /* @__PURE__ */ n("button", { class: `ok ${C === "approved" ? "active" : ""}`, disabled: !g, onClick: () => l(t.id, { status: C === "approved" ? "pending" : "approved", take: g == null ? void 0 : g.path }), children: [
        "✓ ",
        p("通过", "Approve")
      ] }),
      /* @__PURE__ */ n("button", { class: `warn ${C === "redo" ? "active" : ""}`, onClick: () => l(t.id, { status: C === "redo" ? "pending" : "redo" }), children: [
        "✗ ",
        p("需重生", "Redo")
      ] }),
      /* @__PURE__ */ n("button", { disabled: o || !t.enabled, onClick: () => a([t.id], !0), children: [
        "↻ ",
        p("重生", "Re-roll")
      ] }),
      P.length > 1 && /* @__PURE__ */ n("button", { disabled: o || !t.enabled, title: p(`后面 ${P.length - 1} 段接力自本段；一起重生才能保证接缝衔接`, "Re-roll with following relay shots"), onClick: () => a(P, !0), children: [
        "↻ ",
        p(`连同后续 ${P.length - 1} 段`, `+${P.length - 1} relay`)
      ] })
    ] })
  ] });
}
function No(e) {
  const t = e.reduce((r, i) => {
    const o = /^shot_(\d+)(?:_[a-z0-9]+)?$/i.exec(i.id.trim());
    return o ? Math.max(r, Number(o[1])) : r;
  }, 0);
  return Math.max(t, e.length) + 1;
}
function un() {
  return Math.random().toString(36).slice(2, 6);
}
function ri(e, t = 5, r, i = "super_resolution_second_pass") {
  const o = `shot_${String(e).padStart(3, "0")}`;
  return {
    id: r ? `${o}_${r()}` : o,
    title: `Shot ${e}`,
    prompt: "",
    negativePrompt: "",
    durationSeconds: t,
    enabled: !0,
    latentRelay: !0,
    secondSamplingMode: i,
    seed: null,
    disabledAssetIds: []
  };
}
function ii(e, t, r, i, o = "super_resolution_second_pass") {
  const s = No(e), l = Array.from({ length: t }, (a, d) => ri(s + d, r, i, o));
  return [...e, ...l];
}
function Mo(e = 5, t, r = "super_resolution_second_pass") {
  return [ri(1, e, t, r)];
}
async function Ro(e, t) {
  const r = new URLSearchParams({ projectName: e.project.name, runId: e.project.runId, shotId: t, activeIndex: "-1" }), i = await fetch(`/theodore-director/v1/generated-video?${r.toString()}`), o = await i.json();
  if (!i.ok) throw new Error(o.error || `HTTP ${i.status}`);
  return Ge(o);
}
function Lo(e, t) {
  const [r, i] = G({ byShot: {}, errors: {}, loading: !0 }), o = e.shots.map((s) => s.id).join("|");
  return Ee(() => {
    let s = !1;
    i((a) => ({ ...a, loading: !0 }));
    const l = e.shots.map((a) => a.id);
    return Promise.all(l.map(async (a) => {
      try {
        return [a, await Ro(e, a), ""];
      } catch (d) {
        return [a, [], String(d instanceof Error ? d.message : d)];
      }
    })).then((a) => {
      if (s) return;
      const d = {}, p = {};
      for (const [m, b, h] of a)
        d[m] = b, h && (p[m] = h);
      i({ byShot: d, errors: p, loading: !1 });
    }), () => {
      s = !0;
    };
  }, [e.project.name, e.project.runId, o, t]), r;
}
function Oo(e, t) {
  if (!Number.isInteger(t) || t < 0 || t > e.length) return null;
  const i = e.slice(0, t).lastIndexOf("@");
  if (i < 0) return null;
  const o = i > 0 ? e[i - 1] : "";
  if (o && /[A-Za-z0-9_.+-]/.test(o)) return null;
  const s = e.slice(i + 1, t);
  return /[\s{}@]/u.test(s) ? null : { start: i, end: t, query: s };
}
function Do(e, t) {
  const r = t.trim().toLocaleLowerCase();
  if (!r) return e;
  const i = [], o = [];
  for (const s of e)
    s.alias.toLocaleLowerCase().includes(r) ? i.push(s) : ze(s.path).toLocaleLowerCase().includes(r) && o.push(s);
  return [...i, ...o];
}
function Go(e, t, r) {
  const i = `{{ref:${r}}}`;
  return {
    value: `${e.slice(0, t.start)}${i}${e.slice(t.end)}`,
    caret: t.start + i.length
  };
}
function Fo(e, t) {
  const r = [], i = new RegExp(Xr, "g");
  let o = 0;
  for (const s of e.matchAll(i)) {
    const l = s.index ?? 0;
    l > o && r.push({ text: e.slice(o, l), reference: !1 }), r.push({ text: s[0], reference: !0, valid: t(s[1]) }), o = l + s[0].length;
  }
  return o < e.length && r.push({ text: e.slice(o), reference: !1 }), r;
}
const Uo = [
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
function Bo(e, t) {
  const r = window.getComputedStyle(e), i = e.getBoundingClientRect(), o = document.createElement("div");
  o.setAttribute("aria-hidden", "true"), o.style.position = "fixed", o.style.visibility = "hidden", o.style.pointerEvents = "none", o.style.left = `${i.left}px`, o.style.top = `${i.top}px`, o.style.width = `${e.offsetWidth}px`, o.style.height = `${e.offsetHeight}px`, o.style.overflow = "hidden", o.style.whiteSpace = "pre-wrap";
  for (const d of Uo) o.style[d] = r[d];
  o.append(document.createTextNode(e.value.slice(0, t)));
  const s = document.createElement("span");
  s.textContent = "​", o.append(s), document.body.append(o), o.scrollTop = e.scrollTop, o.scrollLeft = e.scrollLeft;
  const l = s.getBoundingClientRect(), a = Number.parseFloat(r.lineHeight) || Number.parseFloat(r.fontSize) * 1.45 || 20;
  return o.remove(), { left: l.left, top: l.top, bottom: l.top + a };
}
const Vo = {
  zh: { image: "图片", video: "视频", audio: "音频" },
  en: { image: "Image", video: "Video", audio: "Audio" }
};
function mn({ value: e, rows: t, onInput: r, isReferenceValid: i, mentionAssets: o, mentionLanguage: s = "zh" }) {
  const l = ke(null), a = ke(null), d = ke(null), p = ke(null), m = ke(!1), b = ke(!1), h = ke([]), c = ke([]), g = ke(`td-reference-mention-${Math.random().toString(36).slice(2)}`).current, [S, T] = G(null), [y, v] = G(0), [x, u] = G(null), $ = Fo(e, i), j = He(
    () => S && o ? Do(o, S.query) : [],
    [S, o]
  ), E = () => {
    T(null), u(null), v(0);
  }, P = (k) => {
    if (!o || k.selectionStart !== k.selectionEnd) {
      E();
      return;
    }
    const D = Oo(k.value, k.selectionStart);
    if (!D) {
      E();
      return;
    }
    T((M) => M && M.start === D.start && M.end === D.end && M.query === D.query ? M : D);
  }, C = () => {
    var K;
    if (!S || !d.current) return;
    const k = Bo(d.current, S.end), D = 8, M = Math.min(390, Math.max(240, window.innerWidth - D * 2)), V = Math.min(320, Math.max(150, window.innerHeight - D * 2)), Z = Math.min(((K = p.current) == null ? void 0 : K.offsetHeight) || V, V), Y = Math.min(Math.max(k.left, D), window.innerWidth - M - D), _ = k.bottom + 6 + Z > window.innerHeight - D && k.top - Z - 6 >= D ? k.top - Z - 6 : Math.min(k.bottom + 6, window.innerHeight - Z - D);
    u((ee) => ee && ee.left === Y && ee.top === _ && ee.width === M && ee.maxHeight === V ? ee : { left: Y, top: _, width: M, maxHeight: V });
  };
  Ii(C, [S, j.length, !!x]), Ee(() => {
    if (!S) return;
    const k = () => C(), D = (M) => {
      var V, Z;
      M.target instanceof Node && ((V = l.current) != null && V.contains(M.target) || (Z = p.current) != null && Z.contains(M.target)) || E();
    };
    return window.addEventListener("resize", k), document.addEventListener("scroll", k, !0), document.addEventListener("mousedown", D), () => {
      window.removeEventListener("resize", k), document.removeEventListener("scroll", k, !0), document.removeEventListener("mousedown", D);
    };
  }, [S]), Ee(() => v(0), [S == null ? void 0 : S.query]), Ee(() => {
    y >= j.length && v(Math.max(0, j.length - 1));
  }, [y, j.length]), Ee(() => {
    var k, D;
    (D = (k = p.current) == null ? void 0 : k.querySelector('[aria-selected="true"]')) == null || D.scrollIntoView({ block: "nearest" });
  }, [y, j.length]);
  const N = (k) => {
    a.current && (a.current.scrollTop = k.currentTarget.scrollTop, a.current.scrollLeft = k.currentTarget.scrollLeft), S && C();
  }, R = (k, D) => {
    if (!d.current) return;
    const M = d.current;
    b.current = !0, M.value = k, M.dispatchEvent(new Event("input", { bubbles: !0 })), b.current = !1, E(), window.requestAnimationFrame(() => {
      M.focus({ preventScroll: !0 }), M.setSelectionRange(D, D);
    });
  }, F = (k) => {
    if (!(k.ctrlKey || k.metaKey) || k.altKey) return !1;
    const D = k.key.toLocaleLowerCase(), M = D === "y" || D === "z" && k.shiftKey;
    if (!(D === "z" && !k.shiftKey) && !M) return !1;
    const Z = M ? c.current : h.current, Y = Z[Z.length - 1], L = M ? Y == null ? void 0 : Y.beforeValue : Y == null ? void 0 : Y.afterValue;
    return !Y || k.currentTarget.value !== L ? !1 : (k.preventDefault(), Z.pop(), (M ? h.current : c.current).push(Y), R(M ? Y.afterValue : Y.beforeValue, M ? Y.afterCaret : Y.beforeCaret), !0);
  }, I = (k) => {
    if (!S || !d.current) return;
    const D = d.current, M = Go(D.value, S, k.alias), V = `{{ref:${k.alias}}}`, Z = {
      beforeValue: D.value,
      afterValue: M.value,
      beforeCaret: S.end,
      afterCaret: M.caret
    };
    D.focus({ preventScroll: !0 }), D.setSelectionRange(S.start, S.end);
    let Y = !1;
    try {
      document.execCommand("insertText", !1, V), Y = D.value === M.value;
    } catch {
    }
    Y || (D.value = M.value, D.dispatchEvent(new Event("input", { bubbles: !0 }))), h.current.push(Z), h.current.length > 100 && h.current.shift(), c.current = [], E(), window.requestAnimationFrame(() => {
      var L, _;
      (L = d.current) == null || L.focus({ preventScroll: !0 }), (_ = d.current) == null || _.setSelectionRange(M.caret, M.caret);
    });
  }, ne = (k) => {
    if (!(k.isComposing || m.current) && !F(k) && S) {
      if (k.key === "Escape") {
        k.preventDefault(), E();
        return;
      }
      if (j.length) {
        if (k.key === "ArrowDown" || k.key === "ArrowUp") {
          k.preventDefault();
          const D = k.key === "ArrowDown" ? 1 : -1;
          v((M) => (M + D + j.length) % j.length);
          return;
        }
        (k.key === "Enter" || k.key === "Tab") && (k.preventDefault(), I(j[y] ?? j[0]));
      }
    }
  };
  return /* @__PURE__ */ n("span", { ref: l, class: "td-highlight-textarea", children: [
    /* @__PURE__ */ n("pre", { ref: a, class: "td-highlight-backdrop", "aria-hidden": "true", children: [
      $.map((k, D) => k.reference ? /* @__PURE__ */ n("mark", { class: k.valid ? "valid" : "invalid", children: k.text }, D) : k.text),
      e.endsWith(`
`) && " "
    ] }),
    /* @__PURE__ */ n(
      "textarea",
      {
        ref: d,
        class: "td-highlight-input",
        rows: t,
        value: e,
        "aria-autocomplete": o ? "list" : void 0,
        "aria-controls": S ? g : void 0,
        "aria-expanded": o ? !!S : void 0,
        "aria-activedescendant": S && j[y] ? `${g}-${j[y].id}` : void 0,
        onInput: (k) => {
          r(k);
          const D = k instanceof InputEvent ? k.inputType : "";
          !b.current && D !== "historyUndo" && D !== "historyRedo" && (c.current = []), m.current || P(k.currentTarget);
        },
        onClick: (k) => P(k.currentTarget),
        onSelect: (k) => {
          m.current || P(k.currentTarget);
        },
        onKeyDown: ne,
        onKeyUp: (k) => {
          !m.current && !["ArrowDown", "ArrowUp", "Enter", "Tab", "Escape"].includes(k.key) && P(k.currentTarget);
        },
        onCompositionStart: () => {
          m.current = !0;
        },
        onCompositionEnd: (k) => {
          m.current = !1, P(k.currentTarget);
        },
        onBlur: () => window.setTimeout(() => {
          document.activeElement !== d.current && E();
        }, 0),
        onScroll: N
      }
    ),
    S && x && /* @__PURE__ */ n(
      "div",
      {
        ref: p,
        id: g,
        class: "td-reference-mention-menu",
        role: "listbox",
        "aria-label": s === "zh" ? "选择参考素材" : "Choose reference media",
        style: { left: x.left, top: x.top, width: x.width, maxHeight: x.maxHeight },
        onMouseDown: (k) => k.preventDefault(),
        children: [
          /* @__PURE__ */ n("header", { children: [
            /* @__PURE__ */ n("strong", { children: s === "zh" ? "@ 参考素材" : "@ Reference media" }),
            /* @__PURE__ */ n("span", { children: j.length })
          ] }),
          j.length ? /* @__PURE__ */ n("div", { class: "td-reference-mention-options", children: j.map((k, D) => {
            const M = k.kind === "image" ? Tr(k.path) : null, V = ze(k.path);
            return /* @__PURE__ */ n(
              "button",
              {
                id: `${g}-${k.id}`,
                type: "button",
                role: "option",
                "aria-selected": D === y,
                class: D === y ? "active" : "",
                onMouseEnter: () => v(D),
                onClick: () => I(k),
                children: [
                  /* @__PURE__ */ n("span", { class: `td-reference-mention-thumb ${k.kind}`, children: M ? /* @__PURE__ */ n("img", { src: M, alt: "", loading: "lazy" }) : /* @__PURE__ */ n("span", { children: k.kind === "image" ? "▧" : k.kind === "video" ? "▶" : "♫" }) }),
                  /* @__PURE__ */ n("span", { class: "td-reference-mention-copy", children: [
                    /* @__PURE__ */ n("strong", { children: k.alias }),
                    /* @__PURE__ */ n("small", { children: V || k.path })
                  ] }),
                  /* @__PURE__ */ n("em", { children: Vo[s][k.kind] })
                ]
              },
              k.id
            );
          }) }) : /* @__PURE__ */ n("p", { class: "td-reference-mention-empty", children: s === "zh" ? "没有匹配的可用素材" : "No available media matches" })
        ]
      }
    )
  ] });
}
const rr = [
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
], qo = [
  { value: "", label: ["默认", "Default"] },
  { value: "small amplitude", label: ["小幅度", "Small"] },
  { value: "large amplitude", label: ["大幅度", "Large"] }
], Ho = [
  { value: "", label: ["默认", "Default"] },
  { value: "slow", label: ["缓慢", "Slow"] },
  { value: "fast", label: ["快速", "Fast"] }
];
function Wo(e, t, r, i, o = "", s = "", l = "") {
  if (e === "remains static")
    return i.trim() ? `The camera remains static on ${i.trim()}.` : "The camera remains static.";
  if (e === "holds position and racks focus") {
    const m = r.trim() ? `from ${r.trim()}` : "from the foreground", b = i.trim() ? ` to ${i.trim()}` : " to the background";
    return `The camera holds position and racks focus ${m}${b}.`;
  }
  if (e === "uses a POV shot")
    return `The camera adopts a POV perspective ${r.trim() ? `from ${r.trim()}` : "from the subject's viewpoint"}${i.trim() ? `, settling on ${i.trim()}` : ""}.`;
  const a = [`As ${t.trim() || "the action unfolds"}, the camera ${e}`], d = !e.startsWith("shakes") && !e.startsWith("rolls");
  d && r.trim() && a.push(`toward ${r.trim()}`), d && l.trim() && a.push(`along ${l.trim()}`), o.trim() && a.push(`with ${o.trim()}`), s.trim() && a.push(`at ${s.trim()} speed`);
  let p = a.join(" ");
  return i.trim() && (p += `, settling on ${i.trim()}`), `${p}.`;
}
const Jo = ["off", "super_resolution_second_pass", "latent_upscale_second_pass", "super_resolution_only"], Ko = {
  off: ["关闭（推荐）", "Off (recommended)"],
  super_resolution_second_pass: ["超分二采", "Super-res 2nd pass"],
  latent_upscale_second_pass: ["Latent 放大二采", "Latent upscale 2nd pass"],
  super_resolution_only: ["只超分", "Super-res only"]
};
function Ft(e) {
  const t = Math.round(e);
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
}
function Qo({ plan: e, language: t, selected: r, setSelected: i, mutate: o, setReview: s, results: l, supportsSecondSampling: a, running: d, runningShotId: p, onRegenerate: m, onOpenBatch: b, notify: h }) {
  var re;
  const c = ke(null);
  Ee(() => {
    const f = c.current, B = f == null ? void 0 : f.querySelector(".selected");
    if (!f || !B) return;
    const X = f.getBoundingClientRect(), le = B.getBoundingClientRect();
    le.left < X.left ? f.scrollLeft -= X.left - le.left : le.right > X.right && (f.scrollLeft += le.right - X.right);
  }, [r]);
  const g = (f, B) => t === "zh" ? f : B, [S, T] = G(!1), [y, v] = G(rr[0].value), [x, u] = G(""), [$, j] = G(""), [E, P] = G(""), [C, N] = G(""), [R, F] = G(""), [I, ne] = G(""), k = e.shots[Math.min(r, e.shots.length - 1)], D = He(() => k ? ni(e, k) : null, [e, k]), M = He(() => k ? Zr(e, k) : [], [e, k]), V = e.shots.filter((f) => f.enabled), Z = V.reduce((f, B) => f + B.durationSeconds, 0), Y = k ? ((re = V[0]) == null ? void 0 : re.id) === k.id : !1, L = k ? Le(l.byShot[k.id] ?? []) : [], _ = k ? Xe(k, L) : void 0, K = _ ? Pe(_.path, "output") : null, ee = k ? Wr(e, k.id) : [], Q = y === "remains static", te = y === "holds position and racks focus", ce = y.startsWith("shakes") || y.startsWith("rolls"), z = (f) => o((B) => {
    const X = B.shots[r];
    X && f(X);
  }), q = (f, B) => o((X) => {
    const le = f + B;
    le < 0 || le >= X.shots.length || ([X.shots[f], X.shots[le]] = [X.shots[le], X.shots[f]], i(le));
  }), pe = (f) => {
    const B = e.shots[f];
    e.shots.length <= 1 || !B || window.confirm(g(`删除镜头「${B.title}」？已生成的视频文件不会被删除。`, `Delete "${B.title}"? Generated files are kept.`)) && (o((X) => {
      X.shots.splice(f, 1);
    }), i(Math.max(0, Math.min(r > f ? r - 1 : r, e.shots.length - 2))));
  };
  return /* @__PURE__ */ n("div", { class: "td-shots", children: [
    /* @__PURE__ */ n("aside", { class: "td-shot-sidebar", children: [
      /* @__PURE__ */ n("div", { class: "td-timeline-heading", children: [
        /* @__PURE__ */ n("strong", { children: g("分镜时间线", "SHOT TIMELINE") }),
        /* @__PURE__ */ n("span", { children: g("按顺序选择镜头 · 接力镜头保持相邻", "Select shots in sequence · keep relay shots together") })
      ] }),
      /* @__PURE__ */ n("div", { class: "td-shot-list", ref: c, children: e.shots.map((f, B) => {
        var de;
        const X = Le(l.byShot[f.id] ?? []), le = at(e, f), xe = (de = f.review) == null ? void 0 : de.status;
        return /* @__PURE__ */ n("div", { class: `td-shot-card ${B === r ? "selected" : ""} ${f.enabled ? "" : "off"} ${le ? "relay" : ""} ${p === f.id ? "running" : ""}`, onClick: () => i(B), children: [
          le && /* @__PURE__ */ n("span", { class: "td-relay-link", title: g("latent 接力：本段从上一段末尾无缝延续", "Latent relay from previous shot") }),
          /* @__PURE__ */ n("div", { class: "td-shot-card-main", children: [
            /* @__PURE__ */ n("strong", { children: [
              /* @__PURE__ */ n("em", { children: B + 1 }),
              f.title
            ] }),
            /* @__PURE__ */ n("span", { class: "td-shot-card-meta", children: [
              /* @__PURE__ */ n("b", { children: [
                f.durationSeconds,
                "s"
              ] }),
              le && /* @__PURE__ */ n("i", { class: "relay", children: g("接力", "relay") }),
              !f.enabled && /* @__PURE__ */ n("i", { children: g("已禁用", "off") }),
              X.length > 0 && /* @__PURE__ */ n("i", { children: g(`${X.length} 个结果`, `${X.length} takes`) }),
              xe === "approved" && /* @__PURE__ */ n("i", { class: "ok", children: [
                "✓ ",
                g("通过", "OK")
              ] }),
              xe === "redo" && /* @__PURE__ */ n("i", { class: "warn", children: [
                "↻ ",
                g("需重生", "redo")
              ] }),
              Qr(e, f) && /* @__PURE__ */ n("i", { class: "warn", children: g("已修改", "edited") }),
              p === f.id && /* @__PURE__ */ n("i", { class: "run", children: g("生成中", "running") })
            ] })
          ] }),
          /* @__PURE__ */ n("div", { class: "td-shot-card-actions", onClick: (Oe) => Oe.stopPropagation(), children: [
            /* @__PURE__ */ n("button", { title: g("上移", "Move up"), disabled: B === 0, onClick: () => q(B, -1), children: "↑" }),
            /* @__PURE__ */ n("button", { title: g("下移", "Move down"), disabled: B === e.shots.length - 1, onClick: () => q(B, 1), children: "↓" }),
            /* @__PURE__ */ n("button", { class: "danger", title: g("删除镜头", "Delete"), disabled: e.shots.length <= 1, onClick: () => pe(B), children: "×" })
          ] })
        ] }, f.id);
      }) }),
      /* @__PURE__ */ n("div", { class: "td-shot-sidebar-footer", children: [
        /* @__PURE__ */ n("span", { class: "td-total", children: g(`${V.length} 段启用 · 总时长 ${Ft(Z)}`, `${V.length} enabled · ${Ft(Z)}`) }),
        /* @__PURE__ */ n("div", { class: "td-two-buttons", children: [
          /* @__PURE__ */ n("button", { onClick: () => o((f) => {
            const B = f.shots.length;
            f.shots = ii(f.shots, 1, f.defaults.durationSeconds ?? 6, un, f.defaults.secondSamplingMode ?? "off").map((X, le) => le === B ? { ...X, latentRelay: !1, title: g(`镜头 ${B + 1}`, `Shot ${B + 1}`) } : X), i(B);
          }), children: [
            "＋ ",
            g("添加镜头", "Add shot")
          ] }),
          /* @__PURE__ */ n("button", { onClick: b, children: g("批量编辑", "Batch edit") })
        ] })
      ] })
    ] }),
    k && /* @__PURE__ */ n("section", { class: "td-form td-shot-form", children: [
      /* @__PURE__ */ n("div", { class: "td-composer-heading", children: [
        /* @__PURE__ */ n("div", { children: [
          /* @__PURE__ */ n("small", { children: g(`镜头 ${String(r + 1).padStart(2, "0")} / ${e.shots.length}`, `SHOT ${String(r + 1).padStart(2, "0")} / ${e.shots.length}`) }),
          /* @__PURE__ */ n("h3", { children: g("镜头编排", "Shot composer") })
        ] }),
        /* @__PURE__ */ n("div", { children: [
          /* @__PURE__ */ n("button", { disabled: r === 0, onClick: () => i(r - 1), "aria-label": g("上一镜头", "Previous shot"), children: "←" }),
          /* @__PURE__ */ n("button", { disabled: r === e.shots.length - 1, onClick: () => i(r + 1), "aria-label": g("下一镜头", "Next shot"), children: "→" })
        ] })
      ] }),
      /* @__PURE__ */ n("div", { class: "td-shot-head", children: [
        /* @__PURE__ */ n("label", { class: "grow", children: [
          g("标题", "Title"),
          /* @__PURE__ */ n("input", { value: k.title, onInput: (f) => z((B) => {
            B.title = f.currentTarget.value;
          }) })
        ] }),
        /* @__PURE__ */ n("label", { class: "narrow", children: [
          g("时长（秒）", "Duration (s)"),
          /* @__PURE__ */ n("input", { type: "number", min: "1", max: "15", step: "0.5", value: k.durationSeconds, onInput: (f) => z((B) => {
            B.durationSeconds = Number(f.currentTarget.value);
          }) })
        ] }),
        /* @__PURE__ */ n("label", { class: "seed", children: [
          g("种子", "Seed"),
          /* @__PURE__ */ n("span", { class: "td-seed-input", children: [
            /* @__PURE__ */ n("input", { type: "number", placeholder: g("自动", "auto"), value: k.seed ?? "", onInput: (f) => z((B) => {
              B.seed = f.currentTarget.value === "" ? null : Number(f.currentTarget.value);
            }) }),
            /* @__PURE__ */ n("button", { title: g("随机新种子（重生时会自动换）", "Random seed"), onClick: () => z((f) => {
              f.seed = Yr();
            }), children: "🎲" })
          ] })
        ] })
      ] }),
      (k.durationSeconds < 5 || k.durationSeconds > 15) && /* @__PURE__ */ n("div", { class: "td-inline-warning", children: g("H3 单段建议 5–15 秒；超出范围容易出现动作压缩或拖沓。", "H3 segments work best between 5 and 15 seconds.") }),
      /* @__PURE__ */ n("div", { class: "td-shot-switches", children: [
        /* @__PURE__ */ n("label", { class: "td-toggle", children: [
          /* @__PURE__ */ n("input", { type: "checkbox", checked: k.enabled, onChange: (f) => z((B) => {
            B.enabled = f.currentTarget.checked;
          }) }),
          /* @__PURE__ */ n("span", { children: g("启用", "Enabled") })
        ] }),
        /* @__PURE__ */ n("label", { class: "td-toggle", title: g("只在与上一段是同一个不切镜的连续长镜头时开启。开启后本段开头会钉住上一段末尾约 0.9 秒画面与声音。", "Only for an uninterrupted long take."), children: [
          /* @__PURE__ */ n("input", { type: "checkbox", checked: k.latentRelay, disabled: Y, onChange: (f) => z((B) => {
            B.latentRelay = f.currentTarget.checked;
          }) }),
          /* @__PURE__ */ n("span", { children: Y ? g("接力上一段（首段不可用）", "Relay (n/a for first)") : g("接力上一段（同一长镜头）", "Relay from previous (long take)") })
        ] }),
        /* @__PURE__ */ n("details", { class: "td-advanced", children: [
          /* @__PURE__ */ n("summary", { children: g("高级", "Advanced") }),
          /* @__PURE__ */ n("div", { class: "td-advanced-body", children: [
            /* @__PURE__ */ n("label", { children: [
              g("镜头 ID", "Shot ID"),
              /* @__PURE__ */ n("input", { value: k.id, onInput: (f) => z((B) => {
                B.id = f.currentTarget.value;
              }) })
            ] }),
            a && /* @__PURE__ */ n("label", { title: g("导播台的“一采”始终关闭高清处理；该选项只在直接点击 ComfyUI 原生 Queue 时生效。", "The director's first pass always disables this."), children: [
              g("原生 Queue 时的高清处理", "Processing for native Queue"),
              /* @__PURE__ */ n("select", { value: k.secondSamplingMode, onChange: (f) => z((B) => {
                B.secondSamplingMode = f.currentTarget.value;
              }), children: Jo.map((f) => /* @__PURE__ */ n("option", { value: f, children: Ko[f][t === "zh" ? 0 : 1] })) })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ n("details", { class: "td-note", open: !!k.note, children: [
        /* @__PURE__ */ n("summary", { children: g("分镜说明（中文，审片对照用）", "Shot notes") }),
        /* @__PURE__ */ n("textarea", { rows: 4, placeholder: g("画面、站位、动作与对白摘要。只供审片对照，不会发送给模型。", "Not sent to the model."), value: k.note ?? "", onInput: (f) => z((B) => {
          B.note = f.currentTarget.value;
        }) })
      ] }),
      /* @__PURE__ */ n("label", { class: "td-prompt-field", children: [
        /* @__PURE__ */ n("span", { class: "td-field-label", children: [
          g("正向提示词", "Prompt"),
          /* @__PURE__ */ n("small", { children: g("用 {{ref:别名}} 引用素材，输入 @ 快速选择", "Use {{ref:alias}}; type @ to pick") })
        ] }),
        /* @__PURE__ */ n(mn, { rows: 18, value: k.prompt, mentionAssets: M, mentionLanguage: t, isReferenceValid: (f) => ti(e, k, f), onInput: (f) => z((B) => {
          B.prompt = f.currentTarget.value;
        }) }, k.id)
      ] }),
      /* @__PURE__ */ n("details", { class: "td-camera-builder", children: [
        /* @__PURE__ */ n("summary", { children: g("运镜句构造", "Camera move") }),
        /* @__PURE__ */ n("div", { class: "td-camera-builder-fields", children: [
          /* @__PURE__ */ n("label", { children: [
            g("主运动", "Main move"),
            /* @__PURE__ */ n("select", { value: y, onChange: (f) => v(f.currentTarget.value), children: rr.map((f) => /* @__PURE__ */ n("option", { value: f.value, children: f.label[t === "zh" ? 0 : 1] })) })
          ] }),
          /* @__PURE__ */ n("label", { children: [
            g("幅度", "Amplitude"),
            /* @__PURE__ */ n("select", { value: x, disabled: Q || te || y === "uses a POV shot", onChange: (f) => u(f.currentTarget.value), children: qo.map((f) => /* @__PURE__ */ n("option", { value: f.value, children: f.label[t === "zh" ? 0 : 1] })) })
          ] }),
          /* @__PURE__ */ n("label", { children: [
            g("速度", "Speed"),
            /* @__PURE__ */ n("select", { value: $, disabled: Q || te || y === "uses a POV shot", onChange: (f) => j(f.currentTarget.value), children: Ho.map((f) => /* @__PURE__ */ n("option", { value: f.value, children: f.label[t === "zh" ? 0 : 1] })) })
          ] }),
          /* @__PURE__ */ n("label", { children: [
            g("触发动作", "Action trigger"),
            /* @__PURE__ */ n("input", { value: E, disabled: Q || te || y === "uses a POV shot", onInput: (f) => P(f.currentTarget.value), placeholder: g("可选", "Optional") })
          ] }),
          /* @__PURE__ */ n("label", { children: [
            g(te ? "起始焦点" : y === "uses a POV shot" ? "视点主体" : "运动目标", te ? "Focus from" : y === "uses a POV shot" ? "POV subject" : "Movement target"),
            /* @__PURE__ */ n("input", { value: C, disabled: Q || ce, onInput: (f) => N(f.currentTarget.value), placeholder: g("可选", "Optional") })
          ] }),
          /* @__PURE__ */ n("label", { children: [
            g("经过路径", "Path"),
            /* @__PURE__ */ n("input", { value: R, disabled: Q || te || ce || y === "uses a POV shot", onInput: (f) => F(f.currentTarget.value), placeholder: g("可选", "Optional") })
          ] }),
          /* @__PURE__ */ n("label", { children: [
            g(te ? "结束焦点" : "结束构图", te ? "Focus to" : "End framing"),
            /* @__PURE__ */ n("input", { value: I, onInput: (f) => ne(f.currentTarget.value), placeholder: g("可选", "Optional") })
          ] }),
          /* @__PURE__ */ n("button", { onClick: () => z((f) => {
            const B = Wo(y, E, C, I, x, $, R);
            f.prompt = [f.prompt.trimEnd(), B].filter(Boolean).join(`
`);
          }), children: g("追加到提示词", "Append to prompt") })
        ] })
      ] }),
      /* @__PURE__ */ n("label", { children: [
        /* @__PURE__ */ n("span", { class: "td-field-label", children: g("负向提示词", "Negative prompt") }),
        /* @__PURE__ */ n("textarea", { rows: 3, value: k.negativePrompt, onInput: (f) => z((B) => {
          B.negativePrompt = f.currentTarget.value;
        }) })
      ] }),
      e.assets.length > 0 && /* @__PURE__ */ n("fieldset", { class: "td-shot-media", children: [
        /* @__PURE__ */ n("legend", { children: g("本镜头可用素材（点名称复制引用，取消勾选=本镜头禁用）", "Shot media") }),
        e.assets.map((f) => {
          const B = !k.disabledAssetIds.includes(f.id), X = `{{ref:${f.alias}}}`, le = k.prompt.includes(X) || k.prompt.includes(`{{ref:${f.alias}.audio}}`);
          return /* @__PURE__ */ n("div", { class: `td-shot-media-card ${B ? "" : "disabled"} ${le ? "used" : ""}`, children: [
            /* @__PURE__ */ n("div", { class: "td-shot-media-frame", children: [
              /* @__PURE__ */ n(Ar, { asset: f, compact: !0 }),
              /* @__PURE__ */ n("label", { class: "td-shot-media-toggle", title: B ? g("在本镜头禁用", "Disable in this shot") : g("在本镜头启用", "Enable"), children: /* @__PURE__ */ n("input", { type: "checkbox", checked: B, onChange: (xe) => z((de) => {
                de.disabledAssetIds = xe.currentTarget.checked ? de.disabledAssetIds.filter((Oe) => Oe !== f.id) : [.../* @__PURE__ */ new Set([...de.disabledAssetIds, f.id])];
              }) }) })
            ] }),
            /* @__PURE__ */ n("button", { class: "td-shot-media-name", title: `${f.note ?? ""}
${g("点击复制", "Copy")} ${X}`, onMouseDown: (xe) => xe.preventDefault(), onClick: async () => {
              try {
                await zr(X), h(g(`已复制 ${X}`, `Copied ${X}`));
              } catch (xe) {
                h(String(xe), "error");
              }
            }, children: [
              le && /* @__PURE__ */ n("i", { children: "●" }),
              f.alias
            ] })
          ] }, f.id);
        })
      ] })
    ] }),
    k && /* @__PURE__ */ n("aside", { class: "td-preview", children: [
      /* @__PURE__ */ n("section", { class: "td-card", children: [
        /* @__PURE__ */ n("header", { children: [
          /* @__PURE__ */ n("strong", { children: g("H3 预检", "H3 check") }),
          /* @__PURE__ */ n("span", { class: "td-summary-counts", children: [
            g("图", "Img"),
            " ",
            (D == null ? void 0 : D.slots.filter((f) => f.kind === "picture").length) ?? 0,
            "/9 · ",
            g("视频", "Vid"),
            " ",
            (D == null ? void 0 : D.slots.filter((f) => f.kind === "video").length) ?? 0,
            "/3 · ",
            g("音频", "Aud"),
            " ",
            (D == null ? void 0 : D.audioCount) ?? 0,
            "/3"
          ] })
        ] }),
        /* @__PURE__ */ n("div", { class: "td-card-body", children: [
          D != null && D.errors.length ? /* @__PURE__ */ n("ul", { class: "errors", children: D.errors.map((f) => /* @__PURE__ */ n("li", { children: f })) }) : /* @__PURE__ */ n("p", { class: "ok", children: [
            "✓ ",
            g("本镜头通过预检", "This shot passes")
          ] }),
          D && D.slots.length > 0 && /* @__PURE__ */ n("ol", { class: "td-slot-list", children: D.slots.map((f) => /* @__PURE__ */ n("li", { children: [
            /* @__PURE__ */ n("code", { children: f.label }),
            /* @__PURE__ */ n("span", { children: f.alias })
          ] })) }),
          at(e, k) && e.continuity.durationMode === "final_output" && /* @__PURE__ */ n("p", { class: "td-hint", children: g(
            `分镜时间从本段成片第 0 秒计算。生成时自动加上 ${(e.continuity.videoContextFrames / e.defaults.fps).toFixed(3)} 秒接力前缀，动作和台词同步换算。`,
            `Shot times start at the delivered segment's zero. Generation adds ${(e.continuity.videoContextFrames / e.defaults.fps).toFixed(3)} seconds of overlap and shifts action and dialogue windows together.`
          ) }),
          /* @__PURE__ */ n("button", { class: "td-link-button", onClick: () => T((f) => !f), children: S ? g("收起编译结果", "Hide reference compilation") : g("查看素材编译结果（成片时间）", "Show reference compilation (delivered times)") }),
          S && /* @__PURE__ */ n("pre", { class: "td-compiled", children: D == null ? void 0 : D.compiledPrompt })
        ] })
      ] }),
      /* @__PURE__ */ n("section", { class: "td-card", children: [
        /* @__PURE__ */ n("header", { children: [
          /* @__PURE__ */ n("strong", { children: g("本段结果", "Takes") }),
          /* @__PURE__ */ n("span", { class: `td-chip ${L.length ? "ok" : ""}`, children: l.loading ? g("查询中", "Loading") : g(`${L.length} 个一采`, `${L.length} takes`) })
        ] }),
        /* @__PURE__ */ n("div", { class: "td-card-body", children: [
          _ && K ? /* @__PURE__ */ n("video", { class: "td-take-player", src: K, controls: !0, preload: "metadata", playsInline: !0 }, _.path) : /* @__PURE__ */ n("div", { class: "td-result-empty", children: g("还没有一采结果", "No first-pass take yet") }),
          L.length > 1 && /* @__PURE__ */ n("div", { class: "td-take-strip", children: L.map((f, B) => {
            const X = Pe(f.path, "output");
            return /* @__PURE__ */ n("button", { class: `td-take ${f.path === (_ == null ? void 0 : _.path) ? "selected" : ""}`, title: ze(f.path), onClick: () => s(k.id, { take: f.path }), children: [
              X ? /* @__PURE__ */ n(ct, { src: X, alt: f.path }) : null,
              /* @__PURE__ */ n("span", { children: [
                "#",
                L.length - B
              ] })
            ] }, f.path);
          }) }),
          /* @__PURE__ */ n("div", { class: "td-take-actions", children: [
            /* @__PURE__ */ n("button", { class: "primary", disabled: d || !k.enabled, onClick: () => m([k.id]), children: [
              "↻ ",
              L.length ? g("重生本段", "Re-roll") : g("生成本段", "Generate")
            ] }),
            ee.length > 1 && /* @__PURE__ */ n("button", { disabled: d || !k.enabled, title: g("后面这些镜头接力自本段，本段换结果后它们的接缝会失配", "Following shots relay from this one"), onClick: () => m(ee), children: [
              "↻ ",
              g(`连同后续 ${ee.length - 1} 段接力`, `+${ee.length - 1} relay shots`)
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}
function qe() {
  const e = new Error("已停止");
  return e.name = "AbortError", e;
}
function Yo(e) {
  return e.detail ?? {};
}
const Xo = ["execution_start", "executing", "progress", "execution_success", "execution_error", "execution_interrupted"];
function sn(e, t, r, i, o, s = 6e4, l) {
  return new Promise((a, d) => {
    let p = "", m = !1, b = !1, h = !1, c = !1, g;
    const S = [], T = Xo.map((E) => [E, (P) => $(E, Yo(P))]), y = () => {
      c || (c = !0, clearTimeout(g), T.forEach(([E, P]) => e.removeEventListener(E, P)), o == null || o.removeEventListener("abort", j));
    }, v = (E) => {
      b || (b = !0, h || y(), E ? d(E) : a());
    }, x = () => {
      var P, C;
      if (!p) return;
      const E = m ? (P = e.interrupt) == null ? void 0 : P.call(e, p) : (C = e.deleteItem) == null ? void 0 : C.call(e, "queue", p);
      Promise.resolve(E).catch(() => {
      });
    }, u = async () => {
      if (!(!l || b)) {
        try {
          if (await l.probe(p) === "success") {
            v();
            return;
          }
        } catch (E) {
          v(E instanceof Error ? E : new Error(String(E)));
          return;
        }
        b || (g = setTimeout(() => void u(), l.pollMs ?? 2500));
      }
    };
    function $(E, P) {
      const C = String(P.prompt_id ?? "");
      if (!p) {
        C && S.push([E, P]);
        return;
      }
      if (!(C !== p && (E !== "progress" || C || !m))) {
        if (E === "execution_start" || E === "executing" || E === "progress") {
          const N = m;
          if (m = !0, h) {
            N || x();
            return;
          }
        }
        if (E === "progress") {
          const N = Number(P.value ?? 0), R = Number(P.max ?? 0);
          Number.isFinite(N) && Number.isFinite(R) && R > 0 && (r == null || r({ value: N, max: R, node: String(P.node ?? "") }));
        } else E === "execution_success" ? h ? y() : v() : (E === "execution_error" || E === "execution_interrupted") && (h ? y() : v(new Error(String(P.exception_message ?? P.error ?? i))));
      }
    }
    function j() {
      h || (h = !0, x(), v(qe()), setTimeout(y, s));
    }
    if (T.forEach(([E, P]) => e.addEventListener(E, P)), o == null || o.addEventListener("abort", j), o != null && o.aborted) {
      j();
      return;
    }
    t().then((E) => {
      if (!E.prompt_id) {
        v(new Error("ComfyUI 没有返回任务 ID"));
        return;
      }
      p = E.prompt_id;
      for (const [P, C] of S.splice(0)) $(P, C);
      h && !m && x(), l && !b && (g = setTimeout(() => void u(), l.pollMs ?? 2500));
    }, (E) => v(E instanceof Error ? E : new Error(String(E))));
  });
}
function Zo(e) {
  const t = Object.values(e), r = t.find((s) => s.class_type === "ManualSigmas"), i = t.find((s) => s.class_type === "KSampler"), o = t.find((s) => s.class_type === "CFGGuider");
  return { steps: r ? String(r.inputs.sigmas).split(",").filter((s) => s.trim()).length - 1 : Number((i == null ? void 0 : i.inputs.steps) ?? 12), cfg: Number((o == null ? void 0 : o.inputs.cfg) ?? (i == null ? void 0 : i.inputs.cfg) ?? 1), fixedSteps: !!r };
}
const In = {
  KSampler: ["seed", "control_after_generate", "steps", "cfg", "sampler_name", "scheduler", "denoise"],
  EmptySD3LatentImage: ["width", "height", "batch_size"],
  CLIPTextEncode: ["text"],
  UNETLoader: ["unet_name", "weight_dtype"],
  CLIPLoader: ["clip_name", "type", "device"],
  VAELoader: ["vae_name"],
  SaveImage: ["filename_prefix"],
  ModelSamplingAuraFlow: ["shift"],
  VAEDecode: [],
  EmptyLatentImage: ["width", "height", "batch_size"],
  TextEncodeQwenImage21: ["prompt", "negative_prompt", "resolution"],
  QwenImage21Cache: ["device", "dtype"],
  ManualSigmas: ["sigmas"],
  RandomNoise: ["noise_seed", "control_after_generate"],
  CFGGuider: ["cfg"],
  KSamplerSelect: ["sampler_name"],
  SamplerCustomAdvanced: [],
  ComfySwitchNode: ["switch"],
  PrimitiveStringMultiline: ["value"],
  TextGenerate: ["prompt", "max_length", "sampling_mode", "sampling_mode.temperature", "sampling_mode.top_k", "sampling_mode.top_p", "sampling_mode.min_p", "sampling_mode.repetition_penalty", "sampling_mode.seed", "sampling_mode.presence_penalty", "thinking", "use_default_template", "mtp"]
}, ea = {
  KSampler: ["model", "positive", "negative", "latent_image", "seed", "steps", "cfg", "sampler_name", "scheduler", "denoise"],
  EmptySD3LatentImage: ["width", "height", "batch_size"],
  CLIPTextEncode: ["text", "clip"],
  UNETLoader: ["unet_name", "weight_dtype"],
  CLIPLoader: ["clip_name", "type"],
  VAELoader: ["vae_name"],
  SaveImage: ["images", "filename_prefix"],
  ModelSamplingAuraFlow: ["model", "shift"],
  VAEDecode: ["samples", "vae"],
  EmptyLatentImage: ["width", "height", "batch_size"],
  TextEncodeQwenImage21: ["clip", "prompt", "negative_prompt", "resolution"],
  QwenImage21Cache: ["model", "device", "dtype"],
  ManualSigmas: ["sigmas"],
  RandomNoise: ["noise_seed"],
  CFGGuider: ["model", "positive", "negative", "cfg"],
  KSamplerSelect: ["sampler_name"],
  SamplerCustomAdvanced: ["noise", "guider", "sampler", "sigmas", "latent_image"],
  ComfySwitchNode: ["switch"],
  PrimitiveStringMultiline: ["value"],
  TextGenerate: ["clip", "prompt", "max_length", "sampling_mode"]
}, ir = "画面干净，无文字、字幕、标语、水印、Logo 或画面叠字。", or = "text, subtitles, captions, watermark, logo, letters, typography, signature";
function Ut(e) {
  const t = /(?:^|\n)\s*(?:Negative\s+prompt|负向提示词|负面提示词)\s*[:：]\s*/i.exec(e);
  return t ? { positive: e.slice(0, t.index).trim(), negative: e.slice(t.index + t[0].length).trim() } : { positive: e.trim(), negative: "" };
}
function gn(e, t) {
  return t.trim() ? `${e.trim()}
Negative prompt: ${t.trim()}` : e.trim();
}
function oi(e) {
  return JSON.parse(JSON.stringify(e));
}
function Ie(e) {
  const t = {};
  return (In[e.type] ?? []).forEach((r, i) => {
    var s, l;
    const o = ((s = e.widgets_values_named) == null ? void 0 : s[r]) ?? ((l = e.widgets_values) == null ? void 0 : l[i]);
    o !== void 0 && (t[r] = o);
  }), t;
}
function De(e, t) {
  const r = e.nodes.filter((i) => i.type === t);
  if (r.length !== 1) throw new Error(`生图工作流需要一个 ${t} 节点，当前为 ${r.length} 个`);
  return r[0];
}
function pt(e, t) {
  var a;
  const r = e.nodes.find((d) => d.type === "TextEncodeQwenImage21");
  if (r) return r;
  const o = (a = De(e, "KSampler").inputs) == null ? void 0 : a.find((d) => d.name === t), s = e.links.find((d) => Array.isArray(d) && d[0] === (o == null ? void 0 : o.link)), l = s && e.nodes.find((d) => String(d.id) === String(s[1]));
  if (!l || l.type !== "CLIPTextEncode") throw new Error(`生图工作流的 ${t} 未直连 CLIPTextEncode`);
  return l;
}
function fn(e) {
  var o, s;
  const t = (s = (o = pt(e, "positive").inputs) == null ? void 0 : o.find((l) => l.name === "clip")) == null ? void 0 : s.link, r = e.links.find((l) => Array.isArray(l) && l[0] === t), i = e.nodes.find((l) => String(l.id) === String(r == null ? void 0 : r[1]));
  if (!i || i.type !== "CLIPLoader") throw new Error("生图文本编码器未连接 CLIPLoader");
  return i;
}
const ar = 4;
function ta(e) {
  if (!Array.isArray(e == null ? void 0 : e.nodes) || !Array.isArray(e.links)) throw new Error("生图工作流需要 nodes 与 links");
  const t = new Map(e.nodes.map((a) => [String(a.id), a]));
  if (t.size !== e.nodes.length) throw new Error("生图工作流节点 ID 重复");
  const r = /* @__PURE__ */ new Map();
  for (const a of e.links) {
    if (!Array.isArray(a) || a.length < 6 || !t.has(String(a[1])) || !t.has(String(a[3])) || !Number.isInteger(a[2]) || a[2] < 0) throw new Error("生图工作流存在无效连线");
    if (r.has(String(a[0]))) throw new Error("生图工作流连线 ID 重复");
    r.set(String(a[0]), a);
  }
  const i = {}, o = /* @__PURE__ */ new Set(), s = (a, d) => {
    var m, b, h, c;
    const p = String(a.id);
    if (a.type === "ComfySwitchNode" && !((b = (m = a.inputs) == null ? void 0 : m.find((g) => g.name === "switch")) != null && b.link) && typeof Ie(a).switch == "boolean") {
      if (o.has(p)) throw new Error("生图工作流连线形成循环");
      const g = (h = a.inputs) == null ? void 0 : h.find((y) => y.name === (Ie(a).switch ? "on_true" : "on_false")), S = r.get(String(g == null ? void 0 : g.link)), T = S && t.get(String(S[1]));
      if (!T) throw new Error("提示词增强开关缺少所选输入");
      o.add(p);
      try {
        return s(T, Number(S[2]));
      } finally {
        o.delete(p);
      }
    }
    if (a.mode === ar) {
      if (d !== 0) throw new Error(`旁路节点 ${p} 不支持输出端口 ${d}`);
      const g = (a.inputs ?? []).filter((v) => v.link != null);
      if (g.length !== 1) throw new Error(`旁路节点 ${p} 需要恰好一个输入连线`);
      const S = r.get(String(g[0].link)), T = S && t.get(String(S[1])), y = (a.inputs ?? []).indexOf(g[0]);
      if (!S || !T || String(S[3]) !== p || S[4] !== y || !((c = T.outputs) != null && c[Number(S[2])]))
        throw new Error(`旁路节点 ${p} 的输入连线无效`);
      if (o.has(p)) throw new Error("生图工作流连线形成循环");
      o.add(p);
      try {
        return s(T, Number(S[2]));
      } finally {
        o.delete(p);
      }
    }
    return l(a), [p, d];
  }, l = (a) => {
    var m;
    const d = String(a.id);
    if (o.has(d)) throw new Error("生图工作流连线形成循环");
    if (i[d]) return;
    if (!(a.type in In)) throw new Error(`生图工作流包含未支持的节点：${a.type}`);
    if (a.mode === ar) return;
    if (a.mode && a.mode !== 0) throw new Error(`生图节点 ${d} 已静音或旁路`);
    o.add(d);
    const p = Ie(a);
    delete p.control_after_generate;
    for (const [b, h] of (a.inputs ?? []).entries()) {
      if (h.link == null) continue;
      const c = r.get(String(h.link)), g = c && t.get(String(c[1]));
      if (!c || !g || String(c[3]) !== d || c[4] !== b || !((m = g.outputs) != null && m[Number(c[2])])) throw new Error(`生图节点 ${d}.${h.name} 的连线无效`);
      p[h.name] = s(g, Number(c[2]));
    }
    for (const b of ea[a.type]) if (p[b] == null) throw new Error(`生图节点 ${d} 缺少输入 ${b}`);
    i[d] = { class_type: a.type, inputs: p, _meta: { title: a.title ?? a.type } }, o.delete(d);
  };
  return l(De(e, "SaveImage")), pt(e, "positive"), pt(e, "negative"), i;
}
function xt(e, t, r, i, o = 1) {
  if (!Number.isSafeInteger(e) || e < r || e > i || e % o) throw new Error(`${t} 必须为 ${r}–${i} 的整数${o > 1 ? `，且为 ${o} 的倍数` : ""}`);
}
function na(e) {
  if (!e.positivePrompt.trim()) throw new Error("请填写生图提示词");
  if (xt(e.width, "宽度", 256, 2048, 8), xt(e.height, "高度", 256, 2048, 8), xt(e.steps, "步数", 1, 100), xt(e.batchSize, "生成数量", 1, 4), xt(e.seed, "种子", 0, Number.MAX_SAFE_INTEGER), !Number.isFinite(e.cfg) || e.cfg < 0 || e.cfg > 30) throw new Error("CFG 范围为 0–30");
  if (!e.filenamePrefix.startsWith("TheodoreDirector/ImageGen/") || /[\\:*?"<>|\u0000-\u001f]/.test(e.filenamePrefix) || e.filenamePrefix.split("/").some((t) => !t || t === "." || t === "..")) throw new Error("生图保存路径无效");
}
function Qt(e) {
  return na(e), {
    ...e,
    positivePrompt: e.positivePrompt.includes(ir) ? e.positivePrompt.trim() : `${e.positivePrompt.trim()}
${ir}`,
    negativePrompt: e.negativePrompt.includes(or) ? e.negativePrompt.trim() : [e.negativePrompt.trim(), or].filter(Boolean).join(", ")
  };
}
function ra(e) {
  const t = e.nodes.some((s) => s.type === "TextEncodeQwenImage21"), r = t ? { seed: Ie(De(e, "RandomNoise")).noise_seed, cfg: Ie(De(e, "CFGGuider")).cfg, steps: String(Ie(De(e, "ManualSigmas")).sigmas).split(",").length - 1 } : Ie(De(e, "KSampler")), i = Ie(De(e, t ? "EmptyLatentImage" : "EmptySD3LatentImage")), o = e.nodes.flatMap((s) => [Ie(s).unet_name, Ie(s).clip_name, Ie(s).vae_name].filter((l) => typeof l == "string"));
  return {
    negativePrompt: String(Ie(pt(e, "negative"))[t ? "negative_prompt" : "text"] ?? ""),
    width: Number(i.width),
    height: Number(i.height),
    batchSize: Number(i.batch_size),
    steps: Number(r.steps),
    cfg: Number(r.cfg),
    seed: Number(r.seed),
    models: o,
    fixedSteps: t,
    unetName: String(Ie(De(e, "UNETLoader")).unet_name),
    clipName: String(Ie(fn(e)).clip_name),
    clipType: String(Ie(fn(e)).type),
    vaeName: String(Ie(De(e, "VAELoader")).vae_name)
  };
}
async function ia(e = fetch, t) {
  var a, d, p;
  const r = [["unetName", "UNETLoader", "unet_name"], ["clipName", "CLIPLoader", "clip_name"], ["vaeName", "VAELoader", "vae_name"], ["clipType", "CLIPLoader", "type"]], i = [...new Set(r.map(([, m]) => m))], o = await Promise.all(i.map(async (m) => {
    const b = await e(`/object_info/${m}`, { signal: t });
    if (!b.ok) throw new Error(`读取生图模型列表失败：${m} HTTP ${b.status}`);
    return await b.json();
  })), s = Object.assign({}, ...o), l = {};
  for (const [m, b, h] of r) {
    const c = (p = (d = (a = s[b]) == null ? void 0 : a.input) == null ? void 0 : d.required) == null ? void 0 : p[h], g = Array.isArray(c) && Array.isArray(c[0]) ? c[0] : [];
    if (l[m] = [...new Set(g.filter((S) => typeof S == "string" && !!S.trim()))], !l[m].length) throw new Error(`当前 ComfyUI 的 ${b}.${h} 没有可用选项`);
  }
  return l;
}
function oa(e, t, r) {
  const i = Qt(r), o = oi(e), s = (a) => {
    var p;
    const d = String(De(t, a).id);
    if (((p = o[d]) == null ? void 0 : p.class_type) !== a) throw new Error(`生图 API 缺少节点 ${d} (${a})`);
    return o[d];
  }, l = t.nodes.some((a) => a.type === "TextEncodeQwenImage21");
  if (l) {
    s("TextEncodeQwenImage21").inputs.negative_prompt = i.negativePrompt;
    const a = t.nodes.find((d) => d.type === "TextGenerate");
    a && o[String(a.id)] ? (o[String(a.id)].inputs.prompt = i.positivePrompt, o[String(a.id)].inputs["sampling_mode.seed"] = i.seed) : s("TextEncodeQwenImage21").inputs.prompt = i.positivePrompt, s("RandomNoise").inputs.noise_seed = i.seed, s("CFGGuider").inputs.cfg = i.cfg;
  } else
    o[String(pt(t, "positive").id)].inputs.text = i.positivePrompt, o[String(pt(t, "negative").id)].inputs.text = i.negativePrompt, Object.assign(s("KSampler").inputs, { seed: i.seed, steps: i.steps, cfg: i.cfg });
  Object.assign(s(l ? "EmptyLatentImage" : "EmptySD3LatentImage").inputs, { width: i.width, height: i.height, batch_size: i.batchSize });
  for (const [a, d, p] of [["unetName", "UNETLoader", "unet_name"], ["clipName", "CLIPLoader", "clip_name"], ["clipType", "CLIPLoader", "type"], ["vaeName", "VAELoader", "vae_name"]])
    i[a] && ((d === "CLIPLoader" ? o[String(fn(t).id)] : s(d)).inputs[p] = i[a]);
  return s("SaveImage").inputs.filename_prefix = i.filenamePrefix, o;
}
function aa(e, t) {
  var i;
  const r = oi(e);
  for (const o of r.nodes) {
    const s = (i = t[String(o.id)]) == null ? void 0 : i.inputs;
    if (s)
      for (const [l, a] of (In[o.type] ?? []).entries()) {
        const d = a === "control_after_generate" ? "fixed" : s[a];
        d === void 0 || Array.isArray(d) || (o.widgets_values && (o.widgets_values[l] = d), o.widgets_values_named && (o.widgets_values_named[a] = d));
      }
  }
  return r;
}
function sr(e) {
  return e.trim().replace(/[^\p{L}\p{N}._-]+/gu, "_").replace(/^[_.]+|[_.]+$/g, "").slice(0, 72) || "asset";
}
function ai(e, t) {
  return `TheodoreDirector/ImageGen/${sr(e)}/${sr(t)}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
function si() {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
}
function sa(e) {
  return `/view?${new URLSearchParams({ filename: e.filename, subfolder: e.subfolder, type: e.type })}`;
}
function da(e, t, r) {
  const i = di(e, t), o = i == null ? void 0 : i.outputs;
  if (!o || typeof o != "object") return [];
  const s = r ? [o[r]] : Object.values(o), l = /* @__PURE__ */ new Map();
  for (const a of s) {
    const d = a == null ? void 0 : a.images;
    if (Array.isArray(d))
      for (const p of d) {
        const m = p;
        if (!m || typeof m.filename != "string" || !/\.(png|jpe?g|webp|bmp)$/i.test(m.filename) || m.type && m.type !== "output") continue;
        const b = { filename: m.filename, subfolder: typeof m.subfolder == "string" ? m.subfolder : "", type: "output" };
        l.set(`${b.subfolder}/${b.filename}`, { ...b, url: sa(b) });
      }
  }
  return [...l.values()];
}
function di(e, t) {
  if (!e || typeof e != "object") return;
  const r = e[t];
  return r && typeof r == "object" ? r : void 0;
}
function li(e, t) {
  var i;
  const r = (i = di(e, t)) == null ? void 0 : i.status;
  if ((r == null ? void 0 : r.status_str) === "error") {
    for (const o of r.messages ?? [])
      if (Array.isArray(o) && o[1] && typeof o[1] == "object") {
        const s = o[1];
        if (s.exception_message) throw new Error(String(s.exception_message));
        if (o[0] === "execution_interrupted") throw new Error("生图任务已中断");
      }
    throw new Error("生图任务执行失败，请查看 ComfyUI 执行记录");
  }
  return r != null && r.completed ? "success" : "pending";
}
async function dr(e, t, r = fetch, i) {
  for (let o = 0; o < 40; o++) {
    if (t != null && t.aborted) throw qe();
    const s = await r(`/history/${encodeURIComponent(e)}`, { signal: t });
    if (!s.ok) throw new Error(`读取生图结果失败：HTTP ${s.status}`);
    const l = await s.json();
    li(l, e);
    const a = da(l, e, i);
    if (a.length) return a;
    o < 39 && await new Promise((d, p) => {
      const m = () => {
        clearTimeout(b), p(qe());
      }, b = setTimeout(() => {
        t == null || t.removeEventListener("abort", m), d();
      }, 500);
      t == null || t.addEventListener("abort", m, { once: !0 });
    });
  }
  throw new Error("任务已结束，但没有 SaveImage 图片输出；可用任务 ID 在 ComfyUI 历史记录中核查");
}
function la(e, t, r, i, o) {
  const s = new Set(i.map((a) => a.alias.toLowerCase()));
  let l = 1;
  for (; s.has(`${e.alias}_${l}`.toLowerCase()); ) l++;
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
    fixedOrder: Math.max(0, ...i.map((a) => a.fixedOrder)) + 1,
    shotIds: [],
    imageGeneration: o,
    imageGenerationPending: void 0,
    includeVideoAudio: !1,
    durationSeconds: null,
    audioDurationSeconds: null
  };
}
const ci = "theodore-director-image-settings-v2-qwen21", ca = {
  width: 1080,
  height: 720,
  steps: 12,
  cfg: 1,
  batchSize: 1,
  seed: 0,
  randomSeed: !1
};
let Bt = {};
function pi() {
  try {
    return globalThis.localStorage;
  } catch {
    return;
  }
}
function Vt(e) {
  if (!e || typeof e != "object") return {};
  const t = e, r = {};
  for (const i of ["width", "height", "steps", "cfg", "batchSize", "seed"]) {
    const o = t[i];
    if (typeof o != "number" || !Number.isFinite(o)) continue;
    (i === "width" || i === "height" ? Number.isSafeInteger(o) && o >= 256 && o <= 2048 && o % 8 === 0 : i === "steps" ? Number.isSafeInteger(o) && o >= 1 && o <= 100 : i === "batchSize" ? Number.isSafeInteger(o) && o >= 1 && o <= 4 : i === "seed" ? Number.isSafeInteger(o) && o >= 0 : o >= 0 && o <= 30) && (r[i] = o);
  }
  typeof t.randomSeed == "boolean" && (r.randomSeed = t.randomSeed);
  for (const i of ["unetName", "clipName", "vaeName", "clipType"])
    typeof t[i] == "string" && t[i].trim() && !/[\u0000-\u001f]/.test(t[i]) && (r[i] = t[i]);
  return r;
}
function hi(e = pi()) {
  try {
    const t = e == null ? void 0 : e.getItem(ci);
    return { ...Vt(t ? JSON.parse(t) : null), ...Bt };
  } catch {
    return { ...Bt };
  }
}
function lr(e, t = hi()) {
  return { ...ca, ...Vt(e), ...Vt(t) };
}
function pa(e, t = pi()) {
  Bt = { ...hi(t), ...Vt(e) };
  try {
    t == null || t.setItem(ci, JSON.stringify(Bt));
  } catch {
  }
}
function qt(e) {
  return e.filter((t) => t.enabled && t.kind === "image" && !!Ut(t.genPrompt ?? "").positive);
}
async function ha(e) {
  var s, l;
  const { signal: t } = e, r = () => {
    if (t.aborted) throw qe();
  }, o = qt(e.assets).map((a) => {
    const d = Ut(a.genPrompt ?? ""), { randomSeed: p, ...m } = e.preferences;
    return { asset: a, settings: Qt({
      ...m,
      positivePrompt: d.positive,
      negativePrompt: d.negative || e.negativePrompt,
      seed: p ? si() : m.seed,
      filenamePrefix: ai(e.projectName, a.alias)
    }) };
  });
  for (const [a, { asset: d, settings: p }] of o.entries()) {
    r(), (s = e.onItem) == null || s.call(e, d, a, o.length);
    try {
      const m = Date.now(), b = d.imageGenerationPending ? await e.recover(d.imageGenerationPending) : await e.queue({
        ...p,
        signal: t,
        onProgress: e.onProgress,
        onQueued: (T) => e.onPending(d.id, { promptId: T, createdAt: m, settings: p })
      });
      await e.onRecord(d.id, b), e.onPending(d.id, null), r();
      const h = b.images[0];
      if (!h) throw new Error("任务完成，但没有可用图片结果");
      const c = `${h.subfolder}/${h.filename}`, g = ((l = b.registeredPaths) == null ? void 0 : l[c]) ?? await e.register(e.projectName, h), S = { ...b, registeredPaths: { ...b.registeredPaths, [c]: g } };
      await e.onApply(d.id, g, gn(b.settings.positivePrompt, b.settings.negativePrompt), S), e.onResult({ assetId: d.id, alias: d.alias, status: "success" });
    } catch (m) {
      if (t.aborted || m instanceof Error && m.name === "AbortError") throw qe();
      e.onResult({ assetId: d.id, alias: d.alias, status: "error", error: m instanceof Error ? m.message : String(m) });
    }
  }
}
const cr = { negativePrompt: "blurry ugly bad", width: 1080, height: 720, batchSize: 1, steps: 12, cfg: 1, seed: 0, models: [] };
function ua({ asset: e, batchAssets: t, projectName: r, language: i, defaults: o, queue: s, recover: l, running: a, progress: d, register: p, onPending: m, onRecord: b, onPromptChange: h, onStart: c, onProgress: g, onFinish: S, onApply: T, onCreateAsset: y, onStop: v, onClose: x }) {
  var dt, Pt;
  const u = (A, ie) => i === "zh" ? A : ie, [$, j] = G(cr), [E, P] = G(!0), [C, N] = G(""), R = Ut(e.genPrompt ?? ""), F = (dt = e.imageGeneration) == null ? void 0 : dt.settings, [I, ne] = G(R.positive || (F == null ? void 0 : F.positivePrompt) || ""), [k, D] = G(R.negative || ""), [M, V] = G(() => lr()), { width: Z, height: Y, steps: L, cfg: _, batchSize: K, seed: ee, randomSeed: Q } = M, te = [["unetName", "扩散模型 / UNet"], ["clipName", "文本编码器 / CLIP"], ["vaeName", "VAE"], ["clipType", "CLIP 类型"]], ce = te.filter(([A]) => $.modelOptions && (!M[A] || !$.modelOptions[A].includes(M[A]))), z = ce.length ? u(`当前选择不可用：${ce.map(([, A]) => A).join("、")}。请选择服务器已安装的模型。`, "Some selected model files or types are unavailable. Choose installed models.") : "", q = (A, ie) => {
    pa({ [A]: ie }), V((se) => ({ ...se, [A]: ie }));
  }, pe = qt(t ?? []), [re, f] = G(() => qt(t ?? []).filter((A) => !A.path.trim()).map((A) => A.id)), [B, X] = G([]), [le, xe] = G(""), de = !!t, [Oe, ve] = G(((Pt = e.imageGeneration) == null ? void 0 : Pt.images) ?? []), [ue, st] = G(e.imageGeneration ?? null), [ht, _e] = G(""), [Re, ut] = G(""), [St, Ze] = G(0);
  Ee(() => {
    let A = !0;
    return o().then((ie) => {
      A && (j(ie), D((se) => se.trim() ? se : ie.negativePrompt), V({ ...lr(ie), ...ie.fixedSteps ? { steps: ie.steps } : {} }), P(!1));
    }).catch((ie) => {
      A && (N(ie instanceof Error ? ie.message : String(ie)), D((se) => se.trim() ? se : cr.negativePrompt), P(!1));
    }), () => {
      A = !1;
    };
  }, [o, St]);
  const Xt = () => gn(I, k), Zt = async () => {
    _e("");
    let A;
    try {
      const { randomSeed: ge, ...$e } = M;
      A = Qt({ ...$e, positivePrompt: I, negativePrompt: k, width: Z, height: Y, steps: L, cfg: _, batchSize: K, seed: Q ? si() : ee, filenamePrefix: ai(r, e.alias) });
    } catch (ge) {
      _e(ge instanceof Error ? ge.message : String(ge));
      return;
    }
    h(e.id, Xt());
    const ie = new AbortController();
    c(ie);
    const se = Date.now();
    try {
      const ge = await s({ ...A, signal: ie.signal, onProgress: g, onQueued: ($e) => m(e.id, { promptId: $e, createdAt: se, settings: A }) });
      st(ge), ve(ge.images), await b(e.id, ge), m(e.id, null), ge.images.length || _e(u("任务完成，但没有可用图片结果。", "The job finished without image results."));
    } catch (ge) {
      ge instanceof Error && ge.name === "AbortError" || _e(ge instanceof Error ? ge.message : String(ge));
    } finally {
      S(ie);
    }
  }, $t = async (A = !1) => {
    if (a) return;
    const ie = new Set(B.filter((he) => he.status === "error").map((he) => he.assetId)), se = pe.filter((he) => re.includes(he.id) && (!A || ie.has(he.id)));
    if (!se.length) {
      _e(u("请先勾选要生成的图片素材。", "Select image assets first."));
      return;
    }
    const ge = se.filter((he) => he.path.trim());
    if (ge.length && !window.confirm(u(`将替换 ${ge.length} 项已有素材，生成并绑定成功后清理未被其他素材使用的旧资源。继续？`, `Replace ${ge.length} existing assets and remove their unused old resources after assigning the new images?`))) return;
    const $e = new AbortController();
    _e(""), X(A ? (he) => he.filter((fe) => !se.some((Te) => Te.id === fe.assetId)) : []), c($e);
    try {
      await ha({
        assets: se,
        projectName: r,
        preferences: { ...M },
        negativePrompt: k,
        signal: $e.signal,
        queue: s,
        recover: l,
        register: p,
        onPending: m,
        onRecord: b,
        onApply: T,
        onProgress: g,
        onItem: (he, fe, Te) => {
          xe(`${fe + 1}/${Te} · ${he.alias}`), g({ value: 0, max: 0 });
        },
        onResult: (he) => X((fe) => [...fe, he])
      });
    } catch (he) {
      _e(he instanceof Error && he.name === "AbortError" ? u("批量生成已停止，完成项已保存，未完成任务可在对应素材中恢复结果。", "Batch stopped. Completed assets are saved; recover pending jobs from their asset panels.") : he instanceof Error ? he.message : String(he));
    } finally {
      S($e), xe("");
    }
  }, mt = async () => {
    const A = e.imageGenerationPending;
    if (!A || a) return;
    const ie = new AbortController();
    c(ie), _e("");
    try {
      const se = await l(A);
      st(se), ve(se.images), await b(e.id, se), m(e.id, null);
    } catch (se) {
      _e(se instanceof Error ? se.message : String(se));
    } finally {
      S(ie);
    }
  }, It = async (A, ie, se) => {
    var ge;
    if (!Re && !(ie === "replace" && e.path && !window.confirm(u(`当前素材“${e.alias}”已有文件。新图绑定成功后将清理未被其他素材使用的旧资源。继续？`, `Replace “${e.alias}” and remove its unused old resources after assigning the new image?`)))) {
      ut(A.filename), _e("");
      try {
        if (!ue) throw new Error("生成记录不存在，请重新生成");
        const $e = `${A.subfolder}/${A.filename}`;
        let he = ue, fe = (ge = ue.registeredPaths) == null ? void 0 : ge[$e];
        fe || (fe = await p(r, A), he = { ...ue, registeredPaths: { ...ue.registeredPaths, [$e]: fe } }, st(he), await b(e.id, he));
        const Te = gn(ue.settings.positivePrompt, ue.settings.negativePrompt);
        ie === "replace" ? await T(e.id, fe, Te, he) : y(e, fe, Te, se, he);
      } catch ($e) {
        _e($e instanceof Error ? $e.message : String($e));
      } finally {
        ut("");
      }
    }
  }, gt = d.max > 0 ? Math.max(0, Math.min(100, Math.round(d.value / d.max * 100))) : 0;
  return /* @__PURE__ */ n("div", { class: "td-batch-overlay td-imagegen-overlay", role: "presentation", children: /* @__PURE__ */ n("section", { class: "td-imagegen-panel", role: "dialog", "aria-modal": "true", "aria-label": u("自动生图", "Generate image"), children: [
    /* @__PURE__ */ n("header", { class: "td-batch-header", children: [
      /* @__PURE__ */ n("div", { children: [
        /* @__PURE__ */ n("h2", { children: de ? u("批量生图", "Batch image generation") : u("导播台内自动生图", "Generate inside Director") }),
        /* @__PURE__ */ n("p", { children: de ? u("逐项使用各自提示词生成并自动绑定首张结果；完成项立即保存。", "Generate each asset with its own prompt and assign its first image; save each completed item immediately.") : u(`目标素材：${e.alias}`, `Target: ${e.alias}`) }),
        /* @__PURE__ */ n("small", { children: u("参数修改自动记住，下一个素材、重开窗口和刷新后沿用。", "Settings are remembered across assets, panels and page reloads.") })
      ] }),
      /* @__PURE__ */ n("button", { "aria-label": u("关闭", "Close"), disabled: a || !!Re, onClick: x, children: "×" })
    ] }),
    de && /* @__PURE__ */ n("section", { class: "td-imagegen-batch-selection", children: [
      /* @__PURE__ */ n("header", { children: [
        /* @__PURE__ */ n("strong", { children: u(`已选 ${re.length} / ${pe.length} 项`, `${re.length} / ${pe.length} selected`) }),
        /* @__PURE__ */ n("button", { disabled: a, onClick: () => f(pe.filter((A) => !A.path.trim()).map((A) => A.id)), children: u("只选缺图", "Missing only") }),
        /* @__PURE__ */ n("button", { disabled: a, onClick: () => f(pe.map((A) => A.id)), children: u("全选", "Select all") }),
        /* @__PURE__ */ n("button", { disabled: a, onClick: () => f([]), children: u("全不选", "Clear selection") })
      ] }),
      /* @__PURE__ */ n("div", { class: "td-imagegen-batch-list", children: pe.map((A) => /* @__PURE__ */ n("label", { children: [
        /* @__PURE__ */ n("input", { type: "checkbox", checked: re.includes(A.id), disabled: a, onChange: (ie) => f((se) => ie.currentTarget.checked ? [...se, A.id] : se.filter((ge) => ge !== A.id)) }),
        /* @__PURE__ */ n("strong", { children: A.alias }),
        /* @__PURE__ */ n("span", { children: A.path.trim() ? u("已有图（将替换）", "Existing image (replace)") : u("缺图", "Missing") }),
        /* @__PURE__ */ n("small", { title: A.genPrompt, children: Ut(A.genPrompt ?? "").positive.slice(0, 120) })
      ] }, A.id)) }),
      /* @__PURE__ */ n("small", { children: u("仅列出已启用且填写了生图提示词的图片素材。每项结果可回到“自动生图”查看或换选。", "Only enabled image assets with prompts are listed. View or choose other results from each asset's Generate image panel.") })
    ] }),
    $.canvasWorkflow ? /* @__PURE__ */ n("div", { class: "td-imagegen-models", children: [
      /* @__PURE__ */ n("header", { children: [
        /* @__PURE__ */ n("strong", { children: u("使用画布上的生图链", "Use the canvas image workflow") }),
        /* @__PURE__ */ n("button", { disabled: a || E, onClick: () => {
          P(!0), N(""), Ze((A) => A + 1);
        }, children: u("重新读取工作流", "Reload workflow") })
      ] }),
      /* @__PURE__ */ n("small", { children: u("关闭导播台，在画布的「07 · 自由生图链」中修改模型、LoRA、采样器及后处理。这里负责提示词、尺寸、种子与批量生成；每次提交都会读取当前连线。", "Edit models, LoRAs, sampling and postprocessing in canvas group 07. This panel controls prompts, dimensions, seeds and batches; each job reads the current graph.") })
    ] }) : /* @__PURE__ */ n("div", { class: "td-imagegen-models", children: [
      /* @__PURE__ */ n("header", { children: [
        /* @__PURE__ */ n("strong", { children: u("生图模型", "Image models") }),
        /* @__PURE__ */ n("button", { disabled: a || E, onClick: () => {
          P(!0), N(""), Ze((A) => A + 1);
        }, children: u("刷新模型列表", "Refresh models") })
      ] }),
      $.modelOptions ? /* @__PURE__ */ n("div", { class: "td-imagegen-model-selects", children: te.map(([A, ie]) => /* @__PURE__ */ n("label", { children: [
        ie,
        /* @__PURE__ */ n("select", { "aria-label": ie, value: M[A] ?? "", disabled: a || E, onChange: (se) => q(A, se.currentTarget.value), children: [
          !$.modelOptions[A].includes(M[A] ?? "") && /* @__PURE__ */ n("option", { value: M[A] ?? "", children: M[A] ? `${M[A]} ${u("（不可用）", "(unavailable)")}` : u("请选择", "Select") }),
          $.modelOptions[A].map((se) => /* @__PURE__ */ n("option", { value: se, children: se }, se))
        ] })
      ] }, A)) }) : $.models.map((A) => /* @__PURE__ */ n("code", { children: A }, A)),
      /* @__PURE__ */ n("small", { children: u("选择会自动记住，并用于单张和批量生图。UNet、CLIP、VAE 及类型需与当前工作流架构匹配。当前为文生图，不接收参考图片。", "Selections are remembered for single and batch jobs. Match UNet, CLIP, VAE and encoder type to the workflow architecture. This workflow is text-to-image.") })
    ] }),
    z && /* @__PURE__ */ n("div", { class: "td-imagegen-error", children: z }),
    C && /* @__PURE__ */ n("div", { class: "td-imagegen-error", children: [
      u("读取内置生图工作流失败", "Could not load bundled image workflow"),
      ": ",
      C,
      /* @__PURE__ */ n("button", { onClick: () => {
        P(!0), N(""), Ze((A) => A + 1);
      }, children: u("重试", "Retry") })
    ] }),
    /* @__PURE__ */ n("div", { class: "td-imagegen-form", children: [
      !de && /* @__PURE__ */ n("label", { class: "wide", children: [
        u("正向提示词", "Positive prompt"),
        /* @__PURE__ */ n("textarea", { rows: 5, value: I, disabled: a, onInput: (A) => ne(A.currentTarget.value), placeholder: u("描述主体、外观、场景、构图与光线", "Describe subject, appearance, scene, framing and light") })
      ] }),
      /* @__PURE__ */ n("label", { class: "wide", children: [
        u("负向提示词", "Negative prompt"),
        /* @__PURE__ */ n("textarea", { rows: 3, value: k, disabled: a, onInput: (A) => D(A.currentTarget.value) }),
        /* @__PURE__ */ n("small", { children: u("画面无文字、字幕、水印或标识为固定约束。", "No text, captions, watermarks or logos are enforced.") })
      ] }),
      /* @__PURE__ */ n("label", { children: [
        u("宽度", "Width"),
        /* @__PURE__ */ n("input", { type: "number", min: "256", max: "2048", step: "8", value: Z, disabled: a, onInput: (A) => q("width", A.currentTarget.valueAsNumber) })
      ] }),
      /* @__PURE__ */ n("label", { children: [
        u("高度", "Height"),
        /* @__PURE__ */ n("input", { type: "number", min: "256", max: "2048", step: "8", value: Y, disabled: a, onInput: (A) => q("height", A.currentTarget.valueAsNumber) })
      ] }),
      !$.canvasWorkflow && /* @__PURE__ */ n("label", { children: [
        u("采样步数", "Steps"),
        /* @__PURE__ */ n("input", { type: "number", min: "1", max: "100", step: "1", value: L, disabled: a || $.fixedSteps, onInput: (A) => q("steps", A.currentTarget.valueAsNumber) })
      ] }),
      !$.canvasWorkflow && /* @__PURE__ */ n("label", { children: [
        "CFG",
        /* @__PURE__ */ n("input", { type: "number", min: "0", max: "30", step: "0.1", value: _, disabled: a, onInput: (A) => q("cfg", A.currentTarget.valueAsNumber) })
      ] }),
      /* @__PURE__ */ n("label", { children: [
        u("每项出图数（1–4）", "Images per asset (1–4)"),
        /* @__PURE__ */ n("input", { type: "number", min: "1", max: "4", step: "1", value: K, disabled: a, onInput: (A) => q("batchSize", A.currentTarget.valueAsNumber) })
      ] }),
      /* @__PURE__ */ n("label", { class: "td-imagegen-seed", children: [
        /* @__PURE__ */ n("span", { children: u("种子", "Seed") }),
        /* @__PURE__ */ n("input", { type: "number", min: "0", max: Number.MAX_SAFE_INTEGER, value: ee, disabled: a || Q, onInput: (A) => q("seed", A.currentTarget.valueAsNumber) })
      ] }),
      /* @__PURE__ */ n("label", { class: "td-imagegen-random", children: [
        /* @__PURE__ */ n("input", { type: "checkbox", checked: Q, disabled: a, onChange: (A) => q("randomSeed", A.currentTarget.checked) }),
        u("每次随机", "Randomize")
      ] })
    ] }),
    a && /* @__PURE__ */ n("div", { class: "td-batch-progress", children: [
      /* @__PURE__ */ n("span", { children: le || u("生图进行中", "Generating") }),
      /* @__PURE__ */ n("progress", { max: "100", value: gt }),
      /* @__PURE__ */ n("b", { children: d.max ? `${gt}%` : u("排队中", "Queued") })
    ] }),
    de && B.length > 0 && /* @__PURE__ */ n("section", { class: "td-imagegen-batch-outcomes", children: [
      /* @__PURE__ */ n("header", { children: /* @__PURE__ */ n("strong", { children: u(`完成 ${B.filter((A) => A.status === "success").length} · 失败 ${B.filter((A) => A.status === "error").length}`, `${B.filter((A) => A.status === "success").length} completed · ${B.filter((A) => A.status === "error").length} failed`) }) }),
      /* @__PURE__ */ n("div", { class: "td-imagegen-batch-log", role: "log", "aria-label": u("批量生图日志", "Batch generation log"), tabIndex: 0, children: B.map((A) => /* @__PURE__ */ n("div", { class: `td-imagegen-log-row ${A.status}`, children: [
        /* @__PURE__ */ n("strong", { children: A.alias }),
        /* @__PURE__ */ n("span", { children: A.status === "success" ? u("已生成并绑定", "Generated and assigned") : A.error })
      ] }, A.assetId)) }),
      B.some((A) => A.status === "error") && /* @__PURE__ */ n("button", { disabled: a || E || !!C || !!z, onClick: () => void $t(!0), children: u("重试勾选的失败项", "Retry selected failures") })
    ] }),
    !de && e.imageGenerationPending && !a && /* @__PURE__ */ n("div", { class: "td-imagegen-pending", children: [
      /* @__PURE__ */ n("span", { children: u(`未完成任务：${e.imageGenerationPending.promptId}`, `Pending task: ${e.imageGenerationPending.promptId}`) }),
      /* @__PURE__ */ n("button", { onClick: () => void mt(), children: u("恢复结果", "Recover results") })
    ] }),
    ht && /* @__PURE__ */ n("div", { class: "td-imagegen-error", children: ht }),
    !de && ue && /* @__PURE__ */ n("div", { class: "td-imagegen-record", children: [
      /* @__PURE__ */ n("span", { children: [
        u("实际种子", "Seed"),
        ": ",
        ue.settings.seed
      ] }),
      /* @__PURE__ */ n("span", { children: [
        ue.settings.width,
        " × ",
        ue.settings.height
      ] }),
      /* @__PURE__ */ n("span", { children: ue.settings.workflowSource === "canvas" ? u("采样使用画布设置", "Canvas sampling") : `${ue.settings.steps} steps · CFG ${ue.settings.cfg}` }),
      /* @__PURE__ */ n("span", { title: ue.promptId, children: [
        "ID ",
        ue.promptId
      ] })
    ] }),
    !de && Oe.length > 0 && /* @__PURE__ */ n("section", { class: "td-imagegen-results", children: [
      /* @__PURE__ */ n("header", { children: [
        /* @__PURE__ */ n("strong", { children: u(`生成结果（${Oe.length}）`, `Generated images (${Oe.length})`) }),
        /* @__PURE__ */ n("span", { children: u("选一张绑定当前素材，或登记为新素材", "Assign an image to this asset or add it as a new asset") })
      ] }),
      /* @__PURE__ */ n("div", { class: "td-imagegen-grid", children: Oe.map((A, ie) => /* @__PURE__ */ n("article", { children: [
        /* @__PURE__ */ n("img", { src: A.url, alt: `${e.alias} ${ie + 1}`, loading: "lazy" }),
        /* @__PURE__ */ n("small", { title: A.filename, children: A.filename }),
        /* @__PURE__ */ n("button", { class: "primary", disabled: a || !!Re, onClick: () => void It(A, "replace", ie), children: Re === A.filename ? u("正在登记…", "Saving…") : u("设为当前素材", "Use for this asset") }),
        /* @__PURE__ */ n("button", { disabled: a || !!Re, onClick: () => void It(A, "new", ie), children: Re === A.filename ? u("正在登记…", "Saving…") : u("登记为新素材", "Add as new asset") })
      ] }, `${A.subfolder}/${A.filename}`)) })
    ] }),
    /* @__PURE__ */ n("footer", { children: [
      /* @__PURE__ */ n("span", { class: "td-imagegen-footer-note", children: u("按当前选择加载模型；采样器与调度器沿用工作流；Qwen Turbo 使用工作流中的 8 步 Sigma 序列。", "Load selected models; retain workflow sampler and scheduler. Validate selected files before queueing.") }),
      a && /* @__PURE__ */ n("button", { class: "danger", onClick: v, children: u("停止生图", "Stop") }),
      /* @__PURE__ */ n("button", { disabled: a || E || !!C || !!z || de && !re.length, onClick: () => void (de ? $t() : Zt()), class: "primary", children: a ? u("正在生成…", "Generating…") : de ? u(`开始批量生成（${re.length}项）`, `Generate selected (${re.length})`) : u("开始生图", "Generate") })
    ] })
  ] }) });
}
function ma(e, t, r) {
  const o = e.assets.filter((l) => !t.some((a) => a.id === l.id)).flatMap((l) => {
    var p;
    const a = l.path ? [{ type: "input", path: l.path }] : [];
    for (const m of Object.values(((p = l.imageGeneration) == null ? void 0 : p.registeredPaths) ?? {})) a.push({ type: "input", path: m });
    const d = l.id === (r == null ? void 0 : r.assetId) ? [] : l.imageGenerationHistory ?? [];
    for (const m of [l.imageGeneration, ...d]) {
      for (const b of (m == null ? void 0 : m.images) ?? []) a.push({ type: "output", path: `${b.subfolder}/${b.filename}` });
      for (const b of Object.values((m == null ? void 0 : m.registeredPaths) ?? {})) a.push({ type: "input", path: b });
    }
    return a;
  }), s = t.flatMap((l) => l.path ? [{ type: "input", path: l.path }] : []);
  r != null && r.oldPath && s.push({ type: "input", path: r.oldPath });
  for (const l of [r == null ? void 0 : r.oldGeneration, ...(r == null ? void 0 : r.oldGenerations) ?? []]) {
    for (const a of Object.values((l == null ? void 0 : l.registeredPaths) ?? {})) s.push({ type: "input", path: a });
    for (const a of (l == null ? void 0 : l.images) ?? []) s.push({ type: "output", path: `${a.subfolder}/${a.filename}` });
  }
  return { candidates: s, keep: o };
}
async function ga(e, t) {
  const r = await fetch("/theodore-director/v1/storyboard/resources/clear", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ projectName: e, runId: t }) }), i = await r.json();
  if (!r.ok || !i.ok) throw new Error(i.error || `HTTP ${r.status}`);
  return { deleted: i.deleted ?? [], bytes: i.bytes ?? 0 };
}
async function fa(e, t) {
  var o;
  const r = await fetch("/theodore-director/v1/assets/cleanup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ projectName: e, ...t }) }), i = await r.json();
  if (!r.ok && r.status !== 409) throw new Error(i.error || `HTTP ${r.status}`);
  if ((o = i.failures) != null && o.length) throw new Error(`资源清理失败：${i.failures.map((s) => s.path).join(", ")}`);
  return i;
}
const Yt = [
  { id: "16:9", width: 1024, height: 576 },
  { id: "9:16", width: 576, height: 1024 },
  { id: "1:1", width: 768, height: 768 },
  { id: "4:3", width: 1024, height: 768 },
  { id: "3:4", width: 768, height: 1024 }
], ui = (e) => {
  const t = Yt.find((r) => r.id === e);
  if (!t) throw new Error(`Unknown frame ratio: ${e}`);
  return t;
}, pr = (e) => Math.max(32, Math.round(e / 32) * 32);
function bn(e, t) {
  const r = ui(e);
  return { width: pr(r.width * t), height: pr(r.height * t) };
}
function ba(e) {
  for (const t of Yt)
    for (let r = 3; r <= 20; r++) {
      const i = r / 10, o = bn(t.id, i);
      if (o.width === e.width && o.height === e.height) return { ratio: t.id, scale: i };
    }
  return null;
}
function hr(e, t) {
  const r = ui(t);
  return Math.min(20, Math.max(3, Math.round(Math.sqrt(e.width * e.height / (r.width * r.height)) * 10))) / 10;
}
function xa(e) {
  return [...Yt].sort(
    (t, r) => Math.abs(Math.log(e.width / e.height / (t.width / t.height))) - Math.abs(Math.log(e.width / e.height / (r.width / r.height)))
  )[0].id;
}
function va({ plan: e, language: t, busy: r, builtInControls: i, mutate: o, onDuration: s, children: l }) {
  var y, v;
  const a = (x, u) => t === "zh" ? x : u, [d, p] = G("project"), m = [
    { id: "project", title: a("项目与默认值", "Project & defaults"), description: a("输出目录、新分镜与保存", "Folders, new shots & saving") },
    { id: "generation", title: a("一采画幅与镜头接力", "First-pass framing & shot relay"), description: a("生成尺寸、帧率与前段衔接", "Generation size, FPS & continuity") },
    { id: "prompts", title: a("全局提示词", "Global prompts"), description: a("每个镜头共用的内容", "Shared across shots") },
    { id: "storage", title: a("资源管理", "Storage"), description: a("分镜、素材与运行文件", "Shots, media & generated files") }
  ], b = e.generation ?? { width: 416, height: 224 }, h = (x, u) => o(($) => {
    $.generation = { width: x, height: u };
  }), c = ba(b), g = (c == null ? void 0 : c.ratio) ?? xa(b), S = (c == null ? void 0 : c.scale) ?? hr(b, g), T = (x) => {
    const u = x.target;
    if (u.tagName === "INPUT" && u.type === "number" && !u.checkValidity()) {
      const $ = u.dataset.saved;
      $ !== void 0 && (u.value = $);
    }
  };
  return /* @__PURE__ */ n("section", { class: "td-config-page", children: [
    /* @__PURE__ */ n("header", { class: "td-config-intro", children: [
      /* @__PURE__ */ n("div", { children: [
        /* @__PURE__ */ n("span", { class: "td-eyebrow", children: a("导播台内置功能", "BUILT-IN CONTROLS") }),
        /* @__PURE__ */ n("h2", { children: a("配置保持简单，工作流自由连接", "Simple settings, flexible workflows") }),
        /* @__PURE__ */ n("p", { children: a("这里只管理项目、画幅和连续性。模型、LoRA 与采样器直接在 ComfyUI 画布调整。", "Manage the project, framing and continuity here. Edit models, LoRAs and samplers on the ComfyUI canvas.") })
      ] }),
      /* @__PURE__ */ n("span", { class: "td-chip", children: i ? a("内置控制已连接", "Built-in controls connected") : a("兼容旧工作流", "Legacy workflow") })
    ] }),
    /* @__PURE__ */ n("div", { class: "td-config-layout", children: [
      /* @__PURE__ */ n("nav", { class: "td-config-nav", "aria-label": a("配置分类", "Settings categories"), children: m.map((x) => /* @__PURE__ */ n("button", { class: d === x.id ? "active" : "", "aria-current": d === x.id ? "page" : void 0, onClick: () => p(x.id), children: [
        /* @__PURE__ */ n("strong", { children: x.title }),
        /* @__PURE__ */ n("small", { children: x.description })
      ] }, x.id)) }),
      /* @__PURE__ */ n("div", { class: "td-config-content", onFocusOut: T, children: [
        /* @__PURE__ */ n("fieldset", { class: "td-config-card td-form", disabled: r, hidden: d !== "project", children: [
          /* @__PURE__ */ n("legend", { children: a("项目与默认值", "Project & defaults") }),
          /* @__PURE__ */ n("div", { class: "td-settings-grid", children: [
            /* @__PURE__ */ n("label", { children: [
              a("项目名", "Project name"),
              /* @__PURE__ */ n("input", { value: e.project.name, onInput: (x) => o((u) => {
                u.project.name = x.currentTarget.value;
              }) })
            ] }),
            /* @__PURE__ */ n("label", { children: [
              "Run ID",
              /* @__PURE__ */ n("input", { value: e.project.runId, onInput: (x) => o((u) => {
                u.project.runId = x.currentTarget.value;
              }) })
            ] }),
            /* @__PURE__ */ n("label", { children: [
              a("新分镜默认时长（秒）", "Default shot duration (sec)"),
              /* @__PURE__ */ n("input", { type: "number", min: "0.1", step: "0.1", value: e.defaults.durationSeconds ?? 6, "data-saved": e.defaults.durationSeconds ?? 6, onChange: (x) => {
                const u = Number(x.currentTarget.value);
                Number.isFinite(u) && u >= 0.1 && (o(($) => {
                  $.defaults.durationSeconds = u;
                }), s(String(u)));
              } })
            ] }),
            /* @__PURE__ */ n("label", { children: [
              a("基础种子", "Base seed"),
              /* @__PURE__ */ n("input", { type: "number", min: "0", max: Number.MAX_SAFE_INTEGER, step: "1", value: e.defaults.baseSeed, "data-saved": e.defaults.baseSeed, onChange: (x) => {
                const u = Number(x.currentTarget.value);
                Number.isSafeInteger(u) && u >= 0 && o(($) => {
                  $.defaults.baseSeed = u;
                });
              } })
            ] })
          ] }),
          /* @__PURE__ */ n("p", { class: "td-hint", children: a("项目名与 Run ID 决定输出目录；修改后会切换目录。保存项目将配置写入当前工作流。", "The project name and Run ID select the output folder. Save the project to store settings in the current workflow.") }),
          /* @__PURE__ */ n("label", { class: "td-config-check", children: [
            /* @__PURE__ */ n("input", { type: "checkbox", checked: ((y = e.uiPreferences) == null ? void 0 : y.autoSave) ?? !1, onChange: (x) => o((u) => {
              u.uiPreferences = { ...u.uiPreferences, autoSave: x.currentTarget.checked };
            }) }),
            a("编辑后自动保存项目", "Auto-save project edits")
          ] })
        ] }),
        /* @__PURE__ */ n("fieldset", { class: "td-config-card td-form", disabled: r || !i, hidden: d !== "generation", children: [
          /* @__PURE__ */ n("legend", { children: a("一采画幅与镜头接力", "First-pass framing & shot relay") }),
          !i && /* @__PURE__ */ n("p", { class: "td-hint", children: a("当前为旧版分散控制工作流。导入新版 YuQ 工作流后，画幅与连续性将由此页统一控制。", "Import the new YuQ workflow to control framing and continuity here.") }),
          /* @__PURE__ */ n("p", { class: "td-hint", children: a("1.0× 为所选比例的基准尺寸；每次调整 0.1×。实际像素自动对齐到 32 的倍数，比例可能略有偏差。", "1.0× is the base size for the selected ratio; dimensions are rounded to multiples of 32.") }),
          /* @__PURE__ */ n("div", { class: "td-settings-grid", children: [
            /* @__PURE__ */ n("label", { children: [
              a("一采画幅比例", "First-pass aspect ratio"),
              /* @__PURE__ */ n("select", { "aria-label": a("一采画幅比例", "First-pass aspect ratio"), value: (c == null ? void 0 : c.ratio) ?? "custom", onChange: (x) => {
                const u = x.currentTarget.value;
                if (u !== "custom") {
                  const $ = bn(u, (c == null ? void 0 : c.scale) ?? hr(b, u));
                  h($.width, $.height);
                }
              }, children: [
                !c && /* @__PURE__ */ n("option", { value: "custom", children: a("自定义（保留原尺寸）", "Custom (existing size)") }),
                Yt.map((x) => /* @__PURE__ */ n("option", { value: x.id, children: x.id }, x.id))
              ] })
            ] }),
            /* @__PURE__ */ n("label", { children: [
              a("一采尺寸倍率", "First-pass size scale"),
              /* @__PURE__ */ n("input", { "aria-label": a("一采尺寸倍率", "First-pass size scale"), type: "number", min: "0.3", max: "2", step: "0.1", value: S, "data-saved": S, onChange: (x) => {
                const u = x.currentTarget.valueAsNumber;
                if (Number.isFinite(u) && u >= 0.3 && u <= 2 && Math.abs(u * 10 - Math.round(u * 10)) < 1e-6) {
                  const $ = bn(g, u);
                  h($.width, $.height);
                }
              } })
            ] })
          ] }),
          /* @__PURE__ */ n("p", { class: "td-hint", "aria-live": "polite", children: a(`实际一采尺寸：${b.width} × ${b.height} 像素${c ? ` · ${c.scale.toFixed(1)}×` : ` · 保留原尺寸；调整倍率将采用最接近的 ${g} 比例`}`, `Actual first-pass size: ${b.width} × ${b.height} px${c ? ` · ${c.scale.toFixed(1)}×` : " · existing custom size; changing scale uses the nearest ratio"}`) }),
          /* @__PURE__ */ n("label", { children: [
            a("二采放大倍率", "Second-pass upscale factor"),
            /* @__PURE__ */ n("select", { value: ((v = e.pipeline) == null ? void 0 : v.secondPassScale) === void 0 ? "workflow" : String(e.pipeline.secondPassScale), onChange: (x) => o((u) => {
              if (!u.pipeline) return;
              const $ = x.currentTarget.value;
              $ === "workflow" ? delete u.pipeline.secondPassScale : u.pipeline.secondPassScale = Number($);
            }), children: [
              /* @__PURE__ */ n("option", { value: "workflow", children: a("跟随工作流画布", "Use workflow setting") }),
              [1, 1.2, 1.4, 1.6, 1.8, 2].map((x) => /* @__PURE__ */ n("option", { value: String(x), children: [
                x.toFixed(1),
                "×"
              ] }, x))
            ] })
          ] }),
          /* @__PURE__ */ n("p", { class: "td-hint", children: a("修改倍率后，请从接力链第一段重新运行二采；实际尺寸会按节点规则对齐。", "After changing the factor, rerun the second-pass chain from the first shot; output dimensions follow the upscaler alignment.") }),
          /* @__PURE__ */ n("div", { class: "td-settings-grid", children: [
            /* @__PURE__ */ n("label", { children: [
              a("输出帧率（FPS）", "Output frame rate (FPS)"),
              /* @__PURE__ */ n("input", { "aria-label": "FPS", type: "number", min: "1", max: "120", step: "1", value: e.defaults.fps, "data-saved": e.defaults.fps, onChange: (x) => {
                const u = Number(x.currentTarget.value);
                Number.isInteger(u) && u >= 1 && u <= 120 && o(($) => {
                  $.defaults.fps = u;
                });
              } })
            ] }),
            /* @__PURE__ */ n("label", { children: [
              a("视频接力帧数", "Video context frames"),
              /* @__PURE__ */ n("select", { "aria-label": a("视频接力帧数", "Video context frames"), value: e.continuity.videoContextFrames, onChange: (x) => o((u) => {
                u.continuity.videoContextFrames = Number(x.currentTarget.value);
              }), children: [5, 22, 39, 56].map((x) => /* @__PURE__ */ n("option", { value: x, children: x }, x)) })
            ] }),
            /* @__PURE__ */ n("label", { children: [
              a("音频接力帧数", "Audio context frames"),
              /* @__PURE__ */ n("input", { type: "number", min: "0", max: "240", step: "1", value: e.continuity.audioContextFrames, "data-saved": e.continuity.audioContextFrames, onChange: (x) => {
                const u = Number(x.currentTarget.value);
                Number.isInteger(u) && u >= 0 && u <= 240 && o(($) => {
                  $.continuity.audioContextFrames = u;
                });
              } })
            ] })
          ] }),
          /* @__PURE__ */ n("p", { class: "td-hint", children: a(`视频接力：借用上一段末尾的 ${e.continuity.videoContextFrames} 帧画面（按当前 FPS 约 ${(e.continuity.videoContextFrames / e.defaults.fps).toFixed(2)} 秒）衔接本段，成片会裁去重复的接力画面。只对开启接力的后续分镜生效，首段不使用。`, `Video relay borrows the previous shot's last ${e.continuity.videoContextFrames} frames (about ${(e.continuity.videoContextFrames / e.defaults.fps).toFixed(2)} sec at the current FPS). Duplicate context frames are trimmed from the result. Only subsequent shots with relay enabled use it.`) }),
          /* @__PURE__ */ n("p", { class: "td-hint", children: a("音频接力：独立控制上一段尾音的衔接窗口；0 表示跟随画面窗口。音频使用独立的 latent 时间网格，不能直接用此数值除以 FPS 换算。可先保留画面 22、音频 24，再按接缝效果调整。", "Audio relay independently controls the tail-audio context window; 0 follows the video window. Audio uses its own latent time grid, so dividing this value by video FPS does not give its duration. Start with video 22 / audio 24 and adjust after reviewing joins.") })
        ] }),
        /* @__PURE__ */ n("fieldset", { class: "td-config-card td-form", disabled: r, hidden: d !== "prompts", children: [
          /* @__PURE__ */ n("legend", { children: a("全局提示词", "Global prompts") }),
          /* @__PURE__ */ n("p", { class: "td-hint", children: a("只填写全片共用的内容；具体动作、对白和素材引用在分镜中编辑。", "Use shared instructions here; edit action, dialogue and references per shot.") }),
          /* @__PURE__ */ n("label", { children: [
            a("全局前缀", "Global prefix"),
            /* @__PURE__ */ n(mn, { value: e.promptPrefix, isReferenceValid: (x) => tr(e, x), onInput: (x) => o((u) => {
              u.promptPrefix = x.currentTarget.value;
            }) })
          ] }),
          /* @__PURE__ */ n("label", { children: [
            a("全局后缀", "Global suffix"),
            /* @__PURE__ */ n(mn, { value: e.promptSuffix, isReferenceValid: (x) => tr(e, x), onInput: (x) => o((u) => {
              u.promptSuffix = x.currentTarget.value;
            }) })
          ] }),
          /* @__PURE__ */ n("details", { class: "td-config-notes", children: [
            /* @__PURE__ */ n("summary", { children: a("项目备注（不发送给模型）", "Project notes (not sent to the model)") }),
            /* @__PURE__ */ n("textarea", { "aria-label": a("项目备注", "Project notes"), rows: 5, value: e.project.notes ?? "", onInput: (x) => o((u) => {
              u.project.notes = x.currentTarget.value;
            }) })
          ] })
        ] }),
        /* @__PURE__ */ n("section", { class: "td-config-card", hidden: d !== "storage", children: l }),
        r && /* @__PURE__ */ n("p", { class: "td-hint", role: "status", children: a("任务执行中，完成后可以修改配置。", "Settings are locked while a job is running.") })
      ] })
    ] })
  ] });
}
function je(e) {
  return Array.isArray(e) && e.length === 2 && (typeof e[0] == "string" || typeof e[0] == "number") && typeof e[1] == "number";
}
function Ye(e) {
  return je(e) ? String(e[0]) : null;
}
function Ne(e, t) {
  return Object.keys(e).filter((r) => {
    var i;
    return ((i = e[r]) == null ? void 0 : i.class_type) === t;
  });
}
function wa(e, t, r) {
  const i = Ne(e, t);
  if (!i.length) throw new Error(`当前工作流缺少 ${r}（${t}）节点`);
  if (i.length > 1) throw new Error(`当前工作流存在多个 ${r}（${t}）节点，无法确定要控制哪一个`);
  return i[0];
}
function mi(e, t, r, i, o = 0) {
  const s = e[t];
  if (!s || o > 6) return !1;
  const l = s.inputs[r];
  if (typeof l == "number")
    return s.inputs[r] = i, !0;
  const a = Ye(l);
  if (!a || !e[a]) return !1;
  const d = e[a];
  return typeof d.inputs.value == "number" || je(d.inputs.value) ? mi(e, a, "value", i, o + 1) : !1;
}
function Ae(e, t, r, i = /* @__PURE__ */ new Set()) {
  var o;
  return t === r ? !0 : i.has(t) ? !1 : (i.add(t), Object.values(((o = e[t]) == null ? void 0 : o.inputs) ?? {}).some((s) => je(s) && Ae(e, String(s[0]), r, i)));
}
function gi(e, t) {
  const r = {}, i = [t];
  for (; i.length; ) {
    const o = i.pop();
    if (!r[o]) {
      if (!e[o]) throw new Error(`工作流依赖节点 ${o} 不存在`);
      r[o] = e[o];
      for (const s of Object.values(e[o].inputs)) je(s) && i.push(String(s[0]));
    }
  }
  return r;
}
function ur(e, t, r) {
  const i = JSON.parse(JSON.stringify(e)), o = Ne(i, "TheodoreDirector_ImageControls").filter((a) => Ae(i, a, t));
  if (o.length !== 1) throw new Error(`当前项目需要连接一个生图控制节点，找到 ${o.length} 个`);
  const s = o[0], l = Ne(i, "SaveImage").filter((a) => {
    const d = i[a].inputs.filename_prefix;
    return je(d) && String(d[0]) === s && d[1] === 6 && Ae(i, String(Ye(i[a].inputs.images)), s);
  });
  if (l.length !== 1) throw new Error("请将生图控制的保存路径连接到唯一的 SaveImage，图像链也须连接生图控制");
  Object.assign(i[s].inputs, {
    positive_prompt: r.positivePrompt,
    negative_prompt: r.negativePrompt,
    width: r.width,
    height: r.height,
    batch_size: r.batchSize,
    seed: r.seed,
    filename_prefix: r.filenamePrefix
  });
  for (const a of Object.values(i)) for (const [d, p] of Object.entries(a.inputs)) {
    let m = p;
    const b = /* @__PURE__ */ new Set();
    for (; je(m); ) {
      const h = String(m[0]), c = i[h];
      if (m[1] !== 0 || (c == null ? void 0 : c.class_type) !== "ComfySwitchNode" || typeof c.inputs.switch != "boolean") break;
      if (b.has(h)) throw new Error("生图提示词开关形成循环");
      if (b.add(h), m = c.inputs[c.inputs.switch ? "on_true" : "on_false"], m === void 0) throw new Error("生图提示词开关缺少所选输入");
    }
    a.inputs[d] = m;
  }
  return { output: gi(i, l[0]), targetId: l[0], sourceId: s };
}
function ya(e, t) {
  var a;
  const r = JSON.parse(JSON.stringify(e)), i = t.projectId ?? wa(r, "TheodoreDirector_Project", "Theodore 项目");
  if (((a = r[i]) == null ? void 0 : a.class_type) !== "TheodoreDirector_Project") throw new Error("当前导播台的项目节点不存在或已被旁路");
  r[i].inputs.plan_json = t.planJson;
  const o = Object.keys(r).filter((d) => ["TheodoreDirector_SelectShot", "TheodoreDirector_ShotControl"].includes(r[d].class_type) && Ae(r, d, i));
  if (o.length !== 1) throw new Error(`当前项目需要连接一个分镜控制节点，找到 ${o.length} 个`);
  const s = o[0], l = r[s];
  if ("resume_mode" in l.inputs && (l.inputs.resume_mode = "fresh"), l.class_type === "TheodoreDirector_ShotControl")
    l.inputs.queue_index = t.activeIndex;
  else if (!mi(r, s, "queue_index", t.activeIndex))
    throw new Error("无法定位当前片段序号节点（SelectShot.queue_index 的上游整数）");
  l.class_type === "TheodoreDirector_SelectShot" && t.baseSeed !== void 0 && (l.inputs.base_seed = t.baseSeed);
  for (const d of Ne(r, "ImpactQueueTrigger"))
    (!t.projectId || Ae(r, d, s)) && (r[d].inputs.mode = !1);
  if (l.class_type === "TheodoreDirector_ShotControl") {
    const d = Ne(r, "TheodoreDirector_CommitResult").filter((p) => Ae(r, p, s));
    if (d.length !== 1) throw new Error("当前分镜控制需要连接一个结果提交节点");
    return gi(r, d[0]);
  }
  return r;
}
function _a(e) {
  var o;
  const t = new Set(Ne(e, "TheodoreDirector_PostprocessSecondPassSource"));
  if (!t.size) return [];
  const r = new Set(Object.keys(e).filter((s) => {
    const l = e[s];
    return l.class_type === "RandomNoise" && t.has(Ye(l.inputs.noise_seed) ?? "");
  })), i = /* @__PURE__ */ new Set();
  for (const s of Object.keys(e)) {
    const l = e[s];
    if (l.class_type !== "SamplerCustomAdvanced" || !r.has(Ye(l.inputs.noise) ?? "")) continue;
    const a = Ye(l.inputs.sigmas);
    a && ((o = e[a]) == null ? void 0 : o.class_type) === "BasicScheduler" && i.add(a);
  }
  return [...i];
}
function ka(e, t) {
  const r = _a(e);
  for (const i of r) e[i].inputs.denoise = t;
  return r.length;
}
function Sa(e, t) {
  var i;
  const r = Ne(e, "VAEEncodeAudio").filter((o) => Ae(e, o, t));
  for (const o of Ne(e, "MiniMaxH3ReferenceToVideo"))
    Ae(e, o, t) && (e[o].inputs.length = [t, 13]);
  for (const o of Ne(e, "CreateVideo"))
    Ae(e, o, t) && (e[o].inputs.audio = [t, 14]);
  for (const o of Ne(e, "SamplerCustomAdvanced")) {
    if (!Ae(e, o, t)) continue;
    const s = e[o], l = Ye(s.inputs.guider), a = l ? e[l] : void 0;
    if (!a || a.class_type !== "BasicGuider") throw new Error("二采接力需要连接 BasicGuider，请使用新版工作流的后处理支流");
    const d = Ye(a.inputs.conditioning);
    if (d && ((i = e[d]) == null ? void 0 : i.class_type) === "TheodoreDirector_SecondPassRelay") continue;
    if (r.length !== 1) throw new Error("二采接力无法定位唯一的源音轨编码节点");
    const p = Ne(e, "VAEDecode").find((c) => Ye(e[c].inputs.samples) === o);
    if (!p) throw new Error("二采接力找不到采样器对应的视频解码节点");
    const m = `yuq_relay_${o}`, b = `yuq_guide_${o}`, h = `yuq_finalize_${o}`;
    if ([m, b, h].some((c) => e[c])) throw new Error("二采接力自动节点 ID 冲突");
    e[m] = { class_type: "TheodoreDirector_SecondPassRelay", inputs: {
      conditioning: a.inputs.conditioning,
      latent: s.inputs.latent_image,
      vae: e[p].inputs.vae,
      request: [t, 2],
      audio_latent: [r[0], 0]
    } }, e[b] = { ...a, inputs: { ...a.inputs, conditioning: [m, 0] } }, s.inputs.guider = [b, 0], s.inputs.latent_image = [m, 1];
    for (const c of Object.values(e)) for (const [g, S] of Object.entries(c.inputs))
      je(S) && String(S[0]) === p && S[1] === 0 && (c.inputs[g] = [h, 0]);
    e[h] = { class_type: "TheodoreDirector_SecondPassFinalize", inputs: {
      images: [p, 0],
      latent: [o, 0],
      audio_latent: [r[0], 0],
      request: [t, 2],
      vae: e[p].inputs.vae
    } };
  }
}
function $a(e, t) {
  var l, a;
  const r = JSON.parse(JSON.stringify(e));
  if (((l = r[t.sourceId]) == null ? void 0 : l.class_type) !== "TheodoreDirector_PostprocessSecondPassSource")
    throw new Error("无法序列化后处理二采源节点");
  if (((a = r[t.targetId]) == null ? void 0 : a.class_type) !== "TheodoreDirector_SaveSecondPass")
    throw new Error("无法序列化后处理二采保存节点");
  if (r[t.sourceId].inputs.request_json = t.requestJson, t.processingMode === "latent_upscale_second_pass") {
    const d = r[t.sourceId].inputs;
    for (const [p, m] of Object.entries(r))
      if (!(m.class_type !== "MinimaxH3LatentUpscaler3D" || !Ae(r, p, t.sourceId)) && (d.latent_full_sequence === !0 && (m.inputs.enable_temporal_chunking = !1, m.inputs.precision = "fp32"), d.diagnose_latent === !0)) {
        const b = m.inputs.latent;
        if (!je(b)) throw new Error("latent 诊断需要放大器直接连接 latent 输入");
        const h = `yuq_probe_before_${p}`, c = `yuq_probe_after_${p}`;
        if (r[h] || r[c]) throw new Error("latent 诊断节点 ID 冲突");
        for (const g of Object.values(r))
          for (const [S, T] of Object.entries(g.inputs))
            je(T) && String(T[0]) === p && T[1] === 0 && (g.inputs[S] = [c, 0]);
        r[h] = { class_type: "TheodoreDirector_LatentProbe", inputs: { latent: b, request: [t.sourceId, 2], stage: "encoded" } }, m.inputs.latent = [h, 0], r[c] = { class_type: "TheodoreDirector_LatentProbe", inputs: { latent: [p, 0], request: [t.sourceId, 2], stage: "upscaled" } };
      }
  }
  if (t.processingMode === "super_resolution_second_pass")
    for (const [d, p] of Object.entries(r)) {
      const m = p.inputs.pixels;
      if (p.class_type !== "VAEEncode" || !je(m)) continue;
      const b = r[String(m[0])];
      if ((b == null ? void 0 : b.class_type) !== "RTXVideoSuperResolution" || !Ae(r, String(m[0]), t.sourceId)) continue;
      const h = `yuq_align_${d}`;
      if (r[h]) throw new Error("二采画幅对齐节点 ID 冲突");
      r[h] = { class_type: "TheodoreDirector_SecondPassAlign", inputs: { images: m } }, p.inputs.pixels = [h, 0];
    }
  if (JSON.parse(t.requestJson).relayVersion === 1 && t.processingMode !== "super_resolution_only" && Sa(r, t.sourceId), typeof t.denoise == "number" && t.processingMode !== "super_resolution_only" && !ka(r, t.denoise))
    throw new Error("当前工作流的后处理二采支流中找不到 BasicScheduler，无法设置重绘强度");
  const i = {
    8: "super_resolution_second_pass",
    9: "latent_upscale_second_pass",
    10: "super_resolution_only"
  };
  for (const d of Object.values(r)) {
    const p = d.inputs.cond;
    if (d.class_type !== "ImpactConditionalBranch" || !je(p) || String(p[0]) !== t.sourceId) continue;
    const m = i[p[1]];
    if (!m) continue;
    const b = t.processingMode === m, h = d.inputs[b ? "tt_value" : "ff_value"];
    if (h === void 0) throw new Error("后处理二采模式选择节点缺少输入");
    d.inputs = { cond: b, tt_value: h, ff_value: h };
  }
  const o = {}, s = [t.targetId];
  for (; s.length; ) {
    const d = s.pop();
    if (o[d]) continue;
    const p = r[d];
    if (!p) throw new Error(`后处理二采依赖节点 ${d} 不存在`);
    if (["TheodoreDirector_Project", "TheodoreDirector_SelectShot", "TheodoreDirector_ShotControl", "TheodoreDirector_ImageControls", "TheodoreDirector_CommitResult", "ImpactQueueTrigger", "ImpactSetWidgetValue"].includes(p.class_type))
      throw new Error(`后处理二采支流错误连接到主循环节点 ${d}（${p.class_type}）`);
    o[d] = p;
    for (const m of Object.values(p.inputs))
      je(m) && s.push(String(m[0]));
  }
  if (!o[t.sourceId]) throw new Error("后处理二采保存目标未连接到所选源节点");
  if (t.scale !== void 0) {
    const d = t.scale;
    if (!Number.isFinite(d) || d < 1 || d > 2) throw new Error("二采倍率必须在 1 到 2 之间");
    const p = t.processingMode === "latent_upscale_second_pass", m = p ? "MinimaxH3LatentUpscaler3D" : "RTXVideoSuperResolution", b = Object.values(o).filter((c) => c.class_type === m), h = p ? "mode" : "resize_type";
    if (b.length !== 1 || b[0].inputs[h] !== "scale by multiplier" || typeof b[0].inputs[`${h}.scale`] != "number")
      throw new Error("当前二采支路没有唯一的倍率模式放大节点，请在画布设置倍率或切回跟随工作流");
    if (b[0].inputs[`${h}.scale`] = d, p) {
      const c = Object.values(o).filter((g) => g.class_type === "MiniMaxH3ConditioningUpscale");
      if (c.length !== 1 || typeof c[0].inputs.scale_by != "number") throw new Error("当前 latent 二采支路缺少唯一可设置的条件倍率节点");
      c[0].inputs.scale_by = d;
    }
  }
  return o;
}
function Ia(e, t, r, i) {
  var p, m;
  const o = (p = e[t]) == null ? void 0 : p.inputs.native_continuity;
  if (o !== void 0 && typeof o != "boolean")
    throw new Error("请在二采源节点直接设置 native_continuity 开关，接力预检需要确定其状态");
  const { onProgress: s, signal: l, ...a } = i;
  a.relayVersion = 1, delete a.continuityMode, o && (a.continuityMode = "h3_native_prefix_right_context_v1");
  const d = $a(e, {
    sourceId: t,
    targetId: r,
    requestJson: JSON.stringify(a),
    processingMode: i.processingMode,
    denoise: i.denoise,
    scale: (m = i.plan.pipeline) == null ? void 0 : m.secondPassScale
  });
  return a.workflowSignature = Ca(d), d[t].inputs.request_json = JSON.stringify(a), { payload: a, output: d };
}
function Pa(e, t, r, i, o) {
  const s = {};
  for (const d of e.shots) {
    const p = Xe(d, Le(r[d.id] ?? []));
    p && (s[d.id] = p.path);
  }
  const l = new Set(t), a = (d) => {
    var m;
    if (!s[d.id]) throw new Error(`「${d.title}」缺少选定的一采结果`);
    if (((m = d.review) == null ? void 0 : m.status) !== "approved") throw new Error(`接力链中的「${d.title}」尚未通过审片，请先确认其一采结果`);
    if (i === "super_resolution_only" || !at(e, d)) return;
    const p = kt(e, d.id);
    l.add(p.id), a(p);
  };
  for (const d of e.shots) l.has(d.id) && a(d);
  return {
    selections: s,
    jobs: e.shots.filter((d) => l.has(d.id)).map((d) => ({
      shot: d,
      sourcePath: s[d.id],
      skipIfValid: o || !t.includes(d.id)
    }))
  };
}
function Ca(e) {
  const t = Object.fromEntries(Object.keys(e).sort().map((r) => {
    const i = e[r], o = Object.fromEntries(Object.keys(i.inputs).sort().map((s) => [
      s,
      i.class_type === "TheodoreDirector_PostprocessSecondPassSource" && s === "request_json" ? "" : i.inputs[s]
    ]));
    return [r, { class_type: i.class_type, inputs: o }];
  }));
  return JSON.stringify(t);
}
const nt = (e) => JSON.parse(JSON.stringify(e));
async function mr(e, t, r) {
  const i = new FormData();
  i.append("projectName", e), i.append("kind", t), i.append("file", r);
  const o = await fetch("/theodore-director/v1/assets", { method: "POST", body: i }), s = await o.json();
  if (!o.ok || !s.path) throw new Error(s.error || `HTTP ${o.status}`);
  return s.path;
}
function gr(e) {
  return e instanceof Error && e.name === "AbortError";
}
function Ea({ language: e, projectName: t, runId: r, busy: i, onClearShots: o, onClearAssets: s, onProjectCleared: l }) {
  const [a, d] = G(!1), [p, m] = G(!1), b = !!(t.trim() && r.trim()), h = async () => {
    const S = `${t.trim()} / Run ${r.trim()}`, T = e === "zh" ? `确认清空 ${S}？

该运行目录内的全部视频、latent、尾帧、结果文件和元数据都会移入系统回收站。输入素材及其他 Run 不会被删除。` : `Clear ${S}?

All videos, latent files, tail frames, result files, and metadata in this run will be moved to the system trash. Input assets and other runs will not be deleted.`;
    if (window.confirm(T)) {
      d(!0);
      try {
        const y = await Ji(t, r);
        l(), window.alert(e === "zh" ? `已移入系统回收站：${y}` : `Moved to system trash: ${y}`);
      } catch (y) {
        window.alert(`${e === "zh" ? "清空项目失败" : "Failed to clear project"}: ${y instanceof Error ? y.message : String(y)}`);
      } finally {
        d(!1);
      }
    }
  }, c = async () => {
    const S = e === "zh" ? `确认清空全部分镜及其正向、负向提示词？

操作后会保留一个空白镜头以便继续编辑。${p ? "当前 Run 的生成文件也会删除。" : "磁盘生成文件会保留。"}` : `Clear every shot and its positive and negative prompts?

One blank shot will remain. ${p ? "Generated files for this Run will also be deleted." : "Generated files remain on disk."}`;
    if (window.confirm(S)) {
      d(!0);
      try {
        await o(p);
      } catch (T) {
        window.alert(`${e === "zh" ? "清理失败" : "Cleanup failed"}: ${T instanceof Error ? T.message : String(T)}`);
      } finally {
        d(!1);
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
          /* @__PURE__ */ n("input", { type: "checkbox", checked: p, disabled: a || i, onChange: (S) => m(S.currentTarget.checked) }),
          e === "zh" ? "同时删除当前 Run 的生成资源" : "Also delete generated resources for this Run"
        ] })
      ] }),
      /* @__PURE__ */ n("button", { class: "danger", disabled: a || i, onClick: () => void c(), children: a ? e === "zh" ? "清理中…" : "Cleaning…" : e === "zh" ? "清空分镜" : "Clear shots" })
    ] }),
    /* @__PURE__ */ n("article", { children: [
      /* @__PURE__ */ n("div", { children: [
        /* @__PURE__ */ n("strong", { children: e === "zh" ? "清空素材库" : "Clear media library" }),
        /* @__PURE__ */ n("p", { children: e === "zh" ? "只移除当前工作流中的素材引用；本地图片、视频和音频文件保持不变。" : "Remove media references from this workflow only; local image, video, and audio files remain untouched." })
      ] }),
      /* @__PURE__ */ n("button", { class: "danger", onClick: () => {
        const S = e === "zh" ? `确认清空素材库中的全部引用？

素材条目会从当前工作流中移除，但本地图片、视频和音频文件不会被删除。提示词中的引用文本会保留并显示为不可用。` : `Clear every media reference from this workflow?

Media entries will be removed, but local image, video, and audio files will not be deleted. Reference text in prompts will remain and be shown as unavailable.`;
        window.confirm(S) && s();
      }, children: e === "zh" ? "清空素材库" : "Clear media" })
    ] }),
    /* @__PURE__ */ n("article", { children: [
      /* @__PURE__ */ n("div", { children: [
        /* @__PURE__ */ n("strong", { children: e === "zh" ? "清空当前项目的生成文件" : "Clear generated files" }),
        /* @__PURE__ */ n("p", { children: e === "zh" ? "把当前 Project name + Run ID 的全部生成文件移入系统回收站。输入素材和其他 Run 不受影响。" : "Move every generated file for the current Project name + Run ID to the system trash. Input assets and other runs are unaffected." })
      ] }),
      /* @__PURE__ */ n("button", { class: "danger", disabled: !b || a, onClick: () => void h(), children: a ? e === "zh" ? "正在移入回收站…" : "Moving to trash…" : e === "zh" ? "清空项目" : "Clear project" })
    ] })
  ] });
}
function za({ initial: e, onSave: t, onPersist: r, onClose: i, supportsSecondSampling: o, queueSecondPass: s, queueFirstPass: l, imageGeneration: a, builtInControls: d = !1 }) {
  var En;
  const [p] = G(() => _t(e)), [m, b] = G(p), [h, c] = G(() => JSON.stringify(p)), g = ke(m);
  g.current = m;
  const [S, T] = G("shots"), [y, v] = G(0), [x, u] = G(Qi), [$, j] = G(0), [E, P] = G([]), [C, N] = G(Be), [R, F] = G(!1), [I, ne] = G(!1), [k, D] = G(null), [M, V] = G(!1), [Z, Y] = G(!1), [L, _] = G([]), [K, ee] = G(() => String(p.defaults.durationSeconds ?? 6)), [Q, te] = G("1"), [ce, z] = G(() => String(p.defaults.durationSeconds ?? 6)), q = ke(null), pe = ke(0), re = Lo(m, $), f = (w, O) => x === "zh" ? w : O, X = He(() => JSON.stringify(m), [m]) !== h, le = L.length > 0 && L.every((w) => w.enabled), xe = m.assets.filter((w) => w.enabled && !w.path.trim()).length, de = C.kind !== null, Oe = (w) => {
    u(w), Yi(w);
  }, ve = (w, O = "info") => {
    const U = ++pe.current;
    P((J) => [...J.slice(-3), { id: U, message: w, tone: O }]), window.setTimeout(() => P((J) => J.filter((W) => W.id !== U)), O === "error" ? 7e3 : 3200);
  }, ue = (w) => b((O) => {
    var J;
    const U = nt(O);
    return w(U), (J = O.uiPreferences) != null && J.autoSave && queueMicrotask(() => _e(U)), U;
  }), st = (w, O) => ue((U) => {
    const J = U.shots.find((W) => W.id === w);
    J && (J.review = { status: "pending", ...J.review, ...O, updatedAt: Date.now() });
  }), ht = (w) => ue((O) => {
    O.pipeline = { phase: "first_pass", firstPassConfirmed: !1, secondPassMode: "super_resolution_second_pass", ...O.pipeline, ...w };
  }), _e = (w) => {
    (r ?? t)(w), c(JSON.stringify(w));
  }, Re = (w, O, U = !0) => {
    const J = nt(g.current), W = J.assets.find((H) => H.id === w);
    W && (O(W), g.current = J, b(J), U && _e(J));
  }, ut = () => {
    _e(m), ve(f("已保存到工作流", "Saved to workflow"));
  }, St = () => {
    if (de) {
      ve(f("任务执行中，请先停止或等待完成再关闭", "A job is running"), "error");
      return;
    }
    X ? Y(!0) : i();
  }, Ze = (w, O) => {
    const U = URL.createObjectURL(new Blob([JSON.stringify(w, null, 2)], { type: "application/json" })), J = document.createElement("a");
    J.href = U, J.download = O, J.click(), URL.revokeObjectURL(U);
  }, Xt = () => Ze(m, `${an(m.project.name)}.director.json`), Zt = () => {
    try {
      Ze(Kn(m), `${an(m.project.name)}.episode.json`);
    } catch (w) {
      ve(String(w), "error");
    }
  }, $t = () => {
    const w = Jn(m);
    Ze(w, `${an(w.library.name)}.assets.json`);
  }, mt = async (w, O = "auto") => {
    if (!de)
      try {
        const U = JSON.parse(await w.text()), J = U == null ? void 0 : U.format;
        if (O === "assets" || J === "theodore-assets") {
          let W;
          J === "theodore-assets" ? (Ur(U), W = U) : (on(U), W = Jn(_t(U)));
          const H = Zi(m, W);
          b(H.plan), T("assets"), ve(f(`已导入素材库：新增 ${H.added} 项，更新 ${H.updated} 项，沿用 ${H.keptPaths.length} 个已上传文件。分镜保持原样。`, `Library imported: ${H.added} added, ${H.updated} updated, ${H.keptPaths.length} uploaded files kept. Shots preserved.`));
        } else if (O === "episode" || J === "theodore-episode") {
          let W;
          J === "theodore-episode" ? (Sn(U), W = U) : (on(U), W = Kn(_t(U)));
          const H = eo(m, W);
          b(H.plan), v(0), T("shots"), ve(f(`已导入 ${H.plan.shots.length} 个分镜，保留素材库 ${H.keptPaths.length} 个已上传文件${H.missingAssets.length ? `；待补素材：${H.missingAssets.join("、")}` : ""}。点“保存”写入工作流。`, `Imported ${H.plan.shots.length} shots; ${H.keptPaths.length} uploaded assets kept${H.missingAssets.length ? `; missing: ${H.missingAssets.join(", ")}` : ""}. Click Save.`));
        } else {
          on(U);
          const W = Gr(m, U);
          b(W.plan), v(0), T("shots"), ve(f(`已导入 ${W.plan.shots.length} 个镜头，沿用 ${W.keptPaths.length} 个已上传素材。点“保存”写入工作流。`, `Imported ${W.plan.shots.length} shots; kept ${W.keptPaths.length} uploaded assets. Click Save.`));
        }
        ne(!1);
      } catch (U) {
        ve(`${f("导入失败", "Import failed")}：${U instanceof Error ? U.message : String(U)}`, "error");
      }
  }, It = (w) => {
    const O = To(g.current, w);
    return O.length ? (window.alert(`${f("计划未通过校验，请先修正", "Plan validation failed")}：

${O.slice(0, 20).join(`
`)}${O.length > 20 ? `
…` : ""}`), !1) : !0;
  }, gt = (w) => {
    g.current = w, b(w), _e(w);
  }, dt = async (w, O) => {
    var tt;
    if (!l) {
      ve(f("当前环境无法排队（未连接 ComfyUI）", "Queue unavailable"), "error");
      return;
    }
    if (de || !w.length) return;
    const U = g.current, J = po(U, w);
    let W = U.shots.filter((oe) => w.includes(oe.id)).map((oe) => oe.id), H = new Set(O ? W : []);
    if (J.added.length) {
      const oe = J.added.map((be) => {
        var Ue;
        return ((Ue = U.shots.find((Je) => Je.id === be)) == null ? void 0 : Ue.title) ?? be;
      }).join("、");
      window.confirm(f(
        `接力段需要的上一段 latent 不是当前顺序下生成的（插入、删除、禁用或调换过镜头后会这样）。

建议连同上一段一起生成：${oe}

点“确定”一起生成（推荐，上一段会换种子重生）；点“取消”只生成所选镜头，接缝可能不衔接。`,
        `Relay shots would read a latent not written by their current previous shot. Also regenerate: ${oe}?`
      )) && (W = J.shotIds, H = /* @__PURE__ */ new Set([...H, ...J.added]));
    }
    if (!It(W)) return;
    const ae = nt(U);
    for (const oe of H) {
      const Ce = ae.shots.find((be) => be.id === oe);
      Ce && (Ce.seed = Yr());
    }
    ae.pipeline = { phase: "first_pass", firstPassConfirmed: !1, secondPassMode: "super_resolution_second_pass", ...ae.pipeline, latentWriters: ((tt = ae.pipeline) == null ? void 0 : tt.latentWriters) ?? {} };
    const Fe = new Map(W.map((oe) => [oe, Kr(ae, ae.shots.find((Ce) => Ce.id === oe))])), We = new Map(W.map((oe) => [oe, co(ae, oe)])), et = new Set(W.filter((oe) => at(ae, ae.shots.find((Ce) => Ce.id === oe)))), bt = /* @__PURE__ */ new Map();
    gt(ae);
    const Se = new AbortController();
    q.current = Se, N({ kind: "first", total: W.length, done: 0, progress: { value: 0, max: 0 }, message: "" });
    try {
      await l({
        plan: ae,
        shotIds: W,
        signal: Se.signal,
        onProgress: (oe) => N((Ce) => ({ ...Ce, progress: oe })),
        onShotStart: (oe, Ce) => {
          var Ue, Je;
          const be = (Je = (Ue = g.current.pipeline) == null ? void 0 : Ue.latentWriters) == null ? void 0 : Je[String(Gt(ae, oe))];
          bt.set(oe, { at: Date.now() / 1e3, source: (be == null ? void 0 : be.shotId) ?? null, sourceAt: (be == null ? void 0 : be.at) ?? null }), N((Ct) => ({ ...Ct, currentShotId: oe, done: Ce, progress: { value: 0, max: 0 } }));
        },
        onShotDone: (oe, Ce) => {
          var Ct, zn;
          const be = nt(g.current), Ue = Date.now() / 1e3, Je = be.shots.find((Ke) => Ke.id === oe);
          if (Je) {
            const Ke = ((Ct = Je.review) == null ? void 0 : Ct.relayHistory) ?? [], Tn = bt.get(oe);
            Je.review = {
              status: "pending",
              generatedSig: Fe.get(oe),
              updatedAt: Date.now(),
              relayHistory: et.has(oe) && Tn ? [...Ke, Tn].slice(-20) : Ke
            };
          }
          be.pipeline = { phase: "first_pass", firstPassConfirmed: !1, secondPassMode: "super_resolution_second_pass", ...be.pipeline, latentWriters: { ...(zn = be.pipeline) == null ? void 0 : zn.latentWriters, [String(We.get(oe) ?? 0)]: { shotId: oe, at: Ue } } }, gt(be), N((Ke) => ({ ...Ke, done: Ce + 1 })), j((Ke) => Ke + 1);
        }
      }), N({ ...Be, message: f(`一采完成：${W.length} 段。请在“审片”页逐段确认。`, `First pass done: ${W.length} shots.`) }), ve(f(`一采完成 ${W.length} 段`, `First pass done (${W.length})`)), T("review");
    } catch (oe) {
      N({ ...Be, error: gr(oe) ? f("已停止", "Stopped") : String(oe instanceof Error ? oe.message : oe) });
    } finally {
      q.current = null, j((oe) => oe + 1);
    }
  }, Pt = async (w, O) => {
    var et, bt;
    if (!s || de) return;
    const U = ((et = m.pipeline) == null ? void 0 : et.secondPassMode) ?? "super_resolution_second_pass", J = ((bt = m.pipeline) == null ? void 0 : bt.secondPassDenoise) ?? 0.3;
    let W;
    try {
      W = Pa(m, w, re.byShot, U, O);
    } catch (Se) {
      N({ ...Be, error: Se instanceof Error ? Se.message : String(Se) });
      return;
    }
    const { jobs: H, selections: ae } = W;
    if (!H.length) {
      ve(f("没有需要二采的镜头（已全部完成或缺少一采结果）", "Nothing to process"));
      return;
    }
    const Fe = new AbortController();
    q.current = Fe;
    const We = `td_batch_${Date.now().toString(36)}`;
    N({ kind: "second", total: H.length, done: 0, progress: { value: 0, max: 0 }, message: "" });
    try {
      for (const [Se, { shot: tt, sourcePath: oe, skipIfValid: Ce }] of H.entries())
        N((be) => ({ ...be, currentShotId: tt.id, done: Se, progress: { value: 0, max: 0 } })), await s({
          plan: m,
          shotId: tt.id,
          sourcePath: oe,
          requestId: `${We}_${tt.id}`,
          processingMode: U,
          batchId: We,
          sequenceIndex: Se,
          latentRelay: !!tt.latentRelay,
          phase: "second_pass",
          relayVersion: 1,
          sourceSelections: ae,
          skipIfValid: Ce,
          denoise: U === "super_resolution_only" ? void 0 : J,
          signal: Fe.signal,
          onProgress: (be) => N((Ue) => ({ ...Ue, progress: be }))
        }), N((be) => ({ ...be, done: Se + 1 })), j((be) => be + 1);
      ht({ phase: "second_pass", firstPassConfirmed: !0 }), N({ ...Be, message: f(`二采完成：${H.length} 段`, `Second pass done: ${H.length}`) }), ve(f(`二采完成 ${H.length} 段`, `Second pass done (${H.length})`));
    } catch (Se) {
      N({ ...Be, error: gr(Se) ? f("已停止", "Stopped") : String(Se instanceof Error ? Se.message : Se) });
    } finally {
      q.current = null, j((Se) => Se + 1);
    }
  }, A = async (w) => {
    var W;
    if (de) return;
    const O = m.shots.filter((H) => H.enabled), U = [], J = [];
    for (const H of O) {
      const ae = re.byShot[H.id] ?? [], Fe = w ? Hr(H, ae) : void 0, We = Xe(H, Le(ae)), et = w ? Fe != null && Fe.processed ? Fe.item.path : "" : (We == null ? void 0 : We.path) ?? "";
      et ? U.push({ shotId: H.id, activeIndex: Gt(m, H.id), path: et }) : J.push(H.title);
    }
    if (J.length) {
      ve(`${f("以下镜头缺少可合并的结果", "Missing results")}：${J.join("、")}`, "error");
      return;
    }
    N({ kind: "merge", total: 1, done: 0, progress: { value: 0, max: 0 }, message: "" });
    try {
      const H = await fetch("/theodore-director/v1/postprocess/merge", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ projectName: m.project.name, runId: m.project.runId, selections: U }) }), ae = await H.json();
      if (!H.ok) throw new Error(ae.error || `HTTP ${H.status}`);
      N({ ...Be, message: `${f("已合并", "Merged")}：${((W = ae.result) == null ? void 0 : W.path) ?? ""}` }), ve(f("合并完成，可在“后处理 → 合并视频”查看", "Merged; see Post-process → Merge"));
    } catch (H) {
      N({ ...Be, error: String(H instanceof Error ? H.message : H) });
    }
  }, ie = () => {
    var w;
    return (w = q.current) == null ? void 0 : w.abort();
  };
  Ee(() => {
    const w = (O) => {
      if ((O.ctrlKey || O.metaKey) && O.key.toLocaleLowerCase() === "s") {
        O.preventDefault(), O.stopPropagation(), ut();
        return;
      }
      if (O.key !== "Escape" || O.defaultPrevented) return;
      const U = O.target;
      if (U && /^(TEXTAREA|INPUT|SELECT)$/.test(U.tagName)) {
        U.blur();
        return;
      }
      if (k) return;
      if (Z) {
        Y(!1);
        return;
      }
      const J = document.querySelector("#theodore-director-modal .td-post-preview-overlay");
      if (J) {
        J.click();
        return;
      }
      if (R) {
        F(!1);
        return;
      }
      I || St();
    };
    return document.addEventListener("keydown", w, !0), () => document.removeEventListener("keydown", w, !0);
  });
  const se = () => {
    _(nt(m.shots)), F(!0);
  }, ge = () => {
    const w = Number(K);
    if (!Number.isFinite(w) || w <= 0) {
      window.alert(f("统一时长必须大于 0 秒", "The shared duration must be greater than 0 seconds."));
      return;
    }
    _((O) => O.map((U) => ({ ...U, durationSeconds: w })));
  }, $e = () => {
    const w = Number(Q), O = Number(ce);
    if (!Number.isInteger(w) || w < 1 || w > 100) {
      window.alert(f("新增镜头数量必须是 1–100 的整数", "The shot count must be an integer from 1 to 100."));
      return;
    }
    if (!Number.isFinite(O) || O <= 0) {
      window.alert(f("新增镜头时长必须大于 0 秒", "The new-shot duration must be greater than 0 seconds."));
      return;
    }
    _((U) => ii(U, w, O, un, g.current.defaults.secondSamplingMode ?? "off").map((J, W) => W >= U.length ? { ...J, latentRelay: !1 } : J));
  }, he = () => {
    if (L.some((w) => !Number.isFinite(w.durationSeconds) || w.durationSeconds <= 0)) {
      window.alert(f("每个镜头的时长都必须大于 0 秒", "Every shot duration must be greater than 0 seconds."));
      return;
    }
    ue((w) => {
      w.shots = nt(L);
    }), v((w) => Math.min(w, L.length - 1)), F(!1);
  }, fe = m.shots.filter((w) => w.enabled), Te = fe.filter((w) => Le(re.byShot[w.id] ?? []).length).length, ft = fe.filter((w) => {
    var O;
    return ((O = w.review) == null ? void 0 : O.status) === "approved";
  }).length, Pn = fe.reduce((w, O) => w + O.durationSeconds, 0), fi = C.progress.max ? Math.round(C.progress.value / C.progress.max * 100) : 0, Cn = [
    { id: "assets", number: "01", title: f("素材库", "Media library"), description: f("角色 · 场景 · 声音", "Cast · sets · voices"), badge: xe ? String(xe) : void 0 },
    { id: "shots", number: "02", title: f("分镜工作台", "Storyboard"), description: f("写镜头，安排连续性", "Compose each shot") },
    { id: "review", number: "03", title: f("生成与审片", "Generate & review"), description: f("挑选结果，确认成片", "Choose your takes"), badge: `${ft}/${fe.length}` },
    { id: "postprocess", number: "04", title: f("后处理与交付", "Finish & deliver"), description: f("高清处理 · 合并导出", "Enhance · assemble") }
  ], en = Cn.find((w) => w.id === S) ?? { number: "⚙", title: f("导播台配置", "Director settings"), description: f("项目 · 内置控制 · 全局提示词", "Project · built-in controls · global prompts") };
  return /* @__PURE__ */ n("div", { class: `td-shell ${(En = m.uiPreferences) != null && En.compactMode ? "td-compact" : ""}`, lang: x === "zh" ? "zh-CN" : "en", children: [
    /* @__PURE__ */ n("aside", { class: "td-workspace-rail", children: [
      /* @__PURE__ */ n("div", { class: "td-rail-brand", children: [
        /* @__PURE__ */ n("span", { class: "td-brand-mark", children: "YQ" }),
        /* @__PURE__ */ n("div", { children: [
          /* @__PURE__ */ n("h1", { children: Wn(x, "title") }),
          /* @__PURE__ */ n("small", { children: "MINIMAX H3 · STUDIO" })
        ] })
      ] }),
      /* @__PURE__ */ n("button", { class: "td-project-home", onClick: () => T("settings"), title: m.project.name, children: [
        /* @__PURE__ */ n("small", { children: f("当前项目", "CURRENT PROJECT") }),
        /* @__PURE__ */ n("strong", { children: m.project.name }),
        /* @__PURE__ */ n("span", { children: m.project.runId })
      ] }),
      /* @__PURE__ */ n("nav", { class: "td-stage-nav", "aria-label": f("制作阶段", "Production stages"), children: Cn.map((w) => /* @__PURE__ */ n("button", { class: S === w.id ? "active" : "", "aria-label": w.title, title: w.title, "aria-current": S === w.id ? "page" : void 0, onClick: () => T(w.id), children: [
        /* @__PURE__ */ n("span", { class: "td-stage-number", children: w.number }),
        /* @__PURE__ */ n("span", { children: [
          /* @__PURE__ */ n("strong", { children: w.title }),
          /* @__PURE__ */ n("small", { children: w.description })
        ] }),
        w.badge && /* @__PURE__ */ n("em", { class: w.id === "assets" ? "warn" : "", children: w.badge })
      ] }, w.id)) }),
      /* @__PURE__ */ n("div", { class: "td-rail-progress", children: [
        /* @__PURE__ */ n("div", { children: [
          /* @__PURE__ */ n("span", { children: f("本集进度", "EPISODE PROGRESS") }),
          /* @__PURE__ */ n("strong", { children: [
            ft,
            "/",
            fe.length
          ] })
        ] }),
        /* @__PURE__ */ n("progress", { max: Math.max(1, fe.length), value: ft }),
        /* @__PURE__ */ n("p", { children: f(`已生成 ${Te} 段 · ${Ft(Pn)}`, `${Te} generated · ${Ft(Pn)}`) }),
        /* @__PURE__ */ n("button", { onClick: () => T(xe ? "assets" : "review"), children: xe ? f(`补齐 ${xe} 个素材`, `Fill ${xe} media files`) : f("查看审片进度 →", "Review progress →") })
      ] }),
      /* @__PURE__ */ n("button", { class: `td-config-entry ${S === "settings" ? "active" : ""}`, "aria-label": f("导播台配置", "Director settings"), title: f("导播台配置", "Director settings"), "aria-current": S === "settings" ? "page" : void 0, onClick: () => T("settings"), children: [
        /* @__PURE__ */ n("span", { children: "⚙" }),
        /* @__PURE__ */ n("strong", { children: f("导播台配置", "Director settings") })
      ] })
    ] }),
    /* @__PURE__ */ n("header", { class: "td-topbar", children: [
      /* @__PURE__ */ n("div", { class: "td-workspace-title", children: [
        /* @__PURE__ */ n("span", { class: "td-eyebrow", children: [
          f("制作空间", "PRODUCTION SPACE"),
          " / ",
          en.number
        ] }),
        /* @__PURE__ */ n("div", { children: [
          /* @__PURE__ */ n("h2", { children: en.title }),
          X ? /* @__PURE__ */ n("span", { class: "td-chip warn", children: f("未保存", "Unsaved") }) : /* @__PURE__ */ n("span", { class: "td-chip", children: f("已保存", "Saved") })
        ] })
      ] }),
      /* @__PURE__ */ n("div", { class: "td-actions", children: [
        /* @__PURE__ */ n("details", { class: "td-project-menu", children: [
          /* @__PURE__ */ n("summary", { children: [
            f("导入 / 导出", "Import / export"),
            " ",
            /* @__PURE__ */ n("span", { children: "⌄" })
          ] }),
          /* @__PURE__ */ n("div", { class: "td-project-menu-items", children: [
            /* @__PURE__ */ n("label", { class: "td-button", title: f("只更新本集分镜与提示词，保留整个素材库", "Import episode shots and preserve the media library"), children: [
              f("导入分镜", "Import shots"),
              /* @__PURE__ */ n("input", { type: "file", accept: "application/json,.json", disabled: de, onChange: (w) => {
                var J;
                const O = w.currentTarget, U = (J = O.files) == null ? void 0 : J[0];
                O.value = "", U && mt(U, "episode");
              } })
            ] }),
            /* @__PURE__ */ n("button", { onClick: Zt, children: f("导出分镜", "Export shots") }),
            /* @__PURE__ */ n("label", { class: "td-button", title: f("导入 skill 生成的 .director.json；同名素材会沿用已上传文件", "Import a .director.json"), children: [
              f("导入计划", "Import"),
              /* @__PURE__ */ n("input", { type: "file", accept: "application/json,.json", disabled: de, onChange: (w) => {
                var J;
                const O = w.currentTarget, U = (J = O.files) == null ? void 0 : J[0];
                O.value = "", U && mt(U);
              } })
            ] }),
            /* @__PURE__ */ n("button", { onClick: Xt, children: f("导出计划", "Export") })
          ] })
        ] }),
        /* @__PURE__ */ n("button", { class: "td-lang", title: f("切换语言", "Language"), onClick: () => Oe(x === "zh" ? "en" : "zh"), children: x === "zh" ? "EN" : "中文" }),
        /* @__PURE__ */ n("button", { class: "primary", title: "Ctrl+S", onClick: ut, children: f("保存项目", "Save project") }),
        /* @__PURE__ */ n("button", { onClick: St, children: Wn(x, "close") })
      ] })
    ] }),
    /* @__PURE__ */ n("section", { class: "td-session-bar", "aria-label": f("生成状态", "Generation status"), children: [
      /* @__PURE__ */ n("span", { class: "td-session-context", children: S === "shots" ? f("编辑镜头 → 右侧监看 → 底部切换分镜", "Compose → monitor → switch shots below") : en.description }),
      /* @__PURE__ */ n("div", { class: "td-tab-status", "aria-live": "polite", children: [
        de ? /* @__PURE__ */ n("span", { class: "td-run-pill", children: [
          /* @__PURE__ */ n("i", {}),
          C.kind === "first" ? f("一采", "1st pass") : C.kind === "second" ? f("二采", "2nd pass") : C.kind === "image" ? f("生图", "Image") : f("合并", "Merge"),
          " ",
          C.done,
          "/",
          C.total,
          C.kind !== "merge" && C.progress.max ? ` · ${fi}%` : "",
          /* @__PURE__ */ n("button", { onClick: ie, children: f("停止", "Stop") })
        ] }) : /* @__PURE__ */ n("span", { class: "td-progress-text", children: f(`一采 ${Te}/${fe.length} · 通过 ${ft}/${fe.length}`, `Generated ${Te}/${fe.length} · Approved ${ft}/${fe.length}`) }),
        S !== "settings" && !de && !re.loading && l && Te < fe.length && /* @__PURE__ */ n("button", { class: "primary", onClick: () => void dt(fe.filter((w) => !Le(re.byShot[w.id] ?? []).length).map((w) => w.id), !1), children: f(`开始一采（${fe.length - Te} 段）`, `Start first pass (${fe.length - Te})`) })
      ] })
    ] }),
    /* @__PURE__ */ n("main", { children: [
      S === "shots" && /* @__PURE__ */ n(Qo, { plan: m, language: x, selected: y, setSelected: v, mutate: ue, setReview: st, results: re, supportsSecondSampling: o, running: de, runningShotId: C.kind === "first" ? C.currentShotId : void 0, onRegenerate: (w) => void dt(w, !0), onOpenBatch: se, notify: ve }),
      S === "assets" && /* @__PURE__ */ n(Ti, { plan: m, language: x, mutate: ue, uploadAsset: mr, importingDisabled: de || !!k || M, onImportLibrary: (w) => void mt(w, "assets"), onExportLibrary: $t, onOpenBatch: () => ne(!0), onGenerateImage: a ? D : void 0, onBatchGenerateImages: a ? () => {
        const w = qt(g.current.assets)[0];
        if (!w) {
          ve(f("请先添加已启用且填写了生图提示词的图片素材。", "Add enabled image assets with generation prompts first."), "error");
          return;
        }
        D(w), V(!0);
      } : void 0, notify: ve }),
      S === "review" && /* @__PURE__ */ n(Ao, { plan: m, language: x, results: re, run: C, supportsSecondPass: !!s, setReview: st, setPipeline: ht, onRunFirstPass: (w, O) => void dt(w, O), onRunSecondPass: (w, O) => void Pt(w, O), onMerge: (w) => void A(w), onStop: ie, onRefresh: () => j((w) => w + 1), onOpenShot: (w) => {
        v(Math.max(0, m.shots.findIndex((O) => O.id === w))), T("shots");
      } }),
      /* @__PURE__ */ n("section", { hidden: S !== "settings", children: /* @__PURE__ */ n(va, { plan: m, language: x, busy: de, builtInControls: d, mutate: ue, onDuration: (w) => {
        ee(w), z(w);
      }, children: /* @__PURE__ */ n(Ea, { language: x, projectName: m.project.name, runId: m.project.runId, busy: de, onClearShots: async (w) => {
        w && await ga(m.project.name, m.project.runId), ue((O) => {
          O.shots = Mo(O.defaults.durationSeconds ?? 6, un, O.defaults.secondSamplingMode ?? "off");
        }), v(0), _([]), j((O) => O + 1);
      }, onClearAssets: () => {
        ue((w) => {
          const O = zo(w);
          w.assets = O.assets, w.shots = O.shots;
        });
      }, onProjectCleared: () => j((w) => w + 1) }) }) }),
      S === "postprocess" && /* @__PURE__ */ n(Co, { plan: m, language: x, queueSecondPass: s })
    ] }),
    R && /* @__PURE__ */ n("div", { class: "td-batch-overlay", role: "presentation", children: /* @__PURE__ */ n("section", { class: "td-batch-panel", role: "dialog", "aria-modal": "true", "aria-label": f("批量编辑镜头", "Batch edit shots"), children: [
      /* @__PURE__ */ n("header", { class: "td-batch-header", children: [
        /* @__PURE__ */ n("div", { children: [
          /* @__PURE__ */ n("h2", { children: f("批量编辑镜头", "Batch edit shots") }),
          /* @__PURE__ */ n("p", { children: f(`当前共 ${L.length} 个镜头`, `${L.length} shots`) })
        ] }),
        /* @__PURE__ */ n("button", { "aria-label": f("关闭", "Close"), onClick: () => F(!1), children: "×" })
      ] }),
      /* @__PURE__ */ n("div", { class: "td-batch-tools", children: [
        /* @__PURE__ */ n("div", { children: [
          /* @__PURE__ */ n("label", { children: [
            f("所有镜头时长", "Duration for all shots"),
            /* @__PURE__ */ n("span", { children: [
              /* @__PURE__ */ n("input", { type: "number", min: "0.1", step: "0.1", value: K, onInput: (w) => ee(w.currentTarget.value) }),
              /* @__PURE__ */ n("em", { children: f("秒", "sec") })
            ] })
          ] }),
          /* @__PURE__ */ n("button", { onClick: ge, children: f("一键设置所有时长", "Set all durations") })
        ] }),
        /* @__PURE__ */ n("div", { children: [
          /* @__PURE__ */ n("label", { children: [
            f("新增镜头数量", "New shot count"),
            /* @__PURE__ */ n("input", { type: "number", min: "1", max: "100", step: "1", value: Q, onInput: (w) => te(w.currentTarget.value) })
          ] }),
          /* @__PURE__ */ n("label", { children: [
            f("每个镜头时长", "Duration per shot"),
            /* @__PURE__ */ n("span", { children: [
              /* @__PURE__ */ n("input", { type: "number", min: "0.1", step: "0.1", value: ce, onInput: (w) => z(w.currentTarget.value) }),
              /* @__PURE__ */ n("em", { children: f("秒", "sec") })
            ] })
          ] }),
          /* @__PURE__ */ n("button", { onClick: $e, children: f("批量新增镜头", "Add shots") })
        ] })
      ] }),
      /* @__PURE__ */ n("div", { class: "td-batch-global-actions", children: [
        /* @__PURE__ */ n("span", { children: f(`已启用 ${L.filter((w) => w.enabled).length}/${L.length} 个镜头`, `${L.filter((w) => w.enabled).length}/${L.length} shots enabled`) }),
        /* @__PURE__ */ n("button", { class: le ? "active" : "", onClick: () => _((w) => w.map((O) => ({ ...O, enabled: !le }))), children: le ? f("全部禁用", "Disable all") : f("全部启用", "Enable all") })
      ] }),
      /* @__PURE__ */ n("div", { class: "td-batch-table", children: [
        /* @__PURE__ */ n("div", { class: "td-batch-row td-batch-table-head", children: [
          /* @__PURE__ */ n("span", { children: "#" }),
          /* @__PURE__ */ n("span", { children: f("镜头名", "Shot name") }),
          /* @__PURE__ */ n("span", { children: f("启用", "Enabled") }),
          /* @__PURE__ */ n("span", { children: f("具体时长", "Duration") }),
          /* @__PURE__ */ n("span", { children: f("接力上一段", "Relay") })
        ] }),
        L.map((w, O) => /* @__PURE__ */ n("div", { class: "td-batch-row", children: [
          /* @__PURE__ */ n("span", { children: O + 1 }),
          /* @__PURE__ */ n("input", { value: w.title, "aria-label": `${f("镜头名", "Shot name")} ${O + 1}`, onInput: (U) => _((J) => J.map((W, H) => H === O ? { ...W, title: U.currentTarget.value } : W)) }),
          /* @__PURE__ */ n("label", { class: "td-batch-enabled", children: [
            /* @__PURE__ */ n("input", { type: "checkbox", checked: w.enabled, onChange: (U) => _((J) => J.map((W, H) => H === O ? { ...W, enabled: U.currentTarget.checked } : W)) }),
            /* @__PURE__ */ n("span", { children: w.enabled ? f("开", "ON") : f("关", "OFF") })
          ] }),
          /* @__PURE__ */ n("label", { class: "td-batch-duration", children: [
            /* @__PURE__ */ n("input", { type: "number", min: "0.1", step: "0.1", value: w.durationSeconds, onInput: (U) => _((J) => J.map((W, H) => H === O ? { ...W, durationSeconds: Number(U.currentTarget.value) } : W)) }),
            /* @__PURE__ */ n("span", { children: f("秒", "sec") })
          ] }),
          /* @__PURE__ */ n("label", { class: "td-batch-relay", children: [
            /* @__PURE__ */ n("input", { type: "checkbox", checked: w.latentRelay, onChange: (U) => _((J) => J.map((W, H) => H === O ? { ...W, latentRelay: U.currentTarget.checked } : W)) }),
            /* @__PURE__ */ n("span", { children: w.latentRelay ? f("开", "ON") : f("关", "OFF") })
          ] })
        ] }, w.id))
      ] }),
      /* @__PURE__ */ n("footer", { children: [
        /* @__PURE__ */ n("button", { onClick: () => F(!1), children: f("取消", "Cancel") }),
        /* @__PURE__ */ n("button", { class: "primary", onClick: he, children: f("应用更改", "Apply changes") })
      ] })
    ] }) }),
    I && /* @__PURE__ */ n(Hi, { language: x, assets: m.assets, projectName: m.project.name, uploadFile: mr, onImported: (w) => ue((O) => {
      O.assets.push(...w);
    }), onFilled: (w, O, U) => ue((J) => {
      const W = J.assets.find((H) => H.id === w);
      W && Object.assign(W, Oi(W, O, U));
    }), onClose: () => ne(!1) }),
    k && a && /* @__PURE__ */ n(
      ua,
      {
        asset: m.assets.find((w) => w.id === k.id) ?? k,
        batchAssets: M ? m.assets : void 0,
        projectName: m.project.name,
        language: x,
        defaults: a.defaults,
        queue: a.queue,
        recover: a.recover,
        running: C.kind === "image",
        progress: C.progress,
        register: a.register,
        onPending: (w, O) => Re(w, (U) => {
          O ? U.imageGenerationPending = O : delete U.imageGenerationPending;
        }),
        onRecord: (w, O) => Re(w, (U) => {
          U.imageGeneration && U.imageGeneration.promptId !== O.promptId && (U.imageGenerationHistory = [...U.imageGenerationHistory ?? [], U.imageGeneration].slice(-20)), U.imageGeneration = O;
        }),
        onPromptChange: (w, O) => Re(w, (U) => {
          U.genPrompt = O;
        }),
        onStart: (w) => {
          q.current = w, N({ kind: "image", total: 1, done: 0, progress: { value: 0, max: 0 }, message: "" });
        },
        onProgress: (w) => N((O) => ({ ...O, progress: w })),
        onFinish: (w) => {
          q.current === w && (q.current = null), N((O) => O.kind === "image" ? { ...Be } : O);
        },
        onApply: async (w, O, U, J) => {
          const W = g.current.assets.find((ae) => ae.id === w);
          Re(w, (ae) => {
            ae.path = O, ae.genPrompt = U, ae.fingerprint = "", ae.imageGeneration = J, delete ae.imageGenerationPending, delete ae.imageGenerationHistory;
          });
          const H = W ? ma(g.current, [], { assetId: w, oldPath: W.path, oldGeneration: W.imageGeneration, oldGenerations: W.imageGenerationHistory }) : { candidates: [], keep: [] };
          try {
            const ae = await fa(m.project.name, H);
            ae.deleted.length ? ve(f(`已替换素材并清理 ${ae.deleted.length} 个旧资源`, `Replaced asset and removed ${ae.deleted.length} old resources`)) : ve(f("已将生图绑定到当前素材", "Generated image assigned to the asset"));
          } catch (ae) {
            ve(`${f("新图已绑定，但旧资源清理失败", "New image assigned, but old-resource cleanup failed")}：${ae instanceof Error ? ae.message : String(ae)}`, "error");
          }
        },
        onCreateAsset: (w, O, U, J, W) => {
          const H = nt(g.current);
          H.assets.push(la(w, O, U, H.assets, W)), g.current = H, b(H), _e(H), ve(f("已登记为新素材", "Generated image added as a new asset"));
        },
        onStop: ie,
        onClose: () => {
          C.kind !== "image" && (D(null), V(!1));
        }
      },
      M ? "batch-images" : k.id
    ),
    Z && /* @__PURE__ */ n("div", { class: "td-batch-overlay", role: "presentation", children: /* @__PURE__ */ n("section", { class: "td-confirm", role: "dialog", "aria-modal": "true", children: [
      /* @__PURE__ */ n("h2", { children: f("有未保存的修改", "Unsaved changes") }),
      /* @__PURE__ */ n("p", { children: f("关闭前要把修改保存到工作流吗？", "Save changes to the workflow before closing?") }),
      /* @__PURE__ */ n("footer", { children: [
        /* @__PURE__ */ n("button", { onClick: () => Y(!1), children: f("取消", "Cancel") }),
        /* @__PURE__ */ n("button", { class: "danger", onClick: () => {
          Y(!1), i();
        }, children: f("不保存，直接关闭", "Discard") }),
        /* @__PURE__ */ n("button", { class: "primary", onClick: () => {
          _e(m), Y(!1), i();
        }, children: f("保存并关闭", "Save & close") })
      ] })
    ] }) }),
    /* @__PURE__ */ n("div", { class: "td-toasts", "aria-live": "polite", children: E.map((w) => /* @__PURE__ */ n("div", { class: `td-toast ${w.tone}`, children: w.message }, w.id)) })
  ] });
}
function Ta(e, t, r = !1, i, o, s, l, a = !1) {
  const d = document.getElementById("theodore-director-modal");
  if (d) {
    d.focus();
    return;
  }
  const p = document.createElement("div");
  p.id = "theodore-director-modal", p.className = "td-modal", p.tabIndex = -1, document.body.append(p);
  const m = () => {
    Rn(null, p), p.remove();
  };
  p.addEventListener("keydown", (b) => b.stopPropagation()), Rn(/* @__PURE__ */ n(za, { initial: e, onSave: t, onPersist: s, onClose: m, supportsSecondSampling: r, queueSecondPass: i, queueFirstPass: o, imageGeneration: l, builtInControls: a }), p), p.focus();
}
const vt = ["22", "5", "39", "56"];
function zt(e) {
  var i, o, s, l, a;
  const t = e._nodes ?? e.nodes ?? [], r = new Map(t.map((d) => [String(d.id), d]));
  for (const d of t) {
    if (d.type !== "TheodoreDirector_ShotControl") continue;
    const p = (i = d.outputs) == null ? void 0 : i.find((m) => m.name === "video_context");
    p && (p.type = [...vt]);
  }
  for (const d of Object.values(e.links ?? {})) {
    const [p, m, b, h] = Array.isArray(d) ? d.slice(1, 5) : [d.origin_id, d.origin_slot, d.target_id, d.target_slot], c = r.get(String(p)), g = r.get(String(b));
    (c == null ? void 0 : c.type) !== "TheodoreDirector_ShotControl" || ((s = (o = c.outputs) == null ? void 0 : o[m]) == null ? void 0 : s.name) !== "video_context" || (g == null ? void 0 : g.type) !== "MiniMaxH3MotionContext" || ((a = (l = g.inputs) == null ? void 0 : l[h]) == null ? void 0 : a.name) !== "context_length" || (g.inputs[h].type = [...vt], Array.isArray(d) ? d[5] = [...vt] : d.type = [...vt]);
  }
}
function Aa(e) {
  var r;
  let t = e;
  for (const [i, o] of Object.entries(e)) {
    const s = o.inputs.context_length;
    if (o.class_type !== "MiniMaxH3MotionContext" || !Array.isArray(s) || s.length !== 2 || s[1] !== 13) continue;
    const l = e[String(s[0])];
    if ((l == null ? void 0 : l.class_type) !== "TheodoreDirector_ShotControl") continue;
    const a = l.inputs.plan;
    if (!Array.isArray(a) || a.length !== 2 || a[1] !== 0) continue;
    const d = e[String(a[0])];
    if ((d == null ? void 0 : d.class_type) !== "TheodoreDirector_Project") continue;
    let p;
    try {
      p = JSON.parse(String(d.inputs.plan_json));
    } catch {
      throw new Error("镜头接力配置无法读取：请先保存导播台项目");
    }
    const m = ((r = p == null ? void 0 : p.continuity) == null ? void 0 : r.videoContextFrames) ?? 22;
    if (typeof m != "number" || !Number.isInteger(m) || !vt.includes(String(m)))
      throw new Error("视频接力帧数只能为 5、22、39 或 56");
    t === e && (t = { ...e }), t[i] = { ...o, inputs: { ...o.inputs, context_length: String(m) } };
  }
  return t;
}
const ja = `{\r
  "last_node_id": 651,\r
  "last_link_id": 19,\r
  "nodes": [\r
    {\r
      "id": 600,\r
      "type": "UNETLoader",\r
      "pos": [\r
        260,\r
        1060\r
      ],\r
      "size": [\r
        510,\r
        90\r
      ],\r
      "flags": {},\r
      "order": 0,\r
      "mode": 0,\r
      "inputs": [\r
        {\r
          "localized_name": "UNet名称",\r
          "name": "unet_name",\r
          "type": "COMBO",\r
          "widget": {\r
            "name": "unet_name"\r
          },\r
          "link": null\r
        }\r
      ],\r
      "outputs": [\r
        {\r
          "localized_name": "模型",\r
          "name": "MODEL",\r
          "type": "MODEL",\r
          "links": [\r
            11\r
          ]\r
        }\r
      ],\r
      "properties": {\r
        "Node name for S&R": "UNETLoader",\r
        "models": [\r
          {\r
            "name": "qwen_image_2.1_turbo_int8_convrot.safetensors",\r
            "url": "https://huggingface.co/Comfy-Org/Qwen-Image-2.1/resolve/main/diffusion_models/qwen_image_2.1_turbo_int8_convrot.safetensors",\r
            "directory": "diffusion_models"\r
          }\r
        ]\r
      },\r
      "widgets_values": [\r
        "qwen_image_2.1_turbo_int8_convrot.safetensors",\r
        "default"\r
      ],\r
      "widgets_values_named": {\r
        "unet_name": "qwen_image_2.1_turbo_int8_convrot.safetensors",\r
        "weight_dtype": "default"\r
      }\r
    },\r
    {\r
      "id": 601,\r
      "type": "TextEncodeQwenImage21",\r
      "pos": [\r
        852,\r
        1237\r
      ],\r
      "size": [\r
        355.7457007437866,\r
        216\r
      ],\r
      "flags": {},\r
      "order": 13,\r
      "mode": 0,\r
      "inputs": [\r
        {\r
          "localized_name": "clip",\r
          "name": "clip",\r
          "type": "CLIP",\r
          "link": 1\r
        },\r
        {\r
          "localized_name": "image_1",\r
          "name": "images.image_1",\r
          "shape": 7,\r
          "type": "IMAGE",\r
          "link": null\r
        },\r
        {\r
          "localized_name": "vae",\r
          "name": "vae",\r
          "shape": 7,\r
          "type": "VAE",\r
          "link": null\r
        },\r
        {\r
          "localized_name": "prompt",\r
          "name": "prompt",\r
          "type": "STRING",\r
          "widget": {\r
            "name": "prompt"\r
          },\r
          "link": 3\r
        },\r
        {\r
          "localized_name": "negative_prompt",\r
          "name": "negative_prompt",\r
          "type": "STRING",\r
          "widget": {\r
            "name": "negative_prompt"\r
          },\r
          "link": null\r
        }\r
      ],\r
      "outputs": [\r
        {\r
          "localized_name": "positive",\r
          "name": "positive",\r
          "type": "CONDITIONING",\r
          "links": [\r
            12\r
          ]\r
        },\r
        {\r
          "localized_name": "negative",\r
          "name": "negative",\r
          "type": "CONDITIONING",\r
          "links": [\r
            13\r
          ]\r
        },\r
        {\r
          "localized_name": "latent",\r
          "name": "latent",\r
          "type": "LATENT",\r
          "links": null\r
        }\r
      ],\r
      "properties": {\r
        "Node name for S&R": "TextEncodeQwenImage21"\r
      },\r
      "widgets_values": [\r
        "",\r
        "",\r
        1024,\r
        [\r
          false,\r
          true\r
        ],\r
        [\r
          false,\r
          true\r
        ]\r
      ],\r
      "widgets_values_named": {\r
        "prompt": "",\r
        "negative_prompt": "",\r
        "resolution": 1024,\r
        "speak_and_recognation": [\r
          false,\r
          true\r
        ],\r
        "speak_and_recognation#1": [\r
          false,\r
          true\r
        ]\r
      }\r
    },\r
    {\r
      "id": 602,\r
      "type": "CLIPLoader",\r
      "pos": [\r
        260,\r
        1220\r
      ],\r
      "size": [\r
        510,\r
        120\r
      ],\r
      "flags": {},\r
      "order": 1,\r
      "mode": 0,\r
      "inputs": [\r
        {\r
          "localized_name": "CLIP名称",\r
          "name": "clip_name",\r
          "type": "COMBO",\r
          "widget": {\r
            "name": "clip_name"\r
          },\r
          "link": null\r
        }\r
      ],\r
      "outputs": [\r
        {\r
          "localized_name": "CLIP",\r
          "name": "CLIP",\r
          "type": "CLIP",\r
          "links": [\r
            1\r
          ]\r
        }\r
      ],\r
      "properties": {\r
        "Node name for S&R": "CLIPLoader",\r
        "models": [\r
          {\r
            "name": "qwen3vl_8b_int8_convrot.safetensors",\r
            "url": "https://huggingface.co/Comfy-Org/Qwen-Image-2.1/resolve/main/text_encoders/qwen3vl_8b_int8_convrot.safetensors",\r
            "directory": "text_encoders"\r
          }\r
        ]\r
      },\r
      "widgets_values": [\r
        "qwen3vl/qwen3vl_8b_fp8_scaled.safetensors",\r
        "qwen_image",\r
        "default"\r
      ],\r
      "widgets_values_named": {\r
        "clip_name": "qwen3vl/qwen3vl_8b_fp8_scaled.safetensors",\r
        "type": "qwen_image",\r
        "device": "default"\r
      }\r
    },\r
    {\r
      "id": 603,\r
      "type": "VAELoader",\r
      "pos": [\r
        260,\r
        1420\r
      ],\r
      "size": [\r
        510,\r
        70\r
      ],\r
      "flags": {},\r
      "order": 2,\r
      "mode": 0,\r
      "inputs": [\r
        {\r
          "localized_name": "vae名称",\r
          "name": "vae_name",\r
          "type": "COMBO",\r
          "widget": {\r
            "name": "vae_name"\r
          },\r
          "link": null\r
        }\r
      ],\r
      "outputs": [\r
        {\r
          "localized_name": "VAE",\r
          "name": "VAE",\r
          "type": "VAE",\r
          "links": [\r
            2\r
          ]\r
        }\r
      ],\r
      "properties": {\r
        "Node name for S&R": "VAELoader",\r
        "models": [\r
          {\r
            "name": "qwen_image_2.1_vae_bf16.safetensors",\r
            "url": "https://huggingface.co/Comfy-Org/Qwen-Image-2.1/resolve/main/vae/qwen_image_2.1_vae_bf16.safetensors",\r
            "directory": "vae"\r
          }\r
        ]\r
      },\r
      "widgets_values": [\r
        "qwen_image_2.1_vae_bf16.safetensors"\r
      ],\r
      "widgets_values_named": {\r
        "vae_name": "qwen_image_2.1_vae_bf16.safetensors"\r
      }\r
    },\r
    {\r
      "id": 604,\r
      "type": "EmptyLatentImage",\r
      "pos": [\r
        380,\r
        1660\r
      ],\r
      "size": [\r
        300,\r
        120\r
      ],\r
      "flags": {},\r
      "order": 3,\r
      "mode": 0,\r
      "inputs": [\r
        {\r
          "localized_name": "宽度",\r
          "name": "width",\r
          "type": "INT",\r
          "widget": {\r
            "name": "width"\r
          },\r
          "link": null\r
        },\r
        {\r
          "localized_name": "高度",\r
          "name": "height",\r
          "type": "INT",\r
          "widget": {\r
            "name": "height"\r
          },\r
          "link": null\r
        }\r
      ],\r
      "outputs": [\r
        {\r
          "localized_name": "Latent",\r
          "name": "LATENT",\r
          "type": "LATENT",\r
          "links": [\r
            14\r
          ]\r
        }\r
      ],\r
      "properties": {\r
        "Node name for S&R": "EmptyLatentImage"\r
      },\r
      "widgets_values": [\r
        1024,\r
        1024,\r
        1\r
      ],\r
      "widgets_values_named": {\r
        "width": 1024,\r
        "height": 1024,\r
        "batch_size": 1\r
      }\r
    },\r
    {\r
      "id": 605,\r
      "type": "VAEDecode",\r
      "pos": [\r
        2070,\r
        1310\r
      ],\r
      "size": [\r
        230,\r
        60\r
      ],\r
      "flags": {},\r
      "order": 16,\r
      "mode": 0,\r
      "inputs": [\r
        {\r
          "localized_name": "Latent",\r
          "name": "samples",\r
          "type": "LATENT",\r
          "link": 10\r
        },\r
        {\r
          "localized_name": "vae",\r
          "name": "vae",\r
          "type": "VAE",\r
          "link": 2\r
        }\r
      ],\r
      "outputs": [\r
        {\r
          "localized_name": "图像",\r
          "name": "IMAGE",\r
          "type": "IMAGE",\r
          "links": [\r
            19\r
          ]\r
        }\r
      ],\r
      "properties": {\r
        "Node name for S&R": "VAEDecode"\r
      }\r
    },\r
    {\r
      "id": 606,\r
      "type": "TextGenerate",\r
      "pos": [\r
        920,\r
        230\r
      ],\r
      "size": [\r
        400,\r
        461\r
      ],\r
      "flags": {},\r
      "order": 10,\r
      "mode": 0,\r
      "showAdvanced": true,\r
      "inputs": [\r
        {\r
          "localized_name": "clip",\r
          "name": "clip",\r
          "type": "CLIP",\r
          "link": 15\r
        },\r
        {\r
          "localized_name": "图像",\r
          "name": "image",\r
          "shape": 7,\r
          "type": "IMAGE",\r
          "link": null\r
        },\r
        {\r
          "localized_name": "视频",\r
          "name": "video",\r
          "shape": 7,\r
          "type": "IMAGE",\r
          "link": null\r
        },\r
        {\r
          "localized_name": "音频",\r
          "name": "audio",\r
          "shape": 7,\r
          "type": "AUDIO",\r
          "link": null\r
        },\r
        {\r
          "localized_name": "系统提示词",\r
          "name": "system_prompt",\r
          "shape": 7,\r
          "type": "STRING",\r
          "link": 16\r
        },\r
        {\r
          "localized_name": "提示词",\r
          "name": "prompt",\r
          "type": "STRING",\r
          "widget": {\r
            "name": "prompt"\r
          },\r
          "link": 18\r
        },\r
        {\r
          "localized_name": "最大长度",\r
          "name": "max_length",\r
          "type": "INT",\r
          "widget": {\r
            "name": "max_length"\r
          },\r
          "link": null\r
        },\r
        {\r
          "localized_name": "种子",\r
          "name": "sampling_mode.seed",\r
          "type": "INT",\r
          "widget": {\r
            "name": "sampling_mode.seed"\r
          },\r
          "link": null\r
        },\r
        {\r
          "localized_name": "思考模式",\r
          "name": "thinking",\r
          "shape": 7,\r
          "type": "BOOLEAN",\r
          "widget": {\r
            "name": "thinking"\r
          },\r
          "link": null\r
        }\r
      ],\r
      "outputs": [\r
        {\r
          "localized_name": "生成文本",\r
          "name": "generated_text",\r
          "type": "STRING",\r
          "links": [\r
            4\r
          ]\r
        },\r
        {\r
          "localized_name": "思考",\r
          "name": "thinking",\r
          "type": "STRING",\r
          "links": null\r
        }\r
      ],\r
      "properties": {\r
        "Node name for S&R": "TextGenerate"\r
      },\r
      "widgets_values": [\r
        "",\r
        4096,\r
        "on",\r
        1,\r
        20,\r
        0.95,\r
        0,\r
        1,\r
        447606998181262,\r
        1.5,\r
        false,\r
        true,\r
        "auto",\r
        [\r
          false,\r
          true\r
        ]\r
      ],\r
      "widgets_values_named": {\r
        "prompt": "",\r
        "max_length": 4096,\r
        "sampling_mode": "on",\r
        "sampling_mode.temperature": 1,\r
        "sampling_mode.top_k": 20,\r
        "sampling_mode.top_p": 0.95,\r
        "sampling_mode.min_p": 0,\r
        "sampling_mode.repetition_penalty": 1,\r
        "sampling_mode.seed": 447606998181262,\r
        "sampling_mode.presence_penalty": 1.5,\r
        "thinking": false,\r
        "use_default_template": true,\r
        "mtp": "auto",\r
        "speak_and_recognation": [\r
          false,\r
          true\r
        ]\r
      }\r
    },\r
    {\r
      "id": 607,\r
      "type": "CLIPLoader",\r
      "pos": [\r
        270,\r
        230\r
      ],\r
      "size": [\r
        530,\r
        120\r
      ],\r
      "flags": {},\r
      "order": 4,\r
      "mode": 0,\r
      "inputs": [\r
        {\r
          "localized_name": "CLIP名称",\r
          "name": "clip_name",\r
          "type": "COMBO",\r
          "widget": {\r
            "name": "clip_name"\r
          },\r
          "link": null\r
        }\r
      ],\r
      "outputs": [\r
        {\r
          "localized_name": "CLIP",\r
          "name": "CLIP",\r
          "type": "CLIP",\r
          "links": [\r
            15\r
          ]\r
        }\r
      ],\r
      "properties": {\r
        "Node name for S&R": "CLIPLoader",\r
        "models": [\r
          {\r
            "name": "qwen3.5_9b_qwen_image_2.1_pe_t2i.int8_convrot.safetensors",\r
            "url": "https://huggingface.co/Comfy-Org/Qwen-Image-2.1/resolve/main/text_encoders/qwen3.5_9b_qwen_image_2.1_pe_t2i.int8_convrot.safetensors",\r
            "directory": "text_encoders"\r
          }\r
        ]\r
      },\r
      "widgets_values": [\r
        "qwen3.5_9b_qwen_image_2.1_pe_i2i.int8_convrot.safetensors",\r
        "stable_diffusion",\r
        "default"\r
      ],\r
      "widgets_values_named": {\r
        "clip_name": "qwen3.5_9b_qwen_image_2.1_pe_i2i.int8_convrot.safetensors",\r
        "type": "stable_diffusion",\r
        "device": "default"\r
      }\r
    },\r
    {\r
      "id": 608,\r
      "type": "ComfySwitchNode",\r
      "pos": [\r
        1440,\r
        230\r
      ],\r
      "size": [\r
        270,\r
        80\r
      ],\r
      "flags": {},\r
      "order": 12,\r
      "mode": 0,\r
      "inputs": [\r
        {\r
          "localized_name": "为假时",\r
          "name": "on_false",\r
          "shape": 7,\r
          "type": "STRING",\r
          "link": 17\r
        },\r
        {\r
          "localized_name": "为真时",\r
          "name": "on_true",\r
          "shape": 7,\r
          "type": "STRING",\r
          "link": 4\r
        },\r
        {\r
          "localized_name": "切换",\r
          "name": "switch",\r
          "type": "BOOLEAN",\r
          "widget": {\r
            "name": "switch"\r
          },\r
          "link": null\r
        }\r
      ],\r
      "outputs": [\r
        {\r
          "localized_name": "输出",\r
          "name": "output",\r
          "type": "STRING",\r
          "links": [\r
            3\r
          ]\r
        }\r
      ],\r
      "properties": {\r
        "Node name for S&R": "ComfySwitchNode"\r
      },\r
      "widgets_values": [\r
        false\r
      ],\r
      "widgets_values_named": {\r
        "switch": false,\r
        "on_false": "Underground techno event poster: black background, a two-line headline in heavy white grotesque capitals where the first line reads \\"QWEN IMAGE\\" and the second line reads \\"2.1 TURBO\\", both lines the same very large size and each spanning the full poster width edge to edge, stacked tightly one above the other in the upper half, the decimal point in \\"2.1\\" rendered as a clearly visible full-size square dot, a scattered pile of overlapping black-and-white halftone portrait photos showing a mixed cast of different people, an elderly man, a young woman, a child and a bearded man among them, arranged in two loose rows across the lower half, every face is razor sharp and crisply in focus with fine detailed halftone dots, high micro-contrast, thin white grid lines, small fluorescent orange accent shapes, two-colour risograph print texture, square 1:1 poster format, both headline lines equally prominent, spelling exactly correct letter by letter, no other readable words, no watermark"\r
      },\r
      "title": "可选提示词增强（默认关闭）"\r
    },\r
    {\r
      "id": 609,\r
      "type": "PrimitiveStringMultiline",\r
      "pos": [\r
        270,\r
        410\r
      ],\r
      "size": [\r
        530,\r
        270\r
      ],\r
      "flags": {},\r
      "order": 5,\r
      "mode": 0,\r
      "inputs": [],\r
      "outputs": [\r
        {\r
          "localized_name": "字符串",\r
          "name": "STRING",\r
          "type": "STRING",\r
          "links": [\r
            16\r
          ]\r
        }\r
      ],\r
      "title": "Text (System Prompt)",\r
      "properties": {\r
        "Node name for S&R": "PrimitiveStringMultiline"\r
      },\r
      "widgets_values": [\r
        "# Image Prompt Rewriting Expert\\n\\nYou turn a user's image request into one long English paragraph that describes the\\nfinished image as if you were looking at it, plus the aspect ratio it should be\\nrendered at. You are not talking to the user and not talking to a renderer: you are\\nan observer reporting what is in the frame.\\n\\nWork through the eight steps below in order. Each step commits one decision; later\\nsteps never revise an earlier one.\\n\\n## Step 1 — Read the brief and split it in two\\n\\nList what the user has fixed and what they have left open.\\n\\nFixed, and it must survive into your description unchanged: every string of text\\nthey want shown, every named object, every count, every stated colour, every stated\\nposition, and the aspect ratio if they gave one. Copy their text strings character\\nfor character, in their own script, including punctuation and spacing.\\n\\nA third thing they may give you is an instruction about the job rather than about the\\npicture — \\"use double quotes\\", \\"no hard-edged blocks\\", \\"4K, no noise\\", \\"make sure the\\ntext is sharp\\". That is not content. Obey it silently where it applies and never echo\\nit: the description states what is in the frame, never what must be done.\\n\\nOpen, and you must decide it: everything they did not mention. A three-word request\\nand a three-hundred-word request both become a description of the same size, so a\\nshort brief means you are inventing most of the frame, not writing less.\\n\\n## Step 2 — Fix the frame\\n\\nDecide the orientation from the subject, then pick the ratio.\\n\\nIf the user states a ratio, use it. Otherwise: \`3:2\` for anything horizontal and\\n\`2:3\` for anything vertical — these are the two defaults and cover most images.\\nUse \`1:1\` for a square badge, icon, album cover or single centred emblem, \`16:9\`\\nfor a wide cinematic or presentation frame, \`1:2\` or \`9:16\` for a phone screen or a\\ntall standing banner. \`3:4\`, \`2:1\`, \`21:9\`, \`4:3\`, \`9:21\`, \`4:5\`, \`3:1\`, \`5:4\`,\\n\`1:3\` exist but only when the subject or the user really calls for them.\\n\\nThe ratio lives only in the \`wh_ratio\` field. Never write a ratio, a resolution, or\\na pixel count into the description itself.\\n\\n## Step 3 — Write the opening sentence\\n\\nOne sentence, around twenty words. Name the medium, the style, the subject, and the\\nbackground or palette; usually name the orientation too:\\n\\n\`The image is a ⟨vertical / wide / square / tall⟩ ⟨style⟩ ⟨photograph · poster · illustration · scene · portrait · infographic · close-up · graphic · page · card · sheet · logo⟩ of ⟨subject⟩, ⟨the background and its palette⟩.\`\\n\\n\`This is a …\` or a bare \`A vertical realistic photograph of …\` work equally well. The\\nmedium noun is the one part that is never omitted.\\n\\nThe style word goes here — realistic, photorealistic, minimalist, flat-vector,\\ncinematic, watercolour, isometric, editorial, hand-drawn, 3D-rendered, retro. Name\\nit once here; you may echo it in the closing sentence.\\n\\n## Step 4 — Inventory before you write\\n\\nBefore any more prose, settle two lists.\\n\\nEvery element that will appear, each with a place in the frame: upper-left,\\nacross the top, on the far right, in the lower-third, in the centre, in front of,\\nbehind, tucked into the corner. You will need eight to fourteen such positional\\nphrases, about ten typically, and they must reach the corners, the edges and the\\ncentre — not cluster in the middle.\\n\\nEvery piece of text that will be legible in the image, in reading order.\\n\\n## Step 5 — Walk the frame\\n\\nNow describe it in order. Which order depends on how the frame is filled.\\n\\n**If the frame is divided into regions** — a poster, a page, an interface, a layout, a\\nwide scene with several things in it — walk the regions:\\n\\n1. The background and the surface it sits on — this comes immediately after the\\n   opening sentence, not at the end.\\n2. The top band: headline, header bar, sky, ceiling, whatever occupies the top edge.\\n3. Down and across the body of the frame: left side, then centre, then right side.\\n   Give each region one or two sentences.\\n4. The bottom band: footer, foreground, ground plane, base row.\\n\\n**If one subject fills the frame** — a portrait, a close-up, a single object — walk\\nthe subject instead: the background and how far it falls off, then the subject's pose\\nand where it is placed in the frame, then head and face, then body and each garment or\\nsurface, then what is held or touching it, then whatever little is left at the edges.\\nKeep using positional phrases inside the subject — in the upper-left of the frame,\\nbehind the left shoulder, along the lower edge — so the frame stays locatable.\\n\\nRoughly a third of your sentences should open on the positional phrase itself —\\n\\"On the right side of the frame, …\\", \\"In the upper-left corner, …\\", \\"Across the\\nlower third, …\\" — so the reader always knows where they are looking.\\n\\nKeep it to one paragraph. Break to a new paragraph only when the image is genuinely\\nbuilt from stacked regions — panels, cards, sections, slides — and then one\\nparagraph per region, each opening on where that region sits.\\n\\n## Step 6 — Set every piece of text\\n\\nSkip this step if nothing in the image is meant to be read — a third of images have\\nno legible text at all, and inventing signage for them is a mistake.\\n\\nOtherwise, for each string from your Step 4 list, in reading order, name where it sits,\\nwhat it looks like, and what it says: \`a bold black headline across the top reads \\"…\\"\`.\\n\\nPut the string in straight double quotes, in its own script — Chinese, Russian,\\nKorean, Japanese and Arabic text stays in Chinese, Russian, Korean, Japanese and\\nArabic. Give its weight, colour, case and relative size. Describe a line break as a\\nsecond line rather than putting a real newline inside the string. If a mark is not meant\\nto be read — distant signage, a label behind glass, dense body copy — call it\\nblurred, indistinct, or too small to read rather than inventing letters. If the image contains a chart\\nor a table, its axes, tick labels, legend entries, series and cell values are text\\ntoo: write them out.\\n\\n## Step 7 — Give the lighting its own sentence\\n\\nEvery image has light in it, and the description always accounts for it: the source,\\nits direction, its quality, and the shadows and highlights it leaves. Soft diffused\\ndaylight from a window on the left, hard overhead studio light, warm low sun, flat\\neven ambient light for a diagram.\\n\\nOnce the contents are placed, give it a sentence of its own — \`The lighting is …\` —\\nor, if the light is what makes a particular surface look the way it does, fold it into\\nthat surface's sentence. Either way it is stated explicitly, not left implied.\\n\\n## Step 8 — Close with the whole frame\\n\\nEnd on a single sentence that steps back:\\n\\n\`The overall composition ⟨is / uses / feels⟩ …\`\\n\\n\`The composition is …\`, \`The overall design …\`, \`The overall mood …\`, \`The overall\\npalette …\` and \`The image has …\` are the same move. Cover balance and symmetry, the\\npalette, the style, and the mood in that one sentence. Write exactly one such\\nsentence — do not follow it with a second summary.\\n\\n## Throughout\\n\\n**Size.** The description runs about twenty sentences and four to five hundred words,\\nroughly twenty-five words a sentence. That is the same size whether the brief was three\\nwords or three hundred: a dense frame with many regions and a lot of text runs longer, a\\nsingle quiet subject runs shorter, but a thin brief never buys a thin description.\\n\\n**Observe, don't instruct.** Present tense, third person, declarative. No \\"you\\", no\\n\\"create\\", no \\"make sure\\", no \\"the AI should\\". No quality boosters — no \\"masterpiece\\",\\n\\"8K\\", \\"highly detailed\\", \\"award-winning\\".\\n\\n**Hedge what you cannot be certain of.** An observer describing a picture says\\n\\"appears to be\\", \\"likely\\", \\"suggesting\\", and offers a pair — \\"a notebook\\nor a tablet\\", \\"wood or dark laminate\\" — when the thing is genuinely ambiguous. Do\\nthis often; it is the natural register here. Be flatly definite only about what the\\nuser fixed.\\n\\n**Name colours with a modifier, almost never bare.** Deep navy, muted olive, pale\\ncream, warm terracotta, soft dusty rose, blue-grey, off-white, charcoal, brownish-\\ngreen. Hex codes only if the user gave them.\\n\\n**Give the material, not just the noun.** Brushed metal, matte plastic, glossy\\nceramic, coarse linen, weathered wood, frosted glass, grain, scuffs, condensation,\\nvisible brush strokes, paper fibre.\\n\\n**Enumerate; never summarise.** \\"Several items\\" and \\"various decorations\\" are not\\ndescriptions. Say what each thing is. Write small counts as words — three, five,\\ntwelve — and if something is partly hidden, say so and describe the visible part.\\n\\n**People get their observable surface.** Build, posture, where they are looking,\\nexpression, hair, skin tone, and each garment with its colour and material. Age is a\\nlife stage or a decade — a child, a teenager, a young adult, middle-aged, elderly,\\nin her thirties — never a number of years. If a face is turned away or cropped, say\\nthat instead of describing it.\\n\\n**Objects by class, not by brand.** A silver laptop, a mirrorless camera, a compact\\nhatchback — unless the user named the brand. Photographic and design vocabulary is\\nwelcome: shallow depth of field, bokeh, backlit, close-up, negative space,\\ngrid, drop shadow.\\n\\n**Everything holds together physically.** Shadows fall away from the light, reflections\\nmatch what is in front of the surface, scale is consistent between neighbouring\\nobjects, and a surface reacts to what sits on it. If the user asked for something\\nimpossible, describe it as the image shows it and let the rest of the scene stay\\ncoherent around it.\\n\\n## Language\\n\\nThe description is always in English, whatever language the request arrives in. The\\nonly exception is text shown inside the image, which stays in its own script.\\n\\n## Output format\\n\\n- Return the description and nothing else: one continuous paragraph of English, in a single line\\nstarting on the very first character of your reply.\\n- No JSON, no braces, no key names, no labels, no headings, no markdown, no code fences, and no quotation marks around the paragraph.\\n- No preamble, no acknowledgement, no explanation, no summary, no notes, no closing remarks, no questions.\\n- No ratio, no resolution, no pixel count, no timestamps.\\n\\nYour whole reply is used as the image prompt, so every extra word you add becomes part of the image.\\n",\r
        [\r
          false,\r
          true\r
        ]\r
      ],\r
      "widgets_values_named": {\r
        "value": "# Image Prompt Rewriting Expert\\n\\nYou turn a user's image request into one long English paragraph that describes the\\nfinished image as if you were looking at it, plus the aspect ratio it should be\\nrendered at. You are not talking to the user and not talking to a renderer: you are\\nan observer reporting what is in the frame.\\n\\nWork through the eight steps below in order. Each step commits one decision; later\\nsteps never revise an earlier one.\\n\\n## Step 1 — Read the brief and split it in two\\n\\nList what the user has fixed and what they have left open.\\n\\nFixed, and it must survive into your description unchanged: every string of text\\nthey want shown, every named object, every count, every stated colour, every stated\\nposition, and the aspect ratio if they gave one. Copy their text strings character\\nfor character, in their own script, including punctuation and spacing.\\n\\nA third thing they may give you is an instruction about the job rather than about the\\npicture — \\"use double quotes\\", \\"no hard-edged blocks\\", \\"4K, no noise\\", \\"make sure the\\ntext is sharp\\". That is not content. Obey it silently where it applies and never echo\\nit: the description states what is in the frame, never what must be done.\\n\\nOpen, and you must decide it: everything they did not mention. A three-word request\\nand a three-hundred-word request both become a description of the same size, so a\\nshort brief means you are inventing most of the frame, not writing less.\\n\\n## Step 2 — Fix the frame\\n\\nDecide the orientation from the subject, then pick the ratio.\\n\\nIf the user states a ratio, use it. Otherwise: \`3:2\` for anything horizontal and\\n\`2:3\` for anything vertical — these are the two defaults and cover most images.\\nUse \`1:1\` for a square badge, icon, album cover or single centred emblem, \`16:9\`\\nfor a wide cinematic or presentation frame, \`1:2\` or \`9:16\` for a phone screen or a\\ntall standing banner. \`3:4\`, \`2:1\`, \`21:9\`, \`4:3\`, \`9:21\`, \`4:5\`, \`3:1\`, \`5:4\`,\\n\`1:3\` exist but only when the subject or the user really calls for them.\\n\\nThe ratio lives only in the \`wh_ratio\` field. Never write a ratio, a resolution, or\\na pixel count into the description itself.\\n\\n## Step 3 — Write the opening sentence\\n\\nOne sentence, around twenty words. Name the medium, the style, the subject, and the\\nbackground or palette; usually name the orientation too:\\n\\n\`The image is a ⟨vertical / wide / square / tall⟩ ⟨style⟩ ⟨photograph · poster · illustration · scene · portrait · infographic · close-up · graphic · page · card · sheet · logo⟩ of ⟨subject⟩, ⟨the background and its palette⟩.\`\\n\\n\`This is a …\` or a bare \`A vertical realistic photograph of …\` work equally well. The\\nmedium noun is the one part that is never omitted.\\n\\nThe style word goes here — realistic, photorealistic, minimalist, flat-vector,\\ncinematic, watercolour, isometric, editorial, hand-drawn, 3D-rendered, retro. Name\\nit once here; you may echo it in the closing sentence.\\n\\n## Step 4 — Inventory before you write\\n\\nBefore any more prose, settle two lists.\\n\\nEvery element that will appear, each with a place in the frame: upper-left,\\nacross the top, on the far right, in the lower-third, in the centre, in front of,\\nbehind, tucked into the corner. You will need eight to fourteen such positional\\nphrases, about ten typically, and they must reach the corners, the edges and the\\ncentre — not cluster in the middle.\\n\\nEvery piece of text that will be legible in the image, in reading order.\\n\\n## Step 5 — Walk the frame\\n\\nNow describe it in order. Which order depends on how the frame is filled.\\n\\n**If the frame is divided into regions** — a poster, a page, an interface, a layout, a\\nwide scene with several things in it — walk the regions:\\n\\n1. The background and the surface it sits on — this comes immediately after the\\n   opening sentence, not at the end.\\n2. The top band: headline, header bar, sky, ceiling, whatever occupies the top edge.\\n3. Down and across the body of the frame: left side, then centre, then right side.\\n   Give each region one or two sentences.\\n4. The bottom band: footer, foreground, ground plane, base row.\\n\\n**If one subject fills the frame** — a portrait, a close-up, a single object — walk\\nthe subject instead: the background and how far it falls off, then the subject's pose\\nand where it is placed in the frame, then head and face, then body and each garment or\\nsurface, then what is held or touching it, then whatever little is left at the edges.\\nKeep using positional phrases inside the subject — in the upper-left of the frame,\\nbehind the left shoulder, along the lower edge — so the frame stays locatable.\\n\\nRoughly a third of your sentences should open on the positional phrase itself —\\n\\"On the right side of the frame, …\\", \\"In the upper-left corner, …\\", \\"Across the\\nlower third, …\\" — so the reader always knows where they are looking.\\n\\nKeep it to one paragraph. Break to a new paragraph only when the image is genuinely\\nbuilt from stacked regions — panels, cards, sections, slides — and then one\\nparagraph per region, each opening on where that region sits.\\n\\n## Step 6 — Set every piece of text\\n\\nSkip this step if nothing in the image is meant to be read — a third of images have\\nno legible text at all, and inventing signage for them is a mistake.\\n\\nOtherwise, for each string from your Step 4 list, in reading order, name where it sits,\\nwhat it looks like, and what it says: \`a bold black headline across the top reads \\"…\\"\`.\\n\\nPut the string in straight double quotes, in its own script — Chinese, Russian,\\nKorean, Japanese and Arabic text stays in Chinese, Russian, Korean, Japanese and\\nArabic. Give its weight, colour, case and relative size. Describe a line break as a\\nsecond line rather than putting a real newline inside the string. If a mark is not meant\\nto be read — distant signage, a label behind glass, dense body copy — call it\\nblurred, indistinct, or too small to read rather than inventing letters. If the image contains a chart\\nor a table, its axes, tick labels, legend entries, series and cell values are text\\ntoo: write them out.\\n\\n## Step 7 — Give the lighting its own sentence\\n\\nEvery image has light in it, and the description always accounts for it: the source,\\nits direction, its quality, and the shadows and highlights it leaves. Soft diffused\\ndaylight from a window on the left, hard overhead studio light, warm low sun, flat\\neven ambient light for a diagram.\\n\\nOnce the contents are placed, give it a sentence of its own — \`The lighting is …\` —\\nor, if the light is what makes a particular surface look the way it does, fold it into\\nthat surface's sentence. Either way it is stated explicitly, not left implied.\\n\\n## Step 8 — Close with the whole frame\\n\\nEnd on a single sentence that steps back:\\n\\n\`The overall composition ⟨is / uses / feels⟩ …\`\\n\\n\`The composition is …\`, \`The overall design …\`, \`The overall mood …\`, \`The overall\\npalette …\` and \`The image has …\` are the same move. Cover balance and symmetry, the\\npalette, the style, and the mood in that one sentence. Write exactly one such\\nsentence — do not follow it with a second summary.\\n\\n## Throughout\\n\\n**Size.** The description runs about twenty sentences and four to five hundred words,\\nroughly twenty-five words a sentence. That is the same size whether the brief was three\\nwords or three hundred: a dense frame with many regions and a lot of text runs longer, a\\nsingle quiet subject runs shorter, but a thin brief never buys a thin description.\\n\\n**Observe, don't instruct.** Present tense, third person, declarative. No \\"you\\", no\\n\\"create\\", no \\"make sure\\", no \\"the AI should\\". No quality boosters — no \\"masterpiece\\",\\n\\"8K\\", \\"highly detailed\\", \\"award-winning\\".\\n\\n**Hedge what you cannot be certain of.** An observer describing a picture says\\n\\"appears to be\\", \\"likely\\", \\"suggesting\\", and offers a pair — \\"a notebook\\nor a tablet\\", \\"wood or dark laminate\\" — when the thing is genuinely ambiguous. Do\\nthis often; it is the natural register here. Be flatly definite only about what the\\nuser fixed.\\n\\n**Name colours with a modifier, almost never bare.** Deep navy, muted olive, pale\\ncream, warm terracotta, soft dusty rose, blue-grey, off-white, charcoal, brownish-\\ngreen. Hex codes only if the user gave them.\\n\\n**Give the material, not just the noun.** Brushed metal, matte plastic, glossy\\nceramic, coarse linen, weathered wood, frosted glass, grain, scuffs, condensation,\\nvisible brush strokes, paper fibre.\\n\\n**Enumerate; never summarise.** \\"Several items\\" and \\"various decorations\\" are not\\ndescriptions. Say what each thing is. Write small counts as words — three, five,\\ntwelve — and if something is partly hidden, say so and describe the visible part.\\n\\n**People get their observable surface.** Build, posture, where they are looking,\\nexpression, hair, skin tone, and each garment with its colour and material. Age is a\\nlife stage or a decade — a child, a teenager, a young adult, middle-aged, elderly,\\nin her thirties — never a number of years. If a face is turned away or cropped, say\\nthat instead of describing it.\\n\\n**Objects by class, not by brand.** A silver laptop, a mirrorless camera, a compact\\nhatchback — unless the user named the brand. Photographic and design vocabulary is\\nwelcome: shallow depth of field, bokeh, backlit, close-up, negative space,\\ngrid, drop shadow.\\n\\n**Everything holds together physically.** Shadows fall away from the light, reflections\\nmatch what is in front of the surface, scale is consistent between neighbouring\\nobjects, and a surface reacts to what sits on it. If the user asked for something\\nimpossible, describe it as the image shows it and let the rest of the scene stay\\ncoherent around it.\\n\\n## Language\\n\\nThe description is always in English, whatever language the request arrives in. The\\nonly exception is text shown inside the image, which stays in its own script.\\n\\n## Output format\\n\\n- Return the description and nothing else: one continuous paragraph of English, in a single line\\nstarting on the very first character of your reply.\\n- No JSON, no braces, no key names, no labels, no headings, no markdown, no code fences, and no quotation marks around the paragraph.\\n- No preamble, no acknowledgement, no explanation, no summary, no notes, no closing remarks, no questions.\\n- No ratio, no resolution, no pixel count, no timestamps.\\n\\nYour whole reply is used as the image prompt, so every extra word you add becomes part of the image.\\n",\r
        "speak_and_recognation": [\r
          false,\r
          true\r
        ]\r
      }\r
    },\r
    {\r
      "id": 610,\r
      "type": "ManualSigmas",\r
      "pos": [\r
        1372,\r
        1690\r
      ],\r
      "size": [\r
        418.9732421875,\r
        58\r
      ],\r
      "flags": {},\r
      "order": 6,\r
      "mode": 0,\r
      "inputs": [],\r
      "outputs": [\r
        {\r
          "localized_name": "Sigmas",\r
          "name": "SIGMAS",\r
          "type": "SIGMAS",\r
          "links": [\r
            8\r
          ]\r
        }\r
      ],\r
      "title": "Manual Sigmas (Qwen-Image-2.1-Turbo 8-step schedule)",\r
      "properties": {\r
        "Node name for S&R": "ManualSigmas"\r
      },\r
      "widgets_values": [\r
        "1.0, 0.978453, 0.95418, 0.926626, 0.89508, 0.845148, 0.704534, 0.414568, 0"\r
      ],\r
      "widgets_values_named": {\r
        "sigmas": "1.0, 0.978453, 0.95418, 0.926626, 0.89508, 0.845148, 0.704534, 0.414568, 0"\r
      }\r
    },\r
    {\r
      "id": 611,\r
      "type": "SamplerCustomAdvanced",\r
      "pos": [\r
        1699,\r
        1286\r
      ],\r
      "size": [\r
        220.2388671875,\r
        106\r
      ],\r
      "flags": {},\r
      "order": 15,\r
      "mode": 0,\r
      "inputs": [\r
        {\r
          "localized_name": "噪波",\r
          "name": "noise",\r
          "type": "NOISE",\r
          "link": 5\r
        },\r
        {\r
          "localized_name": "引导器",\r
          "name": "guider",\r
          "type": "GUIDER",\r
          "link": 6\r
        },\r
        {\r
          "localized_name": "采样器",\r
          "name": "sampler",\r
          "type": "SAMPLER",\r
          "link": 7\r
        },\r
        {\r
          "localized_name": "西格玛",\r
          "name": "sigmas",\r
          "type": "SIGMAS",\r
          "link": 8\r
        },\r
        {\r
          "localized_name": "Latent图像",\r
          "name": "latent_image",\r
          "type": "LATENT",\r
          "link": 14\r
        }\r
      ],\r
      "outputs": [\r
        {\r
          "localized_name": "Latent",\r
          "name": "output",\r
          "type": "LATENT",\r
          "links": [\r
            10\r
          ]\r
        },\r
        {\r
          "localized_name": "降噪Latent",\r
          "name": "denoised_output",\r
          "type": "LATENT",\r
          "links": null\r
        }\r
      ],\r
      "title": "Sampler Custom Advanced",\r
      "properties": {\r
        "Node name for S&R": "SamplerCustomAdvanced"\r
      }\r
    },\r
    {\r
      "id": 612,\r
      "type": "KSamplerSelect",\r
      "pos": [\r
        1372,\r
        1569\r
      ],\r
      "size": [\r
        270,\r
        58\r
      ],\r
      "flags": {},\r
      "order": 7,\r
      "mode": 0,\r
      "inputs": [\r
        {\r
          "localized_name": "采样器名称",\r
          "name": "sampler_name",\r
          "type": "COMBO",\r
          "widget": {\r
            "name": "sampler_name"\r
          },\r
          "link": null\r
        }\r
      ],\r
      "outputs": [\r
        {\r
          "localized_name": "采样器",\r
          "name": "SAMPLER",\r
          "type": "SAMPLER",\r
          "links": [\r
            7\r
          ]\r
        }\r
      ],\r
      "title": "KSampler Select (euler)",\r
      "properties": {\r
        "Node name for S&R": "KSamplerSelect"\r
      },\r
      "widgets_values": [\r
        "euler"\r
      ],\r
      "widgets_values_named": {\r
        "sampler_name": "euler"\r
      }\r
    },\r
    {\r
      "id": 613,\r
      "type": "RandomNoise",\r
      "pos": [\r
        1372,\r
        1263\r
      ],\r
      "size": [\r
        270,\r
        82\r
      ],\r
      "flags": {},\r
      "order": 8,\r
      "mode": 0,\r
      "inputs": [],\r
      "outputs": [\r
        {\r
          "localized_name": "噪波",\r
          "name": "NOISE",\r
          "type": "NOISE",\r
          "links": [\r
            5\r
          ]\r
        }\r
      ],\r
      "title": "Random Noise",\r
      "properties": {\r
        "Node name for S&R": "RandomNoise"\r
      },\r
      "widgets_values": [\r
        92826187933228,\r
        "fixed"\r
      ],\r
      "widgets_values_named": {\r
        "noise_seed": 92826187933228,\r
        "control_after_generate": "fixed"\r
      }\r
    },\r
    {\r
      "id": 614,\r
      "type": "CFGGuider",\r
      "pos": [\r
        1372,\r
        1408\r
      ],\r
      "size": [\r
        270,\r
        98\r
      ],\r
      "flags": {},\r
      "order": 14,\r
      "mode": 0,\r
      "inputs": [\r
        {\r
          "localized_name": "模型",\r
          "name": "model",\r
          "type": "MODEL",\r
          "link": 9\r
        },\r
        {\r
          "localized_name": "正面条件",\r
          "name": "positive",\r
          "type": "CONDITIONING",\r
          "link": 12\r
        },\r
        {\r
          "localized_name": "负面条件",\r
          "name": "negative",\r
          "type": "CONDITIONING",\r
          "link": 13\r
        }\r
      ],\r
      "outputs": [\r
        {\r
          "localized_name": "引导器",\r
          "name": "GUIDER",\r
          "type": "GUIDER",\r
          "links": [\r
            6\r
          ]\r
        }\r
      ],\r
      "properties": {\r
        "Node name for S&R": "CFGGuider"\r
      },\r
      "widgets_values": [\r
        1\r
      ],\r
      "widgets_values_named": {\r
        "cfg": 1\r
      }\r
    },\r
    {\r
      "id": 615,\r
      "type": "QwenImage21Cache",\r
      "pos": [\r
        1376,\r
        1046\r
      ],\r
      "size": [\r
        270,\r
        90\r
      ],\r
      "flags": {},\r
      "order": 11,\r
      "mode": 0,\r
      "inputs": [\r
        {\r
          "localized_name": "model",\r
          "name": "model",\r
          "type": "MODEL",\r
          "link": 11\r
        },\r
        {\r
          "localized_name": "device",\r
          "name": "device",\r
          "type": "COMBO",\r
          "widget": {\r
            "name": "device"\r
          },\r
          "link": null\r
        },\r
        {\r
          "localized_name": "dtype",\r
          "name": "dtype",\r
          "type": "COMBO",\r
          "widget": {\r
            "name": "dtype"\r
          },\r
          "link": null\r
        }\r
      ],\r
      "outputs": [\r
        {\r
          "localized_name": "模型",\r
          "name": "MODEL",\r
          "type": "MODEL",\r
          "links": [\r
            9\r
          ]\r
        }\r
      ],\r
      "properties": {\r
        "Node name for S&R": "QwenImage21Cache"\r
      },\r
      "widgets_values": [\r
        "auto",\r
        "default"\r
      ],\r
      "widgets_values_named": {\r
        "device": "auto",\r
        "dtype": "default"\r
      }\r
    },\r
    {\r
      "id": 651,\r
      "type": "PrimitiveStringMultiline",\r
      "title": "生图提示词（导播台提交时自动替换）",\r
      "pos": [\r
        350,\r
        400\r
      ],\r
      "size": [\r
        350,\r
        220\r
      ],\r
      "flags": {},\r
      "order": 9,\r
      "mode": 0,\r
      "inputs": [],\r
      "outputs": [\r
        {\r
          "name": "STRING",\r
          "type": "STRING",\r
          "links": [\r
            17,\r
            18\r
          ]\r
        }\r
      ],\r
      "properties": {\r
        "Node name for S&R": "PrimitiveStringMultiline"\r
      },\r
      "widgets_values": [\r
        ""\r
      ],\r
      "widgets_values_named": {\r
        "value": ""\r
      }\r
    },\r
    {\r
      "id": 650,\r
      "type": "SaveImage",\r
      "title": "YuQ · Qwen Image 2.1 Turbo 生图输出",\r
      "pos": [\r
        2280,\r
        1430\r
      ],\r
      "size": [\r
        330,\r
        320\r
      ],\r
      "flags": {},\r
      "order": 17,\r
      "mode": 0,\r
      "inputs": [\r
        {\r
          "name": "images",\r
          "type": "IMAGE",\r
          "link": 19\r
        }\r
      ],\r
      "outputs": [],\r
      "properties": {\r
        "Node name for S&R": "SaveImage"\r
      },\r
      "widgets_values": [\r
        "TheodoreDirector/ImageGen/manual/image"\r
      ],\r
      "widgets_values_named": {\r
        "filename_prefix": "TheodoreDirector/ImageGen/manual/image"\r
      }\r
    }\r
  ],\r
  "links": [\r
    [\r
      1,\r
      602,\r
      0,\r
      601,\r
      0,\r
      "CLIP"\r
    ],\r
    [\r
      2,\r
      603,\r
      0,\r
      605,\r
      1,\r
      "VAE"\r
    ],\r
    [\r
      3,\r
      608,\r
      0,\r
      601,\r
      3,\r
      "STRING"\r
    ],\r
    [\r
      4,\r
      606,\r
      0,\r
      608,\r
      1,\r
      "STRING"\r
    ],\r
    [\r
      5,\r
      613,\r
      0,\r
      611,\r
      0,\r
      "NOISE"\r
    ],\r
    [\r
      6,\r
      614,\r
      0,\r
      611,\r
      1,\r
      "GUIDER"\r
    ],\r
    [\r
      7,\r
      612,\r
      0,\r
      611,\r
      2,\r
      "SAMPLER"\r
    ],\r
    [\r
      8,\r
      610,\r
      0,\r
      611,\r
      3,\r
      "SIGMAS"\r
    ],\r
    [\r
      9,\r
      615,\r
      0,\r
      614,\r
      0,\r
      "MODEL"\r
    ],\r
    [\r
      10,\r
      611,\r
      0,\r
      605,\r
      0,\r
      "LATENT"\r
    ],\r
    [\r
      11,\r
      600,\r
      0,\r
      615,\r
      0,\r
      "MODEL"\r
    ],\r
    [\r
      12,\r
      601,\r
      0,\r
      614,\r
      1,\r
      "CONDITIONING"\r
    ],\r
    [\r
      13,\r
      601,\r
      1,\r
      614,\r
      2,\r
      "CONDITIONING"\r
    ],\r
    [\r
      14,\r
      604,\r
      0,\r
      611,\r
      4,\r
      "LATENT"\r
    ],\r
    [\r
      15,\r
      607,\r
      0,\r
      606,\r
      0,\r
      "CLIP"\r
    ],\r
    [\r
      16,\r
      609,\r
      0,\r
      606,\r
      4,\r
      "STRING"\r
    ],\r
    [\r
      17,\r
      651,\r
      0,\r
      608,\r
      0,\r
      "STRING"\r
    ],\r
    [\r
      18,\r
      651,\r
      0,\r
      606,\r
      5,\r
      "STRING"\r
    ],\r
    [\r
      19,\r
      605,\r
      0,\r
      650,\r
      0,\r
      "IMAGE"\r
    ]\r
  ],\r
  "groups": [],\r
  "config": {},\r
  "extra": {\r
    "yuqImageWorkflow": "qwen_image_2_1_turbo",\r
    "sourceFile": "54bb395d-3e60-4c94-b525-85523901575b"\r
  },\r
  "version": 0.4\r
}\r
`, Na = '.td-modal{--td-bg:#0b1020;--td-panel:#121a2b;--td-panel-2:#18243a;--td-panel-3:#20314d;--td-line:#273b5b;--td-line-strong:#3e5b82;--td-text:#edf5ff;--td-muted:#9cafc9;--td-faint:#7185a3;--td-accent:#69e1c0;--td-accent-dim:#153d3d;--td-relay:#8bb8ff;--td-relay-dim:#1d3155;--td-warn:#f4c96d;--td-warn-dim:#44351d;--td-danger:#ff858f;--td-danger-dim:#45232e;--td-radius:10px;--td-font:"PingFang SC","Microsoft YaHei UI","Microsoft YaHei","Noto Sans SC","Segoe UI",system-ui,sans-serif;--td-mono:"Cascadia Mono",Consolas,"SF Mono",ui-monospace,"Microsoft YaHei",monospace}.td-modal{position:fixed;top:0;right:0;bottom:0;left:0;z-index:2147483000;display:block;overflow:hidden;pointer-events:auto;background:var(--td-bg);color:var(--td-text);font:13.5px/1.5 var(--td-font);isolation:isolate;outline:none}.td-modal *{box-sizing:border-box}.td-shell{height:100dvh;display:grid;grid-template-columns:214px minmax(0,1fr);grid-template-rows:auto auto minmax(0,1fr);grid-template-areas:"rail header" "rail status" "rail content";background:var(--td-bg)}.td-shell h1,.td-shell h2,.td-shell h3{margin:0;font-weight:650;letter-spacing:.01em}.td-shell h1{font-size:17px}.td-shell h2{font-size:15px}.td-shell h3{font-size:13.5px}.td-shell button,.td-shell input,.td-shell textarea,.td-shell select,.td-button{font:inherit;color:var(--td-text);background:var(--td-panel-3);border:1px solid var(--td-line-strong);border-radius:6px;padding:6px 10px}.td-shell button,.td-button{cursor:pointer;white-space:nowrap;transition:border-color .12s,background .12s,color .12s}.td-shell button:hover:not(:disabled),.td-button:hover{border-color:var(--td-accent)}.td-shell button:disabled{opacity:.45;cursor:not-allowed}.td-shell button.primary{background:var(--td-accent);border-color:var(--td-accent);color:#07140e;font-weight:600}.td-shell button.primary:hover:not(:disabled){filter:brightness(1.08)}.td-shell button.accent{background:var(--td-accent-dim);border-color:#2f6b52;color:var(--td-accent)}.td-shell button.danger{color:var(--td-danger)}.td-shell button.danger:hover:not(:disabled){border-color:var(--td-danger)}.td-shell input:focus,.td-shell textarea:focus,.td-shell select:focus{outline:none;border-color:var(--td-accent);box-shadow:0 0 0 2px #5fd0a022}.td-shell textarea{resize:vertical}.td-button{display:inline-flex;align-items:center;gap:6px}.td-button input{display:none}.td-chip{display:inline-flex;align-items:center;gap:4px;padding:1px 8px;border-radius:999px;background:var(--td-panel-3);color:var(--td-muted);font-size:11.5px;white-space:nowrap}.td-chip.ok{background:var(--td-accent-dim);color:var(--td-accent)}.td-chip.warn{background:var(--td-warn-dim);color:var(--td-warn)}.td-inline-check{display:inline-flex!important;flex-direction:row!important;align-items:center;gap:6px!important;color:var(--td-text)!important;cursor:pointer;white-space:nowrap}.td-inline-check input{width:15px!important;height:15px;margin:0}.td-hint{margin:0;color:var(--td-faint);font-size:12px}.errors{color:var(--td-danger)}.ok{color:var(--td-accent)}.wide{width:100%}.td-topbar{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:10px 18px;border-bottom:1px solid var(--td-line);background:var(--td-panel)}.td-brand{display:flex;align-items:center;gap:12px;min-width:0}.td-project-chip{display:inline-flex;align-items:center;gap:6px;max-width:320px;overflow:hidden;padding:3px 10px;border:1px solid var(--td-line-strong);border-radius:999px;text-overflow:ellipsis;white-space:nowrap}.td-project-chip em{color:var(--td-faint);font-style:normal;font-size:12px}.td-project-meta{color:var(--td-muted);font-size:12.5px;white-space:nowrap}.td-actions{display:flex;gap:8px;align-items:center;flex:none}.td-actions .td-lang{min-width:46px}.td-tabs{display:flex;align-items:center;gap:4px;padding:0 18px;border-bottom:1px solid var(--td-line);background:var(--td-panel)}.td-shell .td-tabs>button{position:relative;padding:10px 14px;border:0;border-radius:0;background:transparent;color:var(--td-muted)}.td-shell .td-tabs>button:hover:not(:disabled){color:var(--td-text);border-color:transparent}.td-shell .td-tabs>button.active{color:var(--td-text);font-weight:600}.td-tabs>button.active:after{content:"";position:absolute;left:10px;right:10px;bottom:0;height:2px;border-radius:2px;background:var(--td-accent)}.td-shell .td-tabs>button.attention{color:var(--td-warn)}.td-tab-status{display:flex;align-items:center;gap:10px;margin-left:auto;padding:6px 0}.td-progress-text{color:var(--td-muted);font-size:12.5px}.td-run-pill{display:inline-flex;align-items:center;gap:8px;padding:3px 4px 3px 10px;border:1px solid #2f6b52;border-radius:999px;background:var(--td-accent-dim);color:var(--td-accent);font-size:12.5px}.td-run-pill i{width:8px;height:8px;border-radius:50%;background:var(--td-accent);animation:td-pulse 1.2s infinite}.td-shell .td-run-pill button{padding:2px 10px;border-radius:999px;color:var(--td-danger)}@keyframes td-pulse{50%{opacity:.25}}.td-shell main{min-height:0;overflow:auto;padding:14px 18px}.td-shell.td-compact main{padding:8px 12px}.td-shell.td-compact .td-topbar{padding:7px 14px}.td-shell.td-compact .td-tabs>button{padding-top:7px;padding-bottom:7px}.td-shots{display:grid;grid-template-columns:270px minmax(420px,1fr) minmax(320px,380px);gap:14px;height:100%;min-height:0}.td-shots>aside,.td-shot-form{min-height:0;background:var(--td-panel);border:1px solid var(--td-line);border-radius:var(--td-radius)}.td-shot-sidebar{display:flex;flex-direction:column;overflow:hidden}.td-shot-list{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:8px}.td-shot-card{position:relative;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:6px;align-items:center;margin-bottom:4px;padding:8px 8px 8px 10px;border:1px solid transparent;border-radius:7px;cursor:pointer}.td-shot-card:hover{background:var(--td-panel-2)}.td-shot-card.selected{border-color:#2f6b52;background:var(--td-accent-dim)}.td-shot-card.off{opacity:.55}.td-shot-card.running{border-color:var(--td-accent);box-shadow:inset 3px 0 0 var(--td-accent)}.td-shot-card.relay{margin-top:-2px}.td-relay-link{position:absolute;left:3px;top:-8px;height:16px;border-left:2px dashed var(--td-relay)}.td-shot-card-main{min-width:0}.td-shot-card-main strong{display:block;overflow:hidden;font-weight:600;text-overflow:ellipsis;white-space:nowrap}.td-shot-card-main strong em{margin-right:6px;color:var(--td-faint);font-style:normal;font-variant-numeric:tabular-nums}.td-shot-card-meta{display:flex;flex-wrap:wrap;gap:4px;margin-top:3px;font-size:11.5px;color:var(--td-muted)}.td-shot-card-meta b{font-weight:500}.td-shot-card-meta i{padding:0 6px;border-radius:999px;background:var(--td-panel-3);font-style:normal}.td-shot-card-meta i.relay{background:var(--td-relay-dim);color:var(--td-relay)}.td-shot-card-meta i.ok{background:var(--td-accent-dim);color:var(--td-accent)}.td-shot-card-meta i.warn{background:var(--td-warn-dim);color:var(--td-warn)}.td-shot-card-meta i.run{background:var(--td-accent);color:#07140e}.td-shot-card-actions{display:flex;gap:2px;opacity:0;transition:opacity .12s}.td-shot-card:hover .td-shot-card-actions,.td-shot-card.selected .td-shot-card-actions{opacity:1}.td-shell .td-shot-card-actions button{padding:1px 6px;font-size:12px;background:transparent}.td-shot-sidebar-footer{flex:none;display:grid;gap:8px;padding:10px;border-top:1px solid var(--td-line)}.td-total{color:var(--td-muted);font-size:12px;text-align:center}.td-two-buttons{display:grid;grid-template-columns:1fr 1fr;gap:6px}.td-form{display:flex;flex-direction:column;gap:10px}.td-form label,.td-settings-grid label{display:flex;flex-direction:column;gap:4px;color:var(--td-muted);font-size:12.5px}.td-form input,.td-form textarea,.td-form select{width:100%}.td-shot-form{overflow:auto;padding:14px}.td-shot-head{display:grid;grid-template-columns:minmax(0,1fr) 110px 200px;gap:10px;align-items:end}.td-shot-head input{font-size:14px}.td-seed-input{display:flex;gap:4px}.td-seed-input input{min-width:0}.td-shell .td-seed-input button{flex:none;padding:6px 8px}.td-inline-warning{padding:6px 10px;border:1px solid #6b5527;border-radius:6px;background:var(--td-warn-dim);color:var(--td-warn);font-size:12.5px}.td-shot-switches{display:flex;flex-wrap:wrap;align-items:flex-start;gap:8px}.td-form label.td-toggle{flex-direction:row;align-items:center;gap:7px;padding:6px 10px;border:1px solid var(--td-line-strong);border-radius:6px;background:var(--td-panel-2);color:var(--td-text);cursor:pointer;white-space:nowrap}.td-form label.td-toggle input{width:15px;height:15px;margin:0}.td-form label.td-toggle:has(input:checked){border-color:#2f6b52;background:var(--td-accent-dim)}.td-form label.td-toggle:has(input:disabled){opacity:.55;cursor:not-allowed}.td-advanced{margin-left:auto}.td-advanced>summary{padding:6px 10px;color:var(--td-muted);cursor:pointer;list-style:none;border:1px dashed var(--td-line-strong);border-radius:6px}.td-advanced[open]>summary{color:var(--td-text)}.td-advanced-body{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px;min-width:420px;padding:10px;border:1px solid var(--td-line);border-radius:7px;background:var(--td-panel-2)}.td-note{border:1px solid var(--td-line);border-radius:7px;background:var(--td-panel-2)}.td-note>summary{padding:7px 10px;color:var(--td-muted);cursor:pointer}.td-note[open]>summary{border-bottom:1px solid var(--td-line)}.td-note textarea{display:block;width:100%;border:0;border-radius:0 0 7px 7px;background:transparent;line-height:1.6}.td-field-label{display:flex;align-items:baseline;gap:10px;color:var(--td-muted)}.td-field-label small{color:var(--td-faint);font-size:11.5px}.td-prompt-field{flex:1 0 auto}.td-prompt-field .td-highlight-input{min-height:360px}.td-camera-builder{border:1px solid var(--td-line);border-radius:6px;background:var(--td-panel-2)}.td-camera-builder>summary{padding:8px 10px;color:var(--td-muted);cursor:pointer}.td-camera-builder[open]>summary{border-bottom:1px solid var(--td-line)}.td-camera-builder-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;padding:10px}.td-camera-builder-fields label{display:grid;gap:4px;color:var(--td-muted);font-size:12px}.td-camera-builder-fields input,.td-camera-builder-fields select{min-width:0}.td-camera-builder-fields button{justify-self:start;align-self:end}.td-camera-builder-fields label:first-child{grid-column:1/-1}.td-highlight-textarea{position:relative;display:block;width:100%;min-width:0}.td-highlight-backdrop,.td-form textarea.td-highlight-input{box-sizing:border-box;width:100%;margin:0;padding:9px 11px;font-family:var(--td-mono);font-size:13px;line-height:1.6;letter-spacing:normal;-moz-tab-size:8;tab-size:8;white-space:pre-wrap;overflow-wrap:break-word;word-break:break-word}.td-highlight-backdrop{position:absolute;top:0;right:0;bottom:0;left:0;z-index:0;overflow:hidden;border:1px solid transparent;border-radius:6px;background:#11161d;color:var(--td-text);pointer-events:none}.td-form textarea.td-highlight-input{position:relative;z-index:1;display:block;background:transparent;color:transparent;caret-color:var(--td-text);-webkit-text-fill-color:transparent}.td-highlight-input::selection{background:#5898d46b}.td-highlight-backdrop mark{padding:0;border-radius:3px;color:inherit}.td-highlight-backdrop mark.valid{background:#1d6b50;color:#bfffe6}.td-highlight-backdrop mark.invalid{background:#7a2931;color:#ffd1d5;text-decoration:underline;text-decoration-color:#ff9aa4;text-underline-offset:2px}.td-reference-mention-menu{position:fixed;z-index:80;display:flex;flex-direction:column;overflow:hidden;border:1px solid #526174;border-radius:9px;background:#161d26;color:var(--td-text);box-shadow:0 14px 42px #000b}.td-reference-mention-menu>header{display:flex;align-items:center;justify-content:space-between;flex:none;padding:8px 10px;border-bottom:1px solid var(--td-line);background:#202936}.td-reference-mention-menu>header strong{color:var(--td-text);font-size:13px}.td-reference-mention-menu>header span{padding:1px 7px;border-radius:999px;background:#2b3745;color:var(--td-muted);font-size:11px}.td-reference-mention-options{min-height:0;overflow:auto;padding:5px}.td-shell .td-reference-mention-options>button{display:grid;grid-template-columns:66px minmax(0,1fr) auto;gap:9px;align-items:center;width:100%;min-height:56px;padding:5px;border:1px solid transparent;background:transparent;text-align:left}.td-shell .td-reference-mention-options>button:hover,.td-shell .td-reference-mention-options>button.active{border-color:#527e6c;background:#1d302b}.td-reference-mention-thumb{display:flex;width:66px;height:46px;align-items:center;justify-content:center;overflow:hidden;border:1px solid var(--td-line);border-radius:5px;background:#0b0f14;color:var(--td-accent);font-size:20px}.td-reference-mention-thumb img{display:block;width:100%;height:100%;object-fit:cover}.td-reference-mention-copy{display:flex;min-width:0;flex-direction:column;gap:2px}.td-reference-mention-copy strong,.td-reference-mention-copy small{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.td-reference-mention-copy strong{color:var(--td-text)}.td-reference-mention-copy small{color:var(--td-muted);font-size:11px}.td-reference-mention-options>button>em{padding:2px 7px;border-radius:999px;background:#293440;color:var(--td-muted);font-size:10px;font-style:normal;white-space:nowrap}.td-reference-mention-empty{margin:0;padding:22px 12px;color:var(--td-muted);text-align:center}.td-shot-media{display:grid;grid-template-columns:repeat(auto-fill,minmax(112px,1fr));gap:8px;margin:0;padding:10px;border:1px solid var(--td-line);border-radius:7px}.td-shot-media legend{padding:0 6px;color:var(--td-muted);font-size:12px}.td-shot-media-card{min-width:0;overflow:hidden;border:1px solid var(--td-line);border-radius:6px;background:var(--td-panel-2)}.td-shot-media-card.used{border-color:#2f6b52}.td-shot-media-card.disabled{opacity:.4}.td-shot-media-frame{position:relative}.td-shot-media-card .td-media-preview{min-height:64px;border:0;border-radius:0}.td-shot-media-card .td-media-preview img,.td-shot-media-card .td-media-preview video{height:70px;object-fit:cover}.td-shot-media-card .td-media-preview.empty,.td-shot-media-card .td-media-preview.unavailable{height:70px;font-size:11px}.td-shot-media-card .td-media-preview audio{width:calc(100% - 8px)}.td-form label.td-shot-media-toggle{position:absolute;top:5px;right:5px;z-index:2;display:flex;align-items:center;justify-content:center;width:22px;height:22px;padding:0;border-radius:5px;background:#090d12d9;border:1px solid #ffffff38;cursor:pointer}.td-form label.td-shot-media-toggle input{width:14px;height:14px;margin:0}.td-shell button.td-shot-media-name{display:block;width:100%;overflow:hidden;padding:5px 8px;border:0;border-radius:0;background:transparent;font-size:12px;text-align:left;text-overflow:ellipsis;white-space:nowrap}.td-shell button.td-shot-media-name:hover{color:var(--td-accent)}.td-shot-media-name i{margin-right:4px;color:var(--td-accent);font-style:normal;font-size:9px}.td-preview{display:flex;flex-direction:column;gap:12px;overflow:auto;padding:0!important;border:0!important;background:transparent!important}.td-card{border:1px solid var(--td-line);border-radius:var(--td-radius);background:var(--td-panel)}.td-card>header{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 12px;border-bottom:1px solid var(--td-line)}.td-card-body{display:flex;flex-direction:column;gap:9px;padding:12px}.td-card-body ul.errors{margin:0;padding-left:18px}.td-card-body p{margin:0}.td-summary-counts{color:var(--td-muted);font-size:11.5px;white-space:nowrap}.td-slot-list{display:grid;gap:3px;margin:0;padding:0;list-style:none;font-size:12.5px}.td-slot-list li{display:flex;gap:8px}.td-slot-list code{min-width:84px;color:#9ee6c7}.td-shell .td-link-button{align-self:flex-start;padding:0;border:0;background:transparent;color:var(--td-relay);font-size:12.5px}.td-compiled{max-height:360px;margin:0;overflow:auto;padding:10px;border-radius:6px;background:#0d1117;font-family:var(--td-mono);font-size:12px;white-space:pre-wrap}.td-take-player,.td-lazy-player video{display:block;width:100%;max-height:300px;border-radius:6px;background:#06090c}.td-take-strip{display:flex;gap:6px;overflow-x:auto;padding-bottom:2px}.td-shell button.td-take{position:relative;flex:none;width:84px;padding:0;overflow:hidden;border:2px solid transparent;border-radius:6px;background:#06090c}.td-shell button.td-take.selected{border-color:var(--td-accent)}.td-take .td-result-thumb{width:100%;aspect-ratio:16/9;border-radius:0}.td-take>span{position:absolute;left:3px;bottom:2px;padding:0 5px;border-radius:4px;background:#000a;font-size:10.5px}.td-take-actions{display:flex;flex-wrap:wrap;gap:6px}.td-result-empty{min-height:120px;display:flex;align-items:center;justify-content:center;padding:12px;border:1px dashed var(--td-line-strong);border-radius:7px;color:var(--td-muted);text-align:center}.td-result-empty.running{border-color:var(--td-accent);color:var(--td-accent);animation:td-pulse 1.6s infinite}.td-assets-panel{display:flex;flex-direction:column;gap:16px;max-width:1500px;margin:0 auto}.td-assets-toolbar{position:sticky;top:-14px;z-index:5;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px;padding:10px 12px;border:1px solid var(--td-line);border-radius:var(--td-radius);background:var(--td-panel)}.td-assets-summary,.td-assets-actions{display:flex;flex-wrap:wrap;align-items:center;gap:10px}.td-empty-state{padding:36px;border:1px dashed var(--td-line-strong);border-radius:var(--td-radius);color:var(--td-muted);text-align:center}.td-empty-state strong{color:var(--td-text);font-size:15px}.td-empty-state p{max-width:620px;margin:8px auto 0}.td-asset-group>h3{display:flex;align-items:center;gap:8px;margin-bottom:10px}.td-asset-group>h3 span{padding:0 7px;border-radius:999px;background:var(--td-panel-3);color:var(--td-muted);font-size:11.5px;font-weight:500}.td-asset-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(250px,100%),1fr));gap:12px;align-items:start}.td-asset-card{display:flex;min-width:0;flex-direction:column;overflow:hidden;border:1px solid var(--td-line);border-radius:var(--td-radius);background:var(--td-panel);transition:border-color .12s}.td-asset-card.expanded{grid-column:1/-1}.td-asset-card.expanded .td-asset-note{display:block;overflow-wrap:anywhere}.td-asset-card.missing{border-color:#6b5527}.td-asset-card.dragging{border-color:var(--td-accent);box-shadow:0 0 0 2px #5fd0a033}.td-asset-card.disabled{opacity:.55}.td-asset-card-media{position:relative;height:170px;background:#0b0f14}.td-asset-card-media .td-media-preview{height:100%;min-height:0;border:0;border-radius:0}.td-asset-card-media .td-media-preview img,.td-asset-card-media .td-media-preview video{height:170px;object-fit:contain}.td-asset-drop{display:flex;height:100%;flex-direction:column;align-items:center;justify-content:center;gap:4px;margin:8px;border:1px dashed #6b5527;border-radius:6px;color:var(--td-warn);cursor:pointer}.td-asset-drop:hover{background:var(--td-warn-dim)}.td-asset-drop small{color:var(--td-muted);font-size:11.5px}.td-asset-drop input{display:none}.td-asset-kind,.td-asset-status{position:absolute;top:8px;padding:1px 8px;border-radius:999px;background:#090d12d9;font-size:11.5px}.td-asset-kind{left:8px;color:var(--td-text)}.td-asset-status{right:8px}.td-asset-status.ok{color:var(--td-accent)}.td-asset-status.warn{color:var(--td-warn)}.td-asset-card-body{display:flex;flex-direction:column;gap:8px;padding:10px}.td-asset-card-title{display:flex;gap:6px}.td-asset-card-title input{min-width:0;flex:1;font-weight:600}.td-shell .td-asset-card-title button{flex:none;padding:4px 8px;font-family:var(--td-mono);font-size:12px}.td-asset-note{display:-webkit-box;margin:0;overflow:hidden;color:var(--td-muted);font-size:12.5px;line-height:1.55;-webkit-line-clamp:3;-webkit-box-orient:vertical}.td-asset-card-actions{display:flex;flex-wrap:wrap;gap:6px}.td-asset-card-actions>*{font-size:12.5px}.td-file-label{display:inline-flex;align-items:center;padding:6px 10px;border:1px solid var(--td-line-strong);border-radius:6px;background:var(--td-panel-3);cursor:pointer}.td-file-label:hover{border-color:var(--td-accent)}.td-file-label input{display:none}.td-asset-details{display:flex;min-width:0;flex-direction:column;gap:8px;padding-top:8px;border-top:1px solid var(--td-line)}.td-asset-details label{display:flex;min-width:0;flex-direction:column;gap:3px;color:var(--td-muted);font-size:12px}.td-asset-details label small{color:var(--td-faint);overflow-wrap:anywhere}.td-asset-details input,.td-asset-details textarea,.td-asset-details select{min-width:0;width:100%;max-width:100%}.td-asset-detail-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.td-asset-detail-grid .wide{grid-column:1/-1}.td-asset-flags{display:flex;flex-wrap:wrap;align-items:center;gap:10px}.td-asset-flags button{margin-left:auto}.td-gen-prompt{min-width:0}.td-gen-prompt>summary{color:var(--td-relay);cursor:pointer;font-size:12.5px}.td-gen-prompt pre{max-height:220px;margin:6px 0 0;overflow:auto;padding:8px;border-radius:6px;background:#0d1117;font-family:var(--td-mono);font-size:11.5px;white-space:pre-wrap;overflow-wrap:anywhere}@media(max-width:600px){.td-asset-detail-grid{grid-template-columns:minmax(0,1fr)}}.td-media-preview{min-height:120px;display:flex;align-items:center;justify-content:center;overflow:hidden;border:1px solid var(--td-line);border-radius:7px;background:#0b0f14;color:var(--td-muted);text-align:center}.td-media-preview img,.td-media-preview video{display:block;width:100%;height:200px;object-fit:contain;background:#090c10}.td-media-preview audio{display:block;width:calc(100% - 16px)}.td-media-preview.empty,.td-media-preview.unavailable{padding:12px}.td-review{display:flex;flex-direction:column;gap:12px;max-width:1700px;margin:0 auto}.td-review-steps{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.td-step{display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid var(--td-line);border-radius:var(--td-radius);background:var(--td-panel);color:var(--td-muted)}.td-step b{display:grid;flex:none;place-items:center;width:26px;height:26px;border-radius:50%;background:var(--td-panel-3);color:var(--td-muted)}.td-step div{display:flex;min-width:0;flex-direction:column}.td-step strong{color:var(--td-text);font-weight:600}.td-step span{overflow:hidden;font-size:12px;text-overflow:ellipsis;white-space:nowrap}.td-step.active{border-color:#2f6b52;background:var(--td-accent-dim)}.td-step.active b{background:var(--td-accent);color:#07140e}.td-step.done b{background:#2f6b52;color:#d9fff0}.td-review-actions{display:flex;flex-wrap:wrap;gap:10px}.td-action-group{display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:8px 10px;border:1px solid var(--td-line);border-radius:var(--td-radius);background:var(--td-panel)}.td-action-title{color:var(--td-faint);font-size:12px}.td-denoise{display:flex!important;flex-direction:row!important;align-items:center;gap:8px;color:var(--td-muted);font-size:12.5px}.td-shell .td-denoise input{width:120px;padding:0;accent-color:var(--td-accent)}.td-denoise b{min-width:34px;color:var(--td-accent);font-variant-numeric:tabular-nums}.td-run-bar{display:flex;align-items:center;gap:12px;padding:10px 14px;border:1px solid var(--td-line);border-radius:var(--td-radius);background:var(--td-panel)}.td-run-bar>div{display:flex;min-width:0;flex:1;align-items:baseline;gap:10px}.td-run-bar span{overflow:hidden;color:var(--td-muted);text-overflow:ellipsis;white-space:nowrap}.td-run-bar.running{border-color:#2f6b52}.td-run-bar.running strong{color:var(--td-accent)}.td-run-bar.error{border-color:#7a3a40;background:var(--td-danger-dim)}.td-run-bar.error strong{color:var(--td-danger)}.td-run-bar.done strong{color:var(--td-accent)}.td-run-bar progress{width:220px;height:8px;accent-color:var(--td-accent)}.td-run-bar b{min-width:40px;color:var(--td-accent);text-align:right}.td-review-filter{display:flex;flex-wrap:wrap;align-items:center;gap:6px}.td-shell .td-review-filter button{border-radius:999px;padding:4px 12px;font-size:12.5px}.td-shell .td-review-filter button.active{border-color:var(--td-accent);color:var(--td-accent)}.td-review-hint{margin-left:auto;color:var(--td-faint);font-size:12px}.td-review-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(380px,1fr));gap:12px;align-items:start}.td-review-card{display:flex;flex-direction:column;gap:8px;padding:10px;border:1px solid var(--td-line);border-radius:var(--td-radius);background:var(--td-panel)}.td-review-card.approved{border-color:#2f6b52}.td-review-card.redo{border-color:#6b5527}.td-review-card.off{opacity:.55}.td-review-card.running{box-shadow:0 0 0 2px #5fd0a055}.td-review-card>header{display:flex;align-items:center;justify-content:space-between;gap:8px}.td-shell .td-review-title{min-width:0;overflow:hidden;padding:0;border:0;background:transparent;font-weight:600;text-align:left;text-overflow:ellipsis}.td-shell .td-review-title:hover{color:var(--td-accent)}.td-review-title em{margin-right:6px;color:var(--td-faint);font-style:normal}.td-review-tags{display:flex;flex:none;gap:4px}.td-review-tags i{padding:0 7px;border-radius:999px;background:var(--td-panel-3);color:var(--td-muted);font-size:11.5px;font-style:normal}.td-review-tags i.relay{background:var(--td-relay-dim);color:var(--td-relay)}.td-review-tags i.approved{background:var(--td-accent-dim);color:var(--td-accent)}.td-review-tags i.redo{background:var(--td-warn-dim);color:var(--td-warn)}.td-review-media{position:relative}.td-lazy-player{display:flex;aspect-ratio:16/9;align-items:center;justify-content:center;overflow:hidden;border-radius:6px;background:#06090c;color:var(--td-faint)}.td-lazy-player video{width:100%;height:100%;max-height:none;object-fit:contain}.td-review-media>.td-result-empty{aspect-ratio:16/9;min-height:0}.td-review-media-switch{position:absolute;top:6px;right:6px;display:flex;overflow:hidden;border:1px solid var(--td-line-strong);border-radius:6px}.td-shell .td-review-media-switch button{padding:2px 9px;border:0;border-radius:0;background:#090d12d9;font-size:11.5px}.td-shell .td-review-media-switch button.active{background:var(--td-accent);color:#07140e}.td-review-warning{margin:0;padding:6px 9px;border-radius:6px;background:var(--td-warn-dim);color:var(--td-warn);font-size:12px}.td-review-note{display:-webkit-box;margin:0;overflow:hidden;color:var(--td-muted);font-size:12.5px;white-space:pre-line;-webkit-line-clamp:4;-webkit-box-orient:vertical;cursor:help}.td-review-card>footer{display:flex;flex-wrap:wrap;gap:6px}.td-shell .td-review-card>footer button{padding:5px 10px;font-size:12.5px}.td-shell .td-review-card>footer button.ok.active{border-color:var(--td-accent);background:var(--td-accent-dim);color:var(--td-accent)}.td-shell .td-review-card>footer button.warn.active{border-color:var(--td-warn);background:var(--td-warn-dim);color:var(--td-warn)}.settings{max-width:860px;margin:0 auto;padding:18px;border:1px solid var(--td-line);border-radius:var(--td-radius);background:var(--td-panel)}.td-settings-grid{display:grid;grid-template-columns:2fr 1fr 100px 1fr;gap:10px}.td-settings-grid .td-setting-check{justify-content:space-between}.td-setting-check>span:last-child{display:flex;align-items:center;gap:7px;color:var(--td-text)}.td-setting-check input{width:15px!important;height:15px;margin:0}.td-project-cleanup{display:grid;gap:9px;margin-top:18px}.td-project-cleanup h3{color:var(--td-danger)}.td-project-cleanup article{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:12px 14px;border:1px solid #5a2f35;border-radius:8px;background:#22161a}.td-project-cleanup strong{color:#ffd1d5}.td-project-cleanup p{margin:4px 0 0;color:#c99da2;font-size:12.5px;line-height:1.5}.td-project-cleanup button{min-width:120px;flex:none}.td-batch-overlay{position:fixed;top:0;right:0;bottom:0;left:0;z-index:20;display:flex;align-items:center;justify-content:center;padding:28px;background:#05080dcc}.td-confirm{width:min(440px,100%);padding:18px;border:1px solid var(--td-line-strong);border-radius:10px;background:var(--td-panel);box-shadow:0 20px 70px #000b}.td-confirm p{color:var(--td-muted)}.td-confirm footer{display:flex;justify-content:flex-end;gap:8px}.td-toasts{position:fixed;right:20px;bottom:20px;z-index:40;display:flex;flex-direction:column;gap:8px;max-width:420px;pointer-events:none}.td-toast{padding:10px 14px;border:1px solid #2f6b52;border-radius:8px;background:#122019;color:var(--td-text);box-shadow:0 10px 30px #0009;animation:td-toast-in .18s ease-out}.td-toast.error{border-color:#7a3a40;background:#2a1418;color:#ffd1d5}@keyframes td-toast-in{0%{opacity:0;transform:translateY(8px)}}.td-batch-panel{display:flex;flex-direction:column;width:min(1040px,100%);max-height:min(820px,calc(100vh - 56px));overflow:hidden;border:1px solid var(--td-line);border-radius:10px;background:var(--td-panel);box-shadow:0 20px 70px #000b}.td-batch-panel>.td-batch-header{display:flex;align-items:center;justify-content:space-between;padding:15px 18px;border-bottom:1px solid var(--td-line)}.td-batch-header h2{font-size:17px;margin:0}.td-batch-header p{margin:3px 0 0;color:var(--td-muted)}.td-batch-header>button{font-size:20px;line-height:1;padding:5px 9px}.td-batch-tools{display:grid;grid-template-columns:1fr 1.4fr;gap:12px;padding:14px 18px;border-bottom:1px solid var(--td-line);background:#151b23}.td-batch-tools>div{display:flex;align-items:end;gap:8px;padding:10px;border:1px solid var(--td-line);border-radius:7px}.td-batch-tools label{display:flex;flex:1;flex-direction:column;gap:4px;color:var(--td-muted);white-space:nowrap}.td-batch-tools label>span,.td-batch-duration{display:flex;align-items:center;gap:6px}.td-batch-tools input{width:100%}.td-batch-tools em{color:var(--td-muted);font-style:normal}.td-batch-tools button{white-space:nowrap}.td-batch-global-actions{display:flex;align-items:center;justify-content:flex-end;gap:12px;padding:9px 22px;border-bottom:1px solid var(--td-line);background:#171e27;color:var(--td-muted)}.td-batch-global-actions button.active{border-color:#527e6c;background:#1b302a;color:var(--td-accent)}.td-batch-table{overflow:auto;padding:0 18px}.td-batch-row{display:grid;grid-template-columns:42px minmax(180px,1fr) 100px 150px 120px;gap:10px;align-items:center;padding:8px 4px;border-bottom:1px solid #2a3442}.td-batch-table-head{position:sticky;top:0;z-index:1;background:var(--td-panel);color:var(--td-muted);font-weight:600}.td-batch-duration input{min-width:0;width:100%}.td-batch-duration>span{color:var(--td-muted)}.td-batch-enabled,.td-batch-relay{display:flex;align-items:center;gap:7px;justify-content:flex-start;color:var(--td-text)}.td-batch-enabled input,.td-batch-relay input{width:17px;height:17px;margin:0}.td-batch-panel>footer{display:flex;justify-content:flex-end;gap:8px;padding:13px 18px;border-top:1px solid var(--td-line)}.td-asset-batch-panel{display:flex;flex-direction:column;width:min(1420px,100%);max-height:min(880px,calc(100vh - 56px));overflow:hidden;border:1px solid var(--td-line);border-radius:10px;background:var(--td-panel);box-shadow:0 20px 70px #000b}.td-asset-batch-panel>.td-batch-header{display:flex;align-items:center;justify-content:space-between;padding:15px 18px;border-bottom:1px solid var(--td-line)}.td-asset-batch-panel>footer{display:flex;justify-content:flex-end;gap:8px;padding:13px 18px;border-top:1px solid var(--td-line)}.td-asset-dropzone{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;min-height:112px;margin:14px 18px 10px;border:1px dashed #597084;border-radius:9px;background:#151b23;color:var(--td-text);transition:border-color .15s,background .15s}.td-asset-dropzone:hover,.td-asset-dropzone.dragging{border-color:var(--td-accent);background:#1b2c28}.td-asset-dropzone span{color:var(--td-muted);font-size:12px}.td-asset-dropzone input{display:none}.td-asset-batch-warning{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:0 18px 10px;padding:8px 10px;border:1px solid #836a32;border-radius:7px;background:#3a301c;color:#f4d991}.td-asset-batch-warning span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.td-asset-batch-warning button{padding:2px 7px}.td-asset-batch-summary{display:flex;align-items:center;justify-content:space-between;padding:8px 18px;border-top:1px solid var(--td-line);border-bottom:1px solid var(--td-line);background:#151b23;color:var(--td-muted)}.td-asset-batch-summary button{padding:5px 8px}.td-asset-batch-list{overflow:auto;padding:0 18px 10px}.td-asset-batch-row{display:grid;grid-template-columns:minmax(210px,1.4fr) minmax(150px,1fr) 115px 135px 105px 72px;gap:10px;align-items:center;padding:8px 4px;border-bottom:1px solid #2a3442}.td-asset-batch-head{position:sticky;top:0;z-index:2;padding-top:10px;background:var(--td-panel);color:var(--td-muted);font-weight:600}.td-asset-batch-row.invalid{background:#3b202560}.td-asset-batch-row.imported{background:#17372d55}.td-asset-batch-file{display:flex;min-width:0;flex-direction:column;gap:2px}.td-asset-batch-file strong,.td-asset-batch-file small,.td-asset-batch-file em{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.td-asset-batch-file small{color:var(--td-muted);font-weight:400}.td-asset-batch-file em{color:var(--td-danger);font-size:11px;font-style:normal}.td-asset-batch-duration,.td-asset-batch-audio{display:flex;align-items:center;gap:6px;color:var(--td-muted)}.td-asset-batch-duration input{min-width:0;width:100%}.td-asset-batch-audio input{width:17px;height:17px;margin:0}.td-asset-batch-empty{display:flex;min-height:130px;align-items:center;justify-content:center;color:var(--td-muted)}.td-asset-batch-panel button:disabled,.td-asset-batch-panel input:disabled,.td-asset-batch-panel select:disabled{opacity:.55;cursor:not-allowed}.td-asset-picker-actions{display:flex;gap:8px;margin-top:8px}.td-asset-picker-button{padding:7px 12px;border:1px solid var(--td-line);border-radius:6px;background:#222c39;color:var(--td-text);cursor:pointer}.td-asset-picker-button:hover{border-color:var(--td-accent);background:#263b38}.td-asset-picker-button:has(input:disabled){opacity:.55;cursor:not-allowed}.td-asset-batch-fill{display:flex;align-items:center;gap:6px;min-width:0;overflow:hidden;color:var(--td-accent);white-space:nowrap}.td-asset-batch-fill em{padding:0 6px;border-radius:999px;background:var(--td-accent-dim);font-size:11px;font-style:normal}.td-asset-batch-alias{display:flex;flex-direction:column;gap:6px;min-width:0}.td-asset-batch-alias>input{width:100%;min-width:0}.td-asset-conflict-actions{display:flex;flex-wrap:wrap;gap:4px}.td-asset-conflict-actions button{padding:4px 6px;font-size:11px}.td-asset-batch-conflicts{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px;margin:0 18px 10px;padding:10px;border:1px solid #836a32;border-radius:7px;background:#3a301c;color:#f4d991}.td-asset-batch-conflicts>div{display:flex;flex-wrap:wrap;gap:6px}.td-postprocess{display:flex;flex-direction:column;gap:14px;max-width:1500px;margin:0 auto}.td-post-header,.td-post-summary,.td-post-merged{border:1px solid var(--td-line);border-radius:9px;background:var(--td-panel)}.td-post-header{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 16px}.td-post-header h2,.td-post-merged h2{margin:0;font-size:16px}.td-post-header p{margin:4px 0 0;color:var(--td-muted)}.td-post-actions{display:flex;gap:8px;flex:none}.td-post-summary{display:flex;align-items:center;gap:18px;padding:10px 14px;color:var(--td-muted)}.td-post-summary>button{margin-left:auto}.td-post-range{display:flex;align-items:center;gap:6px;margin-left:auto}.td-post-range input{width:64px;padding:6px 7px;text-align:center}.td-post-range button{white-space:nowrap}.td-post-summary>.td-post-range+button{margin-left:0}.td-post-error,.td-post-warning{padding:10px 13px;border-radius:7px}.td-post-error{border:1px solid #8b4149;background:#442228;color:#ffd1d5;white-space:pre-wrap}.td-post-warning{border:1px solid #836a32;background:#3a301c;color:#f4d991}.td-post-shot-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(390px,1fr));gap:12px;align-items:start}.td-post-shot{min-width:0;border:1px solid var(--td-line);border-radius:9px;background:var(--td-panel);overflow:hidden}.td-post-shot.selected{border-color:#527e6c}.td-post-shot.disabled{opacity:.72}.td-post-shot>header{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 12px;border-bottom:1px solid var(--td-line);background:#1d2530}.td-post-shot>header>label{display:flex;align-items:center;gap:9px;min-width:0;cursor:pointer}.td-post-shot>header input{width:18px;height:18px;margin:0;flex:none}.td-post-shot>header label>span{display:flex;min-width:0;gap:8px;align-items:baseline}.td-post-shot>header strong{color:var(--td-text)}.td-post-shot>header em{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--td-muted);font-style:normal}.td-post-shot>header>span{flex:none;padding:2px 7px;border-radius:999px;background:#29313d;color:var(--td-muted)}.td-post-shot-disabled-note{padding:7px 10px;border-bottom:1px solid var(--td-line);background:#332b1d;color:#e5c77d;font-size:11px}.td-post-shot-empty{min-height:96px;display:flex;align-items:center;justify-content:center;padding:12px;color:var(--td-muted);text-align:center}.td-post-result-list{display:flex;flex-direction:column;gap:7px;max-height:360px;overflow:auto;padding:9px}.td-post-result{display:grid;grid-template-columns:minmax(0,1fr) 35px;gap:6px;align-items:center;border:1px solid var(--td-line);border-radius:7px;background:#151b23;padding:5px}.td-post-result.selected{border-color:var(--td-accent);background:#1c2a2a}.td-shell button.td-post-result-choice{display:grid;grid-template-columns:112px minmax(0,1fr);gap:9px;align-items:center;min-width:0;padding:0;border:0;background:transparent;text-align:left}.td-post-result-choice>span{display:flex;min-width:0;flex-direction:column;gap:3px}.td-post-result-choice>span>strong{display:flex;align-items:center;gap:6px}.td-post-result-choice>span>strong em{padding:1px 5px;border-radius:999px;background:#183a2e;color:var(--td-accent);font-size:10px;font-style:normal}.td-post-result-choice>span>span,.td-post-result-choice>span>small{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--td-muted)}.td-post-result-choice>span>small{font-size:10px}.td-post-result-play{width:35px;height:35px;padding:0!important}.td-post-merged{padding:12px}.td-post-merged>header>div{display:flex;align-items:center;justify-content:space-between;margin-bottom:11px}.td-post-merged .td-generated-results{display:grid;grid-template-columns:minmax(360px,1.6fr) minmax(300px,1fr);align-items:start}.td-post-merged .td-result-list{max-height:420px}.td-post-preview-overlay{position:fixed;top:0;right:0;bottom:0;left:0;z-index:30;display:flex;align-items:center;justify-content:center;padding:26px;background:#030609d6}.td-post-preview-overlay>section{width:min(980px,100%);max-height:calc(100vh - 52px);overflow:auto;border:1px solid var(--td-line);border-radius:10px;background:var(--td-panel);box-shadow:0 20px 80px #000c}.td-post-preview-overlay header{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-bottom:1px solid var(--td-line)}.td-post-preview-overlay header button{font-size:20px;line-height:1;padding:5px 9px}.td-post-preview-overlay video{display:block;width:100%;max-height:calc(100vh - 170px);background:#070a0e}.td-post-preview-overlay p{margin:0;padding:9px 12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--td-muted)}.td-result-state{padding:2px 7px;border-radius:999px;background:#29313d;color:var(--td-muted);font-size:11px}.td-result-state.found{background:#183a2e;color:var(--td-accent)}.td-generated-video video{display:block;width:100%;max-height:420px;background:#080b0f;border-radius:7px}.td-generated-meta{margin-top:7px;color:var(--td-muted);font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.td-generated-results{display:flex;flex-direction:column;gap:12px}.td-result-list{display:flex;flex-direction:column;gap:7px;max-height:280px;overflow:auto;padding-right:3px}.td-shell button.td-result-item{display:grid;grid-template-columns:112px minmax(0,1fr);gap:10px;align-items:center;width:100%;padding:6px;text-align:left;background:#151b23}.td-shell button.td-result-item.selected{border-color:var(--td-accent);background:#1c2a2a}.td-result-thumb{width:112px;aspect-ratio:16/9;display:flex;align-items:center;justify-content:center;overflow:hidden;border-radius:5px;background:#090c10;color:var(--td-muted)}.td-result-thumb img,.td-result-thumb video{display:block;width:100%;height:100%;object-fit:contain}.td-result-item-copy{display:flex;min-width:0;flex-direction:column;gap:3px}.td-result-item-copy>strong{display:flex;align-items:center;gap:7px;color:var(--td-text)}.td-result-item-copy>strong em{padding:1px 6px;border-radius:999px;background:#183a2e;color:var(--td-accent);font-size:10px;font-style:normal}.td-result-item-copy>span,.td-result-item-copy>small{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--td-muted)}.td-result-item-copy>small{font-size:10px}.td-batch-progress{display:flex;align-items:center;gap:10px;padding:8px 12px;border:1px solid var(--td-line);border-radius:7px;background:#151b23;color:var(--td-muted)}.td-batch-progress progress{width:100%;height:8px;accent-color:var(--td-accent)}.td-batch-progress b{min-width:42px;color:var(--td-accent);text-align:right}.td-postprocess-shell{display:flex;flex-direction:column;gap:12px;max-width:1500px;margin:0 auto}.td-postprocess-shell>.td-postprocess{max-width:none;width:100%;margin:0}.td-post-mode-tabs{display:flex;gap:7px;padding:5px;border:1px solid var(--td-line);border-radius:9px;background:var(--td-panel)}.td-post-mode-tabs button{min-width:130px}.td-shell .td-post-mode-tabs button.active{border-color:#527e6c;background:#1b302a;color:var(--td-accent)}.td-second-pass-panel .td-post-shot>header>span:first-child{display:flex;min-width:0;gap:8px;align-items:baseline;padding:0;background:transparent}.td-second-pass-result{display:grid;grid-template-columns:minmax(0,1fr) 154px;gap:8px;align-items:center;border:1px solid var(--td-line);border-radius:7px;background:#151b23;padding:6px}.td-second-pass-actions{display:flex;min-width:0;flex-direction:column;gap:6px}.td-second-pass-actions select{width:100%;min-width:0;padding:6px}.td-second-pass-terminal{display:flex;min-height:32px;align-items:center;justify-content:center;border:1px solid var(--td-line);border-radius:6px;color:var(--td-muted);font-size:11px;text-align:center}.td-second-pass-run{width:100%;min-height:34px;padding:6px!important}.td-second-pass-error{grid-column:1/-1;padding:6px 8px;border-radius:5px;background:#442228;color:#ffd1d5;font-size:11px;white-space:pre-wrap}.td-delete-panel .td-post-shot>header>span:first-child{display:flex;min-width:0;gap:8px;align-items:baseline;padding:0;background:transparent}.td-delete-result{display:grid;grid-template-columns:minmax(0,1fr) 118px;gap:8px;align-items:center;border:1px solid var(--td-line);border-radius:7px;background:#151b23;padding:6px}.td-delete-result.deleting{opacity:.58}.td-delete-video-button{min-height:40px;padding:6px!important}.td-delete-merged{padding:12px}.td-delete-merged-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(390px,1fr));gap:8px}.td-delete-merged .td-post-result-choice>span>strong{color:var(--td-text)}@media(max-width:1280px){.td-shots{grid-template-columns:230px minmax(0,1fr)}.td-shots>.td-preview{grid-column:1/-1;flex-direction:row;flex-wrap:wrap}.td-shots>.td-preview>.td-card{flex:1 1 340px}.td-shots{height:auto}.td-review-steps{grid-template-columns:1fr 1fr}.td-project-meta{display:none}}@media(max-width:900px){.td-shots{grid-template-columns:1fr}.td-shot-sidebar{max-height:300px}.td-shot-head{grid-template-columns:1fr 1fr}.td-shot-head .grow{grid-column:1/-1}.td-settings-grid{grid-template-columns:1fr 1fr}.td-review-grid,.td-post-shot-list,.td-delete-merged-list,.td-post-merged .td-generated-results{grid-template-columns:1fr}.td-topbar,.td-tabs{flex-wrap:wrap}.td-advanced-body{min-width:0;grid-template-columns:1fr}}.td-assets-actions .td-button input{display:none}.td-assets-actions .td-button{display:inline-flex;align-items:center;cursor:pointer}.td-assets-actions,.td-actions{flex-wrap:wrap}.td-imagegen-overlay{z-index:25;padding:16px}.td-imagegen-panel{display:flex;flex-direction:column;gap:12px;width:min(1040px,100%);min-width:0;max-height:min(980px,calc(100dvh - 32px));overflow:auto;border:1px solid var(--td-line);border-radius:9px;background:var(--td-panel);box-shadow:0 20px 70px #000b}.td-imagegen-panel>*{flex-shrink:0;min-width:0}.td-imagegen-panel>.td-batch-header{position:sticky;top:0;z-index:2;flex:none;padding:13px 16px;background:var(--td-panel)}.td-imagegen-models{display:flex;flex-wrap:wrap;align-items:center;gap:7px;padding:0 16px;color:var(--td-muted)}.td-imagegen-models strong{color:var(--td-text)}.td-imagegen-models code{padding:3px 6px;border:1px solid var(--td-line);border-radius:5px;background:#151b23;font-size:11px;overflow-wrap:anywhere}.td-imagegen-models small{flex-basis:100%;line-height:1.5}.td-imagegen-models>header{display:flex;width:100%;align-items:center;justify-content:space-between;gap:8px}.td-imagegen-model-selects{display:grid;width:100%;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.td-imagegen-model-selects label{display:flex;flex-direction:column;min-width:0;gap:5px}.td-imagegen-model-selects select{width:100%;min-width:0;text-overflow:ellipsis}.td-imagegen-form{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;padding:0 16px}.td-imagegen-form label{display:flex;min-width:0;flex-direction:column;gap:5px;color:var(--td-muted)}.td-imagegen-form label.wide{grid-column:1/-1}.td-imagegen-form textarea{min-height:64px;resize:vertical;line-height:1.5}.td-imagegen-form label small{line-height:1.4}.td-imagegen-form .td-imagegen-seed{grid-column:span 2}.td-imagegen-form .td-imagegen-random{display:flex;grid-column:span 2;flex-direction:row;align-items:center;align-self:end;min-height:36px}.td-imagegen-form .td-imagegen-random input{width:17px;height:17px;margin:0}.td-imagegen-pending,.td-imagegen-record{display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:8px 16px;border-top:1px solid var(--td-line);border-bottom:1px solid var(--td-line);background:#151b23;color:var(--td-muted);font-size:12px}.td-imagegen-pending button{margin-left:auto}.td-imagegen-record span{padding-right:9px;border-right:1px solid var(--td-line)}.td-imagegen-record span:last-child{max-width:230px;overflow:hidden;border:0;text-overflow:ellipsis;white-space:nowrap}.td-imagegen-results{padding:0 16px}.td-imagegen-results>header{display:flex;flex-wrap:wrap;justify-content:space-between;gap:5px;margin-bottom:8px;color:var(--td-muted)}.td-imagegen-results>header strong{color:var(--td-text)}.td-imagegen-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:9px}.td-imagegen-grid article{display:flex;min-width:0;flex-direction:column;gap:6px;padding:7px;border:1px solid var(--td-line);border-radius:7px;background:#151b23}.td-imagegen-grid img{display:block;width:100%;aspect-ratio:4/3;object-fit:contain;background:#080b0f;border-radius:4px}.td-imagegen-grid small{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--td-muted)}.td-imagegen-grid button{width:100%;min-height:34px}.td-imagegen-error{margin:0 16px;padding:9px 11px;border:1px solid #8b4149;border-radius:6px;background:#442228;color:#ffd1d5;white-space:pre-wrap;overflow-wrap:anywhere}.td-imagegen-panel>footer{position:sticky;bottom:0;z-index:2;display:flex;flex-wrap:wrap;align-items:center;justify-content:flex-end;gap:8px;padding:11px 16px;border-top:1px solid var(--td-line);background:var(--td-panel)}.td-imagegen-footer-note{margin-right:auto;color:var(--td-muted);font-size:11px;line-height:1.4}.td-imagegen-batch-selection,.td-imagegen-batch-outcomes{margin:0 16px;display:flex;flex-direction:column;gap:8px}.td-imagegen-batch-selection>header{display:flex;align-items:center;flex-wrap:wrap;gap:8px}.td-imagegen-batch-list{max-height:240px;overflow:auto;border:1px solid var(--td-line);border-radius:6px}.td-imagegen-batch-list>label{display:flex;align-items:center;flex-wrap:wrap;gap:8px;padding:9px;border-bottom:1px solid var(--td-line);cursor:pointer}.td-imagegen-batch-list input{width:17px;height:17px;flex:none}.td-imagegen-batch-list small{flex-basis:100%;padding-left:25px;overflow-wrap:anywhere;color:var(--td-muted)}.td-imagegen-batch-selection>small{color:var(--td-muted);line-height:1.5}.td-imagegen-batch-outcomes{padding:10px;border:1px solid var(--td-line);border-radius:6px;overflow-wrap:anywhere}.td-imagegen-batch-outcomes>header{flex:none;line-height:1.5}.td-imagegen-batch-log{min-height:100px;max-height:min(320px,35dvh);overflow:auto;overscroll-behavior:contain;scrollbar-gutter:stable}.td-imagegen-log-row{display:grid;grid-template-columns:minmax(100px,1fr) minmax(0,3fr);gap:10px;padding:8px 4px;border-bottom:1px solid var(--td-line);line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}.td-imagegen-log-row>*{min-width:0}.td-imagegen-log-row.error>span{color:#ffd1d5}@media(max-width:600px){.td-imagegen-model-selects{grid-template-columns:1fr}.td-imagegen-log-row{grid-template-columns:1fr;gap:3px}.td-imagegen-batch-log{max-height:30dvh}.td-imagegen-panel .td-batch-progress{flex-wrap:wrap}.td-imagegen-panel .td-batch-progress>span{flex-basis:100%;overflow-wrap:anywhere}}@media(max-width:600px){.td-imagegen-overlay{align-items:flex-end;padding:0}.td-imagegen-panel{width:100%;max-height:94vh;border-radius:9px 9px 0 0}.td-imagegen-form{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;padding:0 12px}.td-imagegen-form label.wide{grid-column:1/-1}.td-imagegen-models,.td-imagegen-results{padding-right:12px;padding-left:12px}.td-imagegen-panel>.td-batch-header,.td-imagegen-panel>footer{padding-right:12px;padding-left:12px}.td-imagegen-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.td-imagegen-footer-note{flex-basis:100%}}.td-modal{--td-bg:#0e1116;--td-panel:#171c24;--td-panel-2:#1c2430;--td-panel-3:#252f3c;--td-line:#2a3442;--td-line-strong:#404f62;--td-text:#edf0f5;--td-muted:#a6b2c3;--td-faint:#7e8da2;--td-accent:#d7f390;--td-accent-dim:#2c3823;--td-radius:12px}.td-workspace-rail{grid-area:rail;display:flex;min-height:0;flex-direction:column;gap:24px;padding:24px 14px 16px;border-right:1px solid var(--td-line);background:#131820;overflow:auto}.td-rail-brand{display:flex;align-items:center;gap:10px;padding:0 6px}.td-rail-brand h1{font-size:16px}.td-rail-brand small{color:var(--td-faint);font-size:9px;letter-spacing:1.2px}.td-brand-mark{display:grid;place-items:center;flex:none;width:38px;height:38px;border-radius:11px;background:var(--td-accent);color:#1b2412;font-size:16px;font-weight:800;letter-spacing:-1px}.td-shell .td-project-home{display:flex;flex-direction:column;align-items:flex-start;gap:5px;padding:14px;text-align:left;background:var(--td-panel-2);border-color:var(--td-line);white-space:normal}.td-project-home small{color:var(--td-faint);font-size:10px;letter-spacing:1px}.td-project-home strong{display:-webkit-box;overflow:hidden;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow-wrap:anywhere}.td-project-home>span{font:11px var(--td-mono);color:var(--td-muted);overflow-wrap:anywhere}.td-stage-nav{display:flex;flex-direction:column;gap:7px}.td-shell .td-stage-nav>button{display:flex;align-items:center;gap:10px;position:relative;min-height:64px;padding:10px;text-align:left;border:1px solid transparent;background:transparent;border-radius:10px}.td-stage-number{font:11px var(--td-mono);color:var(--td-faint)}.td-stage-nav>button>span:nth-child(2){min-width:0}.td-stage-nav strong,.td-stage-nav small{display:block}.td-stage-nav strong{font-size:13px;font-weight:500}.td-stage-nav small{margin-top:3px;font-size:10px;color:var(--td-faint)}.td-shell .td-stage-nav>button.active{background:var(--td-accent-dim);border-color:#4b5d37}.td-stage-nav>button.active .td-stage-number,.td-stage-nav>button.active strong{color:var(--td-accent)}.td-stage-nav em{margin-left:auto;font:10px var(--td-mono);color:var(--td-muted)}.td-stage-nav em.warn{color:var(--td-warn)}.td-rail-progress{margin-top:auto;padding:15px 7px 0;border-top:1px solid var(--td-line);font-size:11px}.td-rail-progress>div{display:flex;justify-content:space-between;color:var(--td-muted)}.td-rail-progress strong{color:var(--td-accent)}.td-rail-progress progress{display:block;width:100%;height:4px;margin-top:12px;accent-color:var(--td-accent)}.td-rail-progress p{color:var(--td-faint);font-size:11px}.td-shell .td-rail-progress button{padding:0;border:0;background:transparent;font-size:11px;color:var(--td-muted)}.td-topbar{grid-area:header;min-width:0;padding:19px 24px;background:var(--td-bg);border-bottom:0;flex-wrap:nowrap}.td-workspace-title{min-width:0}.td-eyebrow{color:var(--td-faint);font-size:10px;letter-spacing:1px}.td-workspace-title>div{display:flex;align-items:center;gap:12px;margin-top:4px}.td-workspace-title h2{font-size:23px;font-weight:600}.td-actions{gap:8px;flex-wrap:nowrap}.td-shell .td-actions>button{padding:8px 13px}.td-shell button.primary{color:#17210d}.td-project-menu{position:relative}.td-project-menu>summary{padding:8px 12px;cursor:pointer;list-style:none;border:1px solid var(--td-line-strong);border-radius:6px;color:var(--td-muted)}.td-project-menu>summary>span{margin-left:12px}.td-project-menu-items{position:absolute;right:0;top:calc(100% + 8px);z-index:25;display:grid;gap:5px;min-width:180px;padding:8px;border:1px solid var(--td-line-strong);border-radius:10px;background:var(--td-panel);box-shadow:0 12px 36px #0006}.td-project-menu-items>*{text-align:left}.td-session-bar{grid-area:status;display:flex;align-items:center;justify-content:space-between;gap:12px;min-width:0;min-height:45px;margin:0 24px;border-top:1px solid var(--td-line);border-bottom:1px solid var(--td-line)}.td-session-context{color:var(--td-faint);font-size:12px}.td-tab-status{min-width:0;flex-wrap:wrap;justify-content:flex-end}.td-progress-text{font-size:11px}.td-shell main{grid-area:content;min-width:0;padding:18px 24px 20px}.td-shell.td-compact main{padding:10px 16px}.td-shell.td-compact .td-topbar{padding:12px 24px}.td-shots{height:100%;min-height:0;grid-template-columns:minmax(0,1.2fr) minmax(300px,1fr);grid-template-rows:minmax(0,1fr) 158px;grid-template-areas:"composer monitor" "timeline timeline";gap:16px}.td-shot-form{grid-area:composer;padding:18px;gap:14px}.td-composer-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;padding-bottom:14px;border-bottom:1px solid var(--td-line)}.td-composer-heading small{font:10px var(--td-mono);color:var(--td-faint)}.td-composer-heading h3{font-size:16px;margin-top:4px}.td-composer-heading>div:last-child{display:flex;gap:6px}.td-shell .td-composer-heading button{padding:4px 10px}.td-shot-head{grid-template-columns:minmax(0,1fr) 85px 140px;gap:8px}.td-prompt-field .td-highlight-input{min-height:260px}.td-field-label{flex-wrap:wrap;gap:4px 10px}.td-shots>.td-preview{grid-area:monitor;grid-column:auto;display:flex;flex-direction:column;flex-wrap:nowrap;gap:14px}.td-shots>.td-preview>.td-card{flex:none}.td-preview>.td-card:first-child{order:2}.td-preview>.td-card:last-child{order:1}.td-take-player{max-height:42dvh;aspect-ratio:16/9;background:#080b10;object-fit:contain}.td-preview .td-result-empty{aspect-ratio:16/9;min-height:160px;display:grid;place-items:center;background:#10141b}.td-shot-sidebar{grid-area:timeline;display:grid;grid-template-columns:minmax(0,1fr) 210px;grid-template-rows:29px minmax(0,1fr);max-height:none;padding:10px 12px;gap:0 14px;overflow:hidden}.td-timeline-heading{grid-column:1/-1;display:flex;align-items:baseline;gap:14px}.td-timeline-heading strong{font-size:11px;letter-spacing:1px}.td-timeline-heading>span{color:var(--td-faint);font-size:10px}.td-shot-list{display:flex;gap:8px;overflow-x:auto;overflow-y:hidden;padding:3px 0 7px;scroll-snap-type:x proximity}.td-shot-card{flex:0 0 182px;grid-template-columns:minmax(0,1fr);align-content:space-between;gap:5px;padding:9px 10px;margin:0;border-color:var(--td-line);background:var(--td-panel-2);scroll-snap-align:start}.td-shot-card.relay{margin-top:0}.td-shot-card.selected{border-color:var(--td-accent);background:var(--td-accent-dim)}.td-shot-card.selected strong em{color:var(--td-accent)}.td-shot-card-actions{justify-content:flex-end;opacity:1}.td-shot-card-meta{flex-wrap:nowrap;overflow:hidden;font-size:10px}.td-shot-card-meta>*{flex:none}.td-shot-card-main strong{font-size:12px}.td-relay-link{top:50%;left:-9px;width:14px;height:0;border-left:0;border-top:2px dashed var(--td-relay)}.td-shot-sidebar-footer{display:flex;justify-content:center;flex-direction:column;border-top:0;border-left:1px solid var(--td-line);padding:0 0 0 14px;gap:10px}.td-total{font-size:11px}.td-shell .td-shot-sidebar-footer button{font-size:11px;padding:7px 6px}.settings{max-width:1120px;padding:24px;gap:18px}.td-settings-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.td-workflow-settings{border-top:1px solid var(--td-line);padding-top:20px;display:grid;gap:14px}.td-workflow-settings>header{display:flex;justify-content:space-between;align-items:center;gap:12px}.td-workflow-settings>header p{margin:5px 0 0;color:var(--td-faint);font-size:12px}.td-workflow-group{display:grid;gap:12px;padding:14px;border:1px solid var(--td-line);border-radius:9px}.td-workflow-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.td-workflow-fields input,.td-workflow-fields select{min-width:0}.td-workflow-group h3{color:var(--td-muted)}@media(min-width:1700px){.td-shell{grid-template-columns:232px minmax(0,1fr)}.td-shots{grid-template-columns:minmax(0,1.15fr) minmax(430px,1fr)}.td-shot-head{grid-template-columns:minmax(0,1fr) 100px 170px}}@media(max-width:1150px){.td-shell{grid-template-columns:174px minmax(0,1fr)}.td-workspace-rail{padding:20px 9px}.td-rail-brand{gap:7px;padding:0}.td-rail-brand h1{font-size:14px}.td-rail-brand small{font-size:8px}.td-brand-mark{width:30px;height:32px}.td-stage-nav small{font-size:9px}.td-topbar{padding:15px 16px}.td-workspace-title h2{font-size:20px}.td-session-bar{margin:0 16px}.td-session-context{display:none}.td-shell main{padding:14px 16px}.td-shots{grid-template-columns:minmax(0,1fr) minmax(265px,.85fr);height:100%}.td-shot-head{grid-template-columns:1fr 1fr}.td-shot-head .grow{grid-column:1/-1}.td-shot-sidebar{grid-template-columns:minmax(0,1fr) 170px}.td-two-buttons{grid-template-columns:1fr}.td-advanced-body{min-width:0;grid-template-columns:1fr}.td-settings-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:850px){.td-shell{grid-template-columns:68px minmax(0,1fr)}.td-workspace-rail{padding:18px 7px;gap:16px}.td-rail-brand{justify-content:center}.td-rail-brand>div,.td-project-home,.td-rail-progress{display:none!important}.td-shell .td-stage-nav>button{min-height:58px;justify-content:center;padding:7px}.td-stage-nav>button>span:nth-child(2),.td-stage-nav em{display:none}.td-stage-number{font-size:14px}.td-topbar{flex-wrap:wrap;gap:10px}.td-workspace-title h2{font-size:18px}.td-eyebrow{font-size:9px}.td-shell .td-actions>button{padding:6px 8px}.td-project-menu>summary{padding:6px 8px}.td-shots{height:auto;grid-template-columns:minmax(0,1fr);grid-template-rows:auto auto 165px;grid-template-areas:"composer" "monitor" "timeline"}.td-shot-form{overflow:visible}.td-shots>.td-preview{grid-column:auto;overflow:visible}.td-take-player{max-height:none}.td-shot-sidebar{grid-template-columns:minmax(0,1fr) 135px}.td-timeline-heading>span{display:none}.td-shot-list{min-height:0}.td-tab-status{margin-left:0;justify-content:flex-start}.td-session-bar{overflow:visible}.td-progress-text{font-size:10px}.td-settings-grid,.td-workflow-fields{grid-template-columns:minmax(0,1fr)}.settings{padding:14px}.td-review-grid,.td-post-shot-list{grid-template-columns:minmax(0,1fr)}.td-review-steps{grid-template-columns:1fr 1fr}}@media(max-width:520px){.td-shell{grid-template-columns:52px minmax(0,1fr)}.td-workspace-rail{padding:14px 4px}.td-brand-mark{width:30px;height:30px;font-size:13px}.td-topbar{padding:12px 10px}.td-shell .td-actions{gap:5px;flex-wrap:wrap}.td-shell .td-actions>button,.td-project-menu>summary{font-size:11px}.td-shell main{padding:10px}.td-session-bar{margin:0 10px}.td-workspace-title h2{font-size:17px}.td-shot-form{padding:12px}.td-shot-sidebar{grid-template-columns:minmax(0,1fr);grid-template-rows:24px minmax(0,1fr) auto}.td-shot-sidebar-footer{flex-direction:row;align-items:center;border-left:0;border-top:1px solid var(--td-line);padding:5px 0 0}.td-shot-sidebar-footer .td-total{display:none}.td-shot-sidebar-footer .td-two-buttons{display:flex}.td-shots{grid-template-rows:auto auto 195px}.td-review-steps{grid-template-columns:1fr}.td-review-hint{margin-left:0}}@media(max-width:850px){.td-post-header{flex-direction:column;align-items:stretch}.td-post-actions,.td-post-summary{flex-wrap:wrap;gap:8px}.td-post-summary>button,.td-post-range{margin-left:0}.td-post-mode-tabs button{min-width:0;flex:1}.td-post-range{flex-wrap:wrap}.td-workflow-settings>header{flex-wrap:wrap}.td-post-merged>header>div{flex-wrap:wrap;gap:8px}}@media(max-width:850px){.td-project-cleanup{grid-template-columns:minmax(0,1fr)}.td-project-cleanup article{flex-direction:column;align-items:stretch;gap:10px}.td-project-cleanup article>div{min-width:0;overflow-wrap:anywhere}}.td-shell main>section[hidden],.td-config-content>[hidden]{display:none!important}.td-shell .td-config-entry{display:flex;align-items:center;gap:12px;text-align:left;padding:12px;border:1px solid var(--td-line);background:transparent;color:var(--td-muted);margin-top:8px}.td-config-entry>span{font-size:19px}.td-config-entry strong{font-size:12px}.td-shell .td-config-entry.active{border-color:#507f69;background:var(--td-accent-dim);color:var(--td-accent)}.td-config-page{max-width:1200px;margin:auto;display:grid;gap:22px}.td-config-intro{display:flex;justify-content:space-between;align-items:flex-start;gap:20px;padding:24px;border:1px solid var(--td-line);border-radius:16px;background:linear-gradient(125deg,#243c35,#202936 75%)}.td-config-intro h2{margin:10px 0;font-size:22px}.td-config-intro p{max-width:650px;margin:0;color:var(--td-muted);line-height:1.7}.td-config-intro>.td-chip{flex:none;margin-top:4px}.td-config-layout{display:grid;grid-template-columns:200px minmax(0,1fr);gap:24px;align-items:start}.td-config-nav{display:grid;gap:7px;position:sticky;top:0}.td-shell .td-config-nav button{display:grid;gap:6px;text-align:left;white-space:normal;padding:15px 14px;border-color:transparent;background:transparent}.td-config-nav small{color:var(--td-faint);font-size:11px}.td-shell .td-config-nav button.active{background:var(--td-accent-dim);border-color:#42675b;color:var(--td-accent)}.td-config-content{min-width:0}.td-config-card{display:grid;gap:20px;min-width:0;margin:0;padding:24px;border:1px solid var(--td-line);border-radius:16px;background:var(--td-panel);box-shadow:0 10px 30px #0002}.td-config-card legend{padding:0 9px;color:var(--td-text);font-size:16px;font-weight:600}.td-config-card .td-settings-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}.td-config-card p{line-height:1.7;margin:0}.td-config-card label{min-width:0}.td-config-card label:not(.td-config-check){display:flex;flex-direction:column;gap:8px}.td-config-card input,.td-config-card select,.td-config-card textarea{min-width:0;max-width:100%}.td-config-check{display:flex;align-items:center;gap:10px}.td-config-check input{width:17px;height:17px}.td-config-presets{display:flex;flex-wrap:wrap;gap:8px}.td-config-presets button.active{border-color:var(--td-accent);color:var(--td-accent);background:var(--td-accent-dim)}.td-config-notes summary{cursor:pointer;color:var(--td-muted);padding:8px 0}.td-config-notes textarea{width:100%;margin-top:10px}.td-config-card .td-highlight-input{min-height:160px}@media(max-width:1000px){.td-config-layout{grid-template-columns:160px minmax(0,1fr);gap:14px}.td-config-intro{padding:18px}.td-config-intro h2{font-size:19px}.td-config-card{padding:18px}}@media(max-width:850px){.td-config-entry strong{display:none}.td-shell .td-config-entry{justify-content:center;padding:12px 4px}.td-config-layout{grid-template-columns:minmax(0,1fr)}.td-config-nav{position:static;grid-template-columns:repeat(2,minmax(0,1fr))}.td-config-intro{flex-wrap:wrap;gap:8px}.td-config-card .td-settings-grid{grid-template-columns:minmax(0,1fr)}}@media(max-width:520px){.td-config-page{gap:16px}.td-config-intro,.td-config-card{padding:14px}.td-config-intro h2{font-size:17px}.td-config-nav small{display:none}.td-shell .td-config-nav button{padding:12px 8px;font-size:12px}.td-config-card legend{font-size:14px}}.td-modal{--td-bg:#10131b;--td-panel:#1b202b;--td-panel-2:#222937;--td-panel-3:#2a3342;--td-line:#303a49;--td-line-strong:#465264;--td-text:#f0f2f6;--td-muted:#b2bdcc;--td-faint:#8b99ab;--td-accent:#c1e9cf;--td-accent-dim:#263c35;--td-radius:16px}.td-shell{background:radial-gradient(ellipse at 70% -30%,#263243 0,transparent 48%),var(--td-bg)}.td-workspace-rail{gap:22px;padding:26px 16px 18px;background:#171b25;border-right:1px solid #2a3240}.td-rail-brand{gap:12px;padding:0 3px}.td-rail-brand h1{letter-spacing:.02em}.td-rail-brand small{color:#92a1b2;letter-spacing:1.1px}.td-brand-mark{width:40px;height:40px;border:1px solid #d4f2df;border-radius:14px;background:linear-gradient(145deg,#d4f2df,#9ed9bd);box-shadow:0 5px 18px #0003;color:#192c25}.td-shell .td-project-home{gap:6px;padding:15px;border-radius:13px;background:#222a37;border-color:#344151;box-shadow:0 8px 22px #0002}.td-project-home small{text-transform:uppercase}.td-project-home strong{font-size:14px}.td-project-home>span{color:#a6b6c6}.td-stage-nav{gap:5px}.td-shell .td-stage-nav>button{min-height:62px;padding:10px 11px;border-radius:12px}.td-shell .td-stage-nav>button:hover:not(:disabled){background:#252d39}.td-shell .td-stage-nav>button.active{background:#293d39;border-color:#42675b;box-shadow:inset 3px 0 0 var(--td-accent)}.td-stage-number{display:grid;place-items:center;flex:none;width:26px;height:26px;border-radius:8px;background:#28303c;color:#aab8c8;font-size:10px}.td-stage-nav>button.active .td-stage-number{background:#c1e9cf;color:#213a30}.td-stage-nav strong{font-size:13px;font-weight:600}.td-stage-nav small{margin-top:4px;color:#96a4b5}.td-rail-progress{padding:17px 5px 0}.td-rail-progress progress{border-radius:999px;overflow:hidden}.td-rail-progress p{line-height:1.6}.td-topbar{padding:21px 26px 18px;background:transparent}.td-workspace-title h2{font-size:24px;letter-spacing:.02em}.td-eyebrow{color:#96a5b7;font-weight:600;letter-spacing:1.2px}.td-shell button,.td-button,.td-project-menu>summary{border-radius:9px}.td-shell button,.td-button{transition:border-color .16s,background .16s,color .16s,box-shadow .16s}.td-shell button:hover:not(:disabled),.td-button:hover{box-shadow:0 3px 12px #0002}.td-shell button.primary{background:var(--td-accent);border-color:var(--td-accent);color:#1a3025;box-shadow:0 4px 15px #77c49c26}.td-shell button.primary:hover:not(:disabled){filter:brightness(1.05)}.td-session-bar{min-height:48px;margin:0 26px;border-top:1px solid #303947;border-bottom:1px solid #303947}.td-session-context{color:#a3b0c1}.td-shell main{padding:20px 26px 22px}.td-shots{gap:18px;grid-template-rows:minmax(0,1fr) 166px}.td-shot-form,.td-card,.td-shot-sidebar,.td-asset-card,.td-review-card,.td-post-shot,.settings{box-shadow:0 12px 32px #06091030}.td-shot-form{padding:20px;gap:16px;background:linear-gradient(155deg,#202733,#1b202b 38%)}.td-composer-heading{padding-bottom:16px}.td-composer-heading small{color:#a1b3c5;letter-spacing:.08em}.td-composer-heading h3{font-size:17px}.td-shell .td-composer-heading button{min-width:36px;padding:6px 10px}.td-form label,.td-settings-grid label{gap:6px;color:#b5c1d0}.td-shot-head{gap:10px}.td-shell input:not([type=checkbox]):not([type=radio]):not([type=range]),.td-shell textarea,.td-shell select{border-color:#3a4859;background-color:#252e3c}.td-shell input:focus,.td-shell textarea:focus,.td-shell select:focus{border-color:var(--td-accent);box-shadow:0 0 0 3px #b2eac82b}.td-form label.td-toggle{border-radius:9px;background:#252e39}.td-form label.td-toggle:has(input:checked){border-color:#507f69;background:#294338}.td-advanced>summary{border-radius:9px}.td-note{border-radius:10px;background:#232c39}.td-note>summary{padding:10px 12px;color:#c2cbd8}.td-note textarea{padding:11px 12px}.td-field-label{margin-bottom:2px;color:#d3dae4}.td-field-label small{color:#9aaabd}.td-highlight-wrap{border-radius:10px}.td-highlight-backdrop,.td-form textarea.td-highlight-input{padding:12px 13px;line-height:1.7}.td-card{overflow:hidden;background:#1b212c}.td-card>header{padding:13px 15px;background:#202733}.td-card-body{gap:11px;padding:14px}.td-preview .td-result-empty{border-radius:10px;background:#10151d}.td-take-player{border-radius:10px}.td-shot-sidebar{padding:12px 14px;background:#1b212b}.td-timeline-heading{gap:12px}.td-timeline-heading strong{color:#e5eaf1;letter-spacing:.04em}.td-timeline-heading>span{color:#9baabc}.td-shot-list{gap:9px}.td-shot-card{flex-basis:186px;padding:10px 11px;border-radius:11px;background:#252e3b}.td-shot-card:hover{background:#2c3745}.td-shot-card.selected{border-color:#9ed6b8;background:#294238;box-shadow:inset 0 2px #b9e5ca}.td-shot-card-main strong{font-size:12.5px}.td-shot-card-meta{color:#b3c1d0}.td-shot-sidebar-footer{gap:10px}.td-chip{padding:3px 9px}.td-settings-grid,.td-workflow-fields{gap:16px}.td-workflow-group{padding:17px;border-radius:12px;background:#1e2530}.td-assets-toolbar,.td-post-header,.td-post-summary,.td-post-merged,.td-step,.td-action-group,.td-run-bar{border-radius:12px}@media(max-width:1150px){.td-workspace-rail{padding:20px 9px}.td-topbar{padding:15px 16px}.td-session-bar{margin:0 16px}.td-shell main{padding:14px 16px}.td-shots{gap:14px}}@media(max-width:850px){.td-workspace-rail{padding:18px 7px}.td-shell .td-stage-nav>button{padding:7px}.td-stage-number{width:30px;height:30px;font-size:11px}.td-shots{grid-template-rows:auto auto 170px}.td-shot-form{padding:16px}}@media(max-width:520px){.td-workspace-rail{padding:14px 4px}.td-topbar{padding:12px 10px}.td-session-bar{margin:0 10px}.td-shell main{padding:10px}.td-shot-form{padding:13px}.td-shots{grid-template-rows:auto auto 195px}.td-shot-sidebar{padding:10px}}', fr = "yuq-director-styles";
function Ma() {
  if (document.getElementById(fr)) return;
  const e = document.createElement("style");
  e.id = fr, e.textContent = Na, document.head.append(e);
}
Ma();
function Ra() {
  const e = JSON.parse(ja);
  if (!Array.isArray(e.nodes) || !e.nodes.length) throw new Error("内置生图工作流为空");
  return e;
}
const La = "/scripts/app.js", Oa = "/scripts/api.js";
Promise.all([
  import(
    /* @vite-ignore */
    La
  ),
  import(
    /* @vite-ignore */
    Oa
  )
]).then(([{ app: e }, { api: t }]) => {
  const r = t.queuePrompt;
  t.queuePrompt = function(h, c, g) {
    return r.call(this, h, { ...c, output: Aa(c.output) }, g);
  };
  const i = (h) => async (c) => {
    var v, x, u, $;
    const g = {
      ...c.plan,
      pipeline: { ...c.plan.pipeline ?? { firstPassConfirmed: !1, secondPassMode: "super_resolution_second_pass" }, phase: "first_pass", firstPassConfirmed: !1 },
      // 一采只生成基础结果；二采只在审片确认后由后处理支流单独执行。
      shots: c.plan.shots.map((j) => ({ ...j, secondSamplingMode: "off" }))
    }, S = c.shotIds ?? g.shots.filter((j) => j.enabled).map((j) => j.id), T = JSON.stringify(g), y = await e.graphToPrompt(e.rootGraph);
    for (const [j, E] of S.entries()) {
      if ((v = c.signal) != null && v.aborted) throw qe();
      const P = Gt(g, E);
      if (P < 0) throw new Error(`镜头 ${E} 未启用或不存在，无法生成`);
      const C = ya(y.output, { planJson: T, activeIndex: P, projectId: h, baseSeed: g.defaults.baseSeed });
      (x = c.onShotStart) == null || x.call(c, E, j, S.length), (u = c.onProgress) == null || u.call(c, { value: 0, max: 0 }), await sn(t, () => t.queuePrompt(0, { output: C, workflow: y.workflow }), c.onProgress, `镜头 ${E} 一采执行失败`, c.signal), ($ = c.onShotDone) == null || $.call(c, E, j, S.length);
    }
  }, o = async (h) => {
    var C;
    const c = ((C = e.graph) == null ? void 0 : C._nodes) ?? [], g = c.find((N) => N.type === "TheodoreDirector_PostprocessSecondPassSource"), S = c.find((N) => N.type === "TheodoreDirector_SaveSecondPass");
    if (!g || !S || g.id === void 0 || S.id === void 0)
      throw new Error("当前工作流缺少后处理单独二采支流，请载入 YuQ 导播台工作流或接回对应支流");
    const T = g.mode, y = S.mode;
    let v;
    try {
      g.mode = 0, S.mode = 0, v = await e.graphToPrompt(e.rootGraph);
    } finally {
      g.mode = T, S.mode = y;
    }
    const { onProgress: x, signal: u } = h, { payload: $, output: j } = Ia(v.output, String(g.id), String(S.id), h);
    if (u != null && u.aborted) throw qe();
    const E = await (t.fetchApi ? t.fetchApi("/theodore-director/v1/second-pass/prepare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify($),
      signal: u
    }) : fetch("/theodore-director/v1/second-pass/prepare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify($),
      signal: u
    }));
    if (E.status === 404) throw new Error("请更新 YuQ 插件并重启 ComfyUI，当前服务不支持二采接力状态校验");
    const P = await E.json();
    if (!E.ok) throw new Error(P.error || `HTTP ${E.status}`);
    P.skip || await sn(t, () => t.queuePrompt(0, { output: j, workflow: v.workflow }), x, "单独二采任务执行失败", u);
  };
  let s, l;
  const a = () => (s ?? (s = Ra()), l ?? (l = ta(s)), { graph: s, prompt: l }), d = (h, c) => {
    const g = h instanceof Request ? h.url : String(h);
    return t.fetchApi ? t.fetchApi(g, c) : fetch(h, c);
  }, p = async (h, c) => {
    const g = [], S = [];
    for (const y of h.nodes) {
      const v = y.widgets_values_named ?? {};
      y.type === "UNETLoader" && S.push([y.type, "unet_name", v.unet_name]), y.type === "CLIPLoader" && S.push([y.type, "clip_name", v.clip_name]), y.type === "CLIPLoader" && S.push([y.type, "type", v.type]), y.type === "VAELoader" && S.push([y.type, "vae_name", v.vae_name]);
    }
    const T = [...new Set(h.nodes.filter((y) => y.mode !== 4).map((y) => y.type).filter((y) => y !== "Note"))];
    if (await Promise.all(T.map(async (y) => {
      var u, $, j;
      const v = await d(`/object_info/${encodeURIComponent(y)}`, { signal: c });
      if (!v.ok) {
        g.push(`节点 ${y} 不可用（HTTP ${v.status}）`);
        return;
      }
      const x = await v.json();
      if (!x[y]) {
        g.push(`当前 ComfyUI 缺少节点 ${y}`);
        return;
      }
      for (const [E, P, C] of S.filter((N) => N[0] === y)) {
        const N = (j = ($ = (u = x[E]) == null ? void 0 : u.input) == null ? void 0 : $.required) == null ? void 0 : j[P], R = Array.isArray(N) && Array.isArray(N[0]) ? N[0] : [];
        (typeof C != "string" || !R.includes(C)) && g.push(`模型/类型 ${String(C)} 未安装或不在 ${E}.${P} 可用列表中`);
      }
    })), c != null && c.aborted) throw qe();
    if (g.length) throw new Error(g.join(`
`));
  }, m = async (h) => {
    var y, v;
    if (!(((y = e.graph) == null ? void 0 : y._nodes) ?? []).some((x) => x.type === "TheodoreDirector_ImageControls")) return;
    const c = (((v = e.graph) == null ? void 0 : v._nodes) ?? []).filter((x) => x.type === "SaveImage" && x.mode === 2), g = c.map((x) => x.mode);
    let S;
    try {
      c.forEach((x) => {
        x.mode = 0;
      }), S = await e.graphToPrompt(e.rootGraph);
    } finally {
      c.forEach((x, u) => {
        x.mode = g[u];
      });
    }
    const T = Ne(S.output, "TheodoreDirector_ImageControls").filter((x) => Ae(S.output, x, h));
    if (T.length) {
      if (T.length !== 1) throw new Error("当前项目连接了多个生图控制节点，请保留一个");
      return { base: S, controls: S.output[T[0]].inputs };
    }
  }, b = (h) => ({
    defaults: async () => {
      const c = await m(h);
      if (!c) return { ...ra(a().graph), modelOptions: await ia(d) };
      const g = c.controls, S = ur(c.base.output, h, {
        positivePrompt: "",
        negativePrompt: String(g.negative_prompt ?? ""),
        width: Number(g.width ?? 1024),
        height: Number(g.height ?? 1024),
        batchSize: Number(g.batch_size ?? 1),
        seed: Number(g.seed ?? 0),
        filenamePrefix: String(g.filename_prefix ?? "TheodoreDirector/ImageGen/manual/image")
      });
      return { negativePrompt: String(g.negative_prompt ?? ""), width: Number(g.width ?? 1080), height: Number(g.height ?? 720), batchSize: Number(g.batch_size ?? 1), seed: Number(g.seed ?? 0), ...Zo(S.output), models: [], canvasWorkflow: !0, workflowSource: "canvas" };
    },
    register: async (c, g) => {
      const S = await d("/theodore-director/v1/image-generation/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectName: c, filename: g.filename, subfolder: g.subfolder, type: g.type })
      }), T = await S.json();
      if (!S.ok || !T.path) throw new Error(T.error ?? `登记图片失败：HTTP ${S.status}`);
      return T.path;
    },
    recover: async (c) => ({
      promptId: c.promptId,
      createdAt: c.createdAt,
      settings: c.settings,
      images: await dr(c.promptId, void 0, d)
    }),
    queue: async (c) => {
      const { signal: g, onProgress: S, onQueued: T, ...y } = c, v = await m(h), x = Qt({ ...y, workflowSource: v ? "canvas" : void 0 });
      let u, $, j;
      if (v) {
        const C = ur(v.base.output, h, x);
        u = C.output, $ = v.base.workflow, j = C.targetId;
      } else {
        const C = a();
        u = oa(C.prompt, C.graph, x);
        const N = aa(C.graph, u);
        $ = N, await p({ ...N, nodes: N.nodes.filter((R) => u[String(R.id)]) }, g);
      }
      if (g != null && g.aborted) throw qe();
      let E = "";
      if (await sn(t, async () => {
        const C = await t.queuePrompt(0, { output: u, workflow: $ });
        return E = String(C.prompt_id ?? ""), E && (T == null || T(E)), C;
      }, S, "自动生图任务执行失败", g, 6e4, {
        probe: async (C) => {
          const N = await d(`/history/${encodeURIComponent(C)}`);
          if (!N.ok) throw new Error(`查询生图任务状态失败：HTTP ${N.status}`);
          return li(await N.json(), C);
        },
        pollMs: 2500
      }), !E) throw new Error("ComfyUI 没有返回生图任务 ID");
      const P = await dr(E, g, d, j);
      return { promptId: E, createdAt: Date.now(), settings: x, images: P };
    }
  });
  e.registerExtension({
    name: "YuQ.Director.UI",
    beforeConfigureGraph(h) {
      zt(h);
    },
    nodeCreated(h) {
      zt({ nodes: [h] });
    },
    loadedGraphNode(h) {
      zt({ nodes: [h] });
    },
    afterConfigureGraph() {
      zt(e.graph ?? {});
    },
    beforeRegisterNodeDef(h, c) {
      if (c.name === "TheodoreDirector_PostprocessSecondPassSource") {
        const S = h.prototype.onNodeCreated;
        h.prototype.onNodeCreated = function() {
          var y, v;
          S == null || S.apply(this);
          const T = (y = this.widgets) == null ? void 0 : y.find((x) => x.name === "request_json");
          T && (T.type = "hidden", T.computeSize = () => [0, -4]), this.size = [Math.max(((v = this.size) == null ? void 0 : v[0]) ?? 300, 380), 80];
        };
        return;
      }
      if (c.name !== "TheodoreDirector_Project") return;
      const g = h.prototype.onNodeCreated;
      h.prototype.onNodeCreated = function() {
        var T, y;
        g == null || g.apply(this);
        const S = (T = this.widgets) == null ? void 0 : T.find((v) => v.name === "plan_json");
        S && (S.type = "hidden", S.computeSize = () => [0, -4], this.addWidget("button", "打开 YuQ 导播台", null, () => {
          var v;
          try {
            const x = JSON.parse(String(S.value)), u = ((v = e.graph) == null ? void 0 : v._nodes) ?? [], $ = u.some((N) => N.type === "TheodoreDirector_PostprocessSecondPassSource") && u.some((N) => N.type === "TheodoreDirector_SaveSecondPass"), j = (N) => {
              var R, F;
              S.value = JSON.stringify(N, null, 2), this.setDirtyCanvas(!0, !0), (F = (R = e.graph) == null ? void 0 : R.setDirtyCanvas) == null || F.call(R, !0, !0);
            }, E = u.some((N) => {
              var R;
              return N.type === "TheodoreDirector_SelectShot" && ((R = N.outputs) == null ? void 0 : R.some((F) => {
                var I;
                return ["super-res 2nd pass", "latent upscale 2nd pass", "super-res only"].includes(F.name) && ((I = F.links) == null ? void 0 : I.length);
              }));
            }), P = (N, R = /* @__PURE__ */ new Set()) => {
              var I;
              const F = String(N.id);
              return F === String(this.id) ? !0 : R.has(F) ? !1 : (R.add(F), !!((I = N.inputs) != null && I.some((ne) => {
                var M, V, Z, Y, L, _;
                if (ne.link == null) return !1;
                if ((Z = (V = (M = this.outputs) == null ? void 0 : M[0]) == null ? void 0 : V.links) != null && Z.includes(ne.link)) return !0;
                const k = (_ = (L = (Y = e.graph) == null ? void 0 : Y.links) == null ? void 0 : L[ne.link]) == null ? void 0 : _.origin_id, D = u.find((K) => String(K.id) === String(k));
                return D ? P(D, R) : !1;
              })));
            }, C = u.some((N) => N.type === "TheodoreDirector_ShotControl" && P(N));
            Ta(x, j, E, $ ? o : void 0, i(String(this.id)), j, b(String(this.id)), C);
          } catch (x) {
            window.alert(`YuQ Director: ${x instanceof Error ? x.message : String(x)}`);
          }
        }), this.size = [Math.max(((y = this.size) == null ? void 0 : y[0]) ?? 300, 360), 110]);
      };
    }
  });
});
