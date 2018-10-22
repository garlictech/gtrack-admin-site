import { Injectable } from '@angular/core';
import { getTimes, getMoonTimes, getMoonIllumination } from 'suncalc';
import _kebabCase from 'lodash-es/kebabCase';

export enum EMoonPhases {
  NewMoon = 0,
  WaxingCrescent = 1,
  FirstQuarter = 2,
  WaxingGibbous = 3,
  FullMoon = 4,
  WaningGibbous = 5,
  LastQuarter = 6,
  WaningCrescent = 7
}

@Injectable()
export class AstronomyService {

  public getSunTimes(position: GeoJSON.Position, date = new Date()) {
    const times = getTimes(date, position[1], position[0]);

    return times;
  }

  public getMoonTimes(position: GeoJSON.Position, date = new Date()) {
    const times = getMoonTimes(date, position[1], position[0]);

    return times;
  }

  public getMoonIconName(date = new Date()) {
    const phase = this.getMoonPhase();
    const icon  = _kebabCase(phase);

    return icon;
  }

  public getMoonPhase(date = new Date()) {
    const illumination = getMoonIllumination(date);
    const value = Math.round(illumination.phase * 8);

    return EMoonPhases[value];
  }
}
