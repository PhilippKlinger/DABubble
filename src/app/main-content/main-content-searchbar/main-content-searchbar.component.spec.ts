import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainContentSearchbarComponent } from './main-content-searchbar.component';

describe('MainContentSearchbarComponent', () => {
  let component: MainContentSearchbarComponent;
  let fixture: ComponentFixture<MainContentSearchbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainContentSearchbarComponent]
    });
    fixture = TestBed.createComponent(MainContentSearchbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
