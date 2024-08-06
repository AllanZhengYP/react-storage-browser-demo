import { useEffect, useState } from "react";
import StorageBrowser from "./components/StorageBrowser";
import { fetchAuthSession, getCurrentUser, signOut } from "aws-amplify/auth";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import "@aws-amplify/ui-react-storage/storage-browser-styles.css";
import "@aws-amplify/ui-react-storage/styles.css";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [alias, setAlias] = useState("");

  useEffect(() => {
    const checkAuthenticated = async () => {
      try {
        const { tokens } = await fetchAuthSession();
        setAuthenticated(!!tokens);
        if (tokens) {
          const { username } = await getCurrentUser()
          setAlias(username ?? "Unknown User");
        }
      } catch (e) {
        setAuthenticated(false);
        setAlias("");
      }
    };
    checkAuthenticated();
  });

  console.info("authenticated", authenticated);

  return authenticated ? (
    <>
      <header className="bg-blue-400 flex flex-row">
        <div className="grow p-4">
          <h2>{alias}</h2>
        </div>
        <button className="bg-transparent" onClick={async () => {
          await signOut();
          setAuthenticated(false);
          setAlias("")
        }}>Log out</button>
      </header>
      <div className="flex flex-row justify-center">
        <StorageBrowser />
      </div>
    </>
  ) : (
    <p className="p-4">Please log in.</p>
  );
}

export default (
  () => <Authenticator>
    <App />
  </Authenticator>
);
