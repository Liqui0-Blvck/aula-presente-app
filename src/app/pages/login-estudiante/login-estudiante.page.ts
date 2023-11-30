import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';
import Swal from 'sweetalert2'
import { ModalController } from '@ionic/angular';
import { ResetPasswordPage } from '../reset-password/reset-password.page';
import { SharedService } from 'src/app/services/shared.service';
import { User } from 'src/app/models';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-login-estudiante',
  templateUrl: './login-estudiante.page.html',
  styleUrls: ['./login-estudiante.page.scss'],
})
export class LoginEstudiantePage implements OnInit {

  logForm!: FormGroup

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

  public uid = ''
  
  hidePassword: boolean = true;

  rol: string = 'estudiante'
  rolp: string = 'profesor'

  constructor(
    private formBuilder: FormBuilder,
    private authServices: AuthenticationService,
    private router: Router,
    private firestore: FirestoreService,
    private modalController: ModalController,
    private sharedData: SharedService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.logForm = this.formBuilder.group({
      email: ['',
      [
        Validators.required,
        Validators.email,
        Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
      ]
      ],
      password: ['', 
      [
        Validators.required,
        Validators.pattern("(^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$)")
      ]
      ]
    })

  }


  async login(){
    if(this.logForm?.valid) {
      try {
        const profe = this.logForm.value.email.split("@")[1].includes("profe")
        await this.authServices.loginUser(this.logForm.value.email, this.logForm.value.password).then(async res => {
          if (this.rol === 'estudiante' && this.rolp === 'profesor' && !profe) {
              Swal.fire({
                text: 'Correcto inicio de sesion',
                icon: 'success',
                heightAuto: false,
                position: 'bottom',
                timer: 1000
              })
              .then(() => {
                this.router.navigate(['/home']);
              })
            } else {
              Swal.fire({
                text: 'Usuario no encontrado',
                icon: 'error',
                timer: 1000,
                heightAuto: false
              })
            }
          })
      } catch(error) {
        Swal.fire({
          text: 'Usuario no encontrado',
          icon: 'error',
          timer: 1000,
          heightAuto: false
        })
      }
    } else {

      Swal.fire({
        text: 'Debes ingresar datos para ingresar',
        icon: 'error',
        timer: 1500,
        heightAuto: false
      })
    }


  }


  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  loginProfe(){
    this.router.navigate(["/login"])
  }

  async openResetPasswordModal() {
    const modal = await this.modalController.create({
      component: ResetPasswordPage,
    });
    return await modal.present();
  }
}
