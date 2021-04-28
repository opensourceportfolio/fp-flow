"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.map = map;
exports.map2 = map2;

function map({
  chain,
  of
}) {
  return (f, ma) => chain(a => of(f(a)), ma);
}

function map2({
  chain,
  map
}) {
  return (fn, ma, mb) => chain(a => map(b => fn(a, b), mb), ma);
}