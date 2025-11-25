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
}