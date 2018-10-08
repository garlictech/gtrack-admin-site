import { ActionReducer } from '@ngrx/store';
import { IEditedHikeProgramState } from '../state';
import { editedHikeProgramActions } from '../actions';
import { EObjectState, ETextualDescriptionType } from 'subrepos/provider-client';

import _omit from 'lodash-es/omit';
import _assign from 'lodash-es/assign';
import _union from 'lodash-es/union';
import _cloneDeep from 'lodash-es/cloneDeep';
import { CheckpointSequence } from 'subrepos/gtrack-common-ngx';

export const initialEditedHikeProgramState: IEditedHikeProgramState = {
  data: {
    id: '',
    distance: 0,
    isRoundTrip: false,
    feature: false,
    uphill: 0,
    downhill: 0,
    time: 0,
    score: 0,
    location: '',
    difficulty: 1,
    backgroundImages: [],
    routeId: '',
    description: {
      en_US: {
        title: 'A new hike',
        fullDescription: '',
        summary: '',
        type: ETextualDescriptionType.markdown
      }
    },
    stops: [],
    checkpoints: new CheckpointSequence([]),
    timestamp: 0,
    state: EObjectState.draft
  },
  dirty: false,
  working: null,
  failed: null
};

export const editedHikeProgramReducer: ActionReducer<IEditedHikeProgramState> = (
  state = initialEditedHikeProgramState,
  action: editedHikeProgramActions.AllEditedHikeProgramActions
): IEditedHikeProgramState => {
  const newState = _cloneDeep(state);
  switch (action.type) {
    case editedHikeProgramActions.RESET_HIKE_PROGRAM: {
      return initialEditedHikeProgramState;
    }

    case editedHikeProgramActions.ADD_NEW_TRANSLATED_HIKE_DESCRIPTION: {
      newState.data.description[action.languageKey] = action.content;
      newState.dirty = true;
      return newState;
    }

    case editedHikeProgramActions.DELETE_TRANSLATED_HIKE_DESCRIPTION: {
      newState.data.description = _omit(newState.data.description, action.languageKey);
      newState.dirty = true;
      return newState;
    }

    case editedHikeProgramActions.SAVE_HIKE_PROGRAM: {
      newState.working = 'saving...';
      newState.failed = null;
      return newState;
    }

    case editedHikeProgramActions.HIKE_PROGRAM_SAVE_SUCCESS: {
      newState.working = null;
      newState.failed = null;
      newState.dirty = false;
      return newState;
    }

    case editedHikeProgramActions.HIKE_PROGRAM_SAVE_FAILED: {
      newState.working = null;
      newState.failed = action.error;
      return newState;
    }

    case editedHikeProgramActions.ADD_HIKE_PROGRAM_DETAILS: {
      newState.data = _assign(newState.data, action.details);
      if (action.setDirty) {
        newState.dirty = true;
      }

      return newState;
    }

    case editedHikeProgramActions.ADD_STOP: {
      newState.dirty = true;
      newState.data.stops = _union(state.data.stops, [action.stop]);
      return newState;
    }

    case editedHikeProgramActions.SET_STOPS: {
      newState.data.stops = _cloneDeep(action.stops);
      return newState;
    }

    case editedHikeProgramActions.REMOVE_STOP_BY_POI_ID: {
      newState.dirty = true;
      newState.data.stops = newState.data.stops.filter(s => action.poiIds.indexOf(s.poiId) < 0);
      return newState;
    }

    case editedHikeProgramActions.SET_CHECKPOINTS: {
      newState.data.checkpoints = _cloneDeep(action.checkpoints);
      return newState;
    }

    case editedHikeProgramActions.ADD_HIKE_PROGRAM_BACKGROUND_IMAGE: {
      newState.dirty = true;
      newState.data.backgroundImages = [
        ...<any>state.data.backgroundImages,
        action.imageData
      ];

      return newState;
    }

    case editedHikeProgramActions.REMOVE_HIKE_PROGRAM_BACKGROUND_IMAGE: {
      newState.dirty = true;
      newState.data.backgroundImages = (<any>newState.data.backgroundImages).filter(img => img.original.url !== action.origUrl);
      return newState;
    }

    default:
      return state;
  }
};
