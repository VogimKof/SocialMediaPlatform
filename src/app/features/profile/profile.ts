import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostCardComponent } from '../../shared/components/post-card/post-card';
import { Post } from '../../core/models/post.model';
import { User } from '../../core/models/user.model';
import { FeedService } from '../../core/services/feed.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FormsModule } from '@angular/forms';

interface Photo {
  url: string;
  postId: number;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, PostCardComponent, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile implements OnInit {
  
  isFriend: boolean = false;
  activeTab: string = 'posts';
  isPhotosModalOpen: boolean = false;
  isOwnProfile: boolean = false;
  isEditMode: boolean = false;
  viewingPost: Post | null = null;
  selectedAvatarFile: File | null = null;
  avatarPreview: string | null = null;
  selectedBackgroundFile: File | null = null;
  backgroundPreview: string | null = null;

  user!: User;

  posts: Post[] = [];
  allPhotos: Photo[] = []; 

  constructor(
    private feedService: FeedService,  
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const userId = params.get('id');
      if (userId) {
        this.loadProfileData(+userId);
        this.checkIfOwnProfile(+userId);
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

  private checkIfOwnProfile(profileId: number) {
    this.authService.getCurrentUser().subscribe({
      next: (currentUser) => {
        this.isOwnProfile = currentUser.id == profileId;
      },
      error: () => this.isOwnProfile = false
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

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }

  onAvatarSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onBackgroundSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.backgroundPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  saveAvatar(): void {
    if (this.avatarPreview && this.user) {
      this.feedService.uploadAvatar(this.user.id, this.avatarPreview).subscribe({
        next: () => {
          this.avatarPreview = null;
          this.loadProfileData(this.user.id);
        },
        error: (err) => console.error('Błąd zapisu profilowego:', err)
      });
    }
  }

  saveBackground(): void {
    if (this.backgroundPreview && this.user) {
      this.feedService.uploadBackground(this.user.id, this.backgroundPreview).subscribe({
        next: () => {
          this.backgroundPreview = null;
          this.loadProfileData(this.user.id);
        },
        error: (err) => console.error('Błąd zapisu background:', err)
      });
    }
  }

  saveProfileChanges() {
    if (this.user) {
      this.feedService.updateUser(this.user.id, this.user).subscribe({
        next: () => {
          this.isEditMode = false;
          console.log('Profil zaktualizowany');
        },
        error: (err) => console.error('Błąd aktualizacji profilu:', err)
      });
    }
  } 
}