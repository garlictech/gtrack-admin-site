import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

@Injectable()
export class AdminMapActions {
  static REGISTER_MAP = '[AdminMap] Register Map';
  static MAP_REGISTERED = '[AdminMap] Map registered';

  registerMap(mapId): Action {
    return {
      type: AdminMapActions.REGISTER_MAP,
      payload: mapId
    };
  }

  mapRegistered(mapId): Action {
    return {
      type: AdminMapActions.MAP_REGISTERED
    };
  }
}
