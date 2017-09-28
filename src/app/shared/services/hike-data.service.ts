import { Injectable } from '@angular/core';
import { MOCK_HIKE_LIST, MOCK_HIKE_DATA } from '../../mock-data';
import { IHikeElement } from '../interfaces'
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Injectable()
export class HikeDataService {
    public getHikes() {
        return MOCK_HIKE_LIST;
    }

    public getHike(id) {
        return MOCK_HIKE_DATA;
    }
}
