import { Component, Input, ViewChild } from '@angular/core';

import { HikeProgram } from 'subrepos/gtrack-common-ngx';
import { TrailBoxComponent } from '../trail-box';
import { ElevationProfileComponent } from '../elevation-profile';

import { BehaviorSubject } from 'rxjs';
import { log, DebugLog } from 'app/log';

import { IWeatherEntity } from '@common.features/weather/store';

@Component({
  selector: 'gtrack-hike-map',
  templateUrl: './hike-map.component.html',
  styles: ['./hike-map.component.scss']
})
export class HikeMapComponent {
  @Input()
  public hikeProgram: HikeProgram;

  @Input()
  public startDate: Date;

  @Input()
  public weather: IWeatherEntity;

  @Input()
  public speed: number;

  @ViewChild('trailBox')
  public trailbox: TrailBoxComponent;

  @ViewChild('elevation')
  public elevationProfile: ElevationProfileComponent;

  public elevationMarkerPosition$ = new BehaviorSubject<GeoJSON.Position>([0, 0]);
  public elevationMarkerVisible$ = new BehaviorSubject<boolean>(false);
  public elevationMarkerLocked$ = new BehaviorSubject<boolean>(false);

  @DebugLog
  onElevationLineOver() {
    const locked = this.elevationMarkerLocked$.getValue();

    log.data('Locked', locked);

    if (!locked) {
      this.elevationMarkerVisible$.next(true);
    }
  }

  onElevationLineMove(position: GeoJSON.Position) {
    const locked = this.elevationMarkerLocked$.getValue();

    if (!locked) {
      this.elevationMarkerPosition$.next(position);
    }
  }

  @DebugLog
  onElevationLineClick(position: GeoJSON.Position) {
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

  @DebugLog
  onElevationLineClickMap(data: { position: GeoJSON.Position; forced?: boolean }) {
    const locked = this.elevationMarkerLocked$.getValue();

    log.data('Locked', locked);

    if (!locked || data.forced === true) {
      this.elevationMarkerPosition$.next(data.position);
      this.elevationMarkerVisible$.next(true);
      this.elevationMarkerLocked$.next(true);
    } else {
      this.elevationMarkerLocked$.next(false);
    }
  }

  @DebugLog
  onElevationLineOut() {
    const locked = this.elevationMarkerLocked$.getValue();

    log.data('Locked', locked);

    if (!locked) {
      this.elevationMarkerVisible$.next(false);
    }
  }
}
