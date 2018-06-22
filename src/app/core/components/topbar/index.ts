import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-topbar',
  templateUrl: './ui.html'
})
export class TopBarComponent {
  @Input() onMenuButtonClick: any;
}
