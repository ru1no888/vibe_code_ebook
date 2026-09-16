export function createAccessToken() {
  const bytes = new Uint8Array(32);
  globalThis.crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');
}

export function hasOrderAccess(order, accessToken) {
  return Boolean(
    order &&
    typeof order.downloadToken === 'string' &&
    typeof accessToken === 'string' &&
    accessToken.length > 0 &&
    order.downloadToken === accessToken
  );
}

export function canDownloadOrder(order, accessToken, now = Date.now()) {
  if (!hasOrderAccess(order, accessToken) || order.status !== 'PAID') return false;
  const expiresAt = Date.parse(order.downloadExpiresAt ?? '');
  return Number.isFinite(expiresAt) && expiresAt > now;
}
