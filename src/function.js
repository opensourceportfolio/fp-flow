// @flow

/* eslint no-redeclare: off */

declare function pipe<A>(a: A): A;
declare function pipe<A, B>(a: A, A => B): B;
declare function pipe<A, B, C>(A, (A) => B, (B) => C): C;
declare function pipe<A, B, C, D>(A, (A) => B, (B) => C, (C) => D): D;

// $FlowIgnore[unclear-type]
export function pipe(...args: ((p: mixed) => any)[]): any {
  return args.reduce((param, fn) => fn(param));
}

declare function flow<A>(a: A): A;
declare function flow<A, B>(A => B): A => B;
declare function flow<A, B, C>((A) => B, (B) => C): A => C;
declare function flow<A, B, C, D>((A) => B, (B) => C, (C) => D): A => D;