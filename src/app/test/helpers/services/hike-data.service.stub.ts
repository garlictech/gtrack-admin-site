import { Injectable } from '@angular/core';
import { MOCK_HIKE_LIST, MOCK_HIKE_DATA } from '../../../mock-data';

@Injectable()
export class HikeDataServiceStub {
  public getHikes() {
    return MOCK_HIKE_LIST;
  }

  public getHike(id) {
    return MOCK_HIKE_DATA;
  }
}
