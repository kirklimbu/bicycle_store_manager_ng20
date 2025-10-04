import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileExtensionCheck',
  standalone: true
})
export class FileExtensionCheckPipe implements PipeTransform {
  transform(fileName: string, ...allowedExtensions: string[]): boolean {
    if (!fileName) return false;


    // Extract the file extension
    const extension = fileName.split('.').pop()?.toLowerCase();

    // Check if the file extension is allowed
    return allowedExtensions.includes(extension || '');
  }

}
