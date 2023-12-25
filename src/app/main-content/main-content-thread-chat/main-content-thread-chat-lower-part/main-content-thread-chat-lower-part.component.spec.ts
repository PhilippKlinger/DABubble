import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainContentThreadChatLowerPartComponent } from './main-content-thread-chat-lower-part.component';

describe('MainContentThreadChatLowerPartComponent', () => {
  let component: MainContentThreadChatLowerPartComponent;
  let fixture: ComponentFixture<MainContentThreadChatLowerPartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainContentThreadChatLowerPartComponent]
    });
    fixture = TestBed.createComponent(MainContentThreadChatLowerPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
