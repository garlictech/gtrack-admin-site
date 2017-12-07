import { Injectable } from '@angular/core';

function _window(): any {
  // Get the global window object
  return window;
}

@Injectable()
export class WindowService {
  get nativeWindow(): any {
    return _window();
  }
}
