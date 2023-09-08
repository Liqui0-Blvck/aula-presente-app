import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Carrera, Horario ,Horarios, User } from 'src/app/models';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router'


@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.page.html',
  styleUrls: ['./asistencia.page.scss'],
})
export class AsistenciaPage implements OnInit {

  public date = new Date()

  public fecha = this.date.toISOString().split('T')[0]

  public hora = this.date.toLocaleTimeString()

  public año = this.date.getFullYear()

  horarios: Horarios = {
    horario: [],
    uid_student: ''
  }

  public uid = '';
  session: boolean = false;

  carrera!: string;

  user: User = {
    uid: '',
    email: '',
    fullname: '',
    institucion: '',
    carrera: '',
    horario: '',
    datos_personales: {
      apellido: '',
      nombre: '',
      direccion: '',
      cuidad: '',
      numero_celular: ''
    }
  };

  subscriberUserInfo!: Subscription;
  
  total!: string;

  constructor(
    public auth: AuthenticationService,
    public firebase: FirestoreService,
    public router: Router
  ) {
    this.auth.stateAuth().subscribe(res => {
      if(res !== null){
        this.uid = res.uid
        this.getUserInfo(this.uid)
        this.session = true
      } else {
        this.handleSessionEnd()
      }
    })
  }

  async ngOnInit() {
    const uid = await this.auth.getProfile()
  }

  handleSessionEnd() {
    this.uid= ''
    this.user = {
      uid: '',
      email: '',
      fullname: '',
      institucion: '',
      carrera: '',
      horario: '',
      datos_personales: {
        apellido: '',
        nombre: '',
        direccion: '',
        cuidad: '',
        numero_celular: ''
      }
  }
}

  
  getUserInfo(uid: string){
    const path = 'users'
    this.subscriberUserInfo = this.firebase.getDoc<User>(path, uid).subscribe(res => {
      if(res){
        this.user = res
        this.getHorario(this.user.horario)
        this.getInstitucion(this.user.carrera)
      }
    })
  }


  getHorario(horario_id: string){
    const path = 'horarios'
    this.firebase.getDoc<Horarios>(path, horario_id).subscribe(res => {
      if(res){
        this.horarios = res
      }
    })
  }

  getInstitucion(institucion_id: string){
    const path = 'carreras'
    this.firebase.getDoc<Carrera>(path, institucion_id).subscribe(res => {
      if(res){
        this.carrera = res.nombre
      }
    })
  }

  
  getPorcentajeAsistencia(valor1: number, asistencia: number ){
    let total
    if (asistencia >= valor1){
      total = (valor1 / asistencia) * 100
    } else {
      total = 0
    }
    return total.toFixed(1)
  }

}
