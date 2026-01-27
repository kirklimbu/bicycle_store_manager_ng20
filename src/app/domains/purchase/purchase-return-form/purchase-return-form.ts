import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ReactiveFormsModule,
  FormGroup,
  NonNullableFormBuilder,
  FormArray,
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
  IPurchaseFormDtoWrapper,
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
        payTypeId: [''],
        debitNoteNo: [''],
        saveDate: [''],
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
    this.recalcRow(index);

    const row = this.inventoryList.at(index)?.value;
    if (!row?.stockMasterId) return;
    console.log('selecedItem', row.selectedItem);

    const selectedItem = row.selectedItem ?? {
      stockMasterId: row.stockMasterId,
      name: row['name'] ?? '', // store name here if selectedItem is null
      unit: row.unit ?? '',
      taxRate: row.taxRate ?? 0,
    };

    const normalized = {
      ...row,
      purchaseMasterId:
        row.purchaseMasterId || this.IdsSignal().purchaseMasterId,
      supplierId: row.supplierId || this.IdsSignal().supplierId,
      unit: selectedItem.unit,
      taxRate: selectedItem.taxRate,
      name: selectedItem.name, // store name for table display
    };

    this.selectedItemsListSignal.update((items) => {
      const exists = items.some(
        (x) => x.purchaseDetailId === normalized.purchaseDetailId
      );
      return exists
        ? items.map((x) =>
            x.purchaseDetailId === normalized.purchaseDetailId ? normalized : x
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
    console.log('form values', this.form.value);

    this.pushSelectedItemsList();
    this.purchaseService
      .savePurchaseReturn(this.form.value)
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
    // this.selectedItemsListSignal.update((list) =>
    //   list.filter((item) => item.purchaseDetailId !== id.purchaseDetailId)
    // );
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

  onProductSelected(index: number, item: any): void {
    const row = this.inventoryList.at(index) as FormGroup;
    if (!row) return;
    console.log('row onProductSelected', row);

    row.patchValue(
      {
        stockMasterId: item.stockMasterId,
        unit: item.unit,
        taxRate: item.taxRate ?? 0,
        name: item.name,
      },
      { emitEvent: false } // 🔥 prevents recursion
    );

    this.recalcRow(index);
  }

  /*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Delete a selected item from the purchase return list
   * @param id purchase detail id of the item to delete
   */
  /*******  c350b747-c35d-4b4a-bc97-73771a459a9c  *******/ onDelete(
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
