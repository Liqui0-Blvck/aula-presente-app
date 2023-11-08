import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlumnosPage } from './alumnos.page';
import { Observable, of } from 'rxjs';
import { Profesor } from 'src/app/models';
import { SharedService } from 'src/app/services/shared.service';
import { IonicModule } from '@ionic/angular';

describe('AlumnosPage', () => {
  let component: AlumnosPage;
  let fixture: ComponentFixture<AlumnosPage>;
  let sharedService: SharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlumnosPage],
      imports: [
        IonicModule
      ],
      providers: [SharedService],
    });
    fixture = TestBed.createComponent(AlumnosPage);
    component = fixture.componentInstance;
    sharedService = TestBed.inject(SharedService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not set profesor when SharedService does not return data', () => {
    // Simula el comportamiento de SharedService para no devolver ningún dato
    spyOn(sharedService, 'getProfesor').and.returnValue(of(null));

    // Llama al método ngOnInit del componente
    component.ngOnInit();

    // Verifica que el objeto profesor del componente siga siendo nulo
    expect(component.profesor).toBeUndefined();
  });
});
