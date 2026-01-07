import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/authentication';
  
  constructor(private http: HttpClient) { }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData, { responseType: 'text' });
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/authenticate`, credentials).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('access_token', response.token);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    console.log('Użytkownik wylogowany');
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }
}