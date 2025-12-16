import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Post } from '../../../core/models/post.model';
import { FeedService } from '../../../core/services/feed.service';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './post-card.html',
  styleUrls: ['./post-card.css']
})
export class PostCardComponent {
  @Input() post!: Post;

  isLiking = false;

  isModalOpen = false;
  isLoadingComments = false;

  newCommentContent: string = '';
  isAddingComment = false;

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

  openModal() {
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden';

    if (!this.post.commentsList || this.post.commentsList.length === 0) {
      this.loadComments();
    }
  }

  closeModal() {
    this.isModalOpen = false;
    document.body.style.overflow = '';
  }

    loadComments() {
    this.isLoadingComments = true;
    this.feedService.getCommentsForPost(this.post.id).subscribe({
      next: (comments) => {
        this.post.commentsList = comments;
        this.isLoadingComments = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoadingComments = false;
      }
    });
  }

  addComment() {
    if (!this.newCommentContent.trim() || this.isAddingComment) {
      return;
    }

    this.isAddingComment = true;

    this.feedService.addComment(this.post.id, this.newCommentContent).subscribe({
      next: (comment) => {
        if (!this.post.commentsList) {
          this.post.commentsList = [];
        }
        
        this.post.commentsList.push(comment);
        
        this.post.comments++;
        
        this.newCommentContent = '';
        this.isAddingComment = false;
        
      },
      error: (err) => {
        console.error('Błąd podczas dodawania komentarza', err);
        this.isAddingComment = false;
      }
    });
  }
}