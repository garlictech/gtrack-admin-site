import { Action } from '@ngrx/store';
import * as AdminMapActions from '../../actions/admin-map';
import { hikeEditMapReducer } from '../hike-edit-map';

describe('HikeEditMap reducers', () => {
  /*
  it('should handle initial state', () => {
    expect(
      hikeEditMapReducer(undefined, undefined)
    )
    .toEqual({mapId: ''});
  });
  */

  it('should handle set mapId', () => {
    expect(
      hikeEditMapReducer({mapId: ''}, new AdminMapActions.RegisterMap({
        mapId: 'fakeId'
      }))
    )
    .toEqual({mapId: 'fakeId'});
  });
});
