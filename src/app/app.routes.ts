import { Routes } from '@angular/router';
import { RegisterComponent } from './features/register/register.component'; 
import { LoginComponent } from './features/login/login.component';
import { FeedComponent } from './features/feed/feed';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'feed', component: FeedComponent } 
];