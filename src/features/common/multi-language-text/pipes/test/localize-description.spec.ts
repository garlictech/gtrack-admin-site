import { TestBed } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';

import 'rxjs/add/operator/take';

import { LocalizedItem, TextualDescription } from '@bit/garlictech.angular-features.common.gtrack-interfaces';

import { LocalizeDescriptionPipe } from '..';
import { DescriptionLanguageListService } from '../../services';
import { LocalizeSelectors } from '../../store';
import { of } from 'rxjs';

import _get from 'lodash-es/get';

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
  }

  const state = {
    language: 'en_US'
  };

  let description: LocalizedItem<TextualDescription>;
  let pipe: LocalizeDescriptionPipe;
  let ref: FakeChangeDetectorRef;
  let spy: jasmine.Spy;

  beforeEach(() => {
    state.language = 'en_US';

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
      providers: [
        DescriptionLanguageListService,
        {
          provide: LocalizeSelectors,
          useValue: {}
        }
      ]
    });

    const service: DescriptionLanguageListService = TestBed.get(DescriptionLanguageListService);

    spy = spyOn(service, 'getLocalizedDescription').and.callFake((item: LocalizedItem<TextualDescription>) => {
      const localized = _get(item, state.language, '');

      return of(localized);
    });

    ref = new FakeChangeDetectorRef();
    pipe = new LocalizeDescriptionPipe(ref, service);
  });

  it('should transform the description', () => {
    const transformed = pipe.transform(description);

    expect(transformed.title).toEqual('English title');
    expect(transformed.summary).toEqual('');
    expect(transformed.fullDescription).toEqual('');
    expect(spy).toHaveBeenCalled();
  });

  it('should call markForChanges when it translates a string', () => {
    spyOn(ref, 'markForCheck').and.callThrough();
    pipe.transform(description);

    expect(ref.markForCheck).toHaveBeenCalled();
  });
});
