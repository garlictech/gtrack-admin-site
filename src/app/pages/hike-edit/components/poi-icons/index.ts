import _uniq from 'lodash-es/uniq';

// Core
import { Component, Input, OnInit } from '@angular/core';
import { MarkerIconsService } from '@bit/garlictech.angular-features.common.marker-icons';

import { ExternalPoi } from '../../../../shared/interfaces';

@Component({
  selector: 'app-poi-icons',
  template: '<img *ngFor="let url of urls; trackBy: trackByFn" [src]="url">'
})
export class PoiIconsComponent implements OnInit {
  @Input() poi: ExternalPoi;
  urls: Array<string>;

  constructor(private readonly _markerIconsService: MarkerIconsService) {
    this.urls = [];
  }

  ngOnInit(): void {
    this.urls =
      typeof this.poi.types !== 'undefined'
        ? _uniq(this.poi.types.map((type: string) => this._markerIconsService.getIcon(type, true)))
        : [];
  }

  trackByFn(index: number): number {
    return index;
  }
}
