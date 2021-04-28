"use strict";

var _pipe = require("../../pipe");

var _Option = require("../Option");

test('Option identity', () => {
  const v = (0, _Option.some)(1);

  const identity = v => v;

  const result = (0, _Option.map)(identity, v);
  expect(result).toBe((0, _Option.some)(1));
});
test('Option composition', () => {
  const v = (0, _Option.some)(1);

  const double = v => v * 2;

  const toStr = v => v.toString();

  expect((0, _Option.map)(toStr, (0, _Option.map)(double, v))).toBe((0, _Option.map)(v => toStr(double(v)), v));
});
test('Option piping', () => {
  const res = (0, _pipe.pipe)((0, _Option.some)(1), (0, _Option.mapC)(n => n + 1), (0, _Option.mapC)(n => n * 2), (0, _Option.chainC)(n => (0, _Option.of)(n.toString())));
  expect(res).toBe((0, _Option.some)('4'));
});