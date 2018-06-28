import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'dynamic-list',
  templateUrl: './ui.pug',
  styleUrls: ['./style.scss']
})
export class DynamicListComponent implements OnInit {
  @Input() items$: Observable<any>;
  @Input() containerClass?: Array<string>;
  @Input() itemClass?: Array<string>;
  @Input() itemTemplate: TemplateRef<any>;
  @Input() clickHandler: Function;

  isLoading$: Observable<boolean>;

  containerClassList(): Array<string> {
    return ['dynamic-list-wrapper', ...(this.containerClass ? this.containerClass : [])];
  }

  itemClassList(): Array<string> {
    return ['dynamic-list-item', ...(this.itemClass ? this.itemClass : [])];
  }

  ngOnInit() {
    this.isLoading$ = this.items$.startWith(true).map(result => !(result instanceof Array && result));
  }

  handleClick(item: any): void {
    if (this.clickHandler && typeof this.clickHandler === 'function') {
      this.clickHandler(item);
    }
  }
}
