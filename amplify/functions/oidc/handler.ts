import { SSOOIDCClient, CreateTokenWithIAMCommand } from '@aws-sdk/client-sso-oidc';
import { AssumeRoleCommand, STSClient } from '@aws-sdk/client-sts';
import * as jwt from 'jsonwebtoken';

import type { Schema } from '../../data/resource';

// TODO: move to SM
const CLIENT_ID = 'arn:aws:sso::325800432239:application/ssoins-6684b7c55ac3a3fb/apl-6a825d35f6004a5b';
const GRANT_TYPE = 'urn:ietf:params:oauth:grant-type:jwt-bearer';
const BEARER_TOKEN_ROLE = 'arn:aws:iam::325800432239:role/storage-browser-Identity-bearer-ashwin'

export const handler: Schema['oidc']['functionHandler'] = async (event, context) => {
  console.log('idToken: ', event.arguments.idToken);
  const ssoClient = new SSOOIDCClient({});
  const { idToken } = await ssoClient.send(new CreateTokenWithIAMCommand({
    clientId: CLIENT_ID,
    grantType: GRANT_TYPE,
    assertion: event.arguments.idToken,
  }));
  const decodedIdToken = jwt.decode(idToken!)! as jwt.JwtPayload;
  console.log('new id token', decodedIdToken);
  const stsClient = new STSClient({ region: 'us-east-1' });
  const { Credentials } = await stsClient.send(new AssumeRoleCommand({
    RoleArn: BEARER_TOKEN_ROLE,
    RoleSessionName: 'react-storage-browser-demo-bearer-role',
    DurationSeconds: 900,
    ProvidedContexts: [{
      ProviderArn: 'arn:aws:iam::aws:contextProvider/IdentityCenter',
      ContextAssertion: decodedIdToken['sts:identity_context']
    }]
  }))
  return JSON.stringify(Credentials!);
};