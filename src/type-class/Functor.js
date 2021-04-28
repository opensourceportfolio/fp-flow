// @flow

import { type HKT } from './HKT';

export type MapUncurried<DataType> = <A13, B>(fn: (a: A13) => B, fa: HKT<DataType, A13>) => HKT<DataType, B>;

export type MapCurried<DataType> = <A14, B>(fn: (a: A14) => B) => (fa: HKT<DataType, A14>) => HKT<DataType, B>;

export type Map<DataType> = MapCurried<DataType> & MapUncurried<DataType>;

type ExtractReturnType = <R>(() => R) => R;
type Fn = () => number;
type ReturnType = $Call<ExtractReturnType, Map<number>>;

export type Functor<DataType> = {
  map: Map<DataType>,
};
