export class LengthUnit {
  smallUnit: string;
  bigUnit: string;
  conversionFromMeter: number;
  conversionToBig: number;

  convertDistance(meters: number): number {
    return Math.round((meters * 1.0) / this.conversionFromMeter);
  }

  convertDistanceInBigUnit(meters: number): number {
    return Math.round((meters * 10.0) / this.conversionFromMeter / this.conversionToBig) / 10;
  }
}
