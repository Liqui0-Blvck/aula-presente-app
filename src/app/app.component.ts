import { Component, OnInit } from '@angular/core';
import { FirestoreService } from './services/firestore.service';
import { AuthenticationService } from './services/authentication.service';
import { User } from './models';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { register } from 'swiper/element/bundle';
import { Platform } from '@ionic/angular';




register();
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public appPages = [
    { title: 'Home', url: '/home', icon: 'mail' },
    { title: 'Asistencias', url: '/asistencia', icon: 'paper-plane' },
    { title: 'Horarios', url: '/asignaturas', icon: 'heart' },
  ];

  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  public buttons = [
    { title: 'Iniciar Sesión', url: '/login' },
    { title: 'Registrarse', url: '/register' }
  ];

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
  session: boolean = false;
  public uid = '';

  constructor(
    private firebase: FirestoreService,
    private authServices: AuthenticationService,
    private router: Router,
    private platform: Platform
  ) {
    this.authServices.stateAuth().subscribe(res => {
      if (res !== null) {
        this.uid = res.uid
        this.getUserInfo(this.uid)
        this.session = true
      } else {
        this.handleSessionEnd()
      }
    });

  }

  async ngOnInit() {
    const uid = await this.authServices.getProfile()

    this.platform.backButton.subscribeWithPriority(0, () => {
      // Evita que el gesto de deslizamiento regrese al componente anterior.
      this.platform.backButton.unsubscribe();
    });
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
    };
  }


  getUserInfo(uid: string) {
    const path = 'users';
    this.subscriberUserInfo = this.firebase.getDoc<User>(path, uid).subscribe(res => {
      if (res) {
        this.user = res;
      }
    });
  }

  async salir() {
    if (this.session) {
      await this.authServices.signOut()
      this.subscriberUserInfo.unsubscribe()
      this.session = false;
    }
  }
}
