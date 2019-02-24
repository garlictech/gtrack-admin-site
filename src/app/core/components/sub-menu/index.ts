import { MenuItem } from 'primeng/api';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input } from '@angular/core';

import { MenuComponent } from '../menu';

@Component({
  selector: 'app-submenu',
  templateUrl: './ui.html',
  animations: [
    trigger('children', [
      state(
        'visible',
        style({
          height: '*'
        })
      ),
      state(
        'hidden',
        style({
          height: '0px'
        })
      ),
      transition('visible => hidden', animate('600ms cubic-bezier(0.86, 0, 0.07, 1)')),
      transition('hidden => visible', animate('600ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
  ]
})
export class SubMenuComponent {
  @Input() item: MenuItem;
  @Input() root: boolean;
  @Input() onMenuButtonClick: any;

  private _activeIndex: number;

  constructor(public appMenu: MenuComponent) {
    this.root = false;
    this._activeIndex = 0;
  }

  itemClick(event: Event, item: MenuItem, index: number): void {
    // avoid processing disabled items
    if (item.disabled) {
      event.preventDefault();

      return;
    }

    // activate current item and deactivate active sibling if any
    if (item.routerLink || item.items || item.command || item.url) {
      this._activeIndex = this._activeIndex === index ? -1 : index;
    }

    // execute command
    if (item.command) {
      item.command({ originalEvent: event, item });
    }

    // prevent hash change
    if (item.items || (!item.url && !item.routerLink)) {
      setTimeout(() => {
        this.appMenu.layoutMenuScrollerViewChild.moveBar();
      }, 450);
      event.preventDefault();
    }

    // hide menu
    if (!item.items) {
      this.onMenuButtonClick(event);
    }
  }

  isActive(index: number): boolean {
    return this._activeIndex === index;
  }

  trackByFn(index: number): number {
    return index;
  }
}
