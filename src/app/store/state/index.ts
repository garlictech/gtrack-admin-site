import { IState as CommonState } from 'subrepos/gtrack-common-web/store';

import { IHikeEditRoutePlannerState } from './hike-edit-route-planner';
import { IHikeEditMapState } from './hike-edit-map';
import { IHikeEditPoiState } from './hike-edit-poi';
import { IEditedHikeProgramState } from './edited-hike-program';
import { IEditedGTrackPoiState } from './edited-gtrack-poi';
import { IHikeEditImageState } from './hike-edit-image';

export * from './hike-edit-poi';
export * from './hike-edit-image';
export * from './hike-edit-map';
export * from './hike-edit-route-planner';
export * from './edited-hike-program';
export * from './edited-gtrack-poi';

export interface State extends CommonState {
  hikeEditRoutePlanner: IHikeEditRoutePlannerState;
  hikeEditMap: IHikeEditMapState;
  hikeEditPoi: IHikeEditPoiState;
  hikeEditImage: IHikeEditImageState;
  editedHikeProgram: IEditedHikeProgramState;
  editedGtrackPoi: IEditedGTrackPoiState;
}
