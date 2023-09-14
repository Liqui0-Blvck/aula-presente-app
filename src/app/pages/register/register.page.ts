import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { SharedService } from 'src/app/services/shared.service';
import { User } from 'src/app/models';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {


  regForm!: FormGroup;

  hidePassword: boolean = true;

  constructor(
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public authService: AuthenticationService,
    public firebase: FirestoreService,
    private data: SharedService,
    public router: Router) { }

  ngOnInit() {
    this.regForm = this.formBuilder.group({
      nombre: ['',[Validators.required]],
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
      ],
      rol: ['estudiante']
    })
  }

  get errorControl(){
    return this.regForm?.controls
  }

  async signUp() {
    const loading = await this.loadingCtrl.create();
    await loading.present();
  
    if (this.regForm?.valid) {
      try {
        const user = await this.authService.registerUser(this.regForm.value.email, this.regForm.value.password);
        if (user && user.user)  {
          const userData = {
            uid: user.user.uid,
            email: this.regForm.value.email,
            datos_personales: {
              cuidad: '',
              apellido: '',
              numero_celular: '',
              direccion: '',
              nombre: this.regForm.value.nombre,
            },
            institucion: '',
            carrera: '',
            rol: this.regForm.value.rol,
            horario: '',
          };

          console.log(this.regForm.value.rol)
          const path = 'users'
          
          this.firebase.createDoc(userData, path, String(user.user?.uid))

          this.data.setUser(userData)

          loading.dismiss();
          this.router.navigate(['/register-two']);
        } else {
          // Mostrar un mensaje de error al usuario si el registro no tiene éxito.
          console.log('No se pudo registrar al usuario.');
        }
      } catch (error) {
        // Mostrar un mensaje de error al usuario si ocurre un error en el registro.
        console.error(error);
      } finally {
        loading.dismiss();
      }
    }

    loading.dismiss()
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  signUpAsProfe() {
    const currentRole = this.regForm.get('rol')?.value;
    const newRole = currentRole === 'estudiante' ? 'profesor' : 'estudiante';
    this.regForm.get('rol')?.setValue(newRole);
    console.log('Rol actual:', newRole);
  }

  
}
