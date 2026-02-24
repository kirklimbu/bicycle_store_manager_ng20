import { computed, Injectable, signal } from '@angular/core';
import { formatDate } from '@angular/common';
import { LedgerFilter } from '../../report/data/models/ledger-report.model';

@Injectable()
export class FilterStoreService {
    // The master signal holding the current filter state
    private filterState = signal<LedgerFilter>({
        fiscalId: null,
        accountId: null,
        fromDate: '',
        toDate: ''
    });

    // Read-only signal for components to consume
    readonly currentFilters = this.filterState.asReadonly();

    // A computed signal to check if any filter is active (useful for UI)
    readonly isDirty = computed(() =>
        this.filterState().fiscalId !== null || this.filterState().accountId !== null
    );

    updateFilters(newFilters: Partial<LedgerFilter>) {
        this.filterState.update(state => ({ ...state, ...newFilters }));
    }

    reset() {
        this.filterState.set({ fiscalId: null, accountId: null, fromDate: '', toDate: '' });
    }
}