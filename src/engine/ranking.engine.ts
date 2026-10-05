import { Post } from '../types/post.types';

export function calculatePostScore(post: Post): number {
  const likesScore = post.likesCount * 1.0;
  const commentsScore = post.commentsCount * 3.0;
  const sharesScore = post.sharesCount * 5.0;
  const savesScore = post.savesCount * 4.0;
  const viewsScore = post.viewsCount * 0.05;
  const watchTimeScore = post.watchTimeSeconds * 0.5;
  const followerScore = (post.seller?.followersCount || 0) * 0.1;
  const verifiedBonus = post.seller?.isVerified ? 5.0 : 0.0;

  const rawScore =
    likesScore +
    commentsScore +
    sharesScore +
    savesScore +
    viewsScore +
    watchTimeScore +
    followerScore +
    verifiedBonus;

  // Freshness multiplier calculation
  const postDate = new Date(post.createdAt).getTime();
  const now = Date.now();
  const ageInHours = (now - postDate) / (1000 * 60 * 60);

  let freshnessMultiplier = 1.0;
  if (ageInHours <= 24) {
    freshnessMultiplier = 1.5;
  } else if (ageInHours <= 24 * 7) {
    freshnessMultiplier = 1.2;
  }

  return Math.round(rawScore * freshnessMultiplier * 10) / 10;
}

export function rankFeedPosts(posts: Post[]): Post[] {
  // Exclude posts with open report from For You feed
  const eligiblePosts = posts.filter((p) => !p.hasOpenReport);

  return eligiblePosts
    .map((post) => ({
      ...post,
      rankingScore: calculatePostScore(post),
    }))
    .sort((a, b) => (b.rankingScore ?? 0) - (a.rankingScore ?? 0));
}
