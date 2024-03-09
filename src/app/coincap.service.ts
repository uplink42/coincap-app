import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Asset } from './models';
import { AppStateService } from './app-state.service';

@Injectable({
  providedIn: 'root',
})
export class CoincapService {
  private http = inject(HttpClient);

  private appState = inject(AppStateService);

  getAssets() {
    return this.http.get<{ data: Asset[] }>('https://api.coincap.io/v2/assets');
  }

  getPrices() {
    const pricesWs = new WebSocket('wss://ws.coincap.io/prices?assets=ALL');

    pricesWs.onmessage = (msg) => {
      this.appState.setCoinPrices(JSON.parse(msg.data));
    };
  }
}
