import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'gt-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SidenavComponent {
    @Input() open = false;
}
