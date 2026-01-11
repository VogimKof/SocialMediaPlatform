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
      likes: 0, 
      comments: 0,
      shares: 0,
      isLikedByCurrentUser: false
    };
  }

  private formatDate(dateArray: any): string {
    if (!dateArray || !Array.isArray(dateArray)) return 'chwilę temu';
    const date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4]);
    return date.toLocaleString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
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
          firstName: 'Malenia',
          lastName: 'Blade of Miquella',
          sex: 'female',
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
          firstName: 'Geralt',
          lastName: 'z Rivii',
          sex: 'male',
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
          firstName: 'Lara',
          lastName: 'Croft',
          sex: 'female',
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
          firstName: 'Mario',
          lastName: 'Bros',
          sex: 'male',
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
        firstName: 'Twój',
        lastName: 'Profil',
        sex: 'other',
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
        author: { 
          id: 55, 
          firstName: 'Adam', 
          lastName: 'Nowy', 
          sex: 'male',
          avatarUrl: 'https://placehold.co/40/6610f2/ffffff?text=AN' 
        },
        content: `To jest odpowiedź pobrana z serwera dla komentarza ${commentId}`,
        timeAgo: '1 min temu',
        likes: 2,
        replyNumber: 0
      },
      {
        id: 301 + commentId,
        author: { 
          id: 56, 
          firstName: 'Ewa', 
          lastName: 'Baza', 
          sex: 'female',
          avatarUrl: 'https://placehold.co/40/d63384/ffffff?text=EB' 
        },
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

  addReply(commentId: number, content: string): Observable<Comment> {
    const newReply: Comment = {
      id: ++this.lastId,
      author: {
        id: 999,
        firstName: 'Twój',
        lastName: 'Profil',
        sex: 'other',
        avatarUrl: 'https://placehold.co/40/0d6efd/ffffff?text=User'
      },
      content: content,
      timeAgo: 'chwilę temu',
      likes: 0,
      replyNumber: 0
    };
    return of(newReply).pipe(delay(500));
  }
}