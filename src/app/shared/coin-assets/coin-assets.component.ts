import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Asset } from '../../models';
import { MatButton } from '@angular/material/button';
import { AppStateService } from '../../services/app-state.service';

@Component({
  selector: 'app-coin-assets',
  standalone: true,
  imports: [
    CurrencyPipe,
    MatCardModule,
    MatPaginatorModule,
    MatButton,
    AsyncPipe,
  ],
  templateUrl: './coin-assets.component.html',
  styleUrl: './coin-assets.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoinAssetsComponent {
  appState = inject(AppStateService);

  coinPrices$ = this.appState.coinPrices$;
  activeCurrency$ = this.appState.activeCurrency$;

  @Input({ required: true }) pageAssets: Asset[] = [];
  @Input({ required: true }) totalAssets: Asset[] = [];
  @Input({ required: true }) actionName = '';
  @Input({ required: true }) actionCallback: (asset: Asset) => void = () => {};
  @Input() itemsPerPage = 12;
  @Input() emptyMessage = 'No items';
  @Output() changePage = new EventEmitter<number>();
}
