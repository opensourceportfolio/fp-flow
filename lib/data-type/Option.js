"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.getOrElse = exports.of = exports.pure = exports.chainC = exports.chain = exports.map2 = exports.apC = exports.ap = exports.mapC = exports.map = exports.some = exports.none = void 0;

class OptionType {}

function inj(a) {
  // $FlowFixMe
  return a;
}

function prj(fa) {
  // $FlowFixMe
  return fa;
}

/****** Imlementation ******/
// $FlowFixMe
const none = inj(null);
exports.none = none;

const some = t => inj(t);

exports.some = some;

const map = (fn, fa) => {
  const val = prj(fa);
  return val == null ? none : some(fn(val));
};

exports.map = map;

const mapC = fn => fa => map(fn, fa);

exports.mapC = mapC;

const ap = (fn, fa) => {
  const f = prj(fn);
  return f == null ? none : map(f, fa);
};

exports.ap = ap;

const apC = f => fa => ap(f, fa);

exports.apC = apC;

const map2 = (f, fa, fb) => {
  const a = prj(fa);
  const b = prj(fb);
  return a == null || b == null ? none : some(f(a, b));
};

exports.map2 = map2;

const chain = (fn, fa) => {
  const val = prj(fa);
  return val == null ? none : fn(val);
};

exports.chain = chain;

const chainC = fn => fa => chain(fn, fa);

exports.chainC = chainC;
const pure = some;
exports.pure = pure;
const of = pure;
exports.of = of;

const getOrElse = (a, alt) => {
  var _prj;

  return (_prj = prj(a)) !== null && _prj !== void 0 ? _prj : alt;
};

exports.getOrElse = getOrElse;
const fns = {
  ap,
  apC,
  chain,
  chainC,
  getOrElse,
  map,
  mapC,
  map2,
  of,
  pure,
  none,
  some
};
var _default = fns;
exports.default = _default;