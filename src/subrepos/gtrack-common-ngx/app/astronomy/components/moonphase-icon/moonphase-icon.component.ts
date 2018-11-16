import { Component, Input, OnInit, OnChanges } from '@angular/core';
import _kebabCase from 'lodash-es/kebabCase';

import { EMoonPhases, AstronomyService } from '../../services';

@Component({
  selector: 'gtrack-moonphase-icon',
  templateUrl: './moonphase-icon.component.html',
  styleUrls: ['./moonphase-icon.component.scss']
})
export class MoonphaseIconComponent implements OnInit, OnChanges {
  @Input()
  public phase: string;

  public icon: string;

  private _icons = {
    NewMoon: 'wi-moon-new',
    WaxingCrescent: 'wi-moon-waxing-crescent-1',
    FirstQuarter: 'wi-moon-first-quarter',
    WaxingGibbous: 'wi-moon-waxing-gibbous-1',
    FullMoon: 'wi-moon-full',
    WaningGibbous: 'wi-moon-waning-gibbous-1',
    LastQuarter: 'wi-moon-third-quarter',
    WaningCrescent: 'wi-moon-waning-crescent-1'
  };

  constructor(private _astronomy: AstronomyService) {}

  ngOnInit() {
    const icon = this._icons[this.phase];

    this.icon = `assets/icons/weather/${icon}.svg`;
  }

  ngOnChanges() {
    const icon = this._icons[this.phase];

    this.icon = `assets/icons/weather/${icon}.svg`;
  }
}
