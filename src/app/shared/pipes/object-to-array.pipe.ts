import { PipeTransform, Pipe } from '@angular/core';

@Pipe({name: 'obj2arr'})
export class ObjectToArrayPipe implements PipeTransform {
    transform(value, args: string[]): any {
        let keys = [];

        for (let key in value) {
            let obj = {
                key: key,
                value: value[key]
            };
            keys.push(obj);
        }

        return keys;
    }
}
