import _uniq from 'lodash-es/uniq';

// Core
import { Component, Input, OnInit } from '@angular/core';
import { LeafletIconService } from '@common.features/leaflet-map/services/leaflet-icon.service';

import { ExternalPoi } from '../../../../shared/interfaces';

@Component({
  selector: 'app-poi-icons',
  template: '<img *ngFor="let url of urls" [src]="url">'
})
export class PoiIconsComponent implements OnInit {
  @Input() poi: ExternalPoi;
  urls: Array<string> = [];

  constructor(private readonly _leafletIconService: LeafletIconService) {}

  ngOnInit() {
    if (typeof this.poi.types !== 'undefined') {
      this.urls = _uniq(this._leafletIconService.urls(this.poi.types));
    } else {
      this.urls = [];
    }
  }
}
