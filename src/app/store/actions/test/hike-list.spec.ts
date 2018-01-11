import { TestBed } from '@angular/core/testing';
import * as HikeListActions from '../hike-list';

describe('HikeList actions', () => {
  it('should have action names defined', () => {
    expect(HikeListActions.DELETE_HIKE).toEqual('[HikeList] Delete hike');
  });

  it('should create DeleteHike action', () => {
    let expectedClass = new HikeListActions.DeleteHike({
      hikeId: 'fakeId'
    });
    expect(expectedClass).toBeDefined();
    expect(expectedClass.type).toEqual(HikeListActions.DELETE_HIKE);
  });
});
