import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { select as d3Select } from 'd3-selection';
import { sliderLeft } from 'd3-simple-slider';

@Component({
  // tslint:disable-next-line: component-selector
  selector: '[gtrack-elevation-zoom-slider]',
  template: '',
  // tslint:disable-next-line: use-view-encapsulation
  encapsulation: ViewEncapsulation.None
})
export class ElevationZoomSliderComponent implements AfterViewInit, OnChanges {
  @Input() sliderHeight: number;
  @Input() steps: number;
  @Output() readonly zoomChange: EventEmitter<number>;

  private _slider: any;

  constructor(private readonly _element: ElementRef) {
    this.steps = 5;
    this.zoomChange = new EventEmitter<number>();
  }

  ngAfterViewInit(): void {
    this._createSlider();
  }

  ngOnChanges(): void {
    this._createSlider();
  }

  private _createSlider(): void {
    if (this._slider) {
      this._slider.remove();
    }

    const sliderFn = sliderLeft()
      .min(0)
      .max(this.steps - 1)
      .step(1)
      .ticks(this.steps)
      .tickFormat(d => `${2 ** d}x`)
      .height(this.sliderHeight)
      .default(0)
      .on('onchange', val => {
        this.zoomChange.emit(2 ** val);
      });

    const customSlider = g => {
      g.call(sliderFn);

      g.selectAll('.axis .tick line').attr('x2', -5);

      g.selectAll('.axis .tick text').attr('x', -7);

      g.selectAll('.slider .parameter-value text').attr('x', -14);
    };

    this._slider = d3Select(this._element.nativeElement)
      .append('svg:g')
      .attr('class', 'zoom-slider')
      .call(customSlider);
  }
}
