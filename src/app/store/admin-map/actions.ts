import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

@Injectable()
export class AdminMapActions {
  static REGISTER_MAP = '[AdminMap] Register Map';

  registerMap(mapId): Action {
    return {
      type: AdminMapActions.REGISTER_MAP,
      payload: mapId
    };
  }
}
