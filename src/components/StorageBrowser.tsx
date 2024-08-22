import { createStorageBrowser, elementsDefault } from "@aws-amplify/ui-react-storage"
import managedAuthAdapter from "../utils/s3ManagedAuthAdapter"

const { StorageBrowser } = createStorageBrowser({
  config: managedAuthAdapter,
  elements: elementsDefault
});

export default StorageBrowser;