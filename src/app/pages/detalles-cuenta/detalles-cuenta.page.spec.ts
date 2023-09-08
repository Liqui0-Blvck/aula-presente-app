import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetallesCuentaPage } from './detalles-cuenta.page';

describe('DetallesCuentaPage', () => {
  let component: DetallesCuentaPage;
  let fixture: ComponentFixture<DetallesCuentaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DetallesCuentaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
