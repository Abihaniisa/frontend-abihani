export const LimitsConfig = {
  maxPhotosPerPost: 5,
  minPhotosPerPost: 1,
  maxVideosPerPost: 1,
  maxBioLength: 160,
  maxCaptionLength: 1000,
  maxHashtagsLength: 200,
  otpCodeLength: 6,
  recoveryCodeLength: 8,
  bankAccountNumberLength: 10,
  toastCharacterLimit: 60,
  noticeFrequencyPosts: 15,
} as const;
