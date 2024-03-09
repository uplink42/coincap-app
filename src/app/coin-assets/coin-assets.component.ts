import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { AppStateService } from '../app-state.service';
import { CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Asset } from '../models';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-coin-assets',
  standalone: true,
  imports: [CurrencyPipe, MatCardModule, MatPaginatorModule, MatButton],
  templateUrl: './coin-assets.component.html',
  styleUrl: './coin-assets.component.scss',
})
export class CoinAssetsComponent {
  @Input({ required: true }) pageAssets: Asset[] = [];

  @Input({ required: true }) totalAssets: Asset[] = [];

  @Input({ required: true }) actionName = '';

  @Input() itemsPerPage = 12;

  @Input() emptyMessage = 'No items';

  @Input({ required: true }) actionCallback: (asset: Asset) => void = () => {};

  @Output() changePage = new EventEmitter<number>();
}
