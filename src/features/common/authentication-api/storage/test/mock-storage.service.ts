import { Injectable } from '@angular/core';
import { Storage } from '../storage.interface';

@Injectable()
export class MockStorageService implements Storage {
  private data = {};

  public getItem(key: string): string {
    return this.data[key] || null;
  }

  public setItem(key: string, value: string): void {
    this.data[key] = value;
  }

  public removeItem(key: string): void {
    delete this.data[key];
  }

  public clear() {
    this.data = {};
  }
}
