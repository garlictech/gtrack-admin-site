import * as L from 'leaflet';

import { TestBed } from '@angular/core/testing';
import {
  EIconSource,
  EIconStyle
} from '@bit/garlictech.angular-features.common.leaflet-map/node_modules/@bit/garlictech.angular-features.common.marker-icons/enums';

import { LeafletIconService } from '../leaflet-icon.service';

describe('LeafletIconService', () => {
  let leafletIconService: LeafletIconService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LeafletIconService]
    });

    leafletIconService = TestBed.get(LeafletIconService);
  });

  it('should be created', () => {
    expect(leafletIconService).toBeTruthy();
  });

  it('should get leaflet icons', () => {
    const icon = leafletIconService.getLeafletIcon('bank', EIconStyle.DEFAULT);

    expect(icon).toBeInstanceOf(L.Icon);
  });
});
