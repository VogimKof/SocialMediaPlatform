import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, map, Observable, of } from 'rxjs';
import { Post } from '../models/post.model';
import { User } from '../models/user.model';
import { Comment } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  private postsUrl = 'http://localhost:8080/api/posts';
  private contactsUrl = '/assets/mock-data/contacts.json';
  private lastId = 1000;

  constructor(private http: HttpClient) {}

  getPosts(): Observable<Post[]> {
    return this.http.get<any[]>(`${this.postsUrl}/all`).pipe(
      map(dtoList => dtoList.map(dto => this.mapToPost(dto)))
    );
  }

  private mapToPost(dto: any): Post {
    return {
      id: dto.postId,
      content: dto.content,
      author: {
        id: 0, 
        firstName: dto.firstName || 'Użytkownik',
        lastName: dto.lastName || '',
        sex: 'other',
        avatarUrl: `https://placehold.co/40/0d6efd/ffffff?text=${dto.firstName?.charAt(0) || 'U'}`
      },
      timeAgo: this.formatDate(dto.createdAt),
      likes: dto.likesCount, 
      comments: dto.commentsCount,
      shares: 0,
      isLikedByCurrentUser: dto.likedByCurrentUser
    };
  }

  private formatDate(dateValue: any): string {
    if (!dateValue) return 'chwilę temu';

    const date = new Date(dateValue);
    
    if (isNaN(date.getTime())) return 'chwilę temu';

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'chwilę temu';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min temu`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} godz. temu`;
    }

    return date.toLocaleString('pl-PL', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  getContacts(): Observable<User[]> {
    return this.http.get<User[]>(this.contactsUrl);
  }

  likePost(postId: number): Observable<number> {
    return this.http.post<number>(`${this.postsUrl}/${postId}/like`, {});
  }

  getCommentsForPost(postId: number): Observable<Comment[]> {
    const url = `http://localhost:8080/api/comments/${postId}/comments`;
    return this.http.get<any[]>(url).pipe(
      map(dtos => dtos.map(dto => this.mapToComment(dto)))
    );
  }

  addComment(postId: number, content: string): Observable<Comment> {
    return this.http.post<any>(`http://localhost:8080/api/comments/${postId}/addComment`, { content }).pipe(
      map(dto => this.mapToComment(dto))
    );
  }

  private mapToComment(dto: any): Comment {
    return {
      id: dto.postId,
      content: dto.content,
      author: {
        id: 0,
        firstName: dto.username || 'Użytkownik',
        lastName: '',
        sex: 'other',
        avatarUrl: `https://placehold.co/40/0d6efd/ffffff?text=${dto.username?.charAt(0) || 'U'}`
      },
      timeAgo: 'chwilę temu',
      likes: 0,
      isLikedByCurrentUser: false,
      replyNumber: 0
    };
  }

  likeComment(commentId: number): Observable<boolean> {
    return of(true).pipe(delay(300));
  }

  getRepliesForComment(commentId: number): Observable<Comment[]> {
    return this.http.get<any[]>(`http://localhost:8080/api/comments/${commentId}/replies`).pipe(
      map(dtos => dtos.map(dto => this.mapToComment(dto)))
    );
  }

  addReply(commentId: number, content: string): Observable<Comment> {
    console.log(commentId, content)
    return this.http.post<any>(`http://localhost:8080/api/comments/${commentId}/reply`, { content }).pipe(
      map(dto => this.mapToComment(dto))
    );
  }
}