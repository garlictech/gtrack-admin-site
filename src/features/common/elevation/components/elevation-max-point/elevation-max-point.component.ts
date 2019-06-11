import { AfterViewInit, Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { ElevationData } from '@bit/garlictech.angular-features.common.gtrack-interfaces';

import { bisector as d3Bisector } from 'd3-array';
import _get from 'lodash-es/get';

@Component({
  // tslint:disable-next-line: component-selector
  selector: '[gtrack-elevation-max-point]',
  templateUrl: './elevation-max-point.component.html',
  styleUrls: ['./elevation-max-point.component.scss'],
  // tslint:disable-next-line: use-view-encapsulation
  encapsulation: ViewEncapsulation.None
})
export class ElevationMaxPointComponent implements AfterViewInit, OnChanges {
  @Input() elevationData: ElevationData;

  x: number;
  y: number;

  ngAfterViewInit(): void {
    this._calculate();
  }

  ngOnChanges(): void {
    this._calculate();
  }

  protected _calculate(): void {
    const highestPoint = this.elevationData.highestElevation;
    const xRange = this.elevationData.xRange;
    const yRange = this.elevationData.yRange;
    const lineData = this.elevationData.lineData;

    const bisect = _get(d3Bisector((d: [number, number]) => d[1]), 'left');
    const index = bisect(lineData, highestPoint);
    const data = lineData[index - 1];

    this.x = xRange(data[0]) + 2;
    this.y = yRange(data[1]) - 2;
  }
}
