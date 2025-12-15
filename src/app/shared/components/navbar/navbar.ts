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
  isMessagesOpen = false;

  messages = [
    { id: 1, sender: 'Jan Kowalski', text: 'Cześć! Idziemy na kawę?', time: '10 min temu', isRead: false, avatar: 'https://placehold.co/40/007bff/ffffff?text=JK' },
    { id: 2, sender: 'Anna Nowak', text: 'Wysłałam Ci pliki na maila.', time: '2 godz. temu', isRead: false, avatar: 'https://placehold.co/40/dc3545/ffffff?text=AN' },
    { id: 3, sender: 'Piotr Zieliński', text: 'Dzięki za pomoc z Angularem!', time: '1 dzień temu', isRead: true, avatar: 'https://placehold.co/40/28a745/ffffff?text=PZ' },
    { id: 4, sender: 'Kasia Design', text: 'Zerknij na ten nowy layout.', time: '2 dni temu', isRead: true, avatar: 'https://placehold.co/40/ffc107/ffffff?text=KD' },
    { id: 5, sender: 'Marek Developer', text: 'Pull request zaakceptowany.', time: '3 dni temu', isRead: true, avatar: 'https://placehold.co/40/17a2b8/ffffff?text=MD' },
    { id: 6, sender: 'Szef', text: 'Spotkanie przełożone na 14:00.', time: '1 tydz. temu', isRead: true, avatar: 'https://placehold.co/40/6610f2/ffffff?text=S' }
  ];

  notifications = [
    { id: 1, text: 'Anna Nowak polubiła Twój post.', time: '5 min temu', isRead: false, avatar: 'https://placehold.co/40/dc3545/ffffff?text=AN' },
    { id: 2, text: 'Marek Developer skomentował: "Super kod!"', time: '1 godz. temu', isRead: true, avatar: 'https://placehold.co/40/17a2b8/ffffff?text=MD' },
    { id: 3, text: 'Masz nowe zaproszenie do grona znajomych.', time: '2 godz. temu', isRead: true, avatar: 'https://placehold.co/40/28a745/ffffff?text=PZ' }
  ];

  constructor(private authService: AuthService, private router: Router){}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      this.isNotificationsOpen = false;
      this.isMessagesOpen = false;
    }
  }

  toggleNotifications() {
    this.isNotificationsOpen = !this.isNotificationsOpen;
    if (this.isNotificationsOpen) {
      this.isMenuOpen = false;
      this.isMessagesOpen = false;
    }
  }

  toggleMessages() {
    this.isMessagesOpen = !this.isMessagesOpen;
    if (this.isMessagesOpen) {
      this.isMenuOpen = false;
      this.isNotificationsOpen = false;
    }
  }

  logout(){
    this.authService.logout();
    this.isMenuOpen = false;
    this.router.navigate(['/login'])
  }
}