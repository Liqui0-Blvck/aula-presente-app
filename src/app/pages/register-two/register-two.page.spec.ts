import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterTwoPage } from './register-two.page';

describe('RegisterTwoPage', () => {
  let component: RegisterTwoPage;
  let fixture: ComponentFixture<RegisterTwoPage>;

  beforeEach((() => {
    fixture = TestBed.createComponent(RegisterTwoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

function async(arg0: () => void): jasmine.ImplementationCallback {
  throw new Error('Function not implemented.');
}
