import { LengthUnit } from './length-unit';

export class Imperial extends LengthUnit {
  smallUnit: string;
  bigUnit: string;
  conversionFromMeter: number;
  conversionToBig: number;

  constructor() {
    super();

    this.smallUnit = 'yd.';
    this.bigUnit = 'mi.';
    this.conversionFromMeter = 0.9144;
    this.conversionToBig = 1760;
  }
}
