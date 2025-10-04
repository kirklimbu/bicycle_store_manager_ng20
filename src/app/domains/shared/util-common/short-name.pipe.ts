import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortName',
  standalone: true
})
export class ShortNamePipe implements PipeTransform {

  transform(fullName: string, ...args: unknown[]): string {
    // console.log(fullName);

    if (!fullName) {
      return fullName;
    }

    return fullName
      .split(" ")
      .map(n => n[0])
      .join("")
  }

}
