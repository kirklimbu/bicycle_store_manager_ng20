import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormArray, FormGroup, ReactiveFormsModule, NonNullableFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Ng-Zorro Imports
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzCardModule } from 'ng-zorro-antd/card';

// Project Imports
import { PurchaseService } from '../data/services/purchase.services';
import { TableActionButtonsComponent } from '../../shared/ui-common/table-action-buttons/table-action-buttons.component';
import { BsDateInputDirective } from '../../shared/directives/bsdate/bs-date-input.directive';
import { IPaytype, ISupplier, IPurchaseFormDtoWrapper } from './../data/models/purhase.model';

@Component({
  selector: 'app-purchase-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, NzButtonModule, NzSpaceModule, NzFormModule,
    NzIconModule, NzInputModule, NzPageHeaderModule, NzBreadCrumbModule, NzSelectModule,
    NzTableModule, NzDividerModule, NzCardModule, TableActionButtonsComponent, BsDateInputDirective
  ],
  templateUrl: './purchase-form.component.html',
  styleUrl: './purchase-form.component.scss',
})
export class PurchaseFormComponent implements OnInit {
  // --- Signals & State ---
  mode = 'add';
  form!: FormGroup;
  isSaving = signal<boolean>(false);
  payTypeSignal = signal<IPaytype[]>([]);
  inventoryListSignal = signal<any[]>([]);
  supplierListSignal = signal<ISupplier[]>([]);
  selectedItemsListSignal = signal<any[]>([]);
  lastEditedField = signal<'disPercent' | 'discountAmt' | 'ccPercent' | 'ccAmt' | null>(null);

  private destroy$ = inject(DestroyRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(NonNullableFormBuilder);
  private purchaseService = inject(PurchaseService);
  private notification = inject(NzNotificationService);

  // --- Computed Totals (For Table Footer) ---
  totalAmountSignal = computed(() => Number(this.selectedItemsListSignal().reduce((sum, item) => sum + (item.netAmt || 0), 0).toFixed(2)));
  totalGrossSignal = computed(() => this.selectedItemsListSignal().reduce((s, i) => s + (i.totalAmt || 0), 0));
  totalCCSignal = computed(() => this.selectedItemsListSignal().reduce((s, i) => s + (i.ccAmt || 0), 0));
  totalDiscountSignal = computed(() => this.selectedItemsListSignal().reduce((s, i) => s + (i.discountAmt || 0), 0));
  totalTaxableSignal = computed(() => this.selectedItemsListSignal().reduce((s, i) => s + (i.taxableAmt || 0), 0));
  totalTaxSignal = computed(() => this.selectedItemsListSignal().reduce((s, i) => s + (i.taxAmt || 0), 0));
  totalFreeTaxSignal = computed(() => this.selectedItemsListSignal().reduce((s, i) => s + (i.freeTaxAmt || 0), 0));
  netTotalSignal = computed(() => this.selectedItemsListSignal().reduce((s, i) => s + (i.netAmt || 0), 0));

  queryParamMapSignal = toSignal(this.route.queryParamMap, { initialValue: this.route.snapshot.queryParamMap });
  IdsSignal = computed(() => ({
    supplierId: Number(this.queryParamMapSignal()?.get('supplierId')) || 0,
    purchaseMasterId: Number(this.queryParamMapSignal()?.get('purchaseMasterId')) || 0,
  }));

  ngOnInit(): void {
    this.initForm();
    this.fetchDefaultForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      purchaseMaster: this.fb.group({
        purchaseMasterId: [0], supplierId: [''], payTypeId: [''], billNo: [''],
        supplierBillNo: [''], saveDate: [''], supplierSaveDate: [''], remarks: [''],
      }),
      selectedStockList: this.fb.array([this.createInventory()]),
    });
  }

  get inventoryList(): FormArray { return this.form.get('selectedStockList') as FormArray; }

  createInventory(row?: any): FormGroup {
    const selectedItem = row?.medicine ?? this.inventoryListSignal().find(x => x.stockMasterId === row?.stockMasterId) ?? null;
    return this.fb.group({
      purchaseDetailId: [row?.purchaseDetailId ?? 0],
      medicine: [selectedItem],
      stockMasterId: [selectedItem?.stockMasterId ?? ''],
      qty: [row?.qty ?? 0],
      freeQty: [row?.freeQty ?? 0],
      pricePerUnit: [row?.pricePerUnit ?? selectedItem?.pricePerUnit ?? 0],
      ccPercent: [row?.ccPercent ?? 0],
      ccAmt: [row?.ccAmt ?? 0],
      totalAmt: [row?.totalAmt ?? 0],
      disPercent: [row?.disPercent ?? 0],
      discountAmt: [row?.discountAmt ?? 0],
      taxableAmt: [row?.taxableAmt ?? 0],
      taxRate: [selectedItem?.taxRate ?? 0],
      taxAmt: [row?.taxAmt ?? 0],
      freeTaxAmt: [row?.freeTaxAmt ?? 0],
      netAmt: [row?.netAmt ?? 0]
    });
  }

  setLastEdited(field: 'disPercent' | 'discountAmt' | 'ccPercent' | 'ccAmt') { this.lastEditedField.set(field); }

  onProductSelect(index: number): void {
    const row = this.inventoryList.at(index) as FormGroup;
    const item = row.get('medicine')?.value;
    if (item) {
      row.patchValue({ pricePerUnit: item.pricePerUnit || 0, taxRate: item.taxRate || 0, stockMasterId: item.stockMasterId });
      this.recalcRow(index);
    }
  }

  onValueChange(index: number): void { this.recalcRow(index); }

  private recalcRow(index: number): void {
    const row = this.inventoryList.at(index) as FormGroup;
    if (!row) return;
    const v = row.getRawValue();

    const qty = Number(v.qty || 0);
    const freeQty = Number(v.freeQty || 0);
    const rate = Number(v.pricePerUnit || 0);
    const taxRate = Number(v.taxRate || 0);

    const totalAmt = qty * rate;
    const ccBasis = freeQty * rate;

    let ccAmt = v.ccAmt;
    let ccPercent = v.ccPercent;
    if (this.lastEditedField() === 'ccPercent') ccAmt = (ccBasis * ccPercent) / 100;
    else if (this.lastEditedField() === 'ccAmt') ccPercent = ccBasis > 0 ? (ccAmt / ccBasis) * 100 : 0;

    let disAmt = v.discountAmt;
    let disPercent = v.disPercent;
    if (this.lastEditedField() === 'disPercent') disAmt = (totalAmt * disPercent) / 100;
    else if (this.lastEditedField() === 'discountAmt') disPercent = totalAmt > 0 ? (disAmt / totalAmt) * 100 : 0;

    const freeTaxAmt = (freeQty * rate * taxRate) / 100; // Fixed Free Tax Calculation
    const taxableAmt = totalAmt - disAmt + ccAmt;
    const taxAmt = (taxableAmt * taxRate) / 100;
    const netAmt = taxableAmt + taxAmt + freeTaxAmt;

    row.patchValue({
      totalAmt: +totalAmt.toFixed(2),
      ccPercent: +ccPercent.toFixed(2),
      ccAmt: +ccAmt.toFixed(2),
      disPercent: +disPercent.toFixed(2),
      discountAmt: +disAmt?.toFixed(2),
      freeTaxAmt: +freeTaxAmt.toFixed(2),
      taxableAmt: +taxableAmt.toFixed(2),
      taxAmt: +taxAmt.toFixed(2),
      netAmt: +netAmt.toFixed(2)
    }, { emitEvent: false });
  }

  onEnterKeyPress(index: number): void {
    const rowCtrl = this.inventoryList.at(index) as FormGroup;
    const medicine = rowCtrl.get('medicine')?.value;
    if (!medicine || rowCtrl.get('qty')?.value <= 0) {
      this.notification.warning('Warning', 'Please select item and quantity');
      return;
    }

    this.recalcRow(index);
    const data = { ...rowCtrl.getRawValue(), name: medicine.name };

    this.selectedItemsListSignal.update(items => {
      const idx = items.findIndex(x => x.stockMasterId === data.stockMasterId);
      if (idx > -1) { items[idx] = data; return [...items]; }
      return [...items, data];
    });

    this.inventoryList.clear();
    this.inventoryList.push(this.createInventory());

    // Focus back to select
    setTimeout(() => (document.querySelector('.ant-select-selection-search-input') as HTMLElement)?.focus(), 50);
  }

  onSave() {
    this.isSaving.set(true);
    const payload = { ...this.form.value, selectedStockList: this.selectedItemsListSignal() };
    this.purchaseService.savePurchase(payload).subscribe({
      next: (res: any) => {
        this.notification.success('Success', res.message);
        this.router.navigate(['/auth/purchase-master'], { queryParams: { supplierId: this.IdsSignal().supplierId } });
      },
      error: () => this.isSaving.set(false)
    });
  }

  onEdit(row: any) { this.inventoryList.clear(); this.inventoryList.push(this.createInventory(row)); }
  onDelete(id: number) { this.selectedItemsListSignal.update(list => list.filter(item => item.stockMasterId !== id)); }
  onCancel() { this.form.reset(); this.inventoryList.clear(); this.inventoryList.push(this.createInventory()); this.selectedItemsListSignal.set([]); }

  private fetchDefaultForm() {
    this.purchaseService.fetchDefaultForm(this.IdsSignal().purchaseMasterId, this.IdsSignal().supplierId)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe(res => {
        this.payTypeSignal.set(res.payTypeList);
        this.inventoryListSignal.set(res.stockList);
        this.supplierListSignal.set(res.supplierList);
        this.form.patchValue({ purchaseMaster: res.form.purchaseMaster });
        if (this.IdsSignal().purchaseMasterId > 0) {
          this.mode = 'edit';
          this.selectedItemsListSignal.set(res.form.selectedStockList);
        }
      });
  }
}