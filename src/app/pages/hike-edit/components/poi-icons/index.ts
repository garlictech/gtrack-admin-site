// Core
import { Component, Input, OnInit } from '@angular/core';
import { IExternalPoi } from '../../../../shared/interfaces';
import { LeafletIconService } from '@common.features/leaflet-map/services/leaflet-icon.service';

import _uniq from 'lodash-es/uniq';

@Component({
  selector: 'app-poi-icons',
  template: '<img *ngFor="let url of urls" [src]="url">'
})
export class PoiIconsComponent implements OnInit {
  @Input() poi: IExternalPoi;
  public urls: string[] = [];

  constructor(
    private _leafletIconService: LeafletIconService
  ) {}

  ngOnInit() {
    if (typeof this.poi.types !== 'undefined') {
      this.urls = _uniq(this._leafletIconService.urls(this.poi.types));
    } else {
      this.urls = [];
    }
  }
}
