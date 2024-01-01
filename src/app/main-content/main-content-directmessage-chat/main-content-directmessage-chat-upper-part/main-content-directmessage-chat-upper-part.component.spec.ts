import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainContentDirectmessageChatUpperPartComponent } from './main-content-directmessage-chat-upper-part.component';

describe('MainContentDirectmessageChatUpperPartComponent', () => {
  let component: MainContentDirectmessageChatUpperPartComponent;
  let fixture: ComponentFixture<MainContentDirectmessageChatUpperPartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainContentDirectmessageChatUpperPartComponent]
    });
    fixture = TestBed.createComponent(MainContentDirectmessageChatUpperPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
