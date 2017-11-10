import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

@Injectable()
export class HikeEditRoutePlanningActions {
  static RETRIEVE_PLAN = '[HikeEditRoutePLanning] Retrieve plan';
  static REMOVE_LAST = '[HikeEditRoutePLanning] Remove last';
  static CLOSE_CIRCLE = '[HikeEditRoutePLanning] Close circle';
  static DELETE_PLAN = '[HikeEditRoutePLanning] Delete plan';
  static SAVE_ROUTE = '[HikeEditRoutePLanning] Save route';

  retrievePlan(): Action {
    return {
      type: HikeEditRoutePlanningActions.RETRIEVE_PLAN
    };
  }

  removeLast(): Action {
    return {
      type: HikeEditRoutePlanningActions.REMOVE_LAST
    };
  }

  closeCircle(): Action {
    return {
      type: HikeEditRoutePlanningActions.CLOSE_CIRCLE
    };
  }

  deletePlan(): Action {
    return {
      type: HikeEditRoutePlanningActions.DELETE_PLAN
    };
  }

  saveRoute(): Action {
    return {
      type: HikeEditRoutePlanningActions.SAVE_ROUTE
    };
  }
}
