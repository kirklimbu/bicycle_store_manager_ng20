import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, TemplateRef } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../shared/util-auth/services/auth-http/auth.service';

import { FormSubmitButtonsComponent } from '../../shared/ui-common/form-submit-buttons/form-submit-buttons.component';
import { ConfirmedValidator } from '../../shared/util-logger/confirm-password.validator';
// import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UrlService } from '../../shared/util-logger/url.service';
// import { MessageService } from 'src/app/shared/util-logger/message.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { ICustomResponse } from '../../shared/models/CustomResponse.model';

@Component({
  selector: 'app-registration',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormSubmitButtonsComponent,
    NzIconModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzDividerModule,
  ],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  providers: [],
})
export class RegistrationComponent {
  form!: FormGroup;
  hasError!: boolean;
  showPassword = false;
  showcPassword = false;
  // isLoading = false;
  formError!: TemplateRef<{
    validation: string;
    message: string;
    control: AbstractControl<any, any>;
  }> | null;

  destroyRef = inject(DestroyRef);

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  public urlService = inject(UrlService);
  // public messageService = inject(MessageService);

  ngOnInit(): void {
    this.initForm();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  initForm(): FormGroup {
    return (this.form = this.fb.group(
      {
        mobile: ['', [Validators.required]],
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        addressOne: ['', [Validators.required]],
        addressTwo: [''],
        passWord: ['', [Validators.required]],
        cPassword: ['', [Validators.required]],
        // agree: [false, [Validators.required]],
      },
      {
        validator: ConfirmedValidator('passWord', 'cPassword'),
      }
    ));
  }

  onTogglePassword() {
    this.showPassword = !this.showPassword;
  }
  onTogglecPassword() {
    this.showcPassword = !this.showcPassword;
  }

  onSignUp() {
    // this.isLoading = true;
    this.hasError = false;
    this.authService
      .registration(this.form.value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user: ICustomResponse) => {
        console.log('user', user);
        // this.isLoading = false;

        // this.messageService.showSuccessMessage(user.message)
        this.router.navigate(['/auth/login']);
      });
  }

  onCancel(): void {
    console.log('cancel');
    this.router.navigate(['/home']);
  }

  /**
   * check previous page
   * navigate to page after successful registration
   */

  checkPreviousPage() {
    const currentPage$ = this.urlService.currentUrl$;
    currentPage$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((page) => {
      console.log('page', page);
      if (page == 'cart') {
        this.router.navigate(['/cart']);
      }
    });
  }
}
