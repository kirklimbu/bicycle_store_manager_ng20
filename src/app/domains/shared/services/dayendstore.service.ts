import { computed, inject, Injectable } from '@angular/core';
import { formatDate } from '@angular/common';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { DayendService } from '../../dayend/data/services/dayend.service';
import { IDayend2Dto, IDayendDto } from '../../dayend/data/model/dayend';
@Injectable({ providedIn: 'root' })
export class DayendStore {
    private dayendService = inject(DayendService);

    // rxResource is perfect for fetching initial state into a Signal
    // readonly dayendResource = rxResource<IDayend2Dto, {}>({
    //     stream: () => this.dayendService.getCurrentDayend(),
    // });
    readonly dayendData = toSignal(this.dayendService.getCurrentDayend());


    // A computed signal for easy access to the current date string
    readonly currentBusinessDate = computed(() =>
        this.dayendData()?.saveDate ?? ''
    );

    // Helper to calculate "30 Days Ago" or "Last Month"
    getInitialRange() {
        const today = this.currentBusinessDate();
        if (!today) return { from: '', to: '' };

        // logic to subtract 30 days from your B.S. date
        const thirtyDaysAgo = this.calculatePastBsDate(today, 30);
        return { from: thirtyDaysAgo, to: today };
    }

    calculatePastBsDate(bsDate: string, daysToSubtract: number): string {
        // 1. Split "2082/11/11" into [2082, 11, 11]
        const [year, month, day] = bsDate.split('/').map(Number);

        // Let's try the simplest version: moving back exactly 1 month
        let newYear = year;
        let newMonth = month - 1;
        let newDay = day;

        // Handle the Year Change
        if (newMonth === 0) {
            newMonth = 12;
            newYear = year - 1;
        }

        // Formatting back to YYYY/MM/DD
        return `${newYear}/${String(newMonth).padStart(2, '0')}/${String(newDay).padStart(2, '0')}`;
    }
}