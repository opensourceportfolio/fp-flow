// @flow
/* eslint no-redeclare: off */
import { type Map } from './type-class/Functor';
import { type HKT } from './type-class/HKT';

type Curried1<A, R> = (...r: [A]) => R;

type Curried2<A, B, R> = ((...r: [A]) => Curried1<B, R>) & ((...r: [A, B]) => R);

type Curry = (<A, R>((A) => R) => Curried1<A, R>) & (<A, B, R>((A, B) => R) => Curried2<A, B, R>);

// export function curry2<A, B, R>(fn: (a: A, b: B) => R): Curried2<A, B, R> {
//   return (a, b) => (b == null ? (b2) => fn(a, b2) : fn(a, b));
// }

export const curry: Curry = () => {};
