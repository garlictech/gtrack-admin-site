import { AfterViewInit, Component, ElementRef, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { ElevationData } from '@bit/garlictech.angular-features.common.gtrack-interfaces';

import { axisTop as d3AxisTop } from 'd3-axis';

import { select as d3Select } from 'd3-selection';

@Component({
  // tslint:disable-next-line: component-selector
  selector: '[gtrack-elevation-x-axis-lines]',
  template: '',
  // tslint:disable-next-line: use-view-encapsulation
  encapsulation: ViewEncapsulation.None
})
export class ElevationXAxisLinesComponent implements AfterViewInit, OnChanges {
  @Input() elevationData: ElevationData;
  @Input() lineHeight: number;

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
    const xAxisLines = d3AxisTop(this.elevationData.xRange).tickSize(this.lineHeight);

    const customXAxis = g => {
      g.call(xAxisLines);
      g.select('.domain').remove();
      g.selectAll('.tick line')
        .attr('stroke', '#777')
        .attr('stroke-dasharray', '2,2');

      g.selectAll('text').remove();
    };

    d3Select(this._elementRef.nativeElement).call(customXAxis);
  }
}
