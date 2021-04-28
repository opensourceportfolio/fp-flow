// @flow

import { curry } from '../curry';
import { type Map, type MapUncurried } from '../type-class/Functor';
import { type Ap, type ApUncurried, map3 as map3Apply, type Map3 } from '../type-class/Apply';
import { type Traverse } from '../type-class/Traversable';
import { type HKT } from '../type-class/HKT';
import { type Monad, type ChainUncurried, type Chain } from '../type-class/Monad';
import { traverse, ListType } from './List';

class TaskType {}

function inj<A>(a: () => Promise<A>): Task<A> {
  // $FlowFixMe[unclear-type]
  return ((a: any): Task<A>);
}

function prj<A>(fa: Task<A>): () => Promise<A> {
  // $FlowFixMe[unclear-type]
  return ((fa: any): () => Promise<A>);
}

export type Task<+A> = HKT<TaskType, A>;

/****** Imlementation ******/

const mapUncurried: MapUncurried<TaskType> = <A, B>(fn: (A) => B, fa: Task<A>): Task<B> => {
  return inj(async () => {
    const a = await prj(fa)();
    return fn(a);
  });
};

// $FlowFixMe[incompatible-type]
export const map: Map<TaskType> = curry(mapUncurried);

export const apUncurried: ApUncurried<TaskType> = <A, B>(fn: Task<(A) => B>, fa: Task<A>): Task<B> => {
  return inj(async () => {
    const pf = prj(fn);
    const pa = prj(fa);
    const [f, a] = await Promise.all([pf(), pa()]);

    return f(a);
  });
};

// $FlowFixMe[incompatible-type]
export const ap: Ap<TaskType> = curry(apUncurried);

export const map2 = <A, B, C>(f: (A, B) => C, fa: Task<A>, fb: Task<B>): Task<C> => {
  return inj(async () => {
    const pa = prj(fa);
    const pb = prj(fb);
    const [a, b] = await Promise.all([pa(), pb()]);

    return f(a, b);
  });
};

export const map3: Map3<TaskType> = map3Apply({ map, ap });

export const chainUncurried: ChainUncurried<TaskType> = <A, B>(fn: (A) => Task<B>, fa: Task<A>): Task<B> => {
  return inj(async () => {
    const a: A = await prj(fa)();

    return prj(fn(a))();
  });
};

// $FlowFixMe[incompatible-type]
export const chain: Chain<TaskType> = curry(chainUncurried);

export const pure = <A>(a: A): Task<A> => inj(() => Promise.resolve(a));

export const of = pure;

export const task = inj;

export const traverseTask: Traverse<ListType, TaskType> = traverse({ ap, map, of });

const fns: Monad<TaskType> = {
  ap,
  chain,
  map,
  map2,
  map3,
  of,
  pure,
  traverseTask,
};

export default fns;
