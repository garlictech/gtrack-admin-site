import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameRuleService {
  private readonly _averageSpeed: number; // km/h

  constructor() {
    this._averageSpeed = 4.5;
  }

  segmentTime(distance, uphill, avgSpeed = this._averageSpeed): number {
    const distanceInKm = distance / 1000;
    let time = (distanceInKm / avgSpeed) * 60; // minutes

    time += Math.round(uphill / 10);

    return time;
  }

  score(distanceInMeters, uphill): number {
    return Math.round(((distanceInMeters / 1000) * 1.5 + uphill / 50) * 10);
  }
}
