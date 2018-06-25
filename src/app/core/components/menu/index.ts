import { Component, Input, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ScrollPanel } from 'primeng/primeng';
import { Store } from '@ngrx/store';
import { State } from 'app/store';
import { Actions as AuthActions } from 'subrepos/authentication-api-ngx';

@Component({
  selector: 'app-menu',
  templateUrl: './ui.html'
})
export class MenuComponent implements OnInit, AfterViewInit {
  @ViewChild('scrollPanel') layoutMenuScrollerViewChild: ScrollPanel;
  @Input() sidebarActive: boolean;
  @Input() onMenuButtonClick: any;
  public pages: any[];

  constructor(
    private _store: Store<State>
  ) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.layoutMenuScrollerViewChild.moveBar();
    }, 100);
  }

  ngOnInit() {
    this.pages = [
      { label: 'Hikes', routerLink: ['/admin/hikes'] },
      { label: 'Logout', command: this.logout },
    ];
  }

  public logout = () => {
    this._store.dispatch(new AuthActions.LogoutStart());
  }
}