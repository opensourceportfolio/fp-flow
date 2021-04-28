// @flow
import { pipe } from '../../function';
import { map, of, some, chain } from '../Option';

test('Option identity', () => {
  const v = some(1);
  const identity = <T>(v: T): T => v;

  const result = map(identity, v);

  expect(result).toBe(some(1));
});

test('Option composition', () => {
  const v = some(1);
  const double = (v: number) => v * 2;
  const toStr = (v: number) => v.toString();

  expect(map(toStr, map(double, v))).toBe(map((v) => toStr(double(v)), v));
});

test('Option piping', () => {
  const res = pipe(
    some(1),
    map((n) => n + 1),
    map((n) => n * 2),
    chain((n) => of(n.toString())),
  );

  expect(res).toBe(some('4'));
});
