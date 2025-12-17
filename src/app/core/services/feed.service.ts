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
        author: { 
          id: 60, 
          username: 'Malenia, Blade of Miquella', 
          avatarUrl: 'https://placehold.co/40/5d4037/ffffff?text=MB'
        },
        content: 'Jestem Malenia, miecz Miquelli. I nigdy nie zaznałam porażki...',
        timeAgo: '2 min temu',
        likes: 999,
        isLikedByCurrentUser: false,
        replyNumber: 2
      },
      {
        id: 2,
        author: { 
          id: 50, 
          username: 'Geralt z Rivii', 
          avatarUrl: 'https://placehold.co/40/424242/ffffff?text=GR' 
        },
        content: 'Zlecenie wykonane. Chociaż za taką liczbę lajków spodziewałem się czegoś trudniejszego niż zwykły utopiec.',
        timeAgo: '1 min temu',
        likes: 55,
        isLikedByCurrentUser: false,
        replyNumber: 2
      },
      {
        id: 3,
        author: { 
          id: 51, 
          username: 'Lara Croft', 
          avatarUrl: 'https://placehold.co/40/2e7d32/ffffff?text=LC' 
        },
        content: 'Znalazłam ukryte przejście w sekcji komentarzy. Wygląda na to, że prowadzi do zapomnianego grobowca kodu.',
        timeAgo: '15 min temu',
        likes: 120,
        isLikedByCurrentUser: true,
        replyNumber: 0
      },
      {
        id: 4,
        author: { 
          id: 52, 
          username: 'Mario', 
          avatarUrl: 'https://placehold.co/40/d32f2f/ffffff?text=M' 
        },
        content: 'Mamma mia! Ten post jest lepszy niż super grzyb! It’s-a me, Mario!',
        timeAgo: '1 godz. temu',
        likes: 99,
        isLikedByCurrentUser: false,
        replyNumber: 0
      }
    ]

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
      timeAgo: 'chwilę temu',
      likes: 0,
      isLikedByCurrentUser: false,
      replyNumber: 0
    };

    return of(mockComment).pipe(delay(500));
  }

  likeComment(commentId: number): Observable<boolean> {
    return of(true).pipe(delay(300));
  }

  getRepliesForComment(commentId: number): Observable<Comment[]> {
    const mockReplies: Comment[] = [
      {
        id: 300 + commentId,
        author: { id: 55, username: 'Adam Nowy', avatarUrl: 'https://placehold.co/40/6610f2/ffffff?text=AN' },
        content: `To jest odpowiedź pobrana z serwera dla komentarza ${commentId}`,
        timeAgo: '1 min temu',
        likes: 2,
        replyNumber: 0
      },
      {
        id: 301 + commentId,
        author: { id: 56, username: 'Ewa Baza', avatarUrl: 'https://placehold.co/40/d63384/ffffff?text=EB' },
        content: 'Potwierdzam, działa!',
        timeAgo: '30 sek. temu',
        likes: 0,
        replyNumber: 0
      }
    ];

    const shouldFail = false;

    if (shouldFail) {
        return new Observable(observer => {
            setTimeout(() => observer.error('Błąd serwera 500'), 1000);
        });
    }

    return of(mockReplies).pipe(delay(1000));
  }
}