import { LocalizationState } from '@features/common/localization/store';
import { RouterReducerState } from '@ngrx/router-store';
import { CommonState } from 'subrepos/gtrack-common-ngx/app/store/';

export interface State extends CommonState {
  language: LocalizationState;
  router: RouterReducerState; // ngrx/router
}
