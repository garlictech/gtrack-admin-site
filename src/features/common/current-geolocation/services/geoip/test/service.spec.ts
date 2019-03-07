import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GeoIpService } from '../geoip.service';
import { GEO_IP_CONFIG } from '../../../config';

describe('GeoIpService', () => {
  let service: GeoIpService;
  let httpMock: HttpTestingController;
  let configMock: any;
  let locationMock: {
    accuracy: number;
    latitude: number;
    longitude: number;
  };

  beforeEach(() => {
    configMock = {
      endpoint: 'endpoint'
    };
    locationMock = {
      accuracy: 20,
      latitude: 47.5,
      longitude: 19.0833
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GeoIpService, { provide: GEO_IP_CONFIG, useValue: configMock }]
    });
    service = TestBed.get(GeoIpService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  it('getLocation should return an Observable of coordinates', () => {
    service.getLocation().subscribe(result => {
      expect(result).toBe(locationMock);
    });

    const req = httpMock.expectOne(`${configMock.endpoint}/geoip`);
    expect(req.request.method).toBe('GET');
    req.flush(locationMock);
  });
});
