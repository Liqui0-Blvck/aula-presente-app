import { Component, OnInit } from '@angular/core';
import { Horario, Horarios } from 'src/app/models';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-horarios',
  templateUrl: './horarios.page.html',
  styleUrls: ['./horarios.page.scss'],
})
export class HorariosPage implements OnInit {
  diasSemana: string[] = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]


  componentes: { [key: string]: any[] } = {};

  horarios: Horarios = {
    horario: [],
    uid: ''
  }

  

  constructor(
    private data: SharedService
  ) {
    this.componentes = {};
  }

  ngOnInit() {

    this.data.getHorarios().subscribe((horario) => {
      if(horario) {
        this.horarios = horario;

        const horariosPorDia: { [key: string]: any[] } = {};
        
        console.log(horario)
        this.horarios.horario.forEach((hora) => {
          hora.fecha_clase.forEach((clase) => {
            if (clase.dia) {

              const diaLowerCase = clase.dia.toLowerCase();
    

              if (!horariosPorDia[diaLowerCase]) {
                horariosPorDia[diaLowerCase] = [];
              }
              horariosPorDia[diaLowerCase].push(hora);
            }
          });
          
        });
        
        this.componentes = {}

        this.diasSemana.forEach((dia) => {
          if (horariosPorDia[dia.toLowerCase()]) {
            this.componentes[dia] = horariosPorDia[dia.toLowerCase()];
          }
        });
   
      }
    })
  }

  verificarDiaYHoraClase(diaClase: string, diaActual: string): boolean {
    return diaClase.toLowerCase() === diaActual.toLowerCase();
  }

  getKeys(obj: any): string[] {
    return Object.keys(obj);
  }

}
