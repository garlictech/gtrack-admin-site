import * as uuid from 'uuid/v4';
import { HikeProgramData, HikeProgramStored, EObjectState } from '@features/common/gtrack-interfaces';
import * as actions from '../actions';

describe('Hike actions', () => {
  let id;
  let hikeProgramData: HikeProgramData;
  let hikeProgramStoredData: HikeProgramStored;

  beforeEach(() => {
    id = uuid();
    hikeProgramData = {
      id: id,
      distance: 5,
      isRoundTrip: false,
      uphill: 1,
      downhill: 1,
      time: 20,
      reverseTime: 19,
      reverseScore: 30,
      score: 20,
      location: 'Budapest',
      feature: false,
      difficulty: 5,
      routeIcon: '',
      elevationIcon: '',
      routeId: uuid(),
      description: {
        en_US: {
          fullDescription: '',
          title: '',
          summary: ''
        }
      },
      teaser: {
        en_US: {
          fullDescription: '',
          title: '',
          summary: ''
        }
      },
      stops: [],
      reverseStops: []
    };

    hikeProgramStoredData = {
      ...hikeProgramData,
      id: id,
      timestamp: new Date().getTime(),
      state: EObjectState.draft
    };
  });

  describe('LoadHikeProgram action', () => {
    it('should create an action', () => {
      const action = new actions.LoadHikeProgram(id);

      expect({ ...action }).toEqual({
        type: actions.HikeProgramActionTypes.LOAD_HIKE_PROGRAM,
        context: id
      });
    });
  });

  describe('LoadHikeProgramFailed action', () => {
    it('should create an action', () => {
      const action = new actions.LoadHikeProgramFailed(id);

      expect({ ...action }).toEqual({
        type: actions.HikeProgramActionTypes.LOAD_HIKE_PROGRAM_FAILED,
        context: id
      });
    });
  });

  describe('HikeProgramLoaded action', () => {
    it('should create an action', () => {
      const action = new actions.HikeProgramLoaded(id, hikeProgramStoredData);

      expect({ ...action }).toEqual({
        type: actions.HikeProgramActionTypes.HIKE_PROGRAM_LOADED,
        context: id,
        hikeProgram: hikeProgramStoredData
      });
    });
  });

  describe('LoadHikePrograms action', () => {
    it('should create an action', () => {
      const action = new actions.LoadHikePrograms();

      expect({ ...action }).toEqual({
        type: actions.HikeProgramActionTypes.LOAD_HIKE_PROGRAMS
      });
    });
  });

  describe('AllHikeProgramsLoaded action', () => {
    it('should create an action', () => {
      const action = new actions.AllHikeProgramsLoaded([id], [hikeProgramStoredData]);

      expect({ ...action }).toEqual({
        type: actions.HikeProgramActionTypes.ALL_HIKE_PROGRAMS_LOADED,
        contexts: [id],
        hikePrograms: [hikeProgramStoredData]
      });
    });
  });

  describe('UpdateHikeProgramState action', () => {
    it('should create an action', () => {
      const action = new actions.UpdateHikeProgramState(id, EObjectState.published);

      expect({ ...action }).toEqual({
        type: actions.HikeProgramActionTypes.UPDATE_HIKE_PROGRAM_STATE,
        id: id,
        state: EObjectState.published
      });
    });
  });

  describe('DeleteHikeProgram action', () => {
    it('should create an action', () => {
      const action = new actions.DeleteHikeProgram(id);

      expect({ ...action }).toEqual({
        type: actions.HikeProgramActionTypes.DELETE_HIKE_PROGRAM,
        id: id
      });
    });
  });

  describe('HikeProgramDeleted action', () => {
    it('should create an action', () => {
      const action = new actions.HikeProgramDeleted(id);

      expect({ ...action }).toEqual({
        type: actions.HikeProgramActionTypes.HIKE_PROGRAM_DELETED,
        context: id
      });
    });
  });

  describe('ReverseHikeProgram action', () => {
    it('should create an action', () => {
      const action = new actions.ReverseHikeProgram(id);

      expect({ ...action }).toEqual({
        type: actions.HikeProgramActionTypes.REVERSE_HIKE_PROGRAM,
        context: id
      });
    });
  });

  describe('ReverseHikeProgram action', () => {
    it('should create an action', () => {
      const action = new actions.HikeProgramReversed(id, hikeProgramStoredData);

      expect({ ...action }).toEqual({
        type: actions.HikeProgramActionTypes.HIKE_PROGRAM_REVERSED,
        context: id,
        hikeProgram: hikeProgramStoredData
      });
    });
  });
});
