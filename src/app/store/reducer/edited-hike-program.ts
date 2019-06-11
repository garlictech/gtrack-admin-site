// tslint:disable:only-arrow-functions no-small-switch cyclomatic-complexity
import _assign from 'lodash-es/assign';
import _cloneDeep from 'lodash-es/cloneDeep';
import _omit from 'lodash-es/omit';
import _union from 'lodash-es/union';

import { EObjectState, ETextualDescriptionType } from '@bit/garlictech.angular-features.common.gtrack-interfaces';

import { editedHikeProgramActions } from '../actions';
import { EditedHikeProgramState } from '../state';

export const initialEditedHikeProgramState: EditedHikeProgramState = {
  data: {
    id: '',
    distance: 0,
    isRoundTrip: false,
    feature: false,
    uphill: 0,
    downhill: 0,
    time: 0,
    reverseTime: 0,
    score: 0,
    reverseScore: 0,
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
    teaser: {},
    stops: [],
    reverseStops: [],
    // checkpoints: new CheckpointSequence([]),
    timestamp: 0,
    state: EObjectState.draft
  },
  dirty: false,
  working: undefined,
  failed: undefined
};

export function editedHikeProgramReducer(
  state = initialEditedHikeProgramState,
  action: editedHikeProgramActions.AllEditedHikeProgramActions
): EditedHikeProgramState {
  const newState = _cloneDeep(state);

  switch (action.type) {
    case editedHikeProgramActions.RESET_HIKE_PROGRAM: {
      return { ...initialEditedHikeProgramState };
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
      newState.failed = undefined;

      return newState;
    }

    case editedHikeProgramActions.HIKE_PROGRAM_SAVE_SUCCESS: {
      newState.working = undefined;
      newState.failed = undefined;
      newState.dirty = false;

      return newState;
    }

    case editedHikeProgramActions.HIKE_PROGRAM_SAVE_FAILED: {
      newState.working = undefined;
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

    case editedHikeProgramActions.SET_HIKE_PROGRAM_LOCATION: {
      newState.data.location = action.location;

      return newState;
    }

    case editedHikeProgramActions.SET_HIKE_PROGRAM_IS_ROUNDTRIP: {
      newState.data.isRoundTrip = action.isRoundTrip;

      return newState;
    }

    case editedHikeProgramActions.SET_HIKE_PROGRAM_ID: {
      newState.data.id = action.id;

      return newState;
    }

    case editedHikeProgramActions.SET_HIKE_PROGRAM_ROUTE_ID: {
      newState.data.routeId = action.routeId;

      return newState;
    }

    case editedHikeProgramActions.SET_HIKE_PROGRAM_IS_FEATURE: {
      newState.data.feature = action.isFeature;
      newState.dirty = true;

      return newState;
    }

    case editedHikeProgramActions.SET_HIKE_PROGRAM_TOTALS: {
      newState.data = _assign(newState.data, action.totals);
      newState.dirty = true;

      return newState;
    }

    case editedHikeProgramActions.SET_HIKE_PROGRAM_DESCRIPTION: {
      newState.data = _assign(newState.data, action.description);
      newState.dirty = true;

      return newState;
    }

    case editedHikeProgramActions.SET_HIKE_PROGRAM_ICONS: {
      newState.data.elevationIcon = action.elevationIcon;
      newState.data.routeIcon = action.routeIcon;

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

    case editedHikeProgramActions.SET_REVERSE_STOPS: {
      newState.data.reverseStops = _cloneDeep(action.stops);

      return newState;
    }

    case editedHikeProgramActions.REMOVE_STOP_BY_POI_ID: {
      newState.dirty = true;
      newState.data.stops = newState.data.stops.filter(s => action.poiIds.indexOf(s.poiId) < 0);

      return newState;
    }

    case editedHikeProgramActions.SET_CHECKPOINTS: {
      // newState.data.checkpoints = _cloneDeep(action.checkpoints);

      return newState;
    }

    case editedHikeProgramActions.ADD_HIKE_PROGRAM_BACKGROUND_IMAGE: {
      newState.dirty = true;
      newState.data.backgroundImages = [...(state.data.backgroundImages as any), action.imageData];

      return newState;
    }

    case editedHikeProgramActions.REMOVE_HIKE_PROGRAM_BACKGROUND_IMAGE: {
      newState.dirty = true;
      newState.data.backgroundImages = (newState.data.backgroundImages as any).filter(
        img => img.original.url !== action.origUrl
      );

      return newState;
    }

    default:
      return state;
  }
}
