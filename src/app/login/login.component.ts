  import { Component } from '@angular/core';
  import { FormBuilder, FormGroup, Validators } from '@angular/forms';
  import { Router } from '@angular/router';
  import { AuthService } from '../auth.service';

  @Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
  })
  export class LoginComponent {
    loginForm: FormGroup;
    errorMessage: string = '';

    constructor(
      private formBuilder: FormBuilder,
      private authService: AuthService,
      private router: Router
    ) {
      this.loginForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
      });
    }

    get f() { return this.loginForm.controls; }

    login() {
      if (this.loginForm.invalid) {
        return;
      }
    
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;
    
      this.authService.login(email, password).subscribe({
        next: () => {
          this.router.navigate(['/main']);
        },
        error: (err) => {
          this.errorMessage = err.error.message || 'Login failed';
        }
      });
    }
    goToSignup(): void {
      this.router.navigate(['/signup']);
    }
    
  }
