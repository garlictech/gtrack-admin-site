import { Subject } from 'rxjs';

export class Emitter {
  private readonly subjects: { [name: string]: Subject<any> } = {};

  emit(name: string, data?: any) {
    const fnName = this.createName(name);
    this.subjects[fnName] = this.subjects[fnName] || new Subject();
    this.subjects[fnName].next(data);
  }

  on(name: string, handler: (value: any) => void) {
    const fnName = this.createName(name);
    this.subjects[fnName] = this.subjects[fnName] || new Subject();
    this.subjects[fnName].subscribe(handler);
  }

  off(name: string) {
    const fnName = this.createName(name);

    if (this.subjects[fnName]) {
      this.subjects[fnName].unsubscribe();
      delete this.subjects[fnName];
    }
  }

  dispose() {
    for (const i in this.subjects) {
      if (this.subjects[i] instanceof Subject) {
        this.off(this.cleanName(i));
      }
    }
  }

  private createName(name: string): string {
    return `$${name}`;
  }

  private cleanName(name: string): string {
    return name.replace(/^\$/, '');
  }
}
