"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.map2 = map2;

var _curry = require("../curry");

var _HKT = require("./HKT");

function map2({
  ap,
  map
}) {
  return (fn, aa, ab) => ap(map((0, _curry.curry2)(fn), aa), ab);
}