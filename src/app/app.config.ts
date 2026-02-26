import { registerLocaleData } from '@angular/common';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  isDevMode,
  provideAppInitializer,
  provideZoneChangeDetection
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';
import { JwtModule } from '@auth0/angular-jwt';
import { NzConfig, provideNzConfig } from 'ng-zorro-antd/core/config';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { appRoutes } from './app.routes';
import { errorInterceptor } from './domains/shared/util-auth/guards/interceptors/error-interceptor.interceptor';

import { ConfigService } from './domains/shared/services/config.service';
import { httpTokenInterceptor } from './domains/shared/util-auth/guards/interceptors/http-token-interceptor';
const icons: IconDefinition[] = Object.values(AllIcons);

const ngZorroConfig: NzConfig = {
  message: { nzTop: 120 },
  notification: { nzTop: 160, nzDuration: 10_000 },
};
export function tokenGetter(): string | null {
  const raw = localStorage.getItem('auth');
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    // Make sure it’s an object and has a non-empty token
    const token = parsed?.token;
    return token && token.trim() !== '' ? token : null;
  } catch (e) {
    console.error('tokenGetter: Failed to parse auth from localStorage', e);
    return null;
  }
}

registerLocaleData('en');
// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideZoneChangeDetection({ eventCoalescing: true }),
//     provideRouter(appRoutes),
//     provideHttpClient(withInterceptors([])),
//     provideNzI18n(en_US),
//     provideAnimationsAsync(),
//     provideHttpClient(
//       withInterceptors([httpTokenInterceptor, errorInterceptor]),
//       withFetch(),
//       withInterceptorsFromDi()
//     ),
//     provideNzConfig(ngZorroConfig),

//     importProvidersFrom(
//       JwtModule.forRoot({
//         config: {
//           tokenGetter,
//           throwNoTokenError: false,
//           // allowedDomains: ['localhost:4200', 'https://angelfoundation.org.np'], // ✅ where tokens should be sent
//           // disallowedRoutes: [
//           //   'localhost:4200/auth/login',
//           //   'https://angelfoundation.org.np/auth/login'
//           // ],
//         },
//       })
//     ),
//     // pwa
//     provideServiceWorker('ngsw-worker.js', {
//       enabled: !isDevMode(),
//       registrationStrategy: 'registerImmediately',
//     }),
//     provideAppInitializer(() => {
//       const configService = inject(ConfigService);
//       return configService.loadConfig();
//     }),
//   ],
// };

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),

    // Combine HTTP configuration into one place
    provideHttpClient(
      withFetch(),
      withInterceptors([
        httpTokenInterceptor,
        errorInterceptor
      ])
    ),

    provideNzI18n(en_US),
    provideAnimationsAsync(),
    provideNzConfig(ngZorroConfig),

    // Modern functional initializer
    provideAppInitializer(() => {
      const configService = inject(ConfigService);
      return configService.loadConfig();
    }),

    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter,
          // We will need to address how to make these dynamic too!
        },
      })
    ),

    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerImmediately',
    }),
  ],
};
