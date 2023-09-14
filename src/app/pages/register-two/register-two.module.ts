import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterTwoPageRoutingModule } from './register-two-routing.module';

import { RegisterTwoPage } from './register-two.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RegisterTwoPageRoutingModule
  ],
  declarations: [RegisterTwoPage]
})
export class RegisterTwoPageModule {}
