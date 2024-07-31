import { signIn } from "./utils/auth0";
import { tokenStore } from "./utils/tokenStore";

const fetchIdcCredentials = async (token: string) => {
  try {
    const response = await fetch(
      "https://2zxpt9ie29.execute-api.us-east-2.amazonaws.com/v1/get-creds",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const body = await JSON.parse(data.body);
    return body.Credentials;
  } catch (error) {
    console.error("Error fetching credentials:", error);
  }
};

const signInBtnClick = async () => {
  const idToken = await signIn("ashwinkumar2468@gmail.com", "Ashwinkumar@123");
  console.log("idToken", idToken);
  if (idToken) {
    const creds = await fetchIdcCredentials(idToken);
    console.log("creds", creds);
    tokenStore.storeTokens(creds);
  }
};

const signOutBtnClick = async () => {
  tokenStore.clearTokens();
};

function App() {
  return (
    <>
      <div>Login Page</div>
      <button onClick={() => signInBtnClick()}>SignIn</button>
      <button onClick={() => signOutBtnClick()}>SignOut</button>
    </>
  );
}

export default App;
