import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {
  isMenuOpen = false;

  constructor(private authService: AuthService, private router: Router){}

  toggleMenu(){
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(){
    this.authService.logout();
    this.isMenuOpen = false;
    this.router.navigate(['/login'])
  }
}