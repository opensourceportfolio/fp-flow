// @flow
import { type HKT } from './HKT';
import { type Foldable } from './Foldable';
import { type Functor } from './Functor';
import { type Applicative } from './Applicative';

export type Traverse<DataType, ApType> = <A, B>(
  (A) => HKT<ApType, B>,
) => (HKT<DataType, A>) => HKT<ApType, HKT<DataType, B>>;

export type Traversable<DataType> = {
  ...Foldable<DataType>,
  ...Functor<DataType>,
  traverse: <ApType>(Applicative<ApType>) => Traverse<DataType, ApType>,
};
