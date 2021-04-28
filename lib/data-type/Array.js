"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.traverse = traverse;
exports.sequence = sequence;

var _Applicative = require("../type-class/Applicative");

var _Apply = require("../type-class/Apply");

var _HKT = require("../type-class/HKT");

function traverse(applicative) {
  const {
    of
  } = applicative;
  return (fn, as) => {
    const init = of([]);
    const map2Bound = (0, _Apply.map2)(applicative);
    return as.reduce((bs, a) => map2Bound((bs, b) => bs.concat(b), bs, fn(a)), init);
  };
}

function sequence(applicative) {
  const traverseBound = traverse(applicative);
  return as => traverseBound(a => a, as);
}