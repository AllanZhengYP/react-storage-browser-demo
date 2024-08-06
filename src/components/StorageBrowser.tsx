import { createStorageBrowser } from "@aws-amplify/ui-react-storage"
import amplifyAuthAdapter from "../utils/amplifyAuthAdapter"

const { StorageBrowser } = createStorageBrowser({
  config: amplifyAuthAdapter
}) as unknown as { StorageBrowser: () => React.JSX.Element; }

export default StorageBrowser;