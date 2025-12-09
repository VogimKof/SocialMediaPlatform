import { User } from './user.model';

export interface Post {
  id: number;
  author: User;
  content: string;
  imageUrl?: string;
  comments: number;
  shares: number;
}