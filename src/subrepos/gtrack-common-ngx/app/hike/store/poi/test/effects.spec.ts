// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { TestBed } from '@angular/core/testing';
// import { Actions, Effect, EffectsModule } from '@ngrx/effects';
// import { StoreModule } from '@ngrx/store';

// import { IPoiStored, IPoi } from 'subrepos/provider-client';
// import { DeepstreamService } from 'subrepos/deepstream-ngx';

// import * as _ from 'lodash';
// import * as uuid from 'uuid/v4';

// import { hot, cold } from 'jasmine-marbles';

// import * as poiActions from '../actions';
// import { PoiEffects } from '../effects';
// import { PoiService } from '../../../services/poi';
// import { DeepstreamModule } from '../../../../deepstream';

// import { Observable } from 'rxjs/Observable';
// import { pois as poiFixtures, poisStored } from './fixtures';

// import { GeometryService } from '../../../services/geometry';
// import { GeoSearchService } from '../../../../geosearch';

// export class TestActions extends Actions {
//   constructor() {
//     super(Observable.empty());
//   }

//   set stream(source: Observable<any>) {
//     this.source = source;
//   }
// }

// export function getActions() {
//   return new TestActions();
// }

// describe('Poi effects', () => {
//   let poisMap: {
//     [key: string]: IPoiStored;
//   };

//   let pois: IPoi[];

//   let actions$: TestActions;
//   let service: PoiService;
//   let effects: PoiEffects;

//   let ids: string[];
//   let newId: string;

//   beforeEach(() => {
//     ids = poisStored.map(poi => poi.id);
//     poisMap = _.zipObject(ids, poisStored);
//     pois = poisStored.map(data => data);
//     newId = uuid();

//     TestBed.configureTestingModule({
//       imports: [
//         StoreModule.forRoot({}),
//         EffectsModule.forRoot([]),
//         HttpClientTestingModule,
//         DeepstreamModule.forRoot({
//           storeDomain: 'deepstream',
//           deepstreamConnectionString: ''
//         })
//       ],
//       providers: [
//         PoiService,
//         PoiEffects,
//         GeometryService,
//         GeoSearchService,
//         {
//           provide: Actions,
//           useFactory: getActions
//         },
//         {
//           provide: DeepstreamService,
//           useValue: {}
//         }
//       ]
//     });

//     actions$ = TestBed.get(Actions);
//     service = TestBed.get(PoiService);
//     effects = TestBed.get(PoiEffects);

//     spyOn(service, 'get').and.callFake(id => Observable.of(poisMap[id]));
//     spyOn(service, 'create').and.returnValue(
//       Observable.of({
//         id: newId
//       })
//     );
//   });

//   describe('loadPoi$', () => {
//     it('should return a Poi from PoiLoaded', () => {
//       const action = new poiActions.LoadPoi(ids[0]);
//       const completion = new poiActions.PoiLoaded(ids[0], pois[0]);
//       const expected = cold('-b', { b: completion });

//       actions$.stream = hot('-a', { a: action });

//       expect(effects.loadPoi$).toBeObservable(expected);
//     });
//   });

//   describe('loadPois$', () => {
//     it('should return all the Pois from AllPoiLoaded', () => {
//       const action = new poiActions.LoadPois(ids);
//       const completion = new poiActions.AllPoiLoaded(ids, pois);
//       const expected = cold('-b', { b: completion });

//       actions$.stream = hot('-a', { a: action });

//       expect(effects.loadPois$).toBeObservable(expected);
//     });
//   });

//   describe('savePoi$', () => {
//     it('should return the id of the created Poi from PoiCreated', () => {
//       const action = new poiActions.SavePoi(poiFixtures[0]);
//       const completion = new poiActions.PoiSaved(newId);
//       const expected = cold('-b', { b: completion });

//       actions$.stream = hot('-a', { a: action });

//       expect(effects.savePoi$).toBeObservable(expected);
//     });
//   });
// });
