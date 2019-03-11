// tslint:disable:only-arrow-functions
import { ActionReducer, ActionReducerMap, combineReducers } from '@ngrx/store';
import _cloneDeep from 'lodash-es/cloneDeep';
import * as Actions from './actions';
import {
  HikeProgramSettingsState,
  initialHikeProgramSettingsState,
  initialPrivateProfileState,
  PrivateProfileState,
  PublicProfileCollectionState,
  publicProfileStateAdapter,
  SettingsState
} from './state';

const publicProfileReducer: ActionReducer<PublicProfileCollectionState> = (
  state: PublicProfileCollectionState = publicProfileStateAdapter.getInitialState(),
  action: Actions.AllActions
): PublicProfileCollectionState => {
  switch (action.type) {
    case Actions.PUBLIC_PROFILE_FETCH_START:
      return publicProfileStateAdapter.addOne({ working: true, failed: undefined, id: action.id }, state);

    case Actions.PUBLIC_PROFILE_FETCHED:
      return publicProfileStateAdapter.updateOne(
        { id: action.id, changes: { ...action.settings, working: false, failed: undefined } },
        state
      );

    default:
      return state;
  }
};

const privateSettingsReducer: ActionReducer<PrivateProfileState> = (
  state = initialPrivateProfileState,
  action: Actions.AllActions
) => {
  switch (action.type) {
    case Actions.SETTINGS_SAVE_START: {
      const profileGroups = _cloneDeep(state.profileGroups);
      profileGroups[action.profileGroup] = { working: true, failed: undefined };

      return {
        ...state,
        profileGroups
      };
    }

    case Actions.SETTINGS_FETCH_START: {
      return {
        ...state,
        fetching: { working: true, failed: undefined }
      };
    }

    case Actions.SETTINGS_FETCH_SUCCESS: {
      const data = _cloneDeep(action.data);

      return {
        ...state,
        data,
        fetching: { working: false, failed: undefined }
      };
    }

    case Actions.SETTINGS_NOT_EXISTS: {
      return {
        ...state,
        fetching: { working: false, failed: undefined }
      };
    }

    case Actions.SETTINGS_SAVE_SUCCESS: {
      const profileGroups = _cloneDeep(state.profileGroups);
      profileGroups[action.profileGroup] = { working: false, failed: undefined };

      return {
        ...state,
        profileGroups
      };
    }

    case Actions.SETTINGS_SAVE_FAILURE: {
      const profileGroups = _cloneDeep(state.profileGroups);
      const _action = action;
      profileGroups[_action.profileGroup] = { working: false, failed: { ..._action.error } };

      return {
        ...state,
        profileGroups
      };
    }

    case Actions.SETTINGS_FETCH_FAILURE: {
      return {
        ...state,
        fetching: {
          working: false,
          failed: { ...action.error }
        }
      };
    }

    default:
      return state;
  }
};

export const hikeProgramSettingsReducer: ActionReducer<HikeProgramSettingsState> = (
  state = initialHikeProgramSettingsState,
  action: Actions.AllActions
) => {
  switch (action.type) {
    case Actions.SETTINGS_CHANGE_HIKE_PROGRAM_DATE:
      return {
        ...state,
        hikeDate: action.startDate
      };

    case Actions.SETTINGS_CHANGE_HIKE_PROGRAM_SPEED:
      return {
        ...state,
        speed: action.speed
      };

    default:
      return state;
  }
};

const reducerMap: ActionReducerMap<SettingsState> = {
  privateProfile: privateSettingsReducer,
  publicProfiles: publicProfileReducer,
  hikeProgramSettings: hikeProgramSettingsReducer
};

export const reducer = combineReducers(reducerMap);
