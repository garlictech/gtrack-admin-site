import { IState as CommonState } from 'subrepos/gtrack-common-web/store';

import { EditedGTrackPoiState } from './edited-gtrack-poi';
import { EditedHikeProgramState } from './edited-hike-program';
import { HikeEditImageState } from './hike-edit-image';
import { HikeEditPoiState } from './hike-edit-poi';
import { HikeEditRoutePlannerState } from './hike-edit-route-planner';

export * from './hike-edit-poi';
export * from './hike-edit-image';
export * from './hike-edit-route-planner';
export * from './edited-hike-program';
export * from './edited-gtrack-poi';

export interface State extends CommonState {
  hikeEditRoutePlanner: HikeEditRoutePlannerState;
  hikeEditPoi: HikeEditPoiState;
  hikeEditImage: HikeEditImageState;
  editedHikeProgram: EditedHikeProgramState;
  editedGtrackPoi: EditedGTrackPoiState;
}
