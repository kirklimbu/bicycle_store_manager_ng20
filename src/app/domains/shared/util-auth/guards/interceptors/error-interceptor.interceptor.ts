// libs/shared/data-access/src/lib/interceptors/error.interceptor.ts
import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export function errorInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  const notification = inject(NzNotificationService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      handleError(error, notification, router);
      return throwError(() => error);
    })
  );
}

function handleError(
  error: HttpErrorResponse,
  notification: NzNotificationService,
  router: Router
): void {
  notification.error('Error', error.error?.message, { nzDuration: 10_000 });
}

function handleValidationErrors(
  errorResponse: any,
  notification: NzNotificationService
): void {
  // Clear any existing validation notifications first
  notification.remove();
  const duration = 10_000;

  if (errorResponse.message) {
    notification.error('Validation Error', errorResponse.message, {
      nzDuration: duration, // Never auto-close
      nzCloseIcon: 'close-circle', // Use just the icon name
      nzClass: 'validation-notification validation-error',
      nzStyle: {
        position: 'relative', // For absolute positioning of our custom button
      },
    });
  }

  if (errorResponse.errors?.length) {
    setTimeout(() => {
      errorResponse.errors.forEach((err: string, index: number) => {
        const notificationRef = notification.warning(
          `Validation Issue (${index + 1}/${errorResponse.errors.length})`,
          createNotificationContent(err),
          {
            nzDuration: duration,
            nzCloseIcon: 'close-circle',
            nzClass: 'validation-notification validation-warning',
          }
        );

        // Add click handler after notification is created
        setTimeout(() => {
          const noticeElement = document.querySelector(
            `.ant-notification-notice-${notificationRef.messageId}`
          );
          if (noticeElement) {
            noticeElement
              .querySelector('.custom-close-btn')
              ?.addEventListener('click', () => {
                notification.remove(notificationRef.messageId);
              });
          }
        }, 0);
      });
    }, 300);
  }
}

function createNotificationContent(message: string): string {
  return `
    <div class="notification-content-wrapper">
      <div class="notification-message">${message}</div>
      <button class="custom-close-btn">
        <span class="anticon anticon-close-circle"></span>
      </button>
    </div>
  `;
}
