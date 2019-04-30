import { Pipe, PipeTransform } from '@angular/core';
import { UnitsService } from '@bit/garlictech.angular-features.common.units';

@Pipe({
  name: 'distance'
})
export class DistancePipe implements PipeTransform {
  constructor(private readonly units: UnitsService) {}

  transform(value: number): string {
    const converted = this.units.convertDistance(value);

    return `${converted.value} ${converted.unit}`;
  }
}
