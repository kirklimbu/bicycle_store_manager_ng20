import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { ICategory1Dto } from 'libs/sample/src/lib/data/model/sample.model';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';

import { NzGridModule } from 'ng-zorro-antd/grid';
// libs/utils/src/lib/pipes/nepali-date-formatter.pipe.ts
// project

export interface FilterValues {
  search?: string;
  selector?: {
    categoryId: number;
    name: string;
  };
  fromDate?: string;
  toDate?: string;
}

@Component({
  selector: 'app-table-operations',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
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
    // project

    // NepaliDatepickerModule,
  ],
  templateUrl: './table-operations.component.html',
  styleUrl: './table-operations.component.scss',
})
export class TableOperationsComponent {
  // props
  // date!: string;
  // searchValue = model<number>(0);
  // placeholder = input<string>('Search');
  // isLocalSearch = input<boolean>(false);
  // showSelector1 = input<boolean>(false);
  // showFromDate = input<boolean>(false);
  // showToDate = input<boolean>(false);
  // showSearch = input<boolean>(false);
  // showAddButton = input<boolean>(true);
  // primaryButtonLabel = input<string>('Add');
  // primaryButtonIcon = input<string>('plus');
  // secondaryButtonIcon = input<string>('file-excel');
  // showSecondaryButton = input<boolean>(false);
  // secondaryButtonLabel = input<string>('Transfer');
  // secondaryButtonClick = output<any>(); //make search api call
  // fetchSelector1Data = input<boolean>(false); // Observable for
  // // SELECTOR OPITONS
  // // selector1 data
  // selector1Options = input<any[]>([]);
  // selectedOption1!: any[];
  // selectedCategory = model<ICategory1Dto>({
  //   categoryId: 1,
  //   name: '',
  //   disabled: false,
  //   checked: false,
  //   itemId: 1,
  //   totalSelectedTests: 0,
  //   itemList: [],
  // });
  // selectorOptions = signal<{ categoryId: string; name: string }[]>([]);
  // // filtersChanged = output<FilterValues>();
  // filters = signal<FilterValues>({});
  // search = output<FilterValues>();
  // // Internal form state
  // searchTerm = signal<string>('');
  // selectedOption = signal<string | undefined>(undefined);
  // fromDate = signal<string | undefined>(undefined);
  // toDate = signal<string | undefined>(undefined);
  // routeTo = output<string>();
  // // search = output<ICategory1Dto>(); //make search api call
  // add = output<number>(); //make search api call
  // showExportButton = input<boolean>(false);
  // exportButtonIcon = input<string>('file-excel');
  // exportButtonLabel = input<string>('Export Excel');
  // export = output<any>();
  // readonly showButtons = computed(
  //   () =>
  //     this.showSearch() ||
  //     this.showSelector1() ||
  //     this.showFromDate() ||
  //     this.showToDate() ||
  //     this.showExportButton()
  // );
  // readonly categoryService = inject(CategoryService);
  // private readonly destroy$ = inject(DestroyRef);
  // private fb = inject(FormBuilder);
  // form: FormGroup = this.fb.group({
  //   search: [''],
  //   selector: [''],
  //   fromDate: [''],
  //   toDate: [''],
  // });
  // constructor() {
  //   // This effect runs whenever the signal's value changes.
  //   effect(() => {
  //     const categoryId = this.selectedCategory();
  //     if (!categoryId) return;
  //     // this.fetchSelector1Data();
  //     if (this.showSelector1()) {
  //       this.fetchSelector1Data();
  //     }
  //   });
  //   effect(() => {
  //     const activeFilters = this.filters();
  //     if (Object.keys(activeFilters).length > 0) {
  //       console.log('Calling API with filters:', activeFilters);
  //     }
  //   });
  // }
  // ngOnInit(): void {
  //   if (this.showSelector1()) {
  //     console.log(this.fetchSelector1Data());
  //     // const callAPI = this.fetchSelector1Data();
  //     // if (callAPI) {
  //     //   this.getSelector1Data();
  //     // } else {
  //     //   this.selectorOptions.update(() => this.manualSelectorOptions);
  //     // }
  //   }
  // }
  // getSelector1Data() {
  //   // const data$ = this.categoryService.getCategoryList();
  //   // data$.pipe(takeUntilDestroyed(this.destroy$)).subscribe((_res: any) => {
  //   //   console.log('_res', _res);
  //   //   this.selectorOptions.update(() => _res);
  //   // });
  // }
  // onNavigate(data: string) {
  //   // navigate to the desired page
  //   this.routeTo.emit(data);
  // }
  // onSearch() {
  //   console.log('searching', this.filters());
  //   // search api call with backend
  //   //  this.data$= this.categoryService.fetchCategoryItem(this.selectedOption1)
  // }
  // // selector1Change(id: number) {}
  // onSecondaryButtonClick(id: number) {
  //   this.secondaryButtonClick.emit(id);
  // }
  // emitFilters(): void {
  //   const formValues = this.form.value;
  //   console.log('form values', formValues);
  //   const filters: FilterValues = {};
  //   if (this.showSearch() && formValues.search) {
  //     filters.search = formValues.search;
  //   }
  //   // const shouldProcessSelector = this.showSelector1() && formValues.selector;
  //   // if (!shouldProcessSelector) return;
  //   // if (this.isLocalSearch){
  //   //   return;
  //   // }else{
  //   //   filters.selector = formValues.selector;
  //   // }
  //   if (this.showSelector1() && formValues.selector) {
  //     filters.selector = formValues.selector;
  //   }
  //   if (this.showFromDate() && formValues.fromDate) {
  //     filters.fromDate = formValues.fromDate;
  //   }
  //   if (this.showToDate() && formValues.toDate) {
  //     filters.toDate = formValues.toDate;
  //   }
  //   this.search.emit(filters);
  // }
  // resetFilters(): void {
  //   this.form.reset();
  //   // this.form.patchValue({ toDate: '' });
  //   // this.form.patchValue({ fromDate: '' });
  //   // this.date = '';
  //   // this.emitFilters();
  //   console.log('reset filters', this.form.value);
  // }
  // updateNepaliDate($event: any, type: string): void {
  //   console.log('nep date', $event, type);
  //   type === 'toDate'
  //     ? this.form.patchValue({ toDate: $event })
  //     : this.form.patchValue({ fromDate: $event });
  // }
  // updateEnglishDate($event: any): void {
  //   console.log('updaet eng', $event);
  // }
  // onDateChange($event: string) {
  //   // console.log('date', $event);
  // }
}
