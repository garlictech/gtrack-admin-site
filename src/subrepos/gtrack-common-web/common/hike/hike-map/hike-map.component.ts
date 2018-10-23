import { Component, Input, ViewChild } from '@angular/core';

import { HikeProgram } from 'subrepos/gtrack-common-ngx';
import { TrailBoxComponent } from '../trail-box';
import { ElevationProfileComponent } from '../elevation-profile';

import { BehaviorSubject } from 'rxjs';
import { log, DebugLog } from 'app/log';

@Component({
  selector: 'gtrack-hike-map',
  templateUrl: './hike-map.component.html',
  styles: ['./hike-map.component.scss']
})
export class HikeMapComponent {
  @Input()
  public hikeProgram: HikeProgram;

  @ViewChild('trailBox')
  public trailbox: TrailBoxComponent;

  @ViewChild('elevation')
  public elevationProfile: ElevationProfileComponent;

  public elevationMarkerPosition$ = new BehaviorSubject<GeoJSON.Position>([0, 0]);
  public elevationMarkerVisible$ = new BehaviorSubject<boolean>(false);
  protected _elevationMarkerLocked = false;

  @DebugLog
  onElevationLineOver() {
    const locked = this._elevationMarkerLocked;

    log.data('Locked', locked);

    if (!locked) {
      this.elevationMarkerVisible$.next(true);
    }
  }

  onElevationLineMove(position: GeoJSON.Position) {
    const locked = this._elevationMarkerLocked;

    if (!locked) {
      this.elevationMarkerPosition$.next(position);
    }
  }

  @DebugLog
  onElevationLineClick(position: GeoJSON.Position) {
    const locked = this._elevationMarkerLocked;

    log.data('Locked', locked);

    if (!locked) {
      this.elevationMarkerPosition$.next(position);
      this._elevationMarkerLocked = true;
      this.elevationMarkerVisible$.next(true);
    } else {
      this._elevationMarkerLocked = false;
    }
  }

  @DebugLog
  onElevationLineClickMap(data: { position: GeoJSON.Position; forced?: boolean }) {
    const locked = this._elevationMarkerLocked;

    log.data('Locked', locked);

    if (!locked || data.forced === true) {
      this.elevationMarkerPosition$.next(data.position);
      this._elevationMarkerLocked = true;
      this.elevationMarkerVisible$.next(true);
    } else {
      this._elevationMarkerLocked = false;
    }
  }

  @DebugLog
  onElevationLineOut() {
    const locked = this._elevationMarkerLocked;

    log.data('Locked', locked);

    if (!locked) {
      this.elevationMarkerVisible$.next(false);
    }
  }
}
