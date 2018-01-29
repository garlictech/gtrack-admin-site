import { Action } from '@ngrx/store';
import * as AdminMapActions from '../../actions/admin-map';
import { hikeEditMapMapReducer } from '../hike-edit-map';

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
      hikeEditMapMapReducer({mapId: ''}, new AdminMapActions.RegisterMap({
        mapId: 'fakeId'
      }))
    )
    .toEqual({mapId: 'fakeId'});
  });
});
