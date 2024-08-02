import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { Amplify } from "aws-amplify";
import amplifyConfig from "../amplify_outputs.json";
import Auth from "./utils/AuthClass.ts";

Amplify.configure(amplifyConfig);

//in your callback route (<MY_CALLBACK_URL>)
window.addEventListener('load', async () => {
  await Auth.handleRedirectCallback();
  console.log('Logged in');
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
