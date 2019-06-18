import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import Glide from '@glidejs/glide';

@Component({
  selector: 'gtrack-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit, AfterViewInit {
  glide: Glide;
  @Input() imageUrls: Array<string>;
  images: Array<{
    url: string;
  }>;
  constructor() {
    this.imageUrls = [];
    this.images = [];

    this.glide = new Glide('.multi', {
      type: 'carousel',
      perView: 3,
      gap: 3,
      peek: {
        before: 100,
        after: 100
      },
      breakpoints: {
        1200: {
          perView: 2,
          peek: {
            before: 15,
            after: 15
          }
        },
        992: {
          perView: 2,
          peek: {
            before: 15,
            after: 15
          }
        },
        768: {
          perView: 2,
          peek: {
            before: 15,
            after: 15
          }
        },
        576: {
          perView: 1,
          peek: {
            before: 15,
            after: 15
          }
        },
        414: {
          perView: 1,
          peek: {
            before: 15,
            after: 15
          }
        }
      }
    });
  }

  ngOnInit(): void {
    if (this.imageUrls.length > 0) {
      this.images = this.imageUrls
        .map(url => ({
          url
        }))
        .filter(url => !!url);
    }
  }
  ngAfterViewInit(): void {
    this.glide.mount();
  }
  trackByFn(index: number): number {
    return index;
  }
}
