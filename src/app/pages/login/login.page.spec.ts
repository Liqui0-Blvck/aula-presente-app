import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { LoginPage } from './login.page';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { SharedService } from 'src/app/services/shared.service';
import { User } from 'src/app/models';


describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let authServiceSpy: jasmine.SpyObj<AuthenticationService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;

  beforeEach(waitForAsync(() => {
    authServiceSpy = jasmine.createSpyObj('AuthenticationService', ['loginUser']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    modalControllerSpy = jasmine.createSpyObj('ModalController', ['create']);

    TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [ReactiveFormsModule, IonicModule],
      providers: [
        FormBuilder,
        { provide: AuthenticationService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: FirestoreService, useValue: {} },
        { provide: SharedService, useValue: {} },
        { provide: NavController, useValue: {} },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show an error message if login fails', async () => {
    // Arrange
    authServiceSpy.loginUser.and.returnValue(Promise.reject('Login failed'));
    component.logForm.setValue({
      email: 'test@profe.com',
      password: 'password123',
    });

    // Act
    await component.login();

    // Assert
    expect(authServiceSpy.loginUser).toHaveBeenCalledWith('test@profe.com', 'password123');
    expect(routerSpy.navigate).not.toHaveBeenCalled(); // Make sure navigation is not called
    // Add additional assertions for the error message display
  });

  // Add more test cases as needed
});
