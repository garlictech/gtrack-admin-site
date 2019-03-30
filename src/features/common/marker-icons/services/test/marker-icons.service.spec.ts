import { SvgIconRegistryService } from 'angular-svg-icon';
import { of } from 'rxjs';

import { fakeAsync, TestBed } from '@angular/core/testing';
import { markerIconsReducer } from '@bit/garlictech.angular-features.common.marker-icons/store';
import { Store, StoreModule } from '@ngrx/store';

import { EIconStyle } from '../../enums';
import { featureName } from '../../store/state';
import { MarkerIconsService } from '../marker-icons.service';

describe('MarkerIconsService', () => {
  let markerIconsService: MarkerIconsService;
  let store: Store<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          [featureName]: markerIconsReducer
        })
      ],
      providers: [
        MarkerIconsService,
        {
          provide: SvgIconRegistryService,
          useValue: {
            loadSvg: jest.fn((path: string) => of({ outerHTML: `Mock SVG content from ${path}` }))
          }
        }
      ]
    });

    store = TestBed.get(Store);
    store.dispatch = jest.fn();
    markerIconsService = TestBed.get(MarkerIconsService);
  });

  it('should be created', () => {
    expect(markerIconsService).toBeTruthy();
  });

  it('should load SVG content to store on create', () => {
    expect((store.dispatch as any).mock.calls).toMatchSnapshot();
  });

  it('should get icon content from store', () => {
    const mockContent = 'Mock SVG content from /assets/icon/bank.svg';
    store.pipe = jest.fn().mockReturnValue(of(mockContent));

    const svg = markerIconsService.getIcon('bank', false, EIconStyle.DEFAULT);

    expect(svg).toEqual(mockContent);
  });

  it('should get marker content from store', () => {
    const mockContent = 'Mock SVG content from /assets/marker/bank.svg';
    store.pipe = jest.fn().mockReturnValue(of(mockContent));

    const svg = markerIconsService.getMarker('bank', false, EIconStyle.DEFAULT);

    expect(svg).toEqual(mockContent);
  });
});
