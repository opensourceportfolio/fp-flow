// @flow

import { type Option, default as O } from './data-type/Option';
import { type Task, default as T, map3, chain, traverseTask, map } from './data-type/Task';
import { type List, sequence, default as L, flatten, traverse, create } from './data-type/List';
import { pipe } from './function';
import { type Monoid, fold } from './type-class/Monoid';
import $for from './for';

/*
 *
 * typical implementation
 *
 */

// $FlowFixMe[unclear-type]
declare function getApi<T>(url: string, id: any): Promise<T>;

class User {}
class Campaign {}
class Adgroup {}

type UserData = {
  user: User,
  campaigns: Campaign[],
  adgroups: Adgroup[],
};

function getUser(id: number): Promise<User> {
  return getApi<User>('/user', id);
}

function getCampaigns(user: User): Promise<Campaign[]> {
  return getApi<Campaign[]>('/campaign', user);
}

function getAdgroups(campaign: Campaign): Promise<Adgroup[]> {
  return getApi<Adgroup[]>('/adgroup', campaign);
}

async function getUserData(id: number): Promise<UserData> {
  const userAdgroups: Adgroup[] = [];
  const user: User = await getUser(id);
  const campaigns: Campaign[] = await getCampaigns(user);

  for (const campaign of campaigns) {
    const adgroups: Adgroup[] = await getAdgroups(campaign);

    userAdgroups.push(...adgroups);
  }

  return {
    user,
    campaigns,
    adgroups: userAdgroups,
  };
}

/*
 *
 * Alternative implementation
 *
 */

type UserDataBetter = {
  user: User,
  campaigns: List<Campaign>,
  adgroups: List<Adgroup>,
};

// $FlowFixMe[unclear-type]
declare function getApiBetter<T>(url: string, id: any): Task<T>;

function getUserBetter(id: number): Task<User> {
  return getApiBetter('/user', id);
}

function getCampaignsBetter(user: User): Task<List<Campaign>> {
  return getApiBetter('/campaign', user);
}

function getAdgroupsBetter(campaign: Campaign): Task<List<Adgroup>> {
  return getApiBetter('/adgroup', campaign);
}

function getUserDataBetter(id: number): Task<UserDataBetter> {
  const futureUser = getUserBetter(id);

  const futureCampaigns: Task<List<Campaign>> = T.chain((user: User) => getCampaignsBetter(user), futureUser);

  const futureAdgroups: Task<List<Adgroup>> = T.chain(
    (campaigns: List<Campaign>) =>
      T.map((list: List<List<Adgroup>>) => flatten(list), traverse(T)(getAdgroupsBetter)(campaigns)),
    futureCampaigns,
  );

  const res: Task<UserDataBetter> = map3(
    (user: User, campaigns: List<Campaign>, adgroups: List<Adgroup>) => ({ user, campaigns, adgroups }),
    futureUser,
    futureCampaigns,
    futureAdgroups,
  );

  return res;
}

/*
 *
 * More alternative implementation
 *
 */

function getUserDataBest(id: number): Task<UserDataBetter> {
  // curring at work
  const tflatten = T.map(flatten);

  const futureUser = getUserBetter(id);

  const futureCampaigns = chain(getCampaignsBetter, futureUser);

  const futureAdgroups = tflatten(chain(traverseTask(getAdgroupsBetter), futureCampaigns));

  //nothing actually happened
  return map3(
    (user, campaigns, adgroups) => ({ user, campaigns, adgroups }),
    futureUser,
    futureCampaigns,
    futureAdgroups,
  );
}

/*
 *
 * $For notation
 *
 */

function getUserData$For(id: number): Task<UserDataBetter> {
  const tflatten = T.map(flatten);

  return $for(T)(function* () {
    const user = yield getUserBetter(id);
    const campaigns = yield getCampaignsBetter(user);
    const adgroups = yield getAdgroupsBetter(campaigns);

    return { user, campaigns, adgroups: tflatten(adgroups) };
  });
}

/*
 *
 * Monoid
 *
 */

const additionMonoid: Monoid<number> = {
  concat: (a, b) => a + b,
  empty: 0,
};

(additionMonoid.concat(1, additionMonoid.empty) === additionMonoid.concat(additionMonoid.empty, 1)) === 1;
additionMonoid.concat(additionMonoid.concat(1, 2), 3) === additionMonoid.concat(1, additionMonoid.concat(2, 3));

export const allMonoid: Monoid<boolean> = {
  concat: (x, y) => x && y,
  empty: true,
};

export const anyMonoid: Monoid<boolean> = {
  concat: (x, y) => x || y,
  empty: false,
};

/*
 *
 * Even more alternative implementation
 *
 */

type UserDataMonoid = {
  user?: User,
  campaigns?: List<Campaign>,
  adgroups?: List<Adgroup>,
};

const userDataMonoid: Monoid<UserDataMonoid> = {
  concat: (x, y) => ({
    ...x,
    ...y
  }),
  empty: {},
};

function getUserMonoid(id: number): Task<UserDataMonoid> {
  return getApiBetter('/user', id);
}

function getCampaignsMonoid(user: UserDataMonoid): Task<UserDataMonoid> {
  return getApiBetter('/campaign', user);
}

function getAdgroupsMonoid(campaign: UserDataMonoid): Task<UserDataMonoid> {
  return getApiBetter('/adgroup', campaign);
}

function getUserDataMonoid(id: number): Task<UserDataMonoid> {
  const tflatten = T.map(flatten);

  const user = getUserMonoid(id);

  const campaigns = chain(getCampaignsMonoid, user);

  const adgroups = chain(getAdgroupsMonoid, campaigns);

  const list = sequence(T)(create([user, campaigns, adgroups]));

  return map(fold(userDataMonoid), list);
}
