import { generateClient } from 'aws-amplify/api';
import type { Schema } from '../amplify/data/resource';
import { useCallback } from 'react';
import { createStorageBrowser } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react-storage/storage-browser-styles.css'
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { createManagedAuthConfigAdapter } from '@aws-amplify/storage/storage-browser';

const {
  VITE_ACCOUNT_ID,
  VITE_REGION
} = import.meta.env;

const oidcClient = generateClient<Schema>();

function App() {
  const { isAuthenticated, getIdTokenClaims } = useAuth0();

  const credentialsProvider = useCallback(async () => {
    if (!isAuthenticated) {
      throw new Error('Not Authenticated');
    }
    const claims = await getIdTokenClaims();
    const { data, errors } = await oidcClient.queries.oidc({
      idToken: claims?.__raw!
    }, { authMode: 'apiKey' });
    if (errors?.length) {
      throw new Error(JSON.stringify(errors[0].errorInfo));
    }
    const {
      AccessKeyId,
      SecretAccessKey,
      SessionToken,
      Expiration,
    } = JSON.parse(data!);
    const baseCreds = {
      accessKeyId: AccessKeyId,
      secretAccessKey: SecretAccessKey,
      sessionToken: SessionToken,
      expiration: new Date(Expiration)
    }
    return { credentials: baseCreds }
  }, [isAuthenticated, getIdTokenClaims]);

  const adapter = createManagedAuthConfigAdapter({
    accountId: VITE_ACCOUNT_ID,
    region: VITE_REGION,
    credentialsProvider
  });
  const { StorageBrowser } = createStorageBrowser({config: adapter});

  return (
    <>
      <StorageBrowser />
    </>
  );
}

export default withAuthenticationRequired(App, {
  onRedirecting: () => <div>Redirecting you to the login page...</div>
});
