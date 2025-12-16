import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';
import { Post } from '../models/post.model';
import { User } from '../models/user.model';
import { Comment } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  private postsUrl = '/assets/mock-data/posts.json';
  private contactsUrl = '/assets/mock-data/contacts.json';

  constructor(private http: HttpClient) {}

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.postsUrl);
  }

  getContacts(): Observable<User[]> {
    return this.http.get<User[]>(this.contactsUrl);
  }

  likePost(postId: number): Observable<boolean> {
    return of(true).pipe(delay(500)); 
  }

  getCommentsForPost(postId: number): Observable<Comment[]> {    
    const mockComments: Comment[] = [
      {
        id: 1,
        author: { id: 50, username: 'Kasia Kowalska', avatarUrl: 'https://placehold.co/40/ffc107/ffffff?text=KK' },
        content: `To są komentarze pobrane dynamicznie dla posta #${postId}!`,
        timeAgo: '1 min temu'
      },
      {
        id: 2,
        author: { id: 51, username: 'Tomek Nowak', avatarUrl: 'https://placehold.co/40/198754/ffffff?text=TN' },
        content: 'świetny post!.',
        timeAgo: '5 min temu'
      },
            {
        id: 1,
        author: { id: 50, username: 'Kasia Kowalska', avatarUrl: 'https://placehold.co/40/ffc107/ffffff?text=KK' },
        content: `To są komentarze pobrane dynamicznie dla posta #${postId}!`,
        timeAgo: '1 min temu'
      },
      {
        id: 2,
        author: { id: 51, username: 'Tomek Nowak', avatarUrl: 'https://placehold.co/40/198754/ffffff?text=TN' },
        content: 'świetny post!.',
        timeAgo: '5 min temu'
      },
            {
        id: 1,
        author: { id: 50, username: 'Kasia Kowalska', avatarUrl: 'https://placehold.co/40/ffc107/ffffff?text=KK' },
        content: `To są komentarze pobrane dynamicznie dla posta #${postId}!`,
        timeAgo: '1 min temu'
      },
      {
        id: 2,
        author: { id: 51, username: 'Tomek Nowak', avatarUrl: 'https://placehold.co/40/198754/ffffff?text=TN' },
        content: 'świetny post!.',
        timeAgo: '5 min temu'
      },
            {
        id: 1,
        author: { id: 50, username: 'Kasia Kowalska', avatarUrl: 'https://placehold.co/40/ffc107/ffffff?text=KK' },
        content: `To są komentarze pobrane dynamicznie dla posta #${postId}!`,
        timeAgo: '1 min temu'
      },
      {
        id: 2,
        author: { id: 51, username: 'Tomek Nowak', avatarUrl: 'https://placehold.co/40/198754/ffffff?text=TN' },
        content: 'świetny post!.',
        timeAgo: '5 min temu'
      }
    ];

    return of(mockComments).pipe(delay(800));
  }

  addComment(postId: number, content: string): Observable<Comment> {
    const mockComment: Comment = {
      id: 7,
      author: {
        id: 999,
        username: 'Twój Profil',
        avatarUrl: 'https://placehold.co/40/0d6efd/ffffff?text=User'
      },
      content: content,
      timeAgo: 'chwilę temu'
    };

    return of(mockComment).pipe(delay(500));
  }
}