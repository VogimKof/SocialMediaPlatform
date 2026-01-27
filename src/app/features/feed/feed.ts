import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostCardComponent } from '../../shared/components/post-card/post-card';
import { FeedService } from '../../core/services/feed.service';
import { Post } from '../../core/models/post.model';
import { User } from '../../core/models/user.model';
import { AuthService } from '../../core/services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, PostCardComponent, FormsModule],
  templateUrl: './feed.html',
  styleUrls: ['./feed.css']
})
export class FeedComponent implements OnInit {
  posts: Post[] = [];
  contacts: User[] = [];
  currentUser: User | null = null;
  avatarUrl: string =''
  newPostContent: string = '';
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private feedService: FeedService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.feedService.getPosts().subscribe({
      next: (data) => {
        this.posts = data;
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
        this.avatarUrl = user.avatarUrl || `https://placehold.co/168x168/2d88ff/ffffff?text=${user.firstName?.charAt(0)}`
        this.currentUser = user;
      },
      error: (err) => console.error('Nie udało się pobrać ID użytkownika', err)
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
  }

  onCreatePost(): void {
    if (!this.newPostContent.trim() && !this.imagePreview) return;

    this.feedService.createPost(this.newPostContent, this.imagePreview || undefined).subscribe({
      next: (newPost) => {
        this.posts = [newPost, ...this.posts];
        this.newPostContent = '';
        this.removeImage();
      },
      error: (err) => {
        console.error('Błąd podczas dodawania postu', err);
        alert('Nie udało się opublikować postu.');
      }
    });
  }

  onPostRemoved(postId: number) {
    this.posts = this.posts.filter(p => p.id !== postId);
  }
}