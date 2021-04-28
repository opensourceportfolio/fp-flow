// @flow

import { type Map, type MapUncurried } from '../type-class/Functor';
import {
  type FoldMap,
  type Foldable,
  type Reduce,
  type ReduceUncurried,
  type ReduceCurried,
  foldMap as foldableFoldMap,
} from '../type-class/Foldable';
import { type Monad, type Chain, type ChainUncurried } from '../type-class/Monad';
import { type HKT } from '../type-class/HKT';
import { type Ap, type ApUncurried } from '../type-class/Apply';
import { curry } from '../curry';

class OptionType {}

function inj<A>(a: ?A): Option<A> {
  // $FlowFixMe[unclear-type]
  return ((a: any): Option<A>);
}

function prj<A>(fa: Option<A>): ?A {
  // $FlowFixMe[unclear-type]
  return ((fa: any): ?A);
}

export type Option<+A> = HKT<OptionType, A>;

/****** Imlementation ******/

// $FlowFixMe[unclear-type]
export const none: Option<any> = inj(null);

export const some = <T>(t: T): Option<T> => inj(t);

const mapUncurried: MapUncurried<OptionType> = <A, B>(fn: (A) => B, fa: Option<A>): Option<B> => {
  const val: ?A = prj(fa);

  return val == null ? none : some(fn(val));
};

// $FlowFixMe[incompatible-type]
export const map: Map<OptionType> = curry(mapUncurried);

export const apUncurried: ApUncurried<OptionType> = <A, B>(fn: Option<(A) => B>, fa: Option<A>): Option<B> => {
  const f = prj(fn);

  return f == null ? none : map(f, fa);
};

// $FlowFixMe[incompatible-type]
export const ap: Ap<OptionType> = curry(apUncurried);

export const map2 = <A, B, C>(f: (A, B) => C, fa: Option<A>, fb: Option<B>): Option<C> => {
  const a = prj(fa);
  const b = prj(fb);

  return a == null || b == null ? none : some(f(a, b));
};

export const pure = some;

export const of = pure;

export const chainUncurried: ChainUncurried<OptionType> = <A, B>(fn: (A) => Option<B>, fa: Option<A>): Option<B> => {
  const val: ?A = prj(fa);

  return val == null ? none : fn(val);
};

// $FlowFixMe[incompatible-type]
export const chain: Chain<OptionType> = curry(chainUncurried);

export const reduceUncurried: ReduceUncurried<OptionType> = <A, B>(
  fa: HKT<OptionType, A>,
  fn: (b: B, a: A) => B,
  b: B,
): B => {
  const val: ?A = prj(fa);

  return val == null ? b : fn(b, val);
};

// $FlowFixMe[incompatible-type]
export const reduce: Reduce<OptionType> = curry(reduceUncurried);

export const getOrElse = <A>(a: Option<A>, alt: A): A => prj(a) ?? alt;

export const foldMap: FoldMap<OptionType> = foldableFoldMap({ reduce });

const fns: Monad<OptionType> & Foldable<OptionType> = {
  ap,
  chain,
  getOrElse,
  foldMap,
  map,
  map2,
  of,
  pure,
  reduce,
  none,
  some,
};

export default fns;
