export const messageLabels = {
  // Empty states
  emptyFeed: 'Nothing here yet.',
  emptyFollowing: 'No posts from accounts you follow yet.',
  emptyOrders: 'No orders yet.',
  emptyComments: 'No comments yet.',
  emptyMessages: 'Start the conversation.',
  emptyOwnPosts: 'No posts yet. Post something.',
  emptyOtherPosts: 'No posts yet.',
  emptySearchResults: 'Nothing found.',
  emptyNotifications: 'Nothing yet.',

  // Loading states
  loadingFeed: 'Loading feed...',
  loadingOrders: 'Loading orders...',
  loadingComments: 'Loading comments...',
  slowConnection: 'Slow connection. Still trying…',
  requestTimeout: 'Could not load. Tap to retry.',

  // Error states
  generalErrorTitle: 'Something went wrong',
  generalErrorSubtitle: 'Try again later',
  offlineNotice: 'Offline Mode — Cached data is being used.',
  hashtagsMissing: 'At least one hashtag is required to classify your post.',
  mixedMediaError: 'Never mix photos and video in the same post.',
  oneVideoLimit: 'One video per post.',
  maxPhotosLimit: (selected: number) => `Up to 5 photos. You selected ${selected}.`,
  noPayoutMethodWarning: 'Add a payout method to sell. Takes 2 minutes.',
  invalidEmail: 'Please enter a valid email address',
  invalidOtp: 'Invalid or expired verification code',
  deleteAccountBlocked: 'Cannot delete account with open orders.',
  invalidNuban: 'Account number must be 10 digits',

  // Prompts & placeholders
  mediaPickerEmpty: 'Add photos or a video.',
  mediaPickerPartial: (count: number) => `Add more photos (${count}/5).`,
  captionPlaceholder: 'Describe what you are selling or sharing...',
  hashtagsPlaceholder: '#fashion #abuja #handmade',
  pricePlaceholder: '₦0',
  stockPlaceholder: '1',
  searchPlaceholder: 'Search hashtags, sellers, captions...',
  orderNotePlaceholder: 'Delivery address, preferred contact, or special request...',
  phonePlaceholder: '08012345678',
  otpPlaceholder: '000000',
  commentPlaceholder: 'Add a comment...',
  messagePlaceholder: (name: string) => `Message ${name}...`,
} as const;
