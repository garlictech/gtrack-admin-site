import { AfterContentInit, Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appProgressiveImageLoader]'
})
export class ProgressiveImageLoaderDirective implements AfterContentInit {
  @Input() imgDesc;

  private readonly nativeElement: HTMLElement;

  constructor(private readonly el: ElementRef, private readonly renderer: Renderer2) {
    this.nativeElement = this.el.nativeElement;
  }

  ngAfterContentInit(): void {
    this.loadLargeImage();
  }

  loadLargeImage(): void {
    this.renderer.setStyle(this.nativeElement, 'background-image', `url(${this.imgDesc.sm}`);
    const largeImage = new Image();
    largeImage.src = this.imgDesc.lg;

    largeImage.onload = () => {
      this.renderer.setStyle(this.nativeElement, 'background-image', `url(${largeImage.src}`);
    };
  }
}
