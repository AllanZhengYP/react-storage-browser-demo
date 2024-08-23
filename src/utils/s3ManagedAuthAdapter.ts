import { createManagedAuthAdapter } from '@aws-amplify/ui-react-storage/browser';
import { AwsCredentialIdentity } from '@aws-sdk/types';
import { generateClient } from 'aws-amplify/api';
import type { Schema } from '../../amplify/data/resource';
import Auth from './AuthClass';

interface CredentialsProviderOutput { 
  credentials: Required<AwsCredentialIdentity>;
}

const {
  VITE_ACCOUNT_ID,
  VITE_REGION
} = import.meta.env;

const oidcClient = generateClient<Schema>();

const fetchBaseCredentials = async (): Promise<CredentialsProviderOutput> => {
  const { __raw } = await Auth.getIdToken();
  const { data, errors } = await oidcClient.queries.oidc({
    idToken: __raw
  }, { authMode: 'apiKey' });
  if (errors?.length) {
    throw new Error(JSON.stringify(errors[0]));
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
  return { credentials: baseCreds as any }

}

const createCredentialsProvider = () => {
  let cache: CredentialsProviderOutput | undefined = undefined;

  const credentialsProvider = async (options?: {forceRefresh?: boolean}): Promise<CredentialsProviderOutput> => {
    if (options?.forceRefresh || !cache) {
      cache = await fetchBaseCredentials();
    }
    else if (cache.credentials.expiration?.valueOf() <= Date.now()) {
      cache = await fetchBaseCredentials();
    }
    return cache
  }

  return credentialsProvider;
}

const credentialsProvider = createCredentialsProvider();

const managedAuthConfigAdapter = createManagedAuthAdapter({
  accountId: VITE_ACCOUNT_ID,
  region: VITE_REGION,
  credentialsProvider,
  registerAuthListener: (onAuthStateChange) => {
    Auth.addAuthStateChangeListener(onAuthStateChange);
  }
});

export default managedAuthConfigAdapter;