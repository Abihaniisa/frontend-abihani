import { Post, OfficialNotice } from '../types/post.types';
import { CommentItem } from '../types/comment.types';
import { INITIAL_POSTS, INITIAL_COMMENTS, INITIAL_OFFICIAL_NOTICE } from '../constants/seedData';
import { rankFeedPosts } from '../engine/ranking.engine';

class PostMockService {
  private posts: Post[] = [...INITIAL_POSTS];
  private comments: Record<string, CommentItem[]> = { ...INITIAL_COMMENTS };
  private officialNotice: OfficialNotice | null = { ...INITIAL_OFFICIAL_NOTICE };

  public getPosts(tab: 'forYou' | 'following', currentUserId?: string): Post[] {
    if (tab === 'following') {
      // In mock mode, show posts from accounts other than self, most recent first
      return [...this.posts]
        .filter((p) => p.sellerId !== currentUserId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    // For You tab: score-based ranking engine
    return rankFeedPosts(this.posts);
  }

  public getPostById(id: string): Post | undefined {
    return this.posts.find((p) => p.id === id);
  }

  public toggleLike(postId: string): Post {
    const post = this.posts.find((p) => p.id === postId);
    if (!post) throw new Error('Post not found');

    post.isLiked = !post.isLiked;
    post.likesCount += post.isLiked ? 1 : -1;
    return { ...post };
  }

  public toggleSave(postId: string): Post {
    const post = this.posts.find((p) => p.id === postId);
    if (!post) throw new Error('Post not found');

    post.isSaved = !post.isSaved;
    post.savesCount += post.isSaved ? 1 : -1;
    return { ...post };
  }

  public incrementShares(postId: string): void {
    const post = this.posts.find((p) => p.id === postId);
    if (post) post.sharesCount += 1;
  }

  public recordWatchTime(postId: string, seconds: number): void {
    const post = this.posts.find((p) => p.id === postId);
    if (post) {
      post.viewsCount += 1;
      post.watchTimeSeconds += seconds;
    }
  }

  public createPost(newPostData: Omit<Post, 'id' | 'likesCount' | 'commentsCount' | 'sharesCount' | 'savesCount' | 'viewsCount' | 'watchTimeSeconds' | 'createdAt'>): Post {
    const newPost: Post = {
      ...newPostData,
      id: `post_${Date.now()}`,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      savesCount: 0,
      viewsCount: 1,
      watchTimeSeconds: 5,
      createdAt: new Date().toISOString(),
    };

    this.posts.unshift(newPost);
    return newPost;
  }

  public getComments(postId: string): CommentItem[] {
    return this.comments[postId] || [];
  }

  public addComment(postId: string, comment: CommentItem): CommentItem {
    if (!this.comments[postId]) {
      this.comments[postId] = [];
    }
    this.comments[postId].unshift(comment);

    const post = this.posts.find((p) => p.id === postId);
    if (post) {
      post.commentsCount += 1;
    }
    return comment;
  }

  public getOfficialNotice(): OfficialNotice | null {
    return this.officialNotice;
  }

  public dismissOfficialNotice(): void {
    if (this.officialNotice) {
      this.officialNotice.isDismissed = true;
    }
  }

  public setOfficialNotice(notice: OfficialNotice): void {
    this.officialNotice = notice;
  }
}

export const postMock = new PostMockService();
