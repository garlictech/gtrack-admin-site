import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'gt-toolbar',
    templateUrl: './toolbar.component.html'
})
export class ToolbarComponent {
    @Output() openMenu = new EventEmitter();
}
