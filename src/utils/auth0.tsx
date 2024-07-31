const {
  VITE_DOMAIN,
  VITE_CLIENT_ID,
  VITE_CLIENT_SECRET,
  VITE_AUDIENCE,
} = import.meta.env;

const AUTH0_CONFIG = {
  domain: VITE_DOMAIN,
  clientId: VITE_CLIENT_ID,
  clientSecret: VITE_CLIENT_SECRET,
  realm: "Username-Password-Authentication",
  audience: VITE_AUDIENCE,
  scope: "openid profile email",
};

export const signIn = async (username: string, password: string) => {
  const data = new URLSearchParams({
    grant_type: "password",
    username,
    password,
    audience: AUTH0_CONFIG.audience,
    scope: AUTH0_CONFIG.scope,
    client_id: AUTH0_CONFIG.clientId,
    client_secret: AUTH0_CONFIG.clientSecret,
  });

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: data,
  };

  try {
    const response = await fetch(
      `https://${AUTH0_CONFIG.domain}/oauth/token`,
      options
    );
    if (!response.ok) {
      throw new Error("Error fetching auth0 tokens" + response.statusText);
    }
    const result = await response.json();
    return result.id_token;
  } catch (error) {
    console.log("Error:", error);
  }
};
