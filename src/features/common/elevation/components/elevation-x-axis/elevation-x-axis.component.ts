import { AfterViewInit, Component, ElementRef, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { ElevationData } from '@bit/garlictech.angular-features.common.gtrack-interfaces';

import { axisBottom as d3AxisBottom } from 'd3-axis';

import { select as d3Select } from 'd3-selection';

@Component({
  // tslint:disable-next-line: component-selector
  selector: '[gtrack-elevation-x-axis]',
  template: '',
  // tslint:disable-next-line: use-view-encapsulation
  encapsulation: ViewEncapsulation.None
})
export class ElevationXAxisComponent implements AfterViewInit, OnChanges {
  @Input() elevationData: ElevationData;

  constructor(private readonly _elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    if (this.elevationData) {
      this.addAxis();
    }
  }

  ngOnChanges(): void {
    this._elementRef.nativeElement.innerHtml = '';

    if (this.elevationData) {
      this.addAxis();
    }
  }

  addAxis(): void {
    // The vertical axis
    const xAxisHorizontal = d3AxisBottom(this.elevationData.xRange)
      .tickSize(5)
      .tickFormat(d => `${d} km`);

    d3Select(this._elementRef.nativeElement).call(xAxisHorizontal);
  }
}
