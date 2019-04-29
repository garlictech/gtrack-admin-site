import { TestBed, inject } from '@angular/core/testing';
import { RouteService } from '../..';
import { DeepstreamService } from '@bit/garlictech.angular-features.common.deepstream-ngx';
import { GeometryService } from '@bit/garlictech.angular-features.common.geometry';

class MockDeepstreamService {}
class MockGeometryService {}

describe('RouteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RouteService,
        {
          provide: DeepstreamService,
          useClass: MockDeepstreamService
        },
        { provide: GeometryService, useClass: MockGeometryService }
      ]
    });
  });

  it('should ...', inject([RouteService], (service: RouteService) => {
    expect(service).toBeTruthy();
  }));
});
