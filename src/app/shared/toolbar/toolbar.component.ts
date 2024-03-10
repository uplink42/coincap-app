import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { Rate } from '../../models';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent implements OnInit, OnChanges {
  @Input({ required: true }) rates: Rate[] = [];
  @Input({ required: true }) currency!: Rate;
  @Output() setActiveCurrency = new EventEmitter<string>();

  filteredRates: Rate[] = [];
  selectedCurrency = 'USD';

  ngOnInit() {
    this.filteredRates = this.rates;
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('currency' in changes) {
      this.selectedCurrency = this.currency.symbol;
    }
  }

  filterRates(term: string) {
    this.filteredRates = this.rates.filter((rate) => {
      const searchTerm = term.toLowerCase();

      return (
        rate.symbol.toLowerCase().includes(searchTerm) ||
        rate.id.toLowerCase().includes(searchTerm)
      );
    });
  }

  closeAutocomplete() {
    if (this.selectedCurrency === '') {
      this.selectedCurrency = 'EUR';
    }
  }
}
