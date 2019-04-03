import { Component, Input, ViewChild } from '@angular/core';

import { HikeProgram } from 'subrepos/gtrack-common-ngx';
import { ElevationProfileComponent } from '../elevation-profile';
import { TrailBoxComponent } from '../trail-box';

import { DebugLog, log } from 'app/log';
import { BehaviorSubject } from 'rxjs';

import { WeatherEntity } from '@bit/garlictech.angular-features.common.weather/store';

@Component({
  selector: 'gtrack-hike-map',
  templateUrl: './hike-map.component.html',
  styles: ['./hike-map.component.scss']
})
export class HikeMapComponent {
  @Input() hikeProgram: HikeProgram;

  @Input() startDate: Date;

  @Input() weather: WeatherEntity;

  @Input() speed: number;

  @ViewChild('trailBox') trailbox: TrailBoxComponent;

  @ViewChild('elevation') elevationProfile: ElevationProfileComponent;

  elevationMarkerPosition$: BehaviorSubject<GeoJSON.Position>;
  elevationMarkerVisible$: BehaviorSubject<boolean>;
  elevationMarkerLocked$: BehaviorSubject<boolean>;

  constructor() {
    this.elevationMarkerPosition$ = new BehaviorSubject<GeoJSON.Position>([0, 0]);
    this.elevationMarkerVisible$ = new BehaviorSubject<boolean>(false);
    this.elevationMarkerLocked$ = new BehaviorSubject<boolean>(false);
  }

  @DebugLog onElevationLineOver(): void {
    const locked = this.elevationMarkerLocked$.getValue();

    log.data('Locked', locked);

    if (!locked) {
      this.elevationMarkerVisible$.next(true);
    }
  }

  onElevationLineMove(position: GeoJSON.Position): void {
    const locked = this.elevationMarkerLocked$.getValue();

    if (!locked) {
      this.elevationMarkerPosition$.next(position);
    }
  }

  @DebugLog onElevationLineClick(position: GeoJSON.Position): void {
    const locked = this.elevationMarkerLocked$.getValue();

    log.data('Locked', locked);

    if (!locked) {
      this.elevationMarkerPosition$.next(position);
      this.elevationMarkerVisible$.next(true);
      this.elevationMarkerLocked$.next(true);
    } else {
      this.elevationMarkerLocked$.next(false);
    }
  }

  @DebugLog onElevationLineClickMap(data: { position: GeoJSON.Position; forced?: boolean }): void {
    const locked = this.elevationMarkerLocked$.getValue();

    log.data('Locked', locked);

    if (!locked || data.forced) {
      this.elevationMarkerPosition$.next(data.position);
      this.elevationMarkerVisible$.next(true);
      this.elevationMarkerLocked$.next(true);
    } else {
      this.elevationMarkerLocked$.next(false);
    }
  }

  @DebugLog onElevationLineOut(): void {
    const locked = this.elevationMarkerLocked$.getValue();

    log.data('Locked', locked);

    if (!locked) {
      this.elevationMarkerVisible$.next(false);
    }
  }
}
