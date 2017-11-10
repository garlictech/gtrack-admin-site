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

  @Effect()
  addtrack$: Observable<Action> = this._actions$
    .ofType(RouteInfoDataActions.ADD_TRACK)
    .map(toPayload)
    .switchMap(data => {
      let track = data;
      track.bounds = this._routeService.getBounds(track);
      return Observable.of(this._routeInfoDataActions.addTrackToStore(track));
    });

  @Effect()
  pushSegment$: Observable<Action> = this._actions$
    .ofType(RouteInfoDataActions.PUSH_SEGMENT)
    .withLatestFrom(this._store)
    .map(([action, state]) => {
      let _segments = state.routeInfoData.segments;
      _segments.push(action.payload);
      let _total = this._adminMapService.calculateTotal(_segments);

      return this._routeInfoDataActions.pushSegmentsToStore({
        segments: _segments,
        total: _total
      });
    });

  @Effect()
  pushSegmentToStore$: Observable<Action> = this._actions$
    .ofType(RouteInfoDataActions.PUSH_SEGMENTS_TO_STORE)
    .map(toPayload)
    .switchMap(data => {
      return Observable.empty<Response>();
    });

  @Effect()
  popSegment$: Observable<Action> = this._actions$
    .ofType(RouteInfoDataActions.POP_SEGMENT)
    .withLatestFrom(this._store)
    .map(([action, state]) => {
      let _segments = state.routeInfoData.segments;
      _segments.pop();
      let _total = this._adminMapService.calculateTotal(_segments);

      return this._routeInfoDataActions.popSegmentsToStore({
        segments: _segments,
        total: _total
      });
    });
}
