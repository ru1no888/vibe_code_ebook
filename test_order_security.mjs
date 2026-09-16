import test from 'node:test';
import assert from 'node:assert/strict';

const security = await import('./src/lib/order-security.mjs').catch(() => ({}));

test('creates a high-entropy URL-safe access token', () => {
  assert.equal(typeof security.createAccessToken, 'function');
  const token = security.createAccessToken();
  assert.match(token, /^[A-Za-z0-9_-]{43}$/);
});

test('authorizes an order only when its access token matches', () => {
  const order = { downloadToken: 'secret-token' };
  assert.equal(security.hasOrderAccess(order, 'secret-token'), true);
  assert.equal(security.hasOrderAccess(order, 'wrong-token'), false);
  assert.equal(security.hasOrderAccess(order, ''), false);
});

test('allows downloads only for paid, unexpired, authorized orders', () => {
  const now = Date.parse('2026-09-16T12:00:00.000Z');
  const validOrder = {
    status: 'PAID',
    downloadToken: 'secret-token',
    downloadExpiresAt: '2026-09-17T12:00:00.000Z',
  };

  assert.equal(security.canDownloadOrder(validOrder, 'secret-token', now), true);
  assert.equal(security.canDownloadOrder({ ...validOrder, status: 'PENDING' }, 'secret-token', now), false);
  assert.equal(security.canDownloadOrder({ ...validOrder, downloadExpiresAt: '2026-09-15T12:00:00.000Z' }, 'secret-token', now), false);
  assert.equal(security.canDownloadOrder(validOrder, 'wrong-token', now), false);
});
