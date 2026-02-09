import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
    selector: '[appYearMonthMask]',
    standalone: true
})
export class YearMonthMaskDirective {
    constructor(private el: ElementRef) { }

    @HostListener('input', ['$event'])
    onInput(event: Event) { // Use generic Event here
        const input = event.target as HTMLInputElement; // Cast the target instead
        if (!input) return;

        let value = input.value.replace(/\D/g, ''); // Remove all non-numeric characters

        if (value.length > 4) {
            // Format as YYYY/MM
            value = value.substring(0, 4) + '/' + value.substring(4, 6);
        }

        // Restrict to 7 characters (YYYY/MM)
        input.value = value.substring(0, 7);
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        const allowedKeys = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Delete'];

        // Allow navigation keys
        if (allowedKeys.includes(event.key)) {
            return;
        }

        // Block non-numeric keys
        if (isNaN(Number(event.key))) {
            event.preventDefault();
        }
    }
}