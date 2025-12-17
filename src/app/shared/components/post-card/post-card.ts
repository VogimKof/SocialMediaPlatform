import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Post } from '../../../core/models/post.model';
import { FeedService } from '../../../core/services/feed.service';
import { Comment } from '../../../core/models/comment.model';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './post-card.html',
  styleUrls: ['./post-card.css']
})
export class PostCardComponent {
  @Input() post!: Post;

  @ViewChild('commentInput') commentInput!: ElementRef;

  isModalOpen = false;
  isLoadingComments = false;

  newCommentContent: string = '';
  isAddingComment = false;

  constructor(private feedService: FeedService) {}

  toggleLike() {
    
    const previousState = this.post.isLikedByCurrentUser;
    const previousLikes = this.post.likes;

    if (this.post.isLikedByCurrentUser) {
      this.post.likes--;
      this.post.isLikedByCurrentUser = false;
    } else {
      this.post.likes++;
      this.post.isLikedByCurrentUser = true;
    }

    this.feedService.likePost(this.post.id).subscribe({
      next: () => {
        console.log('Request do backendu');
      },
      error: () => {
        this.post.isLikedByCurrentUser = previousState;
        this.post.likes = previousLikes;
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

    setTimeout(() => {
      if (this.commentInput) {
        this.commentInput.nativeElement.focus();
      }
    }, 100);
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

  toggleCommentLike(comment: any) {
    
    const previousState = comment.isLikedByCurrentUser;
    const previousLikes = comment.likes;

    if (comment.isLikedByCurrentUser) {
      comment.likes--;
      comment.isLikedByCurrentUser = false;
    } else {
      comment.likes++;
      comment.isLikedByCurrentUser = true;
    }

    this.feedService.likeComment(comment.id).subscribe({
      next: () => {
      },
      error: () => {
        comment.isLikedByCurrentUser = previousState;
        comment.likes = previousLikes;
        console.error('Błąd lajkowania komentarza');
      }
    });
  }



toggleReplies(comment: Comment) {
    if (comment.isLoadingReplies) {
      return;
    }

    if (comment.isExpanded) {
      comment.isExpanded = false;
      return;
    }

    if (comment.replies && comment.replies.length > 0) {
      comment.isExpanded = true;
      return;
    }

    comment.isLoadingReplies = true;
    comment.isExpanded = true;

    this.feedService.getRepliesForComment(comment.id).subscribe({
      next: (fetchedReplies) => {
        comment.replies = fetchedReplies;
        comment.isLoadingReplies = false;
      },
      error: (err) => {
        console.error('Nie udało się pobrać odpowiedzi:', err);
        comment.isLoadingReplies = false;
        comment.isExpanded = false;
        
        alert('Wystąpił błąd podczas pobierania odpowiedzi. Spróbuj ponownie.');
      }
    });
}
}