import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainContentMainChatUpperPartComponent } from './main-content-main-chat-upper-part.component';

describe('MainContentMainChatUpperPartComponent', () => {
  let component: MainContentMainChatUpperPartComponent;
  let fixture: ComponentFixture<MainContentMainChatUpperPartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainContentMainChatUpperPartComponent]
    });
    fixture = TestBed.createComponent(MainContentMainChatUpperPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
