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
    TableActionButtonsComponent,
    BsDateInputDirective,
  ],

  templateUrl: './purchase-form.component.html',
  styleUrl: './purchase-form.component.scss',
})
export class PurchaseFormComponent {
  mode = 'add';
  form!: FormGroup;
  localDetailId = -1;

  // CALCULATED FIELDS
  // totalAmountSignal = signal<number>(0);

  payTypeSignal = signal<IPaytype[]>([]);
  inventoryListSignal = signal<any[]>([]);
  supplierListSignal = signal<ISupplier[]>([]);
  selectedItemsListSignal = signal<any[]>([]);

  // Convert inventoryList formArray into a signal-based array
  inventoryLists = signal([] as any[]);
  // totalAmountSignal = signal(0); // ✅ Initialize with default value 0

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

  // Helper to create a new category FormGroup
  createInventory(category?: any): FormGroup {
    console.log('createInventory', category);

    const rate = category?.pricePerUnit || 0;
    const qty = category?.qty || 0;
    // const disPercent = category?.disPercent || 0;
    // const disAmount = category?.disAmount || 0;

    // Calculate Transaction Amount
    const taxableAmt = rate * qty;
    const tax = category?.taxRate || 0; // default to 0 if tax is falsy
    const taxAmt = taxableAmt + tax;
    const netAmt = taxableAmt + taxAmt;

    console.log('taxableAmt', taxableAmt);
    console.log('taxAmt', taxAmt);
    console.log('netAmt', netAmt);

    return this.fb.group({
      purchaseMasterId: [category ? category.purchaseMasterId : ''],
      purchaseDetailId: [category ? category.purchaseDetailId : 0],
      supplierId: [category ? category.supplierId : ''],
      stockMasterId: [category ? category.selectedItem.stockMasterId : ''],
      totalAmt: [],
      discountAmt: [],
      taxableAmt: [taxableAmt],
      taxAmt: [taxAmt],
      netAmt: [netAmt],
      qty: [category ? category.qty : ''],
      unit: [category ? category.unit : ''],
      taxRate: [category ? category.taxRate : 0],
      detailId: [category ? category.detailId : this.localDetailId--],
      pricePerUnit: [category ? category.pricePerUnit : ''],
      selectedItem: [category ? category.selectedItem : ''],
      // disPercent: [disPercent],
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
      .fetchDefaultForm(this.IdsSignal().purchaseMasterId, this.IdsSignal().supplierId)
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

  // Update inventory signal whenever a change occurs
  updateInventorySignal(): void {
    this.inventoryLists.set(this.inventoryList.value);
  }

  onValueChange(index: number, editedField?: 'taxPercent' | 'disAmount'): void {
    const control = this.inventoryList.at(index);
    let { pricePerUnit, qty, taxRate, taxableAmt } = control.value;
    // let { pricePerUnit, qty, disPercent, disAmount } = control.value;

    console.log('On Value Change', control.value);

    pricePerUnit = Number(pricePerUnit) || 0;
    qty = Number(qty) || 0;
    taxRate = Number(taxRate) || 0;
    taxableAmt = Number(taxableAmt) || 0;
    // disPercent = Number(disPercent) || 0;
    // disAmount = Number(disAmount) || 0;

    const baseAmount = pricePerUnit * qty;

    // Store the last edited field
    control.patchValue({ lastEdited: editedField }, { emitEvent: false });

    // if (editedField === 'taxPercent') {
    //   // Recalculate disAmount
    //   disAmount = (baseAmount * disPercent) / 100;
    // } else if (editedField === 'disAmount') {
    //   // Recalculate disPercent
    //   disPercent = baseAmount > 0 ? (disAmount / baseAmount) * 100 : 0;
    // }

    // Round to 2 decimal places
    // disAmount = parseFloat(disAmount.toFixed(2));
    // disPercent = parseFloat(disPercent.toFixed(2));

    // Transaction amount BEFORE discount (you can subtract discount later if needed)
    const netAmt = parseFloat(baseAmount.toFixed(2));
    control.patchValue(
      {
        // disAmount,
        // disPercent,
        netAmt,
        taxRate,
        taxableAmt,
      },
      { emitEvent: false }
    );

    this.updateInventorySignal();
    this.calculateTotalAmount();
  }

  // ✅ Function to Calculate Total Amount
  calculateTotalAmount(): void {
    const total = this.inventoryList.controls.reduce((sum, control) => {
      return sum + (control.value.transAmount || 0);
    }, 0);

    // Patch total amount into form
    this.form.patchValue({
      purchaseMaster: { totalAmt: total },
    });
  }

  // **BUG FIX**: Add New Item on Enter Key Press
  onEnterKeyPress(index: number): void {
    // **1. Get the last entered row values**
    const lastItem = this.inventoryList.at(index)?.value;

    // **3. Update Signal with User-Entered Values**
    // this.selectedItemsListSignal.update(items => [...items, lastItem]);

    this.selectedItemsListSignal.update((items) => {
      console.log('lastItem', lastItem);

      const exists = items.some((item) => item.detailId === lastItem?.detailId);

      const patchedItem = {
        ...lastItem,
        inventoryId: lastItem.medicine?.inventoryId ?? lastItem.inventoryId,
        // unitId: lastItem.medicine?.unitId ?? lastItem.unitId,
        unit: lastItem.medicine?.unit ?? lastItem.unit,
        medicineId: lastItem.medicine?.medicineId ?? lastItem.medicineId,
        name: lastItem.medicine?.name ?? lastItem.name,
        stockMasterId:
          lastItem.medicine?.stockMasterId ?? lastItem.stockMasterId,
      };

      if (exists) {
        // Update existing item
        return items.map((item) =>
          item.detailId === lastItem?.detailId
            ? { ...item, ...patchedItem }
            : item
        );
      } else {
        // Add a new item with transformed values
        return [...items, patchedItem];
      }
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
    this.patchMedicineValue(index, updatedData);
  }

  patchMedicineValue(index: number, selectedItem: any) {
    const inventoryList = this.form.get('selectedStockList') as FormArray;
    if (!inventoryList || !inventoryList.at(index)) return;

    // Find the exact reference from inventoryListSignal()
    const matchedItem =
      this.inventoryListSignal().find(
        (item) => item.inventoryId === selectedItem.inventoryId
      ) || selectedItem;

    // Get the current value from the form
    const currentValue = inventoryList.at(index).get('medicine')?.value;

    // ✅ Prevent unnecessary patching to avoid infinite loop
    if (currentValue !== matchedItem) {
      inventoryList.at(index).patchValue({ medicine: matchedItem });
    }
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
}
