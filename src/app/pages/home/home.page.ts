import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Carrera, Horarios, User } from 'src/app/models';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  public uid = '';
  public instituto = '';

  public showCard!: false;

  user: User = {
    uid: '',
    email: '',
    fullname: '',
    institucion: '',
    carrera: '',
    horario: ''
  };

  carrera: Carrera = {
    asignaturas: [],
    nombre: '',
  };


  mostrarComponente!: boolean;

  

  subscriberUserInfo!: Subscription;

  constructor(
    private auth: AuthenticationService,
    private firebase: FirestoreService,
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
    uid_student: ''
  }

  componentes: any[] = [];
  
  clearUserData() {
    this.uid = '';
    this.user = {
      uid: '',
      email: '',
      fullname: '',
      institucion: '',
      carrera: '',
      horario: ''
    };
  }

  async ngOnInit() {
  }

  ngOnDestroy() {
    if (this.subscriberUserInfo) {
      this.subscriberUserInfo.unsubscribe();
    }
  }

  getUserInfo(uid: string) {
    const path = 'users';
    this.subscriberUserInfo = this.firebase.getDoc<User>(path, uid).subscribe((res) => {
      if (res) {
        this.user = res;
        this.getInfoCarrera(this.user.carrera) 
        if (!this.mostrarComponente) {
          this.getHorario(this.user.horario);
        }
      } else {
        console.log('desconectado');
      }
    });
  }

  getInfoCarrera(carreraId: string) {
    const path = 'carreras';
    this.firebase.getDoc<Carrera>(path, carreraId).subscribe((res) => {
      if (res) {
        this.carrera.nombre = res.nombre;
      } else {
        console.log('La carrera no fue encontrada.');
      }
    });
  }

  getHorario(horario_id: string){
  const path = 'horarios';
  this.firebase.getDoc<Horarios>(path, horario_id).subscribe(res => {
    if(res){
      this.horarios = res;
      const diaActual = new Date().toLocaleDateString('es-US', { weekday: 'long' }).toLowerCase();
      this.mostrarComponente = false; 
      this.componentes = [];
      
      this.horarios.horario.forEach((hora) => {
        hora.fecha_clase.forEach((casa) => {
          if (casa.dia && this.verificarDiaYHoraClase(casa.dia, 'jueves')) {
            this.componentes.push(hora)
            this.mostrarComponente = true;
          }
        });
      });
    }
  });
}

verificarDiaYHoraClase(diaClase: string, diaActual: string): boolean {
  return diaClase.toLowerCase() === diaActual.toLowerCase();
}



}
