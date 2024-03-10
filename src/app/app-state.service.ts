import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { Asset, CoinPrices, Profile } from './models';

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  private readonly profiles = new BehaviorSubject<Profile[]>([]);
  readonly profiles$ = this.profiles.asObservable();

  private readonly assets = new BehaviorSubject<Asset[]>([]);
  readonly assets$ = this.assets.asObservable();

  private readonly activeProfileId = new BehaviorSubject<number | null>(null);
  readonly activeProfile$ = this.activeProfileId.asObservable();

  private readonly coinPrices = new BehaviorSubject<CoinPrices>({});
  readonly coinPrices$ = this.coinPrices.asObservable();

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

  setCoinPrices(prices: CoinPrices) {
    this.coinPrices.next({ ...this.coinPrices.value, ...prices });
  }

  setAssets(assets: Asset[]) {
    this.assets.next(assets);
  }

  createProfile(name: string) {
    const id = +new Date();
    this.profiles.next([...this.profiles.value, { id, name, assets: [] }]);

    return id;
  }

  setActiveProfile(id: number) {
    this.activeProfileId.next(id);
  }

  deleteProfile(id: number) {
    this.profiles.next([
      ...this.profiles.value.filter((profile) => profile.id !== id),
    ]);

    if (this.profiles.value.length === 0) {
      this.activeProfileId.next(null);
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
  };
}
