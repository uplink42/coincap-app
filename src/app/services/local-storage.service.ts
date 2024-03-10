import { Injectable } from '@angular/core';

export type LS_KEY =
  | 'profiles'
  | 'activeProfileId'
  | 'activeCurrency'
  | 'coinPrices';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  setLSData(data: string | object, key: LS_KEY) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  getLSData(key: LS_KEY) {
    const data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    }

    return null;
  }
}
