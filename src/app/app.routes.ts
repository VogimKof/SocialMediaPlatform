import { Routes } from '@angular/router';
import { RegisterComponent } from './features/register/register.component'; 
import { LoginComponent } from './features/login/login.component';
import { FeedComponent } from './features/feed/feed';
import { Profile } from './features/profile/profile';
import { guestGuard } from './core/guards/guest-guard';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
  { path: 'feed', component: FeedComponent, canActivate: [authGuard] },
  { path: 'profile/:id', component: Profile, canActivate: [authGuard] }
];