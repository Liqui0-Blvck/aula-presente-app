import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterTwoPage } from './register-two.page';

describe('RegisterTwoPage', () => {
  let component: RegisterTwoPage;
  let fixture: ComponentFixture<RegisterTwoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RegisterTwoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
