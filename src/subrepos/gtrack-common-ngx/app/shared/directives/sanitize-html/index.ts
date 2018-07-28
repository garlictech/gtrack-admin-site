import { Directive, Input, HostBinding } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Directive({
  selector: '[gtrackSanitizeHtml]'
})
export class SanitizeHtmlDirective {
  @Input() public gtrackSanitizeHtml: string;

  @HostBinding('innerHtml')
  public get innerHtml(): SafeHtml {
    return this._sanitizer.bypassSecurityTrustHtml(this.gtrackSanitizeHtml);
  }

  constructor(private _sanitizer: DomSanitizer) {
    /* EMPTY */
  }
}
