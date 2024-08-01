import { createManagedAuthConfigAdapter } from '@aws-amplify/storage/storage-browser';
import { AwsCredentialIdentity } from '@aws-sdk/types';
import { generateClient } from 'aws-amplify/api';
import type { Schema } from '../../amplify/data/resource';
import Auth from './AuthClass';

interface CredentialsProviderOutput { 
  credentials: AwsCredentialIdentity;
}

const {
  VITE_ACCOUNT_ID,
  VITE_REGION
} = import.meta.env;

const oidcClient = generateClient<Schema>();

const fetchBaseCreentials = async (): Promise<CredentialsProviderOutput> => {
  const { __raw } = await Auth.getIdToken();
  const { data, errors } = await oidcClient.queries.oidc({
    idToken: __raw
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

}

const createCredentialsProvider = () => {
  let cache: Promise<CredentialsProviderOutput> | undefined = undefined;

  const credentialsProvider = async (options?: {forceRefresh?: boolean}): Promise<CredentialsProviderOutput> => {
    if (options?.forceRefresh || !cache) {
      cache = fetchBaseCreentials();
    } else if ((await cache).credentials.expiration?.valueOf() ?? 0 <= Date.now()) {
      cache = fetchBaseCreentials();
    }
    return cache
  }

  return credentialsProvider;
}

const managedAuthConfigAdapter = createManagedAuthConfigAdapter({
  accountId: VITE_ACCOUNT_ID,
  region: VITE_REGION,
  credentialsProvider: createCredentialsProvider(),
  // onAuthStateChange: Auth.onAuthStateChanged
});

export default managedAuthConfigAdapter;