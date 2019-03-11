import { Injectable } from '@angular/core';

// Get the global window object
const _window = (): any => window;

@Injectable()
export class WindowService {
  get nativeWindow(): any {
    return _window();
  }
}
