import { describe, it, expect } from 'vitest';
import { formatPrice } from './format';

describe('formatPrice', () => {
  it('formatea enteros en pesos colombianos', () => {
    expect(formatPrice(1250)).toBe('$\u00A01.250');
  });

  it('formatea decimales con separador de miles', () => {
    expect(formatPrice(19999.5)).toBe('$\u00A020.000');
  });

  it('formatea cero', () => {
    expect(formatPrice(0)).toBe('$\u00A00');
  });

  it('redondea al entero más cercano', () => {
    expect(formatPrice(9999)).toBe('$\u00A09.999');
  });
});
