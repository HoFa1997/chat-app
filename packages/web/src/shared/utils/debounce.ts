export function debounce<F extends (...args: any[]) => void>(
  func: F,
  waitFor: number,
): { debouncedFunction: (...args: Parameters<F>) => void; cancel: () => void } {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  const debouncedFunction = (...args: Parameters<F>) => {
    if (timeout !== undefined) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };

  const cancel = () => {
    if (timeout !== undefined) {
      clearTimeout(timeout);
      timeout = undefined;
    }
  };

  return { debouncedFunction, cancel };
}
