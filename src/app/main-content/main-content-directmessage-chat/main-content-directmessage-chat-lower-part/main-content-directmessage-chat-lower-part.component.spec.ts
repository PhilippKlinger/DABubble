import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainContentDirectmessageChatLowerPartComponent } from './main-content-directmessage-chat-lower-part.component';

describe('MainContentDirectmessageChatLowerPartComponent', () => {
  let component: MainContentDirectmessageChatLowerPartComponent;
  let fixture: ComponentFixture<MainContentDirectmessageChatLowerPartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainContentDirectmessageChatLowerPartComponent]
    });
    fixture = TestBed.createComponent(MainContentDirectmessageChatLowerPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
