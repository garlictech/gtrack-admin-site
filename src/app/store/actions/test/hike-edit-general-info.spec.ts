import { TestBed } from '@angular/core/testing';
import * as HikeEditGeneralInfoActions from '../hike-edit-general-info';

describe('HikeEditMap actions', () => {
  it('should have action names defined', () => {
    expect(HikeEditGeneralInfoActions.RESET_GENERAL_INFO_STATE).toEqual('[HikeEditGeneralInfo] Reset');
    expect(HikeEditGeneralInfoActions.SET_INITIALIZED).toEqual('[HikeEditGeneralInfo] Set initialized');
    expect(HikeEditGeneralInfoActions.SET_HIKE_ID).toEqual('[HikeEditGeneralInfo] Set hike id');
    expect(HikeEditGeneralInfoActions.SET_ROUTE_ID).toEqual('[HikeEditGeneralInfo] Set route id');
    expect(HikeEditGeneralInfoActions.SET_DIFFICULTY).toEqual('[HikeEditGeneralInfo] Set difficulty');
    expect(HikeEditGeneralInfoActions.SET_IS_ROUND_TRIP).toEqual('[HikeEditGeneralInfo] Set isRoundTrip');
    expect(HikeEditGeneralInfoActions.SET_POIS).toEqual('[HikeEditGeneralInfo] Set pois');
    expect(HikeEditGeneralInfoActions.ADD_POI).toEqual('[HikeEditGeneralInfo] Add poi');
    expect(HikeEditGeneralInfoActions.REMOVE_POI).toEqual('[HikeEditGeneralInfo] Remove poi');
    expect(HikeEditGeneralInfoActions.SET_DESCRIPTIONS).toEqual('[HikeEditGeneralInfo] Set descriptions');
    expect(HikeEditGeneralInfoActions.ADD_DESCRIPTION).toEqual('[HikeEditGeneralInfo] Add description');
  });

  it('should create Reset action', () => {
    const action = new HikeEditGeneralInfoActions.ResetGeneralInfoState();

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditGeneralInfoActions.RESET_GENERAL_INFO_STATE
    });
  });

  it('should create SetInitialized action', () => {
    const action = new HikeEditGeneralInfoActions.SetInitialized();

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditGeneralInfoActions.SET_INITIALIZED
    });
  });

  it('should create SetHikeId action', () => {
    const payload = { hikeId: 'fakeHikeId' };
    const action = new HikeEditGeneralInfoActions.SetHikeId(payload);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditGeneralInfoActions.SET_HIKE_ID,
      payload
    });
  });

  it('should create SetRouteId action', () => {
    const payload = { routeId: 'fakeRouteId' };
    const action = new HikeEditGeneralInfoActions.SetRouteId(payload);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditGeneralInfoActions.SET_ROUTE_ID,
      payload
    });
  });

  it('should create SetDifficulty action', () => {
    const payload = {
      difficulty: 1
    };
    const action = new HikeEditGeneralInfoActions.SetDifficulty(payload);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditGeneralInfoActions.SET_DIFFICULTY,
      payload
    });
  });

  it('should create SetIsRoundTrip action', () => {
    const payload = {
      isRoundTrip: true
    };
    const action = new HikeEditGeneralInfoActions.SetIsRoundTrip(payload);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditGeneralInfoActions.SET_IS_ROUND_TRIP,
      payload
    });
  });

  it('should create SetPois action', () => {
    const payload = { pois: ['id1', 'id2'] };
    const action = new HikeEditGeneralInfoActions.SetPois(payload);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditGeneralInfoActions.SET_POIS,
      payload
    });
  });

  it('should create AddPoi action', () => {
    const payload = { poi: 'id1' };
    const action = new HikeEditGeneralInfoActions.AddPoi(payload);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditGeneralInfoActions.ADD_POI,
      payload
    });
  });

  it('should create RemovePoi action', () => {
    const payload = { poi: 'id1' };
    const action = new HikeEditGeneralInfoActions.RemovePoi(payload);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditGeneralInfoActions.REMOVE_POI,
      payload
    });
  });

  it('should create SetDescriptions action', () => {
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
      payload
    });
  });

  it('should create AddDescription action', () => {
    const payload = {
      description: {
        id: 'en_US',
        title: 'Fake title',
        summary: 'Fake summary',
        fullDescription: 'Fake description'
      }
    };
    const action = new HikeEditGeneralInfoActions.AddDescription(payload);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditGeneralInfoActions.ADD_DESCRIPTION,
      payload
    });
  });
});
