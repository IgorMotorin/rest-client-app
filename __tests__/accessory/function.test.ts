import {
  base64ToText,
  preSelectHeaders,
  replaceVariables,
  textToBase64,
} from '@/accessory/function';

beforeAll(() => {
  if (typeof (globalThis as { atob?: unknown }).atob !== 'function') {
    Object.defineProperty(globalThis, 'atob', {
      configurable: true,
      writable: true,
      value: (input: string) => Buffer.from(input, 'base64').toString('binary'),
    });
  }
  if (typeof (globalThis as { btoa?: unknown }).btoa !== 'function') {
    Object.defineProperty(globalThis, 'btoa', {
      configurable: true,
      writable: true,
      value: (input: string) => Buffer.from(input, 'binary').toString('base64'),
    });
  }
});

type TVars = Parameters<typeof replaceVariables>[1];

describe('replaceVariables', () => {
  it('replaces selected variables and reports placeholders present', () => {
    const vars = [
      { key: 'name', value: 'World', select: true },
      { key: 'unused', value: 'X', select: false },
    ] as unknown as TVars;

    const out = replaceVariables('Hello, {{ name }}!', vars);
    const [result, onVars] = out as unknown as [string, boolean];

    expect(onVars).toBe(true);
    expect(result).toBe('Hello, World!');
  });

  it('ignores unselected vars and is whitespace tolerant', () => {
    const vars = [{ key: 'a', value: 'A', select: false }] as unknown as TVars;

    const [result, onVars] = replaceVariables(
      'X{{   a   }}Y',
      vars
    ) as unknown as [string, boolean];

    expect(onVars).toBe(true); // placeholder existed
    expect(result).toBe('X{{   a   }}Y'); // not replaced when not selected
  });

  it('returns false when no placeholders are present', () => {
    const vars = [] as unknown as TVars;
    const [result, onVars] = replaceVariables(
      'Nothing to replace',
      vars
    ) as unknown as [string, boolean];

    expect(onVars).toBe(false);
    expect(result).toBe('Nothing to replace');
  });
});

describe('textToBase64', () => {
  it('replaces an existing segment at index "num"', () => {
    const path = '/en/GET';
    const num = 2;
    const next = textToBase64('✓ ok', path, num);

    const parts = next.split('/');
    expect(parts[1]).toBe('en');
    const decoded = base64ToText(parts[2]);
    expect(decoded).toBe('✓ ok');
  });

  it('appends a new segment when index is beyond current length', () => {
    const path = '/en/GET';
    const num = 3;
    const next = textToBase64('hello', path, num);

    expect(next.startsWith('/en/GET/')).toBe(true);
    const b64 = next.split('/')[3];
    expect(base64ToText(b64)).toBe('hello');
  });
});

describe('base64ToText', () => {
  it('decodes URL-encoded base64 strings', () => {
    // "hello" -> "aGVsbG8=" -> URL-encode '='
    const encoded = 'aGVsbG8%3D';
    expect(base64ToText(encoded)).toBe('hello');
  });

  it('decodes base64 with stray characters and missing padding', () => {
    // "hello" base64 is "aGVsbG8="
    const messy = 'aG V sbG8'; // spaces + missing '='
    expect(base64ToText(messy)).toBe('hello');
  });

  it('round-trips non-ASCII text', () => {
    const text = 'Привет ✓';
    // mimic the encoder used by textToBase64
    const bytes = new TextEncoder().encode(text);
    const bin = String.fromCharCode(...bytes);
    const b64 = (globalThis as { btoa: (s: string) => string }).btoa(bin);

    expect(base64ToText(b64)).toBe(text);
  });
});

describe('preSelectHeaders', () => {
  it('returns Content-Type for form/json/text and selects it', () => {
    expect(preSelectHeaders('form')).toEqual({
      id: 0,
      key: 'Content-Type',
      value: 'application/x-www-form-urlencoded',
      select: true,
    });

    expect(preSelectHeaders('json')).toEqual({
      id: 0,
      key: 'Content-Type',
      value: 'application/json',
      select: true,
    });

    expect(preSelectHeaders('text')).toEqual({
      id: 0,
      key: 'Content-Type',
      value: 'text/plain',
      select: true,
    });
  });

  it('returns an unselected blank row for "none" or unknown', () => {
    const blank = { id: 0, key: '', value: '', select: false } as const;
    expect(preSelectHeaders('none')).toEqual(blank);
    expect(preSelectHeaders('weird')).toEqual(blank);
  });
});
