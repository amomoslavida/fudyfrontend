import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  signup(): void {
    if (this.signupForm.invalid) {
      
      this.errorMessage = 'Please ensure all fields are filled out correctly.';
      return;
    }

    const email = this.signupForm.get('email')?.value;
    const password = this.signupForm.get('password')?.value;

    this.authService.signup(email, password).subscribe({
      next: () => {
      
        this.router.navigate(['/main']);
      },
      error: (err) => {
       
        if (err.error?.message) {
         
          this.errorMessage = err.error.message;
        } else if (err.status === 0) {
         
          this.errorMessage = 'Unable to connect to the server. Please try again later.';
        } else {
        
          this.errorMessage = 'Signup failed. Please try again.';
        }
      }
    });
  }
}
