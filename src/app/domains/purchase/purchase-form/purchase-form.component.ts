import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
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
import {
  IPaytype,
  IPurchaseFormDtoWrapper,
  ISupplier,
} from './../data/models/purhase.model';

// third-party
import { NzSelectModule } from 'ng-zorro-antd/select';

import { ActivatedRoute, Router } from '@angular/router';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { PurchaseService } from '../data/services/purchase.services';
import { TableActionButtonsComponent } from '../../shared/ui-common/table-action-buttons/table-action-buttons.component';
import { BsDateInputDirective } from '../../shared/directives/bsdate/bs-date-input.directive';

@Component({
  selector: 'app-purchase-form',

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

  templateUrl: './purchase-form.component.html',
  styleUrl: './purchase-form.component.scss',
})
export class PurchaseFormComponent implements OnInit {
  // props
  mode = 'add';
  form!: FormGroup;
  localDetailId = -1;

  payTypeSignal = signal<IPaytype[]>([]);
  inventoryListSignal = signal<any[]>([]);
  supplierListSignal = signal<ISupplier[]>([]);
  selectedItemsListSignal = signal<any[]>([]);

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
    };
  });

  totalAmountSignal = computed(() => {
    console.log('selectedItemsListSignal', this.selectedItemsListSignal());

    return this.selectedItemsListSignal().reduce(
      (total, item) => total + (item.netAmt || 0),
      0
    );
  });

  ngOnInit(): void {
    this.initForm();
    this.fetchDefaultForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      purchaseMaster: this.fb.group({
        purchaseMasterId: [0],
        supplierId: [''],
        payTypeId: [''],
        billNo: [''],
        supplierBillNo: [''],
        saveDate: [''],
        supplierSaveDate: [''],
        remarks: [''],
      }),

      selectedStockList: this.fb.array([this.createInventory()]),
    });
    // Add the first empty row to make sure UI appears
  }

  createInventory(category?: any): FormGroup {
    const qty = Number(category?.qty ?? 0);
    const rate = Number(category?.pricePerUnit ?? 0);

    // accept both api shapes: category.selectedItem or category (if already merged)
    const selectedItem = category?.selectedItem ?? null;
    const taxRate = Number(category?.taxRate ?? selectedItem?.taxRate ?? 0);

    const taxableAmt = +(qty * rate).toFixed(2);
    const taxAmt = +((taxableAmt * taxRate) / 100).toFixed(2);
    const netAmt = +(taxableAmt + taxAmt).toFixed(2);

    return this.fb.group({
      purchaseMasterId: [category?.purchaseMasterId ?? ''],
      purchaseDetailId: [category?.purchaseDetailId ?? 0],
      supplierId: [category?.supplierId ?? ''],

      stockMasterId: [
        selectedItem?.stockMasterId ?? category?.stockMasterId ?? '',
      ],
      unit: [selectedItem?.unit ?? category?.unit ?? ''],

      qty: [category?.qty ?? 1],
      pricePerUnit: [category?.pricePerUnit ?? 0],

      taxRate: [taxRate],
      taxableAmt: [taxableAmt],
      taxAmt: [taxAmt],
      netAmt: [netAmt],

      detailId: [category?.detailId ?? this.localDetailId--],
      selectedItem: [selectedItem],
    });
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
      .fetchDefaultForm(
        this.IdsSignal().purchaseMasterId,
        this.IdsSignal().supplierId
      )
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe((_res: IPurchaseFormDtoWrapper) => {
        if (_res) {
          console.log('patchFormValues form api', _res);
          this.payTypeSignal.set(_res.payTypeList);
          // selectedItemsListSignal
          this.inventoryListSignal.set(_res.stockList);
          this.supplierListSignal.set(_res.supplierList);
          this.patchFormValues(_res.form);

          // for edit case
          // console.log('masterIdSignal', this.masterIdSignal());
          if (this.IdsSignal().purchaseMasterId > 0) {
            this.mode = 'edit';
            this.selectedItemsListSignal.set(_res.form.stockList);
          }
        }
      });
  }

  patchFormValues(apiData: any) {
    this.form.patchValue({
      purchaseMaster: apiData.purchaseMaster,
    });
  }

  onValueChange(index: number): void {
    this.recalcRow(index);
  }

  onEnterKeyPress(index: number): void {
    // ensure latest math is patched
    this.recalcRow(index);

    const row = this.inventoryList.at(index)?.value;
    if (!row?.selectedItem) return;

    const normalized = {
      ...row,
      stockMasterId: row.selectedItem?.stockMasterId ?? row.stockMasterId,
      unit: row.selectedItem?.unit ?? row.unit,
      taxRate: row.selectedItem?.taxRate ?? row.taxRate,
    };

    this.selectedItemsListSignal.update((items) => {
      const exists = items.some((x) => x.detailId === normalized.detailId);
      return exists
        ? items.map((x) =>
            x.detailId === normalized.detailId ? normalized : x
          )
        : [...items, normalized];
    });

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
    this.purchaseService
      .savePurchase(this.form.value)
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
    // this.patchMedicineValue(index, updatedData);
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

    // taxRate can come from the selected item, or the row
    const selectedItem = row.get('selectedItem')?.value as any;
    const taxRate = Number(
      selectedItem?.taxRate ?? row.get('taxRate')?.value ?? 0
    );

    const taxableAmt = +(qty * rate).toFixed(2);
    const taxAmt = +((taxableAmt * taxRate) / 100).toFixed(2);
    const netAmt = +(taxableAmt + taxAmt).toFixed(2);

    row.patchValue(
      {
        taxRate,
        taxableAmt,
        taxAmt,
        netAmt,
      },
      { emitEvent: false }
    );
  }
}
