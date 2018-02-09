import { TestBed } from '@angular/core/testing';
import * as HikeEditActions from '../hike-edit';

describe('HikeList actions', () => {
  it('should have action names defined', () => {
    expect(HikeEditActions.COLLECT_HIKE_DATA).toEqual('[HikeEdit] Collect hike data');
  });

  it('should create DeleteHike action', () => {
    let expectedClass = new HikeEditActions.CollectHikeData({
      hikeId: 'fakeId'
    });
    expect(expectedClass).toBeDefined();
    expect(expectedClass.type).toEqual(HikeEditActions.COLLECT_HIKE_DATA);
  });
});
