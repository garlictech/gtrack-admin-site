import * as L from 'leaflet';

import { TestBed } from '@angular/core/testing';
import { EIconStyle } from '@bit/garlictech.angular-features.common.marker-icons/enums';

import { StoreModule } from '@ngrx/store';
import { reducer } from '../../store';
import { featureName } from '../../store/state';
import { LeafletIconService } from '../leaflet-icon.service';

describe('LeafletIconService', () => {
  let leafletIconService: LeafletIconService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          [featureName]: reducer
        })
      ],
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
