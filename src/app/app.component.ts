import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CoincapService } from './coincap.service';
import { AppStateService } from './app-state.service';
import { CoinListComponent } from './coin-list/coin-list.component';
import { CoinProfilesComponent } from './coin-profiles/coin-profiles.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AsyncPipe } from '@angular/common';

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
    MatToolbarModule,
    AsyncPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  title = 'coincap-app';
  coinCap = inject(CoincapService);
  appState = inject(AppStateService);
  profiles$ = this.appState.profiles$;
  activeProfile$ = this.appState.activeProfile$;

  ngOnInit() {
    this.coinCap
      .getAssets()
      .subscribe((assets) => this.appState.setAssets(assets.data));
  }

  setActiveProfile(id: number) {
    this.appState.setActiveProfile(id);
  }

  deleteProfile(id: number) {
    this.appState.deleteProfile(id);
  }

  addProfile(name: string) {
    const id = this.appState.createProfile(name);
    this.appState.setActiveProfile(id);
  }
}
