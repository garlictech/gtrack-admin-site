import * as actions from '../actions';

describe('Settings actions', () => {
  describe('ChangeHikeProgramStartDate', () => {
    it('should create an action', () => {
      const date = new Date();
      const action = new actions.ChangeHikeProgramStartDate(date);

      expect({ ...action }).toEqual({
        type: actions.SETTINGS_CHANGE_HIKE_PROGRAM_DATE,
        startDate: date
      });
    });
  });

  describe('ChangeHikeProgramSpeed', () => {
    it('should create an action', () => {
      const speed = 9;
      const action = new actions.ChangeHikeProgramSpeed(speed);

      expect({ ...action }).toEqual({
        type: actions.SETTINGS_CHANGE_HIKE_PROGRAM_SPEED,
        speed: speed
      });
    });
  });
});
