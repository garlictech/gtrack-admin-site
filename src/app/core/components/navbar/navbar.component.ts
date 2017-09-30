import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from '../../../store';
import { Actions as AuthActions } from 'authentication-api-ngx';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  pageTitle: string;
  private _toggleButton: any;
  private _sidebarVisible: boolean;

  constructor(
    private _element: ElementRef,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _store: Store<State>
  ) {
    // Read page title from route params
    this._router.events
      .filter((event) => event instanceof NavigationEnd)
      .map(() => this._activatedRoute)
      .map((route) => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      })
      .filter((route) => route.outlet === 'primary')
      .mergeMap((route) => route.data)
      .subscribe((event) => {
        this.pageTitle = (event.title ) || 'Untitled page';
      });

    this._sidebarVisible = false;
  }

  ngOnInit() {
    const navbar: HTMLElement = this._element.nativeElement;
    this._toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
  }

  logout() {
    this._store.dispatch(new AuthActions.LogoutStart());
  }

  /**
   * Mobile view
   */
  sidebarToggle() {
    if (this._sidebarVisible === false) {
      this._sidebarOpen();
    } else {
      this._sidebarClose();
    }
  };

  private _sidebarOpen() {
    const toggleButton = this._toggleButton;
    const body = document.getElementsByTagName('body')[0];

    setTimeout(function() {
      toggleButton.classList.add('toggled');
    }, 500);
    body.classList.add('nav-open');
    this._sidebarVisible = true;
  };

  private _sidebarClose() {
    const body = document.getElementsByTagName('body')[0];
    this._toggleButton.classList.remove('toggled');
    this._sidebarVisible = false;
    body.classList.remove('nav-open');
  };
}
