import * as HikeListActions from '../hike-list';

describe('HikeList actions', () => {
  it('should have action names defined', () => {
    expect(HikeListActions.DELETE_HIKE).toEqual('[HikeList] Delete hike');
  });

  it('should create DeleteHike action', () => {
    const payload = { hikeId: 'fakeHikeId' };
    const action = new HikeListActions.DeleteHike(payload);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeListActions.DELETE_HIKE,
      payload
    });
  });
});
