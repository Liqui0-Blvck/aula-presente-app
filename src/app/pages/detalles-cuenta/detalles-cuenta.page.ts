import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { User } from 'src/app/models';
import { SharedService } from 'src/app/services/shared.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-detalles-cuenta',
  templateUrl: './detalles-cuenta.page.html',
  styleUrls: ['./detalles-cuenta.page.scss'],
})
export class DetallesCuentaPage implements OnInit {
  
  public uid = ''
  isUpdating = false; 
  userForm!: FormGroup
  subscriberUserInfo!: Subscription;

  user: User = {
    uid: '',
    email: '',
    institucion: '',
    carrera: '',
    rol: '',
    horario: '',
    datos_personales: {
      apellido: '',
      nombre: '',
      direccion: '',
      cuidad: '',
      numero_celular: ''
    }
  };

  constructor(
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private auth: AuthenticationService,
    private data: SharedService,
    private firebase: FirestoreService
  ) { }

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      nombre: [],
      apellido: [''],
      direccion: [''],
      cuidad: [''],
      celular: ['']
    })

    this.data.getUser().subscribe((user) => {
      if(user){
        this.user = user;

        this.userForm.patchValue({
          nombre: this.user.datos_personales.nombre,
          apellido: this.user.datos_personales.apellido,
          direccion: this.user.datos_personales.direccion,
          cuidad: this.user.datos_personales.cuidad,
          celular: this.user.datos_personales.numero_celular
        });
      }
    })
  }

  clearUserData() {
    this.uid = '';
    this.user = {
      uid: '',
      email: '',
      rol: '',
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

  

  async updateUser() {
    if (this.isUpdating) {
      return;
    }
    const path = 'users';
    
  
    if (this.userForm.valid) {
      this.isUpdating = true;

      const userData = this.user
          
          const datosPersonalesActuales = userData.datos_personales;
  
          
          datosPersonalesActuales.apellido = this.userForm.get('apellido')?.value;
          datosPersonalesActuales.nombre = this.userForm.get('nombre')?.value;
          datosPersonalesActuales.direccion = this.userForm.get('direccion')?.value;
          datosPersonalesActuales.cuidad = this.userForm.get('cuidad')?.value;
          datosPersonalesActuales.numero_celular = this.userForm.get('celular')?.value;
  
          
          const userToUpdate: User = {
            ...userData,
            datos_personales: datosPersonalesActuales
          };
        
            this.firebase.updateDoc(userToUpdate, path, userToUpdate.uid)
              .then(() => {
                console.log('Datos personales actualizados con éxito');
                this.isUpdating = false; 
              })
              .catch((error) => {
                console.error('Error al actualizar datos personales:', error);
              });

          Swal.fire({
            text: 'Cambios guardado con exito',
            icon: 'success',
            heightAuto: false,
            timer: 1500,
            position: 'bottom'
          })
        }


    else {
      console.error('El documento del usuario no se encontró.');
    }
  }
}
