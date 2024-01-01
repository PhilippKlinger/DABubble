import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddChannelmembersComponent } from './dialog-add-channelmembers.component';

describe('DialogAddChannelmembersComponent', () => {
  let component: DialogAddChannelmembersComponent;
  let fixture: ComponentFixture<DialogAddChannelmembersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogAddChannelmembersComponent]
    });
    fixture = TestBed.createComponent(DialogAddChannelmembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
