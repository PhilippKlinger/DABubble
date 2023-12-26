import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainContentSideBarComponent } from './main-content-side-bar.component';

describe('MainContentSideBarComponent', () => {
  let component: MainContentSideBarComponent;
  let fixture: ComponentFixture<MainContentSideBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainContentSideBarComponent]
    });
    fixture = TestBed.createComponent(MainContentSideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
