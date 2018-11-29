import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  ViewChildren,
  ViewEncapsulation,
  ElementRef,
  QueryList,
  ChangeDetectorRef,
  ViewChild
} from '@angular/core';

import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import { DebugLog } from 'app/log';

@Component({
  selector: 'gtrack-slideshow',
  templateUrl: './slideshow.component.html',
  styleUrls: ['./slideshow.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SlideShowComponent implements OnInit, AfterViewInit {
  @Input()
  public imageUrls: string[] = [];

  public animate = true;

  @Input()
  public controls = false;

  @Input()
  public fullscreenGallery = false;

  private _gallery: any;
  private _thumbGallery: any;

  public icons = {
    left: faChevronLeft,
    right: faChevronRight
  };

  public currentIndex = -1;

  public images: {
    url: string;
    animation: string;
  }[] = [];

  @ViewChildren('slide')
  public slides: QueryList<ElementRef>;

  @ViewChild('slideshow')
  public slideshow: ElementRef;

  @ViewChild('thumbnails')
  public thumbnails: ElementRef;

  private _availableAnimations = ['down-left', 'down-right', 'down', 'left', 'right', 'up-left', 'up-right', 'up'];

  constructor(private _changeDetectorRef: ChangeDetectorRef) {

  }

  ngOnInit() {
    if (this.imageUrls.length > 0) {
      this.images = this.imageUrls
        .map(url => ({
          url: url,
          animation: this._getRandomAnimation()
        }))
        .filter(url => !!url);
    }

    this.currentIndex = 0;
  }

  @DebugLog
  public onPrev(e: Event) {
    e.preventDefault();
    const slides = this.slides.toArray();
    let prev = this.currentIndex - 1;

    if (prev < 0) {
      prev = slides.length - 1;
    }

    const prevSlide = slides[prev];

    prevSlide.nativeElement.click();
  }

  @DebugLog
  public onNext(e: Event) {
    e.preventDefault();
    const slides = this.slides.toArray();
    let next = this.currentIndex + 1;

    if (next > slides.length - 1) {
      next = 0;
    }

    const nextSlide = slides[next];

    nextSlide.nativeElement.click();
  }

  public getZIndex(i: number) {
    if (i - this.currentIndex >= 0) {
      return (this.images.length - i + this.currentIndex) * 10;
    }

    return (this.currentIndex - i) * 10;
  }

  public animationEnd(elem: ElementRef) {
    const transitionEnd = () => {
      const slides = this.slides.toArray();
      const last = slides[this.currentIndex];

      elem.nativeElement.removeEventListener('transitionend', transitionEnd);

      // We need this only if this is the last item
      if (last.nativeElement === elem.nativeElement) {
        this._next();
        elem.nativeElement.style.opacity = 1;
      }
    };

    elem.nativeElement.addEventListener('transitionend', transitionEnd);
    elem.nativeElement.style.opacity = 0;
  }

  public addAnimationEnd() {
    const slides = this.slides.toArray();

    if (slides && slides.length > 0) {
      const last = slides[this.currentIndex];

      const animationEnd = () => {
        this.animationEnd(last);
        last.nativeElement.removeEventListener('animationend', animationEnd);
      };

      last.nativeElement.addEventListener('animationend', animationEnd);
    }
  }

  ngAfterViewInit() {
    if (this.fullscreenGallery) {
      if (this.slideshow) {
        this._gallery = lightGallery(this.slideshow.nativeElement, {
          exThumbImage: 'data-exthumbimage'
        });
      }

      if (this.thumbnails) {
        this._thumbGallery = lightGallery(this.thumbnails.nativeElement, {
          exThumbImage: 'data-exthumbimage'
        });
      }
    }

    this.addAnimationEnd();

    this.slides.changes.subscribe(() => {
      this.addAnimationEnd();
    });
  }

  private _getRandomAnimation() {
    const max = this._availableAnimations.length;
    const randomIndex = Math.floor(Math.random() * max);

    return this._availableAnimations[randomIndex];
  }

  private _next() {
    this.currentIndex++;

    if (this.currentIndex > this.slides.length - 1) {
      this.currentIndex = 0;
    }

    this.addAnimationEnd();
    this._changeDetectorRef.markForCheck();
  }
}
