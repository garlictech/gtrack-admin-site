import { Injectable } from '@angular/core';
import { Storage } from '../storage.interface';

@Injectable()
export class MockStorageService implements Storage {
  private data = {};

  getItem(key: string): string {
    return this.data[key] || null;
  }

  setItem(key: string, value: string): void {
    this.data[key] = value;
  }

  removeItem(key: string): void {
    delete this.data[key];
  }

  clear() {
    this.data = {};
  }
}
