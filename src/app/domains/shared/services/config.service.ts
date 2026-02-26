import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConfigService {
    private http = inject(HttpClient);

    // We use a signal to store the config
    private configSignal = signal<{ apiUrl: string } | null>(null);
    readonly config = this.configSignal.asReadonly();

    // This function returns a Promise so APP_INITIALIZER knows when to finish
    async loadConfig(): Promise<void> {
        const data = await firstValueFrom(
            this.http.get<{ apiUrl: string }>('config.json')
        );
        this.configSignal.set(data);
    }
}