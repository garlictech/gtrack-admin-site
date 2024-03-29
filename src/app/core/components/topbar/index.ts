import { Component, Input } from '@angular/core';
import { faBars, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-topbar',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss']
})
export class TopBarComponent {
  @Input() onMenuButtonClick: any;
  faBars: IconDefinition;

  constructor() {
    this.faBars = faBars;
  }
}
