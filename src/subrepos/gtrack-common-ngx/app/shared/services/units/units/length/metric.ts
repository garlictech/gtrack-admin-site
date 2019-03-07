import { LengthUnit } from './length-unit';

export class Metric extends LengthUnit {
  smallUnit: string;
  bigUnit: string;
  conversionFromMeter: number;
  conversionToBig: number;

  constructor() {
    super();
    this.smallUnit = 'm';
    this.bigUnit = 'km';
    this.conversionFromMeter = 1;
    this.conversionToBig = 1000;
  }
}
