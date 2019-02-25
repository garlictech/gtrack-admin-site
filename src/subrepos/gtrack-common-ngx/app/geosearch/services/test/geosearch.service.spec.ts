import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { Observable } from 'rxjs';

import { GeospatialBoxSearchPayload, GeospatialCircleSearchPayload } from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import { DeepstreamService } from 'subrepos/gtrack-common-ngx';

import { GeoSearchService } from '../geosearch.service';

describe('GeoSearchService', () => {
  let service: GeoSearchService;
  let spy: jasmine.Spy;

  spy = jasmine.createSpy('callRpc').and.returnValue(Observable.of([]));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({}), EffectsModule.forRoot([])],
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

    const deepstreamService = TestBed.get(DeepstreamService);

    service = TestBed.get(GeoSearchService);
  });

  describe('searchInBox', () => {
    it('should call the provider', async () => {
      const query: GeospatialBoxSearchPayload = {
        table: 'test',
        box: {
          type: 'Polygon',
          coordinates: [[[41.23, 12.43]]]
        }
      };

      const result = await service.searchBox(query).toPromise();

      expect(spy).toHaveBeenCalledWith('open.geo.query.includedInBox', {
        payload: query
      });
    });
  });

  describe('searchInCircle', () => {
    it('should call the provider', async () => {
      const query: GeospatialCircleSearchPayload = {
        table: 'test',
        circle: {
          radius: 500,
          center: [41.23, 12.43]
        }
      };

      const result = await service.searchCircle(query).toPromise();

      expect(spy).toHaveBeenCalledWith('open.geo.query.includedInCircle', {
        payload: query
      });
    });
  });
});
