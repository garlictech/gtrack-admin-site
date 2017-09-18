import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'gt-nav-item',
    templateUrl: './nav-item.component.html'
})
export class NavItemComponent {
    @Input() icon = '';
    @Input() hint = '';
    @Input() routerLink: string | any[] = '/';
    @Output() activate = new EventEmitter();
}
