import { createStorageBrowser, elementsDefault } from "@aws-amplify/ui-react-storage/browser"
import managedAuthAdapter from "../utils/s3ManagedAuthAdapter"

const { StorageBrowser } = createStorageBrowser({
  actions: {},
  config: managedAuthAdapter,
  elements: elementsDefault
}) as any;
// TODO: this is a bug

export default StorageBrowser;