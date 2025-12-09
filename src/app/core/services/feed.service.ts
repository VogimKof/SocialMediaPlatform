import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../models/post.model';
import { User } from '../models/user.model';

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
}