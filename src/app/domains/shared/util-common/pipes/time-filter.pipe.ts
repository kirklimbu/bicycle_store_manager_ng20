import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFilter',
  standalone: true
})
export class TimeFilterPipe implements PipeTransform {


  transform(value: string): string {
    if (!value) {
      return value;
    }

    const timeParts = value.split(':');
    if (timeParts.length >= 2) {
      return `${timeParts[0]}:${timeParts[1]}`;
    }

    return value; // If the input doesn't match the expected format, return it as is
  }
}


