import { Component, OnInit } from '@angular/core';

declare const $: any;

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
    {
        path: '/admin/hikes',
        title: 'Hikes',
        icon: 'list',
        class: ''
    }, {
        path: '/logout',
        title: 'Logout',
        icon: 'exit_to_app',
        class: ''
    },
];

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
    menuItems: any[];

    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
    }

    /*
    isMobileMenu() {
        // TODO jQuery
        // if ($(window).width() > 991) {
        //    return false;
        // }
        return false; // true;
    };
    */
}
