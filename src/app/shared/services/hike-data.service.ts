import { Injectable } from '@angular/core';
import { MOCK_HIKE_LIST, MOCK_HIKE_DATA } from '../../mock-data';
import { IHikeElement } from '../interfaces'
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

export class HikeDataSource extends DataSource<any> {
    connect(): Observable<IHikeElement[]> {
        console.log('Load mock hike list instead of real data.');
        return Observable.of(MOCK_HIKE_LIST);
    }

    disconnect() {
        //
    }
}

@Injectable()
export class HikeDataService {
    public getHikes() {
        return new HikeDataSource();
    }

    public getHike(id) {
        console.log('Load mock hike data instead of real data.');
        return MOCK_HIKE_DATA;
    }
}
