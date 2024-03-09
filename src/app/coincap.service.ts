import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Asset } from './models';

@Injectable({
  providedIn: 'root',
})
export class CoincapService {
  private http = inject(HttpClient);

  getAssets() {
    return this.http.get<{ data: Asset[] }>('https://api.coincap.io/v2/assets');
  }
}
