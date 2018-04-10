import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { State } from 'app/store';
import { Actions as AuthActions } from 'subrepos/authentication-api-ngx';

@Component({
  selector: '[app-navbar]',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit, OnDestroy {
  public pageTitle: string;
  public toggleButton: any;
  public sidebarVisible: boolean;
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _element: ElementRef,
    private _router: Router,
    private _store: Store<State>,
    private _titleService: Title
  ) {
    this._router.events
      .filter(event => event instanceof NavigationEnd)
      .takeUntil(this._destroy$)
      .subscribe(event => {
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

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

  logout() {
    this._store.dispatch(new AuthActions.LogoutStart());
  }
}
