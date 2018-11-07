import { ActionReducer, ActionReducerMap, combineReducers } from '@ngrx/store';
import _cloneDeep from 'lodash-es/cloneDeep';

import {
  initialPrivateProfileState,
  IPrivateProfileState,
  IHikeProgramSettingsState,
  ISettingsState,
  IPublicProfileCollectionState,
  publicProfileStateAdapter,
  initialHikeProgramSettingsState
} from './state';
import * as Actions from './actions';

const publicProfileReducer: ActionReducer<IPublicProfileCollectionState> = (
  state: IPublicProfileCollectionState = publicProfileStateAdapter.getInitialState(),
  action: Actions.AllActions
): IPublicProfileCollectionState => {
  switch (action.type) {
    case Actions.PUBLIC_PROFILE_FETCH_START:
      return publicProfileStateAdapter.addOne({ working: true, failed: null, id: action.id }, state);

    case Actions.PUBLIC_PROFILE_FETCHED:
      return publicProfileStateAdapter.updateOne(
        { id: action.id, changes: { ...action.settings, working: false, failed: null } },
        state
      );

    default:
      return state;
  }
};

const privateSettingsReducer: ActionReducer<IPrivateProfileState> = (
  state = initialPrivateProfileState,
  action: Actions.AllActions
) => {
  const result: IPrivateProfileState = _cloneDeep(state);

  switch (action.type) {
    case Actions.SETTINGS_SAVE_START: {
      result.profileGroups[(<Actions.SettingsSaveStart>action).profileGroup] = { working: true, failed: null };
      return result;
    }

    case Actions.SETTINGS_FETCH_START: {
      result.fetching = { working: true, failed: null };
      return result;
    }

    case Actions.SETTINGS_FETCH_SUCCESS: {
      result.data = _cloneDeep((<Actions.SettingsFetchSuccess>action).data);
      result.fetching = { working: false, failed: null };
      return result;
    }

    case Actions.SETTINGS_NOT_EXISTS: {
      result.fetching = { working: false, failed: null };
      return result;
    }

    case Actions.SETTINGS_SAVE_SUCCESS: {
      result.profileGroups[(<Actions.SettingsSaveSuccess>action).profileGroup] = { working: false, failed: null };
      return result;
    }

    case Actions.SETTINGS_SAVE_FAILURE: {
      const _action = <Actions.SettingsSaveFailure>action;
      result.profileGroups[_action.profileGroup] = { working: false, failed: { ..._action.error } };
      return result;
    }

    case Actions.SETTINGS_FETCH_FAILURE: {
      result.fetching = { working: false, failed: { ...(<Actions.SettingsFetchFailure>action).error } };
      return result;
    }

    default:
      return state;
  }
};

export const hikeProgramSettingsReducer: ActionReducer<IHikeProgramSettingsState> = (
  state = initialHikeProgramSettingsState,
  action: Actions.AllActions
) => {
  switch (action.type) {
    case Actions.SETTINGS_CHANGE_HIKE_PROGRAM_DATE:
      return {
        ...state,
        hikeDate: action.startDate
      };

    default:
      return state;
  }
};

const reducerMap: ActionReducerMap<ISettingsState> = {
  privateProfile: privateSettingsReducer,
  publicProfiles: publicProfileReducer,
  hikeProgramSettings: hikeProgramSettingsReducer
};

export const reducer = combineReducers(reducerMap);
