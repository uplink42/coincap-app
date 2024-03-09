import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinProfilesComponent } from './coin-profiles.component';

describe('CoinProfilesComponent', () => {
  let component: CoinProfilesComponent;
  let fixture: ComponentFixture<CoinProfilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoinProfilesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CoinProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
