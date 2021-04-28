"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.task = exports.of = exports.pure = exports.chainC = exports.chain = exports.map2 = exports.apC = exports.ap = exports.mapC = exports.map = void 0;

class TaskType {}

function inj(a) {
  // $FlowFixMe
  return a;
}

function prj(fa) {
  // $FlowFixMe
  return fa;
}

/****** Imlementation ******/
const map = (fn, fa) => {
  return inj(async () => {
    const a = await prj(fa)();
    return fn(a);
  });
};

exports.map = map;

const mapC = fn => {
  return fa => map(fn, fa);
};

exports.mapC = mapC;

const ap = (fn, fa) => {
  return inj(async () => {
    const pf = prj(fn);
    const pa = prj(fa);
    const [f, a] = await Promise.all([pf(), pa()]);
    return f(a);
  });
};

exports.ap = ap;

const apC = fn => {
  return fa => ap(fn, fa);
};

exports.apC = apC;

const map2 = (f, fa, fb) => {
  return inj(async () => {
    const pa = prj(fa);
    const pb = prj(fb);
    const [a, b] = await Promise.all([pa(), pb()]);
    return f(a, b);
  });
};

exports.map2 = map2;

const chain = (fn, fa) => {
  return inj(async () => {
    const a = await prj(fa)();
    return prj(fn(a))();
  });
};

exports.chain = chain;

const chainC = fn => {
  return fa => chain(fn, fa);
};

exports.chainC = chainC;

const pure = a => inj(() => Promise.resolve(a));

exports.pure = pure;
const of = pure;
exports.of = of;
const task = inj;
exports.task = task;
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