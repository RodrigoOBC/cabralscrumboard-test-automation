import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

class Settings {
  public readonly baseUrl;

  constructor() {
    this.baseUrl = process.env.BASE_URL
  }
}

export const settings = new Settings();