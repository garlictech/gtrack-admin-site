import { Injectable } from '@angular/core';
import { LengthUnit, units } from '../../lib';

export interface UnitValue {
  value: number;
  unit: string;
}

@Injectable({
  providedIn: 'root'
})
export class UnitsService {
  private readonly defaults;

  private readonly units;

  constructor() {
    this.defaults = {
      length: 'metric'
    };
    this.units = { ...this.defaults };
  }

  convertDistance(distanceInMeters: number, noBigUnit = false): UnitValue {
    const lengthUnit: LengthUnit = this.getActualUnits();

    const distanceValue: UnitValue = {
      value: lengthUnit.convertDistance(distanceInMeters),
      unit: lengthUnit.smallUnit
    };

    if (distanceInMeters >= 1000 && !noBigUnit) {
      distanceValue.value = lengthUnit.convertDistanceInBigUnit(distanceInMeters);
      distanceValue.unit = lengthUnit.bigUnit;
    }

    return distanceValue;
  }

  convertDistanceInBigUnit(distanceInMeters: number): UnitValue {
    const lengthUnit: LengthUnit = this.getActualUnits();

    return {
      value: lengthUnit.convertDistanceInBigUnit(distanceInMeters),
      unit: lengthUnit.bigUnit
    };
  }

  private getActualUnits(): LengthUnit {
    return units.length[this.units.length] || units.length.metric;
  }
}
