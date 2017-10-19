import { HikeDataService } from '../hike-data.service';
import { MOCK_HIKE_LIST, MOCK_HIKE_DATA } from '../../../mock-data';

describe('HikeDataService', () => {
  let service: HikeDataService;

  beforeEach(() => {
    service = new HikeDataService();
  });

  it('getHikes should return mock value', () => {
    expect(service.getHikes()).toEqual(MOCK_HIKE_LIST);
  });

  it('getHike should return mock value', () => {
    expect(service.getHike('id')).toEqual(MOCK_HIKE_DATA);
  });
});
