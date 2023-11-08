import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ToastController } from '@ionic/angular';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage {
  email: string = '';

  constructor(private modalController: ModalController,
              private authService: AuthenticationService,
              private toastController: ToastController) {}



  async resetPassword() {
    try {
      await this.authService.resetPassword(this.email);
      Swal.fire({
        text: 'Se ha enviado el mail de recuperacion',
        icon: 'success',
        heightAuto: false,
        position: 'bottom',
        timer: 1000
      }).then(() => {
        this.dismissModal()
      })
    } catch (error) {
      // Manejar errores, por ejemplo, mostrar un mensaje de error
    }
  }

  dismissModal() {
    this.modalController.dismiss();
  }
}
