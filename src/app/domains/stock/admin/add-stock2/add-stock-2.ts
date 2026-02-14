import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { ICompany } from '../../../company/data/model/company.model';
import { ICategory } from '../../../home/data/model/home.model';
import { IProduct } from '../../../product';
import { ICustomResponse } from '../../../shared/models/CustomResponse.model';
import { IStockForm2DtoWrapper, IUnit } from '../../data/model/stock';
import { StockService } from '../../data/services/stock.service';
import { YearMonthMaskDirective } from '../../../shared/directives/yearMonthMask/year-month-mask.directive';
const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
@Component({
  selector: 'app-add-stock-2',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NzButtonModule,
    NzFormModule,
    NzIconModule,
    NzInputModule,
    NzPageHeaderModule,
    NzBreadCrumbModule,
    NzSelectModule,
    NzTableModule,
    NzDividerModule,
    NzInputNumberModule,
    NzRadioModule,
    NzSwitchModule,
    NzSpaceModule,
    NzCardModule,
    NzBadgeModule,
    NzUploadModule,
    NzFormModule,
    // project
    YearMonthMaskDirective
  ],
  templateUrl: './add-stock-2.html',
  styleUrl: './add-stock-2.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddStock2 {
  // props
  // form!: FormGroup;
  // mode = 'add';
  // loading = false;
  // fileList: any[] = [];
  // previewVisible = false;
  // avatarUrl: string | undefined;
  // previewImage: string | undefined = '';

  // productListSignal = signal<IProduct[]>([]);
  // unitListSignal = signal<IUnit[]>([]);
  // categoryListSignal = signal<ICategory[]>([]);
  // companyListSignal = signal<ICompany[]>([]);

  // private readonly stockService = inject(StockService);
  // private notification = inject(NzNotificationService);
  // private readonly destroy$ = inject(DestroyRef);
  // private readonly fb = inject(FormBuilder);
  // private route = inject(ActivatedRoute);
  // private router = inject(Router);

  // queryParamMapSignal = toSignal(this.route.queryParamMap, {
  //   initialValue: this.route.snapshot.queryParamMap,
  // });

  // idsSignal = computed(() => ({
  //   patientId: Number(this.queryParamMapSignal()?.get('id') ?? 0),
  // }));

  // ngOnInit(): void {
  //   this.initForm();
  //   this.fetchDefaultForm();
  // }

  // initForm(): void {
  //   this.form = this.fb.group({
  //     stockMasterId: [],
  //     productId: [],
  //     companyId: [''],
  //     costPerUnit: [],
  //     sellPerUnit: [''],
  //     hasActive: [],
  //     minNotification: [''],
  //     unitId: [''],
  //     taxRatePurchase: [''],
  //     taxRateSales: [''],
  //     mfgDate: [0],
  //     expDate: [''],
  //     marginPercent: [''],
  //     hasAllowCostEdit: [''],
  //     mrp: [''],
  //     disPercent: [],
  //     discountAmt: [],
  //   });
  // }

  // private fetchDefaultForm() {
  //   this.stockService
  //     .getDefaultForm2(this.idsSignal().patientId)
  //     .pipe(takeUntilDestroyed(this.destroy$))
  //     .subscribe((res: IStockForm2DtoWrapper) => {
  //       console.log('res:', res);
  //       this.form.patchValue(res.form);
  //       this.avatarUrl = res.form.path;
  //       this.productListSignal.set(res.productList);
  //       this.categoryListSignal.set(res.categoryList);
  //       this.unitListSignal.set(res.unitList);
  //       this.companyListSignal.set(res.companyList);
  //     });
  // }

  // onSave() {
  //   console.log('form:', this.form.value);
  //   const marginQty2 = this.form.value.marginQty2;
  //   // if (marginQty2 == null) this.form.patchValue({ marginQty2: 0 });

  //   this.stockService
  //     .saveStock(this.form.value)
  //     .pipe(takeUntilDestroyed(this.destroy$))
  //     .subscribe({
  //       next: (res: ICustomResponse) => {
  //         this.notification.success('Success', res.message);
  //         this.form.reset();
  //         this.router.navigate(['auth/list-stock']);
  //       },
  //     });
  // }

  // profilePicUpload = (file: any): boolean => {
  //   this.form.patchValue({
  //     file: file,
  //   });

  //   // to display the image
  //   this.getBase64(file, (img: string) => {
  //     this.loading = false;
  //     this.avatarUrl = img;
  //   });

  //   // this.cd.detectChanges();
  //   return false;
  // };
  // handleChange(info: { file: NzUploadFile }): void {
  //   console.log('handleChange info');

  //   switch (info.file.status) {
  //     case 'uploading':
  //       this.loading = true;
  //       break;
  //     case 'done':
  //       // Get this url from response in real world.
  //       this.getBase64(info.file!.originFileObj!, (img: string) => {
  //         this.loading = false;

  //         this.avatarUrl = img;
  //         this.form.patchValue({
  //           file: info,
  //         });
  //         return;
  //       });
  //       break;
  //     case 'error':
  //       console.log('handel chg err');

  //       // this.msg.error('Network error');
  //       this.getBase64(info.file!.originFileObj!, (img: string) => {
  //         this.loading = false;

  //         this.avatarUrl = img;
  //         return;
  //       });
  //       break;
  //   }
  // }

  // private getBase64(img: File, callback: (img: string) => void): void {
  //   const reader = new FileReader();
  //   reader.addEventListener('load', () => {
  //     if (reader.result) {
  //       callback(reader.result.toString());
  //     }
  //   });
  //   reader.readAsDataURL(img);
  // }

  // handlePreview = async (file: NzUploadFile): Promise<void> => {
  //   console.log('file handel prreview', file);

  //   if (!file.url && !file['preview']) {
  //     if (file.originFileObj) {
  //       file['preview'] = await getBase64(file.originFileObj);
  //     }
  //   }
  //   this.previewImage = file.url || file['preview'];
  //   this.previewVisible = true;
  // };




  private readonly stockService = inject(StockService);
  private readonly notification = inject(NzNotificationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroy$ = inject(DestroyRef);

  // --- STATE MANAGEMENT ---
  // The Single Source of Truth for the Form
  state = signal({
    stockMasterId: null as number | null,
    productId: null as number | null,
    companyId: 0,
    categoryId: 0,
    costPerUnit: 0,
    sellPerUnit: 0,
    marginPercent: 0,
    mrp: 0,
    hasActive: true,
    hasAllowCostEdit: false, // Permission Gate
    unitId: 0,
    taxRatePurchase: 13,
    taxRateSales: 13,
    minNotification: 10,
    marginRemarks: '',
    disPercent: 0,
    discountAmt: 0,
    mfgDate: '',
    expDate: '',
    batch: '',
    file: null as any
  });

  // UI State Signals
  loading = signal(false);
  avatarUrl = signal<string | undefined>(undefined);
  mode = signal<'add' | 'edit'>('add');

  // Master Data Signals
  productListSignal = signal<IProduct[]>([]);
  unitListSignal = signal<IUnit[]>([]);
  categoryListSignal = signal<ICategory[]>([]);
  companyListSignal = signal<ICompany[]>([]);

  // --- COMPUTED BUSINESS LOGIC (High Efficiency) ---
  // 2. Automated Image Lookup (Requirement 1 & 4)
  // This signal re-runs ONLY when productId changes.
  // Inside your component class
  selectedProductImage = computed(() => {
    const currentId = this.state().productId;
    // If no product is selected or ID is 0, return null
    if (!currentId || currentId === 0) return null;

    const product = this.productListSignal().find(p => p.productId === currentId);
    return product?.path || null;
  });
  // Requirement 2: Disable cost if not allowed
  isCostEditable = computed(() => this.state().hasAllowCostEdit);

  // Requirement 3: Calculate Sell Price based on Cost & Margin
  // Formula: Sell = Cost + (Cost * Margin%)
  calculatedSellPrice = computed(() => {
    const { costPerUnit, marginPercent } = this.state();
    const sell = costPerUnit * (1 + marginPercent / 100);
    return parseFloat(sell.toFixed(2));
  });

  // Validation Signal
  isFormValid = computed(() => {
    const s = this.state();
    return s.productId && s.costPerUnit > 0 && s.unitId > 0;
  });
  // Add this to your component class
  isDateValid = computed(() => {
    const { mfgDate, expDate } = this.state();

    const validate = (dateStr: string) => {
      if (!dateStr || dateStr.length < 7) return false;
      const [year, month] = dateStr.split('/').map(Number);
      return month >= 1 && month <= 12 && year > 2000;
    };

    return validate(mfgDate) && validate(expDate);
  });

  constructor() {
    this.fetchDefaultForm();
  }

  // --- METHODS ---

  private fetchDefaultForm() {
    const id = Number(this.route.snapshot.queryParamMap.get('id') ?? 0);
    if (id > 0) this.mode.set('edit');

    this.stockService.getDefaultForm2(id)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe((res: IStockForm2DtoWrapper) => {
        // Patch state instead of form.patchValue
        this.state.set({ ...this.state(), ...res.form });
        this.avatarUrl.set(res.form.path);

        this.productListSignal.set(res.productList);
        this.categoryListSignal.set(res.categoryList);
        this.unitListSignal.set(res.unitList);
        this.companyListSignal.set(res.companyList);
      });
  }

  // Enterprise pattern: Single update function for the whole state
  updateField<K extends keyof ReturnType<typeof this.state>>(key: K, value: any) {
    this.state.update(prev => {
      const updated = { ...prev, [key]: value };

      // Auto-update Sell Price if Cost or Margin changes
      if (key === 'costPerUnit' || key === 'marginPercent') {
        updated.sellPerUnit = this.calculateInstantSellPrice(updated.costPerUnit, updated.marginPercent);
      }
      return updated;
    });
  }

  private calculateInstantSellPrice(cost: number, margin: number): number {
    return parseFloat((cost * (1 + margin / 100)).toFixed(2));
  }

  onSave() {
    if (!this.isFormValid()) {
      this.notification.warning('Incomplete Form', 'Please fill required fields.');
      return;
    }

    this.loading.set(true);
    this.stockService.saveStock2(this.state())
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: (res) => {
          this.notification.success('Success', res.message);
          this.router.navigate(['auth/list-stock']);
        },
        error: () => this.loading.set(false)
      });
  }

  // Image Upload Logic (Optimized)
  profilePicUpload = (file: any): boolean => {
    this.updateField('file', file);
    const reader = new FileReader();
    reader.onload = () => this.avatarUrl.set(reader.result as string);
    reader.readAsDataURL(file);
    return false;
  };
}
