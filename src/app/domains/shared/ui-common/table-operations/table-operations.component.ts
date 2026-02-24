import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  OnInit,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
// import { NepaliDatepickerModule } from 'nepali-datepicker-angular';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';

import { NzGridModule } from 'ng-zorro-antd/grid';
import { RtcNepaliDatePickerModule } from '@rishovt/angular-nepali-datepicker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { BsDateInputDirective } from '../../directives/bsdate/bs-date-input.directive';
import { FilterValues } from 'src/app/domains/sales/data/models/sales.model';

// libs/utils/src/lib/pipes/nepali-date-formatter.pipe.ts
// project

@Component({
  selector: 'lib-table-operations',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // third-party
    NzIconModule,
    NzSpaceModule,
    NzIconModule,
    NzInputModule,
    NzPageHeaderModule,
    NzSelectModule,
    NzButtonModule,
    NzFlexModule,
    NzGridModule,
    NzFormModule,

    // RtcNepaliDatePickerModule,
    // project
    BsDateInputDirective,

    // NepaliDatepickerModule,
  ],
  templateUrl: './table-operations.component.html',
  styleUrl: './table-operations.component.scss',
})
export class TableOperationsComponent implements OnInit {
  // props

  date!: string;
  defaultFromDate = input<string>(''); // Default to empty string
  defaultToDate = input<string>('');
  label = input<string>('Search');
  placeholder = input<string>('Search...');
  searchValue = model<number>(0);
  isLocalSearch = input<boolean>(false);


  // selector 
  // Dynamic Configuration 
  // first selector
  showSelector1 = input<boolean>(false);
  selector1Label = input<string>('Select Option');
  selector1Options = input<any[]>([]);
  option1LabelKey = input<string>('name'); // Property to show in UI
  option1ValueKey = input<string>('id');   // Property to use as value
  selector1Key = input<string>('selector'); // The key sent to the API (e.g., 'payType')

  // second selector (if needed)
  showSelector2 = input<boolean>(false);
  selector2Label = input<string>('Select Option');
  selector2Options = input<any[]>([]);
  option2LabelKey = input<string>('name'); // Property to show in UI
  option2ValueKey = input<string>('id');   // Property to use as value
  selector2Key = input<string>('selector'); // The key sent to the API (e.g., 'payType')

  showFromDate = input<boolean>(false);
  showToDate = input<boolean>(false);
  showSearch = input<boolean>(false);
  showAddButton = input<boolean>(false);

  primaryButtonLabel = input<string>('Add');
  primaryButtonIcon = input<string>('plus');

  secondaryButtonIcon = input<string>('file-excel');
  showSecondaryButton = input<boolean>(false);
  secondaryButtonLabel = input<string>('Transfer');
  secondaryButtonClick = output<any>(); //make search api call

  tertiaryButtonIcon = input<string>('file-excel');
  tertiaryButtonLabel = input<string>('');
  showTertiaryButton = input<boolean>(false);

  fetchSelector1Data = input<boolean>(false); // Observable for

  // selector1 data

  selectedOption1!: any[];
  selectedCategory = model<any>({
    categoryId: 1,
    name: '',
    disabled: false,
    checked: false,
    itemId: 1,
    totalSelectedTests: 0,
    itemList: [],
  });
  // selectorOptions = signal<{ categoryId: string; name: string }[]>([]);

  // filtersChanged = output<FilterValues>();
  filters = signal<FilterValues>({});
  search = output<FilterValues>();

  // Internal form state
  searchTerm = signal<string>('');
  selectedOption = signal<string | undefined>(undefined);
  fromDate = signal<string | undefined>(undefined);
  toDate = signal<string | undefined>(undefined);

  routeTo = output<string>();
  // search = output<ICategory1Dto>(); //make search api call
  add = output<number>(); //make search api call
  showExportButton = input<boolean>(false);
  showSearchButton = input<boolean>(false);
  exportButtonIcon = input<string>('file-excel');
  exportButtonLabel = input<string>('Export Excel');
  export = output<any>();
  tertiaryButtonClick = output<any>();




  readonly showButtons = computed(
    () =>
      this.showSearch() ||
      this.showSelector1() ||
      this.showSelector2() ||
      this.showFromDate() ||
      this.showToDate() ||
      this.showAddButton() ||
      this.showExportButton() ||
      this.showSecondaryButton() ||
      this.showTertiaryButton() ||
      this.showSearchButton()
  );

  private readonly destroy$ = inject(DestroyRef);
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    search: [''],
    // selector: [''],
    fromDate: [''],
    toDate: [''],
    supplierId: [''],
  });
  constructor() {
    // This effect runs whenever the signal's value changes.
    effect(() => {
      const categoryId = this.selectedCategory();
      if (!categoryId) return;

      // this.fetchSelector1Data();
      if (this.showSelector1()) {
        this.fetchSelector1Data();
      }
    });

    effect(() => {
      const activeFilters = this.filters();
      if (Object.keys(activeFilters).length > 0) {
        console.log('Calling API with filters:', activeFilters);
      }
    });
    // 🔄 Sync inputs with the form reactively
    effect(() => {
      this.form.patchValue({
        fromDate: this.defaultFromDate(),
        toDate: this.defaultToDate()
      }, { emitEvent: false }); // Prevent infinite loops if you have valueChanges subscribers
    });
  }

  ngOnInit(): void {
    if (this.showSelector1()) {
      this.form.addControl(this.selector1Key(), this.fb.control(null));
    } if (this.showSelector2()) {
      this.form.addControl(this.selector2Key(), this.fb.control(null));
    }
  }

  getSelector1Data() {
    // const data$ = this.categoryService.getCategoryList();
    // data$.pipe(takeUntilDestroyed(this.destroy$)).subscribe((_res: any) => {
    //   console.log('_res', _res);
    //   this.selectorOptions.update(() => _res);
    // });
  }

  onNavigate(data: string) {
    // navigate to the desired page
    this.routeTo.emit(data);
  }

  onSearch() {
    console.log('searching', this.filters());

    // search api call with backend
    //  this.data$= this.categoryService.fetchCategoryItem(this.selectedOption1)
  }

  // selector1Change(id: number) {}

  onSecondaryButtonClick(id: number) {
    this.secondaryButtonClick.emit(id);
  }

  emitFilters(): void {
    const formValues = this.form.value;

    const filters: FilterValues = {};
    // Standard Filters
    if (this.showSearch() && formValues.search) filters.search = formValues.search;
    if (this.showFromDate() && formValues.fromDate) filters.fromDate = formValues.fromDate;
    if (this.showToDate() && formValues.toDate) filters.toDate = formValues.toDate;

    // Dynamic Selector Filter 🎯
    const key = this.selector1Key();
    if (this.showSelector1() && formValues[key]) {
      filters[key] = formValues[key];
    }

    const key2 = this.selector2Key();
    if (this.showSelector2() && formValues[key2]) {
      filters[key2] = formValues[key2];
    }

    this.search.emit(filters);
  }

  resetFilters(): void {
    this.form.reset();
    // this.form.patchValue({ toDate: '' });
    // this.form.patchValue({ fromDate: '' });
    // this.date = '';
    // this.emitFilters();
    console.log('reset filters', this.form.value);
  }

  updateNepaliDate($event: any, type: string): void {
    console.log('nep date', $event, type);

    type === 'toDate'
      ? this.form.patchValue({ toDate: $event })
      : this.form.patchValue({ fromDate: $event });
  }
  updateEnglishDate($event: any): void {
    console.log('updaet eng', $event);
  }

  onDateChange($event: string) {
    // console.log('date', $event);
  }
}
