import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  ViewChildren,
  ViewEncapsulation,
  ElementRef,
  QueryList
} from '@angular/core';

import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

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

  private _availableAnimations = ['down-left', 'down-right', 'down', 'left', 'right', 'up-left', 'up-right', 'up'];

  private _getRandomAnimation() {
    const max = this._availableAnimations.length;
    const randomIndex = Math.floor(Math.random() * max);

    return this._availableAnimations[randomIndex];
  }

  ngOnInit() {
    if (this.imageUrls.length > 0) {
      this.images = this.imageUrls
        .map(url => ({
          url: url,
          animation: this._getRandomAnimation()
        }))
        .reverse();
    }

    this.currentIndex = this.imageUrls.length - 1;
  }

  public next() {
    const image = this.images.splice(-1, 1);

    if (!image[0]) {
      return;
    }

    image[0].animation = this._getRandomAnimation();

    this.images.unshift(image[0]);
  }

  public onNext(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this.animate = false;
    this.next();
  }

  public onPrev(e: Event) {
    e.preventDefault();
    e.stopPropagation();

    const image = this.images.splice(0, 1);

    this.animate = false;

    if (!image[0]) {
      return;
    }

    image[0].animation = this._getRandomAnimation();

    this.images.push(image[0]);
  }

  public animationEnd(elem: ElementRef) {
    const transitionEnd = () => {
      const slides = this.slides.toArray();
      const last = slides[slides.length - 1];

      elem.nativeElement.removeEventListener('transitionend', transitionEnd);

      // We need this only if this is the last item
      if (last.nativeElement === elem.nativeElement) {
        this.next();
        elem.nativeElement.style.opacity = 1;
      }
    };

    elem.nativeElement.addEventListener('transitionend', transitionEnd);
    elem.nativeElement.style.opacity = 0;
  }

  public addAnimationEnd() {
    const slides = this.slides.toArray();

    if (slides && slides.length > 0) {
      const last = slides[slides.length - 1];

      const animationEnd = () => {
        this.animationEnd(last);
        last.nativeElement.removeEventListener('animationend', animationEnd);
      };

      last.nativeElement.addEventListener('animationend', animationEnd);
    }
  }

  ngAfterViewInit() {
    this.addAnimationEnd();

    this.slides.changes.subscribe(() => {
      this.addAnimationEnd();
    });
  }
}
