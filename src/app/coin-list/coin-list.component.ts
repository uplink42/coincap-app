import { Component, EventEmitter, Output, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { AppStateService } from '../app-state.service';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { CoinAssetsComponent } from '../coin-assets/coin-assets.component';

const itemsPerPage = 16;

@Component({
  selector: 'app-coin-list',
  standalone: true,
  imports: [MatCardModule, AsyncPipe, CoinAssetsComponent],
  templateUrl: './coin-list.component.html',
  styleUrl: './coin-list.component.scss',
})
export class CoinListComponent {
  @Output() removeAsset = new EventEmitter<string>();

  appState = inject(AppStateService);

  pageIndex$ = new BehaviorSubject<number>(0);

  itemsPerPage = itemsPerPage;

  availableAssetsForCurrentPage$ = combineLatest([
    this.appState.assetsInActiveProfile$,
    this.pageIndex$,
  ]).pipe(
    map(([availableAssets, pageIndex]) => {
      const currentPage = [
        ...availableAssets.slice(
          this.itemsPerPage * pageIndex,
          this.itemsPerPage * (pageIndex + 1)
        ),
      ];

      return currentPage;
    })
  );
}
