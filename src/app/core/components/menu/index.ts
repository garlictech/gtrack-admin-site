import { ConfirmationService } from 'primeng/api';
import { ScrollPanel } from 'primeng/scrollpanel';
import { Actions as AuthActions } from 'subrepos/authentication-api-ngx';

import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';

import { State } from '../../../store';

@Component({
  selector: 'app-menu',
  templateUrl: './ui.html',
  styles: ['.layout-sidebar { z-index: 10000; }']
})
export class MenuComponent implements OnInit, AfterViewInit {
  @ViewChild('scrollPanel') layoutMenuScrollerViewChild: ScrollPanel;
  @Input() sidebarActive: boolean;
  @Input() onMenuButtonClick: any;
  pages: Array<any>;

  constructor(private readonly _store: Store<State>, private readonly _confirmationService: ConfirmationService) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.layoutMenuScrollerViewChild.moveBar();
    }, 100);
  }

  ngOnInit() {
    this.pages = [{ label: 'Hikes', routerLink: ['/admin/hikes'] }, { label: 'Logout', command: this.logout }];
  }

  logout = () => {
    this._confirmationService.confirm({
      message: 'Are you sure that you want to logout?',
      accept: () => {
        this._store.dispatch(new AuthActions.LogoutStart());
      }
    });
  };
}
