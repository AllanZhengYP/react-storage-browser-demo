import { createStorageBrowser } from "@aws-amplify/ui-react-storage"
import managedAuthAdapter from "../utils/s3ManagedAuthAdapter"

const { StorageBrowser } = createStorageBrowser({
  config: managedAuthAdapter
}) as unknown as { StorageBrowser: () => React.JSX.Element; }

export default StorageBrowser;