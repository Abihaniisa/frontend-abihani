class MediaMockService {
  public async uploadMedia(file: File): Promise<{ url: string; type: 'image' | 'video' }> {
    const isVideo = file.type.startsWith('video/');
    const url = URL.createObjectURL(file);
    return {
      url,
      type: isVideo ? 'video' : 'image',
    };
  }

  public async uploadReceiptImage(file: File): Promise<string> {
    return URL.createObjectURL(file);
  }
}

export const mediaMock = new MediaMockService();
