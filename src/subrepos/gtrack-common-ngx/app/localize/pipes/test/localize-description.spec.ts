import { TestBed } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import { StoreModule, Store } from '@ngrx/store';
import { reducer, State } from 'app/store';
import { Selectors } from 'app/language';

import 'rxjs/add/operator/take';

import * as langaugeActions from 'subrepos/localize-ngx/store/actions';

import { ILocalizedItem, ITextualDescription } from 'subrepos/provider-client';

import { LocalizeDescriptionPipe } from '../localize-description.pipe';

describe('LocalizeDescriptionPipe', () => {

  class FakeChangeDetectorRef extends ChangeDetectorRef {
    markForCheck(): void {
      // Empty
    }

    detach(): void {
      // Empty
    }

    detectChanges(): void {
      // Empty
    }

    checkNoChanges(): void {
      // Empty
    }

    reattach(): void {
      // Empty
    }
  };

  let description: ILocalizedItem<ITextualDescription>;
  let pipe: LocalizeDescriptionPipe;
  let ref: FakeChangeDetectorRef;

  beforeEach(() => {
    description = {
      hu_HU: {
        title: 'Magyar cím',
        summary: 'Magyar rövid'
      },
      en_US: {
        title: 'English title'
      }
    };

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(reducer)
      ],
      providers: [
        Selectors
      ]
    });

    const store: Store<State> = TestBed.get(Store);
    const selectors: Selectors = TestBed.get(Selectors);
    ref = new FakeChangeDetectorRef();

    pipe = new LocalizeDescriptionPipe(store, selectors, ref);
  });

  it('should transform the description to the default language', () => {
    const transformed = pipe.transform(description);

    expect(transformed.title).toEqual('English title');
    expect(transformed.summary).toEqual('');
    expect(transformed.fullDescription).toEqual('');
  });

  it('should transform the description to the actual language', () => {
    const store: Store<State> = TestBed.get(Store);
    store.dispatch(new langaugeActions.LanguageChanged('hu_HU'));

    const transformed = pipe.transform(description);
    expect(transformed.title).toEqual('Magyar cím');
    expect(transformed.summary).toEqual('Magyar rövid');
    expect(transformed.fullDescription).toEqual('');
  });

  it('should fallback to en_US when the language is not available', () => {
    const store: Store<State> = TestBed.get(Store);
    store.dispatch(new langaugeActions.LanguageChanged('de_DE'));

    const transformed = pipe.transform(description);

    expect(transformed.title).toEqual('English title');
    expect(transformed.summary).toEqual('');
    expect(transformed.fullDescription).toEqual('');
  });

  it('should work when no textual description is available', () => {
    delete description.en_US;

    const transformed = pipe.transform(description);
    expect(transformed.title).toEqual('');
    expect(transformed.summary).toEqual('');
    expect(transformed.fullDescription).toEqual('');
  });

  it('should call markForChanges when it translates a string', () => {
    spyOn(ref, 'markForCheck').and.callThrough();
    pipe.transform(description);

    expect(ref.markForCheck).toHaveBeenCalled();
  });
});
