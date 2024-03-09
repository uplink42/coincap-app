import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
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
