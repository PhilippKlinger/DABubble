import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainContentLogoComponent } from './main-content-logo.component';

describe('MainContentLogoComponent', () => {
  let component: MainContentLogoComponent;
  let fixture: ComponentFixture<MainContentLogoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainContentLogoComponent]
    });
    fixture = TestBed.createComponent(MainContentLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
