import { IEditedGTrackPoiState } from '../../state';
import { initialEditedGTrackPoiState, editedGTrackPoiReducer } from '../edited-gtrack-poi';
import { editedGTrackPoiActions } from '../../actions';
import { IExternalPoi } from '../../../shared/interfaces';
import {
  IBackgroundImageData,
  IPoiStored,
  EObjectState,
  ETextualDescriptionType
} from '../../../../subrepos/provider-client';

import * as _ from 'lodash';

import { pois as poiFixtures, pois as poiStoredFixtures, bgImages as bgImageFixtures } from './fixtures';

describe('Edited GTrackPoi reducers', () => {
  let initialState: IEditedGTrackPoiState;
  let pois: IExternalPoi[];
  let images: IBackgroundImageData[];

  beforeEach(() => {
    initialState = _.cloneDeep(initialEditedGTrackPoiState);
    pois = _.cloneDeep(poiFixtures);
    images = _.cloneDeep(bgImageFixtures);
  });

  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = {} as any;
      const state = editedGTrackPoiReducer(undefined, action);

      expect(state).toEqual(initialState);
    });
  });

  describe('AddNewTranslatedPoiDescription action', () => {
    it('should add new translated poi description', () => {
      const action = new editedGTrackPoiActions.AddNewTranslatedPoiDescription('hu_HU', {
        title: 'fakeTitle'
      });
      const state = editedGTrackPoiReducer(initialState, action);

      expect(state.data.description).toEqual({
        en_US: {
          title: 'A new poi',
          type: ETextualDescriptionType.markdown
        },
        hu_HU: {
          title: 'fakeTitle'
        }
      });
      expect(state.dirty).toBeTruthy();
    });
  });

  describe('DeleteTranslatedPoiDescription action', () => {
    it('should delete translated poi description', () => {
      const action = new editedGTrackPoiActions.DeleteTranslatedPoiDescription('en_US');
      const state = editedGTrackPoiReducer(
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

    it('should not delete non-existing translated poi description', () => {
      const action = new editedGTrackPoiActions.DeleteTranslatedPoiDescription('de_DE');
      const state = editedGTrackPoiReducer(
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
          title: 'A new poi',
          type: ETextualDescriptionType.markdown
        },
        hu_HU: {
          title: 'fakeTitle'
        }
      });
      expect(state.dirty).toBeTruthy();
    });
  });

  describe('SavePoi action', () => {
    it('should handle poi save', () => {
      const action = new editedGTrackPoiActions.SavePoi();
      const state = editedGTrackPoiReducer(initialState, action);

      expect(state.working).toBe('saving...');
      expect(state.failed).toBeNull();
    });
  });

  describe('PoiSaveSuccess action', () => {
    it('should handle save success', () => {
      const action = new editedGTrackPoiActions.PoiSaveSuccess('1');
      const state = editedGTrackPoiReducer(initialState, action);

      expect(state.working).toBeNull();
      expect(state.failed).toBeNull();
      expect(state.dirty).toBeFalsy();
    });
  });

  describe('PoiSaveFailed action', () => {
    it('should handle save failure', () => {
      const action = new editedGTrackPoiActions.PoiSaveFailed('Error');
      const state = editedGTrackPoiReducer(initialState, action);

      expect(state.working).toBeNull();
      expect(state.failed).toEqual('Error');
    });
  });

  describe('PoiSaveFailed action', () => {
    it('should handle loading pois', () => {
      const action = new editedGTrackPoiActions.LoadPoi(
        _.merge(pois[0], {
          timestamp: 0,
          state: EObjectState.published
        })
      );
      const state = editedGTrackPoiReducer(initialState, action);

      expect(state.working).toBeNull();
      expect(state.failed).toBeNull();
      expect(state.dirty).toBeFalsy();
      expect(state.data).toEqual(pois[0]);
    });
  });

  describe('AddPoiBackgroundImage action', () => {
    it('should add poi background images', () => {
      const action = new editedGTrackPoiActions.AddPoiBackgroundImage(images[0]);
      const state = editedGTrackPoiReducer(initialState, action);

      expect(state.dirty).toBeTruthy();
      expect(state.data.backgroundImages).toEqual([images[0]]);
    });

    it('should add poi background image when data.backgroundImages still does not exists', () => {
      const action = new editedGTrackPoiActions.AddPoiBackgroundImage(images[0]);
      const state = editedGTrackPoiReducer(
        _.merge({}, initialState, {
          data: {
            backgroundImages: null
          }
        }),
        action
      );

      expect(state.dirty).toBeTruthy();
      expect(state.data.backgroundImages).toEqual([images[0]]);
    });
  });

  describe('RemovePoiBackgroundImage action', () => {
    it('should remove poi background images', () => {
      const action = new editedGTrackPoiActions.RemovePoiBackgroundImage('fakeOriginalUrl');
      const state = editedGTrackPoiReducer(
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

    it('should not remove non-existing poi background images', () => {
      const action = new editedGTrackPoiActions.RemovePoiBackgroundImage('nonExistingOriginalUrl');
      const state = editedGTrackPoiReducer(
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

    it('should remove poi background images when data.backgroundImages still does not exists', () => {
      const action = new editedGTrackPoiActions.RemovePoiBackgroundImage('nonExistingOriginalUrl');
      const state = editedGTrackPoiReducer(
        _.merge({}, initialState, {
          data: {
            backgroundImages: null
          }
        }),
        action
      );

      expect(state.dirty).toBeTruthy();
      expect(state.data.backgroundImages).toEqual([]);
    });
  });
});
