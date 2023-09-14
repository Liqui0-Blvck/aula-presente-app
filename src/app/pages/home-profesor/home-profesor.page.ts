import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Curso, HorarioCurso, Profesor, User } from 'src/app/models';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { SharedService } from 'src/app/services/shared.service';


@Component({
  selector: 'app-home-profesor',
  templateUrl: './home-profesor.page.html',
  styleUrls: ['./home-profesor.page.scss'],
})

export class HomeProfesorPage implements OnInit {
  public uid = '';
  public instituto = '';
  public fechaActual = new Date();
  public nombreDia = ''
  public dia = this.fechaActual.getDate();
  public nombreMes = this.obtenerNombreMes(this.fechaActual.getMonth());

  componentes: any[] = [];

  cursos: Profesor = {
    uid: ' ',
    cursos: []
  }

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
  subscriberUserInfo!: Subscription;
  mostrarComponente!: boolean;

  constructor(
    public loadingCtrl: LoadingController,
    private auth: AuthenticationService,
    private firebase: FirestoreService,
    private data: SharedService,
    private router: Router
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

  ngOnInit() {
  }

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

  getUserInfo(uid: string) {
    const path = 'users';
    this.subscriberUserInfo = this.firebase.getDoc<User>(path, uid).subscribe((res) => {
      if (res) {

        this.user = res;
        this.data.setUser(this.user)

        if (!this.mostrarComponente) {
          this.getCursos(this.user.horario);
        }
      } else {
        console.log('desconectado');
      }
    });
  }

  getCursos(curso_id: string){
    const path = 'horarios'
    this.firebase.getDoc<Profesor>(path, curso_id).subscribe(res => {
      if(res){
        this.cursos = res
        this.data.setProfesor(res)
      }

      const diaActual = new Date().toLocaleDateString('es-US', { weekday: 'long' }).toLowerCase();
      const diaCapitalizado = diaActual.charAt(0).toUpperCase() + diaActual.slice(1);
      this.nombreDia = diaCapitalizado

      this.mostrarComponente = false; 
      this.componentes = [];

      this.cursos.cursos.forEach(horarios => {
        horarios.horario.forEach(fecha => {
          if(fecha.dia && this.verificarDiaYHoraClase(fecha.dia, diaActual)){
            this.componentes.push(horarios)
            this.mostrarComponente = true;
          }
        })
      })
    })
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


  async itemClicked(item: Curso) {
    const loading = await this.loadingCtrl.create();
    await loading.present();
    // Realizar la actualización en la lista
    console.log(item)
    const dataToUpdate = this.componentes.map((element) => {
      if (element.codigo === item.codigo) {

        const suma = element.cantidad_alumnos + 1;
        return {
          ...element,
          cantidad_alumnos: suma,
        };
      } else {

        return element;
      }
    });

    this.data.setCurso(item)
    

    this.cursos.cursos = dataToUpdate
    // const path = 'horarios'

    
  
    // Asegúrate de actualizar los datos en Firebase si es necesario
    // this.firebase.updateDoc(this.cursos, path, this.user.uid)
    // .then(() => {
    //   console.log('Datos personales actualizados con éxito');
    // })
    // .catch((error) => {
    //   console.error('Error al actualizar datos personales:', error);
    // });
  
    // También puedes navegar a otra página con los detalles del elemento, si es necesario.
    loading.dismiss();
    this.router.navigate(['/barcode']);
  }

  
}
