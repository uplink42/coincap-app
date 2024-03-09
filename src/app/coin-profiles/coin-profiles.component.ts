import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Profile } from '../models';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { NewProfileDialogComponent } from '../new-profile-dialog/new-profile-dialog.component';
import { AssetsDialogComponent } from '../assets-dialog/assets-dialog.component';

@Component({
  selector: 'app-coin-profiles',
  standalone: true,
  imports: [MatListModule, MatIconModule, MatDividerModule, MatButtonModule],
  templateUrl: './coin-profiles.component.html',
  styleUrl: './coin-profiles.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoinProfilesComponent {
  constructor(public dialog: MatDialog) {}

  @Input({ required: true }) profiles: Profile[] = [];
  @Input({ required: true }) activeProfile: number | null = null;

  @Output() createProfile = new EventEmitter<string>();
  @Output() deleteProfile = new EventEmitter<number>();
  @Output() setActiveProfile = new EventEmitter<number>();

  profileName = '';

  openNewProfileDialog(): void {
    const dialogRef = this.dialog.open(NewProfileDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.createProfile.emit(result);
        this.profileName = result;
      }
    });
  }

  openAssetsDialog() {
    this.dialog.open(AssetsDialogComponent, {
      disableClose: true,
    });
  }
}
