import { createStorageBrowser } from "@aws-amplify/ui-react-storage/browser"
import managedAuthAdapter from "../utils/s3ManagedAuthAdapter"

const { StorageBrowser } = createStorageBrowser({
  actions: {},
  config: managedAuthAdapter,
});

export default StorageBrowser;