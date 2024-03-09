import { Component, inject } from '@angular/core';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { AppStateService } from '../app-state.service';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { CoinAssetsComponent } from '../coin-assets/coin-assets.component';

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
})
export class AssetsDialogComponent {
  appState = inject(AppStateService);

  pageIndex$ = new BehaviorSubject<number>(0);

  displayedColumns: string[] = ['table'];

  itemsPerPage = itemsPerPage;

  availableAssetsForCurrentPage$ = combineLatest([
    this.appState.availableAssetsInActiveProfile$,
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

  constructor(public dialogRef: MatDialogRef<AssetsDialogComponent>) {}

  onSave(): void {}
}
