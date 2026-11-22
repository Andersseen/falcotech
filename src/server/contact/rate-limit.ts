/**
 * Fixed-window limiter kept in memory.
 *
 * It is a first line of defence, not a guarantee: every serverless instance has its own memory, so a
 * determined sender spread across instances gets more attempts. Turnstile is what stops automated
 * abuse; this only caps how fast one client can hammer a warm instance.
 */
export function createRateLimiter(options: { readonly limit: number; readonly windowMs: number; readonly maxKeys?: number }) {
  const windows = new Map<string, { start: number; count: number }>();
  const maxKeys = options.maxKeys ?? 10_000;

  return {
    /** Records one attempt and returns how many seconds to wait, or 0 when it is allowed. */
    hit(key: string, now = Date.now()): number {
      const current = windows.get(key);
      if (!current || now - current.start >= options.windowMs) {
        if (windows.size >= maxKeys) {
          for (const [storedKey, window] of windows) {
            if (now - window.start >= options.windowMs) windows.delete(storedKey);
          }
          if (windows.size >= maxKeys) windows.delete(windows.keys().next().value!);
        }
        windows.set(key, { start: now, count: 1 });
        return 0;
      }

      current.count += 1;
      return current.count > options.limit ? Math.ceil((current.start + options.windowMs - now) / 1000) : 0;
    },
  };
}
