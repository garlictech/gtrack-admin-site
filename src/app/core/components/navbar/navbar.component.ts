import { Component, OnInit, ElementRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from 'app/store';
import { Actions as AuthActions } from 'subrepos/authentication-api-ngx';

@Component({
  selector: '[app-navbar]',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
  pageTitle: string;
  toggleButton: any;
  sidebarVisible: boolean;

  constructor(
    private _element: ElementRef,
    private _router: Router,
    private _store: Store<State>,
    private _titleService: Title
  ) {
    this._router.events.filter(event => event instanceof NavigationEnd).subscribe(event => {
      setTimeout(() => {
        this.pageTitle = this._titleService.getTitle();
      });
    });

    this.sidebarVisible = false;
  }

  ngOnInit() {
    const navbar: HTMLElement = this._element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
  }

  logout() {
    this._store.dispatch(new AuthActions.LogoutStart());
  }
}
