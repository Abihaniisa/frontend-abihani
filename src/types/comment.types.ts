import { UserProfile } from './user.types';

export interface CommentItem {
  id: string;
  postId: string;
  user: UserProfile;
  text: string;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
}
