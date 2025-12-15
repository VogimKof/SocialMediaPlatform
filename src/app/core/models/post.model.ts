import { Comment } from './comment.model';
import { User } from './user.model';

export interface Post {
  id: number;
  author: User;
  content: string;
  imageUrl?: string;
  comments: number;
  commentsList?: Comment[];
  shares: number;
  timeAgo: string;
  likes: number;
  isLikedByCurrentUser?: boolean; 
}