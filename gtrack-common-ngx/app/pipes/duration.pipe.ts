import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {
  transform(durationInMinutes: number): string {
    let duration = moment.duration(durationInMinutes, 'minutes');
    let hours = this.padLeft(duration.hours().toString(), 2, '0');
    let minutes = this.padLeft(duration.minutes().toString(), 2, '0');

    return `${hours}:${minutes}`;
  }

  private padLeft(str: string, length: number, chars: string): string {
    let padLength = length - str.length;
    let pad = '';

    for (let i = 0; i < padLength; i++) {
      pad += chars;
    }

    return `${pad}${str}`;
  }
}
