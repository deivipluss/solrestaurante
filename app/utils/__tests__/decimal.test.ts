import { Decimal } from '../decimal'

describe('Decimal', () => {
  it('should create a decimal from number', () => {
    const decimal = new Decimal(10.5)
    expect(decimal.toFixed(2)).toBe('10.50')
  })

  it('should create a decimal from string', () => {
    const decimal = new Decimal('10.5')
    expect(decimal.toFixed(2)).toBe('10.50')
  })

  it('should multiply correctly', () => {
    const decimal = new Decimal(10.5)
    const result = decimal.mul(2)
    expect(result.toFixed(2)).toBe('21.00')
  })

  it('should convert to string', () => {
    const decimal = new Decimal(10.5)
    expect(decimal.toString()).toBe('10.5')
  })

  it('should create from static method', () => {
    const decimal = Decimal.from(10.5)
    expect(decimal.toFixed(2)).toBe('10.50')
  })

  it('should handle zero', () => {
    const decimal = new Decimal(0)
    expect(decimal.toFixed(2)).toBe('0.00')
  })

  it('should handle negative numbers', () => {
    const decimal = new Decimal(-10.5)
    expect(decimal.toFixed(2)).toBe('-10.50')
  })
})