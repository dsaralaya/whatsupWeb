import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from '../component/header/header.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    HeaderComponent
  ],
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule
  ],
  exports: [ReactiveFormsModule, FormsModule, HeaderComponent]
})
export class SharedModule { }
