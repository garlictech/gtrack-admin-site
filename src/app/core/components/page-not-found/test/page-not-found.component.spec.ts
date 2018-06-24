import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { PageNotFoundComponent } from '../index';
import { CardModule } from 'primeng/card';

let comp: PageNotFoundComponent;
let fixture: ComponentFixture<PageNotFoundComponent>;

describe('PageNotFoundComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PageNotFoundComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PageNotFoundComponent);
    comp = fixture.debugElement.componentInstance;
  });

  it('should create the component', async(() => {
    fixture.detectChanges();
    expect(comp).toBeTruthy();
  }));
});
