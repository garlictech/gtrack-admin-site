import { TestBed } from '@angular/core/testing';
import * as HikeEditGeneralInfoActions from '../hike-edit-general-info';

describe('HikeEditMap actions', () => {
  it('should have action names defined', () => {
    expect(HikeEditGeneralInfoActions.SET_DESCRIPTIONS).toEqual('[HikeEditGeneralInfo] Set descriptions');
 });

  it('should create GetGooglePois action', () => {
    let expectedClass = new HikeEditGeneralInfoActions.SetDescriptions({
      descriptions: []
    });
    expect(expectedClass).toBeDefined();
    expect(expectedClass.type).toEqual(HikeEditGeneralInfoActions.SET_DESCRIPTIONS);
  });
});
