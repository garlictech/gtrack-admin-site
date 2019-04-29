import { Pipe, PipeTransform } from '@angular/core';

const difficulties = {
  1: 'beginner',
  2: 'easy',
  3: 'normal',
  4: 'hard',
  5: 'very-hard'
};

@Pipe({
  name: 'difficulty'
})
export class DifficultyPipe implements PipeTransform {
  transform(value: number): string {
    return difficulties[value] || '';
  }
}
