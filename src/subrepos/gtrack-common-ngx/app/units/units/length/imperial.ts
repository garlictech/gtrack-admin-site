import { LengthUnit } from './length-unit';

export class Imperial extends LengthUnit {
  public smallUnit = 'yd.';
  public bigUnit = 'mi.';
  public conversionFromMeter = 0.9144;
  public conversionToBig = 1760;
}
