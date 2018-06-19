import { TestBed } from '@angular/core/testing';
import { IBackgroundImageData, EPoiImageTypes } from 'subrepos/provider-client';
import * as EditedGTrackPoiActions from '../edited-gtrack-poi';

import {
  poisStored as poiFixtures
} from '../../../../subrepos/gtrack-common-ngx/app/hike/store/poi/test/fixtures';

describe('EditedGTrackPoi actions', () => {
  it('should have action names defined', () => {
    expect(EditedGTrackPoiActions.ADD_NEW_TRANSLATED_POI_DESCRIPTION).toEqual('[Gtrack Poi Edit] Add new translated poi description');
    expect(EditedGTrackPoiActions.DELETE_TRANSLATED_POI_DESCRIPTION).toEqual('[Gtrack Poi Edit] Delete translated poi description');
    expect(EditedGTrackPoiActions.LOAD_POI).toEqual('[Gtrack Poi Edit] Load poi to the editor space');
    expect(EditedGTrackPoiActions.SAVE_POI).toEqual('[Gtrack Poi Edit] Save poi');
    expect(EditedGTrackPoiActions.POI_SAVE_SUCCESS).toEqual('[Gtrack Poi Edit] Poi saved successfully');
    expect(EditedGTrackPoiActions.POI_SAVE_FAILED).toEqual('[Gtrack Poi Edit] Poi save failure');
    expect(EditedGTrackPoiActions.ADD_POI_BACKGROUND_IMAGE).toEqual('[Gtrack Poi Edit] Add background image');
    expect(EditedGTrackPoiActions.REMOVE_POI_BACKGROUND_IMAGE).toEqual('[Gtrack Poi Edit] Remove background image');
  });

  it('should create AddNewTranslatedPoiDescription action', () => {
    const desc = {
      title: 'Test hike',
      fullDescription: 'desc',
      summary: 'summary'
    };
    const action = new EditedGTrackPoiActions.AddNewTranslatedPoiDescription('en_US', desc);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: EditedGTrackPoiActions.ADD_NEW_TRANSLATED_POI_DESCRIPTION,
      languageKey: 'en_US',
      content: desc
    });
  });

  it('should create DeleteTranslatedPoiDescription action', () => {
    const desc = {
      title: 'Test hike',
      fullDescription: 'desc',
      summary: 'summary'
    };
    const action = new EditedGTrackPoiActions.DeleteTranslatedPoiDescription('en_US');

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: EditedGTrackPoiActions.DELETE_TRANSLATED_POI_DESCRIPTION,
      languageKey: 'en_US'
    });
  });

  it('should create LoadPoi action', () => {
    const action = new EditedGTrackPoiActions.LoadPoi(poiFixtures[0]);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: EditedGTrackPoiActions.LOAD_POI,
      data: poiFixtures[0]
    });
  });

  it('should create SavePoi action', () => {
    const action = new EditedGTrackPoiActions.SavePoi();

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: EditedGTrackPoiActions.SAVE_POI
    });
  });

  it('should create SavePoi action', () => {
    const action = new EditedGTrackPoiActions.PoiSaveSuccess('fakeId');

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: EditedGTrackPoiActions.POI_SAVE_SUCCESS,
      poiId: 'fakeId'
    });
  });

  it('should create PoiSaveFailed action', () => {
    const action = new EditedGTrackPoiActions.PoiSaveFailed('fakeError');

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: EditedGTrackPoiActions.POI_SAVE_FAILED,
      error: 'fakeError'
    });
  });

  it('should create AddBackgroundImage action', () => {
    const imageData: IBackgroundImageData = {
      title: 'title',
      original: {
        url: '...',
        width: 100,
        height: 100
      },
      card: {
        url: '...',
        width: 100,
        height: 100
      },
      thumbnail: {
        url: '...',
        width: 100,
        height: 100
      },
      source: {
        type: EPoiImageTypes.google,
        poiObjectId: 'id'
      }
    };
    const action = new EditedGTrackPoiActions.AddPoiBackgroundImage(imageData);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: EditedGTrackPoiActions.ADD_POI_BACKGROUND_IMAGE,
      imageData: imageData
    });
  });

  it('should create RemoveBackgroundImage action', () => {
    const action = new EditedGTrackPoiActions.RemovePoiBackgroundImage('fakeUrl');

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: EditedGTrackPoiActions.REMOVE_POI_BACKGROUND_IMAGE,
      origUrl: 'fakeUrl'
    });
  });
});
