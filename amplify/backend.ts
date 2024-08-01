import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { oidc } from './functions/oidc/resource';
import { data } from './data/resource';
import * as iam from 'aws-cdk-lib/aws-iam';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
  oidc,
});

backend.addOutput({
  storage: {
    aws_region: 'us-east-2',
    bucket_name: 'ashwin-portcullis-test1'
  },
});

backend.oidc.resources.lambda.addToRolePolicy(new iam.PolicyStatement({
  sid: 'PortcullisAssumeRolePolicy',
  effect: iam.Effect.ALLOW,
  actions: ['sts:AssumeRole', 'sts:SetContext'],
  resources: ['arn:aws:iam::325800432239:role/storage-browser-Identity-bearer-ashwin']
}));
backend.oidc.resources.lambda.addToRolePolicy(new iam.PolicyStatement({
  sid: 'PortcullisCreateTokenWithIAMPolicy',
  effect: iam.Effect.ALLOW,
  actions: ['sso-oauth:CreateTokenWithIAM'],
  resources: ['*']
}));
