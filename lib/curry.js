"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.curry2 = curry2;

/* eslint no-redeclare: off */
function curry2(fn) {
  return a => b => fn(a, b);
}