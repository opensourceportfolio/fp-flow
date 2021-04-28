// @flow

import { curry } from '../curry';
import {
  type FoldMap,
  type Foldable,
  type Reduce,
  type ReduceUncurried,
  type ReduceCurried,
  foldMap as foldableFoldMap,
} from '../type-class/Foldable';
import { type Map, type MapUncurried } from '../type-class/Functor';
import { type Ap, type ApUncurried } from '../type-class/Apply';
import { type HKT } from '../type-class/HKT';
import { type Monad, type Chain, type ChainUncurried } from '../type-class/Monad';

class TryType {}

function inj<A>(a: A): Try<A> {
  // $FlowFixMe[unclear-type]
  return ((a: any): Try<A>);
}

function prj<A>(fa: Try<A>): A {
  // $FlowFixMe[unclear-type]
  return ((fa: any): A);
}

export type Try<+A> = HKT<TryType, A>;

/****** Imlementation ******/

export const success: <A>(a: A) => Try<A> = inj;

// $FlowFixMe[unclear-type]
export const failure: (Error) => Try<empty> = (e: Error) => ((e: any): Try<empty>);

const mapUncurried: MapUncurried<TryType> = <A, B>(fn: (A) => B, fa: Try<A>): Try<B> => {
  const val: A = prj(fa);

  return val instanceof Error ? failure(val) : success(fn(val));
};

// $FlowFixMe[incompatible-type]
export const map: Map<TryType> = curry(mapUncurried);

export const apUncurried: ApUncurried<TryType> = <A, B>(fn: Try<(A) => B>, fa: Try<A>): Try<B> => {
  const f = prj(fn);

  return f instanceof Error ? failure(f) : map(f, fa);
};

// $FlowFixMe[incompatible-type]
export const ap: Ap<TryType> = curry(apUncurried);

export const map2 = <A, B, C>(f: (A, B) => C, fa: Try<A>, fb: Try<B>): Try<C> => {
  const a = prj(fa);
  const b = prj(fb);
  const e = a instanceof Error ? a : b instanceof Error ? b : null;

  return e == null ? success(f(a, b)) : failure(e);
};

export const chainUncurried: ChainUncurried<TryType> = <A, B>(fn: (A) => Try<B>, fa: Try<A>): Try<B> => {
  const val = prj(fa);

  return val instanceof Error ? failure(val) : fn(val);
};

// $FlowFixMe[incompatible-type]
export const chain: Chain<TryType> = curry(chainUncurried);

export const pure = inj;

export const of = pure;

export const attempt = <R>(fn: () => R): Try<R> => {
  try {
    return success(fn());
  } catch (e) {
    return failure(e);
  }
};

export const reduceUncurried: ReduceUncurried<TryType> = <A, B>(
  fa: HKT<TryType, A>,
  fn: (b: B, a: A) => B,
  b: B,
): B => {
  const val: A = prj(fa);

  return val instanceof Error ? b : fn(b, val);
};

// $FlowFixMe[incompatible-type]
export const reduce: Reduce<TryType> = curry(reduceUncurried);

export const foldMap: FoldMap<TryType> = foldableFoldMap({ reduce });

const fns: Monad<TryType> & Foldable<TryType> = {
  ap,
  chain,
  foldMap,
  map,
  map2,
  of,
  pure,
  reduce,
};

export default fns;
