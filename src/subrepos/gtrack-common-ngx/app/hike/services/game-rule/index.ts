import { Injectable } from '@angular/core';

@Injectable()
export class GameRuleService {
  private _averageSpeed = 4.5; // km/h

  public segmentTime(distance, uphill, avgSpeed = this._averageSpeed): number {
    const distanceInKm = distance / 1000;
    let time = (distanceInKm / avgSpeed) * 60; // minutes

    time += Math.round(uphill / 10);

    return time;
  }

  public score(distanceInMeters, uphill): number {
    return Math.round(10 * ((distanceInMeters / 1000) * 1.5 + uphill / 50));
  }
}
