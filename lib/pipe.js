"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pipe = pipe;

/* eslint no-redeclare: off */
function pipe(...args) {
  return args.reduce((param, fn) => fn(param));
}