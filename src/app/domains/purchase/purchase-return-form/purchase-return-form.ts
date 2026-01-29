import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  FormArray,
  FormGroup,
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
import { BsDateInputDirective } from '../../shared/directives/bsdate/bs-date-input.directive';
import { TableActionButtonsComponent } from '../../shared/ui-common/table-action-buttons/table-action-buttons.component';
import {
  IPaytype,
  ISupplier,
} from '../data/models/purhase.model';
import { PurchaseService } from '../data/services/purchase.services';

@Component({
  selector: 'app-purchase-return-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // FormsModule,
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
    TableActionButtonsComponent,
    BsDateInputDirective,
  ],
  templateUrl: './purchase-return-form.html',
  styleUrl: './purchase-return-form.scss',
})
export class PurchaseReturnForm {
  // props
  mode = 'add';
  form!: FormGroup;
  localDetailId = -1;
  supplierNameSignal = signal<string>('');
  supplierNumberSignal = signal<string>('');

  payTypeSignal = signal<IPaytype[]>([]);
  inventoryListSignal = signal<any[]>([]);
  supplierListSignal = signal<ISupplier[]>([]);
  purchaseMasterListSignal = signal<any[]>([]);
  selectedItemsListSignal = signal<any[]>([]);
  lastEditedField = signal<'disPercent' | 'discountAmt' | null>(null);

  private destroy$ = inject(DestroyRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(NonNullableFormBuilder);
  private purchaseService = inject(PurchaseService);
  private notification = inject(NzNotificationService);

  queryParamMapSignal = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  IdsSignal = computed(() => {
    const queryParamMap = this.queryParamMapSignal();

    if (!queryParamMap) {
      return {
        supplierId: 0,
        purchaseMasterId: 0,
      };
    }

    return {
      supplierId: Number(queryParamMap.get('supplierId')) || 0,
      purchaseMasterId: Number(queryParamMap.get('purchaseMasterId')) || 0,
      purRetMasterId: Number(queryParamMap.get('purRetMasterId')) || 0,
    };
  });

  totalAmountSignal = computed(() => {
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
      purchaseReturnMaster: this.fb.group({
        purchaseMasterId: [0],
        purRetMasterId: [],
        supplierId: [''],
        supplierName: [''],
        payTypeId: [''],
        debitNoteNo: [''],
        saveDate: [''],
        remarks: [''],
        mobile: [''],
      }),

      selectedStockList: this.fb.array([this.createInventory()]),
    });
    // Add the first empty row to make sure UI appears
  }

  createInventory(category?: any): FormGroup {
    console.log('create new row purchase return', category);

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
      purchaseMasterId: [category?.purchaseMasterId ?? 0],

      medicine: [selectedItem],          // ✅ FIXED
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
    this.purchaseService
      .fetchPurchaseReturnForm(
        this.IdsSignal().purchaseMasterId,
        this.IdsSignal().supplierId,
        this.IdsSignal().purRetMasterId
      )
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe((_res: any) => {
        if (_res) {
          console.log('patchFormValues form api', _res);
          this.payTypeSignal.set(_res.payTypeList);
          // selectedItemsListSignal
          this.inventoryListSignal.set(_res.stockList);
          this.supplierListSignal.set(_res.supplierList);
          this.purchaseMasterListSignal.set(_res.purchaseMasterList);
          this.patchFormValues(_res.form);
          this.supplierNameSignal.set(
            _res.form.purchaseReturnMaster.supplierName
          );
          this.supplierNumberSignal.set(_res.form.purchaseReturnMaster.mobile);
          console.log('sdfs', this.supplierNameSignal());

          // for edit case
          // console.log('masterIdSignal', this.masterIdSignal());
          if (this.IdsSignal().purchaseMasterId > 0) {
            this.mode = 'edit';
            this.selectedItemsListSignal.set(_res.form.selectedStockList);
          }
        }
      });
  }

  patchFormValues(apiData: any) {
    this.form.patchValue({
      purchaseReturnMaster: apiData.purchaseReturnMaster,
    });
  }

  onValueChange(index: number): void {
    this.recalcRow(index);
  }

  onEnterKeyPress(index: number): void {

    event?.preventDefault();

    const rowCtrl = this.inventoryList.at(index) as FormGroup;
    if (!rowCtrl) return;

    const qty = Number(rowCtrl.get('qty')?.value ?? 0);
    const rate = Number(rowCtrl.get('pricePerUnit')?.value ?? 0);
    const medicine = rowCtrl.get('medicine')?.value;
    console.log('item purchse returnßß', medicine);

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
      purchaseMasterId: rowCtrl.get('purchaseMasterId')?.value ?? 0,
      purchaseDetailId: rowCtrl.get('purchaseDetailId')?.value ?? 0,

      stockMasterId: medicine.stockMasterId,
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
      ...this.form.value,
      selectedStockList: this.selectedItemsListSignal(), // ✅ send table data
    };
    this.purchaseService
      .savePurchaseReturn(payload)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.createNotification('success', res.message);

          this.form.reset();
          this.resetInventoryList();
          this.selectedItemsListSignal.set([]);
        },
        error: () => {
          // ❌ DO NOTHING
          // keep user data intact
        },
      });
  }

  createNotification(type: string, message: string): void {
    this.notification.create(type, message, '');
  }

  onEdit(row: any) {


    this.inventoryList.clear();
    this.inventoryList.push(this.createInventory(row));
  }

  updateInventory(index: number, row: any): void {
    const inventoryRow = this.inventoryList.at(index) as FormGroup;

    // 🔥 find SAME object reference used in nz-select
    const selectedProduct = this.inventoryListSignal().find(
      (item) => item.stockMasterId === row.stockMasterId
    );

    inventoryRow.patchValue(
      {
        purchaseDetailId: row.purchaseDetailId,
        purchaseMasterId: row.purchaseMasterId,
        supplierId: row.supplierId,

        qty: row.qty,
        pricePerUnit: row.pricePerUnit,

        selectedItem: selectedProduct, // ✅ KEY FIX
        stockMasterId: selectedProduct?.stockMasterId,
        unit: selectedProduct?.unit,
        taxRate: selectedProduct?.taxRate,
      },
      { emitEvent: false }
    );

    this.recalcRow(index);
  }

  // onProductSelected(index: number, item: any): void {
  //   const row = this.inventoryList.at(index) as FormGroup;
  //   if (!row) return;
  //   console.log('row onProductSelected', row);

  //   row.patchValue(
  //     {
  //       medicine: item,
  //       stockMasterId: item.stockMasterId,
  //       unit: item.unit,
  //       unitId: item.unitId,
  //       pricePerUnit: item.pricePerUnit ?? 0,
  //       taxRate: item.taxRate ?? 0,
  //     },
  //     { emitEvent: false } // 🔥 prevents recursion
  //   );

  //   this.recalcRow(index);
  // }onProductSelected(index: number, item: any): void {
  //   const row = this.inventoryList.at(index) as FormGroup;
  //   if (!row) return;
  //   console.log('row onProductSelected', row);

  //   row.patchValue(
  //     {
  //       medicine: item,
  //       stockMasterId: item.stockMasterId,
  //       unit: item.unit,
  //       unitId: item.unitId,
  //       pricePerUnit: item.pricePerUnit ?? 0,
  //       taxRate: item.taxRate ?? 0,
  //     },
  //     { emitEvent: false } // 🔥 prevents recursion
  //   );

  //   this.recalcRow(index);
  // }onProductSelected(index: number, item: any): void {
  //   const row = this.inventoryList.at(index) as FormGroup;
  //   if (!row) return;
  //   console.log('row onProductSelected', row);

  //   row.patchValue(
  //     {
  //       medicine: item,
  //       stockMasterId: item.stockMasterId,
  //       unit: item.unit,
  //       unitId: item.unitId,
  //       pricePerUnit: item.pricePerUnit ?? 0,
  //       taxRate: item.taxRate ?? 0,
  //     },
  //     { emitEvent: false } // 🔥 prevents recursion
  //   );

  //   this.recalcRow(index);
  // }

  onDelete(
    id: number
  ) {
    this.selectedItemsListSignal.update((list) =>
      list.filter((item) => item.purchaseDetailId !== id)
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
