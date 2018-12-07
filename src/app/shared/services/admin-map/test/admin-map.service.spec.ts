import { TestBed } from '@angular/core/testing';
import { AdminMapService } from '../admin-map.service';
import {
  MapMarkerService, DescriptionLanguageListService, MarkerPopupService
} from '../../../../../subrepos/gtrack-common-ngx';

import { StoreModule, Store } from '@ngrx/store';
import { State } from 'app/store';

import * as _ from 'lodash';
import { LeafletIconService } from '@common.features/leaflet-map/services/leaflet-icon.service';

describe('AdminMapService', () => {
  let adminMapService: AdminMapService;
  let store: Store<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({})
      ],
      providers: [
        AdminMapService,
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(() => 1)
          }
        },
        {
          provide: LeafletIconService,
          useValue: {}
        },
        {
          provide: MapMarkerService,
          useValue: {}
        },
        {
          provide: DescriptionLanguageListService,
          useValue: {}
        },
        {
          provide: MarkerPopupService,
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
