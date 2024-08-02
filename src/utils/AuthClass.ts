import { Auth0Client, IdToken, PopupCancelledError, PopupTimeoutError } from '@auth0/auth0-spa-js';

const {
  VITE_DOMAIN,
  VITE_CLIENT_ID,
} = import.meta.env;

class Auth {
  private _auth0Client: Auth0Client

  constructor() {
    this._auth0Client = new Auth0Client({
      domain: VITE_DOMAIN,
      clientId: VITE_CLIENT_ID,
      cacheLocation: 'memory',
      authorizationParams: {
        redirect_uri:  window.location.origin,
      }
    });
  }

  public async loginWithPopup(): Promise<void> {
    try {
      await this._auth0Client.loginWithPopup();
     } catch(e) {
      if (e instanceof PopupCancelledError) {
        // Popup was closed before login completed
      } else if (e instanceof PopupTimeoutError) {
        // TODO
      }
     }
  }

  public async handleRedirectCallback(): Promise<void> {
    await this._auth0Client.handleRedirectCallback();
  }

  public async logout(): Promise<void> {
    await this._auth0Client.logout();
    //TODO: update auth state
  }

  public async checkSession(): Promise<void> {
    await this._auth0Client.checkSession();
  }

  public async getIdToken(): Promise<IdToken> {
    try {
      await this._auth0Client.checkSession();
    } catch (error) {
      // TODO: update auth state
      throw error;
    }
    const idToken = await this._auth0Client.getIdTokenClaims();
    if (!idToken) {
      throw new Error('id token claims are empty');
    }
    return idToken;
  }

  public onAuthStateChanged(): void {
    // TODO
  }
}

export default new Auth();