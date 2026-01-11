import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authUrl = 'http://localhost:8080/api/authentication';
  private usersUrl = 'http://localhost:8080/api/users';
  
  constructor(private http: HttpClient) { }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.authUrl}/register`, userData, { responseType: 'text' });
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.authUrl}/authenticate`, credentials).pipe(
      tap(response => {
        if (response && response.authenticationToken) {
          localStorage.setItem('access_token', response.authenticationToken);
          console.log('Token zapisany pomyślnie');
        } else {
          console.error('Błąd: Backend nie zwrócił pola authenticationToken', response);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    console.log('Użytkownik wylogowany');
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.usersUrl}/me`);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }
}