import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CoincapService } from './coincap.service';
import { AppStateService } from './app-state.service';
import { CoinListComponent } from './coin-list/coin-list.component';
import { CoinProfilesComponent } from './coin-profiles/coin-profiles.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Tile } from './models';
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
})
export class AppComponent implements OnInit {
  title = 'coincap-app';

  coinCap = inject(CoincapService);
  appState = inject(AppStateService);

  tiles: Tile[] = [
    { text: 'One', cols: 4, rows: 1, color: 'lightblue' },
    { text: 'Two', cols: 3, rows: 1, color: 'lightgreen' },
    { text: 'Three', cols: 1, rows: 1, color: 'lightpink' },
  ];

  profiles$ = this.appState.profiles$;
  activeProfile$ = this.appState.activeProfile$;

  ngOnInit() {
    this.coinCap
      .getAssets()
      .subscribe((assets) => this.appState.setAssets(assets.data));
  }

  addProfile(name: string) {
    const id = this.appState.createProfile(name);
    this.appState.setActiveProfile(id);
  }
}
