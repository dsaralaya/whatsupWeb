import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from './component/header/header.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FieldErrorMessageComponent } from './component/field-error-message/field-error-message.component';
import { ConfirmDialogComponent } from './component/confirm-dialog/confirm-dialog.component';
import { NotifyComponent } from './component/notify/notify.component';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    HeaderComponent,
    FieldErrorMessageComponent,
    ConfirmDialogComponent,
    NotifyComponent
  ],
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule, NgSelectModule
  ],
  exports: [ReactiveFormsModule, FormsModule, HeaderComponent, FieldErrorMessageComponent,
    ConfirmDialogComponent, NotifyComponent, NgSelectModule]
})
export class SharedModule { }
