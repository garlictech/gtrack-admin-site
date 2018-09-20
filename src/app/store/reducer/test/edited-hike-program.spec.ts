import { IEditedHikeProgramState } from '../../state';
import { initialEditedHikeProgramState, editedHikeProgramReducer } from '../edited-hike-program';
import { IBackgroundImageData } from '../../../../subrepos/provider-client';
import { editedHikeProgramActions } from '../../actions';

import * as _ from 'lodash';

import {
  bgImages as bgImageFixtures
} from './fixtures';

describe('Edited HikeProgram reducers', () => {
  let initialState: IEditedHikeProgramState;
  let images: IBackgroundImageData[];

  beforeEach(() => {
    initialState = _.cloneDeep(initialEditedHikeProgramState);
    images = _.cloneDeep(bgImageFixtures);
  });

  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = {} as any;
      const state = editedHikeProgramReducer(undefined, action);

      expect(state).toEqual(initialState);
    });
  });

  describe('ResetHikeProgram action', () => {
    it('should reset state', () => {
      const action = new editedHikeProgramActions.ResetHikeProgram();
      const state = editedHikeProgramReducer(initialState, action);

      expect(state).toEqual(initialState);
    });
  });

  describe('AddNewTranslatedHikeProgramDescription action', () => {
    it('should add new translated hikeProgram description', () => {
      const action = new editedHikeProgramActions.AddNewTranslatedHikeProgramDescription('hu_HU', { title: 'fakeTitle' });
      const state = editedHikeProgramReducer(initialState, action);

      expect(state.data.description).toEqual({
        en_US: {
          title: 'A new hike',
          fullDescription: '',
          summary: ''
        },
        hu_HU: {
          title: 'fakeTitle'
        }
      });
      expect(state.dirty).toBeTruthy();
    });
  });

  describe('DeleteTranslatedHikeProgramDescription action', () => {
    it('should delete translated hikeProgram description', () => {
      const action = new editedHikeProgramActions.DeleteTranslatedHikeProgramDescription('en_US');
      const state = editedHikeProgramReducer(_.merge({}, initialState, {
        data: {
          description: {
            hu_HU: {
              title: 'fakeTitle'
            }
          }
        }
      }), action);

      expect(state.data.description).toEqual({
        hu_HU: {
          title: 'fakeTitle'
        }
      });
      expect(state.dirty).toBeTruthy();
    });

    it('should not delete non-existing translated hike description', () => {
      const action = new editedHikeProgramActions.DeleteTranslatedHikeProgramDescription('de_DE');
      const state = editedHikeProgramReducer(_.merge({}, initialState, {
        data: {
          description: {
            hu_HU: {
              title: 'fakeTitle'
            }
          }
        }
      }), action);

      expect(state.data.description).toEqual({
        en_US: {
          title: 'A new hike',
          fullDescription: '',
          summary: ''
        },
        hu_HU: {
          title: 'fakeTitle'
        }
      });
      expect(state.dirty).toBeTruthy();
    });
  });

  describe('SaveHikeProgram action', () => {
    it('should handle hikeProgram save', () => {
      const action = new editedHikeProgramActions.SaveHikeProgram();
      const state = editedHikeProgramReducer(initialState, action);

      expect(state.working).toBe('saving...');
      expect(state.failed).toBeNull();
    });
  });

  describe('HikeProgramSaveSuccess action', () => {
    it('should handle save success', () => {
      const action = new editedHikeProgramActions.HikeProgramSaveSuccess();
      const state = editedHikeProgramReducer(initialState, action);

      expect(state.working).toBeNull();
      expect(state.failed).toBeNull();
      expect(state.dirty).toBeFalsy();
    });
  });

  describe('HikeProgramSaveFailed action', () => {
    it('should handle save failure', () => {
      const action = new editedHikeProgramActions.HikeProgramSaveFailed('Error');
      const state = editedHikeProgramReducer(initialState, action);

      expect(state.working).toBeNull();
      expect(state.failed).toEqual('Error');
    });
  });

  describe('AddHikeProgramDetails action', () => {
    it('should add hikeProgram details and set to dirty', () => {
      const details = {
        distance: 100,
        time: 20,
      };
      const action = new editedHikeProgramActions.AddHikeProgramDetails(details, true);
      const state = editedHikeProgramReducer(initialState, action);

      expect(state.data.distance).toEqual(100);
      expect(state.data.time).toEqual(20);
      expect(state.dirty).toBeTruthy();
    });

    it('should add hikeProgram details and set to not dirty', () => {
      const details = {
        uphill: 100,
        downhill: 20,
      };
      const action = new editedHikeProgramActions.AddHikeProgramDetails(details, false);
      const state = editedHikeProgramReducer(initialState, action);

      expect(state.data.uphill).toEqual(100);
      expect(state.data.downhill).toEqual(20);
      expect(state.dirty).toBeFalsy();
    });
  });

  describe('AddStop action', () => {
    it('should add stop to hikeProgram', () => {
      const stopData = {
        poiId: 'fakeStopId'
      };
      const action = new editedHikeProgramActions.AddStop(stopData);
      const state = editedHikeProgramReducer(initialState, action);

      expect(state.dirty).toBeTruthy();
      expect(state.data.stops).toEqual([stopData]);
    });
  });

  describe('SetStops action', () => {
    it('should set stops to hikeProgram', () => {
      const stopsData = [{
        poiId: 'fakeStopId1'
      }, {
        poiId: 'fakeStopId2'
      }];
      const action = new editedHikeProgramActions.SetStops(stopsData);
      const state = editedHikeProgramReducer(initialState, action);

      expect(state.data.stops).toEqual(stopsData);
    });
  });

  describe('RemoveStopByPoiId action', () => {
    it('should remove stops from hikeProgram by poi ID', () => {
      const action = new editedHikeProgramActions.RemoveStopByPoiId(['fakeStopId1', 'fakeStopId2']);
      const state = editedHikeProgramReducer(_.merge({}, initialState, {
        data: {
          stops: [{
            poiId: 'fakeStopId1'
          }, {
            poiId: 'fakeStopId2'
          }, {
            poiId: 'fakeStopId3'
          }]
        }
      }), action);

      expect(state.data.stops).toEqual([{
        poiId: 'fakeStopId3'
      }]);
    });
  });

  describe('SetCheckpoints action', () => {
    it('should set checkpoints to hikeProgram', () => {
      const checkPointsData = [{
        poiId: 'fakeCheckpointId1'
      }, {
        poiId: 'fakeCheckpointId2'
      }];
      const action = new editedHikeProgramActions.SetCheckpoints(checkPointsData);
      const state = editedHikeProgramReducer(initialState, action);

      expect(state.data.checkpoints).toEqual(checkPointsData);
    });
  });

  describe('AddHikeProgramBackgroundImage action', () => {
    it('should add hikeProgram background images', () => {
      const action = new editedHikeProgramActions.AddHikeProgramBackgroundImage(images[0]);
      const state = editedHikeProgramReducer(initialState, action);

      expect(state.dirty).toBeTruthy();
      expect(state.data.backgroundImages).toEqual([images[0]]);
    });
  });

  describe('RemoveHikeProgramBackgroundImage action', () => {
    it('should remove hikeProgram background images', () => {
      const action = new editedHikeProgramActions.RemoveHikeProgramBackgroundImage('fakeOriginalUrl');
      const state = editedHikeProgramReducer(_.merge({}, initialState, {
        data: {
          backgroundImages: [images[0]]
        }
      }), action);

      expect(state.dirty).toBeTruthy();
      expect(state.data.backgroundImages).toEqual([]);
    });

    it('should not remove non-existing hikeProgram background images', () => {
      const action = new editedHikeProgramActions.RemoveHikeProgramBackgroundImage('nonExistingOriginalUrl');
      const state = editedHikeProgramReducer(_.merge({}, initialState, {
        data: {
          backgroundImages: [images[0]]
        }
      }), action);

      expect(state.dirty).toBeTruthy();
      expect(state.data.backgroundImages).toEqual([images[0]]);
    });
  });
});
