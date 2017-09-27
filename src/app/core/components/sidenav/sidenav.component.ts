import { Component, Input } from '@angular/core';

@Component({
    selector: 'gt-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {
    @Input() open = false;
}
