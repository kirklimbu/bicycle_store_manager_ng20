import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  input,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzInputModule } from 'ng-zorro-antd/input';
import { SecondaryLinksComponent } from '../../shared/ui-common/secondary-links/secondary-links.component';
import { UserModel } from '../../shared/util-auth/models/user.model';
import { MESSAGES } from '../../shared/util-logger/message';
import { AuthState } from './state/login.state';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzIconModule,
    NzButtonModule,
    NzImageModule,
    SecondaryLinksComponent,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  // providers: [AuthState],
})
export class LoginComponent implements OnInit {
  showPassword = false;
  logo = '';

  fallback = MESSAGES.FALLBACK;

  readonly showLinks = input<boolean>(true);

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly destroy$ = inject(DestroyRef);
  private readonly authState = inject(AuthState);
  private readonly route = inject(ActivatedRoute);

  readonly form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  readonly formValue = toSignal(this.form.valueChanges, {
    initialValue: this.form.value,
  });
  readonly isFormValid = computed(() => this.form.valid);
  // readonly userDetails = signal<UserModel | null>(
  //   this.authState.userDetails)
  // );

  isAuthenticated = this.authState.isAuthenticated;
  constructor() {
    this.redirectIfAuthenticated();
  }
  ngOnInit(): void {
    // this.redirectIfAuthenticated();
  }

  private redirectIfAuthenticated(): void {
    if (this.isAuthenticated()) {
      this.navigateBasedOnRole();
    }
  }

  get f() {
    return this.form.controls;
  }

  onLogin(): void {
    if (!this.isFormValid()) return;

    const { username, password } = this.formValue() ?? {};
    if (!username || !password) return;

    this.authState
      .login({ username, password })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe((res) => {
        const admin = this.authState.isAdmin();
        console.log('login comp res', res, admin);
        this.navigateBasedOnRole();
      });
  }

  onTogglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onCancel(event: Event): void {
    this.router.navigate(['/']);
  }

  onRegister(): void {
    // this.router.navigate(['/auth/registration']);
  }

  private navigateBasedOnRole(): void {
    // Use the updated state from AuthState
    const isAdmin = this.authState.isAdmin();
    console.log('isAdmin', isAdmin);
    
    const targetRoute = isAdmin ? '/auth/user-profile' : '/home';

    // Use navigateByUrl to avoid returnUrl issues
    this.router.navigateByUrl(targetRoute, { replaceUrl: true });
  }
}
