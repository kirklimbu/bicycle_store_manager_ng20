import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormatter',
  standalone: true,
})
export class DateFormatterPipe implements PipeTransform {
  transform(value: any): string {
    if (!value) return '';

    // Handle numbers (counts, scores, etc.)
    if (typeof value === 'number') {
      if (value > 1_000_000) return (value / 1_000_000).toFixed(1) + 'M';
      if (value > 1_000) return (value / 1_000).toFixed(1) + 'K';
      return value.toString();
    }

    // Handle ISO dates or timestamps
    if (!isNaN(Date.parse(value))) {
      const date = new Date(value);

      // Check if input looks like a "date-only" string
      const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);

      if (isDateOnly) {
        // show only date
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      } else {
        // show date + time
        return date.toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      }
    }

    // Handle long text
    if (typeof value === 'string') {
      return value
        .replace(/<[^>]+>/g, '') // remove HTML tags
        .replace(/\s+/g, ' ') // normalize spaces
        .trim();
    }

    return String(value);
  }
}
