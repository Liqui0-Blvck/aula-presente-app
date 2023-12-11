import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BarcodePage } from './barcode.page';
import { SharedService } from 'src/app/services/shared.service';
import { of } from 'rxjs';
import { Curso } from 'src/app/models';

describe('BarcodePage', () => {
  let component: BarcodePage;
  let fixture: ComponentFixture<BarcodePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BarcodePage],
      providers: [SharedService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarcodePage);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call generateQRCode on ngOnInit', () => {
    spyOn(component, 'generateQRCode');

    // Simulamos la respuesta falsa del servicio con el tipo correcto
    const fakeCurso: Curso = {
      nombre: 'Fake Curso',
      codigo: '123',
      descripcion: 'Fake Descripción',
      horario: [],
      asistenciaActual: 0,
      alumnosInscritos: []
    };

    spyOn(TestBed.inject(SharedService), 'getCurso').and.returnValue(of(fakeCurso));

    component.ngOnInit();

    expect(component.generateQRCode).toHaveBeenCalledOnceWith(
      JSON.stringify(fakeCurso)
    );
  });

  it('should generate QR code on generateQRCode', () => {
    const testData = 'testData';
    component.generateQRCode(testData);

    const expectedUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(testData)}&size=400x600`;

    expect(component.qrCodeUrl).toBe(expectedUrl);
  });
});
