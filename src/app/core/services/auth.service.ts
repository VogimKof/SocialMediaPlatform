import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  register(userData: any): Observable<boolean> {
    console.log('Wysyłanie danych do "backendu":', userData);
    
    return of(true).pipe(delay(1500));
  }

  login(credentials: any): Observable<boolean> {
    console.log('Logowanie:', credentials);
    return of(true).pipe(delay(1500));
  }

  logout(): void {
    console.log('Użytkownik wylogowany');
  }
}