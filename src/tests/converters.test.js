import test from 'node:test';
import assert from 'node:assert/strict';

import { CONVERTERS, getConverter, getConvertersByFrom, getConvertersByTo } from '../config/converters.js';

test('CONVERTERS matrix contains supported entries', () => {
  assert.ok(CONVERTERS.length >= 50, `Expected 50+ converters, found ${CONVERTERS.length}`);
});

test('getConverter retrieves correct converter objects', () => {
  const jpgPng = getConverter('jpg-to-png');
  assert.ok(jpgPng);
  assert.equal(jpgPng.from, 'jpg');
  assert.equal(jpgPng.to, 'png');

  const heicJpg = getConverter('heic-to-jpg');
  assert.ok(heicJpg);
  assert.equal(heicJpg.from, 'heic');
  assert.equal(heicJpg.to, 'jpg');
});

test('getConvertersByFrom filters by source format', () => {
  const fromJpg = getConvertersByFrom('jpg');
  assert.ok(fromJpg.length >= 7);
  assert.ok(fromJpg.every(c => c.from === 'jpg'));
});

test('getConvertersByTo filters by target format', () => {
  const toPng = getConvertersByTo('png');
  assert.ok(toPng.length >= 7);
  assert.ok(toPng.every(c => c.to === 'png'));
});
