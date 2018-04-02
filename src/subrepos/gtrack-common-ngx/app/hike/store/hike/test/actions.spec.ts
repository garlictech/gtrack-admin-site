import * as uuid from 'uuid/v4';
import { IHikeProgram, IHikeProgramStored } from 'subrepos/provider-client';

import * as actions from '../actions';
import { HikeProgram } from '../../../services/hike-program';
import { CheckpointService } from '../../../services/checkpoint';

describe('Hike actions', () => {
  let id;
  let hikeProgramData: IHikeProgram;
  let hikeProgramStoredData: IHikeProgramStored;

  beforeEach(() => {
    id = uuid();
    hikeProgramData = {
      distance: 5,
      isRoundTrip: false,
      uphill: 1,
      downhill: 1,
      time: 20,
      score: 20,
      location: 'Budapest',
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
      pois: [],
      stops: []
    };

    hikeProgramStoredData = {
      ...hikeProgramData,
      id,
      timestamp: new Date().getTime()
    }
  });

  describe('LoadHikeProgram action', () => {
    it('should create an action', () => {
      let action = new actions.LoadHikeProgram(id);

      expect({ ...action }).toEqual({
        type: actions.HikeProgramActionTypes.LOAD_HIKE_PROGRAM,
        context: id
      });
    });
  });

  describe('LoadHikeProgramFailed action', () => {
    it('should create an action', () => {
      let action = new actions.LoadHikeProgramFailed(id);

      expect({ ...action }).toEqual({
        type: actions.HikeProgramActionTypes.LOAD_HIKE_PROGRAM_FAILED,
        context: id
      });
    });
  });

  describe('HikeProgramLoaded action', () => {
    it('should create an action', () => {
      let hikeProgram = new HikeProgram(hikeProgramStoredData, new CheckpointService());
      let action = new actions.HikeProgramLoaded(id, hikeProgram);

      expect({ ...action }).toEqual({
        type: actions.HikeProgramActionTypes.HIKE_PROGRAM_LOADED,
        context: id,
        hikeProgram: hikeProgram
      });
    });
  });

  describe('LoadHikePrograms action', () => {
    it('should create an action', () => {
      let action = new actions.LoadHikePrograms();

      expect({ ...action }).toEqual({
        type: actions.HikeProgramActionTypes.LOAD_HIKE_PROGRAMS
      });
    });
  });

  describe('AllHikeProgramsLoaded action', () => {
    it('should create an action', () => {
      let hikeProgram = new HikeProgram(hikeProgramStoredData, new CheckpointService());
      let action = new actions.AllHikeProgramsLoaded([id], [hikeProgram]);

      expect({ ...action }).toEqual({
        type: actions.HikeProgramActionTypes.ALL_HIKE_PROGRAMS_LOADED,
        contexts: [id],
        hikePrograms: [hikeProgram]
      });
    });
  });

  describe('SaveHikeProgram action', () => {
    it('should create an action', () => {
      let action = new actions.SaveHikeProgram(hikeProgramData);

      expect({ ...action }).toEqual({
        type: actions.HikeProgramActionTypes.SAVE_HIKE_PROGRAM,
        hikeProgram: hikeProgramData
      });
    });
  });

  describe('HikeProgramSaved action', () => {
    it('should create an action', () => {
      let action = new actions.HikeProgramSaved(id);

      expect({ ...action }).toEqual({
        type: actions.HikeProgramActionTypes.HIKE_PROGRAM_SAVED,
        context: id
      });
    });
  });

});
