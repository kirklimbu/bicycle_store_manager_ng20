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
    // TableActionButtonsComponent,
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

  // Convert inventoryList formArray into a signal-based array
  inventoryLists = signal([] as any[]);
  // totalAmountSignal = signal(0); // ✅ Initialize with default value 0

  private destroy$ = inject(DestroyRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(NonNullableFormBuilder);
  private salesService = inject(SalesService);
  private notification = inject(NzNotificationService);

  private queryIdSignal = useQueryParamsSignal({
    masterId: (val) => Number(val) || 0,
    customerId: (val) => Number(val) || 0,
  });

  totalAmountSignal = computed(() => {
    console.log('selectedItemsListSignal', this.selectedItemsListSignal());

    return this.selectedItemsListSignal().reduce(
      (total, item) => total + (item.transAmount || 0),
      0
    );
  });

  ngOnInit(): void {
    this.initForm();
    this.fetchDefaultForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      transactionMaster: this.fb.group({
        masterId: [0],
        payTypeId: [''],
        billNo: [''],
        saveDate: [''],
        condition: [''],
        customerId: [this.queryIdSignal().customerId],
        totalAmount: [''],
        remarks: [''],
      }),

      inventoryList: this.fb.array([this.createInventory()]),
    });
    // Add the first empty row to make sure UI appears
  }

  // Helper to create a new category FormGroup
  createInventory(category?: any): FormGroup {
    const rate = category?.rate || 0;
    const qty = category?.qty || 0;
    const disPercent = category?.disPercent || 0;
    const disAmount = category?.disAmount || 0;

    // Calculate Transaction Amount
    const transAmount = rate * qty;

    return this.fb.group({
      inventoryId: [category ? category.inventoryId : 0],
      masterId: [category ? category.masterId : ''],
      unitId: [category ? category.unitId : ''],
      detailId: [category ? category.detailId : this.localDetailId--],
      qty: [category ? category.qty : ''],
      rate: [category ? category.rate : ''],
      medicine: [category ? category.medicine : ''],
      medicineId: [category ? category.medicineId : ''],
      disPercent: [disPercent],
      disAmount: [disAmount],
      transAmount: [transAmount],
      lastEdited: [''],
    });
  }

  // Get the selectedCategoryList FormArray
  get inventoryList(): FormArray {
    return this.form.get('inventoryList') as FormArray;
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
    // this.salesService
    //   .fetchSalesReturnForm(
    //     this.queryIdSignal().masterId,
    //     this.queryIdSignal().customerId
    //   )
    //   .pipe(takeUntilDestroyed(this.destroy$))
    //   .subscribe((_res: ISalesReturnFormDtoWrapper) => {
    //     if (_res) {
    //       console.log('patchFormValues form api', _res);
    //       this.conditionListSignal.update(() => _res.conditionList);
    //       this.payTypeSignal.update(() => _res.payTypeList);
    //       // selectedItemsListSignal
    //       this.inventoryListSignal.update(() => _res.inventoryList);
    //       // this.supplierListSignal.update(() => _res.supplierList)
    //       this.patchFormValues(_res.form);
    //       // for edit case
    //       console.log('masterIdSignal', this.queryIdSignal().customerId);
    //       if (this.queryIdSignal().customerId > 0) {
    //         this.mode = 'edit';
    //         this.selectedItemsListSignal.update(() => _res.form.inventoryList);
    //       }
    //     }
    // });
  }

  patchFormValues(apiData: any) {
    this.form.patchValue({
      transactionMaster: apiData.transactionMaster,
    });
  }

  // Update inventory signal whenever a change occurs
  updateInventorySignal(): void {
    this.inventoryLists.set(this.inventoryList.value);
  }

  onValueChange(index: number, editedField?: 'disPercent' | 'disAmount'): void {
    const control = this.inventoryList.at(index);
    let { rate, qty, disPercent, disAmount } = control.value;

    rate = Number(rate) || 0;
    qty = Number(qty) || 0;
    disPercent = Number(disPercent) || 0;
    disAmount = Number(disAmount) || 0;

    const baseAmount = rate * qty;

    // Store the last edited field
    control.patchValue({ lastEdited: editedField }, { emitEvent: false });

    if (editedField === 'disPercent') {
      // Recalculate disAmount
      disAmount = (baseAmount * disPercent) / 100;
    } else if (editedField === 'disAmount') {
      // Recalculate disPercent
      disPercent = baseAmount > 0 ? (disAmount / baseAmount) * 100 : 0;
    }

    // Round to 2 decimal places
    disAmount = parseFloat(disAmount.toFixed(2));
    disPercent = parseFloat(disPercent.toFixed(2));

    // Transaction amount BEFORE discount (you can subtract discount later if needed)
    const transAmount = parseFloat(baseAmount.toFixed(2));

    control.patchValue(
      {
        disAmount,
        disPercent,
        transAmount,
      },
      { emitEvent: false }
    );

    this.updateInventorySignal();
    this.calculateTotalAmount();
  }

  // ✅ Function to Calculate Total Amount
  calculateTotalAmount(): void {
    // let total = this.inventoryList.controls.reduce((sum, control) => {
    //   return sum + (control.value.transAmount || 0);
    // }, 0);
    // // Patch total amount into form
    // this.form.patchValue({
    //   transactionMaster: { totalAmount: total },
    // });
  }

  // **BUG FIX**: Add New Item on Enter Key Press
  onEnterKeyPress(index: number): void {
    // **1. Get the last entered row values**
    const lastItem = this.inventoryList.at(index)?.value;

    // **3. Update Signal with User-Entered Values**
    // this.selectedItemsListSignal.update(items => [...items, lastItem]);

    this.selectedItemsListSignal.update((items) => {
      const exists = items.some((item) => item.detailId === lastItem?.detailId);

      const patchedItem = {
        ...lastItem,
        inventoryId: lastItem.medicine?.inventoryId ?? lastItem.inventoryId,
        unitId: lastItem.medicine?.unitId ?? lastItem.unitId,
        medicineId: lastItem.medicine?.medicineId ?? lastItem.medicineId,
        medicine: lastItem.medicine?.medicine ?? lastItem.medicine,
        masterId: lastItem.medicine?.masterId ?? lastItem.masterId,
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
    const inventoryArray = this.form.get('inventoryList') as FormArray;
    // Clear existing FormArray before patching new data
    inventoryArray.clear();

    // Patch each item in the API response
    selectedList.forEach((item: any) => {
      inventoryArray.push(this.createInventory(item));
    });
  }

  onSave() {
    this.pushSelectedItemsList();
    // this.salesService.saveSalesReturn(this.form.value)
    //   .pipe(takeUntilDestroyed(this.destroy$))
    //   .subscribe((res: any) => {
    //     this.createNotification('success', res.message)
    //     this.form.reset();
    //     this.resetInventoryList();
    //     this.selectedItemsListSignal.set([]);
    //   })
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
    const inventoryList = this.form.get('inventoryList') as FormArray;
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
