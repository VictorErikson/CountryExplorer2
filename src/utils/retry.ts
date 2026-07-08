export function sleep(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve) => {
    if (signal.aborted) return resolve();
    const timeoutId = setTimeout(resolve, ms);
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(timeoutId);
        resolve();
      },
      { once: true }
    );
  });
}

export function backoffDelay(attempt: number) {
  // Start at 4s — a rate-limited API never actually resets within 1-2s,
  // so the shortest waits are just wasted requests against the same limit.
  return Math.min(4000 * 2 ** (attempt - 1), 15000);
}
