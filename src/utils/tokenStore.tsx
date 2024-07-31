interface AWSCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken?: string;
  expiration?: Date;
}

interface AuthTokenStore {
  loadTokens(): Promise<AWSCredentials | null>;
  storeTokens(tokens: AWSCredentials): Promise<void>;
  clearTokens(): Promise<void>;
}

const TOKEN_KEY = "authTokens";

export const tokenStore: AuthTokenStore = {
  async loadTokens(): Promise<AWSCredentials | null> {
    const tokens = localStorage.getItem(TOKEN_KEY);
    if (tokens) {
      return JSON.parse(tokens) as AWSCredentials;
    }
    return null;
  },

  async storeTokens(tokens: AWSCredentials): Promise<void> {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
  },

  async clearTokens(): Promise<void> {
    localStorage.removeItem(TOKEN_KEY);
  },
};
