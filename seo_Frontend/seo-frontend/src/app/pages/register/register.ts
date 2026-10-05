import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {

  form = {
    username: '',
    email: '',
    password: '',
    password2: '',
    role: 'editor'
  };

  loading = false;
  error = '';

  constructor(
    private api: ApiService,
    private router: Router
  ) {}

  register() {
    this.error = '';

    // Check password confirmation
    if (this.form.password !== this.form.password2) {
      this.error = 'Passwords do not match.';
      return;
    }

    // Basic validation
    if (!this.form.username.trim()) {
      this.error = 'Please enter a username.';
      return;
    }

    if (!this.form.email.trim()) {
      this.error = 'Please enter your email.';
      return;
    }

    if (!this.form.password) {
      this.error = 'Please enter a password.';
      return;
    }

    this.loading = true;

    this.api.register(this.form).subscribe({

      next: () => {

        // Registration successful → automatically login
        this.api.login({
          username: this.form.username,
          password: this.form.password
        }).subscribe({

          next: (r: any) => {

            localStorage.setItem('token', r.access);
            localStorage.setItem('refresh', r.refresh);
            localStorage.setItem(
              'username',
              r.username || this.form.username
            );
            localStorage.setItem(
              'email',
              r.email || this.form.email
            );

            this.router.navigate(['/dashboard']);
          },

          error: () => {
            this.error =
              'Account created successfully, but automatic login failed. Please go to Login and sign in.';
            this.loading = false;
          }

        });

      },

      error: (e) => {

        console.log('REGISTER ERROR:', e);
        console.log('SERVER RESPONSE:', e.error);

        // Display Django validation errors
        if (e.error && typeof e.error === 'object') {

          this.error = Object.entries(e.error)
            .map(([field, message]: any) => {

              const text = Array.isArray(message)
                ? message.join(', ')
                : String(message);

              return `${field}: ${text}`;

            })
            .join(' | ');

        } else {

          this.error =
            e.error ||
            'Could not create the account. Please try again.';
        }

        this.loading = false;
      }

    });
  }
}