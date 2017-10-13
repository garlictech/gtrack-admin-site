export class LengthUnit {
  public smallUnit: string;
  public bigUnit: string;
  public conversionFromMeter: number;
  public conversionToBig: number;

  public convertDistance(meters: number): number {
    return Math.round(1.0 * meters / this.conversionFromMeter);
  }

  public convertDistanceInBigUnit(meters: number): number {
    return Math.round(10.0 * meters / this.conversionFromMeter / this.conversionToBig) / 10;
  }
}
