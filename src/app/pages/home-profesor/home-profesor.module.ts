import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeProfesorPageRoutingModule } from './home-profesor-routing.module';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { HomeProfesorPage } from './home-profesor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeProfesorPageRoutingModule
  ],
  declarations: [HomeProfesorPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeProfesorPageModule {}
