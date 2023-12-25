import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainContentThreadChatComponent } from './main-content-thread-chat.component';

describe('MainContentThreadChatComponent', () => {
  let component: MainContentThreadChatComponent;
  let fixture: ComponentFixture<MainContentThreadChatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainContentThreadChatComponent]
    });
    fixture = TestBed.createComponent(MainContentThreadChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
