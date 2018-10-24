import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'obj2arr' })
export class ObjectToArrayPipe implements PipeTransform {
  transform(obj: Object): any {
    const keys: any[] = [];

    if (typeof obj === 'object' && Object.keys(obj).length) {
      for (const key in obj) {
        if (obj[key]) {
          const item = {
            key: key,
            value: obj[key]
          };
          keys.push(item);
        }
      }
    }

    return keys;
  }
}
