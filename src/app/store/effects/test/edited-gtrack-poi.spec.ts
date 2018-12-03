import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { Actions, EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { hot, cold, Scheduler } from 'jest-marbles';
import { EditedGTrackPoiEffects } from '../edited-gtrack-poi';
import { DeepstreamService } from '../../../../subrepos/deepstream-ngx';
import { DeepstreamModule, PoiService } from '../../../../subrepos/gtrack-common-ngx';
import { RouterModule, Router } from '@angular/router';
import { mockRouter } from './helpers';
import { editedGTrackPoiActions } from '../../actions';
import { IExternalPoi } from '../../../shared/interfaces';
import * as editedGTrackPoiSelectors from '../../../store/selectors/edited-gtrack-poi';

import * as _ from 'lodash';

import { pois as poiFixtures } from '../../reducer/test/fixtures';

describe('EditedGTrackPoiEffects effects', () => {
  let actions$: Observable<any>;
  let effects: EditedGTrackPoiEffects;
  let poiService: PoiService;
  let pois: IExternalPoi[];

  beforeEach(() => {
    pois = _.cloneDeep(poiFixtures);

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        EffectsModule.forRoot([EditedGTrackPoiEffects]),
        HttpClientTestingModule,
        DeepstreamModule.forRoot(),
        RouterModule.forRoot([])
      ],
      providers: [
        EditedGTrackPoiEffects,
        PoiService,
        provideMockActions(() => actions$),
        {
          provide: DeepstreamService,
          useValue: {}
        },
        {
          provide: Router,
          useValue: mockRouter
        }
      ]
    });

    actions$ = TestBed.get(Actions);
    effects = TestBed.get(EditedGTrackPoiEffects);
    poiService = TestBed.get(PoiService);

    spyOn(editedGTrackPoiSelectors, 'getData').and.returnValue(pois[0]);
  });

  describe('save$', () => {
    it('should return poiId observable from SavePoi success', () => {
      spyOn(poiService, 'create').and.returnValue(
        Observable.of({
          id: pois[0].id
        })
      );

      const action = new editedGTrackPoiActions.SavePoi();
      const completion = new editedGTrackPoiActions.PoiSaveSuccess(pois[0].id);
      const expected = cold('-b', { b: completion });

      actions$ = hot('-a', { a: action });

      expect(effects.save$).toBeObservable(expected);

      Scheduler.get().flush();

      expect(editedGTrackPoiSelectors.getData).toBeCalled();
      expect(poiService.create).toBeCalledWith(pois[0]);
    });

    it('should return error observable from SavePoi failure', () => {
      spyOn(poiService, 'create').and.returnValue(Observable.throwError('error'));

      const action = new editedGTrackPoiActions.SavePoi();
      const completion = new editedGTrackPoiActions.PoiSaveFailed('error');
      const expected = cold('-b', { b: completion });

      actions$ = hot('-a', { a: action });

      expect(effects.save$).toBeObservable(expected);

      Scheduler.get().flush();

      expect(editedGTrackPoiSelectors.getData).toBeCalled();
      expect(poiService.create).toBeCalledWith(pois[0]);
    });
  });
});
