import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { User } from 'src/app/models';
@Component({
  selector: 'app-detalles-cuenta',
  templateUrl: './detalles-cuenta.page.html',
  styleUrls: ['./detalles-cuenta.page.scss'],
})
export class DetallesCuentaPage implements OnInit {
  public uid = ''

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

  userForm!: FormGroup

  subscriberUserInfo!: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private auth: AuthenticationService,
    private router: Router,
    private firebase: FirestoreService
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
    this.userForm = this.formBuilder.group({
      nombre: [],
      apellido: [''],
      direccion: [''],
      cuidad: [''],
      celular: ['']
    })
  }

  clearUserData() {
    this.uid = '';
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
    this.subscriberUserInfo = this.firebase.getDoc<User>(path, uid).subscribe((res) => {
      if (res) {
        this.user = res;
        
        this.userForm.patchValue({
          nombre: this.user.datos_personales.nombre,
          apellido: this.user.datos_personales.apellido,
          direccion: this.user.datos_personales.direccion,
          cuidad: this.user.datos_personales.cuidad,
          celular: this.user.datos_personales.numero_celular
        });

      } else {
        console.log('desconectado');
      }
    });
  }

  isUpdating = false; 

  async updateUser() {

    if (this.isUpdating) {
      // Si ya está en proceso de actualización, no hagas nada
      return;
    }
    const path = 'users';
    
  
    if (this.userForm.valid) {
      this.isUpdating = true;

      // Obtén el documento actual del usuario
      const userData = this.user
          // Extrae el campo "datos_personales" del documento actual
          const datosPersonalesActuales = userData.datos_personales;
  
          // Actualiza los campos dentro de "datos_personales" con los nuevos valores del formulario
          datosPersonalesActuales.apellido = this.userForm.get('apellido')?.value;
          datosPersonalesActuales.nombre = this.userForm.get('nombre')?.value;
          datosPersonalesActuales.direccion = this.userForm.get('direccion')?.value;
          datosPersonalesActuales.cuidad = this.userForm.get('cuidad')?.value;
          datosPersonalesActuales.numero_celular = this.userForm.get('celular')?.value;
  
          // Combina el objeto actualizado de "datos_personales" con el documento existente
          const userToUpdate: User = {
            ...userData,
            datos_personales: datosPersonalesActuales
          };

          console.log(userToUpdate)
          // Actualiza el documento en Firestore

            this.firebase.updateDoc(userToUpdate, path, userToUpdate.uid)
              .then(() => {
                console.log('Datos personales actualizados con éxito');
                this.isUpdating = false; 
              })
              .catch((error) => {
                console.error('Error al actualizar datos personales:', error);
              });
        } else {
          console.error('El documento del usuario no se encontró.');
        }
    }
}
