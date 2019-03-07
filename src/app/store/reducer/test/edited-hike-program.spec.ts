// tslint:disable:no-big-function
import * as _ from 'lodash';
import { CheckpointSequence } from 'subrepos/gtrack-common-ngx';

import {
  BackgroundImageData,
  ETextualDescriptionType,
  HikeProgramStop
} from '@bit/garlictech.angular-features.common.gtrack-interfaces';

import { editedHikeProgramActions } from '../../actions';
import { EditedHikeProgramState } from '../../state';
import { editedHikeProgramReducer, initialEditedHikeProgramState } from '../edited-hike-program';
import { bgImages as bgImageFixtures, stops as stopsFixtures } from './fixtures';

describe('Edited HikeProgram reducers', () => {
  let initialState: EditedHikeProgramState;
  let images: Array<BackgroundImageData>;
  let stops: Array<HikeProgramStop>;

  beforeEach(() => {
    initialState = _.cloneDeep(initialEditedHikeProgramState);
    images = _.cloneDeep(bgImageFixtures);
    stops = _.cloneDeep(stopsFixtures);
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
      const action = new editedHikeProgramActions.AddNewTranslatedHikeProgramDescription('hu_HU', {
        title: 'fakeTitle'
      });
      const state = editedHikeProgramReducer(initialState, action);

      expect(state.data.description).toEqual({
        en_US: {
          title: 'A new hike',
          fullDescription: '',
          summary: '',
          type: ETextualDescriptionType.markdown
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
      const state = editedHikeProgramReducer(
        _.merge({}, initialState, {
          data: {
            description: {
              hu_HU: {
                title: 'fakeTitle'
              }
            }
          }
        }),
        action
      );

      expect(state.data.description).toEqual({
        hu_HU: {
          title: 'fakeTitle'
        }
      });
      expect(state.dirty).toBeTruthy();
    });

    it('should not delete non-existing translated hike description', () => {
      const action = new editedHikeProgramActions.DeleteTranslatedHikeProgramDescription('de_DE');
      const state = editedHikeProgramReducer(
        _.merge({}, initialState, {
          data: {
            description: {
              hu_HU: {
                title: 'fakeTitle'
              }
            }
          }
        }),
        action
      );

      expect(state.data.description).toEqual({
        en_US: {
          title: 'A new hike',
          fullDescription: '',
          summary: '',
          type: ETextualDescriptionType.markdown
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
        time: 20
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
        downhill: 20
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
      const stopData = stops[0];
      const action = new editedHikeProgramActions.AddStop(stopData);
      const state = editedHikeProgramReducer(initialState, action);

      expect(state.dirty).toBeTruthy();
      expect(state.data.stops).toEqual([stopData]);
    });
  });

  describe('SetStops action', () => {
    it('should set stops to hikeProgram', () => {
      const stopsData = stops;
      const action = new editedHikeProgramActions.SetStops(stopsData);
      const state = editedHikeProgramReducer(initialState, action);

      expect(state.data.stops).toEqual(stopsData);
    });
  });

  describe('SetReverseStops action', () => {
    it('should set reverse stops to hikeProgram', () => {
      const stopsData = stops;
      const action = new editedHikeProgramActions.SetReverseStops(stopsData);
      const state = editedHikeProgramReducer(initialState, action);

      expect(state.data.reverseStops).toEqual(stopsData);
    });
  });

  describe('RemoveStopByPoiId action', () => {
    it('should remove stops from hikeProgram by poi ID', () => {
      const action = new editedHikeProgramActions.RemoveStopByPoiId(['1']);
      const state = editedHikeProgramReducer(
        _.merge({}, initialState, {
          data: {
            stops
          }
        }),
        action
      );

      expect(state.data.stops).toEqual([stops[1]]);
    });
  });

  describe('SetCheckpoints action', () => {
    it('should set checkpoints to hikeProgram', () => {
      const checkpointSequence = new CheckpointSequence([]);
      const action = new editedHikeProgramActions.SetCheckpoints(checkpointSequence);
      const state = editedHikeProgramReducer(initialState, action);

      expect(state.data.checkpoints).toEqual(checkpointSequence);
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
      const state = editedHikeProgramReducer(
        _.merge({}, initialState, {
          data: {
            backgroundImages: [images[0]]
          }
        }),
        action
      );

      expect(state.dirty).toBeTruthy();
      expect(state.data.backgroundImages).toEqual([]);
    });

    it('should not remove non-existing hikeProgram background images', () => {
      const action = new editedHikeProgramActions.RemoveHikeProgramBackgroundImage('nonExistingOriginalUrl');
      const state = editedHikeProgramReducer(
        _.merge({}, initialState, {
          data: {
            backgroundImages: [images[0]]
          }
        }),
        action
      );

      expect(state.dirty).toBeTruthy();
      expect(state.data.backgroundImages).toEqual([images[0]]);
    });
  });
});
