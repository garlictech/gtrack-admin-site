import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { take } from 'rxjs/operators';
import { StoreModule, Store } from '@ngrx/store';

import { HikeProgramData } from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import { ReverseHikeButtonComponent } from '../reverse-hike-button.component';
import * as actions from '../../../store/hike/actions';

describe('ReverseHikeButtonComponent', () => {
  let component: ReverseHikeButtonComponent;
  let fixture: ComponentFixture<ReverseHikeButtonComponent>;
  let store: Store<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      declarations: [ReverseHikeButtonComponent]
    });

    fixture = TestBed.createComponent(ReverseHikeButtonComponent);
    component = fixture.componentInstance;
    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
  });

  it('should call the reverse action', () => {
    component.hikeProgram = {
      id: 'test',
      reversed: true
    } as HikeProgramData;

    fixture.detectChanges();
    component.reverse();

    expect(store.dispatch).toHaveBeenCalledWith({
      type: actions.HikeProgramActionTypes.REVERSE_HIKE_PROGRAM,
      context: 'test'
    });
  });

  it('should not call the reverse action without hikeProgram', () => {
    fixture.detectChanges();
    component.reverse();

    expect(store.dispatch).not.toHaveBeenCalled();
  });
});
