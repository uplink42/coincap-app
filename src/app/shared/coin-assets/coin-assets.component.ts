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
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-coin-assets',
  standalone: true,
  imports: [
    CurrencyPipe,
    MatCardModule,
    MatPaginatorModule,
    MatButton,
    AsyncPipe,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
  ],
  templateUrl: './coin-assets.component.html',
  styleUrl: './coin-assets.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoinAssetsComponent {
  appState = inject(AppStateService);

  coinPrices$ = this.appState.coinPrices$;
  activeCurrency$ = this.appState.activeCurrency$;

  searchTerm = '';

  @Input({ required: true }) pageAssets: Asset[] = [];
  @Input({ required: true }) totalAssets: Asset[] = [];
  @Input({ required: true }) actionName = '';
  @Input({ required: true }) actionCallback: (asset: Asset) => void = () => {};
  @Input() itemsPerPage = 12;
  @Input() emptyMessage = 'No items';
  @Output() changePage = new EventEmitter<number>();
  @Output() setSearchTerm = new EventEmitter<string>();
}
