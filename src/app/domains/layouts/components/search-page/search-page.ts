import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { debounceTime, Subject } from 'rxjs';
import { SearchService } from 'src/app/domains/search-result-page/data/service/search.service';
@Component({
  selector: 'lib-search-page',
  imports: [CommonModule, FormsModule, NzInputModule, NzIconModule],
  templateUrl: './search-page.html',
  styleUrl: './search-page.scss',
})
export class SearchPage {
  // router
  private productState = inject(SearchService);
  private destroyRef$ = inject(DestroyRef);
  term = '';
  private searchInput$ = new Subject<string>();

  constructor() {
    this.searchInput$
      .pipe(debounceTime(400), takeUntilDestroyed(this.destroyRef$))
      .subscribe((value) => this.productState.setQuery(value));
  }

  onTermChange(value: string) {
    this.searchInput$.next(value);
  }

  onSearch(immediate = false) {
    if (immediate) {
      this.productState.setQuery(this.term); // no debounce if user presses Enter
    } else {
      this.searchInput$.next(this.term);
    }
  }
}
