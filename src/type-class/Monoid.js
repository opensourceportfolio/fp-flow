// @flow
import { type HKT } from './HKT';
import { type Semigroup } from './Semigroup';
import { type List, reduce } from '../data-type/List';

export type Monoid<A> = {
  ...Semigroup<A>,
  empty: A,
};

export function fold<A>(m: Monoid<A>): (List<A>) => A {
  return (as: List<A>): A => {
    return reduce(as, (acc, a) => m.concat(acc, a), m.empty);
  };
}
