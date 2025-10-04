import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
import { ICompany } from 'src/app/domains/company/data/model/company.model';
import { ICategory } from 'src/app/domains/home/data/model/home.model';
import { ICustomResponse } from 'src/app/domains/shared/models/CustomResponse.model';
import { IStockFormDtoWrapper, IUnit } from '../../data/model/stock';
import { StockService } from '../../data/services/stock.service';

const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
@Component({
  selector: 'app-add-stock',
  imports: [
    CommonModule,
    ReactiveFormsModule,

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
  ],
  templateUrl: './add-stock.html',
  styleUrl: './add-stock.scss',
})
export class AddStock {
  // props
  form!: FormGroup;
  mode = 'add';
  loading = false;
  fileList: any[] = [];
  previewVisible = false;
  avatarUrl: string | undefined;
  previewImage: string | undefined = '';
  companyList: ICompany[] = [];
  categoryList: ICategory[] = [];
  unitList: IUnit[] = [];

  private readonly stockService = inject(StockService);
  private notification = inject(NzNotificationService);
  private readonly destroy$ = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  queryParamMapSignal = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  idsSignal = computed(() => ({
    patientId: Number(this.queryParamMapSignal()?.get('id') ?? 0),
  }));

  ngOnInit(): void {
    this.initForm();
    this.fetchDefaultForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      categoryId: [],
      companyId: [''],
      costPerUnit: [],
      hasActive: [],
      marginPercent: [''],
      marginPercent2: [''],
      marginQty2: [0],
      marginRemarks: [''],
      minNotification: [''],
      mrp: [''],
      name: [''],
      sellPerUnit: [''],
      sellPerUnit2: [''],
      stockMasterId: [],
      unitId: [''],
      file: [],
    });
  }

  private fetchDefaultForm() {
    this.stockService
      .getDefaultForm(this.idsSignal().patientId)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe((res: IStockFormDtoWrapper) => {
        console.log('res:', res);
        this.form.patchValue(res.form);
        this.avatarUrl = res.form.path;

        this.companyList = res.companyList;
        this.categoryList = res.categoryList;
        this.unitList = res.unitList;
      });
  }

  onSave() {
    console.log('form:', this.form.value);
    const marginQty2 = this.form.value.marginQty2;
    // if (marginQty2 == null) this.form.patchValue({ marginQty2: 0 });

    this.stockService
      .saveStock(this.form.value)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: (res: ICustomResponse) => {
          this.notification.success('Success', res.message);
          this.form.reset();
          this.router.navigate(['auth/list-stock']);
        },
      });
  }

  profilePicUpload = (file: any): boolean => {
    this.form.patchValue({
      file: file,
    });

    // to display the image
    this.getBase64(file, (img: string) => {
      this.loading = false;
      this.avatarUrl = img;
    });

    // this.cd.detectChanges();
    return false;
  };
  handleChange(info: { file: NzUploadFile }): void {
    console.log('handleChange info');

    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        // Get this url from response in real world.
        this.getBase64(info.file!.originFileObj!, (img: string) => {
          this.loading = false;

          this.avatarUrl = img;
          this.form.patchValue({
            file: info,
          });
          return;
        });
        break;
      case 'error':
        console.log('handel chg err');

        // this.msg.error('Network error');
        this.getBase64(info.file!.originFileObj!, (img: string) => {
          this.loading = false;

          this.avatarUrl = img;
          return;
        });
        break;
    }
  }

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      if (reader.result) {
        callback(reader.result.toString());
      }
    });
    reader.readAsDataURL(img);
  }

  handlePreview = async (file: NzUploadFile): Promise<void> => {
    console.log('file handel prreview', file);

    if (!file.url && !file['preview']) {
      if (file.originFileObj) {
        file['preview'] = await getBase64(file.originFileObj);
      }
    }
    this.previewImage = file.url || file['preview'];
    this.previewVisible = true;
  };
}
