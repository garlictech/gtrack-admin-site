import * as _ from 'lodash';
import { MessageService } from 'primeng/api';

import { HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { GeometryService } from '@bit/garlictech.angular-features.common.geometry';
import { EPoiTypes } from '@bit/garlictech.angular-features.common.gtrack-interfaces';

import { HikeProgramService } from '../../hike';
import { WikipediaPoiService } from '../wikipedia-poi.service';
import {
  WIKIPEDIA_POI_EXTRACT,
  WIKIPEDIA_POI_IMAGE,
  WIKIPEDIA_POIS,
  WIKIPEDIA_RESPONSE
} from './fixtures/wikipedia-pois';

describe('WikipediaPoiService', () => {
  let wikipediaPoiService: WikipediaPoiService;
  let hikeProgramService: HikeProgramService;
  let messageService: MessageService;
  let httpMock: HttpTestingController;

  const BOUNDS = {
    SouthWest: { lon: 0, lat: 0 },
    NorthEast: { lon: 10, lat: 10 }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        WikipediaPoiService,
        GeometryService,
        {
          provide: MessageService,
          useValue: {
            add: jest.fn()
          }
        },
        {
          provide: HikeProgramService,
          useValue: {
            getDescriptionLanguages: jest.fn()
          }
        }
      ]
    });

    wikipediaPoiService = TestBed.get(WikipediaPoiService);
    hikeProgramService = TestBed.get(HikeProgramService);
    messageService = TestBed.get(MessageService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(wikipediaPoiService).toBeTruthy();
  });

  it('should get wikipedia pois from api', done => {
    let wikipediaPois = [];

    wikipediaPoiService.get(BOUNDS, 'en').subscribe(pois => {
      wikipediaPois = pois;

      // TODO: mock id
      expect(wikipediaPois.map(p => _.omit(p, 'id'))).toEqual(_.cloneDeep(WIKIPEDIA_POIS).map(p => _.omit(p, 'id')));

      done();
    });

    httpMock
      .expectOne(
        (req: HttpRequest<any>) =>
          req.url.includes('wikipedia.org/w/api.php?action=query&list=geosearch') && req.method === 'GET'
      )
      .flush(WIKIPEDIA_RESPONSE);

    httpMock.verify();
  });

  it('should show error message on api failure', done => {
    let wikipediaPois = [];
    const messageSpy = jest.spyOn(messageService, 'add');

    wikipediaPoiService.get(BOUNDS, 'en').subscribe(pois => {
      wikipediaPois = pois;

      expect(messageSpy).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error!',
        detail: 'Mock error info',
        life: 8000
      });

      done();
    });

    httpMock
      .expectOne(
        (req: HttpRequest<any>) =>
          req.url.includes('wikipedia.org/w/api.php?action=query&list=geosearch') && req.method === 'GET'
      )
      .flush({
        error: {
          info: 'Mock error info'
        }
      });

    httpMock.verify();
  });

  it('should get poi details from Google', fakeAsync(() => {
    let wikipediaPois = [];

    const expectedPois = [
      _.merge(_.cloneDeep(WIKIPEDIA_POIS[0]), {
        wikipedia: {
          extract: WIKIPEDIA_POI_EXTRACT.query.pages[WIKIPEDIA_POIS[0].wikipedia.pageid].extract,
          photos: [
            {
              card: {
                height: 1600,
                url: WIKIPEDIA_POI_IMAGE.query.pages[WIKIPEDIA_POIS[0].wikipedia.pageid].original.source,
                width: 1071
              },
              lat: 47.6771,
              lon: 18.81489,
              original: {
                height: 1600,
                url: WIKIPEDIA_POI_IMAGE.query.pages[WIKIPEDIA_POIS[0].wikipedia.pageid].original.source,
                width: 1071
              },
              source: {
                poiObjectId: WIKIPEDIA_POIS[0].wikipedia.pageid,
                type: EPoiTypes.wikipedia
              },
              thumbnail: {
                height: 50,
                url: WIKIPEDIA_POI_IMAGE.query.pages[WIKIPEDIA_POIS[0].wikipedia.pageid].thumbnail.source,
                width: 33
              },
              title: 'Pomáz'
            }
          ]
        }
      })
    ];

    jest.spyOn(hikeProgramService, 'getDescriptionLanguages').mockReturnValue(['en']);

    wikipediaPoiService.getPoiDetails([WIKIPEDIA_POIS[0]]).then(pois => {
      wikipediaPois = pois;

      expect(wikipediaPois).toEqual(expectedPois);
    });

    tick(100);

    httpMock
      .expectOne(
        (req: HttpRequest<any>) =>
          req.url.includes('wikipedia.org/w/api.php?action=query&format=json&prop=extracts') && req.method === 'GET'
      )
      .flush(WIKIPEDIA_POI_EXTRACT);

    httpMock
      .expectOne(
        (req: HttpRequest<any>) =>
          req.url.includes('wikipedia.org/w/api.php?action=query&format=json&prop=pageimages') && req.method === 'GET'
      )
      .flush(WIKIPEDIA_POI_IMAGE);

    httpMock.verify();
  }));
});
