import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Profesor } from 'src/app/models';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  isAlertOpen = false;
  public alertButton = ['OK']

  logForm!: FormGroup

  setOpen(isOpen: boolean){
    this.isAlertOpen = isOpen
    console.log(this.isAlertOpen)
  }

  hidePassword: boolean = true;

  rol: string = 'profesor'
  userRol: string = ''
  

  constructor(
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private authServices: AuthenticationService,
    private router: Router,
    private firestore: FirestoreService

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
    const loading = await this.loadingCtrl.create();
    await loading.present();

    if(this.logForm?.valid) {
      try {
        const user = await this.authServices.loginUser(this.logForm.value.email, this.logForm.value.password).then(async res => {
          console.log(this.userRol)

          if (this.rol === 'estudiante') {
            this.router.navigate(['/home']);
          } else if (this.rol === 'profesor') {

            const profeData = {
              "uid": "W9Atxt7FLRTC2GjpIcjPJ00djvW2",
              "cursos": [
                {
                  "codigo": "CSY4111",
                  "nombre": "Calidad de Software",
                  "descripcion": "Curso de Calidad de Software",
                  "horario": [
                    {
                      "dia": "lunes",
                      "hora_inicio": "09:00",
                      "hora_fin": "11:00",
                      "aula": "Aula 101"
                    },
                    {
                      "dia": "miércoles",
                      "hora_inicio": "09:00",
                      "hora_fin": "11:00",
                      "aula": "Aula 101"
                    }
                  ],
                  "cantidad_alumnos": 5,
                  "asistencias_alumnos": [
                    {
                      "nombre": "Alumno 1",
                      "asistencias": 9
                    },
                    {
                      "nombre": "Alumno 2",
                      "asistencias": 10
                    },
                    {
                      "nombre": "Alumno 3",
                      "asistencias": 8
                    },
                    {
                      "nombre": "Alumno 4",
                      "asistencias": 9
                    },
                    {
                      "nombre": "Alumno 5",
                      "asistencias": 7
                    }
                  ]
                },
                {
                  "codigo": "INU2101",
                  "nombre": "Ingles Basico II",
                  "descripcion": "Curso de Ingles Basico II",
                  "horario": [
                    {
                      "dia": "martes",
                      "hora_inicio": "14:00",
                      "hora_fin": "16:00",
                      "aula": "Aula 102"
                    },
                    {
                      "dia": "jueves",
                      "hora_inicio": "14:00",
                      "hora_fin": "16:00",
                      "aula": "Aula 102"
                    }
                  ],
                  "cantidad_alumnos": 5,
                  "asistencias_alumnos": [
                    {
                      "nombre": "Alumno 6",
                      "asistencias": 8
                    },
                    {
                      "nombre": "Alumno 7",
                      "asistencias": 9
                    },
                    {
                      "nombre": "Alumno 8",
                      "asistencias": 7
                    },
                    {
                      "nombre": "Alumno 9",
                      "asistencias": 10
                    },
                    {
                      "nombre": "Alumno 10",
                      "asistencias": 6
                    }
                  ]
                },
                {
                  "codigo": "BIY7121",
                  "nombre": "Minería de Datos",
                  "descripcion": "Curso de Minería de Datos",
                  "horario": [
                    {
                      "dia": "miércoles",
                      "hora_inicio": "16:00",
                      "hora_fin": "18:00",
                      "aula": "Aula 103"
                    },
                    {
                      "dia": "viernes",
                      "hora_inicio": "16:00",
                      "hora_fin": "18:00",
                      "aula": "Aula 103"
                    }
                  ],
                  "cantidad_alumnos": 5,
                  "asistencias_alumnos": [
                    {
                      "nombre": "Alumno 11",
                      "asistencias": 9
                    },
                    {
                      "nombre": "Alumno 12",
                      "asistencias": 8
                    },
                    {
                      "nombre": "Alumno 13",
                      "asistencias": 7
                    },
                    {
                      "nombre": "Alumno 14",
                      "asistencias": 10
                    },
                    {
                      "nombre": "Alumno 15",
                      "asistencias": 6
                    }
                  ]
                }
              ]
            }
            
            // const uide = 'BoxZF3Kn0rMCmOjfeO1fRE6BJfk2'

            // this.firestore.createDoc(profeData,'horarios', 'W9Atxt7FLRTC2GjpIcjPJ00djvW2')
            this.router.navigate(['/home-profesor']);
          } else {
            // Rol desconocido o no manejado, puedes redirigir a una página de error o manejarlo de otra manera
          }


          loading.dismiss()
        })

      } catch(error) {
        console.log(error)
        loading.dismiss()
      }
    } else {
      this.setOpen(true)
      loading.dismiss()
    }
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  loginProfe(){
    this.rol = this.rol === 'estudiante' ? 'profesor' : 'estudiante';
    console.log(this.rol)
  }

}
