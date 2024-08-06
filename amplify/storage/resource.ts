
import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'AmplifyAuthManagedBucket',
  access: (allow) => {
    const accessRule = [
      allow.guest.to(['read']),
      allow.authenticated.to(['read', 'write', 'delete']),
    ];
    return {
      'public/*': accessRule,
      'protected/*': accessRule,
      'private/*': accessRule
    }
  }
});