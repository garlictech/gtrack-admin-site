import { AfterViewInit, Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { ElevationData } from '@bit/garlictech.angular-features.common.gtrack-interfaces';

@Component({
  // tslint:disable-next-line: component-selector
  selector: '[gtrack-elevation-line-graph]',
  templateUrl: './elevation-line-graph.component.html',
  // tslint:disable-next-line: use-view-encapsulation
  encapsulation: ViewEncapsulation.None
})
export class ElevationLineGraphComponent implements AfterViewInit, OnChanges {
  @Input() elevationData: ElevationData;
  @Input() stroke: string;

  line: string;

  constructor() {
    this.stroke = 'black';
  }

  ngAfterViewInit(): void {
    this._createLine();
  }

  ngOnChanges(): void {
    this._createLine();
  }

  private _createLine(): void {
    if (this.elevationData) {
      this.line = this.elevationData.lineFunc(this.elevationData.lineData);
    }
  }
}
