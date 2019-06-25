import { Directive, ElementRef, Input, OnChanges, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[gtrackCardShadow]'
})
export class CardShadowDirective implements OnInit, OnChanges {
  @Input() gtrackCardShadow: string;

  constructor(private readonly _elementRef: ElementRef, private readonly _renderer: Renderer2) {}

  ngOnInit(): void {
    this._renderer.removeClass(this._elementRef.nativeElement, 'card-shadow-default');
    this._renderer.addClass(this._elementRef.nativeElement, `card-shadow-${this.gtrackCardShadow}`);
  }

  ngOnChanges(): void {
    this._renderer.addClass(this._elementRef.nativeElement, `card-shadow-${this.gtrackCardShadow}`);
  }
}
