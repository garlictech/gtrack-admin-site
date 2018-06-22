import { Component } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';

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
