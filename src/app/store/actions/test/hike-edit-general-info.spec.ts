import { TestBed } from '@angular/core/testing';
import * as HikeEditGeneralInfoActions from '../hike-edit-general-info';

describe('HikeEditMap actions', () => {
  it('should have action names defined', () => {
    expect(HikeEditGeneralInfoActions.RESET_GENERAL_INFO_STATE).toEqual('[HikeEditGeneralInfo] Reset');
    expect(HikeEditGeneralInfoActions.SET_HIKE_ID).toEqual('[HikeEditGeneralInfo] Set hike id');
    expect(HikeEditGeneralInfoActions.SET_ROUTE_ID).toEqual('[HikeEditGeneralInfo] Set route id');
    expect(HikeEditGeneralInfoActions.SET_GENERAL_INFO).toEqual('[HikeEditGeneralInfo] Set general info');
    expect(HikeEditGeneralInfoActions.SET_POIS).toEqual('[HikeEditGeneralInfo] Set pois');
    expect(HikeEditGeneralInfoActions.SET_DESCRIPTIONS).toEqual('[HikeEditGeneralInfo] Set descriptions');
  });

  it('should create Reset action', () => {
    const action = new HikeEditGeneralInfoActions.ResetGeneralInfoState();

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditGeneralInfoActions.RESET_GENERAL_INFO_STATE
    });
  });

  it('should create SetHikeId action', () => {
    const payload = { hikeId: 'fakeHikeId' };
    const action = new HikeEditGeneralInfoActions.SetHikeId(payload);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditGeneralInfoActions.SET_HIKE_ID,
      payload,
    });
  });

  it('should create SetRouteId action', () => {
    const payload = { routeId: 'fakeRouteId' };
    const action = new HikeEditGeneralInfoActions.SetRouteId(payload);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditGeneralInfoActions.SET_ROUTE_ID,
      payload,
    });
  });

  it('should create SetGeneralInfo action', () => {
    const payload = {
      isRoundTrip: true,
      difficulty: 1
    };
    const action = new HikeEditGeneralInfoActions.SetGeneralInfo(payload);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditGeneralInfoActions.SET_GENERAL_INFO,
      payload,
    });
  });

  it('should create SetPois action', () => {
    const payload = { pois: ['id1', 'id2'] };
    const action = new HikeEditGeneralInfoActions.SetPois(payload);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditGeneralInfoActions.SET_POIS,
      payload,
    });
  });

  it('should create GetGooglePois action', () => {
    const payload = {
      descriptions: [{
        id: 'en_US',
        title: 'Fake title',
        summary: 'Fake summary',
        fullDescription: 'Fake description'
      }]
    };
    const action = new HikeEditGeneralInfoActions.SetDescriptions(payload);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditGeneralInfoActions.SET_DESCRIPTIONS,
      payload,
    });
  });
});
