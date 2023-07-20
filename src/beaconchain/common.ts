export const BEACON_CHAIN_API = 'https://beaconcha.in/api/v1';

export const reduceToObject = <G extends { index: number }>(
  a: G[],
): Record<number, G> =>
  a.reduce((o, e) => {
    o[e.index] = e;
    return o;
  }, {});
