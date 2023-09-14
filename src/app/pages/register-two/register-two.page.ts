import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { User } from 'src/app/models';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-register-two',
  templateUrl: './register-two.page.html',
  styleUrls: ['./register-two.page.scss'],
})
export class RegisterTwoPage implements OnInit {

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
          
          console.log(userData)
        
            this.firebase.updateDoc(userToUpdate, path, userToUpdate.uid)
              .then(() => {
                console.log('Datos personales actualizados con éxito');
                this.isUpdating = false; 
              })
              .catch((error) => {
                console.error('Error al actualizar datos personales:', error);
              });
        }

    else {
      console.error('El documento del usuario no se encontró.');
    }
  }
}
