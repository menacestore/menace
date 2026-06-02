import { describe, it, expect } from 'vitest';
import { formatPrice, getColorHex, cn } from '@/lib/utils';

describe('formatPrice', () => {
  it('should format whole numbers without decimals', () => {
    expect(formatPrice(2999)).toBe('2,999');
  });

  it('should format decimals when present', () => {
    expect(formatPrice(2999.99)).toBe('2,999.99');
  });

  it('should handle zero', () => {
    expect(formatPrice(0)).toBe('0');
  });

  it('should handle large numbers', () => {
    expect(formatPrice(1000000)).toBe('1,000,000');
  });
});

describe('getColorHex', () => {
  it('should return hex for black', () => {
    expect(getColorHex('Black')).toBe('#1a1a1a');
  });

  it('should return hex for white', () => {
    expect(getColorHex('White')).toBe('#fcfcfc');
  });

  it('should return hex for blue', () => {
    expect(getColorHex('Blue')).toBe('#3b82f6');
  });

  it('should return hex for light blue', () => {
    expect(getColorHex('Light Blue')).toBe('#bfdbfe');
  });

  it('should return hex for navy', () => {
    expect(getColorHex('Navy')).toBe('#1e3a8a');
  });

  it('should return default for unknown color', () => {
    expect(getColorHex('Purple')).toBe('#e5e7eb');
  });
});

describe('cn', () => {
  it('should merge tailwind classes', () => {
    const result = cn('px-2 py-1', 'px-4');
    expect(result).toBe('py-1 px-4');
  });

  it('should handle conditional classes', () => {
    const isActive = true;
    const result = cn('base', isActive && 'active');
    expect(result).toBe('base active');
  });

  it('should handle falsy values', () => {
    const result = cn('base', false, null, undefined);
    expect(result).toBe('base');
  });
});
