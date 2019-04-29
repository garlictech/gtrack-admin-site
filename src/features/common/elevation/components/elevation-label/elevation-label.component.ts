import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: '[gtrack-elevation-label]',
  templateUrl: './elevation-label.component.html',
  // tslint:disable-next-line: use-view-encapsulation
  encapsulation: ViewEncapsulation.None
})
export class ElevationLabelComponent {
  @Input() elevationText: string;
}
