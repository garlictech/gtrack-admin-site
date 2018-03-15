import * as actions from '../actions';

describe('UserStatus actions', () => {
  describe('RequestLocation', () => {
    it('should be created', () => {
      const action = new actions.RequestLocation();
      expect(action.type).toEqual(actions.UserStatusActionTypes.REQUEST_LOCATION);
    });
  });

  describe('LocationRequested', () => {
    it('should be created', () => {
      const action = new actions.LocationRequested([0, 0]);
      expect(action.type).toEqual(actions.UserStatusActionTypes.LOCATION_REQUESTED);
      expect(action.location).toEqual([0, 0]);
    });
  });

  describe('RequestLocationFailed', () => {
    it('should be created', () => {
      const action = new actions.RequestLocationFailed(new Error('Permission denied'));
      expect(action.type).toEqual(actions.UserStatusActionTypes.REQUEST_LOCATION_FAILED);
      expect(action.error.message).toEqual('Permission denied');
    });
  });
});
