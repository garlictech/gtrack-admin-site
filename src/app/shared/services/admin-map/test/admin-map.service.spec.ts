import { State } from 'app/store';
import * as _ from 'lodash';

import { TestBed } from '@angular/core/testing';
import { LeafletIconService } from '@common.features/leaflet-map/services/leaflet-icon.service';
import { LeafletMapMarkerService } from '@common.features/leaflet-map/services/leaflet-map-marker.service';
import { LeafletMarkerPopupService } from '@common.features/leaflet-map/services/leaflet-marker-popup.service';
import { Store, StoreModule } from '@ngrx/store';

import { DescriptionLanguageListService } from '../../../../../subrepos/gtrack-common-ngx';
import { AdminMapService } from '../admin-map.service';

describe('AdminMapService', () => {
  let adminMapService: AdminMapService;
  let store: Store<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      providers: [
        AdminMapService,
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(() => 1)
          }
        },
        {
          provide: LeafletIconService,
          useValue: {}
        },
        {
          provide: LeafletMapMarkerService,
          useValue: {}
        },
        {
          provide: DescriptionLanguageListService,
          useValue: {}
        },
        {
          provide: LeafletMarkerPopupService,
          useValue: {}
        }
      ]
    });

    adminMapService = TestBed.get(AdminMapService);
    store = TestBed.get(Store);
  });

  it('should be created', () => {
    expect(adminMapService).toBeTruthy();
  });
});
