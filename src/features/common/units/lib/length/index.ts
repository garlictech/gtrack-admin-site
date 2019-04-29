import { Imperial } from './imperial';
import { Metric } from './metric';

export const lengthUnits = {
  imperial: new Imperial(),
  metric: new Metric()
};

export { LengthUnit } from './length-unit';
export { Imperial, Metric };
