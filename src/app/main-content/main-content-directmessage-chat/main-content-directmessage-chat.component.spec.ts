import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainContentDirectmessageChatComponent } from './main-content-directmessage-chat.component';

describe('MainContentDirectmessageChatComponent', () => {
  let component: MainContentDirectmessageChatComponent;
  let fixture: ComponentFixture<MainContentDirectmessageChatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainContentDirectmessageChatComponent]
    });
    fixture = TestBed.createComponent(MainContentDirectmessageChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
