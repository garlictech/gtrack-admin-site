import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'garlictech-dynamic-list',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss']
})
export class DynamicListComponent implements OnInit {
  @Input() items$: Observable<any>;
  @Input() containerClass?: Array<string>;
  @Input() itemClass?: Array<string>;
  @Input() itemTemplate: TemplateRef<any>;
  @Input() clickHandler: (item: any) => void;

  isLoading$: Observable<boolean>;

  trackByFn(index: number): number {
    return index;
  }

  containerClassList(): Array<string> {
    return ['dynamic-list-wrapper', ...(this.containerClass || [])];
  }

  itemClassList(): Array<string> {
    return ['dynamic-list-item', ...(this.itemClass || [])];
  }

  ngOnInit(): void {
    this.isLoading$ = this.items$.pipe(
      startWith(true),
      map(result => !(result instanceof Array && result))
    );
  }

  handleClick(item: any): void {
    if (this.clickHandler && typeof this.clickHandler === 'function') {
      this.clickHandler(item);
    }
  }
}
