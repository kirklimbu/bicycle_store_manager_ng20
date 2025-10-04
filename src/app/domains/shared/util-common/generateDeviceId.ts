import { signal } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

function initDeviceId(): string {
  let deviceId: string | null = localStorage.getItem('deviceId');

  // console.log('deviceId function (existing):', deviceId);

  if (!deviceId) {
    deviceId = uuidv4();
    localStorage.setItem('deviceId', deviceId);
  }
  return deviceId;
}

export const deviceIdSignal = signal<string>(initDeviceId());
