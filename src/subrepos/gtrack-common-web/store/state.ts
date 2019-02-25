import { CommonState } from 'subrepos/gtrack-common-ngx/app/store/';

import { LocalizationState } from '@bit/garlictech.angular-features.common.localization';
import { RouterReducerState } from '@ngrx/router-store';

export interface State extends CommonState {
  language: LocalizationState;
  router: RouterReducerState; // ngrx/router
}
