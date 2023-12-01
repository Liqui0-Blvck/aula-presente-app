import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Carrera, Horarios, User } from 'src/app/models';
import { Subscription } from 'rxjs';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
// import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';



@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  public uid = '';
  public instituto = '';
  public fechaActual = new Date();
  public nombreDia = ''
  public dia = this.fechaActual.getDate();
  public nombreMes = this.obtenerNombreMes(this.fechaActual.getMonth());

  public showCard!: false;

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
  
  carrera: Carrera = {
    asignaturas: [],
    nombre: ''
  };


  mostrarComponente!: boolean;
  camera: boolean = false;

  

  subscriberUserInfo!: Subscription;

  constructor(
    private auth: AuthenticationService,
    private firebase: FirestoreService,
    private router: Router,
    private data: SharedService
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

  horarios: Horarios = {
    horario: [],
    uid: ''
  }

  componentes: any[] = [];
  
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

  async ngOnInit() {
    // BarcodeScanner.isSupported().then((result) => {
    //   this.isSupported = result.supported
    // })
  }

  ngOnDestroy() {
    if (this.subscriberUserInfo) {
      this.subscriberUserInfo.unsubscribe();
    }

    Camera.requestPermissions() 
  
  
  }

  getUserInfo(uid: string) {
    const path = 'users';
    this.subscriberUserInfo = this.firebase.getDoc<User>(path, uid).subscribe((res) => {
      if (res) {

        this.user = res;
        this.data.setUser(this.user)

        if (!this.mostrarComponente) {
          this.getHorario(this.user.horario);
        }
      } else {
        console.log('desconectado');
      }
    });
  }


  getHorario(horario_id: string){
  const path = 'horarios';
  this.firebase.getDoc<Horarios>(path, horario_id).subscribe(res => {
    if(res){
      this.horarios = res;
      console.log(this.horarios)

      this.data.setHorarios(this.horarios)

      const diaActual = new Date().toLocaleDateString('es-US', { weekday: 'long' }).toLowerCase();
      const diaCapitalizado = diaActual.charAt(0).toUpperCase() + diaActual.slice(1);
      this.nombreDia = diaCapitalizado

      this.mostrarComponente = false; 
      this.componentes = [];
      
      this.horarios.horario.forEach((hora) => {
        hora.fecha_clase.forEach((casa) => {
          if (casa.dia && this.verificarDiaYHoraClase('lunes', 'lunes')) {
            this.componentes.push(hora)
            this.mostrarComponente = true;
          }
        });
      });
    }

  });
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

  startScan = async () => {
    // Check camera permission
    // This is just a simple example, check out the better checks below
    await BarcodeScanner.checkPermission({ force: true });
  
    // make background of WebView transparent
    // note: if you are using ionic this might not be enough, check below
    BarcodeScanner.hideBackground();
  
    const result = await BarcodeScanner.startScan(); // start scanning and wait for a result
  
    // if the result has content
    if (result.hasContent) {
      console.log(result.content); // log the raw scanned content
    }
  };

  isSupported = false;
  // barcodes: Barcode[] = []

  // requestPermissions() => Promise<PermissionStatus>

  // async scan(): Promise<void> {
  //   const granted = await this.requestPermissions()
  // }
  // async takePicture () {
  //   const image = await Camera.getPhoto({
  //     quality: 90,
  //     allowEditing: false,
  //     resultType: CameraResultType.Uri,
  //     source: CameraSource.Camera
  //   });
  
  //   // image.webPath will contain a path that can be set as an image src.
  //   // You can access the original file using image.path, which can be
  //   // passed to the Filesystem API to read the raw data of the image,
  //   // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
  //   var imageUrl = image.webPath;
  
  //   // Can be set to the src of an image now
  //   // imageElement.src = imageUrl;   
  //   this.camera = true 
  // }  

}








