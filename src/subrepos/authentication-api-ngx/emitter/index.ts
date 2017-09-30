import { Subject } from 'rxjs/Subject';

export class Emitter {
  private subjects: { [name: string]: Subject<any> } = {};

  emit(name: string, data?: any) {
    let fnName = this.createName(name);
    this.subjects[fnName] = this.subjects[fnName] || new Subject();
    this.subjects[fnName].next(data);
  }

  on(name: string, handler: ((value: any) => void)) {
    let fnName = this.createName(name);
    this.subjects[fnName] = this.subjects[fnName] || new Subject();
    this.subjects[fnName].subscribe(handler);
  }

  off(name: string) {
    let fnName = this.createName(name);

    if (this.subjects[fnName]) {
      this.subjects[fnName].unsubscribe();
      delete this.subjects[fnName];
    }
  }

  dispose() {
    for (let i in this.subjects) {
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
