import { Component, ElementRef, HostListener, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ElevationData } from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import { Route } from '@bit/garlictech.angular-features.common.route';
import { ElevationService } from '../../services';

@Component({
  selector: 'gtrack-common-elevation-profile-line',
  template: ''
})
export class ElevationProfileLineComponent implements OnInit, OnChanges {
  @Input() route: Route;
  width: number;
  @Input() height: number;
  elevationData: ElevationData;

  xAxisLineHeight: number;
  yAxisLineWidth: number;

  @Input() margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };

  @ViewChild('elevationProfile') mainDiv: ElementRef;

  @HostListener('window:resize') onResize(): void {
    const width = this.mainDiv.nativeElement.clientWidth;

    this.width = width;

    this.elevationData = this._elevationService.getd3ElevationData(this.route, this.width, this.height, this.margins);

    this.yAxisLineWidth = this.width - this.margins.left - this.margins.right;
  }

  constructor(private readonly _elevationService: ElevationService, readonly router: Router) {
    this.height = 140;

    this.margins = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    };
  }

  protected _updateElevationData(): void {
    this.elevationData = this._elevationService.getd3ElevationData(this.route, this.width, this.height, this.margins);
  }

  ngOnInit(): void {
    this.width = this.mainDiv.nativeElement.clientWidth;
    this._updateElevationData();
    this.xAxisLineHeight = this.height - this.margins.top - this.margins.bottom;
    this.yAxisLineWidth = this.width - this.margins.left - this.margins.right;
  }

  ngOnChanges(): void {
    this._updateElevationData();
  }
}
