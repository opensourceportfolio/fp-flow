// @flow
import { type Apply } from './Apply';
import { HKT } from './HKT';

export type Applicative<DataType> = {
  ...Apply<DataType>,
  of<A>(a: A): HKT<DataType, A>,
};
