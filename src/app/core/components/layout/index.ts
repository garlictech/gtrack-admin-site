import { Component } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './ui.html'
})
export class LayoutComponent {
  public sidebarActive = false;

  public onMenuButtonClick = (event: Event) => {
    this.sidebarActive = !this.sidebarActive;
    event.preventDefault();
  }
}
