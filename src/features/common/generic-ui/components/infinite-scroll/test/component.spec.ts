import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Injector } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { createSelector, Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { InfiniteScrollComponent } from '../';
import { reducer } from '../../../store';

class MockElementRef {
  nativeElement = {};
}

describe('NativeInfiniteScrollComponent', () => {
  let component: TestInfiniteScrollComponent;
  let fixture: ComponentFixture<TestInfiniteScrollComponent>;
  const lastKeySelector = createSelector(state => 'foolastKey');
  const items$ = of(['foocollectionItem1', 'foocollectionItem2']);
  const itemFetcher = jest.fn();

  @Component({ selector: 'app-test-infinite-scroll', template: '' })
  class TestInfiniteScrollComponent extends InfiniteScrollComponent {
    _destroy = jest.fn();
    constructor(_injector: Injector) {
      super(_injector);
    }
  }

  let store;
  let elementRef: ElementRef;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(reducer)],
      declarations: [TestInfiniteScrollComponent],
      providers: [{ provide: ChangeDetectorRef, useValue: {} }, { provide: ElementRef, useClass: MockElementRef }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    store = TestBed.get(Store);
    elementRef = TestBed.get(ElementRef);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestInfiniteScrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    component.ngOnDestroy();
    fixture.destroy();
  });

  it('it should be created', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnDestroy should call _destroy', () => {
    component.ngOnDestroy();
    expect(component._destroy).toHaveBeenCalled();
  });

  it('initalize should initialize the component properly', done => {
    const sliceEmitterSpy = jest.spyOn(component.sliceEmitter$, 'next');
    component.initialize(lastKeySelector, items$, itemFetcher);
    expect(sliceEmitterSpy).toHaveBeenCalledWith({ firstIndex: 0, rows: 10 });
    expect(component.itemsShown).toMatchSnapshot('itemsShown');

    component.totalRecords$
      .pipe(
        tap(value => {
          expect(value).toMatchSnapshot('totalRecords$');
        })
      )
      .subscribe(() => done());
  });

  it('paginate must proceed to the next page', () => {
    const sliceEmitterSpy = jest.spyOn(component.sliceEmitter$, 'next');
    component.initialize(lastKeySelector, items$, itemFetcher);
    component.loadMore();
    expect(sliceEmitterSpy).toHaveBeenCalledWith({ firstIndex: 0, rows: 10 });
    expect(itemFetcher).toHaveBeenCalledWith('foolastKey');
  });

  it('totalRecords$ must return the total records if there are pages (lastKey is defined)', done => {
    component.initialize(lastKeySelector, items$, itemFetcher);

    component.totalRecords$.subscribe(recordNum => {
      // Because, items$ by default returns a 2-element array (see the fixtures), the total record number is 2 in this test.
      expect(recordNum).toMatchSnapshot();
      done();
    });
  });

  it('totalRecords$ must return the total records if there are NO pages (lastKey is undefined)', done => {
    const fLastkeySelector = state => undefined;
    component.initialize(fLastkeySelector, items$, itemFetcher);

    component.totalRecords$.subscribe(recordNum => {
      expect(recordNum).toMatchSnapshot();
      done();
    });
  });

  it('totalRecords$ must return 0 if there are NO items returned (undefined)', done => {
    const fLastkeySelector = state => undefined;
    const fitems$ = of(undefined);
    component.initialize(fLastkeySelector, fitems$, itemFetcher);

    component.totalRecords$.subscribe(recordNum => {
      expect(recordNum).toMatchSnapshot();
      done();
    });
  });

  it('it should emit the new items and slices when we paginate', () => {
    component.initialize(lastKeySelector, items$, itemFetcher);
    component.sliceEmitter$.next({ firstIndex: 0, rows: 1 });
    expect(component.itemsShown).toMatchSnapshot('itemsShown');
  });

  it('reset should emit sliceemitter with default properties', () => {
    const spy = spyOn(component.sliceEmitter$, 'next');
    component.reset();
    expect(spy).toHaveBeenCalledWith({ firstIndex: 0, rows: 10 });
  });

  it('shouldShowComponent$ should return true if there are more items', done => {
    const fLastkeySelector = state => 'lastkey';
    const fitems$ = of(undefined);
    component.initialize(fLastkeySelector, fitems$, itemFetcher);

    component.shouldShowComponent$.subscribe(shouldShow => {
      expect(shouldShow).toMatchSnapshot();
      done();
    });
  });
});
