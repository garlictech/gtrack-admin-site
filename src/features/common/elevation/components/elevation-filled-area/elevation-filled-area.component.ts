import { AfterViewInit, Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ElevationData } from '@bit/garlictech.angular-features.common.gtrack-interfaces';

@Component({
  // tslint:disable-next-line: component-selector
  selector: '[gtrack-elevation-filled-area]',
  templateUrl: './elevation-filled-area.component.html',
  // tslint:disable-next-line: use-view-encapsulation
  encapsulation: ViewEncapsulation.None
})
export class ElevationFilledAreaComponent implements AfterViewInit, OnChanges {
  area: string;

  @Input() elevationData: ElevationData;
  @Input() areaFill: string;

  constructor() {
    this.area = '';
  }

  ngAfterViewInit(): void {
    this.area = this.elevationData ? this.elevationData.areaFunc(this.elevationData.lineData) : '';
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.area = this.elevationData ? this.elevationData.areaFunc(this.elevationData.lineData) : '';
  }
}
