import { AfterViewInit, Component, ElementRef, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { ElevationData } from '@bit/garlictech.angular-features.common.gtrack-interfaces';

import { axisRight as d3AxisRight } from 'd3-axis';

import { select as d3Select } from 'd3-selection';

@Component({
  // tslint:disable-next-line: component-selector
  selector: '[gtrack-elevation-y-axis-lines]',
  template: '',
  // tslint:disable-next-line: use-view-encapsulation
  encapsulation: ViewEncapsulation.None
})
export class ElevationYAxisLinesComponent implements AfterViewInit, OnChanges {
  @Input() elevationData: ElevationData;
  @Input() lineWidth: number;
  @Input() stroke: string;

  constructor(private readonly _elementRef: ElementRef) {
    this.stroke = '#777';
  }

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
    const yAxisLines = d3AxisRight(this.elevationData.yRange).tickSize(this.lineWidth);

    const customYAxis = g => {
      g.call(yAxisLines);
      g.select('.domain').remove();
      g.selectAll('.tick line')
        .attr('stroke', this.stroke)
        .attr('stroke-dasharray', '2,2');

      g.selectAll('text').remove();
    };

    d3Select(this._elementRef.nativeElement).call(customYAxis);
  }
}
