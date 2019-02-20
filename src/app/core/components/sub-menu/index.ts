import { MenuItem } from 'primeng/api';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input } from '@angular/core';

import { MenuComponent } from '../menu';

@Component({
  selector: 'app-submenu',
  template: `
    <ng-template ngFor let-child let-i="index" [ngForOf]="root ? item : item.items">
      <li [ngClass]="{ 'active-menuitem': isActive(i) }" [class]="child.badgeStyleClass">
        <a
          [href]="child.url || '#'"
          (click)="itemClick($event, child, i)"
          *ngIf="!child.routerLink"
          [attr.target]="child.target"
        >
          <span class="menuitem-text">{{ child.label }}</span>
          <i class="fa fa-chevron-down layout-submenu-toggler" *ngIf="child.items"></i>
        </a>
        <a
          (click)="itemClick($event, child, i)"
          *ngIf="child.routerLink"
          [routerLink]="child.routerLink"
          routerLinkActive="active-menuitem-routerlink"
          [routerLinkActiveOptions]="{ exact: true }"
          [attr.target]="child.target"
        >
          <span class="menuitem-text">{{ child.label }}</span>
          <i class="fa fa-chevron-down layout-submenu-toggler" *ngIf="child.items"></i>
        </a>
        <ul>
          <app-submenu
            [item]="child"
            *ngIf="child.items"
            [@children]="isActive(i) ? 'visible' : 'hidden'"
          ></app-submenu>
        </ul>
      </li>
    </ng-template>
  `,
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

  constructor(public appMenu: MenuComponent) {}

  itemClick(event: Event, item: MenuItem, index: number) {
    // avoid processing disabled items
    if (item.disabled) {
      event.preventDefault();
      return true;
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
}
