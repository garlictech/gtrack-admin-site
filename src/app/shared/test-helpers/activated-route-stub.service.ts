import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class ActivatedRouteStub {
    private _testParams: {};
    private _subject = new BehaviorSubject(this.testParams);
    params = this._subject.asObservable();

    get testParams() {
        return this._testParams;
    }
    set testParams(params: {}) {
        this._testParams = params;
        this._subject.next(params);
    }
}
