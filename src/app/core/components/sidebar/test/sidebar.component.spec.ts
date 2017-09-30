import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from '../sidebar.component';
import { Store, Action } from '@ngrx/store';
import { MockStore } from '../../../../store/';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
          SidebarComponent
      ],
      providers: [
        {
          provide: Store,
          useValue: new MockStore({})
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
