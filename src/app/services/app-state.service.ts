import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { Asset, CoinPrices, Profile, Rate } from '../models';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  ls = inject(LocalStorageService);

  private readonly assets = new BehaviorSubject<Asset[]>([]);
  readonly assets$ = this.assets.asObservable();

  private readonly rates = new BehaviorSubject<Rate[]>([]);
  readonly rates$ = this.rates.asObservable();

  private readonly profiles = new BehaviorSubject<Profile[]>([]);
  readonly profiles$ = this.profiles.asObservable();

  private readonly activeProfileId = new BehaviorSubject<number | null>(null);
  readonly activeProfile$ = this.activeProfileId.asObservable();

  private readonly coinPrices = new BehaviorSubject<CoinPrices>({});
  readonly coinPrices$ = this.coinPrices.asObservable();

  private readonly activeCurrency = new BehaviorSubject<Rate>({
    id: 'us-dollar',
    currencySymbol: '$',
    symbol: 'USD',
    type: 'fiat',
    rateUsd: '1.0',
  });
  readonly activeCurrency$ = this.activeCurrency.asObservable();

  readonly availableAssetsInActiveProfile$ = combineLatest([
    this.activeProfile$,
    this.profiles$,
  ]).pipe(
    map(([activeProfile, profiles]) => {
      if (!activeProfile) {
        return [];
      }
      // Take all existing assets, and remove the assets which are already present in the current profile's assets
      const activeProfileAssets =
        profiles.find((profile) => profile.id === activeProfile)?.assets || [];

      const availableAssets = [...this.assets.value].filter(
        (availableAsset) => {
          const assetAlreadyInCurrentProfile = activeProfileAssets.find(
            (asset) => asset.id === availableAsset.id
          );
          if (assetAlreadyInCurrentProfile) {
            return false;
          }

          return true;
        }
      );

      return availableAssets;
    })
  );

  readonly assetsInActiveProfile$ = combineLatest([
    this.activeProfile$,
    this.profiles$,
  ]).pipe(
    map(([activeProfileId, profiles]) => {
      if (!activeProfileId) {
        return [];
      }

      const activeProfile = profiles.find(
        (profile) => profile.id === activeProfileId
      );

      return activeProfile?.assets || [];
    })
  );

  initializeCache() {
    const currency = this.ls.getLSData('activeCurrency');
    if (currency) {
      this.setActiveCurrency(currency);
    }

    const activeProfileId = this.ls.getLSData('activeProfileId');
    if (activeProfileId) {
      this.activeProfileId.next(parseInt(activeProfileId));
    }

    const profiles = this.ls.getLSData('profiles');
    if (profiles) {
      this.profiles.next(profiles);
    }
  }

  setUSDCoinPrices(prices: { [key: string]: string }) {
    const formattedPrices: CoinPrices = {};
    Object.keys(prices).forEach((price) => {
      formattedPrices[price] = {
        priceUsd: prices[price],
        priceCurrentCurrency: this.getExchangedCurrency(prices[price]),
      };
    });

    this.coinPrices.next({ ...this.coinPrices.value, ...formattedPrices });
  }

  setAssets(assets: Asset[]) {
    this.assets.next(assets);

    // Set initial asset and conversion prices for each coin
    const formattedPrices: CoinPrices = {};
    assets.forEach((asset) => {
      formattedPrices[asset.id] = {
        priceUsd: asset.priceUsd,
        priceCurrentCurrency: this.getExchangedCurrency(asset.priceUsd),
      };
    });

    this.coinPrices.next({ ...this.coinPrices.value, ...formattedPrices });
  }

  setRates(rates: Rate[]) {
    this.rates.next(rates);
  }

  setActiveCurrency(symbol: string) {
    const currency = this.rates.value.find((rate) => rate.symbol === symbol);
    if (currency) {
      this.activeCurrency.next(currency);
      this.ls.setLSData(symbol, 'activeCurrency');

      // Update conversion prices for each coin
      const formattedPrices: CoinPrices = {};
      Object.keys(this.coinPrices.value).forEach((price) => {
        formattedPrices[price] = {
          priceUsd: this.coinPrices.value[price].priceUsd,
          priceCurrentCurrency: this.getExchangedCurrency(
            this.coinPrices.value[price].priceUsd
          ),
        };
      });

      this.coinPrices.next({ ...this.coinPrices.value, ...formattedPrices });
    }
  }

  createProfile(name: string) {
    const id = +new Date();
    this.profiles.next([...this.profiles.value, { id, name, assets: [] }]);
    this.ls.setLSData(this.profiles.value, 'profiles');

    return id;
  }

  setActiveProfile(id: number) {
    this.activeProfileId.next(id);
    this.ls.setLSData(id.toString(), 'activeProfileId');
  }

  deleteProfile(id: number) {
    this.profiles.next([
      ...this.profiles.value.filter((profile) => profile.id !== id),
    ]);
    this.ls.setLSData(this.profiles.value, 'profiles');

    if (this.profiles.value.length === 0) {
      this.activeProfileId.next(null);
      this.ls.setLSData('', 'activeProfileId');
    }
  }

  addAssetToActiveProfile = (asset: Asset) => {
    const activeProfileId = this.activeProfileId.value;
    const activeProfile = [...this.profiles.value].find(
      (profile) => profile.id === activeProfileId
    );
    if (!activeProfile) {
      return;
    }

    this.profiles.next([
      ...this.profiles.value.map((profile) => {
        if (profile.id === activeProfileId) {
          return {
            ...profile,
            assets: [...profile.assets, asset],
          };
        }

        return profile;
      }),
    ]);
    this.ls.setLSData(this.profiles.value, 'profiles');
  };

  removeAssetFromCurrentProfile = (asset: Asset) => {
    const activeProfileId = this.activeProfileId.value;
    const activeProfile = [...this.profiles.value].find(
      (profile) => profile.id === activeProfileId
    );
    if (!activeProfile) {
      return;
    }

    this.profiles.next([
      ...this.profiles.value.map((profile) => {
        if (profile.id === activeProfileId) {
          return {
            ...profile,
            assets: [
              ...profile.assets.filter(
                (profileAsset) => profileAsset.id !== asset.id
              ),
            ],
          };
        }

        return profile;
      }),
    ]);
    this.ls.setLSData(this.profiles.value, 'profiles');
  };

  private getExchangedCurrency(priceUsd: string) {
    return (
      parseFloat(priceUsd) / parseFloat(this.activeCurrency.value.rateUsd)
    ).toFixed(2);
  }
}
