import { createAmplifyAuthAdapter } from '@aws-amplify/ui-react-storage';
import { Amplify } from "aws-amplify";
import amplifyConfig from "../../amplify_outputs.json";

Amplify.configure(amplifyConfig);

const amplifyAuthAdapter = createAmplifyAuthAdapter({
  options: {
    defaultPrefixes: [
      'public',
      'protected',
      'private'
    ]
  }
})

export default amplifyAuthAdapter;