import { Component, OnInit, ViewChild } from '@angular/core';
import { 
  ApexAxisChartSeries,
  ApexChart,
  ApexPlotOptions,
  ApexDataLabels, 
  ApexXAxis,
  ApexYAxis,
  ApexTitleSubtitle} from 'ng-apexcharts';

import { Alumno, Profesor } from 'src/app/models';
import { SharedService } from 'src/app/services/shared.service';


export type ChartOptions = {
  chart: ApexChart,
  series: ApexAxisChartSeries | any[],
  plotOptions: ApexPlotOptions,
  dataLabels: ApexDataLabels
  xaxis: ApexXAxis,
  yaxis: ApexYAxis,
  title: ApexTitleSubtitle
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  public options: Partial<ChartOptions> = {}

  cursos: Profesor = {
    uid: '',
    cursos:[]
  }

  seriesData: any[] = []
  categories: string[] = []
  countCursos: number = 0
  countAlumnos: number = 0
  countAlumnosRi: number = 0
  claseSeleccionada: any; 

  constructor(
    private data: SharedService
  ) { 
  }

  ngOnInit() {
    this.data.getProfesor().subscribe(res => {
      if(res){
        this.cursos = res

        
        this.claseSeleccionada = this.cursos.cursos[0]
        this.seriesData = this.claseSeleccionada.alumnosInscritos.map((alumnos: Alumno) => (alumnos.asistencias / this.claseSeleccionada.asistenciasRegistradas) * 100)
        this.categories = this.claseSeleccionada.alumnosInscritos.map((alumnos: Alumno) => alumnos.nombre)        
      }
    })
    this.cardInfo(this.claseSeleccionada)
    this.chartFunction(this.seriesData, this.categories); 
  }

  seleccionarClase(clase: any) {
    this.claseSeleccionada = clase;
    this.cardInfo(clase)

    this.seriesData = this.claseSeleccionada.alumnosInscritos.map((alumnos: Alumno) => (alumnos.asistencias / this.claseSeleccionada.asistenciasRegistradas) * 100)
    this.categories = this.claseSeleccionada.alumnosInscritos.map((alumnos: Alumno) => alumnos.nombre)   

    this.chartFunction(this.seriesData, this.categories); // Actualiza el gráfico con los datos de la clase seleccionada
  }

  chartFunction(data: any[], categories: any[]){
    const flattenedData = data.reduce((acc, currentValue) => acc.concat(currentValue), []);
    const flattenedCategories = categories.reduce((acc, currentValue) => acc.concat(currentValue), []);

    console.log(data, categories)

    this.options = {
      series: [{
        name: 'Asistencia',
        data: flattenedData
      }],
        chart: {
        height: 350,
        type: 'bar',
      },
      plotOptions: {
        bar: {
          borderRadius: 5,
          horizontal: true,
          columnWidth: '100%',
          barHeight: '90%',
          colors: {
            ranges: [{
              from: 20,
              to: 50,
              color: "#eb445a"
            },
            {
              from: 50,
              to: 75,
              color: "#ffc409"
            }],
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function(val){
          return val + '%' 
        },
        style: {
          fontSize: '12px',
          colors: ["white"]
        }
      },
      
      xaxis: {
        categories: flattenedCategories,
        axisBorder: {
          show: true
        }
      },
      yaxis: {
        show: true,
        min: 0,
        max: 100,
        axisBorder: {
          show: true
        },
        axisTicks: {
          show: true,
        },
      
      },
      title: {
        text: 'Alumnos',
        floating: true,
        offsetY: 0,
        align: 'center',
        style: {
          color: '#444'
        }
      }
      };
  }

  cardInfo(clase: any) {
    if(clase){
      const info = this.cursos;
    this.countCursos = info.cursos.length;
    this.countAlumnosRi = 0;
  
    this.countAlumnos = clase.alumnosInscritos.length

    clase.alumnosInscritos.forEach((alumno: Alumno) => {
      const ri = alumno.asistencias / clase.asistenciasRegistradas
      if (ri <= 0.75){
        this.countAlumnosRi++
      }
    })
    }
  }
    

}
