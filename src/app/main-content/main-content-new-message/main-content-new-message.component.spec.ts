import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainContentNewMessageComponent } from './main-content-new-message.component';

describe('MainContentNewMessageComponent', () => {
  let component: MainContentNewMessageComponent;
  let fixture: ComponentFixture<MainContentNewMessageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainContentNewMessageComponent]
    });
    fixture = TestBed.createComponent(MainContentNewMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
