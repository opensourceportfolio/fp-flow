"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.attempt = exports.of = exports.pure = exports.chainC = exports.chain = exports.map2 = exports.apC = exports.ap = exports.mapC = exports.map = exports.failure = exports.success = void 0;

class TryType {}

function inj(a) {
  // $FlowFixMe
  return a;
}

function prj(fa) {
  // $FlowFixMe
  return fa;
}

/****** Imlementation ******/
const success = inj; // $FlowFixMe

exports.success = success;

const failure = e => inj(e);

exports.failure = failure;

const map = (fn, fa) => {
  const val = prj(fa);
  return val instanceof Error ? failure(val) : success(fn(val));
};

exports.map = map;

const mapC = fn => fa => map(fn, fa);

exports.mapC = mapC;

const ap = (fn, fa) => {
  const f = prj(fn);
  return f instanceof Error ? failure(f) : map(f, fa);
};

exports.ap = ap;

const apC = f => fa => ap(f, fa);

exports.apC = apC;

const map2 = (f, fa, fb) => {
  const a = prj(fa);
  const b = prj(fb);
  const e = a instanceof Error ? a : b instanceof Error ? b : null;
  return e == null ? success(f(a, b)) : failure(e);
};

exports.map2 = map2;

const chain = (fn, fa) => {
  const val = prj(fa);
  return val instanceof Error ? failure(val) : fn(val);
};

exports.chain = chain;

const chainC = fn => fa => chain(fn, fa);

exports.chainC = chainC;
const pure = inj;
exports.pure = pure;
const of = pure;
exports.of = of;

const attempt = fn => {
  try {
    return success(fn());
  } catch (e) {
    return failure(e);
  }
};

exports.attempt = attempt;
const fns = {
  ap,
  apC,
  chain,
  chainC,
  map,
  mapC,
  map2,
  of,
  pure
};
var _default = fns;
exports.default = _default;