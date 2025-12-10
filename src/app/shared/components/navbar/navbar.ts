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
  isNotificationsOpen = false;

  notifications = [
    { id: 1, text: 'Anna Nowak polubiła Twój post.', time: '5 min temu', isRead: false, avatar: 'https://placehold.co/40/dc3545/ffffff?text=AN' },
    { id: 2, text: 'Marek Developer skomentował: "Super kod!"', time: '1 godz. temu', isRead: true, avatar: 'https://placehold.co/40/17a2b8/ffffff?text=MD' },
    { id: 3, text: 'Masz nowe zaproszenie do grona znajomych.', time: '2 godz. temu', isRead: true, avatar: 'https://placehold.co/40/28a745/ffffff?text=PZ' }
  ];

  constructor(private authService: AuthService, private router: Router){}

  toggleMenu(){
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleNotifications() {
    this.isNotificationsOpen = !this.isNotificationsOpen;
    if (this.isNotificationsOpen) this.isMenuOpen = false; // Zamknij profil, jeśli otwierasz powiadomienia
  }

  logout(){
    this.authService.logout();
    this.isMenuOpen = false;
    this.router.navigate(['/login'])
  }
}