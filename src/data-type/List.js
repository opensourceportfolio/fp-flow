// @flow
import { type Applicative } from '../type-class/Applicative';
import { type Ap, type ApUncurried, map2, map3 as map3Apply, type Map3 } from '../type-class/Apply';
import { type Reduce, type ReduceUncurried, type ReduceCurried, type Foldable } from '../type-class/Foldable';
import { type Map, type MapUncurried, type Functor } from '../type-class/Functor';
import { type Monad, type Chain, type ChainUncurried } from '../type-class/Monad';
import { type Traversable, type Traverse } from '../type-class/Traversable';
import { HKT } from '../type-class/HKT';
import { type Option, some, none } from './Option';
import { curry } from '../curry';

export class ListType {}

export type List<+A> = HKT<ListType, A>;

function inj<A>(as: A[]): List<A> {
  // $FlowFixMe[unclear-type]
  return ((as: any): List<A>);
}

function prj<A>(fa: List<A>): A[] {
  // $FlowFixMe[unclear-type]
  return ((fa: any): A[]);
}

// *****************
// **** Functor ****
// *****************

const mapUncurried: MapUncurried<ListType> = <A, B>(fn: (A) => B, fa: List<A>): List<B> => {
  const val: A[] = prj(fa);

  return inj(val.map(fn));
};

// $FlowFixMe[incompatible-type]
export const map: Map<ListType> = curry(mapUncurried);

// ***************
// **** Apply ****
// ***************

export const apUncurried: ApUncurried<ListType> = <A, B>(fn: List<(A) => B>, fa: List<A>): List<B> => {
  const fns = prj(fn);
  const as = prj(fa);

  return inj(fns.flatMap((fn, index) => (as[index] == null ? [] : [fn(as[index])])));
};

// $FlowFixMe[incompatible-type]
export const ap: Ap<ListType> = curry(apUncurried);

export const map3: Map3<ListType> = map3Apply({ ap, map });

// *********************
// **** Applicative ****
// *********************

const of = <A>(a: A): List<A> => inj([a]);

// ***************
// **** Monad ****
// ***************

export const chainUncurried: ChainUncurried<ListType> = <A, B>(fn: (A) => List<B>, fa: List<A>): List<B> => {
  const as: A[] = prj(fa);

  return inj(as.flatMap((a) => prj(fn(a))));
};

// $FlowFixMe[incompatible-type]
export const chain: Chain<ListType> = curry(chainUncurried);

// ******************
// **** Foldable ****
// ******************

export const reduceUncurried: ReduceUncurried<ListType> = <A, B>(
  fa: HKT<ListType, A>,
  fn: (b: B, a: A) => B,
  b: B,
): B => {
  const as: A[] = prj(fa);

  return as.reduce(fn, b);
};

// $FlowFixMe[incompatible-type]
export const reduce: Reduce<ListType> = curry(reduceUncurried);

// *********************
// **** Traversable ****
// *********************

// * Ex.
// List<Url> => Promise<List<Response>>

export const traverse = <ApType>(applicative: Applicative<ApType>): Traverse<ListType, ApType> => {
  const map2_ = map2<ApType>(applicative);

  type Applicative_<A> = HKT<ApType, A>;

  const { of } = applicative;

  return <A, B>(fn: (A) => Applicative_<B>): ((List<A>) => Applicative_<List<B>>) => (
    as: List<A>,
  ): Applicative_<List<B>> => {
    const emptyB: Applicative_<List<B>> = of(inj<B>([]));
    const reducer = (bs: Applicative_<List<B>>, a: A): Applicative_<List<B>> => {
      return map2_((bs, b) => concat(bs, b), bs, fn(a));
    };

    return reduce(as, reducer, emptyB);
  };
};

// * Ex.
// List<Promise<Responses>> => </B> Promise<List<Response>>

export function sequence<DataType>(
  applicative: Applicative<DataType>,
): <A>(List<HKT<DataType, A>>) => HKT<DataType, List<A>> {
  type Applicative_<A> = HKT<DataType, A>;

  const traverse_ = traverse(applicative);

  return <A>(as: List<Applicative_<A>>): Applicative_<List<A>> => traverse_((a) => a)(as);
}

// *********************
// **** Combinators ****
// *********************
export function create<A>(as: A[]): List<A> {
  return inj(as);
}

export function head<A>(as: List<A>): Option<A> {
  const val = prj(as);
  return val.length > 0 ? some(val[0]) : none;
}

export function concat<A>(as: List<A>, a: A): List<A> {
  const val = prj(as);

  return inj(val.concat(a));
}

export function flatten<A>(as: List<List<A>>): List<A> {
  const val = prj(as);

  return inj(val.flatMap((list) => prj(list)));
}

const list = {
  ap,
  chain,
  flatten,
  map,
  of,
  reduce,
  sequence,
  traverse,
};

export default list;
