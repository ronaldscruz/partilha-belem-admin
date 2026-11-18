import test from 'node:test';
import assert from 'node:assert/strict';
import { campaignCoverage, kitCapacity } from '../src/app/planning.ts';

test('calcula kits com água obrigatória e uma segunda bebida', () => {
  assert.equal(kitCapacity({ meat: 7, cheese: 5, water: 9, drinks: 3 }), 6);
  assert.equal(kitCapacity({ meat: 7, cheese: 5, water: 3, drinks: 12 }), 3);
  assert.equal(kitCapacity({ meat: 0, cheese: 5, water: 10, drinks: 0 }), 5);
});

test('avalia campanhas por data e só reserva estoque das campanhas cobertas', () => {
  const stock = { meat: 12, cheese: 4, water: 16, drinks: 16 };
  const campaigns = [
    { id: '3', date: '2026-12-05', people: 6, minutes: 60 },
    { id: '2', date: '2026-11-28', people: 8, minutes: 60 },
    { id: '1', date: '2026-11-21', people: 10, minutes: 60 },
  ];
  assert.deepEqual(campaignCoverage(stock, campaigns).map(({ id, covered }) => [id, covered]), [
    ['1', true], ['2', false], ['3', true],
  ]);
  assert.equal(stock.water, 16);
});
