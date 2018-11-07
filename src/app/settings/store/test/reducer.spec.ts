import { hikeProgramSettingsReducer } from '../reducer';
import { initialHikeProgramSettingsState } from '../state';
import * as actions from '../actions';

describe('Settings reducer', () => {

  describe('HikeProgramSettingsReducer', () => {

    describe('undefined action', () => {
      it('should return the default state', () => {
        const action = {} as any;
        const state = hikeProgramSettingsReducer(undefined, action);

        expect(state).toEqual(initialHikeProgramSettingsState);
      });
    });

    describe('SETTINGS_CHANGE_HIKE_PROGRAM_DATE action', () => {
      it('should set loading to true', () => {
        const date = new Date();
        const action = new actions.ChangeHikeProgramStartDate(date);
        const state = hikeProgramSettingsReducer(initialHikeProgramSettingsState, action);

        expect(state.hikeDate.getTime()).toEqual(date.getTime());
      });
    });
  });

});
