import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FilterStateService {
  private filterStates = signal<Record<string, any>>({});

  setFilter(key: string, filter: any) {
    this.filterStates.update((prev) => ({ ...prev, [key]: filter }));
    sessionStorage.setItem(key, JSON.stringify(filter));
  }

  getFilter(key: string): any | null {
    const stored = sessionStorage.getItem(key);
    return stored ? JSON.parse(stored) : this.filterStates()[key] || null;
  }

  filterSignal = this.filterStates.asReadonly();
}
