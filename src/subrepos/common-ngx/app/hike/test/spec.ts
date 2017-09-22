/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import { Observable } from 'rxjs';

import { HikeService, Hike } from '..';
import { mockHike } from './mock-hike';

let mockFirebase = {
  database: {
    object: (url): FirebaseObjectObservable<any> => {
      return;
    },

    list: (url): FirebaseListObservable<any> => {
      return;
    }
  }
};

describe('HikeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HikeService]
    });
  });

  it('should get a hike by id', (done) => {
    let service: HikeService = TestBed.get(HikeService);

    let spy = spyOn(mockFirebase.database, 'object').and.returnValue(() => {
      return FirebaseObjectObservable.of(mockHike);
    });

    service
      .get('1')
      .subscribe(
        (hike: Hike) => {
          expect(hike instanceof Hike).toBeTruthy();
          expect(spy.calls.count()).toEqual(1);
          expect(hike.routeId).toEqual(1);

          done();
        },
        (err) => done.fail(err)
      );
  });

  it('should get all hikes', (done) => {
    let service: HikeService = TestBed.get(HikeService);

    spyOn(mockFirebase.database, 'list').and.returnValue(() => {
      return FirebaseListObservable.of([mockHike]);
    });

    service
      .query()
      .subscribe(
        (hikes: Hike[]) => {
          done();
        },
        (err) => done.fail(err)
      )
  });
});
