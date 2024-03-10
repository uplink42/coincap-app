import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Asset, Rate, Response } from '../models';
import { AppStateService } from './app-state.service';

@Injectable({
  providedIn: 'root',
})
export class CoincapService {
  private http = inject(HttpClient);
  private appState = inject(AppStateService);

  getAssets() {
    return this.http.get<Response<Asset[]>>('https://api.coincap.io/v2/assets');
  }

  getRates() {
    return this.http.get<Response<Rate[]>>('https://api.coincap.io/v2/rates');
  }

  getLivePrices() {
    const pricesWs = new WebSocket('wss://ws.coincap.io/prices?assets=ALL');

    pricesWs.onmessage = (msg) => {
      this.appState.setUSDCoinPrices(JSON.parse(msg.data));
    };
  }
}
