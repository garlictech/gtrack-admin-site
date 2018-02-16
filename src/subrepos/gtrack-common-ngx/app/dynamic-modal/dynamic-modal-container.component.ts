import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { DynamicModalService } from './dynamic-modal.service';

@Component({
  selector: 'gt-dynamic-modal-container',
  template: '<div #modalContainer></div>'
})

export class DynamicModalContainerComponent implements AfterViewInit {
  @ViewChild('modalContainer') modalContainer: ElementRef;

  constructor(private _dynamicModalService: DynamicModalService) { }

  ngAfterViewInit() {
    this._dynamicModalService.registerModalContainer(this.modalContainer);
  }
}
