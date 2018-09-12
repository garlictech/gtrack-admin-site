// Core
import { Component, Input, OnInit } from '@angular/core';
import { IExternalPoi } from '../../../../shared/interfaces';
import { IconService, } from 'subrepos/gtrack-common-ngx';
import * as _ from 'lodash';

@Component({
  selector: 'app-poi-icons',
  template: '<img *ngFor="let url of urls" [src]="url">'
})
export class PoiIconsComponent implements OnInit {
  @Input() poi: IExternalPoi;
  public urls: string[] = [];

  constructor(
    private _iconService: IconService
  ) {}

  ngOnInit() {
    if (typeof this.poi.types !== 'undefined') {
      this.urls = _.uniq(this._iconService.urls(this.poi.types));
    } else {
      this.urls = [];
    }
  }
}
