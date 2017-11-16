import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { RouteInfoDataActions, IRouteInfoDataState, routeInfoDataDomain } from './index';
import { State } from '../index';
import {
  RouteService,
  ISegment
} from '../../../subrepos/gtrack-common-ngx/app';
import { AdminMapService } from '../../shared/services/index';

@Injectable()
export class RouteInfoDataEffects {
  constructor(
    private _actions$: Actions,
    private _store: Store<any>,
    private _routeService: RouteService,
    private _routeInfoDataActions: RouteInfoDataActions,
    private _adminMapService: AdminMapService
  ) {}

}
