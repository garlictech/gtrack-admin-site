import { TestBed, tick, fakeAsync } from '@angular/core/testing';
import { GooglePoiService, PLACE_API_URL, PURE_PLACE_API_URL } from '../google-poi.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GeometryService, defaultSharedConfig } from '../../../../../subrepos/gtrack-common-ngx';
import { GOOGLE_POI_RESPONSE, GOOGLE_POIS, DETAILED_GOOGLE_POI } from './fixtures/google-pois';
import { HttpRequest } from '@angular/common/http';
import { EPoiImageTypes } from '../../../../../subrepos/provider-client';

import * as _ from 'lodash';

describe('GooglePoiService', () => {
  let googlePoiService: GooglePoiService;
  let geometryService: GeometryService;
  let httpMock: HttpTestingController;

  const BOUNDS = {
    SouthWest: { lon: 0, lat: 0 },
    NorthEast: { lon: 10, lat: 10 }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        GooglePoiService,
        {
          provide: GeometryService,
          useValue: {
            getCenterRadius: () => {}
          }
        }
      ]
    });

    googlePoiService = TestBed.get(GooglePoiService);
    geometryService = TestBed.get(GeometryService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(googlePoiService).toBeTruthy();
  });

  it('should get pois from Google', (done) => {
    let googlePois = [];
    const geoSpy = jest.spyOn(geometryService, 'getCenterRadius').mockReturnValue({
      center: { geometry: { coordinates: [0, 0] } },
      radius: 10
    });
    const request = `${PLACE_API_URL}/nearbysearch/json?location=0,0&radius=10&key=${defaultSharedConfig.googleMaps.key}`;
    const expectedPois = GOOGLE_POIS;

    googlePoiService
      .get(BOUNDS, ['en'])
      .subscribe(pois => {
        googlePois = pois;

        // TODO: mock id
        expect(googlePois.map(p => _.omit(p, 'id'))).toEqual(expectedPois.map((p => _.omit(p, 'id'))));

        done();
    });

    httpMock
      .expectOne((req: HttpRequest<any>) => req.url === request && req.method === 'GET')
      .flush(GOOGLE_POI_RESPONSE);

    expect(geoSpy).toHaveBeenCalledWith(BOUNDS);

    httpMock.verify();
  });

  it('should get poi details from Google', fakeAsync(() => {
    let googlePois = [];

    const thumbnailWidth = 320;
    const cardWidth = 640;

    const request = `${PLACE_API_URL}/details/json?placeid=${GOOGLE_POIS[0].google.id}&key=${defaultSharedConfig.googleMaps.key}`;
    const expectedPois = [_.merge(_.cloneDeep(GOOGLE_POIS[0]), {
      google: {
        formatted_address: 'mockAddress',
        international_phone_number: 'mockNumber',
        opening_hours: 'mockOpeningHours',
        photos: [{
          title: 'photoTitle',
          lat: GOOGLE_POIS[0].lat,
          lon: GOOGLE_POIS[0].lon,
          original: {
            url: `${PURE_PLACE_API_URL}/photo?maxwidth=${2000}&photoreference=${
              DETAILED_GOOGLE_POI.photos[0].photo_reference}&key=${defaultSharedConfig.googleMaps.key}`,
            width: 2000,
            height: 1000
          },
          card: {
            url: `${PURE_PLACE_API_URL}/photo?maxwidth=${cardWidth}&photoreference=${
              DETAILED_GOOGLE_POI.photos[0].photo_reference}&key=${defaultSharedConfig.googleMaps.key}`,
            width: cardWidth,
            height: Math.round((cardWidth * DETAILED_GOOGLE_POI.photos[0].height) / DETAILED_GOOGLE_POI.photos[0].width)
          },
          thumbnail: {
            url: `${PURE_PLACE_API_URL}/photo?maxwidth=${thumbnailWidth}&photoreference=${
              DETAILED_GOOGLE_POI.photos[0].photo_reference}&key=${defaultSharedConfig.googleMaps.key}`,
            width: thumbnailWidth,
            height: Math.round((thumbnailWidth * DETAILED_GOOGLE_POI.photos[0].height) / DETAILED_GOOGLE_POI.photos[0].width)
          },
          source: {
            type: EPoiImageTypes.google,
            poiObjectId: GOOGLE_POIS[0].google.id,
            photoReference: DETAILED_GOOGLE_POI.photos[0].photo_reference
          }
        }]
      }
    })];

    googlePoiService
      .getPoiDetails([GOOGLE_POIS[0]])
      .then(pois => {
        googlePois = pois;

        expect(googlePois).toEqual(expectedPois);
    });

    tick(500);

    httpMock
      .expectOne((req: HttpRequest<any>) => req.url === request && req.method === 'GET')
      .flush({
        result: DETAILED_GOOGLE_POI,
        status: 'OK'
      });

    httpMock.verify();
  }));
});
