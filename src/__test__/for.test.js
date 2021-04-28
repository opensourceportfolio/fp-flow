// @flow
import o, { some } from '../data-type/Option';
import $for from '../for';

test('for-yield on option', () => {
  const total = $for(o)(function* () {
    const x: number = yield some(2);
    const y: number = yield some(3);

    return x + y;
  });

  expect(total).toBe(some(5));
});
