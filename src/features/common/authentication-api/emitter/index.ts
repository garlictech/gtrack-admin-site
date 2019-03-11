import { Subject } from 'rxjs';

const createName = (name: string): string => `$${name}`;
const cleanName = (name: string): string => name.replace(/^\$/, '');

export class Emitter {
  private readonly subjects: { [name: string]: Subject<any> };

  constructor() {
    this.subjects = {};
  }

  emit(name: string, data?: any): void {
    const fnName = createName(name);
    this.subjects[fnName] = this.subjects[fnName] || new Subject();
    this.subjects[fnName].next(data);
  }

  on(name: string, handler: (value: any) => void): void {
    const fnName = createName(name);
    this.subjects[fnName] = this.subjects[fnName] || new Subject();
    this.subjects[fnName].subscribe(handler);
  }

  off(name: string): void {
    const fnName = createName(name);

    if (this.subjects[fnName]) {
      this.subjects[fnName].unsubscribe();
      this.subjects[fnName] = undefined;
    }
  }

  dispose(): void {
    for (const i in this.subjects) {
      if (this.subjects[i] instanceof Subject) {
        this.off(cleanName(i));
      }
    }
  }
}
