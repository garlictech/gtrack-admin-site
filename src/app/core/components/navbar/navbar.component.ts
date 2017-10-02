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
  toggleButton: any;
  sidebarVisible: boolean;

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

    this.sidebarVisible = false;
  }

  ngOnInit() {
    const navbar: HTMLElement = this._element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
  }

  logout() {
    this._store.dispatch(new AuthActions.LogoutStart());
  }

  /**
   * Mobile view
   */
  sidebarToggle() {
    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }
  };

  sidebarOpen() {
    const toggleButton = this.toggleButton;
    const body = document.getElementsByTagName('body')[0];

    setTimeout(function() {
      toggleButton.classList.add('toggled');
    }, 500);
    body.classList.add('nav-open');
    this.sidebarVisible = true;
  };

  sidebarClose() {
    const body = document.getElementsByTagName('body')[0];
    this.toggleButton.classList.remove('toggled');
    this.sidebarVisible = false;
    body.classList.remove('nav-open');
  };
}
