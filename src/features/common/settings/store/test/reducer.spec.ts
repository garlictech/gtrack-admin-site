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
      it('should change the hikeDate', () => {
        const date = new Date();
        const action = new actions.ChangeHikeProgramStartDate(date);
        const state = hikeProgramSettingsReducer(initialHikeProgramSettingsState, action);

        expect(state.hikeDate.getTime()).toEqual(date.getTime());
      });
    });

    describe('SETTINGS_CHANGE_HIKE_PROGRAM_SPEED action', () => {
      it('should change the speed', () => {
        const speed = 9;
        const action = new actions.ChangeHikeProgramSpeed(speed);
        const state = hikeProgramSettingsReducer(initialHikeProgramSettingsState, action);

        expect(state.speed).toEqual(speed);
      });
    });
  });
});
