import React from "react";
import ReactDOM from "react-dom/client";
import { Auth0Provider } from '@auth0/auth0-react';
import App from "./App.tsx";
import "./index.css";

import { Amplify } from "aws-amplify";
import amplifyConfig from "../amplify_outputs.json";

const {
  VITE_DOMAIN,
  VITE_CLIENT_ID,
} = import.meta.env;

Amplify.configure(amplifyConfig);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Auth0Provider
      domain={VITE_DOMAIN}
      clientId={VITE_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);
