import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainContentWorkspaceHeaderComponent } from './main-content-workspace-header.component';

describe('MainContentWorkspaceHeaderComponent', () => {
  let component: MainContentWorkspaceHeaderComponent;
  let fixture: ComponentFixture<MainContentWorkspaceHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainContentWorkspaceHeaderComponent]
    });
    fixture = TestBed.createComponent(MainContentWorkspaceHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
