import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { WindDirectionIconComponent } from '../wind-direction-icon.component';

describe('WindDirectionIconComponent', () => {
  let component: WindDirectionIconComponent;
  let fixture: ComponentFixture<WindDirectionIconComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularSvgIconModule,
        HttpClientTestingModule
      ],
      declarations: [
        WindDirectionIconComponent
      ]
    });

    fixture = TestBed.createComponent(WindDirectionIconComponent);
    component = fixture.componentInstance;
    component.deg = 45;
    component.width = 32;
    component.height = 32;

    fixture.detectChanges();
  });

  it('should be created', () => {
    const icon = fixture.nativeElement.querySelector('svg-icon');

    expect(icon.style.transform).toEqual('rotate(45deg)');
    expect(icon.style.width).toEqual('32px');
    expect(icon.style.height).toEqual('32px');
  });
});
