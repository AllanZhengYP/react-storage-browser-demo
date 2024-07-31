// amplify/storage/resource.ts
import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "testBucketGen2",
  access: (allow) => ({
    "public/*": [
      allow.guest.to(["read", "write", "delete"]),
      allow.authenticated.to(["write", "read", "delete"]),
    ],
    "protected/{entity_id}/*": [
      allow.authenticated.to(["read"]),
      allow.entity("identity").to(["read", "write", "delete"]),
    ],
    "private/{entity_id}/*": [
      allow.entity("identity").to(["read", "write", "delete"]),
    ],
  }),
});
