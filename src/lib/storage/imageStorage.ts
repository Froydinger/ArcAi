export class ImageStorage {
  private static instance: ImageStorage;

  static getInstance(): ImageStorage {
    if (!ImageStorage.instance) {
      ImageStorage.instance = new ImageStorage();
    }
    return ImageStorage.instance;
  }

  async saveChatImage(url: string, id: string): Promise<string> {
    return url;
  }

  async getChatImage(id: string): Promise<string | null> {
    return null;
  }
}

export const imageStorage = ImageStorage.getInstance();
