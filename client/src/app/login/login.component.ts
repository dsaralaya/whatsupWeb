import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { CrudeService } from '../shared/service/crud.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../shared/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  error = false;
  constructor(private authService: AuthenticationService, private router: Router, private route: ActivatedRoute) {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      if (currentUser.role === 'admin') {
        this.router.navigate(['/admin/dashboard']);
          } else {
        this.router.navigate(['/chat']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {
    this.generateForm();
  }

  generateForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', { validators: [Validators.required, Validators.email], updateOn: 'blur' }),
      password: new FormControl('', { validators: [Validators.required], updateOn: 'blur' })
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe((res: any) => {
        if (res !== [] && res.statusCode === '200') {
          if (res.data.role === 'admin') {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.router.navigate(['/chat']);
          }
        } else {
          this.error = true;
        }
      });
    }
  }
}
