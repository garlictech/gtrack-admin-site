import _orderBy from 'lodash-es/orderBy';

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {
  transform(array: Array<any>, orderFields: Array<string>, directions: Array<boolean | 'asc' | 'desc'>): Array<string> {
    return _orderBy(array, orderFields, directions);
  }
}
