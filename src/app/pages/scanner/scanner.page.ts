import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { VIDEO_CONFIG } from './config.const';
import jsQR from 'jsQR'
import { Subject, takeUntil, timer } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { SharedService } from 'src/app/services/shared.service';
import { Horario, Horarios, User } from 'src/app/models';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Camera, CameraResultType } from '@capacitor/camera';


@Component({
  selector: 'app-scanner',  
  templateUrl: './scanner.page.html',
  styleUrls: ['./scanner.page.scss'],
})
export class ScannerPage implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('videoElement') video!: ElementRef<HTMLVideoElement>
  @ViewChild('canvas', {static: true}) canvas!: ElementRef

  videoStream!: MediaStream

  config = structuredClone(VIDEO_CONFIG)

  private destroy$ = new Subject<void>()

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

  horarios: Horarios = {
    horario: [],
    uid: ''
  }

  componentes: any[] = [];

  
  uid: string = ''
  codigo: string = ''

  constructor(
    private router: Router,
    private sharedData: SharedService,
    private route: ActivatedRoute,
    private firebase: FirestoreService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.codigo = params['codigo']
      this.uid = params['uid']
    });

    this.sharedData.getUser().subscribe(res => {
      if(res){
        this.user = res
      }
    })

    this.firebase.getDoc<Horarios>('horarios', this.user.horario).subscribe((res) => {
      if(res){
        this.horarios = res
      }
    })

  }
  

  ngAfterViewInit(): void {
      this.prepareScanner()
  }

  async prepareScanner(){
    const available: any = await this.checkCamera()
    if(available) this.startScanner()
  }

  changeCamera(){
    let { facingMode } = this.config.video
    
    this.config.video.facingMode = facingMode === 'environment' ? 'user' : 'environment'
    this.startScanner()
  }

  async startScanner(){
    
    try {
      this.videoStream = await navigator.mediaDevices.getUserMedia(this.config);
    
      this.video.nativeElement.srcObject = this.videoStream
    } catch (error) {
      console.error('Error al iniciar la fuente de video:', error);
    }
    

    this.spyCamera()
  }


  spyCamera(){
    if (this.video.nativeElement) {
      const { clientWidth, clientHeight } = this.video.nativeElement

      this.canvas.nativeElement.width = clientWidth
      this.canvas.nativeElement.height = clientHeight

      const canvas = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D

      canvas.drawImage(this.video.nativeElement, 0, 0, clientWidth, clientHeight)

      const inversionAttempts = 'dontInvert'

      const image = canvas.getImageData(0, 0, clientWidth, clientHeight)
      const qrcode = jsQR(image.data, image.width, clientHeight, {inversionAttempts})
      
      if(qrcode){
        this.componentes = [];
        const data = JSON.parse(qrcode.data)


        if(this.codigo !== data.codigo){
          Swal.fire({
            icon: 'error',
            title: 'Código QR incorrecto',
            text: `El código QR escaneado no corresponde a la clase ${data.nombre}` ,
            heightAuto: false
          }).then(() => {
            this.router.navigate(['/home'])
          })
        } else {
          this.updateData(data)
        }
      } else {
        timer(500).pipe(takeUntil(this.destroy$)).subscribe(() => {
          this.spyCamera()
        })
      }
    }
  }

  updateData(data: any){
    const path = 'horarios'
    const updatedData = this.horarios.horario.map((elemento) => {
      if(elemento.codigo === data.codigo){

        const suma = elemento.asistencia+1
        return {
          ...elemento,
          asistencia: suma
        }
      } else {
        return elemento;
      }
    })

    this.horarios.horario = updatedData

    if(this.uid === this.user.uid){
      this.firebase.updateDoc(this.horarios, path, this.user.horario)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: 'Asistencia Exitosa',
          text: 'Asistencia registrada con exito',
          timer: 1500,
          heightAuto: false
        }).then((res) => {
          if(res){
            this.router.navigate(['/home'])
          }
        })
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: error,
          text: 'No logrado',
          timer: 1500,
          heightAuto: false
        }).then((res) => {
          if(res){
            this.router.navigate(['/home'])
          }
        })
      });
    }
  }

   async checkCamera(){
    const cameraPermission = await navigator.permissions.query({name: 'camera'} as any)

    const isOk = cameraPermission.state !== 'denied'

    const hasMediaDevice = 'mediaDevices' in navigator
    const hasUserMedia = 'getUserMedia' in navigator.mediaDevices

    if(!hasMediaDevice || (!hasUserMedia && isOk)){

    }
    return cameraPermission.state !== 'denied'
  }

  ngOnDestroy(): void {

    this.videoStream.getTracks().forEach((track) => track.stop())
    this.video = null!

    this.destroy$.next()
    this.destroy$.complete()
  }
}

