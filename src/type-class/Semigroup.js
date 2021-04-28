// @flow
import { type HKT } from './HKT';

export type Semigroup<A> = {
  concat: (x: A, y: A) => A,
};
