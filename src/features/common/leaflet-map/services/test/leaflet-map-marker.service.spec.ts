import { TestBed } from '@angular/core/testing';

import { LeafletIconService } from '../leaflet-icon.service';
import { LeafletMapMarkerService } from '../leaflet-map-marker.service';
import { LeafletMapMarker } from '../lib';

describe('LeafletMapMarkerService', () => {
  let leafletMapMarkerService: LeafletMapMarkerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LeafletMapMarkerService, LeafletIconService]
    });

    leafletMapMarkerService = TestBed.get(LeafletMapMarkerService);
  });

  it('should be created', () => {
    expect(leafletMapMarkerService).toBeTruthy();
  });

  it('should create map marker', () => {
    const marker = leafletMapMarkerService.create(10, 10, ['cafe'], 'Cafe');
    expect(marker).toBeInstanceOf(LeafletMapMarker);
  });
});
