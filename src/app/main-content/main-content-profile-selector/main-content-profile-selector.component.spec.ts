import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainContentProfileSelectorComponent } from './main-content-profile-selector.component';

describe('MainContentProfileSelectorComponent', () => {
  let component: MainContentProfileSelectorComponent;
  let fixture: ComponentFixture<MainContentProfileSelectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainContentProfileSelectorComponent]
    });
    fixture = TestBed.createComponent(MainContentProfileSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
