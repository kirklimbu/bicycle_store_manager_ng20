import { Injectable } from '@angular/core';
// Import the necessary date functions (if applicable)
// import { NepaliFunctions } from 'angular-nepali-datepicker'; // Uncomment if using this library

@Injectable({
  providedIn: 'root'
})
export class NepaliDateConverterService {

  constructor() {}

  // Append leading zeroes to numbers less than 10
  private appendLeadingZeroes(n: number): string {
    return n <= 9 ? '0' + n : n.toString();
  }

  // Get the current Nepali (BS) date
  getCurrentDateBS(): string {
    return ''
    // return this.getStringFromNepaliFunction(NepaliFunctions.GetCurrentBsDate());
  }

  // Get the current AD date
  getCurrentDateAD(): string {
    return ''

    // return this.getStringFromNepaliFunction(NepaliFunctions.GetCurrentAdDate());
  }

  // Add or subtract months from the current AD date
  getBeforeAfterMonthDateAD(month: number): string {
    let date = new Date();
    date = new Date(date.setMonth(date.getMonth() + month));
    return this.getStringFromDate(date);
  }

  // Add or subtract months from the current BS date
  getBeforeAfterMonthDateBS(month: number): string {
    return this.adToBs(this.getBeforeAfterMonthDateAD(month));
  }

  // Add or subtract days from the current AD date
  getBeforeAfterDayDateAD(day: number): string {
    let date = new Date();
    date = new Date(date.setDate(date.getDate() + day));
    return this.getStringFromDate(date);
  }

  // Add or subtract days from the current BS date
  getBeforeAfterDayDateBS(day: number): string {
    return this.adToBs(this.getBeforeAfterDayDateAD(day));
  }

  // Convert AD date string to BS date string
  adToBs(dateStringAd: string): string {
    return ''

    // return this.getStringFromNepaliFunction(
      // NepaliFunctions.AD2BS(this.getNepaliFunctionDateObject(dateStringAd)),
    // );
  }

  // Convert a JavaScript Date object to a formatted string (YYYY/MM/DD)
  private getStringFromDate(date: Date): string {
    return `${date.getFullYear()}/${this.appendLeadingZeroes(date.getMonth() + 1)}/${this.appendLeadingZeroes(date.getDate())}`;
  }

  // Convert a NepaliFunction object to a formatted string (YYYY/MM/DD)
  private getStringFromNepaliFunction(nepaliFunctionObject: { year: string; month: any; day: any; }): string {
    return `${nepaliFunctionObject.year}/${this.appendLeadingZeroes(nepaliFunctionObject.month)}/${this.appendLeadingZeroes(nepaliFunctionObject.day)}`;
  }

  // Convert a date string to a NepaliFunctions date object
  private getNepaliFunctionDateObject(dateString: string) {
    return ''

    // return NepaliFunctions.ConvertToDateObject(dateString, 'YYYY/MM/DD');
  }

  // Convert a DatePicker object to a string
  getStringFromDatePicker(datePickerObject: { year: string; month: number; day: any; }): string {
    return `${datePickerObject.year}/${this.appendLeadingZeroes(datePickerObject.month + 1)}/${this.appendLeadingZeroes(datePickerObject.day)}`;
  }

  // Format a date string properly
  getFormattedDateString(date: any): string | undefined {
    if (date) {
      const fromDateFormatter = (date: { year: any; month: number; day: any; }) =>
        `${date.year}/${date.month + 1}/${date.day}`;

      let fromDate = fromDateFormatter(date);
      let splitedDate = fromDate.split('/');
      let month = splitedDate[1];
      let finalDate = splitedDate[0];

      // finalDate = (+month < 10) ? `${finalDate}/${this.appendLeadingZeroes(month)}` : `${finalDate}/${month}`;
      let day = splitedDate[2];
      // finalDate = (+day < 10) ? `${finalDate}/${this.appendLeadingZeroes(day)}` : `${finalDate}/${day}`;

      return finalDate;
    }
    return undefined;
  }
}