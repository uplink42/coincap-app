import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  inject,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { AppStateService } from '../services/app-state.service';
import { AsyncPipe } from '@angular/common';
import { CoinAssetsComponent } from '../shared/coin-assets/coin-assets.component';
import { applySearchAndPaginationToResults } from '../shared/utils';
import { Asset } from '../models';

const itemsPerPage = 16;

@Component({
  selector: 'app-coin-list',
  standalone: true,
  imports: [MatCardModule, AsyncPipe, CoinAssetsComponent],
  templateUrl: './coin-list.component.html',
  styleUrl: './coin-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoinListComponent {
  @Output() removeAsset = new EventEmitter<string>();

  appState = inject(AppStateService);
  pageIndex$ = new BehaviorSubject<number>(0);
  searchTerm$ = new BehaviorSubject<string>('');
  totalFilteredAssets: Asset[] = [];
  itemsPerPage = itemsPerPage;

  availableAssetsForCurrentPage$ = combineLatest([
    this.appState.assetsInActiveProfile$,
    this.pageIndex$,
    this.searchTerm$,
  ]).pipe(
    map(([availableAssets, pageIndex, searchTerm]) => {
      const assetsList = applySearchAndPaginationToResults(
        searchTerm,
        availableAssets,
        pageIndex,
        this.itemsPerPage
      );

      this.totalFilteredAssets = assetsList.total;
      return assetsList.assets;
    })
  );
}
