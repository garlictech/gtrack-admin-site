import { LengthUnit } from './length-unit';

export class Metric extends LengthUnit {
  public smallUnit = 'm';
  public bigUnit = 'km';
  public conversionFromMeter = 1;
  public conversionToBig = 1000;
}
