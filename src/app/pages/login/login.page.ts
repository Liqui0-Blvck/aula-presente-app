import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';


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

  

  constructor(
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private authServices: AuthenticationService,
    private router: Router,

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
        const user = await this.authServices.loginUser(this.logForm.value.email, this.logForm.value.password).then(res => {
          loading.dismiss()
          this.router.navigate(['/home'])
        })

      } catch(error) {
        console.log(error)
        loading.dismiss()
      }
    } else {
      // Campos no válidos, muestra un mensaje de error.
      this.setOpen(true)
      loading.dismiss()
    }
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }


}
