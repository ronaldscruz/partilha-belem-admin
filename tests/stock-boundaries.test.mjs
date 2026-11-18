import test from 'node:test';
import assert from 'node:assert/strict';
import { campaignCoverage, kitCapacity } from '../src/app/planning.ts';

test('bebidas adicionais não substituem a água obrigatória', () => {
  assert.equal(kitCapacity({ meat: 5, cheese: 5, water: 0, drinks: 20 }), 0);
});

test('uma campanha com saldo exato consome todos os kits disponíveis', () => {
  const stock = { meat: 0, cheese: 3, water: 6, drinks: 0 };
  const campaigns = [
    { id: 'a', date: '2026-11-21', people: 3, minutes: 60 },
    { id: 'b', date: '2026-11-28', people: 1, minutes: 60 },
  ];
  assert.deepEqual(campaignCoverage(stock, campaigns).map(({ covered }) => covered), [true, false]);
});
