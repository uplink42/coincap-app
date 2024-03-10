import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CoincapService } from './services/coincap.service';
import { AppStateService } from './services/app-state.service';
import { CoinListComponent } from './coin-list/coin-list.component';
import { CoinProfilesComponent } from './coin-profiles/coin-profiles.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { AsyncPipe } from '@angular/common';
import { ToolbarComponent } from './shared/toolbar/toolbar.component';
import { forkJoin } from 'rxjs';
import { LoadingService } from './services/loading.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    RouterOutlet,
    CoinListComponent,
    CoinProfilesComponent,
    MatGridListModule,
    AsyncPipe,
    ToolbarComponent,
    MatProgressSpinnerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  coinCap = inject(CoincapService);
  appState = inject(AppStateService);
  loading = inject(LoadingService);

  profiles$ = this.appState.profiles$;
  activeProfile$ = this.appState.activeProfile$;
  activeCurrency$ = this.appState.activeCurrency$;
  rates$ = this.appState.rates$;
  isLoading$ = this.loading.loading$;

  ngOnInit() {
    this.loading.startLoading();

    forkJoin([this.coinCap.getAssets(), this.coinCap.getRates()]).subscribe(
      ([assets, rates]) => {
        this.appState.setAssets(assets.data);
        this.appState.setRates(rates.data);
        this.coinCap.getLivePrices();

        this.appState.initializeCache();
        this.loading.stopLoading();
      }
    );
  }

  setActiveProfile(id: number) {
    this.appState.setActiveProfile(id);
  }

  setCurrency(symbol: string) {
    this.appState.setActiveCurrency(symbol);
  }

  deleteProfile(id: number) {
    this.appState.deleteProfile(id);
  }

  addProfile(name: string) {
    const id = this.appState.createProfile(name);
    this.appState.setActiveProfile(id);
  }
}
