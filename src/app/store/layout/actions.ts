import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { IMockHikeElement } from '../../shared/interfaces';

@Injectable()
export class LayoutActions {
  static OPEN_SIDENAV = '[Layout] Open Sidenav';
  static CLOSE_SIDENAV = '[Layout] Close Sidenav';

  openSidenav(): Action {
    return {
      type: LayoutActions.OPEN_SIDENAV
    };
  }

  closeSidenav(): Action {
    return {
      type: LayoutActions.CLOSE_SIDENAV
    };
  }
}
