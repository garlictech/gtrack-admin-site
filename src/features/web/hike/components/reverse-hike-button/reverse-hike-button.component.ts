import { Component } from '@angular/core';
import { ReverseHikeButtonComponent as BaseComponent } from '@features/common/hike/components/reverse-hike-button';

@Component({
  selector: 'gtrack-reverse-hike-button',
  templateUrl: './reverse-hike-button.component.html',
  styleUrls: ['./reverse-hike-button.component.scss']
})
export class ReverseHikeButtonComponent extends BaseComponent {}
