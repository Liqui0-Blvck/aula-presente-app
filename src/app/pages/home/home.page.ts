import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Carrera, Horario, Horarios, User } from 'src/app/models';
import { Subscription } from 'rxjs';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  public uid = '';
  public instituto = '';
  public fechaActual = new Date();
  public nombreDia = ''
  public dia = this.fechaActual.getDate();
  public nombreMes = this.obtenerNombreMes(this.fechaActual.getMonth());

  public showCard!: false;

  user: User = {
    uid: '',
    email: '',
    institucion: '',
    carrera: '',
    horario: '',
    rol: '',
    datos_personales: {
      apellido: '',
      nombre: '',
      direccion: '',
      cuidad: '',
      numero_celular: ''
    }
  };
  
  carrera: Carrera = {
    asignaturas: [],
    nombre: ''
  };


  mostrarComponente!: boolean;
  camera: boolean = false;

  selectedClase!: {}

  subscriberUserInfo!: Subscription;

  constructor(
    private auth: AuthenticationService,
    private firebase: FirestoreService,
    private router: Router,
    private data: SharedService
  ) {
    this.auth.stateAuth().subscribe((res) => {
      if (res !== null) {
        this.uid = res.uid;
        this.getUserInfo(this.uid);
      } else {
        this.clearUserData();
      }
    });
  }

  horarios: Horarios = {
    horario: [],
    uid: ''
  }

  componentes: any[] = [];
  
  clearUserData() {
    this.uid = '';
    this.user = {
      uid: '',
      email: '',
      institucion: '',
      carrera: '',
      horario: '',
      rol: '',
      datos_personales: {
        apellido: '',
        nombre: '',
        direccion: '',
        cuidad: '',
        numero_celular: ''
    }
    };
  }

  async ngOnInit() {
  }

  ngOnDestroy() {
    if (this.subscriberUserInfo) {
      this.subscriberUserInfo.unsubscribe();
    }

    Camera.requestPermissions() 
  
  
  }

  getUserInfo(uid: string) {
    const path = 'users';
    this.subscriberUserInfo = this.firebase.getDoc<User>(path, uid).subscribe((res) => {
      if (res) {

        this.user = res;
        this.data.setUser(this.user)

        if (!this.mostrarComponente) {
          this.getHorario(this.user.horario);
        }
      } else {
        console.log('desconectado');
      }
    });
  }


  getHorario(horario_id: string){
  const path = 'horarios';
  this.firebase.getDoc<Horarios>(path, horario_id).subscribe(res => {
    if(res){
      this.horarios = res;

      this.data.setHorarios(this.horarios)

      const diaActual = new Date().toLocaleDateString('es-US', { weekday: 'long' }).toLowerCase();
      const diaCapitalizado = diaActual.charAt(0).toUpperCase() + diaActual.slice(1);
      this.nombreDia = diaCapitalizado

      this.mostrarComponente = false; 
      this.componentes = [];
      
      this.horarios.horario.forEach((hora) => {
        hora.fecha_clase.forEach((casa) => {
          if (casa.dia && this.verificarDiaYHoraClase(casa.dia,'jueves')) {
            this.componentes.push(hora)
            this.mostrarComponente = true;
          }
        });
      });
    }

  });
}

 obtenerNombreMes(numeroMes: number) {
  const nombresMeses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    return nombresMeses[numeroMes];
  }

  verificarDiaYHoraClase(diaClase: string, diaActual: string): boolean {
    return diaClase.toLowerCase() === diaActual.toLowerCase();
  }

  numeroVecesPresionado = 0;
  maximoPresionesPermitidas = 2;
  clasesRegistradas: { [codigo: string]: boolean } = {}; 

  startScan(clase: Horario){
    const { codigo, curso, aula } = clase
    const claseData = {
      uid: this.uid,
      codigo,
      curso,
      aula
    }
    
    if (!this.clasesRegistradas[codigo]) {
  
      if (this.numeroVecesPresionado < this.maximoPresionesPermitidas) {

        this.clasesRegistradas[clase.codigo] = true;
  
        this.router.navigate(['/scanner', claseData]); 

        this.numeroVecesPresionado++;

      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Ya registraste tu asistencia',
        heightAuto: false,
        timer: 1500
      });
    }
  }
}