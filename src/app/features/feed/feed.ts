import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/components/navbar/navbar';
import { PostCardComponent } from '../../shared/components/post-card/post-card';
import { FeedService } from '../../core/services/feed.service';
import { Post } from '../../core/models/post.model';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, NavbarComponent, PostCardComponent], // <--- Ważne importy!
  templateUrl: './feed.html',
  styleUrls: ['./feed.css']
})
export class FeedComponent implements OnInit {
  posts: Post[] = [];
  contacts: User[] = [];

  constructor(private feedService: FeedService) {}

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
  }
}