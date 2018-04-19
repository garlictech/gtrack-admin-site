import { CommonState, IAuthenticationState } from 'subrepos/gtrack-common-ngx';
import { RouterReducerState } from '@ngrx/router-store';

import { ILocalizationState } from 'app/language';

import { IHikeEditRoutePlannerState } from './hike-edit-route-planner';
import { IHikeEditMapState } from './hike-edit-map';
import { IHikeEditPoiState, IExternalPoiListContextState, IExternalPoiListContextItemState } from './hike-edit-poi';
import { IHikeEditGeneralInfoState, IGeneralInfoState } from './hike-edit-general-info';
import { IEditedHikeProgramState } from './edited-hike-program';
import { IEditedGtrackPoiState } from './edited-gtrack-poi';

export * from './hike-edit-poi';
export * from './hike-edit-map';
export * from './hike-edit-route-planner';
export * from './hike-edit-general-info';
export * from './edited-hike-program';
export * from './edited-gtrack-poi';

export interface State extends CommonState {
  authentication: IAuthenticationState;
  router: RouterReducerState; // ngrx/router
  hikeEditRoutePlanner: IHikeEditRoutePlannerState;
  hikeEditGeneralInfo: IHikeEditGeneralInfoState;
  hikeEditMap: IHikeEditMapState;
  hikeEditPoi: IHikeEditPoiState;
  language: ILocalizationState;
  editedHikeProgram: IEditedHikeProgramState;
  editedGtrackPoi: IEditedGtrackPoiState;
}
