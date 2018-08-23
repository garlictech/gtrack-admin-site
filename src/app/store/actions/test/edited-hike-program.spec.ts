import { TestBed } from '@angular/core/testing';
import * as EditedHikeProgramActions from '../edited-hike-program';
import { IHikeProgramStop, IBackgroundImageData, EPoiImageTypes } from 'subrepos/provider-client';

describe('EditedHikeProgram actions', () => {
  it('should have action names defined', () => {
    expect(EditedHikeProgramActions.RESET_HIKE_PROGRAM).toEqual('[HikeProgram] Reset');
    expect(EditedHikeProgramActions.ADD_NEW_TRANSLATED_HIKE_DESCRIPTION).toEqual('[HikeProgram] Add new translated hike description');
    expect(EditedHikeProgramActions.DELETE_TRANSLATED_HIKE_DESCRIPTION).toEqual('[HikeProgram] Delete translated hike description');
    expect(EditedHikeProgramActions.ADD_HIKE_PROGRAM_DETAILS).toEqual('[HikeProgram] Add some details');
    expect(EditedHikeProgramActions.ADD_STOP).toEqual('[HikeProgram] Add stop');
    expect(EditedHikeProgramActions.SET_STOPS).toEqual('[HikeProgram] Set stops');
    expect(EditedHikeProgramActions.SET_CHECKPOINTS).toEqual('[HikeProgram] Set Checkpoints');
    expect(EditedHikeProgramActions.REMOVE_STOP_BY_POI_ID).toEqual('[HikeProgram] Remove stop by poi id');
    expect(EditedHikeProgramActions.SAVE_HIKE_PROGRAM).toEqual('[HikeProgram] Save hike program');
    expect(EditedHikeProgramActions.HIKE_PROGRAM_SAVE_SUCCESS).toEqual('[HikeProgram] Hike program saved successfully');
    expect(EditedHikeProgramActions.HIKE_PROGRAM_SAVE_FAILED).toEqual('[HikeProgram] Hike program save failure');
    expect(EditedHikeProgramActions.ADD_HIKE_PROGRAM_BACKGROUND_IMAGE).toEqual('[HikeProgram] Add background image');
    expect(EditedHikeProgramActions.REMOVE_HIKE_PROGRAM_BACKGROUND_IMAGE).toEqual('[HikeProgram] Remove background image');
  });

  it('should create ResetHikeProgram action', () => {
    const action = new EditedHikeProgramActions.ResetHikeProgram();

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: EditedHikeProgramActions.RESET_HIKE_PROGRAM
    });
  });

  it('should create AddNewTranslatedHikeProgramDescription action', () => {
    const desc = {
      title: 'Test hike',
      fullDescription: 'desc',
      summary: 'summary'
    };
    const action = new EditedHikeProgramActions.AddNewTranslatedHikeProgramDescription('en_US', desc);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: EditedHikeProgramActions.ADD_NEW_TRANSLATED_HIKE_DESCRIPTION,
      languageKey: 'en_US',
      content: desc
    });
  });

  it('should create DeleteTranslatedHikeProgramDescription action', () => {
    const action = new EditedHikeProgramActions.DeleteTranslatedHikeProgramDescription('en_US');

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: EditedHikeProgramActions.DELETE_TRANSLATED_HIKE_DESCRIPTION,
      languageKey: 'en_US'
    });
  });

  it('should create AddHikeProgramDetails action', () => {
    const action = new EditedHikeProgramActions.AddHikeProgramDetails({ distance: 10 }, true);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: EditedHikeProgramActions.ADD_HIKE_PROGRAM_DETAILS,
      details: { distance: 10 },
      setDirty: true
    });
  });

  it('should create AddStop action', () => {
    const stop: IHikeProgramStop = {
      distanceFromOrigo: 0,
      poiId: 'fakePoiId',
      lat: 0,
      lon: 0,
      segment: {
        uphill: 0,
        downhill: 0,
        distance: 0
      }
    };
    const action = new EditedHikeProgramActions.AddStop(stop);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: EditedHikeProgramActions.ADD_STOP,
      stop: stop
    });
  });

  it('should create SetStops action', () => {
    const stops = [{
      distanceFromOrigo: 0,
      poiId: 'fakePoiId',
      lat: 0,
      lon: 0,
      segment: {
        uphill: 0,
        downhill: 0,
        distance: 0
      }
    }];
    const action = new EditedHikeProgramActions.SetStops(stops);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: EditedHikeProgramActions.SET_STOPS,
      stops: stops
    });
  });

  it('should create SetCheckpoints action', () => {
    const checkpoints = [];
    const action = new EditedHikeProgramActions.SetCheckpoints(checkpoints);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: EditedHikeProgramActions.SET_CHECKPOINTS,
      checkpoints: checkpoints
    });
  });

  it('should create RemoveStopByPoiId action', () => {
    const action = new EditedHikeProgramActions.RemoveStopByPoiId(['fakePoiId']);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: EditedHikeProgramActions.REMOVE_STOP_BY_POI_ID,
      poiIds: ['fakePoiId']
    });
  });

  it('should create SaveHikeProgram action', () => {
    const action = new EditedHikeProgramActions.SaveHikeProgram();

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: EditedHikeProgramActions.SAVE_HIKE_PROGRAM
    });
  });

  it('should create HikeProgramSaveSuccess action', () => {
    const stopData = { poiId: 'fakePoiId' };
    const action = new EditedHikeProgramActions.HikeProgramSaveSuccess();

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: EditedHikeProgramActions.HIKE_PROGRAM_SAVE_SUCCESS
    });
  });

  it('should create HikeProgramSaveFailed action', () => {
    const stopData = { poiId: 'fakePoiId' };
    const action = new EditedHikeProgramActions.HikeProgramSaveFailed('fakeError');

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: EditedHikeProgramActions.HIKE_PROGRAM_SAVE_FAILED,
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
    const action = new EditedHikeProgramActions.AddHikeProgramBackgroundImage(imageData);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: EditedHikeProgramActions.ADD_HIKE_PROGRAM_BACKGROUND_IMAGE,
      imageData: imageData
    });
  });

  it('should create RemoveBackgroundImage action', () => {
    const action = new EditedHikeProgramActions.RemoveHikeProgramBackgroundImage('fakeUrl');

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: EditedHikeProgramActions.REMOVE_HIKE_PROGRAM_BACKGROUND_IMAGE,
      origUrl: 'fakeUrl'
    });
  });
});
