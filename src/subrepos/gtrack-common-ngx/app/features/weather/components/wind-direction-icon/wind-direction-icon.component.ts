import { Component, Input } from '@angular/core';

@Component({
  selector: 'gtrack-wind-direction-icon',
  templateUrl: './wind-direction-icon.component.html'
})
export class WindDirectionIconComponent {
  @Input()
  deg: number;

  @Input()
  width = 18;

  @Input()
  height = 18;
}
