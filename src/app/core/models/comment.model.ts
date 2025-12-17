import { User } from './user.model';

export interface Comment {
  id: number;
  author: User;
  content: string;
  timeAgo: string;
  likes: number;
  isLikedByCurrentUser?: boolean;
  replies?: Comment[];
  replyNumber: number;
  isExpanded?: boolean
  isLoadingReplies?: boolean;
}