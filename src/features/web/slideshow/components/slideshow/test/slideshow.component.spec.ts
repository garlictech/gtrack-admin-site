import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { SlideShowComponent } from '../slideshow.component';

describe('SlideshowComponent', () => {
  let component: SlideShowComponent;
  let fixture: ComponentFixture<SlideShowComponent>;
  let spy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FontAwesomeModule],
      declarations: [SlideShowComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlideShowComponent);
    component = fixture.componentInstance;

    component.imageUrls = ['http://test.com/test.jpg', 'http://test.com/test2.jpg', 'http://test.com/test3.jpg'];

    spy = jasmine.createSpy('lightGallery');
    (window as any).lightGallery = spy;
  });

  it('should be created', () => {
    fixture.detectChanges();

    const slides = fixture.nativeElement.querySelectorAll('.slide');
    expect(slides.length).toEqual(3);
  });

  it('should not create a slideshow when there is not enough image', () => {
    component.imageUrls = ['http://test.com/test.jpg'];

    fixture.detectChanges();

    const slides = fixture.nativeElement.querySelectorAll('.slide');
    expect(slides.length).toEqual(1);
    const slide = slides[0];

    expect(slide.classList.contains('slide-image-only')).toEqual(true);
  });

  it('should be working without images', () => {
    component.imageUrls = [];
    fixture.detectChanges();

    const slides = fixture.nativeElement.querySelectorAll('.slide');
    expect(slides.length).toEqual(0);
  });

  it('should create a lightGallery', () => {
    component.fullscreenGallery = true;
    fixture.detectChanges();

    const slides = fixture.nativeElement.querySelectorAll('.slide');
    expect(slides.length).toEqual(3);

    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should open the next image when onNext is clicked', async(() => {
    component.controls = true;
    fixture.detectChanges();

    const next = fixture.nativeElement.querySelector('.control-next');

    const slides = fixture.nativeElement.querySelectorAll('.slide');
    const slide = slides[1];
    const clickSpy = jasmine.createSpy('click').and.callThrough();

    slide.addEventListener('click', clickSpy);

    next.click();

    fixture.whenStable().then(() => {
      expect(clickSpy).toHaveBeenCalled();
    });
  }));

  it('should open the first image when onNext is clicked on the last element', async(() => {
    component.controls = true;
    fixture.detectChanges();

    component.currentIndex = 2;

    const next = fixture.nativeElement.querySelector('.control-next');

    const slides = fixture.nativeElement.querySelectorAll('.slide');
    const slide = slides[0];
    const clickSpy = jasmine.createSpy('click').and.callThrough();

    slide.addEventListener('click', clickSpy);

    next.click();

    fixture.whenStable().then(() => {
      expect(clickSpy).toHaveBeenCalled();
    });
  }));

  it('should open the previous image when onPrev is clicked', async(() => {
    component.controls = true;
    fixture.detectChanges();

    component.currentIndex = 2;

    const prev = fixture.nativeElement.querySelector('.control-prev');

    const slides = fixture.nativeElement.querySelectorAll('.slide');
    const slide = slides[1];
    const clickSpy = jasmine.createSpy('click').and.callThrough();

    slide.addEventListener('click', clickSpy);

    prev.click();

    fixture.whenStable().then(() => {
      expect(clickSpy).toHaveBeenCalled();
    });
  }));

  it('should open the last image when onPrev is clicked on the first image', async(() => {
    component.controls = true;
    fixture.detectChanges();

    const prev = fixture.nativeElement.querySelector('.control-prev');

    const slides = fixture.nativeElement.querySelectorAll('.slide');
    const slide = slides[2];
    const clickSpy = jasmine.createSpy('click').and.callThrough();

    slide.addEventListener('click', clickSpy);

    prev.click();

    fixture.whenStable().then(() => {
      expect(clickSpy).toHaveBeenCalled();
    });
  }));

  it('should handle z-index correctly', () => {
    fixture.detectChanges();

    const slides = Array.prototype.slice.call(fixture.nativeElement.querySelectorAll('.slide'));
    let zIndexes = slides.map(slide => parseInt(slide.style.zIndex, 10));

    expect(zIndexes).toEqual([30, 20, 10]);

    component.currentIndex = 1;
    fixture.detectChanges();

    zIndexes = slides.map(slide => parseInt(slide.style.zIndex, 10));
    expect(zIndexes).toEqual([10, 30, 20]);

    component.currentIndex = 2;

    fixture.detectChanges();

    zIndexes = slides.map(slide => parseInt(slide.style.zIndex, 10));
    expect(zIndexes).toEqual([20, 10, 30]);
  });
});
