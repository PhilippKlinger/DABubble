import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainContentThreadChatUpperPartComponent } from './main-content-thread-chat-upper-part.component';

describe('MainContentThreadChatUpperPartComponent', () => {
  let component: MainContentThreadChatUpperPartComponent;
  let fixture: ComponentFixture<MainContentThreadChatUpperPartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainContentThreadChatUpperPartComponent]
    });
    fixture = TestBed.createComponent(MainContentThreadChatUpperPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
