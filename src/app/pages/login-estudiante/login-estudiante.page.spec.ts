import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginEstudiantePage } from './login-estudiante.page';

describe('LoginEstudiantePage', () => {
  let component: LoginEstudiantePage;
  let fixture: ComponentFixture<LoginEstudiantePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LoginEstudiantePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
