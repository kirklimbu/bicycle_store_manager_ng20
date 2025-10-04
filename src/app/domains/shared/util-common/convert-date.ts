import { formatDate } from '@angular/common';

export function converterDate(
  dateString: string,
  format: string,
  locale: string,
): string {
  // Use the `toISOString` method to format the date
  const formattedDate = formatDate(dateString.toString(), format, locale);

  console.log('formattedDate', formattedDate);

  // Replace hyphens with slashes
  return formattedDate;
}
