import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainContentMainChatLowerPartComponent } from './main-content-main-chat-lower-part.component';

describe('MainContentMainChatLowerPartComponent', () => {
  let component: MainContentMainChatLowerPartComponent;
  let fixture: ComponentFixture<MainContentMainChatLowerPartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainContentMainChatLowerPartComponent]
    });
    fixture = TestBed.createComponent(MainContentMainChatLowerPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
