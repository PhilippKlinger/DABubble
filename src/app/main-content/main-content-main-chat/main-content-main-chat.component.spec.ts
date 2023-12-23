import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainContentMainChatComponent } from './main-content-main-chat.component';

describe('MainContentMainChatComponent', () => {
  let component: MainContentMainChatComponent;
  let fixture: ComponentFixture<MainContentMainChatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainContentMainChatComponent]
    });
    fixture = TestBed.createComponent(MainContentMainChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
