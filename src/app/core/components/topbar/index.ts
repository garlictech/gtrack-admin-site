import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-topbar',
  templateUrl: './ui.html',
  styles: ['.layout-topbar { z-index: 999999999999; }']
})
export class TopBarComponent {
  @Input() onMenuButtonClick: any;
}
