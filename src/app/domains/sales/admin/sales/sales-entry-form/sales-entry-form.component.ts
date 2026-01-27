import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  FormArray,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';

// third-party
import { NzSelectModule } from 'ng-zorro-antd/select';

import { ActivatedRoute, Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';

import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
// project
import { SalesService } from '../../../data/services/sales.services';
import { DiscountField } from '../../../data/models/sales.model';
// import { ISalesFormDtoWrapper } from '../data/model/sales.model';

@Component({
  selector: 'app-sales-entry-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    // third-party
    NzButtonModule,
    NzSpaceModule,
    NzFormModule,
    NzIconModule,
    NzInputModule,
    NzPageHeaderModule,
    NzBreadCrumbModule,
    NzSelectModule,
    NzTableModule,
    NzDividerModule,
    NzInputNumberModule,

    // project
    // FormSubmitButtonsComponent,
    // TableActionButtonsComponent,
  ],
  templateUrl: './sales-entry-form.component.html',
  styleUrl: './sales-entry-form.component.scss',
})
export class SalesEntryFormComponent {
  mode = 'add';
  form!: FormGroup;
  localDetailId = -1;

  // CALCULATED FIELDS
  // totalAmountSignal = signal<number>(0);

  customerListSignal = signal<any[]>([]);
  payTypeSignal = signal<any[]>([]);
  inventoryListSignal = signal<any[]>([]);
  supplierListSignal = signal<any[]>([]);
  selectedItemsListSignal = signal<any[]>([]);
  lastEditedField = signal<'disPercent' | 'discountAmt' | null>(null);

  // Convert inventoryList formArray into a signal-based array
  inventoryLists = signal([] as any[]);
  // totalAmountSignal = signal(0); // ✅ Initialize with default value 0

  private destroy$ = inject(DestroyRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(NonNullableFormBuilder);
  private salesService = inject(SalesService);
  private notification = inject(NzNotificationService);

  queryParamMapSignal = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });
  IdsSignal = computed(() => {
    const queryParamMap = this.queryParamMapSignal();

    if (!queryParamMap) {
      return {
        customerId: 0,
        salesMasterId: 0,
      };
    }

    return {
      customerId: Number(queryParamMap.get('customerId')) || 0,
      salesMasterId: Number(queryParamMap.get('salesMasterId')) || 0,
    };
  });

  totalAmountSignal = computed(() =>
    this.selectedItemsListSignal().reduce(
      (sum, item) => sum + (item.transAmount || 0),
      0
    )
  );

  ngOnInit(): void {
    this.initForm();
    this.fetchDefaultForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      salesMaster: this.fb.group({
        salesMasterId: [0],
        payTypeId: [''],
        billNo: [''],
        saveDate: [''],
        customerId: [0],
        remarks: [''],
      }),

      selectedStockList: this.fb.array([this.createInventory()]),
    });
    // Add the first empty row to make sure UI appears
  }

  // Helper to create a new category FormGroup
  createInventory(category?: any): FormGroup {
    const qty = Number(category?.qty ?? 0);
    const rate = Number(category?.pricePerUnit ?? 0);
  
    const selectedItem = category?.selectedItem ?? category?.medicine ?? null;
    const taxRate = Number(category?.taxRate ?? selectedItem?.taxRate ?? 0);
  
    // 1️⃣ Total Amount
    const totalAmt = +(qty * rate).toFixed(2);
  
    // 2️⃣ Discount
    const disPercent = Number(category?.disPercent ?? 0);
    let discountAmt = Number(category?.discountAmt ?? 0);
  
    // If percent is provided, calculate amount
    if (disPercent > 0) {
      discountAmt = +((totalAmt * disPercent) / 100).toFixed(2);
    }
  
    // Safety: discount should never exceed total
    discountAmt = Math.min(discountAmt, totalAmt);
  
    // 3️⃣ Taxable Amount
    const taxableAmt = +(totalAmt - discountAmt).toFixed(2);
  
    // 4️⃣ Tax Amount
    const taxAmt = +((taxableAmt * taxRate) / 100).toFixed(2);
  
    // 5️⃣ Net Amount
    const netAmt = +(taxableAmt + taxAmt).toFixed(2);
  
    return this.fb.group({
      salesDetailId: [category?.purchaseDetailId ?? 0],
      supplierId: [category?.supplierId ?? ''],
  
      stockMasterId: [
        selectedItem?.stockMasterId ?? category?.stockMasterId ?? '',
      ],
      unit: [selectedItem?.unit ?? category?.unit ?? ''],
      unitId: [selectedItem?.unitId ?? category?.unitId ?? ''],
  
      qty: [qty],
      pricePerUnit: [rate],
  
      totalAmt: [totalAmt],          // ✅ FIXED
      taxRate: [taxRate],
  
      taxableAmt: [taxableAmt],      // ✅ total - discount
      taxAmt: [taxAmt],
  
      disPercent: [disPercent],
      discountAmt: [discountAmt],
  
      netAmt: [netAmt],
      transAmount: [netAmt],         // ✅ final payable
  
      medicine: [selectedItem],
    });
  }

  setLastEdited(field: 'disPercent' | 'discountAmt') {
    this.lastEditedField.set(field);
  }
  
  

  // Get the selectedCategoryList FormArray
  get inventoryList(): FormArray {
    return this.form.get('selectedStockList') as FormArray;
  }

  // Adds a new inventory entry to the inventoryList.
  addInventory(): void {
    this.inventoryList.push(this.createInventory());
  }

  // Removes an inventory entry at the given index.
  removeInventory(index: number): void {
    this.inventoryList.removeAt(index);
  }

  

  private resetInventoryList(): void {
    this.inventoryList.clear();
    this.addInventory();
  }

  private fetchDefaultForm() {
    // START FROM HERE API CALL VIA RESOURCE() api
    this.salesService
      .fetchDefaultForm(
        this.IdsSignal().customerId,
        this.IdsSignal().salesMasterId
      )
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe((_res: any) => {
        if (_res) {
          console.log('patchFormValues form api', _res);
          this.customerListSignal.update(() => _res.customerList);
          this.payTypeSignal.update(() => _res.payTypeList);
          // selectedItemsListSignal
          this.inventoryListSignal.update(() => _res.stockList);
          this.supplierListSignal.update(() => _res.supplierList);
          this.patchFormValues(_res.form);
          console.log('form', _res.form);

          // for edit case
          if (this.IdsSignal().salesMasterId > 0) {
            this.mode = 'edit';
            this.selectedItemsListSignal.update(() => _res.form.stockList);
          }
        }
      });
  }

  patchFormValues(apiData: any) {
    this.form.patchValue({
      salesMaster: apiData.salesMaster,
    });
  }

  // Update inventory signal whenever a change occurs
  updateInventorySignal(): void {
    this.inventoryLists.set(this.inventoryList.value);
  }

  onValueChange(index: number): void {
    this.recalcRow(index);
  }

  // ✅ Function to Calculate Total Amount
  calculateTotalAmount(): void {
    let total = this.inventoryList.controls.reduce((sum, control) => {
      return sum + (control.value.transAmount || 0);
    }, 0);

    // Patch total amount into form
    this.form.patchValue({
      salesMaster: { totalAmount: total },
    });
  }
  // onItemSelected(index: number, stockMasterId: any) {
  //   const selectedItem = this.inventoryListSignal().find(
  //     (x) => x.stockMasterId === stockMasterId
  //   );
  //   if (!selectedItem) return;
  
  //   const rowCtrl = this.inventoryList.at(index) as FormGroup;
  //   if (!rowCtrl) return;
  
  //   // Patch all relevant fields
  //   rowCtrl.patchValue(
  //     {
  //       medicine: selectedItem,
  //       stockMasterId: selectedItem.stockMasterId,
  //       unit: selectedItem.unit,
  //       unitId: selectedItem.unitId ?? '',
  //       pricePerUnit: selectedItem.pricePerUnit ?? 0,
  //       taxRate: selectedItem.taxRate ?? 0,
  //     },
  //     { emitEvent: false } // prevent recursion
  //   );
  
  //   // Recalculate totals, tax, net amount
  //   this.recalcRow(index);
  // }
  
  

  // **BUG FIX**: Add New Item on Enter Key Press
  onEnterKeyPress(index: number): void {
    event?.preventDefault();
  
    const rowCtrl = this.inventoryList.at(index) as FormGroup;
    if (!rowCtrl) return;
  
    // 🔁 Ensure all calculations are up-to-date
    this.recalcRow(index);
  
    const medicine = rowCtrl.get('medicine')?.value;
    if (!medicine) return;
  
    console.log('item',medicine)
    // ✅ Take all updated fields directly from FormGroup
    const normalized = {
      salesDetailId: rowCtrl.get('salesDetailId')?.value ?? 0,
  
      stockMasterId: medicine.stockMasterId,
      name: medicine.name,
      unit: medicine.unit,
  
      qty: rowCtrl.get('qty')?.value ?? 0,
      pricePerUnit: rowCtrl.get('pricePerUnit')?.value ?? 0,
  
      totalAmt: rowCtrl.get('totalAmt')?.value ?? 0,
      discountAmt: rowCtrl.get('discountAmt')?.value ?? 0,   // 🔑 fixed
      taxRate: medicine.taxRate??0,
      taxableAmt: rowCtrl.get('taxableAmt')?.value ?? 0,
      taxAmt: rowCtrl.get('taxAmt')?.value ?? 0,
  
      netAmt: rowCtrl.get('netAmt')?.value ?? 0,
      transAmount: rowCtrl.get('transAmount')?.value ?? 0,
    };
  
    // 🔁 Push/update table list
    this.selectedItemsListSignal.update((items) => {
      const exists = items.some(
        (x) => x.stockMasterId === normalized.stockMasterId
      );
  
      return exists
        ? items.map((x) =>
            x.stockMasterId === normalized.stockMasterId ? normalized : x
          )
        : [...items, normalized];
    });
  
    // 🔁 Reset the entry row
    this.resetInventoryList();
  }
  
  

  pushSelectedItemsList() {
    const selectedList = this.selectedItemsListSignal();
    const inventoryArray = this.form.get('selectedStockList') as FormArray;
    // Clear existing FormArray before patching new data
    inventoryArray.clear();

    // Patch each item in the API response
    selectedList.forEach((item: any) => {
      inventoryArray.push(this.createInventory(item));
    });
  }

  onSave() {
    this.pushSelectedItemsList();
    this.salesService
      .saveSales(this.form.value)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe((res: any) => {
        this.createNotification('success', res.message);
        this.form.reset();
        this.resetInventoryList();
        this.selectedItemsListSignal.set([]);
      });
  }

  createNotification(type: string, message: string): void {
    this.notification.create(type, message, '');
  }

  /**
   * edit section
   */

  onEdit(id: any) {
    // edit form Array
    this.updateInventory(0, id);
  }

  updateInventory(index: number, updatedData: any): void {
    this.inventoryList.at(index).patchValue(updatedData);
    this.onProductSelected(index, updatedData);
  }

  onProductSelected(index: number, item: any): void {
    const row = this.inventoryList.at(index) as FormGroup;
    if (!row) return;

    row.patchValue(
      {
        stockMasterId: item.stockMasterId,
        unit: item.unit,
        taxRate: item.taxRate ?? 0,
      },
      { emitEvent: false } // 🔥 prevents recursion
    );

    this.recalcRow(index);
  }

  onDelete(id: number) {
    this.selectedItemsListSignal.update((list) =>
      list.filter((item) => item.detailId !== id)
    );
    // Use RxJS timer to delay the notification
    // timer(500)
    //   .pipe(takeUntilDestroyed(this.destroy$))
    //   .subscribe(() => {
    //     this.createNotification('success', 'Successfully deleted.');
    //   });
  }

  onCancel() {
    this.form.reset();
    this.resetInventoryList();
    this.selectedItemsListSignal.set([]);
  }

  private recalcRow(index: number): void {
    const row = this.inventoryList.at(index) as FormGroup;
    if (!row) return;

    const qty = Number(row.get('qty')?.value ?? 0);
    const rate = Number(row.get('pricePerUnit')?.value ?? 0);
    const item = row.get('medicine')?.value;

const taxRate = Number(item?.taxRate ?? 0);
// console.log('new',item,item.get('taxRate')?.value)

    // const taxRate = Number(row.get('taxRate')?.value ?? 0);
  
    const totalAmt = +(qty * rate).toFixed(2);
  
    const disPercentCtrl = row.get('disPercent');
    const disAmountCtrl = row.get('discountAmt');
  
    let disPercent = Number(disPercentCtrl?.value ?? 0);
    let discountAmt = Number(disAmountCtrl?.value ?? 0);
  
    // 🔁 AUTO-SYNC + 🔒 DISABLE
    if (this.lastEditedField() === 'disPercent') {
      discountAmt = +((totalAmt * disPercent) / 100).toFixed(2);
      disAmountCtrl?.disable({ emitEvent: false });
      disPercentCtrl?.enable({ emitEvent: false });
    }
  
    if (this.lastEditedField() === 'discountAmt') {
      disPercent =
        totalAmt > 0 ? +((discountAmt / totalAmt) * 100).toFixed(2) : 0;
      disPercentCtrl?.disable({ emitEvent: false });
      disAmountCtrl?.enable({ emitEvent: false });
    }
  
    // 🛡 Safety
    discountAmt = Math.min(discountAmt, totalAmt);
  
    const taxableAmt = +(totalAmt - discountAmt).toFixed(2);
    const taxAmt = +((taxableAmt * taxRate) / 100).toFixed(2);
    const netAmt = +(taxableAmt + taxAmt).toFixed(2);
  console.log('new',row.value)
    row.patchValue(
      {
        totalAmt,
        disPercent,
        discountAmt,
        taxRate,
        taxableAmt,
        taxAmt,
        netAmt,
        transAmount: netAmt,
      },
      { emitEvent: false }
    );
  }
  
}
