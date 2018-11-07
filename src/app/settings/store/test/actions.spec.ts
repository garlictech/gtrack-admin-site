import * as actions from '../actions';

describe('Settings actions', () => {
  describe('ChangeHikeProgramStartDate', () => {
    it('should create an action', () => {
      const date = new Date();
      const action = new actions.ChangeHikeProgramStartDate(date);

      expect({...action}).toEqual({
        type: actions.SETTINGS_CHANGE_HIKE_PROGRAM_DATE,
        startDate: date
      });
    });
  });
});
