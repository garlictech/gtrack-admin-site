import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

@Injectable()
export class HikeEditRoutePlanningActions {
  static SAVE_ROUTE = '[HikeEditRoutePLanning] Save route';

  saveRoute(): Action {
    return {
      type: HikeEditRoutePlanningActions.SAVE_ROUTE
    };
  }
}
