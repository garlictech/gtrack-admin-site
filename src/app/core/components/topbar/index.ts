import { Component, Input } from '@angular/core';
import { faBars } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-topbar',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss']
})
export class TopBarComponent {
  @Input() onMenuButtonClick: any;
  public faBars = faBars;
}
