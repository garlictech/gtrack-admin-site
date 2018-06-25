import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from 'app/store';
import { Actions as AuthActions } from 'subrepos/authentication-api-ngx';

declare const window: any;

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
  }
];

@Component({
  selector: '[app-sidebar]',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public menuItems: any[];

  constructor(
    private _store: Store<State>
  ) {}

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }

  logout() {
    this._store.dispatch(new AuthActions.LogoutStart());
  }
}