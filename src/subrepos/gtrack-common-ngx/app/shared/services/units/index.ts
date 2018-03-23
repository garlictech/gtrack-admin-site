import { Injectable } from '@angular/core';
import { units, LengthUnit } from './units';

export interface IUnitValue {
  value: number;
  unit: string;
}

@Injectable()
export class UnitsService {
  private defaults = {
    length: 'metric'
  };

  private units = Object.assign({}, this.defaults);

  constructor() {
    /*if (window.navigator.language.match(/en/)) {
      this.units.length = 'imperial';
    }*/
  }

  public convertDistance(distanceInMeters: number, noBigUnit = false): IUnitValue {
    let lengthUnit: LengthUnit = this.getActualUnits();

    let distanceValue: IUnitValue = {
      value: lengthUnit.convertDistance(distanceInMeters),
      unit: lengthUnit.smallUnit
    };

    if (distanceInMeters >= 1000 && noBigUnit === false) {
      distanceValue.value = lengthUnit.convertDistanceInBigUnit(distanceInMeters);
      distanceValue.unit = lengthUnit.bigUnit;
    }

    return distanceValue;
  }

  public convertDistanceInBigUnit(distanceInMeters: number): IUnitValue {
    let lengthUnit: LengthUnit = this.getActualUnits();

    let distanceValue: IUnitValue = {
      value: lengthUnit.convertDistanceInBigUnit(distanceInMeters),
      unit: lengthUnit.bigUnit
    };

    return distanceValue;
  }

  private getActualUnits(): LengthUnit {
    return units.length[this.units.length] || units.length.metric;
  }

}
