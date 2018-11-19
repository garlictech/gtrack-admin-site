import { TestBed } from '@angular/core/testing';
import { AdminMapService } from '../admin-map.service';
import {
  IconService, MapMarkerService, DescriptionLanguageListService, MarkerPopupService
} from '../../../../../subrepos/gtrack-common-ngx';
import * as hikeEditRoutePlannerSelectors from '../../../../store/selectors/hike-edit-route-planner';

import { StoreModule, Store } from '@ngrx/store';
import { hikeEditMapReducer } from 'app/store/reducer';
import { State } from 'app/store';
import { adminMapActions } from 'app/store/actions';

import * as _ from 'lodash';
import * as L from 'leaflet';

describe('AdminMapService', () => {
  let adminMapService: AdminMapService;
  let store: Store<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          hikeEditMap: hikeEditMapReducer
        })
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
          provide: IconService,
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

  it('should get map', (done) => {
    const div = document.createElement('div1');
    div.setAttribute('id', 'mapid1');
    document.body.appendChild(div);

    const map = adminMapService.get(L.map('mapid1'));
    const id = Object.keys(adminMapService['_maps'])[0];

    expect(adminMapService['_maps'][id]).toEqual(map);

    const storeSpy = jest.spyOn(store, 'dispatch');
    const action = new adminMapActions.RegisterMap(id);

    expect(storeSpy).toBeCalledWith(action);

    done();
  });

  it('should get map by id', (done) => {
    const div = document.createElement('div2');
    div.setAttribute('id', 'mapid2');
    document.body.appendChild(div);

    const map = adminMapService.get(L.map('mapid2'));
    const id = Object.keys(adminMapService['_maps'])[0];

    const mapById = adminMapService.getMapById(id);

    expect(mapById).toEqual(map);

    done();
  });
});
