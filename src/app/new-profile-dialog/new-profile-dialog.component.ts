import { Component } from '@angular/core';
import {
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-new-profile-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  templateUrl: './new-profile-dialog.component.html',
  styleUrl: './new-profile-dialog.component.scss',
})
export class NewProfileDialogComponent {
  constructor(public dialogRef: MatDialogRef<NewProfileDialogComponent>) {}

  profile = '';

  onSave(): void {
    this.dialogRef.close(this.profile);
  }
}
