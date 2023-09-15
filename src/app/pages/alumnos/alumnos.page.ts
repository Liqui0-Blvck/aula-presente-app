import { Component, OnInit } from '@angular/core';
import { Profesor } from 'src/app/models';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-alumnos',
  templateUrl: './alumnos.page.html',
  styleUrls: ['./alumnos.page.scss'],
})
export class AlumnosPage implements OnInit {

  profesor!: Profesor;

  constructor(
    private data: SharedService
  ) { }

  ngOnInit() {

    this.data.getProfesor().subscribe(res => {
      if(res){
        this.profesor = res
        console.log(res)
      }
    })
  }


}
