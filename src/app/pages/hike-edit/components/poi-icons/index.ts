import _uniq from 'lodash-es/uniq';

// Core
import { Component, Input, OnInit } from '@angular/core';
import { LeafletIconService } from '@bit/garlictech.angular-features.common.leaflet-map';

import { ExternalPoi } from '../../../../shared/interfaces';

@Component({
  selector: 'app-poi-icons',
  template: '<img *ngFor="let url of urls; trackBy: trackByFn" [src]="url">'
})
export class PoiIconsComponent implements OnInit {
  @Input() poi: ExternalPoi;
  urls: Array<string>;

  constructor(private readonly _leafletIconService: LeafletIconService) {
    this.urls = [];
  }

  ngOnInit(): void {
    this.urls = typeof this.poi.types !== 'undefined' ? _uniq(this._leafletIconService.urls(this.poi.types)) : [];
  }

  trackByFn(index: number): number {
    return index;
  }
}
