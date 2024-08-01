import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { oidc } from "../functions/oidc/resource";

const oidcFnSchema = a.schema({
  oidc: a.query()
   .arguments({ idToken: a.string().required() })
   .returns(a.string())
   .handler(a.handler.function(oidc))
   .authorization(allow => [allow.publicApiKey()])
});

export type Schema = ClientSchema<typeof oidcFnSchema>;

export const data = defineData({
  schema: oidcFnSchema,
  authorizationModes: { defaultAuthorizationMode: 'apiKey', apiKeyAuthorizationMode: { expiresInDays: 365 }  },
  // functions: { oidc }
})
