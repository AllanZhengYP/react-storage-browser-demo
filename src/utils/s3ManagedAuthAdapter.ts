import { createManagedAuthAdapter } from '@aws-amplify/ui-react-storage/browser';
import { AwsCredentialIdentity } from '@aws-sdk/types';
import Auth from './AuthClass';
import { SSOOIDCClient, CreateTokenWithIAMCommand } from '@aws-sdk/client-sso-oidc';
import { AssumeRoleCommand, STSClient, AssumeRoleWithWebIdentityCommand, AssumeRoleWithWebIdentity } from '@aws-sdk/client-sts';
import { decode, JwtPayload } from 'jsonwebtoken';
import { custom } from '../../amplify_outputs.json';

const CLIENT_ID = 'arn:aws:sso::325800432239:application/ssoins-6684b7c55ac3a3fb/apl-6a825d35f6004a5b';
const GRANT_TYPE = 'urn:ietf:params:oauth:grant-type:jwt-bearer';
const BEARER_TOKEN_ROLE = 'arn:aws:iam::325800432239:role/storage-browser-Identity-bearer-ashwin'

interface CredentialsProviderOutput { 
  credentials: Required<Omit<AwsCredentialIdentity, 'accountId'|'credentialScope'>>;
}

const {
  VITE_ACCOUNT_ID,
  VITE_REGION
} = import.meta.env;

// const oidcClient = generateClient<Schema>();

const fetchBaseCredentials = async (): Promise<CredentialsProviderOutput> => {
  const { __raw } = await Auth.getIdToken({ forceRefresh: true });

  const stsClient = new STSClient({ region: VITE_REGION });

  const { Credentials: tempCredsFromWebToken} = await stsClient.send(new AssumeRoleWithWebIdentityCommand({
    RoleArn: custom.idcTokenRoleArn,
    RoleSessionName: 'react-storage-browser-demo-bearer-role',
    WebIdentityToken: __raw
  }));

  if (!tempCredsFromWebToken) {
    throw new Error('Empty credentials from AssumeRoleWithWebIdentity')
  }

  const ssoOidcClient = new SSOOIDCClient({ region: VITE_REGION, credentials: {
    accessKeyId: tempCredsFromWebToken.AccessKeyId!,
    secretAccessKey: tempCredsFromWebToken.SecretAccessKey!,
    sessionToken: tempCredsFromWebToken.SessionToken!,
    expiration: tempCredsFromWebToken.Expiration!
  }});

  const { idToken: idcInfusedIdToken } = await ssoOidcClient.send(new CreateTokenWithIAMCommand({
    clientId: CLIENT_ID,
    grantType: GRANT_TYPE,
    assertion: __raw
  }));

  const decodedIdToken = decode(idcInfusedIdToken!)! as JwtPayload;
  console.log('idcInfusedIdToken', decodedIdToken);

  const { Credentials: {
    AccessKeyId,
    SecretAccessKey,
    SessionToken,
    Expiration,
  } = {} } = await stsClient.send(new AssumeRoleCommand({
    RoleArn: BEARER_TOKEN_ROLE,
    RoleSessionName: 'react-storage-browser-demo-bearer-role',
    DurationSeconds: 900,
    ProvidedContexts: [{
      ProviderArn: 'arn:aws:iam::aws:contextProvider/IdentityCenter',
      ContextAssertion: decodedIdToken['sts:identity_context']
    }]
  }));

  const baseCreds = {
    accessKeyId: AccessKeyId!,
    secretAccessKey: SecretAccessKey!,
    sessionToken: SessionToken!,
    expiration: new Date(Expiration!)
  }
  return { credentials: baseCreds }
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