import { Component, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Post } from '../../../core/models/post.model';
import { FeedService } from '../../../core/services/feed.service';
import { Comment } from '../../../core/models/comment.model';
import { AutofocusDirective } from '../../directives/autofocus-directive';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [FormsModule,CommonModule, AutofocusDirective],
  templateUrl: './post-card.html',
  styleUrls: ['./post-card.css']
})
export class PostCardComponent {
  @Input() post!: Post;
  @Output() postDeleted = new EventEmitter<number>();

  @ViewChild('commentInput') commentInput!: ElementRef;

  isModalOpen = false;
  isLoadingComments = false;
  showComments = false;
  newCommentContent: string = '';
  isAddingComment = false;
  avatarUrl: string =''
  currentUser: User | null = null;

  constructor(
    private feedService: FeedService,
    private authService: AuthService,
    private router: Router) {}

    ngOnInit() {
      this.authService.getCurrentUser().subscribe({
        next: (user) => {
          this.avatarUrl = user.avatarUrl || `https://placehold.co/168x168/2d88ff/ffffff?text=${user.firstName?.charAt(0)}`
          this.currentUser = user;
        },
        error: (err) => console.error('Nie udało się pobrać ID użytkownika', err)
      });
    }

    get isAuthor(): boolean {
      return this.post.author.id === this.currentUser?.id;
    }

    deletePost() {
    if (confirm('Czy na pewno chcesz usunąć ten post?')) {
      this.feedService.deletePost(this.post.id).subscribe({
        next: () => {
          this.postDeleted.emit(this.post.id);
          console.log('Post usunięty pomyślnie');
        },
        error: (err) => console.error('Błąd podczas usuwania posta:', err)
      });
    }
  }

    goToUserProfile() {
      if (this.post.author && this.post.author.id) {
        this.router.navigate(['/profile', this.post.author.id]);
      } else {
        console.warn('Brak ID autora posta, nie można przejść do profilu.');
      }
    }

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
          next: (serverLikeCount) => {
              this.post.likes = serverLikeCount;
          },
          error: () => {
              this.post.isLikedByCurrentUser = previousState;
              this.post.likes = previousLikes;
              console.error('Błąd podczas lajkowania');
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
    this.showComments = !this.showComments;
    
    if (this.showComments && (!this.post.commentsList || this.post.commentsList.length === 0)) {
      this.isLoadingComments = true;
      this.feedService.getCommentsForPost(this.post.id).subscribe({
        next: (comments) => {
          this.post.commentsList = comments;
          this.isLoadingComments = false;
        },
        error: (err) => {
          console.error('Błąd podczas ładowania komentarzy:', err);
          this.isLoadingComments = false;
        }
      });
    }
  }

  addComment() {
    if (!this.newCommentContent.trim() || this.isAddingComment) return;

    this.isAddingComment = true;

    this.feedService.addComment(this.post.id, this.newCommentContent).subscribe({
      next: (newCommentFromServer) => {
        if (!this.post.commentsList) this.post.commentsList = [];
        
        this.post.commentsList.push(newCommentFromServer);
        this.post.comments++;
        
        this.newCommentContent = '';
        this.isAddingComment = false;
      },
      error: (err) => {
        console.error('Błąd dodawania komentarza:', err);
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
    if (comment.isExpanded) {
      comment.isExpanded = false;
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
        console.error('Błąd pobierania odpowiedzi:', err);
        comment.isLoadingReplies = false;
        comment.isExpanded = false;
      }
    });
  }

  toggleReplyInput(comment: Comment) {
    const wasReplying = !!comment.isReplying;

    this.closeAllReplyInputs(this.post.commentsList);

    if (!wasReplying) {
      comment.isReplying = true;
      comment.replyContent = '';
    }
  }

  private closeAllReplyInputs(comments: Comment[] | undefined) {
    if (!comments) return;
    comments.forEach(c => {
      c.isReplying = false;
      if (c.replies) {
        this.closeAllReplyInputs(c.replies);
      }
    });
  }

  addReply(parentComment: Comment) {
    console.log(parentComment)
    if (!parentComment.replyContent?.trim() || parentComment.isAddingReply) return;

    parentComment.isAddingReply = true;
    console.log(parentComment.id)
    this.feedService.addReply(parentComment.id, parentComment.replyContent).subscribe({
      next: (newReply) => {
        if (!parentComment.replies) parentComment.replies = [];
        parentComment.replies.push(newReply);
        parentComment.replyNumber++;
        this.post.comments++;
        parentComment.isExpanded = true;
        
        parentComment.isReplying = false;
        parentComment.replyContent = '';
        parentComment.isAddingReply = false;
      }
    });
  }
}