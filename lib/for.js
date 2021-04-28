"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _HKT = require("./type-class/HKT");

var _Monad = require("./type-class/Monad");

// $FlowFixMe
const $for = ({
  chain,
  of
}) => {
  return fn => {
    const gen = fn();

    const next = a => {
      const {
        value,
        done
      } = gen.next(a); // $FlowFixMe

      const v = done ? of(value) : value;
      return done ? v : chain(next, v);
    };

    return next();
  };
};

var _default = $for;
exports.default = _default;