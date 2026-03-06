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
  lastEditedField = signal<'disPercent' | 'discountAmt' | 'ccAmt' | 'qty' | null>(null);

  private destroy$ = inject(DestroyRef);
  private fb = inject(NonNullableFormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private purchaseService = inject(PurchaseService);
  private notification = inject(NzNotificationService);


  purchaseMasterListSignal = signal<any[]>([]);
  selectedItemsListSignal = signal<any[]>([]);
  inventoryListSignal = signal<any[]>([]);
  payTypeSignal = signal<IPaytype[]>([]);
  supplierListSignal = signal<ISupplier[]>([]);
  supplierNameSignal = signal<string>('');
  supplierNumberSignal = signal<string>('');

  // --- 1. Computed Totals for Footer (Always Sync) ---
  netTotalSignal = computed(() => {
    return this.selectedItemsListSignal().reduce((sum, item) => sum + (item.netAmt || 0), 0);
  });
  // --- Computed Totals (For Table Footer) ---
  totalAmountSignal = computed(() => Number(this.selectedItemsListSignal().reduce((sum, item) => sum + (item.netAmt || 0), 0).toFixed(2)));
  totalGrossSignal = computed(() => this.selectedItemsListSignal().reduce((s, i) => s + (i.totalAmt || 0), 0));
  totalCCSignal = computed(() => this.selectedItemsListSignal().reduce((s, i) => s + (i.ccAmt || 0), 0));
  totalDiscountSignal = computed(() => this.selectedItemsListSignal().reduce((s, i) => s + (i.discountAmt || 0), 0));
  totalTaxableSignal = computed(() => this.selectedItemsListSignal().reduce((s, i) => s + (i.taxableAmt || 0), 0));
  totalTaxSignal = computed(() => this.selectedItemsListSignal().reduce((s, i) => s + (i.taxAmt || 0), 0));
  totalFreeTaxSignal = computed(() => this.selectedItemsListSignal().reduce((s, i) => s + (i.freeTaxAmt || 0), 0));

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

  // totalAmountSignal = computed(() => {
  //   const total = this.selectedItemsListSignal().reduce(
  //     (sum, item) => sum + (Number(item.netAmt) || 0),
  //     0
  //   );

  //   // round to 2 decimal places
  //   return Math.round(total * 100) / 100;
  // });

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

  // createInventory(category?: any): FormGroup {
  //   console.log('create new row purchase return', category);

  //   const selectedItem =
  //     category?.medicine ??
  //     this.inventoryListSignal().find(
  //       (x) => x.stockMasterId === category?.stockMasterId
  //     ) ??
  //     null;

  //   const qty = Number(category?.qty ?? 0);
  //   const rate = Number(category?.pricePerUnit ?? selectedItem?.pricePerUnit ?? 0);
  //   const taxRate = Number(selectedItem?.taxRate ?? category?.taxRate ?? 0);

  //   const totalAmt = +(qty * rate).toFixed(2);

  //   const disPercent = Number(category?.disPercent ?? 0);
  //   let discountAmt = Number(category?.discountAmt ?? 0);

  //   if (disPercent > 0) {
  //     discountAmt = +((totalAmt * disPercent) / 100).toFixed(2);
  //   }

  //   discountAmt = Math.min(discountAmt, totalAmt);

  //   const taxableAmt = +(totalAmt - discountAmt).toFixed(2);
  //   const taxAmt = +((taxableAmt * taxRate) / 100).toFixed(2);
  //   const netAmt = +(taxableAmt + taxAmt).toFixed(2);

  //   return this.fb.group({
  //     purchaseMasterId: [category?.purchaseMasterId ?? 0],

  //     medicine: [selectedItem],          // ✅ FIXED
  //     stockMasterId: [selectedItem?.stockMasterId ?? ''],
  //     unit: [selectedItem?.unit ?? ''],
  //     unitId: [selectedItem?.unitId ?? ''],

  //     qty: [qty],
  //     pricePerUnit: [rate],
  //     totalAmt: [totalAmt],
  //     disPercent: [disPercent],
  //     discountAmt: [discountAmt],

  //     taxableAmt: [taxableAmt],
  //     taxRate: [taxRate],
  //     taxAmt: [taxAmt],

  //     netAmt: [netAmt],
  //     transAmount: [netAmt],
  //   });
  // }

  createInventory(rowData?: any): FormGroup {
    // const selectedItem = row?.medicine ?? this.inventoryListSignal().find(x => x.stockMasterId === row?.stockMasterId) ?? null;
    // console.log('item', selectedItem?.tradeCommissionRate);

    // return this.fb.group({
    //   purchaseMasterId: [row?.purchaseMasterId ?? 0],
    //   purchaseDetailId: [row?.purchaseDetailId ?? 0],
    //   medicine: [selectedItem],
    //   stockMasterId: [selectedItem?.stockMasterId ?? ''],
    //   qty: [row?.qty ?? 0],
    //   freeQty: [row?.freeQty ?? 0],
    //   pricePerUnit: [row?.pricePerUnit ?? selectedItem?.pricePerUnit ?? 0],
    //   // ccPercent: [row?.ccPercent ?? 0],
    //   ccAmt: [row?.ccAmt ?? 0],
    //   totalAmt: [row?.totalAmt ?? 0],
    //   // disPercent: [row?.disPercent ?? 0],
    //   discountAmt: [row?.discountAmt ?? 0],
    //   taxableAmt: [row?.taxableAmt ?? 0],
    //   taxRate: [selectedItem?.taxRate ?? 0],
    //   freeTaxRate: [selectedItem?.freeTaxRate ?? 0],
    //   taxAmt: [row?.taxAmt ?? 0],
    //   freeTaxAmt: [row?.freeTaxAmt ?? 0],
    //   // tradeCommissionRate: [row?.tradeCommissionRate ?? 0],
    //   netAmt: [row?.netAmt ?? 0]
    // });

    const selectedItem = rowData?.medicine ||
      this.inventoryListSignal().find(item => item.stockMasterId === rowData?.stockMasterId) || null;

    return this.fb.group({
      purchaseMasterId: [rowData?.purchaseMasterId ?? 0],
      purchaseDetailId: [rowData?.purchaseDetailId ?? 0],
      medicine: [selectedItem], // Object reference for nz-select
      stockMasterId: [selectedItem?.stockMasterId ?? ''],
      qty: [rowData?.qty ?? 0],
      pricePerUnit: [rowData?.pricePerUnit ?? selectedItem?.pricePerUnit ?? 0],
      ccAmt: [rowData?.ccAmt ?? 0],
      ccAmtPerUnit: [rowData?.ccAmtPerUnit ?? selectedItem?.ccAmtPerUnit ?? 0],
      discountAmt: [rowData?.discountAmt ?? 0],
      discountAmtPerUnit: [rowData?.discountAmtPerUnit ?? selectedItem?.discountAmtPerUnit ?? 0],
      freeTaxAmt: [rowData?.freeTaxAmt ?? 0],
      freeTaxAmtPerUnit: [rowData?.freeTaxAmtPerUnit ?? selectedItem?.freeTaxAmtPerUnit ?? 0],
      taxAmt: [rowData?.taxAmt ?? 0],
      taxAmtPerUnit: [rowData?.taxAmtPerUnit ?? selectedItem?.taxAmtPerUnit ?? 0],
      taxableAmt: [rowData?.taxableAmt ?? 0],
      taxableAmtPerUnit: [rowData?.taxableAmtPerUnit ?? selectedItem?.taxableAmtPerUnit ?? 0],
      totalAmt: [rowData?.totalAmt ?? 0],
      totalAmtPerUnit: [rowData?.totalAmtPerUnit ?? selectedItem?.totalAmtPerUnit ?? 0],
      netAmt: [rowData?.netAmt ?? 0],
      netAmtPerUnit: [rowData?.netAmtPerUnit ?? selectedItem?.netAmtPerUnit ?? 0],
    });
  }

  onProductSelect(index: number): void {
    const row = this.inventoryList.at(index) as FormGroup;
    const item = row.get('medicine')?.value;
    console.log('item selected', item);
    // const serverValue = item.ccPercent ?? 0;
    // this.defaultCCPercent.set(serverValue);
    if (item) {
      row.patchValue({ pricePerUnit: item.pricePerUnit || 0, taxRate: item.taxRate || 0, freeTaxRate: item.freeTaxRate || 0, tradeCommissionRate: item.tradeCommissionRate || 0, ccAmt: item.ccAmt || 0, stockMasterId: item.stockMasterId });
      this.recalcRow(index);
    }
  }

  setLastEdited(field: 'disPercent' | 'discountAmt' | 'ccAmt') { this.lastEditedField.set(field); }

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
    // this.lastEditedField.set(field);
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
      ccAmt: rowCtrl.get('ccAmt')?.value ?? 0,
      freeTaxAmt: rowCtrl.get('freeTaxAmt')?.value ?? 0,

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


    // this.inventoryList.clear();
    // this.inventoryList.push(this.createInventory(row));

    this.mode = 'edit';
    this.inventoryList.clear();
    const editRow = this.createInventory(row);
    this.inventoryList.push(editRow);

    // Crucial: Set the last edited to null so it uses existing rates
    this.lastEditedField.set(null);
    this.recalcRow(0);
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
    //   // START FROM HERE
    //   const row = this.inventoryList.at(index) as FormGroup;
    //   if (!row) return;

    //   const qty = Number(row.get('qty')?.value ?? 0);
    //   const rate = Number(row.get('pricePerUnit')?.value ?? 0);
    //   const item = row.get('medicine')?.value;

    //   const taxRate = Number(item?.taxRate ?? row.get('taxRate')?.value ?? 0);
    //   const totalAmt = +(qty * rate).toFixed(2);

    //   let disPercent = Number(row.get('disPercent')?.value ?? 0);
    //   let discountAmt = Number(row.get('discountAmt')?.value ?? 0);

    //   if (this.lastEditedField() === 'disPercent') {
    //     discountAmt = +((totalAmt * disPercent) / 100).toFixed(2);
    //   }

    //   if (this.lastEditedField() === 'discountAmt') {
    //     disPercent = totalAmt > 0 ? +((discountAmt / totalAmt) * 100).toFixed(2) : 0;
    //   }

    //   discountAmt = Math.min(discountAmt, totalAmt);

    //   const taxableAmt = +(totalAmt - discountAmt).toFixed(2);
    //   const taxAmt = +((taxableAmt * taxRate) / 100).toFixed(2);
    //   const netAmt = +(taxableAmt + taxAmt).toFixed(2);

    //   row.patchValue(
    //     {
    //       totalAmt,
    //       disPercent,
    //       discountAmt,
    //       taxableAmt,
    //       taxRate,
    //       taxAmt,
    //       netAmt,
    //       transAmount: netAmt,
    //     },
    //     { emitEvent: false }
    //   );


    const row = this.inventoryList.at(index) as FormGroup;
    if (!row) return;

    const qty = Number(row.get('qty')?.value ?? 0);
    if (qty < 0) return;

    // A. Capture Per Unit Rates (Server provided or Reverse Calculated)
    let ccRate = Number(row.get('ccAmtPerUnit')?.value ?? 0);
    let disRate = Number(row.get('discountAmtPerUnit')?.value ?? 0);

    // B. Handle Manual Overrides (If user edited a "Total" field)
    // if (this.lastEditedField() === 'ccAmt') {
    //   const ccAmt = Number(row.get('ccAmt')?.value ?? 0);
    //   ccRate = qty > 0 ? ccAmt / qty : 0;
    // } else 
    // if (this.lastEditedField() === 'discountAmt') {
    //   const disAmt = Number(row.get('discountAmt')?.value ?? 0);
    //   disRate = qty > 0 ? disAmt / qty : 0;
    // }

    // C. Apply Formulas from your notes 📝 (Total = Qty * PerUnit)
    const totalRate = Number(row.get('totalAmtPerUnit')?.value ?? 0);
    const taxRate = Number(row.get('taxAmtPerUnit')?.value ?? 0);
    const taxableRate = Number(row.get('taxableAmtPerUnit')?.value ?? 0);
    const netRate = Number(row.get('netAmtPerUnit')?.value ?? 0);
    const freeTaxRate = Number(row.get('freeTaxAmtPerUnit')?.value ?? 0);

    row.patchValue({
      ccAmtPerUnit: ccRate,
      discountAmtPerUnit: disRate,
      ccAmt: +(qty * ccRate).toFixed(2),
      discountAmt: +(qty * disRate).toFixed(2),
      freeTaxAmt: +(qty * freeTaxRate).toFixed(2),
      taxAmt: +(qty * taxRate).toFixed(2),
      taxableAmt: +(qty * taxableRate).toFixed(2),
      totalAmt: +(qty * totalRate).toFixed(2),
      netAmt: +(qty * netRate).toFixed(2),
    }, { emitEvent: false });

  }
}
