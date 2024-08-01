import { useEffect, useState } from "react";
import StorageBrowser from "./components/StorageBrowser";
import Auth from "./utils/AuthClass";
import "@aws-amplify/ui-react-storage/storage-browser-styles.css";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [alias, setAlias] = useState("");

  useEffect(() => {
    const checkAuthenticated = async () => {
      try {
        await Auth.getIdToken();
        setAuthenticated(true);
        const idToken = await Auth.getIdToken();
        console.info("idToken", idToken);
        setAlias(idToken.nickname ?? "Unknown User");
      } catch (e) {
        if (e && (e as any).error !== "login_required") {
          throw e;
        }
        setAuthenticated(false);
        setAlias("");
      }
    };
    checkAuthenticated();
  });

  console.info('authenticated', authenticated);

  return (
    <>
      <header>
        {authenticated ? (
          <h2>{alias}</h2>
        ) : (
          <button
            onClick={() => {
              Auth.loginWithPopup();
            }}
          >
            Log in
          </button>
        )}
        {authenticated && (
          <button onClick={async () => { 
            setAuthenticated(false);
            setAlias('');
            await Auth.logout();
          }}>Log out</button>
        )}
      </header>
      <body>{authenticated ? <StorageBrowser /> : <p>Please log in</p>}</body>
    </>
  );
}

export default App;
