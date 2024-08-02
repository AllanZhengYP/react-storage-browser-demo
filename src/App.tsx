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

  console.info("authenticated", authenticated);

  return (
    <>
      <header className="bg-blue-400 flex flex-row">
        {authenticated ? (
          <div className="grow px-4 py-4">
            <h2>{alias}</h2>
          </div>
        ) : (
          <button
            className="bg-transparent"
            onClick={() => {
              Auth.loginWithPopup();
            }}
          >
            <div className="content-center">
              <b>Log in</b>
            </div>
          </button>
        )}
        {authenticated && (
          <button
            className="bg-transparent"
            onClick={async () => {
              setAuthenticated(false);
              setAlias("");
              await Auth.logout();
            }}
          >
            <b>Log out</b>
          </button>
        )}
      </header>
      <div className="flex flex-row justify-center">
        <div className="p-4">
          {authenticated ? <StorageBrowser /> : <p>Please log in, or refresh the page if you just logged in.</p>}
        </div>
      </div>
    </>
  );
}

export default App;
