import { Component, OnInit, Input, Host } from '@angular/core';
import { FormControl, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'error-message',
  templateUrl: './field-error-message.component.html',
  styleUrls: ['./field-error-message.component.scss']
})
export class FieldErrorMessageComponent implements OnInit {
  @Input() errorMsg: string;
  @Input() label: string;
  @Input() patternAllowed: string;
  @Input() controlName: string;
  @Input() control: FormControl;
  @Input() submitted: boolean;

  constructor(@Host() private _formDir: FormGroupDirective) {

  }
  get displayError() {
    this.control = this._formDir.control.get(this.controlName) as FormControl;
    if (!this.control) {
      this.control = this._formDir.directives.find(t => t.name === this.controlName).control;
    }
    if (this.control && this.control.invalid && (this.control.dirty || this.control.touched || this.submitted)) {
      if (this.control.errors) {
        if (this.control.errors.required) {
          this.errorMsg = `${this.label} is required`;
        } else if (this.control.errors.minlength) {
          this.errorMsg = `${this.label}  must be ${this.control.errors.minlength.requiredLength} character or more`;
        } else if (this.control.errors.maxlength) {
          this.errorMsg = `Maximum length is ${this.control.errors.maxlength.requiredLength}`;
        } else if (this.control.errors.pattern) {
          this.errorMsg = `${this.label} can only contain ${this.patternAllowed}`;
        } else if (this.control.errors.email) {
          this.errorMsg = 'Invalid email id';
        } else if (this.control.errors['Mask error']) {
          this.errorMsg = `Invalid ${this.label}`;
        } else if (this.control.errors['samecity']) {
          this.errorMsg = `Please select different city`;
        } else if (this.control.errors['MAX']) {
          this.errorMsg = `Amount should be less than total amount`;
        } else if (this.control.errors['MAXDATE']) {
          this.errorMsg = `Date should be greater than pickup date`;
        } else if (this.control.errors['MINDATE']) {
          this.errorMsg = `Date should be less than to date`;
        } else if (this.control.errors['minError']) {
          this.errorMsg = `Date should not be less than current date`;
        } else if (this.control.errors['maxError']) {
          this.errorMsg = `Date should be less than current date`;
        } else if (this.control.errors['MinNum']) {
          this.errorMsg = `Should be greater than zero`;
        }
        return true;
      }
    }
    return false;
  }


  ngOnInit() {

  }

}
