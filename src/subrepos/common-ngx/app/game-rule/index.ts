import { Injectable } from '@angular/core';

@Injectable()
export class GameRuleService {

  private averageSpeed = 4.5; // km/h

  public segmentTime(distance, uphill, avgSpeed = this.averageSpeed): number {
    let distanceInKm = distance / 1000;
    let time = (distanceInKm / avgSpeed) * 60; // minutes

    time += Math.round(uphill / 10);

    return time;
  }
}
