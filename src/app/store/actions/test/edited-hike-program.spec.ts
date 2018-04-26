import { TestBed } from '@angular/core/testing';
import * as EditedHikeProgramActions from '../edited-hike-program';

describe('EditedHikeProgram actions', () => {
  it('should have action names defined', () => {
    expect(EditedHikeProgramActions.ADD_NEW_TRANSLATED_HIKE_DESCRIPTION).toEqual('[HikeProgram] Add new translated hike description');
    expect(EditedHikeProgramActions.DELETE_TRANSLATED_HIKE_DESCRIPTION).toEqual('[HikeProgram] Delete translated hike description');
    expect(EditedHikeProgramActions.ADD_HIKE_PROGRAM_DETAILS).toEqual('[HikeProgram] Add some details');
    expect(EditedHikeProgramActions.ADD_STOP).toEqual('[HikeProgram] Add stop');
    expect(EditedHikeProgramActions.REMOVE_STOP_BY_POI_ID).toEqual('[HikeProgram] Remove stop by poi id');
    expect(EditedHikeProgramActions.SAVE_HIKE_PROGRAM).toEqual('[HikeProgram] Save hike program');
    expect(EditedHikeProgramActions.HIKE_PROGRAM_SAVE_SUCCESS).toEqual('[HikeProgram] Hike program saved successfully');
    expect(EditedHikeProgramActions.HIKE_PROGRAM_SAVE_FAILED).toEqual('[HikeProgram] Hike program save failure');
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
    const action = new EditedHikeProgramActions.AddHikeProgramDetails({ distance: 10 });

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: EditedHikeProgramActions.ADD_HIKE_PROGRAM_DETAILS,
      details: { distance: 10 }
    });
  });

  it('should create AddStop action', () => {
    const stopData = { poiId: 'fakePoiId' };
    const action = new EditedHikeProgramActions.AddStop(stopData);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: EditedHikeProgramActions.ADD_STOP,
      stop: stopData
    });
  });

  it('should create RemoveStopByPoiId action', () => {
    const stopData = { poiId: 'fakePoiId' };
    const action = new EditedHikeProgramActions.RemoveStopByPoiId('fakePoiId');

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: EditedHikeProgramActions.REMOVE_STOP_BY_POI_ID,
      poiId: 'fakePoiId'
    });
  });

  it('should create SaveHikeProgram action', () => {
    const stopData = { poiId: 'fakePoiId' };
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
});
