import { Directive, HostBinding, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Directive({
  selector: '[gtrackSanitizeHtml]'
})
export class SanitizeHtmlDirective {
  @Input() gtrackSanitizeHtml: string;

  @HostBinding('innerHtml')
  get innerHtml(): SafeHtml {
    return this._sanitizer.bypassSecurityTrustHtml(this.gtrackSanitizeHtml);
  }

  constructor(private readonly _sanitizer: DomSanitizer) {}
}
