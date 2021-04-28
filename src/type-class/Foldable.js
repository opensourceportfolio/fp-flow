// @flow
import { type HKT } from './HKT';
import { type Monoid } from './Monoid';

export type ReduceUncurried<DataType> = <A, B>(fa: HKT<DataType, A>, fn: (b: B, a: A) => B, b: B) => B;
export type ReduceCurried<DataType> = <A, B>(fa: HKT<DataType, A>, fn: (b: B, a: A) => B, b: B) => B;
export type Reduce<DataType> = ReduceCurried<DataType> & ReduceUncurried<DataType>;

export type Foldable<DataType> = {
  reduce: Reduce<DataType>,
};

export type FoldMap<DataType> = <A, B>(Monoid<B>, HKT<DataType, A>) => ((A) => B) => B;

export function foldMap<DataType>({ reduce }: Foldable<DataType>): FoldMap<DataType> {
  return <A, B>(m: Monoid<B>, fa: HKT<DataType, A>): (((A) => B) => B) => {
    return (fn: (A) => B) => reduce<A, B>(fa, (b, a) => m.concat(b, fn(a)), m.empty);
  };
}
