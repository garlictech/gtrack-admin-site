import { Injectable } from '@angular/core';
import { Storage } from './storage.interface';

@Injectable()
export class SessionStorage implements Storage {
  getItem(key: string): string {
    return window.sessionStorage.getItem(key) || '';
  }

  setItem(key: string, value: string): void {
    window.sessionStorage.setItem(key, value);
  }

  removeItem(key: string): void {
    window.sessionStorage.removeItem(key);
  }

  clear(): void {
    window.sessionStorage.clear();
  }
}
