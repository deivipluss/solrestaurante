export class Decimal {
    private value: number;
  
    constructor(value: string | number) {
      this.value = Number(value);
    }
  
    toFixed(decimals: number): string {
      return this.value.toFixed(decimals);
    }
  
    toString(): string {
      return this.value.toString();
    }
  
    mul(other: number): Decimal {
      return new Decimal(this.value * other);
    }
  
    static from(value: number | string): Decimal {
      return new Decimal(value);
    }
  }