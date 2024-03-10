import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { AppStateService } from '../services/app-state.service';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { CoinAssetsComponent } from '../shared/coin-assets/coin-assets.component';
import { applySearchAndPaginationToResults } from '../shared/utils';
import { Asset } from '../models';

const itemsPerPage = 12;

@Component({
  selector: 'app-assets-dialog',
  standalone: true,
  imports: [
    AsyncPipe,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    CoinAssetsComponent,
    MatButtonModule,
  ],
  templateUrl: './assets-dialog.component.html',
  styleUrl: './assets-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetsDialogComponent {
  appState = inject(AppStateService);

  pageIndex$ = new BehaviorSubject<number>(0);
  searchTerm$ = new BehaviorSubject<string>('');
  displayedColumns: string[] = ['table'];
  totalFilteredAssets: Asset[] = [];
  itemsPerPage = itemsPerPage;

  availableAssetsForCurrentPage$ = combineLatest([
    this.appState.availableAssetsInActiveProfile$,
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

  constructor(public dialogRef: MatDialogRef<AssetsDialogComponent>) {}
}
