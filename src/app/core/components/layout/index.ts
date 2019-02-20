import { Component } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './ui.html'
})
export class LayoutComponent {
  sidebarActive = false;

  onMenuButtonClick = (event: Event) => {
    this.sidebarActive = !this.sidebarActive;
    event.preventDefault();
  };
}
