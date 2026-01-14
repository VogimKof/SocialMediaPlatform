import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostCardComponent } from '../../shared/components/post-card/post-card';
import { Post } from '../../core/models/post.model';
import { User } from '../../core/models/user.model';
import { FeedService } from '../../core/services/feed.service';

interface Photo {
  url: string;
  postId: number;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, PostCardComponent],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile implements OnInit {
  
  isFriend: boolean = false;
  activeTab: string = 'posts';
  isPhotosModalOpen: boolean = false;
  
  viewingPost: Post | null = null;

  user: User = {
    id: 1,
    firstName: 'Adam',
    lastName: 'Nowak',
    sex: 'Mezczyzna',
    email: 'user@example.com',
    avatarUrl: 'https://placehold.co/168x168/2d88ff/ffffff?text=Adam',
    bgUrl: 'https://placehold.co/1000x350/444/ffffff?text=Tło'
  };

  posts: Post[] = [];
  allPhotos: Photo[] = []; 

  constructor(private feedService: FeedService) {}

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.feedService.getPosts().subscribe({
      next: (fetchedPosts) => {
        this.posts = fetchedPosts; 
        
        this.generatePhotosFromPosts(fetchedPosts);
      },
      error: (err) => {
        console.error('Błąd pobierania postów na profilu:', err);
      }
    });
  }

  generatePhotosFromPosts(posts: Post[]) {
    this.allPhotos = posts
    .filter(post => post.imageUrl)
    .map((post, index) => {
      return {
        url: post.imageUrl!,
        postId: post.id
      };
    });
  }

  toggleFriendship() {
    this.isFriend = !this.isFriend;
  }

  setActiveTab(tabName: string) {
    this.activeTab = tabName;
  }

  togglePhotosModal() {
    this.isPhotosModalOpen = !this.isPhotosModalOpen;
    this.handleBodyScroll();
  }

  openPostFromPhoto(postId: number) {
    const foundPost = this.posts.find(p => p.id === postId);
    if (foundPost) {
      this.viewingPost = foundPost;
      document.body.style.overflow = 'hidden';
    }
  }

  closePostView() {
    this.viewingPost = null;
    this.handleBodyScroll();
  }

  private handleBodyScroll() {
    if (this.isPhotosModalOpen || this.viewingPost) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
}