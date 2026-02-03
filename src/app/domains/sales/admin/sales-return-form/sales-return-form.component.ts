import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import {
  FormArray,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { useQueryParamsSignal } from 'src/app/domains/shared/util-common/router/use-query-params-signal';
import { SalesService } from '../../data/services/sales.services';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ISalesReturnFormDtoWrapper } from '../../data/models/sales.model';
import { TableActionButtonsComponent } from '../../../shared/ui-common/table-action-buttons/table-action-buttons.component';

@Component({
  selector: 'app-sales-return-form',
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
    TableActionButtonsComponent,
  ],
  templateUrl: './sales-return-form.component.html',
  styleUrl: './sales-return-form.component.scss',
})
export class SalesReturnFormComponent {
  mode = 'add';
  form!: FormGroup;
  localDetailId = -1;

  // CALCULATED FIELDS
  // totalAmountSignal = signal<number>(0);

  conditionListSignal = signal<string[]>([]);
  payTypeSignal = signal<any[]>([]);
  inventoryListSignal = signal<any[]>([]);
  supplierListSignal = signal<any[]>([]);
  selectedItemsListSignal = signal<any[]>([]);
  lastEditedField = signal<'disPercent' | 'discountAmt' | null>(null);
  customerNameSignal = signal<string>('');
  customerNumberSignal = signal<string>('');
  // Convert inventoryList formArray into a signal-based array
  inventoryLists = signal([] as any[]);
  // totalAmountSignal = signal(0); // ✅ Initialize with default value 0

  private destroy$ = inject(DestroyRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(NonNullableFormBuilder);
  private salesService = inject(SalesService);
  private notification = inject(NzNotificationService);

  private queryParamMapSignal = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  IdsSignal = computed(() => {
    const queryParamMap = this.queryParamMapSignal();

    if (!queryParamMap) {
      return {
        salesRetMasterId: 0,
        salesMasterId: 0,
        customerId: 0,
      };
    }

    return {
      salesRetMasterId: Number(queryParamMap.get('salesRetMasterId')) || 0,
      salesMasterId: Number(queryParamMap.get('salesMasterId')) || 0,
      customerId: Number(queryParamMap.get('customerId')) || 0,
    };
  });

  totalAmountSignal = computed(() => {

    // return this.selectedItemsListSignal().reduce(
    //   (total, item) => total + (item.transAmount || 0),
    //   0
    // );
    const total = this.selectedItemsListSignal().reduce(
      (sum, item) => sum + (Number(item.netAmt) || 0),
      0
    );

    // round to 2 decimal places
    return Math.round(total * 100) / 100;
  });

  ngOnInit(): void {
    this.initForm();
    this.fetchDefaultForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      salesReturnMaster: this.fb.group({
        salesRetMasterId: [0],
        saveDate: [''],
        remarks: [''],
        payTypeId: [''],
        salesMasterId: [''],
        customerId: [0],
      }),

      selectedStockList: this.fb.array([this.createInventory()]),
    });
    // Add the first empty row to make sure UI appears
  }

  // Helper to create a new category FormGroup
  createInventory(category?: any): FormGroup {
    console.log('create new row', category);

    const selectedItem =
      category?.medicine ??
      this.inventoryListSignal().find(
        (x) => x.stockMasterId === category?.stockMasterId
      ) ??
      null;

    const qty = Number(category?.qty ?? 0);
    const rate = Number(category?.pricePerUnit ?? selectedItem?.pricePerUnit ?? 0);
    const taxRate = Number(selectedItem?.taxRate ?? category?.taxRate ?? 0);

    const totalAmt = +(qty * rate).toFixed(2);

    const disPercent = Number(category?.disPercent ?? 0);
    let discountAmt = Number(category?.discountAmt ?? 0);

    if (disPercent > 0) {
      discountAmt = +((totalAmt * disPercent) / 100).toFixed(2);
    }

    discountAmt = Math.min(discountAmt, totalAmt);

    const taxableAmt = +(totalAmt - discountAmt).toFixed(2);
    const taxAmt = +((taxableAmt * taxRate) / 100).toFixed(2);
    const netAmt = +(taxableAmt + taxAmt).toFixed(2);

    return this.fb.group({
      salesDetailId: [category?.salesDetailId ?? 0],

      medicine: [selectedItem],          // ✅ FIXED
      salesMasterId: [selectedItem?.salesMasterId ?? ''],
      customerId: [selectedItem?.customerId ?? ''],
      stockMasterId: [selectedItem?.stockMasterId ?? ''],
      unit: [selectedItem?.unit ?? ''],
      unitId: [selectedItem?.unitId ?? ''],

      qty: [qty],
      pricePerUnit: [rate],
      totalAmt: [totalAmt],
      disPercent: [disPercent],
      discountAmt: [discountAmt],

      taxableAmt: [taxableAmt],
      taxRate: [taxRate],
      taxAmt: [taxAmt],

      netAmt: [netAmt],
      transAmount: [netAmt],
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
      .fetchSalesReturnForm(
        this.IdsSignal().salesMasterId,
        this.IdsSignal().salesRetMasterId,
        this.IdsSignal().customerId,
      )
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe((_res: ISalesReturnFormDtoWrapper) => {
        if (_res) {
          console.log('patchFormValues form api', _res);
          this.customerNameSignal.set(
            _res.form.salesReturnMaster.customerName
          );
          this.customerNumberSignal.set(_res.form.salesReturnMaster.mobile);

          this.payTypeSignal.update(() => _res.payTypeList);
          // selectedItemsListSignal
          this.inventoryListSignal.update(() => _res.stockList);
          // this.supplierListSignal.update(() => _res.supplierList)
          this.patchFormValues(_res.form);
          // for edit case
          console.log('masterIdSignal', this.IdsSignal().salesMasterId);
          if (this.IdsSignal().salesMasterId > 0) {
            this.mode = 'edit';
            this.selectedItemsListSignal.set(_res.form.selectedStockList);
          }
        }
      });
  }

  patchFormValues(apiData: any) {
    this.form.patchValue({
      salesReturnMaster: apiData.salesReturnMaster,
    });
  }

  // Update inventory signal whenever a change occurs
  // updateInventorySignal(): void {
  //   this.inventoryLists.set(this.inventoryList.value);
  // }

  onValueChange(index: number): void {
    this.recalcRow(index);
  }

  // ✅ Function to Calculate Total Amount
  // calculateTotalAmount(): void {
  //   let total = this.inventoryList.controls.reduce((sum, control) => {
  //     return sum + (control.value.transAmount || 0);
  //   }, 0);

  //   // Patch total amount into form
  //   this.form.patchValue({
  //     salesMaster: { totalAmount: total },
  //   });
  // }

  // **BUG FIX**: Add New Item on Enter Key Press
  onEnterKeyPress(index: number): void {
    event?.preventDefault();
    // START FROM HERE ==>
    const rowCtrl = this.inventoryList.at(index) as FormGroup;
    if (!rowCtrl) return;

    const qty = Number(rowCtrl.get('qty')?.value ?? 0);
    const rate = Number(rowCtrl.get('pricePerUnit')?.value ?? 0);
    const medicine = rowCtrl.get('medicine')?.value;
    console.log('item', medicine);
    // here is the issue ==> some details are missing
    if (!medicine || qty <= 0 || rate <= 0) {
      this.createNotification(
        'warning',
        'Please select item, quantity and rate'
      );
      return;
    }

    // 🔁 Ensure all calculations are up-to-date
    this.recalcRow(index);

    // ✅ Take all updated fields directly from FormGroup
    const normalized = {
      salesDetailId: rowCtrl.get('salesDetailId')?.value ?? 0,

      stockMasterId: medicine.stockMasterId,
      salesMasterId: medicine.salesMasterId,
      customerId: medicine.customerId,
      name: medicine.name,
      unit: medicine.unit,

      qty: rowCtrl.get('qty')?.value ?? 0,
      pricePerUnit: rowCtrl.get('pricePerUnit')?.value ?? 0,

      totalAmt: rowCtrl.get('totalAmt')?.value ?? 0,
      disPercent: rowCtrl.get('disPercent')?.value ?? 0,   // 🔑 fixed
      discountAmt: rowCtrl.get('discountAmt')?.value ?? 0,   // 🔑 fixed
      taxRate: medicine.taxRate ?? 0,
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


  onSave() {
    const payload = {
      salesReturnMaster: this.form.value.salesReturnMaster,
      selectedStockList: this.selectedItemsListSignal(), // ✅ REAL DATA
    };

    this.salesService
      .saveSalesReturn(payload)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.createNotification('success', res.message);

          this.form.reset();
          this.resetInventoryList();
          this.selectedItemsListSignal.set([]);
        },
        error: () => {
          // keep user data intact
        },
      });
  }



  createNotification(type: string, message: string): void {
    this.notification.create(type, message, '');
  }

  /**
   * edit section
   */

  onEdit(row: any) {
    console.log('eidt row', row);

    // edit form Array
    this.inventoryList.clear();
    this.inventoryList.push(this.createInventory(row));
  }

  updateInventory(index: number, row: any): void {
    const inventoryRow = this.inventoryList.at(index) as FormGroup;
    const selectedProduct = this.inventoryListSignal().find(
      (item) => item.stockMasterId === row.stockMasterId
    );

    inventoryRow.patchValue(
      {
        salesDetailId: row.salesDetailId,
        salesMasterId: row.salesMasterId,
        customerId: row.customerId,
        stockMasterId: selectedProduct?.stockMasterId,

        // totalAmt: row.totalAmt,
        // discountAmt: row.discountAmt,
        // taxableAmt: row.taxableAmt,
        // taxAmt: row.taxAmt,
        // netAmt: row.netAmt,
        // qty: row.qty,
        // unitId: row.unitId,
        // name: row.name,
        // pricePerUnit: row.pricePerUnit,

        // selectedItem: selectedProduct, // ✅ KEY FIX
        // unit: selectedProduct?.unit,
        // taxRate: selectedProduct?.taxRate,
        qty: row.qty,
        pricePerUnit: row.pricePerUnit,

        selectedItem: selectedProduct, // ✅ KEY FIX
        unit: selectedProduct?.unit,
        taxRate: selectedProduct?.taxRate,
      },
      { emitEvent: false }
    );

    this.recalcRow(index);
  }



  onDelete(id: number) {
    this.selectedItemsListSignal.update((list) =>
      list.filter((item) => item.stockMasterId !== id)
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

    const taxRate = Number(item?.taxRate ?? row.get('taxRate')?.value ?? 0);
    const totalAmt = +(qty * rate).toFixed(2);

    let disPercent = Number(row.get('disPercent')?.value ?? 0);
    let discountAmt = Number(row.get('discountAmt')?.value ?? 0);

    if (this.lastEditedField() === 'disPercent') {
      discountAmt = +((totalAmt * disPercent) / 100).toFixed(2);
    }

    if (this.lastEditedField() === 'discountAmt') {
      disPercent = totalAmt > 0 ? +((discountAmt / totalAmt) * 100).toFixed(2) : 0;
    }

    discountAmt = Math.min(discountAmt, totalAmt);

    const taxableAmt = +(totalAmt - discountAmt).toFixed(2);
    const taxAmt = +((taxableAmt * taxRate) / 100).toFixed(2);
    const netAmt = +(taxableAmt + taxAmt).toFixed(2);

    row.patchValue(
      {
        totalAmt,
        disPercent,
        discountAmt,
        taxableAmt,
        taxRate,
        taxAmt,
        netAmt,
        transAmount: netAmt,
      },
      { emitEvent: false }
    );
  }
}
