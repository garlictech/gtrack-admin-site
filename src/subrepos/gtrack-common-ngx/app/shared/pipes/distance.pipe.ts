import { Pipe, PipeTransform } from '@angular/core';
import { UnitsService } from '../services/units';

@Pipe({
  name: 'distance'
})
export class DistancePipe implements PipeTransform {

  constructor(private units: UnitsService) {}

  transform(value: number): string {
    let converted = this.units.convertDistance(value);
    return `${converted.value} ${converted.unit}`;
  }
}
