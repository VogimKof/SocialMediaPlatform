import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '../../../core/models/post.model';
import { FeedService } from '../../../core/services/feed.service';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-card.html',
  styleUrls: ['./post-card.css']
})
export class PostCardComponent {
  @Input() post!: Post;

  isLiking = false;

  constructor(private feedService: FeedService) {}

  toggleLike() {
    if (this.isLiking) return;
    
    const previousState = this.post.isLikedByCurrentUser;
    const previousLikes = this.post.likes;

    if (this.post.isLikedByCurrentUser) {
      this.post.likes--;
      this.post.isLikedByCurrentUser = false;
    } else {
      this.post.likes++;
      this.post.isLikedByCurrentUser = true;
    }

    this.isLiking = true;
    this.feedService.likePost(this.post.id).subscribe({
      next: () => {
        this.isLiking = false;
        console.log('Request do backendu');
      },
      error: () => {
        this.post.isLikedByCurrentUser = previousState;
        this.post.likes = previousLikes;
        this.isLiking = false;
        console.error('Error');
      }
    });
  }
}