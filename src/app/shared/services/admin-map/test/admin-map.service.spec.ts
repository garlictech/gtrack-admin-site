import { State } from 'app/store';
import * as _ from 'lodash';

import { TestBed } from '@angular/core/testing';

import { Store, StoreModule } from '@ngrx/store';

import { AdminMapService } from '../admin-map.service';
import {
  LeafletMapMarkerService,
  LeafletIconService,
  LeafletMarkerPopupService
} from '@bit/garlictech.angular-features.common.leaflet-map';
import { DescriptionLanguageListService } from '@bit/garlictech.angular-features.common.multi-language-text';

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
