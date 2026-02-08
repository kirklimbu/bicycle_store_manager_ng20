import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormArray, FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
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
import { IPaytype, ISupplier } from '../../../purchase/data/models/purhase.model';
import { BsDateInputDirective } from '../../../shared/directives/bsdate/bs-date-input.directive';
import { TableActionButtonsComponent } from '../../../shared/ui-common/table-action-buttons/table-action-buttons.component';
import { IOpeningFormDtoWrapper, ISelectedStockItem } from '../../data/models/opening.model';
import { OpeningService } from '../../data/services/opening-account.services';

@Component({
  selector: 'app-opening-account-form',
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
  templateUrl: './opening-account-form.html',
  styleUrl: './opening-account-form.scss',
})
export class OpeningAccountForm {
  // props
  mode = 'add';
  form!: FormGroup;
  localDetailId = -1;

  payTypeSignal = signal<IPaytype[]>([]);
  inventoryListSignal = signal<any[]>([]);
  supplierListSignal = signal<ISupplier[]>([]);
  selectedItemsListSignal = signal<any[]>([]);
  lastEditedField = signal<'disPercent' | 'discountAmt' | null>(null);

  private destroy$ = inject(DestroyRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(NonNullableFormBuilder);
  private openingService = inject(OpeningService);
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
      openingMaster: this.fb.group({
        purchaseMasterId: [0],
        billNo: [''],
        saveDate: [''],
        remarks: [''],
      }),

      selectedStockList: this.fb.array([this.createInventory()]),
    });
    // Add the first empty row to make sure UI appears
  }

  createInventory(category?: any): FormGroup {

    const selectedItem =
      category?.medicine ??
      this.inventoryListSignal().find(
        (x) => x.stockMasterId === category?.stockMasterId
      ) ??
      null;

    const qty = Number(category?.qty ?? 0);
    const rate = Number(category?.pricePerUnit ?? selectedItem?.pricePerUnit ?? 0);

    const totalAmt = +(qty * rate).toFixed(2);
    const netAmt = +(totalAmt).toFixed(2);

    return this.fb.group({
      purchaseMasterId: [category?.purchaseMasterId ?? ''],
      purchaseDetailId: [category?.purchaseDetailId ?? 0],
      supplierId: [category?.supplierId ?? ''],
      medicine: [selectedItem],
      stockMasterId: [selectedItem?.stockMasterId ?? ''],
      unit: [selectedItem?.unit ?? ''],
      unitId: [selectedItem?.unitId ?? ''],

      qty: [qty],
      pricePerUnit: [rate],

      totalAmt: [totalAmt],
      netAmt: [netAmt],
      transAmount: [netAmt],
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
    this.openingService
      .fetchDefaultForm(
        this.IdsSignal().purchaseMasterId,
      )
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe((_res: IOpeningFormDtoWrapper) => {
        if (_res) {
          console.log('patchFormValues form api', _res);
          // selectedItemsListSignal
          this.inventoryListSignal.set(_res.stockList);
          this.patchFormValues(_res.form);
          if (this.IdsSignal().purchaseMasterId > 0) {
            this.mode = 'edit';
            this.selectedItemsListSignal.set(_res.form.selectedStockList);
          }
        }
      });
  }

  patchFormValues(apiData: any) {
    this.form.patchValue({
      openingMaster: apiData.openingMaster,
    });
  }

  onValueChange(index: number): void {
    this.recalcRow(index);
  }

  onEnterKeyPress(index: number): void {
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

    this.recalcRow(index);

    // STRICT mapping to your JSON schema
    const normalized: ISelectedStockItem = {
      purchaseDetailId: rowCtrl.get('purchaseDetailId')?.value ?? 0,
      purchaseMasterId: rowCtrl.get('purchaseMasterId')?.value ?? 0,
      stockMasterId: medicine?.stockMasterId ?? 0,
      totalAmt: rowCtrl.get('totalAmt')?.value ?? 0,
      qty: rowCtrl.get('qty')?.value ?? 0,
      unitId: medicine?.unitId ?? 0,
      pricePerUnit: rowCtrl.get('pricePerUnit')?.value ?? 0,
      name: medicine?.name ?? 'Unknown',
      netAmt: rowCtrl.get('netAmt')?.value ?? 0

    };

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
    this.openingService
      .saveOpening(payload)
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

  /**
   * edit section
   */

  onEdit(row: any) {
    // edit form Array

    this.inventoryList.clear();
    this.inventoryList.push(this.createInventory(row));
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

    const formValues = row.getRawValue();
    const qty = Number(formValues.qty || 0);
    const rate = Number(formValues.pricePerUnit || 0);

    const totalAmt = +(qty * rate).toFixed(2);

    const netAmt = totalAmt;

    // Update the row with clean numbers
    row.patchValue({
      totalAmt: totalAmt,
      netAmt: netAmt,
      transAmount: netAmt
    }, { emitEvent: false });

  }
}
