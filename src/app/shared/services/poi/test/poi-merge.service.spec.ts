import { TestBed } from '@angular/core/testing';
import { PoiMergeService } from '../poi-merge.service';
import { GOOGLE_POIS } from './fixtures/google-pois';
import { EXPECTED_FLAT_KEY_VALUES } from './fixtures/poi-merge';

describe('PoiMergeService', () => {
  let poiMergeService: PoiMergeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PoiMergeService]
    });

    poiMergeService = TestBed.get(PoiMergeService);
  });

  it('should be created', () => {
    expect(poiMergeService).toBeTruthy();
  });

  it('should collect flatKeyValues', () => {
    const result = poiMergeService.collectFlatKeyValues(GOOGLE_POIS);
    const expected = EXPECTED_FLAT_KEY_VALUES;
    expect(result).toEqual(expected);
  });

  it('should create gTrackPoi from unique values', () => {
    const result = poiMergeService.createGTrackPoiFromUniqueValues(EXPECTED_FLAT_KEY_VALUES.conflicts);
    const expected = {
      coords: [
        '[47.6795337, 19.0668602, 0, undefined,  undefined]',
        '[47.660011, 19.077554, 0, undefined,  undefined]'
      ],
      description: {
        en_US: {
          title: ['Szentendre', 'Hotel Róz Kkt']
        }
      },
      google: {
        id: ['ChIJcWajYAPWQUcRIBweDCnEAAQ', 'ChIJJ0b974rWQUcRWtjVwb7NsRw']
      }
    };
    expect(result).toEqual(expected);
  });
});
