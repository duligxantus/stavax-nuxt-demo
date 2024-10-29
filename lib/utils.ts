import {type ClassValue, clsx} from 'clsx';
import {twMerge}               from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toNumber(value: string | number) {
  if (typeof value === 'number') {
    return value;
  }

  if (!value) {
    return 0;
  }

  return Number(value.replace(/,/g, '.'));
}

export async function withErrorAlert(fn: () => Promise<any>, finalFn?: () => any) {
  try {
    await fn();
  } catch (e) {
    console.error(e);
    alert(e?.toString());
  } finally {
    finalFn?.();
  }
}

export function withPrompt(cb: (value: string) => any, question = 'Enter password') {
  const value = prompt(question);
  if (!value) {
    return;
  }

  return cb(value);
}
