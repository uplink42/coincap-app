import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinAssetsComponent } from './coin-assets.component';

describe('CoinAssetsComponent', () => {
  let component: CoinAssetsComponent;
  let fixture: ComponentFixture<CoinAssetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoinAssetsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CoinAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
