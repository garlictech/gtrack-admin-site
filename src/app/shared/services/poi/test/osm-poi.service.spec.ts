import * as _ from 'lodash';

import { HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { OsmPoiService } from '../osm-poi.service';
import { OSM_AMENITY_POIS, OSM_AMENITY_RESPONSE } from './fixtures/osm-amenity-pois';
import { OSM_NATURAL_POIS, OSM_NATURAL_RESPONSE } from './fixtures/osm-natural-pois';

describe('OsmPoiService', () => {
  let osmPoiService: OsmPoiService;
  let httpMock: HttpTestingController;

  const BOUNDS = {
    SouthWest: { lon: 0, lat: 0 },
    NorthEast: { lon: 10, lat: 10 }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OsmPoiService]
    });

    osmPoiService = TestBed.get(OsmPoiService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(osmPoiService).toBeTruthy();
  });

  it('should get amenity pois from OSM', done => {
    let osmPois = [];

    osmPoiService.get(BOUNDS, 'amenity', 'en').subscribe(pois => {
      osmPois = pois;

      // TODO: mock id
      expect(osmPois.map(p => _.omit(p, 'id'))).toEqual(_.cloneDeep(OSM_AMENITY_POIS).map(p => _.omit(p, 'id')));

      done();
    });

    httpMock
      .expectOne(
        (req: HttpRequest<any>) =>
          req.url.includes('https://overpass-api.de/api/interpreter') &&
          req.body.includes('k="amenity"') &&
          req.method === 'POST'
      )
      .flush(OSM_AMENITY_RESPONSE);

    httpMock.verify();
  });

  it('should get natural pois from OSM', done => {
    let osmPois = [];

    osmPoiService.get(BOUNDS, 'natural', 'en').subscribe(pois => {
      osmPois = pois;

      // TODO: mock id
      expect(osmPois.map(p => _.omit(p, 'id'))).toEqual(_.cloneDeep(OSM_NATURAL_POIS).map(p => _.omit(p, 'id')));

      done();
    });

    httpMock
      .expectOne(
        (req: HttpRequest<any>) =>
          req.url.includes('https://overpass-api.de/api/interpreter') &&
          req.body.includes('k="natural"') &&
          req.method === 'POST'
      )
      .flush(OSM_NATURAL_RESPONSE);

    httpMock.verify();
  });
});
