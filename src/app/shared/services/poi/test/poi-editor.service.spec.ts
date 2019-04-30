import { MessageService } from 'primeng/api';

// tslint:disable:no-big-function
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { GeoSearchSelectors } from '@bit/garlictech.angular-features.common.geosearch';
import { GeospatialService } from '@bit/garlictech.angular-features.common.geospatial';
import { EPoiTypes, ETextualDescriptionType } from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import {
  LeafletIconService,
  LeafletMapMarkerService,
  LeafletMapService,
  LeafletMarkerPopupService,
  reducer as leafletMapReducer
} from '@bit/garlictech.angular-features.common.leaflet-map';
import { featureName as leafletFeatureName } from '@bit/garlictech.angular-features.common.leaflet-map/store/state';
import { ElevationService } from '@bit/garlictech.angular-features.common.elevation';
import { GeometryService } from '@bit/garlictech.angular-features.common.geometry';
import { PoiSelectors } from '@bit/garlictech.angular-features.common.poi';
import { StoreModule } from '@ngrx/store';

import { editedHikeProgramReducer, hikeEditPoiReducer } from '../../../../../app/store/reducer';
import { RoutePlannerService } from '../../admin-map';
import { GooglePoiService } from '../google-poi.service';
import { PoiEditorService } from '../poi-editor.service';
import { WikipediaPoiService } from '../wikipedia-poi.service';
import { GOOGLE_POIS } from './fixtures/google-pois';
import { OSM_AMENITY_POIS } from './fixtures/osm-amenity-pois';
import { OSM_NATURAL_POIS } from './fixtures/osm-natural-pois';
import { WIKIPEDIA_POIS } from './fixtures/wikipedia-pois';

describe('PoiEditorService', () => {
  let poiEditorService: PoiEditorService;
  let geometryService: GeometryService;
  let geospatialService: GeospatialService;
  let routePlannerService: RoutePlannerService;
  let elevationService: ElevationService;
  let iconService: LeafletIconService;
  let geoSearchSelectors: GeoSearchSelectors;
  let poiSelectors: PoiSelectors;
  let googlePoiService: GooglePoiService;
  let wikipediaPoiService: WikipediaPoiService;
  let markerPopupService: LeafletMarkerPopupService;
  let messageService: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        StoreModule.forRoot({
          hikeEditPoi: hikeEditPoiReducer,
          editedHikeProgram: editedHikeProgramReducer,
          [leafletFeatureName]: leafletMapReducer
        })
      ],
      providers: [
        PoiEditorService,
        LeafletIconService,
        GeoSearchSelectors,
        PoiSelectors,
        LeafletMarkerPopupService,
        {
          provide: LeafletMapService,
          useValue: {
            addLayer: jest.fn(),
            removeLayer: jest.fn(),
            refreshSpiderfierMarkers: jest.fn(),
            leafletMap: jest.fn(),
            spin: jest.fn()
          }
        },
        {
          provide: GeometryService,
          useValue: {
            getCenterRadius: jest.fn(),
            distanceFromRoute: () => 0
          }
        },
        {
          provide: GeospatialService,
          useValue: {
            distanceOnLine: () => 0
          }
        },
        {
          provide: RoutePlannerService,
          useValue: {
            getSearchBounds: () => 0
          }
        },
        {
          provide: ElevationService,
          useValue: {
            getData: () => 0
          }
        },
        {
          provide: MessageService,
          useValue: {
            add: jest.fn()
          }
        },
        {
          provide: WikipediaPoiService,
          useValue: {
            getPoiDetails: jest.fn()
          }
        },
        {
          provide: GooglePoiService,
          useValue: {
            getPoiDetails: jest.fn()
          }
        },
        {
          provide: LeafletMapMarkerService,
          useValue: {
            create: jest.fn()
          }
        },
        {
          provide: LeafletIconService,
          useValue: {}
        }
      ]
    });

    poiEditorService = TestBed.get(PoiEditorService);
    geometryService = TestBed.get(GeometryService);
    geospatialService = TestBed.get(GeospatialService);
    routePlannerService = TestBed.get(RoutePlannerService);
    elevationService = TestBed.get(ElevationService);
    iconService = TestBed.get(LeafletIconService);
    geoSearchSelectors = TestBed.get(GeoSearchSelectors);
    poiSelectors = TestBed.get(PoiSelectors);
    googlePoiService = TestBed.get(GooglePoiService);
    wikipediaPoiService = TestBed.get(WikipediaPoiService);
    markerPopupService = TestBed.get(LeafletMarkerPopupService);
    messageService = TestBed.get(MessageService);
  });

  it('should be created', () => {
    expect(poiEditorService).toBeTruthy();
  });

  it('should get google poi dbObject', () => {
    const result = poiEditorService.getDbObj(GOOGLE_POIS[0]);
    const expected = {
      description: {
        en_US: {
          fullDescription: '',
          summary: '',
          title: 'Szentendre',
          type: ETextualDescriptionType.markdown
        }
      },
      elevation: 0,
      id: '1',
      lat: 47.6795337,
      lon: 19.0668602,
      objectId: {
        google: 'ChIJcWajYAPWQUcRIBweDCnEAAQ'
      },
      objectTypes: [EPoiTypes.google],
      types: ['city', 'political']
    };

    expect(result).toEqual(expected);
  });

  it('should get wikipedia poi dbObject', () => {
    const result = poiEditorService.getDbObj(WIKIPEDIA_POIS[0]);
    const expected = {
      additionalData: {
        wikipedia: {
          en: {
            url: 'https://en.wikipedia.org/?curid=11185321'
          }
        }
      },
      description: {
        en_US: {
          fullDescription: '',
          summary: '',
          title: 'Piliscsév',
          type: ETextualDescriptionType.markdown
        }
      },
      elevation: 0,
      id: '1',
      lat: 47.6771,
      lon: 18.81489,
      objectId: {
        wikipedia: {
          en: 11185321
        }
      },
      objectTypes: [EPoiTypes.wikipedia],
      types: ['sight']
    };

    expect(result).toEqual(expected);
  });

  it('should get osmAmenity poi dbObject', () => {
    const result = poiEditorService.getDbObj(OSM_AMENITY_POIS[0]);
    const expected = {
      description: {
        en_US: {
          fullDescription: '',
          summary: '',
          title: 'Game feeding',
          type: ETextualDescriptionType.markdown
        }
      },
      elevation: undefined,
      id: '69bfb720-df80-11e8-8d02-d5cc2cec59b6',
      lat: 47.670135,
      lon: 18.861173,
      objectId: { osm: 3454423964 },
      objectTypes: [EPoiTypes.osmAmenity],
      types: ['game_feeding']
    };

    expect(result).toEqual(expected);
  });

  it('should get osmNatural poi dbObject', () => {
    const result = poiEditorService.getDbObj(OSM_NATURAL_POIS[0]);
    const expected = {
      description: {
        en_US: {
          fullDescription: '',
          summary: '',
          title: 'Studenka-forrás',
          type: ETextualDescriptionType.markdown
        }
      },
      elevation: undefined,
      id: '7c50ef80-df8a-11e8-b8d2-b5e47c8475da',
      lat: 47.716533,
      lon: 18.780483,
      objectId: { osm: 3352546157 },
      objectTypes: [EPoiTypes.osmNatural],
      types: ['spring']
    };

    expect(result).toEqual(expected);
  });
});
