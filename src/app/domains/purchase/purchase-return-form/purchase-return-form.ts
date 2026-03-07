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
import { finalize } from 'rxjs';

@Component({
  selector: 'app-purchase-return-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
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
  isSaving = signal<boolean>(false);

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


  createInventory(rowData?: any): FormGroup {

    // 🔍 Identify the medicine object (Source of Truth)
    const selectedItem = rowData?.medicine ||
      this.inventoryListSignal().find(item => item.stockMasterId === rowData?.stockMasterId) ||
      null;

    return this.fb.group({
      // --- IDs & Metadata ---
      purchaseMasterId: [rowData?.purchaseMasterId ?? 0],
      purchaseDetailId: [rowData?.purchaseDetailId ?? 0],
      stockMasterId: [selectedItem?.stockMasterId ?? ''],
      medicine: [selectedItem], // 🔗 Bind for nz-select lookup

      // --- Core Inputs ---
      qty: [rowData?.qty ?? 0],
      pricePerUnit: [rowData?.pricePerUnit ?? selectedItem?.pricePerUnit ?? 0],

      // --- Rates (The "Per Unit" Multipliers) ---
      ccAmtPerUnit: [rowData?.ccAmtPerUnit ?? 0],
      discountAmtPerUnit: [rowData?.discountAmtPerUnit ?? 0],
      taxAmtPerUnit: [rowData?.taxAmtPerUnit ?? 0],
      taxableAmtPerUnit: [rowData?.taxableAmtPerUnit ?? 0],
      totalAmtPerUnit: [rowData?.totalAmtPerUnit ?? 0],
      netAmtPerUnit: [rowData?.netAmtPerUnit ?? 0],
      freeTaxAmtPerUnit: [rowData?.freeTaxAmtPerUnit ?? 0],

      // --- Calculated Totals (Visible in UI) ---
      ccAmt: [rowData?.ccAmt ?? 0],
      discountAmt: [rowData?.discountAmt ?? 0],
      taxAmt: [rowData?.taxAmt ?? 0],
      taxableAmt: [rowData?.taxableAmt ?? 0],
      totalAmt: [rowData?.totalAmt ?? 0],
      netAmt: [rowData?.netAmt ?? 0],
      freeTaxAmt: [rowData?.freeTaxAmt ?? 0],

      // --- Additional Fields ---
      disPercent: [rowData?.disPercent ?? 0],
      transAmount: [rowData?.netAmt ?? 0], // Usually matches Net Amt
    });

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
    this.isSaving.set(true);
    this.purchaseService
      .fetchPurchaseReturnForm(
        this.IdsSignal().purchaseMasterId,
        this.IdsSignal().supplierId,
        this.IdsSignal().purRetMasterId
      )
      .pipe(takeUntilDestroyed(this.destroy$),
        finalize(() => this.isSaving.set(false)))
      .subscribe((_res: any) => {
        this.isSaving.set(false);
        if (_res) {
          this.payTypeSignal.set(_res.payTypeList);
          // selectedItemsListSignal
          this.inventoryListSignal.set(_res.stockList);
          this.purchaseMasterListSignal.set(_res.purchaseMasterList);
          this.patchFormValues(_res.form);
          this.supplierNameSignal.set(
            _res.form.purchaseReturnMaster.supplierName
          );
          this.supplierNumberSignal.set(_res.form.purchaseReturnMaster.mobile);

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
      medicine: medicine, // Keep the full object reference for nz-select
      qty: rowCtrl.get('qty')?.value ?? 0,
      pricePerUnit: rowCtrl.get('pricePerUnit')?.value ?? 0,

      ccAmtPerUnit: rowCtrl.get('ccAmtPerUnit')?.value ?? 0,
      discountAmtPerUnit: rowCtrl.get('discountAmtPerUnit')?.value ?? 0,
      taxAmtPerUnit: rowCtrl.get('taxAmtPerUnit')?.value ?? 0,
      taxableAmtPerUnit: rowCtrl.get('taxableAmtPerUnit')?.value ?? 0,
      totalAmtPerUnit: rowCtrl.get('totalAmtPerUnit')?.value ?? 0,
      netAmtPerUnit: rowCtrl.get('netAmtPerUnit')?.value ?? 0,
      freeTaxAmtPerUnit: rowCtrl.get('freeTaxAmtPerUnit')?.value ?? 0,

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
    this.isSaving.set(true);

    const payload = {
      ...this.form.value,
      selectedStockList: this.selectedItemsListSignal(), // ✅ send table data
    };
    this.purchaseService
      .savePurchaseReturn(payload)
      .pipe(takeUntilDestroyed(this.destroy$),
        finalize(() => this.isSaving.set(false)))
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
    this.mode = 'edit';
    this.inventoryList.clear();
    this.inventoryList.push(this.createInventory(row));
    this.lastEditedField.set(null);
    this.recalcRow(0);
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

    const row = this.inventoryList.at(index) as FormGroup;
    if (!row) return;

    const qty = Number(row.get('qty')?.value ?? 0);
    if (qty < 0) return;

    let ccRate = Number(row.get('ccAmtPerUnit')?.value ?? 0);
    let disRate = Number(row.get('discountAmtPerUnit')?.value ?? 0);

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
