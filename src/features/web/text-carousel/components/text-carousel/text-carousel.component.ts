import { Component } from '@angular/core';
import { faChevronLeft, faChevronRight, faCircle, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'gtrack-text-carousel',
  templateUrl: './text-carousel.component.html',
  styleUrls: ['./text-carousel.component.scss']
})
export class TextCarouselComponent {
  rightIcon: IconDefinition;
  leftIcon: IconDefinition;
  circle: IconDefinition;

  constructor() {
    this.rightIcon = faChevronRight;
    this.leftIcon = faChevronLeft;
    this.circle = faCircle;
  }
}
