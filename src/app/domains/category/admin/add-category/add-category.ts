import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, computed, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { CategoryService } from '../../data/services/category-service';
import { MessageService } from '@logger/message.service';

const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

@Component({
  selector: 'app-add-category',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgOptimizedImage,
    NzCardModule,
    NzSelectModule,
    NzDividerModule,
    NzButtonModule,
    NzInputModule,
    NzFormModule,
    NzPageHeaderModule,
    NzSpaceModule,
    NzModalModule,
    NzUploadModule,
    NzIconModule,
    NzCheckboxModule,
    NzSwitchModule,
  ],
  templateUrl: './add-category.html',
  styleUrl: './add-category.scss',
})
export class AddCategory {
  form!: FormGroup;
  mode = 'add';
  loading = false;
  fileList: any[] = [];
  previewVisible = false;
  avatarUrl: string | undefined;
  previewImage: string | undefined = '';

  private fb = inject(FormBuilder);
  private eventService = inject(CategoryService);
  private destroyRef = inject(DestroyRef);
  private messageService = inject(MessageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  queryParamMapSignal = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  idsSignal = computed(() => ({
    id: Number(this.queryParamMapSignal()?.get('id') ?? 0),
  }));

  public ngOnInit(): void {
    this.buildForm();
    this.fetchDefaultFormValues();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      categoryId: [],
      name: [],
      hasActive: [],
      path: [],
    });
  }

  fetchDefaultFormValues() {
    this.eventService
      .getCategoryFormValues(this.idsSignal().id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((_res) => {
        console.log('res form', _res);

        this.form.patchValue(_res);
        this.avatarUrl = _res.path;
      });
  }

  onSave() {
    this.eventService
      .saveCategory(this.form.value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        console.log('res', res);
        this.form.reset();
        this.messageService.createMessage('success', res.message);
        this.router.navigate(['auth/list-category']);
      });
  }

  profilePicUpload = (file: any): boolean => {
    this.form.patchValue({
      path: file,
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
            path: info,
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
