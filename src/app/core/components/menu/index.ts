import { Component, Input, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ScrollPanel } from 'primeng/primeng';
import { Store } from '@ngrx/store';
import { State } from '../../../store';
import { ConfirmationService } from 'primeng/primeng';
import { Actions as AuthActions } from 'subrepos/authentication-api-ngx';

@Component({
  selector: 'app-menu',
  templateUrl: './ui.html',
  styles: ['.layout-sidebar { z-index: 9999999; }']
})
export class MenuComponent implements OnInit, AfterViewInit {
  @ViewChild('scrollPanel') layoutMenuScrollerViewChild: ScrollPanel;
  @Input() sidebarActive: boolean;
  @Input() onMenuButtonClick: any;
  public pages: any[];

  constructor(
    private _store: Store<State>,
    private _confirmationService: ConfirmationService
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
    this._confirmationService.confirm({
      message: 'Are you sure that you want to logout?',
      accept: () => {
        this._store.dispatch(new AuthActions.LogoutStart());
      }
    });
  }
}
