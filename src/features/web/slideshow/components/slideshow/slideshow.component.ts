import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';

import { faChevronLeft, faChevronRight, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import { DebugLog } from 'app/log';

@Component({
  selector: 'gtrack-slideshow',
  templateUrl: './slideshow.component.html',
  styleUrls: ['./slideshow.component.scss']
})
export class SlideShowComponent implements OnInit, AfterViewInit {
  @Input() imageUrls: Array<string>;

  animate: boolean;

  @Input() controls: boolean;

  @Input() fullscreenGallery: boolean;

  icons: {
    left: IconDefinition;
    right: IconDefinition;
  };

  currentIndex: number;

  images: Array<{
    url: string;
    animation: string;
  }>;

  @ViewChildren('slide') slides: QueryList<ElementRef>;

  @ViewChild('slideshow') slideshow: ElementRef;

  @ViewChild('thumbnails') thumbnails: ElementRef;

  private readonly _availableAnimations: Array<string>;

  constructor(private readonly _changeDetectorRef: ChangeDetectorRef) {
    this.imageUrls = [];
    this.animate = true;
    this.controls = false;
    this.fullscreenGallery = false;
    this.icons = {
      left: faChevronLeft,
      right: faChevronRight
    };
    this.currentIndex = -1;
    this.images = [];
    this._availableAnimations = ['down-left', 'down-right', 'down', 'left', 'right', 'up-left', 'up-right', 'up'];
  }

  ngOnInit(): void {
    if (this.imageUrls.length > 0) {
      this.images = this.imageUrls
        .map(url => ({
          url,
          animation: this._getRandomAnimation()
        }))
        .filter(url => !!url);
    }

    this.currentIndex = 0;
  }

  @DebugLog onPrev(e: Event): void {
    e.preventDefault();
    const slides = this.slides.toArray();
    let prev = this.currentIndex - 1;

    if (prev < 0) {
      prev = slides.length - 1;
    }

    const prevSlide = slides[prev];

    prevSlide.nativeElement.click();
  }

  @DebugLog onNext(e: Event): void {
    e.preventDefault();
    const slides = this.slides.toArray();
    let next = this.currentIndex + 1;

    if (next > slides.length - 1) {
      next = 0;
    }

    const nextSlide = slides[next];

    nextSlide.nativeElement.click();
  }

  getZIndex(i: number): number {
    if (i - this.currentIndex >= 0) {
      return (this.images.length - i + this.currentIndex) * 10;
    }

    return (this.currentIndex - i) * 10;
  }

  animationEnd(elem: ElementRef): void {
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

  addAnimationEnd(): void {
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

  ngAfterViewInit(): void {
    if (this.fullscreenGallery) {
      if (this.slideshow) {
        lightGallery(this.slideshow.nativeElement, {
          exThumbImage: 'data-exthumbimage'
        });
      }

      if (this.thumbnails) {
        lightGallery(this.thumbnails.nativeElement, {
          exThumbImage: 'data-exthumbimage'
        });
      }
    }

    this.addAnimationEnd();

    this.slides.changes.subscribe(() => {
      this.addAnimationEnd();
    });
  }

  trackByFn(index: number): number {
    return index;
  }

  private _getRandomAnimation(): string {
    const max = this._availableAnimations.length;
    const randomIndex = Math.floor(Math.random() * max);

    return this._availableAnimations[randomIndex];
  }

  private _next(): void {
    this.currentIndex++;

    if (this.currentIndex > this.slides.length - 1) {
      this.currentIndex = 0;
    }

    this.addAnimationEnd();
    this._changeDetectorRef.markForCheck();
  }
}
