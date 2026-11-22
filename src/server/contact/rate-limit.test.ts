import { describe, expect, it } from 'vitest';
import { createRateLimiter } from './rate-limit';

describe('createRateLimiter', () => {
  it('allows the limit and then reports the seconds left in the window', () => {
    const limiter = createRateLimiter({ limit: 2, windowMs: 60_000 });
    expect(limiter.hit('a', 0)).toBe(0);
    expect(limiter.hit('a', 1_000)).toBe(0);
    expect(limiter.hit('a', 30_000)).toBe(30);
  });

  it('counts each key separately and starts a new window once the old one ends', () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 60_000 });
    expect(limiter.hit('a', 0)).toBe(0);
    expect(limiter.hit('b', 0)).toBe(0);
    expect(limiter.hit('a', 10_000)).toBeGreaterThan(0);
    expect(limiter.hit('a', 60_000)).toBe(0);
  });

  it('never grows past maxKeys', () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 60_000, maxKeys: 2 });
    limiter.hit('a', 0);
    limiter.hit('b', 0);
    limiter.hit('c', 0);
    // "a" was evicted, so it starts a fresh window instead of being limited.
    expect(limiter.hit('a', 1)).toBe(0);
  });
});
