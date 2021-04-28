// @flow

import { curry } from '../curry';
import type { Functor } from './Functor';
import { HKT } from './HKT';

export type ApUncurried<DataType> = <A, B>(fab: HKT<DataType, (a: A) => B>, fa: HKT<DataType, A>) => HKT<DataType, B>;

export type ApCurried<DataType> = <A, B>(fab: HKT<DataType, (a: A) => B>) => (fa: HKT<DataType, A>) => HKT<DataType, B>;

export type Ap<DataType> = ApUncurried<DataType> & ApCurried<DataType>;

export type Map2<DataType> = <A, B, R>(fn: (a: A, b: B) => R, aa: HKT<DataType, A>, ab: HKT<DataType, B>) => HKT<DataType, R>;

export type Map3<DataType> = <A, B, C, R>(
  fn: (a: A, b: B, c: C) => R,
  aa: HKT<DataType, A>,
  ab: HKT<DataType, B>,
  ac: HKT<DataType, C>,
) => HKT<DataType, R>;

export type Apply<DataType> = {
  ...Functor<DataType>,
  ap: Ap<DataType>,
};

export function map2<DataType>({ ap, map }: Apply<DataType>): Map2<DataType> {
  type Apply_<A> = HKT<DataType, A>;

  return <A, B, R>(fn: (A, B) => R, aa: Apply_<A>, ab: Apply_<B>): Apply_<R> => ap(map(curry(fn), aa), ab);
}

export function map3<DataType>({ map, ap }: Apply<DataType>): Map3<DataType> {
  type Apply_<A> = HKT<DataType, A>;

  return <A, B, C, R>(fn: (A, B, C) => R, aa: Apply_<A>, ab: Apply_<B>, ac: Apply_<C>): Apply_<R> => {
    const fnC = (a: A) => (b: B) => (c: C) => fn(a, b, c);

    return ap(ap(map(fnC, aa), ab), ac);
  };
}
