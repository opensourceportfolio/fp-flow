// @flow

import { HKT } from './type-class/HKT';
import { type Monad } from './type-class/Monad';

// $FlowFixMe[unclear-type]
type $For = <T, A>(Monad<T>) => (fn: () => Generator<HKT<T, any>, A, A>) => HKT<T, A>;

// $FlowFixMe[unclear-type]
const $for: $For = <T, A>({ chain, of }: Monad<T>): ((fn: () => Generator<HKT<T, any>, A, ?A>) => HKT<T, A>) => {
  type Monad_<A> = HKT<T, A>;
  type Next = (?A) => Monad_<A>;

  return (fn: () => Generator<Monad_<A>, A, ?A>): Monad_<A> => {
    const gen = fn();

    const next: Next = (a: ?A) => {
      const { value, done } = gen.next(a);
      // $FlowFixMe[unclear-type]
      const v = done ? of(((value: any): A)) : ((value: any): Monad_<A>);

      return done ? v : chain(next, v);
    };

    return next();
  };
};

export default $for;
