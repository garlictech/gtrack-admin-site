import { Injectable } from '@angular/core';
import { Storage } from './storage.interface';

@Injectable()
export class LocalStorage implements Storage {
  getItem(key: string): string {
    return window.localStorage.getItem(key) || '';
  }

  setItem(key: string, value: string): void {
    window.localStorage.setItem(key, value);
  }

  removeItem(key: string): void {
    window.localStorage.removeItem(key);
  }

  clear(): void {
    window.localStorage.clear();
  }
}
