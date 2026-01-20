import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { first } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { AutofocusDirective } from '../../shared/directives/autofocus-directive';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, AutofocusDirective],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  isSubmitted = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      gender: ['', Validators.required]
    }, { 
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    
    if (password && confirmPassword && password !== confirmPassword) {
      return { mismatch: true };
    }
    return null;
  }

  onSubmit() {
    this.isSubmitted = true;

    if (this.registerForm.valid) {
      this.isLoading = true;

      const formValues = this.registerForm.value;

      const registerData = {
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        sex: formValues.gender,
        email: formValues.email,
        password: formValues.password
      };
      
      this.authService.register(registerData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = 'Konto zostało utworzone pomyślnie!';
          
          this.registerForm.reset();
          this.isSubmitted = false; 
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.errorMessage = "Istnieje już konto z takim adresem email."
          this.isLoading = false;
          console.error(err);
        }
      });
    } 
  }
}