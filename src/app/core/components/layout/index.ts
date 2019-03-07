import { Component } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './ui.html'
})
export class LayoutComponent {
  sidebarActive: boolean;

  constructor() {
    this.sidebarActive = false;
  }

  // tslint:disable-next-line:no-property-initializers
  onMenuButtonClick = (event: Event) => {
    this.sidebarActive = !this.sidebarActive;
    event.preventDefault();
  };
}
