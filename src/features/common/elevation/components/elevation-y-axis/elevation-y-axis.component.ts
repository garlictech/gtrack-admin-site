import { AfterViewInit, Component, ElementRef, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { ElevationData } from '@bit/garlictech.angular-features.common.gtrack-interfaces';

import { axisLeft as d3AxisLeft } from 'd3-axis';

import { select as d3Select } from 'd3-selection';

@Component({
  // tslint:disable-next-line: component-selector
  selector: '[gtrack-elevation-y-axis]',
  template: '',
  // tslint:disable-next-line: use-view-encapsulation
  encapsulation: ViewEncapsulation.None
})
export class ElevationYAxisComponent implements AfterViewInit, OnChanges {
  @Input() elevationData: ElevationData;
  @Input() ticks: number;

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
    const yAxisVertical = d3AxisLeft(this.elevationData.yRange).tickSize(5);

    if (this.ticks) {
      yAxisVertical.ticks(this.ticks);
    }

    d3Select(this._elementRef.nativeElement).call(yAxisVertical);
  }
}
