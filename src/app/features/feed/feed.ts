import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostCardComponent } from '../../shared/components/post-card/post-card';
import { FeedService } from '../../core/services/feed.service';
import { Post } from '../../core/models/post.model';
import { User } from '../../core/models/user.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, PostCardComponent],
  templateUrl: './feed.html',
  styleUrls: ['./feed.css']
})
export class FeedComponent implements OnInit {
  posts: Post[] = [];
  contacts: User[] = [];
  currentUser: User | null = null;

  constructor(
    private feedService: FeedService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.feedService.getPosts().subscribe({
      next: (data) => {
        this.posts = data;
        console.log('Pobrano posty:', this.posts);
      },
      error: (err) => console.error('Błąd pobierania postów', err)
    });

    this.feedService.getContacts().subscribe({
      next: (data) => {
        this.contacts = data;
      },
      error: (err) => console.error('Błąd pobierania kontaktów', err)
    });

    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
      },
      error: (err) => console.error('Błąd pobierania danych użytkownika', err)
    });
  }
}