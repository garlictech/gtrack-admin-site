import { RouterReducerState } from '@ngrx/router-store';
import { CommonState } from 'subrepos/gtrack-common-ngx/app/store/';
import { ILocalizationState } from 'subrepos/localize-ngx/store';

export interface IState extends CommonState {
  language: ILocalizationState;
  router: RouterReducerState; // ngrx/router
}
