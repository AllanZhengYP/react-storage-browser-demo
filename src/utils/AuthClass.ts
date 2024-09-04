import {
  Auth0Client,
  IdToken,
  PopupCancelledError,
  PopupTimeoutError,
} from "@auth0/auth0-spa-js";

const { VITE_DOMAIN, VITE_CLIENT_ID } = import.meta.env;

class Auth {
  private _auth0Client: Auth0Client;
  private _authStateChangeCallback: () => void = () => {};

  constructor() {
    this._auth0Client = new Auth0Client({
      domain: VITE_DOMAIN,
      clientId: VITE_CLIENT_ID,
      cacheLocation: "memory",
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
    });
  }

  public async loginWithPopup(): Promise<void> {
    // this._authStateChangeCallback();
    try {
      await this._auth0Client.loginWithPopup({
        authorizationParams: {
          redirect_uri: window.location.origin,
        },
      });
    } catch (e) {
      if (e instanceof PopupCancelledError) {
        // Popup was closed before login completed
      } else if (e instanceof PopupTimeoutError) {
        // TODO
      }
    }
  }

  public async handleRedirectCallback(): Promise<void> {
    const { appState } = await this._auth0Client.handleRedirectCallback();
    console.log(
      "login redirect. auth state change cb",
      appState,
      this._authStateChangeCallback
    );
    this._authStateChangeCallback();
  }

  public async logout(): Promise<void> {
    this._authStateChangeCallback();
    await this._auth0Client.logout();
    console.log("logout. auth state change cb", this._authStateChangeCallback);
  }

  public async checkSession(): Promise<void> {
    await this._auth0Client.checkSession();
  }

  public async getIdToken(input?: {
    forceRefresh?: boolean;
  }): Promise<IdToken> {
    const { forceRefresh = false } = input ?? {};
    try {
      await this._auth0Client.checkSession();
    } catch (error) {
      // TODO: update auth state
      throw error;
    }

    if (forceRefresh) {
      await this._auth0Client.getTokenSilently({ cacheMode: "off" });
    }

    const idToken = await this._auth0Client.getIdTokenClaims();
    if (!idToken) {
      throw new Error("id token claims are empty");
    }
    return idToken;
  }

  public addAuthStateChangeListener(cb: () => void): void {
    this._authStateChangeCallback = cb;
  }
}

export default new Auth();
