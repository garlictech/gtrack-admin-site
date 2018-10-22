import { Component, OnInit, Input } from '@angular/core';
import { GetTimesResult, GetMoonTimes } from 'suncalc';

import { AstronomyService } from '../../services/astronomy.service';

@Component({
  selector: 'gtrack-sunrise',
  templateUrl: './sunrise.component.html'
})
export class SunriseComponent implements OnInit {

  @Input()
  public position: GeoJSON.Position;

  @Input()
  public day: Date;

  public astronomyData: {
    sun: GetTimesResult,
    moon: GetMoonTimes,
    moonPhase: string
  };

  constructor(
    private _astronomy: AstronomyService
  ) { }

  ngOnInit() {
    this.astronomyData = {
      sun: this._astronomy.getSunTimes(this.position, this.day),
      moon: this._astronomy.getMoonTimes(this.position, this.day),
      moonPhase: this._astronomy.getMoonPhase(this.day)
    };
  }
}
