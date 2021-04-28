// @flow
import { type Map, type MapUncurried } from './Functor';
import { type Applicative } from './Applicative';
import { type HKT } from './HKT';
import { curry } from '../curry';

export type Map2<DataType> = <A, B, C>(fn: (a: A) => B, fa: HKT<DataType, A>, fb: HKT<DataType, B>) => HKT<DataType, C>;

export type ChainUncurried<DataType> = <A, B>(f: (A) => HKT<DataType, B>, fa: HKT<DataType, A>) => HKT<DataType, B>;

export type ChainCurried<DataType> = <A, B>(f: (A) => HKT<DataType, B>) => (fa: HKT<DataType, A>) => HKT<DataType, B>;

export type Chain<DataType> = ChainUncurried<DataType> & ChainCurried<DataType>;

export type Monad<DataType> = {
  ...Applicative<DataType>,
  chain: Chain<DataType>,
};

export function map<DataType>({ chain, of }: Monad<DataType>): Map<DataType> {
  type Fn = <A, B>(A) => B;
  type FA<A> = HKT<DataType, A>;

  const mapUncurried: MapUncurried<DataType> = <A, B>(f: (A) => B, ma: HKT<DataType, A>): HKT<DataType, B> =>
    chain((a: A) => of(f(a)), ma);
  // $FlowFixMe[incompatible-return]
  return curry(mapUncurried);
}

export function map2<DataType>({ chain, map }: Monad<DataType>): Map2<DataType> {
  return <A, B, C>(fn: (A, B) => C, ma: HKT<DataType, A>, mb: HKT<DataType, B>): HKT<DataType, C> =>
    chain((a) => map((B) => fn(a, B), mb), ma);
}
