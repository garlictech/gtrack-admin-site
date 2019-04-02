import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

const padLeft = (str: string, length: number, chars: string): string => {
  const padLength = length - str.length;
  let pad = '';

  for (let i = 0; i < padLength; i++) {
    pad += chars;
  }

  return `${pad}${str}`;
};

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {
  transform(durationInMinutes: number): string {
    const duration = moment.duration(durationInMinutes, 'minutes');
    const hours = padLeft(duration.hours().toString(), 2, '0');
    const minutes = padLeft(duration.minutes().toString(), 2, '0');

    return `${hours}:${minutes}`;
  }
}
