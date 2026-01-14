import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostCardComponent } from '../../shared/components/post-card/post-card';
import { Post } from '../../core/models/post.model';
import { User } from '../../core/models/user.model';
import { FeedService } from '../../core/services/feed.service';
import { ActivatedRoute } from '@angular/router';

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

  user!: User;

  posts: Post[] = [];
  allPhotos: Photo[] = []; 

  constructor(private feedService: FeedService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const userId = params.get('id');
      if (userId) {
        this.loadProfileData(+userId);
      }
    });
  }

  loadProfileData(userId: number) {
    this.feedService.getUserById(userId).subscribe({
      next: (userData) => {
        this.user = userData;
      },
      error: (err) => console.error('Błąd pobierania użytkownika:', err)
    });

    this.feedService.getPostsByUserId(userId).subscribe({
      next: (fetchedPosts) => {
        this.posts = fetchedPosts;
        this.generatePhotosFromPosts(fetchedPosts);
      },
      error: (err) => console.error('Błąd pobierania postów użytkownika:', err)
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