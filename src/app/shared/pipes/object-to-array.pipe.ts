import { PipeTransform, Pipe } from '@angular/core';

@Pipe({name: 'obj2arr'})
export class ObjectToArrayPipe implements PipeTransform {
    transform(obj: Object): any {
        let keys = [];

        if (typeof obj === 'object' && Object.keys(obj).length) {
            for (let key in obj) {
                let item = {
                    key: key,
                    value: obj[key]
                };
                keys.push(item);
            }
        }

        return keys;
    }
}
