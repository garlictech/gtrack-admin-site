import { TestBed } from '@angular/core/testing';
import { StoreModule, createSelector, createFeatureSelector } from '@ngrx/store';
import { Actions, Effect, EffectsModule } from '@ngrx/effects';
import * as uuid from 'uuid/v1';
import { Observable } from 'rxjs/Observable';

import { DeepstreamService, DeepstreamModule } from 'subrepos/gtrack-common-ngx';
import { IGeospatialBoxSearchPayload, IGeospatialCircleSearchPayload } from 'subrepos/provider-client';

import { GeoSearchService } from '../geosearch.service';


describe('GeoSearchService', () => {
  let service: GeoSearchService;
  let spy: jasmine.Spy;

  spy = jasmine.createSpy('callRpc').and.returnValue(Observable.of([]));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        EffectsModule.forRoot([])
      ],
      providers: [
        GeoSearchService,
        {
          provide: DeepstreamService,
          useValue: {
            callRpc: spy
          }
        }
      ]
    });

    let deepstreamService = TestBed.get(DeepstreamService);

    service = TestBed.get(GeoSearchService);
  });

  describe('searchInBox', () => {
    it('should call the provider', async() => {
      let query: IGeospatialBoxSearchPayload = {
        table: 'test',
        box: {
          type: 'Polygon',
          coordinates: [[
            [41.23, 12.43]
          ]]
        }
      };

      let result = await service.searchBox(query).toPromise();

      expect(spy).toHaveBeenCalledWith('open.geo.query.includedInBox', {
        payload: query
      });
    });
  });

  describe('searchInCircle', () => {
    it('should call the provider', async () => {
      let query: IGeospatialCircleSearchPayload = {
        table: 'test',
        circle: {
          radius: 500,
          center: [41.23, 12.43]
        }
      };

      let result = await service.searchCircle(query).toPromise();

      expect(spy).toHaveBeenCalledWith('open.geo.query.includedInCircle', {
        payload: query
      });
    });
  });

});
