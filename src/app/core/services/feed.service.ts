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
  private usersUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  getPosts(): Observable<Post[]> {
    return this.http.get<any[]>(`${this.postsUrl}/all`).pipe(
      map(dtoList => dtoList.map(dto => this.mapToPost(dto)))
    );
  }

  getPostsByUserId(userId: number): Observable<Post[]> {
    return this.http.get<any[]>(`${this.postsUrl}/user/${userId}`).pipe(
      map(dtoList => dtoList.map(dto => this.mapToPost(dto)))
    );
  }

  getUserById(userId: number): Observable<User> {
    return this.http.get<any>(`${this.usersUrl}/${userId}`).pipe(
      map(dto => ({
        id: dto.id,
        firstName: dto.firstName,
        lastName: dto.lastName,
        sex: dto.sex || 'other',
        email: dto.email,
        avatarUrl: dto.avatarUrl || `https://placehold.co/168x168/2d88ff/ffffff?text=${dto.firstName?.charAt(0)}`,
        bgUrl: dto.bgUrl || 'https://placehold.co/1000x350/444/ffffff?text=Tło'
      }))
    );
  }

  private mapToPost(dto: any): Post {
    return {
      id: dto.postId,
      content: dto.content,
      imageUrl: dto.imageUrl,
      author: {
        id: dto.userId, 
        firstName: dto.firstName || 'Użytkownik',
        lastName: dto.lastName || '',
        sex: 'other',
        avatarUrl: dto.avatarUrl || `https://placehold.co/168x168/2d88ff/ffffff?text=${dto.firstName?.charAt(0)}`
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
      id: dto.id,
      content: dto.content,
      author: {
        id: dto.userId,
        firstName: dto.firstName,
        lastName: dto.lastName,
        sex: dto.sex,
        avatarUrl: dto.avatarUrl || `https://placehold.co/168x168/2d88ff/ffffff?text=${dto.firstName?.charAt(0)}`
      },
      timeAgo: this.formatDate(dto.createdAt),
      likes: 0,
      isLikedByCurrentUser: false,
      replyNumber: dto.replyNumber
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

  createPost(content: string, imageUrl?: string): Observable<Post> {
    const body = { content, imageUrl };
    return this.http.post<any>(`${this.postsUrl}/add`, body).pipe(
      map(dto => this.mapToPost(dto))
    );
  }

  uploadAvatar(userId: number, avatarUrl: string): Observable<any> {
    return this.http.post(`${this.usersUrl}/${userId}/avatar`, { avatarUrl });
  }

  uploadBackground(userId: number, bgUrl: string): Observable<any> {
    return this.http.post(`${this.usersUrl}/${userId}/background`, { bgUrl });
  }

  updateUser(userId: number, userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.usersUrl}/${userId}`, userData);
  }
  
  deletePost(postId: number): Observable<void> {
    return this.http.delete<void>(`${this.postsUrl}/${postId}`);
  }

}