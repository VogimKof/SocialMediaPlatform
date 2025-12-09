import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '../../../core/models/post.model';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-card.html',
  styleUrls: ['./post-card.css']
})
export class PostCardComponent {
  @Input() post!: Post;

  onLike() {
    console.log('Polubiono post ID:', this.post.id);
  }
}